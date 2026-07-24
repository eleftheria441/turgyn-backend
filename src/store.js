/* Простое файловое хранилище состояния (JSON-блоб) + сессии.
   Заменить на Postgres/MySQL позже — весь доступ к данным идёт только через этот модуль. */
const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SESS_FILE = path.join(DATA_DIR, 'sessions.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let writeQueue = Promise.resolve();
function queueWrite(file, data) {
  writeQueue = writeQueue.then(() => new Promise((resolve, reject) => {
    const tmp = file + '.tmp';
    fs.writeFile(tmp, JSON.stringify(data, null, 2), (err) => {
      if (err) return reject(err);
      fs.rename(tmp, file, (err2) => err2 ? reject(err2) : resolve());
    });
  }));
  return writeQueue;
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, 'utf8');
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('readJson error', file, e.message);
    return fallback;
  }
}

function getDB() {
  return readJson(DB_FILE, null);
}
function saveDB(db) {
  return queueWrite(DB_FILE, db);
}
function dbExists() {
  return fs.existsSync(DB_FILE);
}

function getSessions() {
  return readJson(SESS_FILE, {});
}
function saveSessions(s) {
  return queueWrite(SESS_FILE, s);
}

module.exports = { getDB, saveDB, dbExists, getSessions, saveSessions, DATA_DIR, DB_FILE };
