import { useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2, Send, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { NxMark } from '../ui/Logo'
import { Markdown } from './markdown'

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

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [session, setSession] = useState<{ id: string; messages: Msg[] } | null>(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState(false)
  // message index -> rating already sent (prevents double-votes, drives UI)
  const [voted, setVoted] = useState<Record<number, 1 | -1>>({})
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

  function rate(index: number, rating: 1 | -1) {
    if (!session || voted[index]) return
    setVoted((v) => ({ ...v, [index]: rating }))
    const answer = session.messages[index]?.content ?? ''
    const question = [...session.messages.slice(0, index)].reverse().find((m) => m.role === 'user')?.content ?? ''
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: session.id,
        rating,
        question: question.slice(0, 500),
        answer: answer.slice(0, 500),
      }),
    }).catch(() => {})
  }

  if (!session) return null
  const showChips = session.messages.length === 0 && !busy

  return (
    <div
      // data-lenis-prevent: this site runs a global Lenis smooth-scroll that
      // hijacks wheel/touch events on the whole page. Without this attribute
      // Lenis intercepts scrolling meant for the message list and scrolls
      // the page behind the panel instead — the panel looks frozen.
      data-lenis-prevent
      className={cn(
        'fixed z-[210] flex flex-col overflow-hidden bg-surface shadow-lg',
        'inset-x-0 bottom-0 rounded-t-card border-t border-line',
        'transition-[height,width] duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
        expanded ? 'h-[94dvh]' : 'h-[82dvh]',
        'sm:inset-x-auto sm:bottom-24 sm:right-5 sm:rounded-card sm:border',
        // NB: no commas inside arbitrary values — Tailwind emits them
        // unescaped and the browser discards the whole rule as an invalid
        // selector. Use separate width/max-width utilities instead of min().
        expanded
          ? 'sm:h-[780px] sm:max-h-[85dvh] sm:w-[560px] sm:max-w-[92vw]'
          : 'sm:h-[600px] sm:max-h-[calc(100dvh-120px)] sm:w-[400px]',
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
            AI assistant · answers in real time ·{' '}
            <a href="/privacy" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
              privacy
            </a>
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Shrink chat' : 'Expand chat'}
          className="ml-auto hidden size-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
        >
          {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="flex size-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink sm:ml-0"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <Bubble role="assistant">
          <Markdown text={GREETING} />
        </Bubble>
        {session.messages.map((m, i) => (
          <div key={i}>
            <Bubble role={m.role}>
              {m.content ? (
                m.role === 'assistant' ? (
                  <Markdown text={m.content} />
                ) : (
                  m.content
                )
              ) : (
                <span className="chat-typing" aria-label="Assistant is typing">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </Bubble>
            {m.role === 'assistant' && m.content && !(busy && i === session.messages.length - 1) && (
              <div className="mt-1 flex gap-1 pl-1">
                {voted[i] ? (
                  <span className="text-[0.72rem] font-600 text-ink-faint">
                    {voted[i] === 1 ? 'Thanks!' : 'Thanks — we’ll improve this.'}
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => rate(i, 1)}
                      aria-label="Helpful"
                      className="flex size-6 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-accent-wash hover:text-accent-deep"
                    >
                      <ThumbsUp className="size-3.5" />
                    </button>
                    <button
                      onClick={() => rate(i, -1)}
                      aria-label="Not helpful"
                      className="flex size-6 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-accent-wash hover:text-accent-deep"
                    >
                      <ThumbsDown className="size-3.5" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
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
          'max-w-[85%] rounded-inner px-3.5 py-2.5 text-[0.94rem] leading-relaxed',
          role === 'user'
            ? 'whitespace-pre-wrap bg-accent text-white'
            : 'border border-line bg-bg text-ink',
        )}
      >
        {children}
      </div>
    </div>
  )
}
