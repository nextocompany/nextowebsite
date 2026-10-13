/**
 * Renders the Open Graph card(s) (public/og-<locale>.png) from the
 * built site, so they use the site's own fonts, tokens and network stills.
 *
 *   npm run build && npm run og
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { chromium } from '@playwright/test'

const PORT = 4174
const ROOT = path.resolve(import.meta.dirname, '..')
// Published locales only.
const LOCALES = [
  { name: 'en', path: '/' },
  { name: 'th', path: '/th/' },
]
const SIZE = { width: 1200, height: 630 }

/** Replaces the page with the card, reusing the hero headline and the formed network still. */
function buildCard() {
  const title = document.querySelector('#hero-title')?.textContent ?? ''
  const pick = (stage) => document.querySelector(`[data-stage="${stage}"] svg.hidden`)?.cloneNode(true)
  const formed = pick('intro')
  const scatter = pick('hero')
  if (!title || !formed || !scatter) throw new Error('hero title or network stills not found')
  for (const svg of [formed, scatter]) svg.setAttribute('class', '')

  delete document.documentElement.dataset.motion
  document.body.innerHTML = `
    <div class="og">
      <div class="og-scatter"></div>
      <span class="og-line og-line-top"></span><span class="og-line og-line-bottom"></span>
      <span class="og-guide og-guide-left"></span><span class="og-guide og-guide-right"></span>
      ${['tl', 'tr', 'bl', 'br'].map((c) => `<span class="og-dot og-dot-${c}"></span>`).join('')}
      <img class="og-logo" src="/brand/nexto-logo-reverse.svg" alt="" />
      <h1 class="og-title"></h1>
      <div class="og-network"></div>
      <p class="og-domain">nexto.co.th</p>
      <div class="og-bars"><span class="og-bar teal"></span><span class="og-bar coral"></span></div>
    </div>`
  document.querySelector('.og-title').textContent = title
  document.querySelector('.og-network').append(formed)
  document.querySelector('.og-scatter').append(scatter)

  const style = document.createElement('style')
  style.textContent = `
    html, body { margin: 0; background: var(--ground); }
    .og { position: relative; width: 1200px; height: 630px; overflow: hidden; background: var(--ground); color: var(--ink); }
    .og-scatter { position: absolute; inset: 0; opacity: 0.18; }
    .og-scatter svg, .og-network svg { width: 100%; height: 100%; display: block; }
    .og-line { position: absolute; left: 0; right: 0; height: 1px; background: var(--grid-line); }
    .og-line-top { top: 104px; } .og-line-bottom { top: 526px; }
    .og-guide { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--grid-line); }
    .og-guide-left { left: 64px; } .og-guide-right { left: 1136px; }
    .og-dot { position: absolute; width: 6px; height: 6px; border-radius: 9999px; background: var(--grid-dot); }
    .og-dot-tl { left: 61px; top: 101px; } .og-dot-tr { left: 1133px; top: 101px; }
    .og-dot-bl { left: 61px; top: 523px; } .og-dot-br { left: 1133px; top: 523px; }
    .og-logo { position: absolute; left: 96px; top: 36px; height: 34px; width: auto; }
    .og-title { position: absolute; left: 96px; top: 104px; height: 422px; width: 600px; margin: 0;
      display: flex; align-items: center; font-weight: 400; font-size: 68px; line-height: 1.08; letter-spacing: -0.02em; text-wrap: balance; }
    html:lang(th) .og-title { font-size: 60px; line-height: 1.32; letter-spacing: 0; }
    .og-network { position: absolute; left: 720px; top: 135px; width: 380px; height: 360px; }
    .og-domain { position: absolute; left: 96px; top: 548px; margin: 0; font-family: var(--font-plex-mono), ui-monospace, monospace; font-size: 22px; color: var(--ink-muted); }
    .og-bars { position: absolute; right: 96px; top: 562px; display: flex; gap: 10px; }
    .og-bar { width: 56px; height: 5px; border-radius: 9999px; }
    .og-bar.teal { background: var(--teal); } .og-bar.coral { background: var(--coral); }
  `
  document.head.append(style)
}

const server = spawn('python3', ['-m', 'http.server', String(PORT), '-d', path.join(ROOT, 'out')], { stdio: 'ignore' })
try {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: SIZE, reducedMotion: 'reduce' })
  await context.route('https://www.googletagmanager.com/**', (route) => route.fulfill({ status: 200, body: '' }))
  const page = await context.newPage()
  for (const locale of LOCALES) {
    for (let attempt = 0; ; attempt++) {
      try {
        await page.goto(`http://localhost:${PORT}${locale.path}`, { waitUntil: 'networkidle' })
        break
      } catch (error) {
        if (attempt > 10) throw error
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    }
    await page.evaluate(buildCard)
    await page.evaluate(() => Promise.all([document.fonts.ready, ...Array.from(document.images, (img) => img.decode())]))
    const out = path.join(ROOT, 'public', `og-${locale.name}.png`)
    await page.screenshot({ path: out, clip: { x: 0, y: 0, ...SIZE } })
    console.log('wrote', path.relative(ROOT, out))
  }
  await browser.close()
} finally {
  server.kill()
}
