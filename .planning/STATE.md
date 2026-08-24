---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Design system + hero
status: planning
last_updated: "2026-08-24T00:23:46.934Z"
last_activity: 2026-08-24
progress:
  total_phases: 2
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-24)

**Core value:** Give small business owners their time back. The new homepage hero + `public/` design system must make a Perth tradie want to drop a line. Voice stays a real product surface — on its own page.

**Current focus:** Phase 1 — New hero + Voice page (ready to plan)

## Current Position

Phase: 1 of 2 (New hero + Voice page)
Plan: —
Status: Ready to plan
Last activity: 2026-08-24 — v2.0 roadmap written (phases reset to 1)

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Post-refactor hygiene pass (2026-06-04):**

- gsd-health: healthy (only pre-archive I001 infos on missing SUMMARYs for old plans; now resolved by archive).
- Old phases (01-foundation through 05-*) moved to .planning/milestones/v0.9-pre-refactor-phases/.
- PROJECT.md, ROADMAP.md, STATE.md, docs/agents/* rewritten for actual shipped site + current skill usage.
- skills added: gsd-health + core gsd family (docs-update, progress, manager, do, help, next, plan-phase, verify-work, cleanup, stats, audit-milestone, discuss/execute/explore, ingest, import).

**Velocity:**
- Total plans completed: 0 (v2.0)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. New hero + Voice page | 0 | TBD | — |
| 2. Design system on the homepage | 0 | TBD | — |

## Accumulated Context

### Decisions (key recent)

- Archive pre-refactor planning (superseded by award-refactored Voice + docket site).
- Add gsd-health (and supporting gsd skills) from global .claude/.agents into project-local copies so /gsd-* commands and GSD synthesis for future award runs are always available in context.
- Treat goodai-award-configuration + goodai-agent-team as first-class for any further high-craft updates (inject full PRODUCT.md + public/ design system + live state + mechanical rules).
- Keep .planning/ and docs/ accurate via gsd-docs-update / gsd-health loops rather than letting them drift again.
- v2.0: `public/` is the live design SSOT; homepage hero is `src/components/hero/Hero.tsx`; Voice Agent moves to a dedicated page. Phase numbers reset to 1.
- v2.0 roadmap: Phase 1 = new hero + voice page (HERO-01, VOICE-01); Phase 2 = public/ tokens + remaining homepage (DS-01, HOME-01).

### Pending Todos

None yet.

### Blockers/Concerns

- None critical. Health clean. Docs now match reality.
- `HomeClient` still mounts `VoiceAgentHero` as the `/` hero; `src/components/hero/` is in progress.
- Marketing `VoiceAgentDemo` also embeds `VoiceAgentHero` — HERO-01 is first-surface only; do not treat that section as in-scope unless it blocks the swap.
- Future: when doing new surfaces or voice prod work, re-run full award config + optional gsd planner agent, then gsd-plan-phase to capture as proper phase.

## Deferred Items

See `.planning/REQUIREMENTS.md` Future Requirements (HERO-02/03, DS-02/03, VOICE-02/03, HOME-02/03). Not in this milestone's phases.

## Session Continuity

Last session: 2026-08-24
Stopped at: v2.0 ROADMAP.md written; Phase 1 ready to plan
Resume file: None

*Run `gsd health` or `gsd progress` at start of any session.*
