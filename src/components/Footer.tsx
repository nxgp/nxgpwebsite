import { footer } from '../data/content'
import { Logo } from './ui/Logo'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/50">
      <div className="shell py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 text-[0.78rem] font-700 uppercase tracking-[0.14em] text-ink-faint">
              Nx Growth Partners
            </p>
            <p className="mt-4 max-w-[32ch] text-[0.95rem] leading-relaxed text-ink-soft">
              {footer.blurb}
            </p>
            <p className="mt-4 max-w-[26ch] text-[1.05rem] font-700 leading-snug tracking-[-0.01em]">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[0.78rem] font-700 uppercase tracking-[0.08em] text-ink-faint">
                {col.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="link-underline text-[0.92rem] font-600 text-ink-soft transition-colors hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-[0.86rem] font-600 text-ink-faint sm:flex-row sm:items-center">
          <span>{footer.copyright}</span>
          <span>Embedded. Senior. Accountable.</span>
        </div>
      </div>
    </footer>
  )
}
