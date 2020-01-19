// Внимание: ваши данные могут отличаться!
const CACHE_NAME = 'feller-v1.0.1';
const cacheList = [
    'https://yandex.ru/games/sdk/v2',
    'index.html',
    'bundle.js',
    'styles.css',
    'timber/background.png?5',
    'timber/wdoh1.png?5',
    'timber/wdoh2.png?5',
    'timber/man1.png?5',
    'timber/man2.png?5',
    'timber/man3.png?5',
    'timber/stump.png?5',
    'timber/trunk1.png?5',
    'timber/trunk2.png?5',
    'timber/branch1.png?5',
    'timber/branch2.png?5',
    'timber/time-container.png?5',
    'timber/time-bar.png?5',
    'timber/rip.png?5',
    'timber/level.png',
    'timber/game-over.png',
    'timber/btn-play.png',
    'timber/instructions.png',

    'timber/fonts/Numbers.xml',
    'timber/fonts/Numbers.png',
    'timber/fonts/LevelNumbers.xml',
    'timber/fonts/LevelNumbers.png',

    'timber/theme.mp3?5',
    'timber/menu.mp3?5',
    'timber/cut.mp3?5',
    'timber/death.mp3?5',
];

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(cacheList);
        })
    );
});

// Внимание: ваши данные могут отличаться!
const CACHE_PREFIX = 'feller';

this.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Внимание: ваши данные могут отличаться!
this.addEventListener('fetch', function(event) {
    if (
        event.request.method !== 'GET' ||
        event.request.url.indexOf('http://') === 0 ||
        event.request.url.indexOf('an.yandex.ru') !== -1
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request, {
            ignoreSearch: true
        }).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
