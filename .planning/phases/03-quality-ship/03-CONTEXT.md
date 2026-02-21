# Phase 3: Quality + Ship - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Pass quality gates (Lighthouse, accessibility, SEO), add privacy page, integrate Google Analytics, and deploy the static site live on Cloudflare Pages. The site is already fully built — this phase is polish, metadata, and shipping.

</domain>

<decisions>
## Implementation Decisions

### SEO & Metadata
- Page title: "Nexto — Your operations simplified"
- Meta description: Claude writes — concise one-sentence summary of what Nexto does
- Canonical URL: https://nexto.co.th
- OG image: Use a placeholder image (user will replace later) — include the file so the OG tag works
- robots.txt and sitemap.xml: Generate for static export
- Favicon: Already exists at src/app/icon.png

### Privacy Page
- Route: /privacy
- Language: English only
- Content: Claude drafts appropriate content for a static site with Google Analytics
- Must mention: Google Analytics data collection, cookies, no personal data collection beyond analytics
- Tone: Professional but concise — not a legal wall of text

### Google Analytics
- Tag ID: G-62ZB83X2YZ
- Integration method: Google tag (gtag.js) script in document head
- Exact snippet provided by user:
  ```html
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-62ZB83X2YZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-62ZB83X2YZ');
  </script>
  ```

### Accessibility
- No skip-to-content link — simple single-page site
- Focus ring style: Claude's discretion — must meet WCAG AA
- Brand teal contrast: Claude checks and adjusts where needed for text on white
- Body text uses neutral-900 on white — already high contrast
- Keyboard navigation must reach all nav links and buttons

### Deploy (Cloudflare Pages)
- Target: Cloudflare Pages (NOT Vercel — changed from original roadmap)
- Domain: nexto.co.th — DNS already on Cloudflare
- Deploy method: Git push to main → Cloudflare Pages auto-deploy
- GitHub repo: Needs to be created first — code is local only
- Build: Static export (output: "export" already configured in next.config.ts)

### Claude's Discretion
- Focus ring visual style (color, width, offset)
- Whether to darken brand-teal for small text or keep as decorative-only
- Meta description copy
- Privacy page content structure and depth
- OG placeholder image design
- robots.txt and sitemap.xml format
- Lighthouse optimization specifics (image compression, etc.)

</decisions>

<specifics>
## Specific Ideas

- GA tag snippet provided exactly — use as-is, integrate via Next.js Script component or layout head
- Placeholder OG image should be replaceable — user will swap it later
- Site is already static export mode — Cloudflare Pages should work out of the box with `npm run build` + `out/` directory

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-quality-ship*
*Context gathered: 2026-02-22*
