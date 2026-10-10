import { describe, expect, it } from 'vitest'
import { STAGE_EXTENT } from './stages'
import { howWeWorkExtent } from './zoom'

const beats = (connect: number, grow: number) => ({ form: 1, split: 0, start: 1, connect, grow, cluster: 0, reach: 0 })

describe('howWeWorkExtent', () => {
  it('starts close on the network, where the work happens', () => {
    for (const variant of ['wide', 'narrow'] as const) {
      expect(howWeWorkExtent(variant, beats(0, 0)).x).toBeLessThan(STAGE_EXTENT['how-we-work'][variant].x * 0.6)
    }
  })

  it('ends on the full stage once the network has connected and grown (the still frame)', () => {
    for (const variant of ['wide', 'narrow'] as const) {
      expect(howWeWorkExtent(variant, beats(1, 1))).toEqual(STAGE_EXTENT['how-we-work'][variant])
    }
  })

  it('only ever pulls back, never jumps', () => {
    let last = 0
    for (let t = 0; t <= 1.0001; t += 0.01) {
      const x = howWeWorkExtent('wide', beats(Math.min(1, t * 2), Math.max(0, t * 2 - 1))).x
      expect(x).toBeGreaterThanOrEqual(last)
      if (last > 0) expect(x - last).toBeLessThan(0.05)
      last = x
    }
  })
})
