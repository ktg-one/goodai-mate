## GSD end-to-end plan — Good'ai (GOO-34)

Steward scope: planning + issue recommendations only (no code shipped). I read `.planning/STATE.md`, `ROADMAP.md`, `PROJECT.md`, `REQUIREMENTS.md`, `codebase/CONCERNS.md`, and verified against the live `src/` tree before drafting this.

### Snapshot + key finding

**The planning docs are stale.** STATE/ROADMAP/PROJECT/REQUIREMENTS were last aligned **2026-06-04** and describe a v1 = "VoiceAgentHero + GSAP mail-board" with the Supertonic ASR hero as the whole story. The live code has moved well past that in the last ~11 days:

- **5 API routes now exist** that no doc mentions: `chat`, `analyze-website`, `tts`, `trigger-call`, `demo-automation`.
- Component tree grew: `voice-agent/`, `hero/`, `marketing/`, `brand/`, `AutomationPlayground`, `LeadCaptureCard`.
- Recent commits added: website analyzer widget, audit-email dispatch, business-email auto-extract, dialer personas (Darl + Robokev) with number prefill, design-system consolidation.
- `codebase/CONCERNS.md` is dated **2026-05-25 (pre-refactor)** — several items (zero-byte `ChatInterface`, old `HeroSection` blobs, missing fonts) need re-verification against current reality before they're treated as live.

So an honest "end-to-end plan" has to **re-baseline the docs first**, then sequence the open work. Below is a GSD-shaped milestone (`v1.1 — Voice-to-Lead, Production`) with verifiable success criteria per phase, mapped to ready-to-spin-up issues.

### Env keys in use (none documented in `.env.example` per CONCERNS) — confirmed in code

- `AI_GATEWAY_API_KEY` — `chat`, `analyze-website`
- `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE` — `tts`
- `N8N_CALL_WEBHOOK_URL` — `trigger-call`

---

### Proposed milestone: `v1.1 — Voice-to-Lead, Production`

Goal: take the shipped brutalist voice/mail site from "demo that works locally" to "production lead engine on goodai.au", and stop the doc drift from recurring.

Phases are **serial by dependency** — Phase 0 is `todo` (start now), the rest open as `backlog` and get promoted in turn. Granularity: standard (matches `.planning/config.json`).

**Phase 0 — Re-baseline the planning SSOT** *(blocks everything; do first)*
- Goal: docs describe the *actual* shipped site (5 routes, dialer, analyzer, tts, marketing widgets).
- Success criteria: STATE/ROADMAP/PROJECT/REQUIREMENTS regenerated and verified against `src/`; CONCERNS.md re-mapped against current code (stale pre-refactor items resolved or re-confirmed); no doc claim contradicts the tree.
- Verify: `/gsd-docs-update --force` then `/gsd-health` clean; `/gsd-map-codebase` re-run for CONCERNS.
- Suggested issue: **"Re-baseline .planning SSOT to current shipped site"** — `todo`.

**Phase 1 — Config & env hardening**
- Goal: every runtime key is documented and fails loud, not silently at request time.
- Success criteria: `.env.example` documents `AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE`, `N8N_CALL_WEBHOOK_URL`; missing-key paths return clear setup errors (chat route's non-null assertion replaced); `next build` + `eslint .` pass clean.
- Verify: build/lint green; manual missing-key smoke returns a readable error.
- Suggested issue: **"Document + guard all API env keys"** — `backlog`.

**Phase 2 — Production voice + dialer path**
- Goal: voice/TTS/dialer run on prod endpoints with acceptable latency, not local-only.
- Success criteria: prod ASR/TTS endpoint wired (Supertonic/ElevenLabs) with target latency budget defined + measured; `trigger-call` webhook hardened (input validation, error surfacing, no leaked secrets); Darl/Robokev personas verified end-to-end.
- Verify: live transcript→spoken-reply round trip under target latency; a real test call fires through the n8n webhook.
- Suggested issue: **"Productionize voice + dialer (latency, webhook hardening)"** — `backlog`.

**Phase 3 — Lead capture end-to-end**
- Goal: a conversation reliably becomes a delivered, deduplicated lead with context.
- Success criteria: analyzer → email dispatch → intake carries conversation/transcript context; `LeadCaptureCard` no longer shows success on failure (inspect response body); server-side capture path + spam protection + persistence (or a deliberate decision against each, recorded).
- Verify: submit a bad payload → user sees real failure, not false success; a good lead lands with full context.
- Suggested issue: **"Reliable lead capture w/ context + spam/persistence"** — `backlog`.

**Phase 4 — Additional surfaces (services / about / case studies)**
- Goal: extend beyond the single page in the exact brutalist mail language.
- Success criteria: new surfaces use PRODUCT.md + public/ SSOT; one-red-per-surface, single WONK phrase, reduced-motion artifacts preserved on each.
- Verify: `/gsd-ui-review` 6-pillar pass against PRODUCT.md per surface.
- Suggested issue: **"Add services/about/case-study surfaces (brutalist)"** — `backlog`.

**Phase 5 — Perf / a11y / reduced-motion audit**
- Goal: the GSAP-heavy flow is fast and accessible.
- Success criteria: Lighthouse perf/a11y targets met; 60fps on hot paths (refs + transform/opacity/filter only); reduced-motion loses no docket artifact.
- Verify: Lighthouse run recorded; reduced-motion toggle audited; frame profiling on scroll.
- Suggested issue: **"Perf + a11y + reduced-motion audit"** — `backlog`.

**Phase 6 — Production deploy + analytics + smoke**
- Goal: goodai.au live with monitoring and a regression smoke test.
- Success criteria: domain + Vercel deploy green; analytics wired; Playwright smoke covers hero→voice→filed-mail and a lead submission.
- Verify: prod URL up; analytics events fire; smoke passes in CI.
- Suggested issue: **"Deploy goodai.au + analytics + Playwright smoke"** — `backlog`.

---

### How to execute (GSD-native, when you're ready to build)

1. Promote Phase 0 → run `/gsd-new-milestone "v1.1 Voice-to-Lead"` (rewrites PROJECT/REQUIREMENTS/ROADMAP/STATE) or just `/gsd-docs-update --force` if you only want the re-baseline.
2. Per phase: `/gsd-plan-phase N` (research → plan → verify) then `/gsd-execute-phase N`.
3. Inject PRODUCT.md + public/ design SSOT into every creative run (brand guardrail).

### Recommendations for you (ktg)

- I can spin these phases up as sub-issues of GOO-34 (Phase 0 `todo`, rest `backlog`) on your say-so — I held off because my steward scope is "recommend, not act."
- **Sequencing call**: Phase 0 genuinely blocks the rest — planning on stale docs would re-plan a site that no longer matches code. Worth doing even if you skip the formal milestone.

Want me to create the sub-issues, or adjust scope/ordering first?
