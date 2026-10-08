import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Production HTML is prerendered at build time (scripts/prerender.mjs), so
// hydrate when static markup is present; fall back to a client render in dev.
const container = document.getElementById('root')!
const path = window.location.pathname
if (container.hasChildNodes()) {
  hydrateRoot(container, <App path={path} />)
} else {
  createRoot(container).render(<App path={path} />)
}
