const KEY='domsfera_db_v1';
const SESSKEY='turgyn_app_session';
let API_MODE=false;
let DB=null, SESS=null, STATE=null, CHAT=[];

/* ---------- общие утилиты ---------- */
function uid(p){return (p||'id')+'_'+Math.random().toString(36).slice(2,9);}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function money(n){n=Math.round(n||0);return n.toLocaleString('ru-RU')+' ₸';}
function today(){return new Date().toISOString().slice(0,10);}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;
  document.getElementById('toast').appendChild(t);setTimeout(()=>t.remove(),2600);}
function perName(p){if(!p)return'';const ru=['','Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const parts=String(p).split('-');return parts[1]?ru[+parts[1]]+' '+parts[0]:p;}

/* ---------- вызовы backend API (относительные пути — работает, когда файл открыт с того же сервера) ---------- */
async function apiCall(path,method,body){
  const headers={'Content-Type':'application/json'};
  if(SESS&&SESS.token)headers['Authorization']='Bearer '+SESS.token;
  const r=await fetch(path,{method:method||'GET',headers,body:body?JSON.stringify(body):undefined});
  let data={};try{data=await r.json();}catch(e){}
  if(!r.ok){const err=new Error(data.error||'Ошибка сервера');err.api=true;err.status=r.status;
    if(data.retryAfter)err.retryAfter=data.retryAfter;throw err;}
  return data;
}

/* Данные жителя приходят только с сервера */
function loadDB(){return null;}
function saveDB(){}
function ensureDB(){DB={osi:[],houses:[],accounts:[],services:[],accruals:[],payments:[],requests:[]};}
function buildStateFromLocal(){
  const a=curAccLocal();
  STATE={account:a,osi:curOsiLocal(),
    services:DB.services.filter(s=>s.osiId===a.osiId),
    accruals:DB.accruals.filter(x=>x.accountId===a.id),
    payments:DB.payments.filter(x=>x.accountId===a.id),
    requests:DB.requests.filter(x=>x.accountId===a.id)};
}

/* ================= единый доступ к данным через STATE (общий для API- и локального режима) ================= */
function stAccIdx(){const idx={};
  STATE.accruals.forEach(a=>{const p=idx[a.period]=idx[a.period]||{a:0,pay:0,s:{}};p.a+=a.amount;p.s[a.serviceId]=(p.s[a.serviceId]||0)+a.amount;});
  STATE.payments.forEach(x=>{const p=idx[x.period]=idx[x.period]||{a:0,pay:0,s:{}};p.pay+=x.amount;});
  return idx;}
function stBalance(){let b=(STATE.account.saldoStart||0);const idx=stAccIdx();for(const p in idx)b+=idx[p].a-idx[p].pay;return b;}
function stPeriods(){return Object.keys(stAccIdx()).sort().reverse();}
function stService(id){return STATE.services.find(s=>s.id===id);}

/* ================= AUTH ================= */
let AUTH_PHONE='';        // номер, на который запрошен код
let RESEND_TIMER=null;    // таймер обратного отсчёта для повторной отправки

function authErr(msg){
  const b=document.getElementById('au-err');
  if(!msg){b.classList.add('hidden');b.textContent='';return;}
  b.classList.remove('hidden');b.textContent=msg;
}
function authBackToPhone(){
  clearInterval(RESEND_TIMER);
  document.getElementById('au-step-code').classList.add('hidden');
  document.getElementById('au-step-phone').classList.remove('hidden');
  document.getElementById('au-results').innerHTML='';
  document.getElementById('au-code').value='';
  authErr('');
}
function authStartResendTimer(sec){
  const box=document.getElementById('au-resend');
  clearInterval(RESEND_TIMER);
  let left=sec;
  const tick=()=>{
    if(left<=0){
      clearInterval(RESEND_TIMER);
      box.innerHTML='<b onclick="authRequestCode(true)">Отправить код повторно</b>';
      return;
    }
    box.textContent='Отправить код повторно можно через '+left+' сек.';
    left--;
  };
  tick();
  RESEND_TIMER=setInterval(tick,1000);
}

/* шаг 1 — запросить код */
async function authRequestCode(isResend){
  const phone=document.getElementById('au-key').value.trim();
  if(!phone){toast('Введите номер телефона');return;}
  const btn=document.getElementById(isResend?'au-verify-btn':'au-send-btn');
  if(btn){btn.disabled=true;}
  authErr('');
  try{
    const data=await apiCall('/api/resident/request-code','POST',{phone});
    AUTH_PHONE=phone;
    document.getElementById('au-step-phone').classList.add('hidden');
    document.getElementById('au-step-code').classList.remove('hidden');
    document.getElementById('au-phone-lbl').textContent='на '+phone;
    const inp=document.getElementById('au-code');inp.value='';inp.focus();
    authStartResendTimer(60);
    // Если SMS-шлюз ещё не подключён, сервер возвращает код — показываем его для теста.
    if(data.devCode){
      document.getElementById('au-results').innerHTML=
        '<div class="a-dev">SMS-шлюз не подключён.<br>Код для входа: <b style="font-size:16px;letter-spacing:2px">'+esc(data.devCode)+'</b></div>';
    }else{
      document.getElementById('au-results').innerHTML='';
    }
  }catch(err){
    if(err.api){
      authErr(err.message);
      // если сервер сказал «подождите N сек» — оставляем экран кода и заводим таймер
      if(err.retryAfter){
        document.getElementById('au-step-phone').classList.add('hidden');
        document.getElementById('au-step-code').classList.remove('hidden');
        authStartResendTimer(err.retryAfter);
      }
    }else{
      authErr('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
    }
  }finally{ if(btn){btn.disabled=false;} }
}

function authCodeInput(){
  const inp=document.getElementById('au-code');
  inp.value=inp.value.replace(/\D/g,'').slice(0,6);
  authErr('');
  if(inp.value.length===6)authVerifyCode(); // 6 цифр введено — входим автоматически
}

/* шаг 2 — проверить код */
async function authVerifyCode(accountId){
  const code=document.getElementById('au-code').value.replace(/\D/g,'');
  if(code.length<6){toast('Введите 6 цифр из SMS');return;}
  const btn=document.getElementById('au-verify-btn');
  if(btn)btn.disabled=true;
  authErr('');
  try{
    const body={phone:AUTH_PHONE,code};
    if(accountId)body.accountId=accountId;
    const data=await apiCall('/api/resident/verify-code','POST',body);
    if(data.matches&&data.matches.length){renderMatches(data.matches);return;}
    if(data.token){
      clearInterval(RESEND_TIMER);
      SESS={token:data.token};localStorage.setItem(SESSKEY,JSON.stringify(SESS));
      API_MODE=true;await enterApi();
    }
  }catch(err){
    authErr(err.api?err.message:'Сервер недоступен. Попробуйте позже.');
    const inp=document.getElementById('au-code');if(inp){inp.value='';inp.focus();}
  }finally{ if(btn)btn.disabled=false; }
}

/* на один номер может быть несколько квартир — даём выбрать */
function renderMatches(matches){
  document.getElementById('au-results').innerHTML=
    '<div style="color:#9fd8c8;font-size:12.5px;margin-bottom:2px">Выберите лицевой счёт:</div>'+
    matches.map(m=>
    '<div class="a-opt" onclick="authVerifyCode(\''+m.id+'\')"><b>кв. '+esc(m.apt)+' · '+esc(m.owner)+'</b><span>'+esc(m.osiName)+' · л/с '+esc(m.ls||'')+'</span></div>').join('');
}
async function enterApi(){
  const data=await apiCall('/api/resident/me');
  STATE={account:data.account,osi:data.osi,services:data.services,accruals:data.accruals,payments:data.payments,requests:data.requests};
  showApp();
}
function showApp(){
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('h-name').textContent=STATE.account.owner+' · кв. '+STATE.account.apt;
  document.getElementById('h-addr').textContent=STATE.osi?STATE.osi.name:'';
  tab('home');
}
async function refreshState(){
  if(API_MODE){const data=await apiCall('/api/resident/me');
    STATE={account:data.account,osi:data.osi,services:data.services,accruals:data.accruals,payments:data.payments,requests:data.requests};
  }else{buildStateFromLocal();}
}
function logout(){
  if(API_MODE)apiCall('/api/resident/logout','POST').catch(()=>{});
  localStorage.removeItem(SESSKEY);SESS=null;STATE=null;API_MODE=false;
  document.getElementById('app').classList.add('hidden');document.getElementById('auth').classList.remove('hidden');
  document.getElementById('au-results').innerHTML='';
}

function tab(t){
  document.querySelectorAll('.bnav .it').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  const el=document.getElementById('scr');
  el.innerHTML=({home:renderHome,bills:renderBills,req:renderReq,ai:renderAi,profile:renderProfile,notif:renderNotif})[t]();
  el.scrollTop=0;
}

/* ---------- HOME ---------- */
function renderHome(){
  const bal=stBalance();const pers=stPeriods();const lastP=pers[0];
  const idx=stAccIdx();const lastAccr=lastP?idx[lastP].a:0;
  let h='';
  h+='<div class="bal-card"><div class="l">'+(bal>0?'Задолженность':'Баланс лицевого счёта')+'</div>'+
     '<div class="v">'+(bal>0?'-':'')+money(Math.abs(bal))+'</div>'+
     '<div class="row"><button class="pay" onclick="openPay()">Оплатить</button><button class="req" onclick="tab(\'req\')">Подать заявку</button></div></div>';
  h+='<div class="tiles">'+
    '<div class="tile" onclick="tab(\'bills\')"><div class="ic">🧾</div><b>'+money(lastAccr)+'</b><span>начислено</span></div>'+
    '<div class="tile" onclick="openMeters()"><div class="ic">📟</div><b>Счётчики</b><span>передать</span></div>'+
    '<div class="tile" onclick="tab(\'ai\')"><div class="ic">✦</div><b>ИИ-чат</b><span>спросить</span></div>'+
    '</div>';
  if(bal>0)h+='<div class="ai-note"><div>✦</div><div><b>AI-подсказка</b><p>Долг '+money(bal)+'. '+(lastAccr?('Начисление за '+perName(lastP)+' — '+money(lastAccr)+'. '):'')+'Оплатите, чтобы не копилась пеня.</p></div></div>';
  const recent=[...STATE.payments.map(x=>({date:x.date,type:'pay',x})),...STATE.requests.map(x=>({date:x.date,type:'req',x}))]
    .sort((x,y)=>x.date<y.date?1:-1).slice(0,5);
  h+='<div class="card"><h2 class="pt">Последние операции</h2>';
  if(!recent.length)h+='<div class="empty small">Пока нет операций</div>';
  else recent.forEach(r=>{
    if(r.type==='pay')h+='<div class="row-item"><div class="ic">💳</div><div><b>Оплата принята</b><span>'+esc(r.date)+' · '+({kaspi:'Kaspi',card:'Карта',bank:'Банк',cash:'Наличные'}[r.x.method]||r.x.method)+'</span></div><div class="amt" style="color:#0f8f47">+'+money(r.x.amount)+'</div></div>';
    else h+='<div class="row-item"><div class="ic">🛠</div><div><b>'+esc(r.x.topic)+'</b><span>'+esc(r.date)+'</span></div><div class="amt"><span class="pill '+({new:'warn',work:'info',done:'ok'}[r.x.status])+'">'+({new:'Новая',work:'В работе',done:'Выполнена'}[r.x.status])+'</span></div></div>';
  });
  h+='</div>';
  return h;
}

/* ---------- ОПЛАТА: реквизиты ---------- */
function openPay(){
  const bal=stBalance();const o=STATE.osi||{};const a=STATE.account;
  document.getElementById('modal-root').innerHTML=
   '<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="msheet">'+
   '<h3>Как оплатить</h3>'+
   '<p class="small muted" style="margin:6px 0 12px">Переведите сумму на счёт вашего ОСИ через приложение банка. В назначении платежа обязательно укажите номер лицевого счёта.</p>'+
   '<div class="card">'+
   '<div class="row-item"><div class="ic">💰</div><div><b>'+money(Math.max(0,Math.round(bal)))+'</b><span>К оплате</span></div></div>'+
   '<div class="row-item"><div class="ic">🏢</div><div><b>'+esc(o.name||'—')+'</b><span>Получатель'+(o.bin?' · БИН '+esc(o.bin):'')+'</span></div></div>'+
   '<div class="row-item"><div class="ic">🏦</div><div><b>'+esc(o.iban||'—')+'</b><span>'+esc(o.bank||'IBAN получателя')+'</span></div></div>'+
   '<div class="row-item"><div class="ic">🔢</div><div><b>'+esc(a.ls||'—')+'</b><span>Лицевой счёт — укажите в назначении</span></div></div>'+
   '</div>'+
   (o.iban?'<button class="btn-main" style="margin-top:12px" onclick="copyText(\''+esc(o.iban)+'\')">Скопировать IBAN</button>':'')+
   '<button class="btn-gho" style="margin-top:8px" onclick="closeModal()">Закрыть</button>'+
   '<p class="small muted" style="margin-top:10px;text-align:center">Оплата отразится после поступления денег на счёт ОСИ.</p>'+
   '</div></div>';
}
function copyText(t){try{navigator.clipboard.writeText(t);toast('Скопировано');}catch(e){toast(t);}}
function openMeters(){
  document.getElementById('modal-root').innerHTML=
   '<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="msheet">'+
   '<h3>Передать показания счётчиков</h3>'+
   '<label class="f"><span>Холодная вода, м³</span><input class="f" placeholder="напр. 84.2"></label>'+
   '<label class="f"><span>Горячая вода, м³</span><input class="f" placeholder="напр. 51.7"></label>'+
   '<button class="btn-main" onclick="closeModal();toast(\'Показания отправлены УК ✓\')">Отправить</button>'+
   '</div></div>';
}
function closeModal(){document.getElementById('modal-root').innerHTML='';}

/* ---------- НАЧИСЛЕНИЯ ---------- */
function renderBills(){
  const pers=stPeriods();const idx=stAccIdx();
  let h='<h2 class="pt">Начисления</h2><p class="ps">Разбивка по услугам за каждый период</p>';
  if(!pers.length)return h+'<div class="empty">Пока нет начислений</div>';
  pers.forEach(p=>{
    const d=idx[p];
    h+='<div class="card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center"><b>'+perName(p)+'</b>'+
       '<span class="pill '+(d.pay>=d.a?'ok':(d.pay>0?'warn':'bad'))+'">'+(d.pay>=d.a?'Оплачено':(d.pay>0?'Частично':'Не оплачено'))+'</span></div><div class="hr"></div>';
    for(const sid in d.s){const s=stService(sid);
      h+='<div class="row-item"><div class="ic">🧾</div><div><b>'+esc(s?s.name:'Услуга')+'</b><span>начислено</span></div><div class="amt">'+money(d.s[sid])+'</div></div>';}
    h+='<div class="hr"></div><div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px"><span>Итого начислено / оплачено</span><span>'+money(d.a)+' / '+money(d.pay)+'</span></div></div>';
  });
  return h;
}

/* ---------- ЗАЯВКИ ---------- */
function renderReq(){
  const list=STATE.requests.slice().sort((x,y)=>x.date<y.date?1:-1);
  let h='<h2 class="pt">Заявки в диспетчерскую</h2><p class="ps">Обращение видно диспетчеру УК сразу после отправки</p>';
  h+='<button class="btn-main" style="margin-bottom:14px" onclick="openReqForm()">+ Новая заявка</button>';
  if(!list.length)h+='<div class="empty">Заявок пока нет</div>';
  else{h+='<div class="card">';list.forEach(r=>{
    h+='<div class="row-item"><div class="ic">🛠</div><div><b>'+esc(r.topic)+'</b><span>'+esc(r.date)+(r.assignee&&r.assignee!=='—'?' · '+esc(r.assignee):'')+'</span></div>'+
       '<div class="amt"><span class="pill '+({new:'warn',work:'info',done:'ok'}[r.status])+'">'+({new:'Новая',work:'В работе',done:'Выполнена'}[r.status])+'</span></div></div>';});
    h+='</div>';}
  return h;
}
function openReqForm(){
  document.getElementById('modal-root').innerHTML=
   '<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="msheet">'+
   '<h3>Новая заявка</h3>'+
   '<label class="f"><span>Что случилось?</span><textarea class="f" id="rq-topic" rows="3" placeholder="Например: течёт кран на кухне"></textarea></label>'+
   '<button class="btn-main" onclick="reqSave()">Отправить в УК</button>'+
   '<button class="btn-gho" style="margin-top:8px" onclick="closeModal()">Отмена</button></div></div>';
}
async function reqSave(){
  const topic=document.getElementById('rq-topic').value.trim();
  if(!topic){toast('Опишите проблему');return;}
  try{
    if(API_MODE){await apiCall('/api/resident/request','POST',{topic});await refreshState();}
    else{DB.requests.push({id:uid('req'),osiId:STATE.account.osiId,accountId:STATE.account.id,topic,assignee:'—',status:'new',date:today()});
      saveDB();buildStateFromLocal();}
    closeModal();toast('Заявка отправлена диспетчеру ✓');tab('req');
  }catch(e){toast(e.message||'Не удалось отправить заявку');}
}

/* ---------- ИИ-ЧАТ (правило-based помощник по своим данным) ---------- */
function renderAi(){
  if(!CHAT.length){const bal=stBalance();
    CHAT.push({who:'bot',text:'Здравствуйте, '+STATE.account.owner.split(' ')[0]+'! Я помогу разобраться с начислениями, долгом и заявками по вашей квартире. '+(bal>0?('Сейчас на вашем счету долг '+money(bal)+'.'):'Задолженности по счёту нет.')});
  }
  const sugg=['Какой у меня долг?','Когда платить взнос?','Как подать заявку?','За что начисления?'];
  return '<div class="chat-wrap"><div class="chat-log" id="chat-log">'+CHAT.map(m=>'<div class="msg '+(m.who==='me'?'me':'bot')+'">'+esc(m.text)+'</div>').join('')+'</div>'+
   '<div class="chat-sugg">'+sugg.map(s=>'<div class="chip-sugg" onclick="chatSend(\''+s.replace(/'/g,"\\'")+'\')">'+s+'</div>').join('')+'</div>'+
   '<div class="chat-in"><input id="chat-input" placeholder="Напишите вопрос..." onkeydown="if(event.key===\'Enter\')chatSend()">'+
   '<button onclick="chatSend()">➤</button></div></div>';
}
function chatSend(preset){
  const input=document.getElementById('chat-input');
  const text=preset||input.value.trim();if(!text)return;
  CHAT.push({who:'me',text});
  CHAT.push({who:'bot',text:chatReply(text)});
  if(input)input.value='';
  const el=document.getElementById('scr');el.innerHTML=renderAi();
  const log=document.getElementById('chat-log');if(log)log.scrollTop=log.scrollHeight;
}
function chatReply(q){
  const t=q.toLowerCase();const bal=stBalance();const pers=stPeriods();
  if(/долг|задолж|баланс|сколько.*плат/.test(t)){
    return bal>0?('Текущий долг по лицевому счёту — '+money(bal)+'. Можно оплатить через Kaspi прямо на главном экране.'):'Задолженности нет — счёт оплачен полностью.';
  }
  if(/когда|срок|до какого/.test(t)){
    return 'Оплата принимается до 25 числа месяца, следующего за расчётным. После этой даты может начисляться пеня (если она включена УК).';
  }
  if(/заявк|сломал|теч|авар|ремонт/.test(t)){
    return 'Чтобы подать заявку, перейдите во вкладку «Заявки» и нажмите «+ Новая заявка» — диспетчер УК увидит её сразу.';
  }
  if(/начислен|за что|услуг|тариф/.test(t)){
    const last=pers[0];const idx=stAccIdx();const d=last?idx[last]:null;
    if(!d)return 'Начислений пока нет.';
    const parts=Object.keys(d.s).map(sid=>{const s=stService(sid);return (s?s.name:'услуга')+' — '+money(d.s[sid]);});
    return 'За '+perName(last)+' начислено: '+parts.join('; ')+'.';
  }
  if(/счётчик|счетчик/.test(t))return 'Показания счётчиков можно передать с главного экрана — плитка «Счётчики».';
  return 'Я могу ответить на вопросы про долг, начисления, сроки оплаты и заявки. Уточните вопрос, пожалуйста.';
}

/* ---------- ПРОФИЛЬ ---------- */
function renderProfile(){
  const a=STATE.account;const o=STATE.osi;
  return '<h2 class="pt">Профиль</h2><p class="ps">Данные лицевого счёта</p>'+
   '<div class="card"><div class="row-item"><div class="ic">👤</div><div><b>'+esc(a.owner)+'</b><span>Собственник</span></div></div>'+
   '<div class="row-item"><div class="ic">🏠</div><div><b>кв. '+esc(a.apt)+' · '+a.area+' м²</b><span>'+esc(o?o.name:'')+'</span></div></div>'+
   '<div class="row-item"><div class="ic">📱</div><div><b>'+esc(a.phone||'—')+'</b><span>Телефон</span></div></div>'+
   '<div class="row-item"><div class="ic">🔢</div><div><b>'+esc(a.ls)+'</b><span>Лицевой счёт</span></div></div>'+
   '</div><button class="btn-gho" style="margin-top:14px" onclick="logout()">Выйти из аккаунта</button>'+
   '<p class="small muted" style="margin-top:14px;text-align:center">Turgyn · личный кабинет жителя</p>';
}
function renderNotif(){
  const bal=stBalance();const items=[];
  if(bal>0)items.push({t:'Задолженность '+money(bal),s:'Оплатите, чтобы не копилась пеня',ic:'⚠️'});
  STATE.requests.filter(r=>r.status==='work').forEach(r=>items.push({t:'Заявка «'+r.topic+'» в работе',s:'Исполнитель: '+(r.assignee||'—'),ic:'🛠'}));
  items.push({t:'Начисление за '+perName(stPeriods()[0]||'')+' сформировано',s:'Смотрите в разделе «Начисления»',ic:'🧾'});
  let h='<h2 class="pt">Уведомления</h2><p class="ps"></p><div class="card">';
  items.forEach(i=>{h+='<div class="row-item"><div class="ic">'+i.ic+'</div><div><b>'+esc(i.t)+'</b><span>'+esc(i.s)+'</span></div></div>';});
  h+='</div>';
  return h;
}

/* ---------- init ---------- */
(async function init(){
  try{SESS=JSON.parse(localStorage.getItem(SESSKEY));}catch(e){SESS=null;}
  if(SESS&&SESS.token){
    API_MODE=true;
    try{await enterApi();}catch(e){localStorage.removeItem(SESSKEY);SESS=null;API_MODE=false;}
  }else if(SESS){localStorage.removeItem(SESSKEY);SESS=null;}
})();
