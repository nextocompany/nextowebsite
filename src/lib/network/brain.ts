/**
 * The Nexto brain, measured from the vector source (NEXTO_Logo.ai): node centres
 * from the stamp page, fitted onto the main logo (max error 0.0001).
 * Units: the O's outer radius = 1, origin at the O's centre, y down.
 */
export interface Point {
  readonly x: number
  readonly y: number
}

export const BRAIN_NODES: ReadonlyArray<Point> = [
  { x: 0.4512, y: 0.6253 },
  { x: 0.3858, y: -0.4945 },
  { x: 0.4512, y: 0.0192 },
  { x: -0.2222, y: -0.6253 },
  { x: 0.6783, y: 0.2809 },
  { x: -0.2876, y: 0.3463 },
  { x: 0.255, y: 0.4117 },
  { x: 0.6783, y: -0.2097 },
  { x: -0.6752, y: -0.0789 },
  { x: -0.0259, y: -0.2097 },
]

export const BRAIN_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 4], [0, 6], [1, 2], [1, 3], [1, 7], [1, 9], [2, 4], [2, 5], [2, 6], [2, 7],
  [2, 9], [3, 8], [3, 9], [4, 6], [4, 7], [5, 6], [5, 8], [5, 9], [8, 9],
]

/** Node dot radius in the logo. */
export const BRAIN_NODE_RADIUS = 0.0655

/** The O: centre line radius and stroke width. */
export const RING = { radius: 0.929, width: 0.141 } as const

/**
 * Where the O changes colour (radians, y down). Teal runs from TEAL_START
 * through the left and top to CORAL_START; coral covers the right and bottom.
 */
export const RING_SPLIT = {
  tealStart: (136.2 * Math.PI) / 180,
  coralStart: (-46.2 * Math.PI) / 180,
} as const
