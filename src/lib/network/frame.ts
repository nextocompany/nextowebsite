import { BRAIN_EDGES, BRAIN_NODE_RADIUS, RING_SPLIT } from './brain'
import { easeInOutCubic, lerp, smoothstep } from './math'
import type { Scene } from './scene'

/**
 * Each beat as 0..1. form: scattered → brain; split: the two hemispheres;
 * connect: outer nodes link into the brain; cluster: the network opens into
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

export interface FrameEdge {
  a: number
  b: number
  alpha: number
  tone: Tone
  toneAmount: number
}

export interface RingArc {
  tone: 'teal' | 'coral'
  cx: number
  cy: number
  /** Radians, y down; drawn clockwise from start to end. */
  start: number
  end: number
}

export interface Frame {
  nodes: FrameNode[]
  edges: FrameEdge[]
  ring: { alpha: number; arcs: [RingArc, RingArc] }
  reach: number
  /** Line-width factor: the full-screen network is drawn finer than the brain. */
  detail: number
}

const SPLIT_DISTANCE = 0.32
const EXTRA_RADIUS = 0.045
const DRIFT = 0.07
const SCATTER_EDGE = 0.55
/** Dots and lines of the scattered network, relative to the brain's. */
const SCATTER_DETAIL = 0.3

export function frameAt(state: BeatState, scene: Scene): Frame {
  const form = easeInOutCubic(state.form)
  const split = easeInOutCubic(state.split)
  const cluster = easeInOutCubic(state.cluster)
  const connect = easeInOutCubic(state.connect)
  const { splitNormal } = scene
  const formedAlpha = smoothstep(0.55, 1, state.form)
  const time = state.time ?? 0
  const drift = DRIFT * (1 - form)
  const detail = lerp(SCATTER_DETAIL, 1, form)

  const nodes = scene.nodes.map((n): FrameNode => {
    const side = n.hemisphere === 'human' ? 1 : n.hemisphere === 'logic' ? -1 : 0
    const push = side * SPLIT_DISTANCE * split
    // Offset from time 0, so a still frame sits exactly on the scatter.
    const wave = (shift: number) =>
      Math.sin(time * n.drift.speed + n.drift.phase + shift) - Math.sin(n.drift.phase + shift)
    const fx = lerp(n.scatter.x + drift * wave(0), n.brain.x, form) + splitNormal.x * push
    const fy = lerp(n.scatter.y + drift * wave(1.7), n.brain.y, form) + splitNormal.y * push
    const linked = n.cluster >= 0 ? connect : 0
    const lx = lerp(fx, n.satellite.x, n.isBrain ? 0 : linked)
    const ly = lerp(fy, n.satellite.y, n.isBrain ? 0 : linked)
    const target = n.cluster >= 0 ? n.clusterPos : { x: lx, y: ly }
    const formAlpha = n.isBrain ? 1 : 1 - formedAlpha
    return {
      x: lerp(lx, target.x, cluster),
      y: lerp(ly, target.y, cluster),
      r:
        detail *
        lerp(n.isBrain ? BRAIN_NODE_RADIUS : EXTRA_RADIUS, n.isHub ? BRAIN_NODE_RADIUS : EXTRA_RADIUS * 1.2, cluster),
      alpha: n.cluster >= 0 ? lerp(lerp(formAlpha, 1, linked), 1, cluster) : formAlpha * (1 - cluster),
      tone: n.hemisphere === 'human' ? 'coral' : n.isBrain || n.isHub ? 'teal' : 'ink',
      toneAmount: n.isBrain ? split : n.isHub ? cluster : 0,
    }
  })

  const brainEdges = BRAIN_EDGES.map(([a, b]): FrameEdge => {
    const ha = scene.nodes[a].hemisphere
    const sameSide = ha === scene.nodes[b].hemisphere
    const tone: Tone = ha === 'human' ? 'coral' : 'teal'
    return {
      a,
      b,
      alpha: formedAlpha * (1 - cluster) * (sameSide ? 1 : 1 - split),
      tone: sameSide ? tone : 'ink',
      toneAmount: sameSide ? split : 0,
    }
  })

  const clusterEdges = scene.clusterEdges.map(
    ([a, b]): FrameEdge => ({ a, b, alpha: cluster, tone: 'ink', toneAmount: 0 }),
  )

  const satelliteEdges = scene.satelliteEdges.map(
    ([a, b]): FrameEdge => ({ a, b, alpha: connect * (1 - cluster), tone: 'ink', toneAmount: 0 }),
  )

  const scatterAlpha = SCATTER_EDGE * (1 - smoothstep(0, 0.6, state.form))
  const scatterEdges = scene.scatterEdges.map(
    ([a, b]): FrameEdge => ({ a, b, alpha: scatterAlpha, tone: 'ink', toneAmount: 0 }),
  )

  return {
    nodes,
    edges: [...brainEdges, ...clusterEdges, ...satelliteEdges, ...scatterEdges],
    ring: { alpha: formedAlpha * (1 - cluster), arcs: ringArcs(SPLIT_DISTANCE * split, splitNormal) },
    reach: state.reach,
    detail,
  }
}

/** The O's two coloured arcs; in beat 2 each half moves with its hemisphere. */
function ringArcs(offset: number, normal: { x: number; y: number }): [RingArc, RingArc] {
  const { tealStart, coralStart } = RING_SPLIT
  const turn = Math.PI * 2
  return [
    { tone: 'teal', cx: -normal.x * offset, cy: -normal.y * offset, start: tealStart, end: coralStart + turn },
    { tone: 'coral', cx: normal.x * offset, cy: normal.y * offset, start: coralStart + turn, end: tealStart + turn },
  ]
}
