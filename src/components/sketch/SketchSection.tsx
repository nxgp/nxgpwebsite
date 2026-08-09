import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { sketch as copy } from '../../data/content'
import { useReveal } from '../../hooks/useReveal'
import { SectionHeader } from '../ui/SectionHeader'
import type { Sketch } from '../../lib/sketch-types'

// The canvas ships in its own chunk, fetched on first submit (or share-link
// rehydration) — the section itself costs the page almost nothing.
const AgentCanvas = lazy(() => import('./AgentCanvas'))

type State =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'done'; sketch: Sketch; id: string | null }
  | { kind: 'error'; message: string }

/** Rotating honest status line while the model designs. */
function Designing() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % copy.designing.length), 1400)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex items-center gap-3 rounded-inner border border-line bg-surface px-5 py-4 shadow-sm">
      <span className="chat-typing" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span aria-live="polite" className="text-[0.95rem] font-600 text-ink-soft">
        {copy.designing[i]}
      </span>
    </div>
  )
}

/**
 * "Sketch my agent" — describe a workflow, watch it become an agent design.
 * Lives on the home page (after the portfolio) and standalone at /sketch,
 * where ?s=<id> rehydrates a shared sketch.
 */
export function SketchSection() {
  const ref = useReveal<HTMLDivElement>()
  const [value, setValue] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // share-link rehydration (client-only; SSR always renders the idle state)
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('s')
    if (!id) return
    setState({ kind: 'busy' })
    fetch(`/api/sketch?id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { sketch: Sketch; description: string }) => {
        setValue(j.description)
        setState({ kind: 'done', sketch: j.sketch, id })
      })
      .catch(() => setState({ kind: 'idle' }))
  }, [])

  async function sketchIt(description: string) {
    const d = description.trim()
    if (d.length < 12 || state.kind === 'busy') return
    setState({ kind: 'busy' })
    try {
      const r = await fetch('/api/sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: d }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setState({
          kind: 'error',
          message:
            r.status === 429
              ? "You've sketched a lot today — book a call and we'll draw the rest together."
              : j.error || 'The designer hit a snag — please try again.',
        })
        return
      }
      setState({ kind: 'done', sketch: j.sketch as Sketch, id: (j.id as string) ?? null })
      // bring the freshly-drawn canvas into view
      setTimeout(() => canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150)
    } catch {
      setState({ kind: 'error', message: 'The designer hit a snag — please try again.' })
    }
  }

  const rejected = state.kind === 'done' && state.sketch.rejected

  return (
    <section id="sketch" className="section">
      <div ref={ref} className="shell">
        <SectionHeader kicker={copy.kicker} title={copy.h2} sub={copy.sub} />

        {/* the ask */}
        <form
          data-reveal
          className="mt-8 flex max-w-[46rem] flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            sketchIt(value)
          }}
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={copy.placeholder}
            maxLength={500}
            aria-label="Describe a workflow to sketch as an agent"
            className="h-[52px] min-w-0 flex-1 rounded-pill border border-line bg-surface px-5 text-[0.98rem] shadow-sm outline-none transition-colors focus:border-accent/50"
          />
          <button
            type="submit"
            disabled={state.kind === 'busy' || value.trim().length < 12}
            className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-pill bg-accent px-6 text-[0.98rem] font-700 text-white shadow-sm transition-[transform,opacity] hover:-translate-y-0.5 disabled:opacity-40"
          >
            {copy.button}
            <ArrowRight className="size-4" />
          </button>
        </form>

        {/* example chips — one click runs a real sketch */}
        {state.kind === 'idle' && (
          <div data-reveal className="mt-3 flex max-w-[46rem] flex-wrap gap-2">
            {copy.examples.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setValue(ex)
                  sketchIt(ex)
                }}
                className={cn(
                  'rounded-pill border border-line bg-surface px-3.5 py-1.5 text-left text-[0.8rem] font-600',
                  'text-ink-soft transition-colors hover:border-accent/40 hover:text-ink',
                )}
              >
                {ex.length > 64 ? ex.slice(0, 62) + '…' : ex}
              </button>
            ))}
          </div>
        )}

        {/* the answer */}
        <div ref={canvasRef} className="mt-6">
          {state.kind === 'busy' && <Designing />}
          {state.kind === 'error' && (
            <p className="rounded-inner border border-line bg-surface px-5 py-4 text-[0.92rem] font-600 text-ink-soft shadow-sm">
              {state.message}
            </p>
          )}
          {rejected && (
            <p className="rounded-inner border border-line bg-surface px-5 py-4 text-[0.92rem] font-600 text-ink-soft shadow-sm">
              {state.kind === 'done' && state.sketch.rejected}
            </p>
          )}
          {state.kind === 'done' && !rejected && (
            <Suspense fallback={<Designing />}>
              <AgentCanvas sketch={state.sketch} sketchId={state.id} />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  )
}
