import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { LogoLockup } from './ui/Logo'
import { nav } from '../data/content'
import { scrollToId } from '../lib/scrollToId'
import { cn } from '../lib/cn'

/**
 * Header, built to the Webflow build: transparent over the navy hero, then
 * a frosted light bar once the page scrolls 24px, with the links going dark
 * and the logo turning black. Inner pages open on light surfaces, so there
 * it starts in the light state. Below 992px the links move into a navy
 * drawer. The bar is a touch more opaque than Webflow's (94% vs 82%) so it
 * doesn't read mid-grey over the black work rail.
 */
export function Nav({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const drawer = useRef<HTMLElement>(null)
  // where focus goes on close: back to the menu button, unless a link
  // closed the drawer (then the page has scrolled or is navigating away)
  const restore = useRef(true)
  // the open drawer sits under the header, so the header goes back to its
  // dark state over it (otherwise the white close button vanishes)
  const light = (scrolled || !home) && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // drawer: focus moves in and Tab stays inside (drawer + its close button),
  // Esc closes, page scroll locks while open, desktop resize closes
  useEffect(() => {
    if (!open) return
    restore.current = true
    const raf = requestAnimationFrame(() => drawer.current?.querySelector<HTMLElement>('a, button')?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false)
      if (e.key !== 'Tab' || !drawer.current || !toggle.current) return
      const stops = [toggle.current, ...drawer.current.querySelectorAll<HTMLElement>('a, button')]
      const i = stops.indexOf(document.activeElement as HTMLElement)
      const next = e.shiftKey ? (i <= 0 ? stops.length - 1 : i - 1) : (i + 1) % stops.length
      e.preventDefault()
      stops[next].focus()
    }
    const onResize = () => window.innerWidth > 991 && setOpen(false)
    document.body.style.overflow = 'hidden'
    // lets the chat button step aside so it doesn't cover the drawer's CTA
    document.documentElement.setAttribute('data-menu-open', '')
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    const t = toggle.current
    return () => {
      cancelAnimationFrame(raf)
      if (restore.current) t?.focus()
      document.body.style.overflow = ''
      document.documentElement.removeAttribute('data-menu-open')
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  /**
   * On the home page a section link scrolls to its section; elsewhere it goes
   * to /#id. A page link (Blog) just navigates.
   */
  const linkProps = ({ id, href }: { id?: string; href?: string }, after?: () => void) => ({
    href: href ?? (home ? `#${id}` : `/#${id}`),
    onClick: (e: React.MouseEvent) => {
      after?.()
      if (href || !id || !home || !document.getElementById(id)) return
      e.preventDefault()
      scrollToId(id)
    },
  })

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] border-b',
          light ? 'border-navy/10' : 'border-transparent',
        )}
      >
        {/* frosted layer fades in rather than the header background snapping */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 bg-bg/[0.94] backdrop-blur-[16px] transition-opacity duration-[320ms] ease-[ease]',
            light ? 'opacity-100' : 'opacity-0',
          )}
        />
        <nav className="shell relative flex min-h-[78px] items-center gap-8 max-md:min-h-[68px]">
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
            className={cn(
              'text-bg transition-[filter] duration-[320ms] ease-[ease]',
              light && 'brightness-0',
            )}
          >
            <LogoLockup className="h-[27px] max-md:h-6" />
          </a>

          <div className="ml-auto hidden items-center gap-8 min-[992px]:flex">
            <div className="flex items-center">
              {nav.links.map((l) => (
                <a
                  key={l.label}
                  {...linkProps(l)}
                  className={cn(
                    'px-4 py-3 text-[14px] transition-colors duration-[320ms] ease-[ease]',
                    light ? 'text-ink hover:text-accent' : 'text-bg/[0.82] hover:text-bg',
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
            ref={toggle}
            className={cn(
              'relative z-[3] ml-auto flex size-[42px] flex-col items-center justify-center gap-[5px] border transition-colors duration-[320ms] ease-[ease] min-[992px]:hidden',
              open
                ? 'border-bg/[0.28] bg-bg/20 text-bg'
                : light
                  ? 'border-navy/20 bg-navy/[0.06] text-navy'
                  : 'border-bg/[0.28] bg-bg/10 text-bg',
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="block h-0.5 w-[17px] bg-current" />
            <span aria-hidden className="block h-0.5 w-[17px] bg-current" />
            <span aria-hidden className="block h-0.5 w-[17px] bg-current" />
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
        ref={drawer}
        id="mobile-menu"
        aria-label="Menu"
        className={cn(
          'fixed inset-y-0 right-0 z-[99] flex w-[360px] max-w-[88vw] flex-col overflow-y-auto border-l border-bg/[0.09] bg-navy px-6 pb-8 pt-[104px] transition-[transform,visibility] duration-[320ms] ease-[ease] min-[992px]:hidden',
          open ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
      >
        {nav.drawer.map((l) => (
          <a
            key={l.label}
            {...linkProps(l, () => {
              restore.current = false
              setOpen(false)
            })}
            className="border-b border-bg/[0.09] py-4 font-heading text-[length:var(--fs-h6)] leading-[1.65] tracking-[-0.03em] text-bg"
          >
            {l.label}
          </a>
        ))}
        <Button
          className="mt-12 w-full py-4"
          href="/discuss-a-project"
          onClick={() => {
            restore.current = false
            setOpen(false)
          }}
        >
          {nav.cta}
        </Button>
      </nav>
    </>
  )
}
