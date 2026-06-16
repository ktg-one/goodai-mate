# Good'ai — Business Automations, Sorted (goodai.au)

## What This Is

Good'ai (goodai.au) is a Perth-based business-automations service for SMEs (tradies, service businesses, ~$1M–$30M turnover). The site is the primary brand experience **and** an active lead-generation funnel. It is a single-page brutalist 1978 direct-mail marketing site whose hero **is** the product: a functional Voice Agent (Supertonic ASR locally during dev). Conversations "file" as physical mail dockets into a sticky in-tray and drive the narrative below (the "Docket Flow").

As of milestone **v1.1**, the site also runs the machinery that turns interest into leads: a website-audit tool, an outbound callback widget, and an n8n + Google Workspace automation pipeline.

Built with Next.js 16 (App Router), React 19, Tailwind v4, GSAP/ScrollTrigger + Motion (motion/react) hybrid, custom stamp primitives. Direct imports only (no barrels, per AGENTS.md).

## Core Value

A switched-on Perth tradie/owner lands, speaks (or types) their admin mess into the Voice Agent, feels understood by a local mate who "gets it", and is then pulled into a real lead path — a free website audit, a callback from Darl/Robokev, or a captured conversation routed to ops via n8n/GWS. No portals, no logins, no dashboards. Just relief, then a tangible next step.

## Requirements

### Validated / Shipped — v1 refactor (mail-docket brand site)
- [x] Voice Agent hero is the product (Supertonic local ASR, push-to-talk + transcript; `onMailFiled` leaks state into the in-tray)
- [x] Brutalist mail-board: ribbons (GSAP shear/tear/flutter), Docket Flow (non-uniform pinned StampCards: rot/offset/wear), sticky in-tray (last-3 filed dockets), pinned footer clack ritual
- [x] One red accent per surface, Fraunces WONK once per major block, participating stamp shadows, 60fps mechanical physics (90–160ms hard springs)
- [x] Reduced-motion: fully static filed-paper layout, all artifacts visible
- [x] Footer ritual: heavy stamped docket clack + wonk line + minimal contact (`mailto:hello@goodai.au`)

### Validated / Shipped — v1.1 lead-gen + automation (verified in src/ 2026-06-16)
- [x] **Website Analyzer**: scrape URL → AI Gateway audit → auto-extract business email → dispatch audit by email via GWS CLI
- [x] **Outbound callback widget**: Darl / Robokev personas, phone-number prefill (`/api/trigger-call`)
- [x] **n8n + Google Workspace lead-automation pipeline** (`/api/demo-automation`, LeadCaptureCard, VoiceAgentDemo, AutomationPlayground)
- [x] **Chat** via AI Gateway + text fallback mode (`/api/chat`); **TTS** via ElevenLabs (`/api/tts`)
- [x] GSAP scroll reveals on VoiceAgentDemo + AISolutions; Fraunces font-loading fix; Vercel deploy fixes (physical font files, no symlinks)

### Active / Ongoing (open — see ROADMAP §Open Workstreams)
- [x] **[prod blocker]** De-hardcode the GWS CLI path (`D:\packages\…` in 3 API routes) → env-driven / hosted endpoint
- [ ] **[prod blocker]** Point `N8N_CALL_WEBHOOK_URL` at a hosted n8n (`api/trigger-call` defaults to `localhost:5678`)
- [ ] Production ASR path (replace `localhost:8000` Supertonic dev endpoint — 4 files)
- [ ] Resolve design SSOT (`public/design-system-new/` flattened to `public/` root on 2026-06-10; 11 files still cite the removed subpath in comments)
- [ ] Commit in-flight work (remove `public/voice-feature/*`, css/HomeClient edits, new audit assets)
- [ ] Lighthouse / perf / a11y pass on the GSAP-heavy flow
- [ ] Additional surfaces (services, about, case studies) in the same brutalist language
- [ ] Production deploy / domain + analytics

### Out of Scope (current)
- Old shader + custom cursor + old shadcn lead card (superseded)
- Multi-page app chrome / dashboards / user accounts / auth

## Context

- **Refactor → v1.1**: original phase plan (shader/cursor/old-lead) was superseded by the v1 mechanical brutalist redesign (goodai-award-configuration swarm). Since 2026-06-04 a lead-gen + automation layer (v1.1) was added ad-hoc on top. Old `.planning/phases/` archived to `milestones/v0.9-pre-refactor-phases/`.
- **Brand**: "Good'ai" (good eye, mate). "we'll sort the boring stuff." Practical, warm, direct. "We", never "I". No hype, no "AI-powered", no corporate.
- **Design SSOT**: paper canvas, navy/gold/red, flat 3px participating stamp shadows, Fraunces var + WONK, 4px grid, mechanical motion only, one red per surface. Tokens now live at `public/` root (`colors_and_type.css`, `fonts/`, `good-ai-design-final.html`, `README.md`) after the 2026-06-10 consolidation. NOTE: 11 source files' comments still reference the removed `public/design-system-new/` subpath — canonical source needs declaring (likely `public/` root + PRODUCT.md) and the stale comments fixing.
- **Tech**: Next.js 16, React 19, Tailwind v4, GSAP/ScrollTrigger + @gsap/react + motion/react (hybrid), direct imports.
- **Backends**: AI Gateway (`AI_GATEWAY_API_KEY`) for chat + audit; ElevenLabs (`ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE`) for TTS; Google Workspace CLI + n8n for automation/email dispatch; Supertonic local for dev ASR; `NEXT_PUBLIC_GWS_SCRIPT_URL` for lead capture.
- **Skills in use**: local `.agents/skills` + `.claude/skills` (goodai-award-configuration + awwwards/gsap/impeccable swarm, next-best-practices, gsd-* family).

## Constraints
- 60fps hot paths (refs only; transform/opacity/filter; canvas DPR capped)
- Stamp clack timing: hard 90–160ms cubic-bezier(0.23,1,0.32,1) — no floaty easings
- One red accent max per surface/block; exactly one Fraunces WONK phrase per major surface
- Reduced motion must not lose the 1978 docket artifact
- Zero "AI" hype language in UI or persona
- Voice Agent stays the pure functional product moment at top; everything else receives leaked convos as filed mail

## Key Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| Award Configuration swarm for the v1 redesign | Delivered coordinated 60fps mechanical brutalist mail-board | Shipped (May 2026) |
| Add a lead-gen + automation layer (v1.1) | Turn the brand demo into a working funnel (audit → call → pipeline) | Shipped 2026-06-09/10, work in flight |
| AI Gateway for all model calls | Single keyed entry point vs per-provider SDKs | Shipped |
| Google Workspace CLI + n8n as automation backend | Reuse existing GWS/n8n tooling for email + lead routing | Shipped, but path hardcoded (prod blocker) |
| Archive pre-refactor phases | Old 01–05 plans described the abandoned shader/cursor v1 | Archived |

---

*Last validated: 2026-06-16 against the live codebase, then re-verified all concerns directly in source. v1.1 lead-gen/automation recorded; SSOT + prod-blocker concerns confirmed in ROADMAP/STATE.*
