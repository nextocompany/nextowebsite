/**
 * Beyond: a teal signal runs down each partner line in turn; when it arrives,
 * that partner's name lights up and fades back. One partner at a time.
 */
export const REACH_SIGNAL = {
  /** Seconds for the signal to visit every partner once. */
  period: 4.8,
  /** Share of each partner's turn spent travelling, then lit. */
  travel: 0.18,
  lit: 0.22,
} as const

export interface ReachSignal {
  /** 0..1 along the line; 1 once arrived. */
  along: number
  /** Whether the dot is on its way (draw it). */
  travelling: boolean
  /** 0..1 brightness of the partner's name. */
  lit: number
}

const IDLE: ReachSignal = { along: 0, travelling: false, lit: 0 }

export function reachSignalsAt(time: number, count: number): ReachSignal[] {
  return Array.from({ length: count }, (_, i) => {
    const phase = (((time / REACH_SIGNAL.period - i / count) % 1) + 1) % 1
    if (phase < REACH_SIGNAL.travel) return { along: phase / REACH_SIGNAL.travel, travelling: true, lit: 0 }
    const after = phase - REACH_SIGNAL.travel
    if (after < REACH_SIGNAL.lit) {
      const fade = 1 - after / REACH_SIGNAL.lit
      return { along: 1, travelling: false, lit: fade * fade * (3 - 2 * fade) }
    }
    return IDLE
  })
}
