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

describe('beatsAt', () => {
  // Stages: 0 hero, 1 intro, 2 approach, 3 how we work, 4 products, 5 beyond.
  it('is a scattered network at the hero', () => {
    expect(beatsAt(0)).toEqual({ form: 0, split: 0, connect: 0, cluster: 0, reach: 0 })
  })

  it('has formed the brain at the intro', () => {
    expect(beatsAt(1)).toEqual({ form: 1, split: 0, connect: 0, cluster: 0, reach: 0 })
  })

  it('splits at the approach stage and rejoins before how we work', () => {
    expect(beatsAt(2).split).toBe(1)
    expect(beatsAt(2.75).split).toBe(0)
  })

  it('links outer nodes into the formed brain at how we work', () => {
    expect(beatsAt(3)).toEqual({ form: 1, split: 0, connect: 1, cluster: 0, reach: 0 })
  })

  it('is clustered at products and reaching at the last stage', () => {
    expect(beatsAt(4).cluster).toBe(1)
    expect(beatsAt(4).reach).toBe(0)
    expect(beatsAt(5)).toEqual({ form: 1, split: 0, connect: 1, cluster: 1, reach: 1 })
  })

  it('matches every stage still frame at the stage position (stills never draw reach lines)', () => {
    STAGE_ORDER.forEach((name, i) => {
      const { form, split, connect, cluster } = beatsAt(i)
      const still = STAGE_STATE[name]
      expect({ form, split, connect, cluster }).toEqual({
        form: still.form,
        split: still.split,
        connect: still.connect,
        cluster: still.cluster,
      })
    })
  })

  it('never jumps', () => {
    for (let u = 0; u < 5; u += 0.01) {
      const a = beatsAt(u)
      const b = beatsAt(u + 0.001)
      for (const key of ['form', 'split', 'connect', 'cluster', 'reach'] as const) {
        expect(Math.abs(a[key] - b[key])).toBeLessThan(0.05)
      }
    }
  })
})

describe('beatsAt with the approach pin', () => {
  // When Approach is pinned, its pin progress (0 → 1) drives the split instead of the page position.
  it('stays whole on the way in, before the pin starts', () => {
    expect(beatsAt(1.6, 0).split).toBe(0)
    expect(beatsAt(1.99, 0).split).toBe(0)
  })

  it('splits fully in the middle of the pin, wherever the page position sits', () => {
    expect(beatsAt(2, 0.55).split).toBe(1)
    expect(beatsAt(1.98, 0.55).split).toBe(1)
  })

  it('rejoins before the pin releases, so the way out to how we work is whole', () => {
    expect(beatsAt(2, 1).split).toBe(0)
    expect(beatsAt(2.3, 1).split).toBe(0)
  })

  it('leaves the other beats to the page position', () => {
    expect({ ...beatsAt(3, 1), split: 0 }).toEqual({ ...beatsAt(3), split: 0 })
  })

  it('never jumps across the pin', () => {
    for (let p = 0; p < 1; p += 0.01) {
      expect(Math.abs(beatsAt(2, p).split - beatsAt(2, p + 0.001).split)).toBeLessThan(0.05)
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
