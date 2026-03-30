const CACHE_NAME = 'meal-move-v3';
const IS_DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png'
];

// Install Event — skip pre-caching in development
self.addEventListener('install', (event) => {
  if (!IS_DEV) {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('SW: Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
    );
  }
  self.skipWaiting();
});

// Activate Event — clear all old caches on update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('SW: Clearing old cache', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ── DEVELOPMENT MODE: Never intercept, let browser handle natively (Vite HMR) ──
  if (IS_DEV) return;

  // ── Skip non-GET requests ─────────────────────────────────────────────────────
  if (request.method !== 'GET') return;

  // ── Skip cross-origin requests (e.g. backend API on port 5000) ───────────────
  if (url.origin !== self.location.origin) return;

  const isApi = url.pathname.startsWith('/api/');
  const isMedia = url.pathname.includes('video') || url.pathname.includes('blob');

  // Safely cache only complete 200 responses, never partial (206) or media ones
  function safeCacheResponse(cache, req, res) {
    if (
      res &&
      res.status === 200 &&
      !req.headers.get('range') &&
      !res.headers.get('content-range') &&
      !isMedia
    ) {
      cache.put(req, res.clone());
    }
  }

  if (isApi) {
    // Network-first strategy for API calls
    event.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(CACHE_NAME).then((cache) => safeCacheResponse(cache, request, res));
          return res;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            caches.open(CACHE_NAME).then((cache) => safeCacheResponse(cache, request, res));
            return res;
          })
      )
    );
  }
});
