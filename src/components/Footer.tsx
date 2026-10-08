import { footer } from '../data/content'
import { LogoLockup } from './ui/Logo'

/** v2 footer (Figma 212:528): navy, brand column + four link columns. */
export function Footer() {
  return (
    <footer className="bg-navy pb-8 pt-16 text-bg">
      <div className="shell">
        {/* two columns on phones — four stacked link lists made the footer
            an endless scroll */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[302px_repeat(4,1fr)] md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <a href="/" aria-label="Nx Growth Partners home" className="inline-block text-bg">
              <LogoLockup />
            </a>
            <p className="mt-6 text-[15px] leading-[1.65] text-mist">{footer.blurb}</p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.heading}>
              <p className="pb-4 text-[12px] uppercase tracking-[0.14em] text-mist">{col.heading}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="text-[15px] leading-[1.5] text-bg hover:text-peri"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-bg/16 pt-6 text-[13px] text-mist sm:flex-row sm:items-center">
          <span>{footer.copyright}</span>
          <a href="/privacy" className="hover:text-peri">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
