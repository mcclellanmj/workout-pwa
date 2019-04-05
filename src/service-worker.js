const version = "v1.0.0";

const precache = [
  './',
  './index.html',
  './pages/workout/',
  './pages/workout/index.html',
  './pages/workout/workout.js',
  './javascript/element-utils.js',
  './images/icon.png',
  './css/main.css',
  './components/timer.js',
]

addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(version);

    await cache.addAll(precache);
  })());
});


addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const cacheName of await caches.keys()) {
      if (version != cacheName) await caches.delete(cacheName);
    }
  })());
});

addEventListener('fetch', event => {
   event.respondWith(
     caches.match(event.request).then(r => r || fetch(event.request))
 );
});