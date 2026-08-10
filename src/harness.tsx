import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VignetteStage from './components/portfolio/vignetteStage'
import ChatPanel from './components/chat/ChatPanel'
import { BookingProvider, useBooking } from './components/BookingModal'
import AgentCanvas from './components/sketch/AgentCanvas'
import type { Sketch } from './lib/sketch-types'

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

const CANNED_SKETCH: Sketch = {
  name: 'Invoice Triage Agent',
  summary: 'Matches every inbound AP invoice to its PO, posts clean ones to NetSuite, and routes exceptions to your AP lead.',
  trigger: { label: 'Invoice lands', detail: 'in the AP inbox (Outlook shared mailbox)' },
  steps: [
    { type: 'read', label: 'Pull the PO', detail: 'Looks up the matching purchase order by vendor + amount', systems: ['NetSuite'] },
    { type: 'reason', label: 'Three-way match', detail: 'Compares invoice, PO and receiving record; flags gaps' },
    { type: 'act', label: 'Post or hold', detail: 'Posts clean invoices; holds mismatches with a note', systems: ['NetSuite'] },
    { type: 'notify', label: 'Daily digest', detail: 'Summarizes posted + held invoices each morning', systems: ['Slack'] },
  ],
  guardrail: { condition: 'Invoice > $5,000 or vendor not in the master file', action: 'AP lead approves in Slack before posting' },
  integrations: ['Outlook shared mailbox', 'NetSuite', 'Slack'],
  metrics: ['Hours of manual matching per week', 'Exception rate', 'Days payable outstanding'],
  clarify: 'What share of invoices arrive without a PO today — and who chases those down?',
  feasibility: 'standard',
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
} else if (ui === 'sketch') {
  root.render(
    <BookingProvider>
      <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
        <AgentCanvas sketch={CANNED_SKETCH} sketchId="00000000-0000-0000-0000-000000000000" />
      </div>
    </BookingProvider>,
  )
} else if (ui === 'booking') {
  root.render(
    <BookingProvider>
      <OpenBookingOnMount />
    </BookingProvider>,
  )
} else {
  root.render(<Harness />)
}
