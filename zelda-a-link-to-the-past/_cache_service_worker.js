/* service worker that caches webapp files for PWA usage */

var PRECACHE_ID = 'zelda-a-link-to-the-past-tracker';
var PRECACHE_VERSION = 'v1';
var PRECACHE_URLS = [
	'/completion-tracker-js/zelda-a-link-to-the-past/', '/completion-tracker-js/zelda-a-link-to-the-past/index.html',
	'/completion-tracker-js/zelda-a-link-to-the-past/manifest.json',
	/* resources */
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/cover.jpg',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/app_icon_114.png',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/app_icon_144.png',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/app_icon_192.png',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/app_icon_192_maskable.png',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/favicon16.png',
	/* nav icons */
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/shield.png',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/piece_of_heart.png',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/bottle.png',
	'/completion-tracker-js/zelda-a-link-to-the-past/resources/equipment.png',
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