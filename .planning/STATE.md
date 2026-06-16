---
gsd_state_version: 1.0
milestone: v1.1-leadgen-automation
milestone_name: "Lead-gen + Automation layer (on the refactored Voice + mail-docket site)"
status: "active"
stopped_at: "GWS CLI path de-hardcoding resolved across all 3 routes (env-driven support, local node_modules auto-resolve, direct binary execution support). Remaining blockers: localhost ASR in 4 files; n8n webhook defaulting to localhost:5678; design-system-new stale refs in comments."
last_updated: "2026-06-16"
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
  note: "Feature work since 2026-06-04 shipped outside formal gsd phases (direct commits + bolt/ultracode branches). percent tracks formal phases only; the site itself has materially advanced."
---

# Project State

## Project Reference

See: .planning/PROJECT.md (re-validated 2026-06-16)

**Core value:** Give Perth SMEs / tradies their time back. The Voice Agent hero demonstrates the product; the brutalist 1978 mail-docket flow tells the "we'll sort the boring stuff" story. v1.1 adds the lead-generation + automation machinery behind it (website audit tool, outbound callback, n8n/GWS pipeline).

**Current focus:** Pre-launch verification. The `LAUNCH.md` document has been created to track the non-bypassable pre-flight checks, dry run procedures, and recovery playbook. The primary focus is resolving the P0 prod blockers and migrating off localhost resources.

## Current Position (verified 2026-06-16 against src/)

**Shipped on top of the refactored mail-docket site:**
- **Website Analyzer** (`src/components/marketing/WebsiteAnalyzer.tsx` + `src/app/api/analyze-website/route.ts`): scrapes a URL, runs an AI Gateway audit, auto-extracts the business email, and dispatches the audit by email via the GWS CLI.
- **Outbound callback widget** (`src/components/voice-agent/OutboundCallCard.tsx` + `src/app/api/trigger-call/route.ts`): Darl / Robokev personas, phone-number prefill.
- **n8n + Google Workspace lead-automation pipeline** (`src/app/api/demo-automation/route.ts`, `LeadCaptureCard.tsx`, `VoiceAgentDemo.tsx`, `AutomationPlayground.tsx`).
- **Chat** via AI Gateway (`src/app/api/chat/route.ts`, `@ai-sdk/openai-compatible`) + text fallback mode.
- **TTS** via ElevenLabs (`src/app/api/tts/route.ts`).
- **Automation Playground** live demo section.
- GSAP scroll reveals on VoiceAgentDemo + AISolutions; Fraunces font-loading fix; Vercel deploy fixes (symlinks → physical font files); "paper-brand yellow pages" design pivot.

**Still present from the v1 refactor:** VoiceAgentHero (Supertonic local ASR), full mail-board GSAP flow (ribbons shear/tear, pinned Docket Flow, sticky in-tray of last-3 filed dockets, pinned footer clack ritual), reduced-motion static fallback.

**In flight (uncommitted — `git status`):**
- Deleting the old standalone Vite voice scaffold `public/voice-feature/*`.
- Edits to `src/app/globals.css` and `src/components/HomeClient.tsx`.
- New audit assets under `public/assets/` (11.jpg, 12.jpg, G.jpg, "G (2).jpg").

## Accumulated Context

### Decisions (key recent)
- Pivot the site from a pure brand/demo piece into a working lead-gen + automation funnel (audit tool → outbound call → n8n/GWS pipeline) while keeping the brutalist mail-docket language.
- Route AI through an AI Gateway (`AI_GATEWAY_API_KEY`) rather than a direct provider SDK.
- Use the Google Workspace CLI as the automation/email-dispatch backend.

### Blockers / Concerns (re-verified 2026-06-16, run 2 — see TODO.md for the actionable list)
- **Prod-blocking (Resolved):** GWS CLI path is no longer hardcoded in `src/app/api/{analyze-website,trigger-call,demo-automation}/route.ts`. It now dynamically resolves from the `GWS_CLI_PATH` env variable, falls back to local `node_modules` if installed, and defaults to the local Windows path for development.
- **Prod-blocking (NEW, undocumented before):** `api/trigger-call` defaults the n8n webhook to `http://localhost:5678/webhook/goodai-call` (`N8N_CALL_WEBHOOK_URL` fallback). The outbound-call widget will hit localhost in prod unless the env var points at a hosted n8n.
- **Dev-only:** ASR points at `http://localhost:8000/transcribe` (Supertonic local) in **4 files** — `HomeClient.tsx`, `voice-agent/VoiceAgentHero.tsx`, `marketing/VoiceAgentDemo.tsx`, `lib/voice/supertonic.ts`. No prod ASR path.
- **SSOT drift (corrected count):** `public/design-system-new/` no longer exists — the 2026-06-10 "consolidate design system" commit flattened its contents up to `public/` root (`colors_and_type.css`, `fonts/`, `good-ai-design-final.html`, `README.md`). **11** source files still cite the removed `public/design-system-new/...` path in comments: `globals.css`, `HomeClient.tsx`, `voice-agent/VoiceAgentHero.tsx`, `marketing/Manifest.tsx`, `marketing/WhyGoodAI.tsx`, `hero/Visualizer.tsx`, `brand/BrandWordmark.tsx`, `hero/Hero.tsx`, `StampCard.tsx`, `app/layout.tsx`, `app/global-error.tsx`. Declare `public/` root + PRODUCT.md canonical and fix the stale comments.
- Required env for the live features: `AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE`, `NEXT_PUBLIC_GWS_SCRIPT_URL`, `N8N_CALL_WEBHOOK_URL`.

## Session Continuity

Last validation: 2026-06-16 (run 2) — re-ran progress validation against `src/`. Confirmed `D:\packages` hardcode in exactly the 3 routes (user fixing now), `localhost:8000` ASR in 4 files, `public/design-system-new` absent/flattened with 11 (not ~14) stale comment refs, and surfaced a NEW prod blocker: `api/trigger-call` n8n webhook defaults to `localhost:5678`. Authored `.planning/TODO.md` with the prioritised functional checklist. Pre-refactor phases remain archived under `.planning/milestones/v0.9-pre-refactor-phases/`.

*Run `gsd health` / `gsd progress` at session start. **See `.planning/TODO.md`** for the get-to-production checklist; resolve the P0 blockers before any prod deploy.*
