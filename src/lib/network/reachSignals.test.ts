import { describe, expect, it } from 'vitest'
import { REACH_SIGNAL, reachSignalsAt } from './reachSignals'

const times = Array.from({ length: 400 }, (_, i) => i * 0.05)

describe('reachSignalsAt', () => {
  it('sends one signal per partner line, each travelling then lighting the name', () => {
    for (const t of times) {
      const signals = reachSignalsAt(t, 4)
      expect(signals).toHaveLength(4)
      for (const s of signals) {
        expect(s.along).toBeGreaterThanOrEqual(0)
        expect(s.along).toBeLessThanOrEqual(1)
        expect(s.lit).toBeGreaterThanOrEqual(0)
        expect(s.lit).toBeLessThanOrEqual(1)
        // A name only lights once its signal has arrived.
        if (s.lit > 0) expect(s.along).toBe(1)
      }
    }
  })

  it('reaches the partners one at a time, not all at once', () => {
    for (const t of times) {
      const arriving = reachSignalsAt(t, 4).filter((s) => s.lit > 0.9)
      expect(arriving.length).toBeLessThanOrEqual(1)
    }
  })

  it('lights every partner over one period', () => {
    const lit = new Set<number>()
    for (let t = 0; t < REACH_SIGNAL.period; t += 0.02) {
      reachSignalsAt(t, 4).forEach((s, i) => s.lit > 0.5 && lit.add(i))
    }
    expect(lit).toEqual(new Set([0, 1, 2, 3]))
  })

  it('moves forward along the line without jumping', () => {
    for (let t = 0; t < 10; t += 0.01) {
      const now = reachSignalsAt(t, 4)
      const next = reachSignalsAt(t + 0.005, 4)
      now.forEach((s, i) => {
        if (next[i].along >= s.along) expect(next[i].along - s.along).toBeLessThan(0.05)
      })
    }
  })

  it('has nothing to send with no partners', () => {
    expect(reachSignalsAt(3, 0)).toEqual([])
  })
})
