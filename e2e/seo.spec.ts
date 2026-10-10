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

// URLs use the served form (trailingSlash: true), so none of them redirect.
test('the English home is the site root, with no hreflang while it is the only language', () => {
  const t = tags(read('index.html'))
  expect(t).toMatchObject({
    lang: 'en',
    canonical: `${SITE}/`,
    ogUrl: `${SITE}/`,
    ogLocale: 'en_US',
    robots: 'index, follow',
    ogImage: `${SITE}/og-en.png`,
    twitterImage: `${SITE}/og-en.png`,
  })
  expect(t.alternates).toEqual([])
  expect(existsSync(path.join(OUT, 'og-en.png')), 'OG image file').toBe(true)
})

test('no Thai pages are published, and /en/ redirects to the root', () => {
  expect(existsSync(path.join(OUT, 'en'))).toBe(false)
  expect(existsSync(path.join(OUT, 'th'))).toBe(false)
  expect(read('_redirects')).toMatch(/^\/en\/ \/ 301$/m)
  expect(read('_redirects')).toMatch(/^\/en \/ 301$/m)
})

test('privacy stays out of search results', () => {
  const t = tags(read('privacy/index.html'))
  expect(t).toMatchObject({ lang: 'en', robots: 'noindex', canonical: `${SITE}/privacy/` })
})

test('sitemap lists only the root; robots points at it', () => {
  const sitemap = read('sitemap.xml')
  expect(Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1])).toEqual([`${SITE}/`])
  expect(sitemap).not.toContain('hreflang')
  expect(read('robots.txt')).toContain(`Sitemap: ${SITE}/sitemap.xml`)
})

test('no placeholder or Thai OG image ships', () => {
  expect(existsSync(path.join(OUT, 'og-placeholder.png'))).toBe(false)
  expect(existsSync(path.join(OUT, 'og-th.png'))).toBe(false)
})
