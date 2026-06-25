# Requirements: Good'ai (current — v1.1 lead-gen + automation)

**Last validated:** 2026-06-16 (re-read against `src/`)
**Note:** Original v1 phase requirements (shader, old lead capture, cursor) are superseded — see `.planning/milestones/v0.9-pre-refactor-phases/`. PRODUCT.md holds the full brand/product spec.

## Shipped & verified in code

### Voice + mail-docket experience (v1)
- Voice Agent hero is the product demo (Supertonic local ASR for dev; transcript + response capture; `onMailFiled` leaks state into the in-tray).
- Mail-board flow: ribbons (perforated tape shear + flutter via GSAP), non-uniform pinned Docket Flow (rot/offset/wear, participating stamp shadows), sticky in-tray (last-3 dockets), heavy pinned footer clack ritual.
- One red accent max per surface; exactly one Fraunces WONK phrase per major block.
- Reduced-motion: fully static, all physical artifacts (stamps, pins, rots, perforations) preserved.

### Lead-gen + automation (v1.1)
- Website Analyzer: scrape URL → AI Gateway audit → auto-extract business email → email audit via GWS CLI.
- Outbound callback widget: Darl / Robokev personas, number prefill (`/api/trigger-call`).
- n8n + GWS lead-automation pipeline (`/api/demo-automation`, LeadCaptureCard, AutomationPlayground).
- Chat via AI Gateway + text fallback (`/api/chat`) supporting dynamic model backends (Gemini, Groq, Claude) and custom agents (Darl/Robokev); TTS via ElevenLabs (`/api/tts`) with interchangeable voices and custom voice IDs.

### Engineering
- Next.js 16 / React 19 / Tailwind v4; GSAP/ScrollTrigger + motion/react hybrid; direct imports (no barrels).
- 60fps hot paths (refs + transform/opacity/filter only); hard 90–160ms stamp clacks.
- Brand voice: "we", short sentences, practical/warm/direct, zero hype/AI jargon.

## Open requirements / gaps (from 2026-06-16 validation)

- [ ] **[prod blocker]** GWS CLI path hardcoded to `D:\packages\…\@googleworkspace\cli\run.js` in `api/analyze-website`, `api/trigger-call`, `api/demo-automation` — must be env-driven or hosted before any non-local deploy. *(User fixing now.)*
- [x] **[prod blocker]** n8n webhook defaults to `http://localhost:5678/webhook/goodai-call` in `api/trigger-call` — set `N8N_CALL_WEBHOOK_URL` to a hosted n8n or the outbound-call widget fails in prod.
- [x] Production ASR endpoint (replace `localhost:8000` Supertonic dev path — present in 4 files: `HomeClient`, `VoiceAgentHero`, `VoiceAgentDemo`, `lib/voice/supertonic.ts`).
- [ ] Canonical design SSOT — `public/design-system-new/` flattened to `public/` root (2026-06-10); **11** source files still cite the removed subpath in comments. Declare `public/` root + PRODUCT.md canonical and fix the stale references.
- [ ] Commit in-flight changes (remove `public/voice-feature/*`, `globals.css` + `HomeClient.tsx` edits, new `public/assets/` audit images).
- [ ] Lighthouse / perf / a11y on the GSAP-heavy flow + new sections.
- [ ] Additional pages/sections in the same brutalist language.

## Required environment

| Var | Used by |
|-----|---------|
| `AI_GATEWAY_API_KEY` | chat + website-analyzer audit |
| `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE` | TTS |
| `NEXT_PUBLIC_GWS_SCRIPT_URL` | lead capture (`LeadCaptureCard`) |
| `N8N_CALL_WEBHOOK_URL` | trigger-call (defaults to `localhost:5678` — must be hosted for prod) |

## Verification (gsd-verify-work / manual)

- Open `/`, speak or type a problem → hero captures → filed docket appears in sticky in-tray.
- Scroll: ribbons advance with shear/flutter, Docket Flow cards pin with individual variance, footer pins + clacks (wonk + red lock).
- Website Analyzer: submit a URL → audit returns → business email extracted → audit dispatched.
- Outbound widget: select Darl/Robokev, enter number → call triggered.
- Reduced motion (OS/devtools): everything static, all physical artifacts present and legible.
- Brand: verify one-red, single WONK per surface, copy tone vs PRODUCT.md.
- Local backends reachable: AI Gateway key set, Supertonic on `:8000`, GWS CLI present at its path (local only — see prod blocker).

---

*Old detailed v1 reqs archived with the phases. v1 + v1.1 features shipped outside the original phase plan; future work should be captured via gsd-plan-phase.*
