# Requirements: Good'ai — v2.0 Design system + hero

**Defined:** 2026-08-24
**Core Value:** Give small business owners their time back. The new homepage hero + `public/` design system must make a Perth tradie want to drop a line. Voice stays a real product surface — on its own page.

## Milestone v2.0 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Hero

- [ ] **HERO-01**: Visitor landing on `/` sees `src/components/hero/Hero.tsx` as the first surface, not `VoiceAgentHero`

### Design system

- [ ] **DS-01**: Visitor sees live UI driven by `public/` tokens (`public/colors_and_type.css` — cream `#FFF0D0`, navy, gold, red, black; Fraunces + DM Sans)

### Voice

- [ ] **VOICE-01**: Visitor can use the Voice Agent on a dedicated page (e.g. `/voice`); it is not the homepage hero

### Homepage

- [ ] **HOME-01**: Visitor scrolling past the hero sees remaining homepage sections styled with the `public/` design system

## Future Requirements

Deferred. Tracked but not in this milestone's roadmap.

### Hero

- **HERO-02**: Hero matches `public/` tokens and type (stamp shadows, sharp corners, SKILL.md craft)
- **HERO-03**: Hero remains readable with reduced motion (static fallback)

### Design system

- **DS-02**: PRODUCT.md rewritten to match `public/`, not the v1 mail-board-as-hero brief
- **DS-03**: Agents building UI read `public/SKILL.md` as the craft brief

### Voice

- **VOICE-02**: Existing Voice Agent wiring preserved (Supertonic / local transcribe path; no rewrite of the agent)
- **VOICE-03**: Homepage does not file mail from voice (`onMailFiled` / docket leak is not the homepage story)

### Homepage

- **HOME-02**: Mail-board GSAP (ribbons, pins, tray) can come off `/`
- **HOME-03**: Visitor can still reach contact (mailto or form)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Rewrite the Voice Agent itself | Keep existing config; only move it off `/` |
| Wipe `.planning/PROJECT.md` via `$gsd-new-project` | Brownfield: v2 updates PROJECT.md, does not delete history |
| Auth / dashboards / multi-page app chrome | Still not the product |
| Old shader + custom cursor + shadcn lead-card v1 | Superseded in v1-refactored; stays dead |
| Next.js blog / services CMS in this repo | This app is intro + demos. Blog/services front and back: Instatic on Railway (`goodai.up.railway.app`) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 1 | Pending |
| DS-01 | Phase 2 | Pending |
| VOICE-01 | Phase 1 | Pending |
| HOME-01 | Phase 2 | Pending |

**Coverage:**
- v2.0 requirements: 4 total
- Mapped to phases: 4
- Unmapped: 0

---
*Requirements defined: 2026-08-24*
*Last updated: 2026-08-24 after v2.0 roadmap (traceability)*
