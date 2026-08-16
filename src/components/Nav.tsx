import { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { Logo } from './ui/Logo'
import { nav } from '../data/content'
import { scrollToId } from '../lib/useSmoothScroll'
import { useBooking } from './BookingModal'
import { cn } from '../lib/cn'

/** Maps a home-page section id to its standalone page URL. */
const pageFor = (id: string) => `/${id}`

/**
 * On the home page a nav item scrolls to its section, but only when that
 * section is actually on the page. Some nav targets have no home section at
 * all (Blog) and others were moved off the home scroll (Services,
 * Industries) — for those the link must navigate like any other link rather
 * than being swallowed by a preventDefault.
 */
function sectionOnPage(id: string): boolean {
  return typeof document !== 'undefined' && document.getElementById(id) !== null
}

export function Nav({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const openBooking = useBooking()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'nav-enter fixed inset-x-0 top-0 z-[100] transition-[background,box-shadow] duration-300',
        scrolled ? 'nav-frost' : 'bg-transparent',
      )}
    >
      <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
        <a
          href="/"
          onClick={
            home
              ? (e) => {
                  e.preventDefault()
                  scrollToId('top')
                }
              : undefined
          }
          aria-label="Nx Growth Partners home"
        >
          <Logo />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.id}
              href={pageFor(l.id)}
              onClick={
                home
                  ? (e) => {
                      if (!sectionOnPage(l.id)) return // let it navigate
                      e.preventDefault()
                      scrollToId(l.id)
                    }
                  : undefined
              }
              className="link-underline text-[0.93rem] font-600 text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="dark" onClick={openBooking}>
            {nav.cta}
          </Button>
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-full border border-line bg-surface/70 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-4">
            <span className={cn('absolute left-0 h-[1.5px] w-full bg-ink transition-all', open ? 'top-1.5 rotate-45' : 'top-0')} />
            <span className={cn('absolute bottom-0 left-0 h-[1.5px] w-full bg-ink transition-all', open ? 'bottom-1.5 -rotate-45' : '')} />
          </span>
        </button>
      </nav>

      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-[350ms] ease-[cubic-bezier(.22,1,.36,1)] md:hidden',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="nav-sheet flex flex-col gap-1 overflow-hidden px-[4vw] pb-5 pt-2">
          {nav.links.map((l) => (
            <a
              key={l.id}
              href={pageFor(l.id)}
              onClick={
                home
                  ? (e) => {
                      setOpen(false)
                      if (!sectionOnPage(l.id)) return // let it navigate
                      e.preventDefault()
                      scrollToId(l.id)
                    }
                  : () => setOpen(false)
              }
              className="rounded-inner px-2 py-3 text-left text-[1.05rem] font-600 text-ink"
            >
              {l.label}
            </a>
          ))}
          <Button variant="dark" magnetic={false} className="mt-2 w-full" onClick={() => { setOpen(false); openBooking() }}>
            {nav.cta}
          </Button>
        </div>
      </div>
    </header>
  )
}
