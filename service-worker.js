let CACHE_NAME = "top-euro-league-v1";
let urlsToCache = [
  "/",
  "/nav.html",
  "/index.js",
  "/match.html",
  "/club_information.html",
  "/standings.html",
  "/index.html",
  "/pages/home.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/images/bundesliga.svg",
  "/images/eredivisie.jpg",
  "/images/la_liga.png",
  "/images/ligue_1.svg",
  "/images/premiere_league_emblem.jpg",
  "/images/serie_a.jpg",
  "/js/materialize.min.js",
  "/manifest.json",
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
  let base_url = "https://api.football-data.org/";

  if (navigator.onLine) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          console.log('gsgs')
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );}
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
