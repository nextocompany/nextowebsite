import { describe, expect, it } from 'vitest'
import { polylineAt } from './path'

describe('polylineAt', () => {
  const path = [
    { x: 0, y: 0 },
    { x: 0, y: 10 },
    { x: 10, y: 10 },
  ]

  it('returns only the start at 0', () => {
    expect(polylineAt(path, 0)).toEqual([{ x: 0, y: 0 }])
  })

  it('cuts the path by length', () => {
    expect(polylineAt(path, 0.75)).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 10 },
      { x: 5, y: 10 },
    ])
  })

  it('returns the whole path at 1', () => {
    expect(polylineAt(path, 1)).toEqual(path)
  })
})
