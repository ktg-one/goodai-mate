---
gsd_state_version: 1.0
milestone: v1.1-leadgen-automation
milestone_name: "Lead-gen + Automation layer (on the refactored Voice + mail-docket site)"
status: "active"
stopped_at: "All P0 code-side launch blockers resolved AND committed (4 commits on 2026-06-17). GWS CLI path, n8n trigger-call webhook, and ASR endpoint are env-driven — no hardcoded localhost / D:\\packages values remain. Design-system-new SSOT comment drift is fully cleared (0 refs in src/). Working tree clean. Remaining work is deploy-side only: set Vercel env vars + host ASR/n8n. The .planning folder is the self-sufficient source of truth — continuing dev does NOT require the Multica platform."
last_updated: "2026-06-24"
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

See: .planning/PROJECT.md (re-validated 2026-06-24)

**Core value:** Give Perth SMEs / tradies their time back. The Voice Agent hero demonstrates the product; the brutalist 1978 mail-docket flow tells the "we'll sort the boring stuff" story. v1.1 adds the lead-generation + automation machinery behind it (website audit tool, outbound callback, n8n/GWS pipeline).

**Current focus:** Deploy-side launch prep. All P0 *code* blockers are resolved and committed; the remaining gate is wiring the hosted services + Vercel env vars per `LAUNCH.md`. The `.planning` folder + repo are now self-contained: development can continue without the Multica platform.

## Current Position (verified 2026-06-24 against src/ + git)

**Shipped on top of the refactored mail-docket site:**
- **Website Analyzer** (`src/components/marketing/WebsiteAnalyzer.tsx` + `src/app/api/analyze-website/route.ts`): scrapes a URL, runs an AI Gateway audit, auto-extracts the business email, and dispatches the audit by email via the GWS CLI.
- **Outbound callback widget** (`src/components/voice-agent/OutboundCallCard.tsx` + `src/app/api/trigger-call/route.ts`): Darl / Robokev personas, phone-number prefill.
- **n8n + Google Workspace lead-automation pipeline** (`src/app/api/demo-automation/route.ts`, `LeadCaptureCard.tsx`, `VoiceAgentDemo.tsx`, `AutomationPlayground.tsx`).
- **Chat** via AI Gateway (`src/app/api/chat/route.ts`, `@ai-sdk/openai-compatible`) supporting dynamic model backends (Gemini, Groq, Claude) and custom agents (Darl/Robokev).
- **TTS** via ElevenLabs (`src/app/api/tts/route.ts`) supporting interchangeable voices and custom voice IDs.
- **Automation Playground** live demo section.
- GSAP scroll reveals on VoiceAgentDemo + AISolutions; Fraunces font-loading fix; Vercel deploy fixes (symlinks → physical font files); "paper-brand yellow pages" design pivot.

**Still present from the v1 refactor:** VoiceAgentHero (Supertonic local ASR), full mail-board GSAP flow (ribbons shear/tear, pinned Docket Flow, sticky in-tray of last-3 filed dockets, pinned footer clack ritual), reduced-motion static fallback.

**Newest (committed 2026-06-17, `423628e`):** dynamic model selection + voice-agent selectors, brand CSS theme, eslint fix.

**Working tree (2026-06-24):** clean. The 2026-06-16 "in-flight" set (Vite `public/voice-feature/*` removal, `globals.css` + `HomeClient.tsx` edits, new `public/assets/` audit images) is all committed. Only untracked items are local tooling dirs `.agent_context/`, `.multica/`, `.serena/` — not part of the app; gitignore them (the `.multica/` dir is local agent-runtime scratch, NOT a build/runtime dependency).

## Accumulated Context

### Decisions (key recent)
- Pivot the site from a pure brand/demo piece into a working lead-gen + automation funnel (audit tool → outbound call → n8n/GWS pipeline) while keeping the brutalist mail-docket language.
- Route AI through an AI Gateway (`AI_GATEWAY_API_KEY`) rather than a direct provider SDK.
- Use the Google Workspace CLI as the automation/email-dispatch backend.

### Blockers / Concerns (re-verified 2026-06-24, run 3 — see TODO.md for the actionable list)
- **Prod-blocking (Resolved + committed `7c47a55`):** GWS CLI path is no longer hardcoded. 0 refs to `D:\packages` remain in `src/`. It resolves from `GWS_CLI_PATH`, falls back to local `node_modules`, then a dev path.
- **Prod-blocking (Resolved + committed `7c47a55`):** `api/trigger-call` no longer defaults the n8n webhook to localhost. It reads `process.env.N8N_CALL_WEBHOOK_URL` and throws/mocks gracefully when unset (verified `trigger-call/route.ts:75-79`).
- **Dev-only (Resolved + committed `7c47a55`):** ASR resolves from `NEXT_PUBLIC_ASR_URL` (verified `lib/voice/supertonic.ts:17`); the only remaining `localhost:8000` strings are a doc-comment example and a dev fallback default.
- **SSOT drift (Resolved + committed `3b92089`):** `public/design-system-new/` stale comment refs are gone — **0** matches across `src/`. Canonical design source is `public/` root + PRODUCT.md.
- **Residual (P1, non-fatal):** `api/demo-automation/route.ts:254` still defaults the *demo* webhook to `http://localhost:5678/webhook/goodai-demo` when the request body omits a URL. Wrapped in try/catch so it degrades (no 500), but should read an env var for consistency with `trigger-call`.
- **Remaining = deploy-side only:** set the required env vars in Vercel and host ASR + n8n. Required env: `AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE`, `NEXT_PUBLIC_GWS_SCRIPT_URL`, `N8N_CALL_WEBHOOK_URL`, `GWS_CLI_PATH`, `NEXT_PUBLIC_ASR_URL`.

## Continuity Without Multica

Per the 2026-06-24 owner note ("ensure Multica isn't required to continue the dev"): the repo + `.planning/` folder are the authoritative, self-contained source of truth. The GSD docs (PROJECT/ROADMAP/REQUIREMENTS/STATE/TODO/LAUNCH) describe every shipped feature, open item, and the launch playbook with no Multica dependency. The local `.multica/` directory is agent-runtime scratch only and is safe to gitignore; nothing in `src/` imports or requires it. Any agent/CLI (Claude, Gemini, Qwen, Kimi) can pick up work from `.planning/TODO.md` alone.

## Session Continuity

Last validation: 2026-06-24 (run 3) — re-verified against `src/` + git on branch `goo-47-verify`. Confirmed all three prior P0 fixes are committed (`7c47a55`) and the SSOT comment drift cleared (`3b92089`): 0 `D:\packages` refs, 0 `design-system-new` refs, ASR + n8n trigger-call env-driven. Working tree clean. New residual logged: `demo-automation` localhost demo-webhook default (P1). Pre-refactor phases remain archived under `.planning/milestones/v0.9-pre-refactor-phases/`.

*Run `gsd health` / `gsd progress` at session start. **See `.planning/TODO.md`** for the get-to-production checklist; the remaining gate is deploy-side env wiring, not code.*
