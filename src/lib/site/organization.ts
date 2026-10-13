import { getDictionary, LOCALE_PATH, SITE_URL, type Locale } from '@/lib/i18n'
import { CONTACT_EMAIL, SOCIAL_LINKS } from './constants'

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
    url: `${SITE_URL}${LOCALE_PATH[locale]}`,
    logo: `${SITE_URL}/brand/nexto-mark-512.png`,
    description: dict.meta.description,
    email: CONTACT_EMAIL,
    address: { '@type': 'PostalAddress', addressLocality: 'Bangkok', addressCountry: 'TH' },
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  }
}
