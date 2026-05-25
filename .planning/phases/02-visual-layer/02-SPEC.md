# Phase 2: Visual Layer — Specification

**Created:** 2026-05-25
**Ambiguity score:** 0.11 (gate: ≤ 0.20)
**Requirements:** 8 locked

## Goal

The Good'ai home page changes from a broken/stale visual layer into a buildable Next.js paper-brand intake page with valid assets, robust fonts, a real chat mount, responsive first viewport, and no reintroduced shader/cursor behavior.

## Background

The current repo is a Next.js App Router site under `src/`. The active home route is `src/app/page.tsx`, which renders `src/components/HomeClient.tsx`, which renders `src/components/HeroSection.tsx`.

The visual direction has pivoted away from the original dark shader/cursor plan. `public/README.md` now defines a paper-brand direction using ink, orange, cool paper, and WA ocean. It explicitly avoids WebGL shaders, hidden cursors, full-page pointer tracking, and glow-heavy effects.

Several blockers prevent safe visual execution today:

- `src/components/ChatInterface.tsx` is a zero-byte file, while `HeroSection` imports it.
- `HeroSection` references `/assets/logo-mark.svg`, but the only kept asset is `public/assets/goodai/uploads/G.jpg`.
- `src/app/layout.tsx` loads local Fraunces font files that are currently zero bytes.
- `.env.example` does not document `NEXT_PUBLIC_WEB3FORMS_KEY`, even though `LeadCaptureCard` reads it.
- `public/voice-feature/` is a separate Vite/Express/Gemini Live prototype inside the public tree and can be mistaken for the production app.
- Older Phase 2 requirements and roadmap text still refer to shader and custom cursor behavior that is no longer the v1 direction.

## Requirements

1. **Visual pivot locked**: Phase 2 documentation must state that the old shader/custom-cursor direction is superseded by the current paper-brand visual layer.
   - Current: `.planning/ROADMAP.md` and `.planning/REQUIREMENTS.md` still describe shader/cursor work as pending Phase 2 implementation.
   - Target: Planning docs explicitly say shader/cursor requirements are superseded for v1 and Phase 2 delivers a buildable paper-brand visual layer.
   - Acceptance: Searching `.planning/ROADMAP.md` and `.planning/REQUIREMENTS.md` for `superseded` and `paper-brand` finds the updated Phase 2 scope.

2. **Valid brand mark**: The hero must not reference a missing or zero-byte brand asset.
   - Current: `src/components/HeroSection.tsx` references `/assets/logo-mark.svg`, but the only kept asset is `public/assets/goodai/uploads/G.jpg`.
   - Target: The hero image source points to an existing non-empty brand asset, or a new logo asset is intentionally added from the current design source.
   - Acceptance: `Test-Path public/assets/goodai/uploads/G.jpg` passes and `brandMarkSrc` points to an existing non-empty asset; `npm run build` does not fail due to a missing hero image.

3. **Robust display font loading**: The app must not fail because local Fraunces font files are empty or unavailable.
   - Current: `src/app/layout.tsx` loads two local Fraunces files from `public/fonts/`, and both files are zero bytes.
   - Target: Font loading either uses valid non-empty Fraunces files or falls back safely without importing broken local files.
   - Acceptance: `npm run build` does not fail due to `public/fonts/Fraunces-VariableFont_SOFT_WONK_opsz_wght.ttf` or `public/fonts/Fraunces-Italic-VariableFont_SOFT_WONK_opsz_wght.ttf`.

4. **Lead capture env documented**: The public Web3Forms key required by the lead card must be visible in example environment configuration without exposing a real value.
   - Current: `LeadCaptureCard` reads `NEXT_PUBLIC_WEB3FORMS_KEY`, but `.env.example` does not document it.
   - Target: `.env.example` contains an empty `NEXT_PUBLIC_WEB3FORMS_KEY=` entry.
   - Acceptance: `Select-String -Path .env.example -Pattern '^NEXT_PUBLIC_WEB3FORMS_KEY='` returns a match and no real key value is committed.

5. **Chat interface exists**: `ChatInterface` must be a real client component mounted by the home page.
   - Current: `src/components/ChatInterface.tsx` is zero bytes, so the imported component cannot support the hero intake flow.
   - Target: `ChatInterface` exports a Client Component with an accessible message input, non-empty submit behavior, local message history, loading state, and user-safe error message.
   - Acceptance: `src/components/ChatInterface.tsx` contains `'use client'`, exports a React component, renders an input/form, and `npm run lint` passes for the file.

6. **First assistant turn can trigger lead card**: The visible chat shell must be able to show the existing lead card after the first assistant response.
   - Current: `LeadCaptureCard` exists and expects `firstMessage`, `conversationTranscript`, and optional `onDismiss`, but no active component wires those props.
   - Target: `ChatInterface` passes the first user message and conversation transcript to `LeadCaptureCard` after the first assistant response and lets the user dismiss it.
   - Acceptance: Searching `src/components/ChatInterface.tsx` finds `LeadCaptureCard`, `firstMessage`, and `conversationTranscript`; the lead card is not rendered before a first assistant response.

7. **Responsive first viewport**: The home page must render without overlapping or horizontally overflowing core visual elements on desktop and mobile.
   - Current: The hero, chips, chat mount, and footer exist, but the chat mount is empty and mobile behavior is unverified.
   - Target: At desktop width and at 390px mobile width, the first viewport shows the Good'ai identity, Perth/WA signal, headline, and usable chat/intake area without horizontal scroll or text collision.
   - Acceptance: Manual browser inspection at desktop width and 390px width confirms no horizontal scroll, no overlapping core text/controls, and visible chat input; `npm run build` passes.

8. **Prototype clearly non-production**: The Vite/Gemini voice prototype under `public/voice-feature/` must not be confused with the production Next.js app.
   - Current: `public/voice-feature/` contains a separate app/server prototype inside the public asset tree.
   - Target: Root docs and/or `public/voice-feature/README.md` clearly label it as a non-production prototype; production work is documented as happening under `src/`.
   - Acceptance: Searching `README.md` and `public/voice-feature/README.md` for `prototype`, `not production`, or `src/` finds clear guidance.

## Boundaries

**In scope:**

- Locking the Phase 2 pivot away from shader/cursor work in planning docs.
- Repointing the hero brand asset to the kept G photo, or intentionally adding a new logo asset from the current design source.
- Making display font loading safe when local font files are missing or broken.
- Documenting `NEXT_PUBLIC_WEB3FORMS_KEY` as an empty example env var.
- Implementing a buildable `ChatInterface` client component.
- Wiring the existing `LeadCaptureCard` to the first-response chat flow.
- Responsive first-viewport layout safety for desktop and mobile.
- Clear documentation that `public/voice-feature/` is a prototype, not the production Next app.

**Out of scope:**

- Rebuilding the old SDF/WebGL shader background — superseded by the paper-brand performance pivot.
- Implementing a custom hidden cursor or ambient cursor glow — superseded and explicitly avoided by the brand guide.
- Full Web3Forms reliability hardening or server-side lead persistence — belongs to the lead-capture phase unless needed for basic wiring.
- Production deployment, Lighthouse tuning, and domain configuration — belongs to polish/deploy hardening.
- Moving or deleting the entire voice prototype if that creates broad churn — document first, move only if clearly safe.
- Adding a complete Playwright suite — desirable after the page compiles, but not required for this spec.

## Constraints

- The active app is the root Next.js app under `src/`; do not use `public/voice-feature/` as the implementation architecture.
- Use the current Good'ai paper-brand system from `public/README.md`: ink, orange, cool paper, WA ocean, practical language.
- Do not introduce WebGL shaders, `cursor: none`, full-page pointer tracking, or ambient cursor glow.
- Preserve unrelated dirty worktree changes; inspect typechanged/symlinked assets before editing.
- Do not expose `AI_GATEWAY_API_KEY` or any real Web3Forms key in client code or docs.
- Use existing project commands as gates: `npm run lint` and `npm run build`.

## Acceptance Criteria

- [ ] Phase 2 docs state that shader/cursor work is superseded by the paper-brand direction.
- [ ] Hero brand image points to an existing non-empty asset and build does not fail on the image path.
- [ ] Build does not fail because of zero-byte local Fraunces font files.
- [ ] `.env.example` contains an empty `NEXT_PUBLIC_WEB3FORMS_KEY=` entry.
- [ ] `src/components/ChatInterface.tsx` is a non-empty Client Component with accessible input, submit, local history, loading state, and friendly error display.
- [ ] `ChatInterface` can render `LeadCaptureCard` only after the first assistant response and passes `firstMessage` plus `conversationTranscript`.
- [ ] Desktop and 390px mobile first viewports have no horizontal scroll or overlapping core text/controls.
- [ ] Root/prototype docs clearly identify `public/voice-feature/` as non-production and the root `src/` tree as the production Next site.
- [ ] `npm run lint` and `npm run build` pass, or any remaining failure is documented with the exact unrelated blocker.

## Ambiguity Report

| Dimension           | Score | Min   | Status | Notes |
|---------------------|-------|-------|--------|-------|
| Goal Clarity        | 0.92  | 0.75  | ✓      | Goal states exact transition from broken/stale visual layer to buildable paper-brand intake page. |
| Boundary Clarity    | 0.90  | 0.70  | ✓      | Explicitly excludes shader/cursor, deep lead hardening, deployment, and broad prototype removal. |
| Constraint Clarity  | 0.82  | 0.65  | ✓      | Constraints cover brand, runtime, secrets, dirty worktree, and validation commands. |
| Acceptance Criteria | 0.88  | 0.70  | ✓      | Nine pass/fail criteria map to files, behaviors, and commands. |
| **Ambiguity**       | 0.11  | ≤0.20 | ✓      | Gate passed after auto-selected pivot decisions from context/research. |

Status: ✓ = met minimum, ⚠ = below minimum (planner treats as assumption)

## Interview Log

Auto mode was used because the user had just clarified the pivot and Phase 2 already had fresh context, research, UI spec, and plans.

| Round | Perspective      | Question summary | Decision locked |
|-------|------------------|------------------|-----------------|
| 1     | Researcher       | What exists today and what is broken? | Home route exists; `ChatInterface` is empty; hero asset and Fraunces font files are broken. |
| 2     | Simplifier       | What is the irreducible Phase 2 core? | Make the Next home page buildable, visually coherent, and ready for chat/lead phases. |
| 3     | Boundary Keeper  | What is explicitly not Phase 2 now? | No shader, no hidden cursor, no ambient cursor glow, no Vite prototype architecture. |
| 4     | Failure Analyst  | What would make verification fail? | Missing assets/fonts, empty chat component, mobile overflow, leaked env values, or prototype confusion. |
| 5     | Seed Closer      | What remains ambiguous? | Exact implementation choices stay in plan/discuss; the spec locks only observable outcomes and boundaries. |

---

*Phase: 02-visual-layer*
*Spec created: 2026-05-25*
*Next step: $gsd-discuss-phase 2 — implementation decisions (how to build what's specified above)*
