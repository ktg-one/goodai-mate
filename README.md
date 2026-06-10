# Good'ai (goodai.au)

Perth business automations for SMEs. The site hero **is** the product: a working local Voice Agent (Supertonic) whose conversations file as physical mail into a 1978 direct-mail corkboard (GSAP ribbons, stamped dockets, in-tray, footer ritual).

Brutalist mechanical execution at award-craft level, powered by local agent skills.

## Development

This is a Next.js 16 (App Router) site.

```bash
npm install
npm run dev
```

Open http://localhost:3000 .

Use **Node 20+**.

## Skills (local .agents + .claude)

The project maintains curated copies of skills in:

- `.agents/skills/` (goodai-agent-team, goodai-award-configuration, awwwards-*, gsap-*, ui-ux-pro-max, find-skills, ...)
- `.claude/skills/` (gsap-*, next-*, design, gsd-*, openpets, ...)

**gsd family** (health, docs-update, progress, manager, do, plan-phase, verify-work, cleanup, etc.) was added from global `.claude`/`.agents` so that `/gsd-health`, `/gsd-progress`, `/gsd-docs-update` etc. are always available when working inside the project.

To (re)add or update:

- Copy desired SKILL.md trees from `~/ .agents/skills/<name>` / `~/.claude/skills/<name>` into both local trees.
- Or use global skills CLI (`npx skills ...`) then sync the dirs.

Key project skills:

- `goodai-award-configuration` — the 5-agent swarm (impeccable + awwwards-animations + awwwards-ui-skills + gsap-awwwards-website + gsap-framer-scroll-animation) that delivered the current mail-board site.
- `goodai-agent-team` — coordinator for dispatching on Voice / brutalist work.
- `gsd-health` (and siblings) — planning dir health, progress, docs sync, phase mgmt.
- Design/animation: awwwards-*, gsap-*, impeccable for mechanical 60fps stamp/ribbon work.

Always inject `PRODUCT.md` + `public/` + current live state + mechanical rules (hard 90-160ms clacks, one red, WONK once, reduced-motion static fidelity) when using the award config.

## gsd (Get Shit Done) + docs hygiene

- `gsd health` (or gsd-sdk query validate.health) — run at session start / before ship.
- `gsd progress` — situational awareness + routing.
- `gsd docs-update` (or --verify-only) — keep .planning/ and docs/ honest against code.
- Old pre-refactor phases (shader/cursor/lead v1) archived to `.planning/milestones/v0.9-pre-refactor-phases/`.
- Current .planning/PROJECT.md, ROADMAP.md, STATE.md, REQUIREMENTS.md, docs/agents/* describe the refactored Voice + mail-docket site.

## Brand / Product

See `PRODUCT.md` (the SSOT) and `public/`.

Core: "we'll sort the boring stuff." Practical. Warm. Direct. Switched-on Perth mate. One orange/red per surface. Ink and paper do the heavy lifting.

## Deploy

Vercel (see vercel.json). Domain goodai.au.

## Notes

- `public/voice-feature/` is a separate Vite/Gemini Live prototype kept as reference.
- `feature_list.json` is historical (old 251-test pre-refactor spec); current verification is manual + gsd + browser checks + award-craft rules.
- `skills-lock.json` tracks some installed design/animation skills.

This project was bootstrapped with create-next-app + heavy agent skill augmentation.
