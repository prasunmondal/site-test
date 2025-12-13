const CACHE_NAME = "mb-poultry-cache-v3";

const STATIC_ASSETS = [
 "./",
 "./index.html",
 "./style.css",
 "./script.js",
 "./pwa-installation.js",
 "./log-worker.js",
 "./local-name-storage.js",
 "./header-style.css",

 "./retail-calculator/retail-calculator.html",
 "./retail-calculator/retail-calculator-script.css",
 "./retail-calculator/retail-calculator-script.js",
 "./retail-calculator/retail-calculator-style.css",
 "./retail-calculator/sales-report.css",
 "./retail-calculator/sales-report.js",

 "./images/payment-qr.jpeg",
 "./images/icon-192.jpg",
 "./images/icon-512.jpg",
 "./images/mb-icon.png",
 "./images/right-icon.png"
];

// --------------------
// INSTALL
// --------------------
self.addEventListener("install", event => {
 self.skipWaiting(); // take control immediately

 event.waitUntil(
   caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
 );
});

// --------------------
// ACTIVATE
// --------------------
self.addEventListener("activate", event => {
 event.waitUntil(
   Promise.all([
     caches.keys().then(keys =>
       Promise.all(
         keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
       )
     ),
     self.clients.claim() // control open tabs
   ])
 );
});

// --------------------
// FETCH
// --------------------
self.addEventListener("fetch", event => {

 // ✅ Network-first for HTML
 if (event.request.mode === "navigate") {
   event.respondWith(
     fetch(event.request)
       .then(response => {
         const copy = response.clone();
         caches.open(CACHE_NAME).then(cache =>
           cache.put(event.request, copy)
         );
         return response;
       })
       .catch(() => caches.match(event.request))
   );
   return;
 }

 // ✅ Cache-first for static assets
 event.respondWith(
   caches.match(event.request).then(
     cached => cached || fetch(event.request)
   )
 );
});

