// service-worker.js
const CACHE_VERSION = 'ernd-cache-v2'; // To force updates change v#
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