import type { Point } from './brain'
import type { BeatState } from './frame'
import type { Variant } from './scene'

export type StageName = 'hero' | 'approach' | 'products' | 'beyond'

/** Scroll order of the stages; the canvas travels between them. */
export const STAGE_ORDER: ReadonlyArray<StageName> = ['hero', 'approach', 'products', 'beyond']

/** Half-width and half-height (in brain units) each stage must fit. */
export const STAGE_EXTENT: Readonly<Record<StageName, Readonly<Record<Variant, Point>>>> = {
  hero: { wide: { x: 1.05, y: 1.05 }, narrow: { x: 1.05, y: 1.05 } },
  approach: { wide: { x: 1.3, y: 1.3 }, narrow: { x: 1.3, y: 1.3 } },
  products: { wide: { x: 3, y: 0.95 }, narrow: { x: 1.3, y: 1.2 } },
  beyond: { wide: { x: 3, y: 0.95 }, narrow: { x: 1.3, y: 1.2 } },
}

/** The still frame each stage shows without motion (no JS or reduced motion). */
export const STAGE_STATE: Readonly<Record<StageName, BeatState>> = {
  hero: { form: 1, split: 0, cluster: 0, reach: 0 },
  approach: { form: 1, split: 1, cluster: 0, reach: 0 },
  products: { form: 1, split: 0, cluster: 1, reach: 0 },
  beyond: { form: 1, split: 0, cluster: 1, reach: 0 },
}

/** px per brain unit for a stage box, matching SVG preserveAspectRatio="xMidYMid meet". */
export function stageScale(width: number, height: number, extent: Point): number {
  return Math.min(width / (2 * extent.x), height / (2 * extent.y))
}

/** Line widths in brain units, shared by the SVG stills and the canvas. */
export const STROKE = { edge: 0.024, reach: 0.02 } as const
