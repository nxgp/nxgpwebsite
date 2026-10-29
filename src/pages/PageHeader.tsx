
export type Crumb = { label: string; href: string }

/**
 * Standalone-page header: breadcrumb trail + the page's single h1.
 * Section components below keep their h2s, so the outline stays clean.
 */
export function PageHeader({
  crumbs,
  title,
  sub,
  eyebrow,
  children,
}: {
  /** omit to hide the visible trail (the BreadcrumbList JSON-LD still comes from the route) */
  crumbs?: Crumb[]
  title: string
  sub?: string
  /** small caps label above the h1 */
  eyebrow?: string
  /** anything after the sub, e.g. a button and a supporting line */
  children?: React.ReactNode
}) {
  return (
    <div className="shell pb-2 pt-[calc(var(--nav-h)+clamp(28px,5vw,56px))]">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="text-[0.82rem] font-600 text-ink-faint">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-ink-soft">
                    {c.label}
                  </span>
                ) : (
                  <a href={c.href} className="transition-colors hover:text-ink">
                    {c.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {eyebrow && <p className={crumbs ? 't-eyebrow mt-6' : 't-eyebrow'}>{eyebrow}</p>}
      <h1 className={eyebrow ? 't-h2 mt-3 max-w-[46rem]' : 't-h2 mt-4 max-w-[46rem]'}>{title}</h1>
      {sub && <p className="t-lead mt-5 max-w-[46rem]">{sub}</p>}
      {children}
    </div>
  )
}
