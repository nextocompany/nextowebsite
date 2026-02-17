# Phase 1: Foundation - Research

**Researched:** 2026-02-17
**Domain:** Next.js 15 App Router + TailwindCSS v4 + TypeScript project scaffolding
**Confidence:** HIGH

---

## Summary

This phase establishes a Next.js 15 project with TailwindCSS v4 and TypeScript, configured with a neutral design system. As of Next.js 15.2 (March 2025), `create-next-app@latest` ships with TailwindCSS v4 by default — meaning project creation is a single command. No manual Tailwind installation or migration is needed for new projects.

TailwindCSS v4 is a major paradigm shift from v3: the `tailwind.config.js` file is gone, replaced by CSS-first configuration via the `@theme` directive inside `globals.css`. Content detection is automatic. The PostCSS plugin is now `@tailwindcss/postcss` (a separate package from `tailwindcss`). These are not gotchas if starting from scratch with `create-next-app@latest`; the scaffolding handles them automatically.

The neutral color palette required by the design spec (`neutral-100`, `neutral-200`, `neutral-500`, `neutral-900`) is part of Tailwind's built-in palette and requires zero custom configuration. The primary implementation work is: overriding the body font (Geist is the new Next.js default, which is appropriate), setting typographic scale in `globals.css`, and building a reusable Button component following the outlined `rounded-full` pattern.

**Primary recommendation:** Scaffold with `npx create-next-app@latest --typescript --tailwind --eslint --app` then configure typography and Button in `globals.css` + a single component file. Do not create `tailwind.config.js` — use `@theme` in CSS only.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x (latest) | React framework, App Router, file-system routing | Required by TECH-01, enables future product page expansion |
| TailwindCSS | 4.x (latest) | Utility CSS, design tokens | Required by TECH-01; v4 is now default in create-next-app |
| TypeScript | 5.x (auto-installed) | Type safety | Required by TECH-01; zero config with create-next-app |
| `@tailwindcss/postcss` | 4.x | TailwindCSS PostCSS plugin (v4 specific) | Replaces the old `tailwindcss` PostCSS usage; auto-configured by scaffold |
| React | 19.x | UI library | Bundled with Next.js 15 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/font/google` | built-in | Zero-layout-shift font loading | Use for Geist Sans (default) or any Google Font |
| ESLint | 9.x | Code quality | Auto-configured by create-next-app with flat config |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/font/google` for Geist | Custom `@font-face` | next/font eliminates FOUT, FOIT, and CLS; never hand-roll font loading |
| `@theme` in globals.css | `tailwind.config.js` | v4 no longer supports JS config for new projects; CSS-first is the standard |
| ESLint flat config (auto) | Biome | ESLint is the Next.js default and has the widest plugin ecosystem |

**Installation (scaffold creates everything):**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

This installs: `next`, `react`, `react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `typescript`, `eslint`, `eslint-config-next`.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout: font CSS variable, <html> class
│   ├── page.tsx         # Root page: blank shell (just returns <main>)
│   └── globals.css      # @import "tailwindcss", @theme tokens, base styles
├── components/
│   └── ui/
│       └── Button.tsx   # Outlined rounded-full button component
└── lib/                 # Utility functions (empty for this phase)
public/                  # Static assets
```

### Pattern 1: TailwindCSS v4 CSS-First Configuration

**What:** All design tokens live in `globals.css` under the `@theme` directive. No `tailwind.config.js` is created or needed.

**When to use:** Always, for all custom tokens in v4.

**Example:**

```css
/* src/app/globals.css */
/* Source: https://tailwindcss.com/docs/theme */

@import "tailwindcss";

@theme {
  /* Font — link next/font CSS variable into Tailwind's font-sans */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

/* Base styles — typography and layout defaults */
@layer base {
  html {
    font-size: 17px; /* midpoint of 16-18px range */
  }

  body {
    @apply bg-white text-neutral-900 antialiased;
    font-family: var(--font-sans);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
    font-weight: 600;
  }

  h1 { @apply text-4xl; }    /* 40px at default scale */
  h2 { @apply text-3xl; }    /* 36px */
  h3 { @apply text-2xl; }    /* 28px */
}
```

**Note on v4 border color:** In TailwindCSS v4, the default border color changed from `gray-200` to `currentColor` (matching browser defaults). For the outlined button pattern, always specify the border color explicitly (e.g., `border-neutral-200`). Do NOT rely on an implicit default border color.

### Pattern 2: Font Loading via next/font

**What:** Use `next/font/google` (or the built-in Geist) to load fonts with zero CLS. Apply the CSS variable to `<html>`, reference it in `@theme`.

**When to use:** Every time a web font is needed.

**Example:**

```tsx
// src/app/layout.tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts

import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
```

**Critical:** Apply the font variable class to `<html>`, not `<body>`. The CSS variable must be on a parent element for `@theme` to reference it.

### Pattern 3: Outlined Rounded-Full Button Component

**What:** A reusable Button component matching the Ollama aesthetic — outlined, `rounded-full`, neutral border, hover state shifts background to `neutral-100`.

**When to use:** All CTA elements.

**Example:**

```tsx
// src/components/ui/Button.tsx

import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-full
        border border-neutral-200
        bg-white text-neutral-900
        px-6 py-2
        text-sm font-medium
        transition-colors duration-150
        hover:bg-neutral-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Pattern 4: Content Width Constraint

**What:** Max-width container (900-1100px) applied at the layout or section level.

```tsx
// Applied to wrapping divs in sections
<div className="mx-auto max-w-5xl px-6">
  {/* max-w-5xl = 1024px, within 900-1100px spec */}
  {children}
</div>
```

Alternative: `max-w-4xl` (896px) or `max-w-[1100px]` for exactly 1100px.

### Anti-Patterns to Avoid

- **Creating `tailwind.config.js`:** In v4, this is unsupported for new projects. Use `@theme` in CSS instead.
- **Using `@tailwind base/components/utilities` directives:** In v4, these are replaced by a single `@import "tailwindcss"`.
- **Using `tailwindcss` directly as a PostCSS plugin:** v4 requires `@tailwindcss/postcss` package. Using `tailwindcss` directly as a PostCSS plugin throws an error.
- **Applying font variable class to `<body>` instead of `<html>`:** The CSS variable needs to be on an ancestor of `@theme` consumers; `<html>` is the correct scope.
- **Relying on implicit border color:** In v4, borders have no default color; always add `border-neutral-200` (or your chosen color) explicitly.
- **Adding `postcss-import` or `autoprefixer` to PostCSS config:** v4 handles these automatically; duplicating them causes conflicts.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Web font loading | Custom `@font-face` + preloading | `next/font/google` | Handles FOUT, FOIT, CLS, preloading, self-hosting automatically |
| CSS reset | Custom global reset | TailwindCSS v4 preflight (included in `@import "tailwindcss"`) | Preflight is Tailwind's opinionated browser reset; it handles box-sizing, margin resets, etc. |
| TypeScript config | Manual `tsconfig.json` | `create-next-app` default | Next.js generates an optimized tsconfig with correct lib, jsx, moduleResolution settings |
| ESLint config | Custom rules from scratch | `eslint-config-next` | Contains Next.js-specific rules (Core Web Vitals, accessibility) |
| Class merging utility | Custom string concat | Accept prop-based overrides with spread | For Phase 1 simplicity; add `clsx`/`tailwind-merge` only if needed |

**Key insight:** In this stack, every non-business-logic concern has a blessed tool. The foundation phase is mostly configuration, not custom code.

---

## Common Pitfalls

### Pitfall 1: Wrong PostCSS Plugin Package

**What goes wrong:** Build fails with error "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin."

**Why it happens:** TailwindCSS v4 moved the PostCSS plugin to a separate package (`@tailwindcss/postcss`). If `postcss.config.mjs` references `tailwindcss` instead of `@tailwindcss/postcss`, builds fail immediately.

**How to avoid:** `create-next-app@latest` (15.2+) configures this correctly automatically. If configuring manually: install `@tailwindcss/postcss` and use it in `postcss.config.mjs`.

**Warning signs:** Error at `npm run dev` start mentioning "PostCSS plugin" before any page loads.

---

### Pitfall 2: Tailwind Classes Not Applied (Content Detection)

**What goes wrong:** TailwindCSS utility classes are in the HTML but produce no styles.

**Why it happens:** v4 uses automatic content detection but may miss files if the project structure is unusual. In v3, a `content` array was required; that's gone, but the scanner needs to find the files.

**How to avoid:** Use the standard `src/app/` structure from `create-next-app`. If adding template files outside the project root, use `@source "../external-path"` in `globals.css`.

**Warning signs:** Classes in JSX produce no visual effect; browser DevTools shows no generated CSS for the class.

---

### Pitfall 3: Font CSS Variable Scope

**What goes wrong:** Font doesn't apply; `var(--font-geist-sans)` resolves to empty.

**Why it happens:** The CSS variable from `next/font` is injected at the element where `.variable` class is applied. If that's `<body>`, and `@theme` references it from `<html>`, the variable isn't in scope.

**How to avoid:** Always apply `className={font.variable}` to the `<html>` element in `layout.tsx`.

**Warning signs:** Font in browser DevTools shows system-ui fallback, not the loaded font; `--font-geist-sans` is undefined in DevTools CSS variables panel.

---

### Pitfall 4: Border Color Invisible on Outlined Buttons

**What goes wrong:** Button renders with no visible border even though `border` class is applied.

**Why it happens:** TailwindCSS v4 changed the default border color from `gray-200` to `currentColor`. Unlike v3 where `border` alone gave a visible light gray line, in v4 `border` with `currentColor` on a `text-neutral-900` element gives a dark border, not the intended design.

**How to avoid:** Always explicitly pair `border` with `border-neutral-200` (or your specific border color).

**Warning signs:** Button border appears dark/black instead of light gray; removing explicit color class changes nothing.

---

### Pitfall 5: TypeScript Errors Blocking Build

**What goes wrong:** `npm run build` fails on type errors that weren't caught during development.

**Why it happens:** `next build` runs TypeScript type checking. Common sources in this phase: missing `React.ReactNode` type on layout children, incorrect event handler types on Button component.

**How to avoid:** Enable `"strict": true` in `tsconfig.json` (default in `create-next-app`). Fix all TypeScript errors during development, not just at build time. Use `npm run build` as a verification step, not a discovery step.

**Warning signs:** `npm run dev` works but `npm run build` fails with TS errors.

---

## Code Examples

Verified patterns from official sources:

### PostCSS Config (v4)

```javascript
// postcss.config.mjs
// Source: https://tailwindcss.com/docs/guides/nextjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### globals.css Complete Setup

```css
/* src/app/globals.css */
/* Sources:
   - https://tailwindcss.com/docs/guides/nextjs
   - https://tailwindcss.com/docs/theme
   - https://nextjs.org/docs/app/getting-started/fonts
*/

@import "tailwindcss";

@theme {
  /* Wire next/font CSS variable into Tailwind's font-sans token */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    @apply bg-white text-neutral-900 antialiased;
    line-height: 1.6;
  }

  /* Heading scale: h1=40px, h2=36px, h3=28px at 16px root */
  h1 { @apply text-4xl font-semibold; }
  h2 { @apply text-3xl font-semibold; }
  h3 { @apply text-2xl font-semibold; }
  h4 { @apply text-xl font-semibold; }
}
```

### Root Layout

```tsx
// src/app/layout.tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts

import { Geist } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Site',
  description: 'Site description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Blank Root Page

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      {/* Section components slot in here in later phases */}
    </main>
  )
}
```

### Neutral Color Palette Reference (Built-In)

These values are built into TailwindCSS v4 — no custom configuration needed:

```css
/* Source: https://tailwindcss.com/docs/colors */
/* These are auto-generated by @import "tailwindcss" */

--color-neutral-50:  oklch(0.985 0 0);  /* #fafafa */
--color-neutral-100: oklch(0.970 0 0);  /* #f5f5f5 — hover bg */
--color-neutral-200: oklch(0.922 0 0);  /* #e5e5e5 — borders */
--color-neutral-500: oklch(0.556 0 0);  /* #737373 — muted text */
--color-neutral-900: oklch(0.205 0 0);  /* #171717 — body text */
```

**Verification:** The hex values in the spec (`#F5F5F5`, `#E5E5E5`, `#737373`, `#171717`) correspond closely to the built-in neutral palette. Tailwind v4 uses oklch internally, which renders identically to the hex spec on sRGB displays.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with JS | `@theme` directive in CSS | TailwindCSS v4 (Jan 2025) | No JS config file; all tokens in CSS |
| `@tailwind base; @tailwind utilities;` | `@import "tailwindcss";` | TailwindCSS v4 (Jan 2025) | Single import line |
| `content: ['./src/**/*.tsx']` in config | Automatic content detection | TailwindCSS v4 (Jan 2025) | No content array needed |
| `tailwindcss` as PostCSS plugin | `@tailwindcss/postcss` package | TailwindCSS v4 (Jan 2025) | Different npm package required |
| `create-next-app` installed Tailwind v3 | Installs Tailwind v4 by default | Next.js 15.2 (Mar 2025) | Scaffold is now v4-native |
| Geist not available in next/font | `import { Geist } from 'next/font/google'` | Next.js 15.x | Default scaffold font is now Geist |

**Deprecated/outdated:**
- `postcss-import` in postcss config: v4 handles imports natively; adding it causes conflicts
- `autoprefixer` in postcss config: v4 (via Lightning CSS) handles vendor prefixes automatically
- `tailwind.config.js` / `tailwind.config.ts`: Not supported in v4 for new projects

---

## Open Questions

1. **Font Choice: Geist vs Inter**
   - What we know: `create-next-app` now defaults to Geist (Vercel's typeface). Geist is a clean, modern sans-serif. Inter is the prior standard.
   - What's unclear: No explicit font was specified in the requirements (only "sans-serif").
   - Recommendation: Use Geist (scaffold default). It satisfies "sans-serif" and requires zero extra configuration. If the client has a specific font preference, this is a 5-minute swap.

2. **Exact Content Max-Width: 900px vs 1100px**
   - What we know: Spec says 900-1100px. Tailwind's `max-w-5xl` = 1024px, `max-w-4xl` = 896px.
   - What's unclear: Whether to use a standard Tailwind step or an arbitrary value.
   - Recommendation: Use `max-w-5xl` (1024px) — it falls in the middle of the range and uses a standard Tailwind class. Arbitrary `max-w-[1100px]` is also valid but adds no real benefit.

---

## Sources

### Primary (HIGH confidence)

- [tailwindcss.com/docs/guides/nextjs](https://tailwindcss.com/docs/guides/nextjs) — Official TailwindCSS v4 + Next.js installation guide
- [tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme) — @theme directive and CSS custom properties
- [tailwindcss.com/docs/colors](https://tailwindcss.com/docs/colors) — Neutral color palette values
- [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4) — v4 breaking changes reference
- [nextjs.org/docs/app/getting-started/installation](https://nextjs.org/docs/app/getting-started/installation) — create-next-app docs (doc-version 16.1.6, updated 2026-02-11)
- [nextjs.org/docs/app/getting-started/fonts](https://nextjs.org/docs/app/getting-started/fonts) — Official font loading patterns (doc-version 16.1.6, updated 2026-02-11)
- [nextjs.org/docs/app/api-reference/config/typescript](https://nextjs.org/docs/app/api-reference/config/typescript) — TypeScript configuration reference

### Secondary (MEDIUM confidence)

- [github.com/vercel/next.js/discussions/75320](https://github.com/vercel/next.js/discussions/75320) — Confirmation that Next.js 15.2 ships with Tailwind v4 in create-next-app
- [github.com/tailwindlabs/tailwindcss/discussions/15923](https://github.com/tailwindlabs/tailwindcss/discussions/15923) — Font CSS variable pattern verified in official Tailwind discussion

### Tertiary (LOW confidence)

- Community guides on Medium/DesignRevision — corroborative, not used as primary sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified with official Next.js and TailwindCSS docs (updated Feb 2026)
- Architecture: HIGH — patterns sourced from official docs and official GitHub discussions
- Color palette: HIGH — exact oklch values from official tailwindcss.com/docs/colors
- Pitfalls: HIGH — border color change and PostCSS plugin change are documented breaking changes in official upgrade guide
- Font loading: HIGH — official next.js.org font docs

**Research date:** 2026-02-17
**Valid until:** 2026-04-17 (stable stack, 60-day window appropriate)
