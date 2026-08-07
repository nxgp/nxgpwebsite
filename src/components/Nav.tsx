import { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { Logo } from './ui/Logo'
import { nav } from '../data/content'
import { scrollToId } from '../lib/useSmoothScroll'
import { cn } from '../lib/cn'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('top')
          }}
          aria-label="Nx Growth Partners — home"
        >
          <Logo />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(l.id)
              }}
              className="link-underline text-[0.93rem] font-600 text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="dark" onClick={() => scrollToId('cta')}>
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
              href={`#${l.id}`}
              onClick={(e) => { e.preventDefault(); scrollToId(l.id); setOpen(false) }}
              className="rounded-inner px-2 py-3 text-left text-[1.05rem] font-600 text-ink"
            >
              {l.label}
            </a>
          ))}
          <Button variant="dark" magnetic={false} className="mt-2 w-full" onClick={() => { scrollToId('cta'); setOpen(false) }}>
            {nav.cta}
          </Button>
        </div>
      </div>
    </header>
  )
}
