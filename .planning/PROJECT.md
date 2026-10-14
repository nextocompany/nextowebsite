# Nexto Website

## What This Is

The company website for Nexto Co., Ltd. (nexto.co.th). Milestone v2 repositions Nexto from a general software house to a **healthcare software company**: clinical software built around real Thai clinical workflows, sold together with medical-device partners. Non-healthcare work (Saaniq, engineering partnerships) stays on the page in a secondary "Beyond healthcare" band.

The site is a **credibility check, not lead-gen**: every customer arrives through the owner's network and visits the site to confirm what they were told. Nothing on the page may overclaim.

## Core Value

A visitor who was referred to Nexto sees, within one screen, that Nexto connects scattered clinical data into one place, and can reach the right person in one click.

## Requirements

See `.planning/REQUIREMENTS.md` (v2 section). v1 requirements are archived there.

## Context

**Brand sources of truth (read before building):**
- Nexto brand book (Design System artifact): https://claude.ai/artifact/NajH55P5SWDik7mQMF9fhc — logo files, colour tokens, type, network motif, voice. Its `tokens.json` is the only source for colours.
- Anvira brand sheet (private): https://claude.ai/artifact/PHQk44Nx54fNAZW8PZwigm
- Logo source: `~/My Drive/Nexto Company/Artwork/Logo-nex/NEXTO_Logo.ai` (stamp page = exact node centres of the brain mark). Anvira files: `~/My Drive/Nexto Company/Artwork/Anvira/`.

**Design reference:** cipherdigital.com — take all of it: dark ground with one accent, very large short headlines, mono labels, GSAP ScrollTrigger text reveals, Lenis smooth scroll, a "Trusted by" logo bar. Adapt: Nexto teal replaces the lime accent, coral is used sparingly, and its large stats are replaced with real facts only.

**Signature element:** Nexto's neural-network brain (the "O" of the logo) drives a scroll story in four company-level beats (no product-specific beats).

**Copy:** drafted in conversation on 2026-10-10 and approved; it is in REQUIREMENTS.md v2 (COPY-*). Thai is the primary language; English is the alternate.

## Constraints

- **Stack:** Next.js 16 App Router, static export (`output: "export"`), Tailwind CSS v4, TypeScript.
- **Hosting:** Cloudflare Worker `nextowebsite` (custom domain nexto.co.th), from `wrangler.jsonc` serving `./out`; not the `nexto-website` Pages project. Every deploy needs a fresh `npm run build`; the local `out/` is stale. Cloudflare Web Analytics injects a beacon the CSP blocks (see QA-03).
- **CSP (`public/_headers`):** `font-src 'self'` means fonts self-host via `next/font`; no Google Fonts `<link>`. GSAP and Lenis come from npm. Static export cannot use nonces, so the existing `'unsafe-inline'` script policy stays.
- **Performance:** Lighthouse mobile 90+, LCP < 2.5s, CLS < 0.1, landing JS < 150 kB gzipped. GSAP and Lenis load by dynamic import after first paint.
- **Honesty:** no hospital-deployment claims, no invented numbers, no stock imagery implying hospital use.
- **Production deploy only after the user explicitly approves a preview.**

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Healthcare-first single page, "Beyond healthcare" band at the bottom | 70% of revenue is non-healthcare but every visitor is referred and must be able to confirm what they were told | v2 |
| Thai primary at `/`, English at `/en` | Referred visitors are Thai; clinicians and procurement read Thai faster | Replaced: English at `/`, Thai at `/th/` |
| Light and dark themes, following the system setting | Reference is dark; hospital executives often read on light | Replaced: dark only (redesign 2026-10-10) |
| Neural-network scroll story, 4 company-level beats, canvas 2D | The motif is Nexto's own (logo since 2016), not decoration | v2 |
| Colours from the brand book tokens (teal #00B0B6, coral #F15A4B, charcoal #414142) | The current `globals.css` values (#2EC4B6, #E85D4A) drifted from the logo | v2 |
| Montserrat + Anuphan via `next/font` | Brand book typography; self-hosting satisfies CSP | v2 |
| No team-experience section, no founder section | User decision 2026-10-09/10 | v2 |
| Manverra and Careyra removed | Discontinued products | v2 |
| Approach copy: "Everything we build draws a clear line…" / "ทุกระบบที่เราสร้างแบ่งหน้าที่ชัดเจน…" | Drops the logo reference; user approved 2026-10-10 | v2 |
| Approach is pinned (ScrollTrigger) for one viewport at lg+ and min-height 640px; the split plays inside the pin | Reference-style pinned beat; the page column is pinned, not the section, so anchors and the language switch keep the real section top. Narrow, short, reduced-motion and no-JS screens scroll freely | v2 |
| English only for now, at `/`; Thai hidden (copy kept in `th.ts`, returns at `/th/`); `/en/` → `/` via `public/_redirects` | User decision 2026-10-10 | Thai returned at `/th/` 2026-10-14 |
| Thai at `/th/` with switch, hreflang (x-default English); primary CTA Request a demo; product pages `/endyra/`, `/anvira/` under Nexto | Release A and B, 2026-10-14; the medical device partner is Meditop, so the site speaks to hospitals (docs/adr/0001) | v2 |
| Each product page takes its logo colour and its shape from the network story | User 2026-10-14: the pages had no feel of their own products | v2 |
| Old endyra.nexto.co.th removed without a redirect | User 2026-10-14: it was a placeholder | v2 |
| Hero headline max `5xl`; "Working with" is one row of every customer and partner | User review 2026-10-10 | v2 |
| Teal carries data, coral carries people, across the whole network (signal pulses) | User choice 2026-10-10 over random twinkles | v2 |
| How we work pinned with three synced steps; stacked screens follow the stage's own pass, no dimming | User choice 2026-10-10; stacked change because the stage sits below the list | v2 |
| Product shapes: Endyra ring, Anvira stylised monitor trace (no values) | User choice 2026-10-10 | v2 |
| Footer is a closing stage: the Nexto brain gathers above the closing line, still, with an occasional signal; the network fades out over Contact | User review 2026-10-12: the hero-like full-screen ending looked darker and busier than the hero (replaces "the hero's points, all linked", 2026-10-10) | v2 |
| Beyond: no lines to the engineering partners; each name has a marker and they light in turn (CSS) | User review 2026-10-12: the reach lines looked busy, worse as they ran down the page | v2 |
| Light theme only, neutral palette, no motion (v1) | Superseded by v2 | Replaced |

---
*Last updated: 2026-10-14 — v2 live on nexto.co.th*
