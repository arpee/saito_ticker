/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');

registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') {
    return false;
  }

  if (url.pathname.startsWith('/_')) {
    return false;
  }

  if (url.pathname.match(fileExtensionRegexp)) {
    return false;
  }

  return true;
}, createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`));

registerRoute(
  ({ url }) =>
    url.origin === 'https://api.coingecko.com' ||
    url.origin === 'https://api.dexscreener.com' ||
    url.origin === 'https://api.dexscreener.io',
  new NetworkFirst({
    cacheName: 'saito-market-api',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 5 * 60,
      }),
    ],
  })
);

registerRoute(
  ({ request, url }) =>
    url.origin === self.location.origin &&
    ['image', 'manifest'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'saito-local-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({ request, url }) =>
    url.origin !== self.location.origin &&
    ['font', 'image', 'script', 'style'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'saito-external-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
