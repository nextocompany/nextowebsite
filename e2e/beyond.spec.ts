import { expect, scrollToY, settle, test } from './fixtures'

test.use({ viewport: { width: 1440, height: 900 } })

const GUTTER = 16

/** Canvas pixels with any paint in a thin column at x (CSS px), between y0 and y1. */
const paintedInColumn = (page: import('@playwright/test').Page, x: number, y0: number, y1: number) =>
  page.evaluate(
    ([x, y0, y1]) => {
      const canvas = document.querySelector('canvas')!
      const dpr = canvas.width / window.innerWidth
      const left = Math.round((x - 2) * dpr)
      const top = Math.round(y0 * dpr)
      const { data } = canvas.getContext('2d')!.getImageData(left, top, Math.round(4 * dpr), Math.round((y1 - y0) * dpr))
      let count = 0
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) count++
      return count
    },
    [x, y0, y1] as const,
  )

test('every engineering partner keeps its reach line, on screen or not', async ({ page }) => {
  await page.goto('/#beyond')
  await settle(page)
  // Put the last name just below the screen and the one before it on screen.
  const { scrollY, lastTop } = await page.evaluate(() => {
    const names = document.querySelectorAll('[data-partner-group] [data-partner]')
    return { scrollY: window.scrollY, lastTop: names[names.length - 1].getBoundingClientRect().top }
  })
  await scrollToY(page, scrollY + lastTop - 900 - 2)

  const { gutter, aboveY } = await page.evaluate((gap) => {
    const names = document.querySelectorAll('[data-partner-group] [data-partner]')
    const previous = names[names.length - 2].getBoundingClientRect()
    const group = document.querySelector('[data-partner-group]')!.getBoundingClientRect()
    return { gutter: group.left - gap, aboveY: previous.bottom }
  }, GUTTER)
  expect(aboveY, 'the name before the last is on screen').toBeLessThan(900)
  expect(await page.evaluate(() => [...document.querySelectorAll('[data-partner-group] [data-partner]')].at(-1)!.getBoundingClientRect().top), 'the last name is below the screen').toBeGreaterThanOrEqual(900)

  // Below the last name on screen, only the line to the off-screen name runs down the gutter.
  expect(await paintedInColumn(page, gutter, aboveY + 4, 896)).toBeGreaterThan(0)
})

test('the network is drawn at the scroll position the reader sees', async ({ page }) => {
  // Each frame: the scroll position the canvas drew with, and the one painted once the frame is done.
  await page.addInitScript(() => {
    const w = window as unknown as { __drawn: [number, number][]; __painted: Map<number, number>; __frame: number }
    w.__drawn = []
    w.__painted = new Map()
    w.__frame = 0
    const channel = new MessageChannel()
    let pending: number[] = []
    channel.port1.onmessage = () => {
      for (const t of pending) w.__painted.set(t, window.scrollY)
      pending = []
    }
    const raf = window.requestAnimationFrame.bind(window)
    window.requestAnimationFrame = (cb) =>
      raf((t) => {
        if (w.__frame !== t) {
          w.__frame = t
          pending.push(t)
          channel.port2.postMessage(0)
        }
        cb(t)
      })
    const clear = CanvasRenderingContext2D.prototype.clearRect
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      w.__drawn.push([w.__frame, window.scrollY])
      return clear.apply(this, args)
    }
  })
  await page.goto('/#products')
  await settle(page)
  await page.evaluate(() => {
    const w = window as unknown as { __drawn: unknown[]; __painted: Map<number, number> }
    w.__drawn = []
    w.__painted.clear()
  })

  await page.mouse.move(720, 450)
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 160)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(1200)

  const { frames, behind } = await page.evaluate(() => {
    const w = window as unknown as { __drawn: [number, number][]; __painted: Map<number, number> }
    const moving = w.__drawn.filter(([t]) => w.__painted.has(t))
    return { frames: moving.length, behind: moving.filter(([t, y]) => Math.abs(w.__painted.get(t)! - y) > 0.5).length }
  })
  expect(frames, 'frames drawn while scrolling').toBeGreaterThan(30)
  expect(behind, `frames drawn at a stale scroll position (of ${frames})`).toBe(0)
})

test('reach lines stay while the names are on screen, after the beyond network has scrolled away', async ({ page }) => {
  await page.goto('/#beyond')
  await settle(page)
  const { scrollY, stageBottom } = await page.evaluate(() => ({
    scrollY: window.scrollY,
    stageBottom: document.querySelector('[data-stage="beyond"]')!.getBoundingClientRect().bottom,
  }))
  await scrollToY(page, scrollY + stageBottom + 10)

  const { gutter, top, bottom, closingTop } = await page.evaluate((gap) => {
    const names = [...document.querySelectorAll('[data-partner-group] [data-partner]')].map((el) => el.getBoundingClientRect())
    const group = document.querySelector('[data-partner-group]')!.getBoundingClientRect()
    const closingTop = document.querySelector('[data-stage="closing"]')!.getBoundingClientRect().top
    return { gutter: group.left - gap, top: names[0].top, bottom: names.at(-1)!.bottom, closingTop }
  }, GUTTER)
  expect(closingTop, 'the closing network is not on screen yet').toBeGreaterThanOrEqual(900)
  expect(bottom, 'the names are on screen').toBeLessThan(900)

  expect(await paintedInColumn(page, gutter, Math.max(0, top), bottom)).toBeGreaterThan(0)
})
