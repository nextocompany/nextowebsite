/** Height of a square logo in the "Working with" row; every other logo gets the same area. */
const SQUARE_REM = 2.75
/** Wide wordmarks shrink to keep the same area, but never below this. */
const MIN_REM = 1.5

/**
 * Display height (rem) for a logo of the given intrinsic size, so marks and
 * wordmarks carry about the same visual weight side by side.
 */
export function logoHeightRem(width: number, height: number): number {
  const aspect = width / height
  return Math.max(SQUARE_REM / Math.sqrt(aspect), MIN_REM)
}
