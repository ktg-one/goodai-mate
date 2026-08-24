# Phase 1: New hero + Voice page - Context

**Gathered:** 2026-08-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors land on `/` into `src/components/hero/Hero.tsx` as the first surface. Voice Agent stays usable on a dedicated page (not the homepage hero). **This repo is the homepage: intro + demos only.** Blog/services (front and back) live on Instatic on Railway.

</domain>

<decisions>
## Implementation Decisions

### Site information architecture
- **D-01:** **This repo is the homepage.** Intro + product demos only (hero, voice, playgrounds). Not the full site.
- **D-02:** **Railway is the backend.** Project `BLOG` (`corebunch/instatic:latest`, `goodai.up.railway.app`) already running.
- **D-03:** **Instatic on Railway is front and back** for blog/services — it looks chic enough to be both. Do not build `/blog` or `/services` in this Next.js app.
- **D-04:** Phase 1 only swaps the homepage hero (`VoiceAgentHero` → `Hero`) and stands up a Voice Agent demo page. No CMS, no Railway deploy from this repo.

### Hero
- **D-05:** Homepage first surface is `src/components/hero/Hero.tsx` (already in tree; currently unmounted).
- **D-06:** `VoiceAgentHero` is not the homepage hero. Keep it if already configured; mount it on a dedicated page (e.g. `/voice`) as a **demo**, not as the blog/CMS.

### the agent's Discretion
- Exact Voice Agent path (`/voice` vs `/talk` vs other) — `/voice` is the roadmap example, not locked.
- How much of the mail-board GSAP below the hero stays in Phase 1 (Phase 2 restyles remaining homepage sections; HOME-02 dropping GSAP is future).

</decisions>

<specifics>
## Specific Ideas

- User is already building the hero in `src/components/hero/`.
- Railway `BLOG` / Instatic is live at `https://goodai.up.railway.app` — Instatic homepage slug `index` plus posts template, brand-guide pages, Site Shell. That surface is **not** this Next.js app.
- This repo stays intro + demos. Instatic can carry both the blog/services front and the CMS back.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope
- `.planning/ROADMAP.md` — Phase 1 goal, HERO-01 / VOICE-01, success criteria
- `.planning/REQUIREMENTS.md` — HERO-01, VOICE-01; blog/CMS out of scope
- `.planning/PROJECT.md` — v2.0 Current Milestone

### Live code
- `src/components/HomeClient.tsx` — still mounts `VoiceAgentHero` as the homepage hero
- `src/components/hero/Hero.tsx` — new hero (unmounted)
- `src/components/voice-agent/VoiceAgentHero.tsx` — existing voice product

### Other surfaces
- Railway project `BLOG` — Instatic `ghcr.io/corebunch/instatic:latest`, domain `https://goodai.up.railway.app`

### Design kit (Phase 2 SSOT; do not restyle the whole page in Phase 1)
- `public/colors_and_type.css` — kit tokens (cream `#FFF0D0`) — **not** what `/` currently uses
- `src/app/tokens/colors.css` — live palette (19-08-2026 navy/coral/teal/silver remap)
- `public/SKILL.md` — craft brief

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Hero` + `Visualizer` in `src/components/hero/` — mount `Hero` on `/`; `Visualizer` is already used by `VoiceAgentHero`
- `VoiceAgentHero` — move to a dedicated App Router page; keep Supertonic wiring

### Established Patterns
- App Router: `src/app/page.tsx` → `HomeClient` (client island). New pages go under `src/app/<route>/page.tsx`
- Direct imports only (no barrels for new wiring)

### Integration Points
- Replace `<VoiceAgentHero … />` at the top of `HomeClient` with `<Hero />`
- Add `src/app/voice/page.tsx` (or chosen slug) that renders `VoiceAgentHero`
- Do **not** add `/blog` or `/services` in this phase

</code_context>

<deferred>
## Deferred Ideas

- **Instatic on Railway** (blog/services front + back) — not Phase 1, not this Next.js app. Already deployed; later work is linking/nav from this homepage, not rebuilding it here.
- **DS-01 / HOME-01** — Phase 2 (live tokens + restyle sections below the hero).
- **HOME-02** — mail-board GSAP can come off `/` (future).
- Align `public/` cream kit vs live `src/app/tokens/colors.css` palette — Phase 2, not Phase 1.

</deferred>

---
*Phase: 01-new-hero-voice-page*
*Context gathered: 2026-08-24*
