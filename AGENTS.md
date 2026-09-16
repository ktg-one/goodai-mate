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

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
