import { frameAt, type Frame, type Tone } from '@/lib/network/frame'
import { buildScene, type Variant } from '@/lib/network/scene'
import { STAGE_EXTENT, STAGE_FIT, STAGE_STATE, STROKE, type StageFit, type StageName } from '@/lib/network/stages'

const round = (v: number) => Math.round(v * 10000) / 10000

function paint(tone: Tone, amount: number): string {
  if (tone === 'ink' || amount <= 0) return 'var(--ink)'
  if (amount >= 1) return `var(--${tone})`
  return `color-mix(in srgb, var(--${tone}) ${Math.round(amount * 100)}%, var(--ink))`
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

function StillFrames({ name }: { name: StageName }) {
  return VARIANTS.map(({ variant, className: visibility }) => {
    const extent = STAGE_EXTENT[name][variant]
    return (
      <FrameSvg
        key={variant}
        frame={frameAt(STAGE_STATE[name], buildScene(variant))}
        extentX={extent.x}
        extentY={extent.y}
        fit={STAGE_FIT[name]}
        className={`network-still ${visibility}`}
      />
    )
  })
}

/**
 * A stage box the network is drawn in. Server-renders the still frame as SVG
 * (no-JS, reduced motion); NetworkCanvas hides it and animates over the box.
 */
interface NetworkStageProps {
  name: StageName
  className?: string
  /**
   * On narrow screens with motion on, the stage holds the top half of the screen
   * while its section's text passes (a pin). 'continue' carries on the previous
   * pin: the network is already up there, so the text starts right away.
   */
  hold?: boolean | 'continue'
}

export function NetworkStage({ name, className = '', hold = false }: NetworkStageProps) {
  return (
    <div data-stage={name} data-hold={hold === 'continue' ? 'continue' : hold || undefined} aria-hidden="true" className={className}>
      <StillFrames name={name} />
    </div>
  )
}
