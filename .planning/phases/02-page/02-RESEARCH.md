# Phase 02: Page - Research

**Researched:** 2026-02-18
**Domain:** Next.js 16 App Router · TailwindCSS v4 · Single-page layout with sticky nav, scroll-spy, and mobile hamburger
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Header & navigation
- Sticky header — stays fixed at top while scrolling
- Clean white background, no border or blur decoration — Ollama-style minimal
- Active section indicator — current section's nav link gets visual emphasis (bold or underline) as user scrolls
- Smooth scroll to anchor sections on nav link click
- Scroll offset accounts for sticky header height so section headings aren't hidden

#### Mobile menu
- Hamburger icon triggers slide-out panel from the right
- Dark semi-transparent dim overlay behind slide-out menu
- Tapping a nav link auto-closes the menu and scrolls to section

#### Section layout & spacing
- Whitespace only between sections — no dividers, lines, or alternating backgrounds
- Text-first, generous breathing room throughout

#### Content presentation
- **What we do** (Build, Deploy, Support): 3-column grid with title + description per block
- **Products** (Endyra, Manverra, Careyra): Side-by-side cards with border, title, description, and "View" link
- **How we work** (4 steps): Numbered vertical list with large numbers (1, 2, 3, 4) showing clear progression, tagline "Small pilots over big promises."

#### Mobile responsive
- 3-column grids stack to single column on mobile (no 2+1 intermediate)
- Hero scales down naturally via responsive Tailwind classes — same layout, smaller text
- Layout must be usable at 360px, 768px, 1024px, and 1280px

### Claude's Discretion
- Section content width (same max-w-5xl throughout vs hero going wider)
- Vertical spacing between sections (the "rhythm")
- Whether Hero/Footer get explicit headings or flow without them
- Where product "View" links point (v2 product pages don't exist yet — placeholder or anchor approach)
- Exact active nav indicator style (bold, underline, or other)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LAYOUT-01 | Site renders as single scrolling page with 9 sections in specified order | Component-per-section file structure; all sections composed in `src/app/page.tsx` |
| LAYOUT-02 | Header displays "Nexto" text logo and anchor nav links | `Header` client component with nav links using `href="#section-id"` pattern |
| LAYOUT-03 | Header nav links scroll to corresponding sections smoothly | CSS `scroll-behavior: smooth` on `html` + `scroll-padding-top` for offset; anchor `href="#id"` on `<a>` tags |
| LAYOUT-04 | Mobile layout is responsive at breakpoints 360 / 768 / 1024 / 1280 | Tailwind `grid-cols-1 md:grid-cols-3` for 3-column grids; verified breakpoints match (md=768px, lg=1024px, xl=1280px) |
| LAYOUT-05 | Footer displays copyright and Privacy link | Static server component, `<footer>` with text |
| HERO-01 | Hero displays H1 "Nexto" and subtitle | Static JSX, `<h1>` + `<p>` with Tailwind sizing classes |
| HERO-02 | Hero displays two body lines | Static JSX, `<p>` elements |
| HERO-03 | Hero has two CTA buttons scrolling to Contact and Products | `<Button>` component (already exists) with `href="#contact"` and `href="#products"` rendered as `<a>` |
| CONT-01 | What we do: 3 blocks (Build, Deploy, Support) | 3-column grid pattern; server component |
| CONT-02 | Focus: 3 bullet items | Simple `<ul>` or three `<p>` elements |
| CONT-03 | Products: 3 cards with border, title, description, "View" link | Card pattern with `border border-neutral-200` (explicit, required in v4) |
| CONT-04 | How we work: 4 numbered steps + tagline | Numbered vertical list with large numbers via Tailwind `text-6xl` or similar |
| CONT-05 | About section | Static text, server component |
| CTCT-01 | Contact instruction line | Static text |
| CTCT-02 | Email link via `mailto:` | `<a href="mailto:info@nexto.co.th">` |
| CTCT-03 | LINE link via `https://line.me/R/ti/p/@nextocompany` | `<a href="https://line.me/R/ti/p/@nextocompany" target="_blank" rel="noopener noreferrer">` |
</phase_requirements>

---

## Summary

This phase builds the complete single-page site on top of the foundation established in Phase 1 (Next.js 16 + TailwindCSS v4 + Geist Sans, already installed and configured). The technical work divides into three areas: (1) layout composition — creating 9 section components and assembling them in `page.tsx`; (2) sticky navigation — including smooth scroll with sticky header offset, active section tracking via `IntersectionObserver`, and a mobile slide-out hamburger menu; (3) responsive content — 3-column grids that collapse to single column on mobile, product cards with explicit `border-neutral-200`, and a numbered steps list.

The most nuanced piece is the sticky header interaction stack. Next.js App Router's `<Link>` component handles hash anchors natively via standard `<a>` elements, so smooth scrolling is achieved purely in CSS (`html { scroll-behavior: smooth; scroll-padding-top: Xrem; }`) without JavaScript. Active section tracking requires `IntersectionObserver` in a `'use client'` hook — no library needed, roughly 20 lines of code. The hamburger menu requires `useState` and therefore `'use client'` on the `Header` component.

TailwindCSS v4 has one critical breaking change relevant here: the default border color is now `currentColor` (not gray-200). Every `border` class on product cards and any other bordered element **must** include an explicit `border-neutral-200` class. The Phase 1 `Button` component already models this correctly.

**Primary recommendation:** Build each section as a separate file in `src/components/sections/`, compose them in `page.tsx`, implement the `Header` as a single `'use client'` component handling both scroll-spy state and mobile menu state, and drive all scroll behavior from CSS `scroll-behavior: smooth` + `scroll-padding-top`.

---

## Standard Stack

### Core (already installed — Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.1.6 | App Router framework | Locked decision; already in package.json |
| react | 19.2.3 | UI rendering | Peer dep of Next.js |
| tailwindcss | ^4 | Utility CSS | Locked decision; already configured |

### No Additional Libraries Needed

This phase requires no new npm dependencies. All required capabilities exist in the installed stack:

| Capability | How | Notes |
|------------|-----|-------|
| Smooth scroll to anchor | CSS `scroll-behavior: smooth` | On `html` element; zero JS |
| Sticky header offset | CSS `scroll-padding-top` | On `html` element; zero JS |
| Active nav link tracking | `useEffect` + native `IntersectionObserver` | Browser API; no library |
| Mobile menu open/close | `useState` | React built-in |
| Slide-out panel animation | Tailwind `translate-x` + `transition` | CSS transition; no library |
| Overlay backdrop | Tailwind `bg-black/50` or `bg-neutral-900/40` | Semi-transparent overlay |
| Responsive grid | Tailwind `grid-cols-1 md:grid-cols-3` | Mobile-first |
| Product card border | `border border-neutral-200` | Explicit color required in v4 |
| mailto / LINE links | Plain `<a>` elements | Standard HTML |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── globals.css          # Existing — add scroll-behavior + scroll-padding-top here
│   ├── layout.tsx           # Existing — no changes needed
│   └── page.tsx             # Replace demo content with section composition
├── components/
│   ├── ui/
│   │   └── Button.tsx       # Existing — already correct border-neutral-200
│   ├── layout/
│   │   ├── Header.tsx       # 'use client' — sticky nav + scroll-spy + hamburger
│   │   └── Footer.tsx       # Server component — static copyright
│   └── sections/
│       ├── Hero.tsx         # Server component — H1, subtitle, CTA buttons
│       ├── WhatWeDo.tsx     # Server component — 3-column grid
│       ├── Focus.tsx        # Server component — 3 bullet items
│       ├── Products.tsx     # Server component — 3 cards with border
│       ├── HowWeWork.tsx    # Server component — 4 numbered steps
│       ├── About.tsx        # Server component — company blurb
│       └── Contact.tsx      # Server component — email + LINE links
```

### Pattern 1: Global CSS for Scroll Behavior

**What:** All anchor scroll behavior is controlled by two CSS rules on the `html` element. No JavaScript scroll handling needed.

**When to use:** Any single-page site with anchor navigation and a sticky header.

**How:** Add to `globals.css` in the existing `@layer base` block or directly on `html`:

```css
/* Source: MDN Web Docs — scroll-behavior, scroll-padding-top */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 4rem; /* Match sticky header height — adjust if header is taller */
}
```

The `scroll-padding-top` value should match the rendered height of the sticky header. A 64px (4rem at 16px base) header is standard; at 17px base (this project), `3.75rem` ≈ 63.75px. Using `4rem` gives a small extra buffer — recommended.

### Pattern 2: Section Anchor IDs

**What:** Each section element gets an `id` attribute. Nav links use `href="#id"`. The browser handles scrolling natively.

```tsx
// Source: Next.js official docs — Link component, "Scrolling to an id"
// Note: For same-page anchors on the SAME page, use plain <a> tags
// not next/link, to avoid unnecessary router overhead.

// In each section component:
<section id="products" className="...">
  ...
</section>

// In Header nav:
<a href="#products" className="...">Products</a>
```

**Why plain `<a>` not `<Link>`:** For same-page hash navigation, standard `<a href="#id">` is the correct primitive. `next/link` is for cross-page navigation and adds prefetch overhead that is irrelevant for same-page scrolling.

### Pattern 3: Active Section Tracking (IntersectionObserver)

**What:** A `useEffect` registers an `IntersectionObserver` watching all section elements. When a section enters the viewport, the corresponding nav link gets the active style.

**When to use:** Any time a nav needs to reflect the user's scroll position.

```tsx
// Source: Verified with MDN IntersectionObserver API + Builder.io guide
// In Header.tsx ('use client')

'use client'
import { useEffect, useState } from 'react'

const SECTIONS = ['hero', 'what-we-do', 'focus', 'products', 'how-we-work', 'about', 'contact']

export function Header() {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -75% 0px', // Triggers when section is ~20% from top
        threshold: 0,
      }
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav>
        {/* Nav links that show as active when section is in view */}
        <a
          href="#products"
          className={activeSection === 'products' ? 'font-semibold' : 'text-neutral-600'}
        >
          Products
        </a>
      </nav>
    </header>
  )
}
```

**rootMargin tip:** `-20% 0px -75% 0px` means the section is considered "active" when it occupies a 5% band at roughly 20% from the top of the viewport. This prevents two sections from appearing active simultaneously and feels natural.

### Pattern 4: Mobile Hamburger / Slide-Out Panel

**What:** `useState` tracks open/closed. Slide panel uses `translate-x` transition. Overlay is a fixed full-screen semi-transparent div.

```tsx
// Source: React docs (useState) + multiple Next.js community examples (MEDIUM confidence)
// In Header.tsx ('use client') — same component as scroll-spy above

const [menuOpen, setMenuOpen] = useState(false)

// Close menu on nav link click:
const handleNavClick = () => setMenuOpen(false)

// Slide panel (right side):
<div
  className={`
    fixed top-0 right-0 h-full w-72 bg-white z-50
    transform transition-transform duration-300
    ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
  `}
>
  {/* nav links, each with onClick={handleNavClick} */}
</div>

{/* Overlay */}
{menuOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-40"
    onClick={() => setMenuOpen(false)}
  />
)}
```

**Lock body scroll:** When menu is open, add `overflow-hidden` to `<body>` to prevent background scroll. Use a `useEffect` that sets `document.body.style.overflow`.

### Pattern 5: 3-Column Grid → Single Column on Mobile

```tsx
// Source: TailwindCSS v4 official docs — responsive-design, grid-template-columns
// Verified: md breakpoint = 768px

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div>Block 1</div>
  <div>Block 2</div>
  <div>Block 3</div>
</div>
```

The requirement says "no 2+1 intermediate" — `md:grid-cols-3` achieves this: single column below 768px, 3 columns at 768px and above.

### Pattern 6: Product Card with Explicit Border

```tsx
// Source: TailwindCSS v4 official docs — border-color breaking change
// border-neutral-200 MUST be explicit — default border color is currentColor in v4

<div className="border border-neutral-200 rounded p-6 flex flex-col gap-3">
  <h3 className="font-semibold">Endyra</h3>
  <p className="text-neutral-600 text-sm">One-line description.</p>
  <a href="#" className="text-sm text-neutral-900 underline">View</a>
</div>
```

### Pattern 7: Numbered Steps (How We Work)

```tsx
// Large number visual treatment — no library, pure Tailwind

<ol className="space-y-10">
  {steps.map((step, i) => (
    <li key={i} className="flex gap-8 items-start">
      <span className="text-5xl font-semibold text-neutral-200 leading-none select-none tabular-nums w-12 shrink-0">
        {i + 1}
      </span>
      <div>
        <h3 className="font-semibold">{step.title}</h3>
        <p className="text-neutral-600 mt-1">{step.body}</p>
      </div>
    </li>
  ))}
</ol>
<p className="mt-12 text-neutral-500 italic">Small pilots over big promises.</p>
```

`text-neutral-200` for the number makes it large and decorative without being obtrusive.

### Anti-Patterns to Avoid

- **Using `router.push('#section')` for anchor navigation:** Unnecessary; `<a href="#section">` with CSS `scroll-behavior: smooth` is simpler and works without client JS on the link.
- **Using `scroll` event listeners for active tracking:** Fires on every scroll tick on the main thread; use `IntersectionObserver` instead.
- **`border` without explicit color:** In TailwindCSS v4 the default border color is `currentColor`. Always write `border border-neutral-200` not just `border`.
- **`overflow: hidden` on a parent of the sticky header:** Kills `position: sticky`. Use `overflow: clip` if clipping is needed on a parent of the header.
- **Not locking body scroll when mobile menu is open:** Background scrolls behind the overlay, creating a disorienting UX.
- **Hardcoding header height in JS:** CSS `scroll-padding-top` handles the offset without any JavaScript measurement.
- **Making all sections `'use client'`:** Only `Header` needs client-side interactivity. All 7 section components + Footer can be server components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scroll to anchor | JS `scrollTo()` or `scrollIntoView()` with manual offset | CSS `scroll-behavior: smooth` + `scroll-padding-top` | CSS handles header offset natively; no JavaScript needed; works with browser back/forward |
| Active section tracking | `scroll` event listener with `getBoundingClientRect()` | `IntersectionObserver` in `useEffect` | Runs off main thread; no throttling needed; cleaner code |
| Mobile slide panel animation | Custom CSS keyframes or JS-driven transitions | Tailwind `translate-x-full` + `transition-transform duration-300` | Already in Tailwind; no additional CSS |
| Responsive breakpoints | Custom CSS media queries | Tailwind `grid-cols-1 md:grid-cols-3` | Tailwind breakpoints match the project's required widths exactly |

**Key insight:** This phase's interactive requirements (scroll, active nav, mobile menu) are all solvable with CSS + 30 lines of React state — no additional libraries required.

---

## Common Pitfalls

### Pitfall 1: Header Height Mismatch in `scroll-padding-top`

**What goes wrong:** If the header is taller than `4rem`, sections scroll so the heading is partially hidden behind the header.

**Why it happens:** `scroll-padding-top` is a fixed value; if header height changes (e.g., due to padding adjustments during implementation), the offset is wrong.

**How to avoid:** Decide and lock the header height early (e.g., `h-16` = 64px = 4rem). Set `scroll-padding-top: 4rem` in `globals.css`. Keep both in sync.

**Warning signs:** Click a nav link → section heading is partially or fully behind header.

### Pitfall 2: Border Missing Color in TailwindCSS v4

**What goes wrong:** `<div className="border">` renders with a black (`currentColor`) border instead of the neutral-200 light gray.

**Why it happens:** TailwindCSS v4 changed the default border color from `gray-200` to `currentColor` (breaking change from v3).

**How to avoid:** Always write `border border-neutral-200`. The existing `Button` component in this project already does this correctly — use it as a reference.

**Warning signs:** Borders appear black or dark unexpectedly; doesn't match design.

### Pitfall 3: `position: sticky` Broken by Parent Overflow

**What goes wrong:** Sticky header stops sticking — behaves like `position: relative` instead.

**Why it happens:** Any ancestor element with `overflow: hidden` or `overflow: auto`/`scroll` creates a new scroll container, and sticky works relative to that container (which has no visible scrollbar).

**How to avoid:** Ensure no parent of `<header>` has `overflow: hidden`. If clipping is needed on a parent element, use `overflow: clip` instead.

**Warning signs:** Header is sticky in isolation but not when the page has certain wrapper divs.

### Pitfall 4: Mobile Menu Body Scroll Leak

**What goes wrong:** When the mobile slide-out panel is open, the user can still scroll the page background behind the overlay.

**Why it happens:** The overlay `div` covers the screen visually but doesn't prevent scroll events propagating to `<body>`.

**How to avoid:** When menu opens, set `document.body.style.overflow = 'hidden'`. When menu closes, reset it to `''`. Do this in a `useEffect` that watches `menuOpen`.

**Warning signs:** Visible background scrolling when mobile menu is open.

### Pitfall 5: `'use client'` Propagation Mistake

**What goes wrong:** Marking a section component as `'use client'` when it has no interactivity; or accidentally importing a client component into a server component without isolating it.

**Why it happens:** In App Router, once a file is marked `'use client'`, all its imports become client components too. Section files should not be client components.

**How to avoid:** Keep the `Header` as the ONLY `'use client'` component in this phase. All section components (`Hero.tsx`, `WhatWeDo.tsx`, etc.) are pure server components — no `useState`, no `useEffect`, no `'use client'` directive.

**Warning signs:** Unnecessarily large JS bundle; sections that should be static render on the client.

### Pitfall 6: IntersectionObserver Fires Too Eagerly / Too Slowly

**What goes wrong:** Multiple nav links show as "active" simultaneously, or the active link changes too early/late during scroll.

**Why it happens:** `rootMargin` and `threshold` tuning is subjective. A threshold of `0` with a wide `rootMargin` can catch overlapping sections.

**How to avoid:** Use `rootMargin: '-20% 0px -75% 0px'` as a starting point. This means a section is considered "in view" when it occupies the 5% band between 20% and 25% from the top. Only one section typically occupies this zone at a time.

**Warning signs:** Two nav links appear active simultaneously; active link jumps unexpectedly.

### Pitfall 7: `<Link>` vs `<a>` for Hash Navigation

**What goes wrong:** Using `next/link` with `href="#products"` adds prefetch overhead for a same-page anchor. In some Next.js versions this can interfere with scroll behavior.

**Why it happens:** `next/link` is designed for cross-page navigation; hash anchors on the same page are native browser behavior.

**How to avoid:** Use plain `<a href="#section-id">` for all nav links within the header (same page anchors). Reserve `next/link` for cross-page navigation.

**Warning signs:** Nav links trigger unnecessary network requests or scroll unexpectedly.

---

## Code Examples

Verified patterns from official sources:

### globals.css Additions (scroll behavior)

```css
/* Source: MDN — scroll-behavior, scroll-padding-top; verified with getpublii.com guide */
/* Add to existing @layer base block or directly on html rule */

html {
  scroll-behavior: smooth;
  scroll-padding-top: 4rem; /* 64px — matches h-16 sticky header */
}
```

### Section Component (server component, no directive)

```tsx
// Source: Next.js App Router docs — server components are default
// No 'use client' required for static content sections

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Build</h3>
            <p className="text-neutral-600">...</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Deploy</h3>
            <p className="text-neutral-600">...</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-neutral-600">...</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### page.tsx Composition

```tsx
// Source: Next.js App Router conventions
// page.tsx is a server component by default — no 'use client' here

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { WhatWeDo } from '@/components/sections/WhatWeDo'
import { Focus } from '@/components/sections/Focus'
import { Products } from '@/components/sections/Products'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeDo />
        <Focus />
        <Products />
        <HowWeWork />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

### Contact Section Links

```tsx
// Source: HTML spec — mailto: and tel: links; LINE's own deep-link format
// mailto: opens the default email client
// LINE deep link format verified: https://developers.line.biz/en/docs/messaging-api/linking-accounts/

<a href="mailto:info@nexto.co.th" className="underline hover:text-neutral-600">
  info@nexto.co.th
</a>

<a
  href="https://line.me/R/ti/p/@nextocompany"
  target="_blank"
  rel="noopener noreferrer"
  className="underline hover:text-neutral-600"
>
  @nextocompany
</a>
```

### Product "View" Link (placeholder approach)

```tsx
// Source: Claude's Discretion — product pages don't exist yet
// Recommendation: use href="#" with aria-label; avoids broken links
// Do NOT use dead href="" — that reloads the page

<a
  href="#"
  onClick={(e) => e.preventDefault()}
  className="text-sm text-neutral-500 cursor-default"
  aria-label="Endyra — coming soon"
>
  View
</a>
```

Alternative recommendation: render "View" as non-interactive styled text (`<span>`) until product pages exist. This is cleaner than a disabled link.

### Tailwind Breakpoints Verification (for 360 / 768 / 1024 / 1280 requirement)

```
Source: TailwindCSS v4 official docs — responsive-design

Default breakpoints in Tailwind v4:
  sm  → 640px  (not used — below 360px minimum is mobile default)
  md  → 768px  ✓ matches requirement
  lg  → 1024px ✓ matches requirement
  xl  → 1280px ✓ matches requirement

Pattern for 3-column grids:
  grid-cols-1         → 0px to 767px (covers 360px mobile) ✓
  md:grid-cols-3      → 768px+ (no intermediate 2-column step) ✓
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| JS `scrollTo()` for smooth scroll | CSS `scroll-behavior: smooth` | No JS; works with browser history |
| JS measurement for sticky offset | CSS `scroll-padding-top` | Zero runtime cost |
| `scroll` event listener for active nav | `IntersectionObserver` | Off main thread; no throttling needed |
| Library (scrollspy, react-scroll) | Native browser APIs | Zero dependency |
| Tailwind `border` (implicit gray) | `border border-neutral-200` (explicit) | Breaking change in v4 — must be explicit |
| Pages Router + `useRouter().push('#')` | App Router + plain `<a href="#id">` | Simpler; no router overhead for hash links |

**Deprecated/outdated in this context:**
- `react-scroll` library: Unnecessary; CSS handles smooth scroll natively across all modern browsers.
- `react-scrollspy` library: Unnecessary; 20-line `IntersectionObserver` hook replaces it with zero dependency.
- Tailwind v3 `border` implicit color: Now explicitly required as `border border-neutral-200` in v4.

---

## Open Questions

1. **Product "View" link destination**
   - What we know: Product pages don't exist for v1
   - What's unclear: Should "View" be a disabled/placeholder link, or simply omitted?
   - Recommendation: Render as `<span>View</span>` (no link) for now, or use `href="#"` + `e.preventDefault()`. Planner should pick one approach and apply it consistently to all 3 cards.

2. **Header height and `scroll-padding-top` value**
   - What we know: Header height depends on padding chosen during implementation
   - What's unclear: Exact header height before building it
   - Recommendation: Set header to `h-16` (64px = 4rem), then set `scroll-padding-top: 4rem`. This is a design choice within Claude's discretion and should be locked during planning.

3. **Hero section width (discretion area)**
   - What we know: All sections use `max-w-5xl` by default
   - What's unclear: Whether hero should break out to full width or a wider container
   - Recommendation: Keep `max-w-5xl` for hero consistent with other sections. Simplicity; no special-casing.

4. **Footer Privacy link destination**
   - What we know: LAYOUT-05 requires a "Privacy" link in the footer
   - What's unclear: Does a privacy page exist or is it a placeholder?
   - Recommendation: Use `href="/privacy"` (will 404 for now) or `href="#"`. Planner should decide; suggest `href="/privacy"` as it signals intent for a real page.

---

## Sources

### Primary (HIGH confidence)
- Next.js 16.1.6 official docs — `https://nextjs.org/docs/app/api-reference/components/link` — Link component behavior, hash anchor navigation, `scroll` prop
- TailwindCSS v4 official docs — `https://tailwindcss.com/docs/responsive-design` — breakpoints, mobile-first grid patterns
- TailwindCSS v4 official docs — `https://tailwindcss.com/docs/scroll-padding` — `scroll-pt-*` utilities, CSS variable support
- getpublii.com / MDN-backed guide — `https://getpublii.com/blog/one-line-css-solution-to-prevent-anchor-links-from-scrolling-behind-a-sticky-header.html` — `scroll-padding-top` approach for sticky header offset
- Project `package.json` — versions confirmed: Next.js 16.1.6, React 19.2.3, Tailwind ^4
- Project source files — `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/Button.tsx` — existing patterns confirmed

### Secondary (MEDIUM confidence)
- Builder.io — `https://www.builder.io/blog/react-intersection-observer` — IntersectionObserver pattern; verified with MDN API docs
- TailwindCSS GitHub discussion #16002 — `https://github.com/tailwindlabs/tailwindcss/discussions/16002` — v4 border color breaking change; confirmed by multiple sources
- CSS-Tricks / polypane.app — `position: sticky` + `overflow: hidden` pitfall; consistent across multiple sources

### Tertiary (LOW confidence)
- Community articles on hamburger menu patterns — general approach consistent but not verified against a canonical source; pattern is straightforward React `useState` usage which IS verified at HIGH confidence

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — package.json and existing source files confirm exact versions
- Scroll + anchor behavior: HIGH — verified via Next.js 16.1.6 official docs
- TailwindCSS v4 breakpoints and grid: HIGH — verified via official Tailwind docs
- TailwindCSS v4 border color change: HIGH — confirmed in official changelog and multiple sources
- IntersectionObserver active nav: MEDIUM — approach is well-established; `rootMargin` tuning values are approximate
- Mobile hamburger pattern: MEDIUM — React useState approach is canonical; slide-out CSS transition specifics are community patterns

**Research date:** 2026-02-18
**Valid until:** 2026-03-20 (30 days — stable framework versions)
