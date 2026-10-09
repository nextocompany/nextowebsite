import { easeInOutSine, lerp, smoothstep, window01 } from './math'
import type { BeatState } from './frame'

/** Where the network is drawn: centre in viewport px and px per unit. */
export interface StageRect {
  cx: number
  cy: number
  scale: number
}

/**
 * The scroll offset at which each stage sits on the viewport centre (document
 * space, so it doesn't change while scrolling). The hero can't scroll above 0
 * and the last stage can't pass the page end, so both are clamped.
 */
export function stageScrollTargets(
  viewportCenters: ReadonlyArray<number>,
  scrollY: number,
  viewportHeight: number,
  maxScroll: number,
): number[] {
  return viewportCenters.map((c) => Math.min(Math.max(c + scrollY - viewportHeight / 2, 0), maxScroll))
}

/** Time constant of the scroll follow: higher = more glide behind the wheel. */
const FOLLOW_MS = 320

/** Frame-rate independent glide of the shown position towards the scroll target. */
export function followStep(current: number, target: number, dtMs: number): number {
  return current + (target - current) * (1 - Math.exp(-dtMs / FOLLOW_MS))
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

/**
 * Every beat as a function of scroll position along the stages
 * (0 hero, 1 intro, 2 approach, 3 products, 4 beyond).
 */
export function beatsAt(u: number): BeatState {
  return {
    form: smoothstep(0.1, 0.9, u),
    split: window01(u, 1.3, 1.85, 2.15, 2.7),
    cluster: smoothstep(2.4, 3, u),
    reach: smoothstep(3.3, 4, u),
  }
}

/** The network eases from one stage to the next, lingering on each. */
export function anchorAt(rects: ReadonlyArray<StageRect>, u: number): StageRect {
  const last = rects.length - 1
  const clamped = Math.min(Math.max(u, 0), last)
  const k = Math.min(Math.floor(clamped), Math.max(last - 1, 0))
  if (last <= 0) return rects[0]
  const t = easeInOutSine(clamped - k)
  const a = rects[k]
  const b = rects[k + 1]
  return { cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), scale: lerp(a.scale, b.scale, t) }
}
