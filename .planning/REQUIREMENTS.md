# Requirements: Nexto Website

**Core Value (v2):** A referred visitor sees, within one screen, that Nexto connects scattered clinical data into one place, and can reach the right person in one click.

## v2 Requirements (milestone: healthcare repositioning, defined 2026-10-10)

### Foundation

- [ ] **FND-01**: Colour tokens in `globals.css` come from the Nexto brand book `tokens.json` (teal #00B0B6, coral #F15A4B, charcoal #414142, mist #E7E8E9, teal-text #007A7E / #5ED3D7, coral-text #C24433 / #F6958B, ground, ground-raised, ink, ink-muted). Old #2EC4B6 / #E85D4A removed.
- [ ] **FND-02**: Light and dark themes follow `prefers-color-scheme`; every text/ground pair meets 4.5:1 in both. A CTA filled with coral uses `coral-text`; teal fills carry ink-coloured text (white on #F15A4B is only 3.33:1).
- [ ] **FND-03**: Montserrat (Latin) and Anuphan (Thai) self-hosted via `next/font`, `display: swap`.
- [ ] **FND-04**: Old assets removed: Manverra and Careyra logos, `endyra-logo.svg` (off-system), unused Next.js scaffold SVGs.

### Internationalisation

- [ ] **I18N-01**: Thai at `/`, English at `/en`, each with its own root layout so `<html lang>` is `th` or `en`.
- [ ] **I18N-02**: Language switch in the header keeps the visitor on the same section.
- [ ] **I18N-03**: All copy lives in one dictionary per language; a test fails if the TH and EN key sets differ.
- [ ] **I18N-04**: `hreflang` alternates and per-locale canonical URLs; sitemap lists both.
- [ ] **I18N-05**: `/privacy` and the 404 page still build and render after the route split; `/en` resolves on Cloudflare after static export.

### Sections and copy (approved 2026-10-10)

- [x] **COPY-01 Hero**: TH "ข้อมูลที่กระจัดกระจาย รวมไว้ในที่เดียว" / EN "Scattered data, brought together." Sub: TH "Nexto ทำเรื่องยุ่งยากให้เป็นเรื่องง่าย ด้วยซอฟต์แวร์ที่เชื่อมข้อมูลจากหลายระบบและหลายเครื่องมือเข้าด้วยกัน เพื่อให้ทีมแพทย์และองค์กรทำงานได้ง่ายขึ้น" / EN "Nexto makes the complex simple, with software that connects data from many systems and devices so clinical teams and organizations can work with less friction." Primary CTA "ร่วมเป็นพาร์ทเนอร์ / Partner with us", secondary "ดูสิ่งที่เราทำ / See what we build".
- [x] **COPY-02 Partner bar**: "ทำงานร่วมกับ / Working with" · Meditop. Name as text until logo file and written consent arrive.
- [x] **COPY-03 Approach**: TH "ระบบจัดการข้อมูล คนเป็นผู้ตัดสินใจ" / EN "Systems handle the data. People make the call." plus the two-hemisphere logo story (text in conversation draft).
- [x] **COPY-04 How we work**: three points — start where the work happens; connect to what's already there; grow with partners. Not numbered (not a sequence).
- [x] **COPY-05 Products**: Endyra `พร้อมใช้งาน / Available` — endoscopy video and image capture (name as text; current Endyra logo is off-system); Anvira `อยู่ระหว่างพัฒนา / In development` — perioperative anesthesia information system, shown with its wordmark logo.
- [x] **COPY-06 Beyond healthcare**: Saaniq (all-in-one hotel and resort management, PMS to CRM, HR and finance); engineering partnerships in the government sector with Touch Technologies and 500 Miles (names as text until logos and consent).
- [x] **COPY-07 Contact**: TH "คุยกับเรา" / EN "Talk to us"; three topic buttons (medical device partnership, our products, engineering work) as `mailto:info@nexto.co.th` with pre-filled subjects; LINE @nextocompany. Email and LINE ID also shown as selectable text.
- [x] **COPY-08 Closing line**: TH "เชื่อมข้อมูล เพื่อการดูแลที่ดีขึ้น" / EN "Connecting data for better care."
- [x] **COPY-09**: No team-experience section, no founder section, no hospital-deployment claims, no numbers that are not real.

### Visual design

- [ ] **VIS-01**: Reference language from cipherdigital.com (decided 2026-10-10, redesign): dark only (brand book dark theme), a hairline page grid with dots where lines cross, short headlines in a lighter weight, square-ish buttons, one accent (teal). IBM Plex Mono for English labels and numbers only.
- [x] **VIS-02**: Header: Nexto logo (brand book file), anchor nav, language switch, primary CTA; collapses on mobile.
- [ ] **VIS-03**: Layout works at 320, 375, 768, 1024, 1440, 1920 with no horizontal scroll.

### Network motion (signature)

- [x] **NET-01**: Canvas 2D neural network, no logo: the story is told by the network alone (user, 2026-10-10). Layout is generated, seeded and deterministic (`src/lib/network/scene.ts`).
- [x] **NET-02**: Six stages, each a still at its scroll position: hero — full-screen scattered network drifting; intro — the nodes gather into one network; approach — the network splits into data (teal) and people (coral) with dim bridges, then rejoins; how we work — outer nodes link in; products — clusters, the two main ones over the Endyra and Anvira cards; beyond — lines run down the column gutter to the engineering partner names.
- [x] **NET-03**: Colours read from CSS tokens at runtime; canvas scales for `devicePixelRatio`, lines never thinner than one device pixel; drawing runs only on scroll or while the hero drifts, and stops when no stage is on screen or the tab is hidden.
- [x] **NET-04**: Fewer nodes on small screens; `prefers-reduced-motion` shows a static frame per beat and disables Lenis.
- [x] **NET-05**: Layout and interpolation maths live in pure functions with unit tests.
- [ ] **NET-06**: Brand book exception rewritten for the logo-free network (coral group in the approach beat, teal hubs and partner lines).

> **Redesign 2026-10-10 (user decisions):** dark only + page grid after the reference; Lenis + GSAP ScrollTrigger added and the 150 kB JS budget waived; the logo/brain no longer tells the story, the neural network does; no scroll snap. Beat 4 (partner lines) stays in Beyond (option ก).

### Text motion

- [x] **MOT-01**: Below-fold `[data-reveal]` text rises in by line with GSAP: lines come from `Intl.Segmenter` (Thai and English; SplitText not used because it splits Thai badly). `[data-fade]` blocks fade up. Hero headline lifts, fades and blurs on scroll-out (scrub).
- [x] **MOT-02**: Server-rendered HTML ships all text visible (never `opacity: 0` before JS); the hero headline is the LCP element and must not wait for animation.
- [x] **MOT-03**: Lenis smooth scroll (lerp 0.085) driven from the GSAP ticker; off under reduced motion. Anchors land below the header via `scroll-padding-top` (checked: /en/#products top = 80px). No scroll snap (user, 2026-10-10).

### Quality

- [ ] **QA-01**: Vitest: network layout/interpolation, TH/EN key parity, mailto builder (Thai subjects encoded).
- [ ] **QA-02**: Playwright screenshots at 320, 768, 1024, 1440 in light and dark, plus one reduced-motion run, for `/` and `/en`.
- [ ] **QA-03**: Lighthouse mobile 90+, LCP < 2.5s, CLS < 0.1. JS budget waived by the user on 2026-10-10 for Lenis + GSAP: landing JS measured 193 kB gz (Playwright, all loaded .js), motion chunks load after hydration.
- [ ] **QA-04**: Keyboard reaches every link and button with a visible focus ring; automated a11y check passes.
- [ ] **QA-05**: OG image regenerated with the new brand; titles and descriptions per locale.

### Launch gates (must all be true before production)

- [ ] **GATE-01**: Written consent and logo files from Meditop, Touch Technologies and 500 Miles — or the page ships with names as text.
- [x] **GATE-02**: Decided 2026-10-10: the Anvira logo may be shown on the site (user accepted the pre-filing risk).
- [x] **GATE-03**: Decided 2026-10-10: link the Saaniq card to saaniq.com (a new Saaniq site is coming).
- [ ] **GATE-04**: User reviews a preview deployment and explicitly approves production.

## Out of Scope (v2)

| Feature | Reason |
|---------|--------|
| Product detail pages (`/endyra`, `/anvira`) | Next milestone; Endyra may be renamed pending trademark result |
| Contact form | Email + LINE per topic; static site has no backend |
| Team / founder section | User decision |
| Three.js / WebGL | Canvas 2D keeps the JS budget |
| Thai custom logo for Anvira | User: not needed |

## v1 Requirements (archived, shipped 2026-02-22)

LAYOUT-01..05, HERO-01..03, CONT-01..05, CTCT-01..03, DSGN-01..04, TECH-01..05, SEO-01..06, PRIV-01. Superseded by v2 except SEO-05 (robots/sitemap), SEO-06 (favicon), PRIV-01 (privacy page) and GA, which carry over.

---
*v1 defined 2026-02-17 · v2 defined 2026-10-10*
