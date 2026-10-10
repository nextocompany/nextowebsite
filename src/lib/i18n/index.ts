import { en } from './en'
import { th } from './th'
import type { Dictionary, Locale } from './types'

export type { Dictionary, Locale } from './types'

export const SITE_URL = 'https://nexto.co.th'

const DICTIONARIES: Readonly<Record<Locale, Dictionary>> = { th, en }

/**
 * Locales the site serves. Thai is hidden for now (decided 2026-10-10): its copy stays
 * here, ready to return at /th/ with its own route group and a language switch.
 */
export const PUBLISHED_LOCALES: ReadonlyArray<Locale> = ['en']

/** Base path of each locale. English is the default at the root. */
export const LOCALE_PATH: Readonly<Record<Locale, string>> = { en: '/', th: '/th/' }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}

/** The locale the language switch leads to, or null when there is no other published locale. */
export function switchTarget(locale: Locale, published: ReadonlyArray<Locale> = PUBLISHED_LOCALES): Locale | null {
  return published.find((other) => other !== locale) ?? null
}

/** hreflang alternates (first published locale is x-default); none for a single-language site. */
export function languageAlternates(
  published: ReadonlyArray<Locale> = PUBLISHED_LOCALES,
): Record<string, string> | undefined {
  if (published.length < 2) return undefined
  return {
    ...Object.fromEntries(published.map((locale) => [locale, LOCALE_PATH[locale]])),
    'x-default': LOCALE_PATH[published[0]],
  }
}
