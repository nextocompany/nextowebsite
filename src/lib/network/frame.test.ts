import { describe, expect, it } from 'vitest'
import { BRAIN_EDGES, BRAIN_NODES } from './brain'
import { frameAt, type BeatState } from './frame'
import { buildScene } from './scene'

const scene = buildScene('wide')
const FORMED: BeatState = { form: 1, split: 0, cluster: 0, reach: 0 }

describe('frameAt', () => {
  it('beat 1 resolves into the exact logo brain', () => {
    const frame = frameAt(FORMED, scene)
    BRAIN_NODES.forEach((p, i) => {
      expect(frame.nodes[i].x).toBeCloseTo(p.x, 10)
      expect(frame.nodes[i].y).toBeCloseTo(p.y, 10)
      expect(frame.nodes[i].alpha).toBe(1)
      expect(frame.nodes[i].toneAmount).toBe(0)
    })
    expect(frame.ring.alpha).toBe(1)
    for (const arc of frame.ring.arcs) expect(Math.hypot(arc.cx, arc.cy)).toBe(0)
    const [teal, coral] = frame.ring.arcs
    expect(teal.end).toBeCloseTo(coral.start)
    expect(coral.end - teal.start).toBeCloseTo(Math.PI * 2)
    const brainEdges = frame.edges.filter((e) => e.alpha > 0)
    expect(brainEdges).toHaveLength(BRAIN_EDGES.length)
  })

  it('starts scattered with no ring', () => {
    const frame = frameAt({ form: 0, split: 0, cluster: 0, reach: 0 }, scene)
    frame.nodes.forEach((n, i) => {
      expect(n.x).toBeCloseTo(scene.nodes[i].scatter.x)
      expect(n.y).toBeCloseTo(scene.nodes[i].scatter.y)
    })
    expect(frame.ring.alpha).toBe(0)
  })

  it('beat 2 pulls the hemispheres apart and colours them', () => {
    const frame = frameAt({ ...FORMED, split: 1 }, scene)
    const logic = frame.nodes.filter((_, i) => scene.nodes[i].hemisphere === 'logic' && i < 10)
    const human = frame.nodes.filter((_, i) => scene.nodes[i].hemisphere === 'human' && i < 10)
    expect(logic.every((n) => n.tone === 'teal' && n.toneAmount === 1)).toBe(true)
    expect(human.every((n) => n.tone === 'coral' && n.toneAmount === 1)).toBe(true)
    const [teal, coral] = frame.ring.arcs
    expect(coral.cx).toBeGreaterThan(teal.cx)
    expect(coral.cy).toBeGreaterThan(teal.cy)
  })

  it('beat 3 hides the ring and moves every node to its cluster', () => {
    const frame = frameAt({ ...FORMED, cluster: 1 }, scene)
    expect(frame.ring.alpha).toBe(0)
    frame.nodes.forEach((n, i) => {
      expect(n.x).toBeCloseTo(scene.nodes[i].clusterPos.x)
      expect(n.y).toBeCloseTo(scene.nodes[i].clusterPos.y)
    })
  })

  it('beat 4 passes reach through for the renderer', () => {
    expect(frameAt({ ...FORMED, cluster: 1, reach: 0.4 }, scene).reach).toBe(0.4)
  })

  it('changes continuously as a beat value moves', () => {
    const eps = 1e-4
    for (const key of ['form', 'split', 'cluster'] as const) {
      for (const v of [0.25, 0.5, 0.75]) {
        const a = frameAt({ ...FORMED, [key]: v - eps }, scene)
        const b = frameAt({ ...FORMED, [key]: v + eps }, scene)
        a.nodes.forEach((n, i) => {
          expect(Math.abs(n.x - b.nodes[i].x)).toBeLessThan(0.01)
          expect(Math.abs(n.alpha - b.nodes[i].alpha)).toBeLessThan(0.01)
        })
      }
    }
  })
})
