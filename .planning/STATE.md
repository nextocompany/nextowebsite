# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value (v2):** A referred visitor sees, within one screen, that Nexto connects scattered clinical data into one place, and can reach the right person in one click.
**Current focus:** Milestone v2 — Phase 7 (quality + preview)

## Current Position

Milestone: v2 (healthcare repositioning), planned 2026-10-10
Phase: 7 of 7 (Quality + preview) — next
Status: v1 live at nexto.co.th (commit 00441c9). Phase 4 complete (uncommitted, branch feat/v2-healthcare): brand tokens + contrast test, light/dark via prefers-color-scheme, Montserrat/Anuphan/IBM Plex Mono via next/font, TH at / and EN at /en/ (two root layouts, global-not-found, trailingSlash), full TH/EN copy dictionaries + parity test, old assets removed. Vitest 39 passing, lint/tsc/build clean. HomePage.tsx is a hero-only shell; Phase 5 builds the 8 sections from the dictionaries.
Phase 5 complete (uncommitted): 8 server-rendered sections in src/components/sections/, ui/{Section,ButtonLink,StatusChip}, src/lib/site/{constants,contact,sections}.ts (+tests), SiteHeader with anchor nav, <details> mobile menu, CTA, and LanguageSwitch (only client island; carries the current section to the other locale). Sections carry data-beat (hero/partners/approach/clusters) for Phase 6. Tailwind custom variants th:/en: (Thai heading leading, mono only for English). Vitest 55 passing; lint/tsc/build clean; no horizontal overflow at 320/375/1440 in TH/EN light/dark.
Phase 6 complete: brain geometry measured from NEXTO_Logo.ai (src/lib/network/brain.ts, 10 nodes / 19 edges, fit error 0.0001); pure scene/frame/progress/path/colour modules with tests; NetworkStage renders server SVG stills per stage (no-JS + reduced motion); NetworkCanvas (fixed canvas, draws only on scroll/intro, pauses when hidden) travels hero → approach → products → beyond; HeadingReveal for below-fold h2 (Intl.Segmenter, by line). No GSAP/Lenis (budget; see REQUIREMENTS note). Landing JS 137.6 kB gz (measured in Playwright, all loaded .js). Brand book v7 has the website-animation exception (NET-06). Vitest 93 passing.
Redesign after user review (commit 7d85f85): dark-only + page grid like cipherdigital.com, Lenis + GSAP (budget waived, 193 kB gz), logo-free network story over six stages (hero, intro, approach, how we work, products, beyond), hero = one headline + Meditop row, full-screen footer with closing line, no scroll snap. Vitest 102 passing.
Approach pin (2026-10-10): Approach copy approved; the Approach page column is pinned for one viewport at lg+ (min-height 640px) and its pin progress drives the data/people split (src/lib/motion/pinStore.ts, beatsAt(u, approachPin)). Hash landing, nav anchors and the language switch verified at 80px; TH/EN at 1024×768, 1440×900 and 3440×1440. Landing JS still 193.7 kB gz. Vitest 109 passing.
Phase 7 QA (2026-10-10): Playwright suite in e2e/ (36 tests: layout 320–1920 TH/EN, motion/pin/anchors/language switch, reduced motion, no-JS, axe WCAG 2.2 A/AA (reduced motion), keyboard walk forward and back at 320/1440 with motion on and off checking focus ring, on-screen and not under the sticky header (WCAG 2.4.11; proven to fail without scroll-padding-top), SEO in out/, production CSP with zero violations). Fixed: fresh hash loads past the pin stopped short (Lenis limit cached before the spacer; lenis.resize()), footer email spilling into the LINE column, Products cards wider than the column at 320, 3px overflow from grid dots. Per-locale OG images via `npm run og`. Loading: Plex Mono not preloaded, GA lazyOnload, no next/link prefetch (all links are same-page jumps or full loads). Lighthouse local: perf 93–97, LCP 2.5–3.1 s simulated (see QA-03). Remaining: preview deploy (wrangler not logged in), GATE-01, GATE-04.
User review (2026-10-10): Thai hidden — English at `/` (PUBLISHED_LOCALES, switchTarget, languageAlternates; no hreflang while single-language; `/en/` 301 → `/`); hero h1 max 5xl; hero "Working with" lists Meditop, Touch Technologies, 500 Miles (consent received, GATE-01 done; logos pending from the user). OG is og-en.png only.
Partner logos (2026-10-10): "Working with" shows eight white single-colour logos (Meditop, Touch Technologies, Anantariverhills Resort, Leaf Lake Kans, 500 Miles, VDS Business Center, The Enterprise Resources Training, Tech It Up) made by scripts/partner-logos.py from the partners' files; sized for equal area (src/lib/site/logos.ts). VDS source is only 309 px wide (the "SVG" on its site wraps the same PNG).
Last activity: 2026-10-10 — partner logos

Progress v2: [░░░░░░░░░░] 0%

> Everything below "What Actually Shipped" describes v1. v2 decisions live in PROJECT.md Key Decisions.

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: 5.5 min
- Total execution time: ~27 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2/2 | 13 min | 6.5 min |
| 02-page | 3/3 | ~14 min | ~4.7 min |

*Updated after each plan completion*

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 03-quality-ship P01 | 1/1 | 3 min | 3 min |
| 03-quality-ship P02 | 1/1 | 2 min | 2 min |
| 03-quality-ship P03 | 1/1 | ~15 min | ~15 min |

## What Actually Shipped (Phase 2)

The codebase evolved beyond the original Phase 2 plans during iteration. Here is the actual state:

### Page Structure (page.tsx)
6 components rendered: Header, Hero, Products, HowWeWork, Contact, Footer.
3 section files exist but are NOT in page.tsx: WhatWeDo, Focus, About.

### Design Evolution
- Brand colors added: teal (#2EC4B6) and coral (#E85D4A) — departed from "fully neutral" plan
- Section titles renamed: Services, Process, Studio, Connect
- Hero changed to "Your operations simplified" with single Products CTA and hero icon
- Products have live external links (endyra.io, manverra.io, careyra.com) with logos
- Contact expanded to 4-channel grid (Email, LINE, Facebook, Telephone)
- Footer has social links row (Facebook, Twitter, LINE, Email, Privacy)
- Header uses image logo (nexto-icon.png), not text "Nexto"
- Header nav: Products, Process, Connect (3 links, not 5)
- Header has Connect CTA button on desktop, not sticky

### Build Configuration
- Static export: `output: "export"` in next.config.ts
- Images unoptimized (for static export)

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Light theme only (no toggle) — MVP simplicity
- Brand teal/coral palette added — evolved from neutral-only during iteration
- Next.js + Tailwind over Astro — future product pages expansion
- No contact form — email + LINE + Facebook + phone sufficient
- One-page scrolling layout — MVP ships fast
- Used Geist Sans (Next.js scaffold default) — satisfies sans-serif requirement
- Used max-w-5xl (1024px) for content width
- Font CSS variable applied to <html> not <body> — required for @theme scope
- Explicit border-neutral-200 always required with border class in TailwindCSS v4
- IntersectionObserver rootMargin '-20% 0px -75% 0px' for scroll-spy
- Active nav link uses brand-teal color (evolved from font-semibold-only plan)
- Header not sticky — clean minimal layout
- Plain <a> tags for hash navigation in Header (not next/link)
- Static export mode — no server-side features needed
- WhatWeDo, Focus, About sections created but excluded from page assembly — streamlined to essential sections
- Product cards link externally to product domains
- Contact section uses 4-channel grid layout
- Privacy page uses robots noindex (keep out of search results) — PRIV-01 done
- Route handlers in static export require export const dynamic = 'force-static'
- GA strategy=afterInteractive avoids blocking Lighthouse performance score
- Active nav uses brand-teal-dark (#0f786f, 5.33:1) — brand-teal (#2EC4B6) only for decorative/hover
- 10px mono labels use neutral-500 — teal reserved for transient hover states (WCAG allows)
- OG placeholder PNG generated via sharp; user should replace with real branded design before launch
- font-display:swap required on @font-face — missing caused LCP regression (Lighthouse 84->98 after fix)
- Cloudflare Pages: framework preset "Next.js (Static HTML Export)", build cmd "npm run build", output "out", NODE_VERSION=20

### Pending Todos

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-10-10
Stopped at: Phase 6 done; next is Phase 7 (Playwright suite, Lighthouse, a11y, OG image, preview deploy). Brand book still lacks IBM Plex Mono as third family (VIS-01). Known nit: Thai browser line-breaking can split words (e.g. พาร์ท/เนอร์) at narrow widths; consider Intl.Segmenter + <wbr> or nowrap spans.
Resume file: .planning/ROADMAP.md (Milestone v2)
