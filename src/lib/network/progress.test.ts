import { describe, expect, it } from 'vitest'
import { STAGE_ORDER, STAGE_STATE } from './stages'
import { anchorAt, beatsAt, scrollPosition, stageScrollTargets, type StageRect } from './progress'

describe('scrollPosition', () => {
  const centers = [400, 1400, 2600, 3600]

  it('is 0 before the first stage reaches the viewport centre', () => {
    expect(scrollPosition(centers, 100)).toBe(0)
  })

  it('is the stage index when that stage is centred', () => {
    expect(scrollPosition(centers, 1400)).toBe(1)
  })

  it('interpolates between stages', () => {
    expect(scrollPosition(centers, 2000)).toBeCloseTo(1.5)
  })

  it('stops at the last stage', () => {
    expect(scrollPosition(centers, 9000)).toBe(3)
  })
})

const BEAT_KEYS = ['form', 'split', 'start', 'connect', 'grow', 'cluster', 'shape', 'reach', 'close'] as const
const ZERO = { form: 0, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0, close: 0 }

describe('beatsAt', () => {
  // Stages: 0 hero, 1 intro, 2 approach, 3 how we work, 4 products, 5 beyond.
  it('is a scattered network at the hero', () => {
    expect(beatsAt(0)).toEqual(ZERO)
  })

  it('has formed the network at the intro', () => {
    expect(beatsAt(1)).toEqual({ ...ZERO, form: 1 })
  })

  it('splits at the approach stage and rejoins before how we work', () => {
    expect(beatsAt(2).split).toBe(1)
    expect(beatsAt(2.75).split).toBe(0)
  })

  it('has played all three how-we-work steps at how we work', () => {
    expect(beatsAt(3)).toEqual({ ...ZERO, form: 1, start: 1, connect: 1, grow: 1 })
  })

  it('shapes the products at products, then relaxes them and reaches at the last stage', () => {
    expect(beatsAt(4)).toMatchObject({ cluster: 1, shape: 1, reach: 0 })
    expect(beatsAt(5)).toEqual({ form: 1, split: 0, start: 1, connect: 1, grow: 1, cluster: 1, shape: 0, reach: 1, close: 0 })
  })

  it('closes at the footer: the whole network linked', () => {
    expect(beatsAt(6)).toEqual({ form: 1, split: 0, start: 1, connect: 1, grow: 1, cluster: 1, shape: 0, reach: 1, close: 1 })
  })

  it('matches every stage still frame at the stage position', () => {
    STAGE_ORDER.forEach((name, i) => {
      expect(beatsAt(i)).toEqual(STAGE_STATE[name])
    })
  })

  it('never jumps', () => {
    for (let u = 0; u < 6; u += 0.01) {
      const a = beatsAt(u)
      const b = beatsAt(u + 0.001)
      for (const key of BEAT_KEYS) expect(Math.abs(a[key] - b[key])).toBeLessThan(0.05)
    }
  })
})

describe('beatsAt with the approach pin', () => {
  // When Approach is pinned, its pin progress (0 → 1) drives the split instead of the page position.
  it('stays whole on the way in, before the pin starts', () => {
    expect(beatsAt(1.6, { approach: 0 }).split).toBe(0)
    expect(beatsAt(1.99, { approach: 0 }).split).toBe(0)
  })

  it('splits fully in the middle of the pin, wherever the page position sits', () => {
    expect(beatsAt(2, { approach: 0.55 }).split).toBe(1)
    expect(beatsAt(1.98, { approach: 0.55 }).split).toBe(1)
  })

  it('rejoins before the pin releases, so the way out to how we work is whole', () => {
    expect(beatsAt(2, { approach: 1 }).split).toBe(0)
    expect(beatsAt(2.3, { approach: 1 }).split).toBe(0)
  })

  it('leaves the other beats to the page position', () => {
    expect({ ...beatsAt(4, { approach: 1 }), split: 0 }).toEqual({ ...beatsAt(4), split: 0 })
  })

  it('never jumps across the pin', () => {
    for (let p = 0; p < 1; p += 0.01) {
      expect(Math.abs(beatsAt(2, { approach: p }).split - beatsAt(2, { approach: p + 0.001 }).split)).toBeLessThan(0.05)
    }
  })
})

describe('beatsAt with the how-we-work steps', () => {
  // Pinned (or, on stacked screens, the stage's own pass): progress 0 → 1 plays three steps in order.
  const at = (h: number) => beatsAt(3, { approach: 1, howWeWork: h })

  it('has not started on the way in: the network is whole and unlinked', () => {
    for (const u of [2.3, 2.7, 2.99]) {
      const b = beatsAt(u, { approach: 1, howWeWork: 0 })
      expect({ start: b.start, connect: b.connect, grow: b.grow }).toEqual({ start: 0, connect: 0, grow: 0 })
    }
  })

  it('plays start, then connect, then grow, one third each', () => {
    expect(at(1 / 6).start).toBeGreaterThan(0.3)
    expect(at(1 / 6).connect).toBe(0)
    expect(at(0.34).start).toBe(1)
    expect(at(0.5).connect).toBeGreaterThan(0.3)
    expect(at(0.5).grow).toBe(0)
    expect(at(0.67).connect).toBe(1)
    expect(at(5 / 6).grow).toBeGreaterThan(0.3)
    expect(at(1)).toMatchObject({ start: 1, connect: 1, grow: 1 })
  })

  it('hands over to products without a jump: after the pin everything has played', () => {
    const released = beatsAt(3.2, { approach: 1, howWeWork: 1 })
    const free = beatsAt(3.2)
    expect(released).toEqual(free)
  })

  it('never jumps across the steps', () => {
    for (let h = 0; h < 1; h += 0.005) {
      const a = at(h)
      const b = at(h + 0.001)
      for (const key of BEAT_KEYS) expect(Math.abs(a[key] - b[key])).toBeLessThan(0.05)
    }
  })
})

describe('anchorAt', () => {
  const rects: StageRect[] = [
    { cx: 100, cy: 100, scale: 50 },
    { cx: 300, cy: 500, scale: 150 },
  ]

  it('sits on a stage at whole positions', () => {
    expect(anchorAt(rects, 0)).toEqual(rects[0])
    expect(anchorAt(rects, 1)).toEqual(rects[1])
  })

  it('moves between stages', () => {
    const mid = anchorAt(rects, 0.5)
    expect(mid.cx).toBeCloseTo(200)
    expect(mid.scale).toBeCloseTo(100)
  })
})

describe('stageScrollTargets', () => {
  it('is the scroll offset that centres each stage, never below 0', () => {
    // viewport 1000 tall, at scrollY 0: hero centre at 400 (already above centre), next at 1600
    expect(stageScrollTargets([400, 1600], 0, 1000, 5000)).toEqual([0, 1100])
  })

  it('caps a stage the page cannot scroll far enough to centre', () => {
    expect(stageScrollTargets([400, 1600, 3000], 0, 1000, 2000)).toEqual([0, 1100, 2000])
  })

  it('does not depend on the current scroll', () => {
    expect(stageScrollTargets([-600, 600], 1000, 1000, 5000)).toEqual([0, 1100])
  })

  it('puts the page top at position 0 even when the hero sits above centre', () => {
    const targets = stageScrollTargets([400, 1600], 0, 1000, 5000)
    expect(scrollPosition(targets, 0)).toBe(0)
  })
})
