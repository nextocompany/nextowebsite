---
phase: 03-quality-ship
plan: 01
subsystem: seo, ui
tags: [next.js, seo, og-tags, google-analytics, wcag, accessibility, sitemap, robots]

# Dependency graph
requires:
  - phase: 02-page
    provides: Section components, page.tsx layout, globals.css, Header, Contact, HowWeWork

provides:
  - Full metadata with metadataBase, OG tags, and canonical for nexto.co.th
  - Google Analytics via afterInteractive gtag.js (G-62ZB83X2YZ)
  - Static sitemap.xml (nexto.co.th + /privacy)
  - Static robots.txt (Allow all, sitemap reference)
  - WCAG AA contrast fixes (small teal labels -> neutral-500, active nav -> teal-dark #0f786f)
  - Global :focus-visible ring with 5.33:1 darkened teal outline

affects: [deployment, lighthouse-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Static sitemap/robots with force-static export directive for Next.js output: export mode"
    - "afterInteractive GA scripts to avoid blocking Lighthouse performance score"
    - "WCAG-safe color split: teal #2EC4B6 kept for decorative/hover only, #0f786f for interactive states"

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
    - public/og-placeholder.png
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/components/layout/Header.tsx
    - src/components/sections/Contact.tsx
    - src/components/sections/HowWeWork.tsx

key-decisions:
  - "GA strategy=afterInteractive avoids blocking page load and Lighthouse performance penalty"
  - "sitemap/robots need export const dynamic = 'force-static' for Next.js static export mode"
  - "Active nav uses --color-brand-teal-dark (#0f786f, 5.33:1 contrast) not brand-teal (#2EC4B6, 2.17:1)"
  - "10px mono labels changed to neutral-500 — teal kept only for transient hover states (WCAG allows)"
  - "OG placeholder generated via sharp (1200x630 solid teal) — user should replace with real design"

patterns-established:
  - "Static export + route handlers: always add export const dynamic = 'force-static'"
  - "Brand teal usage: decorative (dividers, backgrounds) and hover (transient) only — not static text"

requirements-completed: [TECH-02, TECH-03, TECH-04, TECH-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06]

# Metrics
duration: 3min
completed: 2026-02-22
---

# Phase 3 Plan 01: SEO, GA, Accessibility Summary

**Full SEO metadata with OG tags + GA afterInteractive scripts + WCAG AA contrast fixes and global focus ring for nexto.co.th**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-21T18:10:05Z
- **Completed:** 2026-02-21T18:13:05Z
- **Tasks:** 2
- **Files modified:** 7 (+ 1 created in public/)

## Accomplishments

- `layout.tsx` now exports full metadata with metadataBase, title, description, OG tags, canonical, robots policy
- Google Analytics loads via `strategy="afterInteractive"` (non-blocking) with GA4 ID G-62ZB83X2YZ
- `sitemap.ts` and `robots.ts` generate static files at build time — verified in `out/`
- All `text-brand-teal` on 10px static labels replaced with `text-neutral-500` (WCAG AA compliant)
- Active nav link now uses `text-brand-teal-dark` (#0f786f, 5.33:1 contrast ratio)
- Global `:focus-visible` ring added with darkened teal at 5.33:1 contrast

## Task Commits

Each task was committed atomically:

1. **Task 1: SEO metadata, OG tags, GA scripts, sitemap, and robots** - `09ace7d` (feat)
2. **Task 2: Accessibility — contrast fixes and focus ring** - `9036b51` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/app/layout.tsx` - Full metadata object, GA Script tags with afterInteractive strategy
- `src/app/sitemap.ts` - Static sitemap for nexto.co.th and /privacy with force-static
- `src/app/robots.ts` - Allow-all robots with sitemap reference and force-static
- `public/og-placeholder.png` - 1200x630 teal placeholder (user should replace with branded design)
- `src/app/globals.css` - Added --color-brand-teal-dark, global :focus-visible rule
- `src/components/layout/Header.tsx` - Active nav changed from text-brand-teal to text-brand-teal-dark
- `src/components/sections/Contact.tsx` - Label spans changed from text-brand-teal to text-neutral-500
- `src/components/sections/HowWeWork.tsx` - Step number labels changed from text-brand-teal to text-neutral-500

## Decisions Made

- GA `strategy="afterInteractive"` (not `beforeInteractive`) — avoids Lighthouse performance penalty
- `export const dynamic = 'force-static'` required on sitemap.ts and robots.ts for `output: "export"` mode
- Active nav uses `--color-brand-teal-dark` (#0f786f) — 5.33:1 on white, passes WCAG AA
- 10px mono labels use `text-neutral-500` — teal preserved only for transient hover states (WCAG exempts hover)
- OG placeholder generated programmatically via sharp; user should replace with real branded image

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added `export const dynamic = 'force-static'` to sitemap.ts**
- **Found during:** Task 1 (SEO metadata, sitemap, robots)
- **Issue:** Next.js `output: "export"` mode requires dynamic = 'force-static' on route handlers; build errored without it
- **Fix:** Added `export const dynamic = 'force-static'` to sitemap.ts (linter also added to robots.ts automatically)
- **Files modified:** src/app/sitemap.ts, src/app/robots.ts
- **Verification:** `npm run build` succeeded; `out/sitemap.xml` and `out/robots.txt` generated correctly
- **Committed in:** 09ace7d (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - build error)
**Impact on plan:** Necessary for static export compatibility. No scope creep.

## Issues Encountered

- First build errored: `export const dynamic = "force-static" not configured on route "/sitemap.xml"` — fixed by adding the directive to sitemap.ts (and robots.ts via linter auto-fix).

## User Setup Required

**OG image:** `public/og-placeholder.png` is a solid teal placeholder. Replace with a properly branded image (1200x630px) before launch for good social sharing appearance.

## Next Phase Readiness

- Build is clean with all SEO, GA, and accessibility requirements satisfied
- Site is ready for deployment to nexto.co.th
- The only remaining user action is replacing og-placeholder.png with a real branded OG image

## Self-Check: PASSED

All files verified present:
- FOUND: src/app/layout.tsx
- FOUND: src/app/sitemap.ts
- FOUND: src/app/robots.ts
- FOUND: public/og-placeholder.png
- FOUND: src/app/globals.css
- FOUND: .planning/phases/03-quality-ship/03-01-SUMMARY.md

All commits verified:
- FOUND: 09ace7d (feat: SEO metadata, OG tags, GA scripts, sitemap, robots)
- FOUND: 9036b51 (feat: WCAG AA contrast and focus ring)

---
*Phase: 03-quality-ship*
*Completed: 2026-02-22*
