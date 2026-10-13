import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const SITE = 'https://nexto.co.th'
const OUT = path.join(__dirname, '../out')
const read = (file: string) => readFileSync(path.join(OUT, file), 'utf8')

/** Reads <link>/<meta> tags from built HTML (no browser needed). */
function tags(html: string) {
  const attr = (pattern: RegExp) => html.match(pattern)?.[1]
  return {
    lang: attr(/<html lang="([^"]+)"/),
    canonical: attr(/<link rel="canonical" href="([^"]+)"/),
    alternates: Array.from(html.matchAll(/<link rel="alternate" hrefLang="([^"]+)"/g), (m) => m[1]),
    ogUrl: attr(/<meta property="og:url" content="([^"]+)"/),
    ogImage: attr(/<meta property="og:image" content="([^"]+)"/),
    twitterImage: attr(/<meta name="twitter:image" content="([^"]+)"/),
    ogLocale: attr(/<meta property="og:locale" content="([^"]+)"/),
    robots: attr(/<meta name="robots" content="([^"]+)"/),
  }
}

/** JSON-LD blocks in built HTML. */
const jsonLd = (html: string) =>
  Array.from(html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g), (m) => JSON.parse(m[1]))

// URLs use the served form (trailingSlash: true), so none of them redirect.
for (const { file, lang, path: url, ogLocale, og } of [
  { file: 'index.html', lang: 'en', path: '/', ogLocale: 'en_US', og: 'og-en.png' },
  { file: 'th/index.html', lang: 'th', path: '/th/', ogLocale: 'th_TH', og: 'og-th.png' },
]) {
  test(`the ${lang} home has its own canonical, hreflang to both languages and its own OG image`, () => {
    const t = tags(read(file))
    expect(t).toMatchObject({
      lang,
      canonical: `${SITE}${url}`,
      ogUrl: `${SITE}${url}`,
      ogLocale,
      robots: 'index, follow',
      ogImage: `${SITE}/${og}`,
      twitterImage: `${SITE}/${og}`,
    })
    expect(t.alternates.sort()).toEqual(['en', 'th', 'x-default'])
    expect(existsSync(path.join(OUT, og)), 'OG image file').toBe(true)
  })

  test(`the ${lang} home describes Nexto as an organisation`, () => {
    const [org] = jsonLd(read(file))
    expect(org).toMatchObject({ '@type': 'Organization', name: 'Nexto', url: `${SITE}${url}` })
    expect(existsSync(path.join(OUT, new URL(org.logo).pathname)), 'logo file').toBe(true)
  })
}

test('English is the root and Thai is at /th/; /en/ redirects to the root', () => {
  expect(existsSync(path.join(OUT, 'en'))).toBe(false)
  expect(existsSync(path.join(OUT, 'th/index.html'))).toBe(true)
  expect(read('_redirects')).toMatch(/^\/en\/ \/ 301$/m)
  expect(read('_redirects')).toMatch(/^\/en \/ 301$/m)
})

test('privacy stays out of search results', () => {
  const t = tags(read('privacy/index.html'))
  expect(t).toMatchObject({ lang: 'en', robots: 'noindex', canonical: `${SITE}/privacy/` })
})

test('sitemap lists both homes with their language alternates; robots points at it', () => {
  const sitemap = read('sitemap.xml')
  expect(Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1])).toEqual([`${SITE}/`, `${SITE}/th/`])
  expect(sitemap).toContain('hreflang="th"')
  expect(read('robots.txt')).toContain(`Sitemap: ${SITE}/sitemap.xml`)
})

test('no placeholder OG image ships', () => {
  expect(existsSync(path.join(OUT, 'og-placeholder.png'))).toBe(false)
})
