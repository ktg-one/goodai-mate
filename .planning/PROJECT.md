# Good'Ai Frontend Project

## Overview

**Good'Ai** is an ultra-premium, high-fidelity marketing site and landing page experience that demonstrates advanced frontend engineering. Originally developed as **Zenith Interface**, this project serves as the Good'Ai public sales surface.

The site embodies an "Upper Class" aesthetic inspired by high-end fashion editorials and architectural precision, built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, and GSAP.

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
- Backend services (this is a static marketing site)

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
- `brand-ink` - Primary dark/black color
- `brand-paper` - Primary light/white background
- `brand-coral` - Accent color (used for shadows, highlights)
- `brand-eucalyptus` - Secondary accent color

### Typography
- System fonts with fallback stack
- Editorial-style with tight tracking on headings

### Shadows
- Custom shadow using CSS variables: `shadow-[8px_8px_0_var(--brand-coral)]`
- Hard shadows for "floating" UI elements

## Architecture

```
.
├── app/                    # Next.js App Router pages
├── components/
│   ├── sections/          # Page sections (Hero, ProductDemo, Features, etc.)
│   ├── ui/               # Reusable UI components (Radix-based)
│   └── ...
├── lib/                   # Utilities and helpers
├── public/                # Static assets
├── styles/                # Global styles (if any)
└── .planning/              # GSD workflow artifacts
```

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
npm run lint
npm run build
```

For visual work: inspect the changed section at mobile and desktop widths.

## External References

- [AGENTS.md](../AGENTS.md) - Project-specific agent instructions (takes priority)
- [README.md](../README.md) - Original Zenith Interface documentation

---
*Created: 2026-08-26*  
*Last Updated: 2026-08-26*  
*GSD Version: Initial Setup*
