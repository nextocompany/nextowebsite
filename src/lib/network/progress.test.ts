import { describe, expect, it } from 'vitest'
import { anchorAt, beatsAt, followStep, scrollPosition, stageScrollTargets, type StageRect } from './progress'

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
  // Stages: 0 hero, 1 intro, 2 approach, 3 products, 4 beyond.
  it('is a scattered network at the hero', () => {
    expect(beatsAt(0)).toEqual({ form: 0, split: 0, cluster: 0, reach: 0 })
  })

  it('has formed the brain at the intro', () => {
    expect(beatsAt(1)).toEqual({ form: 1, split: 0, cluster: 0, reach: 0 })
  })

  it('splits at the approach stage and rejoins before products', () => {
    expect(beatsAt(2).split).toBe(1)
    expect(beatsAt(2.75).split).toBe(0)
  })

  it('is clustered at products and reaching at the last stage', () => {
    expect(beatsAt(3).cluster).toBe(1)
    expect(beatsAt(4)).toEqual({ form: 1, split: 0, cluster: 1, reach: 1 })
  })

  it('never jumps', () => {
    for (let u = 0; u < 4; u += 0.01) {
      const a = beatsAt(u)
      const b = beatsAt(u + 0.001)
      for (const key of ['form', 'split', 'cluster', 'reach'] as const) {
        expect(Math.abs(a[key] - b[key])).toBeLessThan(0.05)
      }
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

describe('followStep', () => {
  it('moves part of the way, more with a longer frame', () => {
    const short = followStep(0, 1, 16)
    const long = followStep(0, 1, 64)
    expect(short).toBeGreaterThan(0)
    expect(long).toBeGreaterThan(short)
    expect(long).toBeLessThan(1)
  })

  it('reaches the target eventually and never overshoots', () => {
    let v = 0
    for (let i = 0; i < 300; i++) v = followStep(v, 2, 16)
    expect(v).toBeCloseTo(2, 3)
    expect(v).toBeLessThanOrEqual(2)
  })
})
