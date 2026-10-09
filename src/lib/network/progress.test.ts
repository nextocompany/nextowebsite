import { describe, expect, it } from 'vitest'
import { anchorAt, beatsAt, scrollPosition, type StageRect } from './progress'

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
  it('holds the formed brain at the hero', () => {
    expect(beatsAt(0)).toEqual({ split: 0, cluster: 0, reach: 0 })
  })

  it('splits at the approach stage and rejoins before products', () => {
    expect(beatsAt(1).split).toBe(1)
    expect(beatsAt(1.75).split).toBe(0)
  })

  it('is clustered at products and reaching at the last stage', () => {
    expect(beatsAt(2).cluster).toBe(1)
    expect(beatsAt(3)).toEqual({ split: 0, cluster: 1, reach: 1 })
  })

  it('never jumps', () => {
    for (let u = 0; u < 3; u += 0.01) {
      const a = beatsAt(u)
      const b = beatsAt(u + 0.001)
      for (const key of ['split', 'cluster', 'reach'] as const) {
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
