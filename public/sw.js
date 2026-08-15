// Himalayan Freak Service Worker
// Provides offline support, app-shell caching, and runtime caching for images

const CACHE_VERSION = 'hf-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const IMAGE_CACHE = `${CACHE_VERSION}-images`
const API_CACHE = `${CACHE_VERSION}-api`

// Assets to cache on install (app shell)
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/logo.webp',
]

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(() => {})
  )
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('hf-') && key !== STATIC_CACHE && key !== IMAGE_CACHE && key !== API_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

// Helper: network-first with cache fallback
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const networkResponse = await fetch(request)
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (err) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) return cachedResponse
    throw err
  }
}

// Helper: cache-first for images
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  if (cachedResponse) return cachedResponse
  try {
    const networkResponse = await fetch(request)
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (err) {
    throw err
  }
}

// Fetch handler with routing
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET requests
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Skip chrome-extension and non-http(s) requests
  if (!url.protocol.startsWith('http')) return

  // Skip NextAuth internal requests
  if (url.pathname.startsWith('/api/auth/')) return

  // Skip mutation API endpoints (POST/PATCH/DELETE)
  if (url.pathname.startsWith('/api/') && request.method !== 'GET') return

  // Route: images from Unsplash or our own /uploads
  if (
    url.hostname === 'images.unsplash.com' ||
    url.hostname === 'placehold.co' ||
    url.pathname.startsWith('/uploads/') ||
    url.pathname.startsWith('/logo')
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE))
    return
  }

  // Route: API endpoints (network-first, fallback to cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE))
    return
  }

  // Route: same-origin navigations (app shell)
  if (url.origin === self.location.origin && request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request)
          const cache = await caches.open(STATIC_CACHE)
          cache.put(request, networkResponse.clone())
          return networkResponse
        } catch (err) {
          const cache = await caches.open(STATIC_CACHE)
          const cachedResponse = await cache.match(request)
          if (cachedResponse) return cachedResponse
          // Fallback to app shell
          const fallback = await cache.match('/')
          if (fallback) return fallback
          throw err
        }
      })()
    )
    return
  }

  // Route: other same-origin static assets (JS, CSS, fonts)
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Route: Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }
})

// Listen for messages from the page (skip waiting, etc.)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
