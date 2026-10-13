export interface Point {
  readonly x: number
  readonly y: number
}

export const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y)
