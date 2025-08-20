// service-worker.js
const CACHE_VERSION = 'ernd-cache-v08-19-25-0'; // To force updates change version # as such: vDD-MM-YY-#
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