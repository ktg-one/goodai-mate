<<<<<<< HEAD
# Requirements: Good'ai (current post-refactor)

**Defined / last aligned:** 2026-06-04 (after gsd-health + docs update)
**Note:** Original v1 requirements (shader, old lead capture, cursor etc.) were for the pre-refactor site. See .planning/milestones/v0.9-pre-refactor-phases/ for the archived detailed reqs (FOUND-*, SHDR-*, CHAT-*, LEAD-*, RESP-*, DEPL-*). They are superseded.

## Current Core (Voice + Brutalist Mail Docket v1 — shipped)

See PRODUCT.md for full brand/product spec. This is the minimal executable set that the award-refactored site delivers.

- Voice Agent hero is the product demo and primary experience (local Supertonic for dev, real transcript + response capture).
- Conversation state "files" as physical mail into in-tray and drives the narrative sections (Docket Flow).
- Full mechanical brutalist mail aesthetic: ribbons (perforated tape shear + flutter via GSAP), non-uniform pinned dockets (rot/offset/wear, stamp shadows participate), heavy footer clack ritual.
- One red accent maximum per surface. Exactly one Fraunces WONK emphasis phrase per major block.
- Reduced-motion fully static but still sells the 1978 docket board (all stamps, pins, rots, perforations, imprints visible).
- PRODUCT.md + public/ (and good-ai-design-final.html) are the single source of truth — every creative change must be injected with them.
- Agent skills: goodai-agent-team + goodai-award-configuration (the 5: impeccable, awwwards-animations, awwwards-ui-skills, gsap-awwwards-website, gsap-framer-scroll-animation) + gsd-* (health, docs-update, progress, plan-phase...) now locally present in .agents/skills and .claude/skills.
- Direct imports, no barrels. 60fps (refs + transform/opacity/filter only). Hard 90-160ms stamp clacks. No floaty easings.
- Brand voice: "we", short sentences, practical/warm/direct, "we'll sort the boring stuff", zero hype/AI jargon.
- Footer + contact: minimal, real human handoff path.

## Ongoing / Gaps

- Prod voice endpoint + Supertonic tuning / latency.
- Real lead intake from voice convos (context + contact form/mailto).
- Additional pages/sections in exact same brutalist language.
- Lighthouse / perf / a11y on the GSAP heavy flow.
- gsd hygiene loop (this pass + future /gsd-health before ship).

## Verification (use with gsd-verify-work or manual)

- Open / , speak (or type) a problem → hero captures → filed mail appears in tray.
- Scroll: ribbons advance with shear/flutter, dockets pin with individual variance, footer clacks and pins.
- Reduced motion (OS or devtools): everything static, all physical artifacts (stamps, tape, pins, rots) still present and legible.
- Brand: check one-red, WONK usage, copy tone against PRODUCT.md.
- Skills present: ls .agents/skills/gsd-health .claude/skills/gsd-health (and siblings).

---

*Old detailed 175-line v1 reqs archived with the phases. Current site was delivered outside the original phase plan via the award configuration swarm. Future work captured with gsd-plan-phase after award runs.*
=======
# Requirements: Good'ai (current — v1.1 lead-gen + automation)

**Last validated:** 2026-06-24 (re-read against `src/` + git)
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

## Open requirements / gaps (from 2026-06-24 validation)

- [x] **[prod blocker — DONE `7c47a55`]** GWS CLI path de-hardcoded — env-driven via `GWS_CLI_PATH` + node_modules fallback across the 3 routes; 0 `D:\packages` refs remain.
- [x] **[prod blocker — DONE `7c47a55`]** n8n trigger-call webhook reads `N8N_CALL_WEBHOOK_URL`, no localhost default (throws/mocks if unset).
- [x] **[DONE `7c47a55`]** ASR endpoint reads `NEXT_PUBLIC_ASR_URL`; localhost:8000 only as dev fallback/comment.
- [x] **[DONE `3b92089`]** Canonical design SSOT — `public/design-system-new/` comment refs cleared (0 in src/); canonical = `public/` root + PRODUCT.md.
- [x] **[DONE 2026-06-17]** In-flight changes committed (Vite `public/voice-feature/*` removal, `globals.css` + `HomeClient.tsx` edits, new `public/assets/` audit images); working tree clean.
- [ ] **[deploy gate]** Set required env vars in Vercel + host ASR/n8n (see LAUNCH.md).
- [ ] **[P1]** `api/demo-automation:254` demo webhook still defaults to `localhost:5678` — make env-driven.
- [ ] Lighthouse / perf / a11y on the GSAP-heavy flow + new sections.
- [ ] Additional pages/sections in the same brutalist language.

## Required environment

| Var | Used by |
|-----|---------|
| `AI_GATEWAY_API_KEY` | chat + website-analyzer audit |
| `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE` | TTS |
| `NEXT_PUBLIC_GWS_SCRIPT_URL` | lead capture (`LeadCaptureCard`) |
| `N8N_CALL_WEBHOOK_URL` | trigger-call (env-driven, no localhost default; set to hosted n8n for prod) |
| `GWS_CLI_PATH` | the 3 GWS routes (falls back to node_modules / dev path) |
| `NEXT_PUBLIC_ASR_URL` | Voice Agent transcription endpoint |

## Verification (gsd-verify-work / manual)

- Open `/`, speak or type a problem → hero captures → filed docket appears in sticky in-tray.
- Scroll: ribbons advance with shear/flutter, Docket Flow cards pin with individual variance, footer pins + clacks (wonk + red lock).
- Website Analyzer: submit a URL → audit returns → business email extracted → audit dispatched.
- Outbound widget: select Darl/Robokev, enter number → call triggered.
- Reduced motion (OS/devtools): everything static, all physical artifacts present and legible.
- Brand: verify one-red, single WONK per surface, copy tone vs PRODUCT.md.
- Backends reachable: AI Gateway key set; ASR via `NEXT_PUBLIC_ASR_URL` (Supertonic `:8000` in dev); GWS CLI resolvable via `GWS_CLI_PATH` / node_modules; n8n via `N8N_CALL_WEBHOOK_URL`.

---

*Old detailed v1 reqs archived with the phases. v1 + v1.1 features shipped outside the original phase plan; future work should be captured via gsd-plan-phase.*
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
