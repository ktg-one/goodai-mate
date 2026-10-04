# Good'Ai Frontend Project

## Overview

**Good'Ai** is a marketing site and landing page experience for a Perth business that takes admin off tradespeople and small operators: phone answering, quoting and follow-ups. Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP/ScrollTrigger and Lenis.

The site is mid-rebuild. The current design is the Perth sketchbook concept — a ThreeUI sketchbook hero, a hand-written voice, "suss the fuss" as the intake call to action. The August 2026 "Zenith Interface" framing below is history; the code is the current truth.

## Purpose

- Primary: Public marketing and sales surface for Good'Ai
- Secondary: Technical demonstration of advanced frontend capabilities (animations, interactions, responsive design)
- Constraints: Treat as evidence-led public sales surface; do not invent client outcomes, testimonials, live integrations, pricing, or compliance claims

## Scope

### In Scope
- Marketing site pages and sections
- Product demonstration components (illustrative only)
- Animation and interaction systems
- Brand styling and design system
- Responsive behavior across devices

### Out of Scope
- Live operational data
- Real client integrations
- Authenticated user flows
- Backend services beyond two API routes (`/api/contact` → Resend, `/api/voice/call` → Trillet)

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js 16 App Router | Modern React framework with App Router paradigm |
| React 19 | Latest stable React version |
| Tailwind CSS v4 | Utility-first CSS with latest features |
| TypeScript | Type safety for production code |
| Framer Motion | React animation library for component-level animations |
| GSAP | Advanced timeline-based animations and ScrollTrigger |
| Lenis | Smooth scroll library |
| Radix UI | Unstyled, accessible UI primitives |
| Lucide React | Icon library |

## Brand Design System

### Color Tokens
Declared in the `@theme` block in `app/globals.css` (mirrors DESIGN.md):
- `brand-ink` - Primary dark/black color
- `brand-paper` - Primary light/background
- `brand-coral` - Accent (shadows, highlights)
- `brand-eucalyptus` - Secondary accent
- `brand-eucalyptus-ink`, `brand-teal` - extended accents
- `brand-line`, `brand-surface` - borders and raised surfaces
- `brand-navy` - legacy alias of `brand-ink`; prefer `brand-ink`

### Typography
- System fonts with fallback stack
- Editorial-style with tight tracking on headings

### Shadows
- Custom shadow using CSS variables: `shadow-[8px_8px_0_var(--brand-coral)]`
- Hard shadows for "floating" UI elements

## Architecture

```
.
├── app/                       # Next.js App Router pages
│   ├── page.tsx               # home
│   ├── contact/ demo/ lab/ privacy/ terms/
│   ├── services/[slug]/       # 5 service pages, SSG
│   └── api/                   # contact (Resend), voice/call (Trillet)
├── components/
│   ├── sections/              # Hero, ServicesCarousel (live) + parked old-design
│   ├── studio/                # sketchbook, hero study, voice, workflow, shell
│   ├── ui/                    # shadcn primitives + project widgets
│   ├── carousel/              # ThreeUI carousel (vendored, has LICENSE)
│   └── providers/             # LazyMotionProvider
├── src/shaders/               # ThreeUI sketchbook + shader sources
├── lib/                       # services, links, utils (+ *.test.ts)
├── public/sketchbook/plates/  # hero sketchbook plates (webp)
├── public/assets/sketches/    # hero sketchbook source spreads (png, tracked)
└── .planning/                 # GSD workflow artifacts
```

**Parked components.** `components/sections/` and `components/ui/` still hold the pre-Perth components (ProductDemo, Features, Pricing, Testimonials, VisualStory, Hero, Navbar, Footer, and the shadcn primitives). They are unimported, kept as source material for the rebuild. Nothing imports them, so the build is unaffected; they do add lint warnings.

## Constraints

From AGENTS.md:

1. **Content Integrity**: Do not invent client outcomes, testimonials, live integrations, pricing, or compliance claims
2. **CTA Routing**: Route genuine intake calls-to-action through the centralized destination already used by the site
3. **Spelling**: Keep `Good'Ai` spelling consistent throughout
4. **ProductDemo Convention**: `components/sections/ProductDemo.tsx` is a local, illustrative workflow demo. It must remain clear that its jobs, status, and outcomes are examples—not live operational data. Keep the interaction usable without animation and clean up timers or listeners in effects.

## Working Safely

- Preserve existing user changes in the working tree
- Inspect the closest component and its imports before changing UI behavior
- Prefer existing components in `components/ui/` and utilities in `lib/`
- Use brand tokens over one-off color values
- Keep responsive behavior explicit
- Check mobile, desktop, keyboard focus, and `prefers-reduced-motion` when changing interaction or motion

## Verification

```bash
npm run check   # lint + lint:motion + tests
npm run build   # must pass
```

`npm run check` is the gate before handing off. `npm run lint` must report 0 errors (warnings are design-contract advisories, not blockers).

For visual work: inspect the changed section at mobile and desktop widths.

## External References

- [AGENTS.md](../AGENTS.md) - Project-specific agent instructions (takes priority)
- [README.md](../README.md) - Original Zenith Interface documentation, largely superseded; the code is the current truth
- [DESIGN.md](../DESIGN.md) - Brand design system tokens and rationale

---
*Created: 2026-08-26*  
*Last Updated: 2026-10-04*  
*GSD Version: Initial Setup*
