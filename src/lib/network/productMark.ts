import type { Point } from './point'
import { buildScene, PRODUCT, type ShapeEdge } from './scene'

export interface ProductMark {
  /** Node positions, shifted so the shape's box starts at 0,0. */
  readonly points: ReadonlyArray<Point>
  readonly edges: ReadonlyArray<{ readonly kind: ShapeEdge['kind']; readonly a: number; readonly b: number }>
  /** Index into points of Endyra's lens; -1 for Anvira. */
  readonly lens: number
  readonly width: number
  readonly height: number
}

/**
 * A product's own shape from the network story, on its own: Endyra's ring
 * with spokes into the lens, Anvira's monitor trace. Same nodes and lines the
 * home page forms in Products, taken from the wide scene.
 */
export function productMark(product: keyof typeof PRODUCT, pad = 0.08): ProductMark {
  const scene = buildScene('wide')
  const members = scene.nodes.flatMap((n, i) => (n.cluster === PRODUCT[product] ? [i] : []))
  const local = new Map(members.map((node, k) => [node, k]))
  const raw = members.map((i) => scene.nodes[i].shapePos)
  const minX = Math.min(...raw.map((p) => p.x)) - pad
  const minY = Math.min(...raw.map((p) => p.y)) - pad
  const maxX = Math.max(...raw.map((p) => p.x)) + pad
  const maxY = Math.max(...raw.map((p) => p.y)) + pad
  return {
    points: raw.map((p) => ({ x: p.x - minX, y: p.y - minY })),
    edges: scene.shapeEdges
      .filter((e) => local.has(e.a) && local.has(e.b))
      .map((e) => ({ kind: e.kind, a: local.get(e.a)!, b: local.get(e.b)! })),
    lens: local.get(scene.lens) ?? -1,
    width: maxX - minX,
    height: maxY - minY,
  }
}
