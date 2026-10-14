# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value (v2):** A referred visitor sees, within one screen, that Nexto connects scattered clinical data into one place, and can reach the right person in one click.
**Current focus:** v2 live; follow-ups only (see Pending Todos)

## Current Position

Milestone: v2 (healthcare repositioning), planned 2026-10-10
Phase: 7 of 7 — complete; v2 live 2026-10-14, PR #1 merged to main
Status: v1 live at nexto.co.th (commit 00441c9). Phase 4 complete (uncommitted, branch feat/v2-healthcare): brand tokens + contrast test, light/dark via prefers-color-scheme, Montserrat/Anuphan/IBM Plex Mono via next/font, TH at / and EN at /en/ (two root layouts, global-not-found, trailingSlash), full TH/EN copy dictionaries + parity test, old assets removed. Vitest 39 passing, lint/tsc/build clean. HomePage.tsx is a hero-only shell; Phase 5 builds the 8 sections from the dictionaries.
Phase 5 complete (uncommitted): 8 server-rendered sections in src/components/sections/, ui/{Section,ButtonLink,StatusChip}, src/lib/site/{constants,contact,sections}.ts (+tests), SiteHeader with anchor nav, <details> mobile menu, CTA, and LanguageSwitch (only client island; carries the current section to the other locale). Sections carry data-beat (hero/partners/approach/clusters) for Phase 6. Tailwind custom variants th:/en: (Thai heading leading, mono only for English). Vitest 55 passing; lint/tsc/build clean; no horizontal overflow at 320/375/1440 in TH/EN light/dark.
Phase 6 complete: brain geometry measured from NEXTO_Logo.ai (src/lib/network/brain.ts, 10 nodes / 19 edges, fit error 0.0001); pure scene/frame/progress/path/colour modules with tests; NetworkStage renders server SVG stills per stage (no-JS + reduced motion); NetworkCanvas (fixed canvas, draws only on scroll/intro, pauses when hidden) travels hero → approach → products → beyond; HeadingReveal for below-fold h2 (Intl.Segmenter, by line). No GSAP/Lenis (budget; see REQUIREMENTS note). Landing JS 137.6 kB gz (measured in Playwright, all loaded .js). Brand book v7 has the website-animation exception (NET-06). Vitest 93 passing.
Redesign after user review (commit 7d85f85): dark-only + page grid like cipherdigital.com, Lenis + GSAP (budget waived, 193 kB gz), logo-free network story over six stages (hero, intro, approach, how we work, products, beyond), hero = one headline + Meditop row, full-screen footer with closing line, no scroll snap. Vitest 102 passing.
Approach pin (2026-10-10): Approach copy approved; the Approach page column is pinned for one viewport at lg+ (min-height 640px) and its pin progress drives the data/people split (src/lib/motion/pinStore.ts, beatsAt(u, approachPin)). Hash landing, nav anchors and the language switch verified at 80px; TH/EN at 1024×768, 1440×900 and 3440×1440. Landing JS still 193.7 kB gz. Vitest 109 passing.
Phase 7 QA (2026-10-10): Playwright suite in e2e/ (36 tests: layout 320–1920 TH/EN, motion/pin/anchors/language switch, reduced motion, no-JS, axe WCAG 2.2 A/AA (reduced motion), keyboard walk forward and back at 320/1440 with motion on and off checking focus ring, on-screen and not under the sticky header (WCAG 2.4.11; proven to fail without scroll-padding-top), SEO in out/, production CSP with zero violations). Fixed: fresh hash loads past the pin stopped short (Lenis limit cached before the spacer; lenis.resize()), footer email spilling into the LINE column, Products cards wider than the column at 320, 3px overflow from grid dots. Per-locale OG images via `npm run og`. Loading: Plex Mono not preloaded, GA lazyOnload, no next/link prefetch (all links are same-page jumps or full loads). Lighthouse local: perf 93–97, LCP 2.5–3.1 s simulated (see QA-03). Remaining: preview deploy (wrangler not logged in), GATE-01, GATE-04.
User review (2026-10-10): Thai hidden — English at `/` (PUBLISHED_LOCALES, switchTarget, languageAlternates; no hreflang while single-language; `/en/` 301 → `/`); hero h1 max 5xl; hero "Working with" lists Meditop, Touch Technologies, 500 Miles (consent received, GATE-01 done; logos pending from the user). OG is og-en.png only.
Partner logos (2026-10-10): "Working with" shows eight white single-colour logos (Meditop, Touch Technologies, Anantariverhills Resort, Leaf Lake Kans, 500 Miles, VDS Business Center, The Enterprise Resources Training, Tech It Up) made by scripts/partner-logos.py from the partners' files; sized for equal area (src/lib/site/logos.ts). VDS source is only 309 px wide (the "SVG" on its site wraps the same PNG).
Animation pass (2026-10-10, grilled with the user): signal pulses (teal = data, coral = people) travel the network and light the nodes they reach; How we work is pinned (lg+) and tells its three items (teal wave from the origin, outer nodes connect, partner groups grow at the rim) with the view pulling back and inactive items dimmed within WCAG contrast; Products: Endyra ring (teal, spokes into the lens) and Anvira monitor trace (coral, sweep dot); Beyond: Saaniq branch in teal and coral, one trunk, a signal lights each of four engineering partners in turn (now incl. The Enterprise Resources Training and Tech It Up); footer is a seventh stage, "closing": the hero's points, all linked, live. Footer social icons: Facebook, LINE, LinkedIn, X (x.com/nextocomp). Vitest 163, Playwright 36.
Logos (2026-10-11): new Saaniq logo in Beyond, new Endyra logo in Products.
Beyond reach lines (2026-10-12, grilled with the user, terms in CONTEXT.md): the user saw reach lines pop in and out and trail the names while scrolling. Measured: 70 of 156 frames drew the network at last frame's scroll (its own rAF ran before Lenis moved the page), and the whole canvas went blank between the beyond and closing stages while the names were still on screen. Fixed: a frame clock (src/lib/motion/frameClock.ts) that MotionRoot drives from gsap.ticker right after lenis.raf, so the network draws in the same tick (0 stale frames); every name keeps its reach line on screen or not; the canvas keeps drawing while any partner name is on screen. e2e/beyond.spec.ts covers all three. Vitest 168, Playwright 39.
Beyond to footer (2026-10-12, second review, grilled one question at a time): the reach lines and the hero-like closing looked busy and dark. Removed the reach lines (src/lib/network/reachSignals.ts, path.ts, drawReach); engineering partners get a CSS marker and light in turn (globals.css partner-name/partner-marker, --i/--n from Beyond.tsx). Close beat now fades the story out over Contact (u 5.1 → ~5.8) and then gathers the brain (core nodes at their united positions, from 35% of the way out to scatter) in a small square closing stage above the closing line; still, one calm signal every other cycle (Frame.calm). scene.closeEdges and the closing dim are gone. The frame clock from the first fix stays. Vitest 160, Playwright 37.
Copy (2026-10-12, grilled one question at a time): formal wording in English and the hidden Thai, no em dashes anywhere user-facing (titles use |), Thai says พันธมิตร for partner (CONTEXT.md). Slogans kept, only "make the call" → "make the decisions" and คน → บุคลากร.
Mobile (2026-10-12, grilled one question at a time): below lg with motion on, Approach and How we work hold the network in the top half of the screen (sticky [data-hold] stage, globals.css, unlayered) while the text passes below and fades out at mid-screen (--hold-cut mask set by pins.ts holdNarrow). How we work carries on the pin (data-hold="continue"): its text starts under the network and the canvas keeps the network still between the two held stages (NetworkCanvas heldCy). Beat progress is the text passing mid-screen. Wide short screens keep followHowWeWorkStage. Header is sticky everywhere and slides away reading down below lg (HeaderAutoHide). Phone footer: brain, closing line, social links, rights only. Partner logos in a 4×2 grid on a backing below sm. Sections py-16 below sm; Products/Beyond stages 2:1; product cards tighter. Vitest 160, Playwright 40.
Release A (2026-10-14, grilled one question at a time; see docs/adr/0001): Thai is back at /th/ after a copy review (6 fixes; intro line shortened and starts with เรา / We; footer company line in English in both). Language switch, hreflang (x-default English), two-language sitemap, og-th.png. Primary CTA is now Request a demo / ขอนัดสาธิตระบบ (the medical device partner is Meditop, so the site speaks to hospitals); contact topics: Request a demo, Product inquiries, Engineering services. Organization JSON-LD on both homes (logo public/brand/nexto-mark-512.png, also the apple icon). Thai words the browser would split (รีสอร์ต, ส่องกล้อง) are kept together (lib/text/keepTogether). Vitest 166, Playwright 51.
Release B (2026-10-14, copy approved by the user): product pages /endyra/, /anvira/ and their Thai pages (components/ProductPage.tsx, copy in productPages of en.ts/th.ts, blocks: cards, steps, list, callout). True claims only: Endyra 4K 60fps, foot switch capture, search under a second, export, setup within a day, no internet needed, support every day, "In use in Thailand" (no customer named); no bookmark, no multi-station, no backups, no uptime/compliance claims. Anvira: HIS history for the assessment, electronic record from monitors and the anesthesia machine, manual fallback, export to the HIS; pilot hospitals only. Contacts endyra@ / anvira@nexto.co.th (PRODUCT_EMAIL), LINE @nextocompany. Product cards link to the pages ("Learn more"); the language switch keeps the page; sitemap lists all six pages with hreflang. The motion flag script moved from RootDocument to HomePage, so pages without the canvas (products, privacy) keep their network stills. Vitest 167, Playwright 60.
Old Endyra site: Worker endyrawebsite (custom domain endyra.nexto.co.th) deleted 2026-10-14, no redirect (user: it was a placeholder; old traffic and standing not wanted). User to set up the endyra@ and anvira@nexto.co.th mailboxes.
Product identity (2026-10-14, user: the pages had no feel of their own products): each product page sets data-product, so --accent / --accent-text give it the colour from its logo (Endyra #c4f25e; Anvira #8f94f5, text #a5a9f7 for 4.5:1 on raised cards; tokens.ts PRODUCT_PAIRS). The call to action, status chip, labels, step numbers and callout rule use it. The top visual is the product's own shape from the network story (ProductMark: Endyra's lens, Anvira's monitor trace with the logo's coral dot on the spike). Endyra copy corrected against nextocompany/endyra main: Full HD stills (capture card takes up to 4K60), withdrawal recording and timing (video is 720p30, colonoscopy withdrawal only), PDF reports; no 4K recording, no clip export. Next: product UI drawings from real screenshots (run nextocompany/endyra locally; needs Go, pnpm, ffmpeg).
Endyra screen (2026-10-14): ran nextocompany/endyra locally (demo seed, mock capture, no webcam; portal on :3100, kiosk renderer via Vite API on :5199) and drew its kiosk capture screen in the new identity (components/product/EndyraScreen.tsx): insertion and withdrawal timers, foot switch capture, Record video, captured images, sample data only, captioned as an illustration. The lime "⊃ Endyra" logo and CI is a rebrand the Endyra software itself has not adopted yet (it still shows the blue ENDYRA mark); updating it is work for nextocompany/endyra. Anvira: nextocompany/anesync is Phase 0 with no UI, so its page keeps only the monitor trace until real screens exist.
Production (2026-10-14, user approved): deployed nextowebsite version 944b1f0f (rollback target 4ce3829b, the Feb site). nexto.co.th is served by the Worker nextowebsite (custom domain), not the nexto-website Pages project. GATE-04 done.
Production Lighthouse (2026-10-14): performance 84–95 warm, LCP 2.7–3.8 s (hero h1), CLS 0, a11y/SEO 100, best practices 100 after the user turned off the Cloudflare Web Analytics snippet. LCP accepted by the user. Details in QA-03.
Last activity: 2026-10-14 — v2 merged and live; production measured; planning docs brought up to date

Progress v2: [██████████] 100%

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

- Endyra software rebrand to the lime logo: user, in nextocompany/endyra.
- Anvira screens: user, in the Anvira repo; the product page keeps the monitor trace until then.
- Done 2026-10-14: endyra@ and anvira@nexto.co.th mailboxes exist (user); Cloudflare Web Analytics snippet off; LCP 2.7–3.8 s accepted (QA-03).

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-10-14
Stopped at: v2 live and merged; planning docs updated. Next is one of the Pending Todos. Brand book still lacks IBM Plex Mono as third family (VIS-01).
Resume file: .planning/STATE.md (Pending Todos)
