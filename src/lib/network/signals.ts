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
    // Leave from the end that owns the colour, so data flows out of the data side.
    const fromA = toneA === tone || (toneB !== tone && random() < 0.5)
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
  return { pulses, glows }
}
