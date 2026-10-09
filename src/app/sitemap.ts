import type { MetadataRoute } from 'next'
import { LOCALE_PATH, SITE_URL } from '@/lib/i18n'

export const dynamic = 'force-static'

const LAST_MODIFIED = '2026-10-10'

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    th: `${SITE_URL}${LOCALE_PATH.th}`,
    en: `${SITE_URL}${LOCALE_PATH.en}`,
  }
  return [
    { url: languages.th, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1, alternates: { languages } },
    { url: languages.en, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.9, alternates: { languages } },
  ]
}
