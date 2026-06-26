import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/Button'
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
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={cn(
        'fixed inset-x-0 top-0 z-[100] transition-[background,box-shadow] duration-300',
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
          className="flex items-center gap-2.5 font-800 tracking-[-0.03em]"
        >
          <Mark />
          <span className="text-[1.02rem]">{nav.brand}</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {nav.links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="link-underline text-[0.93rem] font-600 text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="ghost" magnetic={false} className="px-4">
            {nav.portal}
          </Button>
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

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden md:hidden"
      >
        <div className="nav-frost flex flex-col gap-1 px-[4vw] pb-5 pt-2">
          {nav.links.map((l) => (
            <button key={l.id} onClick={() => { scrollToId(l.id); setOpen(false) }} className="rounded-inner px-2 py-3 text-left text-[1.05rem] font-600 text-ink">
              {l.label}
            </button>
          ))}
          <Button variant="dark" magnetic={false} className="mt-2 w-full" onClick={() => { scrollToId('cta'); setOpen(false) }}>
            {nav.cta}
          </Button>
        </div>
      </motion.div>
    </motion.header>
  )
}

function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <rect width="26" height="26" rx="8" fill="#16181C" />
      <path d="M7 18.5V7.5h2.1l6 7.4V7.5h2.1v11h-2.1l-6-7.4v7.4H7Z" fill="#fff" />
      <circle cx="19" cy="9" r="2.2" fill="#0E9F6E" />
    </svg>
  )
}
