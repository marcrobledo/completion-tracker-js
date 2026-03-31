/* service worker that caches webapp files for PWA usage */

var PRECACHE_ID = 'zelda-skyward-sword-tracker';
var PRECACHE_VERSION = 'v1';
var PRECACHE_URLS = [
	'/completion-tracker-js/zelda-skyward-sword/', '/completion-tracker-js/zelda-skyward-sword/index.html',
	'/completion-tracker-js/zelda-skyward-sword/manifest.json',
	/* resources */
	'/completion-tracker-js/zelda-skyward-sword/resources/cover.jpg',
	'/completion-tracker-js/zelda-skyward-sword/resources/app_icon_114.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/app_icon_144.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/app_icon_192.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/app_icon_192_maskable.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/favicon16.png',
	/* nav icons */
	'/completion-tracker-js/zelda-skyward-sword/resources/hylian_shield.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/goddess_cube.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/gratitude_crystal.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/piece_of_heart.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/pouch.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/collection.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug01.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug02.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug03.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug04.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug05.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug06.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug07.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug08.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug09.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug10.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug11.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/bug12.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure01.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure02.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure03.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure04.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure05.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure06.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure07.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure08.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure09.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure10.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure11.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure12.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure13.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure14.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure15.png',
	'/completion-tracker-js/zelda-skyward-sword/resources/treasure16.png',
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