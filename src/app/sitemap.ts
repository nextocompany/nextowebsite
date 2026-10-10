import type { MetadataRoute } from 'next'
import { LOCALE_PATH, PUBLISHED_LOCALES, SITE_URL, languageAlternates } from '@/lib/i18n'

export const dynamic = 'force-static'

const LAST_MODIFIED = '2026-10-10'

const absolute = (path: string) => `${SITE_URL}${path}`

export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = languageAlternates()
  const languages = alternates && Object.fromEntries(Object.entries(alternates).map(([k, path]) => [k, absolute(path)]))
  return PUBLISHED_LOCALES.map((locale, index) => ({
    url: absolute(LOCALE_PATH[locale]),
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: index === 0 ? 1 : 0.9,
    ...(languages && { alternates: { languages } }),
  }))
}
