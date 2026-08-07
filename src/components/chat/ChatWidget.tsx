import { lazy, Suspense, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '../../lib/cn'

// The panel (and its logic) only loads when someone actually opens the chat —
// visitors who never click it pay zero extra bundle cost.
const ChatPanel = lazy(() => import('./ChatPanel'))

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {(open || loaded) && (
        <Suspense fallback={null}>
          <div className={open ? '' : 'hidden'}>
            <ChatPanel onClose={() => setOpen(false)} />
          </div>
        </Suspense>
      )}

      <button
        onClick={() => {
          setOpen((v) => !v)
          setLoaded(true)
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
