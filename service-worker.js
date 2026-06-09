const CACHE_NAME = 'mypdv-saas-v1-0-6-cache';
const APP_SHELL = [
  './?v=106', './index.html?v=106', './style.css?v=106', './app.js?v=106', './pwa.js?v=106', './manifest.json?v=106',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maybike-logo.png','./icons/maybike-logo-horizontal.png','./icons/maybike-logo-print.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => caches.open(CACHE_NAME)).then(cache => cache.addAll(APP_SHELL)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('/app.js') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/service-worker.js')) {
    event.respondWith(fetch(event.request, {cache:'no-store'}).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
    return response;
  }).catch(() => caches.match(event.request).then(resp => resp || caches.match('./index.html?v=106'))));
});
