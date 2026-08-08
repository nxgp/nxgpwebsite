import { VIGNETTES } from './vignettes'

/** Default-export wrapper so the vignette set can be code-split away from
 *  the section shell (see Portfolio.tsx). */
export default function VignetteStage({ id }: { id: string }) {
  const Viz = VIGNETTES[id]
  return Viz ? <Viz /> : null
}
