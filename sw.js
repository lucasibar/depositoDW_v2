const CACHE_NAME = 'depositoDW-v1';
const urlsToCache = [
  '/depositoDW_v2/',
  '/depositoDW_v2/static/js/bundle.js',
  '/depositoDW_v2/static/css/main.css',
  '/depositoDW_v2/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la respuesta cacheada si existe
        if (response) {
          return response;
        }
        
        // Si no está en cache, hace la petición a la red
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 