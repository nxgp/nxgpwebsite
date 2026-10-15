import { footer } from '../data/content'
import { LogoLockup } from './ui/Logo'

/**
 * Footer, built to the Webflow build: navy, brand column + four link
 * columns. Webflow keeps all five columns at every width; here they fold to
 * two on phones and four on tablets so the lists stay readable.
 */
export function Footer() {
  return (
    <footer className="bg-navy pb-8 pt-20 text-bg">
      <div className="shell">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="/" aria-label="Nx Growth Partners home" className="inline-block text-bg">
              <LogoLockup className="h-[27px]" />
            </a>
            <p className="mt-6 max-w-[30ch] text-[14px] text-mist">{footer.blurb}</p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-[12px] uppercase tracking-[0.14em] text-mist">{col.heading}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="text-[14px] text-bg/[0.86] hover:text-peri"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bg/[0.14] pt-6 text-[14px] text-mist">
          <span>{footer.copyright}</span>
          <a href="/privacy" className="hover:text-peri">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
