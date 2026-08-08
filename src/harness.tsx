import { createRoot } from 'react-dom/client'
import './index.css'
import VignetteStage from './components/portfolio/vignetteStage'

/**
 * Visual test harness (dev-only, never built into dist): renders all eight
 * showcase scenes stacked, so headless Chrome can screenshot the lot with
 * --virtual-time-budget to fast-forward the choreography to its end state.
 */
const IDS = ['forge', 'tera', 'cortex', 'omni', 'harbor', 'convey', 'beacon', 'keystone']

function Harness() {
  // ?w=375 constrains the container to phone width — headless Chrome on macOS
  // won't open windows narrower than ~500px, and below the 640px breakpoint
  // the utility classes applied are identical either way.
  const w = Number(new URLSearchParams(window.location.search).get('w')) || 660
  return (
    <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 24, background: '#FDFDFC' }}>
      {IDS.map((id) => (
        <div key={id} style={{ width: w - 30 }}>
          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{id}</p>
          <div style={{ height: window.innerWidth < 640 ? 460 : 480 }}>
            <VignetteStage id={id} />
          </div>
        </div>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Harness />)
