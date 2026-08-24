---
last_mapped_commit: 499a6fa1425d928d77d272e4bc4eb0e029745c14
---
# Codebase Concerns

**Analysis Date:** 2026-08-24

## Tech Debt

**Hardcoded Windows Google Workspace CLI path on Vercel-bound APIs:**
- Issue: Three production App Router routes spawn `node` against `D:\\packages\\npm-global\\node_modules\\@googleworkspace\\cli\\run.js`. That path cannot exist on Vercel serverless.
- Files: `src/app/api/demo-automation/route.ts`, `src/app/api/trigger-call/route.ts`, `src/app/api/analyze-website/route.ts`
- Why: Local demo of GWS CLI (Sheets/Docs/Gmail) was wired directly into marketing APIs.
- Impact: Lead capture, outbound call logging, and website-audit email alerts fail silently or throw on production. `LeadCaptureCard` still shows success after `/api/demo-automation` fails (`src/components/LeadCaptureCard.tsx`).
- Fix approach: Replace `execFile` + GWS CLI with HTTP webhooks (n8n / Apps Script). Keep CLI only behind a local-only flag. Use `N8N_CALL_WEBHOOK_URL` pattern already in `src/app/api/trigger-call/route.ts`.

**Entire homepage is one client island:**
- Issue: `src/app/page.tsx` renders only `HomeClient`. Root layout sets `export const dynamic = 'force-dynamic'` because prerender of `_global-error` / `_not-found` crashes with motion/GSAP (`src/app/layout.tsx`).
- Files: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/global-error.tsx`, `src/components/HomeClient.tsx`
- Why: Mail-board GSAP, voice hero, and Motion share one tree.
- Impact: No static/ISR for a marketing site; larger JS payload; SEO/TTFB worse than a Server Component shell.
- Fix approach: Split static marketing sections to Server Components. Keep GSAP/voice in client islands. Remove `force-dynamic` once error boundaries no longer import Motion.

**Duplicate / unused hero and stamp surfaces:**
- Issue: `src/components/hero/Hero.tsx` (~310 lines) is only re-exported from `src/components/hero/index.ts` and is not imported by `HomeClient`. Live hero is `src/components/voice-agent/VoiceAgentHero.tsx`. Two `StampButton` implementations: `src/components/StampButton.tsx` and `src/components/brand/StampButton.tsx`.
- Why: Design-system ports stacked without deleting the previous hero.
- Impact: Dual animation/voice stacks; future edits land on the dead path.
- Fix approach: Delete or clearly mark `Hero.tsx` as prototype. Single StampButton SSOT.

**Public prototypes and binary clutter in the Next app:**
- Issue: Nested Vite apps under `public/hero/` and `public/voice-feature/` (own `package.json`, `server.ts`, Vite configs). Design kit HTML, zip, screenshots, and `public/export/` ship as static assets. Repo root also holds `audit-*.png`, `data/state_store.db/`, `in-memoria.db`.
- Files: `public/hero/`, `public/voice-feature/`, `public/export/`, `public/Good'AI Design System (1).zip`, `.gitignore`
- Why: Prototypes were dropped into `public/` so they are URL-reachable.
- Impact: Deploy size, accidental exposure of prototype servers and GEMINI key injection in Vite configs (`public/hero/vite.config.ts`, `public/voice-feature/vite.config.ts`).
- Fix approach: Move kits out of `public/`. Gitignore `data/`, `*.db`, audit PNGs. Do not commit nested `node_modules` lockfiles unless those apps are first-class.

**env.d.ts does not match runtime env:**
- Issue: `src/types/env.d.ts` lists `DATABASE_URL`, `AUTH_SECRET`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` — unused. Actual keys: `AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE`, `N8N_CALL_WEBHOOK_URL`, `NEXT_PUBLIC_GWS_SCRIPT_URL`.
- Impact: False confidence that DB/auth exist; missing types for real secrets.
- Fix approach: Align `src/types/env.d.ts` with routes; add `.env.example` with names only.

**Lead form success without confirmed delivery:**
- Issue: `LeadCaptureCard` uses `mode: 'no-cors'` to Apps Script (opaque response) then POSTs `/api/demo-automation`, then always `setIsSuccess(true)` even on catch.
- Files: `src/components/LeadCaptureCard.tsx`
- Impact: Visitors believe a callback is booked when nothing was stored.
- Fix approach: Server-side lead route with JSON CORS; only show success on HTTP 2xx.

## Known Bugs

**Mic stream not stopped in unused Hero:**
- Symptoms: If `Hero.tsx` is ever mounted, `getUserMedia` tracks stay live after the 6.2s timeout.
- Files: `src/components/hero/Hero.tsx` (`toggleRecording`)
- Trigger: Start recording; wait for timeout; mic indicator remains.
- Workaround: Live site uses `VoiceAgentHero`, which stops tracks in `stopListening`.
- Root cause: `Hero` never stores/stops the `MediaStream`.

**SSR/prerender crash workaround on error routes:**
- Symptoms: Next 16 isolated prerender of `/_global-error` hit `useContext` null with Motion/GSAP.
- Files: `src/app/layout.tsx` (`dynamic = 'force-dynamic'`), `src/app/global-error.tsx`
- Trigger: `next build` static generation of error pages.
- Workaround: Force dynamic + minimal `global-error` without Motion.
- Root cause: Client-heavy tree in error boundary static gen.

**Hero chat stream parsed as raw SSE text:**
- Symptoms: AI quote in unused `Hero` is garbled (`0:"` / `data:` strip).
- Files: `src/components/hero/Hero.tsx` (`handleInspireMe`, recording timeout)
- Trigger: `/api/chat` UIMessage stream consumed via `res.text()`.
- Workaround: `VoiceAgentHero` uses JSON `{ message }` generateText path.

**Website analyzer SSRF + JSON parse fallback:**
- Symptoms: Server fetches attacker-controlled URL; AI JSON parse failures silently substitute generic Perth copy.
- Files: `src/app/api/analyze-website/route.ts`
- Trigger: POST any `url`; internal IPs / huge HTML possible.
- Workaround: 4s timeout and 4000-char slice.
- Root cause: Unvalidated `fetch(targetUrl)` plus `JSON.parse` of model text.

## Security Considerations

**Unauthenticated lead/call/automation APIs (abuse + cost):**
- Risk: Anyone can POST `/api/chat`, `/api/tts`, `/api/demo-automation`, `/api/trigger-call`, `/api/analyze-website`. TTS and chat bill ElevenLabs / AI Gateway. `demo-automation` accepts client-supplied `n8nUrl` (SSRF). `trigger-call` forwards arbitrary `phone` to n8n. Analyzer fetches arbitrary URLs (SSRF).
- Files: `src/app/api/chat/route.ts`, `src/app/api/tts/route.ts`, `src/app/api/demo-automation/route.ts`, `src/app/api/trigger-call/route.ts`, `src/app/api/analyze-website/route.ts`, `src/components/AutomationPlayground.tsx`, `src/components/voice-agent/OutboundCallCard.tsx`
- Current mitigation: None (no `middleware.ts`, no rate limit, no auth, no origin check). `vercel.json` is `{ "framework": "nextjs" }` only.
- Recommendations: Rate-limit (Vercel WAF / Upstash). Drop client `n8nUrl`. Allowlist fetch hosts. Cap TTS text length. Phone E.164 validation. Disable playground on production or protect with a secret.

**Client-exposed Apps Script URL:**
- Risk: `NEXT_PUBLIC_GWS_SCRIPT_URL` is in the browser bundle (`src/components/LeadCaptureCard.tsx`). Anyone can POST fake leads. Apps Script `google-apps-script.js` has no shared secret.
- Current mitigation: Not detected (script is gitignored from deploy but URL is public if env is set).
- Recommendations: Server-only proxy; Apps Script token header.

**Vite GEMINI_API_KEY define in public prototypes:**
- Risk: `public/hero/vite.config.ts` and `public/voice-feature/vite.config.ts` inject `process.env.GEMINI_API_KEY` into client. If those apps are built/served, the key ships to the browser.
- Current mitigation: Separate from Next app; still in repo.
- Recommendations: Never define secrets in Vite `define`. Remove prototypes from `public/`.

**Command execution surface:**
- Risk: `execFile('node', [GWS_PATH, ...args])` with JSON from request fields interpolated into email/docs. Path is fixed, so not classic injection, but production should not spawn local CLI at all.
- Files: `src/app/api/demo-automation/route.ts`, `src/app/api/trigger-call/route.ts`, `src/app/api/analyze-website/route.ts`
- Recommendations: HTTP APIs only; never `execFile` in App Router on Vercel.

**Hardcoded personal phone in UI:**
- Risk: `OutboundCallCard` prefills Darl with `0877414191`.
- Files: `src/components/voice-agent/OutboundCallCard.tsx`
- Recommendations: Env/server config; do not ship PII in client.

## Performance Bottlenecks

**Client-only homepage + GSAP ScrollTrigger + canvas RAF:**
- Problem: `HomeClient` (~517 lines) registers ScrollTrigger on the mail board; `Visualizer` runs 60fps canvas (logical 1200×500, DPR cap 2); `VoiceAgentHero` adds Motion scroll transforms and writes `--hero-filing-progress` every scroll tick.
- Files: `src/components/HomeClient.tsx`, `src/components/hero/Visualizer.tsx`, `src/components/voice-agent/VoiceAgentHero.tsx`, `src/components/ScrollReveal.tsx`
- Measurement: Not measured in-repo (no Lighthouse CI). Dual GSAP plugin registration (`HomeClient` + `ScrollReveal`).
- Cause: All marketing sections hydrate as one `'use client'` tree; `force-dynamic` disables static HTML.
- Improvement path: Server-render copy; lazy-load Visualizer/voice; single GSAP register; pause RAF when offscreen (Visualizer already has IntersectionObserver — keep it).

**Heavy unused dependencies:**
- Problem: `three` / `@types/three` have no imports. `headroom-ai`, `present`, `scripts` unused in `src/`. `motion` + `gsap` both on homepage. Duplicate Fraunces: `next/font/local` in `src/app/layout.tsx` plus `public/fonts/Fraunces/` static TTFs and `public/fonts/DM_Sans/static/` (72 files).
- Files: `package.json`, `src/app/layout.tsx`, `public/fonts/`
- Improvement path: Remove unused packages; serve only variable fonts via `next/font`.

**TTS buffering:**
- Problem: `VoiceAgentHero.speakReply` waits for full `/api/tts` blob despite stream endpoint.
- Files: `src/components/voice-agent/VoiceAgentHero.tsx`, `src/app/api/tts/route.ts`
- Improvement path: Play MediaSource / audio element from the ReadableStream.

## Fragile Areas

**Mail-board GSAP timelines:**
- Files: `src/components/HomeClient.tsx` (`useGSAP` ~line 107+, `mailBoardRef`, ribbon refs, `gsap.globalTimeline.clear()`)
- Why fragile: ScrollTrigger scrub, CSS vars (`--tape-shear`, `--tape-flutter`), Motion `whileInView` on filed dockets, and VoiceAgentHero `--hero-filing-progress` all mutate the same visual system. `killAll` on reduced-motion can clear the global timeline.
- Common failures: Layout/class rename on `.pinned-notice` / ribbons breaks timelines; reduced-motion listener vs `useReducedMotion` diverge.
- Safe modification: Change copy/CSS tokens first; keep class names. Test with `prefers-reduced-motion`. Do not add a third animation library.
- Test coverage: None. Only `src/capture.spec.js` (screenshot helper to a local Gemini scratch path).

**VoiceAgentHero recording + TTS + chat:**
- Files: `src/components/voice-agent/VoiceAgentHero.tsx`, `src/lib/voice/supertonic.ts`
- Why fragile: Default ASR is `http://localhost:8000/transcribe` (also hardcoded in `src/components/marketing/VoiceAgentDemo.tsx`). Production visitors get failed transcribe then error UI. Chat uses `{ message }` generateText, not `useChat` stream.
- Common failures: Mixed-content (HTTPS page → HTTP localhost), CORS on Supertonic, ElevenLabs 502.
- Safe modification: Env-gate demo; feature-detect mic; keep `stopListening` track teardown.
- Test coverage: None.

**GWS `runGwsCommand` copy-paste:**
- Files: three API routes listed above
- Why fragile: Three copies of CLI wrapping; Sheets `create` on every lead (new spreadsheet per submit, not append to one board).
- Common failures: CLI not logged in; create-without-append; production ENOENT on `D:\`.
- Safe modification: Do not extend CLI; add webhook-only path.

## Scaling Limits

**Serverless + unbounded AI/TTS:**
- Current capacity: Vercel function `maxDuration = 60` on `src/app/api/chat/route.ts`. TTS streams ElevenLabs. Analyzer fetches + LLM (`maxOutputTokens` 500).
- Limit: No rate limit; Hobby/Pro timeouts and AI spend are the ceiling. Concurrent playground users each `spreadsheets.create`.
- Symptoms at limit: 502/503 from gateway; ElevenLabs quota; Vercel 429.
- Scaling path: Rate limits, token caps, disable playground in prod, queue n8n.

**Local-only integrations:**
- Current capacity: n8n defaults `http://localhost:5678/webhook/goodai-demo` and `goodai-call`; Supertonic localhost:8000; GWS CLI on one Windows machine.
- Limit: Zero production capacity for those paths.
- Symptoms at limit: Simulated/timeout logs (`results.n8nStatus = 'Simulated / Timed out'`).
- Scaling path: Hosted n8n + env URLs; hosted ASR; Apps Script/Sheets API.

## Dependencies at Risk

**`scripts` npm package (`^0.1.0`):**
- Risk: Unrelated/unmaintained package name collision; unused in source.
- Impact: Supply-chain noise; install confusion.
- Migration plan: Remove from `package.json`.

**`present` (`^1.0.0`) and `headroom-ai` (`^0.22.4`):**
- Risk: Unused in `src/`. `headroom-ai` is a local agent stack, not the marketing site.
- Impact: Extra install surface.
- Migration plan: Remove unless a feature actually imports them.

**`three` (`^0.183.2`):**
- Risk: Unused; large client dep if accidentally imported.
- Impact: Bundle size if wired into Visualizer later without code-splitting.
- Migration plan: Remove until a 3D surface exists.

**Next 16.2.3 + eslint-config-next 16.2.1 mismatch; React 19.2.4:**
- Risk: Patch skew; known prerender/error-boundary issue already documented in `src/app/layout.tsx`.
- Impact: Build workarounds (`force-dynamic`).
- Migration plan: Pin eslint-config-next to same minor; retest static generation after Motion/Next updates.

**Zod 4 + AI SDK 6:**
- Risk: Major lines; chat uses `convertToModelMessages` / `toUIMessageStreamResponse` (`src/app/api/chat/route.ts`) vs `{ message }` JSON (`VoiceAgentHero`). Two client protocols.
- Impact: Breaking AI SDK changes hit chat vs voice differently.
- Migration plan: One chat API contract; pin AI SDK with tests.

## Missing Critical Features

**Production lead pipeline:**
- Problem: Reliable lead store is Apps Script (optional public URL) plus local GWS CLI that will not run on Vercel.
- Current workaround: `no-cors` POST and optimistic UI.
- Blocks: Trustworthy “we'll call you” CTA on goodai.au.
- Implementation complexity: Medium — one authenticated server action → n8n/Sheets.

**Production voice demo:**
- Problem: ASR is localhost Supertonic; no hosted STT.
- Current workaround: Text chat fallback section in `HomeClient`.
- Blocks: Real in-browser voice on the live domain.
- Implementation complexity: Medium — Whisper/gateway STT route.

**Observability:**
- Problem: Errors are `console.error` only (`global-error.tsx`, API routes). No Sentry/analytics wiring despite `NEXT_PUBLIC_ENABLE_ANALYTICS` in `env.d.ts`.
- Blocks: Knowing if chat/TTS/leads fail in production.
- Implementation complexity: Low.

**Auth / bot protection on AI routes:**
- Problem: Open LLM and TTS.
- Blocks: Safe public demo without runaway cost.
- Implementation complexity: Low–medium (rate limit + captcha).

## Test Coverage Gaps

**No automated product tests:**
- What's not tested: All API routes, lead form, voice flow, GSAP mail board, ChatInterface, WebsiteAnalyzer.
- Files: `src/app/api/**`, `src/components/**`. Only `src/capture.spec.js` (Playwright screenshot to `C:\\Users\\kevin\\.gemini\\...`, not a regression suite). `package.json` has no `test` script. Playwright is a devDependency but unused for CI.
- Risk: API/security/regression breaks ship unnoticed.
- Priority: High for APIs; Medium for UI.
- Difficulty to test: APIs are straightforward with mocked fetch/`execFile`. GSAP/canvas need Playwright + reduced-motion.

**Chat / TTS / analyzer untested contracts:**
- What's not tested: Message shape (`messages` vs `message`), ElevenLabs error mapping, URL allowlisting.
- Files: `src/app/api/chat/route.ts`, `src/app/api/tts/route.ts`, `src/app/api/analyze-website/route.ts`
- Risk: Protocol drift between `ChatInterface` (`useChat` + `DefaultChatTransport`) and `VoiceAgentHero` (`{ message }`).
- Priority: High
- Difficulty to test: Mock AI SDK / fetch.

**Lead capture delivery:**
- What's not tested: Success path when GWS and Apps Script fail.
- Files: `src/components/LeadCaptureCard.tsx`
- Risk: False “Nice one” on production.
- Priority: High
- Difficulty to test: Component test with mocked fetch.

---

*Concerns audit: 2026-08-24*
*Update as issues are fixed or new ones discovered*
