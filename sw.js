const CACHE_NAME = 'valencia-trainer-v5';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];
// Data and audio content is fetched network-first (see fetch handler below),
// so it never goes stale just because CACHE_NAME wasn't bumped.
const NETWORK_FIRST_PATTERNS = [/\/data\//, /\/audio\//];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

function isNetworkFirst(request) {
  return NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(request.url));
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  if (isNetworkFirst(e.request)) {
    // Network-first: always try to get the latest lesson data/audio when online,
    // only falling back to whatever's cached if the network is unavailable.
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for the static app shell (HTML/CSS/JS).
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);
    })
  );
});
