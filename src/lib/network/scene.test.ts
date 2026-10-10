import { describe, expect, it } from 'vitest'
import { buildScene, KIND, PRODUCT } from './scene'
import { STAGE_EXTENT } from './stages'

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

describe('partner groups (how we work, step 3)', () => {
  it('gather the ambient nodes into three small groups beyond the satellites', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const ambient = scene.nodes.filter((n) => n.role === 'ambient')
      expect(new Set(ambient.map((n) => n.partnerGroup))).toEqual(new Set([0, 1, 2]))
      const orbit = Math.max(...scene.nodes.filter((n) => n.role === 'outer').map((n) => Math.hypot(n.satellite.x, n.satellite.y)))
      for (const n of ambient) expect(Math.hypot(n.partnerPos.x, n.partnerPos.y)).toBeGreaterThan(orbit)
      for (const n of scene.nodes.filter((m) => m.role !== 'ambient')) expect(n.partnerGroup).toBe(-1)
    }
  })

  it('link each group into one piece and bridge it to an outer node', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      for (let g = 0; g < 3; g++) {
        const members = scene.nodes.flatMap((n, i) => (n.partnerGroup === g ? [i] : []))
        expect(connected(members, scene.partnerEdges)).toBe(true)
        const bridges = scene.partnerEdges.filter(([a, b]) => members.includes(a) !== members.includes(b))
        expect(bridges).toHaveLength(1)
        const outside = bridges[0].find((i) => !members.includes(i))!
        expect(scene.nodes[outside].role).toBe('outer')
      }
    }
  })

  it('fit inside the how-we-work stage', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const extent = STAGE_EXTENT['how-we-work'][variant]
      for (const n of scene.nodes) {
        const p = n.role === 'ambient' ? n.partnerPos : n.satellite
        expect(Math.abs(p.x)).toBeLessThan(extent.x)
        expect(Math.abs(p.y)).toBeLessThan(extent.y)
      }
    }
  })
})

describe('origin (how we work, step 1)', () => {
  it('is the core node nearest the centre', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const origin = scene.nodes[scene.origin]
      expect(origin.role).toBe('core')
      for (const n of scene.nodes.filter((m) => m.role === 'core')) {
        expect(Math.hypot(origin.united.x, origin.united.y)).toBeLessThanOrEqual(Math.hypot(n.united.x, n.united.y))
      }
    }
  })
})

describe('product shapes (products stage)', () => {
  const members = (scene: ReturnType<typeof buildScene>, c: number) => scene.nodes.flatMap((n, i) => (n.cluster === c ? [i] : []))

  it('Endyra: a ring round a lens centre, with spokes into it', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const ring = members(scene, PRODUCT.endyra).filter((i) => i !== scene.lens)
      const centre = scene.nodes[scene.lens].shapePos
      expect(scene.nodes[scene.lens].cluster).toBe(PRODUCT.endyra)
      const radii = ring.map((i) => Math.hypot(scene.nodes[i].shapePos.x - centre.x, scene.nodes[i].shapePos.y - centre.y))
      for (const r of radii) expect(r).toBeCloseTo(radii[0], 6)
      const spokes = scene.shapeEdges.filter((e) => e.kind === 'spoke')
      expect(spokes.length).toBeGreaterThanOrEqual(3)
      for (const e of spokes) expect(e.b).toBe(scene.lens)
      const rim = scene.shapeEdges.filter((e) => e.kind === 'ring')
      expect(rim).toHaveLength(ring.length)
    }
  })

  it('Anvira: one trace from left to right with a monitor-like spike', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const trace = scene.trace
      expect(new Set(trace)).toEqual(new Set(members(scene, PRODUCT.anvira)))
      const xs = trace.map((i) => scene.nodes[i].shapePos.x)
      xs.slice(1).forEach((x, i) => expect(x).toBeGreaterThan(xs[i]))
      const ys = trace.map((i) => scene.nodes[i].shapePos.y)
      const baseline = ys[0]
      expect(Math.min(...ys)).toBeLessThan(baseline - 0.25)
      const traceEdges = scene.shapeEdges.filter((e) => e.kind === 'trace')
      expect(traceEdges.map((e) => [e.a, e.b])).toEqual(trace.slice(1).map((b, i) => [trace[i], b]))
    }
  })

  it('leave every other node where its cluster put it', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      for (const n of scene.nodes) {
        if (n.cluster !== PRODUCT.endyra && n.cluster !== PRODUCT.anvira) expect(n.shapePos).toEqual(n.clusterPos)
      }
    }
  })

  it('fit inside the products stage', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const extent = STAGE_EXTENT.products[variant]
      for (const n of scene.nodes) {
        expect(Math.abs(n.shapePos.x)).toBeLessThan(extent.x)
        expect(Math.abs(n.shapePos.y)).toBeLessThan(extent.y)
      }
    }
  })
})

describe('trunk (beyond)', () => {
  it('bridges the two main clusters with one link between their nearest nodes', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      expect(scene.trunkEdges).toHaveLength(1)
      for (const [a, b] of scene.trunkEdges) {
        expect([scene.nodes[a].cluster, scene.nodes[b].cluster].sort()).toEqual([PRODUCT.endyra, PRODUCT.anvira].sort())
      }
    }
  })
})

describe('closing (footer)', () => {
  it('links every node, at its opening scatter position, into one piece of short links', () => {
    for (const variant of VARIANTS) {
      const scene = buildScene(variant)
      const all = scene.nodes.map((_, i) => i)
      expect(connected(all, scene.closeEdges)).toBe(true)
      const length = ([a, b]: readonly [number, number]) =>
        Math.hypot(scene.nodes[a].scatter.x - scene.nodes[b].scatter.x, scene.nodes[a].scatter.y - scene.nodes[b].scatter.y)
      const longest = Math.max(...scene.closeEdges.map(length))
      expect(longest).toBeLessThan(scene.scatterBounds.x)
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
