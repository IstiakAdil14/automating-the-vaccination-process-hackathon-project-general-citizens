// citizen-dashboard-v1 — Workbox service worker
// Loaded via importScripts from the Workbox CDN (no build step required)

importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js");

const { cacheFirst, networkFirst, networkOnly } = workbox.strategies;
const { registerRoute }                          = workbox.routing;
const { CacheableResponsePlugin }               = workbox.cacheableResponse;
const { ExpirationPlugin }                      = workbox.expiration;
const { BackgroundSyncPlugin }                  = workbox.backgroundSync;
const { Queue }                                 = workbox.backgroundSync;

const CACHE = "citizen-dashboard-v1";

// ── 1. Cache-first: static assets ────────────────────────────────────────────
registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image",
  new cacheFirst({
    cacheName: `${CACHE}-assets`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// ── 2. Cache-first: vaccine records, appointments, user profile ───────────────
registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/api/vaccination") ||
    url.pathname.startsWith("/api/appointments") ||
    url.pathname.startsWith("/api/auth/profile"),
  new cacheFirst({
    cacheName: `${CACHE}-data`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
    ],
  })
);

// ── 3. Network-first: AI recommendations, new appointment slots ───────────────
registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/api/ai/") ||
    url.pathname.startsWith("/api/centers"),
  new networkFirst({
    cacheName: `${CACHE}-dynamic`,
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 }),
    ],
  })
);

// ── 4. Background sync: form submissions while offline ────────────────────────
const formQueue = new Queue("citizen-form-queue", {
  maxRetentionTime: 24 * 60, // 24 hours in minutes
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request.clone());
      } catch {
        await queue.unshiftRequest(entry);
        throw new Error("Background sync replay failed — will retry");
      }
    }
  },
});

// Intercept POST/PUT to API routes and queue when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (
    (request.method === "POST" || request.method === "PUT") &&
    request.url.includes("/api/")
  ) {
    const bgSyncLogic = async () => {
      try {
        return await fetch(request.clone());
      } catch {
        await formQueue.pushRequest({ request });
        return new Response(
          JSON.stringify({ queued: true, message: "Request queued for background sync" }),
          { status: 202, headers: { "Content-Type": "application/json" } }
        );
      }
    };
    event.respondWith(bgSyncLogic());
  }
});

// ── 5. Precache app shell pages ───────────────────────────────────────────────
workbox.precaching.precacheAndRoute([
  { url: "/",              revision: "v1" },
  { url: "/dashboard",     revision: "v1" },
  { url: "/appointments",  revision: "v1" },
  { url: "/vaccine-card",  revision: "v1" },
  { url: "/family",        revision: "v1" },
]);

// ── 6. Offline fallback for navigation requests ───────────────────────────────
registerRoute(
  ({ request }) => request.mode === "navigate",
  new networkFirst({
    cacheName: `${CACHE}-pages`,
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// ── 7. Push event handler ─────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: "VaxCare", body: event.data.text(), url: "/dashboard" }; }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "VaxCare", {
      body:    payload.body,
      icon:    "/header-img/logo_1.svg",
      badge:   "/header-img/logo_1.svg",
      tag:     "vaxcare-reminder",
      renotify: true,
      data:    { url: payload.url ?? "/dashboard" },
    })
  );
});

// ── 8. Notification click — open/focus the app ────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/dashboard";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

// ── 9. SKIP_WAITING message from ServiceWorkerRegistrar ──────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
