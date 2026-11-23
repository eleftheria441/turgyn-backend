/* API мобильного приложения для сотрудников УК (председатель, бухгалтер, диспетчер).
   Отдаёт уже посчитанные сводки, чтобы телефону не нужно было скачивать всю базу. */
const express = require('express');
const crypto = require('crypto');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();
const r2 = n => Math.round((n || 0) * 100) / 100;
const INVITE_DAYS = 14;

function curPeriod() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }

/* Баланс каждого лицевого счёта ОСИ: входящее сальдо + начисления − оплаты.
   Плюс — сколько месяцев подряд нет оплаты и когда была последняя. */
async function osiAccounts(osiId) {
  const [accs, acr, pay] = await Promise.all([
    store.getByOsi('accounts', osiId), store.getByOsi('accruals', osiId), store.getByOsi('payments', osiId)
  ]);
  const m = {};
  accs.forEach(a => { m[a.id] = { a, acr: 0, pay: 0, lastPay: null, monthAcr: {} }; });
  acr.forEach(x => { const r = m[x.accountId]; if (!r) return; r.acr += +x.amount || 0; if (x.period) r.monthAcr[x.period] = (r.monthAcr[x.period] || 0) + (+x.amount || 0); });
  pay.forEach(x => { const r = m[x.accountId]; if (!r) return; r.pay += +x.amount || 0; const d = x.date || x.period; if ((+x.amount || 0) > 0 && d && (!r.lastPay || d > r.lastPay)) r.lastPay = d; });
  return Object.values(m).map(({ a, acr, pay, lastPay, monthAcr }) => {
    const balance = r2((+a.saldoStart || 0) + acr - pay);
    // долг в месяцах: на сколько последних начислений хватает долга
    let months = 0;
    if (balance > 0) {
      let left = balance;
      for (const p of Object.keys(monthAcr).sort().reverse()) { if (monthAcr[p] <= 0) continue; if (left <= 0.01) break; left -= monthAcr[p]; months++; }
      if (left > 0.01) months++;
    }
    return { id: a.id, apt: a.apt, ls: a.ls, owner: a.owner, phone: a.phone || '', area: a.area, balance, months, lastPay,
      otherPayers: a.otherPayers || [] };
  }).sort((x, y) => (parseInt(x.apt, 10) || 1e9) - (parseInt(y.apt, 10) || 1e9) || String(x.apt).localeCompare(String(y.apt)));
}

/* Сводка: по каждому дому — квартиры, общий долг, должники; открытые заявки */
router.get('/summary', auth.requireStaff(), async (req, res) => {
  const osi = await store.getAll('osi');
  const reqs = await store.getAll('requests');
  const houses = [];
  for (const o of osi) {
    const accs = await osiAccounts(o.id);
    const debtors = accs.filter(a => a.balance > 0.01);
    houses.push({
      id: o.id, name: o.name, address: o.address || '', chairman: o.chairman || '',
      apts: accs.length, debt: r2(debtors.reduce((s, a) => s + a.balance, 0)),
      debtors: debtors.length, bigDebtors: debtors.filter(a => a.months >= 3).length,
      openReq: reqs.filter(r => r.osiId === o.id && r.status !== 'done').length
    });
  }
  houses.sort((a, b) => String(a.name).localeCompare(String(b.name), 'ru', { numeric: true }));
  res.json({
    user: { name: req.user.name, role: req.user.role },
    period: curPeriod(), houses,
    totals: {
      debt: r2(houses.reduce((s, h) => s + h.debt, 0)), debtors: houses.reduce((s, h) => s + h.debtors, 0),
      openReq: reqs.filter(r => r.status !== 'done').length, newReq: reqs.filter(r => r.status === 'new').length
    }
  });
});

/* Все должники по всем домам — для обзвона */
router.get('/debtors', auth.requireStaff(), async (req, res) => {
  const osi = await store.getAll('osi');
  const out = [];
  for (const o of osi) {
    (await osiAccounts(o.id)).forEach(a => { if (a.balance > 0.01) out.push({ ...a, osiId: o.id, osiName: o.name }); });
  }
  out.sort((x, y) => y.balance - x.balance);
  res.json({ items: out });
});

/* Дом: все квартиры с балансами */
router.get('/osi/:id', auth.requireStaff(), async (req, res) => {
  const o = await store.getById('osi', req.params.id);
  if (!o) return res.status(404).json({ error: 'Дом не найден' });
  res.json({ osi: { id: o.id, name: o.name, address: o.address || '', chairman: o.chairman || '', iban: o.iban || '', bank: o.bank || '' },
    accounts: await osiAccounts(o.id) });
});

/* Квартира: история по месяцам */
router.get('/account/:id', auth.requireStaff(), async (req, res) => {
  const a = await store.getById('accounts', req.params.id);
  if (!a) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  const [acr, pay, svcs, reqs, o] = await Promise.all([
    store.getByAccount('accruals', a.id), store.getByAccount('payments', a.id), store.getByOsi('services', a.osiId),
    store.getByAccount('requests', a.id), store.getById('osi', a.osiId)
  ]);
  const per = {};
  acr.forEach(x => { const p = per[x.period] = per[x.period] || { period: x.period, acr: 0, pay: 0 }; p.acr += +x.amount || 0; });
  pay.forEach(x => { const p = per[x.period] = per[x.period] || { period: x.period, acr: 0, pay: 0 }; p.pay += +x.amount || 0; });
  const months = Object.values(per).sort((x, y) => String(y.period).localeCompare(String(x.period))).map(p => ({ ...p, acr: r2(p.acr), pay: r2(p.pay) }));
  const balance = r2((+a.saldoStart || 0) + acr.reduce((s, x) => s + (+x.amount || 0), 0) - pay.reduce((s, x) => s + (+x.amount || 0), 0));
  res.json({
    account: { id: a.id, apt: a.apt, ls: a.ls, owner: a.owner, phone: a.phone || '', area: a.area, otherPayers: a.otherPayers || [], saldoStart: +a.saldoStart || 0, saldoDate: a.saldoDate || '' },
    osi: o ? { id: o.id, name: o.name, iban: o.iban || '', bank: o.bank || '' } : null,
    balance, months,
    payments: pay.filter(x => x.date).sort((x, y) => String(y.date).localeCompare(String(x.date))).slice(0, 30).map(x => ({ date: x.date, amount: x.amount, method: x.method })),
    services: svcs.map(s => ({ id: s.id, name: s.name, tariff: s.tariff, unit: s.unit })),
    requests: reqs.sort((x, y) => String(y.date).localeCompare(String(x.date))).slice(0, 20)
  });
});

/* Заявки */
router.get('/requests', auth.requireStaff(), async (req, res) => {
  const [reqs, osi, accs] = await Promise.all([store.getAll('requests'), store.getAll('osi'), store.getAll('accounts')]);
  const on = {}; osi.forEach(o => { on[o.id] = o.name; });
  const an = {}; accs.forEach(a => { an[a.id] = a; });
  const status = String(req.query.status || 'open');
  const list = reqs.filter(r => status === 'all' || (status === 'open' ? r.status !== 'done' : r.status === status))
    .sort((x, y) => String(y.date).localeCompare(String(x.date)) || String(y.id).localeCompare(String(x.id)))
    .slice(0, 300)
    .map(r => ({ ...r, osiName: on[r.osiId] || '', apt: (an[r.accountId] || {}).apt || '', owner: (an[r.accountId] || {}).owner || '', phone: (an[r.accountId] || {}).phone || '' }));
  res.json({ items: list });
});

router.post('/requests/:id', auth.requireStaff(), async (req, res) => {
  const r = await store.getById('requests', req.params.id);
  if (!r) return res.status(404).json({ error: 'Заявка не найдена' });
  const b = req.body || {};
  if (b.status && !['new', 'work', 'done'].includes(b.status)) return res.status(400).json({ error: 'Неизвестный статус' });
  const upd = { ...r };
  if (b.status) upd.status = b.status;
  if (b.assignee != null) upd.assignee = String(b.assignee).trim().slice(0, 100) || '—';
  if (b.note != null && String(b.note).trim()) {
    upd.notes = (r.notes || []).concat([{ at: new Date().toISOString(), by: req.user.name || req.user.login, text: String(b.note).trim().slice(0, 1000) }]);
  }
  if (b.status === 'done' && r.status !== 'done') upd.doneDate = new Date().toISOString().slice(0, 10);
  await store.insertOne('requests', upd, req.user.login);
  res.json({ ok: true, request: upd });
});

/* Приглашение жителя в приложение по ссылке — вход без SMS.
   Ссылка одноразовая, живёт 14 дней, в базе хранится только хеш. */
router.post('/invite', auth.requireStaff(), async (req, res) => {
  const a = await store.getById('accounts', String((req.body || {}).accountId || ''));
  if (!a) return res.status(404).json({ error: 'Лицевой счёт не найден' });
  const token = crypto.randomBytes(18).toString('base64url');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  await store.setCode('inv:' + hash, { accountId: a.id, osiId: a.osiId, by: req.user.login, expires: Date.now() + INVITE_DAYS * 86400000 });
  await store.audit(req.user.login, 'resident_invite', { accountId: a.id, apt: a.apt });
  const base = (process.env.PUBLIC_URL || (req.protocol + '://' + req.get('host'))).replace(/\/$/, '');
  res.json({ ok: true, link: base + '/app#i=' + token, days: INVITE_DAYS, phone: a.phone || '', owner: a.owner, apt: a.apt });
});

module.exports = router;
