import { afterEach, describe, expect, it, vi } from 'vitest'
import { getApproachPin, setApproachPin, subscribeApproachPin } from './pinStore'

describe('pinStore', () => {
  afterEach(() => setApproachPin(undefined))

  it('starts unpinned', () => {
    expect(getApproachPin()).toBeUndefined()
  })

  it('notifies listeners when the progress changes, and not when it repeats', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeApproachPin(listener)
    setApproachPin(0.4)
    setApproachPin(0.4)
    expect(getApproachPin()).toBe(0.4)
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    setApproachPin(0.6)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
