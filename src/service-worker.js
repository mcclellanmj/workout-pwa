const version = 20190401;

addEventListener('install', event => {
    //console.log("Installed");
});

addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});