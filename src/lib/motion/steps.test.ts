import { describe, expect, it } from 'vitest'
import { activeStep } from './steps'

describe('activeStep', () => {
  it('gives each of the three how-we-work items one third of the progress', () => {
    expect(activeStep(0)).toBe(0)
    expect(activeStep(0.32)).toBe(0)
    expect(activeStep(0.34)).toBe(1)
    expect(activeStep(0.66)).toBe(1)
    expect(activeStep(0.67)).toBe(2)
    expect(activeStep(1)).toBe(2)
  })

  it('stays in range for progress outside 0..1', () => {
    expect(activeStep(-0.2)).toBe(0)
    expect(activeStep(1.4)).toBe(2)
  })
})
