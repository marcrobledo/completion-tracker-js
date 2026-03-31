/* service worker that caches webapp files for PWA usage */

var PRECACHE_ID = 'zelda-wind-waker-tracker';
var PRECACHE_VERSION = 'v1';
var PRECACHE_URLS = [
	'/completion-tracker-js/zelda-wind-waker/', '/completion-tracker-js/zelda-wind-waker/index.html',
	'/completion-tracker-js/zelda-wind-waker/manifest.json',
	/* resources */
	'/completion-tracker-js/zelda-wind-waker/resources/cover.jpg',
	'/completion-tracker-js/zelda-wind-waker/resources/app_icon_114.png',
	'/completion-tracker-js/zelda-wind-waker/resources/app_icon_144.png',
	'/completion-tracker-js/zelda-wind-waker/resources/app_icon_192.png',
	'/completion-tracker-js/zelda-wind-waker/resources/app_icon_192_maskable.png',
	'/completion-tracker-js/zelda-wind-waker/resources/favicon16.png',
	/* nav icons */
	'/completion-tracker-js/zelda-wind-waker/resources/bottle.png',
	'/completion-tracker-js/zelda-wind-waker/resources/piece_of_heart.png',
	'/completion-tracker-js/zelda-wind-waker/resources/bomb_upgrade.png',
	'/completion-tracker-js/zelda-wind-waker/resources/chart_treasure.png',
	'/completion-tracker-js/zelda-wind-waker/resources/chart_special.png',
	'/completion-tracker-js/zelda-wind-waker/resources/figurines.png',
	'/completion-tracker-js/zelda-wind-waker/resources/tingle_gold.png',
	/* map */
	'/completion-tracker-js/zelda-wind-waker/resources/great_sea_chart.jpg',
	'/completion-tracker-js/zelda-wind-waker/resources/great_sea_chart_marker.png',
	/* completion tracker core */
	'/completion-tracker-js/completion-tracker.js',
	'/completion-tracker-js/assets/app.js',
	'/completion-tracker-js/assets/style.css'
];



// install event (fired when sw is first installed): opens a new cache
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open('precache-' + PRECACHE_ID + '-' + PRECACHE_VERSION)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(self.skipWaiting())
	);
});


// activate event (fired when sw is has been successfully installed): cleans up old outdated caches
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => (cacheName.startsWith('precache-' + PRECACHE_ID + '-') && !cacheName.endsWith('-' + PRECACHE_VERSION)));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				console.log('Delete cache: ' + cacheToDelete);
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});


// fetch event (fired when requesting a resource): returns cached resource when possible
self.addEventListener('fetch', evt => {
	if (evt.request.url.startsWith(self.location.origin)) { //skip cross-origin requests
		evt.respondWith(
			caches.match(evt.request).then(cachedResource => {
				if (cachedResource) {
					return cachedResource;
				} else {
					return fetch(evt.request);
				}
			})
		);
	}
});