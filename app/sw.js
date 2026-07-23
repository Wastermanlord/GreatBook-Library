const CACHE = 'greatbook-v1'
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
  if (request.url.includes('github.com') || request.url.includes('api.github')) {
    e.respondWith(fetch(request))
    return
  }
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      if (res.ok && res.type === 'basic') {
        const clone = res.clone()
        caches.open(CACHE).then((cache) => cache.put(request, clone))
      }
      return res
    })).catch(() => caches.match('/offline.html'))
  )
})
