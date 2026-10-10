const express = require('express');
const crypto = require('crypto');
const store = require('../store');
const auth = require('../auth');
const { uid } = require('../seedData');

const router = express.Router();

const codeLimiter = auth.rateLimit({ windowMs: 60 * 60 * 1000, max: 10, key: (req) => req.ip, message: 'Слишком много запросов кода. Попробуйте через час.' });
const requestLimiter = auth.rateLimit({ windowMs: 60 * 60 * 1000, max: 20, key: (req) => req.ip, message: 'Слишком много заявок. Попробуйте позже.' });

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
const ALLOW_DEV_CODES = process.env.ALLOW_DEV_CODES === 'true';

async function smsSendCode(phone, code) {
  if (SMS_PROVIDER === 'console') {
    if (!ALLOW_DEV_CODES) {
      // Без SMS-шлюза вход жителей закрыт: иначе код уходил бы в ответе API,
      // и любой, кто знает номер телефона жителя, мог бы войти в его кабинет.
      const e = new Error('SMS-шлюз не подключён'); e.notConfigured = true; throw e;
    }
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


/* --- шаг 1: запросить код --- */

router.post('/request-code', codeLimiter, async (req, res) => {
  const db = { accounts: await store.getAll('accounts'), osi: await store.getAll('osi') };

  const phone = normPhone((req.body || {}).phone);
  if (phone.length < 10) return res.status(400).json({ error: 'Укажите номер телефона' });

  const matches = accountsByPhone(db, phone);
  if (!matches.length) {
    return res.status(404).json({ error: 'Номер не найден. Обратитесь в УК, чтобы привязать телефон к лицевому счёту.' });
  }

  const prev = await store.getCode(phone);
  if (prev && Date.now() - prev.sentAt < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - prev.sentAt)) / 1000);
    return res.status(429).json({ error: 'Код уже отправлен. Повторить можно через ' + wait + ' сек.', retryAfter: wait });
  }

  const code = genCode();
  let delivery;
  try {
    delivery = await smsSendCode(phone, code);
  } catch (e) {
    if (e.notConfigured) return res.status(503).json({ error: 'Вход в приложение жителя пока не подключён. Обратитесь в управляющую компанию.' });
    console.error('Ошибка отправки SMS:', e.message);
    return res.status(502).json({ error: 'Не удалось отправить SMS. Попробуйте позже или обратитесь в УК.' });
  }

  await store.setCode(phone, {
    hash: hashCode(code),
    expires: Date.now() + CODE_TTL_MS,
    attempts: 0,
    sentAt: Date.now(),
    accountIds: matches.map(a => a.id)
  });

  const out = { ok: true, ttl: Math.round(CODE_TTL_MS / 1000), accounts: matches.length };
  // Только когда шлюз не подключён (dev/демо) — иначе код никогда не покидает сервер.
  if (delivery.exposeCode) { out.devCode = code; out.devNote = 'SMS-шлюз не подключён: код показан для теста'; }
  res.json(out);
});

/* --- шаг 2: проверить код --- */

router.post('/verify-code', codeLimiter, async (req, res) => {
  const db = { accounts: await store.getAll('accounts'), osi: await store.getAll('osi') };

  const phone = normPhone((req.body || {}).phone);
  const code = String((req.body || {}).code || '').replace(/\D/g, '');
  const accountId = (req.body || {}).accountId || null;

  const rec = await store.getCode(phone);
  if (!rec) return res.status(400).json({ error: 'Код истёк или не запрашивался. Запросите новый.' });

  if (rec.attempts >= MAX_ATTEMPTS) {
    await store.deleteCode(phone);
    return res.status(429).json({ error: 'Слишком много попыток. Запросите новый код.' });
  }

  if (!safeEqual(hashCode(code), rec.hash)) {
    rec.attempts += 1;
    await store.setCode(phone, rec);
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

  await store.deleteCode(phone);

  const token = await auth.createSession({ type: 'resident', accountId: account.id, osiId: account.osiId });
  res.json({ token });
});

router.post('/logout', auth.requireResident(), async (req, res) => {
  await auth.destroySession(req.token);
  res.json({ ok: true });
});

router.get('/me', auth.requireResident(), async (req, res) => {
  const accId = req.session.accountId;
  const account = await store.getById('accounts', accId);
  if (!account) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  const osi = await store.getById('osi', account.osiId);
  res.json({
    account,
    osi,
    services: await store.getByOsi('services', account.osiId),
    accruals: await store.getByAccount('accruals', accId),
    payments: await store.getByAccount('payments', accId),
    requests: await store.getByAccount('requests', accId)
  });
});

router.post('/pay', auth.requireResident(), async (req, res) => {
  // Отметка «оплачено» без реального платежа недопустима: житель мог бы сам погасить себе долг.
  // Оплата появится вместе с интеграцией эквайринга (Kaspi Pay / Halyk) — платёж будет фиксироваться
  // только по подтверждению банка.
  res.status(501).json({ error: 'Онлайн-оплата пока не подключена. Оплатите по реквизитам в квитанции.' });
});

router.post('/request', auth.requireResident(), requestLimiter, async (req, res) => {
  const accId = req.session.accountId;
  const topic = String((req.body || {}).topic || '').trim().slice(0, 1000);
  if (!topic) return res.status(400).json({ error: 'Опишите проблему' });
  const account = await store.getById('accounts', accId);
  if (!account) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  const request = { id: uid('req'), osiId: account.osiId, accountId: accId, topic, assignee: '—', status: 'new', date: new Date().toISOString().slice(0, 10), source: 'app' };
  await store.insertOne('requests', request, 'resident:' + accId);
  res.json({ ok: true, request });
});

module.exports = router;
