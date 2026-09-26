const CACHE = "gnostiri-lessons-v1";
self.addEventListener("install", (event) => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const path = new URL(request.url).pathname;
  if (!path.endsWith("/study")) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try { const response = await fetch(request); if (response.ok) await cache.put(request, response.clone()); return response; }
    catch { return (await cache.match(request)) || new Response("This lesson is not available offline yet.", { status: 503, headers: { "Content-Type": "text/plain" } }); }
  })());
});
