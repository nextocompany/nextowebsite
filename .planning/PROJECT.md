# Nexto Website

## What This Is

A minimal, text-first company website for Nexto Co., Ltd. — an enterprise software studio based in Bangkok. Single scrolling page that tells visitors who Nexto is, what they build, their products, and how to get in touch. Ollama-inspired design: neutral palette, generous whitespace, no fluff.

## Core Value

Visitors understand what Nexto does and can contact them within 30 seconds of landing.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] One-page scrolling site with 8 sections: Hero, What we do, Focus, Products, How we work, About, Contact, Footer
- [ ] Header with text logo "Nexto" and anchor nav links
- [ ] Mobile-responsive layout (360 / 768 / 1024 / 1280 breakpoints)
- [ ] Contact section with clickable email (mailto:info@nexto.co.th) and LINE link (https://line.me/R/ti/p/@nextocompany)
- [ ] 3 product cards (Endyra, Manverra, Careyra) with "View" links
- [ ] SEO baseline: title, meta description, OG tags, canonical URL, robots.txt, sitemap.xml, favicon
- [ ] Lighthouse performance 90+ on mobile
- [ ] Page weight < 1MB (excluding fonts)
- [ ] Semantic HTML with WCAG AA contrast and keyboard-accessible nav
- [ ] Deployment-ready for Vercel

### Out of Scope

- Theme toggle (dark/light) — MVP ships light only
- Contact form — skip for MVP, email + LINE sufficient
- Product detail pages (/products/*) — deferred to Phase 2
- Analytics integration — optional, not required for MVP
- Animations/motion — none or extremely subtle only
- Blog, CMS, or dynamic content
- Stock photos or hero images

## Context

**Design reference:** ollama.com — text-first, neutral palette (black/white/gray only), generous whitespace, rounded-full outlined buttons, minimal decoration, no gradients or shadows, subtle hover state transitions (bg shifts to light gray).

**Copy:** All copy is final and provided verbatim in the spec. Do not rewrite or add marketing language.

**Color palette (fully neutral, Ollama-inspired):**
- Background: #FFFFFF
- Text: #171717 (neutral-900)
- Muted text: #737373 (neutral-500)
- Borders: #E5E5E5 (neutral-200)
- Hover states: #F5F5F5 (neutral-100)
- Buttons: outlined, rounded-full, border gray, hover bg shift
- No accent color — links/CTAs differentiated by weight or underline

**Typography:**
- Body: 16–18px, line-height 1.6
- Headings: 28–40px
- Max content width: 900–1100px
- Sans-serif (system or Inter/similar)

**Page sections (in order):**
1. Header — "Nexto" text logo + anchor nav (What we do, Products, How we work, About, Contact). Mobile: hamburger or compact header.
2. Hero — H1 "Nexto", subtitle "Enterprise software studio.", two lines, Contact + Products buttons
3. What we do — 3 columns (Build, Deploy, Support) with 1-2 lines each
4. Focus — 3-item bullet list (reliability, on-prem, security)
5. Products — 3 cards (Endyra, Manverra, Careyra) with title, one-line desc, "View" link
6. How we work — 4 numbered steps + tagline "Small pilots over big promises."
7. About — "Nexto Co., Ltd." + "A small team focused on shipping stable software."
8. Contact — instruction line + email link + LINE link
9. Footer — copyright + optional Privacy link

## Constraints

- **Tech stack**: Next.js (App Router) + TailwindCSS, static generation, deploy to Vercel
- **Performance**: Lighthouse 90+ mobile, < 1MB page weight, no heavy UI libraries
- **Tone**: Short sentences, direct language, no buzzwords, no marketing fluff, max 2 lines per block
- **Visual**: Text-first, lots of whitespace, no stock photos, no hero images/videos
- **Copy**: Use provided copy exactly as written — do not embellish

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Light theme only (no toggle) | MVP simplicity, ship fast | — Pending |
| Fully neutral palette (no accent color) | Match Ollama aesthetic — grays only | — Pending |
| Next.js + Tailwind over Astro | Better for future product pages expansion | — Pending |
| No contact form for MVP | Email + LINE sufficient, reduces complexity | — Pending |
| One-page scrolling layout | MVP ships fast, all info above/below fold | — Pending |

---
*Last updated: 2026-02-17 after initialization*
