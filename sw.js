/* APSAN — armazenamento de ficheiros fora do localStorage */
const CACHE_NAME='apsan-files-v1';
const PREFIX='/__apsan_storage/';
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim())});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(PREFIX))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const hit=await cache.match(event.request);
    if(hit)return hit;
    return new Response('Ficheiro não encontrado',{status:404});
  })());
});
