/**
 * One frame clock for everything drawn against the scroll position. Until
 * smooth scroll loads, frames run on requestAnimationFrame. Once MotionRoot
 * drives the clock, it runs the waiting callbacks right after Lenis has moved
 * the page in the same tick, so a drawing never uses last frame's scroll.
 */
type Callback = (now: number) => void

const waiting = new Set<Callback>()
let driven = false
let raf = 0

function flush(now: number) {
  raf = 0
  const due = [...waiting]
  waiting.clear()
  for (const callback of due) callback(now)
}

/** Runs callback once on the next frame; asking again before then still runs it once. */
export function requestFrame(callback: Callback): void {
  waiting.add(callback)
  if (!driven && !raf) raf = requestAnimationFrame(flush)
}

export function cancelFrame(callback: Callback): void {
  waiting.delete(callback)
}

/**
 * Hands the clock to a ticker that calls step(now) once per frame after it has
 * moved the page. release() gives it back to requestAnimationFrame.
 */
export function driveFrames(): { step: Callback; release: () => void } {
  driven = true
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  return {
    step: flush,
    release: () => {
      driven = false
      if (waiting.size > 0 && !raf) raf = requestAnimationFrame(flush)
    },
  }
}
