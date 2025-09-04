
const CACHE = 'gerador-pwa-v1';
const ASSETS = [
  'index.html','modelos.html','css/style.css','js/app.js','js/modelos.js',
  'icons/icon-192.png','icons/icon-512.png','manifest.json'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(r=> r || fetch(req).then(resp=>{ 
      caches.open(CACHE).then(cache=>cache.put(req, resp.clone()));
      return resp;
    }).catch(()=> caches.match('index.html'))));
  }
});
