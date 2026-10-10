import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test as base, expect, type Page } from '@playwright/test'

export { expect }

/** Published locales (Thai is hidden for now; add { name: 'th', path: '/th/' } when it returns). */
export const LOCALES = [{ name: 'en', path: '/' }] as const

/** The production CSP from public/_headers, so a policy break shows up locally too. */
const CSP = readFileSync(path.join(__dirname, '../public/_headers'), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .find((line) => line.startsWith('Content-Security-Policy:'))
  ?.slice('Content-Security-Policy:'.length)
  .trim()

if (!CSP) throw new Error('Content-Security-Policy not found in public/_headers')

interface PageProblems {
  errors: string[]
}

/**
 * Every test page gets the production CSP on documents, a stubbed Google
 * Analytics (no third-party traffic) and fails on console errors, page errors
 * or CSP violations.
 */
export const test = base.extend<{ problems: PageProblems }>({
  problems: [
    async ({ page }, use) => {
      const problems: PageProblems = { errors: [] }
      page.on('pageerror', (error) => problems.errors.push(`pageerror: ${error.message}`))
      page.on('console', (message) => {
        if (message.type() === 'error') problems.errors.push(`console: ${message.text()}`)
      })
      await page.exposeFunction('__reportCsp', (detail: string) => problems.errors.push(`csp: ${detail}`))
      await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (event) => {
          const report = (window as unknown as { __reportCsp: (d: string) => void }).__reportCsp
          report(`${event.violatedDirective} blocked ${event.blockedURI}`)
        })
      })
      await page.route('https://www.googletagmanager.com/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
      )
      await page.route(
        (url) => url.hostname === 'localhost',
        async (route) => {
          if (route.request().resourceType() !== 'document') return route.continue()
          const response = await route.fetch()
          await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': CSP } })
        },
      )
      await use(problems)
      expect(problems.errors, 'console, page or CSP errors').toEqual([])
    },
    { auto: true },
  ],
})

/** Waits for fonts and the dynamically imported motion chunks to settle. */
export async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
}

/** Scrolls without smooth-scroll easing and waits for Lenis and the canvas to catch up. */
export async function scrollToY(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(1200)
}

export const topOf = (page: Page, selector: string) =>
  page.evaluate((s) => Math.round(document.querySelector(s)!.getBoundingClientRect().top), selector)

/** Rounded layout positions can land a pixel either side (and -0); compare within 1px. */
export function expectNear(actual: number, expected: number, label?: string) {
  expect(Math.abs(actual - expected), `${label ?? 'position'}: ${actual} vs ${expected}`).toBeLessThanOrEqual(1)
}
