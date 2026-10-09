import { describe, expect, it } from 'vitest'
import { BRAIN_EDGES, BRAIN_NODES } from './brain'
import { frameAt, type BeatState } from './frame'
import { buildScene } from './scene'

const scene = buildScene('wide')
const FORMED: BeatState = { form: 1, split: 0, connect: 0, cluster: 0, reach: 0 }

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
    expect(frame.detail).toBe(1)
    for (const arc of frame.ring.arcs) expect(Math.hypot(arc.cx, arc.cy)).toBe(0)
    const [teal, coral] = frame.ring.arcs
    expect(teal.end).toBeCloseTo(coral.start)
    expect(coral.end - teal.start).toBeCloseTo(Math.PI * 2)
    const brainEdges = frame.edges.filter((e) => e.alpha > 0)
    expect(brainEdges).toHaveLength(BRAIN_EDGES.length)
  })

  it('starts scattered with no ring', () => {
    const frame = frameAt({ form: 0, split: 0, connect: 0, cluster: 0, reach: 0 }, scene)
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

  it('connect keeps the logo and links outer nodes into the brain', () => {
    const frame = frameAt({ ...FORMED, connect: 1 }, scene)
    expect(frame.ring.alpha).toBe(1)
    BRAIN_NODES.forEach((p, i) => expect(frame.nodes[i].x).toBeCloseTo(p.x, 10))
    scene.nodes.forEach((n, i) => {
      if (n.isBrain || n.cluster < 0) return
      expect(frame.nodes[i].x).toBeCloseTo(n.satellite.x)
      expect(frame.nodes[i].alpha).toBe(1)
    })
    const links = frame.edges.slice(BRAIN_EDGES.length + scene.clusterEdges.length, -scene.scatterEdges.length || undefined)
    expect(links.length).toBe(scene.satelliteEdges.length)
    expect(links.every((e) => e.alpha === 1)).toBe(true)
  })

  it('beat 3 hides the ring and moves cluster members to their cluster', () => {
    const frame = frameAt({ ...FORMED, cluster: 1 }, scene)
    expect(frame.ring.alpha).toBe(0)
    frame.nodes.forEach((n, i) => {
      if (scene.nodes[i].cluster < 0) {
        expect(n.alpha).toBe(0)
        return
      }
      expect(n.x).toBeCloseTo(scene.nodes[i].clusterPos.x)
      expect(n.y).toBeCloseTo(scene.nodes[i].clusterPos.y)
    })
  })

  it('shows the scattered network links only before the brain forms', () => {
    const scatterAlpha = (form: number) =>
      frameAt({ ...FORMED, form }, scene).edges.slice(-scene.scatterEdges.length).every((e) => e.alpha > 0)
    expect(scatterAlpha(0)).toBe(true)
    expect(frameAt(FORMED, scene).edges.slice(-scene.scatterEdges.length).every((e) => e.alpha === 0)).toBe(true)
  })

  it('drifts the scattered network over time but not at time 0 or once formed', () => {
    const at = (time: number, form: number) => frameAt({ ...FORMED, form, time }, scene).nodes[12]
    expect(at(0, 0).x).toBeCloseTo(scene.nodes[12].scatter.x)
    expect(at(3, 0).x).not.toBeCloseTo(scene.nodes[12].scatter.x, 3)
    expect(at(3, 1).x).toBeCloseTo(at(0, 1).x)
  })

  it('beat 4 passes reach through for the renderer', () => {
    expect(frameAt({ ...FORMED, cluster: 1, reach: 0.4 }, scene).reach).toBe(0.4)
  })

  it('changes continuously as a beat value moves', () => {
    const eps = 1e-4
    for (const key of ['form', 'split', 'connect', 'cluster'] as const) {
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
