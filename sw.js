const cacheFiles = [
    './index.html',
]
const __version__ = 'cache-v2'

// 缓存静态资源
self.addEventListener('install', function (evt) {
    // 强制更新sw.js
    self.skipWaiting()
    evt.waitUntil(
        caches.open(version).then(function (cache) {
            return cache.addAll(cacheFiles)
        })
    )
})

// 缓存更新
self.addEventListener('active', function (evt) {
    evt.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== version) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// 请求拦截
self.addEventListener('fetch', function (evt) {
    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            if (response) {
                return response
            }
            return fetch(evt.request).then(function (response) {
                caches.open(version).then(function (cache) {
                    cache.put(evt.request, response)
                    return response
                })
            })
        }).catch(function (err) {
            console.error('fetch 接口错误', err)
            throw err
        })
    )
})

