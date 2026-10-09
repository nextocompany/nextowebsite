import { RING } from '@/lib/network/brain'
import { frameAt, type Frame, type RingArc, type Tone } from '@/lib/network/frame'
import { buildScene, type Variant } from '@/lib/network/scene'
import { STAGE_EXTENT, STAGE_STATE, STROKE, type StageName } from '@/lib/network/stages'

const round = (v: number) => Math.round(v * 10000) / 10000

function paint(tone: Tone, amount: number): string {
  if (tone === 'ink' || amount <= 0) return 'var(--ink)'
  if (amount >= 1) return `var(--${tone})`
  return `color-mix(in srgb, var(--${tone}) ${Math.round(amount * 100)}%, var(--ink))`
}

function arcPath({ cx, cy, start, end }: RingArc): string {
  const r = RING.radius
  const point = (a: number) => `${round(cx + Math.cos(a) * r)} ${round(cy + Math.sin(a) * r)}`
  const large = end - start > Math.PI ? 1 : 0
  return `M ${point(start)} A ${r} ${r} 0 ${large} 1 ${point(end)}`
}

function FrameSvg({ frame, extentX, extentY, className }: { frame: Frame; extentX: number; extentY: number; className: string }) {
  return (
    <svg
      viewBox={`${-extentX} ${-extentY} ${extentX * 2} ${extentY * 2}`}
      preserveAspectRatio="xMidYMid meet"
      className={`network-still size-full ${className}`}
      focusable="false"
    >
      {frame.ring.alpha > 0 &&
        frame.ring.arcs.map((arc) => (
          <path
            key={arc.tone}
            d={arcPath(arc)}
            fill="none"
            stroke={`var(--${arc.tone})`}
            strokeWidth={RING.width}
            opacity={frame.ring.alpha}
          />
        ))}
      {frame.edges
        .filter((e) => e.alpha > 0)
        .map((e) => (
          <line
            key={`${e.a}-${e.b}`}
            x1={round(frame.nodes[e.a].x)}
            y1={round(frame.nodes[e.a].y)}
            x2={round(frame.nodes[e.b].x)}
            y2={round(frame.nodes[e.b].y)}
            stroke={paint(e.tone, e.toneAmount)}
            strokeWidth={STROKE.edge}
            strokeLinecap="round"
            opacity={e.alpha}
          />
        ))}
      {frame.nodes
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => n.alpha > 0)
        .map(({ n, i }) => (
          <circle key={i} cx={round(n.x)} cy={round(n.y)} r={round(n.r)} fill={paint(n.tone, n.toneAmount)} opacity={n.alpha} />
        ))}
    </svg>
  )
}

const VARIANTS: ReadonlyArray<{ variant: Variant; className: string }> = [
  { variant: 'narrow', className: 'md:hidden' },
  { variant: 'wide', className: 'hidden md:block' },
]

/**
 * A stage box the network is drawn in. Server-renders the still frame as SVG
 * (no-JS, reduced motion); NetworkCanvas hides it and animates over the box.
 */
export function NetworkStage({ name, className = '' }: { name: StageName; className?: string }) {
  return (
    <div data-stage={name} aria-hidden="true" className={`relative ${className}`}>
      {VARIANTS.map(({ variant, className: visibility }) => {
        const extent = STAGE_EXTENT[name][variant]
        return (
          <FrameSvg
            key={variant}
            frame={frameAt(STAGE_STATE[name], buildScene(variant))}
            extentX={extent.x}
            extentY={extent.y}
            className={visibility}
          />
        )
      })}
    </div>
  )
}
