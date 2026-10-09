require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const store = require('./src/store');
const auth = require('./src/auth');
const { buildSeed, buildEmpty } = require('./src/seedData');

const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1); // за прокси Railway/Cloudflare — чтобы видеть реальный IP для лимитов и журнала
app.disable('x-powered-by');

// Фронтенд отдаётся этим же сервером, поэтому кросс-доменные запросы не нужны.
// CORS включается только если явно задан CORS_ORIGIN (например, для отдельного мобильного клиента).
if (process.env.CORS_ORIGIN) app.use('/api', cors({ origin: process.env.CORS_ORIGIN.split(',').map(s => s.trim()) }));

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'same-origin');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  if (req.path.startsWith('/api')) res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.json({ limit: process.env.JSON_LIMIT || '50mb' }));

app.get('/api/health', async (req, res) => {
  try { await store.pool.query('SELECT 1'); res.json({ ok: true }); }
  catch (e) { res.status(503).json({ ok: false }); }
});
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/state', require('./src/routes/state'));
app.use('/api/resident', require('./src/routes/resident'));
app.use('/api/leads', require('./src/routes/leads'));
app.use('/api', (req, res) => res.status(404).json({ error: 'Не найдено' }));

app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.get('/app.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'app.html')));
app.get(['/cabinet', '/cabinet/'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'cabinet.html')));
app.get('/cabinet.html', (req, res) => res.redirect(301, '/cabinet'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Единый обработчик ошибок: детали — в лог сервера, клиенту — без внутренностей
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Слишком большой объём данных' });
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

async function bootstrap() {
  await store.init();
  if (!(await store.dbExists())) {
    if (process.env.SEED_DEMO === 'true') {
      console.log('База пуста — создаю ДЕМО-данные (SEED_DEMO=true).');
      await store.saveDB(buildSeed(), null, 'system');
    } else {
      const login = process.env.ADMIN_LOGIN || 'director';
      let password = process.env.ADMIN_PASSWORD;
      let generated = false;
      if (!password) { password = auth.randomPassword(); generated = true; }
      await store.saveDB(buildEmpty({ login, password, name: process.env.ADMIN_NAME, mustChange: generated }), null, 'system');
      console.log('База пуста — создана рабочая база с одним директором. Логин: ' + login);
      if (generated) console.log('Временный пароль директора (смените при первом входе): ' + password);
    }
    await store.audit('system', 'db_initialized', null);
  }
  setInterval(() => store.cleanup().catch(e => console.error('cleanup', e.message)), 60 * 60 * 1000).unref();
  app.listen(PORT, () => console.log('Turgyn backend запущен на порту ' + PORT));
}
bootstrap().catch((e) => { console.error('Не удалось запустить сервер:', e); process.exit(1); });
