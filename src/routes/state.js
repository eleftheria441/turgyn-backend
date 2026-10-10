const express = require('express');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();
const PERIOD_RE = /^\d{4}-\d{2}$/;

/* Полное состояние — при входе и после сбоев синхронизации */
router.get('/', auth.requireStaff(), async (req, res) => {
  res.json(await store.getState());
});

/* Изменения после версии v — опрос раз в минуту, чтобы видеть правки коллег */
router.get('/since', auth.requireStaff(), async (req, res) => {
  const base = parseInt(req.query.v, 10);
  if (!Number.isFinite(base)) return res.status(400).json({ error: 'Не указана версия' });
  res.json(await store.getSince(base));
});

/* Пакет изменений: только то, что поменялось у клиента */
router.post('/changes', auth.requireStaff(), async (req, res) => {
  const b = req.body || {};
  const base = Number(b.base);
  if (!Number.isInteger(base)) return res.status(400).json({ error: 'Не указана версия данных. Обновите страницу.' });
  try {
    const r = await store.applyChanges({
      base, changes: b.changes || {}, settings: b.settings || {}, users: b.users || null,
      actor: req.user.login, isDirector: req.user.role === 'director', hashPassword: auth.hashPassword
    });
    res.json({ ok: true, version: r.version, pulled: r.pulled });
  } catch (e) {
    if (e.conflict) return res.status(409).json({ error: 'Эти данные только что изменил другой сотрудник. Загружаю актуальную версию — повторите действие.', items: e.items });
    if (e.locked) {
      const p = [...new Set(e.items.map(x => x.period))].join(', ');
      return res.status(423).json({ error: 'Период ' + p + ' закрыт. Изменения в нём вносятся корректировкой в открытом периоде.', items: e.items });
    }
    if (e.validation) return res.status(400).json({ error: e.message });
    throw e;
  }
});

/* Полная замена — перенос данных из браузера или загрузка резервной копии. Только директор. */
router.post('/replace', auth.requireStaff(['director']), async (req, res) => {
  const db = (req.body || {}).data;
  if (!db || !Array.isArray(db.osi)) return res.status(400).json({ error: 'Некорректные данные' });
  await store.snapshotIfChanged(parseInt(process.env.SNAPSHOT_KEEP || '168', 10)); // снимок «до» на случай ошибки
  const ver = await store.replaceAll(db, req.user.login);
  const counts = {}; store.COLL_NAMES.forEach(c => { counts[c] = (db[c] || []).length; });
  await store.audit(req.user.login, 'state_replaced', { version: ver, counts });
  res.json({ ok: true, version: ver });
});

/* Закрытие и открытие периода */
router.post('/periods/close', auth.requireStaff(['director', 'accountant']), async (req, res) => {
  const { osiId, period } = req.body || {};
  if (!osiId || !PERIOD_RE.test(period || '')) return res.status(400).json({ error: 'Укажите ОСИ и период' });
  const ver = await store.closePeriod(osiId, period, req.user.login);
  await store.audit(req.user.login, 'period_closed', { osiId, period });
  res.json({ ok: true, version: ver });
});
router.post('/periods/open', auth.requireStaff(['director']), async (req, res) => {
  const { osiId, period, reason } = req.body || {};
  if (!osiId || !PERIOD_RE.test(period || '')) return res.status(400).json({ error: 'Укажите ОСИ и период' });
  if (!reason || String(reason).trim().length < 5) return res.status(400).json({ error: 'Укажите причину открытия периода' });
  const ver = await store.openPeriod(osiId, period, req.user.login, String(reason).trim().slice(0, 500));
  await store.audit(req.user.login, 'period_opened', { osiId, period, reason });
  res.json({ ok: true, version: ver });
});
router.get('/periods/history', auth.requireStaff(['director', 'accountant']), async (req, res) => {
  res.json({ items: await store.getLockEvents(String(req.query.osiId || '')) });
});

/* Журнал действий — только директору */
router.get('/audit', auth.requireStaff(['director']), async (req, res) => {
  res.json({ items: await store.getAudit(Math.min(parseInt(req.query.limit || '200', 10), 1000)) });
});

/* Выгрузка полной резервной копии — только директору */
router.get('/export', auth.requireStaff(['director']), async (req, res) => {
  const db = await store.getState();
  delete db._locks;
  await store.audit(req.user.login, 'export', null);
  res.set('Content-Disposition', 'attachment; filename="turgyn-backup-' + new Date().toISOString().slice(0, 10) + '.json"');
  res.json(db);
});

module.exports = router;
