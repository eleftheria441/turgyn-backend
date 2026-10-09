const express = require('express');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();
const limiter = auth.rateLimit({ windowMs: 60 * 60 * 1000, max: 5, key: (req) => req.ip, message: 'Заявка уже отправлена. Мы свяжемся с вами.' });
const clean = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);

/* Заявка с сайта — публичный метод */
router.post('/', limiter, async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // скрытое поле-ловушка: заполняют только боты
  const lead = {
    org: clean(b.org, 200), contact: clean(b.contact, 120), phone: clean(b.phone, 40),
    accounts: parseInt(b.accounts, 10) > 0 ? Math.min(parseInt(b.accounts, 10), 1000000) : null,
    role: ['osi', 'uk', 'other'].includes(b.role) ? b.role : 'other',
    comment: clean(b.comment, 1000), ip: req.ip
  };
  if (!lead.org || !lead.contact) return res.status(400).json({ error: 'Укажите организацию и контактное лицо' });
  if (lead.phone.replace(/\D/g, '').length < 10) return res.status(400).json({ error: 'Укажите телефон для связи' });
  if (b.consent !== true) return res.status(400).json({ error: 'Нужно согласие на обработку данных' });
  const id = await store.addLead(lead);
  await store.audit('site', 'lead_created', { id });
  res.json({ ok: true });
});

/* Список заявок — только директору */
router.get('/', auth.requireStaff(['director']), async (req, res) => {
  res.json({ items: await store.getLeads() });
});
router.post('/:id/status', auth.requireStaff(['director']), async (req, res) => {
  const st = (req.body || {}).status;
  if (!['new', 'work', 'done', 'spam'].includes(st)) return res.status(400).json({ error: 'Некорректный статус' });
  await store.setLeadStatus(parseInt(req.params.id, 10), st);
  res.json({ ok: true });
});

module.exports = router;
