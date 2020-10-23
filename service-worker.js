let CACHE_NAME = "top-euro-league-v1";
let urlsToCache = [
  "/",
  "/nav.html",
  "/match.html",
  "/club_information.html",
  "/standings.html",
  "/index.html",
  "/pages/home.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/images/logo.png",
  "/images/bundesliga.svg",
  "/images/eredivisie.jpg",
  "/images/la_liga.png",
  "/images/ligue_1.png",
  "/images/premiere_league_emblem.jpg",
  "/images/serie_a.jpg",
  "/js/materialize.min.js",
  "/manifest.json",
  "icons/iphone/apple-launch-1125x2436.png",
  "icons/icon-128x128.png",
  "icons/icon-144x144.png",
  "icons/icon-192x192.png",
  "icons/icon-256x256.png",
  "icons/icon-384x384.png",
  "icons/icon-512x512.png",
  "/js/db.js",
  "/js/idb.js",
  "/js/main.js",
  "/js/api.js",
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});


self.addEventListener("fetch", function(event) {
  let base_url = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    icon: 'images/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Top Euro League', options)
  );
});


self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
