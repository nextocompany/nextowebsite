'use client'

import { useEffect, useRef } from 'react'
import { cancelFrame, requestFrame } from '@/lib/motion/frameClock'
import { getPins, subscribePins } from '@/lib/motion/pinStore'
import { parseHex, type Rgb } from '@/lib/network/color'
import { frameAt, type BeatState } from '@/lib/network/frame'
import { smoothstep } from '@/lib/network/math'
import { anchorAt, beatsAt, scrollPosition, stageScrollTargets, type StageRect } from '@/lib/network/progress'
import { buildScene, type Variant } from '@/lib/network/scene'
import { signalsAt } from '@/lib/network/signals'
import { howWeWorkExtent } from '@/lib/network/zoom'
import { STAGE_EXTENT, STAGE_FIT, STAGE_ORDER, stageScale, type StageName } from '@/lib/network/stages'
import { drawFrame, type Palette } from './drawFrame'

const MAX_DPR = 2
/** Between later stages the network passes behind text; it nearly disappears there. */
const TRAVEL_DIM = 0.75
/** The full-screen network sits behind the hero headline, so it stays quiet. */
const HERO_ALPHA = 0.45
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const WIDE = '(min-width: 768px)'
const FALLBACK: Rgb = [65, 65, 66]

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const read = (name: string) => parseHex(css.getPropertyValue(name)) ?? FALLBACK
  return { ink: read('--ink'), teal: read('--teal'), coral: read('--coral') }
}

/** Each stage box on screen, in scroll order; scale is worked out once the beats are known. */
function measureStages() {
  return STAGE_ORDER.flatMap((name: StageName) => {
    const el = document.querySelector<HTMLElement>(`[data-stage="${name}"]`)
    if (!el) return []
    const r = el.getBoundingClientRect()
    return [{ name, cx: r.left + r.width / 2, cy: r.top + r.height / 2, width: r.width, height: r.height, visible: r.bottom > 0 && r.top < window.innerHeight }]
  })
}

type MeasuredStage = ReturnType<typeof measureStages>[number]

/** How we work zooms out as its story widens; every other stage keeps its fixed extent. */
function stageRect(stage: MeasuredStage, variant: Variant, beats: BeatState): StageRect {
  const extent = stage.name === 'how-we-work' ? howWeWorkExtent(variant, beats) : STAGE_EXTENT[stage.name][variant]
  return { cx: stage.cx, cy: stage.cy, scale: stageScale(stage.width, stage.height, extent, STAGE_FIT[stage.name]) }
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
    let scene = buildScene(wideQuery.matches ? 'wide' : 'narrow')
    const palette = readPalette()
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = (now: number) => {
      const stages = measureStages()
      if (stages.length === 0) return
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const targets = stageScrollTargets(stages.map((s) => s.cy), window.scrollY, window.innerHeight, maxScroll)
      // Lenis already glides the scroll and the frame clock runs this after it, so the network follows it directly.
      const shown = scrollPosition(targets, window.scrollY)
      const beats = beatsAt(shown, getPins())

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      if (stages.some((s) => s.visible)) {
        // Hero → intro is the gathering itself, so it stays visible; later moves dim.
        const travel = shown < 1 ? 0 : Math.abs(shown - Math.round(shown))
        const fade =
          (1 - TRAVEL_DIM * smoothstep(0.1, 0.35, travel)) *
          (HERO_ALPHA + (1 - HERO_ALPHA) * beats.form)
        const seconds = (now - start) / 1000
        const frame = frameAt({ ...beats, time: seconds }, scene)
        const anchor = anchorAt(stages.map((s) => stageRect(s, scene.variant, beats)), shown)
        drawFrame(ctx, frame, anchor, palette, fade, signalsAt(frame, seconds))
        // Signals keep moving while the network is on screen; off screen the loop rests until the next scroll.
        schedule()
      }
    }

    const schedule = () => {
      if (!document.hidden) requestFrame(tick)
    }

    const onResize = () => {
      resize()
      scene = buildScene(wideQuery.matches ? 'wide' : 'narrow')
      schedule()
    }

    resize()
    schedule()
    const unsubscribePin = subscribePins(schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', schedule)

    return () => {
      cancelFrame(tick)
      unsubscribePin()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', schedule)
      delete root.dataset.motion
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" />
}
