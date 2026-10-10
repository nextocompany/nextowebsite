import { describe, expect, it } from 'vitest'
import { logoHeightRem } from './logos'

describe('logoHeightRem', () => {
  it('shows a square mark at the full row height', () => {
    expect(logoHeightRem(160, 160)).toBeCloseTo(2.75)
  })

  it('gives every logo about the same area, so wide wordmarks are shorter', () => {
    const area = (w: number, h: number) => {
      const height = logoHeightRem(w, h)
      return height * height * (w / h)
    }
    expect(area(377, 160)).toBeCloseTo(area(160, 160))
    expect(logoHeightRem(377, 160)).toBeLessThan(logoHeightRem(232, 160))
  })

  it('never lets a very wide logo get too short to read', () => {
    expect(logoHeightRem(1600, 100)).toBe(1.5)
  })
})
