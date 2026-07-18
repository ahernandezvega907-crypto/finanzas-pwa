import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MoneyFlow',
        short_name: 'MoneyFlow',
        description: 'Control inteligente de finanzas personales',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // === CONFIGURACIÓN DE WORKBOX PARA PRODUCCIÓN ===
      workbox: {
        cleanupOutdatedCaches: true, // Borra versiones viejas automáticamente
        clientsClaim: true,
        skipWaiting: true,
        // Estrategia de almacenamiento en caché para peticiones externas
        runtimeCaching: [
          {
            // Captura las llamadas a Supabase y aplica una estrategia Network First
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              networkTimeoutSeconds: 3, // Si Supabase tarda más de 3s en responder, recurre al caché local
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // Guarda la respuesta por un día máximo
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
  ],
})