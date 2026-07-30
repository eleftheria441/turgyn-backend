/* Отправка SMS с подключаемым провайдером.

   Пока SMS_PROVIDER не задан (или = 'console'), коды никуда не уходят —
   они пишутся в лог сервера и возвращаются в ответе API. Это режим для
   разработки и демо: можно тестировать вход, не подключая платный шлюз.

   Когда будет договор с оператором, достаточно задать переменные окружения
   (SMS_PROVIDER=mobizon, SMS_API_KEY=...) — код приложения менять не нужно.
*/

const PROVIDER = (process.env.SMS_PROVIDER || 'console').toLowerCase();
const API_KEY = process.env.SMS_API_KEY || '';
const SENDER = process.env.SMS_SENDER || 'Turgyn';

// В dev-режиме код возвращается прямо в ответе API, чтобы можно было войти без SMS.
// В проде это недопустимо — код должен приходить только на телефон.
const EXPOSE_CODE = PROVIDER === 'console';

function messageText(code) {
  return 'Turgyn: код для входа ' + code + '. Никому его не сообщайте.';
}

async function sendViaMobizon(phone, code) {
  // Mobizon (mobizon.kz) — популярный шлюз в Казахстане.
  const url = 'https://api.mobizon.kz/service/message/sendSmsMessage' +
    '?apiKey=' + encodeURIComponent(API_KEY) +
    '&recipient=' + encodeURIComponent(phone) +
    '&text=' + encodeURIComponent(messageText(code)) +
    '&from=' + encodeURIComponent(SENDER);
  const r = await fetch(url, { method: 'POST' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.code !== 0) {
    throw new Error('Шлюз SMS вернул ошибку: ' + (data.message || r.status));
  }
  return true;
}

async function sendViaSmsc(phone, code) {
  // SMSC.kz — альтернативный шлюз. SMS_API_KEY здесь в формате "логин:пароль".
  const [login, password] = String(API_KEY).split(':');
  const url = 'https://smsc.kz/sys/send.php?fmt=3' +
    '&login=' + encodeURIComponent(login || '') +
    '&psw=' + encodeURIComponent(password || '') +
    '&phones=' + encodeURIComponent(phone) +
    '&mes=' + encodeURIComponent(messageText(code)) +
    '&sender=' + encodeURIComponent(SENDER);
  const r = await fetch(url);
  const data = await r.json().catch(() => ({}));
  if (data.error) throw new Error('Шлюз SMS вернул ошибку: ' + data.error);
  return true;
}

/* Отправить код. Возвращает { sent, exposeCode }.
   Если шлюз не настроен — не считаем это ошибкой входа: код виден в логах. */
async function sendCode(phone, code) {
  if (PROVIDER === 'console') {
    console.log('[SMS/dev] ' + phone + ' → код ' + code + ' (шлюз не подключён, см. SMS_PROVIDER)');
    return { sent: false, exposeCode: true };
  }
  if (!API_KEY) throw new Error('SMS_PROVIDER задан, но SMS_API_KEY пуст');

  if (PROVIDER === 'mobizon') await sendViaMobizon(phone, code);
  else if (PROVIDER === 'smsc') await sendViaSmsc(phone, code);
  else throw new Error('Неизвестный SMS_PROVIDER: ' + PROVIDER);

  return { sent: true, exposeCode: false };
}

module.exports = { sendCode, PROVIDER, EXPOSE_CODE };
