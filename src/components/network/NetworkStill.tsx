import { RING } from '@/lib/network/brain'
import { frameAt, type Frame, type RingArc, type Tone } from '@/lib/network/frame'
import { buildScene, type Variant } from '@/lib/network/scene'
import { STAGE_EXTENT, STAGE_FIT, STAGE_STATE, STROKE, type StageFit, type StageName } from '@/lib/network/stages'

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

interface FrameSvgProps {
  frame: Frame
  extentX: number
  extentY: number
  fit: StageFit
  className: string
}

function FrameSvg({ frame, extentX, extentY, fit, className }: FrameSvgProps) {
  return (
    <svg
      viewBox={`${-extentX} ${-extentY} ${extentX * 2} ${extentY * 2}`}
      preserveAspectRatio={fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'}
      className={`size-full ${className}`}
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
        .map((e, i) => ({ e, i }))
        .filter(({ e }) => e.alpha > 0)
        .map(({ e, i }) => (
          <line
            key={i}
            x1={round(frame.nodes[e.a].x)}
            y1={round(frame.nodes[e.a].y)}
            x2={round(frame.nodes[e.b].x)}
            y2={round(frame.nodes[e.b].y)}
            stroke={paint(e.tone, e.toneAmount)}
            strokeWidth={STROKE.edge * frame.detail}
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

function StillFrames({ name, still }: { name: StageName; still: boolean }) {
  return VARIANTS.map(({ variant, className: visibility }) => {
    const extent = STAGE_EXTENT[name][variant]
    return (
      <FrameSvg
        key={variant}
        frame={frameAt(STAGE_STATE[name], buildScene(variant))}
        extentX={extent.x}
        extentY={extent.y}
        fit={STAGE_FIT[name]}
        className={`${still ? 'network-still ' : ''}${visibility}`}
      />
    )
  })
}

/**
 * A stage box the network is drawn in. Server-renders the still frame as SVG
 * (no-JS, reduced motion); NetworkCanvas hides it and animates over the box.
 */
export function NetworkStage({ name, className = '' }: { name: StageName; className?: string }) {
  return (
    <div data-stage={name} aria-hidden="true" className={className}>
      <StillFrames name={name} still />
    </div>
  )
}

/** A stage's still frame as plain decoration: never animated, never hidden by the canvas. */
export function NetworkBackdrop({ name, className = '' }: { name: StageName; className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <StillFrames name={name} still={false} />
    </div>
  )
}
