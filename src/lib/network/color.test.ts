import { describe, expect, it } from 'vitest'
import { mixHex, parseHex } from './color'

describe('color', () => {
  it('parses 6- and 3-digit hex', () => {
    expect(parseHex('#00b0b6')).toEqual([0, 176, 182])
    expect(parseHex(' #fff ')).toEqual([255, 255, 255])
  })

  it('falls back to null for anything else', () => {
    expect(parseHex('rgb(0 0 0)')).toBeNull()
  })

  it('mixes from a to b', () => {
    expect(mixHex([0, 0, 0], [255, 255, 255], 0)).toBe('rgb(0 0 0)')
    expect(mixHex([0, 0, 0], [200, 100, 50], 0.5)).toBe('rgb(100 50 25)')
  })
})
