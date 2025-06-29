import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim, skipWaiting } from 'workbox-core';

// Memberitahu Workbox untuk mengambil alih kontrol secepat mungkin.
skipWaiting();
clientsClaim();

// Injeksi manifest dari Webpack. Placeholder __WB_MANIFEST akan diganti
// dengan daftar URL untuk di-precache.
precacheAndRoute(self.__WB_MANIFEST);

// Aturan Caching untuk aset statis (CSS, JS, HTML)
// Menggunakan strategi Stale-While-Revalidate
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
  }),
);

// Aturan Caching untuk gambar
// Menggunakan strategi CacheFirst dengan masa berlaku 30 hari
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  }),
);

// Aturan Caching untuk API dari Dicoding
// Menggunakan strategi NetworkFirst
registerRoute(
  ({ url }) => url.href.startsWith('https://story-api.dicoding.dev'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 jam
      }),
    ],
  }),
);

// --- INI BAGIAN PENTING YANG DIMINTA REVIEWER ---
// Menambahkan event listener untuk event 'push'
self.addEventListener('push', (event) => {
  console.log('Service Worker: Pushing notification...');

  const notificationData = event.data.json();
  const { title, options } = notificationData;

  const showNotification = self.registration.showNotification(title, options);
  event.waitUntil(showNotification);
});