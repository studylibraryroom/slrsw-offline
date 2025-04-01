const CACHE_NAME = "study-library-cache-v1"; // अपने Cache का नाम दें
const urlsToCache = [
    "/", // होमपेज
    "/index.html",
    "/style.css",
    "/script.js",
    "/images/logo.png",
    "/offline.html" // ऑफलाइन सपोर्ट के लिए
];

// 🔹 Install Event (फाइल्स को कैश में सेव करेगा)
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
    );
});

// 🔹 Activate Event (पुराने Cache को हटा देगा)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 🔹 Fetch Event (कैश से फाइल लोड करेगा या इंटरनेट से लाएगा)
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => caches.match("/offline.html")) // अगर इंटरनेट नहीं है तो Offline Page दिखाएगा
    );
});
