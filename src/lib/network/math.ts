export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2

/** 0 below `from`, 1 above `to`, eased in between. */
export function smoothstep(from: number, to: number, v: number): number {
  const t = clamp01((v - from) / (to - from))
  return t * t * (3 - 2 * t)
}

/** Rises over [a, b], holds 1 over [b, c], falls over [c, d]. */
export const window01 = (v: number, a: number, b: number, c: number, d: number): number =>
  smoothstep(a, b, v) * (1 - smoothstep(c, d, v))

/** Small seeded PRNG so the scatter looks the same on every visit and in tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
