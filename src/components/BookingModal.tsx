import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cta } from '../data/content'

/**
 * Site-wide booking modal — every "Book a call" opens the Calendly embed in
 * place instead of linking out. Nothing loads until first open (the iframe
 * mounts on demand), so the page pays zero cost for it.
 */

const BookingContext = createContext<() => void>(() => {})

export const useBooking = () => useContext(BookingContext)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const openedFrom = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const openBooking = useCallback(() => {
    openedFrom.current = (document.activeElement as HTMLElement) ?? null
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    openedFrom.current?.focus?.()
  }, [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  // embed_domain is required for hide_gdpr_banner to take effect. Guarded:
  // this component renders during SSR prerendering, where window is absent
  // (the modal itself can only open client-side).
  const url = `${cta.calendly}?hide_gdpr_banner=1&embed_type=Inline&embed_domain=${
    typeof window === 'undefined' ? 'nxgp.io' : window.location.hostname
  }`

  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      {open && (
        <div
          // Lenis hijacks wheel/touch on the page — without this the calendar
          // can't scroll and the page moves behind the overlay instead.
          data-lenis-prevent
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Book a 30-minute intro call"
        >
          <button
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 cursor-default bg-navy/55 backdrop-blur-[2px]"
            tabIndex={-1}
          />
          <div className="relative flex h-[min(760px,92dvh)] w-[min(1000px,96vw)] flex-col overflow-hidden rounded-card border border-line bg-surface shadow-lg">
            <div className="flex items-center gap-3 border-b border-line bg-bg/60 px-4 py-3">
              <div>
                <p className="text-[0.95rem] font-800 leading-tight">Book a 30-minute intro call</p>
                <p className="text-[0.72rem] font-600 text-ink-faint">
                  No pitch deck — tell us where you are, we map where technology creates value.
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={close}
                aria-label="Close booking"
                className="ml-auto flex size-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>
            <iframe
              src={url}
              title="Book a 30-minute intro call with Nx Growth Partners"
              className="min-h-0 w-full flex-1 border-0"
            />
          </div>
        </div>
      )}
    </BookingContext.Provider>
  )
}
