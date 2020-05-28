const version = 'v1-';
const cachedFiles = [
  './',
  './favicon.ico',
  './assets/app.js',
  './assets/main.css',
  './assets/images/landscape/background.png',
  './assets/images/landscape/foreground.png',
  './assets/images/landscape/layer1.png',
  './assets/images/landscape/layer2.png',
  './assets/images/landscape/layer3.png',
  './assets/images/landscape/layer4.png',
  './assets/images/landscape/stars.png',
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
    .then(cache => cache.match(request)
      .then(response => response ? response : getFromNetwork(request))
    );
};

const getFromNetwork = (request) => {
  return fetch(request)
    .then(result => caches.open(version + 'OfflineMode')
      .then(cache => cache.match(request)
        .then(response => {
            if (response) {
              console.log('Cache updated from network response for', request.url);
              cache.put(request.url, result.clone());
            }
            return result;
          }
        )
      )
    )
    .catch(error => noMatchBehaviour(request).clone());
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