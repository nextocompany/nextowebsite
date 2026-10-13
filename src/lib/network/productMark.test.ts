import { describe, expect, it } from 'vitest'
import { productMark } from './productMark'

describe('productMark', () => {
  it('draws Endyra as a ring with spokes into its lens', () => {
    const mark = productMark('endyra')
    expect(mark.lens).toBeGreaterThanOrEqual(0)
    expect(mark.edges.some((e) => e.kind === 'ring')).toBe(true)
    expect(mark.edges.filter((e) => e.kind === 'spoke').every((e) => e.b === mark.lens)).toBe(true)
  })

  it('draws Anvira as one trace through every node, wider than tall', () => {
    const mark = productMark('anvira')
    expect(mark.lens).toBe(-1)
    expect(mark.edges.every((e) => e.kind === 'trace')).toBe(true)
    expect(mark.edges).toHaveLength(mark.points.length - 1)
    expect(mark.width).toBeGreaterThan(mark.height)
  })

  it('keeps every node inside its box', () => {
    for (const product of ['endyra', 'anvira'] as const) {
      const mark = productMark(product)
      for (const p of mark.points) {
        expect(p.x).toBeGreaterThan(0)
        expect(p.y).toBeGreaterThan(0)
        expect(p.x).toBeLessThan(mark.width)
        expect(p.y).toBeLessThan(mark.height)
      }
    }
  })
})
