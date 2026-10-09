const express = require('express');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();

const loginLimiter = auth.rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  key: (req) => req.ip + '|' + String((req.body || {}).login || '').toLowerCase(),
  message: 'Слишком много попыток входа. Подождите 15 минут.'
});

function publicUser(u) {
  return { id: u.id, name: u.name, role: u.role, pos: u.pos, login: u.login, mustChangePassword: !!u.mustChangePassword };
}

router.post('/login', loginLimiter, async (req, res) => {
  const { login, password } = req.body || {};
  if (!login || !password) return res.status(400).json({ error: 'Укажите логин и пароль' });
  const db = await store.getDB();
  if (!db) return res.status(500).json({ error: 'База данных ещё не инициализирована' });
  const user = (db.users || []).find(u => u.login === login);

  const ok = !!(user && !user.disabled && user.passHash && auth.verifyPassword(password, user.passHash));
  if (!ok) {
    await store.audit(String(login).slice(0, 64), 'login_failed', { ip: req.ip });
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  }

  const token = await auth.createSession({ type: 'staff', userId: user.id });
  await store.audit(user.login, 'login', { ip: req.ip });
  res.json({ token, user: publicUser(user) });
});

router.post('/logout', auth.requireStaff(), async (req, res) => {
  await auth.destroySession(req.token);
  res.json({ ok: true });
});

router.get('/me', auth.requireStaff(), async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

/* Смена собственного пароля */
router.post('/password', auth.requireStaff(), async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!auth.verifyPassword(oldPassword || '', req.user.passHash)) return res.status(400).json({ error: 'Текущий пароль указан неверно' });
  if (!newPassword || String(newPassword).length < 10) return res.status(400).json({ error: 'Новый пароль — не короче 10 символов' });
  await store.updateDB((db) => {
    const u = db.users.find(x => x.id === req.user.id);
    u.passHash = auth.hashPassword(newPassword);
    delete u.mustChangePassword;
  }, req.user.login);
  await store.destroyUserSessions(req.user.id);
  const token = await auth.createSession({ type: 'staff', userId: req.user.id });
  await store.audit(req.user.login, 'password_changed', null);
  res.json({ ok: true, token });
});

module.exports = router;
