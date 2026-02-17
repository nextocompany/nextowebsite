---
phase: 02-page
plan: 02
subsystem: ui
tags: [react, nextjs, tailwind, intersection-observer, sticky-header, mobile-hamburger]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: globals.css @layer base html rule, Tailwind v4 config, layout.tsx

provides:
  - Sticky Header with scroll-spy active indicator (IntersectionObserver)
  - Mobile hamburger with slide-out panel and dark overlay
  - Footer with copyright and Privacy link
  - Smooth scroll behavior with header offset in globals.css

affects: [02-03-page-assembly, 03-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "'use client' only for interactive components; Header is the only client component in Phase 2"
    - "IntersectionObserver for scroll-spy (not scroll event listeners)"
    - "Plain <a> tags for hash navigation (not next/link)"
    - "Body scroll lock via document.body.style.overflow in useEffect"
    - "Slide-out panel using Tailwind translate-x transforms"

key-files:
  created:
    - src/components/layout/Header.tsx
    - src/components/layout/Footer.tsx
  modified:
    - src/app/globals.css

key-decisions:
  - "IntersectionObserver with rootMargin '-20% 0px -75% 0px' for scroll-spy to match visible viewport center"
  - "Active nav link uses font-semibold treatment (not color accent) per Ollama-style minimal design"
  - "Header has no border or blur - clean white background only"
  - "scroll-padding-top: 4rem matches h-16 header height so section headings are not hidden on anchor nav"

patterns-established:
  - "Layout components live in src/components/layout/"
  - "Header is 'use client', all section components are server components"
  - "Overlay pattern: fixed inset-0 bg-black/40 z-40, panel z-50"

requirements-completed: [LAYOUT-02, LAYOUT-03, LAYOUT-04, LAYOUT-05]

# Metrics
duration: 3min
completed: 2026-02-18
---

# Phase 02 Plan 02: Header, Footer, and Scroll CSS Summary

**Sticky Header with IntersectionObserver scroll-spy, mobile hamburger slide-out panel, Footer with copyright, and CSS smooth scroll with 4rem header offset**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-17T17:29:07Z
- **Completed:** 2026-02-17T17:32:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created `Header.tsx` as the sole 'use client' component in Phase 2 with sticky white header, 5 nav links, IntersectionObserver scroll-spy (bold active indicator), hamburger button, slide-out panel with dark overlay, and body scroll lock
- Created `Footer.tsx` as a server component with copyright "© Nexto Co., Ltd. · Bangkok, Thailand" and Privacy anchor link pointing to /privacy
- Updated `globals.css` html rule with `scroll-behavior: smooth` and `scroll-padding-top: 4rem` to prevent section headings being hidden behind the sticky header

## Task Commits

Each task was committed atomically:

1. **Task 1: Add scroll behavior to globals.css and create Footer component** - `6f28de8` (feat)
2. **Task 2: Create Header component with sticky nav, scroll-spy, and mobile hamburger** - `9f2fd5c` (feat)

## Files Created/Modified
- `src/app/globals.css` - Added scroll-behavior: smooth and scroll-padding-top: 4rem to html rule in @layer base
- `src/components/layout/Footer.tsx` - Server component with copyright text and /privacy link, flex row layout
- `src/components/layout/Header.tsx` - Client component: sticky header, 5 nav links, IntersectionObserver scroll-spy, hamburger, slide-out panel, dark overlay, body scroll lock

## Decisions Made
- IntersectionObserver `rootMargin: '-20% 0px -75% 0px'` chosen to activate when section is in the upper-middle portion of the viewport — provides natural active section feel
- Active nav link uses `font-semibold` bold treatment rather than color change — consistent with Ollama-style neutral palette decision from Phase 1
- 'focus' section ID included in observed sections array but has no nav link — intentional (Focus section exists but doesn't need a nav entry)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Header and Footer components ready to be imported into the root page or layout
- Scroll-spy will activate once section IDs (what-we-do, products, how-we-work, about, contact) are rendered in the DOM via page assembly (02-03)
- globals.css scroll behavior active for entire app

---
*Phase: 02-page*
*Completed: 2026-02-18*
