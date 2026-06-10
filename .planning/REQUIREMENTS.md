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
