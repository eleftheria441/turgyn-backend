/* =========================================================
   Turgyn — биллинг и учёт для УК и ОСИ
   Данные хранятся на сервере (PostgreSQL), браузер их не кэширует.
   ========================================================= */

/* ---------- icons ---------- */
const IC = {
  dash:'<path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"/>',
  osi:'<path d="M3 21V7l9-4 9 4v14"/><path d="M3 21h18M9 21v-6h6v6M8 9h.01M12 9h.01M16 9h.01M8 13h.01M16 13h.01"/>',
  house:'<path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/>',
  people:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  truck:'<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  tag:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
  calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h4"/>',
  card:'<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  scale:'<path d="M12 3v18M5 7h14M7 7l-4 7a4 4 0 0 0 8 0zM17 7l-4 7a4 4 0 0 0 8 0z"/>',
  swap:'<path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 9.4l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 12 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 2.83 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.91 9H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  money:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
  wallet:'<path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><circle cx="16" cy="14" r="1.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  print:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  alert:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
  ai:'<path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/>'
};
function svg(p,w){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}

/* ---------- storage ---------- */
const KEY='domsfera_db_v1';
const TOKKEY='turgyn_token', UKEY='turgyn_user';
let DB=null, S={user:null, osi:null, view:'dashboard'};
let AUTH_TOKEN=localStorage.getItem(TOKKEY)||null;
let BACKEND_MODE=false; // true, когда сессия подтверждена реальным backend'ом (см. doLogin/initDB)
let saveTimer=null,_IDX=null;
async function apiCall(path,method,body){
  const headers={'Content-Type':'application/json'};
  if(AUTH_TOKEN)headers['Authorization']='Bearer '+AUTH_TOKEN;
  const r=await fetch(path,{method:method||'GET',headers,body:body?JSON.stringify(body):undefined});
  let data={};try{data=await r.json();}catch(e){}
  if(!r.ok){const err=new Error(data.error||'Ошибка сервера');err.api=true;err.status=r.status;throw err;}
  return data;
}
function connBadge(){
  return BACKEND_MODE?'<span class="pill ok" title="Данные сохраняются на сервере">🟢 Сохранено</span>':
    '<span class="pill bad" title="Нет связи с сервером">🔴 Нет связи</span>';
}
/* индекс агрегатов по (счёт→период→{a:начислено, pay:оплачено, s:{услуга:начислено}}) для скорости */
function buildIdx(){const idx={};
  (DB.accruals||[]).forEach(x=>{const m=idx[x.accountId]=idx[x.accountId]||{};const p=m[x.period]=m[x.period]||{a:0,pay:0,s:{}};
    p.a+=x.amount;const sid=x.serviceId||'';p.s[sid]=(p.s[sid]||0)+x.amount;});
  (DB.payments||[]).forEach(x=>{const m=idx[x.accountId]=idx[x.accountId]||{};const p=m[x.period]=m[x.period]||{a:0,pay:0,s:{}};p.pay+=x.amount;
    if(x.serviceId){p.ps=p.ps||{};p.ps[x.serviceId]=(p.ps[x.serviceId]||0)+x.amount;}else p.pu=(p.pu||0)+x.amount;});
  _IDX=idx;return idx;}
function IDX(){return _IDX||buildIdx();}
function accM(accId){return IDX()[accId]||{};}
/* данные по услуге за период: начислено и оплачено (доля) */
/* оплата услуги за период: точная (если в оплате указана услуга) + доля неразнесённой оплаты */
function payOf(d,svcId){if(!d)return 0;const ac=d.s[svcId]||0;return ((d.ps&&d.ps[svcId])||0)+(d.a>0?(d.pu||0)*ac/d.a:0);}
function svcPer(accId,svcId,per){const d=accM(accId)[per];if(!d)return{ac:0,pay:0};const ac=d.s[svcId]||0;return{ac:ac,pay:payOf(d,svcId)};}
/* входящее сальдо по услугам (из импорта долга) и общее */
function accSvcOpen(a){if(!a||!a.saldoBySvc)return 0;let s=0;for(const k in a.saldoBySvc)s+=a.saldoBySvc[k];return s;}
function accOpen(a){return (a?(a.saldoStart||0):0)+accSvcOpen(a);}
/* сальдо по услуге до периода (или всё, если per пуст) */
function svcBal(accId,svcId,per){const a=DB.accounts.find(x=>x.id===accId)||{};
  let b=(a.saldoBySvc&&a.saldoBySvc[svcId])||0;
  const m=accM(accId);for(const p in m){if(per&&!(p<per))continue;const d=m[p];const ac=d.s[svcId]||0;b+=ac-payOf(d,svcId);}return b;}
/* ================= СИНХРОНИЗАЦИЯ С СЕРВЕРОМ =================
   На сервер уходят только изменённые записи. SYNC хранит то, что сервер уже знает,
   — по нему вычисляется разница. Правки коллег приходят в ответе на сохранение
   и при опросе раз в 30 секунд. */
const COLLS=['osi','houses','accounts','services','accruals','payments','providers','provInvoices','provPayments','requests','expenses'];
const SETKEYS=['org','subscription','penalty','importLog','expenseCategories'];
const DEFAULT_EXP_CATS=['Заработная плата','Налоги и отчисления с зарплаты','Содержание и уборка','Вывоз ТБО','Коммунальные услуги на общедомовые нужды','Текущий ремонт','Капитальный ремонт','Обслуживание лифтов','Банковские услуги и комиссии','Хозяйственные расходы','Прочие расходы'];
let SYNC=null;
let SAVING=false,SAVE_AGAIN=false,PENDING=false,RETRY_TIMER=null;
function normalizeDB(){
  COLLS.forEach(c=>{if(!Array.isArray(DB[c]))DB[c]=[];});
  if(!DB.org)DB.org={name:'',bin:'',city:'',phone:''};
  if(!Array.isArray(DB.importLog))DB.importLog=[];
  if(!DB.penalty)DB.penalty={enabled:false,rate:0.05};
  if(!Array.isArray(DB.expenseCategories)||!DB.expenseCategories.length)DB.expenseCategories=DEFAULT_EXP_CATS.slice();
  if(!Array.isArray(DB._locks))DB._locks=[];
  if(!Array.isArray(DB.users))DB.users=[];
}
const sj=v=>JSON.stringify(v===undefined?null:v);
function snapshotSync(){
  SYNC={c:{},s:{},u:new Map()};
  COLLS.forEach(c=>{const m=new Map();DB[c].forEach(r=>{if(r&&r.id)m.set(r.id,sj(r));});SYNC.c[c]=m;});
  SETKEYS.forEach(k=>{SYNC.s[k]=sj(DB[k]);});
  DB.users.forEach(u=>SYNC.u.set(u.id,sj(u)));
}
function computeDiff(){
  const changes={},settings={},snap={c:{},s:{},u:null};let users=null,n=0;
  COLLS.forEach(c=>{
    const prev=SYNC.c[c],seen=new Set(),ups=[],js=[];
    DB[c].forEach(r=>{if(!r)return;if(!r.id)r.id=uid(c);seen.add(r.id);const j=sj(r);if(prev.get(r.id)!==j){ups.push(r);js.push([r.id,j]);}});
    const dels=[];prev.forEach((_,id)=>{if(!seen.has(id))dels.push(id);});
    if(ups.length||dels.length){changes[c]={upsert:ups,delete:dels};snap.c[c]={js,dels};n+=ups.length+dels.length;}
  });
  SETKEYS.forEach(k=>{const j=sj(DB[k]);if(SYNC.s[k]!==j){settings[k]=DB[k];snap.s[k]=j;n++;}});
  if(S.user&&S.user.role==='director'){
    const seen=new Set(),ups=[];
    DB.users.forEach(u=>{seen.add(u.id);if(u.pass||SYNC.u.get(u.id)!==sj(u))ups.push(u);});
    const dels=[];SYNC.u.forEach((_,id)=>{if(!seen.has(id))dels.push(id);});
    if(ups.length||dels.length){users={upsert:ups,delete:dels};snap.u=true;n++;}
  }
  return {changes,settings,users,snap,n};
}
function markSynced(snap){
  Object.keys(snap.c).forEach(c=>{const m=SYNC.c[c];snap.c[c].js.forEach(([id,j])=>m.set(id,j));snap.c[c].dels.forEach(id=>m.delete(id));});
  Object.keys(snap.s).forEach(k=>{SYNC.s[k]=snap.s[k];});
  if(snap.u){DB.users.forEach(u=>{delete u.pass;});SYNC.u=new Map();DB.users.forEach(u=>SYNC.u.set(u.id,sj(u)));}
}
/* применить правки коллег; записи, которые пользователь правит прямо сейчас, не трогаем —
   при сохранении сервер вернёт конфликт и мы перезагрузим данные */
function applyPulled(p){
  if(!p)return false;
  if(p.reset){toast('Данные обновлены директором — загружаю актуальную версию','ok');reloadState();return true;}
  let changed=false;
  Object.keys(p.upsert||{}).forEach(c=>{if(!DB[c])return;
    const pos=new Map();DB[c].forEach((r,i)=>pos.set(r.id,i));
    p.upsert[c].forEach(r=>{const i=pos.get(r.id);
      if(i!==undefined){if(sj(DB[c][i])!==SYNC.c[c].get(r.id))return;DB[c][i]=r;}else{DB[c].push(r);pos.set(r.id,DB[c].length-1);}
      SYNC.c[c].set(r.id,sj(r));changed=true;});});
  Object.keys(p.delete||{}).forEach(c=>{if(!DB[c])return;const del=new Set(p.delete[c]);
    const before=DB[c].length;DB[c]=DB[c].filter(r=>!del.has(r.id));del.forEach(id=>SYNC.c[c].delete(id));if(DB[c].length!==before)changed=true;});
  Object.keys(p.settings||{}).forEach(k=>{DB[k]=p.settings[k];SYNC.s[k]=sj(p.settings[k]);changed=true;});
  if(p.users){DB.users=p.users;SYNC.u=new Map();DB.users.forEach(u=>SYNC.u.set(u.id,sj(u)));changed=true;}
  if(p.locks){DB._locks=p.locks;changed=true;}
  if(p.version>DB._v)DB._v=p.version;
  if(changed){_IDX=null;normalizeDB();if(!document.getElementById('modal-root').innerHTML&&S.user)go(S.view);}
  return changed;
}
function save(){
  _IDX=null;
  if(!(BACKEND_MODE&&AUTH_TOKEN))return;
  PENDING=true;setSaveState('saving');
  clearTimeout(saveTimer);saveTimer=setTimeout(pushState,350);
}
async function pushState(){
  if(SAVING){SAVE_AGAIN=true;return;}
  clearTimeout(RETRY_TIMER);
  const d=computeDiff();
  if(!d.n){PENDING=false;setSaveState('ok');return;}
  SAVING=true;setSaveState('saving');
  try{
    const r=await apiCall('/api/state/changes','POST',{base:DB._v,changes:d.changes,settings:d.settings,users:d.users});
    markSynced(d.snap);
    DB._v=r.version;
    applyPulled(r.pulled);
    if(!SAVE_AGAIN)PENDING=false;
    setSaveState(PENDING?'saving':'ok');
  }catch(e){
    if(e.status===409||e.status===423||e.status===400){
      PENDING=false;
      toast(e.message||'Изменения не приняты','bad');
      await reloadState();
    }else if(e.status===401){
      PENDING=false;toast('Сессия истекла — войдите снова','bad');logout();
    }else{
      // нет связи — изменения остаются в памяти, повторяем
      setSaveState('err');
      toast('Нет связи с сервером. Изменения не сохранены — повторю автоматически, не закрывайте страницу.','bad');
      RETRY_TIMER=setTimeout(pushState,5000);
    }
  }finally{
    SAVING=false;
    if(SAVE_AGAIN){SAVE_AGAIN=false;pushState();}
  }
}
async function pollChanges(){
  if(!(BACKEND_MODE&&AUTH_TOKEN)||SAVING||PENDING||document.hidden)return;
  try{const p=await apiCall('/api/state/since?v='+DB._v);if(!PENDING&&!SAVING)applyPulled(p);}
  catch(e){if(e.status===401){toast('Сессия истекла — войдите снова','bad');logout();}}
}
setInterval(pollChanges,30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)pollChanges();});
async function loadServerState(){DB=await apiCall('/api/state');normalizeDB();snapshotSync();_IDX=null;}
async function reloadState(){
  try{await loadServerState();if(S.osi&&!DB.osi.find(o=>o.id===S.osi))S.osi=DB.osi.length?DB.osi[0].id:null;closeModal();boot();}
  catch(e){toast('Не удалось загрузить данные с сервера','bad');}
}
function setSaveState(st){
  const cb=document.getElementById('conn-badge');if(!cb)return;
  cb.innerHTML=st==='saving'?'<span class="pill mut">Сохранение…</span>':st==='err'?'<span class="pill bad">⚠ Не сохранено</span>':connBadge();
}
/* закрытые периоды */
function isLocked(osiId,per){return !!(DB&&DB._locks||[]).find(l=>l.osiId===osiId&&l.period===per);}
function lockedMsg(per){return 'Период «'+perName(per)+'» закрыт. Исправления вносятся корректировкой в открытом периоде.';}
window.addEventListener('beforeunload',e=>{if(PENDING||SAVING){e.preventDefault();e.returnValue='';}});
function load(){const r=localStorage.getItem(KEY); if(r){try{DB=JSON.parse(r);}catch(e){DB=null;}} if(!DB)seed();}
function initDB(after){
  // локальный кэш на случай отсутствия backend'а или офлайн-режима
  try{const r=localStorage.getItem(KEY);if(r)DB=JSON.parse(r);}catch(e){}
  if(!DB)seed();
  // если есть сохранённый токен сессии — пробуем восстановить реальную серверную сессию без повторного ввода пароля
  if(AUTH_TOKEN){
    loadServerState().then(()=>{
      BACKEND_MODE=true;
      try{S.user=JSON.parse(localStorage.getItem(UKEY));}catch(e){}
      if(after)after(true);
    }).catch(()=>{AUTH_TOKEN=null;localStorage.removeItem(TOKKEY);localStorage.removeItem(UKEY);if(after)after(false);});
  }else{
    if(after)after(false);
  }
}
/* 72 бита случайности: совпадение id исключено даже на миллионах записей */
function uid(p){const b=new Uint8Array(9);crypto.getRandomValues(b);return (p||'id')+'_'+btoa(String.fromCharCode(...b)).replace(/\+/g,'-').replace(/\//g,'_');}

/* ---------- seed ---------- */
function seed(){
  // Пустая заготовка до входа в систему. Реальные данные приходят только с сервера.
  DB={org:{name:'',bin:'',city:'',phone:''},subscription:{plan:'uk',pricePerAccount:35,since:'',status:'active'},
    users:[],osi:[],houses:[],accounts:[],services:[],accruals:[],payments:[],
    providers:[],provInvoices:[],provPayments:[],requests:[],importLog:[],penalty:{enabled:false,rate:0.05}};
}
function seedOsi(name,addr,chair,bin,nApt,baseTariff){
  const oid=uid('osi');
  DB.osi.push({id:oid,name,address:addr,bin,chairman:chair,phone:'+7 702 111 22 33',
    iban:'KZ'+Math.floor(1e17+Math.random()*8e17),bank:'Halyk Bank',createdAt:'2026-01-15',active:true});
  const hid=uid('h');
  DB.houses.push({id:hid,osiId:oid,address:addr,floors:9,entrances:2,totalArea:0});
  // services / tariffs
  const svcDefs=[
    {name:'Содержание жилья (эксплуатационные)',unit:'m2',tariff:baseTariff},
    {name:'Целевой накопительный взнос',unit:'m2',tariff:21.63},
    {name:'Вывоз ТБО',unit:'apt',tariff:600},
    {name:'Домофон',unit:'apt',tariff:300}
  ];
  const svcIds=svcDefs.map(s=>{const id=uid('svc');DB.services.push({id,osiId:oid,...s,active:true});return id;});
  // accounts (лицевые счета)
  let totalArea=0;
  for(let i=1;i<=nApt;i++){
    const area=Math.round((38+Math.random()*40)*10)/10; totalArea+=area;
    const persons=1+Math.floor(Math.random()*4);
    DB.accounts.push({id:uid('acc'),osiId:oid,houseId:hid,ls:String(oid.slice(-3))+String(1000+i),
      apt:String(i),floor:Math.min(9,Math.ceil(i/2)),area,owner:randName(),phone:'+7 777 '+rnd(100,999)+' '+rnd(10,99)+' '+rnd(10,99),
      persons,saldoStart:0});
  }
  const h=DB.houses.find(x=>x.id===hid); h.totalArea=Math.round(totalArea*10)/10;
  // providers
  const provDefs=[
    {name:'ТОО «ГорВодоканал»',service:'Водоснабжение'},
    {name:'АО «Электросети»',service:'Электроэнергия ОДН'},
    {name:'ТОО «ЧистоградУборка»',service:'Клининг / вывоз ТБО'}
  ];
  const provIds=provDefs.map(p=>{const id=uid('prov');DB.providers.push({id,osiId:oid,name:p.name,service:p.service,
    bin:String(rnd(1e11,9e11)),phone:'+7 717 '+rnd(100,999)+' '+rnd(1000,9999),iban:'KZ'+rnd(1e11,9e11)});return id;});
  // generate accruals + payments for 2 periods
  ['2026-05','2026-06'].forEach((per,idx)=>{
    DB.accounts.filter(a=>a.osiId===oid).forEach(acc=>{
      let monthTotal=0;
      svcIds.forEach(sid=>{
        const s=DB.services.find(x=>x.id===sid);
        const base=s.unit==='m2'?acc.area:(s.unit==='person'?acc.persons:1);
        const amount=Math.round(s.tariff*base);
        monthTotal+=amount;
        DB.accruals.push({id:uid('acr'),osiId:oid,accountId:acc.id,serviceId:sid,period:per,
          amount,base,unit:s.unit,createdAt:per+'-01'});
      });
      // ~78% pay fully, some partial, some none
      const r=Math.random();
      let pay=0;
      if(r<0.72)pay=monthTotal; else if(r<0.9)pay=Math.round(monthTotal*(0.3+Math.random()*0.4)); else pay=0;
      if(pay>0)DB.payments.push({id:uid('pay'),osiId:oid,accountId:acc.id,period:per,amount:pay,
        method:['kaspi','card','bank','cash'][rnd(0,3)],date:per+'-'+String(rnd(5,26)).padStart(2,'0')});
    });
    // provider invoices + payments
    provIds.forEach(pid=>{
      const amt=rnd(80,320)*1000;
      DB.provInvoices.push({id:uid('pinv'),osiId:oid,providerId:pid,period:per,amount:amt,
        date:per+'-05',desc:'Услуги за '+per});
      if(Math.random()<0.8)DB.provPayments.push({id:uid('ppay'),osiId:oid,providerId:pid,period:per,
        amount:Math.random()<0.7?amt:Math.round(amt*0.6),date:per+'-20'});
    });
  });
  // sample requests
  ['Течь в подвале, 2 подъезд','Не работает лифт','Замена лампы в подъезде','Вопрос по начислению'].forEach((t,i)=>{
    const acc=DB.accounts.filter(a=>a.osiId===oid)[i];
    DB.requests.push({id:uid('req'),osiId:oid,accountId:acc?acc.id:null,topic:t,
      status:['new','work','done','new'][i],assignee:['—','Ерлан','Техбригада','—'][i],date:'2026-06-'+String(rnd(1,28)).padStart(2,'0')});
  });
}
function randName(){const f=['Асан','Айгерим','Данияр','Гульнара','Тимур','Сауле','Ерлан','Мадина','Бекзат','Алия','Нурлан','Жанна'];
  const l=['Ахметов','Оспанова','Ким','Сулейменов','Нурланова','Ибраев','Смагулова','Тлеубаев','Джандосов','Каримова'];
  return f[rnd(0,f.length-1)]+' '+l[rnd(0,l.length-1)];}
function rnd(a,b){return Math.floor(a+Math.random()*(b-a+1));}

/* ---------- helpers ---------- */
function money(n){n=Math.round(n||0);return n.toLocaleString('ru-RU')+' ₸';}
function money0(n){n=Math.round(n||0);return n.toLocaleString('ru-RU');}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function curOsi(){return DB.osi.find(o=>o.id===S.osi)||null;}
function osiAccounts(oid){return DB.accounts.filter(a=>a.osiId===oid);}
function accBalance(accId){ // положительное = долг
  const a=DB.accounts.find(x=>x.id===accId); let b=accOpen(a);
  DB.accruals.filter(x=>x.accountId===accId).forEach(x=>b+=x.amount);
  DB.payments.filter(x=>x.accountId===accId).forEach(x=>b-=x.amount);
  return b;
}
function provBalance(pid){ let b=0;
  DB.provInvoices.filter(x=>x.providerId===pid).forEach(x=>b+=x.amount);
  DB.provPayments.filter(x=>x.providerId===pid).forEach(x=>b-=x.amount);
  return b;
}
function curMonth(){return new Date().toISOString().slice(0,7);}
function periods(){const set=new Set();DB.accruals.forEach(a=>set.add(a.period));
  DB.payments.forEach(p=>set.add(p.period));(DB.expenses||[]).forEach(x=>set.add(x.period));if(!set.size)set.add(curMonth());
  return [...set].sort().reverse();}
function perName(p){if(String(p).indexOf('-')<0)return String(p)+' г.';
  const ru=['','Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const kz=['','Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'];
  const m=(typeof ALANG!=='undefined'&&ALANG==='kz')?kz:ru;const [y,mm]=p.split('-');return m[+mm]+' '+y;}
function methodName(m){return {kaspi:'Kaspi',card:'Карта',bank:'Банк',cash:'Наличные',correction:'Корректировка'}[m]||m;}
function toast(msg,type){if(typeof D!=='undefined'&&ALANG==='kz'&&D[msg])msg=D[msg];const t=document.createElement('div');t.className='toast '+(type||'');t.innerHTML=msg;
  document.getElementById('toast').appendChild(t);setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.remove(),300);},2600);}

/* ---------- roles ---------- */
const NAV=[
  {g:'Обзор'},
  {v:'dashboard',t:'Дашборд',ic:'dash',roles:['director','accountant','dispatcher']},
  {g:'Клиенты и объекты'},
  {v:'osi',t:'ОСИ (клиенты)',ic:'osi',roles:['director','accountant']},
  {v:'accounts',t:'Лицевые счета',ic:'house',roles:['director','accountant','dispatcher']},
  {v:'providers',t:'Поставщики услуг',ic:'truck',roles:['director','accountant']},
  {v:'services',t:'Услуги и тарифы',ic:'tag',roles:['director','accountant']},
  {g:'Биллинг'},
  {v:'accruals',t:'Начисления',ic:'calc',roles:['director','accountant']},
  {v:'payments',t:'Платежи (приём)',ic:'card',roles:['director','accountant','dispatcher']},
  {v:'receipts',t:'Квитанции',ic:'doc',roles:['director','accountant','dispatcher']},
  {g:'Бухгалтерия'},
  {v:'registers',t:'Реестры',ic:'book',roles:['director','accountant']},
  {v:'balance',t:'Оборотно-сальдовая',ic:'scale',roles:['director','accountant']},
  {v:'reconcile',t:'Акты сверки',ic:'swap',roles:['director','accountant']},
  {v:'expenses',t:'Расходы',ic:'wallet',roles:['director','accountant']},
  {v:'capital',t:'Капремонт',ic:'house',roles:['director','accountant']},
  {v:'pnl',t:'Доходы и расходы',ic:'chart',roles:['director','accountant']},
  {g:'Юридический блок'},
  {v:'legal',t:'Протоколы и взыскание',ic:'doc',roles:['director','accountant']},
  {g:'ИИ-аналитика'},
  {v:'ai',t:'AI-аналитик',ic:'ai',roles:['director','accountant']},
  {g:'Управление'},
  {v:'requests',t:'Заявки жителей',ic:'bell',roles:['director','accountant','dispatcher']},
  {v:'import1c',t:'Импорт из 1С',ic:'doc',roles:['director','accountant']},
  {v:'employees',t:'Сотрудники УК',ic:'users',roles:['director']},
  {v:'leads',t:'Заявки с сайта',ic:'doc',roles:['director']},
  {v:'settings',t:'Настройки',ic:'gear',roles:['director']}
];

/* ---------- язык интерфейса (KZ/RU) ---------- */
let ALANG=localStorage.getItem('turgyn_admin_lang')||'ru';
const KZ={
  groups:{'Обзор':'Шолу','Клиенты и объекты':'Клиенттер мен нысандар','Биллинг':'Биллинг',
    'Бухгалтерия':'Бухгалтерия','Юридический блок':'Заң блогы','ИИ-аналитика':'ИИ-аналитика','Управление':'Басқару'},
  v:{dashboard:'Басты бет',osi:'ОСИ (клиенттер)',accounts:'Жеке шоттар',providers:'Қызмет жеткізушілер',
    services:'Қызметтер мен тарифтер',accruals:'Есептеулер',payments:'Төлемдер (қабылдау)',receipts:'Түбіртектер',registers:'Тізілімдер',
    balance:'Айналым-сальдо',reconcile:'Салыстыру актілері',expenses:'Шығыстар',capital:'Күрделі жөндеу',pnl:'Кірістер мен шығыстар',
    legal:'Хаттамалар мен өндіріп алу',ai:'AI-аналитик',import1c:'1С-тен импорт',requests:'Тұрғын өтінімдері',employees:'БК қызметкерлері',
    leads:'Сайттан өтінімдер',settings:'Баптаулар'}
};
function navT(item){return (ALANG==='kz'&&item&&item.v&&KZ.v[item.v])?KZ.v[item.v]:(item?item.t:'');}
function grpT(g){return (ALANG==='kz'&&KZ.groups[g])?KZ.groups[g]:g;}
function setAdminLang(l){ALANG=l;localStorage.setItem('turgyn_admin_lang',l);applyAdminLang();
  if(S.user){buildNav();go(S.view);}}
function toggleAdminLang(){setAdminLang(ALANG==='ru'?'kz':'ru');}
function applyAdminLang(){
  const g=document.getElementById('lang-toggle');if(g)g.textContent=(ALANG==='ru'?'ҚАЗ':'РУС');
  const sub=document.getElementById('lg-sub');if(sub)sub.textContent=(ALANG==='kz'?'Қызметкерлерге арналған кіру':'Вход для сотрудников');
  const bl=document.getElementById('btn-login');if(bl)bl.textContent=(ALANG==='kz'?'Жүйеге кіру':'Войти в систему');
  const lo=document.getElementById('btn-logout');if(lo)lo.textContent=(ALANG==='kz'?'Шығу':'Выход');
  document.documentElement.lang=ALANG;
}

/* ---------- словарь перевода интерфейса RU→KZ ---------- */
const D={
// кнопки / действия
'Добавить ОСИ':'ОСИ қосу','Добавить счёт':'Шот қосу','Добавить услугу':'Қызмет қосу','Добавить поставщика':'Жеткізуші қосу',
'Добавить сотрудника':'Қызметкер қосу','Новая заявка':'Жаңа өтінім','Принять платёж':'Төлем қабылдау','Начислить за период':'Кезеңге есептеу',
'Сохранить':'Сақтау','Отмена':'Болдырмау','Закрыть':'Жабу','Открыть':'Ашу','Печать / PDF':'Басып шығару / PDF',
'Экспорт (JSON)':'Экспорт (JSON)','Лицевые счета (CSV)':'Жеке шоттар (CSV)','Импорт':'Импорт','Сбросить к демо':'Демоға қайтару',
'Очистить всё':'Барлығын тазалау','Сформировать протокол':'Хаттама жасау','Сформировать расчёт':'Есеп жасау',
'Сформировать заявление':'Өтініш жасау','Сформировать иск':'Талап жасау','Провести':'Өткізу','Оплатить':'Төлеу',
'Создать':'Жасау','Выбрать':'Таңдау','Связаться':'Байланысу','Список':'Тізім','Шахматка':'Шахмат кестесі',
'Накладная':'Жүкқұжат','Оплата':'Төлем','Загрузить':'Жүктеу','Шаблон CSV':'CSV үлгісі','Загрузить отчёт 1С':'1С есебін жүктеу',
'Загрузить регистр площадей':'Алаң тізілімін жүктеу','Активировать пробный период':'Сынақ кезеңін іске қосу','Оформить':'Рәсімдеу',
// сегменты / вкладки
'С собственником':'Меншік иесімен','С поставщиком':'Жеткізушімен','Реестр начислений':'Есептеулер тізілімі',
'Реестр платежей':'Төлемдер тізілімі','Реестр расчётов с поставщиками':'Жеткізушілермен есеп тізілімі',
'Протокол собрания':'Жиналыс хаттамасы','Расчёт задолженности':'Берешек есебі','Исполнительная надпись':'Атқарушылық жазба',
'Исковое заявление':'Талап арыз','Очное голосование':'Ашық дауыс беру',
// статусы
'Активен':'Белсенді','Неактивен':'Белсенді емес','Активна':'Белсенді','Откл.':'Өшірулі','Новая':'Жаңа','В работе':'Орындалуда',
'Выполнена':'Орындалды','Новые':'Жаңа','В работе ':'Орындалуда','Выполнено':'Орындалды',
// заголовки разделов
'Дашборд':'Басты бет','ОСИ / клиенты':'ОСИ / клиенттер','Лицевые счета':'Жеке шоттар','Поставщики услуг':'Қызмет жеткізушілер',
'Услуги и тарифы':'Қызметтер мен тарифтер','Начисления':'Есептеулер','Приём платежей':'Төлемдерді қабылдау','Реестры':'Тізілімдер',
'Оборотно-сальдовая ведомость':'Айналым-сальдо ведомосы','Акты сверки':'Салыстыру актілері','Доходы и расходы':'Кірістер мен шығыстар',
'Юридический блок':'Заң блогы','Заявки жителей':'Тұрғын өтінімдері','Сотрудники УК':'БК қызметкерлері','Подписка и оплата':'Жазылым мен төлем',
'Настройки':'Баптаулар',
// колонки таблиц
'Наименование':'Атауы','БИН':'БСН','Адрес':'Мекенжай','Председатель':'Төраға','Счетов':'Шоттар','Долг':'Берешек','Статус':'Мәртебе',
'Кв.':'Пәтер','Собственник':'Меншік иесі','Телефон':'Телефон','Площадь':'Алаңы','Прожив.':'Тұрғын','Сальдо':'Сальдо','Дата':'Күні',
'Период':'Кезең','Услуга':'Қызмет','Тариф':'Тариф','База начисления':'Есептеу негізі','Сумма':'Сома','Способ':'Тәсіл',
'Начислено':'Есептелді','Оплачено':'Төленді','Итого':'Барлығы','ИТОГО':'БАРЛЫҒЫ','Поставщик':'Жеткізуші','Вид услуги':'Қызмет түрі',
'Выставлено':'Ұсынылды','Операция':'Операция','Исполнитель':'Орындаушы','Тема':'Тақырып','Квартира':'Пәтер','Роль':'Рөл',
'Должность':'Лауазым','Логин':'Логин','Доступ':'Қатынау','Пароль':'Құпиясөз','Л/С':'Ж/Ш','Начислено (дебет)':'Есептелді (дебет)',
'Оплачено (кредит)':'Төленді (кредит)','Пример (60 м²)':'Мысал (60 м²)','Кред. задолж.':'Кред. берешек','Дней просрочки':'Мерзімнен өткен күндер',
'Пеня':'Өсімпұл','Прожив':'Тұрғын','Кв':'Пәтер',
// KPI / метки
'Начислено за месяц':'Айына есептелді','Собрано за месяц':'Айына жиналды','Задолженность':'Берешек','Открытые заявки':'Ашық өтінімдер',
'Лицевых счетов':'Жеке шоттар','Всего ОСИ':'Барлық ОСИ','Жителей':'Тұрғындар','Собираемость платежей':'Төлемдер жинақталуы',
'Доходы':'Кірістер','Расходы':'Шығыстар','Результат':'Нәтиже','Сальдо на начало':'Кезең басындағы сальдо','Сальдо на конец':'Кезең соңындағы сальдо',
'Оборот дебет (начислено)':'Дебет айналымы (есептелді)','Оборот кредит (оплачено)':'Кредит айналымы (төленді)','Крупнейшие должники':'Ірі борышкерлер',
'Доходы (всего собрано)':'Кірістер (барлығы жиналды)','Расходы (поставщикам)':'Шығыстар (жеткізушілерге)','Площадь':'Алаңы',
'Абон. плата к оплате':'Абон. төлемақы','Общая задолженность':'Жалпы берешек','Наличные':'Қолма-қол','Карта/Банк':'Карта/Банк',
'Поступило':'Түсті','Новые':'Жаңа','Выполнено':'Орындалды',
// прочее частое
'Данные УК':'БК деректері','Данные и обслуживание':'Деректер және қызмет көрсету','Свод по услугам':'Қызметтер жиынтығы',
'По периодам':'Кезеңдер бойынша','Расходы по поставщикам':'Жеткізушілер бойынша шығыстар','Как формируется цена':'Баға қалай құралады',
'Приём платежей от жителей':'Тұрғындардан төлем қабылдау','Тарифные планы (по рынку РК)':'Тарифтік жоспарлар (ҚР нарығы)',
'История по периодам':'Кезеңдер бойынша тарих','Город':'Қала','Банк':'Банк',
// тосты
'Сохранено':'Сақталды','ОСИ обновлён':'ОСИ жаңартылды','Счёт обновлён':'Шот жаңартылды','Лицевой счёт добавлен':'Жеке шот қосылды',
'Платёж принят':'Төлем қабылданды','Документ сформирован':'Құжат жасалды','Резервная копия выгружена':'Сақтық көшірме жүктелді',
'Данные импортированы':'Деректер импортталды','Сброшено к демо':'Демоға қайтарылды','Шаблон скачан':'Үлгі жүктелді',
'Накладная проведена':'Жүкқұжат өткізілді','Оплата проведена':'Төлем өткізілді','Заявка создана':'Өтінім жасалды'
};
function localize(root){
  if(ALANG!=='kz'||!root)return;
  root.querySelectorAll('[placeholder]').forEach(el=>{const v=(el.getAttribute('placeholder')||'').trim();if(D[v])el.setAttribute('placeholder',D[v]);});
  root.querySelectorAll('[title]').forEach(el=>{const v=(el.getAttribute('title')||'').trim();if(D[v])el.setAttribute('title',D[v]);});
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);const nodes=[];
  while(w.nextNode())nodes.push(w.currentNode);
  nodes.forEach(n=>{const raw=n.nodeValue;const s=raw.trim();if(!s||s.length<2)return;
    if(D[s]){n.nodeValue=raw.replace(s,D[s]);return;}
    if(s.indexOf(' · ')>=0){const parts=s.split(' · ');let ch=false;
      const np=parts.map(p=>{const k=p.trim();if(D[k]){ch=true;return D[k];}return p;});
      if(ch)n.nodeValue=raw.replace(s,np.join(' · '));}
  });
}

/* ---------- auth ---------- */
async function doLogin(){
  const l=document.getElementById('lg-login').value.trim();
  const p=document.getElementById('lg-pass').value;
  try{
    const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login:l,password:p})});
    let data={};try{data=await r.json();}catch(e){}
    if(r.ok){
      AUTH_TOKEN=data.token;localStorage.setItem(TOKKEY,AUTH_TOKEN);localStorage.setItem(UKEY,JSON.stringify(data.user));
      S.user=data.user;BACKEND_MODE=true;
      document.getElementById('lg-pass').value='';
      await loadServerState();
      await offerMigration();
      if(!S.osi&&DB.osi.length)S.osi=DB.osi[0].id;
      enterApp();
      if(data.user.mustChangePassword)setTimeout(()=>pwdForm(true),300);
      return;
    }
    toast(data.error||'Неверный логин или пароль','bad');
  }catch(netErr){
    toast('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.','bad');
  }
}
/* Однократный перенос данных, которые раньше хранились только в этом браузере */
async function offerMigration(){
  let local=null;try{const r=localStorage.getItem(KEY);if(r)local=JSON.parse(r);}catch(e){}
  if(!local||!Array.isArray(local.osi)||!local.osi.length){return;}
  if(S.user.role!=='director')return;
  const serverEmpty=!DB.osi.length;
  const msg='В этом браузере найдены данные, сохранённые до подключения сервера: '+local.osi.length+' ОСИ, '+((local.accounts||[]).length)+' лицевых счетов.\n\n'+
    (serverEmpty?'Перенести их на сервер?':'ВНИМАНИЕ: на сервере уже есть данные ('+DB.osi.length+' ОСИ). Перенос ЗАМЕНИТ их данными из браузера.\n\nПеренести?')+
    '\n\nОтмена — данные в браузере останутся, перенести можно при следующем входе.';
  if(!confirm(msg))return;
  const next=Object.assign({},local);delete next.users; // сотрудники и пароли — только серверные
  try{
    await apiCall('/api/state/replace','POST',{data:next});
    await loadServerState();
    localStorage.removeItem(KEY);
    toast('Данные перенесены на сервер','ok');
  }catch(e){toast('Перенос не удался: '+(e.message||'ошибка'),'bad');}
}
/* Смена пароля */
function pwdForm(forced){
  modal(forced?'Смените временный пароль':'Смена пароля',
    (forced?'<p class="small muted">Пароль был выдан директором. Для безопасности задайте свой — не короче 10 символов.</p>':'')+
    '<div class="form-grid"><label class="fld full"><span>Текущий пароль</span><input id="pw-old" type="password" autocomplete="current-password"></label>'+
    '<label class="fld full"><span>Новый пароль (от 10 символов)</span><input id="pw-new" type="password" autocomplete="new-password"></label>'+
    '<label class="fld full"><span>Повторите новый пароль</span><input id="pw-new2" type="password" autocomplete="new-password"></label></div>',
    (forced?'':'<button class="btn gho" onclick="closeModal()">Отмена</button>')+'<button class="btn" onclick="pwdSave()">Сохранить</button>');
}
async function pwdSave(){
  const o=document.getElementById('pw-old').value,n=document.getElementById('pw-new').value,n2=document.getElementById('pw-new2').value;
  if(n!==n2){toast('Новые пароли не совпадают','bad');return;}
  if(n.length<10){toast('Пароль — не короче 10 символов','bad');return;}
  try{
    const r=await apiCall('/api/auth/password','POST',{oldPassword:o,newPassword:n});
    AUTH_TOKEN=r.token;localStorage.setItem(TOKKEY,AUTH_TOKEN);
    if(S.user)S.user.mustChangePassword=false;
    closeModal();toast('Пароль изменён. Остальные устройства разлогинены.','ok');
  }catch(e){toast(e.message||'Ошибка','bad');}
}
function enterApp(){
  document.getElementById('login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  boot();
}
function logout(){
  if(BACKEND_MODE&&AUTH_TOKEN)apiCall('/api/auth/logout','POST').catch(()=>{});
  AUTH_TOKEN=null;BACKEND_MODE=false;localStorage.removeItem(TOKKEY);localStorage.removeItem(UKEY);
  S.user=null;DB=null;SYNC=null;PENDING=false;clearTimeout(saveTimer);clearTimeout(RETRY_TIMER);seed();normalizeDB();document.getElementById('app').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
}

function boot(){
  document.getElementById('u-name').textContent=S.user.name;
  document.getElementById('u-role').textContent=S.user.pos;
  document.getElementById('u-av').textContent=S.user.name[0];
  document.getElementById('foot-org').textContent=DB.org.name;
  const cb=document.getElementById('conn-badge');if(cb)cb.innerHTML=connBadge();
  applyAdminLang();
  buildNav(); renderOsiPicker(); go(S.view);
}
function buildNav(){
  const nav=document.getElementById('nav');let h='';
  NAV.forEach(n=>{
    if(n.g){h+='<div class="nav-group">'+grpT(n.g)+'</div>';return;}
    if(!n.roles.includes(S.user.role))return;
    let badge='';
    if(n.v==='requests'){const c=DB.requests.filter(r=>r.osiId===S.osi&&r.status!=='done').length;if(c)badge='<span class="badge">'+c+'</span>';}
    h+='<div class="nav-item" data-v="'+n.v+'" onclick="go(\''+n.v+'\')">'+svg(IC[n.ic])+'<span>'+navT(n)+'</span>'+badge+'</div>';
  });
  nav.innerHTML=h;
}
function renderOsiPicker(){
  const sel=document.getElementById('osi-picker');
  if(!DB.osi.length){document.getElementById('osi-picker-wrap').style.display='none';return;}
  document.getElementById('osi-picker-wrap').style.display='';
  sel.innerHTML=DB.osi.map(o=>'<option value="'+o.id+'">'+esc(o.name)+'</option>').join('');
  sel.value=S.osi;
}
function setActiveOsi(id){S.osi=id;go(S.view);}

/* ---------- router ---------- */
const VIEWS={};
function go(v){
  S.view=v;
  document.querySelectorAll('.nav-item').forEach(e=>e.classList.toggle('active',e.dataset.v===v));
  const meta=NAV.find(n=>n.v===v)||{t:'Дашборд'};
  document.getElementById('pg-title').textContent=navT(meta);
  document.getElementById('pg-path').textContent=DB.org.name+(curOsi()&&v!=='osi'&&v!=='dashboard'&&v!=='employees'&&v!=='leads'&&v!=='settings'&&v!=='import1c'?' · '+curOsi().name:'');
  const need=['accounts','providers','services','accruals','payments','receipts','registers','balance','reconcile','pnl','requests','legal','expenses','capital'];
  if(need.includes(v)&&!curOsi()){
    document.getElementById('view').innerHTML=emptyState('Нет выбранного ОСИ','Сначала добавьте клиента (ОСИ) в разделе «ОСИ (клиенты)».',
      '<button class="btn" onclick="go(\'osi\')">Перейти к ОСИ</button>');
    localize(document.getElementById('view'));
    return;
  }
  document.getElementById('view').innerHTML=(VIEWS[v]||VIEWS.dashboard)();
  buildNav();document.querySelectorAll('.nav-item').forEach(e=>e.classList.toggle('active',e.dataset.v===v));
  localize(document.getElementById('view'));
}
function emptyState(t,s,btn){return '<div class="empty">'+svg(IC.osi)+'<h4>'+t+'</h4><p>'+s+'</p><div style="margin-top:16px">'+(btn||'')+'</div></div>';}
function kpi(cls,ic,lbl,val,sub){return '<div class="kpi '+cls+'"><div class="ic">'+svg(IC[ic])+'</div><div class="lbl">'+lbl+'</div><div class="val">'+val+'</div>'+(sub?'<div class="sub">'+sub+'</div>':'')+'</div>';}
function head(t,s,actions){return '<div class="page-head"><div class="ttl"><h2>'+t+'</h2>'+(s?'<p>'+s+'</p>':'')+'</div><div class="spacer"></div>'+(actions||'')+'</div>';}

/* =======================================================
   VIEWS
   ======================================================= */

VIEWS.dashboard=function(){
  const oid=S.osi;
  const accs=oid?osiAccounts(oid):DB.accounts;
  const per=periods()[0];
  const accrued=DB.accruals.filter(a=>(!oid||a.osiId===oid)&&a.period===per).reduce((s,a)=>s+a.amount,0);
  const collected=DB.payments.filter(p=>(!oid||p.osiId===oid)&&p.period===per).reduce((s,p)=>s+p.amount,0);
  const debt=accs.reduce((s,a)=>{const b=accBalance(a.id);return s+(b>0?b:0);},0);
  const debtors=accs.filter(a=>accBalance(a.id)>0).length;
  const rate=accrued?Math.round(collected/accrued*100):0;
  const openReq=DB.requests.filter(r=>(!oid||r.osiId===oid)&&r.status!=='done').length;
  // pnl
  const income=DB.payments.filter(p=>!oid||p.osiId===oid).reduce((s,p)=>s+p.amount,0);
  const expense=DB.provPayments.filter(p=>!oid||p.osiId===oid).reduce((s,p)=>s+p.amount,0);

  let h=head('Дашборд · '+perName(per),'Ключевые показатели по '+(curOsi()?'«'+esc(curOsi().name)+'»':'всем ОСИ'));
  h+='<div class="grid g4" style="margin-bottom:16px">'+
    kpi('','calc','Начислено за месяц',money(accrued),accs.length+' лицевых счетов')+
    kpi('g','money','Собрано за месяц',money(collected),'Собираемость '+rate+'%')+
    kpi('r','alert','Задолженность',money(debt),debtors+' должников')+
    kpi('a','bell','Открытые заявки',openReq,'из '+DB.requests.filter(r=>!oid||r.osiId===oid).length+' всего')+
    '</div>';
  // collection bar
  h+='<div class="grid g2">';
  h+='<div class="card"><h3>Собираемость платежей — '+perName(per)+'</h3>'+
     '<div style="margin:16px 0 6px;height:14px;background:var(--bg2);border-radius:20px;overflow:hidden;border:1px solid var(--line2)">'+
     '<div style="height:100%;width:'+Math.min(100,rate)+'%;background:linear-gradient(90deg,var(--brand),var(--ok))"></div></div>'+
     '<div class="small muted">Собрано '+money(collected)+' из '+money(accrued)+' начисленных</div>'+
     '<div class="hr"></div><div class="grid g2">'+
       '<div><div class="small muted">Доходы (всего собрано)</div><div style="font-size:20px;font-weight:800" class="pos">'+money(income)+'</div></div>'+
       '<div><div class="small muted">Расходы (поставщикам)</div><div style="font-size:20px;font-weight:800" class="neg">'+money(expense)+'</div></div>'+
     '</div></div>';
  // top debtors
  const top=accs.map(a=>({a,b:accBalance(a.id)})).filter(x=>x.b>0).sort((x,y)=>y.b-x.b).slice(0,6);
  h+='<div class="card"><h3>Крупнейшие должники</h3><div class="t-wrap" style="border:none;margin-top:10px">'+
     '<table><tbody>'+(top.length?top.map(x=>'<tr><td><b>кв. '+esc(x.a.apt)+'</b> · '+esc(x.a.owner)+'<div class="small muted">'+esc(curOsiName(x.a.osiId))+'</div></td><td class="num neg" style="font-weight:800">'+money(x.b)+'</td></tr>').join(''):'<tr><td class="muted" style="padding:20px">Должников нет 🎉</td></tr>')+'</tbody></table></div></div>';
  h+='</div>';
  if(oid&&(S.user.role==='director'||S.user.role==='accountant')){
    const hi=aiTopRisks(oid,50).filter(x=>x.r.level==='bad').length;
    h+='<div class="card" style="margin-top:16px;background:linear-gradient(135deg,#0f2e26,#0c2320);border-color:#163f34;color:#eafaf5;display:flex;align-items:center;gap:14px;flex-wrap:wrap">'+
       '<span class="ai-badge" style="margin:0">✦ AI</span>'+
       '<div style="flex:1;min-width:200px">'+(hi?('Высокий риск невозврата у <b>'+hi+'</b> лицевых счетов.'):'Счетов с высоким риском не выявлено.')+' Прогноз, аномалии и приоритизация заявок — в разделе AI-аналитик.</div>'+
       '<button class="btn sec sm" onclick="go(\'ai\')">Открыть AI-аналитик</button></div>';
  }
  return h;
};
function curOsiName(oid){const o=DB.osi.find(x=>x.id===oid);return o?o.name:'';}

/* ---------- modal ---------- */
function modal(title,body,footer,lg){
  document.getElementById('modal-root').innerHTML=
   '<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal'+(lg?' lg':'')+'">'+
   '<div class="modal-h"><h3>'+title+'</h3><div class="x" onclick="closeModal()">&times;</div></div>'+
   '<div class="modal-b">'+body+'</div>'+(footer?'<div class="modal-f">'+footer+'</div>':'')+'</div></div>';
  localize(document.getElementById('modal-root'));
}
function closeModal(){document.getElementById('modal-root').innerHTML='';}
function val(id){const e=document.getElementById(id);return e?e.value.trim():'';}

/* ================= ОСИ (КЛИЕНТЫ) ================= */
VIEWS.osi=function(){
  const list=DB.osi;
  let h=head('ОСИ / клиенты','Объединения собственников имущества, обслуживаемые вашей УК',
    '<button class="btn" onclick="osiForm()">'+svg(IC.plus)+'Добавить ОСИ</button>');
  // KPIs
  const totalAcc=DB.accounts.length;
  const totalDebt=DB.accounts.reduce((s,a)=>{const b=accBalance(a.id);return s+(b>0?b:0);},0);
  h+='<div class="grid g4" style="margin-bottom:18px">'+
    kpi('','osi','Всего ОСИ',list.length,'на обслуживании')+
    kpi('','house','Лицевых счетов',totalAcc,'по всем ОСИ')+
    kpi('r','alert','Общая задолженность',money(totalDebt),'по всем объектам')+
    kpi('g','wallet','Абон. плата к оплате',money(totalAcc*DB.subscription.pricePerAccount),DB.subscription.pricePerAccount+' ₸ × счёт / мес')+
    '</div>';
  if(!list.length)return h+emptyState('Пока нет ни одного ОСИ','Добавьте первого клиента, чтобы начать вести учёт и биллинг.',
    '<button class="btn" onclick="osiForm()">'+svg(IC.plus)+'Добавить ОСИ</button>');
  h+='<div class="t-wrap"><table><thead><tr><th>Наименование</th><th>БИН</th><th>Адрес</th><th>Председатель</th>'+
     '<th class="num">Счетов</th><th class="num">Долг</th><th>Статус</th><th></th></tr></thead><tbody>';
  list.forEach(o=>{
    const accs=osiAccounts(o.id);
    const debt=accs.reduce((s,a)=>{const b=accBalance(a.id);return s+(b>0?b:0);},0);
    h+='<tr>'+
      '<td><b>'+esc(o.name)+'</b><div class="small muted">создан '+esc(o.createdAt)+'</div></td>'+
      '<td class="mono">'+esc(o.bin)+'</td>'+
      '<td class="small">'+esc(o.address)+'</td>'+
      '<td>'+esc(o.chairman)+'<div class="small muted">'+esc(o.phone)+'</div></td>'+
      '<td class="num">'+accs.length+'</td>'+
      '<td class="num '+(debt>0?'neg':'')+'">'+money(debt)+'</td>'+
      '<td>'+(o.active?'<span class="pill ok">Активен</span>':'<span class="pill mut">Неактивен</span>')+'</td>'+
      '<td class="num"><button class="btn sec sm" onclick="openOsi(\''+o.id+'\')">Открыть</button> '+
        '<button class="btn gho sm" onclick="osiForm(\''+o.id+'\')">'+svg(IC.edit)+'</button> '+
        '<button class="btn danger sm" onclick="osiDeletePrompt(\''+o.id+'\')" title="Удалить ОСИ">'+svg(IC.trash)+'</button></td>'+
    '</tr>';
  });
  h+='</tbody></table></div>';
  return h;
};
function openOsi(id){S.osi=id;renderOsiPicker();document.getElementById('osi-picker').value=id;go('accounts');}
function osiForm(id){
  const o=id?DB.osi.find(x=>x.id===id):{};
  modal((id?'Редактировать ОСИ':'Новый ОСИ / клиент'),
    '<div class="form-grid">'+
    fld('Наименование ОСИ*','of-name',o.name,'ЖК «Название»','full')+
    fld('БИН','of-bin',o.bin,'123456789012')+
    fld('Город','of-city',o.city||DB.org.city,'Астана')+
    fld('Адрес*','of-addr',o.address,'ул. ..., дом ...','full')+
    fld('Председатель','of-chair',o.chairman,'ФИО')+
    fld('Телефон','of-phone',o.phone,'+7 ...')+
    fld('IBAN текущего счёта (содержание)','of-iban',o.iban,'KZ...')+
    fld('Банк текущего счёта','of-bank',o.bank,'Halyk Bank')+
    fld('IBAN сберегательного счёта (капремонт)','of-siban',o.savingsIban,'KZ...')+
    fld('Банк сберегательного счёта','of-sbank',o.savingsBank,'Halyk Bank')+
    '</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button>'+
    '<button class="btn" onclick="osiSave(\''+(id||'')+'\')">'+svg(IC.check)+'Сохранить</button>');
}
function fld(label,id,v,ph,cls,type){return '<label class="fld'+(cls?' '+cls:'')+'"><span>'+label+'</span><input id="'+id+'" type="'+(type||'text')+'" value="'+esc(v||'')+'" placeholder="'+esc(ph||'')+'"></label>';}
function osiSave(id){
  const name=val('of-name'),addr=val('of-addr');
  if(!name){toast('Укажите наименование ОСИ','bad');return;}
  if(id){const o=DB.osi.find(x=>x.id===id);Object.assign(o,{name,bin:val('of-bin'),city:val('of-city'),
    address:addr,chairman:val('of-chair'),phone:val('of-phone'),iban:val('of-iban'),bank:val('of-bank'),savingsIban:val('of-siban'),savingsBank:val('of-sbank')});
    toast('ОСИ обновлён','ok');}
  else{const nid=uid('osi');DB.osi.push({id:nid,name,bin:val('of-bin'),city:val('of-city'),address:addr,
    chairman:val('of-chair'),phone:val('of-phone'),iban:val('of-iban'),bank:val('of-bank'),savingsIban:val('of-siban'),savingsBank:val('of-sbank'),
    createdAt:new Date().toISOString().slice(0,10),active:true});
    S.osi=nid; toast('ОСИ добавлен. Теперь заполните дом и лицевые счета.','ok');}
  save();closeModal();renderOsiPicker();go('osi');
}
function osiDeletePrompt(id){const o=DB.osi.find(x=>x.id===id);if(!o)return;
  const n=osiAccounts(id).length;
  modal('Удаление клиента (ОСИ)',
    '<p style="line-height:1.6">Вы удаляете клиента <b>'+esc(o.name)+'</b> и <b>все</b> его данные: '+n+' лицевых счетов, начисления, оплаты, поставщиков, услуги и заявки.<br><span class="neg">Действие необратимо.</span></p>'+
    '<label class="fld" style="margin-top:14px"><span>Введите название ОСИ «'+esc(o.name)+'» для подтверждения</span><input id="del-pass" type="text" placeholder="'+esc(o.name)+'" autocomplete="off"></label>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button>'+
    '<button class="btn danger" onclick="osiDelete(\''+id+'\')">'+svg(IC.trash)+'Удалить ОСИ</button>');
}
function osiDelete(id){
  const o0=DB.osi.find(x=>x.id===id);
  if(val('del-pass')!==(o0&&o0.name)){toast('Название ОСИ введено неверно','bad');return;}
  const accIds=osiAccounts(id).map(a=>a.id);
  DB.accounts=DB.accounts.filter(a=>a.osiId!==id);
  DB.houses=DB.houses.filter(h=>h.osiId!==id);
  DB.services=DB.services.filter(s=>s.osiId!==id);
  DB.accruals=DB.accruals.filter(x=>x.osiId!==id&&accIds.indexOf(x.accountId)<0);
  DB.payments=DB.payments.filter(x=>x.osiId!==id&&accIds.indexOf(x.accountId)<0);
  DB.providers=DB.providers.filter(p=>p.osiId!==id);
  DB.provInvoices=DB.provInvoices.filter(x=>x.osiId!==id);
  DB.provPayments=DB.provPayments.filter(x=>x.osiId!==id);
  DB.requests=DB.requests.filter(x=>x.osiId!==id);
  DB.osi=DB.osi.filter(o=>o.id!==id);
  if(S.osi===id)S.osi=DB.osi[0]?DB.osi[0].id:null;
  save();closeModal();renderOsiPicker();go('osi');toast('Клиент (ОСИ) удалён','ok');
}

/* ================= ЛИЦЕВЫЕ СЧЕТА ================= */
let ACC_MODE='list';
VIEWS.accounts=function(){
  const oid=S.osi, accs=osiAccounts(oid);
  const totalArea=accs.reduce((s,a)=>s+a.area,0);
  const debt=accs.reduce((s,a)=>{const b=accBalance(a.id);return s+(b>0?b:0);},0);
  let h=head('Лицевые счета · '+esc(curOsi().name),accs.length+' счетов · '+totalArea.toFixed(1)+' м²',
    '<div class="seg" style="margin-right:8px"><button class="'+(ACC_MODE==='list'?'on':'')+'" onclick="ACC_MODE=\'list\';go(\'accounts\')">Список</button>'+
    '<button class="'+(ACC_MODE==='chess'?'on':'')+'" onclick="ACC_MODE=\'chess\';go(\'accounts\')">Шахматка</button></div>'+
    '<button class="btn" onclick="accForm()">'+svg(IC.plus)+'Добавить счёт</button>');
  h+='<div class="grid g4" style="margin-bottom:16px">'+
    kpi('','house','Лицевых счетов',accs.length)+
    kpi('','tag','Площадь',totalArea.toFixed(1)+' м²')+
    kpi('r','alert','Задолженность',money(debt))+
    kpi('g','people','Жителей',accs.reduce((s,a)=>s+(a.persons||0),0))+'</div>';
  if(!accs.length)return h+emptyState('Нет лицевых счетов','Добавьте квартиры/собственников для этого ОСИ.',
    '<button class="btn" onclick="accForm()">'+svg(IC.plus)+'Добавить счёт</button>');
  if(ACC_MODE==='chess'){
    h+='<div class="card"><h3>Шахматка дома — '+esc(curOsi().name)+'</h3><p class="small muted" style="margin:6px 0 14px">Зелёные — без долга, красные — задолженность. Клик открывает лицевой счёт.</p><div class="chess">';
    accs.slice().sort((a,b)=>(+a.apt)-(+b.apt)).forEach(a=>{const b=accBalance(a.id);
      h+='<div class="cell '+(b>0?'debt':'paid')+'" onclick="accCard(\''+a.id+'\')"><b>кв.'+esc(a.apt)+'</b><div class="s">'+a.area+' м²</div><div class="s '+(b>0?'neg':'pos')+'">'+(b>0?money0(b):'0')+'</div></div>';
    });
    h+='</div></div>';return h;
  }
  // колонки по услугам данного ОСИ
  const _svcSet={};DB.accruals.filter(x=>x.osiId===oid).forEach(x=>_svcSet[x.serviceId||'']=1);
  accs.forEach(a=>{if(a.saldoBySvc)for(const k in a.saldoBySvc)_svcSet[k]=1;});
  const svcList=Object.keys(_svcSet).map(sid=>({id:sid,name:(DB.services.find(s=>s.id===sid)||{}).name||'Прочее'})).sort((a,b)=>a.name<b.name?-1:1);
  const hasOld=accs.some(a=>Math.round(a.saldoStart||0)!==0);
  const bcell=v=>'<td class="num '+(v>0?'neg':(v<0?'pos':''))+'">'+(Math.round(v)===0?'—':money0(v))+'</td>';
  h+='<div class="t-wrap"><table><thead><tr><th>Л/С</th><th>Кв.</th><th>Собственник</th><th class="num">Площадь</th>'+
     (hasOld?'<th class="num">Прошлые</th>':'')+
     svcList.map(s=>'<th class="num" title="'+esc(s.name)+'">'+esc(s.name)+'</th>').join('')+
     '<th class="num">Итого долг</th><th></th></tr></thead><tbody>';
  accs.slice().sort((a,b)=>(+a.apt)-(+b.apt)).forEach(a=>{const b=accBalance(a.id);
    h+='<tr onclick="accCard(\''+a.id+'\')" style="cursor:pointer"><td class="mono">'+esc(a.ls)+'</td><td><b>'+esc(a.apt)+'</b></td>'+
      '<td>'+esc(a.owner)+'</td><td class="num">'+a.area+' м²</td>'+
      (hasOld?bcell(a.saldoStart||0):'')+
      svcList.map(s=>bcell(svcBal(a.id,s.id,''))).join('')+
      '<td class="num '+(b>0?'neg':(b<0?'pos':''))+'" style="font-weight:800">'+(b>0?money0(b):(b<0?'−'+money0(-b):'0'))+'</td>'+
      '<td class="num"><button class="btn gho sm" onclick="event.stopPropagation();accForm(\''+a.id+'\')">'+svg(IC.edit)+'</button></td></tr>';
  });
  h+='</tbody></table></div>';
  return h;
};
function accForm(id){
  const a=id?DB.accounts.find(x=>x.id===id):{};
  modal(id?'Редактировать лицевой счёт':'Новый лицевой счёт',
    '<div class="form-grid">'+
    fld('№ квартиры/помещения*','af-apt',a.apt,'12')+
    fld('Лицевой счёт','af-ls',a.ls,'авто, если пусто')+
    fld('Собственник*','af-owner',a.owner,'ФИО','full')+
    fld('Телефон','af-phone',a.phone,'+7 ...')+
    fld('Площадь, м²*','af-area',a.area,'54.2','','number')+
    fld('Проживает, чел.','af-persons',a.persons,'3','','number')+
    fld('Вх. сальдо (долг +, аванс −)','af-saldo',a.saldoStart||0,'0','','number')+
    '</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button>'+
    '<button class="btn" onclick="accSave(\''+(id||'')+'\')">'+svg(IC.check)+'Сохранить</button>');
}
function accSave(id){
  const apt=val('af-apt'),owner=val('af-owner'),area=parseFloat(val('af-area'))||0;
  if(!apt||!owner){toast('Заполните квартиру и собственника','bad');return;}
  const data={apt,owner,area,phone:val('af-phone'),persons:parseInt(val('af-persons'))||0,
    saldoStart:parseFloat(val('af-saldo'))||0};
  if(id){Object.assign(DB.accounts.find(x=>x.id===id),data);toast('Счёт обновлён','ok');}
  else{const ls=val('af-ls')||(String(S.osi.slice(-3))+String(1000+osiAccounts(S.osi).length+1));
    DB.accounts.push({id:uid('acc'),osiId:S.osi,houseId:(DB.houses.find(x=>x.osiId===S.osi)||{}).id,ls,...data});
    toast('Лицевой счёт добавлен','ok');}
  save();closeModal();go('accounts');
}
function accCard(id){
  const a=DB.accounts.find(x=>x.id===id);const b=accBalance(id);
  const acrs=DB.accruals.filter(x=>x.accountId===id).sort((x,y)=>x.period<y.period?1:-1);
  const pays=DB.payments.filter(x=>x.accountId===id).sort((x,y)=>x.date<y.date?1:-1);
  let rows='';const byPer={};
  acrs.forEach(x=>{byPer[x.period]=(byPer[x.period]||0)+x.amount;});
  Object.keys(byPer).sort().reverse().forEach(p=>{
    const paid=pays.filter(y=>y.period===p).reduce((s,y)=>s+y.amount,0);
    rows+='<tr><td>'+perName(p)+'</td><td class="num">'+money(byPer[p])+'</td><td class="num pos">'+money(paid)+'</td><td class="num '+(byPer[p]-paid>0?'neg':'')+'">'+money(byPer[p]-paid)+'</td></tr>';
  });
  modal('Лицевой счёт '+esc(a.ls)+' · кв. '+esc(a.apt),
    '<div class="grid g2" style="margin-bottom:14px">'+
    '<div><div class="small muted">Собственник</div><b>'+esc(a.owner)+'</b><div class="small muted">'+esc(a.phone)+'</div></div>'+
    '<div><div class="small muted">Текущее сальдо</div><div style="font-size:22px;font-weight:800" class="'+(b>0?'neg':'pos')+'">'+(b>0?money(b)+' долг':(b<0?money(-b)+' аванс':'0 ₸'))+'</div></div>'+
    '</div><div class="grid g3" style="margin-bottom:14px">'+
    '<div class="tag">Площадь: '+a.area+' м²</div><div class="tag">Прожив.: '+(a.persons||'—')+'</div><div class="tag">Вх.сальдо: '+money(a.saldoStart||0)+'</div></div>'+
    '<h3 style="margin-bottom:8px">История по периодам</h3><div class="t-wrap"><table><thead><tr><th>Период</th><th class="num">Начислено</th><th class="num">Оплачено</th><th class="num">Долг</th></tr></thead><tbody>'+
    (rows||'<tr><td colspan="4" class="muted" style="padding:16px">Нет операций</td></tr>')+'</tbody></table></div>',
    '<button class="btn sec" onclick="closeModal();payForm(\''+id+'\')">'+svg(IC.card)+'Принять платёж</button>'+
    '<button class="btn gho" onclick="closeModal()">Закрыть</button>',true);
}

/* ================= ПОСТАВЩИКИ ================= */
VIEWS.providers=function(){
  const oid=S.osi, list=DB.providers.filter(p=>p.osiId===oid);
  let h=head('Поставщики услуг · '+esc(curOsi().name),'Контрагенты и взаиморасчёты',
    '<button class="btn" onclick="provForm()">'+svg(IC.plus)+'Добавить поставщика</button>');
  if(!list.length)return h+emptyState('Нет поставщиков','Добавьте контрагентов (вода, свет, вывоз ТБО и т.д.).',
    '<button class="btn" onclick="provForm()">'+svg(IC.plus)+'Добавить поставщика</button>');
  h+='<div class="t-wrap"><table><thead><tr><th>Поставщик</th><th>Услуга</th><th>БИН</th>'+
     '<th class="num">Выставлено</th><th class="num">Оплачено</th><th class="num">Кред. задолж.</th><th></th></tr></thead><tbody>';
  list.forEach(p=>{
    const inv=DB.provInvoices.filter(x=>x.providerId===p.id).reduce((s,x)=>s+x.amount,0);
    const paid=DB.provPayments.filter(x=>x.providerId===p.id).reduce((s,x)=>s+x.amount,0);
    h+='<tr><td><b>'+esc(p.name)+'</b><div class="small muted">'+esc(p.phone||'')+'</div></td><td>'+esc(p.service)+'</td>'+
      '<td class="mono small">'+esc(p.bin)+'</td><td class="num">'+money(inv)+'</td><td class="num pos">'+money(paid)+'</td>'+
      '<td class="num '+(inv-paid>0?'neg':'')+'" style="font-weight:700">'+money(inv-paid)+'</td>'+
      '<td class="num"><button class="btn sec sm" onclick="provInvForm(\''+p.id+'\')">Накладная</button> '+
      '<button class="btn sec sm" onclick="provPayForm(\''+p.id+'\')">Оплата</button> '+
      '<button class="btn gho sm" onclick="provForm(\''+p.id+'\')">'+svg(IC.edit)+'</button></td></tr>';
  });
  h+='</tbody></table></div>';
  return h;
};
function provForm(id){const p=id?DB.providers.find(x=>x.id===id):{};
  modal(id?'Редактировать поставщика':'Новый поставщик',
    '<div class="form-grid">'+fld('Наименование*','pf-name',p.name,'ТОО «...»','full')+
    fld('Вид услуги','pf-svc',p.service,'Водоснабжение')+fld('БИН','pf-bin',p.bin,'')+
    fld('Телефон','pf-phone',p.phone,'')+fld('IBAN','pf-iban',p.iban,'KZ...')+
    '<label class="fld full"><span>Статья расходов для отчёта</span><select id="pf-cat">'+expCatOptions(p.category||'Содержание и уборка')+'</select></label></div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="provSave(\''+(id||'')+'\')">'+svg(IC.check)+'Сохранить</button>');}
function provSave(id){const name=val('pf-name');if(!name){toast('Укажите наименование','bad');return;}
  const d={name,service:val('pf-svc'),bin:val('pf-bin'),phone:val('pf-phone'),iban:val('pf-iban'),category:val('pf-cat')};
  if(id)Object.assign(DB.providers.find(x=>x.id===id),d);
  else DB.providers.push({id:uid('prov'),osiId:S.osi,...d});
  save();closeModal();go('providers');toast('Сохранено','ok');}
function provInvForm(pid){const p=DB.providers.find(x=>x.id===pid);
  modal('Накладная от '+esc(p.name),'<div class="form-grid">'+
    perSelectFld('pi-per')+fld('Сумма, ₸*','pi-amt','','150000','','number')+
    fld('Дата','pi-date',today(),'','','')+fld('Описание','pi-desc','','Услуги за период','full')+'</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="provInvSave(\''+pid+'\')">Провести</button>');}
function provInvSave(pid){const amt=parseFloat(val('pi-amt'))||0;if(!amt){toast('Укажите сумму','bad');return;}if(!guardPeriod(val('pi-per')))return;
  DB.provInvoices.push({id:uid('pinv'),osiId:S.osi,providerId:pid,period:val('pi-per'),amount:amt,date:val('pi-date'),desc:val('pi-desc')});
  save();closeModal();go('providers');toast('Накладная проведена','ok');}
function provPayForm(pid){const p=DB.providers.find(x=>x.id===pid);const bal=provBalance(pid);
  modal('Оплата поставщику '+esc(p.name),'<p class="small muted" style="margin-bottom:12px">Текущая задолженность: <b class="neg">'+money(bal)+'</b></p><div class="form-grid">'+
    perSelectFld('pp-per')+fld('Сумма, ₸*','pp-amt',bal>0?bal:'','','','number')+fld('Дата','pp-date',today(),'','','')+'</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="provPaySave(\''+pid+'\')">Оплатить</button>');}
function provPaySave(pid){const amt=parseFloat(val('pp-amt'))||0;if(!amt){toast('Укажите сумму','bad');return;}if(!guardPeriod(val('pp-per')))return;
  DB.provPayments.push({id:uid('ppay'),osiId:S.osi,providerId:pid,period:val('pp-per'),amount:amt,date:val('pp-date')});
  save();closeModal();go('providers');toast('Оплата проведена','ok');}

/* ================= УСЛУГИ И ТАРИФЫ ================= */
VIEWS.services=function(){
  const oid=S.osi, list=DB.services.filter(s=>s.osiId===oid);
  let h=head('Услуги и тарифы · '+esc(curOsi().name),'Тарифы для начисления жителям',
    '<button class="btn" onclick="svcForm()">'+svg(IC.plus)+'Добавить услугу</button>');
  if(!list.length)return h+emptyState('Нет услуг','Добавьте услуги и тарифы (содержание, вода, ТБО и т.д.).',
    '<button class="btn" onclick="svcForm()">'+svg(IC.plus)+'Добавить услугу</button>');
  h+='<div class="t-wrap"><table><thead><tr><th>Услуга</th><th>Тариф</th><th>База начисления</th><th class="num">Пример (60 м²)</th><th>Статус</th><th></th></tr></thead><tbody>';
  list.forEach(s=>{const ex=s.unit==='m2'?s.tariff*60:(s.unit==='person'?s.tariff*3:s.tariff);
    h+='<tr><td><b>'+esc(s.name)+'</b></td><td class="mono">'+money(s.tariff)+' / '+unitName(s.unit)+'</td>'+
      '<td>'+unitFull(s.unit)+'</td><td class="num">'+money(ex)+'</td>'+
      '<td>'+(s.active!==false?'<span class="pill ok">Активна</span>':'<span class="pill mut">Откл.</span>')+'</td>'+
      '<td class="num"><button class="btn gho sm" onclick="svcForm(\''+s.id+'\')">'+svg(IC.edit)+'</button></td></tr>';});
  h+='</tbody></table></div>';
  return h;
};
function unitName(u){return {m2:'м²',apt:'квартиру',person:'чел.'}[u]||u;}
function unitFull(u){return {m2:'за м² площади',apt:'фикс. за лицевой счёт',person:'за проживающего'}[u]||u;}
function svcForm(id){const s=id?DB.services.find(x=>x.id===id):{unit:'m2'};
  modal(id?'Редактировать услугу':'Новая услуга',
    '<div class="form-grid">'+fld('Наименование*','sf-name',s.name,'Содержание жилья','full')+
    fld('Тариф, ₸*','sf-tariff',s.tariff,'45','','number')+
    '<label class="fld"><span>База начисления</span><select id="sf-unit">'+
      ['m2','apt','person'].map(u=>'<option value="'+u+'"'+(s.unit===u?' selected':'')+'>'+unitFull(u)+'</option>').join('')+
    '</select></label>'+
    '<label class="fld full"><span>Куда зачисляются деньги</span><select id="sf-fund">'+
      '<option value="current"'+(svcFund(s)==='current'?' selected':'')+'>Текущий счёт — содержание дома</option>'+
      '<option value="savings"'+(svcFund(s)==='savings'?' selected':'')+'>Сберегательный счёт — капитальный ремонт</option></select></label></div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="svcSave(\''+(id||'')+'\')">'+svg(IC.check)+'Сохранить</button>');}
function svcSave(id){const name=val('sf-name'),tariff=parseFloat(val('sf-tariff'))||0;
  if(!name){toast('Укажите наименование','bad');return;}
  const d={name,tariff,unit:val('sf-unit'),fund:val('sf-fund')||'current',active:true};
  if(id)Object.assign(DB.services.find(x=>x.id===id),d);
  else DB.services.push({id:uid('svc'),osiId:S.osi,...d});
  save();closeModal();go('services');toast('Сохранено','ok');}
function today(){return new Date().toISOString().slice(0,10);}
function nowStr(){return new Date().toISOString().slice(0,16).replace('T',' ');}
function logImport(period,file,extra){DB.importLog=(DB.importLog||[]).filter(x=>x.period!==period);
  DB.importLog.push(Object.assign({period:period,file:file,at:nowStr()},extra||{}));}
function penaltyCfg(){if(!DB.penalty)DB.penalty={enabled:false,rate:0.05};return DB.penalty;}
function penaltyOn(){return !!penaltyCfg().enabled;}
function penaltyRate(){return penaltyOn()?((penaltyCfg().rate||0)/100):0;}
function penToggle(v){penaltyCfg().enabled=!!v;save();go('settings');}
function penRate(v){penaltyCfg().rate=parseFloat(v)||0;save();}
function openPeriods(){const ps=periods().filter(p=>/^\d{4}-\d{2}$/.test(p)&&!isLocked(S.osi,p));const nx=nextPeriod();if(!ps.includes(nx)&&!isLocked(S.osi,nx))ps.unshift(nx);return ps;}
function perSelectFld(id,sel){const ps=openPeriods();if(!sel){const cm=curMonth();if(ps.includes(cm))sel=cm;}
  return '<label class="fld"><span>Период</span><select id="'+id+'">'+ps.map(p=>'<option value="'+p+'"'+(p===sel?' selected':'')+'>'+perName(p)+'</option>').join('')+'</select></label>';}
/* проверка перед записью в период */
function guardPeriod(per,osiId){if(isLocked(osiId||S.osi,per)){toast(lockedMsg(per),'bad');return false;}return true;}
function flushSave(){return new Promise(res=>{let n=0;const t=setInterval(()=>{if((!PENDING&&!SAVING)||++n>100){clearInterval(t);res();}},150);if(PENDING&&!SAVING){clearTimeout(saveTimer);pushState();}});}
async function periodClose(per){
  if(!confirm('Закрыть период «'+perName(per)+'» для '+curOsi().name+'?\n\nПосле закрытия начисления, оплаты и расходы этого месяца нельзя будет изменить или удалить — только исправить корректировкой в открытом периоде. Открыть период сможет только директор, с указанием причины.'))return;
  await flushSave();
  try{await apiCall('/api/state/periods/close','POST',{osiId:S.osi,period:per});await pollNow();toast('Период «'+perName(per)+'» закрыт','ok');}
  catch(e){toast(e.message||'Ошибка','bad');}
}
async function periodOpen(per){
  const reason=prompt('Открыть период «'+perName(per)+'».\n\nУкажите причину — она сохранится в журнале:');
  if(reason===null)return;
  if(reason.trim().length<5){toast('Причина — не короче 5 символов','bad');return;}
  await flushSave();
  try{await apiCall('/api/state/periods/open','POST',{osiId:S.osi,period:per,reason:reason.trim()});await pollNow();toast('Период открыт','ok');}
  catch(e){toast(e.message||'Ошибка','bad');}
}
async function pollNow(){try{const p=await apiCall('/api/state/since?v='+DB._v);applyPulled(p);}catch(e){}go(S.view);}
function periodBar(per){
  if(!/^\d{4}-\d{2}$/.test(per||''))return '';
  const lk=(DB._locks||[]).find(l=>l.osiId===S.osi&&l.period===per);const role=S.user.role;
  if(lk)return '<div class="card" style="margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#f4f7f7">'+
    '<span class="pill mut">🔒 Период закрыт</span><span class="small muted">'+(lk.closedBy?esc(lk.closedBy)+' · ':'')+(lk.closedAt?new Date(lk.closedAt).toLocaleDateString('ru-RU'):'')+'</span><span style="flex:1"></span>'+
    (role==='director'?'<button class="btn gho sm" onclick="periodOpen(\''+per+'\')">Открыть период</button>':'')+'</div>';
  return '<div class="card" style="margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">'+
    '<span class="pill ok">Период открыт</span><span class="small muted">Когда месяц сверен — закройте его, чтобы данные нельзя было случайно изменить.</span><span style="flex:1"></span>'+
    (role!=='dispatcher'?'<button class="btn sec sm" onclick="periodClose(\''+per+'\')">🔒 Закрыть период</button>':'')+'</div>';
}

/* ================= НАЧИСЛЕНИЯ ================= */
let ACR_PER=null;
VIEWS.accruals=function(){
  const oid=S.osi;const ps=periods();if(!ACR_PER||!ps.includes(ACR_PER))ACR_PER=ps[0];
  const accs=osiAccounts(oid),svcs=DB.services.filter(s=>s.osiId===oid&&s.active!==false);
  const acrs=DB.accruals.filter(a=>a.osiId===oid&&a.period===ACR_PER);
  const total=acrs.reduce((s,a)=>s+a.amount,0);
  let h=head('Начисления · '+esc(curOsi().name),'Массовое начисление по тарифам',
    '<label class="fld" style="margin-right:8px"><select onchange="acrPerChange(this.value)">'+
      ps.map(p=>'<option value="'+p+'"'+(p===ACR_PER?' selected':'')+'>'+perName(p)+'</option>').join('')+
      '<option value="__new">+ Новый период...</option></select></label>'+
    '<button class="btn sec" onclick="corrForm(\'accrual\')">'+svg(IC.edit)+'Корректировка</button>'+
    (isLocked(oid,ACR_PER)?'':'<button class="btn" onclick="genAccruals()">'+svg(IC.calc)+'Начислить за период</button>'));
  h+=periodBar(ACR_PER);
  h+='<div class="grid g4" style="margin-bottom:16px">'+
    kpi('','calc','Начислено за '+perName(ACR_PER),money(total))+
    kpi('','house','Счетов',accs.length)+
    kpi('','tag','Услуг в тарифе',svcs.length)+
    kpi('','doc','Строк начислений',acrs.length)+'</div>';
  if(!svcs.length)return h+emptyState('Нет тарифов','Добавьте услуги и тарифы, затем начислите.',
    '<button class="btn" onclick="go(\'services\')">К тарифам</button>');
  // breakdown by service
  h+='<div class="card" style="margin-bottom:16px"><h3>Свод по услугам — '+perName(ACR_PER)+'</h3><div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Услуга</th><th>Тариф</th><th class="num">Счетов</th><th class="num">Итого начислено</th></tr></thead><tbody>';
  svcs.forEach(s=>{const rows=acrs.filter(a=>a.serviceId===s.id);const sum=rows.reduce((x,a)=>x+a.amount,0);
    h+='<tr><td>'+esc(s.name)+'</td><td class="mono small">'+money(s.tariff)+'/'+unitName(s.unit)+'</td><td class="num">'+rows.length+'</td><td class="num" style="font-weight:700">'+money(sum)+'</td></tr>';});
  h+='</tbody><tfoot><tr><td colspan="3">ИТОГО</td><td class="num">'+money(total)+'</td></tr></tfoot></table></div></div>';
  // per account
  h+='<div class="t-wrap"><table><thead><tr><th>Кв.</th><th>Собственник</th><th class="num">Площадь</th>'+
     svcs.map(s=>'<th class="num">'+esc(s.name.split(' ')[0])+'</th>').join('')+'<th class="num">Итого</th></tr></thead><tbody>';
  accs.slice().sort((a,b)=>(+a.apt)-(+b.apt)).forEach(a=>{let row=0;
    let cells=svcs.map(s=>{const v=acrs.filter(x=>x.accountId===a.id&&x.serviceId===s.id).reduce((t,x)=>t+x.amount,0);row+=v;return '<td class="num">'+(v?money0(v):'—')+'</td>';}).join('');
    h+='<tr><td><b>'+esc(a.apt)+'</b></td><td class="small">'+esc(a.owner)+'</td><td class="num">'+a.area+'</td>'+cells+'<td class="num" style="font-weight:700">'+money(row)+'</td></tr>';});
  h+='</tbody></table></div>';
  h+=corrList(DB.accruals.filter(a=>a.osiId===oid&&a.kind==='correction'&&a.period===ACR_PER),'accrual');
  return h;
};
function acrPerChange(v){if(v==='__new'){newPeriodPrompt();go('accruals');return;}ACR_PER=v;go('accruals');}
function genAccruals(){
  const oid=S.osi,per=ACR_PER;
  const accs=osiAccounts(oid),svcs=DB.services.filter(s=>s.osiId===oid&&s.active!==false&&(+s.tariff||0)>0);
  if(!svcs.length){toast('Нет услуг с тарифом — укажите тариф в «Услугах и тарифах»','bad');return;}
  if(!guardPeriod(per,oid))return;
  // пересчёт периода: плановые начисления заменяются, корректировки сохраняются
  DB.accruals=DB.accruals.filter(a=>!(a.osiId===oid&&a.period===per&&a.kind!=='correction'));
  let n=0,tot=0;
  accs.forEach(acc=>{svcs.forEach(s=>{const base=s.unit==='m2'?acc.area:(s.unit==='person'?(acc.persons||1):1);
    const amount=Math.round(s.tariff*base);tot+=amount;n++;
    DB.accruals.push({id:uid('acr'),osiId:oid,accountId:acc.id,serviceId:s.id,period:per,amount,base,unit:s.unit,createdAt:per+'-01'});});});
  save();go('accruals');toast('Начислено '+money(tot)+' по '+n+' строкам','ok');
}
function newPeriodPrompt(){
  modal('Новый расчётный период','<label class="fld"><span>Период (ГГГГ-ММ)</span><input id="np-per" placeholder="2026-07" value="'+nextPeriod()+'"></label>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="ACR_PER=val(\'np-per\');closeModal();genAccruals()">Создать и начислить</button>');
}
function nextPeriod(){const ps=periods().filter(p=>/^\d{4}-\d{2}$/.test(p));if(!ps.length)return curMonth();const last=ps[0].split('-');let y=+last[0],m=+last[1]+1;if(m>12){m=1;y++;}return y+'-'+String(m).padStart(2,'0');}

/* ================= ПЛАТЕЖИ ================= */
let PAY_PER=null;
VIEWS.payments=function(){
  const oid=S.osi;const ps=periods();if(!PAY_PER)PAY_PER='all';
  let pays=DB.payments.filter(p=>p.osiId===oid);
  if(PAY_PER!=='all')pays=pays.filter(p=>p.period===PAY_PER);
  pays=pays.sort((a,b)=>a.date<b.date?1:-1);
  const total=pays.reduce((s,p)=>s+p.amount,0);
  const byMethod={};pays.forEach(p=>byMethod[p.method]=(byMethod[p.method]||0)+p.amount);
  let h=head('Приём платежей · '+esc(curOsi().name),'Регистрация поступлений от жителей',
    '<label class="fld" style="margin-right:8px"><select onchange="PAY_PER=this.value;go(\'payments\')">'+
      '<option value="all"'+(PAY_PER==='all'?' selected':'')+'>Все периоды</option>'+
      ps.map(p=>'<option value="'+p+'"'+(p===PAY_PER?' selected':'')+'>'+perName(p)+'</option>').join('')+'</select></label>'+
    '<button class="btn sec" onclick="corrForm(\'payment\')">'+svg(IC.edit)+'Корректировка</button>'+
    '<button class="btn" onclick="payForm()">'+svg(IC.plus)+'Принять платёж</button>');
  h+='<div class="grid g4" style="margin-bottom:16px">'+
    kpi('g','money','Поступило',money(total),pays.length+' платежей')+
    kpi('','card','Kaspi',money(byMethod.kaspi||0))+
    kpi('','card','Карта/Банк',money((byMethod.card||0)+(byMethod.bank||0)))+
    kpi('','wallet','Наличные',money(byMethod.cash||0))+'</div>';
  if(!pays.length)return h+emptyState('Нет платежей','Зарегистрируйте первое поступление.',
    '<button class="btn" onclick="payForm()">'+svg(IC.plus)+'Принять платёж</button>');
  if(PAY_PER!=='all')h=h.replace('<div class="grid g4"',periodBar(PAY_PER)+'<div class="grid g4"');
  h+='<div class="t-wrap"><table><thead><tr><th>Дата</th><th>Л/С · Кв.</th><th>Собственник</th><th>Период</th><th>Способ</th><th class="num">Сумма</th><th></th></tr></thead><tbody>';
  pays.forEach(p=>{const a=DB.accounts.find(x=>x.id===p.accountId)||{};const lk=isLocked(oid,p.period);
    h+='<tr><td>'+esc(p.date)+'</td><td class="mono small">'+esc(a.ls||'')+' · '+esc(a.apt||'')+'</td><td>'+esc(a.owner||'')+
      (p.kind==='correction'?'<div class="small muted">Корректировка: '+esc(p.reason||'')+'</div>':'')+'</td>'+
      '<td>'+perName(p.period)+(lk?' 🔒':'')+'</td><td><span class="pill '+(p.kind==='correction'?'warn':'info')+'">'+(p.kind==='correction'?'Корректировка':methodName(p.method))+'</span></td>'+
      '<td class="num '+(p.amount<0?'neg':'pos')+'" style="font-weight:700">'+money(p.amount)+'</td>'+
      '<td class="num">'+(lk?'':'<button class="btn gho sm" title="Удалить" onclick="payDel(\''+p.id+'\')">'+svg(IC.trash)+'</button>')+'</td></tr>';});
  h+='</tbody><tfoot><tr><td colspan="5">ИТОГО</td><td class="num">'+money(total)+'</td><td></td></tr></tfoot></table></div>';
  return h;
};
function payForm(accId){
  const oid=S.osi,accs=osiAccounts(oid);
  const preBal=accId?accBalance(accId):0;
  modal('Приём платежа',
    '<div class="form-grid">'+
    '<label class="fld full"><span>Лицевой счёт*</span><select id="py-acc">'+
      accs.map(a=>'<option value="'+a.id+'"'+(a.id===accId?' selected':'')+'>кв.'+esc(a.apt)+' · '+esc(a.owner)+' · долг '+money0(accBalance(a.id))+'</option>').join('')+'</select></label>'+
    perSelectFld('py-per')+
    fld('Сумма, ₸*','py-amt',preBal>0?preBal:'','','','number')+
    '<label class="fld"><span>Способ оплаты</span><select id="py-method"><option value="kaspi">Kaspi</option><option value="card">Карта</option><option value="bank">Банк</option><option value="cash">Наличные</option></select></label>'+
    fld('Дата','py-date',today(),'','','')+'</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="paySave()">'+svg(IC.check)+'Провести</button>');
}
function paySave(){const acc=val('py-acc'),amt=parseFloat(val('py-amt'))||0;
  if(!acc||!amt){toast('Заполните счёт и сумму','bad');return;}
  if(!guardPeriod(val('py-per')))return;
  DB.payments.push({id:uid('pay'),osiId:S.osi,accountId:acc,period:val('py-per'),amount:amt,method:val('py-method'),date:val('py-date')});
  save();closeModal();go('payments');toast('Платёж принят','ok');}
function payDel(id){const p=DB.payments.find(x=>x.id===id);if(!p)return;
  if(!guardPeriod(p.period,p.osiId))return;
  const a=DB.accounts.find(x=>x.id===p.accountId)||{};
  if(!confirm('Удалить платёж '+money(p.amount)+' от '+(a.owner||'')+' за '+perName(p.period)+'?\n\nУдалённый платёж сохранится в журнале.'))return;
  DB.payments=DB.payments.filter(x=>x.id!==id);save();go('payments');toast('Платёж удалён','ok');}

/* ================= КОРРЕКТИРОВКИ =================
   Ошибку в закрытом периоде не исправляют задним числом: в открытом периоде
   делается запись с плюсом или минусом, причиной и ссылкой на исходный месяц. */
function corrForm(type){
  const oid=S.osi,accs=osiAccounts(oid).slice().sort((a,b)=>(+a.apt)-(+b.apt));
  const svcs=DB.services.filter(s=>s.osiId===oid);
  const allPers=periods().filter(p=>/^\d{4}-\d{2}$/.test(p));
  modal(type==='accrual'?'Корректировка начисления':'Корректировка оплаты',
    '<p class="small muted" style="margin-bottom:12px">Сумма со знаком «минус» уменьшает '+(type==='accrual'?'начисление':'оплату')+', «плюс» — увеличивает. Запись попадёт в выбранный открытый период.</p>'+
    '<div class="form-grid">'+
    '<label class="fld full"><span>Лицевой счёт*</span><select id="cr-acc">'+accs.map(a=>'<option value="'+a.id+'">кв.'+esc(a.apt)+' · '+esc(a.owner)+'</option>').join('')+'</select></label>'+
    (type==='accrual'?'<label class="fld full"><span>Услуга*</span><select id="cr-svc">'+svcs.map(s=>'<option value="'+s.id+'">'+esc(s.name)+'</option>').join('')+'</select></label>':'')+
    fld('Сумма, ₸* (со знаком)','cr-amt','','-1500','','number')+
    perSelectFld('cr-per')+
    '<label class="fld"><span>За какой период исправление</span><select id="cr-ref"><option value="">—</option>'+allPers.map(p=>'<option value="'+p+'">'+perName(p)+(isLocked(oid,p)?' 🔒':'')+'</option>').join('')+'</select></label>'+
    fld('Причина*','cr-reason','','Например: неверная площадь кв. 12','full')+'</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="corrSave(\''+type+'\')">'+svg(IC.check)+'Провести</button>');
}
function corrSave(type){
  const acc=val('cr-acc'),amt=parseFloat(val('cr-amt')),per=val('cr-per'),reason=val('cr-reason'),ref=val('cr-ref');
  if(!acc||!amt){toast('Укажите счёт и сумму','bad');return;}
  if(reason.length<5){toast('Укажите причину корректировки','bad');return;}
  if(!guardPeriod(per))return;
  const base={id:uid(type==='accrual'?'acr':'pay'),osiId:S.osi,accountId:acc,period:per,amount:Math.round(amt*100)/100,kind:'correction',reason:reason,refPeriod:ref||null,createdBy:S.user.login,createdAt:nowStr()};
  if(type==='accrual'){const sv=DB.services.find(s=>s.id===val('cr-svc'))||{};DB.accruals.push(Object.assign(base,{serviceId:sv.id||null,unit:sv.unit||null}));}
  else DB.payments.push(Object.assign(base,{method:'correction',date:today()}));
  save();closeModal();go(type==='accrual'?'accruals':'payments');toast('Корректировка проведена','ok');
}
function corrList(rows,type){
  if(!rows.length)return '';
  let h='<div class="card" style="margin-top:16px"><h3>Корректировки за период</h3><div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Кв.</th><th>Собственник</th>'+(type==='accrual'?'<th>Услуга</th>':'')+'<th>Причина</th><th>За период</th><th>Кто</th><th class="num">Сумма</th><th></th></tr></thead><tbody>';
  rows.forEach(r=>{const a=DB.accounts.find(x=>x.id===r.accountId)||{};const sv=DB.services.find(x=>x.id===r.serviceId)||{};const lk=isLocked(r.osiId,r.period);
    h+='<tr><td>'+esc(a.apt||'')+'</td><td class="small">'+esc(a.owner||'')+'</td>'+(type==='accrual'?'<td class="small">'+esc(sv.name||'—')+'</td>':'')+
      '<td class="small">'+esc(r.reason||'')+'</td><td class="small">'+(r.refPeriod?perName(r.refPeriod):'—')+'</td><td class="small muted">'+esc(r.createdBy||'')+'</td>'+
      '<td class="num '+(r.amount<0?'neg':'pos')+'" style="font-weight:700">'+money(r.amount)+'</td>'+
      '<td class="num">'+(lk?'':'<button class="btn gho sm" onclick="corrDel(\''+type+'\',\''+r.id+'\')">'+svg(IC.trash)+'</button>')+'</td></tr>';});
  return h+'</tbody></table></div></div>';
}
function corrDel(type,id){const coll=type==='accrual'?'accruals':'payments';const r=DB[coll].find(x=>x.id===id);if(!r)return;
  if(!guardPeriod(r.period,r.osiId))return;if(!confirm('Удалить корректировку '+money(r.amount)+'?'))return;
  DB[coll]=DB[coll].filter(x=>x.id!==id);save();go(type==='accrual'?'accruals':'payments');}

/* ================= КВИТАНЦИИ ================= */
let RCP_ACC=null,RCP_PER=null;
VIEWS.receipts=function(){
  const oid=S.osi,accs=osiAccounts(oid),o=curOsi()||{};
  const ps=periods();if(!RCP_PER||ps.indexOf(RCP_PER)<0)RCP_PER=ps[0];
  let h=head('Квитанции','Выберите клиента (ОСИ) и период — все квитанции по дому, просмотр и печать',
    '<button class="btn" onclick="printAllReceipts()">'+svg(IC.print)+'Печать всех (A4 · 4/лист)</button>');
  h+='<div class="toolbar">'+
    '<label class="fld" style="margin:0"><span style="font-size:11px">Клиент (ОСИ)</span><select onchange="S.osi=this.value;renderOsiPicker();go(\'receipts\')">'+DB.osi.map(x=>'<option value="'+x.id+'"'+(x.id===oid?' selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></label>'+
    '<label class="fld" style="margin:0"><span style="font-size:11px">Период</span><select onchange="RCP_PER=this.value;go(\'receipts\')">'+ps.map(p=>'<option value="'+p+'"'+(p===RCP_PER?' selected':'')+'>'+perName(p)+'</option>').join('')+'</select></label>'+
    '<span style="flex:1"></span>'+
    '<label class="btn gho sm" style="cursor:pointer">'+svg(IC.doc)+(o.qrKaspi?'QR Kaspi ✓':'QR Kaspi')+'<input type="file" accept="image/*" style="display:none" onchange="qrUpload(this,\'Kaspi\')"></label>'+
    '<label class="btn gho sm" style="cursor:pointer">'+svg(IC.doc)+(o.qrHalyk?'QR Halyk ✓':'QR Halyk')+'<input type="file" accept="image/*" style="display:none" onchange="qrUpload(this,\'Halyk\')"></label>'+
    '</div>';
  if(!accs.length)return h+emptyState('Нет лицевых счетов','У этого ОСИ нет квартир.','');
  h+='<div class="small muted" style="margin-bottom:12px">Квитанций по дому: <b>'+accs.length+'</b> за '+perName(RCP_PER)+'. Пролистайте для проверки, затем «Печать всех».</div>';
  h+='<div id="rcp-print" style="display:flex;flex-direction:column;gap:18px;align-items:center">';
  accs.slice().sort((a,b)=>(+a.apt)-(+b.apt)).forEach(a=>{h+=receiptHtml(a.id,RCP_PER);});
  h+='</div>';
  return h;
};
function qrUpload(input,which){const f=input.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{const o=curOsi();o['qr'+which]=e.target.result;save();go('receipts');toast('QR '+which+' загружен','ok');};
  r.readAsDataURL(f);input.value='';}
function fakeQR(seed,color){color=color||'#10352a';let s=7;const str=String(seed);for(let i=0;i<str.length;i++)s=(s*31+str.charCodeAt(i))>>>0;
  const rnd=()=>{s=(s*1103515245+12345)>>>0;return (s>>>16)/65535;};
  const n=21,q=2,t=n+q*2;let rects='';
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const fin=(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7);let on;
    if(fin){const lx=x<7?x:x-(n-7),ly=y<7?y:y-(n-7);on=(lx===0||lx===6||ly===0||ly===6||(lx>=2&&lx<=4&&ly>=2&&ly<=4));}else on=rnd()>0.5;
    if(on)rects+='<rect x="'+x+'" y="'+y+'" width="1" height="1"/>';}
  return '<svg viewBox="'+(-q)+' '+(-q)+' '+t+' '+t+'" width="74" height="74" shape-rendering="crispEdges" fill="'+color+'" style="display:block">'+
    '<rect x="'+(-q)+'" y="'+(-q)+'" width="'+t+'" height="'+t+'" fill="#fff"/>'+rects+'</svg>';}
function qrImg(o,which){const v=o&&o['qr'+which];
  if(v)return '<img src="'+v+'" style="width:74px;height:74px;object-fit:contain;display:block;background:#fff">';
  return fakeQR((o?o.id:'')+which,which==='Kaspi'?'#f14635':'#0a9d4f');}
function receiptHtml(accId,per,compact){
  const a=DB.accounts.find(x=>x.id===accId);if(!a)return '';
  const o=curOsi()||{};
  const fs=compact?'9px':'12.5px', pad=compact?'2px 4px':'6px 8px';
  const cS='padding:'+pad+';border:1px solid #d7e6e2', cSr=cS+';text-align:right;font-variant-numeric:tabular-nums';
  const svcSet={};const m=accM(accId);for(const p in m)for(const sid in m[p].s)svcSet[sid]=1;
  if(a.saldoBySvc)for(const k in a.saldoBySvc)svcSet[k]=1;
  const svcIds=Object.keys(svcSet).sort((x,y)=>{const nx=(DB.services.find(s=>s.id===x)||{}).name||'я';const ny=(DB.services.find(s=>s.id===y)||{}).name||'я';return nx<ny?-1:1;});
  let rows='',tOpen=0,tPaid=0,tAccr=0;
  if(Math.round(a.saldoStart||0)!==0){tOpen+=a.saldoStart;
    rows+='<tr><td style="'+cS+'">Задолженность прошлых лет</td><td style="'+cSr+'">'+money0(a.saldoStart)+'</td><td style="'+cSr+'">—</td><td style="'+cS+'">—</td><td style="'+cSr+'">—</td><td style="'+cSr+'">—</td><td style="'+cSr+'">—</td><td style="'+cSr+'">'+money0(a.saldoStart)+'</td></tr>';}
  svcIds.forEach(sid=>{const s=DB.services.find(x=>x.id===sid)||{};const nm=s.name||'Прочее';
    const opening=svcBal(accId,sid,per);const cur=svcPer(accId,sid,per);const ac=cur.ac,pay=Math.round(cur.pay);
    if(opening===0&&ac===0&&pay===0)return;
    const ul=(s.unit==='m2')?'м²':(s.unit==='person'?'чел.':'усл.');
    const qty=(s.unit==='m2')?(a.area||0):(s.unit==='person'?(a.persons||1):1);
    const price=qty>0&&ac?Math.round(ac/qty):0;const toPay=opening+ac-pay;
    tOpen+=opening;tPaid+=pay;tAccr+=ac;
    rows+='<tr><td style="'+cS+'">'+esc(nm)+'</td><td style="'+cSr+'">'+money0(opening)+'</td><td style="'+cSr+'">'+(pay?money0(pay):'—')+'</td><td style="'+cS+'">'+ul+'</td><td style="'+cSr+'">'+(qty||'—')+'</td><td style="'+cSr+'">'+(price?money0(price):'—')+'</td><td style="'+cSr+'">'+money0(ac)+'</td><td style="'+cSr+'">'+money0(toPay)+'</td></tr>';});
  if(!rows)rows='<tr><td colspan="8" style="'+cS+';color:#888">Данных за период нет</td></tr>';
  const grand=tOpen+tAccr-tPaid;
  const thS='padding:'+pad+';border:1px solid #cfe0dc;background:#e9f5f1;font-weight:700;font-size:'+fs;
  return '<div class="card" style="max-width:'+(compact?'100%':'760px')+';margin:0 auto;padding:0;overflow:hidden;font-size:'+fs+'">'+
    '<div style="background:#10352a;color:#fff;padding:'+(compact?'8px 12px':'16px 20px')+';display:flex;justify-content:space-between;align-items:flex-start">'+
      '<div><div style="font-weight:800;font-size:'+(compact?'14px':'18px')+'">Квитанция к счёту</div><div style="opacity:.8;font-size:'+(compact?'9px':'12px')+';margin-top:2px">за '+perName(per)+'</div></div>'+
      '<div style="text-align:right;font-size:'+(compact?'9px':'12px')+';opacity:.95"><div style="font-weight:800;font-size:'+(compact?'12px':'15px')+';color:#3fe6c0">turgyn</div><div style="margin-top:3px">Лицевой счёт<br><b style="font-size:'+(compact?'12px':'15px')+';color:#fff">'+esc(a.ls)+'</b></div></div>'+
    '</div>'+
    '<div style="padding:'+(compact?'8px 12px':'16px 20px')+'">'+
      '<div style="font-weight:700">'+esc(o.name||'')+'</div>'+
      '<div style="color:#6a827a;font-size:'+(compact?'8px':'11.5px')+'">'+esc(o.address||'')+(o.bin?' · БИН '+esc(o.bin):'')+'</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:'+(compact?'10px':'18px')+';margin-top:'+(compact?'5px':'10px')+'">'+
        '<span>Собственник: <b>'+esc(a.owner)+'</b></span><span>кв. <b>'+esc(a.apt)+'</b></span><span>площадь <b>'+(a.area||0)+' м²</b></span></div>'+
      '<table style="width:100%;border-collapse:collapse;margin-top:'+(compact?'6px':'12px')+';font-size:'+fs+'"><thead><tr>'+
        '<th style="'+thS+';text-align:left">Наименование услуг</th><th style="'+thS+'">Остаток на начало</th><th style="'+thS+'">Оплачено</th><th style="'+thS+'">Ед.</th><th style="'+thS+'">Кол-во</th><th style="'+thS+'">Цена за ед.</th><th style="'+thS+'">Начислено</th><th style="'+thS+'">К оплате</th></tr></thead>'+
        '<tbody>'+rows+'</tbody>'+
        '<tfoot><tr style="font-weight:800;background:#f4faf9"><td style="'+cS+'">ИТОГО</td><td style="'+cSr+'">'+money0(tOpen)+'</td><td style="'+cSr+'">'+money0(tPaid)+'</td><td style="'+cS+'"></td><td style="'+cSr+'"></td><td style="'+cSr+'"></td><td style="'+cSr+'">'+money0(tAccr)+'</td><td style="'+cSr+';color:#0f9a7d">'+money0(grand)+'</td></tr></tfoot></table>'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:'+(compact?'6px':'14px')+'">'+
        '<div style="font-size:'+(compact?'8px':'11.5px')+';color:#6a827a;max-width:60%">'+esc(o.bank||'')+', счёт <b>'+esc(o.iban||'—')+'</b>'+(o.savingsIban&&DB.services.some(x=>x.osiId===o.id&&svcFund(x)==='savings')?'; взнос на капремонт — на сберегательный счёт <b>'+esc(o.savingsIban)+'</b>':'')+'. В назначении укажите Л/С '+esc(a.ls)+'.<br>Оплата до 25 числа. Спасибо за своевременную оплату!</div>'+
        '<div style="display:flex;gap:'+(compact?'8px':'14px')+'">'+
          '<div style="text-align:center"><div style="border:1px solid #eee;padding:3px;border-radius:6px">'+qrImg(o,'Kaspi')+'</div><div style="font-size:'+(compact?'8px':'11px')+';color:#6a827a;margin-top:2px">Kaspi</div></div>'+
          '<div style="text-align:center"><div style="border:1px solid #eee;padding:3px;border-radius:6px">'+qrImg(o,'Halyk')+'</div><div style="font-size:'+(compact?'8px':'11px')+';color:#6a827a;margin-top:2px">Halyk</div></div>'+
        '</div></div>'+
    '</div></div>';
}
function printAllReceipts(){
  const oid=S.osi,per=RCP_PER,accs=osiAccounts(oid);if(!accs.length){toast('Нет квартир','bad');return;}
  let body='';accs.slice().sort((a,b)=>(+a.apt)-(+b.apt)).forEach(a=>{body+='<div class="q">'+receiptHtml(a.id,per,true)+'</div>';});
  const w=window.open('','_blank');
  w.document.write('<html><head><title>Квитанции '+perName(per)+'</title><style>'+
    '@page{size:A4 portrait;margin:5mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{margin:0;font-family:Segoe UI,Arial,sans-serif;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}'+
    '.q{height:69mm;overflow:hidden;page-break-inside:avoid;padding:1.5mm}'+
    '.q>.card{border:1px solid #bbb;border-radius:8px;height:100%}'+
    'img{image-rendering:pixelated}</style></head><body>'+body+'</body></html>');
  w.document.close();setTimeout(()=>{w.print();},500);
}

/* ================= РЕЕСТРЫ ================= */
let REG_TAB='accruals',REG_PER=null;
VIEWS.registers=function(){
  const oid=S.osi;const ps=periods();if(!REG_PER)REG_PER=ps[0];
  let h=head('Реестры · '+esc(curOsi().name),'Регистры начислений и платежей',
    '<button class="btn sec" onclick="printBlock(\'reg-print\',\'Реестр\')">'+svg(IC.print)+'Печать / PDF</button>');
  h+='<div class="toolbar"><div class="seg">'+
    '<button class="'+(REG_TAB==='accruals'?'on':'')+'" onclick="REG_TAB=\'accruals\';go(\'registers\')">Реестр начислений</button>'+
    '<button class="'+(REG_TAB==='payments'?'on':'')+'" onclick="REG_TAB=\'payments\';go(\'registers\')">Реестр платежей</button>'+
    '<button class="'+(REG_TAB==='prov'?'on':'')+'" onclick="REG_TAB=\'prov\';go(\'registers\')">Реестр расчётов с поставщиками</button></div>'+
    '<select onchange="REG_PER=this.value;go(\'registers\')"><option value="all"'+(REG_PER==='all'?' selected':'')+'>Все периоды</option>'+
      ps.map(p=>'<option value="'+p+'"'+(p===REG_PER?' selected':'')+'>'+perName(p)+'</option>').join('')+'</select></div>';
  h+='<div id="reg-print">';
  if(REG_TAB==='accruals'){
    let acrs=DB.accruals.filter(a=>a.osiId===oid&&(REG_PER==='all'||a.period===REG_PER));
    const total=acrs.reduce((s,a)=>s+a.amount,0);
    h+='<h3 style="margin-bottom:10px">Реестр начислений — '+(REG_PER==='all'?'все периоды':perName(REG_PER))+'</h3>';
    h+='<div class="t-wrap"><table><thead><tr><th>Период</th><th>Кв.</th><th>Собственник</th><th>Услуга</th><th class="num">База</th><th class="num">Сумма</th></tr></thead><tbody>';
    acrs.sort((a,b)=>a.period<b.period?1:-1).slice(0,600).forEach(a=>{const ac=DB.accounts.find(x=>x.id===a.accountId)||{};const s=DB.services.find(x=>x.id===a.serviceId)||{};
      h+='<tr><td>'+perName(a.period)+'</td><td>'+esc(ac.apt||'')+'</td><td class="small">'+esc(ac.owner||'')+'</td><td class="small">'+esc(s.name||'')+'</td><td class="num small">'+a.base+' '+unitName(a.unit)+'</td><td class="num">'+money(a.amount)+'</td></tr>';});
    h+='</tbody><tfoot><tr><td colspan="5">ИТОГО начислено'+(acrs.length>600?' (показаны первые 600 строк)':'')+'</td><td class="num">'+money(total)+'</td></tr></tfoot></table></div>';
  } else if(REG_TAB==='payments'){
    let pays=DB.payments.filter(p=>p.osiId===oid&&(REG_PER==='all'||p.period===REG_PER)).sort((a,b)=>a.date<b.date?1:-1);
    const total=pays.reduce((s,p)=>s+p.amount,0);
    h+='<h3 style="margin-bottom:10px">Реестр платежей — '+(REG_PER==='all'?'все периоды':perName(REG_PER))+'</h3>';
    h+='<div class="t-wrap"><table><thead><tr><th>Дата</th><th>Л/С</th><th>Кв.</th><th>Собственник</th><th>Период</th><th>Способ</th><th class="num">Сумма</th></tr></thead><tbody>';
    pays.forEach(p=>{const a=DB.accounts.find(x=>x.id===p.accountId)||{};
      h+='<tr><td>'+esc(p.date)+'</td><td class="mono small">'+esc(a.ls||'')+'</td><td>'+esc(a.apt||'')+'</td><td class="small">'+esc(a.owner||'')+'</td><td>'+perName(p.period)+'</td><td>'+methodName(p.method)+'</td><td class="num pos">'+money(p.amount)+'</td></tr>';});
    h+='</tbody><tfoot><tr><td colspan="6">ИТОГО оплачено</td><td class="num">'+money(total)+'</td></tr></tfoot></table></div>';
  } else {
    let inv=DB.provInvoices.filter(x=>x.osiId===oid&&(REG_PER==='all'||x.period===REG_PER));
    let pay=DB.provPayments.filter(x=>x.osiId===oid&&(REG_PER==='all'||x.period===REG_PER));
    const ti=inv.reduce((s,x)=>s+x.amount,0),tp=pay.reduce((s,x)=>s+x.amount,0);
    h+='<h3 style="margin-bottom:10px">Расчёты с поставщиками — '+(REG_PER==='all'?'все периоды':perName(REG_PER))+'</h3>';
    h+='<div class="t-wrap"><table><thead><tr><th>Дата</th><th>Поставщик</th><th>Операция</th><th>Период</th><th class="num">Начислено (дебет)</th><th class="num">Оплачено (кредит)</th></tr></thead><tbody>';
    const rows=[...inv.map(x=>({d:x.date,pr:x.providerId,per:x.period,t:'inv',a:x.amount})),...pay.map(x=>({d:x.date,pr:x.providerId,per:x.period,t:'pay',a:x.amount}))].sort((a,b)=>a.d<b.d?1:-1);
    rows.forEach(r=>{const p=DB.providers.find(x=>x.id===r.pr)||{};
      h+='<tr><td>'+esc(r.d)+'</td><td class="small">'+esc(p.name||'')+'</td><td>'+(r.t==='inv'?'Накладная':'Оплата')+'</td><td>'+perName(r.per)+'</td><td class="num">'+(r.t==='inv'?money(r.a):'—')+'</td><td class="num">'+(r.t==='pay'?money(r.a):'—')+'</td></tr>';});
    h+='</tbody><tfoot><tr><td colspan="4">ИТОГО</td><td class="num">'+money(ti)+'</td><td class="num">'+money(tp)+'</td></tr></tfoot></table></div>';
  }
  h+='</div>';
  return h;
};

/* ================= ОБОРОТНО-САЛЬДОВАЯ ================= */
let BAL_PER=null;
VIEWS.balance=function(){
  const oid=S.osi;const ps=periods();if(!BAL_PER)BAL_PER=ps[0];
  const accs=osiAccounts(oid);
  let O=0,D=0,C=0,E=0;
  const rows=accs.slice().sort((a,b)=>(+a.apt)-(+b.apt)).map(a=>{
    const opening=saldoBefore(a,BAL_PER);
    const deb=DB.accruals.filter(x=>x.accountId===a.id&&x.period===BAL_PER).reduce((s,x)=>s+x.amount,0);
    const cred=DB.payments.filter(x=>x.accountId===a.id&&x.period===BAL_PER).reduce((s,x)=>s+x.amount,0);
    const closing=opening+deb-cred;
    O+=opening;D+=deb;C+=cred;E+=closing;
    return {a,opening,deb,cred,closing};
  });
  let h=head('Оборотно-сальдовая ведомость · '+esc(curOsi().name),'По расчётам с собственниками (сч. 1210)',
    '<label class="fld" style="margin-right:8px"><select onchange="BAL_PER=this.value;go(\'balance\')">'+ps.map(p=>'<option value="'+p+'"'+(p===BAL_PER?' selected':'')+'>'+perName(p)+'</option>').join('')+'</select></label>'+
    '<button class="btn sec" onclick="printBlock(\'osv-print\',\'ОСВ\')">'+svg(IC.print)+'Печать / PDF</button>');
  h+='<div class="grid g4" style="margin-bottom:16px">'+
    kpi('','scale','Сальдо на начало',money(O))+
    kpi('','calc','Оборот дебет (начислено)',money(D))+
    kpi('g','money','Оборот кредит (оплачено)',money(C))+
    kpi(E>0?'r':'g','alert','Сальдо на конец',money(E),E>0?'задолженность жителей':'нет долга')+'</div>';
  h+='<div id="osv-print"><h3 style="margin-bottom:10px">Оборотно-сальдовая ведомость за '+perName(BAL_PER)+'</h3>';
  h+='<div class="t-wrap"><table><thead><tr><th rowspan="2">Кв.</th><th rowspan="2">Собственник</th>'+
     '<th class="num" colspan="1">Сальдо нач.</th><th class="num" colspan="2">Обороты за период</th><th class="num" colspan="1">Сальдо кон.</th></tr>'+
     '<tr><th class="num">Долг</th><th class="num">Начислено</th><th class="num">Оплачено</th><th class="num">Долг</th></tr></thead><tbody>';
  rows.forEach(r=>{
    h+='<tr><td><b>'+esc(r.a.apt)+'</b></td><td class="small">'+esc(r.a.owner)+'</td>'+
      '<td class="num '+(r.opening>0?'neg':'')+'">'+money0(r.opening)+'</td>'+
      '<td class="num">'+money0(r.deb)+'</td><td class="num pos">'+money0(r.cred)+'</td>'+
      '<td class="num '+(r.closing>0?'neg':(r.closing<0?'pos':''))+'" style="font-weight:700">'+money0(r.closing)+'</td></tr>';
  });
  h+='</tbody><tfoot><tr><td colspan="2">ИТОГО, ₸</td><td class="num">'+money0(O)+'</td><td class="num">'+money0(D)+'</td><td class="num">'+money0(C)+'</td><td class="num">'+money0(E)+'</td></tr></tfoot></table></div></div>';
  return h;
};
function saldoBefore(a,per){ // сальдо (долг) на начало периода per
  let b=accOpen(a);
  DB.accruals.filter(x=>x.accountId===a.id&&x.period<per).forEach(x=>b+=x.amount);
  DB.payments.filter(x=>x.accountId===a.id&&x.period<per).forEach(x=>b-=x.amount);
  return b;
}

/* ================= АКТЫ СВЕРКИ ================= */
let REC_TYPE='owner',REC_ACC=null,REC_SVC='all',REC_FROM='',REC_TO='';
function perStart(p){return String(p).indexOf('-')>=0?String(p):String(p)+'-01';}
function perEnd(p){return String(p).indexOf('-')>=0?String(p):String(p)+'-12';}
function acctPeriods(accId){const s=new Set();
  DB.accruals.filter(x=>x.accountId===accId).forEach(x=>s.add(x.period));
  DB.payments.filter(x=>x.accountId===accId).forEach(x=>s.add(x.period));
  return [...s].sort();}
function recSet(f,v){if(f==='acc'){REC_ACC=v;REC_SVC='all';REC_FROM='';REC_TO='';}
  else if(f==='svc')REC_SVC=v;else if(f==='from')REC_FROM=v;else if(f==='to')REC_TO=v;go('reconcile');}
function fmtD(ymd){if(!ymd)return '';const p=String(ymd).slice(0,10).split('-');return p[2]?p[2]+'.'+p[1]+'.'+p[0]:'';}

/* ---------- календарь (в стиле 1С) ---------- */
let CAL={y:0,m:0,cb:null,val:''};
const CAL_MON=['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
const CAL_FULL=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
function openCal(anchor,val,cb){
  const d=(val&&/\d{4}-\d{2}/.test(val))?new Date(val):new Date();
  CAL={y:d.getFullYear(),m:d.getMonth(),cb:cb,val:val||''};
  renderCal();
  const pop=document.getElementById('cal-pop');pop.classList.remove('hidden');
  const r=anchor.getBoundingClientRect();
  let left=window.scrollX+r.left, top=window.scrollY+r.bottom+4;
  pop.style.left=left+'px';pop.style.top=top+'px';
  // чтобы не выходил за правый край
  setTimeout(()=>{const w=pop.offsetWidth;if(left+w>window.scrollX+window.innerWidth-8)pop.style.left=(window.scrollX+window.innerWidth-w-8)+'px';},0);
}
function closeCal(){document.getElementById('cal-pop').classList.add('hidden');}
function calNav(d){CAL.m+=d;if(CAL.m<0){CAL.m=11;CAL.y--;}if(CAL.m>11){CAL.m=0;CAL.y++;}renderCal();}
function calSetM(m){CAL.m=m;renderCal();}
function calSetY(d){CAL.y+=d;renderCal();}
function calToday(){const d=new Date();CAL.y=d.getFullYear();CAL.m=d.getMonth();renderCal();}
function calPick(ds){if(CAL.cb)CAL.cb(ds);closeCal();}
function renderCal(){
  let left='<div class="cal-head" style="justify-content:center"><span class="cal-nav" onclick="calSetY(-1)">‹</span><b>'+CAL.y+'</b><span class="cal-nav" onclick="calSetY(1)">›</span></div><div class="cal-mgrid">';
  for(let r=0;r<6;r++){left+='<div class="cal-m'+(CAL.m===r?' on':'')+'" onclick="calSetM('+r+')">'+CAL_MON[r]+'</div>'+
    '<div class="cal-m'+(CAL.m===r+6?' on':'')+'" onclick="calSetM('+(r+6)+')">'+CAL_MON[r+6]+'</div>';}
  left+='</div><div class="cal-today" onclick="calToday()">Сегодня</div>';
  const first=new Date(CAL.y,CAL.m,1);const start=(first.getDay()+6)%7; // Пн=0
  const wd=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  let right='<div class="cal-head"><span class="cal-nav" onclick="calNav(-1)">‹</span><b>'+CAL_FULL[CAL.m]+' '+CAL.y+'</b><span class="cal-nav" onclick="calNav(1)">›</span></div><div class="cal-grid">';
  wd.forEach((w,i)=>right+='<div class="cal-wd'+(i>=5?' we':'')+'">'+w+'</div>');
  const todayStr=new Date().toISOString().slice(0,10);const selStr=(CAL.val||'').slice(0,10);
  for(let i=0;i<42;i++){const cd=new Date(CAL.y,CAL.m,1-start+i);
    const ds=cd.getFullYear()+'-'+String(cd.getMonth()+1).padStart(2,'0')+'-'+String(cd.getDate()).padStart(2,'0');
    const oth=cd.getMonth()!==CAL.m,dow=i%7;
    right+='<div class="cal-d'+(oth?' oth':'')+(dow>=5?' we':'')+(ds===selStr?' sel':'')+(ds===todayStr?' today':'')+'" onclick="calPick(\''+ds+'\')">'+cd.getDate()+'</div>';}
  right+='</div>';
  document.getElementById('cal-pop').innerHTML='<div class="cal-left">'+left+'</div><div class="cal-right">'+right+'</div>';
}
document.addEventListener('click',function(e){const p=document.getElementById('cal-pop');
  if(p&&!p.classList.contains('hidden')&&!p.contains(e.target)&&!(e.target.dataset&&e.target.dataset.cal))closeCal();});
(function(){const cp=document.getElementById('cal-pop');if(cp)cp.addEventListener('click',function(e){e.stopPropagation();});})();
VIEWS.reconcile=function(){
  const oid=S.osi;
  let h=head('Акты сверки · '+esc(curOsi().name),'Взаиморасчёты с собственниками и поставщиками');
  h+='<div class="toolbar"><div class="seg">'+
    '<button class="'+(REC_TYPE==='owner'?'on':'')+'" onclick="REC_TYPE=\'owner\';go(\'reconcile\')">С собственником</button>'+
    '<button class="'+(REC_TYPE==='prov'?'on':'')+'" onclick="REC_TYPE=\'prov\';go(\'reconcile\')">С поставщиком</button></div>';
  if(REC_TYPE==='owner'){
    const accs=osiAccounts(oid);
    if(!accs.length){h+='</div>'+emptyState('Нет лицевых счетов','Добавьте квартиры для этого ОСИ.','');return h;}
    if(!REC_ACC||!accs.find(a=>a.id===REC_ACC))REC_ACC=accs[0].id;
    const svcIds=[...new Set(DB.accruals.filter(x=>x.accountId===REC_ACC).map(x=>x.serviceId||''))];
    const pers=acctPeriods(REC_ACC);
    h+='<select onchange="recSet(\'acc\',this.value)">'+accs.map(a=>'<option value="'+a.id+'"'+(a.id===REC_ACC?' selected':'')+'>кв.'+esc(a.apt)+' · '+esc(a.owner)+'</option>').join('')+'</select>';
    h+='<select onchange="recSet(\'svc\',this.value)"><option value="all">Все услуги</option>'+
      svcIds.map(sid=>{const s=DB.services.find(x=>x.id===sid);const nm=s?s.name:'Без услуги';return '<option value="'+esc(sid)+'"'+(REC_SVC===sid?' selected':'')+'>'+esc(nm)+'</option>';}).join('')+'</select>';
    h+='<span style="align-self:center;color:var(--mut);font-size:12px">За период с</span>'+
      '<input readonly data-cal="1" value="'+esc(fmtD(REC_FROM))+'" placeholder="дд.мм.гггг" onclick="openCal(this,\''+esc(REC_FROM)+'\',function(v){recSet(\'from\',v);})" style="width:120px;cursor:pointer">'+
      '<span style="align-self:center;color:var(--mut);font-size:12px">по</span>'+
      '<input readonly data-cal="1" value="'+esc(fmtD(REC_TO))+'" placeholder="дд.мм.гггг" onclick="openCal(this,\''+esc(REC_TO)+'\',function(v){recSet(\'to\',v);})" style="width:120px;cursor:pointer">';
    h+='<button class="btn sec" onclick="printBlock(\'rec-print\',\'Акт сверки\')">'+svg(IC.print)+'Печать / PDF</button></div>';
    h+='<div id="rec-print">'+reconcileOwner(REC_ACC,REC_SVC,REC_FROM,REC_TO)+'</div>';
  } else {
    const provs=DB.providers.filter(p=>p.osiId===oid);
    if(!provs.length){h+='</div>'+emptyState('Нет поставщиков','Добавьте поставщиков.','');return h;}
    h+='<select id="rec-prov" onchange="go(\'reconcile\')">'+provs.map(p=>'<option value="'+p.id+'">'+esc(p.name)+'</option>').join('')+'</select>';
    h+='<button class="btn sec" onclick="printBlock(\'rec-print\',\'Акт сверки\')">'+svg(IC.print)+'Печать / PDF</button></div>';
    h+='<div id="rec-print">'+reconcileProv(provs[0].id)+'</div>';
    setTimeout(()=>{const sel=document.getElementById('rec-prov');if(sel){sel.onchange=()=>{document.getElementById('rec-print').innerHTML=reconcileProv(sel.value);};}},0);
  }
  return h;
};
function reconcileOwner(accId,svcId,from,to){
  svcId=svcId||'all';
  from=from?String(from).slice(0,7):'';to=to?String(to).slice(0,7):'';
  const a=DB.accounts.find(x=>x.id===accId);if(!a)return '<div class="empty">Нет счёта</div>';
  const o=curOsi()||{};
  const svcName=svcId==='all'?'Все услуги':((DB.services.find(s=>s.id===svcId)||{}).name||'Без услуги');
  const pa=(p)=>DB.accruals.filter(x=>x.accountId===accId&&x.period===p&&(svcId==='all'||(x.serviceId||'')===svcId)).reduce((s,x)=>s+x.amount,0);
  const pp=(p)=>{const tot=DB.payments.filter(x=>x.accountId===accId&&x.period===p).reduce((s,x)=>s+x.amount,0);
    if(svcId==='all')return tot;const all=DB.accruals.filter(x=>x.accountId===accId&&x.period===p).reduce((s,x)=>s+x.amount,0);return all>0?Math.round(tot*pa(p)/all):0;};
  const allP=acctPeriods(accId);
  let opening=(svcId==='all')?accOpen(a):((a.saldoBySvc&&a.saldoBySvc[svcId])||0);
  allP.forEach(p=>{if(from&&perEnd(p)<from)opening+=pa(p)-pp(p);});
  const pers=allP.filter(p=>(!from||perEnd(p)>=from)&&(!to||perStart(p)<=to));
  let bal=opening,td=0,tc=0;
  let rows2='<tr><td><b>Входящее сальдо</b></td><td class="num"></td><td class="num"></td><td class="num"><b>'+money(bal)+'</b></td></tr>';
  pers.forEach(p=>{const ac=pa(p),pay=pp(p);if(ac===0&&pay===0)return;bal+=ac-pay;td+=ac;tc+=pay;
    rows2+='<tr><td>'+perName(p)+'</td><td class="num">'+(ac?money(ac):'—')+'</td><td class="num pos">'+(pay?money(pay):'—')+'</td><td class="num '+(bal>0?'neg':'pos')+'">'+money(bal)+'</td></tr>';});
  return '<div class="card">'+
    '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:6px">'+
    '<div><h3>Акт сверки взаимных расчётов</h3><div class="small muted">'+esc(DB.org.name)+' и собственник кв. '+esc(a.apt)+' ('+esc(a.owner)+'), '+esc(o.name||'')+'</div>'+
    '<div class="small muted">Услуга: <b>'+esc(svcName)+'</b>'+((from||to)?' · период: '+(from?perName(from):'начало')+' — '+(to?perName(to):'конец'):' · весь период')+'</div></div>'+
    '<div class="small muted" style="text-align:right">Л/С: <b>'+esc(a.ls)+'</b><br>на '+today()+'</div></div>'+
    '<div class="t-wrap" style="margin-top:12px"><table><thead><tr><th>Период</th><th class="num">Начислено</th><th class="num">Оплачено</th><th class="num">Сальдо</th></tr></thead><tbody>'+rows2+
    '</tbody><tfoot><tr><td>Обороты</td><td class="num">'+money(td)+'</td><td class="num">'+money(tc)+'</td><td class="num '+(bal>0?'neg':'pos')+'">'+(bal>0?'Долг '+money(bal):(bal<0?'Аванс '+money(-bal):'0 ₸'))+'</td></tr></tfoot></table></div>'+
    '<p class="small muted" style="margin-top:14px">Задолженность'+(svcId==='all'?'':' по услуге «'+esc(svcName)+'»')+' на '+today()+': <b>'+money(Math.max(0,bal))+'</b>. Подписи сторон: ____________ / ____________</p></div>';
}
function reconcileProv(pid){
  const p=DB.providers.find(x=>x.id===pid);
  const ev=[];
  DB.provInvoices.filter(x=>x.providerId===pid).forEach(x=>ev.push({d:x.date,desc:'Накладная ('+(x.desc||perName(x.period))+')',deb:x.amount,cred:0}));
  DB.provPayments.filter(x=>x.providerId===pid).forEach(x=>ev.push({d:x.date,desc:'Оплата поставщику',deb:0,cred:x.amount}));
  ev.sort((x,y)=>x.d<y.d?-1:1);
  let bal=0,td=0,tc=0;
  let rows='';
  ev.forEach(e=>{bal+=e.deb-e.cred;td+=e.deb;tc+=e.cred;
    rows+='<tr><td>'+esc(e.d)+'</td><td>'+esc(e.desc)+'</td><td class="num">'+(e.deb?money(e.deb):'')+'</td><td class="num">'+(e.cred?'−'+money(e.cred):'')+'</td><td class="num '+(bal>0?'neg':'pos')+'">'+money(bal)+'</td></tr>';});
  return '<div class="card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:6px">'+
    '<div><h3>Акт сверки взаимных расчётов</h3><div class="small muted">'+esc(curOsi().name)+' и '+esc(p.name)+' ('+esc(p.service)+')</div></div>'+
    '<div class="small muted" style="text-align:right">БИН: '+esc(p.bin||'—')+'<br>на '+today()+'</div></div>'+
    '<div class="t-wrap" style="margin-top:12px"><table><thead><tr><th>Дата</th><th>Операция</th><th class="num">Выставлено</th><th class="num">Оплачено</th><th class="num">Сальдо</th></tr></thead><tbody>'+
    (rows||'<tr><td colspan="5" class="muted" style="padding:16px">Нет операций</td></tr>')+
    '</tbody><tfoot><tr><td colspan="2">ИТОГО</td><td class="num">'+money(td)+'</td><td class="num">'+money(tc)+'</td><td class="num '+(bal>0?'neg':'pos')+'">'+money(bal)+'</td></tr></tfoot></table></div>'+
    '<p class="small muted" style="margin-top:14px">Кредиторская задолженность перед поставщиком: <b>'+money(Math.max(0,bal))+'</b>. Подписи сторон: ____________ / ____________</p></div>';
}

/* ================= ДОХОДЫ И РАСХОДЫ ================= */
/* ================= ФОНДЫ, РАСХОДЫ, ДОХОДЫ =================
   У ОСИ два счёта: текущий (содержание) и сберегательный (капремонт).
   Услуга знает, на какой счёт идут её деньги; оплата жителя делится между
   услугами пропорционально начислению за тот же период. */
function svcFund(s){if(!s)return 'current';if(s.fund)return s.fund;return /капитал|капрем|накопит/i.test(s.name||'')?'savings':'current';}
function expCats(){return (DB.expenseCategories&&DB.expenseCategories.length)?DB.expenseCategories:DEFAULT_EXP_CATS;}
function expCatOptions(sel){const cs=expCats().slice();if(sel&&!cs.includes(sel))cs.push(sel);return cs.map(c=>'<option'+(c===sel?' selected':'')+'>'+esc(c)+'</option>').join('');}
function fundName(f){return f==='savings'?'Сберегательный':'Текущий';}
function fundPill(f){return '<span class="pill '+(f==='savings'?'warn':'info')+'">'+fundName(f)+'</span>';}
/* поступления от жителей по счетам ОСИ (за период или за всё время) */
function incomeByFund(oid,per){
  const svcF={};DB.services.filter(s=>s.osiId===oid).forEach(s=>svcF[s.id]=svcFund(s));
  const res={current:0,savings:0};const idx=IDX();
  osiAccounts(oid).forEach(acc=>{const m=idx[acc.id]||{};
    Object.keys(m).forEach(p=>{if(per&&p!==per)return;const d=m[p];if(!d.pay)return;
      let sv=0;if(d.ps)for(const sid in d.ps)if(svcF[sid]==='savings')sv+=d.ps[sid];
      const pu=d.pu||0;if(d.a>0){let sa=0;for(const sid in d.s)if(svcF[sid]==='savings')sa+=d.s[sid];sv+=pu*sa/d.a;}
      res.savings+=sv;res.current+=d.pay-sv;});});
  return res;
}
/* все расходы ОСИ: собственные + оплаты поставщикам */
function allExpenses(oid,per){
  const rows=[];
  (DB.expenses||[]).filter(x=>x.osiId===oid&&(!per||x.period===per)).forEach(x=>rows.push({date:x.date,period:x.period,category:x.category||'Прочие расходы',fund:x.fund||'current',amount:x.amount,payee:x.payee||'',desc:x.desc||'',src:'exp',id:x.id}));
  DB.provPayments.filter(x=>x.osiId===oid&&(!per||x.period===per)).forEach(x=>{const pv=DB.providers.find(p=>p.id===x.providerId)||{};
    rows.push({date:x.date,period:x.period,category:pv.category||'Содержание и уборка',fund:'current',amount:x.amount,payee:pv.name||'',desc:pv.service||'',src:'prov',id:x.id});});
  return rows;
}
VIEWS.pnl=function(){
  const oid=S.osi;const ps=periods().filter(p=>/^\d{4}-\d{2}$/.test(p)).slice().reverse();
  let h=head('Доходы и расходы · '+esc(curOsi().name),'Поступления от жителей и все расходы ОСИ по статьям',
    '<button class="btn sec" onclick="printBlock(\'pnl-print\',\'Доходы и расходы\')">'+svg(IC.print)+'Печать / PDF</button>');
  const inc=incomeByFund(oid),exp=allExpenses(oid);
  const totIn=inc.current+inc.savings,totOut=exp.reduce((s,x)=>s+x.amount,0);
  const outF={current:0,savings:0};exp.forEach(x=>outF[x.fund==='savings'?'savings':'current']+=x.amount);
  h+='<div class="grid g3" style="margin-bottom:16px">'+
    kpi('g','money','Поступило от жителей',money(totIn))+
    kpi('r','wallet','Израсходовано',money(totOut))+
    kpi(totIn-totOut>=0?'g':'r','chart','Результат',money(totIn-totOut),totIn-totOut>=0?'профицит':'дефицит')+'</div>';
  h+='<div id="pnl-print">';
  h+='<div class="card" style="margin-bottom:16px"><h3>По счетам ОСИ</h3><div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Счёт</th><th class="num">Поступило</th><th class="num">Израсходовано</th><th class="num">Расчётный остаток</th></tr></thead><tbody>'+
    ['current','savings'].map(f=>'<tr><td>'+fundPill(f)+' '+(f==='savings'?'капитальный ремонт':'содержание дома')+'</td><td class="num pos">'+money(inc[f])+'</td><td class="num neg">'+money(outF[f])+'</td><td class="num" style="font-weight:700">'+money(inc[f]-outF[f])+'</td></tr>').join('')+
    '</tbody></table></div><p class="small muted" style="margin-top:8px">Остаток рассчитан по данным системы. Для сверки сравните его с выпиской банка на ту же дату.</p></div>';
  h+='<div class="grid g2">';
  h+='<div class="card"><h3>По периодам</h3><div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Период</th><th class="num">Доходы</th><th class="num">Расходы</th><th class="num">Результат</th></tr></thead><tbody>';
  ps.forEach(p=>{const i=incomeByFund(oid,p);const ii=i.current+i.savings;const ee=allExpenses(oid,p).reduce((s,x)=>s+x.amount,0);
    h+='<tr><td>'+perName(p)+(isLocked(oid,p)?' 🔒':'')+'</td><td class="num pos">'+money(ii)+'</td><td class="num neg">'+money(ee)+'</td><td class="num '+(ii-ee>=0?'pos':'neg')+'" style="font-weight:700">'+money(ii-ee)+'</td></tr>';});
  h+='</tbody><tfoot><tr><td>ИТОГО</td><td class="num">'+money(totIn)+'</td><td class="num">'+money(totOut)+'</td><td class="num">'+money(totIn-totOut)+'</td></tr></tfoot></table></div></div>';
  const byCat={};exp.forEach(x=>byCat[x.category]=(byCat[x.category]||0)+x.amount);
  h+='<div class="card"><h3>Расходы по статьям</h3><div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Статья</th><th class="num">Сумма</th><th class="num">Доля</th></tr></thead><tbody>';
  Object.keys(byCat).sort((a,b)=>byCat[b]-byCat[a]).forEach(c=>{h+='<tr><td class="small">'+esc(c)+'</td><td class="num">'+money(byCat[c])+'</td><td class="num small muted">'+(totOut?Math.round(byCat[c]/totOut*100):0)+'%</td></tr>';});
  if(!Object.keys(byCat).length)h+='<tr><td colspan="3" class="small muted">Расходов пока нет</td></tr>';
  h+='</tbody></table></div></div></div></div>';
  return h;
};

/* ================= РАСХОДЫ ================= */
let EXP_PER='all',EXP_FUND='all';
VIEWS.expenses=function(){
  const oid=S.osi;const ps=periods().filter(p=>/^\d{4}-\d{2}$/.test(p));
  let rows=(DB.expenses||[]).filter(x=>x.osiId===oid);
  if(EXP_PER!=='all')rows=rows.filter(x=>x.period===EXP_PER);
  if(EXP_FUND!=='all')rows=rows.filter(x=>(x.fund||'current')===EXP_FUND);
  rows=rows.slice().sort((a,b)=>a.date<b.date?1:-1);
  const tot=rows.reduce((s,x)=>s+x.amount,0);
  const provTot=DB.provPayments.filter(x=>x.osiId===oid&&(EXP_PER==='all'||x.period===EXP_PER)).reduce((s,x)=>s+x.amount,0);
  let h=head('Расходы · '+esc(curOsi().name),'Зарплата, налоги, ремонт, хозрасходы и всё, что оплачено не поставщикам',
    '<label class="fld" style="margin-right:8px"><select onchange="EXP_PER=this.value;go(\'expenses\')"><option value="all">Все периоды</option>'+
      ps.map(p=>'<option value="'+p+'"'+(p===EXP_PER?' selected':'')+'>'+perName(p)+'</option>').join('')+'</select></label>'+
    '<label class="fld" style="margin-right:8px"><select onchange="EXP_FUND=this.value;go(\'expenses\')"><option value="all">Оба счёта</option><option value="current"'+(EXP_FUND==='current'?' selected':'')+'>Текущий</option><option value="savings"'+(EXP_FUND==='savings'?' selected':'')+'>Сберегательный</option></select></label>'+
    '<button class="btn sec" onclick="expCatForm()">Статьи</button>'+
    '<button class="btn" onclick="expForm()">'+svg(IC.plus)+'Добавить расход</button>');
  if(EXP_PER!=='all')h+=periodBar(EXP_PER);
  h+='<div class="grid g3" style="margin-bottom:16px">'+
    kpi('r','wallet','Расходы в списке',money(tot),rows.length+' записей')+
    kpi('','truck','Оплачено поставщикам',money(provTot),'учтено в разделе «Поставщики»')+
    kpi('','chart','Всего расходов',money(tot+(EXP_FUND==='savings'?0:provTot)))+'</div>';
  if(!rows.length)return h+emptyState('Расходов нет','Добавьте зарплату, налоги, оплату ремонта или хозрасходы.','<button class="btn" onclick="expForm()">'+svg(IC.plus)+'Добавить расход</button>');
  h+='<div class="t-wrap"><table><thead><tr><th>Дата</th><th>Статья</th><th>Получатель · описание</th><th>Счёт</th><th>Период</th><th class="num">Сумма</th><th></th></tr></thead><tbody>';
  rows.forEach(x=>{const lk=isLocked(oid,x.period);
    h+='<tr><td>'+esc(x.date||'')+'</td><td class="small"><b>'+esc(x.category||'')+'</b></td><td class="small">'+esc(x.payee||'')+(x.desc?'<div class="muted">'+esc(x.desc)+'</div>':'')+(x.docNo?'<div class="muted">Док. № '+esc(x.docNo)+'</div>':'')+'</td>'+
      '<td>'+fundPill(x.fund||'current')+'</td><td>'+perName(x.period)+(lk?' 🔒':'')+'</td><td class="num neg" style="font-weight:700">'+money(x.amount)+'</td>'+
      '<td class="num">'+(lk?'':'<button class="btn gho sm" onclick="expForm(\''+x.id+'\')">'+svg(IC.edit)+'</button><button class="btn gho sm" onclick="expDel(\''+x.id+'\')">'+svg(IC.trash)+'</button>')+'</td></tr>';});
  h+='</tbody><tfoot><tr><td colspan="5">ИТОГО</td><td class="num">'+money(tot)+'</td><td></td></tr></tfoot></table></div>';
  return h;
};
function expForm(id){
  const x=id?(DB.expenses||[]).find(e=>e.id===id):{fund:'current',date:today()};
  if(id&&!guardPeriod(x.period,x.osiId))return;
  modal(id?'Редактировать расход':'Новый расход','<div class="form-grid">'+
    '<label class="fld full"><span>Статья*</span><select id="ex-cat">'+expCatOptions(x.category||expCats()[0])+'</select></label>'+
    fld('Сумма, ₸*','ex-amt',x.amount||'','25000','','number')+fld('Дата*','ex-date',x.date||today(),'')+
    perSelectFld('ex-per',x.period)+
    '<label class="fld"><span>Со счёта</span><select id="ex-fund"><option value="current"'+(x.fund!=='savings'?' selected':'')+'>Текущий (содержание)</option><option value="savings"'+(x.fund==='savings'?' selected':'')+'>Сберегательный (капремонт)</option></select></label>'+
    fld('Получатель','ex-payee',x.payee||'','ФИО или организация','full')+
    fld('Описание','ex-desc',x.desc||'','За что','full')+
    fld('№ документа','ex-doc',x.docNo||'','')+'</div>'+
    '<p class="small muted" style="margin-top:10px">Расходы на капитальный ремонт со сберегательного счёта проводятся только по решению собрания собственников.</p>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="expSave(\''+(id||'')+'\')">'+svg(IC.check)+'Сохранить</button>');
}
function expSave(id){
  const amt=parseFloat(val('ex-amt'))||0,per=val('ex-per'),fund=val('ex-fund');
  if(amt<=0){toast('Укажите сумму','bad');return;}
  if(!val('ex-date')){toast('Укажите дату','bad');return;}
  if(!guardPeriod(per))return;
  if(fund==='savings'&&!id&&!confirm('Расход со сберегательного счёта (капремонт). Решение собрания собственников есть?'))return;
  const d={category:val('ex-cat'),amount:Math.round(amt*100)/100,date:val('ex-date'),period:per,fund:fund,payee:val('ex-payee'),desc:val('ex-desc'),docNo:val('ex-doc')};
  if(id){const x=DB.expenses.find(e=>e.id===id);if(!guardPeriod(x.period,x.osiId))return;Object.assign(x,d);}
  else DB.expenses.push(Object.assign({id:uid('exp'),osiId:S.osi,createdBy:S.user.login,createdAt:nowStr()},d));
  save();closeModal();go('expenses');toast('Сохранено','ok');
}
function expDel(id){const x=DB.expenses.find(e=>e.id===id);if(!x)return;if(!guardPeriod(x.period,x.osiId))return;
  if(!confirm('Удалить расход '+money(x.amount)+' («'+x.category+'»)?'))return;
  DB.expenses=DB.expenses.filter(e=>e.id!==id);save();go('expenses');toast('Удалено','ok');}
function expCatForm(){
  modal('Статьи расходов','<p class="small muted" style="margin-bottom:10px">Одна статья — одна строка. Статьи используются в расходах, у поставщиков и в отчёте о доходах и расходах.</p>'+
    '<label class="fld full"><textarea id="ec-list" rows="12" style="width:100%;font:inherit;padding:10px;border:1px solid var(--line2);border-radius:8px">'+esc(expCats().join('\n'))+'</textarea></label>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="expCatSave()">Сохранить</button>');
}
function expCatSave(){const list=[...new Set(val('ec-list').split('\n').map(x=>x.trim()).filter(Boolean))];
  if(!list.length){toast('Нужна хотя бы одна статья','bad');return;}
  DB.expenseCategories=list;save();closeModal();go('expenses');toast('Статьи сохранены','ok');}

/* ================= КАПРЕМОНТ ================= */
function capitalRows(oid){
  const sv=DB.services.filter(s=>s.osiId===oid&&svcFund(s)==='savings').map(s=>s.id);const idx=IDX();
  return osiAccounts(oid).map(acc=>{let ac=0,pay=0;const m=idx[acc.id]||{};
    Object.keys(m).forEach(p=>{const d=m[p];let a=0;sv.forEach(id=>{a+=d.s[id]||0;pay+=payOf(d,id);});ac+=a;});
    let open=0;if(acc.saldoBySvc)sv.forEach(id=>open+=acc.saldoBySvc[id]||0);
    return {acc,accrued:ac,paid:pay,open:open,debt:open+ac-pay};});
}
VIEWS.capital=function(){
  const oid=S.osi,o=curOsi();const sv=DB.services.filter(s=>s.osiId===oid&&svcFund(s)==='savings');
  let h=head('Капремонт · '+esc(o.name),'Накопления на капитальный ремонт — сберегательный счёт ОСИ',
    '<button class="btn sec" onclick="printBlock(\'cap-print\',\'Накопления на капремонт\')">'+svg(IC.print)+'Печать / PDF</button>');
  if(!sv.length)return h+emptyState('Нет услуги капремонта','Создайте услугу «Взнос на капитальный ремонт» и в поле «Куда зачисляются деньги» выберите сберегательный счёт.','<button class="btn" onclick="go(\'services\')">К услугам</button>');
  const rows=capitalRows(oid);const spent=(DB.expenses||[]).filter(x=>x.osiId===oid&&x.fund==='savings').reduce((s,x)=>s+x.amount,0);
  const T=rows.reduce((t,r)=>({accrued:t.accrued+r.accrued,paid:t.paid+r.paid,debt:t.debt+r.debt}),{accrued:0,paid:0,debt:0});
  h+='<div class="grid g4" style="margin-bottom:16px">'+
    kpi('','calc','Начислено взносов',money(T.accrued))+kpi('g','money','Собрано',money(T.paid))+
    kpi('r','wallet','Израсходовано',money(spent))+kpi('g','chart','Накоплено',money(T.paid-spent),'расчётный остаток')+'</div>';
  h+='<div class="card" style="margin-bottom:16px"><div class="small muted">Сберегательный счёт: <b>'+esc(o.savingsIban||'не указан')+'</b>'+(o.savingsBank?' · '+esc(o.savingsBank):'')+
    (o.savingsIban?'':' — <a href="#" onclick="osiForm(\''+oid+'\');return false">указать в карточке ОСИ</a>')+
    '<br>Услуги на сберегательный счёт: '+sv.map(s=>esc(s.name)).join(', ')+'</div></div>';
  h+='<div id="cap-print"><div class="t-wrap"><table><thead><tr><th>Кв.</th><th>Собственник</th><th class="num">Площадь</th><th class="num">Начислено</th><th class="num">Оплачено</th><th class="num">Долг</th><th></th></tr></thead><tbody>';
  rows.sort((a,b)=>(+a.acc.apt)-(+b.acc.apt)).forEach(r=>{
    h+='<tr><td><b>'+esc(r.acc.apt)+'</b></td><td class="small">'+esc(r.acc.owner||'')+'</td><td class="num">'+(r.acc.area||'')+'</td><td class="num">'+money(r.accrued)+'</td><td class="num pos">'+money(r.paid)+'</td>'+
      '<td class="num '+(r.debt>0.5?'neg':'')+'">'+money(r.debt)+'</td><td class="num"><button class="btn gho sm" onclick="capCert(\''+r.acc.id+'\')">Справка</button></td></tr>';});
  h+='</tbody><tfoot><tr><td colspan="3">ИТОГО</td><td class="num">'+money(T.accrued)+'</td><td class="num">'+money(T.paid)+'</td><td class="num">'+money(T.debt)+'</td><td></td></tr></tfoot></table></div></div>';
  return h;
};
/* справка о накоплениях по квартире — председатель обязан выдать её собственнику по запросу */
function capCert(accId){
  const r=capitalRows(S.osi).find(x=>x.acc.id===accId);if(!r)return;const o=curOsi();const a=r.acc;
  const ps=Object.keys(accM(accId)).filter(p=>/^\d{4}-\d{2}$/.test(p)).sort();
  const w=window.open('','_blank');
  w.document.write('<html><head><meta charset="utf-8"><title>Справка о накоплениях</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#111;max-width:720px;margin:auto;font-size:14px;line-height:1.5}h2{text-align:center;font-size:17px;margin:24px 0}table{width:100%;border-collapse:collapse;margin:16px 0}td{border:1px solid #bbb;padding:8px 10px}td.n{text-align:right;white-space:nowrap}.sig{margin-top:48px;display:flex;justify-content:space-between}</style></head><body>'+
    '<div>'+esc(o.name)+(o.bin?'<br>БИН '+esc(o.bin):'')+'<br>'+esc(o.address||'')+'</div>'+
    '<h2>СПРАВКА<br>о накоплениях на капитальный ремонт общего имущества</h2>'+
    '<p>Выдана собственнику помещения: <b>'+esc(a.owner||'')+'</b>, квартира № '+esc(a.apt)+(a.area?', полезная площадь '+a.area+' м²':'')+', лицевой счёт '+esc(a.ls||'')+'.</p>'+
    '<table><tr><td>Период учёта</td><td class="n">'+(ps.length?perName(ps[0])+' — '+perName(ps[ps.length-1]):'—')+'</td></tr>'+
    (r.open?'<tr><td>Входящий остаток долга</td><td class="n">'+money(r.open)+'</td></tr>':'')+
    '<tr><td>Начислено взносов на капитальный ремонт</td><td class="n">'+money(r.accrued)+'</td></tr>'+
    '<tr><td>Оплачено (накоплено по квартире)</td><td class="n"><b>'+money(r.paid)+'</b></td></tr>'+
    '<tr><td>Задолженность по взносам</td><td class="n">'+money(Math.max(0,r.debt))+'</td></tr></table>'+
    '<p>Средства накапливаются на сберегательном счёте объединения'+(o.savingsIban?' '+esc(o.savingsIban)+(o.savingsBank?' в '+esc(o.savingsBank):''):'')+'.</p>'+
    '<p>Дата выдачи: '+new Date().toLocaleDateString('ru-RU')+'</p>'+
    '<div class="sig"><span>Председатель ОСИ</span><span>_____________ / '+esc(o.chairman||'')+' /</span></div></body></html>');
  w.document.close();setTimeout(()=>w.print(),300);
}

function printBlock(id,title){
  const el=document.getElementById(id);if(!el)return;
  const w=window.open('','_blank');
  w.document.write('<html><head><title>'+title+'</title><style>*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{font-family:Segoe UI,Arial;padding:24px;color:#111}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#f0f0f0}.num{text-align:right}h3{margin:0 0 4px}.muted,.small{color:#666}.neg{color:#c0392b}.pos{color:#1e8449}tfoot td{font-weight:bold;background:#f7f7f7}.card{border:none}.t-wrap{border:none}</style></head><body><h2>'+esc(DB.org.name)+' — '+title+'</h2>'+el.innerHTML+'<p style="margin-top:20px;color:#888;font-size:11px">Сформировано в Turgyn · '+today()+'</p></body></html>');
  w.document.close();setTimeout(()=>w.print(),300);
}

/* ================= ЮРИДИЧЕСКИЙ БЛОК ================= */
let LEG_TAB='protocol';
function daysBetween(a,b){return Math.floor((new Date(b)-new Date(a))/86400000);}
function debtRows(accId,rate){
  const a=DB.accounts.find(x=>x.id===accId);
  const pers=[...new Set(DB.accruals.filter(x=>x.accountId===accId).map(x=>x.period))].sort();
  let totalDebt=0,totalPen=0;const rows=[];
  if(a&&a.saldoStart){totalDebt+=a.saldoStart;rows.push({period:'входящее сальдо',accrued:a.saldoStart,paid:0,debt:a.saldoStart,due:'',days:0,penalty:0});}
  pers.forEach(p=>{
    const acc=DB.accruals.filter(x=>x.accountId===accId&&x.period===p).reduce((s,x)=>s+x.amount,0);
    const paid=DB.payments.filter(x=>x.accountId===accId&&x.period===p).reduce((s,x)=>s+x.amount,0);
    const debt=acc-paid; if(debt<=0){return;}
    const due=p+'-25'; const days=Math.max(0,daysBetween(due,today()));
    const penalty=rate?Math.round(debt*rate*days):0;
    totalDebt+=debt; totalPen+=penalty;
    rows.push({period:perName(p),accrued:acc,paid,debt,due,days,penalty});
  });
  return {a,rows,totalDebt,totalPenalty:totalPen,total:totalDebt+totalPen};
}
function debtorOptions(){const accs=osiAccounts(S.osi).map(a=>({a,b:accBalance(a.id)})).sort((x,y)=>y.b-x.b);
  return accs.map(x=>'<option value="'+x.a.id+'">кв.'+esc(x.a.apt)+' · '+esc(x.a.owner)+' · долг '+money0(x.b>0?x.b:0)+'</option>').join('');}
const DOCSTYLE='style="font-family:Georgia,\'Times New Roman\',serif;line-height:1.6;color:#12343b;text-align:justify"';

VIEWS.legal=function(){
  let h=head('Юридический блок · '+esc(curOsi().name),'Протоколы собраний и взыскание задолженности по шаблонам');
  h+='<div class="toolbar"><div class="seg">'+
    '<button class="'+(LEG_TAB==='protocol'?'on':'')+'" onclick="LEG_TAB=\'protocol\';go(\'legal\')">Протокол собрания</button>'+
    '<button class="'+(LEG_TAB==='debt'?'on':'')+'" onclick="LEG_TAB=\'debt\';go(\'legal\')">Расчёт задолженности</button>'+
    '<button class="'+(LEG_TAB==='notary'?'on':'')+'" onclick="LEG_TAB=\'notary\';go(\'legal\')">Исполнительная надпись</button>'+
    '<button class="'+(LEG_TAB==='claim'?'on':'')+'" onclick="LEG_TAB=\'claim\';go(\'legal\')">Исковое заявление</button></div></div>';
  h+='<div class="grid g2" style="align-items:start"><div class="card">';
  if(LEG_TAB==='protocol')h+=legProtoForm();
  else if(LEG_TAB==='debt')h+=legDebtForm();
  else if(LEG_TAB==='notary')h+=legNotaryForm();
  else h+=legClaimForm();
  h+='</div><div id="leg-out"><div class="empty">'+svg(IC.doc)+'<h4>Документ появится здесь</h4><p>Заполните форму слева и нажмите «Сформировать».</p></div></div></div>';
  return h;
};
function legProtoForm(){
  return '<h3 style="margin-bottom:12px">Протокол общего собрания</h3>'+
    '<label class="fld"><span>Форма проведения</span><select id="lp-form"><option value="in">Очное голосование</option><option value="out">Заочное голосование (письменный опрос)</option></select></label>'+
    '<div class="form-grid" style="margin-top:12px">'+
    fld('№ протокола','lp-num','1','')+fld('Дата (проведения/подведения итогов)','lp-date',today(),'')+
    fld('Всего собственников (голосов)','lp-total','','напр. 60','','number')+
    fld('Приняли участие','lp-present','','напр. 41','','number')+
    '<label class="fld full"><span>Повестка дня (каждый пункт с новой строки)</span><textarea id="lp-agenda" rows="4">1. Утверждение сметы расходов на содержание дома.\n2. Утверждение тарифа на содержание жилья.\n3. Избрание совета дома.</textarea></label>'+
    '<label class="fld full"><span>Принятые решения (каждый пункт с новой строки)</span><textarea id="lp-dec" rows="4">1. Смету расходов утвердить.\n2. Установить тариф в размере ___ тг/м2.\n3. Избрать совет дома в предложенном составе.</textarea></label>'+
    '</div><button class="btn" style="margin-top:14px" onclick="legMakeProto()">'+svg(IC.doc)+'Сформировать протокол</button>';
}
function legMakeProto(){
  const o=curOsi();const form=val('lp-form');const total=+val('lp-total')||0,present=+val('lp-present')||0;
  const quorum=total?Math.round(present/total*100):0;const ok=quorum>50;
  const agenda=val('lp-agenda').split('\n').filter(x=>x.trim()).map(x=>'<div>'+esc(x)+'</div>').join('');
  const dec=val('lp-dec').split('\n').filter(x=>x.trim()).map(x=>'<div>'+esc(x)+'</div>').join('');
  const formName=form==='in'?'очного (совместного присутствия)':'заочного (письменный опрос)';
  let doc='<div class="card" '+DOCSTYLE+'>'+
    '<div style="text-align:center;font-weight:700">ПРОТОКОЛ № '+esc(val('lp-num'))+'<br>общего собрания собственников помещений (квартир)</div>'+
    '<div style="text-align:center;margin-top:4px">объединения собственников имущества «'+esc(o.name)+'»</div>'+
    '<div style="display:flex;justify-content:space-between;margin-top:16px"><span>г. '+esc(o.city||DB.org.city)+'</span><span>'+esc(val('lp-date'))+'</span></div>'+
    '<p style="margin-top:12px"><b>Форма проведения собрания:</b> '+formName+'.<br>'+
    '<b>Адрес объекта:</b> '+esc(o.address)+'.<br>'+
    (form==='out'?'<b>Дата окончания приёма бюллетеней:</b> '+esc(val('lp-date'))+'.<br>':'')+
    '<b>Всего собственников (голосов):</b> '+total+'. <b>Приняли участие:</b> '+present+' ('+quorum+'%).<br>'+
    '<b>Кворум:</b> '+(ok?'имеется, собрание правомочно':'отсутствует')+'.</p>'+
    '<p><b>Председатель собрания:</b> '+esc(o.chairman||'____________')+'. <b>Секретарь собрания:</b> ____________.</p>'+
    '<p style="font-weight:700;margin-top:10px">ПОВЕСТКА ДНЯ:</p>'+agenda+
    '<p style="font-weight:700;margin-top:10px">ПО ВОПРОСАМ ПОВЕСТКИ ДНЯ РЕШИЛИ:</p>'+dec+
    '<p style="margin-top:10px"><b>Итоги голосования по каждому вопросу:</b> «За» ____%, «Против» ____%, «Воздержался» ____%.</p>'+
    '<p style="margin-top:20px">Председатель собрания ______________ / '+esc(o.chairman||'')+' /<br><br>Секретарь собрания ______________ /____________/</p>'+
    '<p class="small" style="color:#888;margin-top:14px">Основание: Закон РК «О жилищных отношениях». Шаблон, требует проверки перед использованием.</p></div>';
  legOut(doc,'Протокол собрания');
}
function legDebtForm(){
  return '<h3 style="margin-bottom:12px">Расчёт задолженности</h3>'+
    '<label class="fld"><span>Должник (лицевой счёт)</span><select id="ld-acc">'+debtorOptions()+'</select></label>'+
    (penaltyOn()?'<p class="small muted" style="margin-top:10px">Пеня начисляется по ставке '+penaltyCfg().rate+'% в день (изменить — в Настройках).</p>':'')+
    '<button class="btn" style="margin-top:14px" onclick="legMakeDebt()">'+svg(IC.calc)+'Сформировать расчёт</button>';
}
function legMakeDebt(){
  const accId=val('ld-acc');const rate=penaltyRate();
  const d=debtRows(accId,rate);const o=curOsi();const a=d.a;
  let tr=d.rows.map(r=>'<tr><td>'+esc(r.period)+'</td><td class="num">'+money0(r.accrued)+'</td><td class="num">'+money0(r.paid)+'</td><td class="num">'+money0(r.debt)+'</td>'+(rate?'<td class="num">'+r.days+'</td><td class="num">'+money0(r.penalty)+'</td>':'')+'</tr>').join('');
  if(!d.rows.length)tr='<tr><td colspan="'+(rate?6:4)+'" style="padding:14px;color:#888">Задолженность отсутствует</td></tr>';
  let doc='<div class="card" '+DOCSTYLE+'>'+
    '<div style="text-align:center;font-weight:700">РАСЧЁТ ЗАДОЛЖЕННОСТИ</div>'+
    '<div style="text-align:center">по оплате за содержание общего имущества и коммунальные услуги</div>'+
    '<p style="margin-top:14px"><b>Взыскатель (кредитор):</b> ОСИ «'+esc(o.name)+'», БИН '+esc(o.bin||'____')+', адрес: '+esc(o.address)+'.<br>'+
    '<b>Должник:</b> '+esc(a.owner)+', собственник кв. '+esc(a.apt)+' (лицевой счёт '+esc(a.ls)+', площадь '+a.area+' м²).<br>'+
    '<b>Дата расчёта:</b> '+today()+'.</p>'+
    '<table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px"><thead><tr style="background:#eef6f6">'+
    '<th style="border:1px solid #cfe0e2;padding:6px;text-align:left">Период</th><th style="border:1px solid #cfe0e2;padding:6px">Начислено</th><th style="border:1px solid #cfe0e2;padding:6px">Оплачено</th><th style="border:1px solid #cfe0e2;padding:6px">Долг</th>'+(rate?'<th style="border:1px solid #cfe0e2;padding:6px">Дней просрочки</th><th style="border:1px solid #cfe0e2;padding:6px">Пеня</th>':'')+'</tr></thead>'+
    '<tbody>'+tr.replace(/<td/g,'<td style="border:1px solid #e2edee;padding:6px"')+'</tbody>'+
    '<tfoot><tr style="font-weight:700;background:#f4faf9"><td style="border:1px solid #cfe0e2;padding:6px">ИТОГО</td><td style="border:1px solid #cfe0e2;padding:6px" class="num"></td><td style="border:1px solid #cfe0e2;padding:6px" class="num"></td><td style="border:1px solid #cfe0e2;padding:6px" class="num">'+money0(d.totalDebt)+'</td>'+(rate?'<td style="border:1px solid #cfe0e2;padding:6px"></td><td style="border:1px solid #cfe0e2;padding:6px" class="num">'+money0(d.totalPenalty)+'</td>':'')+'</tr></tfoot></table>'+
    '<p style="margin-top:14px;font-size:15px"><b>Итого к взысканию: '+money(d.total)+'</b>'+(rate?' (основной долг '+money(d.totalDebt)+' + пеня '+money(d.totalPenalty)+', ставка '+penaltyCfg().rate+'% в день)':'')+'.</p>'+
    '<p style="margin-top:16px">Расчёт составил: ______________ / '+esc(S.user.name)+' /<br>Председатель ОСИ: ______________ / '+esc(o.chairman||'')+' /</p></div>';
  legOut(doc,'Расчёт задолженности');
}
function legNotaryForm(){
  return '<h3 style="margin-bottom:12px">Заявление о вынесении исполнительной надписи</h3>'+
    '<label class="fld"><span>Должник (лицевой счёт)</span><select id="ln-acc">'+debtorOptions()+'</select></label>'+
    '<label class="fld" style="margin-top:12px"><span>Нотариус (ФИО / контора)</span><input id="ln-notary" placeholder="Нотариус г. '+esc(DB.org.city)+'"></label>'+
    (penaltyOn()?'<p class="small muted" style="margin-top:10px">Пеня учитывается по ставке '+penaltyCfg().rate+'% в день (Настройки).</p>':'')+
    '<button class="btn" style="margin-top:14px" onclick="legMakeNotary()">'+svg(IC.doc)+'Сформировать заявление</button>';
}
function legMakeNotary(){
  const accId=val('ln-acc');const rate=penaltyRate();
  const d=debtRows(accId,rate);const o=curOsi();const a=d.a;
  let doc='<div class="card" '+DOCSTYLE+'>'+
    '<div style="text-align:right;white-space:pre-line">'+esc(val('ln-notary')||'Нотариусу')+'<br>от ОСИ «'+esc(o.name)+'»,<br>БИН '+esc(o.bin||'____')+', '+esc(o.address)+'</div>'+
    '<div style="text-align:center;font-weight:700;margin-top:18px">ЗАЯВЛЕНИЕ<br>о совершении исполнительной надписи</div>'+
    '<p style="margin-top:14px">Между ОСИ «'+esc(o.name)+'» и собственником помещения возникли обязательства по оплате расходов на содержание общего имущества объекта кондоминиума по адресу: '+esc(o.address)+'.</p>'+
    '<p><b>Должник:</b> '+esc(a.owner)+', собственник кв. '+esc(a.apt)+', лицевой счёт '+esc(a.ls)+'.</p>'+
    '<p>По состоянию на '+today()+' задолженность составляет <b>'+money(d.totalDebt)+'</b> основного долга'+(d.totalPenalty?' и '+money(d.totalPenalty)+' пени':'')+', а всего <b>'+money(d.total)+'</b>, что подтверждается прилагаемым расчётом задолженности.</p>'+
    '<p style="font-weight:700;margin-top:10px">На основании изложенного, руководствуясь законодательством РК о нотариате, ПРОШУ:</p>'+
    '<p>Совершить исполнительную надпись о взыскании с должника '+esc(a.owner)+' в пользу ОСИ «'+esc(o.name)+'» задолженности в размере '+money(d.total)+', а также суммы нотариального тарифа.</p>'+
    '<p style="margin-top:10px"><b>Приложения:</b> расчёт задолженности; уведомление должника; правоустанавливающие документы ОСИ; выписка по лицевому счёту.</p>'+
    '<p style="margin-top:18px">Председатель ОСИ ______________ / '+esc(o.chairman||'')+' /<br>«___» __________ 20__ г.</p>'+
    '<p class="small" style="color:#888;margin-top:12px">Шаблон. Перечень документов и подсудность уточняйте у нотариуса.</p></div>';
  legOut(doc,'Заявление (исполнительная надпись)');
}
function legClaimForm(){
  return '<h3 style="margin-bottom:12px">Исковое заявление о взыскании</h3>'+
    '<label class="fld"><span>Должник (ответчик)</span><select id="lc-acc">'+debtorOptions()+'</select></label>'+
    '<label class="fld" style="margin-top:12px"><span>Наименование суда</span><input id="lc-court" value="Специализированный межрайонный суд по гражданским делам г. '+esc(DB.org.city)+'"></label>'+
    (penaltyOn()?'<p class="small muted" style="margin-top:10px">Пеня взыскивается по ставке '+penaltyCfg().rate+'% в день (Настройки).</p>':'')+
    '<button class="btn" style="margin-top:14px" onclick="legMakeClaim()">'+svg(IC.doc)+'Сформировать иск</button>';
}
function legMakeClaim(){
  const accId=val('lc-acc');const rate=penaltyRate();
  const d=debtRows(accId,rate);const o=curOsi();const a=d.a;
  const duty=Math.round(d.total*0.01);
  let doc='<div class="card" '+DOCSTYLE+'>'+
    '<div style="text-align:right">В '+esc(val('lc-court'))+'<br><br><b>Истец:</b> ОСИ «'+esc(o.name)+'»,<br>БИН '+esc(o.bin||'____')+', '+esc(o.address)+',<br>тел. '+esc(o.phone||'')+'<br><br><b>Ответчик:</b> '+esc(a.owner)+',<br>прож.: '+esc(o.address)+', кв. '+esc(a.apt)+'<br><br><b>Цена иска:</b> '+money(d.total)+'<br><b>Госпошлина:</b> '+money(duty)+' (1%)</div>'+
    '<div style="text-align:center;font-weight:700;margin-top:18px">ИСКОВОЕ ЗАЯВЛЕНИЕ<br>о взыскании задолженности по расходам на содержание общего имущества</div>'+
    '<p style="margin-top:14px">Ответчик является собственником квартиры № '+esc(a.apt)+' (площадь '+a.area+' м²) в многоквартирном жилом доме по адресу: '+esc(o.address)+', управление которым осуществляет ОСИ «'+esc(o.name)+'».</p>'+
    '<p>В силу Закона РК «О жилищных отношениях» собственник обязан нести расходы на содержание общего имущества объекта кондоминиума соразмерно своей доле. Ответчик свои обязательства надлежащим образом не исполняет.</p>'+
    '<p>По состоянию на '+today()+' задолженность ответчика составляет <b>'+money(d.totalDebt)+'</b> основного долга'+(d.totalPenalty?', пеня за просрочку — <b>'+money(d.totalPenalty)+'</b>':'')+', всего <b>'+money(d.total)+'</b>, что подтверждается расчётом задолженности и выпиской по лицевому счёту.</p>'+
    '<p>Досудебный порядок урегулирования соблюдён: ответчику направлено уведомление о погашении задолженности, которое оставлено без удовлетворения.</p>'+
    '<p style="font-weight:700;margin-top:10px">На основании изложенного, руководствуясь ГПК РК, ПРОШУ СУД:</p>'+
    '<p>1. Взыскать с '+esc(a.owner)+' в пользу ОСИ «'+esc(o.name)+'» задолженность в размере '+money(d.total)+'.<br>'+
    '2. Взыскать с ответчика расходы по оплате государственной пошлины в размере '+money(duty)+'.</p>'+
    '<p style="margin-top:10px"><b>Приложения:</b> расчёт задолженности; выписка по лицевому счёту; копия уведомления должнику; документ об оплате госпошлины; учредительные документы ОСИ; копия иска для ответчика.</p>'+
    '<p style="margin-top:18px">Представитель истца ______________ / '+esc(o.chairman||'')+' /<br>«___» __________ 20__ г.</p>'+
    '<p class="small" style="color:#888;margin-top:12px">Шаблон. Ставка госпошлины, подсудность и формулировки требуют проверки юристом под конкретный случай.</p></div>';
  legOut(doc,'Исковое заявление');
}
function legOut(html,title){
  const el=document.getElementById('leg-out');
  el.innerHTML='<div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn sec sm" onclick="printBlock(\'leg-doc\',\''+title+'\')">'+svg(IC.print)+'Печать / PDF</button></div><div id="leg-doc">'+html+'</div>';
  toast('Документ сформирован','ok');
}

/* ================= AI-АНАЛИТИК ================= */
/* Прозрачная эвристическая (не-LLM) модель поверх данных биллинга: скоринг риска,
   прогноз сборов, аномалии, приоритизация заявок. Реализована на клиенте, т.к. нет
   выделенного бэкенда — при подключении сервера тот же UI можно запитать от реального
   LLM-эндпоинта, заменив только функции aiRiskScore/aiForecast/aiAnomalies. */
function aiAccTotals(accId){
  const m=accM(accId);let accrued=0,paid=0;
  for(const p in m){accrued+=m[p].a;paid+=m[p].pay;}
  return {accrued,paid};
}
function aiRiskScore(accId){
  const debt=accBalance(accId);if(debt<=0)return {score:0,level:'ok',overdue:0};
  const t=aiAccTotals(accId);
  const ratio=t.accrued>0?Math.min(1,debt/t.accrued):0;
  const rows=debtRows(accId,0).rows.filter(r=>r.debt>0);
  const overdue=rows.length;
  const score=Math.round(Math.min(100,ratio*70+Math.min(overdue,4)*7.5));
  const level=score>=65?'bad':(score>=35?'warn':'ok');
  return {score,level,overdue};
}
function aiTopRisks(oid,limit){
  return osiAccounts(oid).map(a=>({a,r:aiRiskScore(a.id)})).filter(x=>x.r.score>0)
    .sort((x,y)=>y.r.score-x.r.score).slice(0,limit||8);
}
function aiForecast(oid){
  const per=periods();if(per.length<2)return null;
  const asc=per.slice().reverse(); // старые -> новые
  const rates=asc.map(p=>{
    const accrued=DB.accruals.filter(a=>a.osiId===oid&&a.period===p).reduce((s,a)=>s+a.amount,0);
    const collected=DB.payments.filter(x=>x.osiId===oid&&x.period===p).reduce((s,x)=>s+x.amount,0);
    return {p,accrued,collected,rate:accrued>0?collected/accrued:0};
  }).filter(x=>x.accrued>0);
  if(!rates.length)return null;
  const last=rates[rates.length-1];
  let trend=0;
  if(rates.length>=2){const prev=rates[rates.length-2];trend=last.rate-prev.rate;}
  const predictedRate=Math.max(0,Math.min(1,last.rate+trend*0.6));
  const predictedAccrual=last.accrued; // ближайший период обычно схож по составу начислений
  const predictedCollected=Math.round(predictedAccrual*predictedRate);
  return {lastPeriod:last.p,lastRate:Math.round(last.rate*100),predictedRate:Math.round(predictedRate*100),
    predictedCollected,predictedAccrual,trend:Math.round(trend*100)};
}
function aiAnomalies(oid){
  const out=[];
  // аномалии по начислениям услуг: сравниваем сумму начисления счёта за услугу с медианой по дому за тот же период
  const per=periods()[0];
  const bySvc={};
  DB.accruals.filter(a=>a.osiId===oid&&a.period===per).forEach(a=>{
    (bySvc[a.serviceId]=bySvc[a.serviceId]||[]).push(a);
  });
  for(const sid in bySvc){
    const arr=bySvc[sid].map(x=>x.amount).sort((a,b)=>a-b);
    const med=arr[Math.floor(arr.length/2)]||0; if(!med)continue;
    bySvc[sid].forEach(a=>{
      if(a.amount>med*2.2&&a.amount-med>3000){
        const acc=DB.accounts.find(x=>x.id===a.accountId);const svc=DB.services.find(x=>x.id===sid);
        out.push({type:'accrual',text:'Кв. '+(acc?acc.apt:'?')+' — начисление «'+(svc?svc.name:'услуга')+'» '+money(a.amount)+' почти в '+(Math.round(a.amount/med*10)/10)+'× выше типичного ('+money(med)+')'});
      }
    });
  }
  // аномалии по счетам поставщиков: скачок к прошлому периоду
  const pers=periods();
  DB.providers.filter(p=>p.osiId===oid).forEach(p=>{
    const inv=pers.map(pr=>DB.provInvoices.filter(x=>x.providerId===p.id&&x.period===pr).reduce((s,x)=>s+x.amount,0)).filter(x=>x>0);
    if(inv.length>=2){
      const cur=inv[0],prev=inv[1];
      if(prev>0&&cur>prev*1.6){out.push({type:'provider',text:'Поставщик «'+p.name+'» — счёт за месяц вырос на '+Math.round((cur/prev-1)*100)+'% ('+money(prev)+' → '+money(cur)+')'});}
    }
  });
  return out.slice(0,8);
}
function aiReqPriority(topic){
  const t=(topic||'').toLowerCase();
  const hi=['теч','протечк','авар','газ','пожар','дым','замыкан','электрич','лифт','вода','отоплен','провал'];
  const lo=['вопрос','шум','парков','домофон','ламп','покрас','косметич'];
  if(hi.some(k=>t.indexOf(k)>=0))return {label:'Высокий',cls:'bad'};
  if(lo.some(k=>t.indexOf(k)>=0))return {label:'Низкий',cls:'mut'};
  return {label:'Средний',cls:'warn'};
}
VIEWS.ai=function(){
  const oid=S.osi;const o=curOsi();
  let h=head('AI-аналитик · '+esc(o.name),'Скоринг риска, прогноз сборов, аномалии и приоритизация заявок на основе ваших данных');
  const risks=aiTopRisks(oid,8);
  const forecast=aiForecast(oid);
  const anomalies=aiAnomalies(oid);
  const openReqs=DB.requests.filter(r=>r.osiId===oid&&r.status!=='done').map(r=>({r,p:aiReqPriority(r.topic)}))
    .sort((a,b)=>({'Высокий':0,'Средний':1,'Низкий':2}[a.p.label]-{'Высокий':0,'Средний':1,'Низкий':2}[b.p.label]));

  // сводка / insight
  const totalDebt=osiAccounts(oid).reduce((s,a)=>{const b=accBalance(a.id);return s+(b>0?b:0);},0);
  const highRisk=risks.filter(x=>x.r.level==='bad').length;
  let insight='По дому «'+esc(o.name)+'» общая задолженность '+money(totalDebt)+'.';
  if(highRisk)insight+=' Высокий риск невозврата — у '+highRisk+' лицевых счетов, рекомендуем начать с них расчёт задолженности и напоминания.';
  else insight+=' Счетов с высоким риском не выявлено.';
  if(forecast){
    if(forecast.predictedRate<forecast.lastRate)insight+=' Прогноз собираемости на следующий период — '+forecast.predictedRate+'%, ниже текущих '+forecast.lastRate+'%: стоит заранее напомнить жителям об оплате.';
    else insight+=' Прогноз собираемости на следующий период — '+forecast.predictedRate+'%.';
  }

  h+='<div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,#0f2e26,#0c2320);border-color:#163f34;color:#eafaf5">'+
     '<div style="display:flex;gap:10px;align-items:center;margin-bottom:6px"><span class="ai-badge" style="margin:0">✦ AI-инсайт</span></div>'+
     '<p style="color:#cdeee3;line-height:1.6">'+insight+'</p></div>';

  h+='<div class="grid g3" style="margin-bottom:16px">'+
    kpi('r','alert','Высокий риск',highRisk,'лицевых счетов из '+osiAccounts(oid).length)+
    kpi('a','chart','Прогноз собираемости',forecast?forecast.predictedRate+'%':'—',forecast?'период '+perName(nextPeriod()):'мало данных')+
    kpi('','bell','Аномалий найдено',anomalies.length,'начисления и счета поставщиков')+
    '</div>';

  h+='<div class="grid g2" style="align-items:start">';
  // risk table
  h+='<div class="card"><h3>Скоринг риска должников</h3><div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Квартира</th><th class="num">Долг</th><th class="num">Риск</th></tr></thead><tbody>';
  h+=risks.length?risks.map(x=>'<tr><td><b>кв. '+esc(x.a.apt)+'</b><div class="small muted">'+esc(x.a.owner)+'</div></td>'+
     '<td class="num neg">'+money(accBalance(x.a.id))+'</td>'+
     '<td class="num"><span class="pill '+x.r.level+'">'+x.r.score+'/100</span></td></tr>').join(''):
     '<tr><td colspan="3" class="muted" style="padding:16px">Рисковых счетов не выявлено 🎉</td></tr>';
  h+='</tbody></table></div></div>';
  // anomalies
  h+='<div class="card"><h3>Обнаруженные аномалии</h3><div style="margin-top:10px;display:flex;flex-direction:column;gap:10px">';
  h+=anomalies.length?anomalies.map(a=>'<div style="display:flex;gap:9px;align-items:flex-start;font-size:13px"><span class="pill warn" style="flex:none">'+(a.type==='provider'?'Поставщик':'Начисление')+'</span><span>'+esc(a.text)+'</span></div>').join(''):
     '<div class="muted small" style="padding:6px 0">Аномалий за текущий период не найдено.</div>';
  h+='</div></div>';
  h+='</div>';

  // requests priority
  h+='<div class="card" style="margin-top:16px"><h3>Приоритизация заявок жителей (ИИ)</h3>'+
     '<p class="small muted" style="margin:6px 0 12px">Открытые заявки отсортированы по срочности на основе темы обращения.</p>';
  if(!openReqs.length)h+='<div class="muted small">Открытых заявок нет.</div>';
  else{
    h+='<div class="t-wrap" style="border:none"><table><thead><tr><th>Тема</th><th>Квартира</th><th>Приоритет</th><th>Статус</th></tr></thead><tbody>';
    h+=openReqs.map(x=>{const a=DB.accounts.find(k=>k.id===x.r.accountId)||{};
      return '<tr><td><b>'+esc(x.r.topic)+'</b></td><td>'+(a.apt?'кв.'+esc(a.apt):'—')+'</td>'+
        '<td><span class="pill '+x.p.cls+'">'+x.p.label+'</span></td>'+
        '<td>'+({new:'<span class="pill warn">Новая</span>',work:'<span class="pill info">В работе</span>'}[x.r.status]||'')+'</td></tr>';}).join('');
    h+='</tbody></table></div>';
  }
  h+='</div>';
  return h;
};

/* ================= ЗАЯВКИ ================= */
VIEWS.requests=function(){
  const oid=S.osi;const list=DB.requests.filter(r=>r.osiId===oid).sort((a,b)=>a.date<b.date?1:-1);
  let h=head('Заявки жителей · '+esc(curOsi().name),'Диспетчерская: приём и контроль исполнения',
    '<button class="btn" onclick="reqForm()">'+svg(IC.plus)+'Новая заявка</button>');
  const st={new:0,work:0,done:0};list.forEach(r=>st[r.status]=(st[r.status]||0)+1);
  h+='<div class="grid g3" style="margin-bottom:16px">'+
    kpi('a','bell','Новые',st.new||0)+kpi('','gear','В работе',st.work||0)+kpi('g','check','Выполнено',st.done||0)+'</div>';
  if(!list.length)return h+emptyState('Нет заявок','Заявки жителей появятся здесь.','<button class="btn" onclick="reqForm()">'+svg(IC.plus)+'Новая заявка</button>');
  h+='<div class="t-wrap"><table><thead><tr><th>Дата</th><th>Тема</th><th>Квартира</th><th>Исполнитель</th><th>Статус</th><th></th></tr></thead><tbody>';
  list.forEach(r=>{const a=DB.accounts.find(x=>x.id===r.accountId)||{};
    const pill={new:'<span class="pill warn">Новая</span>',work:'<span class="pill info">В работе</span>',done:'<span class="pill ok">Выполнена</span>'}[r.status];
    h+='<tr><td>'+esc(r.date)+'</td><td><b>'+esc(r.topic)+'</b></td><td>'+(a.apt?'кв.'+esc(a.apt):'—')+'</td><td>'+esc(r.assignee||'—')+'</td><td>'+pill+'</td>'+
      '<td class="num"><select class="sm" onchange="reqStatus(\''+r.id+'\',this.value)" style="padding:5px 8px"><option value="new"'+(r.status==='new'?' selected':'')+'>Новая</option><option value="work"'+(r.status==='work'?' selected':'')+'>В работе</option><option value="done"'+(r.status==='done'?' selected':'')+'>Выполнена</option></select></td></tr>';});
  h+='</tbody></table></div>';
  return h;
};
function reqStatus(id,st){DB.requests.find(x=>x.id===id).status=st;save();go('requests');}
function reqForm(){const accs=osiAccounts(S.osi);
  modal('Новая заявка','<div class="form-grid">'+fld('Тема заявки*','rq-topic','','Например: течь в подвале','full')+
    '<label class="fld"><span>Квартира</span><select id="rq-acc"><option value="">— не указана —</option>'+accs.map(a=>'<option value="'+a.id+'">кв.'+esc(a.apt)+' · '+esc(a.owner)+'</option>').join('')+'</select></label>'+
    fld('Исполнитель','rq-assignee','','ФИО / бригада')+'</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="reqSave()">'+svg(IC.check)+'Создать</button>');}
function reqSave(){const topic=val('rq-topic');if(!topic){toast('Укажите тему','bad');return;}
  DB.requests.push({id:uid('req'),osiId:S.osi,accountId:val('rq-acc')||null,topic,assignee:val('rq-assignee')||'—',status:'new',date:today()});
  save();closeModal();go('requests');toast('Заявка создана','ok');}

/* ================= СОТРУДНИКИ ================= */
VIEWS.employees=function(){
  let h=head('Сотрудники УК','Пользователи и роли в системе',
    '<button class="btn" onclick="empForm()">'+svg(IC.plus)+'Добавить сотрудника</button>');
  h+='<div class="t-wrap"><table><thead><tr><th>Сотрудник</th><th>Должность</th><th>Логин</th><th>Роль</th><th>Доступ</th><th></th></tr></thead><tbody>';
  DB.users.forEach(u=>{h+='<tr><td><b>'+esc(u.name)+'</b></td><td>'+esc(u.pos)+'</td><td class="mono">'+esc(u.login)+'</td>'+
    '<td>'+roleName(u.role)+'</td><td class="small muted">'+roleAccess(u.role)+'</td>'+
    '<td class="num"><button class="btn gho sm" onclick="empForm(\''+u.id+'\')">'+svg(IC.edit)+'</button></td></tr>';});
  h+='</tbody></table></div>';
  return h;
};
function roleName(r){return {director:'<span class="pill info">Директор</span>',accountant:'<span class="pill ok">Бухгалтер</span>',dispatcher:'<span class="pill mut">Диспетчер</span>'}[r]||r;}
function roleAccess(r){return {director:'Полный доступ',accountant:'Биллинг и бухгалтерия',dispatcher:'Счета, платежи, заявки'}[r]||'';}
function empForm(id){const u=id?DB.users.find(x=>x.id===id):{role:'accountant'};
  modal(id?'Редактировать сотрудника':'Новый сотрудник','<div class="form-grid">'+
    fld('ФИО*','ef-name',u.name,'','full')+fld('Должность','ef-pos',u.pos,'')+
    '<label class="fld"><span>Роль</span><select id="ef-role">'+['director','accountant','dispatcher'].map(r=>'<option value="'+r+'"'+(u.role===r?' selected':'')+'>'+({director:'Директор',accountant:'Бухгалтер',dispatcher:'Диспетчер'}[r])+'</option>').join('')+'</select></label>'+
    fld('Логин*','ef-login',u.login,'')+
    '<label class="fld"><span>Пароль'+(id?'':'*')+'</span><input id="ef-pass" type="text" placeholder="'+(id?'оставьте пустым, чтобы не менять':'например, временный пароль')+'"></label>'+'</div>',
    '<button class="btn gho" onclick="closeModal()">Отмена</button><button class="btn" onclick="empSave(\''+(id||'')+'\')">'+svg(IC.check)+'Сохранить</button>');}
function empSave(id){const name=val('ef-name'),login=val('ef-login'),pass=val('ef-pass');
  if(!name||!login){toast('Заполните ФИО и логин','bad');return;}
  if(!id&&!pass){toast('Укажите пароль для нового сотрудника','bad');return;}
  const d={name,pos:val('ef-pos'),role:val('ef-role'),login};
  if(pass)d.pass=pass; // непустой пароль — backend захэширует его при сохранении; пустой при редактировании = не менять
  if(id)Object.assign(DB.users.find(x=>x.id===id),d);else DB.users.push({id:uid('u'),...d});
  save();closeModal();go('employees');toast('Сохранено','ok');}


/* ================= ЗАЯВКИ С САЙТА ================= */
const LEAD_ST={new:['Новая','warn'],work:['В работе','info'],done:['Закрыта','ok'],spam:['Спам','mut']};
const LEAD_ROLE={osi:'ОСИ',uk:'УК',other:'Другое'};
VIEWS.leads=function(){
  setTimeout(loadLeads,0);
  return head('Заявки с сайта','Обращения из формы на turgyn.kz')+'<div id="leads-box" class="card"><p class="small muted">Загрузка…</p></div>';
};
async function loadLeads(){
  const box=document.getElementById('leads-box');if(!box)return;
  try{
    const r=await apiCall('/api/leads');
    if(!r.items.length){box.innerHTML='<p class="small muted">Заявок пока нет. Они появятся здесь, как только кто-то заполнит форму на сайте.</p>';return;}
    let h='<div class="t-wrap"><table><thead><tr><th>Дата</th><th>Организация</th><th>Контакт</th><th>Телефон</th><th class="num">Счетов</th><th>Комментарий</th><th>Статус</th></tr></thead><tbody>';
    r.items.forEach(l=>{const d=new Date(l.at);
      h+='<tr><td class="small">'+d.toLocaleDateString('ru-RU')+' '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})+'</td>'+
        '<td><b>'+esc(l.org)+'</b><div class="small muted">'+(LEAD_ROLE[l.role]||'')+'</div></td><td>'+esc(l.contact)+'</td>'+
        '<td class="mono"><a href="tel:'+esc(l.phone.replace(/[^\d+]/g,''))+'">'+esc(l.phone)+'</a></td>'+
        '<td class="num">'+(l.accounts||'—')+'</td><td class="small">'+esc(l.comment||'')+'</td>'+
        '<td><select onchange="leadStatus('+l.id+',this.value)">'+Object.keys(LEAD_ST).map(k=>'<option value="'+k+'"'+(l.status===k?' selected':'')+'>'+LEAD_ST[k][0]+'</option>').join('')+'</select></td></tr>';});
    box.innerHTML=h+'</tbody></table></div>';
  }catch(e){box.innerHTML='<p class="small muted">Не удалось загрузить заявки: '+esc(e.message||'')+'</p>';}
}
async function leadStatus(id,st){try{await apiCall('/api/leads/'+id+'/status','POST',{status:st});toast('Статус обновлён','ok');}catch(e){toast(e.message||'Ошибка','bad');}}

/* ================= НАСТРОЙКИ ================= */
VIEWS.settings=function(){
  let h=head('Настройки','Параметры организации и системы');
  h+='<div class="grid g2"><div class="card"><h3>Данные УК</h3><div class="form-grid" style="margin-top:12px">'+
    fld('Наименование','st-name',DB.org.name,'','full')+fld('БИН','st-bin',DB.org.bin,'')+
    fld('Город','st-city',DB.org.city,'')+fld('Телефон','st-phone',DB.org.phone,'')+
    '<div class="full"><button class="btn" onclick="orgSave()">'+svg(IC.check)+'Сохранить</button></div></div></div>';
  h+='<div class="card"><h3>Данные и обслуживание</h3>'+
    '<p class="small muted" style="margin:10px 0">Данные хранятся на сервере. Резервная копия базы создаётся автоматически каждый час, хранится неделя. Дополнительно можно выгрузить копию себе.</p>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn sec" onclick="exportDB()">'+svg(IC.doc)+'Экспорт (JSON)</button>'+
    '<button class="btn sec" onclick="exportAccountsCsv()">'+svg(IC.doc)+'Лицевые счета (CSV)</button>'+
    '<label class="btn sec" style="cursor:pointer">'+svg(IC.doc)+'Импорт<input type="file" accept="application/json" style="display:none" onchange="importDB(this)"></label>'+
    '<button class="btn sec" onclick="dedupAccounts()">'+svg(IC.people)+'Объединить дубли счетов</button>'+
    '<button class="btn danger" onclick="clearTxns()">'+svg(IC.trash)+'Очистить начисления/оплаты</button>'+
    '<button class="btn danger" onclick="wipeAll()">'+svg(IC.trash)+'Очистить всё</button></div>'+
    '</div></div>';
  // ---- Пеня ----
  h+='<div class="card" style="margin-top:16px"><h3>Начисление пени</h3>'+
    '<label style="display:flex;align-items:center;gap:11px;margin:12px 0;cursor:pointer;font-weight:600">'+
    '<input type="checkbox" '+(penaltyOn()?'checked':'')+' onchange="penToggle(this.checked)" style="width:18px;height:18px;accent-color:var(--brand)"> Начислять пеню за просрочку</label>'+
    (penaltyOn()?'<label class="fld" style="max-width:240px"><span>Ставка пени, % в день</span><input type="number" step="0.01" value="'+penaltyCfg().rate+'" onchange="penRate(this.value)"></label>':'')+
    '<p class="small muted" style="margin-top:10px">Если галочка снята — пеня <b>нигде</b> не рассчитывается и не отображается: ни в расчёте задолженности, ни в заявлении нотариусу, ни в иске.</p></div>';
  // ---- Импорт из 1С ----
  h+='<div class="card" style="margin-top:18px"><h3>Импорт данных из 1С (CSV / Excel)</h3>'+
    '<div style="margin:12px 0;padding:16px;background:linear-gradient(135deg,#e3f6f3,#f0fbf9);border:1px solid #c3e9e3;border-radius:12px">'+
    '<b>⚡ Быстрый импорт вашего отчёта 1С «Задолженность покупателей»</b>'+
    '<div class="small muted" style="margin:6px 0 12px">Загрузите файл выгрузки как есть (CSV). Система сама заберёт ОСИ, квартиры, собственников и долги (входящее сальдо), отбросив банки, «Без договора», строки услуг и промежуточные итоги. Текущая база при этом заменяется.</div>'+
    '<label class="btn" style="cursor:pointer">'+svg(IC.doc)+'Загрузить отчёт 1С<input type="file" accept=".csv,text/csv" style="display:none" onchange="importDebt1c(this)"></label></div>'+
    '<div style="margin:12px 0;padding:16px;background:#fff;border:1px solid #c3e9e3;border-radius:12px">'+
    '<b>🎯 Точный долг по «Списку должников» (по одному ОСИ)</b>'+
    '<div class="small muted" style="margin:6px 0 12px">Загрузите отчёт «Список должников» для одного дома (напр. 4-3.csv). Проставит точный долг по услугам (как в 1С, с копейками) и обнулит долг у квартир, которых нет в списке. Привязка — по номеру квартиры внутри ОСИ. Запускать <b>после</b> отчёта задолженности (нужны квартиры и ФИО).</div>'+
    '<label class="btn" style="cursor:pointer;margin-right:8px">'+svg(IC.doc)+'Сверить (показать расхождения)<input type="file" accept=".csv,text/csv" style="display:none" onchange="compareDebtorList(this)"></label>'+
    '<label class="btn sec" style="cursor:pointer">'+svg(IC.doc)+'Загрузить (заменить долг)<input type="file" accept=".csv,text/csv" style="display:none" onchange="importDebtorList(this)"></label></div>'+
    '<div style="margin:12px 0;padding:16px;background:#fff;border:1px solid #c3e9e3;border-radius:12px">'+
    '<b>📐 Импорт площадей и тарифов (регистр «Услуги КСК по договорам контрагентов»)</b>'+
    '<div class="small muted" style="margin:6px 0 12px">Загрузите выгрузку регистра (CSV). Берёт «Количество» из строк «Эксплуатационные расходы» как площадь. Привязка: если в выгрузке есть колонка <b>«Договор.Лицевой счет»</b> — по лицевому счёту (точно, даже без ФИО); иначе — по паре <b>дом + ФИО</b>. Запускать <b>после</b> отчёта «Задолженность покупателей». Заполняются только счета с пустой площадью.</div>'+
    '<label class="btn sec" style="cursor:pointer">'+svg(IC.doc)+'Загрузить регистр площадей<input type="file" accept=".csv,text/csv" style="display:none" onchange="importArea1c(this)"></label></div>'+
    '<div style="margin:12px 0;padding:16px;background:#fff;border:1px solid #c3e9e3;border-radius:12px">'+
    '<b>📅 Импорт истории по годам (начисления и оплаты)</b>'+
    '<div class="small muted" style="margin:6px 0 12px">Загрузите отчёт «Задолженность покупателей» за период. Имя файла задаёт период: <b>ГГГГ.csv</b> — за год (2020.csv), <b>ГГГГ-ММ.csv</b> — за месяц (2026-01.csv). Берёт «Увеличение долга» как начислено и «Погашение долга» как оплачено, привязывает по лицевому счёту (недостающие квартиры создаёт). Долг на начало самого раннего периода станет входящим сальдо. Повторная загрузка того же периода — заменяет его. Пример: годы 2020…2025, затем помесячно 2026-01, 2026-02 …</div>'+
    '<label class="btn sec" style="cursor:pointer">'+svg(IC.doc)+'Загрузить год (CSV)<input type="file" accept=".csv,text/csv" style="display:none" onchange="importHist1c(this)"></label></div>'+
    '<div class="hr"></div>'+
    '<p class="small muted" style="margin:8px 0 4px"><b>Или импорт по справочникам.</b> Порядок: 1) скачайте шаблон, 2) выгрузите из 1С в этот формат (или заполните вручную и сохраните как «CSV UTF-8»), 3) загрузите файл. Рекомендуемая последовательность: сначала ОСИ, затем лицевые счета, поставщики и услуги.</p>'+
    '<div class="t-wrap" style="margin-top:12px"><table><thead><tr><th>Справочник</th><th>Что содержит</th><th>Шаблон</th><th>Загрузка</th></tr></thead><tbody>'+
    impRow('ОСИ (клиенты)','Наименование, БИН, адрес, председатель, IBAN','osi')+
    impRow('Лицевые счета','Квартира, собственник, площадь, проживающие, вх. сальдо','accounts')+
    impRow('Поставщики','Контрагенты и их услуги','providers')+
    impRow('Услуги и тарифы','Наименование, тариф, база (м²/квартира/чел.)','services')+
    '</tbody></table></div>'+
    '<p class="small muted" style="margin-top:12px">Колонку <b>osi_name</b> заполняйте точно так же, как называется ОСИ (по нему привязываются счета/услуги). Разделитель в CSV — запятая или точка с запятой, распознаётся автоматически.</p>'+
    '</div>';
  // ---- Журнал загрузок ----
  const log=(DB.importLog||[]).slice().sort((a,b)=>String(a.period)<String(b.period)?-1:1);
  h+='<div class="card" style="margin-top:18px"><h3>История загрузок ('+log.length+')</h3>';
  if(!log.length)h+='<p class="small muted" style="margin-top:8px">Пока ничего не загружено. Здесь появятся все загруженные периоды и файлы.</p>';
  else{
    const tAcc=log.reduce((s,x)=>s+(x.accrued||0),0),tPay=log.reduce((s,x)=>s+(x.paid||0),0);
    h+='<div class="t-wrap" style="margin-top:10px"><table><thead><tr><th>Период</th><th>Файл</th><th>Загружено</th><th class="num">Квартир</th><th class="num">Начислено</th><th class="num">Оплачено</th><th></th></tr></thead><tbody>';
    log.forEach(x=>{const perLbl=/^\d/.test(String(x.period))?perName(x.period):x.period;
      h+='<tr><td><b>'+esc(perLbl)+'</b></td><td class="small muted">'+esc(x.file||'—')+'</td><td class="small">'+esc(x.at||'')+'</td>'+
        '<td class="num">'+(x.accounts!=null?x.accounts:'—')+'</td>'+
        '<td class="num">'+(x.accrued!=null?money(x.accrued):'—')+'</td>'+
        '<td class="num">'+(x.paid!=null?money(x.paid):'—')+'</td>'+
        '<td class="num"><button class="btn gho sm" onclick="delImportPeriod(\''+encodeURIComponent(x.period)+'\')" title="Удалить этот период">'+svg(IC.trash)+'</button></td></tr>';});
    h+='</tbody><tfoot><tr><td colspan="4">ИТОГО</td><td class="num">'+money(tAcc)+'</td><td class="num">'+money(tPay)+'</td><td></td></tr></tfoot></table></div>';
  }
  h+='</div>';
  return h;
};
function delImportPeriod(perEnc){const per=decodeURIComponent(perEnc);
  if(!confirm('Удалить загруженные данные за «'+(/^\d/.test(per)?perName(per):per)+'»?'))return;
  if(/^\d/.test(per)){DB.accruals=DB.accruals.filter(a=>a.period!==per);DB.payments=DB.payments.filter(p=>p.period!==per);}
  DB.importLog=(DB.importLog||[]).filter(x=>x.period!==per);
  save();go('settings');toast('Период удалён','ok');}
function impRow(name,desc,type){
  return '<tr><td><b>'+name+'</b></td><td class="small muted">'+desc+'</td>'+
    '<td><button class="btn gho sm" onclick="dlTemplate(\''+type+'\')">'+svg(IC.doc)+'Шаблон CSV</button></td>'+
    '<td><label class="btn sec sm" style="cursor:pointer">'+svg(IC.doc)+'Загрузить<input type="file" accept=".csv,text/csv" style="display:none" onchange="importCsv(this,\''+type+'\')"></label></td></tr>';
}
function orgSave(){DB.org.name=val('st-name');DB.org.bin=val('st-bin');DB.org.city=val('st-city');DB.org.phone=val('st-phone');
  save();document.getElementById('foot-org').textContent=DB.org.name;toast('Сохранено','ok');go('settings');}
function exportDB(){const blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='turgyn-backup-'+today()+'.json';a.click();toast('Резервная копия выгружена','ok');}
function exportAccountsCsv(){
  let out='osi_name;apt;ls;owner;phone;area;persons;saldo\n';
  DB.accounts.forEach(a=>{const o=DB.osi.find(x=>x.id===a.osiId)||{};
    const cell=v=>{v=String(v==null?'':v);return /[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
    out+=[cell(o.name),cell(a.apt),cell(a.ls),cell(a.owner),cell(a.phone),a.area||0,a.persons||0,a.saldoStart||0].join(';')+'\n';});
  const blob=new Blob(['﻿'+out],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='turgyn-litsevye-scheta.csv';a.click();
  toast('Выгружено лицевых счетов: '+DB.accounts.length,'ok');}
function importDB(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{const inc=JSON.parse(e.target.result);if(!Array.isArray(inc.osi))throw 0;
    if(!confirm('Загрузка резервной копии ЗАМЕНИТ все текущие данные (сотрудники сохранятся). Продолжить?'))return;
    delete inc.users;delete inc._v;delete inc._locks;
    apiCall('/api/state/replace','POST',{data:inc}).then(async()=>{await loadServerState();S.osi=DB.osi[0]?DB.osi[0].id:null;boot();toast('Резервная копия загружена','ok');})
      .catch(err=>toast('Не удалось загрузить: '+(err.message||'ошибка'),'bad'));}catch(x){toast('Ошибка файла','bad');}};r.readAsText(f);}
function dedupAccounts(){
  const groups={};
  DB.accounts.forEach(a=>{const k=a.osiId+'|'+String(a.apt).trim();(groups[k]=groups[k]||[]).push(a);});
  let merged=0,affected=0;
  const score=a=>((/^\d{6,}$/.test(String(a.ls).trim())?100:0)+(a.area>0?10:0)+((a.owner&&!/^Кв\./.test(a.owner))?1:0));
  Object.keys(groups).forEach(k=>{const list=groups[k];if(list.length<2)return;
    list.sort((x,y)=>score(y)-score(x)); // основной = с настоящим л/с, площадью, ФИО
    const keep=list[0];
    // входящее сальдо — из самого раннего периода
    let minY=(keep._minY!==undefined?keep._minY:9999),saldo=keep.saldoStart||0;
    list.forEach(a=>{const y=(a._minY!==undefined?a._minY:9999);if(y<minY){minY=y;saldo=a.saldoStart||0;}});
    keep.saldoStart=saldo;keep._minY=minY;
    // подтянуть лучшие атрибуты
    list.forEach(a=>{
      if(!/^\d{6,}$/.test(String(keep.ls).trim())&&/^\d{6,}$/.test(String(a.ls).trim()))keep.ls=a.ls;
      if(!keep.area&&a.area)keep.area=a.area;
      if((!keep.owner||/^Кв\./.test(keep.owner))&&a.owner&&!/^Кв\./.test(a.owner))keep.owner=a.owner;
      if(!keep.phone&&a.phone)keep.phone=a.phone; if(!keep.persons&&a.persons)keep.persons=a.persons;
      if((!keep.saldoBySvc||!Object.keys(keep.saldoBySvc).length)&&a.saldoBySvc&&Object.keys(a.saldoBySvc).length)keep.saldoBySvc=a.saldoBySvc;
    });
    list.slice(1).forEach(a=>{
      DB.accruals.forEach(x=>{if(x.accountId===a.id)x.accountId=keep.id;});
      DB.payments.forEach(x=>{if(x.accountId===a.id)x.accountId=keep.id;});
      DB.accounts=DB.accounts.filter(z=>z.id!==a.id);
      merged++;
    });
    affected++;
  });
  // подчистить точные дубли операций (на случай пересечения периодов)
  const sA={};DB.accruals=DB.accruals.filter(x=>{const k=x.accountId+'|'+x.period+'|'+x.serviceId+'|'+x.amount;if(sA[k])return false;sA[k]=1;return true;});
  const sP={};DB.payments=DB.payments.filter(x=>{const k=x.accountId+'|'+x.period+'|'+x.amount+'|'+x.method;if(sP[k])return false;sP[k]=1;return true;});
  save();go('accounts');
  toast(merged?('Объединено дублей: '+merged+' (квартир: '+affected+')'):'Дублей не найдено','ok');
}
function clearTxns(){
  if(!confirm('Удалить все НАЧИСЛЕНИЯ, ОПЛАТЫ и текущее сальдо?\n\nДома, квартиры, собственники и площади останутся. Это нужно перед загрузкой полной истории из 1С, чтобы суммы не задвоились.'))return;
  DB.accruals=[];DB.payments=[];DB.provInvoices=[];DB.provPayments=[];DB.importLog=[];
  DB.accounts.forEach(a=>{a.saldoStart=0;});
  save();go('settings');toast('Начисления и оплаты очищены','ok');
}
function wipeAll(){if(!confirm('Удалить ВСЕ данные без возможности восстановления?'))return;
  DB.osi=[];DB.houses=[];DB.accounts=[];DB.services=[];DB.accruals=[];DB.payments=[];DB.providers=[];DB.provInvoices=[];DB.provPayments=[];DB.requests=[];DB.importLog=[];
  S.osi=null;save();renderOsiPicker();go('osi');toast('Все объекты удалены','ok');}

/* ================= ИМПОРТ ИЗ 1С (CSV) ================= */
function csvSplitLine(line,d){const out=[];let cur='',q=false;
  for(let i=0;i<line.length;i++){const c=line[i];
    if(c==='"'){if(q&&line[i+1]==='"'){cur+='"';i++;}else q=!q;}
    else if(c===d&&!q){out.push(cur);cur='';}else cur+=c;}
  out.push(cur);return out;}
function parseCsv(text){
  text=text.replace(/^﻿/,'').replace(/\r/g,'');
  const lines=text.split('\n').filter(l=>l.trim().length);
  if(!lines.length)return [];
  const d=(lines[0].split(';').length>lines[0].split(',').length)?';':',';
  const rows=lines.map(l=>csvSplitLine(l,d));
  const header=rows[0].map(h=>h.trim().toLowerCase());
  return rows.slice(1).map(r=>{const o={};header.forEach((h,i)=>o[h]=(r[i]||'').trim());return o;});
}
function pick(row,aliases){for(const a of aliases){if(row[a]!=null&&row[a]!=='')return row[a];}return '';}
function num(v){if(v==null)return 0;v=String(v).replace(/\s/g,'').replace(',','.').replace(/[^0-9.\-]/g,'');return parseFloat(v)||0;}
function findOsiByName(n){n=(n||'').trim().toLowerCase();return DB.osi.find(o=>o.name.trim().toLowerCase()===n);}
function ensureOsi(name){let o=findOsiByName(name);if(!o){o={id:uid('osi'),name:name.trim(),bin:'',city:DB.org.city,address:'',
  chairman:'',phone:'',iban:'',bank:'',createdAt:today(),active:true};DB.osi.push(o);}return o;}
function ensureHouse(oid){let h=DB.houses.find(x=>x.osiId===oid);
  if(!h){const o=DB.osi.find(x=>x.id===oid)||{};h={id:uid('h'),osiId:oid,address:o.address||'',floors:9,entrances:1,totalArea:0};DB.houses.push(h);}return h;}
function ensureService(osiId,name){name=(name||'Услуга').trim();
  let s=DB.services.find(x=>x.osiId===osiId&&x.name.toLowerCase()===name.toLowerCase());
  if(!s){s={id:uid('svc'),osiId:osiId,name:name,tariff:0,unit:(/эксплуатац/i.test(name)?'m2':'apt'),active:true};DB.services.push(s);}
  return s;}
function normUnit(u){u=(u||'').toLowerCase();
  if(u.indexOf('m2')>=0||u.indexOf('м2')>=0||u.indexOf('кв.м')>=0||u.indexOf('площад')>=0)return 'm2';
  if(u.indexOf('чел')>=0||u.indexOf('person')>=0||u.indexOf('прожив')>=0)return 'person';return 'apt';}

const AL={
  name:['name','наименование','название','оси','наименование оси'],
  osi:['osi_name','оси','наименование оси','дом','объект'],
  bin:['bin','бин','иин/бин','иин','рнн'],
  city:['city','город'],
  address:['address','адрес'],
  chair:['chairman','председатель','руководитель','фио председателя'],
  phone:['phone','телефон','тел'],
  iban:['iban','счет','счёт','расчетный счет','р/с'],
  bank:['bank','банк'],
  apt:['apt','квартира','кв','кв.','номер квартиры','помещение'],
  ls:['ls','лицевой счет','лицевой счёт','л/с','лс','номер лс'],
  owner:['owner','собственник','фио','фио собственника','владелец'],
  area:['area','площадь','площадь кв','кв.м','м2'],
  persons:['persons','проживает','прожив','количество проживающих','чел'],
  saldo:['saldo','сальдо','вх сальдо','входящее сальдо','долг','задолженность','остаток'],
  service:['service','услуга','вид услуги'],
  tariff:['tariff','тариф','ставка','цена'],
  unit:['unit','база','единица','единица измерения','ед изм']
};
function impOsi(rows){let n=0;rows.forEach(r=>{const name=pick(r,AL.name)||pick(r,AL.osi);if(!name)return;
  const o=ensureOsi(name);
  const set=(k,v)=>{if(v)o[k]=v;};
  set('bin',pick(r,AL.bin));set('city',pick(r,AL.city));set('address',pick(r,AL.address));
  set('chairman',pick(r,AL.chair));set('phone',pick(r,AL.phone));set('iban',pick(r,AL.iban));set('bank',pick(r,AL.bank));
  n++;});return n+' ОСИ';}
function impAccounts(rows){let n=0;rows.forEach(r=>{
  const osiName=pick(r,AL.osi)||(curOsi()?curOsi().name:'');const apt=pick(r,AL.apt)||pick(r,AL.ls);
  if(!apt||!osiName)return;const o=ensureOsi(osiName);const hs=ensureHouse(o.id);
  const area=num(pick(r,AL.area));
  DB.accounts.push({id:uid('acc'),osiId:o.id,houseId:hs.id,apt:apt,
    ls:pick(r,AL.ls)||(String(o.id.slice(-3))+String(1000+osiAccounts(o.id).length+1)),
    owner:pick(r,AL.owner)||'—',phone:pick(r,AL.phone),area,persons:parseInt(num(pick(r,AL.persons)))||0,
    saldoStart:num(pick(r,AL.saldo))});n++;});return n+' лицевых счетов';}
function impProviders(rows){let n=0;rows.forEach(r=>{const osiName=pick(r,AL.osi)||(curOsi()?curOsi().name:'');
  const name=pick(r,AL.name);if(!name||!osiName)return;const o=ensureOsi(osiName);
  DB.providers.push({id:uid('prov'),osiId:o.id,name,service:pick(r,AL.service),bin:pick(r,AL.bin),
    phone:pick(r,AL.phone),iban:pick(r,AL.iban)});n++;});return n+' поставщиков';}
function impServices(rows){let n=0;rows.forEach(r=>{const osiName=pick(r,AL.osi)||(curOsi()?curOsi().name:'');
  const name=pick(r,AL.name);if(!name||!osiName)return;const o=ensureOsi(osiName);
  DB.services.push({id:uid('svc'),osiId:o.id,name,tariff:num(pick(r,AL.tariff)),unit:normUnit(pick(r,AL.unit)),active:true});n++;});return n+' услуг';}

function importCsv(input,type){const f=input.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{const rows=parseCsv(e.target.result);
    if(!rows.length){toast('Файл пуст или не распознан','bad');return;}
    let res;if(type==='osi')res=impOsi(rows);else if(type==='accounts')res=impAccounts(rows);
    else if(type==='providers')res=impProviders(rows);else res=impServices(rows);
    save();if(!S.osi&&DB.osi.length)S.osi=DB.osi[0].id;renderOsiPicker();
    toast('Импортировано: '+res,'ok');go('settings');
  }catch(x){toast('Ошибка импорта: '+x.message,'bad');}};
  r.readAsText(f,'utf-8');input.value='';}

const TPL={
  osi:'name;bin;city;address;chairman;phone;iban;bank\nЖК «Пример»;123456789012;Астана;ул. Примерная 1;Иванов И.И.;+7 700 000 00 00;KZ00000000000000000000;Halyk Bank',
  accounts:'osi_name;apt;ls;owner;phone;area;persons;saldo\nЖК «Пример»;1;1001;Ахметов А.А.;+7 777 000 00 00;54.2;3;0',
  providers:'osi_name;name;service;bin;phone;iban\nЖК «Пример»;ТОО «ГорВодоканал»;Водоснабжение;987654321098;+7 717 000 0000;KZ11111111111111111111',
  services:'osi_name;name;tariff;unit\nЖК «Пример»;Содержание жилья;45;m2\nЖК «Пример»;Вывоз ТБО;600;apt'
};
function dlTemplate(type){const blob=new Blob(['﻿'+TPL[type]],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='turgyn-шаблон-'+type+'.csv';a.click();
  toast('Шаблон скачан','ok');}

/* ---- Импорт отчёта 1С «Задолженность покупателей» ---- */
function cleanOsiName(c){return String(c).replace(/;.*$/,'').replace(/ /g,' ').replace(/\s+/g,' ').replace(/\s*-\s*/g,'-').replace(/,\s*$/,'').trim();}
function importDebt1c(input){const f=input.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{
    const text=String(e.target.result).replace(/\r/g,'').replace(/ /g,' ');
    const rows=text.split('\n').map(l=>csvSplitLine(l,';'));
    // предварительный подсчёт
    let cnt=0;for(let i=0;i<rows.length;i++){if(/^\s*\d+\s*квартира/i.test((rows[i][0]||'').trim()))cnt++;}
    if(!cnt){toast('В файле не найдены строки квартир — проверьте, что это отчёт «Задолженность покупателей»','bad');return;}
    if(!confirm('Найдено квартир: '+cnt+'. Импортировать? Текущие ОСИ и лицевые счета будут заменены данными из файла.'))return;
    DB.osi=[];DB.houses=[];DB.accounts=[];DB.services=[];DB.accruals=[];DB.payments=[];DB.providers=[];DB.provInvoices=[];DB.provPayments=[];DB.requests=[];DB.importLog=[];
    let curOsi=null,curHouse=null,nAcc=0;
    for(let i=0;i<rows.length;i++){
      const c0=String(rows[i][0]||'').trim();
      if(!c0)continue;
      if(/^ОСИ\s/i.test(c0)&&!/мкр/i.test(c0)){curOsi=ensureOsi(cleanOsiName(c0));curHouse=ensureHouse(curOsi.id);continue;}
      const km=c0.match(/^\s*(\d+)\s*квартира/i);
      if(km&&curOsi){
        const apt=km[1];
        const debtEnd=num(rows[i][5]||'');const adv=num(rows[i][7]||'');
        const acctSaldo=debtEnd>0?debtEnd:(adv>0?-adv:0);
        // разбор блока: собственник, л/с, услуги (долг на конец = col5 − аванс col7)
        let ls='',owner='',svcs=[],j=i+1,ownerDone=false;
        while(j<rows.length){
          const cj=String(rows[j][0]||'').trim();
          if(!cj){j++;continue;}
          if(/^\s*\d+\s*квартира/i.test(cj))break;
          if(/^ОСИ\s/i.test(cj))break;
          if(/^Без договора/i.test(cj)){j++;continue;}
          if(/^(итого|всего)\b/i.test(cj)){j++;continue;}
          const cm=cj.match(/(\d{6,})/);if(cm&&!ls)ls=cm[1];
          if(/^[\d\s.,-]+$/.test(cj)){j++;continue;}
          const isContract=/,\s*\d+\s*$/.test(cj)||/,\s*$/.test(cj);
          if(isContract){if(!ownerDone){owner=cj.replace(/,?\s*\d{6,}[\s\S]*$/,'').replace(/,\s*,?\s*\d+\s*$/,'').replace(/"/g,'').replace(/,\s*$/,'').trim();ownerDone=true;}j++;continue;}
          svcs.push({name:cj.replace(/\.\s*$/,'').trim(),saldo:num(rows[j][5]||'')-num(rows[j][7]||'')});
          j++;
        }
        if(!owner||/^\d/.test(owner))owner='Кв. '+apt;
        const effLs2=(ls||(String(curOsi.id.slice(-3))+apt)).trim();
        let a=DB.accounts.find(x=>x.osiId===curOsi.id&&String(x.ls).trim()===effLs2);
        if(!a){a={id:uid('acc'),osiId:curOsi.id,houseId:curHouse.id,apt:apt,ls:effLs2,owner:owner,phone:'',area:0,persons:0,saldoStart:0,saldoBySvc:{}};DB.accounts.push(a);nAcc++;}
        a.saldoBySvc=a.saldoBySvc||{};
        let sumSvc=0;
        svcs.forEach(sv=>{if(Math.round(sv.saldo)!==0){const svc=ensureService(a.osiId,sv.name);a.saldoBySvc[svc.id]=(a.saldoBySvc[svc.id]||0)+sv.saldo;sumSvc+=sv.saldo;}});
        if(!svcs.length||Math.round(sumSvc)===0){a.saldoStart=(a.saldoStart||0)+acctSaldo;}
        i=j-1;
      }
    }
    logImport('Отчёт задолженности (структура)',f.name,{accounts:nAcc});
    save();S.osi=DB.osi[0]?DB.osi[0].id:null;renderOsiPicker();
    toast('Импортировано: '+DB.osi.length+' ОСИ, '+nAcc+' лицевых счетов','ok');
    go('osi');
  }catch(x){toast('Ошибка импорта: '+x.message,'bad');}};
  r.readAsText(f,'utf-8');input.value='';}

/* ---- Импорт «Списка должников» (точный долг по услугам) ---- */
function importDebtorList(input){const f=input.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{
    const rows=String(e.target.result).replace(/\r/g,'').replace(/ /g,' ').split('\n').map(l=>csvSplitLine(l,';'));
    const cell=(row,i)=>String((row&&row[i])||'').trim();
    const debtCol=row=>{for(let c=4;c<row.length;c++){const v=cell(row,c);if(v&&/\d/.test(v))return num(v);}return null;};
    // определить ОСИ по коду вида «4- 3»
    let osi=null;
    for(let i=0;i<rows.length&&i<40;i++){const c=cell(rows[i],3);const m=c.match(/^([0-9A-Za-zА-Яа-я]+)\s*-\s*(\d+)$/);
      if(m){const nm=('ОСИ '+m[1]+'-'+m[2]).toLowerCase();osi=DB.osi.find(o=>o.name.replace(/\s+/g,' ').trim().toLowerCase()===nm);if(osi)break;}}
    if(!osi)osi=curOsi();
    if(!osi){toast('Не найден ОСИ для этого списка — откройте нужного клиента','bad');return;}
    // собрать долги по квартирам
    const map={};let curApt=null;
    for(let i=0;i<rows.length;i++){const c3=cell(rows[i],3);
      const km=c3.match(/^\s*(\d+)\s*квартира/i);
      if(km){curApt=km[1];map[curApt]={total:debtCol(rows[i])||0,svc:{}};continue;}
      if(!curApt||!c3)continue;
      if(/^ОСИ|^Житикара|^Итого|^Всего/i.test(c3)||/^[0-9A-Za-zА-Яа-я]+\s*-\s*\d+$/.test(c3)){curApt=null;continue;}
      const d=debtCol(rows[i]);if(d!=null)map[curApt].svc[c3.replace(/\.\s*$/,'').trim()]=d;
    }
    const apts=Object.keys(map);
    if(!apts.length){toast('Не распознаны строки должников (проверьте, что это «Список должников»)','bad');return;}
    if(!confirm('Список должников для «'+osi.name+'»: '+apts.length+' квартир. Обновить долги? У квартир, которых нет в списке, долг обнулится.'))return;
    let nD=0,total=0;
    osiAccounts(osi.id).forEach(a=>{a.saldoStart=0;a.saldoBySvc={};});
    apts.forEach(apt=>{const a=osiAccounts(osi.id).find(x=>String(x.apt).trim()===apt);if(!a)return;
      const m=map[apt];const names=Object.keys(m.svc);
      if(names.length)names.forEach(nm=>{if(Math.round(m.svc[nm])!==0){const svc=ensureService(osi.id,nm);a.saldoBySvc[svc.id]=(a.saldoBySvc[svc.id]||0)+m.svc[nm];}});
      else a.saldoStart=m.total;
      total+=accOpen(a);nD++;});
    logImport('Список должников: '+osi.name,f.name,{accounts:nD,accrued:total});
    save();renderOsiPicker();go('accounts');
    toast('Долги обновлены по «'+osi.name+'»: должников '+nD+', итого '+money(total),'ok');
  }catch(x){toast('Ошибка: '+x.message,'bad');}};
  r.readAsText(f,'utf-8');input.value='';}

/* ---- Разбор «Списка должников»: {osi, map: apt->{total,svc}} ---- */
function parseDebtorList(rows){
  const cell=(row,i)=>String((row&&row[i])||'').trim();
  const debtCol=row=>{for(let c=4;c<row.length;c++){const v=cell(row,c);if(v&&/\d/.test(v))return num(v);}return null;};
  let osi=null;
  for(let i=0;i<rows.length&&i<40;i++){const c=cell(rows[i],3);const m=c.match(/^([0-9A-Za-zА-Яа-я]+)\s*-\s*(\d+)$/);
    if(m){const nm=('ОСИ '+m[1]+'-'+m[2]).toLowerCase();osi=DB.osi.find(o=>o.name.replace(/\s+/g,' ').trim().toLowerCase()===nm);if(osi)break;}}
  if(!osi)osi=curOsi();
  const map={};let curApt=null;
  for(let i=0;i<rows.length;i++){const c3=cell(rows[i],3);
    const km=c3.match(/^\s*(\d+)\s*квартира/i);
    if(km){curApt=km[1];map[curApt]={total:debtCol(rows[i])||0,svc:{}};continue;}
    if(!curApt||!c3)continue;
    if(/^ОСИ|^Житикара|^Итого|^Всего/i.test(c3)||/^[0-9A-Za-zА-Яа-я]+\s*-\s*\d+$/.test(c3)){curApt=null;continue;}
    const d=debtCol(rows[i]);if(d!=null)map[curApt].svc[c3.replace(/\.\s*$/,'').trim()]=d;
  }
  return {osi:osi,map:map};
}
/* ---- Сверка со «Списком должников» (показать расхождения, ничего не менять) ---- */
let CMP_LAST=null;
function printCmp(){if(!CMP_LAST){toast('Нет данных сверки','bad');return;}
  const c=CMP_LAST;const diff=Math.round(c.sysT)-Math.round(c.lstT);
  const rows=c.rows.map(x=>{const d=x.diff,hl=Math.abs(d)>=1;
    return '<tr'+(hl?' style="background:#fdeeee"':'')+'><td>'+esc(x.apt)+'</td><td>'+esc(x.owner)+'</td><td class="r">'+money0(x.sys)+'</td><td class="r">'+money0(x.lst)+'</td>'+
      '<td class="r" style="color:'+(d>0?'#c0392b':(d<0?'#1e8449':'#333'))+';font-weight:'+(hl?'700':'400')+'">'+(d>0?'+':'')+money0(d)+'</td></tr>';}).join('');
  const html='<html><head><meta charset="utf-8"><title>Сверка '+esc(c.osiName)+'</title><style>'+
    '@page{size:A4 portrait;margin:12mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}'+
    'html,body{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{font-family:Segoe UI,Arial,sans-serif;color:#12332b;margin:0}'+
    '.hd{background:#10352a!important;color:#fff;padding:18px 22px;border-radius:12px;display:flex;justify-content:space-between;align-items:flex-start}'+
    '.hd .t{font-weight:800;font-size:20px}.hd .s{opacity:.85;font-size:12px;margin-top:3px}.hd .lg{font-weight:800;color:#3fe6c0;font-size:16px}'+
    '.sum{display:flex;gap:12px;margin:16px 0}.sum .b{flex:1;border:1px solid #e0ece9;border-radius:10px;padding:12px 14px}'+
    '.sum .k{color:#6a827a;font-size:12px}.sum .v{font-size:20px;font-weight:800;margin-top:3px}'+
    'table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #d7e6e2;padding:5px 8px}th{background:#e9f5f1;text-align:left}'+
    '.r{text-align:right;font-variant-numeric:tabular-nums}tfoot td{font-weight:800;background:#f4faf9}'+
    'tr{page-break-inside:avoid}.foot{margin-top:14px;color:#6a827a;font-size:11px}</style></head><body>'+
    '<div class="hd"><div><div class="t">Акт сверки задолженности</div><div class="s">'+esc(c.osiName)+' · на '+today()+'</div></div><div style="text-align:right"><div class="lg">turgyn</div><div class="s">Система учёта УК/ОСИ</div></div></div>'+
    '<div class="sum"><div class="b"><div class="k">Долг в системе</div><div class="v">'+money(c.sysT)+'</div></div>'+
      '<div class="b"><div class="k">Долг по списку 1С</div><div class="v">'+money(c.lstT)+'</div></div>'+
      '<div class="b"><div class="k">Разница</div><div class="v" style="color:'+(Math.abs(diff)>=1?'#c0392b':'#1e8449')+'">'+money(diff)+'</div></div></div>'+
    '<table><thead><tr><th>Кв.</th><th>Собственник</th><th class="r">В системе</th><th class="r">По списку 1С</th><th class="r">Разница</th></tr></thead><tbody>'+rows+
    '</tbody><tfoot><tr><td colspan="2">ИТОГО</td><td class="r">'+money0(c.sysT)+'</td><td class="r">'+money0(c.lstT)+'</td><td class="r">'+money0(diff)+'</td></tr></tfoot></table>'+
    '<div class="foot">Сформировано в Turgyn · '+today()+'. Красным выделены квартиры с расхождением. Подписи сторон: ____________ / ____________</div>'+
    '</body></html>';
  const w=window.open('','_blank');w.document.write(html);w.document.close();setTimeout(()=>w.print(),400);}
function compareDebtorList(input){const f=input.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{
    const rows=String(e.target.result).replace(/\r/g,'').replace(/ /g,' ').split('\n').map(l=>csvSplitLine(l,';'));
    const pr=parseDebtorList(rows);const osi=pr.osi,map=pr.map;
    if(!osi){toast('Не найден ОСИ для этого списка','bad');return;}
    if(!Object.keys(map).length){toast('Не распознаны строки должников','bad');return;}
    const accs=osiAccounts(osi.id);const seen={};const list=[];let sysT=0,lstT=0;
    accs.forEach(a=>{const sys=accBalance(a.id);const key=String(a.apt).trim();const lst=map[key]?map[key].total:0;
      list.push({apt:a.apt,owner:a.owner,sys:sys,lst:lst});seen[key]=1;sysT+=(sys>0?sys:0);lstT+=lst;});
    Object.keys(map).forEach(apt=>{if(!seen[apt]){list.push({apt:apt,owner:'⚠ нет в системе',sys:0,lst:map[apt].total});lstT+=map[apt].total;}});
    list.sort((x,y)=>(+x.apt)-(+y.apt));
    const allRows=list.map(x=>{const sysPos=x.sys>0?x.sys:0;return {apt:x.apt,owner:x.owner,sys:sysPos,lst:x.lst,diff:Math.round(sysPos)-Math.round(x.lst)};});
    CMP_LAST={osiName:osi.name,rows:allRows,sysT:sysT,lstT:lstT};
    let rowsH='',nDiff=0;
    allRows.forEach(x=>{if(Math.abs(x.diff)>=1){nDiff++;rowsH+='<tr><td><b>'+esc(x.apt)+'</b></td><td class="small">'+esc(x.owner)+'</td><td class="num">'+money0(x.sys)+'</td><td class="num">'+money0(x.lst)+'</td><td class="num '+(x.diff>0?'neg':'pos')+'" style="font-weight:700">'+(x.diff>0?'+':'')+money0(x.diff)+'</td></tr>';}});
    const body='<p class="small muted" style="margin-bottom:10px">Сверка долга в системе со «Списком должников» по «'+esc(osi.name)+'». Ниже — только расхождения. Полный отчёт (все квартиры) — кнопкой «Скачать CSV».</p>'+
      '<div class="grid g3" style="margin-bottom:12px">'+
        kpi('','money','В системе (долг)',money(sysT))+kpi('','doc','По списку',money(lstT))+kpi(Math.abs(sysT-lstT)>=1?'r':'g','alert','Разница',money(sysT-lstT),nDiff+' квартир расходятся')+'</div>'+
      '<div class="t-wrap"><table><thead><tr><th>Кв.</th><th>Собственник</th><th class="num">В системе</th><th class="num">По списку</th><th class="num">Разница</th></tr></thead><tbody>'+
      (rowsH||'<tr><td colspan="5" class="muted" style="padding:16px">Расхождений нет — суммы совпадают ✓</td></tr>')+'</tbody></table></div>';
    modal('Сверка со «Списком должников»',body,'<button class="btn sec" onclick="printCmp()">'+svg(IC.print)+'Печать / PDF</button><button class="btn gho" onclick="closeModal()">Закрыть</button>',true);
  }catch(x){toast('Ошибка сверки: '+x.message,'bad');}};
  r.readAsText(f,'utf-8');input.value='';}

/* ---- Импорт площадей из регистра «Услуги КСК» ---- */
function normName(s){return String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[«»"().]/g,' ').replace(/\s+/g,' ').trim();}
function bldKey(s){const m=String(s||'').match(/(\d+)\s*[а-яa-z.]*\D+?(\d+)/i);return m?(m[1]+'-'+m[2]):'';}
function importArea1c(input){const f=input.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{
    const rows=String(e.target.result).replace(/\r/g,'').replace(/ /g,' ').split('\n').map(l=>csvSplitLine(l,';'));
    const H=(rows[0]||[]).map(h=>String(h).trim().toLowerCase());
    const ci=n=>H.indexOf(n);
    const cOwner=ci('договор контрагента'),cNom=ci('номенклатура'),cBld=ci('жилой комплекс'),cQty=ci('количество');
    let cLs=-1;['лицевой счет','лицевой счёт','договор.лицевой счет','договор.лицевой счёт','л/с','лс'].forEach(n=>{if(cLs<0)cLs=ci(n);});
    if(cQty<0||cNom<0||(cOwner<0&&cLs<0)){toast('Не распознаны колонки (нужны: Количество, Номенклатура и Лицевой счёт или Договор контрагента)','bad');return;}
    const byKey={},byName={},byLs={};
    for(let i=1;i<rows.length;i++){const row=rows[i];if(!row)continue;
      if(String(row[cNom]||'').toLowerCase().indexOf('эксплуатац')<0)continue;
      const area=num(row[cQty]);if(!(area>0)||area>1000)continue;
      if(cLs>=0){const lv=String(row[cLs]||'').trim();if(lv)byLs[lv]=area;}
      const owner=cOwner>=0?normName(row[cOwner]):'';if(!owner||owner==='фио'||owner==='жкх')continue;
      const bld=bldKey(cBld>=0?row[cBld]:'');
      if(bld)byKey[owner+'|'+bld]=area;
      if(byName[owner]===undefined)byName[owner]=area; else if(byName[owner]!==area)byName[owner]=null;
    }
    let m0=0,m1=0,m2=0;
    DB.accounts.forEach(a=>{if(a.area>0)return;
      if(cLs>=0){const lv=String(a.ls).trim();if(byLs[lv]>0){a.area=byLs[lv];m0++;return;}}
      const owner=normName(a.owner);const o=DB.osi.find(x=>x.id===a.osiId)||{};const bld=bldKey(o.name);
      const ar=byKey[owner+'|'+bld];
      if(ar>0){a.area=ar;m1++;return;}
      if(byName[owner]>0){a.area=byName[owner];m2++;}
    });
    // обновим суммарную площадь домов
    DB.houses.forEach(h=>{h.totalArea=Math.round(DB.accounts.filter(a=>a.houseId===h.id).reduce((s,a)=>s+(a.area||0),0)*10)/10;});
    logImport('Площади',f.name,{accounts:m0+m1+m2});
    save();go('accounts');
    const filled=DB.accounts.filter(a=>a.area>0).length;
    toast('Площадь: по л/с '+m0+', по дому+ФИО '+m1+', по ФИО '+m2+'. С площадью: '+filled+' из '+DB.accounts.length,'ok');
  }catch(x){toast('Ошибка: '+x.message,'bad');}};
  r.readAsText(f,'utf-8');input.value='';}

/* ---- Импорт истории по годам («Задолженность покупателей» за год) ---- */
function importHist1c(input){const f=input.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=e=>{try{
    const text=String(e.target.result).replace(/\r/g,'').replace(/ /g,' ');
    const rows=text.split('\n').map(l=>csvSplitLine(l,';'));
    let per=null;
    const mm=f.name.match(/(20\d\d)[-_.](\d{1,2})(?!\d)/);
    if(mm)per=mm[1]+'-'+String(mm[2]).padStart(2,'0');
    else{const ym=f.name.match(/(20\d\d)/);if(ym)per=ym[1];}
    if(!per){for(let i=0;i<Math.min(12,rows.length);i++){const m=String(rows[i][0]||'').match(/за\s+(20\d\d)/i);if(m){per=m[1];break;}}}
    if(!per){toast('Не удалось определить период — назовите файл 2020.csv или 2026-01.csv','bad');return;}
    const yNum=parseInt(per,10);const isMonth=per.indexOf('-')>=0;const dt=isMonth?per+'-15':per+'-12-31';
    let cnt=0;for(let i=0;i<rows.length;i++){if(/^\s*\d+\s*квартира/i.test(String(rows[i][0]||'').trim()))cnt++;}
    if(!cnt){toast('В файле не найдены строки квартир','bad');return;}
    if(!confirm('Импортировать историю за «'+perName(per)+'»? Квартир в файле: '+cnt+'. Данные за этот период будут перезаписаны.'))return;
    // очистить прошлые записи этого года
    DB.accruals=DB.accruals.filter(a=>a.period!==per);
    DB.payments=DB.payments.filter(p=>p.period!==per);
    let curOsi=null,curHouse=null,nAcc=0,nNew=0,sumAcc=0,sumPay=0;
    for(let i=0;i<rows.length;i++){
      const c0=String(rows[i][0]||'').trim();if(!c0)continue;
      if(/^ОСИ\s/i.test(c0)&&!/мкр/i.test(c0)){curOsi=ensureOsi(cleanOsiName(c0));curHouse=ensureHouse(curOsi.id);continue;}
      const km=c0.match(/^\s*(\d+)\s*квартира/i);
      if(km&&curOsi){
        const apt=km[1];
        const debtStart=num(rows[i][1])-num(rows[i][2]);
        const payTotal=num(rows[i][4]);
        // разбор блока квартиры: собственник, лицевой счёт, строки услуг
        let ls='',owner='',svcs=[],j=i+1,ownerDone=false;
        while(j<rows.length){
          const cj=String(rows[j][0]||'').trim();
          if(!cj){j++;continue;}
          if(/^\s*\d+\s*квартира/i.test(cj))break;         // следующая квартира
          if(/^ОСИ\s/i.test(cj))break;                      // любой ОСИ / служебная строка
          if(/^Без договора/i.test(cj)){j++;continue;}
          if(/^(итого|всего)\b/i.test(cj)){j++;continue;}   // итоговые строки
          const m=cj.match(/(\d{6,})/);if(m&&!ls)ls=m[1];   // лицевой счёт
          if(/^[\d\s.,-]+$/.test(cj)){j++;continue;}         // строка-код (только цифры)
          // строки собственника/контрагента заканчиваются на «, номер» или «,» — это НЕ услуги
          const isContract=/,\s*\d+\s*$/.test(cj)||/,\s*$/.test(cj)||/,\s*,\s*\d+\s*$/.test(cj);
          if(isContract){
            if(!ownerDone){owner=cj.replace(/,?\s*\d{6,}[\s\S]*$/,'').replace(/,\s*,?\s*\d+\s*$/,'').replace(/"/g,'').replace(/,\s*$/,'').trim();ownerDone=true;}
            j++;continue;
          }
          svcs.push({name:cj.replace(/\.\s*$/,'').trim(),accr:num(rows[j][3])}); // чистое название = услуга
          j++;
        }
        if(!owner||/^\d/.test(owner))owner='Кв. '+apt;
        const realLs=/^\d{6,}$/.test(String(ls).trim())?String(ls).trim():'';
        const effLs=(realLs||(String(curOsi.id.slice(-3))+apt)).trim();
        let a=realLs?DB.accounts.find(x=>x.osiId===curOsi.id&&String(x.ls).trim()===realLs):null;
        if(!a)a=DB.accounts.find(x=>x.osiId===curOsi.id&&String(x.apt).trim()===apt);
        if(!a){a={id:uid('acc'),osiId:curOsi.id,houseId:curHouse.id,apt:apt,ls:effLs,
          owner:owner,phone:'',area:0,persons:0,saldoStart:0};DB.accounts.push(a);nNew++;}
        else{if(realLs&&!/^\d{6,}$/.test(String(a.ls).trim()))a.ls=realLs;
          if((!a.owner||/^Кв\./.test(a.owner))&&owner&&!/^Кв\./.test(owner))a.owner=owner;}
        if(a._minY===undefined||yNum<a._minY){a._minY=yNum;a.saldoStart=debtStart;}
        let accrTot=0;
        svcs.forEach(sv=>{if(sv.accr>0){const svc=ensureService(a.osiId,sv.name);
          DB.accruals.push({id:uid('acr'),osiId:a.osiId,accountId:a.id,serviceId:svc.id,period:per,amount:sv.accr,base:0,unit:svc.unit,createdAt:dt});accrTot+=sv.accr;}});
        if(accrTot===0){const accr=num(rows[i][3]);if(accr>0){DB.accruals.push({id:uid('acr'),osiId:a.osiId,accountId:a.id,serviceId:null,period:per,amount:accr,base:0,unit:'',createdAt:dt});accrTot=accr;}}
        sumAcc+=accrTot;
        if(payTotal>0){DB.payments.push({id:uid('pay'),osiId:a.osiId,accountId:a.id,period:per,amount:payTotal,method:'1c',date:dt});sumPay+=payTotal;}
        nAcc++;
        i=j-1;
      }
    }
    logImport(per,f.name,{accounts:nAcc,newAcc:nNew,accrued:sumAcc,paid:sumPay});
    save();if(!S.osi&&DB.osi.length)S.osi=DB.osi[0].id;renderOsiPicker();go('accounts');
    toast(perName(per)+': квартир '+nAcc+' (новых '+nNew+'), начислено '+money(sumAcc)+', оплачено '+money(sumPay),'ok');
  }catch(x){toast('Ошибка: '+x.message,'bad');}};
  r.readAsText(f,'utf-8');input.value='';}


/* ================= ИМПОРТ ИСТОРИИ ИЗ 1С =================
   Источники: «Карточка счёта» (операции с датами) и «Анализ субконто» (сальдо по квартирам)
   по счёту расчётов с жильцами (у ОСИ на HAUSMANAGER — 1274), сохранённые из 1С в .xlsx.
   Порядок: разбор → предпросмотр со сверкой сальдо → загрузка одним пакетом → откат пакета. */

/* --- чтение .xlsx без внешних библиотек: ZIP + XML --- */
async function readXlsx(file){
  const buf=new Uint8Array(await file.arrayBuffer());
  const dv=new DataView(buf.buffer,buf.byteOffset,buf.byteLength);
  if(buf.length<4||dv.getUint32(0,true)!==0x04034b50)
    throw new Error(/\.xls$/i.test(file.name)?'Это файл старого формата .xls. В 1С сохраните отчёт как «Лист Excel 2007 (.xlsx)».':'Файл не похож на .xlsx');
  let eocd=-1;
  for(let i=buf.length-22;i>=Math.max(0,buf.length-65557);i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}}
  if(eocd<0)throw new Error('Повреждённый .xlsx');
  const n=dv.getUint16(eocd+10,true);let p=dv.getUint32(eocd+16,true);const files={};const td=new TextDecoder();
  for(let i=0;i<n;i++){
    if(dv.getUint32(p,true)!==0x02014b50)break;
    const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lho=dv.getUint32(p+42,true);
    files[td.decode(buf.subarray(p+46,p+46+nl)).replace(/^\//,'')]={method,csize,lho};p+=46+nl+xl+cl;
  }
  async function read(name){
    const f=files[name];if(!f)return null;
    const start=f.lho+30+dv.getUint16(f.lho+26,true)+dv.getUint16(f.lho+28,true);
    const data=buf.subarray(start,start+f.csize);
    if(f.method===0)return td.decode(data);
    if(f.method!==8)throw new Error('Неподдерживаемое сжатие в .xlsx');
    const out=await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
    return td.decode(out);
  }
  const xml=s=>new DOMParser().parseFromString(s,'application/xml');
  const tags=(node,t)=>Array.from(node.getElementsByTagNameNS('*',t));
  // первый лист книги
  let sheetPath=null;
  const wb=await read('xl/workbook.xml'),rels=await read('xl/_rels/workbook.xml.rels');
  if(wb&&rels){
    const s0=tags(xml(wb),'sheet')[0];
    const rid=s0&&(s0.getAttribute('r:id')||s0.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id'));
    const rel=tags(xml(rels),'Relationship').find(r=>r.getAttribute('Id')===rid);
    if(rel){const t=rel.getAttribute('Target').replace(/^\//,'');sheetPath=t.startsWith('xl/')?t:'xl/'+t;}
  }
  if(!sheetPath||!files[sheetPath])sheetPath=Object.keys(files).filter(k=>/^xl\/worksheets\/sheet\d*\.xml$/.test(k)).sort()[0];
  if(!sheetPath)throw new Error('В файле нет листов');
  const ssx=await read('xl/sharedStrings.xml');
  const shared=ssx?tags(xml(ssx),'si').map(si=>tags(si,'t').map(t=>t.textContent).join('')):[];
  const doc=xml(await read(sheetPath));
  const rows=[];
  const colIdx=ref=>{const m=/^([A-Z]+)/.exec(ref||'');let c=0;if(m)for(const ch of m[1])c=c*26+ch.charCodeAt(0)-64;return c-1;};
  tags(doc,'row').forEach((r,ri)=>{
    const rn=(parseInt(r.getAttribute('r'),10)||ri+1)-1;const row=rows[rn]=[];
    tags(r,'c').forEach((c,ci)=>{
      const col=c.getAttribute('r')?colIdx(c.getAttribute('r')):ci;const t=c.getAttribute('t');
      const v=tags(c,'v')[0];let val='';
      if(t==='s')val=v?(shared[+v.textContent]||''):'';
      else if(t==='inlineStr')val=tags(c,'t').map(x=>x.textContent).join('');
      else if(t==='str'||t==='e')val=v?v.textContent:'';
      else if(t==='b')val=v?v.textContent==='1':'';
      else val=v?Number(v.textContent):'';
      row[col]=val;
    });
  });
  for(let i=0;i<rows.length;i++)rows[i]=Array.from(rows[i]||[],v=>v===undefined||v===null?'':v); // без «дыр»: пустые ячейки — пустые строки
  return rows;
}

/* --- разбор отчётов 1С --- */
const IMP_STR=v=>v===undefined||v===null?'':String(v).replace(/\r/g,'').trim();
function impNum(v){if(typeof v==='number')return v;const s=IMP_STR(v).replace(/\s|\u00a0/g,'').replace(',','.');const n=parseFloat(s);return isFinite(n)?n:0;}
function impDate(v){
  if(typeof v==='number'&&v>20000&&v<80000){const d=new Date(Math.round((v-25569)*86400000));return d.toISOString().slice(0,10);}
  const m=/^(\d{2})\.(\d{2})\.(\d{4})/.exec(IMP_STR(v));return m?m[3]+'-'+m[2]+'-'+m[1]:null;
}
function impApt(s){
  s=IMP_STR(s);let m;
  if((m=/^(\d+[а-яА-Яa-zA-Z]?)\s*(квартира|кв\.?)(?=[\s.,]|$)/i.exec(s)))return m[1];
  if((m=/^(кв\.?|квартира)\s*№?\s*(\d+[а-яА-Я]?)/i.exec(s)))return m[2];
  if((m=/^(нежилое помещение|нп|н\/п)\s*№?\s*(\d+)/i.exec(s)))return 'НП'+m[2];
  if((m=/^(\d+)\s*(нежилое|н\/п|нп)(?=[\s.,]|$)/i.exec(s)))return 'НП'+m[1];
  return null;
}
function impSvc(s){s=IMP_STR(s).replace(/\.+$/,'').trim();return s||'Без услуги';}
function impIsOrg(s){return /^(ГУ|ТОО|АО|ИП|КГУ|РГУ|ОО|ОСИ|ПК)(?=[\s"«]|$)|["«]/.test(IMP_STR(s));}

function parseCard1c(rows){
  let title=null,org=IMP_STR(rows[0]&&rows[0][0]),h=-1;
  for(let i=0;i<Math.min(rows.length,30);i++){
    const line=rows[i].map(IMP_STR).join(' ');
    const m=/Карточка\s+сч[её]та\s+(\S+)\s+за\s+(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})/i.exec(line);
    if(m)title={acct:m[1],from:impDate(m[2]),to:impDate(m[3])};
    if(rows[i].some(c=>IMP_STR(c)==='Период')&&rows[i].some(c=>/^Документ/.test(IMP_STR(c)))){h=i;break;}
  }
  if(!title)throw new Error('Это не «Карточка счёта»: не найден заголовок «Карточка счета … за …»');
  if(h<0)throw new Error('В карточке не найдена строка с заголовками колонок');
  const H=rows[h].map(IMP_STR);const col=t=>H.findIndex(x=>x===t||x.startsWith(t));
  const C={per:col('Период'),doc:col('Документ'),adt:col('Аналитика Дт'),akt:col('Аналитика Кт'),ind:col('Показатель'),dt:col('Дебет'),kt:col('Кредит')};
  if(Object.values(C).some(x=>x<0))throw new Error('В карточке нет нужных колонок (Период, Документ, Аналитика Дт/Кт, Дебет, Кредит)');
  const ops=[];
  for(let i=h+1;i<rows.length;i++){
    const r=rows[i];const date=impDate(r[C.per]);
    if(!date||IMP_STR(r[C.ind])!=='БУ')continue;
    const docLines=IMP_STR(r[C.doc]).split('\n');
    ops.push({row:i,date,doc:docLines[0].trim(),oper:(docLines[1]||'').trim(),
      adt:IMP_STR(r[C.adt]).split('\n').map(x=>x.trim()),akt:IMP_STR(r[C.akt]).split('\n').map(x=>x.trim()),
      dacc:IMP_STR(r[C.dt]),kacc:IMP_STR(r[C.kt]),dsum:impNum(r[C.dt+1]),ksum:impNum(r[C.kt+1])});
  }
  if(!ops.length)throw new Error('В карточке нет операций');
  return {org,acct:title.acct,from:title.from,to:title.to,ops};
}

function parseSubconto1c(rows){
  let title=null,org=IMP_STR(rows[0]&&rows[0][0]),acct=null,h=-1;
  for(let i=0;i<Math.min(rows.length,30);i++){
    const line=rows[i].map(IMP_STR).join(' ');
    const m=/Анализ\s+субконто.*?за\s+(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})/i.exec(line);
    if(m)title={from:impDate(m[1]),to:impDate(m[2])};
    const a=/Код\s+сч[её]та\s+Равно\s+"?(\d+)"?/i.exec(line);if(a)acct=a[1];
    if(rows[i].some(c=>/Сальдо на начало/.test(IMP_STR(c)))){h=i;break;}
  }
  if(!title||h<0)throw new Error('Это не «Анализ субконто»: не найдены заголовок или колонки сальдо');
  const H=rows[h].map(IMP_STR);
  const cOpen=H.findIndex(x=>/Сальдо на начало/.test(x)),cTurn=H.findIndex(x=>/Обороты/.test(x)),cClose=H.findIndex(x=>/Сальдо на конец/.test(x));
  const apts={};let cur=null;
  for(let i=h+1;i<rows.length;i++){
    const r=rows[i];const name=IMP_STR(r[0]);if(!name)continue;
    if(/^Итого/i.test(name))break;
    const apt=impApt(name);
    if(apt){cur=apts[apt]={apt,open:impNum(r[cOpen])-impNum(r[cOpen+1]),dt:impNum(r[cTurn]),kt:impNum(r[cTurn+1]),close:impNum(r[cClose])-impNum(r[cClose+1]),contracts:[]};continue;}
    if(cur&&!/^(Без договора|Договор\s*№)/i.test(name)&&!/^\d{4}$/.test(name)&&!/подразделение/i.test(name)){
      // строка-договор под квартирой; строки-контрагенты (банк, ИП, ОСИ) прерывают квартиру
      if(/банк|^(ИП|ОСИ|ТОО|АО)(?=[\s"«]|$)/i.test(name)&&!/Отдел/i.test(name)){cur=null;continue;}
      cur.contracts.push(name);
    }
  }
  if(!Object.keys(apts).length)throw new Error('В Анализе субконто не найдено ни одной квартиры');
  return {org,acct,from:title.from,to:title.to,apts};
}

/* --- классификация проводок: что из них — жилец --- */
function classifyCard(card){
  const acct=card.acct;const res={moves:[],skipped:{},apts:{},services:{},periods:new Set()};
  const occ={};
  const aptSide=(an,acc)=>acc===acct?impApt(an[1]):null;
  const touch=(apt,an)=>{const a=res.apts[apt]=res.apts[apt]||{apt,owners:{},acr:0,pay:0,xfer:0,ops:0};const o=IMP_STR(an[2]);if(o)a.owners[o]=(a.owners[o]||0)+1;a.ops++;return a;};
  const svc=(name,kind,amt,acc)=>{const s=res.services[name]=res.services[name]||{name,acr:0,pay:0,count:0,accs:{}};s.count++;if(kind==='acr')s.acr+=amt;if(kind==='pay')s.pay+=amt;if(acc)s.accs[acc]=1;};
  card.ops.forEach(o=>{
    const amt=Math.round((o.dsum||o.ksum)*100)/100;if(!amt)return;
    const base=[o.date,o.doc,o.dacc,o.kacc,o.adt.join('/'),o.akt.join('/'),amt].join('|');occ[base]=(occ[base]||0)+1;
    const src=base+'#'+occ[base];const per=o.date.slice(0,7);
    const ad=aptSide(o.adt,o.dacc),ak=aptSide(o.akt,o.kacc);
    const mv=(type,apt,an,sign,kind)=>{const a=touch(apt,an);const sname=impSvc(an[3]);
      res.moves.push({type,kind,apt,owner:IMP_STR(an[2]),svc:sname,amount:sign*amt,date:o.date,period:per,doc:o.doc,src:src+(type==='xfer'?(sign>0?'+':'-'):'')});
      if(type==='acr')a.acr+=sign*amt;else if(type==='pay')a.pay+=sign*amt;else a.xfer+=sign*amt;
      svc(sname,type==='pay'?'pay':'acr',sign*amt,type==='acr'?(sign>0?o.kacc:o.dacc):null);res.periods.add(per);};
    if(ad&&ak){mv('xfer',ad,o.adt,1,'transfer');mv('xfer',ak,o.akt,-1,'transfer');}
    else if(ad){if(o.kacc.startsWith('10'))mv('pay',ad,o.adt,-1,'refund');else mv('acr',ad,o.adt,1,'import');}
    else if(ak){if(o.dacc.startsWith('10')||o.dacc===acct)mv('pay',ak,o.akt,1,'import');else mv('acr',ak,o.akt,-1,'writeoff');}
    else{const k=o.doc.replace(/\s*\d{6,}.*$/,'').trim()||'Прочее';const s=res.skipped[k]=res.skipped[k]||{name:k,count:0,sum:0};s.count++;s.sum+=amt;}
  });
  return res;
}

/* --- экран импорта --- */
let IMP=null; // {card, sub, cls, osiId, map, mode}
VIEWS.import1c=function(){
  let h=head('Импорт истории из 1С','Начисления и оплаты по квартирам — из «Карточки счёта» и «Анализа субконто»');
  h+='<div class="card" style="margin-bottom:16px"><h3>1. Выгрузите из 1С два отчёта по счёту расчётов с жильцами</h3>'+
    '<ol class="small" style="margin:10px 0 0 18px;line-height:1.7">'+
    '<li><b>Карточка счёта</b> — Отчёты → Карточка счета (бух.) → счёт <b>1274</b> (у вашей 1С расчёты с жильцами на нём) → период с начала учёта по сегодня.</li>'+
    '<li><b>Анализ субконто</b> — тот же период, виды субконто «Контрагенты, Договоры», отбор «Счёт Равно 1274». Из него берётся сальдо каждой квартиры на начало и проверка итога.</li>'+
    '<li>Сохраните оба отчёта как <b>«Лист Excel 2007 (.xlsx)»</b> — не «.xls».</li></ol>'+
    '<p class="small muted" style="margin-top:8px">Один файл — один дом. Повторная загрузка того же файла ничего не задвоит.</p></div>';
  h+='<div class="card" style="margin-bottom:16px"><h3>2. Загрузите файлы</h3><div class="form-grid" style="margin-top:12px">'+
    '<label class="fld full"><span>В какой ОСИ загружать</span><select id="im-osi"><option value="__new">+ Создать ОСИ по названию из файла</option>'+
      DB.osi.map(o=>'<option value="'+o.id+'"'+(o.id===S.osi?' selected':'')+'>'+esc(o.name)+'</option>').join('')+'</select></label>'+
    '<label class="fld"><span>Карточка счёта (.xlsx)*</span><input type="file" id="im-card" accept=".xlsx"></label>'+
    '<label class="fld"><span>Анализ субконто (.xlsx)</span><input type="file" id="im-sub" accept=".xlsx"></label>'+
    '<div class="full"><button class="btn" onclick="impCheck()">'+svg(IC.check)+'Проверить файлы</button></div></div></div>';
  h+='<div id="im-out"></div>';
  const hist=(DB.importLog||[]).filter(x=>x.batch).slice().reverse();
  if(hist.length){
    h+='<div class="card" style="margin-top:16px"><h3>Загрузки из 1С</h3><div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Когда</th><th>ОСИ</th><th>Файл</th><th>Период</th><th class="num">Операций</th><th>Кто</th><th></th></tr></thead><tbody>'+
      hist.map(x=>{const o=DB.osi.find(z=>z.id===x.osiId)||{};const alive=DB.accruals.some(a=>a.batch===x.batch)||DB.payments.some(p=>p.batch===x.batch);
        return '<tr><td class="small">'+esc(x.at||'')+'</td><td>'+esc(o.name||'—')+'</td><td class="small">'+esc(x.file||'')+'</td><td class="small">'+(x.from?perName(x.from.slice(0,7))+' — '+perName(x.to.slice(0,7)):'')+'</td>'+
          '<td class="num">'+(x.ops||0)+'</td><td class="small muted">'+esc(x.by||'')+'</td><td class="num">'+(alive?'<button class="btn gho sm" onclick="impRollback(\''+x.batch+'\')">Отменить загрузку</button>':'<span class="small muted">отменена</span>')+'</td></tr>';}).join('')+
      '</tbody></table></div></div>';
  }
  return h;
};

async function impCheck(){
  const fc=document.getElementById('im-card').files[0],fs=document.getElementById('im-sub').files[0];
  const out=document.getElementById('im-out');
  if(!fc){toast('Выберите файл «Карточка счёта»','bad');return;}
  out.innerHTML='<div class="card"><p class="small muted">Читаю файлы…</p></div>';
  try{
    const card=parseCard1c(await readXlsx(fc));
    const sub=fs?parseSubconto1c(await readXlsx(fs)):null;
    if(sub&&sub.acct&&sub.acct!==card.acct)throw new Error('Отчёты по разным счетам: карточка — '+card.acct+', анализ субконто — '+sub.acct);
    const cls=classifyCard(card);
    let osiId=val('im-osi');
    IMP={card,sub,cls,osiId,file:fc.name+(fs?' + '+fs.name:''),map:{}};
    impRender();
  }catch(e){out.innerHTML='<div class="card"><p class="neg"><b>Не удалось прочитать:</b> '+esc(e.message||String(e))+'</p></div>';}
}
function impGuessFund(name){return /ремонт\s*мжд|капитал|капрем|накопит|вознагражд/i.test(name)?'savings':'current';}
function impRender(){
  const {card,sub,cls}=IMP;const osiId=val('im-osi')||IMP.osiId;IMP.osiId=osiId;
  const osi=DB.osi.find(o=>o.id===osiId);const osiSvcs=osi?DB.services.filter(s=>s.osiId===osiId):[];
  const aptKeys=[...new Set([...Object.keys(cls.apts),...(sub?Object.keys(sub.apts):[])])].sort((a,b)=>(parseInt(a,10)||1e9)-(parseInt(b,10)||1e9)||String(a).localeCompare(String(b)));
  // сверка: входящее + движения = исходящее
  let ok=0,bad=0;const rowsH=[];
  aptKeys.forEach(k=>{const a=cls.apts[k]||{acr:0,pay:0,xfer:0,owners:{}};const s=sub&&sub.apts[k];
    const open=s?s.open:0;const calc=open+a.acr-a.pay+a.xfer;const match=s?Math.abs(calc-s.close)<0.01:null;
    if(match===true)ok++;else if(match===false)bad++;
    const owners=Object.keys(a.owners);const contracts=s?s.contracts:[];const multi=new Set([...owners,...contracts]).size>1;
    rowsH.push('<tr><td><b>'+esc(k)+'</b></td><td class="small">'+esc(owners.concat(contracts).filter((v,i,ar)=>ar.indexOf(v)===i).join(', '))+(multi?' <span class="pill warn">несколько плательщиков</span>':'')+'</td>'+
      '<td class="num">'+money(open)+'</td><td class="num">'+money(a.acr)+'</td><td class="num pos">'+money(a.pay)+'</td><td class="num">'+(a.xfer?money(a.xfer):'—')+'</td>'+
      '<td class="num" style="font-weight:700">'+money(calc)+'</td><td class="num">'+(s?money(s.close):'—')+'</td><td>'+(match===null?'—':match?'<span class="pill ok">✓</span>':'<span class="pill bad">расхождение</span>')+'</td></tr>');});
  const per=[...cls.periods].sort();
  const locked=osi?per.filter(p=>isLocked(osiId,p)):[];
  const existingAcr=osi?DB.accruals.filter(a=>a.osiId===osiId).length:0,existingPay=osi?DB.payments.filter(p=>p.osiId===osiId).length:0;
  const srcSet=new Set();if(osi){DB.accruals.forEach(a=>{if(a.osiId===osiId&&a.src)srcSet.add(a.src);});DB.payments.forEach(p=>{if(p.osiId===osiId&&p.src)srcSet.add(p.src);});}
  const already=cls.moves.filter(m=>srcSet.has(m.src)).length;
  const foreign=existingAcr+existingPay-(osi?DB.accruals.filter(a=>a.osiId===osiId&&a.src).length+DB.payments.filter(p=>p.osiId===osiId&&p.src).length:0);
  if(!IMP.mode)IMP.mode=foreign>0?'replace':'append';
  const totAcr=Object.values(cls.apts).reduce((s,a)=>s+a.acr,0),totPay=Object.values(cls.apts).reduce((s,a)=>s+a.pay,0);
  let h='<div class="card" style="margin-bottom:16px"><h3>3. Проверка</h3>'+
    '<div class="grid g4" style="margin:12px 0">'+kpi('','house','Квартир',aptKeys.length)+kpi('','calc','Начислено',money(totAcr))+kpi('g','money','Оплачено',money(totPay))+
      kpi(sub?(bad?'r':'g'):'',sub?(bad?'alert':'check'):'doc','Сверка с 1С',sub?(bad?bad+' расхождений':'все '+ok+' сошлись'):'без Анализа субконто')+'</div>'+
    '<p class="small">Файл: <b>'+esc(card.org)+'</b>, счёт '+esc(card.acct)+', '+fmtD(card.from)+' — '+fmtD(card.to)+'. Операций по квартирам: <b>'+cls.moves.length+'</b>'+(already?', из них уже загружено ранее: <b>'+already+'</b> — они будут пропущены':'')+'.</p>'+
    (sub&&sub.from!==card.from?'<p class="small neg">Периоды отчётов не совпадают: карточка с '+fmtD(card.from)+', анализ субконто с '+fmtD(sub.from)+'. Входящее сальдо будет неверным — выгрузите оба отчёта за один период.</p>':'')+
    (!sub?'<p class="small neg">Без «Анализа субконто» у квартир не будет входящего долга на '+fmtD(card.from)+' — история начнётся с нуля. Рекомендую добавить второй файл.</p>':'')+
    (locked.length?'<p class="small neg">Закрытые периоды ('+locked.map(perName).join(', ')+') загружаться не будут.</p>':'')+'</div>';
  // ОСИ
  h+='<div class="card" style="margin-bottom:16px"><h3>Куда загружаем</h3><p class="small" style="margin-top:8px">'+(osi?'ОСИ <b>'+esc(osi.name)+'</b>':'Будет создан новый ОСИ <b>'+esc(card.org)+'</b>')+'</p>';
  if(osi&&(existingAcr||existingPay)){
    h+='<p class="small" style="margin-top:8px">В этом ОСИ уже есть '+existingAcr+' начислений и '+existingPay+' оплат.</p>'+
      '<label class="small" style="display:flex;gap:8px;margin-top:8px;cursor:pointer"><input type="radio" name="im-mode" value="replace"'+(IMP.mode==='replace'?' checked':'')+' onchange="IMP.mode=this.value"> <span><b>Заменить</b> — удалить все начисления и оплаты этого ОСИ в открытых периодах и загрузить историю из 1С заново. Подходит, если раньше данные загружались другим способом.</span></label>'+
      '<label class="small" style="display:flex;gap:8px;margin-top:6px;cursor:pointer"><input type="radio" name="im-mode" value="append"'+(IMP.mode==='append'?' checked':'')+' onchange="IMP.mode=this.value"> <span><b>Дозагрузить</b> — добавить только новые операции. Подходит для ежемесячной догрузки из той же 1С.</span></label>';
  }
  h+='</div>';
  // услуги
  h+='<div class="card" style="margin-bottom:16px"><h3>Услуги из 1С</h3><p class="small muted" style="margin-top:6px">Сопоставьте с услугами Turgyn или создайте новые. Важно указать счёт ОСИ: от этого зависит раздел «Капремонт».</p>'+
    '<div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Услуга в 1С</th><th class="num">Начислено</th><th class="num">Оплачено</th><th>В Turgyn</th><th>Счёт ОСИ</th></tr></thead><tbody>';
  IMP.svcList=Object.values(cls.services).sort((a,b)=>b.count-a.count).map(s=>s.name);
  Object.values(cls.services).sort((a,b)=>b.count-a.count).forEach((s,i)=>{
    const ex=osiSvcs.find(x=>x.name.toLowerCase().replace(/\.+$/,'')===s.name.toLowerCase());
    const m=IMP.map[s.name]=IMP.map[s.name]||{target:ex?ex.id:'__new',fund:ex?svcFund(ex):impGuessFund(s.name)};
    h+='<tr><td><b>'+esc(s.name)+'</b>'+(Object.keys(s.accs).length?'<div class="small muted">счёт дохода '+Object.keys(s.accs).join(', ')+'</div>':'')+'</td><td class="num">'+money(s.acr)+'</td><td class="num">'+money(s.pay)+'</td>'+
      '<td><select onchange="IMP.map[IMP.svcList['+i+']].target=this.value"><option value="__new"'+(m.target==='__new'?' selected':'')+'>+ Создать «'+esc(s.name)+'»</option>'+
        osiSvcs.map(x=>'<option value="'+x.id+'"'+(m.target===x.id?' selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></td>'+
      '<td><select onchange="IMP.map[IMP.svcList['+i+']].fund=this.value"><option value="current"'+(m.fund==='current'?' selected':'')+'>Текущий</option><option value="savings"'+(m.fund==='savings'?' selected':'')+'>Сберегательный</option></select></td></tr>';});
  h+='</tbody></table></div></div>';
  // квартиры
  h+='<div class="card" style="margin-bottom:16px"><h3>Квартиры: сверка сальдо</h3><p class="small muted" style="margin-top:6px">Сальдо на конец = входящее + начислено − оплачено ± переносы. Должно совпасть с 1С. Минус — переплата.</p>'+
    '<div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Кв.</th><th>Собственник</th><th class="num">На '+fmtD(card.from)+'</th><th class="num">Начислено</th><th class="num">Оплачено</th><th class="num">Переносы</th><th class="num">Итог Turgyn</th><th class="num">Итог 1С</th><th></th></tr></thead><tbody>'+rowsH.join('')+'</tbody></table></div></div>';
  // пропущено
  const sk=Object.values(cls.skipped);
  if(sk.length)h+='<div class="card" style="margin-bottom:16px"><h3>Не относится к квартирам — пропускается</h3><p class="small muted" style="margin-top:6px">Поступления на расчётный счёт до разноски, комиссии банка, расчёты с соседними ОСИ. Деньги жильцов при этом не теряются: они учтены в строках «Оплата жильцов» по каждой квартире.</p>'+
    '<div class="t-wrap" style="border:none;margin-top:10px"><table><thead><tr><th>Документ</th><th class="num">Строк</th><th class="num">Сумма</th></tr></thead><tbody>'+
    sk.map(s=>'<tr><td class="small">'+esc(s.name)+'</td><td class="num">'+s.count+'</td><td class="num">'+money(s.sum)+'</td></tr>').join('')+'</tbody></table></div></div>';
  h+='<div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'+
    '<button class="btn" onclick="impRun()">'+svg(IC.check)+'Загрузить в Turgyn</button><button class="btn gho" onclick="IMP=null;go(\'import1c\')">Отмена</button>'+
    (bad?'<span class="small neg">Есть расхождения со сверкой — проверьте, что оба отчёта за один период и по одному счёту.</span>':'')+'</div></div>';
  document.getElementById('im-out').innerHTML=h;
}
function fmtD(d){if(!d)return '';const p=d.split('-');return p[2]+'.'+p[1]+'.'+p[0];}

async function impRun(){
  const {card,sub,cls}=IMP;
  let osiId=IMP.osiId;const bad=document.querySelector('#im-out .pill.bad');
  if(bad&&!confirm('Сверка с 1С не сошлась по части квартир. Всё равно загрузить?'))return;
  const batch=uid('imp');const now=nowStr();
  // ОСИ
  if(!osiId||osiId==='__new'){const o={id:uid('osi'),name:card.org||'ОСИ',bin:'',city:DB.org.city||'',address:'',chairman:'',phone:'',iban:'',bank:'',createdAt:today(),active:true};DB.osi.push(o);osiId=o.id;}
  const house=ensureHouse(osiId);
  // услуги
  const svcId={};
  Object.keys(IMP.map).forEach(name=>{const m=IMP.map[name];
    if(m.target&&m.target!=='__new'){svcId[name]=m.target;const s=DB.services.find(x=>x.id===m.target);if(s&&!s.fund)s.fund=m.fund;}
    else{const s={id:uid('svc'),osiId,name,tariff:0,unit:'m2',fund:m.fund,active:true,source:'1С'};DB.services.push(s);svcId[name]=s.id;}});
  // замена: убираем прежние данные ОСИ в открытых периодах
  let removed=0;const prevSaldo={};
  if(IMP.mode==='replace'){
    const keep=x=>x.osiId!==osiId||isLocked(osiId,x.period);
    const b=DB.accruals.length+DB.payments.length;
    DB.accruals=DB.accruals.filter(keep);DB.payments=DB.payments.filter(keep);removed=b-DB.accruals.length-DB.payments.length;
  }
  // квартиры
  const accOf={};
  const keys=new Set([...Object.keys(cls.apts),...(sub?Object.keys(sub.apts):[])]);
  keys.forEach(k=>{
    let a=DB.accounts.find(x=>x.osiId===osiId&&String(x.apt).trim()===String(k));
    const info=cls.apts[k]||{owners:{}};const subA=sub&&sub.apts[k];
    const names=Object.keys(info.owners).sort((x,y)=>info.owners[y]-info.owners[x]).concat(subA?subA.contracts:[]);
    const owner=names.find(n=>!impIsOrg(n))||names[0]||('Кв. '+k);
    if(!a){a={id:uid('acc'),osiId,houseId:house.id,ls:String(k),apt:String(k),floor:0,area:0,owner,phone:'',persons:1,saldoStart:0};DB.accounts.push(a);}
    else if(!a.owner||/^Кв\./.test(a.owner))a.owner=owner;
    const payers=names.filter(n=>n!==owner);if(payers.length)a.otherPayers=[...new Set(payers)];
    if(subA&&(IMP.mode==='replace'||!a.saldoSrc)){prevSaldo[a.id]={saldoStart:a.saldoStart||0,saldoBySvc:a.saldoBySvc||null,saldoDate:a.saldoDate||null};
      a.saldoStart=Math.round(subA.open*100)/100;delete a.saldoBySvc;a.saldoDate=card.from;a.saldoSrc=batch;}
    accOf[k]=a.id;
  });
  // операции
  const srcSet=new Set();DB.accruals.forEach(a=>{if(a.osiId===osiId&&a.src)srcSet.add(a.src);});DB.payments.forEach(p=>{if(p.osiId===osiId&&p.src)srcSet.add(p.src);});
  let nA=0,nP=0,skipLocked=0,skipDup=0;
  cls.moves.forEach(m=>{
    if(srcSet.has(m.src)){skipDup++;return;}
    if(isLocked(osiId,m.period)){skipLocked++;return;}
    const base={id:uid(m.type==='pay'?'pay':'acr'),osiId,accountId:accOf[m.apt],serviceId:svcId[m.svc],period:m.period,amount:m.amount,date:m.date,kind:m.kind,doc:m.doc,src:m.src,batch,payer:m.owner||null};
    if(m.type==='pay'){DB.payments.push(Object.assign(base,{method:'bank'}));nP++;}
    else{DB.accruals.push(Object.assign(base,{createdAt:m.date}));nA++;}
  });
  DB.importLog=(DB.importLog||[]).concat([{period:'1С '+batch,batch,osiId,file:IMP.file,at:now,by:S.user.login,from:card.from,to:card.to,ops:nA+nP,accruals:nA,payments:nP,removed,prevSaldo}]);
  S.osi=osiId;IMP=null;save();await flushSave();
  renderOsiPicker();go('import1c');
  toast('Загружено: начислений '+nA+', оплат '+nP+(skipDup?', пропущено повторов '+skipDup:'')+(skipLocked?', пропущено в закрытых периодах '+skipLocked:''),'ok');
}

function impRollback(batch){
  const log=(DB.importLog||[]).find(x=>x.batch===batch);if(!log)return;
  const rows=DB.accruals.filter(a=>a.batch===batch).concat(DB.payments.filter(p=>p.batch===batch));
  const lockedP=[...new Set(rows.filter(r=>isLocked(r.osiId,r.period)).map(r=>r.period))];
  if(lockedP.length){toast('Нельзя отменить: часть данных в закрытых периодах ('+lockedP.map(perName).join(', ')+')','bad');return;}
  if(!confirm('Отменить загрузку из 1С от '+log.at+'?\n\nБудет удалено '+rows.length+' записей, входящее сальдо квартир вернётся к прежнему. Данные, удалённые при этой загрузке в режиме «Заменить», не восстановятся — для этого используйте резервную копию.'))return;
  DB.accruals=DB.accruals.filter(a=>a.batch!==batch);DB.payments=DB.payments.filter(p=>p.batch!==batch);
  Object.keys(log.prevSaldo||{}).forEach(id=>{const a=DB.accounts.find(x=>x.id===id);if(!a||a.saldoSrc!==batch)return;const p=log.prevSaldo[id];
    a.saldoStart=p.saldoStart;if(p.saldoBySvc)a.saldoBySvc=p.saldoBySvc;else delete a.saldoBySvc;if(p.saldoDate)a.saldoDate=p.saldoDate;else delete a.saldoDate;delete a.saldoSrc;});
  save();go('import1c');toast('Загрузка отменена','ok');
}

/* ================= INIT ================= */
initDB(function(restored){
  applyAdminLang();
  if(restored)enterApp(); // валидный токен backend'а — сессия восстановлена без повторного ввода пароля
});
