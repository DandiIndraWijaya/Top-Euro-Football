const CACHE_NAME = "d-clothes-v1";
var urlsToCache = [
  "/",
  "manifest.json",
  "/icon-128x128.png",
  "/icon-144x144.png",
  "/icon-192x192.png",
  "/icon-256x256.png",
  "/icon-384x384.png",
  "/icon-512x512.png",
  "/nav.html",
  "/index.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/partner.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/js/script.js",
  "images/jas.jpg",
  "images/audina.jpg",
  "images/baju.jpg",
  "images/celana.jpeg",
  "images/eiger.jpg",
  "images/gucci.jpg",
  "images/header.jpeg",
  "images/me.jpg",
  "images/logo.png",
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg",
  "images/4.jpeg",
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches
        .match(event.request, { cacheName: CACHE_NAME })
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  });


  self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });