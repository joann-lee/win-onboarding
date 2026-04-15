/**
 * OOBE Sandbox - Service Worker
 * Caches wallpaper assets so they load instantly on every page after the first.
 */

const CACHE_NAME = 'oobe-wallpapers-v2';

const WALLPAPER_URLS = [
  '/assets/wallpaper/background-violet-light.png',
  '/assets/wallpaper/background-violet-dark.png',
  '/assets/wallpaper/background-dune-light.png',
  '/assets/wallpaper/background-dune-dark.png',
  '/assets/wallpaper/background-sapphire-light.png',
  '/assets/wallpaper/background-sapphire-dark.png',
  '/assets/wallpaper/background-black-light.png',
  '/assets/wallpaper/background-black-dark.png',
  '/assets/wallpaper/background-emerald-light.png',
  '/assets/wallpaper/background-emerald-dark.png',
  '/assets/wallpaper/background-standard-light.jpg',
  '/assets/wallpaper/background-standard-dark.png',
  '/assets/wallpaper/background-nova.png',
];

// Pre-cache all wallpapers on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(WALLPAPER_URLS))
      .catch(() => { /* Silently skip failures (e.g. missing files) */ })
  );
  self.skipWaiting();
});

// Remove old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Serve wallpapers from cache; fall back to network
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('/assets/wallpaper/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          // Cache the fresh response for next time
          const toCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
          return response;
        });
      })
    );
  }
});
