/* ---------- поиск по возможностям ---------- */
const tiles=[...document.querySelectorAll('#tiles .tile')];
function norm(s){return String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[«»"']/g,'').trim();}
function doSearch(jump){
  const q=norm(document.getElementById('q').value);
  const words=q.split(/\s+/).filter(Boolean);
  let shown=0;
  tiles.forEach(t=>{
    const hay=norm(t.dataset.k+' '+t.textContent);
    const ok=!words.length||words.every(w=>hay.includes(w.length>4?w.slice(0,w.length-1):w));
    t.classList.toggle('hide',!ok);
    t.classList.toggle('hit',ok&&words.length>0);
    t.classList.add('in');
    if(ok)shown++;
  });
  document.getElementById('no-res').classList.toggle('on',shown===0);
  if(jump)document.getElementById('features').scrollIntoView({behavior:'smooth'});
}
function quick(w){document.getElementById('q').value=w;doSearch(true);}

/* ---------- калькулятор ---------- */
let PLAN='uk';
const fmt=n=>Math.round(n).toLocaleString('ru-RU').replace(/,/g,' ')+' ₸';
function setPlan(p){PLAN=p;document.getElementById('t-osi').classList.toggle('on',p==='osi');document.getElementById('t-uk').classList.toggle('on',p==='uk');calc();}
function calc(){
  const n=+document.getElementById('cnt').value,price=PLAN==='osi'?45:35;
  document.getElementById('cnt-v').textContent=n.toLocaleString('ru-RU');
  document.getElementById('sum').textContent=fmt(n*price);
  document.getElementById('sum-y').textContent=fmt(n*price*12);
}
calc();

/* ---------- заявка ---------- */
function pickRole(r){const el=document.querySelector('input[name=role][value="'+r+'"]');if(el)el.checked=true;}
function msg(t,ok){const m=document.getElementById('lf-msg');m.className='form-msg '+(ok?'ok':'err');m.textContent=t;}
async function sendLead(){
  const v=id=>document.getElementById(id).value.trim();
  const body={org:v('f-org'),contact:v('f-name'),phone:v('f-phone'),accounts:v('f-cnt'),comment:v('f-com'),
    role:(document.querySelector('input[name=role]:checked')||{}).value,website:v('f-web'),consent:document.getElementById('f-ok').checked};
  if(!body.org)return msg('Укажите организацию');
  if(!body.contact)return msg('Укажите контактное лицо');
  if(body.phone.replace(/\D/g,'').length<10)return msg('Укажите телефон — хотя бы 10 цифр');
  if(!body.consent)return msg('Отметьте согласие на обработку данных');
  const btn=document.getElementById('lf-btn');btn.disabled=true;btn.textContent='Отправляем…';
  try{
    const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Не удалось отправить');
    document.getElementById('lf-body').innerHTML='<div class="sent"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><h3>Заявка отправлена</h3><p>Свяжемся с вами в течение рабочего дня.</p></div>';
  }catch(e){
    msg(e.message==='Failed to fetch'?'Нет связи с сервером. Напишите нам на ilya@turgyn.kz':e.message);
    btn.disabled=false;btn.textContent='Отправить заявку';
  }
}

/* ---------- появление при прокрутке ---------- */
(function(){
  const els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(e=>io.observe(e));
  setTimeout(()=>els.forEach(e=>e.classList.add('in')),1500);
})();
document.getElementById('yr').textContent=new Date().getFullYear();
setTimeout(()=>{const b=document.getElementById('mock-bar');if(b)b.style.width='84%';},200);
