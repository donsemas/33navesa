/* 33навеса PWA: оболочка — сразу, страницы — по визитам, обновления — сменой VERSION */
const VERSION = 'navesa-pwa-v1';
const CORE = ['/', '/offline/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  e.respondWith(
    caches.match(request).then((hit) => {
      const net = fetch(request).then((res) => {
        if (res && res.ok) caches.open(VERSION).then((c) => c.put(request, res.clone()));
        return res;
      });
      if (hit && request.destination !== 'document') return hit;
      return net.catch(() => hit || (request.mode === 'navigate' ? caches.match('/offline/') : Promise.reject(new Error('offline'))));
    })
  );
});
