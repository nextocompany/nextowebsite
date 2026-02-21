# Phase 3: Quality + Ship - Research

**Researched:** 2026-02-22
**Domain:** SEO metadata, accessibility, Google Analytics, Cloudflare Pages deploy
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### SEO & Metadata
- Page title: "Nexto — Your operations simplified"
- Meta description: Claude writes — concise one-sentence summary of what Nexto does
- Canonical URL: https://nexto.co.th
- OG image: Use a placeholder image (user will replace later) — include the file so the OG tag works
- robots.txt and sitemap.xml: Generate for static export
- Favicon: Already exists at src/app/icon.png

#### Privacy Page
- Route: /privacy
- Language: English only
- Content: Claude drafts appropriate content for a static site with Google Analytics
- Must mention: Google Analytics data collection, cookies, no personal data collection beyond analytics
- Tone: Professional but concise — not a legal wall of text

#### Google Analytics
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

#### Accessibility
- No skip-to-content link — simple single-page site
- Focus ring style: Claude's discretion — must meet WCAG AA
- Brand teal contrast: Claude checks and adjusts where needed for text on white
- Body text uses neutral-900 on white — already high contrast
- Keyboard navigation must reach all nav links and buttons

#### Deploy (Cloudflare Pages)
- Target: Cloudflare Pages (NOT Vercel)
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TECH-02 | Lighthouse Performance score 90+ on mobile | Assets are small (80KB total public), Geist font via next/font (auto-optimized), no blocking scripts — GA uses afterInteractive strategy |
| TECH-03 | Total page weight < 1MB (excluding fonts) | Current public assets: 80KB total. No large images in sections — SVGs and small PNGs only |
| TECH-04 | Semantic HTML headings with WCAG AA color contrast | brand-teal (#2EC4B6) on white fails AA at 2.17:1 — small text uses must be changed to decorative-only or use darkened teal (#0f786f passes at 5.33:1) |
| TECH-05 | Visible focus styles and keyboard-accessible navigation | focus-visible variant in Tailwind CSS v4, apply to all interactive elements in globals.css |
| SEO-01 | Page title "Nexto — Your operations simplified" | metadata object in layout.tsx, title field |
| SEO-02 | Meta description present (one sentence) | metadata object, description field |
| SEO-03 | OG tags set (title, description, image) | metadata.openGraph in layout.tsx with metadataBase |
| SEO-04 | Canonical URL set to https://nexto.co.th/ | metadata.alternates.canonical in layout.tsx |
| SEO-05 | robots.txt and sitemap.xml generated | app/robots.ts and app/sitemap.ts — native Next.js App Router file conventions |
| SEO-06 | Favicon present | Already at src/app/icon.png — Next.js auto-detects app/icon.png |
| PRIV-01 | /privacy page exists with basic privacy policy | app/privacy/page.tsx — standard Next.js App Router page |
</phase_requirements>

---

## Summary

This phase has zero new library dependencies. Everything required — metadata, sitemap, robots.txt, privacy page, and Google Analytics — is handled natively by Next.js 16 App Router or via `@next/third-parties`. The site is already configured for static export (`output: "export"` in next.config.ts), so Cloudflare Pages deployment works out of the box with build command `npm run build` and output directory `out`.

The single non-trivial issue discovered in research is **color contrast failure**: brand teal `#2EC4B6` on white has a contrast ratio of 2.17:1, which fails WCAG AA at every text size (AA requires 4.5:1 for normal text, 3:1 for large text). This color is used as text in several places (nav active state, contact labels, how-we-work labels). The fix is to treat teal as decorative-only where possible (backgrounds, borders, decorative lines are fine) and switch any teal-on-white text to `neutral-900` or add a CSS variable for an accessible dark teal (`#0f786f` passes at 5.33:1).

**Primary recommendation:** No new npm installs needed — use native Next.js metadata API, App Router file conventions for sitemap/robots, `@next/third-parties` for GA (or raw Script tags to match the user's exact snippet), and Cloudflare Pages' "Next.js (Static HTML Export)" preset.

---

## Standard Stack

### Core (all already installed or built-in)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js Metadata API | 16.1.6 (current) | `metadata` object in layout.tsx for all SEO tags | Official App Router API, generates correct head tags, works with static export |
| Next.js file conventions | 16.1.6 | `app/sitemap.ts`, `app/robots.ts` for SEO files | Built-in — zero config, outputs correct XML/text at build time |
| `next/script` | 16.1.6 | Script component for GA integration | Handles load strategy (afterInteractive), prevents duplicate loading |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@next/third-parties` | latest | `GoogleAnalytics` component wrapping gtag.js | Alternative to manual Script tags — but user has exact snippet, so raw Script is fine too |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `app/sitemap.ts` | `next-sitemap` npm package | next-sitemap is legacy (pre-App Router era) — native approach has zero extra deps and works with static export |
| `next/script` inline GA | `@next/third-parties` GoogleAnalytics | Both work; user provided exact snippet so Script approach directly uses it |

**Installation (only if using @next/third-parties):**
```bash
npm install @next/third-parties@latest
```
Otherwise no new installs needed.

---

## Architecture Patterns

### Recommended File Structure for This Phase

```
src/
└── app/
    ├── layout.tsx          # Add: metadata object, GA Script tags
    ├── globals.css         # Add: focus-visible ring styles
    ├── sitemap.ts          # New: App Router sitemap file convention
    ├── robots.ts           # New: App Router robots file convention
    ├── icon.png            # Already exists — favicon auto-detected
    └── privacy/
        └── page.tsx        # New: /privacy route
public/
└── og-placeholder.png      # New: 1200x630px OG image placeholder
```

### Pattern 1: Next.js Metadata Object (SEO + OG + Canonical)

**What:** Export a `Metadata` object from `app/layout.tsx` to set all head tags at once.
**When to use:** Static sites with one set of metadata for all pages (this site).
**Example:**

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://nexto.co.th'),
  title: 'Nexto — Your operations simplified',
  description: 'Nexto builds enterprise operations software — from pilot to production.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nexto — Your operations simplified',
    description: 'Nexto builds enterprise operations software — from pilot to production.',
    url: 'https://nexto.co.th',
    siteName: 'Nexto',
    images: [
      {
        url: '/og-placeholder.png',
        width: 1200,
        height: 630,
        alt: 'Nexto — Your operations simplified',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

**Critical detail:** `metadataBase` MUST be set, otherwise relative OG image paths cause a build error in Next.js.

### Pattern 2: App Router sitemap.ts

**What:** TypeScript file at `app/sitemap.ts` that exports a function returning URL array.
**When to use:** All Next.js App Router sites — zero external deps.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nexto.co.th',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://nexto.co.th/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
```

**Output:** Generates `/sitemap.xml` in the static export.

### Pattern 3: App Router robots.ts

**What:** TypeScript file at `app/robots.ts`.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://nexto.co.th/sitemap.xml',
  }
}
```

### Pattern 4: Google Analytics via next/script (matching user's exact snippet)

**What:** Add two Script components to root layout — one for the gtag.js loader, one inline for config.
**When to use:** User has specific gtag snippet to use verbatim.

```typescript
// Source: https://nextjs.org/docs/app/guides/scripts
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="antialiased">
        {children}
      </body>
      {/* Google Analytics */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-62ZB83X2YZ"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-62ZB83X2YZ');
        `}
      </Script>
    </html>
  )
}
```

**Critical detail:** Inline Script tags MUST have an `id` prop — Next.js requires it to track and optimize inline scripts.

**Strategy choice:** `afterInteractive` loads after page hydration — correct for analytics (does not block LCP, good for Lighthouse performance score).

### Pattern 5: Focus Ring via Tailwind v4 focus-visible

**What:** Global CSS rule applying focus ring to all interactive elements.
**When to use:** WCAG AA requires visible keyboard focus indicators on all focusable elements.

```css
/* In globals.css — Source: https://tailwindcss.com/docs/hover-focus-and-other-states */
@layer base {
  /* Focus ring: teal outline with white offset for all interactive elements */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-brand-teal;
  }
}
```

**Why `outline` not `ring`:** CSS `outline` respects Windows High Contrast Mode; Tailwind `ring` utilities use `box-shadow` which does not. Use `outline-*` utilities for WCAG compliance.

**Contrast of focus ring:** The teal ring (#2EC4B6) is against the surrounding page background (white or neutral-50), not the element itself. The ring is decorative/indicator use, not text — WCAG 1.4.11 Non-text Contrast requires 3:1 for UI components. Teal on white = 2.17:1 which FAILS even non-text contrast. Recommendation: use a darkened teal (#0f786f, 5.33:1) for the focus ring.

### Pattern 6: Privacy Page

**What:** Standard Next.js App Router page at `app/privacy/page.tsx`.
**File:** `src/app/privacy/page.tsx`

```typescript
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1>Privacy Policy</h1>
      {/* content */}
    </main>
  )
}
```

**With metadata for the privacy page:**
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Nexto',
  robots: { index: false },  // optional: keep privacy page out of search
}
```

### Pattern 7: Cloudflare Pages Deploy

**What:** Connect GitHub repo to Cloudflare Pages with static HTML export preset.
**Steps:**
1. Create GitHub repo (`git remote add origin ...`, `git push -u origin main`)
2. Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git
3. Select repo → Framework preset: **"Next.js (Static HTML Export)"**
4. Build command: `npm run build` (or `npx next build`)
5. Build output directory: `out`
6. Environment variables: set `NODE_VERSION` = `20` (Cloudflare Pages now defaults to Node 22, but explicitly setting 20 avoids surprises with Next.js 16)
7. Save → Deploy
8. After first deploy: Settings → Custom Domains → Add `nexto.co.th`

**DNS is already on Cloudflare** — after adding custom domain in Pages, Cloudflare auto-configures the DNS CNAME/AAAA record.

### Anti-Patterns to Avoid

- **Using `next export` command:** Removed in Next.js 14. The correct approach is `output: "export"` in next.config.ts (already done) + `npm run build`.
- **Setting OG image without `metadataBase`:** Causes a Next.js build error for relative URLs. Always set `metadataBase: new URL('https://nexto.co.th')` in layout.tsx.
- **Using `strategy="beforeInteractive"` for GA:** Blocks page load, kills Lighthouse performance score. Always use `afterInteractive`.
- **Using Script `id` prop on external scripts:** The `id` prop is only required for inline scripts (those without `src`). External scripts like the gtag.js loader do NOT need an id.
- **Using `focus` instead of `focus-visible` for focus rings:** `focus` shows rings on mouse click too, creating visual noise. Use `focus-visible` for keyboard-only rings.
- **Deploying to Cloudflare Pages with OpenNext:** User wants static export, not server-rendered. The Cloudflare recommendation for OpenNext applies to SSR Next.js apps. Static export deploys directly to Cloudflare Pages CDN without Workers.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| sitemap.xml generation | Custom build script, `next-sitemap` | `app/sitemap.ts` file convention | Native App Router support, zero deps, works with static export, outputs correct XML |
| robots.txt | Manual file in `/public` | `app/robots.ts` file convention | Programmatic, type-safe, co-located with app logic |
| OG image generation | `@vercel/og`, canvas scripts | Static PNG placeholder in `/public` | User will replace it — complexity not warranted. 1200x630px PNG in public/ |
| Focus ring CSS | Per-element `focus-visible:` classes on every component | Single `:focus-visible` rule in `globals.css` | One place to maintain, automatically applies to all interactive elements present and future |
| GA script management | Manual `<script>` tags in `<head>` | `next/script` with `strategy="afterInteractive"` | Next.js handles deduplication across client navigations, prevents double-firing |

**Key insight:** Next.js App Router already has first-class support for every SEO/crawl requirement in this phase. External packages would add complexity with no benefit.

---

## Common Pitfalls

### Pitfall 1: Brand Teal Contrast Failure

**What goes wrong:** `text-brand-teal` on white background (`#2EC4B6` on `#FFFFFF`) has a contrast ratio of 2.17:1. This fails WCAG AA at all text sizes (4.5:1 for normal, 3:1 for large text 18px+/14px bold+).

**Current violations found in codebase:**
- `Header.tsx:78` — active nav link uses `text-brand-teal` at `text-xl` (20px, non-bold) → fails 3:1 large text threshold
- `Contact.tsx:13,22,31,35` — label text uses `text-[10px] text-brand-teal` → critically fails at tiny size
- `HowWeWork.tsx:17` — step label uses `text-[10px] text-brand-teal` → critically fails

**How to fix:**
- Option A (recommended): Change small-text teal to `text-neutral-500` (the labels are already uppercase tracking-widest — neutral gray works fine decoratively)
- Option B: Add CSS variable `--color-brand-teal-accessible: #0f786f` (5.33:1 contrast) for text-only uses
- The decorative teal uses (bg-brand-teal bars, border-brand-teal, hover states) are fine — they are not text

**Warning signs:** Lighthouse accessibility audit will flag these. axe-core would flag them as critical violations.

### Pitfall 2: Missing metadataBase Causes Build Error

**What goes wrong:** `next build` throws error: "metadata.openGraph.images[0].url is set to a relative value".

**Why it happens:** OG image URLs must be absolute. Next.js requires `metadataBase` in layout.tsx to resolve relative paths.

**How to avoid:** Always set `metadataBase: new URL('https://nexto.co.th')` as the first field in the metadata export.

### Pitfall 3: Inline Script Missing `id` Prop

**What goes wrong:** Next.js throws a warning or silently deduplicates inline scripts that don't have an `id`. The gtag config inline script needs `id="gtag-init"`.

**How to avoid:** All `<Script>` components without a `src` (inline scripts) MUST have an `id` prop.

### Pitfall 4: sitemap.ts / robots.ts Not Included in Static Export

**What goes wrong:** If Next.js doesn't generate `/sitemap.xml` in the `out/` folder, the sitemap is missing from deploy.

**Why it happens:** Route Handlers (which sitemap.ts and robots.ts are) are supported in static export and generate static files. This should work by default.

**Verification:** After `npm run build`, check that `out/sitemap.xml` and `out/robots.txt` exist before deploying.

### Pitfall 5: GitHub Repo Not Created Before Cloudflare Pages Setup

**What goes wrong:** Cloudflare Pages requires a connected Git repository — you cannot upload a folder directly.

**How to avoid:** Create GitHub repo first, push code, THEN set up Cloudflare Pages integration. The GitHub repo can be private.

### Pitfall 6: Cloudflare Pages Custom Domain DNS Already on Cloudflare

**What works in our favor:** DNS is already managed by Cloudflare. When adding a custom domain to a Cloudflare Pages project, Cloudflare automatically detects and configures the DNS record — no manual CNAME setup needed. This is a smooth path vs. external DNS.

---

## Code Examples

Verified patterns from official sources:

### Complete layout.tsx with Metadata + GA

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// Source: https://nextjs.org/docs/app/guides/scripts
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nexto.co.th'),
  title: 'Nexto — Your operations simplified',
  description: 'Nexto builds enterprise operations software — from pilot to production.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nexto — Your operations simplified',
    description: 'Nexto builds enterprise operations software — from pilot to production.',
    url: 'https://nexto.co.th',
    siteName: 'Nexto',
    images: [
      {
        url: '/og-placeholder.png',
        width: 1200,
        height: 630,
        alt: 'Nexto — Your operations simplified',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="antialiased">
        {children}
      </body>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-62ZB83X2YZ"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-62ZB83X2YZ');
        `}
      </Script>
    </html>
  )
}
```

### Focus Ring in globals.css (Tailwind v4)

```css
/* Source: https://tailwindcss.com/docs/hover-focus-and-other-states */
@layer base {
  /* ... existing rules ... */

  /* Accessible focus ring for all keyboard-focusable elements */
  :focus-visible {
    @apply outline-2 outline-offset-2;
    outline-color: #0f786f; /* darkened teal — 5.33:1 contrast on white */
  }
}
```

**Note on Tailwind v4 custom colors in @apply:** In Tailwind v4, `@apply outline-[#0f786f]` works but `@apply outline-brand-teal-accessible` would require adding the variable to `@theme`. Recommend using the hex value directly in the outline-color property for simplicity.

### app/sitemap.ts

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nexto.co.th',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://nexto.co.th/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
```

### app/robots.ts

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://nexto.co.th/sitemap.xml',
  }
}
```

### Privacy Page (app/privacy/page.tsx)

```typescript
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — Nexto',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-8">Privacy Policy</h1>
        {/* drafted content */}
      </main>
      <Footer />
    </>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next export` CLI command | `output: "export"` in next.config.ts | Next.js v14 | `next export` removed; config-based approach (already correct in this project) |
| `next-sitemap` package | `app/sitemap.ts` file convention | Next.js v13.3 | Zero-dep native solution; `next-sitemap` still works but unnecessary for App Router |
| Manual `<head>` script tags | `next/script` with strategy | Next.js v11 | Built-in performance optimization for third-party scripts |
| `metadata.viewport` field | `generateViewport()` function | Next.js v14 | `metadata.viewport` deprecated; use separate export if customizing viewport |
| Cloudflare Pages only for static | OpenNext + Cloudflare Workers | 2024-2025 | OpenNext is for SSR Next.js; this project uses static export so Cloudflare Pages is correct choice |

**Deprecated/outdated:**
- `metadata.themeColor`: Deprecated since Next.js 14 — use `generateViewport()` export if needed (not needed here)
- `metadata.viewport`: Same — deprecated, separate `generateViewport()` export. The default viewport tag Next.js adds is fine for this site.

---

## Open Questions

1. **OG placeholder image — format and content**
   - What we know: Must be 1200x630px PNG, placed at `public/og-placeholder.png`
   - What's unclear: User will replace it — should it be a simple solid-color placeholder or a minimal branded one?
   - Recommendation: Create a simple branded placeholder (teal background, Nexto logotype text) — easy to replace and works for social preview

2. **Lighthouse score verification**
   - What we know: Site is small, assets are light (80KB public folder), font is Google Fonts via `next/font` (optimized), GA uses `afterInteractive`
   - What's unclear: Actual score without running it
   - Recommendation: Run `npm run build && npx serve out` + Lighthouse after implementing changes. The main risk is the GA script affecting TBT (Total Blocking Time) on mobile — `afterInteractive` mitigates this.

3. **GitHub repo visibility**
   - What we know: User needs to create GitHub repo before Cloudflare Pages setup
   - What's unclear: Whether user prefers public or private
   - Recommendation: Private repo is fine for Cloudflare Pages; default to private unless user specifies otherwise. Research note: Cloudflare Pages supports both.

---

## Sources

### Primary (HIGH confidence)
- `https://nextjs.org/docs/app/api-reference/functions/generate-metadata` — metadata API, OG fields, canonical, metadataBase; doc-version 16.1.6, last-updated 2026-02-20
- `https://nextjs.org/docs/app/building-your-application/deploying/static-exports` — static export config, output dir, unsupported features; doc-version 16.1.6, last-updated 2026-02-20
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap` — sitemap.ts API, MetadataRoute.Sitemap type; doc-version 16.1.6, last-updated 2026-02-20
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots` — robots.ts API; doc-version 16.1.6, last-updated 2026-02-20
- `https://nextjs.org/docs/app/guides/scripts` — next/script component, strategy options; doc-version 16.1.6, last-updated 2026-02-20
- `https://nextjs.org/docs/app/guides/third-party-libraries` — @next/third-parties GoogleAnalytics component; doc-version 16.1.6, last-updated 2026-02-20
- Contrast ratio calculation — computed directly from WCAG relative luminance formula; #2EC4B6 on white = 2.17:1 (verified programmatically)

### Secondary (MEDIUM confidence)
- Cloudflare Pages static Next.js guide (https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/) — build settings confirmed: framework preset "Next.js (Static HTML Export)", build command "npx next build", output "out"
- Cloudflare Pages Node.js version — Cloudflare changelog confirms default is now Node 22; setting `NODE_VERSION=20` env var is safe and recommended for Next.js 16 compatibility

### Tertiary (LOW confidence)
- Lighthouse mobile performance 90+ prediction — based on asset audit (80KB public folder, optimized font, afterInteractive GA) but not empirically verified yet

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against Next.js 16.1.6 official docs dated 2026-02-20
- Architecture patterns: HIGH — all patterns from official Next.js docs, code examples are from official sources
- Accessibility/contrast: HIGH — contrast ratios computed directly from WCAG formula, not search results
- Cloudflare deploy: MEDIUM — verified against official Cloudflare docs, core steps confirmed
- Lighthouse score: LOW — predicted from asset analysis, not measured

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 days; Next.js 16 is stable, Cloudflare Pages deployment approach is stable)
