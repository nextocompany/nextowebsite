import { easeInOutCubic, lerp, smoothstep } from './math'
import type { Scene } from './scene'

/**
 * Each beat as 0..1. form: scattered → one network; split: data and people
 * pull apart; connect: outer nodes link in; cluster: the network opens into
 * clusters; reach: lines to the partner names.
 */
export interface BeatState {
  form: number
  split: number
  connect: number
  cluster: number
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

export type EdgeKind = 'core' | 'cluster' | 'satellite' | 'scatter'

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

export function frameAt(state: BeatState, scene: Scene): Frame {
  const form = easeInOutCubic(state.form)
  const split = easeInOutCubic(state.split)
  const connect = easeInOutCubic(state.connect)
  const cluster = easeInOutCubic(state.cluster)
  const united = smoothstep(0.55, 1, state.form)
  const time = state.time ?? 0
  const drift = DRIFT * (1 - form)
  const detail = lerp(SCATTER_DETAIL, 1, form)

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
    const tx = n.cluster >= 0 ? n.clusterPos.x : lx
    const ty = n.cluster >= 0 ? n.clusterPos.y : ly

    const formAlpha = n.role === 'core' ? 1 : 1 - united
    const alpha = n.cluster >= 0 ? lerp(lerp(formAlpha, 1, linked), 1, cluster) : formAlpha * (1 - cluster)

    return {
      x: lerp(lx, tx, cluster),
      y: lerp(ly, ty, cluster),
      r: NODE_RADIUS * detail * (n.isHub ? lerp(1, 1.5, cluster) : 1),
      alpha,
      tone: n.kind === 'people' ? 'coral' : n.kind === 'data' || n.isHub ? 'teal' : 'ink',
      toneAmount: n.kind ? split : n.isHub ? cluster : 0,
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
      ...scene.clusterEdges.map(plain('cluster', cluster)),
      ...scene.satelliteEdges.map(plain('satellite', connect * (1 - cluster))),
      ...scene.scatterEdges.map(plain('scatter', SCATTER_EDGE * (1 - smoothstep(0, 0.6, state.form)))),
    ],
    reach: state.reach,
    detail,
  }
}
