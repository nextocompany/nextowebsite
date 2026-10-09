import type { Point } from './brain'

/** The first `t` (0..1) of a polyline, measured by length. */
export function polylineAt(points: ReadonlyArray<Point>, t: number): Point[] {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y))
  let remaining = lengths.reduce((s, l) => s + l, 0) * Math.min(Math.max(t, 0), 1)
  const out: Point[] = [points[0]]
  for (let i = 0; i < lengths.length; i++) {
    const a = points[i]
    const b = points[i + 1]
    if (remaining >= lengths[i]) {
      out.push(b)
      remaining -= lengths[i]
      continue
    }
    if (remaining > 0) {
      const k = remaining / lengths[i]
      out.push({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k })
    }
    break
  }
  return out
}
