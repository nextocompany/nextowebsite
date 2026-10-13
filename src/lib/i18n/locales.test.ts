import { describe, expect, it } from 'vitest'
import { LOCALE_PATH, PUBLISHED_LOCALES, languageAlternates, switchTarget } from './index'
import { buildHomeMetadata } from './metadata'

describe('published locales', () => {
  it('publishes English at the site root and Thai at /th/', () => {
    expect(PUBLISHED_LOCALES).toEqual(['en', 'th'])
    expect(LOCALE_PATH.en).toBe('/')
    expect(LOCALE_PATH.th).toBe('/th/')
  })

  it('switches to the other published locale, and to none on a single-language site', () => {
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

  it('gives each home its own canonical, hreflang to both, and English as x-default', () => {
    const languages = { en: '/', th: '/th/', 'x-default': '/' }
    const en = buildHomeMetadata('en')
    expect(en.alternates).toEqual({ canonical: '/', languages })
    expect(en.openGraph).toMatchObject({ url: '/', images: [expect.objectContaining({ url: '/og-en.png' })] })
    const th = buildHomeMetadata('th')
    expect(th.alternates).toEqual({ canonical: '/th/', languages })
    expect(th.openGraph).toMatchObject({ url: '/th/', images: [expect.objectContaining({ url: '/og-th.png' })] })
  })
})
