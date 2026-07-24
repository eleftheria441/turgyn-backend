require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const store = require('./src/store');
const { buildSeed } = require('./src/seedData');

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: ORIGIN }));
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/state', require('./src/routes/state'));
app.use('/api/resident', require('./src/routes/resident'));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/app.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'app.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

async function bootstrap() {
  if (!store.dbExists()) {
    console.log('Нет сохранённой базы — создаю демо-данные (2 ОСИ) в', store.DB_FILE);
    await store.saveDB(buildSeed());
  }
  app.listen(PORT, () => {
    console.log('Turgyn backend запущен: http://localhost:' + PORT);
    console.log('Демо-доступы: admin/admin (директор), buh/buh (бухгалтер), disp/disp (диспетчер)');
  });
}
bootstrap();
