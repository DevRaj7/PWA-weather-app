const CACHE_NAME="version-1";
const urlTocache=['index.html','offline.html'];
const self=this;
//Install service worker
self.addEventListener('install',()=>{
Event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache)=>{
        return cache.addAll(urlTocache);
    })
)
});
//listening requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});