import { describe, expect, it } from 'vitest'
import { frameAt } from './frame'
import { buildScene } from './scene'
import { SIGNAL, signalsAt } from './signals'

const scene = buildScene('wide')
const formed = frameAt({ form: 1, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, reach: 0 }, scene)
const split = frameAt({ form: 1, split: 1, start: 0, connect: 0, grow: 0, cluster: 0, reach: 0 }, scene)
const scattered = frameAt({ form: 0, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, reach: 0, time: 0 }, scene)

const times = Array.from({ length: 200 }, (_, i) => i * 0.137)

describe('signalsAt', () => {
  it('is deterministic for the same frame and time', () => {
    expect(signalsAt(formed, 12.3)).toEqual(signalsAt(formed, 12.3))
  })

  it('runs at most a few pulses at once', () => {
    for (const t of times) expect(signalsAt(formed, t).pulses.length).toBeLessThanOrEqual(SIGNAL.slots)
    expect(times.some((t) => signalsAt(formed, t).pulses.length >= 2)).toBe(true)
  })

  it('moves each pulse along a visible edge, between its two nodes', () => {
    for (const t of times) {
      for (const p of signalsAt(formed, t).pulses) {
        const edge = formed.edges[p.edge]
        expect(edge.alpha).toBeGreaterThanOrEqual(SIGNAL.minEdgeAlpha)
        const a = formed.nodes[edge.a]
        const b = formed.nodes[edge.b]
        const along = Math.hypot(p.x - a.x, p.y - a.y) + Math.hypot(p.x - b.x, p.y - b.y)
        expect(along).toBeCloseTo(Math.hypot(b.x - a.x, b.y - a.y), 6)
      }
    }
  })

  it('glides without jumps while the frame holds still', () => {
    for (let t = 3; t < 9; t += 0.01) {
      const now = signalsAt(formed, t).pulses
      const next = signalsAt(formed, t + 0.004).pulses
      for (const p of now) {
        const same = next.find((q) => q.slot === p.slot && q.edge === p.edge)
        if (same) expect(Math.hypot(same.x - p.x, same.y - p.y)).toBeLessThan(0.05)
      }
    }
  })

  it('carries data in teal and people in coral once the network splits', () => {
    for (const t of times) {
      for (const p of signalsAt(split, t).pulses) {
        const edge = split.edges[p.edge]
        const kinds = [split.nodes[edge.a].tone, split.nodes[edge.b].tone]
        if (kinds.every((k) => k === 'teal')) expect(p.tone).toBe('teal')
        if (kinds.every((k) => k === 'coral')) expect(p.tone).toBe('coral')
      }
    }
  })

  it('uses both brand colours over time', () => {
    const tones = new Set(times.flatMap((t) => signalsAt(formed, t).pulses.map((p) => p.tone)))
    expect(tones).toEqual(new Set(['teal', 'coral']))
  })

  it('only glows nodes in the scattered hero: nothing travels before the network connects', () => {
    for (const t of times) expect(signalsAt(scattered, t).pulses).toEqual([])
    expect(times.some((t) => signalsAt(scattered, t).glows.length > 0)).toBe(true)
  })

  it('lights a node softly, between 0 and 1, and fades it back', () => {
    for (const t of times) {
      for (const g of signalsAt(formed, t).glows) {
        expect(g.amount).toBeGreaterThan(0)
        expect(g.amount).toBeLessThanOrEqual(1)
        expect(formed.nodes[g.node].alpha).toBeGreaterThan(0)
      }
    }
  })
})
