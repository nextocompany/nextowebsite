---
phase: 03-quality-ship
plan: "03"
subsystem: infra
tags: [cloudflare-pages, github, lighthouse, next-js, static-export, deployment]

# Dependency graph
requires:
  - phase: 03-quality-ship
    provides: SEO metadata, GA, accessibility fixes, privacy page — all code complete before deploy
provides:
  - Live site on Cloudflare Pages at nexto.co.th
  - GitHub repository with full codebase pushed
  - Verified Lighthouse mobile performance score 98
  - Build output verified (all files present, SEO tags correct, page weight ~988K)
affects: []

# Tech tracking
tech-stack:
  added: [cloudflare-pages, github]
  patterns:
    - "Static export via next.config.ts output='export' deployed to Cloudflare Pages"
    - "Build verification gate before deploy: page weight, Lighthouse audit, SEO checks"
    - "font-display:swap on @font-face for LCP improvement"

key-files:
  created: []
  modified:
    - src/app/globals.css — added font-display:swap to fix LCP bottleneck

key-decisions:
  - "font-display:swap added to @font-face — blocked render was causing LCP regression (84 -> 98)"
  - "Cloudflare Pages connected to GitHub repo for CI/CD — future pushes auto-deploy"
  - "Custom domain nexto.co.th added via Cloudflare Pages custom domains (DNS already on Cloudflare)"

patterns-established:
  - "Build verification gate: run npm run build, check output files, audit Lighthouse before every deploy"
  - "font-display:swap is required for any @font-face usage in Next.js static exports"

requirements-completed:
  - TECH-02
  - TECH-03

# Metrics
duration: ~15min
completed: 2026-02-22
---

# Phase 3 Plan 03: Deploy to Cloudflare Pages Summary

**Next.js static export deployed live at nexto.co.th via Cloudflare Pages, after Lighthouse mobile score lifted from 84 to 98 by adding font-display:swap**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-22
- **Completed:** 2026-02-22
- **Tasks:** 2
- **Files modified:** 1 (globals.css)

## Accomplishments

- Final build verification passed — all output files present, SEO tags correct, page weight ~988K (under 1MB)
- Lighthouse mobile performance score reached 98 (initial audit returned 84 — fixed before deploy)
- Site live at nexto.co.th with all pages accessible: home, /privacy, /sitemap.xml, /robots.txt
- GitHub repo created with full codebase pushed; Cloudflare Pages connected for CI/CD on push

## Task Commits

Each task was committed atomically:

1. **Task 1: Final build verification and page weight check** - `c939a69` (feat — includes font-display:swap fix)
2. **Task 2: Create GitHub repo and deploy to Cloudflare Pages** - human action (no code commit)

**Pre-task cleanup:** `9597b33` — committed evolved site design and assets (pre-existing uncommitted changes)
**Gitignore fix:** `d9c500e` — added .claude/ to .gitignore

## Files Created/Modified

- `src/app/globals.css` — added `font-display: swap` to @font-face declaration to fix LCP bottleneck

## Decisions Made

- Added `font-display: swap` to globals.css — initial Lighthouse audit scored 84 mobile; root cause was render-blocking font load; swap brought score to 98
- Cloudflare Pages framework preset set to "Next.js (Static HTML Export)", build command `npm run build`, output directory `out`, env var `NODE_VERSION=20`
- Custom domain nexto.co.th configured via Cloudflare Pages custom domains; DNS auto-configured since domain is already managed in Cloudflare

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added font-display:swap to fix Lighthouse LCP regression**
- **Found during:** Task 1 (Final build verification and page weight check)
- **Issue:** Lighthouse mobile performance score was 84 (below the required 90 gate). Root cause: @font-face in globals.css lacked `font-display: swap`, causing render-blocking font load that hurt LCP.
- **Fix:** Added `font-display: swap` to the @font-face rule in `src/app/globals.css`
- **Files modified:** src/app/globals.css
- **Verification:** Re-ran Lighthouse audit — score moved from 84 to 98
- **Committed in:** c939a69 (Task 1 commit)

**2. [Rule 3 - Blocking] Committed pre-existing uncommitted design changes before build**
- **Found during:** Task 1 (build verification setup)
- **Issue:** Multiple modified files from prior design iterations were uncommitted (next.config.ts, globals.css, page.tsx, all section components, public assets). Build would pass but git state was unclean.
- **Fix:** Staged and committed all evolved design files as `chore(02): commit evolved site design and assets`
- **Files modified:** next.config.ts, src/app/globals.css, src/app/page.tsx, all section components, public/ assets
- **Verification:** `git status` clean after commit
- **Committed in:** 9597b33

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** font-display:swap fix was required to pass the Lighthouse gate before deploy. Pre-existing uncommitted changes needed to be committed for clean repo state. No scope creep.

## Issues Encountered

- Initial Lighthouse mobile audit returned 84, below the required 90 gate. Fixed with font-display:swap before proceeding to deployment.

## User Setup Required

The Cloudflare Pages deployment required manual dashboard configuration:
- Cloudflare Dashboard -> Workers & Pages -> Create application -> Pages -> Connect to Git
- Framework preset: Next.js (Static HTML Export)
- Build command: `npm run build`, output directory: `out`
- Environment variable: `NODE_VERSION=20`
- Custom domain: nexto.co.th (auto-configured via Cloudflare DNS)

## Next Phase Readiness

- All 3 phases complete. Site is live at nexto.co.th.
- No further development planned for MVP.
- Future: Replace og-placeholder.png with real branded OG image design.
- Future: Monitor GA4 for real traffic data.

---
*Phase: 03-quality-ship*
*Completed: 2026-02-22*
