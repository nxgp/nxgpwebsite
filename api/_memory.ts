/**
 * Assistant learning layer — reads curated knowledge the team has approved.
 *
 * PRIVACY CONTRACT: raw conversations are never returned here and never enter
 * a live prompt. Feeding transcripts back would let one visitor's session
 * surface another visitor's company, contact details or project specifics.
 * Only `assistant_memory` rows — anonymized patterns a human approved — are
 * loaded, and they are stripped of anything resembling contact details as a
 * second line of defence.
 */

const MAX_ENTRIES = 40
const MAX_CHARS = 6000

export type MemoryEntry = {
  kind: string
  prompt: string
  response: string
}

/** Defence in depth: never let an email/phone reach the prompt, even if a
 *  reviewer approved a row containing one by mistake. */
function scrub(s: string): string {
  return s
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[contact removed]')
    .replace(/\+?\d[\d\s().-]{8,}\d/g, '[number removed]')
    .slice(0, 600)
}

export async function loadMemory(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<MemoryEntry[]> {
  if (!supabaseUrl || !supabaseKey) return []
  try {
    const r = await fetch(
      `${supabaseUrl}/rest/v1/assistant_memory` +
        `?select=kind,prompt,response&active=eq.true` +
        `&order=priority.desc,created_at.desc&limit=${MAX_ENTRIES}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    )
    if (!r.ok) return []
    const rows = (await r.json()) as MemoryEntry[]
    return Array.isArray(rows) ? rows : []
  } catch {
    return [] // learning is an enhancement — never break chat over it
  }
}

/** Render approved memory as a prompt block, or '' when there's nothing. */
export function renderMemory(entries: MemoryEntry[]): string {
  if (entries.length === 0) return ''
  let out =
    '\n\n# Learned from real conversations\n' +
    'Patterns the team has reviewed and approved from previous visitors. ' +
    'Use them to answer more precisely. They are anonymized aggregates — ' +
    'never imply you know anything about the current visitor from them, and ' +
    'never mention other clients or visitors.\n'
  for (const e of entries) {
    const line = `- (${e.kind}) When asked: "${scrub(e.prompt)}" → ${scrub(e.response)}\n`
    if (out.length + line.length > MAX_CHARS) break
    out += line
  }
  return out
}
