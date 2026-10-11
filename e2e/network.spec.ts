import { expect, settle, test } from './fixtures'

test.use({ viewport: { width: 1440, height: 900 } })

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
