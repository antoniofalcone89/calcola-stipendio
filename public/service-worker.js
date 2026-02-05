/* eslint-disable no-restricted-globals */

// This service worker forces users to always get the latest version
// by using a network-first strategy and immediately activating new versions

const CACHE_NAME = 'stipendio-cache-v1';

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate event - claim all clients immediately
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    Promise.all([
      // Clear all old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[ServiceWorker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Claim all clients so the new SW takes control immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - network-first strategy to always get fresh content
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    // Always try network first
    fetch(event.request)
      .then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache as fallback (offline support)
        return caches.match(event.request);
      })
  );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
