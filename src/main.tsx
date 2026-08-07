import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode intentionally omitted: its dev-only double-invoke duplicates
// ScrollTrigger pins and the Lenis RAF loop. Effects all clean up properly,
// but a single deterministic setup keeps the scroll choreography honest.
//
// Production HTML is prerendered at build time (scripts/prerender.mjs), so
// hydrate when static markup is present; fall back to a client render in dev.
const container = document.getElementById('root')!
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />)
} else {
  createRoot(container).render(<App />)
}
