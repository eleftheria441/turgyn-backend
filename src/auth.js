const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const store = require('./store');

function hashPassword(pw) {
  return bcrypt.hashSync(String(pw), 10);
}
function verifyPassword(pw, hash) {
  try { return bcrypt.compareSync(String(pw), String(hash)); } catch (e) { return false; }
}
function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function createSession(payload) {
  const sessions = await store.getSessions();
  const token = makeToken();
  sessions[token] = { ...payload, createdAt: Date.now() };
  await store.saveSessions(sessions);
  return token;
}
async function getSession(token) {
  if (!token) return null;
  const sessions = await store.getSessions();
  return sessions[token] || null;
}
async function destroySession(token) {
  const sessions = await store.getSessions();
  delete sessions[token];
  await store.saveSessions(sessions);
}
function tokenFromReq(req) {
  const h = req.headers['authorization'] || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : (req.query.token || null);
}

function requireStaff() {
  return async (req, res, next) => {
    const token = tokenFromReq(req);
    const sess = await getSession(token);
    if (!sess || sess.type !== 'staff') return res.status(401).json({ error: 'Требуется вход в систему' });
    req.session = sess; req.token = token;
    next();
  };
}
function requireResident() {
  return async (req, res, next) => {
    const token = tokenFromReq(req);
    const sess = await getSession(token);
    if (!sess || sess.type !== 'resident') return res.status(401).json({ error: 'Требуется вход в приложение' });
    req.session = sess; req.token = token;
    next();
  };
}

module.exports = { hashPassword, verifyPassword, createSession, getSession, destroySession, requireStaff, requireResident };
