# Good'Ai frontend

## Scope

This is the active Good'Ai marketing site: Next.js 16 App Router, React 19,
TypeScript, Tailwind CSS, Framer Motion, GSAP, and Radix UI primitives.

Treat the site as an evidence-led public sales surface. Keep `Good'Ai` spelling
consistent. Do not invent client outcomes, testimonials, live integrations,
pricing, or compliance claims. Route genuine intake calls-to-action through the
centralised destination already used by the site; do not add isolated CTA links.

## Working safely

- The working tree may already contain user changes. Preserve them and do not
  revert, reformat, or delete unrelated files.
- Inspect the closest component and its imports before changing UI behaviour.
- Prefer the existing components in `components/ui/`, utilities in `lib/`, and
  brand tokens such as `brand-ink`, `brand-paper`, `brand-coral`, and
  `brand-eucalyptus` over one-off replacements.
- Keep responsive behaviour explicit. Check mobile, desktop, keyboard focus,
  and `prefers-reduced-motion` when changing interaction or motion.

## Product demo conventions

`components/sections/ProductDemo.tsx` currently uses local example data and a
simulated workflow state. That is an implementation fact, not a product
constraint: it may be made real when a verified data contract, access model,
and workflow source are defined. Until then, do not represent example jobs,
status, or outcomes as live operational data. Keep the interaction usable
without animation and clean up timers or listeners in effects.

## Verification

Run the narrowest relevant check before handing off:

```bash
npm run lint
npm run build
```

For visual work, also inspect the changed section at mobile and desktop widths.
Report checks not run rather than implying they passed.
