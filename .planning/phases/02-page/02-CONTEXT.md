# Phase 2: Page - Context

**Gathered:** 2026-02-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the complete single-page site with all 9 sections (Header, Hero, What we do, Focus, Products, How we work, About, Contact, Footer), final copy, anchor navigation, and responsive layout. No new pages, no backend, no animations.

</domain>

<decisions>
## Implementation Decisions

### Header & navigation
- Sticky header — stays fixed at top while scrolling
- Clean white background, no border or blur decoration — Ollama-style minimal
- Active section indicator — current section's nav link gets visual emphasis (bold or underline) as user scrolls
- Smooth scroll to anchor sections on nav link click
- Scroll offset accounts for sticky header height so section headings aren't hidden

### Mobile menu
- Hamburger icon triggers slide-out panel from the right
- Dark semi-transparent dim overlay behind slide-out menu
- Tapping a nav link auto-closes the menu and scrolls to section

### Section layout & spacing
- Whitespace only between sections — no dividers, lines, or alternating backgrounds
- Text-first, generous breathing room throughout

### Content presentation
- **What we do** (Build, Deploy, Support): 3-column grid with title + description per block
- **Products** (Endyra, Manverra, Careyra): Side-by-side cards with border, title, description, and "View" link
- **How we work** (4 steps): Numbered vertical list with large numbers (1, 2, 3, 4) showing clear progression, tagline "Small pilots over big promises."

### Mobile responsive
- 3-column grids stack to single column on mobile (no 2+1 intermediate)
- Hero scales down naturally via responsive Tailwind classes — same layout, smaller text
- Layout must be usable at 360px, 768px, 1024px, and 1280px

### Claude's Discretion
- Section content width (same max-w-5xl throughout vs hero going wider)
- Vertical spacing between sections (the "rhythm")
- Whether Hero/Footer get explicit headings or flow without them
- Where product "View" links point (v2 product pages don't exist yet — placeholder or anchor approach)
- Exact active nav indicator style (bold, underline, or other)

</decisions>

<specifics>
## Specific Ideas

- Ollama-inspired aesthetic: clean, white, no decoration on header
- Product cards should have visible borders (consistent with neutral-200 design token)
- "How we work" steps should feel like a clear numbered progression, not a timeline

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-page*
*Context gathered: 2026-02-18*
