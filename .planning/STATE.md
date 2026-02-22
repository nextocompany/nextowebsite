# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Visitors understand what Nexto does and can contact them within 30 seconds of landing.
**Current focus:** Phase 3 — Quality + Ship

## Current Position

Phase: 3 of 3 (Quality + Ship)
Plan: 03-03 complete — ALL PLANS COMPLETE
Status: PROJECT COMPLETE — site live at nexto.co.th
Last activity: 2026-02-22 — 03-03 build verification + Cloudflare Pages deploy complete

Progress: [██████████] 100%

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

Last session: 2026-02-22
Stopped at: Completed 03-03-PLAN.md (build verification + Cloudflare Pages deploy) — PROJECT COMPLETE
Resume file: None
