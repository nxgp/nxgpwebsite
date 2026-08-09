import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VignetteStage from './components/portfolio/vignetteStage'
import ChatPanel from './components/chat/ChatPanel'
import { BookingProvider, useBooking } from './components/BookingModal'

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

/** ?ui=chat — chat panel restored from a session that already booked, so the
 *  inline Calendly card renders (also exercises the localStorage path). */
function ChatHarness() {
  return <ChatPanel onClose={() => {}} />
}

function OpenBookingOnMount() {
  const openBooking = useBooking()
  useEffect(() => openBooking(), [openBooking])
  return <p style={{ padding: 16 }}>booking harness</p>
}

const ui = new URLSearchParams(window.location.search).get('ui')
const root = createRoot(document.getElementById('root')!)

if (ui === 'chat') {
  localStorage.setItem(
    'nx-chat-v1',
    JSON.stringify({
      id: 'harness',
      messages: [
        { role: 'user', content: 'Can I book a call with the team?' },
        {
          role: 'assistant',
          content: "You're all set — the team has your note. Grab a time below that works for you.",
          calendarUrl: 'https://calendly.com/ravi-nxgp?hide_gdpr_banner=1&embed_type=Inline',
        },
      ],
    }),
  )
  root.render(<ChatHarness />)
} else if (ui === 'booking') {
  root.render(
    <BookingProvider>
      <OpenBookingOnMount />
    </BookingProvider>,
  )
} else {
  root.render(<Harness />)
}
