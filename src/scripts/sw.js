import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

// Klaim klien dan lewati waiting state
self.skipWaiting();
clientsClaim();

// Precache semua aset yang dihasilkan oleh Webpack
precacheAndRoute(self.__WB_MANIFEST);

// Aturan Caching untuk aset statis (JS, CSS, HTML)
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
  })
);

// Aturan Caching untuk gambar
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

// Aturan Caching untuk API Dicoding
registerRoute(
  ({ url }) => url.href.startsWith('https://story-api.dicoding.dev'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 menit
      }),
    ],
  })
);

// Event listener untuk push notification
self.addEventListener('push', (event) => {
  console.log('Service Worker: Pushing message...');

  const notificationData = event.data.json();
  const { title, options } = notificationData;

  const showNotification = self.registration.showNotification(title, {
    body: options.body,
    icon: options.icon || '/icons/icon-192x192.png',
    badge: options.badge || '/icons/icon-192x192.png',
    data: options.data,
  });

  event.waitUntil(showNotification);
});