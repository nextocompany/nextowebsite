# Roadmap: Nexto Website

## Overview

Three phases: stand up the project scaffold with design tokens, build every visible section with final copy, then validate quality and deploy. Depth is quick — no phase is padded beyond its natural scope.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js project scaffold, Tailwind config, typography, global styles, design tokens (completed 2026-02-17)
- [ ] **Phase 2: Page** - All 9 sections assembled with final copy, anchor nav, responsive layout
- [ ] **Phase 3: Quality + Ship** - SEO metadata, accessibility audit, Lighthouse pass, privacy page, Vercel deploy

## Phase Details

### Phase 1: Foundation
**Goal**: A running Next.js app with the design system in place — ready to accept section components
**Depends on**: Nothing (first phase)
**Requirements**: TECH-01, DSGN-01, DSGN-02, DSGN-03, DSGN-04
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts without errors and renders a blank page at localhost:3000
  2. TailwindCSS v4 is configured with the neutral color palette (white bg, neutral-900 text, neutral-500 muted, neutral-200 borders)
  3. Body font renders at 16-18px with line-height 1.6, headings at 28-40px, content max-width 900-1100px
  4. Outlined rounded-full buttons render with correct hover state (bg shifts to neutral-100)
  5. `npm run build` completes without TypeScript or lint errors
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 15 + TailwindCSS v4, configure globals.css typography and layout.tsx font
- [x] 01-02-PLAN.md — Create Button component, update demo page, verify clean build + human visual check

### Phase 2: Page
**Goal**: The complete single-page site is visible with all sections, copy, and working navigation
**Depends on**: Phase 1
**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04, LAYOUT-05, HERO-01, HERO-02, HERO-03, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CTCT-01, CTCT-02, CTCT-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees all 9 sections (Header, Hero, What we do, Focus, Products, How we work, About, Contact, Footer) scrolling down a single page
  2. Clicking a header nav link scrolls smoothly to the correct section without the header covering it
  3. Header renders the Nexto text logo and nav links on desktop; collapses to compact/hamburger on mobile
  4. Hero CTA buttons ("Contact" and "Products") scroll to their respective sections
  5. Product cards show Endyra, Manverra, Careyra with title, description, and "View" link; contact section shows clickable email and LINE link; footer shows copyright line
  6. Layout is usable at 360px, 768px, 1024px, and 1280px viewport widths (no horizontal scroll, no broken columns)
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Create all 7 content section components (Hero, WhatWeDo, Focus, Products, HowWeWork, About, Contact)
- [ ] 02-02-PLAN.md — Create Header (sticky nav, scroll-spy, mobile hamburger) + Footer + globals.css scroll behavior
- [ ] 02-03-PLAN.md — Assemble page.tsx with all sections + human visual/responsive verification

### Phase 3: Quality + Ship
**Goal**: The site passes quality gates (Lighthouse, accessibility, SEO) and is live on Vercel
**Depends on**: Phase 2
**Requirements**: TECH-02, TECH-03, TECH-04, TECH-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, PRIV-01
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile performance score is 90 or higher; total page weight is under 1MB (excluding fonts)
  2. All body text and headings meet WCAG AA contrast ratio; keyboard tab order reaches every nav link and button with a visible focus ring
  3. Browser tab displays "Nexto — Enterprise software studio"; sharing the URL on social shows correct OG title and description
  4. robots.txt is reachable at /robots.txt; sitemap.xml is reachable at /sitemap.xml; favicon appears in browser tab
  5. /privacy page loads with basic privacy policy content
  6. Site is live at the production URL on Vercel; `npm run build` output matches what is deployed
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete    | 2026-02-17 |
| 2. Page | 0/3 | Planning complete | - |
| 3. Quality + Ship | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-17*
*Last updated: 2026-02-18 — Phase 2 plans created*
