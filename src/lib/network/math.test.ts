import { describe, expect, it } from 'vitest'
import { clamp01, easeInOutCubic, lerp, mulberry32, smoothstep, window01 } from './math'

describe('math', () => {
  it('clamp01 clamps', () => {
    expect(clamp01(-1)).toBe(0)
    expect(clamp01(0.4)).toBe(0.4)
    expect(clamp01(3)).toBe(1)
  })

  it('lerp interpolates', () => {
    expect(lerp(2, 4, 0.5)).toBe(3)
  })

  it('easeInOutCubic is fixed at the ends and symmetric', () => {
    expect(easeInOutCubic(0)).toBe(0)
    expect(easeInOutCubic(1)).toBe(1)
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5)
  })

  it('smoothstep maps an interval to 0..1', () => {
    expect(smoothstep(1, 2, 0.5)).toBe(0)
    expect(smoothstep(1, 2, 1.5)).toBeCloseTo(0.5)
    expect(smoothstep(1, 2, 9)).toBe(1)
  })

  it('window01 rises, holds and falls', () => {
    const w = (u: number) => window01(u, 0.5, 0.8, 1.2, 1.5)
    expect(w(0.4)).toBe(0)
    expect(w(1)).toBe(1)
    expect(w(1.6)).toBe(0)
    expect(w(0.65)).toBeCloseTo(0.5)
  })

  it('mulberry32 is deterministic per seed and stays in [0, 1)', () => {
    const a = mulberry32(7)
    const b = mulberry32(7)
    const seq = Array.from({ length: 50 }, () => a())
    expect(seq).toEqual(Array.from({ length: 50 }, () => b()))
    expect(seq.every((v) => v >= 0 && v < 1)).toBe(true)
    expect(mulberry32(8)()).not.toBe(seq[0])
  })
})
