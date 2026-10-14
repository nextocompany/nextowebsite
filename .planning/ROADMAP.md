# Roadmap: Nexto Website

## Overview

Three phases: stand up the project scaffold with design tokens, build every visible section with final copy, then validate quality and deploy. Depth is quick — no phase is padded beyond its natural scope.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js project scaffold, Tailwind config, typography, global styles, design tokens (completed 2026-02-17)
- [x] **Phase 2: Page** - 6 sections assembled with final copy, anchor nav, responsive layout (completed 2026-02-22)
- [x] **Phase 3: Quality + Ship** - SEO metadata, accessibility fixes, GA integration, privacy page, Cloudflare Pages deploy

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
- [x] 02-01-PLAN.md — Create all 7 content section components (Hero, WhatWeDo, Focus, Products, HowWeWork, About, Contact)
- [x] 02-02-PLAN.md — Create Header (scroll-spy, mobile hamburger) + Footer + globals.css scroll behavior
- [x] 02-03-PLAN.md — Assemble page.tsx with sections + visual/responsive iteration

### Phase 3: Quality + Ship
**Goal**: The site passes quality gates (Lighthouse, accessibility, SEO) and is live on Cloudflare Pages at nexto.co.th
**Depends on**: Phase 2
**Requirements**: TECH-02, TECH-03, TECH-04, TECH-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, PRIV-01
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile performance score is 90 or higher; total page weight is under 1MB (excluding fonts)
  2. All body text and headings meet WCAG AA contrast ratio; keyboard tab order reaches every nav link and button with a visible focus ring
  3. Browser tab displays "Nexto — Your operations simplified"; sharing the URL on social shows correct OG title and description
  4. robots.txt is reachable at /robots.txt; sitemap.xml is reachable at /sitemap.xml; favicon appears in browser tab
  5. /privacy page loads with basic privacy policy content
  6. Site is live at nexto.co.th on Cloudflare Pages; `npm run build` output matches what is deployed
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — SEO metadata, OG tags, GA integration, sitemap/robots, accessibility contrast fixes, focus ring
- [x] 03-02-PLAN.md — Privacy policy page at /privacy
- [x] 03-03-PLAN.md — Build verification, GitHub repo creation, Cloudflare Pages deploy

---

# Milestone v2: Healthcare repositioning (planned 2026-10-10)

Rebuild the single page around the new positioning, in Thai and English, light and dark, with the neural-network scroll story as the signature. Phases 4–7. Production deploy happens only after the user approves a preview.

**Shipped 2026-10-14** (PR #1, merged to main; Worker `nextowebsite` version 944b1f0f on nexto.co.th). After Phase 7 two releases went out with it: Release A (Thai back at `/th/`, Request a demo CTA, Organization JSON-LD) and Release B (product pages `/endyra/`, `/anvira/` in both languages). LCP on production (2.7–3.8 s simulated) accepted by the user (QA-03).

- [x] **Phase 4: Foundation v2** - brand tokens, fonts, themes, TH/EN route split, old assets removed
- [x] **Phase 5: Sections + copy** - all 8 sections in both languages, static (no motion), reference visual language
- [x] **Phase 6: Network + motion** - canvas network with 4 beats, GSAP text reveals, Lenis, reduced motion
- [x] **Phase 7: Quality + preview** - tests, Lighthouse/a11y/bundle budget, SEO per locale, OG image, preview deploy, launch gates

### Phase 4: Foundation v2
**Goal**: The app builds with the brand book tokens, both themes, both locales and the right fonts, before any section work
**Depends on**: v1 complete
**Requirements**: FND-01..04, I18N-01..05
**Success Criteria**:
  1. `/` renders `<html lang="th">`, `/en` renders `<html lang="en">`; `/privacy` and 404 still build; `out/en/index.html` exists
  2. Toggling the OS colour scheme switches every token; a contrast script over the token pairs reports no pair under 4.5:1
  3. Montserrat and Anuphan load from the site's own origin (no Google Fonts request; CSP unchanged)
  4. Vitest is set up and the TH/EN key-parity test passes on a starter dictionary
  5. Manverra/Careyra/old Endyra/scaffold assets are gone and nothing references them

### Phase 5: Sections + copy
**Goal**: The full page reads correctly in both languages and themes without any JavaScript animation
**Depends on**: Phase 4
**Requirements**: COPY-01..09, VIS-01..03, I18N-02
**Success Criteria**:
  1. All 8 sections render with the approved copy; partner and product names appear as text
  2. Contact buttons open mail with the right pre-filled subject in Thai and English (mailto builder unit-tested)
  3. No horizontal scroll at 320–1920; header collapses on mobile; language switch keeps the section
  4. With JavaScript disabled, every word is visible
**Decisions (2026-10-10)**: IBM Plex Mono for English/number labels; Saaniq card links to saaniq.com; Anvira shown with its logo

### Phase 6: Network + motion
**Goal**: The neural-network story plays across four beats and the headlines reveal, without hurting LCP or accessibility
**Depends on**: Phase 5
**Requirements**: NET-01..06, MOT-01..03
**Success Criteria**:
  1. Beat 1 resolves into the exact Nexto brain node layout (centres from the vector); beats 2–4 play on scroll and reverse cleanly
  2. Pure layout/interpolation functions are unit-tested
  3. Reduced motion shows static frames and turns off Lenis; offscreen or hidden tab stops the draw loop
  4. Thai headline reveal keeps ที่ and ไว้ intact
  5. Brand book updated with the website-animation exception

### Phase 7: Quality + preview
**Goal**: The site meets the quality bar and the user approves a preview before production
**Depends on**: Phase 6
**Requirements**: QA-01..05, GATE-01..04
**Success Criteria**:
  1. Playwright screenshots (320/768/1024/1440 × TH/EN, dark only since the redesign, plus reduced motion) reviewed
  2. Lighthouse mobile 90+, LCP < 2.5s, CLS < 0.1; landing JS gzipped size measured and under 150 kB
  3. hreflang, canonical, sitemap and per-locale OG verified in the built `out/`
  4. Preview deployed (Cloudflare preview branch or version upload) and link given to the user
  5. Production deploy only after explicit approval and all launch gates checked

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete    | 2026-02-17 |
| 2. Page | 3/3 | Complete | 2026-02-22 |
| 3. Quality + Ship | 3/3 | Complete | 2026-02-22 |
| 4. Foundation v2 | 1/1 | Complete | 2026-10-10 |
| 5. Sections + copy | 1/1 | Complete | 2026-10-10 |
| 6. Network + motion | 1/1 | Complete (redesigned) | 2026-10-10 |
| 7. Quality + preview | 1/1 | Complete (LCP over 2.5 s accepted, QA-03) | 2026-10-14 |

---
*Roadmap created: 2026-02-17*
*Last updated: 2026-10-14 — v2 live*
