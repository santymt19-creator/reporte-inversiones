// Service worker mínimo: siempre pide los archivos a la red (revalidando la caché del navegador) y, sin conexión, usa la última copia.
const CACHE = "reporte-mef-v2";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url); const clave = u.origin + u.pathname;   // sin ?v=… para no acumular copias
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => {
    if (r.ok && u.origin === location.origin) { const c = r.clone(); caches.open(CACHE).then(k => k.put(clave, c)); }
    return r;
  }).catch(() => caches.match(clave)));
});
