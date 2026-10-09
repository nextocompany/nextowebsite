import { mulberry32 } from './math'
import { distance, type Point } from './point'

export type Variant = 'wide' | 'narrow'

export const KIND = { data: 'data', people: 'people' } as const
export type Kind = (typeof KIND)[keyof typeof KIND]

/**
 * core: unites into the one network and carries the story.
 * outer: links in from outside (how we work), then joins the clusters.
 * ambient: only adds density to the scattered hero, then fades.
 */
export type Role = 'core' | 'outer' | 'ambient'

export interface SceneNode {
  readonly role: Role
  readonly scatter: Point
  /** Core: place in the united network. Others: where they fade out, just outside it. */
  readonly united: Point
  /** Core only: data (teal, left) or people (coral, right) in the split beat. */
  readonly kind: Kind | null
  /** Outer: where it waits, linked in. Others: their united position. */
  readonly satellite: Point
  readonly clusterPos: Point
  /** Cluster index, or -1 for ambient nodes. */
  readonly cluster: number
  /** One outer node per cluster is drawn teal there. */
  readonly isHub: boolean
  readonly drift: { readonly phase: number; readonly speed: number }
}

export interface Scene {
  readonly variant: Variant
  readonly nodes: ReadonlyArray<SceneNode>
  readonly coreEdges: ReadonlyArray<readonly [number, number]>
  readonly clusterEdges: ReadonlyArray<readonly [number, number]>
  /** [outer index, core index]. */
  readonly satelliteEdges: ReadonlyArray<readonly [number, number]>
  readonly scatterEdges: ReadonlyArray<readonly [number, number]>
  readonly scatterLinkMax: number
  readonly scatterBounds: Point
  readonly clusterCount: number
}

interface ClusterSpec {
  readonly centre: Point
  readonly radius: number
  /** Share of the clustered nodes. */
  readonly weight: number
}

const SEED = 20261010
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

const LAYOUT = {
  wide: {
    core: 34,
    outer: 22,
    ambient: 24,
    scatter: { x: 3.1, y: 1.5 },
    linkMax: 0.75,
    orbit: { min: 1.4, spread: 0.3 },
    // The two main clusters sit over the Endyra and Anvira cards (stage x ±1.5).
    clusters: [
      { centre: { x: -1.5, y: 0.05 }, radius: 0.6, weight: 0.38 },
      { centre: { x: 1.5, y: -0.05 }, radius: 0.6, weight: 0.38 },
      { centre: { x: -2.65, y: -0.45 }, radius: 0.3, weight: 0.12 },
      { centre: { x: 2.65, y: 0.45 }, radius: 0.3, weight: 0.12 },
    ],
  },
  narrow: {
    core: 22,
    outer: 12,
    ambient: 12,
    scatter: { x: 1.15, y: 1.9 },
    linkMax: 0.7,
    orbit: { min: 1.3, spread: 0.2 },
    clusters: [
      { centre: { x: -0.62, y: -0.1 }, radius: 0.45, weight: 0.5 },
      { centre: { x: 0.62, y: 0.1 }, radius: 0.45, weight: 0.5 },
    ],
  },
} as const satisfies Record<Variant, unknown>

const pairKey = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`)
const fromKeys = (keys: Set<string>) => [...keys].map((k) => k.split(':').map(Number) as [number, number])

/** Each point to its `k` nearest neighbours within `max`. */
function nearLinks(points: ReadonlyArray<{ index: number; pos: Point }>, k: number, max: number) {
  const links = new Set<string>()
  for (const a of points) {
    points
      .filter((b) => b.index !== a.index && distance(a.pos, b.pos) <= max)
      .sort((p, q) => distance(p.pos, a.pos) - distance(q.pos, a.pos))
      .slice(0, k)
      .forEach((b) => links.add(pairKey(a.index, b.index)))
  }
  return links
}

/** A minimum spanning tree, so the group is always one piece. */
function spanningLinks(points: ReadonlyArray<{ index: number; pos: Point }>) {
  const links = new Set<string>()
  const inTree = points.slice(0, 1)
  const rest = points.slice(1)
  while (rest.length > 0) {
    let best = { from: inTree[0], to: 0, d: Infinity }
    for (const from of inTree) {
      rest.forEach((p, to) => {
        const d = distance(from.pos, p.pos)
        if (d < best.d) best = { from, to, d }
      })
    }
    const [next] = rest.splice(best.to, 1)
    links.add(pairKey(best.from.index, next.index))
    inTree.push(next)
  }
  return links
}

/** Spreads `count` cluster slots over the specs by weight; the rest go to the last spec. */
function clusterSlots(specs: ReadonlyArray<ClusterSpec>, count: number): number[] {
  const slots = specs.flatMap((s, c) => Array.from({ length: Math.round(s.weight * count) }, () => c))
  return Array.from({ length: count }, (_, i) => slots[i] ?? specs.length - 1)
}

export function buildScene(variant: Variant): Scene {
  const layout = LAYOUT[variant]
  const rand = mulberry32(SEED)
  const between = (limit: number) => (rand() * 2 - 1) * limit
  const coreCount = layout.core

  // United network: a sunflower disc gives an even, organic spread inside radius 1.
  const discRaw = Array.from({ length: coreCount }, (_, i) => {
    const r = 0.95 * Math.sqrt((i + 0.5) / coreCount)
    const a = i * GOLDEN_ANGLE + (rand() - 0.5) * 0.35
    return { x: Math.cos(a) * r, y: Math.sin(a) * r }
  })
  const byX = discRaw.map((p, i) => ({ p, i })).sort((a, b) => a.p.x - b.p.x)
  const peopleFrom = coreCount - Math.floor(coreCount / 2)
  const kindOf = new Map(byX.map(({ i }, rank) => [i, rank >= peopleFrom ? KIND.people : KIND.data]))

  const clustered = coreCount + layout.outer
  const slots = clusterSlots(layout.clusters, clustered)
  const hubTaken = new Set<number>()

  const nodes: SceneNode[] = Array.from({ length: clustered + layout.ambient }, (_, i) => {
    const role: Role = i < coreCount ? 'core' : i < clustered ? 'outer' : 'ambient'
    const edgeAngle = rand() * Math.PI * 2
    const united = role === 'core' ? discRaw[i] : { x: Math.cos(edgeAngle) * 1.05, y: Math.sin(edgeAngle) * 1.05 }
    const outerIndex = i - coreCount
    const orbitAngle = (outerIndex / layout.outer) * Math.PI * 2 + (rand() - 0.5) * 0.4
    const orbitRadius = layout.orbit.min + rand() * layout.orbit.spread
    const satellite =
      role === 'outer' ? { x: Math.cos(orbitAngle) * orbitRadius, y: Math.sin(orbitAngle) * orbitRadius } : united
    const cluster = role === 'ambient' ? -1 : slots[i]
    const spec = layout.clusters[Math.max(cluster, 0)]
    const angle = rand() * Math.PI * 2
    const dist = spec.radius * Math.sqrt(rand())
    const isHub = role === 'outer' && !hubTaken.has(cluster)
    if (isHub) hubTaken.add(cluster)
    return {
      role,
      scatter: { x: between(layout.scatter.x), y: between(layout.scatter.y) },
      united,
      kind: role === 'core' ? (kindOf.get(i) ?? null) : null,
      satellite,
      clusterPos: { x: spec.centre.x + Math.cos(angle) * dist, y: spec.centre.y + Math.sin(angle) * dist },
      cluster,
      isHub,
      drift: { phase: rand() * Math.PI * 2, speed: 0.25 + rand() * 0.35 },
    }
  })

  const corePoints = nodes.flatMap((n, index) => (n.role === 'core' ? [{ index, pos: n.united }] : []))
  const coreEdges = fromKeys(new Set([...spanningLinks(corePoints), ...nearLinks(corePoints, 3, 0.45)]))

  const clusterEdges = layout.clusters.flatMap((_, c) => {
    const members = nodes.flatMap((n, index) => (n.cluster === c ? [{ index, pos: n.clusterPos }] : []))
    return fromKeys(new Set([...spanningLinks(members), ...nearLinks(members, 1, 0.35)]))
  })

  const satelliteEdges = nodes.flatMap((n, index): Array<[number, number]> => {
    if (n.role !== 'outer') return []
    const nearest = corePoints.reduce((best, p) => (distance(p.pos, n.satellite) < distance(best.pos, n.satellite) ? p : best))
    return [[index, nearest.index]]
  })

  const scatterEdges = fromKeys(
    nearLinks(
      nodes.map((n, index) => ({ index, pos: n.scatter })),
      2,
      layout.linkMax,
    ),
  )

  return {
    variant,
    nodes,
    coreEdges,
    clusterEdges,
    satelliteEdges,
    scatterEdges,
    scatterLinkMax: layout.linkMax,
    scatterBounds: layout.scatter,
    clusterCount: layout.clusters.length,
  }
}
