import type { MetadataRoute } from 'next'
import { PRODUCTS, PUBLISHED_LOCALES, SITE_URL, languageAlternates, localePath } from '@/lib/i18n'

export const dynamic = 'force-static'

const LAST_MODIFIED = '2026-10-14'

const absolute = (path: string) => `${SITE_URL}${path}`

/** Every published page in every published language: the homes, then the product pages. */
const PAGES: ReadonlyArray<{ page: string; priority: number }> = [
  { page: '', priority: 1 },
  ...PRODUCTS.map((product) => ({ page: `${product}/`, priority: 0.8 })),
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ page, priority }) => {
    const alternates = languageAlternates(PUBLISHED_LOCALES, page)
    const languages = alternates && Object.fromEntries(Object.entries(alternates).map(([k, path]) => [k, absolute(path)]))
    return PUBLISHED_LOCALES.map((locale, index) => ({
      url: absolute(localePath(locale, page)),
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: index === 0 ? priority : priority - 0.1,
      ...(languages && { alternates: { languages } }),
    }))
  })
}
