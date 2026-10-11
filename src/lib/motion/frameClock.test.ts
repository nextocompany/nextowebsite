import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type FrameClock = typeof import('./frameClock')

let frames: Map<number, FrameRequestCallback>
let nextId: number
let clock: FrameClock

/** Runs every requestAnimationFrame callback queued so far, as the browser would on the next frame. */
function nextFrame(now: number) {
  const due = [...frames.values()]
  frames.clear()
  due.forEach((cb) => cb(now))
}

beforeEach(async () => {
  frames = new Map()
  nextId = 1
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.set(nextId, cb)
    return nextId++
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.resetModules()
  clock = await import('./frameClock')
})

afterEach(() => vi.unstubAllGlobals())

describe('frameClock', () => {
  it('runs on requestAnimationFrame until something drives it', () => {
    const draw = vi.fn()
    clock.requestFrame(draw)
    clock.requestFrame(draw)
    nextFrame(16)
    expect(draw).toHaveBeenCalledTimes(1)
    expect(draw).toHaveBeenCalledWith(16)
  })

  it('a callback asking again while running waits for the next frame', () => {
    const calls: number[] = []
    const loop = (now: number) => {
      calls.push(now)
      clock.requestFrame(loop)
    }
    clock.requestFrame(loop)
    nextFrame(16)
    nextFrame(32)
    expect(calls).toEqual([16, 32])
  })

  it('once driven, runs only when the driver steps, not on its own frame', () => {
    const draw = vi.fn()
    clock.requestFrame(draw)
    const { step } = clock.driveFrames()
    nextFrame(16)
    expect(draw).not.toHaveBeenCalled()
    step(20)
    expect(draw).toHaveBeenCalledWith(20)
    clock.requestFrame(draw)
    expect(frames.size).toBe(0)
  })

  it('goes back to requestAnimationFrame when released, keeping what was waiting', () => {
    const draw = vi.fn()
    const { release } = clock.driveFrames()
    clock.requestFrame(draw)
    release()
    nextFrame(48)
    expect(draw).toHaveBeenCalledWith(48)
  })

  it('cancelFrame drops a waiting callback', () => {
    const draw = vi.fn()
    clock.requestFrame(draw)
    clock.cancelFrame(draw)
    nextFrame(16)
    expect(draw).not.toHaveBeenCalled()
  })
})
