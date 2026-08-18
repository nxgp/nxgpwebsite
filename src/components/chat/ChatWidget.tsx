import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '../../lib/cn'

// The panel (and its logic) only loads when the chat actually opens, so
// visitors who never engage pay no extra bundle cost.
const ChatPanel = lazy(() => import('./ChatPanel'))

/** Greet once per browser session, and never again after a visitor closes it. */
const GREETED_KEY = 'nx-chat-greeted'
const AUTO_OPEN_DELAY = 2500

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  // opened by us rather than by the visitor: don't steal focus
  const auto = useRef(false)

  useEffect(() => {
    // Desktop only. The panel covers most of a phone screen, so opening it
    // unprompted there would bury the page the visitor came to read.
    if (window.matchMedia('(max-width: 767px)').matches) return
    // Navigation is full page loads, so without this the chat would reopen on
    // every single page. Once per session, and closing it ends the session.
    try {
      if (sessionStorage.getItem(GREETED_KEY)) return
    } catch {
      return // storage blocked: stay quiet rather than nag on every page
    }

    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(GREETED_KEY, '1')
      } catch {
        /* best effort */
      }
      auto.current = true
      setLoaded(true)
      setOpen(true)
    }, AUTO_OPEN_DELAY)
    return () => clearTimeout(t)
  }, [])

  function close() {
    setOpen(false)
    auto.current = false
    try {
      sessionStorage.setItem(GREETED_KEY, '1')
    } catch {
      /* best effort */
    }
  }

  return (
    <>
      {(open || loaded) && (
        <Suspense fallback={null}>
          <div className={open ? '' : 'hidden'}>
            <ChatPanel onClose={close} autoFocus={!auto.current} />
          </div>
        </Suspense>
      )}

      <button
        onClick={() => {
          if (open) {
            close()
          } else {
            auto.current = false
            setLoaded(true)
            setOpen(true)
          }
        }}
        aria-label={open ? 'Close chat' : 'Chat with the Nx Assistant'}
        aria-expanded={open}
        className={cn(
          'fixed bottom-5 right-5 z-[220] flex size-14 items-center justify-center rounded-full',
          'bg-accent text-white shadow-lg transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)]',
          'hover:scale-105 active:scale-95',
        )}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  )
}
