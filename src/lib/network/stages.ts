import type { Point } from './point'
import type { BeatState } from './frame'
import type { Variant } from './scene'

export type StageName = 'hero' | 'intro' | 'approach' | 'how-we-work' | 'products' | 'beyond' | 'closing'

/** Scroll order of the stages; the canvas travels between them. */
export const STAGE_ORDER: ReadonlyArray<StageName> = [
  'hero',
  'intro',
  'approach',
  'how-we-work',
  'products',
  'beyond',
  'closing',
]

/** contain: the whole extent fits the box. cover: the box is filled and the extent cropped (full-bleed hero). */
export type StageFit = 'contain' | 'cover'

export const STAGE_FIT: Readonly<Record<StageName, StageFit>> = {
  hero: 'cover',
  intro: 'contain',
  approach: 'contain',
  'how-we-work': 'contain',
  products: 'contain',
  beyond: 'contain',
  closing: 'cover',
}

/** Half-width and half-height (in brain units) each stage must fit. */
export const STAGE_EXTENT: Readonly<Record<StageName, Readonly<Record<Variant, Point>>>> = {
  hero: { wide: { x: 3.2, y: 1.6 }, narrow: { x: 1.2, y: 2 } },
  intro: { wide: { x: 1.1, y: 1.1 }, narrow: { x: 1.1, y: 1.1 } },
  approach: { wide: { x: 1.5, y: 1.1 }, narrow: { x: 1.5, y: 1.1 } },
  // Wide enough for the partner groups at the rim (step 3).
  'how-we-work': { wide: { x: 2.3, y: 2.3 }, narrow: { x: 2.05, y: 2.05 } },
  products: { wide: { x: 3, y: 0.95 }, narrow: { x: 1.3, y: 1.2 } },
  beyond: { wide: { x: 3, y: 0.95 }, narrow: { x: 1.3, y: 1.2 } },
  // The footer is full screen, like the hero, and shows the same points.
  closing: { wide: { x: 3.2, y: 1.6 }, narrow: { x: 1.2, y: 2 } },
}

/** The still frame each stage shows without motion (no JS or reduced motion). Stills never draw the reach lines themselves. */
export const STAGE_STATE: Readonly<Record<StageName, BeatState>> = {
  hero: { form: 0, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0, close: 0 },
  intro: { form: 1, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0, close: 0 },
  approach: { form: 1, split: 1, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0, close: 0 },
  'how-we-work': { form: 1, split: 0, start: 1, connect: 1, grow: 1, cluster: 0, shape: 0, reach: 0, close: 0 },
  products: { form: 1, split: 0, start: 1, connect: 1, grow: 1, cluster: 1, shape: 1, reach: 0, close: 0 },
  beyond: { form: 1, split: 0, start: 1, connect: 1, grow: 1, cluster: 1, shape: 0, reach: 1, close: 0 },
  closing: { form: 1, split: 0, start: 1, connect: 1, grow: 1, cluster: 1, shape: 0, reach: 1, close: 1 },
}

/** px per brain unit for a stage box, matching SVG preserveAspectRatio meet (contain) or slice (cover). */
export function stageScale(width: number, height: number, extent: Point, fit: StageFit = 'contain'): number {
  const sx = width / (2 * extent.x)
  const sy = height / (2 * extent.y)
  return fit === 'cover' ? Math.max(sx, sy) : Math.min(sx, sy)
}

/** Line widths in brain units, shared by the SVG stills and the canvas. */
export const STROKE = { edge: 0.012, reach: 0.012 } as const
