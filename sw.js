// Guarda os arquivos do jogo para funcionar sem internet depois do primeiro acesso.
const CACHE = 'missao-em-ordem-v2';
const FILES = [
  './', 'index.html', 'css/style.css', 'js/levels.js', 'js/art.js', 'js/game.js',
  'fonts/Fredoka.ttf', 'icon.svg', 'manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro (para pegar atualizações); sem internet, usa o que está guardado.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
