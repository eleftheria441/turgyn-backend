const express = require('express');
const crypto = require('crypto');
const store = require('../store');
const auth = require('../auth');
const { uid } = require('../seedData');

const router = express.Router();

/* Отправка SMS с подключаемым провайдером.

   Пока SMS_PROVIDER не задан (или = 'console'), коды никуда не уходят —
   они пишутся в лог сервера и возвращаются в ответе API. Это режим для
   разработки и демо: можно тестировать вход, не подключая платный шлюз.

   Когда будет договор с оператором, достаточно задать переменные окружения
   (SMS_PROVIDER=mobizon, SMS_API_KEY=...) — код приложения менять не нужно.
*/

const SMS_PROVIDER = (process.env.SMS_PROVIDER || 'console').toLowerCase();
const SMS_API_KEY = process.env.SMS_API_KEY || '';
const SMS_SENDER = process.env.SMS_SENDER || 'Turgyn';


function messageText(code) {
  return 'Turgyn: код для входа ' + code + '. Никому его не сообщайте.';
}

async function sendViaMobizon(phone, code) {
  // Mobizon (mobizon.kz) — популярный шлюз в Казахстане.
  const url = 'https://api.mobizon.kz/service/message/sendSmsMessage' +
    '?apiKey=' + encodeURIComponent(SMS_API_KEY) +
    '&recipient=' + encodeURIComponent(phone) +
    '&text=' + encodeURIComponent(messageText(code)) +
    '&from=' + encodeURIComponent(SMS_SENDER);
  const r = await fetch(url, { method: 'POST' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.code !== 0) {
    throw new Error('Шлюз SMS вернул ошибку: ' + (data.message || r.status));
  }
  return true;
}

async function sendViaSmsc(phone, code) {
  // SMSC.kz — альтернативный шлюз. SMS_API_KEY здесь в формате "логин:пароль".
  const [login, password] = String(SMS_API_KEY).split(':');
  const url = 'https://smsc.kz/sys/send.php?fmt=3' +
    '&login=' + encodeURIComponent(login || '') +
    '&psw=' + encodeURIComponent(password || '') +
    '&phones=' + encodeURIComponent(phone) +
    '&mes=' + encodeURIComponent(messageText(code)) +
    '&sender=' + encodeURIComponent(SMS_SENDER);
  const r = await fetch(url);
  const data = await r.json().catch(() => ({}));
  if (data.error) throw new Error('Шлюз SMS вернул ошибку: ' + data.error);
  return true;
}

/* Отправить код. Возвращает { sent, exposeCode }.
   Если шлюз не настроен — не считаем это ошибкой входа: код виден в логах. */
async function smsSendCode(phone, code) {
  if (SMS_PROVIDER === 'console') {
    console.log('[SMS/dev] ' + phone + ' → код ' + code + ' (шлюз не подключён, см. SMS_PROVIDER)');
    return { sent: false, exposeCode: true };
  }
  if (!SMS_API_KEY) throw new Error('SMS_PROVIDER задан, но SMS_API_KEY пуст');

  if (SMS_PROVIDER === 'mobizon') await sendViaMobizon(phone, code);
  else if (SMS_PROVIDER === 'smsc') await sendViaSmsc(phone, code);
  else throw new Error('Неизвестный SMS_PROVIDER: ' + SMS_PROVIDER);

  return { sent: true, exposeCode: false };
}



const CODE_TTL_MS = 5 * 60 * 1000;       // код живёт 5 минут
const RESEND_COOLDOWN_MS = 60 * 1000;    // повторная отправка не чаще раза в минуту
const MAX_ATTEMPTS = 5;                  // попыток ввода на один код

/* --- вспомогательные --- */

function normPhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 11 && (d[0] === '8' || d[0] === '7')) d = '7' + d.slice(1);
  return d;
}

/* Ищем ВСЕ лицевые счета, привязанные к этому номеру.
   Вход только по телефону: по номеру квартиры или ЛС войти нельзя —
   иначе код ушёл бы владельцу, а зайти мог бы кто угодно. */
function accountsByPhone(db, phone) {
  const p = normPhone(phone);
  if (p.length < 10) return [];
  return db.accounts.filter(a => {
    const ph = normPhone(a.phone);
    return ph.length >= 10 && ph.slice(-10) === p.slice(-10);
  });
}

function genCode() {
  return String(crypto.randomInt(100000, 1000000)); // ровно 6 цифр
}
function hashCode(code) {
  return crypto.createHash('sha256').update(String(code)).digest('hex');
}
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/* Чистим протухшие коды, чтобы файл не рос бесконечно */
function pruneCodes(codes) {
  const now = Date.now();
  Object.keys(codes).forEach(k => { if (!codes[k] || codes[k].expires < now) delete codes[k]; });
  return codes;
}

/* --- шаг 1: запросить код --- */

router.post('/request-code', async (req, res) => {
  const db = await store.getDB();
  if (!db) return res.status(500).json({ error: 'База данных ещё не инициализирована' });

  const phone = normPhone((req.body || {}).phone);
  if (phone.length < 10) return res.status(400).json({ error: 'Укажите номер телефона' });

  const matches = accountsByPhone(db, phone);
  if (!matches.length) {
    return res.status(404).json({ error: 'Номер не найден. Обратитесь в УК, чтобы привязать телефон к лицевому счёту.' });
  }

  const codes = pruneCodes(await store.getCodes());
  const prev = codes[phone];
  if (prev && Date.now() - prev.sentAt < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - prev.sentAt)) / 1000);
    return res.status(429).json({ error: 'Код уже отправлен. Повторить можно через ' + wait + ' сек.', retryAfter: wait });
  }

  const code = genCode();
  codes[phone] = {
    hash: hashCode(code),
    expires: Date.now() + CODE_TTL_MS,
    attempts: 0,
    sentAt: Date.now(),
    accountIds: matches.map(a => a.id)
  };
  await store.saveCodes(codes);

  let delivery;
  try {
    delivery = await smsSendCode(phone, code);
  } catch (e) {
    console.error('Ошибка отправки SMS:', e.message);
    return res.status(502).json({ error: 'Не удалось отправить SMS. Попробуйте позже или обратитесь в УК.' });
  }

  const out = { ok: true, ttl: Math.round(CODE_TTL_MS / 1000), accounts: matches.length };
  // Только когда шлюз не подключён (dev/демо) — иначе код никогда не покидает сервер.
  if (delivery.exposeCode) { out.devCode = code; out.devNote = 'SMS-шлюз не подключён: код показан для теста'; }
  res.json(out);
});

/* --- шаг 2: проверить код --- */

router.post('/verify-code', async (req, res) => {
  const db = await store.getDB();
  if (!db) return res.status(500).json({ error: 'База данных ещё не инициализирована' });

  const phone = normPhone((req.body || {}).phone);
  const code = String((req.body || {}).code || '').replace(/\D/g, '');
  const accountId = (req.body || {}).accountId || null;

  const codes = pruneCodes(await store.getCodes());
  const rec = codes[phone];
  if (!rec) return res.status(400).json({ error: 'Код истёк или не запрашивался. Запросите новый.' });

  if (rec.attempts >= MAX_ATTEMPTS) {
    delete codes[phone]; await store.saveCodes(codes);
    return res.status(429).json({ error: 'Слишком много попыток. Запросите новый код.' });
  }

  if (!safeEqual(hashCode(code), rec.hash)) {
    rec.attempts += 1;
    await store.saveCodes(codes);
    const left = MAX_ATTEMPTS - rec.attempts;
    return res.status(401).json({ error: 'Неверный код' + (left > 0 ? '. Осталось попыток: ' + left : '') });
  }

  // Код верный. Если на номере несколько квартир — просим выбрать, код при этом не сжигаем.
  const allowed = rec.accountIds || [];
  if (!accountId) {
    if (allowed.length > 1) {
      const matches = allowed.map(id => db.accounts.find(a => a.id === id)).filter(Boolean).map(a => ({
        id: a.id, apt: a.apt, ls: a.ls, owner: a.owner,
        osiName: (db.osi.find(o => o.id === a.osiId) || {}).name || ''
      }));
      return res.json({ matches });
    }
  }

  const chosen = accountId || allowed[0];
  // Пускаем строго в те ЛС, которые были привязаны к номеру в момент запроса кода.
  if (!allowed.includes(chosen)) return res.status(403).json({ error: 'Этот лицевой счёт не привязан к номеру' });

  const account = db.accounts.find(a => a.id === chosen);
  if (!account) return res.status(404).json({ error: 'Лицевой счёт не найден' });

  delete codes[phone];
  await store.saveCodes(codes);

  const token = await auth.createSession({ type: 'resident', accountId: account.id, osiId: account.osiId });
  res.json({ token });
});

router.post('/logout', auth.requireResident(), async (req, res) => {
  await auth.destroySession(req.token);
  res.json({ ok: true });
});

router.get('/me', auth.requireResident(), async (req, res) => {
  const db = await store.getDB();
  const accId = req.session.accountId;
  const account = db.accounts.find(a => a.id === accId);
  if (!account) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  const osi = db.osi.find(o => o.id === account.osiId) || null;
  res.json({
    account,
    osi,
    services: db.services.filter(s => s.osiId === account.osiId),
    accruals: db.accruals.filter(a => a.accountId === accId),
    payments: db.payments.filter(p => p.accountId === accId),
    requests: db.requests.filter(r => r.accountId === accId)
  });
});

router.post('/pay', auth.requireResident(), async (req, res) => {
  const db = await store.getDB();
  const accId = req.session.accountId;
  const account = db.accounts.find(a => a.id === accId);
  if (!account) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  const amount = parseFloat((req.body || {}).amount) || 0;
  if (amount <= 0) return res.status(400).json({ error: 'Некорректная сумма' });

  const periods = [...new Set(db.accruals.filter(a => a.accountId === accId).map(a => a.period))].sort().reverse();
  const period = periods[0] || new Date().toISOString().slice(0, 7);
  const payment = { id: uid('pay'), osiId: account.osiId, accountId: accId, period, amount, method: 'kaspi', date: new Date().toISOString().slice(0, 10) };
  db.payments.push(payment);
  await store.saveDB(db);
  res.json({ ok: true, payment });
});

router.post('/request', auth.requireResident(), async (req, res) => {
  const db = await store.getDB();
  const accId = req.session.accountId;
  const account = db.accounts.find(a => a.id === accId);
  if (!account) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  const topic = String((req.body || {}).topic || '').trim();
  if (!topic) return res.status(400).json({ error: 'Опишите проблему' });

  const request = { id: uid('req'), osiId: account.osiId, accountId: accId, topic, assignee: '—', status: 'new', date: new Date().toISOString().slice(0, 10) };
  db.requests.push(request);
  await store.saveDB(db);
  res.json({ ok: true, request });
});

module.exports = router;
