const express = require('express');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { login, password } = req.body || {};
  if (!login || !password) return res.status(400).json({ error: 'Укажите логин и пароль' });
  const db = await store.getDB();
  if (!db) return res.status(500).json({ error: 'База данных ещё не инициализирована' });
  const user = db.users.find(u => u.login === login);
  if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });

  let ok = false;
  if (user.passHash) {
    ok = auth.verifyPassword(password, user.passHash);
  } else if (user.pass) {
    // авто-миграция со старого формата (открытый пароль из localStorage-версии)
    ok = user.pass === password;
    if (ok) { user.passHash = auth.hashPassword(password); delete user.pass; await store.saveDB(db); }
  }
  if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль' });

  const token = await auth.createSession({ type: 'staff', userId: user.id });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role, pos: user.pos, login: user.login } });
});

router.post('/logout', auth.requireStaff(), async (req, res) => {
  await auth.destroySession(req.token);
  res.json({ ok: true });
});

router.get('/me', auth.requireStaff(), async (req, res) => {
  const db = await store.getDB();
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json({ user: { id: user.id, name: user.name, role: user.role, pos: user.pos, login: user.login } });
});

module.exports = router;
