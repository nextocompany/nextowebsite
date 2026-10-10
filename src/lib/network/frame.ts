import { easeInOutCubic, lerp, smoothstep, window01 } from './math'
import { distance } from './point'
import { PRODUCT, type Scene } from './scene'

/**
 * Each beat as 0..1. form: scattered → one network; split: data and people
 * pull apart; start: a wave spreads from one node (where the work happens);
 * connect: outer nodes link in; grow: partner groups join at the rim;
 * cluster: the network opens into clusters; shape: the two product clusters
 * take their product's shape (Endyra ring, Anvira trace); reach: lines to the
 * partner names.
 */
export interface BeatState {
  form: number
  split: number
  start: number
  connect: number
  grow: number
  cluster: number
  shape: number
  reach: number
  /** Seconds, for the drift of the scattered network. */
  time?: number
}

export type Tone = 'ink' | 'teal' | 'coral'

export interface FrameNode {
  x: number
  y: number
  r: number
  alpha: number
  /** Accent colour; drawn as a mix from ink by `toneAmount` (0 = plain ink). */
  tone: Tone
  toneAmount: number
}

export type EdgeKind = 'core' | 'cluster' | 'satellite' | 'scatter' | 'partner' | 'ring' | 'spoke' | 'trace'

export interface FrameEdge {
  kind: EdgeKind
  a: number
  b: number
  alpha: number
  tone: Tone
  toneAmount: number
}

export interface Frame {
  nodes: FrameNode[]
  edges: FrameEdge[]
  /** Anvira's nodes left to right, for the monitor sweep. */
  trace: ReadonlyArray<number>
  reach: number
  /** Size factor for dots and lines: the scattered hero network is drawn finer. */
  detail: number
}

const SPLIT_DISTANCE = 0.35
const NODE_RADIUS = 0.04
const DRIFT = 0.07
const SCATTER_EDGE = 0.5
const SCATTER_DETAIL = 0.35
/** Links between data and people stay visible in the split beat, dimmed. */
const BRIDGE = 0.35
/** Nodes of the product shapes shrink so the shape's lines read first. */
const SHAPE_NODE = 0.7
/** Half-width of the start wave's bright band, in brain units. */
const WAVE_WIDTH = 0.25

export function frameAt(state: BeatState, scene: Scene): Frame {
  const form = easeInOutCubic(state.form)
  const split = easeInOutCubic(state.split)
  const connect = easeInOutCubic(state.connect)
  const grow = easeInOutCubic(state.grow)
  const cluster = easeInOutCubic(state.cluster)
  const shape = easeInOutCubic(state.shape)
  const shown = shape * cluster
  const united = smoothstep(0.55, 1, state.form)
  const time = state.time ?? 0
  const drift = DRIFT * (1 - form)
  const detail = lerp(SCATTER_DETAIL, 1, form)
  const litByWave = startWave(state.start, scene)

  const nodes = scene.nodes.map((n): FrameNode => {
    // Offset from time 0, so a still frame sits exactly on the scatter.
    const wave = (shift: number) =>
      Math.sin(time * n.drift.speed + n.drift.phase + shift) - Math.sin(n.drift.phase + shift)
    const side = n.kind === 'people' ? 1 : n.kind === 'data' ? -1 : 0
    const ux = lerp(n.scatter.x + drift * wave(0), n.united.x, form) + side * SPLIT_DISTANCE * split
    const uy = lerp(n.scatter.y + drift * wave(1.7), n.united.y, form)
    const linked = n.role === 'outer' ? connect : 0
    const lx = lerp(ux, n.satellite.x, linked)
    const ly = lerp(uy, n.satellite.y, linked)
    // Ambient nodes come back as partner groups at the rim (grow), then leave with the clusters.
    const gx = n.role === 'ambient' ? lerp(lx, n.partnerPos.x, grow) : lx
    const gy = n.role === 'ambient' ? lerp(ly, n.partnerPos.y, grow) : ly
    const tx = n.cluster >= 0 ? lerp(n.clusterPos.x, n.shapePos.x, shape) : gx
    const ty = n.cluster >= 0 ? lerp(n.clusterPos.y, n.shapePos.y, shape) : gy

    const formAlpha = n.role === 'core' ? 1 : n.role === 'ambient' ? Math.max(1 - united, grow) : 1 - united
    const alpha = n.cluster >= 0 ? lerp(lerp(formAlpha, 1, linked), 1, cluster) : formAlpha * (1 - cluster)
    const tone: Tone = n.kind === 'people' ? 'coral' : n.kind === 'data' || n.isHub ? 'teal' : 'ink'
    const toneAmount = n.kind ? split : n.isHub ? cluster : 0
    const lit = litByWave(n)

    return {
      x: lerp(gx, tx, cluster),
      y: lerp(gy, ty, cluster),
      r: NODE_RADIUS * detail * (n.isHub ? lerp(1, 1.5, cluster) : 1) * (isProduct(n.cluster) ? lerp(1, SHAPE_NODE, shown) : 1),
      alpha,
      ...productTone(n.cluster, shown, lit > toneAmount ? { tone: 'teal', toneAmount: lit } : { tone, toneAmount }),
    }
  })

  const coreEdges = scene.coreEdges.map(([a, b]): FrameEdge => {
    const ka = scene.nodes[a].kind
    const sameSide = ka === scene.nodes[b].kind
    return {
      kind: 'core',
      a,
      b,
      alpha: united * (1 - cluster) * (sameSide ? 1 : lerp(1, BRIDGE, split)),
      tone: sameSide ? (ka === 'people' ? 'coral' : 'teal') : 'ink',
      toneAmount: sameSide ? split : 0,
    }
  })

  const plain = (kind: EdgeKind, alpha: number) => ([a, b]: readonly [number, number]): FrameEdge => ({
    kind,
    a,
    b,
    alpha,
    tone: 'ink',
    toneAmount: 0,
  })

  return {
    nodes,
    edges: [
      ...coreEdges,
      ...scene.clusterEdges.map(([a, b]) => plain('cluster', isProduct(scene.nodes[a].cluster) ? cluster * (1 - shape) : cluster)([a, b])),
      ...scene.shapeEdges.map((e): FrameEdge => ({
        kind: e.kind,
        a: e.a,
        b: e.b,
        alpha: shown,
        tone: e.kind === 'trace' ? 'coral' : 'teal',
        toneAmount: shape,
      })),
      ...scene.satelliteEdges.map(plain('satellite', connect * (1 - cluster))),
      ...scene.partnerEdges.map(plain('partner', grow * (1 - cluster))),
      ...scene.scatterEdges.map(plain('scatter', SCATTER_EDGE * (1 - smoothstep(0, 0.6, state.form)))),
    ],
    trace: scene.trace,
    reach: state.reach,
    detail,
  }
}

/**
 * How we work, step 1: a teal band spreads from the origin node across the core
 * as `start` goes 0 → 1, and is gone once it has passed (start 1 leaves no colour).
 */
function startWave(start: number, scene: Scene): (n: Scene['nodes'][number]) => number {
  const strength = window01(start, 0, 0.06, 0.8, 1)
  if (strength <= 0) return () => 0
  const origin = scene.nodes[scene.origin].united
  const far = Math.max(...scene.nodes.filter((n) => n.role === 'core').map((n) => distance(n.united, origin)))
  const front = start * (far + WAVE_WIDTH)
  return (n) => {
    if (n.role !== 'core') return 0
    const off = (distance(n.united, origin) - front) / WAVE_WIDTH
    return strength * Math.exp(-off * off)
  }
}

const PRODUCT_TONE: Readonly<Record<number, Tone>> = { [PRODUCT.endyra]: 'teal', [PRODUCT.anvira]: 'coral' }
const isProduct = (cluster: number) => cluster in PRODUCT_TONE

/**
 * Endyra's nodes turn teal and Anvira's coral as their shapes form. A node already
 * in the other accent (Anvira's hub) fades to ink first, so colours never jump.
 */
function productTone(
  cluster: number,
  shown: number,
  base: { tone: Tone; toneAmount: number },
): { tone: Tone; toneAmount: number } {
  const tone = PRODUCT_TONE[cluster]
  if (!tone || shown <= 0) return base
  if (base.tone === tone || base.toneAmount <= 0) {
    return { tone, toneAmount: Math.max(base.tone === tone ? base.toneAmount : 0, shown) }
  }
  return shown < 0.5
    ? { tone: base.tone, toneAmount: base.toneAmount * (1 - 2 * shown) }
    : { tone, toneAmount: 2 * shown - 1 }
}
