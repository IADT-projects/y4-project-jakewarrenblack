// if we load something *once*, it doesn't need to be reloaded, just take it from the cache
const CACHE_NAME = "version-1"
const urlsToCache = ['index.html', 'offline.html']

const self = this;

// Install service worker
// self refers to the service worker itself
self.addEventListener('install', (event) => {
    // open the cache and add our URLs
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache')
                return cache.addAll(urlsToCache)
            })
    )
})

// Listen for requests
self.addEventListener('fetch', (event) => {
    // when we notice a fetch request, respond with the cache corresponding to the request
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                // if cached file available
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
})

// Activate the service worker
self.addEventListener('activate', (event) => {
    // removing previous caches and just keeping the latest
    const cacheWhitelist = []
    cacheWhitelist.push(CACHE_NAME)

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                // if the cache whitelist does not include the cache name, delete it
                // if it's in the whitelist, keep it
                if(!cacheWhitelist.includes(cacheName)){
                    return caches.delete(cacheName)
                }
            })
        ))
    )
})

self.addEventListener('push', (event) => {
    // Retrieve the payload
    const data = event.data.json()

    console.log('push has been received')

    // title received from payload (from the server)
    self.registration.showNotification(data.title, {
        body: 'Notified by backend',
        icon: "./images/logo-01.png"
    })
})