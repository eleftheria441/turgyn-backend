const express = require('express');
const store = require('../store');
const auth = require('../auth');
const { uid } = require('../seedData');

const router = express.Router();

function findAccounts(db, query) {
  const q = String(query || '').trim();
  const digits = q.replace(/\D/g, '');
  return db.accounts.filter(a => {
    const ph = (a.phone || '').replace(/\D/g, '');
    return (digits.length >= 4 && ph.indexOf(digits) >= 0) ||
      String(a.ls || '').trim() === q || String(a.apt || '').trim() === q;
  });
}

router.post('/login', async (req, res) => {
  const db = await store.getDB();
  if (!db) return res.status(500).json({ error: 'База данных ещё не инициализирована' });
  const { query, accountId } = req.body || {};

  let account = null;
  if (accountId) {
    account = db.accounts.find(a => a.id === accountId);
    if (!account) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  } else {
    const matches = findAccounts(db, query);
    if (!matches.length) return res.status(404).json({ error: 'Не найдено. Проверьте номер или обратитесь в УК.' });
    if (matches.length > 1) {
      return res.json({ matches: matches.map(a => ({
        id: a.id, apt: a.apt, owner: a.owner, osiName: (db.osi.find(o => o.id === a.osiId) || {}).name || ''
      })) });
    }
    account = matches[0];
  }

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
