
console.log('Service worker initializing');

const version = 'v1-';
const cachedFiles = [
  './',
  './favicon.ico',
  './assets/app.js',
  './assets/main.css',
  './assets/images/landscape/background.svg',
  './assets/images/landscape/foreground.svg',
  './assets/images/landscape/layer1.svg',
  './assets/images/landscape/layer2.svg',
  './assets/images/landscape/layer3.svg',
  './assets/images/landscape/layer4.svg',
  './assets/images/landscape/stars.svg',
];

self.addEventListener("install", (event) => {
  console.log('Service Worker: install in progress...');
  event.waitUntil(
    caches
      .open(version + 'cgrcritical')
      .then(cache => cache.addAll(cachedFiles))
      .then(_ => console.log('Service Worker: install complete. It is now safe to go offline!'))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(getFromCache(event.request));
});

const getFromCache = (request) => {
  return caches.open(version + 'cgrcritical')
    .then(function (cache) {
      return cache.match(request)
        .then(function(response) {
          // On renvoie le contenu en cache s'il existe, sinon on tente la réponse network.
          return (response)
            ? response
            : getFromNetwork(request);
        });
  });
};

const getFromNetwork = (request) => {
  return fetch(request)
    .then(function (result) {
      return caches.open(version + 'OfflineMode')
        .then(function (cache) {
          return cache.match(request)
            .then(function (response) {
              if (response) {
                // Si le network nous renvoie une réponse pour un des fichiers destinés à être mis en cache, on l'enregistre
                console.log('Cache updated from network response for', request.url);
                cache.put(request.url, result.clone());
              }
              // On renvoie la réponse network.
              return result;
            });
        })
        .catch(function (error) {
          return noMatchBehaviour(request).clone();
        });
    })
    .catch(function (error) {
      return noMatchBehaviour(request).clone();
    });
};

const noMatchBehaviour = (request) => {
  console.warn('No response from and no cached copy of', request.url);
  if (request.url.indexOf('status.json') > -1) {
    return new Response(JSON.stringify({ online: false }), {
      status: 200,
      statusText: 'OK',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  } else {
    return new Response('<h1>Service Unavailable</h1>', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html'
      })
    });
  }
};