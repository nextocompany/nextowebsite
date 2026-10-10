import { describe, expect, it } from 'vitest'
import { frameAt } from './frame'
import { buildScene } from './scene'
import { SIGNAL, signalsAt } from './signals'

const scene = buildScene('wide')
const formed = frameAt({ form: 1, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0, close: 0 }, scene)
const split = frameAt({ form: 1, split: 1, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0, close: 0 }, scene)
const scattered = frameAt({ form: 0, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0, close: 0, time: 0 }, scene)

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

describe('signalsAt on the product shapes', () => {
  const shaped = frameAt({ form: 1, split: 0, start: 1, connect: 1, grow: 1, cluster: 1, shape: 1, reach: 0, close: 0 }, scene)
  const lens = shaped.nodes[scene.lens]
  const distToLens = (x: number, y: number) => Math.hypot(x - lens.x, y - lens.y)

  it('flows into the Endyra lens along the spokes, and along the Anvira trace from left to right', () => {
    let spokes = 0
    let traces = 0
    for (let t = 0; t < 40; t += 0.05) {
      for (const p of signalsAt(shaped, t).pulses) {
        const later = signalsAt(shaped, t + 0.02).pulses.find((q) => q.slot === p.slot && q.edge === p.edge)
        if (!later) continue
        const kind = shaped.edges[p.edge].kind
        if (kind === 'spoke') {
          spokes++
          expect(distToLens(later.x, later.y)).toBeLessThanOrEqual(distToLens(p.x, p.y) + 1e-9)
        }
        if (kind === 'trace') {
          traces++
          expect(later.x).toBeGreaterThanOrEqual(p.x - 1e-9)
        }
      }
    }
    expect(spokes).toBeGreaterThan(0)
    expect(traces).toBeGreaterThan(0)
  })

  it('sweeps one coral dot along the whole Anvira trace, like a monitor', () => {
    const sweep = (t: number) => signalsAt(shaped, t).pulses.find((p) => p.slot === SIGNAL.sweepSlot)
    const xs = Array.from({ length: 30 }, (_, i) => sweep(i * 0.05)?.x)
    expect(xs.every((x) => x !== undefined)).toBe(true)
    expect(sweep(0)?.tone).toBe('coral')
    const first = scene.trace[0]
    const last = scene.trace[scene.trace.length - 1]
    const span = shaped.nodes[last].x - shaped.nodes[first].x
    expect(Math.max(...(xs as number[])) - Math.min(...(xs as number[]))).toBeGreaterThan(span * 0.4)
  })

  it('has no sweep when the trace is not shown', () => {
    for (let t = 0; t < 5; t += 0.3) expect(signalsAt(formed, t).pulses.some((p) => p.slot === SIGNAL.sweepSlot)).toBe(false)
  })
})
