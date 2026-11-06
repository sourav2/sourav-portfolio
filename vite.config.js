import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        cta: resolve(import.meta.dirname, 'cta-preview.html'),
        badge: resolve(import.meta.dirname, 'badge-preview.html'),
        borderBadge: resolve(import.meta.dirname, 'border-badge-preview.html'),
        showcase: resolve(import.meta.dirname, 'showcase-preview.html'),
        heroSlider: resolve(import.meta.dirname, 'hero-slider-preview.html'),
        headerNav: resolve(import.meta.dirname, 'header-nav-preview.html'),
        header: resolve(import.meta.dirname, 'header-preview.html'),
      },
    },
  },
})
