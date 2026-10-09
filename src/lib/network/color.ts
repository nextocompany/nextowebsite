export type Rgb = readonly [number, number, number]

/** Reads a token value such as "#00b0b6"; null if it isn't hex. */
export function parseHex(value: string): Rgb | null {
  const hex = value.trim().replace(/^#/, '')
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as unknown as Rgb
}

export function mixHex(a: Rgb, b: Rgb, t: number): string {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${c[0]} ${c[1]} ${c[2]})`
}
