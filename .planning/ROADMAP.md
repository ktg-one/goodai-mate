# Roadmap: Good'ai

## Overview

v2.0 takes the shipped Voice + mail-board site and changes what a Perth tradie hits first. Today `HomeClient` still mounts `VoiceAgentHero` as the homepage hero. This milestone ships `src/components/hero/Hero.tsx` as that first surface, moves the Voice Agent onto a dedicated page so it stays a real product, and makes `public/` (`colors_and_type.css`, cream `#FFF0D0`, navy / gold / red / black, Fraunces + DM Sans) the live design language — including the rest of `/` below the hero.

`public/` already has the design system on disk. This is not a greenfield setup. Do not rewrite the Voice Agent. Do not revive the old shader / cursor / shadcn lead-card v1.

## Milestones

- ✅ **v1.0 Voice + mail-board** — shipped (award-refactored; pre-refactor phases archived)
- 🚧 **v2.0 Design system + hero** — Phases 1–2 (this roadmap; numbering reset)

## Phases

**Phase Numbering:**
- Integer phases (1, 2): Planned milestone work
- Decimal phases (1.1, 1.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: New hero + Voice page** - Visitors land on `Hero.tsx`; Voice Agent lives on a dedicated page
- [ ] **Phase 2: Design system on the homepage** - Live homepage uses `public/` tokens, including below the hero

## Phase Details

### Phase 1: New hero + Voice page
**Goal**: Visitors land on `/` into the new hero; the Voice Agent is still usable on its own page
**Depends on**: Nothing (first phase)
**Requirements**: HERO-01, VOICE-01
**Success Criteria** (what must be TRUE):
  1. Visitor opening `/` sees `src/components/hero/Hero.tsx` as the first surface
  2. Visitor does not see `VoiceAgentHero` as the homepage hero
  3. Visitor can open a dedicated Voice Agent page (e.g. `/voice`) and use the Voice Agent there
**Plans**: TBD
**UI hint**: yes

### Phase 2: Design system on the homepage
**Goal**: Visitors see the live homepage in the `public/` design system, including below the hero
**Depends on**: Phase 1
**Requirements**: DS-01, HOME-01
**Success Criteria** (what must be TRUE):
  1. Visitor sees cream `#FFF0D0` as the paper canvas, with navy `#202C59`, gold `#F3A62A`, red `#F4442E`, and black `#111111` as the live palette
  2. Visitor sees Fraunces (display) and DM Sans (body) as live type on the homepage
  3. Visitor scrolling past the hero sees remaining homepage sections styled with the same `public/` system
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. New hero + Voice page | 0/TBD | Not started | - |
| 2. Design system on the homepage | 0/TBD | Not started | - |

<details>
<summary>✅ v1.0 Voice + mail-board (shipped; not in this numbering)</summary>

The shipped v1 is the award-refactored Voice Agent hero + mail-board site. Pre-refactor phases 01–05 live in `.planning/milestones/v0.9-pre-refactor-phases/` and are not authoritative. v2.0 resets numbering at Phase 1 (`--reset-phase-numbers`).

</details>

---
*Roadmap created: 2026-08-24 — milestone v2.0 Design system + hero*
*Granularity: standard (4 requirements → 2 delivery boundaries; no padded phases)*
*Research: skipped for v2.0; existing `.planning/research/` is v0.9 shader-era and is not a mandate*
