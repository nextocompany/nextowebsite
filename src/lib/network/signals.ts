import type { Frame, Tone } from './frame'
import { easeInOutSine, lerp, mulberry32 } from './math'

/**
 * Signal pulses: a few dots of light travel along the network's lines and
 * light up the node they reach, which then fades back. Teal carries data,
 * coral carries people (the meaning the split beat gives the two colours).
 */
export const SIGNAL = {
  /** Pulses that can run at once. */
  slots: 4,
  /** Seconds per pulse: travel, then the node it reached glows and fades. */
  period: 2.6,
  /** Share of the period spent travelling. */
  travel: 0.55,
  /** Lines fainter than this carry nothing. */
  minEdgeAlpha: 0.3,
  /** Picks per cycle before a slot rests (most lines are hidden in any one beat). */
  tries: 16,
  /** The network counts as connected (pulses travel) from this level of detail up. */
  connectedDetail: 0.9,
  /** Anvira's monitor sweep: its own slot, crossing the whole trace in this many seconds. */
  sweepSlot: -1,
  sweepPeriod: 2.4,
} as const

const SEED = 4404

export type SignalTone = Exclude<Tone, 'ink'>

export interface Pulse {
  slot: number
  edge: number
  /** Brain units, like the frame's nodes. */
  x: number
  y: number
  tone: SignalTone
  alpha: number
}

export interface Glow {
  node: number
  tone: SignalTone
  /** 0..1 mix towards the tone. */
  amount: number
}

export interface Signals {
  pulses: Pulse[]
  glows: Glow[]
}

const accent = (tone: Tone): SignalTone | null => (tone === 'ink' ? null : tone)

/** Same slot and cycle, same choices: frames and tests repeat exactly. */
const randomFor = (slot: number, cycle: number) => mulberry32(SEED + slot * 7919 + cycle * 104729)

function pickVisible(count: number, visible: (i: number) => boolean, random: () => number): number {
  for (let i = 0; i < SIGNAL.tries; i++) {
    const candidate = Math.floor(random() * count)
    if (visible(candidate)) return candidate
  }
  return -1
}

export function signalsAt(frame: Frame, time: number): Signals {
  const pulses: Pulse[] = []
  const glows: Glow[] = []
  const travels = frame.detail >= SIGNAL.connectedDetail

  for (let slot = 0; slot < SIGNAL.slots; slot++) {
    const phase = time / SIGNAL.period + slot / SIGNAL.slots
    const cycle = Math.floor(phase)
    const p = phase - cycle
    const random = randomFor(slot, cycle)
    const coin = random() < 0.5 ? 'teal' : 'coral'

    if (!travels) {
      // Scattered hero: nothing is connected yet, so nodes only glow softly.
      const node = pickVisible(frame.nodes.length, (i) => frame.nodes[i].alpha >= SIGNAL.minEdgeAlpha, random)
      const amount = Math.sin(Math.PI * p)
      if (node >= 0 && amount > 0) glows.push({ node, tone: coin, amount })
      continue
    }

    const edgeIndex = pickVisible(frame.edges.length, (i) => frame.edges[i].alpha >= SIGNAL.minEdgeAlpha, random)
    if (edgeIndex < 0) continue
    const edge = frame.edges[edgeIndex]
    const toneA = accent(frame.nodes[edge.a].tone)
    const toneB = accent(frame.nodes[edge.b].tone)
    const tone: SignalTone = toneA && toneB && toneA === toneB ? toneA : (toneA ?? toneB ?? coin)
    // Product shapes flow one way: into Endyra's lens, left to right along Anvira's trace.
    // Elsewhere, leave from the end that owns the colour, so data flows out of the data side.
    const directed = edge.kind === 'spoke' || edge.kind === 'trace'
    const fromA = directed || toneA === tone || (toneB !== tone && random() < 0.5)
    const [from, to] = fromA ? [edge.a, edge.b] : [edge.b, edge.a]
    const start = frame.nodes[from]
    const end = frame.nodes[to]

    if (p < SIGNAL.travel) {
      const s = easeInOutSine(p / SIGNAL.travel)
      pulses.push({
        slot,
        edge: edgeIndex,
        x: lerp(start.x, end.x, s),
        y: lerp(start.y, end.y, s),
        tone,
        alpha: edge.alpha * Math.min(1, p / 0.06),
      })
    } else if (end.alpha > 0) {
      const fade = 1 - (p - SIGNAL.travel) / (1 - SIGNAL.travel)
      glows.push({ node: to, tone, amount: Math.max(easeInOutSine(fade), 1e-3) })
    }
  }
  const sweep = sweepAt(frame, time)
  return { pulses: sweep ? [...pulses, sweep] : pulses, glows }
}

/** One coral dot running the length of Anvira's trace and starting again, like a monitor. */
function sweepAt(frame: Frame, time: number): Pulse | null {
  const segments = frame.trace.slice(1).map((b, k) => {
    const a = frame.trace[k]
    const edge = frame.edges.findIndex((e) => e.kind === 'trace' && e.a === a && e.b === b)
    const pa = frame.nodes[a]
    const pb = frame.nodes[b]
    return { edge, pa, pb, length: Math.hypot(pb.x - pa.x, pb.y - pa.y) }
  })
  const alpha = Math.min(...segments.map((s) => (s.edge >= 0 ? frame.edges[s.edge].alpha : 0)))
  if (segments.length === 0 || !(alpha >= SIGNAL.minEdgeAlpha)) return null
  const total = segments.reduce((sum, s) => sum + s.length, 0)
  let along = ((time / SIGNAL.sweepPeriod) % 1) * total
  for (const s of segments) {
    if (along <= s.length || s === segments[segments.length - 1]) {
      const t = s.length > 0 ? Math.min(along / s.length, 1) : 0
      return { slot: SIGNAL.sweepSlot, edge: s.edge, x: lerp(s.pa.x, s.pb.x, t), y: lerp(s.pa.y, s.pb.y, t), tone: 'coral', alpha }
    }
    along -= s.length
  }
  return null
}
