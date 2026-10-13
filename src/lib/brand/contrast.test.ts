import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrast'
import { COLOR_TOKENS, PRODUCT_PAIRS, SITE_THEME, TEXT_PAIRS, THEMES } from './tokens'

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
  })

  it('returns 1 for identical colours', () => {
    expect(contrastRatio('#414142', '#414142')).toBeCloseTo(1, 5)
  })

  it('matches the brand book value for teal-text on white', () => {
    expect(contrastRatio('#007a7e', '#ffffff')).toBeCloseTo(5.14, 1)
  })

  it('throws on a malformed hex value', () => {
    expect(() => contrastRatio('teal', '#ffffff')).toThrow()
  })
})

describe('brand text pairs', () => {
  for (const theme of THEMES) {
    for (const [fg, bg] of TEXT_PAIRS) {
      it(`${fg} on ${bg} meets 4.5:1 in ${theme}`, () => {
        const ratio = contrastRatio(COLOR_TOKENS[fg][theme], COLOR_TOKENS[bg][theme])
        expect(ratio).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})

describe('product accents', () => {
  for (const [fg, bg] of PRODUCT_PAIRS) {
    it(`${fg} on ${bg} meets 4.5:1`, () => {
      expect(contrastRatio(COLOR_TOKENS[fg][SITE_THEME], COLOR_TOKENS[bg][SITE_THEME])).toBeGreaterThanOrEqual(4.5)
    })
  }
})

describe('globals.css uses the site theme from tokens.ts', () => {
  const css = readFileSync(path.resolve(__dirname, '../../app/globals.css'), 'utf8').toLowerCase()

  it('is dark only', () => {
    expect(css).toContain('color-scheme: dark')
    expect(css).not.toContain('prefers-color-scheme')
  })

  for (const [name, values] of Object.entries(COLOR_TOKENS)) {
    it(`declares --${name}: ${values[SITE_THEME]}`, () => {
      expect(css).toContain(`--${name}: ${values[SITE_THEME]}`)
    })
  }
})

describe('dimmed how-we-work items stay readable', () => {
  const css = readFileSync(path.resolve(__dirname, '../../app/globals.css'), 'utf8')
  const dimOf = (tag: string) => {
    const match = css.match(new RegExp(`li\\[data-current='false'\\] > ${tag} \\{\\s*opacity: ([0-9.]+);`))
    if (!match) throw new Error(`no dimmed opacity for ${tag} in globals.css`)
    return Number(match[1])
  }
  /** The colour text shows at `opacity` over the ground. */
  const over = (fg: string, bg: string, opacity: number) =>
    '#' +
    [1, 3, 5]
      .map((i) => {
        const f = parseInt(fg.slice(i, i + 2), 16)
        const b = parseInt(bg.slice(i, i + 2), 16)
        return Math.round(b + opacity * (f - b)).toString(16).padStart(2, '0')
      })
      .join('')
  const ground = COLOR_TOKENS.ground[SITE_THEME]

  it('headings (large text) keep 3:1', () => {
    expect(contrastRatio(over(COLOR_TOKENS.ink[SITE_THEME], ground, dimOf('h3')), ground)).toBeGreaterThanOrEqual(3)
  })

  it('body text keeps 4.5:1', () => {
    expect(contrastRatio(over(COLOR_TOKENS['ink-muted'][SITE_THEME], ground, dimOf('p')), ground)).toBeGreaterThanOrEqual(4.5)
  })
})
