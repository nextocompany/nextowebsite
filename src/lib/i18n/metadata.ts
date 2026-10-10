import type { Metadata } from 'next'
import { getDictionary, languageAlternates, LOCALE_PATH, SITE_URL } from './index'
import type { Locale } from './types'

const OG_IMAGE = { url: '/og-placeholder.png', width: 1200, height: 630 }

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
      images: [{ ...OG_IMAGE, alt: dict.meta.title }],
      locale: dict.meta.ogLocale,
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}
