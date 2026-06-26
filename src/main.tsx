import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode intentionally omitted: its dev-only double-invoke duplicates
// ScrollTrigger pins and the Lenis RAF loop. Effects all clean up properly,
// but a single deterministic setup keeps the scroll choreography honest.
createRoot(document.getElementById('root')!).render(<App />)
