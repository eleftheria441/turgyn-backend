const express = require('express');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();

function sanitizeForClient(db) {
  const copy = JSON.parse(JSON.stringify(db));
  copy.users = (copy.users || []).map(u => ({ id: u.id, name: u.name, login: u.login, role: u.role, pos: u.pos }));
  return copy;
}

router.get('/', auth.requireStaff(), async (req, res) => {
  const db = await store.getDB();
  if (!db) return res.status(404).json({ error: 'Нет данных' });
  res.json(sanitizeForClient(db));
});

// Полная перезапись состояния (та же модель, что и localStorage save() в клиенте).
// Пароли сотрудников никогда не принимаются от клиента как есть — только хэшируются при явной смене.
router.post('/', auth.requireStaff(), async (req, res) => {
  const incoming = req.body;
  if (!incoming || !Array.isArray(incoming.osi)) return res.status(400).json({ error: 'Некорректное тело запроса' });

  const current = await store.getDB();
  const prevUsersById = {};
  (current && current.users || []).forEach(u => { prevUsersById[u.id] = u; });

  incoming.users = (incoming.users || []).map(u => {
    const prev = prevUsersById[u.id];
    const merged = { id: u.id, name: u.name, login: u.login, role: u.role, pos: u.pos };
    if (u.pass) {
      // клиент прислал новый/изменённый пароль (создание или смена в разделе "Сотрудники") — хэшируем
      merged.passHash = auth.hashPassword(u.pass);
    } else if (prev && prev.passHash) {
      merged.passHash = prev.passHash;
    } else {
      // новый сотрудник без пароля — временный пароль по умолчанию, попросить сменить
      merged.passHash = auth.hashPassword('turgyn123');
    }
    return merged;
  });

  await store.saveDB(incoming);
  res.json({ ok: true, savedAt: Date.now() });
});

module.exports = router;
