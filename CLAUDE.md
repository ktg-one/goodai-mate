# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Good'Ai marketing site (Perth AI voice agents + automation studio). Next.js 16 (App Router) · React 19 · TS · Tailwind v4 · GSAP + Framer Motion + Lenis · Three.js · Radix. `AGENTS.md` carries the base rules (read it, including the Next.js warning: this Next version differs from training data — check `node_modules/next/dist/docs/` before writing Next code). `README.md` is a stale upstream template ("Zenith Interface") — ignore it.

## Live site

**Production: https://www.goodai.au** — Vercel project `goodai-mate`, GitHub `ktg-one/goodai-mate` (`origin`; `localorigin` is a local mirror). Treat `main` as production: real visitors, real leads.

- Work on a branch; merge to `main` only after `bun run check` and `bun run build` pass.
- The lead path is revenue: `lib/links.ts` → `/contact` (`SussTheFussCard`) → `POST /api/contact`. A change that touches it gets a test in `lib/*.test.ts`.
- Secrets live in Vercel env, never in the repo. Ask Kev before changing env, domains, or CSP in production.

## Commands

```bash
bun install           # bun only — bun.lock is the one lockfile
bun run dev           # next dev
bun run build         # must pass before handoff
bun run lint          # eslint . — 0 errors required
bun run lint:motion   # scripts/ktg-lint.mjs — scroll/motion contract checks
bun run test          # node --test over lib/*.test.ts
bun run check         # lint + lint:motion + test
bun run doctor        # react-doctor
bash scripts/verify-ctas.sh      # all CTAs must go through lib/links.ts
node docs/validate-design.cjs    # DESIGN.md ↔ token CSS sync
```

Lint a single file: `bunx eslint path/to/file.tsx`. Package manager is **bun** (`packageManager` in `package.json`). Vercel chooses its installer from whichever lockfile it finds, so `package-lock.json` / `pnpm-lock.yaml` are gitignored — a stray one silently switches the production build (Jules's `pnpm-lock.yaml` did this on 2026-10-26).

## Lint = design contract

Two linters, both encode the design:

- `eslint.config.mjs` — `@shadcn/lint`. **Errors** (`no-unknown-classes`, `no-raw-colors`, `require-static-classes`): classes that emit no CSS or off-theme colors; always fix. **Warnings** (`no-restyle`, `no-arbitrary-values`, `no-inline-styles`): design contracts; never add new ones. `components/ui/**` is exempt from the contract rules; inline styles are only linted in `app/**`, `components/sections/**`, `components/layout/**`. Plain-CSS classes (phone widgets, `pen-underline`, `threeui-background`) are allow-listed in the config — add new non-Tailwind class names there. The shadcn `note` lists the `@theme` brand tokens (mirrors DESIGN.md; `brand-navy` = legacy alias of `brand-ink`). Ignored: `.kilo/**` worktree copies, `hive/**` (agent office runtime), `docs/components/**`.
- `scripts/ktg-lint.mjs` — hand-rolled regex checks: `.home-page` track ≥ 10000px in `globals.css`, no THREE listeners without teardown. GSAP is live (`ScrollStory`, `SmoothScroll`, `Preloader`, `carousel/ring`) but its ScrollTrigger tripwires were removed because nothing trips them. Re-add them if narrative motion returns.

## Design source of truth

- Canonical palette: `app/goodai-tokens.css` (copy in `brand-guide/goodai-tokens.css`), imported in `app/layout.tsx`; `DESIGN.md`, `app/globals.css` `@theme` and `brand-guide/WEBSITE-DESIGN-TOKENS.md` are synced to it. `BRAND.md` for voice. Legacy token names: `brand-ink` = olive ink, `brand-paper` = paper, `brand-coral` = terracotta, `brand-eucalyptus` = sage.
- `app/tokens/*.css` is an older navy/coral/teal palette. Only `effects.css` is imported (from `globals.css`); leave the rest out.
- Fonts: Manrope (UI), Fraunces variable italic with `"SOFT" 100, "WONK" 1` (emphasis, `public/fonts/Fraunces/`, `app/studio-fonts.css`), Vibes (handwritten). Spelling is `Good'Ai`.
- Never invent testimonials, outcomes, pricing, or compliance claims. The site publishes no prices at any layer, including `lib/services.ts`.
- Motion: responsive, keyboard-focusable, honors `prefers-reduced-motion`. Scroll rules (Kevin): ~3 viewport heights per animation, held readable middle, nothing faster than ~1.5s, every ScrollTrigger states `start`/`end` with a comment.

## Architecture

- `app/layout.tsx` mounts site-wide: `Preloader`, `StudioHeader`/`StudioFooter` (`components/studio/Shell.tsx`), `MascotWidget`, `SmoothScroll`, Vercel `Analytics`, LocalBusiness JSON-LD. CSP lives in `next.config.ts` — new third-party scripts/frames must be added there or they silently fail in production.
- `app/page.tsx` is the whole homepage, dense single-line JSX inside `.home-page` (scroll height in `globals.css`, lint enforces ≥10000px). Order: `PerthSketchbook` → `Hero` (`components/sections/Hero.tsx`) → promise strip → `ScrollStory` (pinned) → services list → `WorkflowPreview` → approach → FAQ → contact.
- Content is data-driven from `lib/services.ts` (5 services). Homepage rows and `app/services/[slug]/page.tsx` both read it; `serviceIcons` in `page.tsx` is index-matched to that array, so reordering services means reordering icons.
- `lib/links.ts`: single source for CTA target (`SURVEY_URL` → `/contact`), phone `(08) 7741 4191`, and the hello/policy/privacy emails. All CTAs and contact details come from here.
- `components/studio/*` — current site components. `components/sections/*` and much of `components/ui/*` are parked old-design components kept as reuse material (Kev, 2026-10-04); most are unimported and carry most lint warnings. `HeroTree.tsx` lives only on `/lab`.
- **Sketchbook gate (Kev, 2026-10-28):** `PerthSketchbook` is not a section. It is a full-screen modal `<dialog>` that opens the homepage on its own, over the header and Goodie. Wheel, keys, swipe or drag turn the pages. Reaching the last page holds for 2.8 s, then the book slides up (1.5 s) onto the site. Skip and Escape close it straight away. It shows once per browser session (`sessionStorage` key `goodai:book-read`) and never on a deep link (`/#services`). The hero's words are therefore static at the top of the page; only its plant, spiral and arrow are scroll-scrubbed.
- `src/shaders/` — ThreeUI sketchbook (WebGL in a sandboxed iframe; `sketchbookDocument.js` patches an upstream click bug and riffle timing; `next.config.ts` adds CORS for `/sketchbook/*.woff2`). Plates in `public/sketchbook/plates/`.
- **Voice (live):** `MascotWidget` ("Goodie", `page-mascot`) opens `ElevenLabsMascot`, the ElevenLabs ConvAI embed; agent ID and embed URL in `lib/elevenlabs.ts`. Any component can open it with `window.dispatchEvent(new CustomEvent("openVoiceWidget"))` (as `VoiceDemo.tsx` does).
- **Trillet (retired):** `TrilletVoiceWidget.tsx` and `app/api/voice/call/route.ts` are still tracked but nothing mounts them (commit `bc1c84e` meant to delete them). `/demo` calls `notFound()` (kept for a future voice demo); `/api/chat/session` deliberately returns 503 (text chat not offered).
- **`/admin-engine`** (in the header, footer and sitemap): `public/machine/goodai-machine.html`, a single-file three.js machine built with the project's `machine` skill (`.claude/skills/machine`), embedded by `components/studio/MachineDemo.tsx`. Edit the machine script in that HTML, then run `node .claude/skills/machine/scripts/inline.mjs public/machine/goodai-machine.html` to re-paste the kit. Its numbers are labelled estimates (40 min per job); keep them that way. It is framed same-origin only: `next.config.ts` relaxes `X-Frame-Options`/`frame-ancestors` for `/machine/*` alone. Its like button posts `goodai-machine:like` to the page, which shows `SOCIAL_LINKS` from `lib/links.ts` (empty until Kev gives real handles).
- **Blog (`/blog`, `/blog/[slug]`; `/posts` rewrites to it):** `lib/instatic.ts` reads published posts from Instatic on Kev's NAS (`INSTATIC_URL`, a Tailscale Funnel URL) at build time, revalidating every 60 s. If the NAS is down the blog renders empty rather than failing the build. Railway is gone (account banned, 2026-10-28).
- **Leads:** `app/api/contact/route.ts` + `lib/contact.ts` send via Resend (retries from `onboarding@resend.dev` on a 403 unverified domain) and/or Workspace Gmail SMTP (`GMAIL_USER`/`GMAIL_APP_PASSWORD`), to `CONTACT_TO_EMAIL` (default `hello@goodai.au`) plus Gmail recipients. Then a best-effort HMAC-signed webhook (`lib/lead-webhook.ts`, `LEAD_WEBHOOK_URL`/`LEAD_WEBHOOK_SECRET`). Honeypot + rate limit (`lib/rate-limit.ts`). Reports success only when a mail transport accepted it; otherwise shows phone/email.

## Planning state

- `state/WEBSITE-STATE.md` — newest cross-workspace handoff (mirrored at `Documents/03/state/WEBSITE-STATE.md`); update it when you ship.
- `.planning/ROADMAP.md` (scope/phase order) and `.planning/STATE.md` (decisions, open questions). STATE.md was last updated 2026-10-04 and predates launch — trust the code over it, and refresh it at the end of a phase.
- `docs/JULES-HANDOFF-PLAN.md` — queue for Jules agents (they open `feat/ui-*` PRs). `TASKS.md` is stale.

<!-- CODEGRAPH_START -->
## CodeGraph

If a `.codegraph/` directory exists at repo root, use `codegraph_explore` (MCP) or `codegraph explore "<symbols or question>"` (shell) before grep/read to locate code and see call paths.
<!-- CODEGRAPH_END -->
