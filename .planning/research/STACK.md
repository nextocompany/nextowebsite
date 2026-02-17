# Stack Research: Minimal Company Website

## Recommended Stack

### Core Framework
- **Next.js 15.x** (App Router) — Static generation via `output: 'export'` or default SSG. App Router is stable and the standard path.
- **React 19.x** — Ships with Next.js 15. Server Components by default.
- **TypeScript 5.x** — Type safety, standard for all Next.js projects.

### Styling
- **TailwindCSS 4.x** — Utility-first, zero runtime CSS, tree-shakes unused styles. Perfect for text-first sites.
- **No CSS-in-JS** — Avoids runtime overhead (styled-components, emotion).
- **No component library** — No shadcn/ui, no Radix, no MUI. Hand-written components with Tailwind classes for this scope.

### Fonts
- **next/font** with Inter or system font stack — Zero layout shift, self-hosted. Inter is the closest to Ollama's aesthetic.
- Alternative: system font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) for zero font download.

### SEO & Meta
- **Next.js Metadata API** — Built-in `metadata` export in layout.tsx. Handles title, description, OG tags, canonical.
- **next-sitemap** (^4.x) — Generates sitemap.xml and robots.txt at build time.

### Icons
- **No icon library needed** — Site uses text only. If needed later: inline SVGs, not icon fonts.

### Deployment
- **Vercel** — Zero-config for Next.js. Automatic static optimization. Global CDN.

## What NOT to Use

| Library | Why Not |
|---------|---------|
| Framer Motion | Adds 30KB+ bundle. Site needs zero or near-zero animation. |
| shadcn/ui, Radix | Over-engineered for a text-first one-pager with no forms or complex UI. |
| next-themes | No theme toggle in MVP. One theme only. |
| react-icons / lucide | No icons needed. Text-first design. |
| next-intl / i18n | Single language (English). No localization needed. |
| Contentlayer / MDX | No blog, no CMS. Content is hardcoded in components. |
| Analytics SDK | Optional. If added, use script tag for Plausible (no npm package needed). |

## Confidence Levels

| Choice | Confidence | Note |
|--------|-----------|------|
| Next.js 15 App Router | High | Stable, well-documented, Vercel-native |
| TailwindCSS 4 | High | v4 stable since Jan 2025, CSS-first config |
| TypeScript | High | Standard for all modern Next.js |
| next/font with Inter | High | Zero CLS, Ollama uses similar sans-serif |
| next-sitemap | Medium | Could also generate manually — small site |
| Vercel deploy | High | Best DX for Next.js, free tier sufficient |
