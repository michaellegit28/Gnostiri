
const CACHE = "gnostiri-lessons-v4";
const OFFLINE_URL = "/offline";
const DB_NAME = "gnostiri-offline";
const DB_VERSION = 1;
const VIEWS_STORE = "views";

const READABLE = [
  /^\/highschool\/[^/]+\/[^/]+\/[^/]+\/study$/,
  /^\/highschool\/study\//,
  /^\/university\/[^/]+\/lessons\//,
  /^\/desk\//,
];

const NETWORK_FIRST = [
  (path) => path.endsWith("/study"),
  (path) => path.startsWith("/discovery/"),
  (path) => path.startsWith("/university/"),
  (path) => path.startsWith("/highschool/study/"),
];

function isReadable(path) {
  return READABLE.some((rule) => rule.test(path));
}

function isCacheable(path) {
  return isReadable(path) || NETWORK_FIRST.some((rule) => rule(path));
}

function readableKey(path) {
  return /\/study$/.test(path) ? "study" : path.startsWith("/desk/") ? "desk" : "lesson";
}


self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL).catch(() => undefined));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

function rememberView(path) {
  return new Promise((resolve) => {
    let open;
    try {
      open = indexedDB.open(DB_NAME, DB_VERSION);
    } catch {
      resolve();
      return;
    }
    open.onupgradeneeded = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains(VIEWS_STORE)) db.createObjectStore(VIEWS_STORE, { keyPath: "path" });
    };
    open.onsuccess = () => {
      const db = open.result;
      try {
        const tx = db.transaction(VIEWS_STORE, "readwrite");
        tx.objectStore(VIEWS_STORE).put({ path, title: readableKey(path), viewedAt: Date.now() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
        tx.onabort = () => resolve();
      } catch {
        resolve();
      }
    };
    open.onerror = () => resolve();
  });
}


self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const path = new URL(request.url).pathname;

  if (request.mode === "navigate" && !isCacheable(path)) {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const cache = await caches.open(CACHE);
          return (await cache.match(OFFLINE_URL)) || new Response("Offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
        }
      })(),
    );
    return;
  }

  if (!isCacheable(path)) return;

  const readable = isReadable(path);

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);

      if (readable) {
        const hit = await cache.match(request);
        if (hit) {
          if (self.navigator && self.navigator.onLine === false) return hit;
          void rememberView(path);
          event.waitUntil(
            fetch(request)
              .then((response) => {
                if (response.ok) return cache.put(request, response.clone());
              })
              .catch(() => undefined),
          );
          return hit;
        }
      }

      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response.clone());
          if (readable) void rememberView(path);
        }
        return response;
      } catch {
        const hit = await cache.match(request);
        if (hit) return hit;
        return new Response("This lesson is not available offline yet.", { status: 503, headers: { "Content-Type": "text/plain" } });
      }
    })(),
  );
});
