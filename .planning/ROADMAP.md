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

1. **[RESOLVED] De-hardcode the GWS CLI path.** `api/analyze-website`, `api/trigger-call`, `api/demo-automation` now support dynamic path resolution from `GWS_CLI_PATH`, with fallback to local `node_modules` or developer's Windows path. Works with direct binary execution if not a JS script.
2. **[BLOCKER for prod] Hosted n8n webhook.** `api/trigger-call` defaults `N8N_CALL_WEBHOOK_URL` to `http://localhost:5678/webhook/goodai-call` — outbound-call widget hits localhost in prod unless pointed at a hosted n8n.
3. **Prod ASR path** for the Voice Agent (`localhost:8000` Supertonic dev-only in 4 files: `HomeClient`, `VoiceAgentHero`, `VoiceAgentDemo`, `lib/voice/supertonic.ts`).
4. **Resolve design SSOT drift** — `public/design-system-new/` was flattened to `public/` root (2026-06-10 consolidate commit) but **11** source files still cite the removed `design-system-new/` path in comments. Declare `public/` root + PRODUCT.md canonical and fix the stale references.
5. Commit / finalise the in-flight changes (voice-feature removal, css/HomeClient, audit assets).
6. Perf / a11y pass (Lighthouse) on the GSAP-heavy flow + new sections.
7. Capture v1.1 retroactively as a proper gsd milestone if continued (gsd-new-milestone / gsd-plan-phase) so future work is tracked.

See `.planning/TODO.md` for the same list as an actionable, file-level functional checklist, and `.planning/LAUNCH.md` for the production release and rollback playbook.

## Hygiene

- Use `/gsd-health`, `/gsd-progress`, `/gsd-docs-update` to keep .planning in sync — last drift was ~6 weeks (2026-06-04 → 2026-06-16) because features shipped outside gsd phases.
- Use goodai-award-configuration + goodai-agent-team for further high-craft brutalist surfaces (inject the canonical design SSOT + PRODUCT.md + live state + mechanical motion rules).

---

*Updated 2026-06-16 after re-validating .planning against the live codebase, then re-verifying all three concerns directly in source. v1.1 lead-gen/automation wave recorded; prod-blocking/SSOT concerns confirmed.*
