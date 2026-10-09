/* Хранилище Turgyn на PostgreSQL.
   Этап 1: состояние приложения хранится одним JSONB-документом с версией
   (та же модель данных, что и раньше), сессии, коды входа и журнал аудита — отдельными таблицами.
   Весь доступ к данным идёт только через этот модуль. */
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

class ConflictError extends Error {
  constructor(current) { super('Данные были изменены другим пользователем'); this.conflict = true; this.current = current; }
}

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id          integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      data        jsonb NOT NULL,
      version     integer NOT NULL DEFAULT 1,
      updated_at  timestamptz NOT NULL DEFAULT now(),
      updated_by  text
    );
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
      version     integer NOT NULL,
      actor       text,
      data        jsonb NOT NULL
    );
  `);
}

/* ---------- состояние ---------- */

async function getState() {
  const r = await pool.query('SELECT data, version FROM app_state WHERE id = 1');
  if (!r.rows.length) return null;
  return { db: r.rows[0].data, version: r.rows[0].version };
}
async function getDB() {
  const s = await getState();
  return s ? s.db : null;
}
async function getUsers() {
  const r = await pool.query("SELECT data->'users' AS users FROM app_state WHERE id = 1");
  return r.rows.length ? (r.rows[0].users || []) : [];
}
async function dbExists() {
  const r = await pool.query('SELECT 1 FROM app_state WHERE id = 1');
  return r.rows.length > 0;
}

/* Сохранение с проверкой версии. expectedVersion = null — без проверки (только для служебных операций). */
async function saveDB(db, expectedVersion = null, actor = null) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cur = await client.query('SELECT version FROM app_state WHERE id = 1 FOR UPDATE');
    let version;
    if (!cur.rows.length) {
      await client.query('INSERT INTO app_state (id, data, version, updated_by) VALUES (1, $1, 1, $2)', [db, actor]);
      version = 1;
    } else {
      const curVer = cur.rows[0].version;
      if (expectedVersion !== null && expectedVersion !== curVer) {
        await client.query('ROLLBACK');
        throw new ConflictError(curVer);
      }
      version = curVer + 1;
      await client.query('UPDATE app_state SET data = $1, version = $2, updated_at = now(), updated_by = $3 WHERE id = 1', [db, version, actor]);
    }
    await maybeSnapshot(client, db, version, actor);
    await client.query('COMMIT');
    return version;
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw e;
  } finally {
    client.release();
  }
}

/* Атомарное изменение: прочитать → изменить функцией → записать. Для точечных серверных операций. */
async function updateDB(fn, actor = null) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cur = await client.query('SELECT data, version FROM app_state WHERE id = 1 FOR UPDATE');
    if (!cur.rows.length) throw new Error('База данных ещё не инициализирована');
    const db = cur.rows[0].data;
    const result = await fn(db);
    const version = cur.rows[0].version + 1;
    await client.query('UPDATE app_state SET data = $1, version = $2, updated_at = now(), updated_by = $3 WHERE id = 1', [db, version, actor]);
    await client.query('COMMIT');
    return { result, version };
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw e;
  } finally {
    client.release();
  }
}

/* Резервные снимки: не чаще раза в SNAPSHOT_MINUTES, храним последние SNAPSHOT_KEEP. */
const SNAPSHOT_MINUTES = parseInt(process.env.SNAPSHOT_MINUTES || '60', 10);
const SNAPSHOT_KEEP = parseInt(process.env.SNAPSHOT_KEEP || '168', 10);
async function maybeSnapshot(client, db, version, actor) {
  const last = await client.query('SELECT at FROM state_snapshots ORDER BY id DESC LIMIT 1');
  if (last.rows.length && Date.now() - new Date(last.rows[0].at).getTime() < SNAPSHOT_MINUTES * 60000) return;
  await client.query('INSERT INTO state_snapshots (version, actor, data) VALUES ($1, $2, $3)', [version, actor, db]);
  await client.query('DELETE FROM state_snapshots WHERE id NOT IN (SELECT id FROM state_snapshots ORDER BY id DESC LIMIT $1)', [SNAPSHOT_KEEP]);
}

/* ---------- сессии ---------- */

async function createSession(token, data, ttlMs) {
  await pool.query('INSERT INTO sessions (token, data, expires_at) VALUES ($1, $2, now() + ($3 || \' milliseconds\')::interval)', [token, data, String(ttlMs)]);
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
    await pool.query('INSERT INTO audit_log (actor, action, details) VALUES ($1, $2, $3)', [actor, action, details || null]);
  } catch (e) {
    console.error('audit error', e.message);
  }
}
async function getAudit(limit) {
  const r = await pool.query('SELECT at, actor, action, details FROM audit_log ORDER BY id DESC LIMIT $1', [limit || 200]);
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
}

module.exports = {
  pool, init, getState, getDB, getUsers, dbExists, saveDB, updateDB, ConflictError,
  createSession, getSession, destroySession, destroyUserSessions,
  getCode, setCode, deleteCode, audit, getAudit, cleanup, addLead, getLeads, setLeadStatus
};
