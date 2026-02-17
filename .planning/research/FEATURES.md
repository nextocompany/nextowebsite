# Features Research: Minimal Company Website

## Table Stakes (must have or visitors leave)

| Feature | Complexity | Dependencies |
|---------|-----------|-------------|
| Clear company identity (name, what you do) | Low | None |
| Contact information (email, phone/messaging) | Low | None |
| Mobile-responsive layout | Medium | CSS/Tailwind |
| Fast page load (<3s on 3G) | Medium | Build config, no heavy assets |
| Working navigation (anchor links) | Low | None |
| SEO basics (title, meta, OG) | Low | Next.js Metadata API |
| HTTPS | Low | Vercel handles automatically |
| Favicon | Low | Static asset |
| Accessible text (contrast, headings, keyboard nav) | Medium | Semantic HTML |

## Differentiators (competitive advantage for a studio site)

| Feature | Complexity | Dependencies |
|---------|-----------|-------------|
| Products/portfolio showcase | Low-Medium | Content structure |
| Process/methodology section | Low | Content only |
| Minimal, distinctive design aesthetic | Medium | Design discipline |
| Sub-second page load (Lighthouse 95+) | Medium | Optimization, static gen |
| Smooth anchor scrolling | Low | CSS `scroll-behavior` or minimal JS |

## Anti-Features (deliberately NOT building)

| Feature | Why Not |
|---------|---------|
| Blog / News section | Adds CMS complexity, maintenance burden. Not needed for MVP. |
| Contact form | Email + LINE sufficient. Forms need backend, spam protection, validation. |
| Live chat widget | Adds third-party dependency, always-on expectation. |
| Testimonials / social proof | Requires client approval, content management. Add later if needed. |
| Team photos / bios | Text-first design. "A small team" is sufficient. |
| Case studies | Requires content creation effort beyond MVP scope. |
| Pricing page | Enterprise studio — pricing is custom/negotiated. |
| Newsletter signup | Requires email service integration, PDPA compliance. |
| Animation / parallax | Contradicts Ollama-inspired minimal aesthetic. |
| Dark/light theme toggle | MVP ships one theme. Toggle adds complexity. |
| Multi-language (Thai/English) | English-only for MVP. Internationalization adds significant complexity. |

## Feature Dependencies

```
Header Nav → Section IDs (anchors)
Products Section → Product data (hardcoded for MVP)
Contact Section → Email mailto + LINE deep link
SEO → Metadata API + next-sitemap
Performance → Static generation + minimal bundle
```

## MVP Feature Set (minimal viable site)

1. Header with logo + anchor nav
2. Hero section with company name + tagline
3. What we do (3 services)
4. Focus (3 principles)
5. Products (3 cards)
6. How we work (4 steps)
7. About (company info)
8. Contact (email + LINE links)
9. Footer (copyright)
10. SEO basics
11. Mobile responsive
12. Lighthouse 90+
