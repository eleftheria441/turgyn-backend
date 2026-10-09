const express = require('express');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();
const ARRAYS = ['osi', 'houses', 'accounts', 'services', 'accruals', 'payments', 'providers', 'provInvoices', 'provPayments', 'requests'];

function sanitizeForClient(db, version) {
  const copy = JSON.parse(JSON.stringify(db));
  copy.users = (copy.users || []).map(u => ({ id: u.id, name: u.name, login: u.login, role: u.role, pos: u.pos, disabled: !!u.disabled }));
  copy._v = version;
  return copy;
}
function counts(db) {
  const c = {};
  ARRAYS.forEach(k => { c[k] = Array.isArray(db[k]) ? db[k].length : 0; });
  return c;
}

router.get('/', auth.requireStaff(), async (req, res) => {
  const s = await store.getState();
  if (!s) return res.status(404).json({ error: 'Нет данных' });
  res.json(sanitizeForClient(s.db, s.version));
});

/* Полная запись состояния с проверкой версии.
   Клиент обязан прислать _v — версию, которую он загрузил. Если за это время данные
   изменил кто-то другой, сервер отвечает 409 и клиент перезагружает актуальное состояние. */
router.post('/', auth.requireStaff(), async (req, res) => {
  const incoming = req.body;
  if (!incoming || !Array.isArray(incoming.osi)) return res.status(400).json({ error: 'Некорректное тело запроса' });
  const expected = Number.isInteger(incoming._v) ? incoming._v : null;
  if (expected === null) return res.status(400).json({ error: 'Не указана версия данных. Обновите страницу.' });
  delete incoming._v;
  for (const k of ARRAYS) if (incoming[k] !== undefined && !Array.isArray(incoming[k])) return res.status(400).json({ error: 'Некорректное поле ' + k });

  const current = await store.getDB();
  const prevUsers = (current && current.users) || [];
  const prevById = {};
  prevUsers.forEach(u => { prevById[u.id] = u; });

  const isDirector = req.user.role === 'director';
  const newPasswords = [];
  if (!isDirector) {
    // Только директор управляет сотрудниками: остальным изменения в списке пользователей не применяются
    incoming.users = prevUsers;
  } else {
    incoming.users = (incoming.users || []).map(u => {
      const prev = prevById[u.id];
      const merged = { id: u.id, name: u.name, login: u.login, role: u.role, pos: u.pos };
      if (u.disabled) merged.disabled = true;
      if (u.pass) {
        merged.passHash = auth.hashPassword(u.pass);
        merged.mustChangePassword = true; // пароль задан директором — сотрудник сменит его при первом входе
        newPasswords.push(u.login);
      } else if (prev && prev.passHash) {
        merged.passHash = prev.passHash;
        if (prev.mustChangePassword) merged.mustChangePassword = true;
      }
      return merged;
    });
    if (incoming.users.some(u => !u.passHash)) return res.status(400).json({ error: 'У нового сотрудника должен быть пароль' });
    const logins = incoming.users.map(u => u.login);
    if (new Set(logins).size !== logins.length) return res.status(400).json({ error: 'Логины сотрудников должны быть уникальны' });
    if (!incoming.users.some(u => u.role === 'director' && !u.disabled)) return res.status(400).json({ error: 'В системе должен остаться хотя бы один директор' });
  }

  try {
    const version = await store.saveDB(incoming, expected, req.user.login);
    const removed = prevUsers.filter(p => !incoming.users.find(u => u.id === p.id)).map(u => u.login);
    await store.audit(req.user.login, 'state_saved', { version, counts: counts(incoming), passwordsSet: newPasswords, usersRemoved: removed });
    res.json({ ok: true, version, savedAt: Date.now() });
  } catch (e) {
    if (e.conflict) return res.status(409).json({ error: 'Данные изменил другой пользователь. Загружаю актуальную версию.', version: e.current });
    throw e;
  }
});

/* Журнал действий — только директору */
router.get('/audit', auth.requireStaff(['director']), async (req, res) => {
  res.json({ items: await store.getAudit(Math.min(parseInt(req.query.limit || '200', 10), 1000)) });
});

/* Выгрузка полной резервной копии — только директору */
router.get('/export', auth.requireStaff(['director']), async (req, res) => {
  const s = await store.getState();
  const copy = JSON.parse(JSON.stringify(s.db));
  copy.users = (copy.users || []).map(u => ({ id: u.id, name: u.name, login: u.login, role: u.role, pos: u.pos }));
  await store.audit(req.user.login, 'export', null);
  res.set('Content-Disposition', 'attachment; filename="turgyn-backup-' + new Date().toISOString().slice(0, 10) + '.json"');
  res.json(copy);
});

module.exports = router;
