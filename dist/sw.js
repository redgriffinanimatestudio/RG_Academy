self.addEventListener("install", function (e) {
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  caches.keys().then(function (names) {
    for (var i = 0; i < names.length; i++) {
      caches.delete(names[i]);
    }
  });
  self.registration.unregister().then(function () {
    return self.clients.matchAll();
  }).then(function (clients) {
    clients.forEach(function (client) {
      client.navigate(client.url);
    });
  });
});
