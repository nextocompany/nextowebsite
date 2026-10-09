import { BRAIN_EDGES, BRAIN_NODE_RADIUS, RING_SPLIT } from './brain'
import { easeInOutCubic, lerp, smoothstep } from './math'
import type { Scene } from './scene'

/** Each beat as 0..1. form: beat 1, split: beat 2, cluster: beat 3, reach: beat 4. */
export interface BeatState {
  form: number
  split: number
  cluster: number
  reach: number
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
}

const SPLIT_DISTANCE = 0.32
const EXTRA_RADIUS = 0.045

export function frameAt(state: BeatState, scene: Scene): Frame {
  const form = easeInOutCubic(state.form)
  const split = easeInOutCubic(state.split)
  const cluster = easeInOutCubic(state.cluster)
  const { splitNormal } = scene
  const formedAlpha = smoothstep(0.55, 1, state.form)

  const nodes = scene.nodes.map((n): FrameNode => {
    const side = n.hemisphere === 'human' ? 1 : n.hemisphere === 'logic' ? -1 : 0
    const push = side * SPLIT_DISTANCE * split
    const fx = lerp(n.scatter.x, n.brain.x, form) + splitNormal.x * push
    const fy = lerp(n.scatter.y, n.brain.y, form) + splitNormal.y * push
    const formAlpha = n.isBrain ? 1 : 1 - formedAlpha
    return {
      x: lerp(fx, n.clusterPos.x, cluster),
      y: lerp(fy, n.clusterPos.y, cluster),
      r: lerp(n.isBrain ? BRAIN_NODE_RADIUS : EXTRA_RADIUS, n.isHub ? BRAIN_NODE_RADIUS : EXTRA_RADIUS * 1.2, cluster),
      alpha: lerp(formAlpha, 1, cluster),
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

  return {
    nodes,
    edges: [...brainEdges, ...clusterEdges],
    ring: { alpha: formedAlpha * (1 - cluster), arcs: ringArcs(SPLIT_DISTANCE * split, splitNormal) },
    reach: state.reach,
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
