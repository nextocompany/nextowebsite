import { describe, expect, it } from 'vitest'
import { frameAt, type BeatState } from './frame'
import { buildScene, PRODUCT } from './scene'

const scene = buildScene('wide')
const SCATTERED: BeatState = { form: 0, split: 0, start: 0, connect: 0, grow: 0, cluster: 0, shape: 0, reach: 0 }
const UNITED: BeatState = { ...SCATTERED, form: 1 }
const core = scene.nodes.flatMap((n, i) => (n.role === 'core' ? [i] : []))
const edgesOf = (frame: ReturnType<typeof frameAt>, kind: string) => frame.edges.filter((e) => e.kind === kind)

describe('frameAt', () => {
  it('starts as the scattered network with its links and no united mesh', () => {
    const frame = frameAt(SCATTERED, scene)
    frame.nodes.forEach((n, i) => {
      expect(n.x).toBeCloseTo(scene.nodes[i].scatter.x)
      expect(n.y).toBeCloseTo(scene.nodes[i].scatter.y)
      expect(n.alpha).toBeGreaterThan(0)
    })
    expect(edgesOf(frame, 'scatter').every((e) => e.alpha > 0)).toBe(true)
    expect(edgesOf(frame, 'core').every((e) => e.alpha === 0)).toBe(true)
  })

  it('unites the core into one mesh and lets the other nodes fade', () => {
    const frame = frameAt(UNITED, scene)
    frame.nodes.forEach((n, i) => {
      const node = scene.nodes[i]
      if (node.role === 'core') {
        expect(n.x).toBeCloseTo(node.united.x, 10)
        expect(n.alpha).toBe(1)
        expect(n.toneAmount).toBe(0)
      } else {
        expect(n.alpha).toBe(0)
      }
    })
    expect(edgesOf(frame, 'core').every((e) => e.alpha > 0)).toBe(true)
    expect(edgesOf(frame, 'scatter').every((e) => e.alpha === 0)).toBe(true)
    expect(frame.detail).toBe(1)
  })

  it('splits data and people apart and colours them', () => {
    const frame = frameAt({ ...UNITED, split: 1 }, scene)
    for (const i of core) {
      const node = scene.nodes[i]
      const n = frame.nodes[i]
      expect(n.tone).toBe(node.kind === 'people' ? 'coral' : 'teal')
      expect(n.toneAmount).toBe(1)
      if (node.kind === 'people') expect(n.x).toBeGreaterThan(node.united.x)
      else expect(n.x).toBeLessThan(node.united.x)
    }
    // links across the two sides stay as faint bridges
    const bridges = edgesOf(frame, 'core').filter((e) => scene.nodes[e.a].kind !== scene.nodes[e.b].kind)
    expect(bridges.length).toBeGreaterThan(0)
    expect(bridges.every((e) => e.alpha > 0 && e.alpha < 1)).toBe(true)
  })

  it('connect links outer nodes in at their satellite positions', () => {
    const frame = frameAt({ ...UNITED, connect: 1 }, scene)
    scene.nodes.forEach((node, i) => {
      if (node.role !== 'outer') return
      expect(frame.nodes[i].x).toBeCloseTo(node.satellite.x)
      expect(frame.nodes[i].alpha).toBe(1)
    })
    expect(edgesOf(frame, 'satellite').every((e) => e.alpha === 1)).toBe(true)
  })

  it('cluster moves every member to its cluster and hides the united mesh', () => {
    const frame = frameAt({ ...UNITED, connect: 1, cluster: 1 }, scene)
    scene.nodes.forEach((node, i) => {
      if (node.cluster < 0) return expect(frame.nodes[i].alpha).toBe(0)
      expect(frame.nodes[i].x).toBeCloseTo(node.clusterPos.x)
      expect(frame.nodes[i].y).toBeCloseTo(node.clusterPos.y)
    })
    expect(edgesOf(frame, 'core').every((e) => e.alpha === 0)).toBe(true)
    expect(edgesOf(frame, 'cluster').every((e) => e.alpha === 1)).toBe(true)
  })

  it('start sends a teal wave out from the origin node, and leaves no colour once it has passed', () => {
    const lit = (start: number) =>
      frameAt({ ...UNITED, start }, scene).nodes.flatMap((n, i) => (n.tone === 'teal' && n.toneAmount > 0.5 ? [i] : []))
    expect(lit(0)).toEqual([])
    expect(lit(0.05)).toContain(scene.origin)
    const early = lit(0.25)
    const late = lit(0.7)
    const reach = (ids: number[]) => Math.max(...ids.map((i) => Math.hypot(scene.nodes[i].united.x - scene.nodes[scene.origin].united.x, scene.nodes[i].united.y - scene.nodes[scene.origin].united.y)))
    expect(early.length).toBeGreaterThan(0)
    expect(reach(late)).toBeGreaterThan(reach(early))
    expect(lit(1)).toEqual([])
  })

  it('grow brings the partner groups in at the rim, linked to the network', () => {
    const before = frameAt({ ...UNITED, start: 1, connect: 1 }, scene)
    const after = frameAt({ ...UNITED, start: 1, connect: 1, grow: 1 }, scene)
    scene.nodes.forEach((node, i) => {
      if (node.role !== 'ambient') return
      expect(before.nodes[i].alpha).toBe(0)
      expect(after.nodes[i].alpha).toBe(1)
      expect(after.nodes[i].x).toBeCloseTo(node.partnerPos.x)
      expect(after.nodes[i].y).toBeCloseTo(node.partnerPos.y)
    })
    expect(edgesOf(before, 'partner').every((e) => e.alpha === 0)).toBe(true)
    expect(edgesOf(after, 'partner').every((e) => e.alpha === 1)).toBe(true)
  })

  it('lets the partner groups go when the network opens into the product clusters', () => {
    const frame = frameAt({ ...UNITED, start: 1, connect: 1, grow: 1, cluster: 1 }, scene)
    scene.nodes.forEach((node, i) => {
      if (node.role === 'ambient') expect(frame.nodes[i].alpha).toBe(0)
    })
    expect(edgesOf(frame, 'partner').every((e) => e.alpha === 0)).toBe(true)
  })

  it('shape turns the two product clusters into a teal ring (Endyra) and a coral trace (Anvira)', () => {
    const frame = frameAt({ ...UNITED, connect: 1, cluster: 1, shape: 1 }, scene)
    scene.nodes.forEach((node, i) => {
      if (node.cluster < 0) return // ambient nodes are hidden once clustered
      expect(frame.nodes[i].x).toBeCloseTo(node.shapePos.x)
      expect(frame.nodes[i].y).toBeCloseTo(node.shapePos.y)
      if (node.cluster === PRODUCT.endyra) expect([frame.nodes[i].tone, frame.nodes[i].toneAmount]).toEqual(['teal', 1])
      if (node.cluster === PRODUCT.anvira) expect([frame.nodes[i].tone, frame.nodes[i].toneAmount]).toEqual(['coral', 1])
    })
    const shapeKinds = ['ring', 'spoke', 'trace']
    for (const e of frame.edges.filter((f) => shapeKinds.includes(f.kind))) expect(e.alpha).toBe(1)
    const productCluster = frame.edges.filter(
      (e) => e.kind === 'cluster' && ([PRODUCT.endyra, PRODUCT.anvira] as number[]).includes(scene.nodes[e.a].cluster),
    )
    expect(productCluster.every((e) => e.alpha === 0)).toBe(true)
  })

  it('shows no shapes before the clusters form or once shape is back to 0', () => {
    for (const state of [{ ...UNITED, shape: 1 }, { ...UNITED, connect: 1, cluster: 1, shape: 0 }]) {
      const frame = frameAt(state, scene)
      expect(frame.edges.filter((e) => ['ring', 'spoke', 'trace'].includes(e.kind)).every((e) => e.alpha === 0)).toBe(true)
    }
  })

  it('passes reach through for the renderer', () => {
    expect(frameAt({ ...UNITED, cluster: 1, reach: 0.4 }, scene).reach).toBe(0.4)
  })

  it('drifts the scattered network over time but not at time 0 or once united', () => {
    const at = (time: number, form: number) => frameAt({ ...SCATTERED, form, time }, scene).nodes[0]
    expect(at(0, 0).x).toBeCloseTo(scene.nodes[0].scatter.x)
    expect(at(3, 0).x).not.toBeCloseTo(scene.nodes[0].scatter.x, 3)
    expect(at(3, 1).x).toBeCloseTo(at(0, 1).x)
  })

  it('changes continuously as any beat moves', () => {
    const eps = 1e-4
    for (const key of ['form', 'split', 'start', 'connect', 'grow', 'cluster', 'shape'] as const) {
      for (const v of [0.25, 0.5, 0.75]) {
        const base = { ...UNITED, connect: key === 'cluster' || key === 'shape' ? 1 : 0, cluster: key === 'shape' ? 1 : 0 }
        const a = frameAt({ ...base, [key]: v - eps }, scene)
        const b = frameAt({ ...base, [key]: v + eps }, scene)
        a.nodes.forEach((n, i) => {
          expect(Math.abs(n.x - b.nodes[i].x)).toBeLessThan(0.01)
          expect(Math.abs(n.alpha - b.nodes[i].alpha)).toBeLessThan(0.01)
        })
        a.edges.forEach((e, i) => expect(Math.abs(e.alpha - b.edges[i].alpha)).toBeLessThan(0.01))
      }
    }
  })
})
