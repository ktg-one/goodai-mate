# Roadmap — Milestone v1.0: Launch

> Rewritten 2026-09-30. The previous roadmap (Aug 2026 milestones) is in git history.
> This file is the single source of scope and order. `TASKS.md` points here.

## How to run this

- Standard GSD loop per phase: `/gsd:plan-phase N` → `/gsd:execute-phase N` → `/gsd:verify-work N`.
- One branch + PR per phase (`phase/NN-slug`). Update `.planning/STATE.md` at the end of every phase.
- **Waves**: phases in the same wave touch different files and can run in parallel (separate worktrees).
  A wave starts only when every phase in the previous wave is merged.
- **Scroll motion rules (Kevin):** ~3 viewport heights of scroll per animation; enter → held, readable middle → exit, with calm space top and bottom; nothing faster than ~1.5s; every ScrollTrigger states its `start`/`end` explicitly with a comment.
- Every phase gate includes `npm run lint` + `npm run build` clean, and desktop (1440) + mobile (390) screenshots with no horizontal overflow.
- Site is **not open yet** — no live traffic, so nothing here is an incident.

**Open gate:** the site can go live as soon as Phases 1 and 5 are done (clean baseline + a CTA form that really delivers leads) and a quick Phase 7 smoke check passes. Everything else ships after opening.

| Wave | Phase | Status |
|---|---|---|
| 1 | 1. Baseline commit & cleanup | Ready |
| 2 | 5. Lead capture that actually sends — **gates opening** | Needs email + webhook target |
| 2 | 3. Scroll motion restored | Ready after wave 1 |
| 2 | 4. Voice agent site-wide | Needs Trillet keys in `.env.local` |
| 2 | 2. Scroll-story art matches the words | Blocked — decision (may be absorbed by Phase 9) |
| 3 | 6. "Quick dive" — email in, light research back | Blocked — decisions |
| 3 | 8. Brand: sun-moving plant shadow | After opening |
| 3 | 9. Brand: Kevin's handwriting drawn down the page | After opening; needs handwriting samples |
| 4 | 7. Pre-launch QA (smoke check before opening; full pass later) | — |

---

## Phase 1 — Baseline commit & cleanup (Wave 1)

Everything else branches from this, so it runs alone.

- Commit the work in the tree: ThreeUI sketchbook with Perth plates (`components/studio/PerthSketchbook.tsx`, `src/shaders/sketchbook/`, `public/sketchbook/plates/`), the text-only hero with the golden-spiral study (`components/studio/HeroStudy.tsx`), tree removal.
- Delete dead code: `components/studio/SketchbookFlip.tsx` + `.sbf*` CSS, `components/studio/HeroTree.tsx`, `components/layout/HomeScroll.tsx` (tree-only, now a no-op) and its mount in `app/page.tsx`, `.hero-figure*` / `.image-seal` CSS, `.hero-figure` rules in the preloader block of `app/globals.css`.
- Decide what stays untracked (`klint/`, `.agents/`, `bun.lock`, `skills-lock.json`) — ask Kevin, don't guess.

**Gate:** lint + build clean; home renders the same as before cleanup.

## Phase 2 — Scroll-story art matches the words (Wave 2) — BLOCKED on Kevin

`components/studio/ScrollStory.tsx` line art was drawn for the old chapters (desk/inbox, envelope→calendar, beach) and doesn't fit the current copy:
"Call it a day." / "Go on. Knock off early." / "We got you."

Options (Kevin picks one):
- **a.** Use the Perth watercolours: city skyline → Cottesloe families → Fremantle mates.
- **b.** As (a), and remove those three plates from the sketchbook so nothing repeats.
- **c.** Redraw the SVG line art to match (keeps the ink-draw animation).

**Gate:** each chapter's art depicts its own title; the pinned scrub still works; reduced-motion shows final art.

## Phase 3 — Scroll motion restored (Wave 2)

Commit 1dac4ea removed the scroll reveals from `components/studio/StudioMotion.tsx`; the working tree also dropped `<StudioMotion />` from `app/layout.tsx`. The site now has almost no motion outside the scroll story.

- Rebuild reveals with GSAP ScrollTrigger (already synced with Lenis in `SmoothScroll.tsx`): fade/rise only, no new pins, one or two elements per view, `gsap.matchMedia` so reduced-motion gets the static final state.
- Restore the hero entrance, coordinated with `components/ui/Preloader.tsx` (it already fades `.hero-copy`).
- Targets: section headings, service rows, demo, approach steps, FAQ, contact.

**Gate:** keyframe screenshots at 0/25/50/75/100% scroll (desktop + mobile); no layout shift; nothing hidden when JS is off.

## Phase 4 — Voice agent site-wide (Wave 2)

`components/studio/TrilletVoiceWidget.tsx` is our own React UI (fully stylable, unlike the old ElevenLabs embed) but only mounts on `/demo`.

- First: verify a real mic call connects end to end with the `.env` Trillet agent. If it doesn't, stop and report.
- Then: small "Talk to us" launcher in `app/layout.tsx`, brand-styled, SDK loaded on click (dynamic import) so it's not in the initial bundle.
- Retire `components/ui/ElevenLabsWidget.tsx` / `BrandedElevenLabsWidget.tsx` if nothing uses them.

**Gate:** call works on desktop Chrome and mobile Safari; mic permission denial handled; Lighthouse performance not reduced.

## Phase 5 — Lead capture that actually sends (Wave 2)

`components/studio/SussTheFussCard.tsx` fakes submission (`setTimeout` → "We've got it"); nothing is delivered.

- `app/api/lead/route.ts`: validate, rate-limit, honeypot; deliver by email to Kevin and POST to `LEAD_WEBHOOK_URL`.
- Form adds business name and website (optional) next to the existing contact, headaches and note.
- Failure shows an honest error plus the phone number, never a fake success.

**Needs from Kevin:** email provider + destination address; webhook target (n8n or other).
**Gate:** a test submission arrives by email and at the webhook.

## Phase 6 — "Quick dive": email in, light research back (Wave 3) — BLOCKED on decisions

A lighter, public version of the internal deep-dive (full version: business deep dive → strategy framework → NotebookLM notebook → one-page site, handed back in the first meeting; stays internal).

Visitor gives email + business name/website → one bounded research pass → a short "here's where you're losing time" snapshot by email, with a link to book the full deep dive.

**Decisions for Kevin:**
- Output: plain email snapshot, or a hosted one-pager?
- Runs where: Next route + queue, or the existing pipeline via Phase 5's webhook?
- Model and hard cost cap per lead; human review before send (yes/no)?
- Abuse limits (one per email/domain per day, etc.).

**Gate:** 5 test businesses produce accurate, non-invented snapshots within the cost cap; nothing claims facts it didn't find.

## Phase 8 — Brand: sun-moving plant shadow (Wave 3, after opening)

The brand is "a lazy summer": a still plant shadow drifting as the sun crosses the day. Reference: Kevin's banners (rust + forest green, botanical line work, leaf shadows, marker scrawl).

- Full-page fixed leaf/branch shadow layer (multiply blend, low opacity) behind content.
- Scroll = time of day: shadow angle, length and softness shift, light warms from cool morning (top) to golden knock-off light (contact section). Occasional slow sway. GSAP ScrollTrigger scrub, synced with Lenis.
- Reduced motion: one static shadow. No layout impact, no main-thread jank (transform/opacity/filter only).
- Asset: Kevin's banner shadow source if available, otherwise a generated botanical silhouette.

**Gate:** 60fps on a mid laptop; readable contrast everywhere the shadow passes; Kevin signs off on the look.

## Phase 9 — Brand: Kevin's handwriting drawn down the page (Wave 3, after opening)

The marker writing on the banners is Kevin's own. Scroll draws his handwriting down the page, stroke by stroke, like it's being written as you read.

- Get samples: Kevin writes the phrases (e.g. "Stop whinging", "Go on. Knock off early.", chapter notes) on paper or a tablet → vectorise to single-line SVG paths (centreline, not outlines, so stroke-dashoffset draw works).
- ScrollTrigger scrub draws each phrase as its section enters; lines can connect down the page between sections.
- Handwriting is accent only (notes, asides, callouts) — headings and body stay in the readable typefaces.
- Likely replaces the Phase 2 line art for the scroll story.

**Gate:** writing reads as Kevin's; draws smoothly both scroll directions; static and legible with reduced motion.

## Phase 7 — Pre-launch QA (Wave 4)

Folds in the old milestones (performance/accessibility, content audit).

- Lighthouse: Performance > 80 (desktop), Accessibility > 90.
- Keyboard + screen-reader pass; reduced-motion pass.
- Content audit per `AGENTS.md`: no invented claims, testimonials, outcomes or integrations; "Good'Ai" spelling; every CTA routes to a working destination.
- Wire `@shadcn/lint` design contracts into `eslint.config.mjs` if not already done.

**Gate:** all of the above recorded in `STATE.md`; Kevin signs off.
