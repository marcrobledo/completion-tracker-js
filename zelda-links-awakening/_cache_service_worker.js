/* service worker that caches webapp files for PWA usage */

var PRECACHE_ID = 'zelda-links-awakening-tracker';
var PRECACHE_VERSION = 'v1';
var PRECACHE_URLS = [
	'/completion-tracker-js/zelda-links-awakening/', '/completion-tracker-js/zelda-links-awakening/index.html',
	'/completion-tracker-js/zelda-links-awakening/manifest.json',
	/* resources */
	'/completion-tracker-js/zelda-links-awakening/resources/cover.jpg',
	'/completion-tracker-js/zelda-links-awakening/resources/app_icon_114.png',
	'/completion-tracker-js/zelda-links-awakening/resources/app_icon_144.png',
	'/completion-tracker-js/zelda-links-awakening/resources/app_icon_192.png',
	'/completion-tracker-js/zelda-links-awakening/resources/app_icon_192_maskable.png',
	'/completion-tracker-js/zelda-links-awakening/resources/favicon16.png',
	/* nav icons */
	'/completion-tracker-js/zelda-links-awakening/resources/home.png',
	'/completion-tracker-js/zelda-links-awakening/resources/piece_of_heart.png',
	'/completion-tracker-js/zelda-links-awakening/resources/seashell.png',
	'/completion-tracker-js/zelda-links-awakening/resources/equipment.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photographer.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo01.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo02.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo03.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo04.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo05.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo06.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo07.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo08.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo09.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo10.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo11.png',
	'/completion-tracker-js/zelda-links-awakening/resources/photo12.png',
	/* map */
	'/completion-tracker-js/zelda-links-awakening/resources/koholint.png',
	'/completion-tracker-js/zelda-links-awakening/resources/koholint_marker.png',
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