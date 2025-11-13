const CACHE_NAME = "mb-poultry-cache-v1";

const urlsToCache = [
  "/site-test/",
  "/site-test/index.html",
  "/site-test/style.css",
  "/site-test/script.js",
  "/site-test/images/payment-qr.jpg",
  "/site-test/images/icon-192.png",
  "/site-test/images/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});
