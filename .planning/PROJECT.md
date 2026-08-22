# Good'ai — Business Automations, Sorted (goodai.au)

## What This Is

<<<<<<< HEAD
Good'ai (goodai.au) is a Perth-based business automations service for SMEs (tradies, service businesses, $1M–$30M turnover). The site is the primary brand experience and lead generator. v1 is a single-page brutalist marketing site whose hero **is** the product: a functional local-first Voice Agent (Supertonic ASR + Good'ai persona + spoken replies during dev). Conversations "file" as physical mail dockets into an in-tray and drive the marketing narrative below (the "Docket Flow").

The entire site below the hero is one cohesive 1978 direct-mail corkboard being rifled as you scroll: perforated paper-tape ribbons (shear/tear), non-uniform pinned stamp dockets, heavy final clack ritual in the footer. Built with Next.js 16 (App Router), React 19, Tailwind, GSAP + Framer Motion hybrid, custom stamp primitives.

Development and craft heavily leverage local agent skills from `.agents/skills` and `.claude/skills` (goodai-award-configuration + awwwards/gsap/impeccable swarm for the mechanical brutalist execution).

## Core Value

A switched-on Perth tradie/business owner lands, speaks their admin mess (invoicing, follow-ups, quotes, the lot) into the Voice Agent, feels understood by a local mate who "gets it", and knows the boring stuff will be sorted so they can knock off early. No portals, no logins, no dashboards. Just relief.

If the voice + the physical docket story doesn't make them drop a line, nothing else matters.

## Requirements

### Validated / Shipped (refactor delivery)

- [x] Voice Agent hero is the product (local Supertonic endpoint, push-to-talk + transcript, onMailFiled leaks state into in-tray)
- [x] Brutalist mail-board metaphor: ribbons (perforated tape with GSAP shear/flutter), docket flow (non-uniform pinned StampCards with rot/offset/wear), filed mail tray (last-3 physical dockets)
- [x] One orange (red-accent) per surface discipline, Fraunces WONK exactly once per major block for emphasis, stamp shadows that participate in motion
- [x] Reduced-motion: fully static filed-paper layouts with all stamps, rots, perforations, imprints visible and tactile (no lost meaning)
- [x] PRODUCT.md + public/ as the single source of truth for brand (ink/paper, stamp physics 90-160ms hard springs, one red, etc.)
- [x] Local agent skills: goodai-agent-team, goodai-award-configuration (5-skill swarm: impeccable + awwwards-animations + awwwards-ui-skills + gsap-awwwards-website + gsap-framer-scroll-animation), plus gsd-* (health, docs-update, progress, etc.) for planning/docs
- [x] Direct imports only (no barrels per AGENTS.md), production-grade Vercel/Next patterns
- [x] Footer ritual: heavy stamped docket clack, wonk line, minimal contact

### Active / Ongoing

- [ ] Voice quality / Supertonic prod endpoint + latency tuning
- [ ] Lead capture via real contact (mailto + form) + conversation context handoff to ops
- [ ] Additional surfaces (services, about, case studies) in same brutalist mail language
- [ ] gsd health + docs alignment after refactor (this work)
- [ ] Production deploy / domain + analytics

### Out of Scope (v1)

- Old v1 shader + custom cursor + old shadcn lead card flow (superseded by the award-refactored mail board)
- Multi-page app chrome or dashboards
- User accounts / auth
- Full automation execution demos (voice + docket is the demo)

## Context

- **Refactor**: Original planning (phase 1 foundation + planned visual/chat/lead phases with SDF shader, custom cursor, old lead capture) was superseded by a full mechanical brutalist redesign of the marketing site. The Voice Agent + mail-docket aesthetic (1978 corkboard + rubber stamps + perforated tape) was executed via the goodai-award-configuration 5-agent swarm + goodai-agent-team coordination. Old .planning/phases/ archived to milestones/v0.9-pre-refactor-phases/.
- **Brand**: "Good'ai" (good eye, mate). "we'll sort the boring stuff." Practical. Warm. Direct. Switched-on Aussie mate who happens to be unusually good at systems. Short sentences. "We", never "I". No hype, no "AI-powered", no corporate.
- **Design SSOT**: PRODUCT.md + public/ (paper canvas #FFF0D0, navy/gold/red, flat 3px participating stamp shadows, Fraunces var + WONK, 4px grid, mechanical motion only, ribbon-receipt, one red per surface).
- **Skills in use**: See skills-lock.json + local .agents/skills/goodai-* + .claude/skills/ (gsap, awwwards, design, next-best-practices, gsd-*) and global equivalents. gsd-health, gsd-docs-update, gsd-progress etc. now present locally for ongoing work.
- **Tech**: Next.js 16, Tailwind v4, GSAP/ScrollTrigger + @gsap/react + motion/react (hybrid, no fighting timelines), direct component imports.
- **Voice dev**: Supertonic local (http://localhost:8000/transcribe) for ASR during development; prod voice path TBD.

## Constraints

- 60fps hot paths (refs only, transform/opacity/filter, canvas DPR capped)
- Stamp clack timing: hard 90-160ms cubic-bezier(0.23,1,0.32,1) — no floaty easings
- One red accent max per surface/block
- Exactly one Fraunces WONK phrase per major surface
- Reduced motion must not lose the 1978 docket artifact
- Zero "AI" hype language in UI or persona
- Voice Agent remains pure functional product moment at top; everything else receives leaked convos as filed mail

## Key Decisions (post-refactor)

| Decision | Rationale | Status |
|----------|-----------|--------|
| Award Configuration swarm for the redesign | Battle-tested pattern that delivered coordinated 60fps mechanical brutalist mail-board execution | Shipped (May 2026) |
| Local .agents/.claude skills copies (goodai-*, gsd-*, awwwards/gsap) | Project-specific context + gsd planning tools always available when working in-repo | Added gsd-health + core set |
| Archive pre-refactor phases | Old 01-05 plans described shader/cursor/old-lead v1 that was pivoted away in the refactor | Archived to milestones/v0.9-pre-refactor-phases/ |
| gsd for health/docs/progress | Use /gsd-health, /gsd-docs-update, /gsd-progress etc. to keep .planning and docs/ in sync with actual shipped site | In progress (this task) |
| PRODUCT.md + public/ design system as SSOT | Brand guardrails must be injected into every creative agent run | Enforced |

---

*Last updated: 2026-06-04 after gsd-health + skills add + docs alignment for refactored site*
*Pre-refactor planning archived; current reality is the Voice + mail-docket brutalist site delivered via award skills + gsd oversight.*
=======
Good'ai (goodai.au) is a Perth-based business-automations service for SMEs (tradies, service businesses, ~$1M–$30M turnover). The site is the primary brand experience **and** an active lead-generation funnel. It is a single-page brutalist 1978 direct-mail marketing site whose hero **is** the product: a functional Voice Agent (Supertonic ASR locally during dev). Conversations "file" as physical mail dockets into a sticky in-tray and drive the narrative below (the "Docket Flow").

As of milestone **v1.1**, the site also runs the machinery that turns interest into leads: a website-audit tool, an outbound callback widget, and an n8n + Google Workspace automation pipeline.

Built with Next.js 16 (App Router), React 19, Tailwind v4, GSAP/ScrollTrigger + Motion (motion/react) hybrid, custom stamp primitives. Direct imports only (no barrels, per AGENTS.md).

## Core Value

A switched-on Perth tradie/owner lands, speaks (or types) their admin mess into the Voice Agent, feels understood by a local mate who "gets it", and is then pulled into a real lead path — a free website audit, a callback from Darl/Robokev, or a captured conversation routed to ops via n8n/GWS. No portals, no logins, no dashboards. Just relief, then a tangible next step.

## Requirements

### Validated / Shipped — v1 refactor (mail-docket brand site)
- [x] Voice Agent hero is the product (Supertonic local ASR, push-to-talk + transcript; `onMailFiled` leaks state into the in-tray)
- [x] Brutalist mail-board: ribbons (GSAP shear/tear/flutter), Docket Flow (non-uniform pinned StampCards: rot/offset/wear), sticky in-tray (last-3 filed dockets), pinned footer clack ritual
- [x] One red accent per surface, Fraunces WONK once per major block, participating stamp shadows, 60fps mechanical physics (90–160ms hard springs)
- [x] Reduced-motion: fully static filed-paper layout, all artifacts visible
- [x] Footer ritual: heavy stamped docket clack + wonk line + minimal contact (`mailto:hello@goodai.au`)

### Validated / Shipped — v1.1 lead-gen + automation (verified in src/ 2026-06-16)
- [x] **Website Analyzer**: scrape URL → AI Gateway audit → auto-extract business email → dispatch audit by email via GWS CLI
- [x] **Outbound callback widget**: Darl / Robokev personas, phone-number prefill (`/api/trigger-call`)
- [x] **n8n + Google Workspace lead-automation pipeline** (`/api/demo-automation`, LeadCaptureCard, VoiceAgentDemo, AutomationPlayground)
- [x] **Chat** via AI Gateway + text fallback mode (`/api/chat`); **TTS** via ElevenLabs (`/api/tts`); **Interchangeable voices + backend models** (Gemini/Groq/Claude) in the VoiceAgentHero
- [x] GSAP scroll reveals on VoiceAgentDemo + AISolutions; Fraunces font-loading fix; Vercel deploy fixes (physical font files, no symlinks)

### Active / Ongoing (open — see ROADMAP §Open Workstreams)
- [x] **[prod blocker — DONE 2026-06-17 `7c47a55`]** De-hardcode the GWS CLI path (`D:\packages\…`) → env-driven (`GWS_CLI_PATH` + node_modules fallback); 0 refs remain
- [x] **[prod blocker — DONE 2026-06-17 `7c47a55`]** `api/trigger-call` n8n webhook now reads `N8N_CALL_WEBHOOK_URL`, no localhost default (throws/mocks if unset)
- [x] **[prod blocker — DONE 2026-06-17 `7c47a55`]** Production ASR path now reads `NEXT_PUBLIC_ASR_URL`; localhost:8000 only as dev fallback/example
- [x] **[DONE 2026-06-17 `3b92089`]** Resolve design SSOT — `public/design-system-new/` comment refs cleared (0 in src/); canonical = `public/` root + PRODUCT.md
- [x] **[DONE 2026-06-17]** Commit in-flight work (Vite `public/voice-feature/*` removal, css/HomeClient edits, new audit assets) — working tree clean
- [ ] **[deploy gate]** Set required env vars in Vercel + host ASR/n8n endpoints (see LAUNCH.md)
- [ ] **[P1]** `api/demo-automation` demo webhook still defaults to `localhost:5678` — make env-driven for consistency
- [ ] Lighthouse / perf / a11y pass on the GSAP-heavy flow
- [ ] Additional surfaces (services, about, case studies) in the same brutalist language
- [ ] Production deploy / domain + analytics

### Out of Scope (current)
- Old shader + custom cursor + old shadcn lead card (superseded)
- Multi-page app chrome / dashboards / user accounts / auth

## Context

- **Refactor → v1.1**: original phase plan (shader/cursor/old-lead) was superseded by the v1 mechanical brutalist redesign (goodai-award-configuration swarm). Since 2026-06-04 a lead-gen + automation layer (v1.1) was added ad-hoc on top. Old `.planning/phases/` archived to `milestones/v0.9-pre-refactor-phases/`.
- **Brand**: "Good'ai" (good eye, mate). "we'll sort the boring stuff." Practical, warm, direct. "We", never "I". No hype, no "AI-powered", no corporate.
- **Design SSOT**: paper canvas, navy/gold/red, flat 3px participating stamp shadows, Fraunces var + WONK, 4px grid, mechanical motion only, one red per surface. Canonical source is `public/` root (`colors_and_type.css`, `fonts/`, `good-ai-design-final.html`, `README.md`) + PRODUCT.md, after the 2026-06-10 consolidation. The stale `public/design-system-new/` comment refs were cleared on 2026-06-17 (`3b92089`) — 0 remain in `src/`.
- **Tech**: Next.js 16, React 19, Tailwind v4, GSAP/ScrollTrigger + @gsap/react + motion/react (hybrid), direct imports.
- **Backends**: AI Gateway (`AI_GATEWAY_API_KEY`) for chat + audit; ElevenLabs (`ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE`) for TTS; Google Workspace CLI + n8n for automation/email dispatch; Supertonic local for dev ASR; `NEXT_PUBLIC_GWS_SCRIPT_URL` for lead capture.
- **Skills in use**: local `.agents/skills` + `.claude/skills` (goodai-award-configuration + awwwards/gsap/impeccable swarm, next-best-practices, gsd-* family).

## Constraints
- 60fps hot paths (refs only; transform/opacity/filter; canvas DPR capped)
- Stamp clack timing: hard 90–160ms cubic-bezier(0.23,1,0.32,1) — no floaty easings
- One red accent max per surface/block; exactly one Fraunces WONK phrase per major surface
- Reduced motion must not lose the 1978 docket artifact
- Zero "AI" hype language in UI or persona
- Voice Agent stays the pure functional product moment at top; everything else receives leaked convos as filed mail

## Key Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| Award Configuration swarm for the v1 redesign | Delivered coordinated 60fps mechanical brutalist mail-board | Shipped (May 2026) |
| Add a lead-gen + automation layer (v1.1) | Turn the brand demo into a working funnel (audit → call → pipeline) | Shipped 2026-06-09/10, work in flight |
| AI Gateway for all model calls | Single keyed entry point vs per-provider SDKs | Shipped |
| Google Workspace CLI + n8n as automation backend | Reuse existing GWS/n8n tooling for email + lead routing | Shipped; path de-hardcoded + env-driven 2026-06-17 |
| Archive pre-refactor phases | Old 01–05 plans described the abandoned shader/cursor v1 | Archived |
| Keep `.planning/` + repo self-contained (no Multica dependency) | Owner needs dev to continue via any AI CLI, not bound to the platform | Decided 2026-06-24 |

---

*Last validated: 2026-06-24 against the live codebase + git (branch `goo-47-verify`). All P0 code blockers confirmed resolved & committed (`7c47a55`), SSOT comment drift cleared (`3b92089`), working tree clean. Remaining work is deploy-side only. Repo + `.planning/` confirmed self-sufficient — no Multica dependency for continued dev.*
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
