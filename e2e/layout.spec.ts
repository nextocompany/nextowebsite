import { LOCALES, expect, settle, test } from './fixtures'

const WIDTHS = [320, 375, 768, 1024, 1440, 1920] as const
const REVIEW_WIDTHS = new Set<number>([320, 768, 1024, 1440])

// Reduced motion shows the final layout (no reveals mid-animation, SVG stills), so screenshots are stable.
test.use({ reducedMotion: 'reduce' })

for (const locale of LOCALES) {
  for (const width of WIDTHS) {
    test(`${locale.name} ${width}px: fits the screen and shows the headline`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(locale.path)
      await settle(page)

      await expect(page.locator('h1')).toBeVisible()
      const layout = await page.evaluate(() => {
        const root = document.documentElement
        // Anything outside SVG that runs past its page column is content being clipped.
        const clipped = Array.from(document.querySelectorAll<HTMLElement>('.grid-column *')).filter((el) => {
          if (el.closest('svg') || getComputedStyle(el).visibility === 'hidden') return false
          const rect = el.getBoundingClientRect()
          const column = el.closest('.grid-column')!.getBoundingClientRect()
          return rect.width > 0 && rect.right > column.right + 1
        })
        // Links spilling out of their own box run into whatever sits next to it (e.g. a long email).
        const spilling = Array.from(document.querySelectorAll('a'))
          .filter((a) => {
            const parent = a.parentElement
            if (!parent || a.getClientRects().length === 0) return false
            return a.getBoundingClientRect().right > parent.getBoundingClientRect().right + 1
          })
          .map((a) => a.textContent?.trim() ?? a.href)
        return {
          spilling,
          overflow: root.scrollWidth - root.clientWidth,
          clipped: clipped.slice(0, 5).map((el) => `${el.tagName}.${el.className}`),
        }
      })
      expect(layout.overflow, 'horizontal overflow (px)').toBe(0)
      expect(layout.clipped, 'content wider than its column').toEqual([])
      expect(layout.spilling, 'links wider than their container').toEqual([])

      // Lazy images never load in a full-page shot (nothing scrolls); load them, and fail on any broken one.
      const broken = await page.evaluate(async () => {
        const images = Array.from(document.images)
        images.forEach((img) => (img.loading = 'eager'))
        await Promise.all(images.map((img) => img.decode().catch(() => undefined)))
        return images.filter((img) => img.naturalWidth === 0).map((img) => img.currentSrc || img.src)
      })
      expect(broken, 'images that failed to load').toEqual([])

      if (REVIEW_WIDTHS.has(width)) {
        const shot = testInfo.outputPath(`${locale.name}-${width}.png`)
        await page.screenshot({ path: shot, fullPage: true })
        await testInfo.attach(`${locale.name}-${width}`, { path: shot, contentType: 'image/png' })
      }
    })
  }
}
