var expectedCacheName = 'restaurant-1';
//creating a veriable and arrays to hold the cahename & the requird content of cache.
let WhatToCache = [
    '/',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './img/Time.jpg',
    './js/main.js',
    './js/restaurant_info.js',
    './js/dbhelper.js',

];
//Here the service worker will Open a cache and cache the files.
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(expectedCacheName).then(function (cache) {
            //console.log(cache);
            return cache.addAll(WhatToCache);

        }).catch(erroe => {
            console.log(erroe);
        })
    );
});
//Here the service worker will  delete old cache.
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != expectedCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
//Here the service worker will  receive fetch events.
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (resp) {
      return resp || fetch(event.request).then(function (response)  {
        let responseClone = response.clone();
        caches.open(expectedCacheName).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    }).catch(function() {
      return caches.match('/img/Time.jpg');
    })
  );
});
