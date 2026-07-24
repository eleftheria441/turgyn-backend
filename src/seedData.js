const { hashPassword } = require('./auth');

function uid(p) { return (p || 'id') + '_' + Math.random().toString(36).slice(2, 9); }
function rnd(a, b) { return Math.floor(a + Math.random() * (b - a + 1)); }
const FNAMES = ['Асан','Айгерим','Данияр','Гульнара','Тимур','Сауле','Ерлан','Мадина','Бекзат','Алия','Нурлан','Жанна'];
const LNAMES = ['Ахметов','Оспанова','Ким','Сулейменов','Нурланова','Ибраев','Смагулова','Тлеубаев','Джандосов','Каримова'];
function randName() { return FNAMES[rnd(0, FNAMES.length - 1)] + ' ' + LNAMES[rnd(0, LNAMES.length - 1)]; }

function seedOsi(db, name, addr, chair, bin, nApt, baseTariff) {
  const oid = uid('osi');
  db.osi.push({ id: oid, name, address: addr, bin, chairman: chair, phone: '+7 702 111 22 33',
    iban: 'KZ' + Math.floor(1e17 + Math.random() * 8e17), bank: 'Halyk Bank', createdAt: '2026-01-15', active: true });
  const hid = uid('h');
  db.houses.push({ id: hid, osiId: oid, address: addr, floors: 9, entrances: 2, totalArea: 0 });
  const svcDefs = [
    { name: 'Содержание жилья (эксплуатационные)', unit: 'm2', tariff: baseTariff },
    { name: 'Целевой накопительный взнос', unit: 'm2', tariff: 21.63 },
    { name: 'Вывоз ТБО', unit: 'apt', tariff: 600 },
    { name: 'Домофон', unit: 'apt', tariff: 300 }
  ];
  const svcIds = svcDefs.map(s => { const id = uid('svc'); db.services.push({ id, osiId: oid, ...s, active: true }); return id; });
  let totalArea = 0;
  for (let i = 1; i <= nApt; i++) {
    const area = Math.round((38 + Math.random() * 40) * 10) / 10; totalArea += area;
    const persons = 1 + Math.floor(Math.random() * 4);
    db.accounts.push({ id: uid('acc'), osiId: oid, houseId: hid, ls: String(oid.slice(-3)) + String(1000 + i),
      apt: String(i), floor: Math.min(9, Math.ceil(i / 2)), area, owner: randName(),
      phone: '+7 777 ' + rnd(100, 999) + ' ' + rnd(10, 99) + ' ' + rnd(10, 99), persons, saldoStart: 0 });
  }
  const h = db.houses.find(x => x.id === hid); h.totalArea = Math.round(totalArea * 10) / 10;
  const provDefs = [
    { name: 'ТОО «ГорВодоканал»', service: 'Водоснабжение' },
    { name: 'АО «Электросети»', service: 'Электроэнергия ОДН' },
    { name: 'ТОО «ЧистоградУборка»', service: 'Клининг / вывоз ТБО' }
  ];
  const provIds = provDefs.map(p => { const id = uid('prov'); db.providers.push({ id, osiId: oid, name: p.name, service: p.service,
    bin: String(rnd(1e11, 9e11)), phone: '+7 717 ' + rnd(100, 999) + ' ' + rnd(1000, 9999), iban: 'KZ' + rnd(1e11, 9e11) }); return id; });
  ['2026-05', '2026-06'].forEach((per) => {
    db.accounts.filter(a => a.osiId === oid).forEach(acc => {
      let monthTotal = 0;
      svcIds.forEach(sid => {
        const s = db.services.find(x => x.id === sid);
        const base = s.unit === 'm2' ? acc.area : (s.unit === 'person' ? acc.persons : 1);
        const amount = Math.round(s.tariff * base);
        monthTotal += amount;
        db.accruals.push({ id: uid('acr'), osiId: oid, accountId: acc.id, serviceId: sid, period: per, amount, base, unit: s.unit, createdAt: per + '-01' });
      });
      const r = Math.random(); let pay = 0;
      if (r < 0.72) pay = monthTotal; else if (r < 0.9) pay = Math.round(monthTotal * (0.3 + Math.random() * 0.4)); else pay = 0;
      if (pay > 0) db.payments.push({ id: uid('pay'), osiId: oid, accountId: acc.id, period: per, amount: pay,
        method: ['kaspi', 'card', 'bank', 'cash'][rnd(0, 3)], date: per + '-' + String(rnd(5, 26)).padStart(2, '0') });
    });
    provIds.forEach(pid => {
      const amt = rnd(80, 320) * 1000;
      db.provInvoices.push({ id: uid('pinv'), osiId: oid, providerId: pid, period: per, amount: amt, date: per + '-05', desc: 'Услуги за ' + per });
      if (Math.random() < 0.8) db.provPayments.push({ id: uid('ppay'), osiId: oid, providerId: pid, period: per,
        amount: Math.random() < 0.7 ? amt : Math.round(amt * 0.6), date: per + '-20' });
    });
  });
  ['Течь в подвале, 2 подъезд', 'Не работает лифт', 'Замена лампы в подъезде', 'Вопрос по начислению'].forEach((t, i) => {
    const acc = db.accounts.filter(a => a.osiId === oid)[i];
    db.requests.push({ id: uid('req'), osiId: oid, accountId: acc ? acc.id : null, topic: t,
      status: ['new', 'work', 'done', 'new'][i], assignee: ['—', 'Ерлан', 'Техбригада', '—'][i], date: '2026-06-' + String(rnd(1, 28)).padStart(2, '0') });
  });
}

function buildSeed() {
  const db = {
    org: { name: 'ТОО «Управляющая компания»', bin: '123456789012', city: 'Астана', phone: '+7 701 000 00 00' },
    subscription: { plan: 'uk', pricePerAccount: 35, since: '2026-01-01', status: 'active' },
    users: [
      { id: 'u1', name: 'Ильяс Директоров', login: 'admin', passHash: hashPassword('admin'), role: 'director', pos: 'Директор УК' },
      { id: 'u2', name: 'Айгуль Счётова', login: 'buh', passHash: hashPassword('buh'), role: 'accountant', pos: 'Главный бухгалтер' },
      { id: 'u3', name: 'Ерлан Диспетчеров', login: 'disp', passHash: hashPassword('disp'), role: 'dispatcher', pos: 'Диспетчер' }
    ],
    osi: [], houses: [], accounts: [], services: [], accruals: [], payments: [],
    providers: [], provInvoices: [], provPayments: [], requests: [], penalty: { enabled: false, rate: 0.05 }
  };
  seedOsi(db, 'ЖК «Алатау»', 'Астана, пр. Кабанбай батыра 40', 'Нурлан Председатель', '990101300111', 8, 44.6);
  seedOsi(db, 'ЖК «Есиль Тауэр»', 'Астана, ул. Достык 12', 'Марат Председатель', '990202300222', 6, 52.0);
  return db;
}

module.exports = { buildSeed, uid };
