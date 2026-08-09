import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Build date, stamped into the JSON-LD WebPage.dateModified. Client and
    // SSR builds run in the same `npm run build`, so both see the same value
    // and the prerendered markup hydrates without mismatch.
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    // HYDRATION_DEBUG=1 npm run build → development React with readable
    // hydration diffs in the built output. Never for real deploys.
    ...(process.env.HYDRATION_DEBUG
      ? { 'process.env.NODE_ENV': JSON.stringify('development') }
      : {}),
  },
  build: {
    // Split stable vendor code from app code so returning visitors only
    // re-download the (small) app chunk when content changes.
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'animation', test: /node_modules[\\/](gsap|lenis)[\\/]/ },
          ],
        },
      },
    },
  },
})
