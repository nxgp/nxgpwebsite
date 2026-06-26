import { footer } from '../data/content'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/50">
      <div className="shell py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5 font-800 tracking-[-0.03em]">
              <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden>
                <rect width="26" height="26" rx="8" fill="#16181C" />
                <path d="M7 18.5V7.5h2.1l6 7.4V7.5h2.1v11h-2.1l-6-7.4v7.4H7Z" fill="#fff" />
                <circle cx="19" cy="9" r="2.2" fill="#0E9F6E" />
              </svg>
              NX Growth Partners
            </div>
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
          <span>Built by the studio, on the studio.</span>
        </div>
      </div>
    </footer>
  )
}
