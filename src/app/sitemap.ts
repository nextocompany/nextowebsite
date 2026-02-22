import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nexto.co.th',
      lastModified: '2026-02-22',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
