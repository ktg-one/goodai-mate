# Roadmap: Good'ai (refactored)

## Overview

Good'ai site v1 was originally planned as 5 incremental phases (shader foundation → visual → chat → lead capture → deploy). After Phase 1 foundation, the site was **fully refactored** into its current form: a brutalist direct-mail marketing experience whose hero **is** the functional Voice Agent product (local Supertonic), with conversation state leaking as physical "filed mail" into ribbons, pinned dockets, and tray. The redesign was executed via the goodai-award-configuration (5 specialized agents: impeccable + awwwards-animations + awwwards-ui-skills + gsap-awwwards-website + gsap-framer-scroll-animation) coordinated by goodai-agent-team.

Pre-refactor phases (01-05) have been archived to `.planning/milestones/v0.9-pre-refactor-phases/`.

Ongoing work uses gsd-* skills (now added locally: gsd-health, gsd-docs-update, gsd-progress, gsd-manager, gsd-do, gsd-plan-phase, etc.) + goodai skills for brand-compliant updates.

## Current State (post-refactor)

- **Delivered**: Voice Agent hero + full mail-board brutalist flow (ribbons, docket pins, in-tray, footer ritual). 60fps mechanical stamp physics, one-red discipline, WONK, reduced-motion static artifacts, PRODUCT.md + public/ design system as SSOT.
- **Skills**: Local copies in .agents/skills/ and .claude/skills/ (goodai-*, gsd-*, gsap/awwwards/impeccable design skills, next best practices).
- **Planning hygiene**: gsd-health now available in-project; docs/ + .planning/ aligned to actual shipped site (this milestone).

## Phases (historical + current)

**Pre-refactor (archived)**:
- Phase 1: Foundation (GLSL, tokens, fonts) — completed 2026-04-01, code artifacts may remain or have been adapted.
- Phases 2-5: Visual Layer / Chat Core / Lead Capture / Polish — described old SDF shader + cursor + old lead card flow. Superseded by the award-refactored mail-docket site. Archived.

**Current / Live**:
The "v1" that shipped is the refactored Voice + physical docket site. No numbered phases currently active in .planning/phases/ (empty after archive + hygiene pass).

Future increments (voice prod, additional surfaces, ops handoff, full gsd milestone) will be planned with gsd-new-milestone / gsd-plan-phase using the goodai brand guardrails.

## Phase Details (Pre-refactor — for reference only)

See `.planning/milestones/v0.9-pre-refactor-phases/` for the old 01-01 through 05-02 PLAN.md files. They are no longer authoritative.

## Progress & Hygiene

- Old planning reported ~11% (only phase 1 complete).
- Post archive + gsd-health + docs update: .planning/phases/ is clean; PROJECT.md / ROADMAP.md / STATE.md now describe the actual refactored site and skill usage.
- Use `/gsd-health`, `/gsd-progress`, `/gsd-docs-update --verify-only` (or --force) going forward to keep docs in sync.
- Use goodai-award-configuration + goodai-agent-team when doing further high-craft brutalist work.

## Next Actions (typical)

- Run `gsd health` or `gsd progress` to get current snapshot + routing.
- For new work: gsd-discuss-phase / gsd-plan-phase (inject PRODUCT.md + public/ design system + current live state + mechanical rules).
- For craft upgrades: dispatch via goodai-award-configuration (optionally + planning agent).

---

*Updated 2026-06-04 after adding gsd skills (incl. gsd-health) from .claude/.agents and running gsd-health alignment on the refactored site.*
*Pre-refactor phases archived. Current site = award swarm brutalist mail execution + ongoing gsd-managed docs.*