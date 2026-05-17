# Domain Docs

How engineering skills should consume this repo's domain documentation when exploring the codebase.

## Project posture

Good'ai Mate is a production-targeted Next.js app intended for Vercel. It is not launched yet, so prefer production-quality implementation and verification without assuming live-user migration or live-traffic rollout constraints.

## Brand guardrail

Claude-generated mockups tend to drift toward Anthropic-coded cream, charcoal, muted orange, and editorial spacing when unconstrained. Do not treat that drift as brand intent.

Use the Good'ai mark as the palette source:

- **Blue-black dark mode** for the main product surface.
- **Black / ink** for strong structure and stamped edges.
- **Orange** for brand accents, CTAs, highlights, and logo-derived moments, not every surface.
- **Off-white / cream** only as contrast panels or logo staging, not as the default whole-site mood unless explicitly requested.

The feel should be bold, practical, a bit cheeky, and production-grade for a Vercel launch.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, if present.
- **`CONTEXT-MAP.md`** at the repo root, if present.
- **`docs/adr/`**, if present, for architectural decisions related to the area being changed.
- **`.planning/PROJECT.md`**, `.planning/REQUIREMENTS.md`, and `.planning/ROADMAP.md` when product scope or phase intent matters.

If these files do not exist, proceed silently. Do not suggest creating them upfront; producer skills create them when terms or decisions need to be formalized.

## File structure

This repo uses a single-context layout by default:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

If `CONTEXT-MAP.md` is added later, treat the repo as multi-context and follow the map before making domain-level claims.

## Use the glossary's vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`.

If the concept is not in the glossary yet, either avoid inventing new language or note the gap for a future docs pass.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding it.
