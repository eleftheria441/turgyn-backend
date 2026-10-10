/* Хранилище Turgyn на PostgreSQL — этап 1.
   Каждая сущность хранится в своей таблице: запись целиком в jsonb `data`,
   ключевые поля (ОСИ, период, лицевой счёт) вынесены в вычисляемые индексируемые колонки.
   Каждое изменение получает номер версии из единого счётчика — по нему клиенты
   определяют конфликты и подтягивают правки коллег. Удаления оставляют «надгробия». */
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('Не задана переменная DATABASE_URL — сервер не может подключиться к базе данных.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10
});

/* имя коллекции в клиенте → таблица */
const COLLS = {
  osi: 'osi', houses: 'houses', accounts: 'accounts', services: 'services',
  accruals: 'accruals', payments: 'payments', providers: 'providers',
  provInvoices: 'prov_invoices', provPayments: 'prov_payments',
  requests: 'requests', expenses: 'expenses'
};
const COLL_NAMES = Object.keys(COLLS);
/* финансовые коллекции, которые блокируются закрытием периода */
const PERIOD_COLLS = ['accruals', 'payments', 'provInvoices', 'provPayments', 'expenses'];
const SETTINGS_KEYS = ['org', 'subscription', 'penalty', 'importLog', 'expenseCategories'];
const CHUNK = 5000;

class ConflictError extends Error {
  constructor(items) { super('Данные изменил другой пользователь'); this.conflict = true; this.items = items; }
}
class LockedError extends Error {
  constructor(items) { super('Период закрыт'); this.locked = true; this.items = items; }
}
class ValidationError extends Error {
  constructor(msg) { super(msg); this.validation = true; }
}

/* ---------- схема ---------- */

function collDDL(table) {
  const osiCol = table === 'osi' ? "id" : "(data->>'osiId')";
  return `
    CREATE TABLE IF NOT EXISTS ${table} (
      id          text PRIMARY KEY,
      data        jsonb NOT NULL,
      ver         bigint NOT NULL,
      updated_at  timestamptz NOT NULL DEFAULT now(),
      updated_by  text,
      osi_id      text GENERATED ALWAYS AS (${osiCol}) STORED,
      period      text GENERATED ALWAYS AS (data->>'period') STORED,
      account_id  text GENERATED ALWAYS AS (data->>'accountId') STORED
    );
    CREATE INDEX IF NOT EXISTS ${table}_ver_idx ON ${table} (ver);
    CREATE INDEX IF NOT EXISTS ${table}_osi_period_idx ON ${table} (osi_id, period);
    CREATE INDEX IF NOT EXISTS ${table}_account_idx ON ${table} (account_id);`;
}

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS meta (
      id          integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      ver         bigint NOT NULL DEFAULT 0,
      reset_ver   bigint NOT NULL DEFAULT 0
    );
    INSERT INTO meta (id) VALUES (1) ON CONFLICT DO NOTHING;
    CREATE TABLE IF NOT EXISTS users (
      id          text PRIMARY KEY,
      login       text NOT NULL UNIQUE,
      name        text NOT NULL,
      role        text NOT NULL,
      pos         text,
      pass_hash   text NOT NULL,
      must_change boolean NOT NULL DEFAULT false,
      disabled    boolean NOT NULL DEFAULT false,
      ver         bigint NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS settings (
      key         text PRIMARY KEY,
      data        jsonb,
      ver         bigint NOT NULL
    );
    CREATE TABLE IF NOT EXISTS period_locks (
      osi_id      text NOT NULL,
      period      text NOT NULL,
      closed_at   timestamptz NOT NULL DEFAULT now(),
      closed_by   text,
      ver         bigint NOT NULL,
      PRIMARY KEY (osi_id, period)
    );
    CREATE TABLE IF NOT EXISTS lock_events (
      id          bigserial PRIMARY KEY,
      at          timestamptz NOT NULL DEFAULT now(),
      osi_id      text NOT NULL,
      period      text NOT NULL,
      action      text NOT NULL,
      actor       text,
      reason      text
    );
    CREATE TABLE IF NOT EXISTS tombstones (
      coll        text NOT NULL,
      id          text NOT NULL,
      ver         bigint NOT NULL,
      PRIMARY KEY (coll, id)
    );
    CREATE INDEX IF NOT EXISTS tombstones_ver_idx ON tombstones (ver);
    ${Object.values(COLLS).map(collDDL).join('\n')}
    CREATE TABLE IF NOT EXISTS sessions (
      token       text PRIMARY KEY,
      data        jsonb NOT NULL,
      created_at  timestamptz NOT NULL DEFAULT now(),
      expires_at  timestamptz NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions (expires_at);
    CREATE TABLE IF NOT EXISTS login_codes (
      phone       text PRIMARY KEY,
      data        jsonb NOT NULL,
      expires_at  timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id          bigserial PRIMARY KEY,
      at          timestamptz NOT NULL DEFAULT now(),
      actor       text,
      action      text NOT NULL,
      details     jsonb
    );
    CREATE INDEX IF NOT EXISTS audit_log_at_idx ON audit_log (at DESC);
    CREATE TABLE IF NOT EXISTS leads (
      id          bigserial PRIMARY KEY,
      at          timestamptz NOT NULL DEFAULT now(),
      org         text NOT NULL,
      contact     text NOT NULL,
      phone       text NOT NULL,
      accounts    integer,
      role        text,
      comment     text,
      ip          text,
      status      text NOT NULL DEFAULT 'new'
    );
    CREATE TABLE IF NOT EXISTS state_snapshots (
      id          bigserial PRIMARY KEY,
      at          timestamptz NOT NULL DEFAULT now(),
      version     bigint NOT NULL,
      actor       text,
      data        jsonb NOT NULL
    );
  `);
  await migrateLegacy();
}

/* Перенос из старого формата (один JSON-документ в app_state) — один раз */
async function migrateLegacy() {
  const t = await pool.query("SELECT to_regclass('public.app_state') AS t");
  if (!t.rows[0].t) return;
  const already = await pool.query('SELECT 1 FROM users LIMIT 1');
  const r = await pool.query('SELECT data FROM app_state WHERE id = 1');
  if (!already.rows.length && r.rows.length) {
    const db = r.rows[0].data;
    console.log('Миграция: переношу данные из единого документа в таблицы…');
    const users = (db.users || []).filter(u => u.passHash).map(u => ({
      id: u.id, login: u.login, name: u.name || u.login, role: u.role, pos: u.pos || '',
      passHash: u.passHash, mustChange: !!u.mustChangePassword, disabled: !!u.disabled
    }));
    await replaceAll(db, 'migration', users);
    const counts = {}; COLL_NAMES.forEach(c => { counts[c] = (db[c] || []).length; });
    await audit('system', 'migrated_from_document', counts);
    console.log('Миграция завершена:', JSON.stringify(counts));
  }
  await pool.query('ALTER TABLE app_state RENAME TO app_state_legacy');
}

/* ---------- версии ---------- */

async function bumpVersion(client) {
  const r = await client.query('UPDATE meta SET ver = ver + 1 WHERE id = 1 RETURNING ver');
  return Number(r.rows[0].ver);
}
async function currentVersion(client = pool) {
  const r = await client.query('SELECT ver, reset_ver FROM meta WHERE id = 1');
  return { ver: Number(r.rows[0].ver), resetVer: Number(r.rows[0].reset_ver) };
}

/* ---------- чтение ---------- */

function userPublic(u) {
  return { id: u.id, name: u.name, login: u.login, role: u.role, pos: u.pos || '', disabled: !!u.disabled };
}
function lockRow(l) {
  return { osiId: l.osi_id, period: l.period, closedAt: l.closed_at, closedBy: l.closed_by };
}

/* Полное состояние в той же форме, в какой его ждёт кабинет */
async function assembleState(client = pool, { withUsers = true } = {}) {
  const db = {};
  for (const c of COLL_NAMES) {
    const r = await client.query(`SELECT data FROM ${COLLS[c]}`);
    db[c] = r.rows.map(x => x.data);
  }
  const s = await client.query('SELECT key, data FROM settings');
  s.rows.forEach(x => { db[x.key] = x.data; });
  if (!db.org) db.org = { name: '', bin: '', city: '', phone: '' };
  if (!db.importLog) db.importLog = [];
  if (!db.penalty) db.penalty = { enabled: false, rate: 0.05 };
  if (withUsers) {
    const u = await client.query('SELECT * FROM users ORDER BY login');
    db.users = u.rows.map(userPublic);
  }
  const l = await client.query('SELECT * FROM period_locks');
  db._locks = l.rows.map(lockRow);
  const v = await currentVersion(client);
  db._v = v.ver;
  return db;
}

/* Изменения после версии `base` (без учёта версии `exceptVer` — свои правки клиент уже знает) */
async function changesSince(client, base, exceptVer = -1) {
  const v = await currentVersion(client);
  if (base < v.resetVer) return { reset: true, version: v.ver };
  const out = { version: v.ver, upsert: {}, delete: {}, settings: {}, users: null, locks: null };
  let any = false;
  for (const c of COLL_NAMES) {
    const r = await client.query(`SELECT data FROM ${COLLS[c]} WHERE ver > $1 AND ver <> $2`, [base, exceptVer]);
    if (r.rows.length) { out.upsert[c] = r.rows.map(x => x.data); any = true; }
  }
  const t = await client.query('SELECT coll, id FROM tombstones WHERE ver > $1 AND ver <> $2', [base, exceptVer]);
  t.rows.forEach(x => { (out.delete[x.coll] = out.delete[x.coll] || []).push(x.id); any = true; });
  const s = await client.query('SELECT key, data FROM settings WHERE ver > $1 AND ver <> $2', [base, exceptVer]);
  s.rows.forEach(x => { out.settings[x.key] = x.data; any = true; });
  const u = await client.query('SELECT 1 FROM users WHERE ver > $1 AND ver <> $2 LIMIT 1', [base, exceptVer]);
  const ut = await client.query("SELECT 1 FROM tombstones WHERE coll = 'users' AND ver > $1 AND ver <> $2 LIMIT 1", [base, exceptVer]);
  if (u.rows.length || ut.rows.length) {
    const all = await client.query('SELECT * FROM users ORDER BY login');
    out.users = all.rows.map(userPublic); any = true;
  }
  const lk = await client.query('SELECT 1 FROM period_locks WHERE ver > $1 AND ver <> $2 LIMIT 1', [base, exceptVer]);
  const le = await client.query("SELECT 1 FROM tombstones WHERE coll = 'locks' AND ver > $1 AND ver <> $2 LIMIT 1", [base, exceptVer]);
  if (lk.rows.length || le.rows.length) {
    const all = await client.query('SELECT * FROM period_locks');
    out.locks = all.rows.map(lockRow); any = true;
  }
  out.empty = !any;
  return out;
}

async function getState() { return assembleState(); }
async function getSince(base) { return changesSince(pool, base); }

/* ---------- пользователи ---------- */

async function getUserById(id) {
  const r = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return r.rows[0] || null;
}
async function getUserByLogin(login) {
  const r = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
  return r.rows[0] || null;
}
async function hasUsers() {
  const r = await pool.query('SELECT 1 FROM users LIMIT 1');
  return r.rows.length > 0;
}
async function createUser(u, client = pool) {
  const ver = client === pool ? await withTx(bumpVersion) : await bumpVersion(client);
  await client.query(`INSERT INTO users (id, login, name, role, pos, pass_hash, must_change, disabled, ver)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [u.id, u.login, u.name, u.role, u.pos || '', u.passHash, !!u.mustChange, !!u.disabled, ver]);
}
async function setPassword(userId, passHash) {
  await withTx(async (c) => {
    const ver = await bumpVersion(c);
    await c.query('UPDATE users SET pass_hash = $2, must_change = false, ver = $3 WHERE id = $1', [userId, passHash, ver]);
  });
}

/* ---------- запись ---------- */

async function withTx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await fn(client);
    await client.query('COMMIT');
    return res;
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw e;
  } finally {
    client.release();
  }
}

async function bulkUpsert(client, table, rowsIn, ver, actor) {
  const byId = new Map(); rowsIn.forEach(r => byId.set(r.id, r)); // одна запись — одна строка, даже если пришла дважды
  const rows = [...byId.values()];
  for (let i = 0; i < rows.length; i += CHUNK) {
    const part = rows.slice(i, i + CHUNK);
    await client.query(`INSERT INTO ${table} (id, data, ver, updated_by)
      SELECT x->>'id', x, $2, $3 FROM jsonb_array_elements($1::jsonb) x
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, ver = EXCLUDED.ver, updated_at = now(), updated_by = EXCLUDED.updated_by`,
      [JSON.stringify(part), ver, actor]);
  }
}

function isClosed(locks, osiId, period) {
  return !!(osiId && period && locks.has(osiId + '|' + period));
}

/* Применить пакет изменений от кабинета.
   changes: { [коллекция]: { upsert: [записи], delete: [id] } }
   settings: { [ключ]: значение } · users: { upsert: [...], delete: [id] } — только для директора */
async function applyChanges({ base, changes = {}, settings = {}, users = null, actor, isDirector, hashPassword }) {
  return withTx(async (client) => {
    const ver = await bumpVersion(client);
    const lockRows = await client.query('SELECT osi_id, period FROM period_locks');
    const locks = new Set(lockRows.rows.map(l => l.osi_id + '|' + l.period));
    const conflicts = [], locked = [];
    const summary = {};

    for (const c of Object.keys(changes)) {
      if (!COLLS[c]) throw new ValidationError('Неизвестная коллекция ' + c);
      const table = COLLS[c];
      const ups = Array.isArray(changes[c].upsert) ? changes[c].upsert : [];
      const dels = Array.isArray(changes[c].delete) ? changes[c].delete.map(String) : [];
      for (const r of ups) {
        if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !r.id) throw new ValidationError('Запись без id в ' + c);
      }
      const ids = ups.map(r => r.id).concat(dels);
      const existing = new Map();
      for (let i = 0; i < ids.length; i += CHUNK) {
        const ex = await client.query(`SELECT id, data, ver FROM ${table} WHERE id = ANY($1)`, [ids.slice(i, i + CHUNK)]);
        ex.rows.forEach(x => existing.set(x.id, x));
      }
      for (const r of ups) {
        const ex = existing.get(r.id);
        if (ex && Number(ex.ver) > base) conflicts.push({ coll: c, id: r.id });
        if (PERIOD_COLLS.includes(c)) {
          if (isClosed(locks, r.osiId, r.period)) locked.push({ coll: c, id: r.id, osiId: r.osiId, period: r.period });
          else if (ex && isClosed(locks, ex.data.osiId, ex.data.period)) locked.push({ coll: c, id: r.id, osiId: ex.data.osiId, period: ex.data.period });
        }
      }
      for (const id of dels) {
        const ex = existing.get(id);
        if (!ex) continue;
        if (Number(ex.ver) > base) conflicts.push({ coll: c, id });
        if (PERIOD_COLLS.includes(c) && isClosed(locks, ex.data.osiId, ex.data.period)) locked.push({ coll: c, id, osiId: ex.data.osiId, period: ex.data.period });
      }
      if (conflicts.length || locked.length) continue;
      if (ups.length) await bulkUpsert(client, table, ups, ver, actor);
      if (dels.length) {
        const gone = dels.filter(id => existing.has(id));
        if (gone.length) {
          await client.query(`DELETE FROM ${table} WHERE id = ANY($1)`, [gone]);
          await client.query(`INSERT INTO tombstones (coll, id, ver) SELECT $1, unnest($2::text[]), $3
            ON CONFLICT (coll, id) DO UPDATE SET ver = EXCLUDED.ver`, [c, gone, ver]);
          // удалённые финансовые записи сохраняем в журнал целиком — их можно восстановить
          if (PERIOD_COLLS.includes(c) || c === 'accounts' || c === 'osi') {
            const removed = gone.map(id => existing.get(id).data);
            for (let i = 0; i < removed.length; i += 2000) {
              await client.query('INSERT INTO audit_log (actor, action, details) VALUES ($1, $2, $3)',
                [actor, 'deleted_' + c, JSON.stringify({ version: ver, rows: removed.slice(i, i + 2000) })]);
            }
          }
        }
      }
      summary[c] = { upsert: ups.length, delete: dels.length };
    }
    if (conflicts.length) throw new ConflictError(conflicts.slice(0, 50));
    if (locked.length) throw new LockedError(locked.slice(0, 50));

    for (const k of Object.keys(settings || {})) {
      if (!SETTINGS_KEYS.includes(k)) continue;
      await client.query(`INSERT INTO settings (key, data, ver) VALUES ($1, $2, $3)
        ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, ver = EXCLUDED.ver`, [k, JSON.stringify(settings[k]), ver]);
      summary['settings.' + k] = 1;
    }

    const passwordsSet = [];
    if (users && isDirector) {
      const cur = await client.query('SELECT * FROM users');
      const byId = new Map(cur.rows.map(u => [u.id, u]));
      const ups = Array.isArray(users.upsert) ? users.upsert : [];
      const dels = Array.isArray(users.delete) ? users.delete.map(String) : [];
      for (const u of ups) {
        if (!u || !u.id || !u.login || !u.name) throw new ValidationError('У сотрудника должны быть ФИО и логин');
        if (!['director', 'accountant', 'dispatcher'].includes(u.role)) throw new ValidationError('Некорректная роль сотрудника');
        const prev = byId.get(u.id);
        if (!prev && !u.pass) throw new ValidationError('У нового сотрудника должен быть пароль');
        if (u.pass && String(u.pass).length < 8) throw new ValidationError('Пароль сотрудника — не короче 8 символов');
        const passHash = u.pass ? hashPassword(u.pass) : prev.pass_hash;
        const mustChange = u.pass ? true : prev.must_change;
        if (u.pass) passwordsSet.push(u.login);
        await client.query(`INSERT INTO users (id, login, name, role, pos, pass_hash, must_change, disabled, ver)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
          ON CONFLICT (id) DO UPDATE SET login=$2, name=$3, role=$4, pos=$5, pass_hash=$6, must_change=$7, disabled=$8, ver=$9`,
          [u.id, u.login, u.name, u.role, u.pos || '', passHash, mustChange, !!u.disabled, ver]);
      }
      if (dels.length) {
        await client.query('DELETE FROM users WHERE id = ANY($1)', [dels]);
        await client.query(`INSERT INTO tombstones (coll, id, ver) SELECT 'users', unnest($1::text[]), $2
          ON CONFLICT (coll, id) DO UPDATE SET ver = EXCLUDED.ver`, [dels, ver]);
        await client.query("DELETE FROM sessions WHERE data->>'userId' = ANY($1)", [dels]);
      }
      const after = await client.query('SELECT login, role, disabled FROM users');
      const logins = after.rows.map(u => u.login);
      if (new Set(logins).size !== logins.length) throw new ValidationError('Логины сотрудников должны быть уникальны');
      if (!after.rows.some(u => u.role === 'director' && !u.disabled)) throw new ValidationError('В системе должен остаться хотя бы один директор');
      summary.users = { upsert: ups.length, delete: dels.length };
    }

    await client.query('INSERT INTO audit_log (actor, action, details) VALUES ($1, $2, $3)',
      [actor, 'changes_saved', JSON.stringify({ version: ver, summary, passwordsSet })]);
    const pulled = await changesSince(client, base, ver);
    return { version: ver, pulled };
  });
}

/* Полная замена данных (перенос из браузера, загрузка резервной копии) */
async function replaceAll(db, actor, users = null) {
  return withTx(async (client) => {
    const ver = await bumpVersion(client);
    for (const c of COLL_NAMES) {
      await client.query(`DELETE FROM ${COLLS[c]}`);
      const rows = (db[c] || []).filter(r => r && typeof r.id === 'string' && r.id);
      const seen = new Set(); const uniq = [];
      for (const r of rows) { if (!seen.has(r.id)) { seen.add(r.id); uniq.push(r); } }
      await bulkUpsert(client, COLLS[c], uniq, ver, actor);
    }
    for (const k of SETTINGS_KEYS) {
      if (db[k] === undefined) continue;
      await client.query(`INSERT INTO settings (key, data, ver) VALUES ($1, $2, $3)
        ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, ver = EXCLUDED.ver`, [k, JSON.stringify(db[k]), ver]);
    }
    if (users) {
      for (const u of users) await createUser(u, client);
    }
    await client.query('DELETE FROM tombstones');
    await client.query('UPDATE meta SET reset_ver = $1 WHERE id = 1', [ver]);
    return ver;
  });
}

/* ---------- закрытие периодов ---------- */

async function closePeriod(osiId, period, actor) {
  return withTx(async (c) => {
    const ver = await bumpVersion(c);
    await c.query(`INSERT INTO period_locks (osi_id, period, closed_by, ver) VALUES ($1,$2,$3,$4)
      ON CONFLICT (osi_id, period) DO NOTHING`, [osiId, period, actor, ver]);
    await c.query('INSERT INTO lock_events (osi_id, period, action, actor) VALUES ($1,$2,$3,$4)', [osiId, period, 'close', actor]);
    return ver;
  });
}
async function openPeriod(osiId, period, actor, reason) {
  return withTx(async (c) => {
    const ver = await bumpVersion(c);
    const r = await c.query('DELETE FROM period_locks WHERE osi_id = $1 AND period = $2', [osiId, period]);
    if (r.rowCount) {
      await c.query(`INSERT INTO tombstones (coll, id, ver) VALUES ('locks', $1, $2)
        ON CONFLICT (coll, id) DO UPDATE SET ver = EXCLUDED.ver`, [osiId + '|' + period, ver]);
    }
    await c.query('INSERT INTO lock_events (osi_id, period, action, actor, reason) VALUES ($1,$2,$3,$4,$5)', [osiId, period, 'open', actor, reason]);
    return ver;
  });
}
async function getLockEvents(osiId) {
  const r = await pool.query('SELECT at, period, action, actor, reason FROM lock_events WHERE osi_id = $1 ORDER BY id DESC LIMIT 200', [osiId]);
  return r.rows;
}

/* ---------- точечные операции (приложение жителя) ---------- */

async function getAll(coll) {
  const r = await pool.query(`SELECT data FROM ${COLLS[coll]}`);
  return r.rows.map(x => x.data);
}
async function getById(coll, id) {
  const r = await pool.query(`SELECT data FROM ${COLLS[coll]} WHERE id = $1`, [id]);
  return r.rows.length ? r.rows[0].data : null;
}
async function getByAccount(coll, accountId) {
  const r = await pool.query(`SELECT data FROM ${COLLS[coll]} WHERE account_id = $1`, [accountId]);
  return r.rows.map(x => x.data);
}
async function getByOsi(coll, osiId) {
  const r = await pool.query(`SELECT data FROM ${COLLS[coll]} WHERE osi_id = $1`, [osiId]);
  return r.rows.map(x => x.data);
}
async function insertOne(coll, row, actor) {
  return withTx(async (c) => {
    const ver = await bumpVersion(c);
    await bulkUpsert(c, COLLS[coll], [row], ver, actor);
    return ver;
  });
}

/* ---------- резервные снимки ---------- */

let lastSnapVer = -1;
async function snapshotIfChanged(keep) {
  const v = await currentVersion();
  if (v.ver === lastSnapVer) return false;
  const last = await pool.query('SELECT version FROM state_snapshots ORDER BY id DESC LIMIT 1');
  if (last.rows.length && Number(last.rows[0].version) === v.ver) { lastSnapVer = v.ver; return false; }
  const db = await assembleState(pool, { withUsers: true });
  await pool.query('INSERT INTO state_snapshots (version, actor, data) VALUES ($1, $2, $3)', [v.ver, 'system', JSON.stringify(db)]);
  await pool.query('DELETE FROM state_snapshots WHERE id NOT IN (SELECT id FROM state_snapshots ORDER BY id DESC LIMIT $1)', [keep]);
  lastSnapVer = v.ver;
  return true;
}

/* ---------- сессии ---------- */

async function createSession(token, data, ttlMs) {
  await pool.query("INSERT INTO sessions (token, data, expires_at) VALUES ($1, $2, now() + ($3 || ' milliseconds')::interval)", [token, data, String(ttlMs)]);
}
async function getSession(token) {
  const r = await pool.query('SELECT data FROM sessions WHERE token = $1 AND expires_at > now()', [token]);
  return r.rows.length ? r.rows[0].data : null;
}
async function destroySession(token) {
  await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
}
async function destroyUserSessions(userId) {
  await pool.query("DELETE FROM sessions WHERE data->>'userId' = $1", [userId]);
}

/* ---------- коды входа жителей ---------- */

async function getCode(phone) {
  const r = await pool.query('SELECT data FROM login_codes WHERE phone = $1 AND expires_at > now()', [phone]);
  return r.rows.length ? r.rows[0].data : null;
}
async function setCode(phone, data) {
  await pool.query(`INSERT INTO login_codes (phone, data, expires_at) VALUES ($1, $2, to_timestamp($3 / 1000.0))
    ON CONFLICT (phone) DO UPDATE SET data = EXCLUDED.data, expires_at = EXCLUDED.expires_at`, [phone, data, data.expires]);
}
async function deleteCode(phone) {
  await pool.query('DELETE FROM login_codes WHERE phone = $1', [phone]);
}

/* ---------- журнал ---------- */

async function audit(actor, action, details) {
  try {
    await pool.query('INSERT INTO audit_log (actor, action, details) VALUES ($1, $2, $3)', [actor, action, details ? JSON.stringify(details) : null]);
  } catch (e) {
    console.error('audit error', e.message);
  }
}
async function getAudit(limit) {
  const r = await pool.query(`SELECT at, actor, action,
      CASE WHEN action LIKE 'deleted_%' THEN jsonb_build_object('version', details->'version', 'count', jsonb_array_length(details->'rows')) ELSE details END AS details
    FROM audit_log ORDER BY id DESC LIMIT $1`, [limit || 200]);
  return r.rows;
}

/* ---------- заявки с сайта ---------- */

async function addLead(l) {
  const r = await pool.query('INSERT INTO leads (org, contact, phone, accounts, role, comment, ip) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
    [l.org, l.contact, l.phone, l.accounts, l.role, l.comment, l.ip]);
  return r.rows[0].id;
}
async function getLeads() {
  const r = await pool.query('SELECT id, at, org, contact, phone, accounts, role, comment, status FROM leads ORDER BY id DESC LIMIT 500');
  return r.rows;
}
async function setLeadStatus(id, status) {
  await pool.query('UPDATE leads SET status = $2 WHERE id = $1', [id, status]);
}

/* ---------- обслуживание ---------- */

async function cleanup() {
  await pool.query('DELETE FROM sessions WHERE expires_at < now()');
  await pool.query('DELETE FROM login_codes WHERE expires_at < now()');
  // надгробия старше 90 дней не нужны: клиенты с такой старой версией всё равно перезагружаются целиком
  await pool.query(`DELETE FROM tombstones WHERE ver < (SELECT GREATEST(0, ver - 1000000) FROM meta WHERE id = 1)`);
}

module.exports = {
  pool, init, COLLS, COLL_NAMES, PERIOD_COLLS, SETTINGS_KEYS,
  ConflictError, LockedError, ValidationError,
  getState, getSince, assembleState, currentVersion,
  getUserById, getUserByLogin, hasUsers, createUser, setPassword,
  applyChanges, replaceAll, closePeriod, openPeriod, getLockEvents,
  getAll, getById, getByAccount, getByOsi, insertOne, snapshotIfChanged,
  createSession, getSession, destroySession, destroyUserSessions,
  getCode, setCode, deleteCode, audit, getAudit,
  addLead, getLeads, setLeadStatus, cleanup
};
