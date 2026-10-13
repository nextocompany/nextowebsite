import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { LOCALES, expect, settle, test } from './fixtures'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const PAGES = LOCALES.flatMap((locale) =>
  ['', 'endyra/', 'anvira/'].map((page) => ({ name: `${locale.name} /${page}`, path: `${locale.path}${page}` })),
)

for (const locale of PAGES) {
  test(`${locale.name}: no automated WCAG A/AA violations`, async ({ page }) => {
    // Reduced motion so axe never measures contrast on text caught mid-reveal.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(locale.path)
    await settle(page)
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })
}

interface FocusStop {
  label: string
  ring: boolean
  inView: boolean
  /** WCAG 2.4.11: a focused element outside the header must not sit under the sticky header. */
  underHeader: boolean
}

/** Lenis eases focus scrolling; give it time before measuring. */
const SETTLE_MS = { reduce: 120, 'no-preference': 450 } as const

/** Where focus is now: whether a ring shows, it is on screen, and it is clear of the sticky header. */
const readFocus = (page: Page) =>
  page.evaluate((): FocusStop | null => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return null
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const header = document.querySelector('header')
    const headerBottom = header && getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().bottom : 0
    return {
      label: `${el.tagName} ${el.getAttribute('href') ?? el.textContent?.trim().slice(0, 30) ?? ''}`,
      ring: (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none',
      inView: rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0,
      underHeader: !el.closest('header') && rect.top < headerBottom - 1,
    }
  })

/** Tabs forward from the top until focus leaves the page, opening the mobile menu on the way. */
async function tabForward(page: Page, maxPresses: number, settleMs: number): Promise<FocusStop[]> {
  const stops: FocusStop[] = []
  for (let i = 0; i < maxPresses; i++) {
    await page.keyboard.press('Tab')
    await page.waitForTimeout(settleMs)
    const stop = await readFocus(page)
    if (!stop) {
      if (stops.length > 0) break
      continue
    }
    stops.push(stop)
    if (stop.label.startsWith('SUMMARY')) await page.keyboard.press('Enter')
  }
  return stops
}

/** Shift+Tabs back up the page: each element now comes in from the top edge, where the header could cover it. */
async function tabBackward(page: Page, presses: number, settleMs: number): Promise<FocusStop[]> {
  const stops: FocusStop[] = []
  for (let i = 0; i < presses; i++) {
    await page.keyboard.press('Shift+Tab')
    await page.waitForTimeout(settleMs)
    const stop = await readFocus(page)
    if (stop) stops.push(stop)
  }
  return stops
}

const KEYBOARD_RUNS = [
  { width: 320, motion: 'reduce' },
  { width: 1440, motion: 'reduce' },
  { width: 1440, motion: 'no-preference' },
] as const

for (const { width, motion } of KEYBOARD_RUNS) {
  test(`keyboard reaches every link and button with a visible, unobscured ring at ${width}px (motion: ${motion})`, async ({
    page,
  }) => {
    // Two walks over every stop, with time for Lenis to settle on each: longer than the default budget.
    test.setTimeout(120_000)
    await page.emulateMedia({ reducedMotion: motion })
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await settle(page)
    const linkCount = await page.locator('a[href]:visible, button:visible, summary:visible').count()
    const forward = await tabForward(page, linkCount + 20, SETTLE_MS[motion])
    const backward = await tabBackward(page, forward.length, SETTLE_MS[motion])
    const stops = [...forward, ...backward]

    expect(forward.length, 'focus stops').toBeGreaterThanOrEqual(linkCount)
    expect(stops.filter((s) => !s.ring).map((s) => s.label), 'stops without a focus ring').toEqual([])
    expect(stops.filter((s) => !s.inView).map((s) => s.label), 'stops scrolled off screen').toEqual([])
    expect(stops.filter((s) => s.underHeader).map((s) => s.label), 'stops hidden under the sticky header').toEqual([])
  })
}
