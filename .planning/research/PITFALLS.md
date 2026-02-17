# Pitfalls Research: Minimal Company Website (Next.js + TailwindCSS)

## Pitfall 1: Over-Engineering a Simple Site

**What goes wrong:** Adding state management, component libraries, animation frameworks, or complex build tooling to a site that's just 9 sections of static text.

**Warning signs:**
- Installing more than 3-4 npm packages beyond Next.js/React/Tailwind
- Adding "use client" to components that don't need interactivity
- Creating abstraction layers (data models, content schemas) for hardcoded content
- Spending time on theme systems for a single-theme site

**Prevention:**
- Zero "use client" directives unless absolutely required (mobile menu only)
- No component library imports
- Content lives directly in component JSX, not in data files
- If it feels complex, it's wrong

**Phase:** Foundation (Phase 1) — set constraints early

---

## Pitfall 2: Font Loading Kills Lighthouse Score

**What goes wrong:** Using Google Fonts CDN or self-hosted fonts without proper loading strategy causes CLS (Cumulative Layout Shift) and blocks rendering.

**Warning signs:**
- `<link>` tags to Google Fonts in `<head>`
- FOUT (Flash of Unstyled Text) on page load
- Lighthouse CLS > 0.1
- Font files > 100KB total

**Prevention:**
- Use `next/font` exclusively — it self-hosts and eliminates CLS
- Subset fonts (latin only) to reduce file size
- Consider system font stack as alternative (zero download)
- Test with `font-display: swap` in dev, verify no layout shift

**Phase:** Foundation (Phase 1) — get fonts right from the start

---

## Pitfall 3: TailwindCSS v4 Migration Gotchas

**What goes wrong:** TailwindCSS v4 changed configuration from `tailwind.config.js` to CSS-based `@theme` directives. Tutorials and Stack Overflow answers for v3 don't apply.

**Warning signs:**
- Creating `tailwind.config.js` (v3 pattern) instead of CSS `@theme` block
- Using `@apply` heavily (works but discouraged in v4)
- Color tokens not matching between config and usage

**Prevention:**
- Follow v4 docs exclusively — ignore v3 tutorials
- Define custom colors in `globals.css` using `@theme` or CSS custom properties
- Use `create-next-app` which scaffolds correct Tailwind v4 setup
- Test: `npx tailwindcss --help` should show v4

**Phase:** Foundation (Phase 1) — Tailwind config is first thing set up

---

## Pitfall 4: Anchor Navigation Breaks on Mobile

**What goes wrong:** Fixed/sticky header covers the anchor target on scroll. User clicks "Products" in nav, scrolls to the section, but the heading is hidden behind the header.

**Warning signs:**
- Section headings disappear behind header after nav click
- Inconsistent scroll position across browsers
- Hash in URL doesn't match visible content

**Prevention:**
- Use `scroll-margin-top` CSS on section elements (= header height + padding)
- Or use `scroll-padding-top` on `html` element
- Test on mobile where header may be taller
- Close mobile menu before scroll (if hamburger menu used)

**Phase:** Components (Phase 2) — when building Header + sections

---

## Pitfall 5: Mobile Menu Adds Unnecessary JavaScript

**What goes wrong:** Using React state + "use client" for a hamburger menu that could be CSS-only. This adds client JS bundle for the entire page.

**Warning signs:**
- `useState` for menu open/close
- "use client" on Header component
- JS bundle > 0 for a static page

**Prevention:**
- Use `<details>` + `<summary>` HTML elements for disclosure
- Or use CSS `:target` or checkbox hack for pure-CSS toggle
- Or just show all nav items in a compact row (no hamburger needed for 5 items)
- Test: page should work with JS disabled

**Phase:** Components (Phase 2) — Header implementation

---

## Pitfall 6: Missing SEO Fundamentals

**What goes wrong:** Beautiful site but invisible to search engines. Missing meta tags, no sitemap, no robots.txt, bad OG tags.

**Warning signs:**
- No `<title>` or generic "Next.js App" title
- Missing OG image
- No canonical URL
- 404 on /sitemap.xml or /robots.txt

**Prevention:**
- Use Next.js Metadata API in `layout.tsx` for all meta
- Generate `robots.ts` and `sitemap.ts` in app directory
- Set canonical to `https://nexto.co.th/`
- Verify with `curl -s https://nexto.co.th/ | grep -E '<title|og:|canonical'`

**Phase:** Polish (Phase 3) — SEO pass after content is stable

---

## Pitfall 7: Deploying Without Performance Baseline

**What goes wrong:** Ship without checking Lighthouse. Discover issues (missing compression, large fonts, render-blocking resources) after deploy.

**Warning signs:**
- Never ran Lighthouse during development
- Page weight > 500KB for a text-only site
- First Contentful Paint > 1.5s

**Prevention:**
- Run Lighthouse in CI or locally before deploy
- Target: Performance 95+, Accessibility 100, SEO 100 (text-only site should exceed 90 easily)
- Check `next build` output for page sizes
- Verify no unused CSS/JS in bundle

**Phase:** Polish (Phase 3) — final audit before deploy
