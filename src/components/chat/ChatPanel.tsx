import { useEffect, useRef, useState } from 'react'
import { Send, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { NxMark } from '../ui/Logo'

type Msg = { role: 'user' | 'assistant'; content: string }

const STORAGE_KEY = 'nx-chat-v1'
const GREETING =
  "Hi — I'm the Nx Assistant. Ask me anything about what we build, how engagements work, or whether we're a fit for what you need."
const CHIPS = [
  'What do you build?',
  'How do engagements work?',
  'Show me results you’ve delivered',
]

function load(): { id: string; messages: Msg[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p?.id && Array.isArray(p.messages)) return p
    }
  } catch {
    /* fresh session */
  }
  return { id: crypto.randomUUID(), messages: [] }
}

/** Linkify bare URLs so the Calendly link is clickable. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a
            key={i}
            href={p}
            target="_blank"
            rel="noopener noreferrer"
            className="font-600 text-accent underline underline-offset-2"
          >
            {p.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [session, setSession] = useState<{ id: string; messages: Msg[] } | null>(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSession(load())
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      const el = listRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [session])

  async function ask(text: string) {
    const q = text.trim()
    if (!q || busy || !session) return
    setBusy(true)
    setInput('')
    const base: Msg[] = [...session.messages, { role: 'user', content: q }]
    // optimistic empty assistant bubble that streams in
    setSession({ id: session.id, messages: [...base, { role: 'assistant', content: '' }] })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: session.id, messages: base }),
      })
      if (!res.ok || !res.body) throw new Error(`http ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      let reply = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          try {
            const ev = JSON.parse(line.slice(5))
            if (ev.t === 'delta') {
              reply += ev.text
              setSession({
                id: session.id,
                messages: [...base, { role: 'assistant', content: reply }],
              })
            } else if (ev.t === 'err') {
              reply = reply || ev.message
              setSession({
                id: session.id,
                messages: [...base, { role: 'assistant', content: reply }],
              })
            }
          } catch {
            /* partial line */
          }
        }
      }
      if (!reply) throw new Error('empty reply')
    } catch {
      setSession({
        id: session.id,
        messages: [
          ...base,
          {
            role: 'assistant',
            content:
              "I couldn't reach the assistant just now. Please try again in a moment — or email hello@nxgp.io and the team will get right back to you.",
          },
        ],
      })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  if (!session) return null
  const showChips = session.messages.length === 0 && !busy

  return (
    <div
      className={cn(
        'fixed z-[210] flex flex-col overflow-hidden bg-surface shadow-lg',
        'inset-x-0 bottom-0 h-[82dvh] rounded-t-card border-t border-line',
        'sm:inset-x-auto sm:bottom-24 sm:right-5 sm:h-[600px] sm:max-h-[calc(100dvh-120px)] sm:w-[400px] sm:rounded-card sm:border',
      )}
      role="dialog"
      aria-label="Chat with the Nx Assistant"
    >
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line bg-bg/60 px-4 py-3">
        <NxMark className="h-6" />
        <div className="min-w-0">
          <p className="text-[0.95rem] font-800 leading-tight">Nx Assistant</p>
          <p className="text-[0.7rem] font-600 text-ink-faint">
            AI assistant · answers in real time
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="ml-auto flex size-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <Bubble role="assistant">{GREETING}</Bubble>
        {session.messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content ? (
              <Rich text={m.content} />
            ) : (
              <span className="chat-typing" aria-label="Assistant is typing">
                <i />
                <i />
                <i />
              </span>
            )}
          </Bubble>
        ))}
        {showChips && (
          <div className="flex flex-wrap gap-2 pt-1">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => ask(c)}
                className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[0.82rem] font-600 text-ink-soft transition-colors hover:border-accent/40 hover:text-ink"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* input */}
      <form
        className="flex items-center gap-2 border-t border-line px-3 py-3"
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about services, results, engagements…"
          maxLength={2000}
          className="min-w-0 flex-1 rounded-pill border border-line bg-bg px-4 py-2.5 text-[0.95rem] outline-none transition-colors focus:border-accent/50"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-opacity disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  return (
    <div className={cn('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-inner px-3.5 py-2.5 text-[0.94rem] leading-relaxed',
          role === 'user'
            ? 'bg-accent text-white'
            : 'border border-line bg-bg text-ink',
        )}
      >
        {children}
      </div>
    </div>
  )
}
