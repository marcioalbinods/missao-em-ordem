// Guarda os arquivos do jogo para funcionar sem internet depois do primeiro acesso.
const CACHE = 'missao-em-ordem-v3';
const FILES = [
  './', 'index.html', 'css/style.css?v=3', 'js/levels.js?v=3', 'js/art.js?v=3', 'js/game.js?v=3',
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
// "no-cache" faz o navegador conferir no servidor se o arquivo mudou, para nunca
// misturar uma página nova com um arquivo de programação antigo.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const req = e.request.mode === 'navigate' ? e.request : new Request(e.request, { cache: 'no-cache' });
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
