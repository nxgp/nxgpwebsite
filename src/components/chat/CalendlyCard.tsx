import { useState } from 'react'
import { CalendarDays } from 'lucide-react'

/**
 * Inline booking calendar, rendered in the chat thread when the assistant
 * decides it's time to book (SSE `calendar` event). Plain iframe embed — no
 * Calendly script, nothing loads until this card actually mounts.
 */
export function CalendlyCard({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false)

  // the new-tab link should be the normal scheduling page, not the
  // stripped-down embed view — drop embed params, keep the name/email prefill
  const openUrl = (() => {
    try {
      const u = new URL(url)
      u.searchParams.delete('embed_type')
      u.searchParams.delete('embed_domain')
      u.searchParams.delete('hide_gdpr_banner')
      return u.toString()
    } catch {
      return url
    }
  })()

  return (
    <div className="mt-2 overflow-hidden rounded-inner border border-line bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-line bg-bg/60 px-3.5 py-2">
        <CalendarDays className="size-3.5 text-accent" />
        <p className="text-[0.78rem] font-700">Book your intro call</p>
        <span className="ml-auto text-[0.68rem] font-600 text-ink-faint">30 min · free</span>
      </div>
      <div className="relative h-[440px]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="chat-typing" aria-label="Loading calendar">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
        <iframe
          src={url}
          title="Book a 30-minute intro call with Nx Growth Partners"
          onLoad={() => setLoaded(true)}
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>
      <p className="border-t border-line px-3.5 py-1.5 text-[0.68rem] font-600 text-ink-faint">
        Prefer a full page?{' '}
        <a href={openUrl} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
          Open the calendar in a new tab
        </a>
      </p>
    </div>
  )
}
