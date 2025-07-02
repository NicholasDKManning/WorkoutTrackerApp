// service-worker.js
const CACHE_VERSION = 'ernd-cache-v1'; // To force updates change v2
// self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => caches.delete(cache))
      )
    )
  );
  self.clients.claim();
});

// Listen for message from the page
self.addEventListener('message', event => {
  if (event.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
})