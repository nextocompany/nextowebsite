import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPins, setPin, subscribePins } from './pinStore'

describe('pinStore', () => {
  afterEach(() => {
    setPin('approach', undefined)
    setPin('howWeWork', undefined)
  })

  it('starts with no beat running', () => {
    expect(getPins()).toEqual({})
  })

  it('keeps each beat under its own key and drops it when it stops', () => {
    setPin('approach', 0.4)
    setPin('howWeWork', 0.1)
    expect(getPins()).toEqual({ approach: 0.4, howWeWork: 0.1 })
    setPin('approach', undefined)
    expect(getPins()).toEqual({ howWeWork: 0.1 })
  })

  it('notifies listeners on change only, and never mutates a snapshot already handed out', () => {
    const listener = vi.fn()
    const unsubscribe = subscribePins(listener)
    setPin('approach', 0.4)
    const snapshot = getPins()
    setPin('approach', 0.4)
    setPin('approach', 0.6)
    expect(snapshot).toEqual({ approach: 0.4 })
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
    setPin('approach', 0.7)
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
