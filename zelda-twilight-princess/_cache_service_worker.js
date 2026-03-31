/* service worker that caches webapp files for PWA usage */

var PRECACHE_ID = 'zelda-twilight-princess-tracker';
var PRECACHE_VERSION = 'v1';
var PRECACHE_URLS = [
	'/completion-tracker-js/zelda-twilight-princess/', '/completion-tracker-js/zelda-twilight-princess/index.html',
	'/completion-tracker-js/zelda-twilight-princess/manifest.json',
	/* resources */
	'/completion-tracker-js/zelda-twilight-princess/resources/cover.jpg',
	'/completion-tracker-js/zelda-twilight-princess/resources/app_icon_114.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/app_icon_144.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/app_icon_192.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/app_icon_192_maskable.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/favicon16.png',
	/* nav icons */
	'/completion-tracker-js/zelda-twilight-princess/resources/midna.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/bottle.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/piece_of_heart.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/bug.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/fish_journal.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/ghost_lantern.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/wallet_upgrade.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/hidden_skill_scroll.png',
	'/completion-tracker-js/zelda-twilight-princess/resources/stamp.png',
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