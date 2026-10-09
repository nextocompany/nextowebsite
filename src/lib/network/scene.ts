import { BRAIN_NODES, RING, RING_SPLIT, type Point } from './brain'
import { mulberry32 } from './math'

export type Variant = 'wide' | 'narrow'

export const HEMISPHERE = { logic: 'logic', human: 'human' } as const
export type Hemisphere = (typeof HEMISPHERE)[keyof typeof HEMISPHERE]

export interface SceneNode {
  /** Brain nodes: logo position. Extra nodes: a point on the O they fly into. */
  readonly brain: Point
  readonly scatter: Point
  readonly clusterPos: Point
  /** Cluster index in beat 3, or -1 for extras that fade out instead. */
  readonly cluster: number
  /** Gentle drift while scattered: phase (radians) and speed (radians/second). */
  readonly drift: { readonly phase: number; readonly speed: number }
  readonly isBrain: boolean
  readonly hemisphere: Hemisphere | null
  /** One extra node per cluster turns teal in the cluster beat. */
  readonly isHub: boolean
}

export interface Scene {
  readonly variant: Variant
  readonly nodes: ReadonlyArray<SceneNode>
  readonly clusterEdges: ReadonlyArray<readonly [number, number]>
  /** Links of the full-screen network in the hero. */
  readonly scatterEdges: ReadonlyArray<readonly [number, number]>
  readonly scatterLinkMax: number
  readonly clusterCount: number
  readonly scatterBounds: Point
  /** Unit vector from the logic half towards the human half. */
  readonly splitNormal: Point
}

const SEED = 20261010

const LAYOUT = {
  wide: {
    extras: 46,
    clustered: 22,
    scatter: { x: 3.1, y: 1.5 },
    linkMax: 0.75,
    clusterRadius: 0.55,
    clusters: [
      { x: -2.3, y: 0.2 },
      { x: -0.8, y: -0.3 },
      { x: 0.75, y: 0.25 },
      { x: 2.3, y: -0.2 },
    ],
  },
  narrow: {
    extras: 24,
    clustered: 12,
    scatter: { x: 1.15, y: 1.9 },
    linkMax: 0.7,
    clusterRadius: 0.42,
    clusters: [
      { x: -0.7, y: -0.5 },
      { x: 0.72, y: -0.32 },
      { x: 0.05, y: 0.62 },
    ],
  },
} as const

/** The O changes colour along this line; its normal points into the coral (human) side. */
const SPLIT_ANGLE = (RING_SPLIT.tealStart + RING_SPLIT.coralStart) / 2 // ≈ 45°, lower right
const SPLIT_NORMAL: Point = { x: Math.cos(SPLIT_ANGLE), y: Math.sin(SPLIT_ANGLE) }

function hemisphereOf(p: Point, centroid: Point): Hemisphere {
  const d = (p.x - centroid.x) * SPLIT_NORMAL.x + (p.y - centroid.y) * SPLIT_NORMAL.y
  return d > 0 ? HEMISPHERE.human : HEMISPHERE.logic
}

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

/** Shortest edge that still adds a triangle; keeps clusters from looking like chains. */
const EXTRA_LINK = 0.5

/** A minimum spanning tree (so the cluster is one piece) plus short second-nearest links. */
function clusterLinks(points: ReadonlyArray<{ index: number; pos: Point }>): Array<[number, number]> {
  const links = new Set<string>()
  const add = (a: number, b: number) => links.add(a < b ? `${a}:${b}` : `${b}:${a}`)
  const inTree = [points[0]]
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
    add(best.from.index, next.index)
    inTree.push(next)
  }
  for (const a of points) {
    const second = points
      .filter((b) => b.index !== a.index)
      .sort((p, q) => distance(p.pos, a.pos) - distance(q.pos, a.pos))[1]
    if (second && distance(second.pos, a.pos) < EXTRA_LINK) add(a.index, second.index)
  }
  return [...links].map((key) => key.split(':').map(Number) as [number, number])
}

/** Each node to its two nearest neighbours, if they are within `max`. */
function nearLinks(points: ReadonlyArray<{ index: number; pos: Point }>, max: number): Array<[number, number]> {
  const links = new Set<string>()
  for (const a of points) {
    const near = points
      .filter((b) => b.index !== a.index && distance(a.pos, b.pos) <= max)
      .sort((p, q) => distance(p.pos, a.pos) - distance(q.pos, a.pos))
      .slice(0, 2)
    for (const b of near) links.add(a.index < b.index ? `${a.index}:${b.index}` : `${b.index}:${a.index}`)
  }
  return [...links].map((key) => key.split(':').map(Number) as [number, number])
}

export function buildScene(variant: Variant): Scene {
  const layout = LAYOUT[variant]
  const rand = mulberry32(SEED)
  const between = (limit: number) => (rand() * 2 - 1) * limit
  const total = BRAIN_NODES.length + layout.extras
  const k = layout.clusters.length

  const centroid = {
    x: BRAIN_NODES.reduce((s, p) => s + p.x, 0) / BRAIN_NODES.length,
    y: BRAIN_NODES.reduce((s, p) => s + p.y, 0) / BRAIN_NODES.length,
  }

  const nodes: SceneNode[] = Array.from({ length: total }, (_, i) => {
    const isBrain = i < BRAIN_NODES.length
    const extraIndex = i - BRAIN_NODES.length
    const ringAngle = (extraIndex / layout.extras) * Math.PI * 2
    const brain = isBrain
      ? BRAIN_NODES[i]
      : { x: Math.cos(ringAngle) * RING.radius, y: Math.sin(ringAngle) * RING.radius }
    const cluster = isBrain || extraIndex < layout.clustered ? i % k : -1
    const angle = rand() * Math.PI * 2
    const dist = layout.clusterRadius * Math.sqrt(rand())
    const centre = layout.clusters[Math.max(cluster, 0)]
    return {
      brain,
      scatter: { x: between(layout.scatter.x), y: between(layout.scatter.y) },
      clusterPos: { x: centre.x + Math.cos(angle) * dist, y: centre.y + Math.sin(angle) * dist },
      cluster,
      drift: { phase: rand() * Math.PI * 2, speed: 0.25 + rand() * 0.35 },
      isBrain,
      hemisphere: isBrain ? hemisphereOf(brain, centroid) : null,
      isHub: !isBrain && extraIndex < k,
    }
  })

  const clusterEdges = Array.from({ length: k }, (_, c) =>
    clusterLinks(nodes.flatMap((n, index) => (n.cluster === c ? [{ index, pos: n.clusterPos }] : []))),
  ).flat()

  const scatterEdges = nearLinks(
    nodes.map((n, index) => ({ index, pos: n.scatter })),
    layout.linkMax,
  )

  return {
    variant,
    nodes,
    clusterEdges,
    scatterEdges,
    scatterLinkMax: layout.linkMax,
    clusterCount: k,
    scatterBounds: layout.scatter,
    splitNormal: SPLIT_NORMAL,
  }
}
