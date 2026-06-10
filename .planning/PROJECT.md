# Good'ai — Business Automations, Sorted (goodai.au)

## What This Is

Good'ai (goodai.au) is a Perth-based business automations service for SMEs (tradies, service businesses, $1M–$30M turnover). The site is the primary brand experience and lead generator. v1 is a single-page brutalist marketing site whose hero **is** the product: a functional local-first Voice Agent (Supertonic ASR + Good'ai persona + spoken replies during dev). Conversations "file" as physical mail dockets into an in-tray and drive the marketing narrative below (the "Docket Flow").

The entire site below the hero is one cohesive 1978 direct-mail corkboard being rifled as you scroll: perforated paper-tape ribbons (shear/tear), non-uniform pinned stamp dockets, heavy final clack ritual in the footer. Built with Next.js 16 (App Router), React 19, Tailwind, GSAP + Framer Motion hybrid, custom stamp primitives.

Development and craft heavily leverage local agent skills from `.agents/skills` and `.claude/skills` (goodai-award-configuration + awwwards/gsap/impeccable swarm for the mechanical brutalist execution).

## Core Value

A switched-on Perth tradie/business owner lands, speaks their admin mess (invoicing, follow-ups, quotes, the lot) into the Voice Agent, feels understood by a local mate who "gets it", and knows the boring stuff will be sorted so they can knock off early. No portals, no logins, no dashboards. Just relief.

If the voice + the physical docket story doesn't make them drop a line, nothing else matters.

## Requirements

### Validated / Shipped (refactor delivery)

- [x] Voice Agent hero is the product (local Supertonic endpoint, push-to-talk + transcript, onMailFiled leaks state into in-tray)
- [x] Brutalist mail-board metaphor: ribbons (perforated tape with GSAP shear/flutter), docket flow (non-uniform pinned StampCards with rot/offset/wear), filed mail tray (last-3 physical dockets)
- [x] One orange (red-accent) per surface discipline, Fraunces WONK exactly once per major block for emphasis, stamp shadows that participate in motion
- [x] Reduced-motion: fully static filed-paper layouts with all stamps, rots, perforations, imprints visible and tactile (no lost meaning)
- [x] PRODUCT.md + public/ as the single source of truth for brand (ink/paper, stamp physics 90-160ms hard springs, one red, etc.)
- [x] Local agent skills: goodai-agent-team, goodai-award-configuration (5-skill swarm: impeccable + awwwards-animations + awwwards-ui-skills + gsap-awwwards-website + gsap-framer-scroll-animation), plus gsd-* (health, docs-update, progress, etc.) for planning/docs
- [x] Direct imports only (no barrels per AGENTS.md), production-grade Vercel/Next patterns
- [x] Footer ritual: heavy stamped docket clack, wonk line, minimal contact

### Active / Ongoing

- [ ] Voice quality / Supertonic prod endpoint + latency tuning
- [ ] Lead capture via real contact (mailto + form) + conversation context handoff to ops
- [ ] Additional surfaces (services, about, case studies) in same brutalist mail language
- [ ] gsd health + docs alignment after refactor (this work)
- [ ] Production deploy / domain + analytics

### Out of Scope (v1)

- Old v1 shader + custom cursor + old shadcn lead card flow (superseded by the award-refactored mail board)
- Multi-page app chrome or dashboards
- User accounts / auth
- Full automation execution demos (voice + docket is the demo)

## Context

- **Refactor**: Original planning (phase 1 foundation + planned visual/chat/lead phases with SDF shader, custom cursor, old lead capture) was superseded by a full mechanical brutalist redesign of the marketing site. The Voice Agent + mail-docket aesthetic (1978 corkboard + rubber stamps + perforated tape) was executed via the goodai-award-configuration 5-agent swarm + goodai-agent-team coordination. Old .planning/phases/ archived to milestones/v0.9-pre-refactor-phases/.
- **Brand**: "Good'ai" (good eye, mate). "we'll sort the boring stuff." Practical. Warm. Direct. Switched-on Aussie mate who happens to be unusually good at systems. Short sentences. "We", never "I". No hype, no "AI-powered", no corporate.
- **Design SSOT**: PRODUCT.md + public/ (paper canvas #FFF0D0, navy/gold/red, flat 3px participating stamp shadows, Fraunces var + WONK, 4px grid, mechanical motion only, ribbon-receipt, one red per surface).
- **Skills in use**: See skills-lock.json + local .agents/skills/goodai-* + .claude/skills/ (gsap, awwwards, design, next-best-practices, gsd-*) and global equivalents. gsd-health, gsd-docs-update, gsd-progress etc. now present locally for ongoing work.
- **Tech**: Next.js 16, Tailwind v4, GSAP/ScrollTrigger + @gsap/react + motion/react (hybrid, no fighting timelines), direct component imports.
- **Voice dev**: Supertonic local (http://localhost:8000/transcribe) for ASR during development; prod voice path TBD.

## Constraints

- 60fps hot paths (refs only, transform/opacity/filter, canvas DPR capped)
- Stamp clack timing: hard 90-160ms cubic-bezier(0.23,1,0.32,1) — no floaty easings
- One red accent max per surface/block
- Exactly one Fraunces WONK phrase per major surface
- Reduced motion must not lose the 1978 docket artifact
- Zero "AI" hype language in UI or persona
- Voice Agent remains pure functional product moment at top; everything else receives leaked convos as filed mail

## Key Decisions (post-refactor)

| Decision | Rationale | Status |
|----------|-----------|--------|
| Award Configuration swarm for the redesign | Battle-tested pattern that delivered coordinated 60fps mechanical brutalist mail-board execution | Shipped (May 2026) |
| Local .agents/.claude skills copies (goodai-*, gsd-*, awwwards/gsap) | Project-specific context + gsd planning tools always available when working in-repo | Added gsd-health + core set |
| Archive pre-refactor phases | Old 01-05 plans described shader/cursor/old-lead v1 that was pivoted away in the refactor | Archived to milestones/v0.9-pre-refactor-phases/ |
| gsd for health/docs/progress | Use /gsd-health, /gsd-docs-update, /gsd-progress etc. to keep .planning and docs/ in sync with actual shipped site | In progress (this task) |
| PRODUCT.md + public/ design system as SSOT | Brand guardrails must be injected into every creative agent run | Enforced |

---

*Last updated: 2026-06-04 after gsd-health + skills add + docs alignment for refactored site*
*Pre-refactor planning archived; current reality is the Voice + mail-docket brutalist site delivered via award skills + gsd oversight.*