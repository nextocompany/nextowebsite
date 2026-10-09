'use client'

import { useEffect, useRef } from 'react'
import { parseHex, type Rgb } from '@/lib/network/color'
import { frameAt } from '@/lib/network/frame'
import { clamp01, smoothstep } from '@/lib/network/math'
import { anchorAt, beatsAt, scrollPosition, type StageRect } from '@/lib/network/progress'
import { buildScene, type Variant } from '@/lib/network/scene'
import { STAGE_EXTENT, STAGE_ORDER, stageScale, type StageName } from '@/lib/network/stages'
import { drawFrame, type Palette, type ReachTarget } from './drawFrame'

const INTRO_MS = 1800
/** Per-frame easing towards the scroll target: a light "scrub" without a library. */
const FOLLOW = 0.16
const SETTLED = 0.0005
const MAX_DPR = 2
/** Between stages the network passes behind text; it nearly disappears there. */
const TRAVEL_DIM = 0.92
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const WIDE = '(min-width: 768px)'
const DARK = '(prefers-color-scheme: dark)'
const FALLBACK: Rgb = [65, 65, 66]

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const read = (name: string) => parseHex(css.getPropertyValue(name)) ?? FALLBACK
  return { ink: read('--ink'), teal: read('--teal'), coral: read('--coral') }
}

function measureStages(variant: Variant) {
  return STAGE_ORDER.flatMap((name: StageName) => {
    const el = document.querySelector<HTMLElement>(`[data-stage="${name}"]`)
    if (!el) return []
    const r = el.getBoundingClientRect()
    const rect: StageRect = {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      scale: stageScale(r.width, r.height, STAGE_EXTENT[name][variant]),
    }
    return [{ rect, visible: r.bottom > 0 && r.top < window.innerHeight }]
  })
}

const GUTTER = 16
const NAME_GAP = 8

function measureTargets(): ReachTarget[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-partner-group] [data-partner]')).flatMap((el) => {
    const r = el.getBoundingClientRect()
    const group = el.closest('[data-partner-group]')?.getBoundingClientRect()
    if (!group || r.bottom < 0 || r.top > window.innerHeight) return []
    const x = Math.max(NAME_GAP, group.left - GUTTER)
    const y = r.top + r.height / 2
    return [{ entry: { x, y: group.top - GUTTER }, route: [{ x, y }, { x: r.left - NAME_GAP, y }] }]
  })
}

/**
 * The Nexto brain across four beats, drawn on one fixed canvas that travels
 * between the [data-stage] boxes. Only runs when motion is allowed; otherwise
 * the server-rendered SVG stills stay.
 */
export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || window.matchMedia(REDUCED_MOTION).matches) return

    const root = document.documentElement
    root.dataset.motion = 'on'

    const wideQuery = window.matchMedia(WIDE)
    const darkQuery = window.matchMedia(DARK)
    let scene = buildScene(wideQuery.matches ? 'wide' : 'narrow')
    let palette = readPalette()
    let shown = -1
    let raf = 0
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = (now: number) => {
      raf = 0
      const stages = measureStages(scene.variant)
      if (stages.length === 0) return
      const centers = stages.map((s) => s.rect.cy)
      const target = scrollPosition(centers, window.innerHeight / 2)
      shown = shown < 0 ? target : shown + (target - shown) * FOLLOW
      const form = clamp01((now - start) / INTRO_MS)

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      if (stages.some((s) => s.visible)) {
        const travel = Math.abs(shown - Math.round(shown))
        const fade = 1 - TRAVEL_DIM * smoothstep(0.1, 0.35, travel)
        const frame = frameAt({ form, ...beatsAt(shown) }, scene)
        drawFrame(ctx, frame, anchorAt(stages.map((s) => s.rect), shown), palette, fade, measureTargets())
      }

      if (form < 1 || Math.abs(target - shown) > SETTLED) schedule()
    }

    const schedule = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick)
    }

    const onResize = () => {
      resize()
      scene = buildScene(wideQuery.matches ? 'wide' : 'narrow')
      schedule()
    }
    const onScheme = () => {
      palette = readPalette()
      schedule()
    }

    resize()
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', schedule)
    darkQuery.addEventListener('change', onScheme)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', schedule)
      darkQuery.removeEventListener('change', onScheme)
      delete root.dataset.motion
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" />
}
