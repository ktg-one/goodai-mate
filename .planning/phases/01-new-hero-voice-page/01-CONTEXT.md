# Phase 1: New hero + Voice page - Context

**Gathered:** 2026-08-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors land on `/` into `src/components/hero/Hero.tsx` as the first surface. Voice Agent stays usable on a dedicated page (not the homepage hero). This Next.js app is the **homepage / marketing landing** — one section of the Good'ai site — not the blog or services area.

</domain>

<decisions>
## Implementation Decisions

### Site information architecture
- **D-01:** This repo's homepage is a **section** of the overall Good'ai site (marketing landing), not the whole product surface.
- **D-02:** Blog and services content **do not** get built as Next.js routes in this repo. Fallback: **Instatic CMS on Railway** for the services/blog area.
- **D-03:** Phase 1 only swaps the homepage **hero section** (`VoiceAgentHero` → `Hero`) and stands up a Voice Agent page. Do not invent a blog, CMS client, or services index here.

### Hero
- **D-04:** Homepage first surface is `src/components/hero/Hero.tsx` (already in tree; currently unmounted).
- **D-05:** `VoiceAgentHero` is not the homepage hero. Keep it if already configured; mount it on a dedicated page (e.g. `/voice`).

### the agent's Discretion
- Exact Voice Agent path (`/voice` vs `/talk` vs other) — `/voice` is the roadmap example, not locked.
- How much of the mail-board GSAP below the hero stays in Phase 1 (Phase 2 restyles remaining homepage sections; HOME-02 dropping GSAP is future).

</decisions>

<specifics>
## Specific Ideas

- User is already building the hero in `src/components/hero/`.
- Instatic is available as an MCP in this session; Railway hosts the CMS fallback. No Instatic/Railway/blog code exists in this repo today (`src/app/` is `/` + API routes only).

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

- **Instatic CMS on Railway** for services/blog — not Phase 1, not this Next.js app. Capture as a later surface / ops task, not a homepage plan.
- **DS-01 / HOME-01** — Phase 2 (live tokens + restyle sections below the hero).
- **HOME-02** — mail-board GSAP can come off `/` (future).
- Align `public/` cream kit vs live `src/app/tokens/colors.css` palette — Phase 2, not Phase 1.

</deferred>

---
*Phase: 01-new-hero-voice-page*
*Context gathered: 2026-08-24*
