import { en } from './en'
import { th } from './th'
import type { Dictionary, Locale } from './types'

export type { Dictionary, Locale } from './types'

export const SITE_URL = 'https://nexto.co.th'

const DICTIONARIES: Readonly<Record<Locale, Dictionary>> = { th, en }

/** Base path of each locale: Thai is the default at the root. */
export const LOCALE_PATH: Readonly<Record<Locale, string>> = { th: '/', en: '/en/' }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'th' ? 'en' : 'th'
}
