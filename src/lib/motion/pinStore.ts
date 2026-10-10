/**
 * Progress of the pinned Approach section, shared between MotionRoot (which
 * owns the ScrollTrigger pin) and NetworkCanvas (which draws the split).
 * `undefined` means Approach is not pinned (narrow or short screens, reduced motion).
 */
type Listener = () => void

let progress: number | undefined
const listeners = new Set<Listener>()

export function getApproachPin(): number | undefined {
  return progress
}

export function setApproachPin(next: number | undefined): void {
  if (next === progress) return
  progress = next
  listeners.forEach((listener) => listener())
}

export function subscribeApproachPin(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
