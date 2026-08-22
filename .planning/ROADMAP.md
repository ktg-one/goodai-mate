<<<<<<< HEAD
# Roadmap: Good'ai (refactored)

## Overview

Good'ai site v1 was originally planned as 5 incremental phases (shader foundation → visual → chat → lead capture → deploy). After Phase 1 foundation, the site was **fully refactored** into its current form: a brutalist direct-mail marketing experience whose hero **is** the functional Voice Agent product (local Supertonic), with conversation state leaking as physical "filed mail" into ribbons, pinned dockets, and tray. The redesign was executed via the goodai-award-configuration (5 specialized agents: impeccable + awwwards-animations + awwwards-ui-skills + gsap-awwwards-website + gsap-framer-scroll-animation) coordinated by goodai-agent-team.

Pre-refactor phases (01-05) have been archived to `.planning/milestones/v0.9-pre-refactor-phases/`.

Ongoing work uses gsd-* skills (now added locally: gsd-health, gsd-docs-update, gsd-progress, gsd-manager, gsd-do, gsd-plan-phase, etc.) + goodai skills for brand-compliant updates.

## Current State (post-refactor)

- **Delivered**: Voice Agent hero + full mail-board brutalist flow (ribbons, docket pins, in-tray, footer ritual). 60fps mechanical stamp physics, one-red discipline, WONK, reduced-motion static artifacts, PRODUCT.md + public/ design system as SSOT.
- **Skills**: Local copies in .agents/skills/ and .claude/skills/ (goodai-*, gsd-*, gsap/awwwards/impeccable design skills, next best practices).
- **Planning hygiene**: gsd-health now available in-project; docs/ + .planning/ aligned to actual shipped site (this milestone).

## Phases (historical + current)

**Pre-refactor (archived)**:
- Phase 1: Foundation (GLSL, tokens, fonts) — completed 2026-04-01, code artifacts may remain or have been adapted.
- Phases 2-5: Visual Layer / Chat Core / Lead Capture / Polish — described old SDF shader + cursor + old lead card flow. Superseded by the award-refactored mail-docket site. Archived.

**Current / Live**:
The "v1" that shipped is the refactored Voice + physical docket site. No numbered phases currently active in .planning/phases/ (empty after archive + hygiene pass).

Future increments (voice prod, additional surfaces, ops handoff, full gsd milestone) will be planned with gsd-new-milestone / gsd-plan-phase using the goodai brand guardrails.

## Phase Details (Pre-refactor — for reference only)

See `.planning/milestones/v0.9-pre-refactor-phases/` for the old 01-01 through 05-02 PLAN.md files. They are no longer authoritative.

## Progress & Hygiene

- Old planning reported ~11% (only phase 1 complete).
- Post archive + gsd-health + docs update: .planning/phases/ is clean; PROJECT.md / ROADMAP.md / STATE.md now describe the actual refactored site and skill usage.
- Use `/gsd-health`, `/gsd-progress`, `/gsd-docs-update --verify-only` (or --force) going forward to keep docs in sync.
- Use goodai-award-configuration + goodai-agent-team when doing further high-craft brutalist work.

## Next Actions (typical)

- Run `gsd health` or `gsd progress` to get current snapshot + routing.
- For new work: gsd-discuss-phase / gsd-plan-phase (inject PRODUCT.md + public/ design system + current live state + mechanical rules).
- For craft upgrades: dispatch via goodai-award-configuration (optionally + planning agent).

---

*Updated 2026-06-04 after adding gsd skills (incl. gsd-health) from .claude/.agents and running gsd-health alignment on the refactored site.*
*Pre-refactor phases archived. Current site = award swarm brutalist mail execution + ongoing gsd-managed docs.*
=======
# Roadmap: Good'ai

## Overview

Good'ai (goodai.au) started as a 5-phase plan (shader foundation → visual → chat → lead capture → deploy). After Phase 1, the site was **fully refactored** (milestone v1) into a brutalist 1978 direct-mail experience whose hero **is** the functional Voice Agent, with conversation state leaking as physical filed mail (ribbons, pinned dockets, in-tray, footer clack). That redesign shipped via the goodai-award-configuration 5-agent swarm + goodai-agent-team.

Since 2026-06-04 the site has advanced again (milestone **v1.1**): a lead-generation + automation layer was added on top of the mail-docket aesthetic. This was built ad-hoc (direct commits + bolt/ultracode branches), not through formal gsd phases — this roadmap now records it so .planning matches reality.

Pre-refactor phases (01–05) remain archived in `.planning/milestones/v0.9-pre-refactor-phases/`.

## Milestones

### v0.9 — Pre-refactor (archived)
- Phase 1: Foundation (GLSL, tokens, fonts) — completed 2026-04-01.
- Phases 2–5: Visual / Chat / Lead Capture / Polish — described the old SDF shader + cursor + old lead card. Superseded by the v1 refactor. Archived.

### v1 — Voice + mail-docket refactor (shipped, May 2026)
- VoiceAgentHero (Supertonic local ASR), full mail-board GSAP flow: ribbons (shear/tear/flutter), pinned Docket Flow with per-card rot/offset/wear, sticky in-tray (last-3 filed dockets), pinned footer clack ritual.
- One-red discipline, Fraunces WONK once per major block, 60fps mechanical stamp physics (90–160ms hard springs), reduced-motion static fallback that keeps all physical artifacts.
- Design SSOT: PRODUCT.md + public/ (see SSOT-drift note below).

### v1.1 — Lead-gen + Automation layer (shipped 2026-06-09/10, work still in flight)
Verified present in `src/` on 2026-06-16:
- **Website Analyzer** — scrape URL → AI Gateway audit → auto-extract business email → email the audit via GWS CLI (`WebsiteAnalyzer.tsx`, `api/analyze-website`).
- **Outbound callback widget** — Darl / Robokev personas, number prefill (`OutboundCallCard.tsx`, `api/trigger-call`).
- **n8n + GWS lead-automation pipeline** (`api/demo-automation`, `LeadCaptureCard`, `VoiceAgentDemo`, `AutomationPlayground`).
- **Chat** (AI Gateway, `api/chat`) + text fallback; **TTS** (ElevenLabs, `api/tts`).
- **Automation Playground** live demo section.
- GSAP scroll reveals (VoiceAgentDemo + AISolutions); Fraunces font fix; Vercel symlink→physical-file font fix; "yellow pages" design pivot.

**In flight (uncommitted):** removing old `public/voice-feature/*` Vite scaffold; `globals.css` + `HomeClient.tsx` edits; new `public/assets/` audit images.

## Open Workstreams / Next Actions

Prioritised by the 2026-06-16 validation:

**Code-side blockers — all RESOLVED & committed 2026-06-17 (verified in src/ 2026-06-24):**
1. **[DONE `7c47a55`] GWS CLI path de-hardcoded.** Resolves from `GWS_CLI_PATH`, falls back to local `node_modules`, then a dev path. 0 `D:\packages` refs remain.
2. **[DONE `7c47a55`] n8n trigger-call webhook env-driven.** Reads `N8N_CALL_WEBHOOK_URL`, no localhost default; throws/mocks gracefully if unset.
3. **[DONE `7c47a55`] ASR path env-driven.** Reads `NEXT_PUBLIC_ASR_URL`; localhost:8000 only as dev fallback/comment example.
4. **[DONE `3b92089`] Design SSOT drift cleared.** 0 `design-system-new/` refs in src/. Canonical = `public/` root + PRODUCT.md.
5. **[DONE 2026-06-17] In-flight changes committed.** Vite `public/voice-feature/*` removed, css/HomeClient edits + audit assets landed; working tree clean.

**Remaining (deploy-side + polish):**
6. **[deploy gate] Wire hosted services + Vercel env vars** (`AI_GATEWAY_API_KEY`, `ELEVEN_*`, `NEXT_PUBLIC_GWS_SCRIPT_URL`, `N8N_CALL_WEBHOOK_URL`, `GWS_CLI_PATH`, `NEXT_PUBLIC_ASR_URL`) — see LAUNCH.md.
7. **[DONE] `api/demo-automation:254`** still defaults the demo webhook to `localhost:5678` — made env-driven for consistency with `trigger-call` (reads `N8N_DEMO_WEBHOOK_URL` / `N8N_CALL_WEBHOOK_URL`).
8. Perf / a11y pass (Lighthouse) on the GSAP-heavy flow + new sections.
9. Additional brutalist surfaces (services / about / case studies).
10. Capture v1.1 retroactively as a proper gsd milestone if continued (gsd-new-milestone / gsd-plan-phase) so future work is tracked.

See `.planning/TODO.md` for the same list as an actionable, file-level functional checklist, and `.planning/LAUNCH.md` for the production release and rollback playbook.

## Hygiene

- Use `/gsd-health`, `/gsd-progress`, `/gsd-docs-update` to keep .planning in sync — last drift was ~6 weeks (2026-06-04 → 2026-06-16) because features shipped outside gsd phases.
- **No Multica dependency:** the repo + `.planning/` are the authoritative source of truth; any AI CLI (Claude/Gemini/Qwen/Kimi) can continue from `.planning/TODO.md` alone. The local `.multica/` dir is agent-runtime scratch only — gitignore it.
- Use goodai-award-configuration + goodai-agent-team for further high-craft brutalist surfaces (inject the canonical design SSOT + PRODUCT.md + live state + mechanical motion rules).

---

*Updated 2026-06-24 after re-validating .planning against the live codebase + git (branch `goo-47-verify`). All five code-side blockers confirmed resolved & committed; remaining work is deploy-side env wiring + polish. Repo confirmed self-sufficient (no Multica dependency).*
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
