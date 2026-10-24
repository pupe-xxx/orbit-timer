// Offline cache: app files are cache-first, Google Fonts are cached as they load.
const CACHE = 'orbit-iai-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'assets/kamae.webp', 'assets/issen.webp', 'assets/noto.webp', 'assets/kanryo.webp',
  'assets/issen_kesa.webp', 'assets/issen_gyaku.webp', 'assets/issen_karatake.webp', 'assets/issen_jumonji.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const url = new URL(e.request.url);
    if (res.ok && (url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com'))) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match('index.html'))));
});
