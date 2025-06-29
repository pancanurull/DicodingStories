import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim, skipWaiting } from 'workbox-core';

skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
  }),
);

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

self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');
  async function chainPromise() {
    try {
      const data = await event.data.json();
      await self.registration.showNotification(data.title, {
        body: data.options.body,
        icon: data.options.icon || '/icons/icon-192x192.png', // Tambahkan ikon default
        badge: data.options.badge || '/icons/icon-96x96.png', // Tambahkan badge default
        ...data.options, // Sertakan semua options lain dari server
      });
    } catch (error) {
      console.error('Error handling push event:', error);
      // Fallback notification jika payload bukan JSON
      await self.registration.showNotification('Pemberitahuan Baru', {
        body: event.data ? event.data.text() : 'Anda memiliki pesan baru.',
        icon: '/icons/icon-192x192.png'
      });
    }
  }
  event.waitUntil(chainPromise());
});