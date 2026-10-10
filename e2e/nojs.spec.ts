import { LOCALES, expect, test } from './fixtures'

test.use({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } })

for (const locale of LOCALES) {
  test(`${locale.name}: every section reads without JavaScript`, async ({ page }) => {
    await page.goto(locale.path)

    for (const heading of await page.locator('main h1, main h2').all()) {
      await expect(heading).toBeVisible()
      await expect(heading).toHaveCSS('opacity', '1')
    }
    // Each stage shows its server-rendered network still.
    const stills = page.locator('[data-stage] .network-still:visible')
    expect(await stills.count()).toBeGreaterThanOrEqual(6)
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
  })
}

test('the hero "Working with" row shows every customer and partner logo', async ({ page }) => {
  await page.goto('/')
  const names = await page.locator('#partners [data-partner]').evaluateAll((items) => items.map((li) => li.getAttribute('data-partner')))
  expect(names).toEqual(['Meditop', 'Touch Technologies', 'Anantariverhills Resort', 'Leaf Lake Kans', '500 Miles', 'VDS Business Center', 'The Enterprise Resources Training', 'Tech It Up'])
  for (const name of names) await expect(page.getByRole('img', { name: name! })).toBeVisible()
})
