import { Fragment } from 'react'

/**
 * Minimal, safe markdown for chat replies — bold, "- " bullet lists,
 * paragraph breaks, and bare URLs. No HTML parsing and no
 * dangerouslySetInnerHTML: everything renders as React text nodes, so model
 * output can never inject markup. Matches the small subset the system
 * prompt asks the model to use (api/_knowledge.ts).
 *
 * Streaming-safe: an unclosed "**" is left as literal text until the
 * closing "**" arrives on a later chunk, so partial output never renders
 * garbled — it just completes a beat later.
 */

/** Bold + bare URLs within a single inline run of text. */
function Inline({ text }: { text: string }) {
  const segments = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g).filter(Boolean)
  return (
    <>
      {segments.map((seg, i) => {
        if (/^\*\*[^*]+\*\*$/.test(seg)) {
          return <strong key={i} className="font-800">{seg.slice(2, -2)}</strong>
        }
        if (/^https?:\/\//.test(seg)) {
          return (
            <a
              key={i}
              href={seg}
              target="_blank"
              rel="noopener noreferrer"
              className="font-600 text-accent underline underline-offset-2"
            >
              {seg.replace(/^https?:\/\//, '')}
            </a>
          )
        }
        return <Fragment key={i}>{seg}</Fragment>
      })}
    </>
  )
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim().length > 0)
        const isList = lines.length > 0 && lines.every((l) => /^[-•]\s+/.test(l.trim()))

        if (isList) {
          return (
            <ul key={bi} className={cnBlock(bi)}>
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2">
                  <span className="text-accent" aria-hidden>
                    •
                  </span>
                  <span>
                    <Inline text={l.trim().replace(/^[-•]\s+/, '')} />
                  </span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={bi} className={cnBlock(bi)}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                <Inline text={l} />
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}

function cnBlock(i: number) {
  return i > 0 ? 'mt-2.5' : undefined
}
