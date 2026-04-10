import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/maskable-192.png', 'icons/maskable-512.png'],
      manifest: {
        name: 'Circle Player',
        short_name: 'Circle',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#111827',
        icons: [
          { src: 'icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // images/artwork
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'images' }
          },
          {
            // pages / static
            urlPattern: ({ request }) =>
              request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style',
            handler: 'NetworkFirst',
            options: { cacheName: 'app-shell' }
          }
        ]
      }
    })
  ],
  // Optional: quiet the red overlay if you prefer
  // server: { hmr: { overlay: false } }
});
