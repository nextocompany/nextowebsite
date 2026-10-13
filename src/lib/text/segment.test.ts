import { describe, expect, it } from 'vitest'
import { segmentWords } from './segment'

const graphemes = (s: string) => [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(s)].map((g) => g.segment)

describe('segmentWords', () => {
  it('rebuilds the original text exactly', () => {
    const text = 'ข้อมูลที่กระจัดกระจาย รวมไว้ในที่เดียว'
    expect(segmentWords(text, 'th').join('')).toBe(text)
  })

  it('never splits a Thai grapheme (ที่, ไว้ stay whole)', () => {
    const text = 'ข้อมูลที่กระจัดกระจาย รวมไว้ในที่เดียว'
    const segments = segmentWords(text, 'th')
    for (const seg of segments) {
      expect(graphemes(seg).join('')).toBe(seg)
    }
    const joinedBoundaries = new Set<number>()
    let pos = 0
    for (const seg of segments) joinedBoundaries.add((pos += seg.length))
    let gpos = 0
    const graphemeBoundaries = new Set(graphemes(text).map((g) => (gpos += g.length)))
    for (const b of joinedBoundaries) expect(graphemeBoundaries.has(b)).toBe(true)
    expect(segments.some((s) => s.includes('ที่'))).toBe(true)
    expect(segments.some((s) => s.includes('ไว้'))).toBe(true)
  })

  it('keeps trailing spaces attached to the word before', () => {
    expect(segmentWords('Talk to us', 'en')).toEqual(['Talk ', 'to ', 'us'])
  })
})
