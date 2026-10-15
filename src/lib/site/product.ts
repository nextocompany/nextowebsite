import { getDictionary, localePath, SITE_URL, type Locale, type Product } from '@/lib/i18n'

const LOGO_FILE: Readonly<Record<Product, string>> = {
  endyra: '/brand/endyra-logo.svg',
  anvira: '/brand/anvira-wordmark.svg',
}

/**
 * schema.org SoftwareApplication and BreadcrumbList for a product page, from
 * the page's own approved copy: no ratings or offers, since none exist.
 */
export function productJsonLd(locale: Locale, product: Product) {
  const dict = getDictionary(locale)
  const copy = dict.productPages[product]
  const name = dict.products[product].name
  const home = `${SITE_URL}${localePath(locale)}`
  const url = `${SITE_URL}${localePath(locale, `${product}/`)}`

  const software = {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/${product}/#software`,
    name,
    url,
    description: copy.meta.description,
    applicationCategory: 'HealthApplication',
    creativeWorkStatus: copy.status,
    image: `${SITE_URL}${LOGO_FILE[product]}`,
    inLanguage: dict.meta.lang,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Nexto', item: home },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  }

  return { '@context': 'https://schema.org', '@graph': [software, breadcrumb] as const }
}
