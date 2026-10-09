import { describe, expect, it } from 'vitest'
import { buildScene, KIND } from './scene'

const VARIANTS = ['wide', 'narrow'] as const

describe('buildScene', () => {
  it('is deterministic', () => {
    expect(buildScene('wide')).toEqual(buildScene('wide'))
  })

  it('uses fewer nodes on narrow screens', () => {
    expect(buildScene('narrow').nodes.length).toBeLessThan(buildScene('wide').nodes.length)
  })

  it('splits the core network evenly into data and people', () => {
    for (const variant of VARIANTS) {
      const core = buildScene(variant).nodes.filter((n) => n.role === 'core')
      const people = core.filter((n) => n.kind === KIND.people)
      expect(people.length).toBe(Math.floor(core.length / 2))
      // people sit to the right of data in the united network
      const maxData = Math.max(...core.filter((n) => n.kind === KIND.data).map((n) => n.united.x))
      expect(Math.min(...people.map((n) => n.united.x))).toBeGreaterThanOrEqual(maxData)
    }
  })

  it('gathers the core into one disc', () => {
    for (const n of buildScene('wide').nodes.filter((n) => n.role === 'core')) {
      expect(Math.hypot(n.united.x, n.united.y)).toBeLessThanOrEqual(1)
    }
  })

  it('links the united core into one connected mesh', () => {
    const scene = buildScene('wide')
    const core = scene.nodes.flatMap((n, i) => (n.role === 'core' ? [i] : []))
    expect(connected(core, scene.coreEdges)).toBe(true)
  })

  it('scatters every node inside the scatter bounds', () => {
    const { nodes, scatterBounds } = buildScene('wide')
    for (const n of nodes) {
      expect(Math.abs(n.scatter.x)).toBeLessThanOrEqual(scatterBounds.x)
      expect(Math.abs(n.scatter.y)).toBeLessThanOrEqual(scatterBounds.y)
    }
  })

  it('links the scattered network to near neighbours only', () => {
    const scene = buildScene('wide')
    expect(scene.scatterEdges.length).toBeGreaterThan(scene.nodes.length / 2)
    for (const [a, b] of scene.scatterEdges) {
      const p = scene.nodes[a].scatter
      const q = scene.nodes[b].scatter
      expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeLessThanOrEqual(scene.scatterLinkMax)
    }
  })
})

describe('satellites', () => {
  it('sit outside the network and link each to a core node', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const outer = scene.nodes.filter((n) => n.role === 'outer')
      expect(scene.satelliteEdges).toHaveLength(outer.length)
      for (const n of outer) expect(Math.hypot(n.satellite.x, n.satellite.y)).toBeGreaterThan(1.25)
      for (const [o, c] of scene.satelliteEdges) {
        expect(scene.nodes[o].role).toBe('outer')
        expect(scene.nodes[c].role).toBe('core')
      }
    }
  })
})

describe('clusters', () => {
  it('put core and outer nodes in clusters and leave ambient nodes out', () => {
    for (const n of buildScene('wide').nodes) {
      if (n.role === 'ambient') expect(n.cluster).toBe(-1)
      else expect(n.cluster).toBeGreaterThanOrEqual(0)
    }
  })

  it('centre the two main clusters over the two product cards on wide screens', () => {
    const scene = buildScene('wide')
    const centre = (c: number) => {
      const members = scene.nodes.filter((n) => n.cluster === c)
      return members.reduce((s, n) => s + n.clusterPos.x, 0) / members.length
    }
    expect(centre(0)).toBeCloseTo(-1.5, 0)
    expect(centre(1)).toBeCloseTo(1.5, 0)
  })

  it('only link nodes in the same cluster, each cluster in one piece', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      for (const [a, b] of scene.clusterEdges) expect(scene.nodes[a].cluster).toBe(scene.nodes[b].cluster)
      for (let c = 0; c < scene.clusterCount; c++) {
        const members = scene.nodes.flatMap((n, i) => (n.cluster === c ? [i] : []))
        expect(connected(members, scene.clusterEdges)).toBe(true)
      }
    }
  })
})

function connected(members: number[], edges: ReadonlyArray<readonly [number, number]>): boolean {
  const reached = new Set([members[0]])
  let grew = true
  while (grew) {
    grew = false
    for (const [a, b] of edges) {
      if (reached.has(a) !== reached.has(b) && members.includes(a) && members.includes(b)) {
        reached.add(a)
        reached.add(b)
        grew = true
      }
    }
  }
  return members.every((m) => reached.has(m))
}
