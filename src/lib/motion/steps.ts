/** How we work has three items; each owns one third of the section's progress. */
export const HOW_WE_WORK_STEPS = 3

export function activeStep(progress: number): number {
  return Math.min(HOW_WE_WORK_STEPS - 1, Math.max(0, Math.floor(progress * HOW_WE_WORK_STEPS)))
}
