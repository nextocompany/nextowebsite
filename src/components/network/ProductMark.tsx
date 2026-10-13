import { productMark } from '@/lib/network/productMark'
import type { PRODUCT } from '@/lib/network/scene'

const NODE = 0.032
const LENS = 0.07
const EDGE = 0.014

/**
 * A product's shape from the network story (Endyra's lens, Anvira's monitor
 * trace), drawn in the page's accent colour. Anvira's spike carries the coral
 * dot from its logo. Static SVG, so it shows the same with or without motion.
 */
export function ProductMark({ product, className = '' }: { product: keyof typeof PRODUCT; className?: string }) {
  const { points, edges, lens, width, height } = productMark(product)
  const spike = product === 'anvira' ? points.reduce((top, p, i) => (p.y < points[top].y ? i : top), 0) : -1
  const round = (v: number) => Math.round(v * 10000) / 10000

  return (
    <svg
      viewBox={`0 0 ${round(width)} ${round(height)}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {edges.map((e, i) => (
        <line
          key={i}
          x1={round(points[e.a].x)}
          y1={round(points[e.a].y)}
          x2={round(points[e.b].x)}
          y2={round(points[e.b].y)}
          stroke="var(--accent)"
          strokeWidth={EDGE}
          strokeLinecap="round"
          opacity={e.kind === 'spoke' ? 0.55 : 1}
        />
      ))}
      {lens >= 0 && (
        <circle cx={round(points[lens].x)} cy={round(points[lens].y)} r={LENS * 1.9} fill="var(--accent)" opacity={0.18} />
      )}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={round(p.x)}
          cy={round(p.y)}
          r={i === lens ? LENS : NODE}
          fill={i === spike ? 'var(--coral)' : 'var(--accent)'}
        />
      ))}
    </svg>
  )
}
