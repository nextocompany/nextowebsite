import { mulberry32 } from './math'
import { distance, type Point } from './point'

export type Variant = 'wide' | 'narrow'

/** The two product clusters, in both layouts: Endyra first, Anvira second. */
export const PRODUCT = { endyra: 0, anvira: 1 } as const

/** Lines of the product shapes: Endyra's ring and its spokes into the lens, Anvira's monitor trace. */
export interface ShapeEdge {
  readonly kind: 'ring' | 'spoke' | 'trace'
  /** For spokes and the trace, signals flow from a to b. */
  readonly a: number
  readonly b: number
}

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
  /** Ambient only: its place in a partner group at the rim (how we work, step 3). Others: their satellite position. */
  readonly partnerPos: Point
  /** Partner group index, or -1 for non-ambient nodes. */
  readonly partnerGroup: number
  /** Product clusters: place in the product's shape. Others: their cluster position. */
  readonly shapePos: Point
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
  /** Links inside each partner group, plus one bridge per group to an outer node. */
  readonly partnerEdges: ReadonlyArray<readonly [number, number]>
  /** Core node nearest the centre: where the work happens (how we work, step 1). */
  readonly origin: number
  readonly shapeEdges: ReadonlyArray<ShapeEdge>
  /** Centre of the Endyra ring. */
  readonly lens: number
  /** Anvira nodes from left to right along the trace. */
  readonly trace: ReadonlyArray<number>
  /** Beyond: links between the two main clusters, one network branching both ways. */
  readonly trunkEdges: ReadonlyArray<readonly [number, number]>
  /** Closing: every node at its opening scatter position, all linked into one piece. */
  readonly closeEdges: ReadonlyArray<readonly [number, number]>
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
/** A separate stream for the partner groups, so adding them left every other position unchanged. */
const PARTNER_SEED = SEED + 1

/** Three partner groups just beyond the satellites' orbit, spaced around the rim. */
const PARTNER_LAYOUT = {
  wide: { radius: 1.98, spread: 0.22, angles: [-0.5, 1.6, 3.7] },
  narrow: { radius: 1.72, spread: 0.2, angles: [-0.5, 1.6, 3.7] },
} as const satisfies Record<Variant, unknown>
const PARTNER_GROUPS = 3

/** Product shapes, sized to sit inside each product's cluster area. */
const SHAPE_LAYOUT = {
  wide: { ring: 0.5, spokes: 6, traceHalf: 0.9, spike: 0.42 },
  narrow: { ring: 0.34, spokes: 5, traceHalf: 0.52, spike: 0.3 },
} as const satisfies Record<Variant, unknown>

/**
 * One stylised monitor beat (x 0..1, y up negative, in units of the spike height):
 * a small bump, a sharp spike with a dip either side, a gentle hump. Not real
 * clinical data, just the rhythm. `flat` vertices may be dropped to fit fewer nodes.
 */
const BEAT: ReadonlyArray<{ x: number; y: number; flat?: true }> = [
  { x: 0, y: 0, flat: true },
  { x: 0.14, y: -0.06 },
  { x: 0.22, y: 0, flat: true },
  { x: 0.3, y: 0, flat: true },
  { x: 0.34, y: 0.28 },
  { x: 0.4, y: -1 },
  { x: 0.46, y: 0.3 },
  { x: 0.52, y: 0, flat: true },
  { x: 0.66, y: -0.15 },
  { x: 0.8, y: 0, flat: true },
]

/** Two beats across the trace, resampled to exactly `count` vertices (spikes always kept). */
function traceTemplate(count: number): Array<{ x: number; y: number }> {
  let points: Array<{ x: number; y: number; flat?: true }> = [
    ...BEAT.map((p) => ({ ...p, x: p.x / 2 })),
    ...BEAT.map((p) => ({ ...p, x: 0.5 + p.x / 2 })),
    { x: 1, y: 0 },
  ]
  while (points.length > count) {
    const droppable = points.flatMap((p, i) => (p.flat && i > 0 && i < points.length - 1 ? [i] : []))
    if (droppable.length === 0) break
    const drop = droppable[Math.floor(droppable.length / 2)]
    points = points.filter((_, i) => i !== drop)
  }
  while (points.length < count) {
    let widest = 0
    points.forEach((p, i) => {
      if (i > 0 && p.x - points[i - 1].x > points[widest + 1].x - points[widest].x) widest = i - 1
    })
    const [a, b] = [points[widest], points[widest + 1]]
    points = [...points.slice(0, widest + 1), { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, flat: true }, ...points.slice(widest + 1)]
  }
  return points.map(({ x, y }) => ({ x, y }))
}
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

  const baseNodes = Array.from({ length: clustered + layout.ambient }, (_, i) => {
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

  const partnerRand = mulberry32(PARTNER_SEED)
  const partner = PARTNER_LAYOUT[variant]
  const perGroup = Math.ceil(layout.ambient / PARTNER_GROUPS)
  const withPartners = baseNodes.map((n, i) => {
    if (n.role !== 'ambient') return { ...n, partnerPos: n.satellite, partnerGroup: -1 }
    const member = i - clustered
    const group = Math.floor(member / perGroup)
    const slot = member % perGroup
    const angle = partner.angles[group]
    const r = partner.spread * Math.sqrt((slot + 0.5) / perGroup)
    const a = slot * GOLDEN_ANGLE + partnerRand() * 0.6
    const centre = { x: Math.cos(angle) * partner.radius, y: Math.sin(angle) * partner.radius }
    return { ...n, partnerPos: { x: centre.x + Math.cos(a) * r, y: centre.y + Math.sin(a) * r }, partnerGroup: group }
  })

  const shapes = productShapes(withPartners, layout.clusters, SHAPE_LAYOUT[variant])
  const nodes: SceneNode[] = withPartners.map((n, i) => ({ ...n, shapePos: shapes.positions.get(i) ?? n.clusterPos }))

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

  const scatterPoints = nodes.map((n, index) => ({ index, pos: n.scatter }))
  const scatterLinks = nearLinks(scatterPoints, 2, layout.linkMax)
  const scatterEdges = fromKeys(scatterLinks)
  const closeEdges = fromKeys(new Set([...scatterLinks, ...spanningLinks(scatterPoints)]))

  const outerPoints = nodes.flatMap((n, index) => (n.role === 'outer' ? [{ index, pos: n.satellite }] : []))
  const partnerEdges = Array.from({ length: PARTNER_GROUPS }, (_, g) => {
    const members = nodes.flatMap((n, index) => (n.partnerGroup === g ? [{ index, pos: n.partnerPos }] : []))
    let bridge = { member: members[0], outer: outerPoints[0], d: Infinity }
    for (const member of members) {
      for (const outer of outerPoints) {
        const d = distance(member.pos, outer.pos)
        if (d < bridge.d) bridge = { member, outer, d }
      }
    }
    return [
      ...fromKeys(new Set([...spanningLinks(members), ...nearLinks(members, 1, partner.spread * 1.2)])),
      [bridge.member.index, bridge.outer.index] as [number, number],
    ]
  }).flat()

  const origin = corePoints.reduce((best, p) =>
    Math.hypot(p.pos.x, p.pos.y) < Math.hypot(best.pos.x, best.pos.y) ? p : best,
  ).index

  return {
    variant,
    nodes,
    partnerEdges,
    origin,
    shapeEdges: shapes.edges,
    lens: shapes.lens,
    trace: shapes.trace,
    trunkEdges: trunkLinks(nodes),
    closeEdges,
    coreEdges,
    clusterEdges,
    satelliteEdges,
    scatterEdges,
    scatterLinkMax: layout.linkMax,
    scatterBounds: layout.scatter,
    clusterCount: layout.clusters.length,
  }
}

type ShapeLayout = (typeof SHAPE_LAYOUT)[Variant]
type Placed = { readonly cluster: number; readonly clusterPos: Point }

/**
 * Endyra: members on a ring round the member nearest the cluster centre (the
 * lens), in the order they already sit, with evenly spaced spokes into it.
 * Anvira: members left to right along a stylised monitor trace.
 */
function productShapes(nodes: ReadonlyArray<Placed>, clusters: ReadonlyArray<ClusterSpec>, layout: ShapeLayout) {
  const positions = new Map<number, Point>()
  const edges: ShapeEdge[] = []
  const membersOf = (c: number) => nodes.flatMap((n, i) => (n.cluster === c ? [i] : []))

  const ringCentre = clusters[PRODUCT.endyra].centre
  const endyra = membersOf(PRODUCT.endyra)
  const lens = endyra.reduce((best, i) =>
    distance(nodes[i].clusterPos, ringCentre) < distance(nodes[best].clusterPos, ringCentre) ? i : best,
  )
  const angleOf = (i: number) => Math.atan2(nodes[i].clusterPos.y - ringCentre.y, nodes[i].clusterPos.x - ringCentre.x)
  const ring = endyra.filter((i) => i !== lens).sort((a, b) => angleOf(a) - angleOf(b))
  positions.set(lens, ringCentre)
  ring.forEach((i, k) => {
    const angle = angleOf(ring[0]) + (k / ring.length) * Math.PI * 2
    positions.set(i, { x: ringCentre.x + Math.cos(angle) * layout.ring, y: ringCentre.y + Math.sin(angle) * layout.ring })
    edges.push({ kind: 'ring', a: i, b: ring[(k + 1) % ring.length] })
  })
  const spokeStep = ring.length / layout.spokes
  for (let k = 0; k < layout.spokes; k++) edges.push({ kind: 'spoke', a: ring[Math.floor(k * spokeStep)], b: lens })

  const traceCentre = clusters[PRODUCT.anvira].centre
  const trace = membersOf(PRODUCT.anvira).sort((a, b) => nodes[a].clusterPos.x - nodes[b].clusterPos.x)
  traceTemplate(trace.length).forEach((p, k) => {
    positions.set(trace[k], {
      x: traceCentre.x + (p.x * 2 - 1) * layout.traceHalf,
      y: traceCentre.y + layout.spike * 0.25 + p.y * layout.spike,
    })
    if (k > 0) edges.push({ kind: 'trace', a: trace[k - 1], b: trace[k] })
  })

  return { positions, edges, lens, trace }
}

/** The nearest pair between the two main clusters: one trunk, so the network reads as branching. */
function trunkLinks(nodes: ReadonlyArray<Placed>): Array<[number, number]> {
  const left = nodes.flatMap((n, i) => (n.cluster === PRODUCT.endyra ? [i] : []))
  const right = nodes.flatMap((n, i) => (n.cluster === PRODUCT.anvira ? [i] : []))
  const [nearest] = left
    .flatMap((a) => right.map((b) => ({ a, b, d: distance(nodes[a].clusterPos, nodes[b].clusterPos) })))
    .sort((p, q) => p.d - q.d)
  return [[nearest.a, nearest.b]]
}
