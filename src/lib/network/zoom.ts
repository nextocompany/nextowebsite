import type { BeatState } from './frame'
import type { Point } from './point'
import type { Variant } from './scene'
import { STAGE_EXTENT } from './stages'
import { lerp } from './math'

/** How close How we work starts: just the united network, before anything links in. */
const CLOSE: Point = { x: 1.15, y: 1.15 }

/**
 * How we work pulls back as its story widens: close on the network while the
 * work starts, out to the full stage as outer nodes connect and partners join.
 */
export function howWeWorkExtent(variant: Variant, beats: BeatState): Point {
  const full = STAGE_EXTENT['how-we-work'][variant]
  const out = 0.45 * beats.connect + 0.55 * beats.grow
  return { x: lerp(CLOSE.x, full.x, out), y: lerp(CLOSE.y, full.y, out) }
}
