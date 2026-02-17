# Architecture Research: Minimal Company Website (Next.js App Router)

## Component Architecture

```
app/
├── layout.tsx          # Root layout: fonts, metadata, global styles
├── page.tsx            # Home page: assembles all sections
├── globals.css         # Tailwind imports + custom properties
├── favicon.ico         # Static favicon
├── robots.ts           # Robots.txt generation
├── sitemap.ts          # Sitemap generation
└── privacy/
    └── page.tsx        # Optional privacy page

components/
├── Header.tsx          # Fixed/sticky header with nav links
├── Hero.tsx            # H1 + subtitle + CTAs
├── WhatWeDo.tsx        # 3-column service blocks
├── Focus.tsx           # 3-item principle list
├── Products.tsx        # 3 product cards
├── HowWeWork.tsx       # 4-step process
├── About.tsx           # Company info
├── Contact.tsx         # Email + LINE links
└── Footer.tsx          # Copyright + optional privacy link
```

## Component Boundaries

Each section component is:
- **Self-contained** — owns its own content and layout
- **No props needed** — content is hardcoded (no CMS, no data fetching)
- **No state** — pure presentational, server components by default
- **No inter-component communication** — sections are independent

The only "connection" is:
- Header nav links → Section `id` attributes (anchor scroll)
- Product "View" links → `#contact` anchor (MVP)

## Data Flow

```
[Build Time]
  layout.tsx → loads fonts, sets metadata
  page.tsx → renders all section components in order
  Each component → renders hardcoded content with Tailwind classes

[Runtime]
  User clicks nav link → browser scrolls to section ID
  User clicks email → opens mail client (mailto:)
  User clicks LINE → opens LINE app (deep link)
```

No API calls. No client state. No data fetching. Pure static HTML + CSS.

## Build Order (dependencies)

### Phase 1: Foundation
1. Next.js project setup (create-next-app with App Router + TypeScript + Tailwind)
2. Tailwind config (neutral color palette, typography scale, max-width)
3. Global CSS (font loading, base styles, CSS custom properties)
4. Root layout (metadata, fonts, body structure)

### Phase 2: Components
5. Header (logo + nav) — needs section IDs decided first
6. Hero section
7. All content sections (WhatWeDo, Focus, Products, HowWeWork, About, Contact)
8. Footer

### Phase 3: Polish
9. Mobile responsive adjustments
10. SEO (sitemap, robots, OG tags, canonical)
11. Accessibility audit (contrast, focus styles, keyboard nav)
12. Performance audit (Lighthouse)
13. Favicon

### Phase 4: Deploy
14. Vercel deployment config
15. Domain setup (nexto.co.th)

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Server Components only (no "use client") | No interactivity needed. Smallest possible bundle. |
| Content hardcoded in components | No CMS needed for 9 sections of static text. |
| CSS scroll-behavior instead of JS | `scroll-behavior: smooth` in CSS. No JS library needed. |
| next/font for typography | Eliminates FOUT/FOIT, self-hosted, zero CLS. |
| Static export compatible | Can use `output: 'export'` if needed, but Vercel SSG is default and better. |
| No client-side JS for MVP | Mobile hamburger is the only potential "use client" need — can use CSS-only or details/summary. |
