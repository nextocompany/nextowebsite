# Requirements: Nexto Website

**Defined:** 2026-02-17
**Core Value:** Visitors understand what Nexto does and can contact them within 30 seconds of landing.

## v1 Requirements

### Layout

- [ ] **LAYOUT-01**: Site renders as single scrolling page with 9 sections in specified order
- [ ] **LAYOUT-02**: Header displays "Nexto" text logo and anchor nav links (What we do, Products, How we work, About, Contact)
- [ ] **LAYOUT-03**: Header nav links scroll to corresponding sections smoothly
- [ ] **LAYOUT-04**: Mobile layout is responsive at breakpoints 360 / 768 / 1024 / 1280
- [ ] **LAYOUT-05**: Footer displays "© Nexto Co., Ltd. · Bangkok, Thailand" with Privacy link

### Hero

- [ ] **HERO-01**: Hero displays H1 "Nexto" and subtitle "Enterprise software studio."
- [ ] **HERO-02**: Hero displays two lines: "We build systems that run in production." and "From pilot to rollout."
- [ ] **HERO-03**: Hero has two CTA buttons: "Contact" scrolls to Contact section, "Products" scrolls to Products section

### Content

- [ ] **CONT-01**: What we do section shows 3 blocks (Build, Deploy, Support) with provided copy
- [ ] **CONT-02**: Focus section shows 3 bullet items with provided copy
- [ ] **CONT-03**: Products section shows 3 cards (Endyra, Manverra, Careyra) each with title, one-line description, and "View" link
- [ ] **CONT-04**: How we work section shows 4 numbered steps with provided copy and tagline "Small pilots over big promises."
- [ ] **CONT-05**: About section shows "Nexto Co., Ltd." and "A small team focused on shipping stable software."

### Contact

- [ ] **CTCT-01**: Contact section displays instruction line with provided copy
- [ ] **CTCT-02**: Email link (info@nexto.co.th) opens mail client via mailto:
- [ ] **CTCT-03**: LINE link (@nextocompany) opens LINE via https://line.me/R/ti/p/@nextocompany

### Design

- [ ] **DSGN-01**: Site uses fully neutral color palette (white bg, neutral-900 text, neutral-500 muted, neutral-200 borders)
- [ ] **DSGN-02**: Buttons are outlined, rounded-full, with gray border and hover bg shift
- [ ] **DSGN-03**: Typography uses sans-serif font, body 16-18px, headings 28-40px, max-width 900-1100px
- [ ] **DSGN-04**: Design is text-first with generous whitespace, no stock photos or hero images

### Technical

- [ ] **TECH-01**: Built with Next.js 15 App Router + TailwindCSS 4 + TypeScript
- [ ] **TECH-02**: Lighthouse Performance score 90+ on mobile
- [ ] **TECH-03**: Total page weight < 1MB (excluding fonts)
- [ ] **TECH-04**: Semantic HTML headings with WCAG AA color contrast
- [ ] **TECH-05**: Visible focus styles and keyboard-accessible navigation

### SEO

- [ ] **SEO-01**: Page title is "Nexto — Enterprise software studio"
- [ ] **SEO-02**: Meta description present (one sentence)
- [ ] **SEO-03**: OG tags set (title, description)
- [ ] **SEO-04**: Canonical URL set to https://nexto.co.th/
- [ ] **SEO-05**: robots.txt and sitemap.xml generated
- [ ] **SEO-06**: Favicon present

### Privacy

- [ ] **PRIV-01**: /privacy page exists with basic privacy policy content

## v2 Requirements

### Product Pages

- **PROD-01**: /products listing page with all 3 products
- **PROD-02**: /products/endyra detail page
- **PROD-03**: /products/manverra detail page
- **PROD-04**: /products/careyra detail page

### Analytics

- **ANLYT-01**: Plausible or GA integration
- **ANLYT-02**: Track click events (click_email, click_line, click_product_view)

### Theme

- **THEME-01**: Dark/light theme toggle

### Localization

- **I18N-01**: Thai language support

## Out of Scope

| Feature | Reason |
|---------|--------|
| Contact form | Email + LINE sufficient for MVP, avoids backend/spam complexity |
| Blog / CMS | No dynamic content needed, adds maintenance burden |
| Live chat widget | Third-party dependency, always-on expectation |
| Team photos / bios | Text-first design, "A small team" is sufficient |
| Case studies | Content creation effort beyond MVP scope |
| Pricing page | Enterprise studio — pricing is custom/negotiated |
| Newsletter signup | Requires email service, PDPA compliance |
| Animation / parallax | Contradicts Ollama-inspired minimal aesthetic |
| Multi-language | English-only for MVP |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYOUT-01 | — | Pending |
| LAYOUT-02 | — | Pending |
| LAYOUT-03 | — | Pending |
| LAYOUT-04 | — | Pending |
| LAYOUT-05 | — | Pending |
| HERO-01 | — | Pending |
| HERO-02 | — | Pending |
| HERO-03 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| CONT-04 | — | Pending |
| CONT-05 | — | Pending |
| CTCT-01 | — | Pending |
| CTCT-02 | — | Pending |
| CTCT-03 | — | Pending |
| DSGN-01 | — | Pending |
| DSGN-02 | — | Pending |
| DSGN-03 | — | Pending |
| DSGN-04 | — | Pending |
| TECH-01 | — | Pending |
| TECH-02 | — | Pending |
| TECH-03 | — | Pending |
| TECH-04 | — | Pending |
| TECH-05 | — | Pending |
| SEO-01 | — | Pending |
| SEO-02 | — | Pending |
| SEO-03 | — | Pending |
| SEO-04 | — | Pending |
| SEO-05 | — | Pending |
| SEO-06 | — | Pending |
| PRIV-01 | — | Pending |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 0
- Unmapped: 32 ⚠️

---
*Requirements defined: 2026-02-17*
*Last updated: 2026-02-17 after initial definition*
