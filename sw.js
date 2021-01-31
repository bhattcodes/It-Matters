const abx1 = "abx-v1";
const assets = [
  "/",
  "index.html",
  "explore.html",
  "currentlocation.html",
  "show.html",
  "style.css",
  "/cl.js",
  "/images/coffee1.jpg",
  "/images/balloon.png",
  "/images/cloud.png",
  "/images/icon.png",
    "/images/location.png",
    "/images/loco.png",
    "lowersection.png",
    "wind-sign.png"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(abx1).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })