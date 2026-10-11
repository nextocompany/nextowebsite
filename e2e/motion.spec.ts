import { gzipSync } from 'node:zlib'
import type { Page } from '@playwright/test'
import { expect, expectNear, scrollToY, settle, test, topOf } from './fixtures'

const COLUMN = '#approach .grid-column'
/** Landing JS was 193.7 kB gz when the user waived the 150 kB budget for Lenis + GSAP; catch regressions past that. */
const JS_BUDGET_GZ = 200_000

/** Document offsets of the pin spacers, in page order (Approach, then How we work). */
const pinStarts = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll('.pin-spacer'), (s) => Math.round(s.getBoundingClientRect().top + window.scrollY)),
  )
const pinStart = async (page: Page) => (await pinStarts(page))[0] ?? null

const HOW_COLUMN = '#how-we-work .grid-column'
const currentStep = (page: Page) =>
  page.evaluate(() => document.querySelector('[data-steps] [data-current="true"]')?.getAttribute('data-step') ?? null)

/** Pixels on the network canvas close to the brand coral: the "people" half of the split. */
const coralPixels = (page: Page) =>
  page.evaluate(() => {
    const canvas = document.querySelector('canvas')!
    const { data } = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)
    let count = 0
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
      if (a > 120 && r > 180 && g < 130 && b < 120) count++
    }
    return count
  })

test.describe('desktop 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('pins Approach while the network splits and rejoins', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    const start = await pinStart(page)
    expect(start, 'pin spacer').not.toBeNull()

    await scrollToY(page, start!)
    expectNear(await topOf(page, COLUMN), 0)
    const atStart = await coralPixels(page)

    await scrollToY(page, start! + 0.55 * 900)
    expectNear(await topOf(page, COLUMN), 0)
    const atMiddle = await coralPixels(page)

    await scrollToY(page, start! + 900)
    expectNear(await topOf(page, COLUMN), 0)
    const atEnd = await coralPixels(page)

    expect(atMiddle, 'coral nodes at mid-pin').toBeGreaterThan(200)
    expect(atStart, 'whole network at pin start').toBeLessThan(atMiddle / 4)
    expect(atEnd, 'whole network at pin end').toBeLessThan(atMiddle / 4)

    await scrollToY(page, start! + 1300)
    expect(await topOf(page, COLUMN)).toBeLessThan(0)
  })

  test('pins How we work and steps through its three items, one third each', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    const starts = await pinStarts(page)
    expect(starts, 'Approach and How we work pins').toHaveLength(2)
    const start = starts[1]
    const length = 1.5 * 900

    for (const [progress, step] of [
      [0.05, '0'],
      [0.5, '1'],
      [0.9, '2'],
    ] as const) {
      await scrollToY(page, start + progress * length)
      expectNear(await topOf(page, HOW_COLUMN), 0, `column at ${progress}`)
      expect(await currentStep(page), `item told at ${progress}`).toBe(step)
    }

    await scrollToY(page, start + length + 400)
    expect(await topOf(page, HOW_COLUMN)).toBeLessThan(0)
  })

  test('beyond lights each engineering partner in turn, one at a time', async ({ page }) => {
    await page.goto('/#beyond')
    await settle(page)
    const seen = new Set<string>()
    for (let i = 0; i < 60; i++) {
      // Lit: the name has turned from ink (#e7e8e9) towards teal text (#5ed3d7).
      const lit = await page.locator('[data-partner-group] [data-partner]').evaluateAll((els) =>
        els.filter((el) => Number(getComputedStyle(el).color.match(/\d+/)![0]) < 160).map((el) => el.getAttribute('data-partner')!),
      )
      expect(lit.length, 'one name at a time').toBeLessThanOrEqual(1)
      lit.forEach((name) => seen.add(name))
      await page.waitForTimeout(100)
    }
    expect([...seen].sort()).toEqual(['500 Miles', 'Tech It Up', 'The Enterprise Resources Training', 'Touch Technologies'])
  })

  test('the footer closes on the brain above the closing line, and nothing else', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    await scrollToY(page, await page.evaluate(() => document.documentElement.scrollHeight))
    const { inside, outside } = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')!
      const dpr = canvas.width / window.innerWidth
      const box = document.querySelector('[data-stage="closing"]')!.getBoundingClientRect()
      const { data } = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)
      let inside = 0
      let outside = 0
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) continue
        const x = ((i - 3) / 4) % canvas.width / dpr
        const y = Math.floor((i - 3) / 4 / canvas.width) / dpr
        // A few px of slack for the signal halo at the brain's edge.
        const near = x > box.left - 8 && x < box.right + 8 && y > box.top - 8 && y < box.bottom + 8
        if (near) inside++
        else outside++
      }
      return { inside, outside }
    })
    expect(inside, 'painted canvas pixels in the closing box').toBeGreaterThan(1000)
    expect(outside, 'painted canvas pixels anywhere else').toBe(0)
  })

  for (const id of ['approach', 'how-we-work', 'products', 'beyond', 'contact']) {
    test(`a link to #${id} lands under the header`, async ({ page }) => {
      await page.goto(`/#${id}`)
      await settle(page)
      await page.waitForTimeout(800)
      expectNear(await topOf(page, `#${id}`), 80, `#${id}`)
    })
  }

  test('nav to Approach from further down lands at the start of the pin', async ({ page }) => {
    await page.goto('/#contact')
    await settle(page)
    await page.evaluate(() => document.querySelector<HTMLAnchorElement>('header a[href="/#approach"]')!.click())
    await page.waitForTimeout(2600)
    expectNear(await topOf(page, '#approach'), 80)
  })

  test('there is no language switch while Thai is hidden', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    await expect(page.locator('a[hreflang]')).toHaveCount(0)
  })

  test('the pin survives a resize below the breakpoint and back', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    const before = await pinStarts(page)
    expect(before).toHaveLength(2)
    await page.setViewportSize({ width: 900, height: 900 })
    await page.waitForTimeout(800)
    expect(await pinStarts(page)).toEqual([])
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForTimeout(800)
    expect(await pinStarts(page)).toEqual(before)
    await page.evaluate(() => document.querySelector<HTMLAnchorElement>('header a[href="/#products"]')!.click())
    await page.waitForTimeout(2600)
    expectNear(await topOf(page, '#products'), 80)
  })

  test(`landing JS stays under ${JS_BUDGET_GZ / 1000} kB gzipped`, async ({ page }) => {
    const sizes: number[] = []
    page.on('response', async (response) => {
      if (new URL(response.url()).hostname === 'localhost' && response.url().endsWith('.js')) {
        sizes.push(gzipSync(await response.body(), { level: 9 }).length)
      }
    })
    await page.goto('/')
    await settle(page)
    const total = sizes.reduce((sum, size) => sum + size, 0)
    test.info().annotations.push({ type: 'landing JS gz', description: `${total} bytes in ${sizes.length} files` })
    expect(total).toBeLessThan(JS_BUDGET_GZ)
  })
})

test('no route payloads are prefetched (every link is a same-page jump or a full page load)', async ({ page }) => {
  const payloads: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('_rsc=')) payloads.push(request.url())
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await settle(page)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(1500)
  expect(payloads).toEqual([])
})

test('stacked tablet layout scrolls freely (no pin, no dimmed items)', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/')
  await settle(page)
  expect(await pinStarts(page)).toEqual([])
  expect(await page.locator('[data-stepping]').count()).toBe(0)
})

test('short laptop screens scroll freely (no pin)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 })
  await page.goto('/')
  await settle(page)
  expect(await pinStarts(page)).toEqual([])
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })

  test('no smooth scroll, no pin, network stills shown', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false)
    expect(await pinStarts(page)).toEqual([])
    expect(await page.locator('[data-stepping]').count()).toBe(0)
    const animations = await page.locator('[data-partner]').evaluateAll((els) => els.map((el) => getComputedStyle(el).animationName))
    expect(animations.every((name) => name === 'none')).toBe(true)
    expect(await page.locator('[data-stage] .network-still:visible').count()).toBeGreaterThanOrEqual(7)
  })
})
