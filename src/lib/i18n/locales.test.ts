import { describe, expect, it } from 'vitest'
import { LOCALE_PATH, PUBLISHED_LOCALES, languageAlternates, switchTarget } from './index'
import { buildHomeMetadata } from './metadata'

describe('published locales', () => {
  it('publishes English only for now, at the site root', () => {
    expect(PUBLISHED_LOCALES).toEqual(['en'])
    expect(LOCALE_PATH.en).toBe('/')
  })

  it('offers no language switch while the other locale is hidden', () => {
    expect(switchTarget('en', ['en'])).toBeNull()
    expect(switchTarget('en', ['th', 'en'])).toBe('th')
  })

  it('lists hreflang alternates only when more than one locale is published', () => {
    expect(languageAlternates(['en'])).toBeUndefined()
    expect(languageAlternates(['th', 'en'])).toEqual({
      th: LOCALE_PATH.th,
      en: LOCALE_PATH.en,
      'x-default': LOCALE_PATH.th,
    })
  })

  it('gives the English home a root canonical and no alternates', () => {
    const metadata = buildHomeMetadata('en')
    expect(metadata.alternates).toEqual({ canonical: '/' })
    expect(metadata.openGraph).toMatchObject({ url: '/' })
  })
})
