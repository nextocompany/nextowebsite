import { easeInOutCubic, lerp, smoothstep, window01 } from './math'
import type { BeatState } from './frame'

/** Where the network is drawn: centre in viewport px and px per unit. */
export interface StageRect {
  cx: number
  cy: number
  scale: number
}

/**
 * Position along the stages: k when stage k's centre sits on the viewport
 * centre, fractional while moving between stages.
 */
export function scrollPosition(centers: ReadonlyArray<number>, viewportCenter: number): number {
  if (centers.length === 0 || viewportCenter <= centers[0]) return 0
  for (let k = 0; k < centers.length - 1; k++) {
    if (viewportCenter < centers[k + 1]) {
      return k + (viewportCenter - centers[k]) / (centers[k + 1] - centers[k])
    }
  }
  return centers.length - 1
}

/** Beats 2–4 as a function of scroll position (beat 1 plays on load). */
export function beatsAt(u: number): Omit<BeatState, 'form'> {
  return {
    split: window01(u, 0.45, 0.85, 1.15, 1.6),
    cluster: smoothstep(1.55, 1.95, u),
    reach: smoothstep(2.5, 2.95, u),
  }
}

/** The network eases from one stage to the next, lingering on each. */
export function anchorAt(rects: ReadonlyArray<StageRect>, u: number): StageRect {
  const last = rects.length - 1
  const clamped = Math.min(Math.max(u, 0), last)
  const k = Math.min(Math.floor(clamped), Math.max(last - 1, 0))
  if (last <= 0) return rects[0]
  const t = easeInOutCubic(clamped - k)
  const a = rects[k]
  const b = rects[k + 1]
  return { cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), scale: lerp(a.scale, b.scale, t) }
}
