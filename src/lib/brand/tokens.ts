/**
 * Colour tokens from the Nexto brand book (Design System artifact NajH55P5SWDik7mQMF9fhc).
 * globals.css must declare the same values; contrast.test.ts checks both.
 */
export const THEMES = ['light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

type ThemedColour = Readonly<Record<Theme, string>>

const same = (hex: string): ThemedColour => ({ light: hex, dark: hex })

export const COLOR_TOKENS = {
  teal: same('#00b0b6'),
  coral: same('#f15a4b'),
  charcoal: same('#414142'),
  mist: same('#e7e8e9'),
  ground: { light: '#ffffff', dark: '#2b2b2c' },
  'ground-raised': { light: '#f3f4f4', dark: '#414142' },
  ink: { light: '#414142', dark: '#e7e8e9' },
  'ink-muted': { light: '#6a6a6c', dark: '#b4b5b7' },
  'teal-text': { light: '#007a7e', dark: '#5ed3d7' },
  'coral-text': { light: '#c24433', dark: '#f6958b' },
} as const satisfies Record<string, ThemedColour>

export type ColorToken = keyof typeof COLOR_TOKENS

/** Every text colour paired with each ground it is allowed to sit on. */
export const TEXT_PAIRS: ReadonlyArray<readonly [ColorToken, ColorToken]> = [
  ['ink', 'ground'],
  ['ink', 'ground-raised'],
  ['ink-muted', 'ground'],
  ['ink-muted', 'ground-raised'],
  ['teal-text', 'ground'],
  ['teal-text', 'ground-raised'],
  ['coral-text', 'ground'],
  ['coral-text', 'ground-raised'],
  // Primary button (and its hover), closing band.
  ['ground', 'teal-text'],
  ['ground', 'ink'],
  ['mist', 'charcoal'],
]
