import type { Metadata } from 'next'
import { getDictionary, languageAlternates, LOCALE_PATH, localePath, PUBLISHED_LOCALES, SITE_URL, type Product } from './index'
import type { Locale } from './types'

/** Rendered from the built site by `npm run og` (scripts/og-image.mjs). */
const ogImage = (locale: Locale) => ({ url: `/og-${locale}.png`, width: 1200, height: 630 })

export function buildHomeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)
  const path = LOCALE_PATH[locale]
  const languages = languageAlternates()

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: path,
      ...(languages && { languages }),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: path,
      siteName: 'Nexto',
      images: [{ ...ogImage(locale), alt: dict.meta.title }],
      locale: dict.meta.ogLocale,
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

/** A product page: its own title, description, canonical and hreflang; the locale's OG card. */
export function buildProductMetadata(locale: Locale, product: Product): Metadata {
  const dict = getDictionary(locale)
  const { title, description } = dict.productPages[product].meta
  const page = `${product}/`
  const path = localePath(locale, page)
  const languages = languageAlternates(PUBLISHED_LOCALES, page)

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: path,
      ...(languages && { languages }),
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Nexto',
      images: [{ ...ogImage(locale), alt: title }],
      locale: dict.meta.ogLocale,
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}
