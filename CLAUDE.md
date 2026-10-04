# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Good'Ai marketing site (Perth AI voice agents + automation studio). Next.js 16 (App Router) · React 19 · TS · Tailwind v4 · GSAP + Framer Motion + Lenis · Three.js · Radix. Not live yet; no traffic. `AGENTS.md` carries the base rules (read it, including the Next.js warning: this Next version differs from training data — check `node_modules/next/dist/docs/` before writing Next code). `README.md` is a stale upstream template ("Zenith Interface") — ignore it.

## Commands

```bash
npm run dev           # next dev
npm run build         # must pass before handoff
npm run lint          # eslint . — 0 errors required
npm run lint:motion   # scripts/ktg-lint.mjs — scroll/motion contract checks
npm run check         # lint + lint:motion
bash scripts/verify-ctas.sh   # all CTAs must go through lib/links.ts
```

No test suite. Lint a single file: `npx eslint path/to/file.tsx`. Both `package-lock.json` and `bun.lock` exist; npm is what the scripts assume.

## Lint = design contract

Two linters, both encode the design:

- `eslint.config.mjs` — `@shadcn/lint`. **Errors** (`no-unknown-classes`, `no-raw-colors`, `require-static-classes`): classes that emit no CSS or off-theme colors; always fix. **Warnings** (`no-restyle`, `no-arbitrary-values`, `no-inline-styles`): design contracts; never add new ones. `components/ui/**` is exempt from the contract rules; inline styles are only linted in `app/**`, `components/sections/**`, `components/layout/**`. Plain-CSS classes (phone widgets, `pen-underline`, `threeui-background`) are allow-listed in the config — add new non-Tailwind class names there. The shadcn `note` lists the `@theme` brand tokens (mirrors DESIGN.md; `brand-navy` = legacy alias of `brand-ink`). Ignored: `.kilo/**` worktree copies, `hive/**` (agent office runtime), `docs/components/**` (parked copies of removed components).
- `scripts/ktg-lint.mjs` — hand-rolled regex checks: `.home-page` track ≥ 10000px in `globals.css`, no THREE listeners without teardown. Missing dirs (e.g. `components/`) are skipped. No GSAP is in use, so the GSAP/ScrollTrigger checks (HomeScroll `once: true`, animated copy, `toggleActions` in Story files, `pin: true` without `end`) were removed; re-add them if ScrollTrigger returns.

## Design source of truth

- `DESIGN.md` (tokens/typography/components front-matter) and `BRAND.md`. Palette lives in `app/globals.css` `@theme`; legacy token names map: `brand-ink` = olive ink, `brand-paper` = paper, `brand-coral` = terracotta, `brand-eucalyptus` = sage.
- **Do not use `app/tokens/*.css`** — different navy/coral/teal palette, not imported.
- Fonts: Manrope (UI), Fraunces italic (emphasis), Vibes (handwritten). Spelling is `Good'Ai`.
- Never invent testimonials, outcomes, pricing, or compliance claims. `ProductDemo.tsx` is example data, never live.
- Motion: responsive, keyboard-focusable, honors `prefers-reduced-motion`. Scroll rules (Kevin): ~3 viewport heights per animation, held readable middle, nothing faster than ~1.5s, every ScrollTrigger states `start`/`end` with a comment.

## Architecture

- `app/page.tsx` is the whole homepage, written as dense single-line JSX inside a `.home-page` container whose scroll height is set in `globals.css` (lint enforces ≥10000px). Order: PerthSketchbook intro → hero → promise strip → empathy → `ScrollStory` (pinned) → services list → workflow demo → approach → FAQ → contact.
- Content is data-driven from `lib/services.ts` (5 services: voice agents, automation, custom assistants, AI integration, opportunity audit — slug, price, range strings). Homepage rows and `app/services/[slug]/page.tsx` both read it; `serviceIcons` in `page.tsx` is index-matched to that array, so reordering services means reordering icons. Pricing copy is also hardcoded in the FAQ in `page.tsx` and in `components/sections/Pricing.tsx`.
- `lib/links.ts`: single source for CTA target (`SURVEY_URL` → `/contact`) and phone number. All CTAs must use these.
- `components/studio/*` — current site components (ScrollStory, PerthSketchbook, HeroStudy, WorkflowPreview, voice widgets, Shell). `components/sections/*` and much of `components/ui/*` are carried over from the upstream Zenith template and mostly unused by the current home. `HeroTree.tsx`/`HomeScroll.tsx` are dead code on home (tree remains on `/lab`).
- `src/shaders/` — ThreeUI sketchbook (WebGL in a sandboxed iframe; `sketchbookDocument.js` patches an upstream click bug; `next.config.ts` adds CORS for `/sketchbook/*.woff2`). Plates in `public/sketchbook/plates/`.
- Voice: Trillet web SDK (`@trillet-ai/web-sdk`) via `components/studio/TrilletVoiceWidget.tsx` and `app/api/voice/call/route.ts`; only on `/demo`. ElevenLabs widgets also exist.
- `/contact` form currently fakes success (nothing sent). Planned: Resend from a Next.js API route, no n8n.

## Planning state

`.planning/ROADMAP.md` (single source of scope/phase order) and `.planning/STATE.md` (decisions, open questions) — read both before feature work; update STATE.md at end of a phase. `TASKS.md` points to the roadmap. One branch + PR per phase (`phase/NN-slug`).

<!-- CODEGRAPH_START -->
## CodeGraph

If a `.codegraph/` directory exists at repo root, use `codegraph_explore` (MCP) or `codegraph explore "<symbols or question>"` (shell) before grep/read to locate code and see call paths.
<!-- CODEGRAPH_END -->
