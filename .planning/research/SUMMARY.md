# Research Summary: Nexto Website

## Stack Decision

**Next.js 15 + TailwindCSS 4 + TypeScript** deployed to Vercel. No component libraries, no animation frameworks, no CMS. Server Components only — zero client JS for MVP (except possibly mobile menu). Inter font via `next/font` or system font stack.

## Table Stakes Features

- Clear company identity + contact info (email, LINE)
- Mobile-responsive layout
- Fast page load (Lighthouse 90+)
- Working anchor navigation
- SEO basics (title, meta, OG, sitemap, robots)
- Accessible text (contrast, keyboard nav)
- Favicon + HTTPS

## Key Architecture

Single-page site with 9 independent section components, no shared state, no data fetching. Content hardcoded in JSX. Anchor-based navigation. Pure static HTML + CSS output.

```
layout.tsx → page.tsx → [Header, Hero, WhatWeDo, Focus, Products, HowWeWork, About, Contact, Footer]
```

## Watch Out For

1. **Over-engineering** — resist adding libraries, abstractions, or state management
2. **Font loading** — use `next/font` exclusively to avoid CLS
3. **TailwindCSS v4** — CSS-based config, not `tailwind.config.js`
4. **Anchor offset** — `scroll-margin-top` to prevent header covering targets
5. **Mobile menu** — use CSS-only approach, avoid "use client"
6. **SEO check** — verify meta/OG/sitemap before deploy
7. **Performance baseline** — run Lighthouse before shipping

## Build Order Recommendation

1. **Foundation** — project setup, Tailwind config, fonts, layout, global styles
2. **Components** — all 9 sections built and assembled
3. **Polish** — responsive tweaks, SEO, accessibility, Lighthouse audit
4. **Deploy** — Vercel config, domain
