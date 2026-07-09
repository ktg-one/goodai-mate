---
gsd_state_version: 1.0
milestone: v1.1-leadgen-automation
milestone_name: "Lead-gen + Automation layer (on the refactored Voice + mail-docket site)"
status: "active"
stopped_at: "PRODUCTION WAS DOWN 2026-06-17 through 2026-07-08: 19 of 20 consecutive Vercel deploys failed (see Build Health incident below). Root cause fixed and verified in PR #64 (branch claude/webdev-eval-migration-ppyy9p), awaiting merge. Once merged, remaining work is still deploy-side only per prior state: set Vercel env vars + host ASR/n8n."
last_updated: "2026-07-08"
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

## Build Health Incident — 2026-07-08 (READ THIS BEFORE TOUCHING `next`, `package.json` build script, or root `layout.tsx`/`global-error.tsx`)

**What happened:** Production was down for ~3 weeks. 19 of the last 20 Vercel deploys failed. Every failing build — regardless of what the commit actually changed (mostly unrelated a11y/perf tweaks from an automated agent) — died on the same pre-existing typecheck error in `HomeClient.tsx`. Nobody noticed because CI wasn't gating merges to `main`, so broken commits kept landing on top of other broken commits.

**Root cause #1 (the one every build log showed):** stale, unused `// @ts-expect-error` directives in `HomeClient.tsx`. TypeScript flags an `@ts-expect-error` as an error if the suppressed error no longer occurs. Fixed by deleting them (commit in PR #64).

**Root cause #2 (hidden behind #1 — this is the one that will bite you again if you're not careful):** once typecheck passes, `next build` on **Next.js 16.x (any version through 16.3.0-preview.5)** crashes while statically prerendering the internal `/_global-error` fallback page — `TypeError: Cannot read properties of null (reading 'useContext')`. This is a **confirmed upstream Next.js bug**, not an app bug — reproduced with `global-error.tsx` deleted, the homepage trivialized to a single `<div>`, and `next.config.ts` stripped to `{}`; it still crashed identically (same error digest) every time. See vercel/next.js issues #84994, #85668, #86178, #87719 (all open as of this writing).

**LESSON FOR THE NEXT AGENT (Codex/Kimi/Gemini/Copilot/OpenCode/whoever picks this up):**
- **Do NOT upgrade `next` back to 16.x** without first checking whether those GitHub issues are closed. If you do and the build starts failing on `/_global-error` again, this is why — don't waste a debugging cycle rediscovering it.
- **Do NOT simplify or "clean up" the `build` script in `package.json`** back to a plain `next build`. It's intentionally split into two phases (`next build --experimental-build-mode compile && next build --experimental-build-mode generate-env`) to skip Next's broken static-prerender pass. Every route in this app is already dynamic (SSR per-request), so this loses nothing.
- **Do NOT re-add `export const dynamic = 'force-dynamic'` to `src/app/layout.tsx`** as an attempted fix for prerender crashes — a prior agent already tried that (commit `e6fbe4c`) and a later Next bump silently defeated it. It's a dead end for this bug.
- **If `next build` starts failing again on a special route** (`/_global-error`, `/_error`, `/404`, `/500`) with a null-context or `<Html>`-import error, don't assume it's your change — verify first by trivializing `page.tsx` and stripping `next.config.ts` locally (matching Vercel's Node version — check `nodeVersion` on the Vercel project, not just your local `node -v`) before spending hours bisecting app code. It very likely isn't the app.
- **package.json currently pins `next@^15.5.20`, `eslint-config-next@^15.5.20`**, deliberately downgraded from `^16.2.3` for this reason. `eslint.config.mjs` uses `FlatCompat` (not direct flat-config imports) because 15.5.20's `eslint-config-next` doesn't ship the flat-config array shape 16.x does.
- **Before merging ANY agent's PR to `main` from now on, confirm `npm run build` actually exits 0.** That single check would have caught this three weeks earlier. There is currently no branch-protection rule enforcing this — consider adding one.

**Status:** Fix verified locally (Node 20, matching Vercel's build runtime) and confirmed live — Vercel deployment `dpl_HWqVhp3F5wk9oFaWkL3eZzNKWKAp` for this fix reached `READY` state (first successful build in weeks). Sitting in PR #64 (draft), awaiting merge.

**Follow-up, not urgent:** Node 20 is deprecated by Vercel as of 2026-10-01; `package.json` engines pins `>=20.9.0 <21` while the Vercel project setting wants `24.x`. Needs a dedicated, tested migration pass before October — don't do it opportunistically inside an unrelated change, since the last person who touched build config here (twice) is why we're writing this section.

## Continuity Without Multica

Per the 2026-06-24 owner note ("ensure Multica isn't required to continue the dev"): the repo + `.planning/` folder are the authoritative, self-contained source of truth. The GSD docs (PROJECT/ROADMAP/REQUIREMENTS/STATE/TODO/LAUNCH) describe every shipped feature, open item, and the launch playbook with no Multica dependency. The local `.multica/` directory is agent-runtime scratch only and is safe to gitignore; nothing in `src/` imports or requires it. Any agent/CLI (Claude, Gemini, Qwen, Kimi) can pick up work from `.planning/TODO.md` alone.

## Session Continuity

Last validation: 2026-06-24 (run 3) — re-verified against `src/` + git on branch `goo-47-verify`. Confirmed all three prior P0 fixes are committed (`7c47a55`) and the SSOT comment drift cleared (`3b92089`): 0 `D:\packages` refs, 0 `design-system-new` refs, ASR + n8n trigger-call env-driven. Working tree clean. New residual logged: `demo-automation` localhost demo-webhook default (P1). Pre-refactor phases remain archived under `.planning/milestones/v0.9-pre-refactor-phases/`.

*Run `gsd health` / `gsd progress` at session start. **See `.planning/TODO.md`** for the get-to-production checklist; the remaining gate is deploy-side env wiring, not code.*
