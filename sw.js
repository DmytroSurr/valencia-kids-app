const CACHE_NAME = 'valencia-trainer-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './data/course.json',
  './data/casa1.json',
  './data/casa2.json',
  './data/escola1.json',
  './data/escola2.json',
  './data/jocs1.json',
  './data/jocs2.json',
  './data/animals1.json',
  './data/animals2.json',
  './data/animals3.json',
  './data/menjar1.json',
  './data/menjar2.json',
  './data/menjar3.json',
  './data/roba1.json',
  './data/roba2.json',
  './data/cos1.json',
  './data/colors1.json',
  './data/formes1.json',
  './data/familia1.json',
  './data/temps1.json',
  './data/temps2.json',
  './data/phrases_casa1.json',
  './data/phrases_escola1.json',
  './data/phrases_likes1.json'
];

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

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
