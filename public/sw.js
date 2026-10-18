const CACHE = "gnostiri-lessons-v3";
self.addEventListener("install", (event) => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const path = new URL(request.url).pathname;
  // Offline-capable topic cards: highschool study + discovery + university (GET only, network-first)
  // Alignment API (/api/alignment) is intentionally NOT cached — always fresh.
  const cacheable = path.endsWith("/study") || path.startsWith("/discovery/") || path.startsWith("/university/") || path.startsWith("/highschool/study/");
  if (!cacheable) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try { const response = await fetch(request); if (response.ok) await cache.put(request, response.clone()); return response; }
    catch { return (await cache.match(request)) || new Response("This lesson is not available offline yet.", { status: 503, headers: { "Content-Type": "text/plain" } }); }
  })());
});
