const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const store = require('./store');

const STAFF_SESSION_DAYS = parseFloat(process.env.STAFF_SESSION_DAYS || '14');
const RESIDENT_SESSION_DAYS = parseFloat(process.env.RESIDENT_SESSION_DAYS || '60');

function hashPassword(pw) {
  return bcrypt.hashSync(String(pw), 10);
}
function verifyPassword(pw, hash) {
  try { return bcrypt.compareSync(String(pw), String(hash)); } catch (e) { return false; }
}
function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}
function randomPassword() {
  // 14 символов без похожих букв: удобно продиктовать и переписать
  const abc = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 14; i++) s += abc[crypto.randomInt(0, abc.length)];
  return s;
}

async function createSession(payload) {
  const token = makeToken();
  const days = payload.type === 'resident' ? RESIDENT_SESSION_DAYS : STAFF_SESSION_DAYS;
  await store.createSession(token, payload, Math.round(days * 86400000));
  return token;
}
const getSession = (token) => token ? store.getSession(token) : null;
const destroySession = (token) => store.destroySession(token);

function tokenFromReq(req) {
  const h = req.headers['authorization'] || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null; // токен только из заголовка: в URL он попадает в логи и историю браузера
}

function requireStaff(roles) {
  return async (req, res, next) => {
    try {
      const token = tokenFromReq(req);
      const sess = await getSession(token);
      if (!sess || sess.type !== 'staff') return res.status(401).json({ error: 'Требуется вход в систему' });
      const row = await store.getUserById(sess.userId);
      const user = row && { id: row.id, login: row.login, name: row.name, role: row.role, pos: row.pos, passHash: row.pass_hash, mustChangePassword: row.must_change, disabled: row.disabled };
      if (!user || user.disabled) return res.status(401).json({ error: 'Учётная запись недоступна' });
      if (roles && !roles.includes(user.role)) return res.status(403).json({ error: 'Недостаточно прав' });
      req.session = sess; req.token = token; req.user = user;
      next();
    } catch (e) { next(e); }
  };
}
function requireResident() {
  return async (req, res, next) => {
    try {
      const token = tokenFromReq(req);
      const sess = await getSession(token);
      if (!sess || sess.type !== 'resident') return res.status(401).json({ error: 'Требуется вход в приложение' });
      req.session = sess; req.token = token;
      next();
    } catch (e) { next(e); }
  };
}

/* Простое ограничение частоты запросов в памяти процесса (достаточно для одного экземпляра сервера). */
function rateLimit({ windowMs, max, key, message }) {
  const hits = new Map();
  setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (v.reset < now) hits.delete(k); }, 60000).unref();
  return (req, res, next) => {
    const k = key(req);
    const now = Date.now();
    let h = hits.get(k);
    if (!h || h.reset < now) { h = { n: 0, reset: now + windowMs }; hits.set(k, h); }
    h.n += 1;
    if (h.n > max) {
      res.set('Retry-After', String(Math.ceil((h.reset - now) / 1000)));
      return res.status(429).json({ error: message || 'Слишком много попыток. Попробуйте позже.' });
    }
    next();
  };
}

module.exports = { hashPassword, verifyPassword, randomPassword, createSession, getSession, destroySession, requireStaff, requireResident, rateLimit };
