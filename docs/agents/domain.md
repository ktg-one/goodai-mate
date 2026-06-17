# Domain Docs

How engineering skills should consume this repo's domain documentation when exploring the codebase.

## Project posture

Good'ai Mate is a production-targeted Next.js marketing site (goodai.au) for a Perth business automations service. The hero **is** the Voice Agent product. The rest of the site is one physical 1978 direct-mail corkboard (ribbons, pinned stamp dockets, in-tray, footer ritual) executed at Awwwards mechanical level via the goodai-award-configuration skill swarm.

Prefer production-quality implementation, brand guardrails from PRODUCT.md + public/, 60fps mechanical motion rules, and gsd hygiene for planning/docs.

## Brand guardrail

Never drift to generic cream/charcoal/Anthropic editorial. The site is ink-on-paper brutalist direct mail:

- Strong ink, paper canvas (#FFF0D0), navy/gold/red accents.
- Stamp shadows `3px 3px 0`, hard edges, one red per surface, Bricolage Grotesque display emphasis once per block.
- Mechanical timing only (90-160ms hard stamp clacks). Reduced motion = static filed paper that still sells the artifact.
- "We", short sentences, practical/warm/direct Perth mate voice. Zero hype, zero "AI" jargon in UI or persona.

Inject PRODUCT.md + public/ + live hero/mail state into any creative or UI agent.

## Before exploring, read these

- `PRODUCT.md` at the repo root (brand, voice, anti-references, design principles — the primary SSOT).
- `public/` (or good-ai-design-final.html) — visual tokens, stamp rules, ribbon, motion specs.
- `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `.planning/STATE.md` (current state post-refactor; old phases archived to milestones/v0.9-pre-refactor-phases/).
- Local skills in `.agents/skills/` and `.claude/skills/` (goodai-agent-team, goodai-award-configuration, gsd-health, gsd-docs-update, gsd-progress, gsap-*, awwwards-*, impeccable, etc.).
- `docs/agents/` (this dir) for triage/issue conventions.

If a file does not exist, proceed but note the gap.

## File structure (post-refactor)

```
/goodai-mate
├── PRODUCT.md
├── .planning/
│   ├── PROJECT.md / ROADMAP.md / STATE.md / REQUIREMENTS.md
│   ├── phases/               (currently empty; use gsd-plan-phase for new)
│   ├── milestones/v0.9-pre-refactor-phases/  (archived old 01-05)
│   └── codebase/ (ARCHITECTURE.md etc for reference)
├── docs/agents/              (domain, issue-tracker, triage-labels)
├── .agents/skills/ + .claude/skills/   (project-curated: goodai-*, gsd-*, design, gsap...)
├── src/
│   └── app/ (layout, page), components/ (VoiceAgentHero, HomeClient mail GSAP, Stamp*, marketing/*)
└── public/                      (design system SSOT: tokens, skill, previews, assets)
    ├── colors_and_type.css       (SSOT tokens)
    ├── SKILL.md / README.md      (brutalist design skill)
    ├── Good'ai Brutalist Skill.html / good-ai-design-final.html
    ├── ui_kits/ · preview/ · export/ · assets/ · fonts/
    └── voice-feature/            (separate Vite/Gemini Live prototype, reference)
```

## Use the glossary's vocabulary

Use terms from PRODUCT.md (e.g. "Voice Agent hero", "mail board", "docket flow", "filed mail", "stamp clack", "ribbon", "one red", "display emphasis", "brutalist direct-mail", "we'll sort the boring stuff").

## Flag ADR / skill conflicts

If output contradicts PRODUCT.md, public/ design system, or the goodai-award-configuration rules (stamp physics, one-red, display emphasis, reduced-motion static fidelity, agent context injection), surface explicitly.

## GSD + Skills expectations

- Use gsd-health, gsd-progress, gsd-docs-update (now local) before/after work to keep .planning + docs honest.
- For ambitious UI/animation: dispatch via goodai-award-configuration (or goodai-agent-team) with full context bundle.
- Always verify 60fps, mechanical timing, brand voice, and reduced-motion behavior.
