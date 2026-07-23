const CACHE = 'greatbook-v4'
const assets = [
  '/404.html',
  '/catalogo.html',
  '/descargas.html',
  '/fanfic_0001.html',
  '/fanfic_0002.html',
  '/fanfic_1_001.html',
  '/fanfic_1_002.html',
  '/fanfic_1_003.html',
  '/fanfic_1_004.html',
  '/fanfic_1_005.html',
  '/fanfic_2_001.html',
  '/fanfic_2_002.html',
  '/index.html',
  '/logo.png',
  '/manifest.json',
  '/noticias.html',
  '/offline.html',
  '/original_0001.html',
  '/original_0001_prologo.html',
  '/original_0002.html',
  '/original_0002_0001.html',
  '/poesia_1.html',
  '/poesia_1_001.html',
  '/poster/1.png',
  '/poster/2.jpg',
  '/poster/3.png',
  '/poster/4.png',
  '/poster/5.jpg',
  '/poster/6.jpg',
  '/poster/7.jpg',
  '/poster/8.jpg',
  '/poster/ds/android.png',
  '/poster/ds/linux.png',
  '/poster/ds/windows.png',
  '/responsivo.js',
  '/sitemap.xml',
  '/style.css',
  '/sw.js',
  '/terminos.html',
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

  if (/\.css$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        if (res.ok) { const c = res.clone(); caches.open(CACHE).then((cache) => cache.put(request, c)) }
        return res
      }))
    )
    return
  }

  if (/\.js$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((res) => {
          if (res.ok) { const c = res.clone(); caches.open(CACHE).then((cache) => cache.put(request, c)) }
          return res
        })
        if (cached) { fetchPromise.catch(() => {}); return cached }
        return fetchPromise.catch(() => caches.match('/offline.html'))
      })
    )
    return
  }

  if (/\.(png|jpg|jpeg|svg|ico|woff2?)$/i.test(url.pathname)) {
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
