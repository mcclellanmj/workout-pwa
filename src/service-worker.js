const version = "v1.1.0";

const precache = [
  './',
  './index.html',
  './pages/workout/',
  './pages/workout/index.html',
  './pages/workout/workout.js',
  './javascript/element-utils.js',
  './javascript/audio.js',
  './javascript/storage.js',
  './javascript/workouts.json',
  './images/icon.png',
  './css/main.css',
  './components/timer.js',
]

addEventListener('install', event => {
  const prefetch = async () => {
    const cache = await caches.open(version);

    await cache.addAll(precache);
  };

  event.waitUntil(prefetch());
});


addEventListener('activate', event => {
  const clearOld = async () => {
    for (const cacheName of await caches.keys()) {
      if (version != cacheName) {
        await caches.delete(cacheName);
      }
    }
  }

  event.waitUntil(clearOld());
});

addEventListener('fetch', event => {
   event.respondWith(
     caches.match(event.request).then(r => r || fetch(event.request))
 );
});