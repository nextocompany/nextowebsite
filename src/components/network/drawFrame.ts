import { RING, type Point } from '@/lib/network/brain'
import { mixHex, type Rgb } from '@/lib/network/color'
import type { Frame, Tone } from '@/lib/network/frame'
import { polylineAt } from '@/lib/network/path'
import type { StageRect } from '@/lib/network/progress'
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

/** Draws one frame at a stage anchor; `fade` dims the network while it travels between stages. */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  anchor: StageRect,
  palette: Palette,
  fade: number,
  targets: ReadonlyArray<ReachTarget>,
) {
  const { cx, cy, scale } = anchor
  const px = (x: number) => cx + x * scale
  const py = (y: number) => cy + y * scale

  if (frame.ring.alpha > 0) {
    ctx.lineWidth = RING.width * scale
    for (const arc of frame.ring.arcs) {
      ctx.globalAlpha = frame.ring.alpha * fade
      ctx.strokeStyle = paint(palette, arc.tone, 1)
      ctx.beginPath()
      ctx.arc(px(arc.cx), py(arc.cy), RING.radius * scale, arc.start, arc.end)
      ctx.stroke()
    }
  }

  ctx.lineWidth = STROKE.edge * scale * frame.detail
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

  for (const n of frame.nodes) {
    if (n.alpha <= 0) continue
    ctx.globalAlpha = n.alpha * fade
    ctx.fillStyle = paint(palette, n.tone, n.toneAmount)
    ctx.beginPath()
    ctx.arc(px(n.x), py(n.y), n.r * scale, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
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
  ctx.lineWidth = STROKE.reach * scale
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
