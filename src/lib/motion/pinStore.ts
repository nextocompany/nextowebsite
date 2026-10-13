import type { PinProgress } from '@/lib/network/progress'

/**
 * Progress of the scroll-driven beats (Approach pin, How we work steps), shared
 * between MotionRoot, which owns the ScrollTriggers, and NetworkCanvas, which
 * draws them. A missing key means that beat has no trigger running.
 */
type Listener = () => void

let pins: PinProgress = {}
const listeners = new Set<Listener>()

export function getPins(): PinProgress {
  return pins
}

export function setPin(key: keyof PinProgress, progress: number | undefined): void {
  if (pins[key] === progress) return
  const rest: PinProgress = Object.fromEntries(Object.entries(pins).filter(([k]) => k !== key))
  pins = progress === undefined ? rest : { ...rest, [key]: progress }
  listeners.forEach((listener) => listener())
}

export function subscribePins(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
