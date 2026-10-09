import { describe, expect, it } from 'vitest'
import { NAV_SECTIONS, SECTION_IDS, activeSectionId } from './sections'

describe('section ids', () => {
  it('every nav anchor points at a real section', () => {
    const ids = Object.values(SECTION_IDS)
    for (const { id } of NAV_SECTIONS) expect(ids).toContain(id)
  })

  it('ids are unique', () => {
    const ids = Object.values(SECTION_IDS)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('activeSectionId', () => {
  const tops = [
    { id: 'hero', top: -900 },
    { id: 'approach', top: -40 },
    { id: 'products', top: 600 },
  ]

  it('picks the last section whose top has passed the offset', () => {
    expect(activeSectionId(tops, 80)).toBe('approach')
  })

  it('returns null at the very top of the page', () => {
    expect(activeSectionId([{ id: 'hero', top: 0 }, { id: 'approach', top: 900 }], 80)).toBe(null)
  })

  it('returns null for no sections', () => {
    expect(activeSectionId([], 80)).toBe(null)
  })
})
