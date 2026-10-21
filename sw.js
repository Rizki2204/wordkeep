const CACHE_NAME = 'wordkeep-pwa-v6';
const ASSETS = [
  './',
  './index.html',
  './BahasaInggris_v2.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './wordkeep.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Ignore / bypass lan_info checks to avoid polluting cache
  if (url.pathname.endsWith('/__lan_info')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{"urls":[]}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // Navigation requests: try network first; if offline / fails, fallback to cached index.html or root
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request, { ignoreSearch: true });
          if (cached) return cached;
          const cachedIndex = await caches.match('./index.html');
          if (cachedIndex) return cachedIndex;
          const cachedRoot = await caches.match('./');
          if (cachedRoot) return cachedRoot;
          return Response.error();
        })
    );
    return;
  }

  // Static assets: cache first, fallback to network
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(() => {
        return new Response('', { status: 404, statusText: 'Offline Asset Not Found' });
      });
    })
  );
});
