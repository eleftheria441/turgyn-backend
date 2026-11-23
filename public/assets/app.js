/* Turgyn — единое приложение (PWA) для жителей и сотрудников УК.
   Житель: вход по SMS-коду или ссылке-приглашению. Сотрудник: логин и пароль кабинета. */
'use strict';
const RKEY = 'turgyn_app_session';            // сессия жителя
const TOKKEY = 'turgyn_token', UKEY = 'turgyn_user'; // сессия сотрудника — общая с кабинетом
let SESS = null;        // {type:'resident'|'staff', token, user}
let ST = null;          // данные жителя
let TAB = null, STACK = [], CACHE = {};
let DEFERRED = null;    // событие установки (Android/Chrome)

/* ---------- утилиты ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function money(n) { n = Math.round((+n || 0) * 100) / 100; return n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' ₸'; }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.getElementById('toast').appendChild(t); setTimeout(() => t.remove(), 2800); }
const MON = ['', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
function perName(p) { if (!p) return ''; const [y, m] = String(p).split('-'); return m ? MON[+m] + ' ' + y : p; }
function fmtD(d) { if (!d) return '—'; const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + '.' + m[2] + '.' + m[1] : String(d); }
function today() { return new Date().toISOString().slice(0, 10); }
function digits(ph) { let d = String(ph || '').replace(/\D/g, ''); if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1); if (d.length === 10) d = '7' + d; return d.length === 11 ? d : ''; }
function aptCls(a) { return a.balance > 0.01 ? (a.months >= 3 ? 'bad' : 'warn') : ''; }
function monthsTxt(n) { return n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? 'месяц' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'месяца' : 'месяцев')); }
const ST_NAME = { new: 'Новая', work: 'В работе', done: 'Выполнена' }, ST_PILL = { new: 'warn', work: 'info', done: 'ok' };
const ROLE = { director: 'Директор', accountant: 'Бухгалтер', dispatcher: 'Диспетчер' };
const METHOD = { kaspi: 'Kaspi', card: 'Карта', bank: 'Банк', cash: 'Наличные', halyk: 'Halyk', correction: 'Корректировка' };

async function api(path, method, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (SESS && SESS.token) headers['Authorization'] = 'Bearer ' + SESS.token;
  let r;
  try { r = await fetch(path, { method: method || 'GET', headers, body: body ? JSON.stringify(body) : undefined }); }
  catch (e) { const er = new Error('Нет связи с сервером. Проверьте интернет.'); er.net = true; throw er; }
  let data = {}; try { data = await r.json(); } catch (e) { }
  if (r.status === 401 && SESS) { logout(true); toast('Сессия закончилась — войдите снова'); }
  if (!r.ok) { const er = new Error(data.error || 'Ошибка сервера'); er.api = true; er.status = r.status; if (data.retryAfter) er.retryAfter = data.retryAfter; throw er; }
  return data;
}
function sheet(html) { document.getElementById('modal-root').innerHTML = '<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="msheet">' + html + '</div></div>'; }
function closeModal() { document.getElementById('modal-root').innerHTML = ''; }
function copyText(t) { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Скопировано'), () => { prompt('Скопируйте:', t); }); }

/* ================= ВХОД ================= */
let AUTH_PHONE = '', RESEND_TIMER = null;
function authErr(msg) { const b = document.getElementById('au-err'); if (!msg) { b.classList.add('hidden'); b.textContent = ''; return; } b.classList.remove('hidden'); b.textContent = msg; }
function authMode(m) {
  document.querySelectorAll('#au-seg button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  document.getElementById('au-staff').classList.toggle('hidden', m !== 'staff');
  document.getElementById('au-step-phone').classList.toggle('hidden', m !== 'res');
  document.getElementById('au-step-code').classList.add('hidden');
  document.getElementById('au-results').innerHTML = ''; authErr('');
}
function authBackToPhone() { clearInterval(RESEND_TIMER); authMode('res'); document.getElementById('au-code').value = ''; }
function authStartResendTimer(sec) {
  const box = document.getElementById('au-resend'); clearInterval(RESEND_TIMER); let left = sec;
  const tick = () => { if (left <= 0) { clearInterval(RESEND_TIMER); box.innerHTML = '<b onclick="authRequestCode(true)">Отправить код повторно</b>'; return; } box.textContent = 'Повторить можно через ' + left + ' сек.'; left--; };
  tick(); RESEND_TIMER = setInterval(tick, 1000);
}
async function authRequestCode(isResend) {
  const phone = isResend ? AUTH_PHONE : document.getElementById('au-key').value.trim();
  if (!phone) { toast('Введите номер телефона'); return; }
  const btn = document.getElementById('au-send-btn'); btn.disabled = true; authErr('');
  try {
    const data = await api('/api/resident/request-code', 'POST', { phone });
    AUTH_PHONE = phone;
    document.getElementById('au-step-phone').classList.add('hidden');
    document.getElementById('au-step-code').classList.remove('hidden');
    document.getElementById('au-phone-lbl').textContent = 'на ' + phone;
    const inp = document.getElementById('au-code'); inp.value = ''; inp.focus();
    authStartResendTimer(60);
    document.getElementById('au-results').innerHTML = data.devCode ? '<div class="a-dev">Тестовый режим, SMS не отправляется.<br>Код: <b style="font-size:16px;letter-spacing:2px">' + esc(data.devCode) + '</b></div>' : '';
  } catch (err) {
    authErr(err.message);
    if (err.retryAfter) { AUTH_PHONE = phone; document.getElementById('au-step-phone').classList.add('hidden'); document.getElementById('au-step-code').classList.remove('hidden'); authStartResendTimer(err.retryAfter); }
  } finally { btn.disabled = false; }
}
function authCodeInput() { const inp = document.getElementById('au-code'); inp.value = inp.value.replace(/\D/g, '').slice(0, 6); authErr(''); if (inp.value.length === 6) authVerifyCode(); }
async function authVerifyCode(accountId) {
  const code = document.getElementById('au-code').value.replace(/\D/g, '');
  if (code.length < 6) { toast('Введите 6 цифр из SMS'); return; }
  const btn = document.getElementById('au-verify-btn'); btn.disabled = true; authErr('');
  try {
    const body = { phone: AUTH_PHONE, code }; if (accountId) body.accountId = accountId;
    const data = await api('/api/resident/verify-code', 'POST', body);
    if (data.matches && data.matches.length) {
      document.getElementById('au-results').innerHTML = '<div style="color:#9fd8c8;font-size:12.5px">Выберите квартиру:</div>' + data.matches.map(m =>
        '<div class="a-opt" onclick="authVerifyCode(\'' + esc(m.id) + '\')"><b>кв. ' + esc(m.apt) + ' · ' + esc(m.owner) + '</b><span>' + esc(m.osiName) + ' · л/с ' + esc(m.ls || '') + '</span></div>').join('');
      return;
    }
    if (data.token) { clearInterval(RESEND_TIMER); await startResident(data.token); }
  } catch (err) { authErr(err.message); const inp = document.getElementById('au-code'); inp.value = ''; inp.focus(); }
  finally { btn.disabled = false; }
}
async function redeemInvite(token) {
  authErr('');
  try { const data = await api('/api/resident/redeem', 'POST', { token }); await startResident(data.token); toast('Добро пожаловать в Turgyn!'); }
  catch (err) { authErr(err.message); }
}
async function startResident(token) {
  SESS = { type: 'resident', token }; localStorage.setItem(RKEY, JSON.stringify({ token }));
  await loadResident(); showApp();
}
async function staffLogin() {
  const login = document.getElementById('st-login').value.trim(), password = document.getElementById('st-pass').value;
  if (!login || !password) { toast('Введите логин и пароль'); return; }
  const btn = document.getElementById('st-btn'); btn.disabled = true; authErr('');
  try {
    const data = await api('/api/auth/login', 'POST', { login, password });
    SESS = { type: 'staff', token: data.token, user: data.user };
    localStorage.setItem(TOKKEY, data.token); localStorage.setItem(UKEY, JSON.stringify(data.user));
    document.getElementById('st-pass').value = '';
    showApp();
    if (data.user.mustChangePassword) setTimeout(() => sheet('<h3>Смените временный пароль</h3><p class="small muted" style="margin-bottom:14px">Вы вошли с временным паролем. Смените его в полном кабинете — это займёт минуту.</p><a class="btn-main" style="display:block;text-align:center;text-decoration:none" href="/cabinet">Открыть кабинет</a><button class="btn-gho" style="margin-top:8px" onclick="closeModal()">Позже</button>'), 300);
  } catch (err) { authErr(err.message); }
  finally { btn.disabled = false; }
}
function logout(silent) {
  if (!silent && SESS) api(SESS.type === 'staff' ? '/api/auth/logout' : '/api/resident/logout', 'POST').catch(() => { });
  if (SESS && SESS.type === 'staff') { localStorage.removeItem(TOKKEY); localStorage.removeItem(UKEY); }
  localStorage.removeItem(RKEY); SESS = null; ST = null; CACHE = {}; STACK = [];
  closeModal();
  document.getElementById('app').classList.add('hidden'); document.getElementById('auth').classList.remove('hidden');
  authMode('res'); renderInstall();
}

/* ================= ОБОЛОЧКА ================= */
const NAV = {
  resident: [['home', '🏠', 'Главная'], ['bills', '🧾', 'Начисления'], ['req', '🛠', 'Заявки'], ['profile', '👤', 'Профиль']],
  staff: [['houses', '🏢', 'Дома'], ['debtors', '💸', 'Должники'], ['sreq', '🛠', 'Заявки'], ['more', '☰', 'Ещё']]
};
function showApp() {
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('bnav').innerHTML = NAV[SESS.type].map(([t, i, n]) => '<button class="it" data-t="' + t + '" onclick="tab(\'' + t + '\')"><span class="i">' + i + '</span><span>' + n + '</span></button>').join('');
  tab(SESS.type === 'staff' ? 'houses' : 'home');
}
function setHeader(title, sub) { document.getElementById('h-name').textContent = title; document.getElementById('h-addr').textContent = sub || ''; }
function tab(t) { TAB = t; STACK = [{ v: t }]; render(); }
function push(v, arg) { STACK.push({ v, arg }); render(); }
function goBack() { if (STACK.length > 1) { STACK.pop(); render(); } }
async function render(fresh) {
  const cur = STACK[STACK.length - 1];
  document.querySelectorAll('#bnav .it').forEach(b => b.classList.toggle('on', b.dataset.t === TAB));
  document.getElementById('h-back').classList.toggle('hidden', STACK.length < 2);
  const el = document.getElementById('scr');
  const fn = VIEWS[cur.v];
  if (!fn) return;
  if (fresh) CACHE = {};
  try {
    const out = fn(cur.arg);
    if (out && out.then) { el.innerHTML = '<div class="loading">Загрузка…</div>'; el.innerHTML = await out; }
    else el.innerHTML = out;
  } catch (e) { el.innerHTML = '<div class="empty">' + esc(e.message || 'Ошибка') + '<br><br><button class="btn-gho" onclick="render(true)">Повторить</button></div>'; }
  el.scrollTop = 0; window.scrollTo(0, 0);
}
async function refresh() {
  if (SESS.type === 'resident') { try { await loadResident(); } catch (e) { toast(e.message); return; } }
  render(true); toast('Обновлено');
}
async function cached(key, path) { if (!CACHE[key]) CACHE[key] = await api(path); return CACHE[key]; }

const VIEWS = {};

/* ================= ЖИТЕЛЬ ================= */
async function loadResident() { ST = await api('/api/resident/me'); setHeader((ST.account.owner || 'Житель') + ' · кв. ' + ST.account.apt, ST.osi ? ST.osi.name : ''); }
function rIdx() {
  const idx = {};
  ST.accruals.forEach(a => { const p = idx[a.period] = idx[a.period] || { a: 0, pay: 0, s: {}, pays: [] }; p.a += +a.amount || 0; const k = a.serviceId || '_'; p.s[k] = (p.s[k] || 0) + (+a.amount || 0); });
  ST.payments.forEach(x => { const p = idx[x.period] = idx[x.period] || { a: 0, pay: 0, s: {}, pays: [] }; p.pay += +x.amount || 0; p.pays.push(x); });
  return idx;
}
function rBalance() { let b = +ST.account.saldoStart || 0; ST.accruals.forEach(a => b += +a.amount || 0); ST.payments.forEach(p => b -= +p.amount || 0); return Math.round(b * 100) / 100; }
function rSvc(id) { const s = ST.services.find(s => s.id === id); return s ? s.name : (id === '_' ? 'Прочее' : 'Услуга'); }

VIEWS.home = function () {
  const bal = rBalance(), idx = rIdx(), pers = Object.keys(idx).sort().reverse(), last = pers[0];
  let h = '<div class="bal-card"><div class="l">' + (bal > 0.01 ? 'Задолженность' : bal < -0.01 ? 'Переплата (аванс)' : 'Задолженности нет') + '</div>' +
    '<div class="v">' + money(Math.abs(bal)) + '</div>' +
    '<div class="row"><button class="pay" onclick="openPay()">Как оплатить</button><button class="req" onclick="openReqForm()">Подать заявку</button></div></div>';
  h += '<div class="tiles">' +
    '<div class="tile" onclick="tab(\'bills\')"><div class="ic">🧾</div><b>' + (last ? money(idx[last].a) : '—') + '</b><span>' + (last ? perName(last) : 'начислений нет') + '</span></div>' +
    '<div class="tile" onclick="openMeters()"><div class="ic">📟</div><b>Счётчики</b><span>передать показания</span></div>' +
    '<div class="tile" onclick="tab(\'req\')"><div class="ic">🛠</div><b>' + ST.requests.filter(r => r.status !== 'done').length + '</b><span>заявок в работе</span></div></div>';
  const pays = ST.payments.filter(p => p.date && (+p.amount || 0) > 0).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 5);
  h += '<div class="card"><h2 class="pt">Последние оплаты</h2>';
  if (!pays.length) h += '<div class="empty small">Оплат пока нет</div>';
  else pays.forEach(p => { h += '<div class="row-item"><div class="ic">💳</div><div><b>Оплата получена</b><span>' + fmtD(p.date) + ' · ' + esc(METHOD[p.method] || p.method || '') + '</span></div><div class="amt pos">+' + money(p.amount) + '</div></div>'; });
  return h + '</div>';
};
function openPay() {
  const bal = rBalance(), o = ST.osi || {}, a = ST.account;
  sheet('<h3>Как оплатить</h3><p class="small muted" style="margin-bottom:12px">Переведите сумму на счёт вашего ОСИ из приложения банка (Kaspi, Halyk и др.). В назначении платежа обязательно укажите номер лицевого счёта и квартиру.</p>' +
    '<div class="card">' +
    '<div class="row-item"><div class="ic">💰</div><div><b>' + money(Math.max(0, bal)) + '</b><span>К оплате</span></div></div>' +
    '<div class="row-item"><div class="ic">🏢</div><div><b>' + esc(o.name || '—') + '</b><span>Получатель' + (o.bin ? ' · БИН ' + esc(o.bin) : '') + '</span></div></div>' +
    '<div class="row-item" onclick="copyText(\'' + esc(o.iban || '') + '\')"><div class="ic">🏦</div><div><b>' + esc(o.iban || 'IBAN не указан — уточните в УК') + '</b><span>' + esc(o.bank || 'IBAN получателя') + (o.iban ? ' · нажмите, чтобы скопировать' : '') + '</span></div></div>' +
    '<div class="row-item" onclick="copyText(\'' + esc('Л/с ' + (a.ls || '') + ', кв. ' + a.apt) + '\')"><div class="ic">🔢</div><div><b>Л/с ' + esc(a.ls || '—') + ', кв. ' + esc(a.apt) + '</b><span>Назначение платежа · нажмите, чтобы скопировать</span></div></div>' +
    '</div><p class="small muted" style="margin:12px 0;text-align:center">Оплата появится здесь, когда деньги поступят на счёт ОСИ и бухгалтер её проведёт.</p>' +
    '<button class="btn-gho" onclick="closeModal()">Закрыть</button>');
}
function openMeters() {
  sheet('<h3>Показания счётчиков</h3><p class="small muted" style="margin-bottom:12px">Заполните только те счётчики, которые у вас есть. Показания уйдут в УК.</p>' +
    '<label class="f"><span>Холодная вода, м³</span><input class="f" id="mt-cold" inputmode="decimal" placeholder="например 84.2"></label>' +
    '<label class="f"><span>Горячая вода, м³</span><input class="f" id="mt-hot" inputmode="decimal" placeholder="например 51.7"></label>' +
    '<label class="f"><span>Электричество, кВт·ч</span><input class="f" id="mt-power" inputmode="decimal"></label>' +
    '<button class="btn-main" id="mt-btn" onclick="metersSave()">Отправить</button><button class="btn-gho" style="margin-top:8px" onclick="closeModal()">Отмена</button>');
}
async function metersSave() {
  const v = id => document.getElementById(id).value.trim();
  const btn = document.getElementById('mt-btn'); btn.disabled = true;
  try { await api('/api/resident/meters', 'POST', { cold: v('mt-cold'), hot: v('mt-hot'), power: v('mt-power') }); closeModal(); toast('Показания отправлены в УК'); await loadResident(); render(); }
  catch (e) { toast(e.message); btn.disabled = false; }
}
VIEWS.bills = function () {
  const idx = rIdx(), pers = Object.keys(idx).sort().reverse();
  let h = '<h2 class="pt">Начисления и оплаты</h2><p class="ps">По месяцам, с разбивкой по услугам</p>';
  if (!pers.length) return h + '<div class="empty">Пока нет начислений</div>';
  pers.forEach(p => {
    const d = idx[p];
    const st = d.a <= 0 ? '' : d.pay >= d.a - 0.01 ? '<span class="pill ok">Оплачено</span>' : d.pay > 0 ? '<span class="pill warn">Частично</span>' : '<span class="pill bad">Не оплачено</span>';
    h += '<div class="card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center"><b>' + perName(p) + '</b>' + st + '</div><div class="hr"></div>';
    for (const sid in d.s) h += '<div class="row-item"><div><b>' + esc(rSvc(sid)) + '</b></div><div class="amt">' + money(d.s[sid]) + '</div></div>';
    d.pays.forEach(x => { h += '<div class="row-item"><div><b class="pos">Оплата</b><span>' + fmtD(x.date) + '</span></div><div class="amt pos">−' + money(x.amount) + '</div></div>'; });
    h += '</div>';
  });
  if (+ST.account.saldoStart) h += '<p class="small muted" style="text-align:center">Входящий ' + (ST.account.saldoStart > 0 ? 'долг' : 'аванс') + (ST.account.saldoDate ? ' на ' + fmtD(ST.account.saldoDate) : '') + ': ' + money(Math.abs(ST.account.saldoStart)) + '</p>';
  return h;
};
VIEWS.req = function () {
  const list = ST.requests.slice().sort((x, y) => String(y.date).localeCompare(String(x.date)));
  let h = '<h2 class="pt">Заявки</h2><p class="ps">Сантехника, электрика, уборка, двор — УК увидит заявку сразу</p><button class="btn-main" style="margin-bottom:14px" onclick="openReqForm()">+ Новая заявка</button>';
  if (!list.length) return h + '<div class="empty">Заявок пока нет</div>';
  h += '<div class="list">';
  list.forEach(r => { h += '<div class="li" style="cursor:default"><div class="t"><b>' + esc(r.topic) + '</b><span>' + fmtD(r.date) + (r.assignee && r.assignee !== '—' ? ' · ' + esc(r.assignee) : '') + '</span>' + (r.notes || []).slice(-1).map(n => '<span>💬 ' + esc(n.text) + '</span>').join('') + '</div><div class="r"><span class="pill ' + (ST_PILL[r.status] || '') + '">' + (ST_NAME[r.status] || r.status) + '</span></div></div>'; });
  return h + '</div>';
};
function openReqForm() {
  sheet('<h3>Новая заявка</h3><label class="f"><span>Что случилось?</span><textarea class="f" id="rq-topic" rows="4" placeholder="Например: в подъезде 2 не горит свет на 3 этаже"></textarea></label>' +
    '<button class="btn-main" id="rq-btn" onclick="reqSave()">Отправить в УК</button><button class="btn-gho" style="margin-top:8px" onclick="closeModal()">Отмена</button>');
  setTimeout(() => { const t = document.getElementById('rq-topic'); if (t) t.focus(); }, 100);
}
async function reqSave() {
  const topic = document.getElementById('rq-topic').value.trim(); if (!topic) { toast('Опишите проблему'); return; }
  const btn = document.getElementById('rq-btn'); btn.disabled = true;
  try { await api('/api/resident/request', 'POST', { topic }); closeModal(); toast('Заявка отправлена'); await loadResident(); tab('req'); }
  catch (e) { toast(e.message); btn.disabled = false; }
}
VIEWS.profile = function () {
  const a = ST.account, o = ST.osi || {};
  return '<h2 class="pt">Профиль</h2><p class="ps">Данные вашего лицевого счёта</p><div class="card">' +
    '<div class="row-item"><div class="ic">👤</div><div><b>' + esc(a.owner || '—') + '</b><span>Собственник</span></div></div>' +
    '<div class="row-item"><div class="ic">🏠</div><div><b>кв. ' + esc(a.apt) + (a.area ? ' · ' + esc(a.area) + ' м²' : '') + '</b><span>' + esc(o.name || '') + (o.address ? ', ' + esc(o.address) : '') + '</span></div></div>' +
    '<div class="row-item"><div class="ic">🔢</div><div><b>' + esc(a.ls || '—') + '</b><span>Лицевой счёт</span></div></div>' +
    '<div class="row-item"><div class="ic">📱</div><div><b>' + esc(a.phone || '—') + '</b><span>Телефон для входа</span></div></div>' +
    (o.chairman ? '<div class="row-item"><div class="ic">🧑‍💼</div><div><b>' + esc(o.chairman) + '</b><span>Председатель ОСИ</span></div></div>' : '') +
    '</div><p class="small muted" style="margin:10px 0 14px">Если данные неверны — напишите заявку, УК исправит.</p>' + installCard(true) +
    '<button class="btn-gho" style="margin-top:14px" onclick="logout()">Выйти</button>';
};

/* ================= СОТРУДНИК ================= */
VIEWS.houses = async function () {
  const d = await cached('summary', '/api/mobile/summary');
  setHeader(d.user.name || 'Сотрудник', (ROLE[d.user.role] || '') + ' · ' + d.houses.length + ' домов');
  let h = '<div class="kpis"><div class="kpi dark"><span>Долг жителей</span><b>' + money(d.totals.debt) + '</b></div>' +
    '<div class="kpi" onclick="tab(\'debtors\')"><span>Должников</span><b>' + d.totals.debtors + '</b></div>' +
    '<div class="kpi" onclick="tab(\'sreq\')"><span>Новых заявок</span><b>' + d.totals.newReq + '</b></div>' +
    '<div class="kpi" onclick="tab(\'sreq\')"><span>Заявок в работе</span><b>' + d.totals.openReq + '</b></div></div>';
  if (!d.houses.length) return h + '<div class="empty">Домов пока нет. Добавьте их в полном кабинете.</div>';
  h += '<div class="list">';
  d.houses.forEach(o => {
    h += '<div class="li" onclick="push(\'house\',\'' + esc(o.id) + '\')"><div class="apt">🏢</div><div class="t"><b>' + esc(o.name) + '</b><span>' + o.apts + ' кв. · должников ' + o.debtors + (o.bigDebtors ? ' (3+ мес: ' + o.bigDebtors + ')' : '') + (o.openReq ? ' · заявок ' + o.openReq : '') + '</span></div>' +
      '<div class="r"><b class="' + (o.debt > 0 ? 'neg' : '') + '">' + money(o.debt) + '</b><span>долг</span></div></div>';
  });
  return h + '</div>';
};
let HF = { q: '', f: 'all' };
VIEWS.house = async function (id) {
  const d = await cached('osi:' + id, '/api/mobile/osi/' + encodeURIComponent(id));
  setHeader(d.osi.name, d.osi.address || (d.accounts.length + ' квартир'));
  const debt = d.accounts.filter(a => a.balance > 0.01);
  let h = '<div class="kpis"><div class="kpi dark"><span>Долг дома</span><b>' + money(debt.reduce((s, a) => s + a.balance, 0)) + '</b></div><div class="kpi"><span>Должников</span><b>' + debt.length + ' из ' + d.accounts.length + '</b></div></div>' +
    '<input class="search" placeholder="Квартира, фамилия или телефон" value="' + esc(HF.q) + '" oninput="HF.q=this.value;houseList(\'' + esc(id) + '\')">' +
    '<div class="chips">' + [['all', 'Все'], ['debt', 'Должники'], ['m3', '3+ мес'], ['adv', 'Переплата']].map(([k, n]) => '<button class="chip' + (HF.f === k ? ' on' : '') + '" onclick="HF.f=\'' + k + '\';render()">' + n + '</button>').join('') + '</div>' +
    '<div id="hlist"></div>';
  setTimeout(() => houseList(id), 0);
  return h;
};
function houseList(id) {
  const d = CACHE['osi:' + id]; const el = document.getElementById('hlist'); if (!d || !el) return;
  const q = HF.q.trim().toLowerCase();
  let list = d.accounts.filter(a => HF.f === 'all' || (HF.f === 'debt' && a.balance > 0.01) || (HF.f === 'm3' && a.balance > 0.01 && a.months >= 3) || (HF.f === 'adv' && a.balance < -0.01));
  if (q) list = list.filter(a => String(a.apt).toLowerCase() === q || String(a.owner || '').toLowerCase().includes(q) || String(a.phone || '').replace(/\D/g, '').includes(q.replace(/\D/g, '') || '#') || String(a.ls || '').includes(q));
  el.innerHTML = list.length ? '<div class="list">' + list.map(accRow).join('') + '</div>' : '<div class="empty">Ничего не найдено</div>';
}
function accRow(a) {
  return '<div class="li" onclick="openAcc(\'' + esc(a.id) + '\')"><div class="apt ' + aptCls(a) + '">' + esc(a.apt) + '</div><div class="t"><b>' + esc(a.owner || '—') + '</b><span>' + (a.osiName ? esc(a.osiName) + ' · ' : '') + (a.phone ? esc(a.phone) : 'нет телефона') + (a.lastPay ? ' · опл. ' + fmtD(a.lastPay) : '') + '</span></div>' +
    '<div class="r"><b class="' + (a.balance > 0.01 ? 'neg' : a.balance < -0.01 ? 'pos' : '') + '">' + money(Math.abs(a.balance)) + '</b><span>' + (a.balance > 0.01 ? (a.months ? monthsTxt(a.months) : 'долг') : a.balance < -0.01 ? 'аванс' : 'нет долга') + '</span></div></div>';
}
let DF = 'all';
VIEWS.debtors = async function () {
  const d = await cached('debtors', '/api/mobile/debtors');
  setHeader('Должники', d.items.length + ' квартир · ' + money(d.items.reduce((s, a) => s + a.balance, 0)));
  const list = d.items.filter(a => DF === 'all' || (DF === 'm3' && a.months >= 3) || (DF === 'm6' && a.months >= 6) || (DF === 'big' && a.balance >= 100000));
  return '<div class="chips">' + [['all', 'Все'], ['m3', '3+ мес'], ['m6', '6+ мес'], ['big', 'от 100 000 ₸']].map(([k, n]) => '<button class="chip' + (DF === k ? ' on' : '') + '" onclick="DF=\'' + k + '\';render()">' + n + '</button>').join('') + '</div>' +
    (list.length ? '<p class="small muted" style="margin-bottom:8px">' + list.length + ' кв. на сумму ' + money(list.reduce((s, a) => s + a.balance, 0)) + '</p><div class="list">' + list.map(accRow).join('') + '</div>' : '<div class="empty">Должников нет 🎉</div>');
};
async function openAcc(id) {
  sheet('<div class="loading">Загрузка…</div>');
  let d; try { d = await api('/api/mobile/account/' + encodeURIComponent(id)); } catch (e) { sheet('<p>' + esc(e.message) + '</p><button class="btn-gho" onclick="closeModal()">Закрыть</button>'); return; }
  const a = d.account, ph = digits(a.phone), osiName = d.osi ? d.osi.name : '';
  window.__acc = d;
  let h = '<h3>Кв. ' + esc(a.apt) + ' · ' + esc(a.owner || '—') + '</h3><p class="small muted">' + esc(osiName) + ' · л/с ' + esc(a.ls || '—') + (a.area ? ' · ' + esc(a.area) + ' м²' : '') + '</p>' +
    (a.otherPayers && a.otherPayers.length ? '<p class="small muted">Также платит: ' + esc(a.otherPayers.join(', ')) + '</p>' : '') +
    '<div class="bal-card" style="margin:12px 0 0"><div class="l">' + (d.balance > 0.01 ? 'Задолженность' : d.balance < -0.01 ? 'Переплата' : 'Долга нет') + ' на ' + fmtD(today()) + '</div><div class="v">' + money(Math.abs(d.balance)) + '</div></div>' +
    '<div class="acts">' +
    (ph ? '<a class="act" href="tel:+' + ph + '"><i>📞</i>Позвонить</a>' : '<button class="act" disabled><i>📞</i>Нет тел.</button>') +
    (ph ? '<a class="act" target="_blank" rel="noopener" href="https://wa.me/' + ph + '?text=' + encodeURIComponent(remindText(d)) + '"><i>💬</i>' + (d.balance > 0.01 ? 'Напомнить' : 'WhatsApp') + '</a>' : '<button class="act" disabled><i>💬</i>WhatsApp</button>') +
    '<button class="act" onclick="invite(\'' + esc(a.id) + '\')"><i>📲</i>Пригласить</button></div>';
  h += '<div class="sec">По месяцам</div>';
  if (!d.months.length) h += '<p class="small muted">Начислений нет</p>';
  else h += '<div class="list">' + d.months.slice(0, 12).map(m => '<div class="li" style="cursor:default"><div class="t"><b>' + perName(m.period) + '</b><span>начислено ' + money(m.acr) + '</span></div><div class="r"><b class="' + (m.pay >= m.acr - 0.01 ? 'pos' : m.pay > 0 ? '' : 'neg') + '">' + money(m.pay) + '</b><span>оплачено</span></div></div>').join('') + '</div>';
  if (a.saldoStart) h += '<p class="small muted" style="margin-top:8px">Входящее сальдо' + (a.saldoDate ? ' на ' + fmtD(a.saldoDate) : '') + ': ' + money(a.saldoStart) + '</p>';
  if (d.requests.length) h += '<div class="sec">Заявки</div><div class="list">' + d.requests.slice(0, 5).map(r => '<div class="li" style="cursor:default"><div class="t"><b>' + esc(r.topic) + '</b><span>' + fmtD(r.date) + '</span></div><div class="r"><span class="pill ' + (ST_PILL[r.status] || '') + '">' + (ST_NAME[r.status] || '') + '</span></div></div>').join('') + '</div>';
  h += '<button class="btn-gho" style="margin-top:14px" onclick="closeModal()">Закрыть</button>';
  sheet(h);
}
function remindText(d) {
  const a = d.account, o = d.osi || {};
  if (d.balance <= 0.01) return 'Здравствуйте, ' + (a.owner || '') + '! ';
  return 'Здравствуйте, ' + (a.owner || '') + '!\nПо квартире ' + a.apt + (o.name ? ' (' + o.name + ')' : '') + ' задолженность на ' + fmtD(today()) + ' — ' + money(d.balance) + '.\n' +
    (o.iban ? 'Оплатить можно переводом на счёт ' + o.iban + (o.bank ? ' (' + o.bank + ')' : '') + ', в назначении укажите л/с ' + (a.ls || '') + ', кв. ' + a.apt + '.\n' : '') +
    'Если уже оплатили — спасибо, не обращайте внимания на сообщение.';
}
async function invite(accId) {
  let d; try { d = await api('/api/mobile/invite', 'POST', { accountId: accId }); } catch (e) { toast(e.message); return; }
  const text = 'Здравствуйте! Это ссылка для входа в приложение Turgyn по вашей квартире ' + d.apt + ': баланс, начисления, заявки и показания счётчиков.\n' + d.link + '\nСсылка одноразовая, действует ' + d.days + ' дней.';
  const ph = digits(d.phone);
  window.__inv = { text, link: d.link };
  sheet('<h3>Приглашение для кв. ' + esc(d.apt) + '</h3><p class="small muted" style="margin-bottom:12px">Отправьте жителю эту ссылку. По ней он войдёт без SMS. Ссылка одноразовая, действует ' + d.days + ' дней — не пересылайте её посторонним.</p>' +
    '<div class="note" style="word-break:break-all">' + esc(d.link) + '</div>' +
    (ph ? '<a class="btn-main" style="display:block;text-align:center;text-decoration:none;margin-top:12px" target="_blank" rel="noopener" href="https://wa.me/' + ph + '?text=' + encodeURIComponent(text) + '">Отправить в WhatsApp</a>' : '<p class="small neg" style="margin-top:10px">У квартиры не указан телефон — скопируйте ссылку и отправьте вручную.</p>') +
    (navigator.share ? '<button class="btn-gho" style="margin-top:8px" onclick="navigator.share({text:window.__inv.text}).catch(()=>{})">Поделиться…</button>' : '') +
    '<button class="btn-gho" style="margin-top:8px" onclick="copyText(window.__inv.text)">Скопировать</button>' +
    '<button class="btn-gho" style="margin-top:8px" onclick="closeModal()">Готово</button>');
}
let RF = 'open';
VIEWS.sreq = async function () {
  const d = await cached('req:' + RF, '/api/mobile/requests?status=' + RF);
  setHeader('Заявки жителей', RF === 'open' ? 'новые и в работе' : RF === 'done' ? 'выполненные' : 'все');
  let h = '<div class="chips">' + [['open', 'Открытые'], ['new', 'Новые'], ['done', 'Выполненные'], ['all', 'Все']].map(([k, n]) => '<button class="chip' + (RF === k ? ' on' : '') + '" onclick="RF=\'' + k + '\';render()">' + n + '</button>').join('') + '</div>';
  if (!d.items.length) return h + '<div class="empty">Заявок нет</div>';
  window.__reqs = {}; d.items.forEach(r => window.__reqs[r.id] = r);
  return h + '<div class="list">' + d.items.map(r => '<div class="li" onclick="openReq(\'' + esc(r.id) + '\')"><div class="t"><b>' + (r.kind === 'meters' ? '📟 ' : '') + esc(r.topic) + '</b><span>' + esc(r.osiName) + (r.apt ? ' · кв. ' + esc(r.apt) : '') + ' · ' + fmtD(r.date) + (r.assignee && r.assignee !== '—' ? ' · ' + esc(r.assignee) : '') + '</span></div><div class="r"><span class="pill ' + (ST_PILL[r.status] || '') + '">' + (ST_NAME[r.status] || r.status) + '</span></div></div>').join('') + '</div>';
};
function openReq(id) {
  const r = window.__reqs[id]; if (!r) return; const ph = digits(r.phone);
  sheet('<h3>' + esc(r.topic) + '</h3><p class="small muted">' + esc(r.osiName) + (r.apt ? ' · кв. ' + esc(r.apt) + ' · ' + esc(r.owner) : '') + ' · ' + fmtD(r.date) + (r.source === 'app' ? ' · из приложения' : '') + '</p>' +
    (ph ? '<div class="acts" style="grid-template-columns:1fr 1fr"><a class="act" href="tel:+' + ph + '"><i>📞</i>Позвонить</a><a class="act" target="_blank" rel="noopener" href="https://wa.me/' + ph + '"><i>💬</i>WhatsApp</a></div>' : '') +
    '<div class="sec">Статус</div><div class="chips" id="rq-st">' + ['new', 'work', 'done'].map(s => '<button class="chip' + (r.status === s ? ' on' : '') + '" data-s="' + s + '" onclick="document.querySelectorAll(\'#rq-st .chip\').forEach(b=>b.classList.toggle(\'on\',b===this))">' + ST_NAME[s] + '</button>').join('') + '</div>' +
    '<label class="f"><span>Исполнитель</span><input class="f" id="rq-as" value="' + esc(r.assignee && r.assignee !== '—' ? r.assignee : '') + '" placeholder="например, сантехник Ерлан"></label>' +
    (r.notes && r.notes.length ? '<div class="sec">Комментарии</div>' + r.notes.map(n => '<div class="note">' + esc(n.text) + '<span>' + esc(n.by) + ' · ' + fmtD(n.at) + '</span></div>').join('') : '') +
    '<label class="f"><span>Комментарий (житель его увидит)</span><textarea class="f" id="rq-note" rows="2" placeholder="например, мастер придёт завтра до 12:00"></textarea></label>' +
    '<button class="btn-main" id="rq-save" onclick="reqUpdate(\'' + esc(r.id) + '\')">Сохранить</button><button class="btn-gho" style="margin-top:8px" onclick="closeModal()">Закрыть</button>');
}
async function reqUpdate(id) {
  const on = document.querySelector('#rq-st .chip.on');
  const body = { status: on ? on.dataset.s : undefined, assignee: document.getElementById('rq-as').value, note: document.getElementById('rq-note').value };
  const btn = document.getElementById('rq-save'); btn.disabled = true;
  try { await api('/api/mobile/requests/' + encodeURIComponent(id), 'POST', body); closeModal(); toast('Заявка обновлена'); render(true); }
  catch (e) { toast(e.message); btn.disabled = false; }
}
VIEWS.more = function () {
  const u = SESS.user || {};
  setHeader(u.name || 'Сотрудник', ROLE[u.role] || '');
  return '<div class="card"><div class="row-item"><div class="ic">👤</div><div><b>' + esc(u.name || '—') + '</b><span>' + esc(ROLE[u.role] || u.role || '') + ' · логин ' + esc(u.login || '') + '</span></div></div></div>' +
    '<a class="btn-main" style="display:block;text-align:center;text-decoration:none;margin-top:14px" href="/cabinet">Открыть полный кабинет</a>' +
    '<p class="small muted" style="margin:8px 0 14px;text-align:center">Начисления, отчёты, закрытие периодов, расходы и настройки — в полном кабинете. На телефоне он тоже открывается.</p>' +
    installCard(true) + '<button class="btn-gho" style="margin-top:14px" onclick="logout()">Выйти</button>';
};

/* ================= УСТАНОВКА НА ТЕЛЕФОН ================= */
function isStandalone() { return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }
function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function installCard(light) {
  if (isStandalone()) return '';
  const cls = 'inst' + (light ? ' inst-l' : '');
  if (DEFERRED) return '<div class="' + cls + '"><b>Установите Turgyn на телефон</b><br>Иконка появится на главном экране, приложение будет открываться без браузера.<button onclick="doInstall()">Установить</button></div>';
  if (isIOS()) return '<div class="' + cls + '"><b>Как установить на iPhone</b><br>1. Откройте эту страницу в Safari.<br>2. Нажмите «Поделиться» (квадрат со стрелкой).<br>3. Выберите «На экран „Домой“».</div>';
  return '<div class="' + cls + '"><b>Как установить на Android</b><br>Откройте меню браузера Chrome (⋮) и выберите «Установить приложение» или «Добавить на главный экран».</div>';
}
function renderInstall() { const el = document.getElementById('au-install'); if (el) el.innerHTML = installCard(false); }
async function doInstall() { if (!DEFERRED) return; DEFERRED.prompt(); try { await DEFERRED.userChoice; } catch (e) { } DEFERRED = null; renderInstall(); if (SESS) render(); }
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); DEFERRED = e; renderInstall(); });
window.addEventListener('appinstalled', () => { DEFERRED = null; toast('Turgyn установлен'); renderInstall(); });

/* ================= ЗАПУСК ================= */
(async function init() {
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => { });
  renderInstall();
  // ссылка-приглашение от УК: /app#i=...
  const m = location.hash.match(/^#i=([A-Za-z0-9_-]+)/);
  if (m) {
    history.replaceState(null, '', location.pathname);
    if (SESS) logout(true);
    await redeemInvite(m[1]); return;
  }
  const st = localStorage.getItem(TOKKEY);
  if (st) {
    let user = null; try { user = JSON.parse(localStorage.getItem(UKEY)); } catch (e) { }
    SESS = { type: 'staff', token: st, user: user || {} };
    try { const me = await api('/api/auth/me'); SESS.user = me.user; localStorage.setItem(UKEY, JSON.stringify(me.user)); showApp(); return; }
    catch (e) { if (e.net) { showApp(); return; } SESS = null; localStorage.removeItem(TOKKEY); localStorage.removeItem(UKEY); }
  }
  let r = null; try { r = JSON.parse(localStorage.getItem(RKEY)); } catch (e) { }
  if (r && r.token) {
    SESS = { type: 'resident', token: r.token };
    try { await loadResident(); showApp(); }
    catch (e) { if (!e.net) { SESS = null; localStorage.removeItem(RKEY); } else { authErr(e.message); SESS = null; } }
  }
})();
