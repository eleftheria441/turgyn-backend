/* Turgyn service worker: кеширует только оболочку приложения.
   Данные (/api) никогда не кешируются — это личная информация и она должна быть свежей. */
const CACHE = 'turgyn-app-v7';
const SHELL = ['/app', '/assets/app.css?v=7', '/assets/app.js?v=7', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  if (e.request.mode === 'navigate' && (u.pathname === '/app' || u.pathname === '/app/')) {
    // сначала сеть (чтобы обновления приходили сразу), без сети — сохранённая копия
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('/app', cp)); return r; }).catch(() => caches.match('/app')));
    return;
  }
  if (SHELL.includes(u.pathname + u.search)) e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
