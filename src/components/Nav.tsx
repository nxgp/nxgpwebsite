import { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { LogoLockup } from './ui/Logo'
import { nav } from '../data/content'
import { scrollToId } from '../lib/scrollToId'
import { cn } from '../lib/cn'

/**
 * v2 header (Figma 212:600, behaviour from the Webflow build):
 * transparent over the navy hero, then a frosted light bar once the page
 * scrolls 24px. Inner pages open on light surfaces, so there it starts in
 * the light state. Below 992px the links move into a navy drawer.
 */
export function Nav({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const light = scrolled || !home

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // drawer: Esc closes, page scroll locks while open, desktop resize closes
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 991 && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  /** On the home page a link scrolls to its section; elsewhere it goes to /#id. */
  const linkProps = (id: string, after?: () => void) => ({
    href: home ? `#${id}` : `/#${id}`,
    onClick: (e: React.MouseEvent) => {
      after?.()
      if (!home || !document.getElementById(id)) return
      e.preventDefault()
      scrollToId(id)
    },
  })

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] border-b',
          light ? 'border-navy/10' : 'border-hairline/55',
        )}
      >
        {/* frosted layer fades in rather than the header background snapping */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 bg-bg/[0.82] backdrop-blur-[16px] transition-opacity duration-[320ms] ease-[ease]',
            light ? 'opacity-100' : 'opacity-0',
          )}
        />
        <nav className="shell relative flex h-[var(--nav-h)] items-center justify-between gap-6">
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
            className={cn('transition-colors duration-[320ms] ease-[ease]', light ? 'text-navy' : 'text-bg')}
          >
            <LogoLockup />
          </a>

          <div className="hidden items-center gap-8 min-[992px]:flex">
            <div className="flex items-center">
              {nav.links.map((l) => (
                <a
                  key={l.id}
                  {...linkProps(l.id)}
                  className={cn(
                    'px-6 py-3 text-[15px] transition-colors duration-[320ms] ease-[ease]',
                    light ? 'text-[#1a1a17] hover:text-accent' : 'text-bg',
                  )}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <Button size="sm" href="/discuss-a-project">
              {nav.cta}
            </Button>
          </div>

          <button
            className={cn(
              'relative z-[3] flex size-10 items-center justify-center border transition-colors duration-[320ms] ease-[ease] min-[992px]:hidden',
              open
                ? 'border-bg/30 bg-bg/20 text-bg'
                : light
                  ? 'border-navy/20 bg-navy/[0.06] text-navy'
                  : 'border-bg/30 text-bg',
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span className={cn('absolute left-0 h-[1.5px] w-full bg-current transition-all', open ? 'top-1.5 rotate-45' : 'top-0')} />
              <span className={cn('absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-all', open ? 'bottom-1.5 -rotate-45' : '')} />
            </span>
          </button>
        </nav>

      </header>

      {/* drawer + backdrop live outside <header>: its entrance animation
          animates transform, which would make it the containing block for
          these fixed layers and clip them to the header strip */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-[98] bg-navy/60 transition-[opacity,visibility] duration-[320ms] ease-[ease] min-[992px]:hidden',
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
        )}
      />
      <nav
        id="mobile-menu"
        aria-label="Menu"
        className={cn(
          'fixed inset-y-0 right-0 z-[99] flex w-[360px] max-w-[88vw] flex-col gap-1 border-l border-bg/16 bg-navy px-6 pb-8 pt-[104px] transition-[transform,visibility] duration-[320ms] ease-[ease] min-[992px]:hidden',
          open ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
      >
        {[...nav.links, { label: 'FAQ', id: 'faq' }].map((l) => (
          <a
            key={l.id}
            {...linkProps(l.id, () => setOpen(false))}
            className="border-b border-bg/10 py-4 font-heading text-[1.5rem] text-bg hover:text-peri"
          >
            {l.label}
          </a>
        ))}
        <Button className="mt-6 w-full" href="/discuss-a-project" onClick={() => setOpen(false)}>
          {nav.cta}
        </Button>
      </nav>
    </>
  )
}
