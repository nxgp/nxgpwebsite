/**
 * "Sketch my agent" — the shared shape of a generated agent design.
 * Used by the edge endpoint (api/sketch.ts), the canvas UI, and the tests.
 */
export type SketchStep = {
  type: 'read' | 'reason' | 'act' | 'notify'
  label: string
  detail: string
}

export type Sketch = {
  /** Set (alone) when no workflow could be designed from the input. */
  rejected?: string
  name?: string
  summary?: string
  trigger?: { label: string; detail: string }
  steps?: SketchStep[]
  guardrail?: { condition: string; action: string }
  integrations?: string[]
  metrics?: string[]
  clarify?: string
  feasibility?: 'standard' | 'ambitious'
  feasibilityNote?: string
}

/**
 * Either a rejection, or a complete design — nothing in between ships.
 * Tolerant on soft bounds: JSON-schema min/max hints are advisory during
 * tool use, so a 6-step run or a single metric is accepted rather than
 * failing the visitor; hard structure (types, required fields) is not.
 */
export function validSketch(s: unknown): s is Sketch {
  if (!s || typeof s !== 'object') return false
  const k = s as Sketch
  if (typeof k.rejected === 'string' && k.rejected.length > 0) return true
  return (
    typeof k.name === 'string' &&
    typeof k.summary === 'string' &&
    !!k.trigger?.label &&
    !!k.trigger?.detail &&
    Array.isArray(k.steps) &&
    k.steps.length >= 2 &&
    k.steps.length <= 8 &&
    k.steps.every((st) => st?.label && st?.detail && ['read', 'reason', 'act', 'notify'].includes(st.type)) &&
    !!k.guardrail?.condition &&
    !!k.guardrail?.action &&
    Array.isArray(k.integrations) &&
    k.integrations.length >= 1 &&
    Array.isArray(k.metrics) &&
    k.metrics.length >= 1 &&
    typeof k.clarify === 'string' &&
    (k.feasibility === 'standard' || k.feasibility === 'ambitious')
  )
}
