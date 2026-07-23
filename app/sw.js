const CACHE = 'greatbook-v3'
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/responsivo.js',
  '/logo.png',
  '/catalogo.html',
  '/noticias.html',
  '/descargas.html',
  '/terminos.html',
  '/manifest.json',
  '/offline.html',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(assets))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.hostname.includes('github.com') || url.hostname.includes('api.github')) {
    e.respondWith(fetch(request))
    return
  }

  if (/\.(css|js|png|jpg|jpeg|svg|ico|woff2?)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        if (res.ok) { const c = res.clone(); caches.open(CACHE).then((cache) => cache.put(request, c)) }
        return res
      }))
    )
    return
  }

  e.respondWith(
    fetch(request).then((res) => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then((cache) => cache.put(request, c)) }
      return res
    }).catch(() => caches.match(request).then((c) => c || caches.match('/offline.html')))
  )
})
