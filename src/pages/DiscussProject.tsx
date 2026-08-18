import { useState } from 'react'
import { ArrowRight, CalendarDays, Check, Mail } from 'lucide-react'
import { cta } from '../data/content'
import { useBooking } from '../components/BookingModal'
import { cn } from '../lib/cn'

/**
 * /discuss-a-project — the single destination for every "Discuss a project"
 * action on the site.
 *
 * The form is the primary path: most people are not ready to put a meeting on
 * their calendar, and previously the only option was booking one, so those
 * visitors had nowhere to go. Booking is kept as an equal alternative for
 * people who would rather just talk.
 */

const HELP_OPTIONS = [
  'AI and workflow automation',
  'Custom software or a product build',
  'An embedded engineering team',
  'Not sure yet',
]

type State = 'idle' | 'busy' | 'sent' | 'error'

export function DiscussProject() {
  const openBooking = useBooking()
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')
  const [emailed, setEmailed] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'busy') return
    const fd = new FormData(e.currentTarget)
    setState('busy')
    setError('')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          company: fd.get('company'),
          help: fd.get('help'),
          message: fd.get('message'),
          website: fd.get('website'), // honeypot
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setError(j.error || 'Something went wrong. Please email hello@nxgp.io.')
        setState('error')
        return
      }
      setEmailed(Boolean(j.emailed))
      setState('sent')
    } catch {
      setError('Something went wrong. Please email hello@nxgp.io.')
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <section className="section">
        <div className="shell">
          <div className="mx-auto max-w-[38rem] rounded-card border border-line bg-surface p-8 text-center shadow-sm">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#E7F8EC]">
              <Check className="size-6 text-[#1D8A46]" />
            </span>
            <h2 className="t-h3 mt-5">Got it. We will be in touch.</h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
              {emailed
                ? 'A copy is on its way to your inbox. One of us will reply personally, usually the same day.'
                : 'One of us will reply personally, usually the same day.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={openBooking}
                className="inline-flex h-[46px] items-center gap-2 rounded-pill bg-ink px-5 text-[0.95rem] font-700 text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <CalendarDays className="size-4" /> Book a time now
              </button>
              <a
                href="/work"
                className="inline-flex h-[46px] items-center gap-2 rounded-pill border border-line bg-surface px-5 text-[0.95rem] font-700 transition-colors hover:border-ink/20"
              >
                See what we have built <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const field =
    'mt-1.5 w-full rounded-inner border border-line bg-surface px-4 py-3 text-[0.98rem] outline-none transition-colors focus:border-accent/50'
  const label = 'text-[0.85rem] font-700 text-ink'

  return (
    <section className="section">
      <div className="shell grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
        {/* the form */}
        <form onSubmit={submit} className="min-w-0">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="name">
                Your name
              </label>
              <input id="name" name="name" required autoComplete="name" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="email">
                Work email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="company">
                Company <span className="font-500 text-ink-faint">(optional)</span>
              </label>
              <input id="company" name="company" autoComplete="organization" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="help">
                What do you need?
              </label>
              <select id="help" name="help" defaultValue={HELP_OPTIONS[0]} className={field}>
                {HELP_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className={label} htmlFor="message">
              What are you trying to build or fix?
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="A sentence or two is plenty. What is the workflow, what is breaking, and what would good look like?"
              className={cn(field, 'resize-y leading-relaxed')}
            />
          </div>

          {/* honeypot: hidden from people, catnip for bots */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {state === 'error' && (
            <p role="alert" className="mt-4 text-[0.9rem] font-600 text-[#B4671B]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={state === 'busy'}
            className="mt-6 inline-flex h-[52px] items-center gap-2 rounded-pill bg-accent px-7 text-[1rem] font-700 text-white shadow-sm transition-[transform,opacity] hover:-translate-y-0.5 disabled:opacity-50"
          >
            {state === 'busy' ? 'Sending…' : 'Send it over'}
            <ArrowRight className="size-4" />
          </button>
          <p className="mt-3 text-[0.85rem] text-ink-faint">
            We reply personally. No sequences, no sales cadence.
          </p>
        </form>

        {/* the alternatives */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-inner bg-accent-wash text-accent-deep">
              <CalendarDays className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-[1.1rem] font-800 tracking-[-0.01em]">
              Rather just talk?
            </h2>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
              Grab 30 minutes. Tell us where you are and we will map where technology creates the
              most value. No pitch deck.
            </p>
            <button
              onClick={openBooking}
              className="mt-4 inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-pill bg-ink px-5 text-[0.92rem] font-700 text-white transition-transform hover:-translate-y-0.5"
            >
              Book a 30-minute call
            </button>
          </div>

          <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-inner bg-accent-wash text-accent-deep">
              <Mail className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-[1.1rem] font-800 tracking-[-0.01em]">
              Prefer email?
            </h2>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
              Write to us directly and it reaches the same people.
            </p>
            <a
              href={`mailto:${cta.email}`}
              className="link-underline mt-3 inline-block text-[0.95rem] font-700 text-accent-deep"
            >
              {cta.email}
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
