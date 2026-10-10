import type { Point } from '@/lib/network/point'
import { mixHex, type Rgb } from '@/lib/network/color'
import type { Frame, Tone } from '@/lib/network/frame'
import { polylineAt } from '@/lib/network/path'
import type { StageRect } from '@/lib/network/progress'
import type { Signals } from '@/lib/network/signals'
import { STROKE } from '@/lib/network/stages'

export type Palette = Readonly<Record<Tone, Rgb>>

/** A partner name and the gutter route a beat-4 line takes to reach it. */
export interface ReachTarget {
  /** Where the line leaves the network's area, at the top of the gutter. */
  entry: Point
  /** Gutter corner and the point just left of the name. */
  route: ReadonlyArray<Point>
}

const paint = (palette: Palette, tone: Tone, amount: number) => mixHex(palette.ink, palette[tone], amount)

/** A pulse is a bright dot in a soft halo; a lit node grows a little and takes the pulse's colour. */
const PULSE = { core: 1.25, halo: 3.6, haloAlpha: 0.22 } as const
const GLOW = { grow: 0.45, halo: 3, haloAlpha: 0.18 } as const

const NO_SIGNALS: Signals = { pulses: [], glows: [] }

/** Draws one frame at a stage anchor; `fade` dims the network while it travels between stages. */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  anchor: StageRect,
  palette: Palette,
  fade: number,
  targets: ReadonlyArray<ReachTarget>,
  signals: Signals = NO_SIGNALS,
) {
  const { cx, cy, scale } = anchor
  const px = (x: number) => cx + x * scale
  const py = (y: number) => cy + y * scale

  // Never thinner than a device pixel, so the fine hero lines don't shimmer.
  ctx.lineWidth = Math.max(1, STROKE.edge * scale * frame.detail)
  ctx.lineCap = 'round'
  for (const e of frame.edges) {
    if (e.alpha <= 0) continue
    const a = frame.nodes[e.a]
    const b = frame.nodes[e.b]
    ctx.globalAlpha = e.alpha * fade
    ctx.strokeStyle = paint(palette, e.tone, e.toneAmount)
    ctx.beginPath()
    ctx.moveTo(px(a.x), py(a.y))
    ctx.lineTo(px(b.x), py(b.y))
    ctx.stroke()
  }

  if (frame.reach > 0) drawReach(ctx, frame, px, py, scale, palette, fade, targets)

  const glowAt = new Map(signals.glows.map((g) => [g.node, g]))
  frame.nodes.forEach((n, i) => {
    if (n.alpha <= 0) return
    const glow = glowAt.get(i)
    const x = px(n.x)
    const y = py(n.y)
    const r = n.r * scale
    if (glow) {
      ctx.globalAlpha = n.alpha * fade * GLOW.haloAlpha * glow.amount
      ctx.fillStyle = paint(palette, glow.tone, 1)
      dot(ctx, x, y, r * GLOW.halo)
    }
    ctx.globalAlpha = n.alpha * fade
    ctx.fillStyle = glow
      ? paint(palette, glow.tone, Math.max(glow.amount, n.tone === glow.tone ? n.toneAmount : 0))
      : paint(palette, n.tone, n.toneAmount)
    dot(ctx, x, y, r * (1 + GLOW.grow * (glow?.amount ?? 0)))
  })

  const nodeRadius = (frame.nodes[0]?.r ?? 0) * scale
  for (const p of signals.pulses) {
    const x = px(p.x)
    const y = py(p.y)
    ctx.fillStyle = paint(palette, p.tone, 1)
    ctx.globalAlpha = p.alpha * fade * PULSE.haloAlpha
    dot(ctx, x, y, nodeRadius * PULSE.halo)
    ctx.globalAlpha = p.alpha * fade
    dot(ctx, x, y, nodeRadius * PULSE.core)
  }
  ctx.globalAlpha = 1
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

/** Beat 4: a line grows from the nearest node, down the gutter, to each partner name. */
function drawReach(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  px: (x: number) => number,
  py: (y: number) => number,
  scale: number,
  palette: Palette,
  fade: number,
  targets: ReadonlyArray<ReachTarget>,
) {
  ctx.lineWidth = Math.max(1, STROKE.reach * scale)
  ctx.strokeStyle = paint(palette, 'teal', 1)
  ctx.fillStyle = ctx.strokeStyle
  ctx.globalAlpha = fade
  for (const t of targets) {
    let start = { x: px(frame.nodes[0].x), y: py(frame.nodes[0].y) }
    for (const n of frame.nodes) {
      const p = { x: px(n.x), y: py(n.y) }
      if (Math.hypot(p.x - t.entry.x, p.y - t.entry.y) < Math.hypot(start.x - t.entry.x, start.y - t.entry.y)) start = p
    }
    const [first, ...rest] = polylineAt([start, t.entry, ...t.route], frame.reach)
    ctx.beginPath()
    ctx.moveTo(first.x, first.y)
    for (const p of rest) ctx.lineTo(p.x, p.y)
    ctx.stroke()
    if (frame.reach >= 1) {
      const end = t.route[t.route.length - 1]
      ctx.beginPath()
      ctx.arc(end.x, end.y, STROKE.reach * scale * 2.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
