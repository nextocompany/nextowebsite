import { getDictionary, LOCALE_PATH, SITE_URL, type Locale } from '@/lib/i18n'
import { CONTACT_EMAIL, SOCIAL_LINKS } from './constants'

/**
 * Other names people search for. The Thai registered name is เน็กซ์ทู, which
 * reads close to an unrelated accounting product (NEXTTO), so search engines
 * need every form tied to this site.
 */
/** Nexto's Wikidata item, so search engines and AI tie this site to the company. */
export const WIKIDATA_URL = 'https://www.wikidata.org/wiki/Q141742250'

export const ALTERNATE_NAMES = ['Nexto Co., Ltd.', 'บริษัท เน็กซ์ทู จำกัด', 'เน็กซ์ทู'] as const

/**
 * schema.org Organization for search engines (company name, logo, contact and
 * channels), in the page's language. Rendered as JSON-LD on each home page.
 */
export function organizationJsonLd(locale: Locale) {
  const dict = getDictionary(locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Nexto',
    legalName: 'Nexto Co., Ltd.',
    alternateName: [...ALTERNATE_NAMES],
    foundingDate: '2015-08-05',
    url: `${SITE_URL}${LOCALE_PATH[locale]}`,
    logo: `${SITE_URL}/brand/nexto-mark-512.png`,
    description: dict.meta.description,
    email: CONTACT_EMAIL,
    address: { '@type': 'PostalAddress', addressLocality: 'Bangkok', addressCountry: 'TH' },
    sameAs: [WIKIDATA_URL, ...SOCIAL_LINKS.map((link) => link.href)],
  }
}

/**
 * schema.org WebSite: Google takes the site name shown in results from this,
 * on the home page only.
 */
export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Nexto',
    alternateName: [...ALTERNATE_NAMES],
    url: `${SITE_URL}/`,
    inLanguage: getDictionary(locale).meta.lang,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}
