# Phase 2: Visual Layer - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning
**Source:** Inline context from current codebase map and user clarification

<domain>
## Phase Boundary

Phase 2 is no longer the dark shader/cursor phase described by the stale roadmap.
The product is still the Next.js site, but the visual direction has pivoted to the current Good'ai paper-brand system: ink, orange, cool paper, and WA ocean.

This phase should make the site buildable and visually coherent. It should not reintroduce WebGL shader work, hidden cursors, ambient cursor glow, or separate Vite prototypes.
</domain>

<decisions>
## Implementation Decisions

### Locked Decisions

- Treat the intended product as the root Next.js app under `src/`.
- Treat `public/tts-feature/` as stray prototype/reference material, not production architecture.
- Preserve the current paper-brand direction documented in `public/README.md`.
- Do not implement the old SDF shader background, custom cursor, or ambient glow in this phase.
- Keep the first screen as the actual usable intake/chat experience, not a marketing-only landing page.
- Fix build blockers before visual polish.
- `src/components/ChatInterface.tsx` must stop being a zero-byte module.
- Missing/zero-byte assets must be restored, replaced, or references must be changed to valid existing assets.
- Local Fraunces loading must be made reliable: either restore valid font files or remove local font dependency.
- Phase execution must protect user/unrelated dirty worktree changes.

### the agent's Discretion

- Whether to use `@ai-sdk/react` immediately in `ChatInterface` or build a compile-safe visual shell first.
- Whether to restore `logo-mark.svg` from design assets or point `HeroSection` at an existing valid SVG.
- Whether to remove stale shader dependencies now or leave them for a later cleanup if removing them risks dependency churn.
- Exact mobile spacing as long as text does not overlap and the first viewport remains useful.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Codebase Map

- `.planning/codebase/STACK.md` - Current stack, runtime, and out-of-scope prototype notes.
- `.planning/codebase/ARCHITECTURE.md` - Current Next app shape and entry points.
- `.planning/codebase/STRUCTURE.md` - File locations and broken structural references.
- `.planning/codebase/CONCERNS.md` - Current blockers and recovery order.
- `.planning/codebase/CONVENTIONS.md` - Local style, component, and brand conventions.
- `.planning/codebase/TESTING.md` - Current verification gaps.

### Brand

- `public/README.md` - Good'ai brand book summary and pivot rules.
- `public/colors_and_type.css` - Brand tokens and typography reference.
- `public/ui_kits/web/README.md` - Static UI kit structure and production differences.

### Runtime

- `src/app/layout.tsx` - Font loading, metadata, global shell.
- `src/app/page.tsx` - Home route entry.
- `src/components/HeroSection.tsx` - Current visual page surface.
- `src/components/ChatInterface.tsx` - Empty blocker to implement.
- `src/components/LeadCaptureCard.tsx` - Existing lead capture component.
- `src/app/api/chat/route.ts` - Existing chat API route.
- `src/lib/chatPersona.ts` - Good'ai assistant persona.
</canonical_refs>

<specifics>
## Specific Ideas

- First execution should reconcile stale planning docs so future agents stop following the old shader/cursor plan.
- Prefer direct file imports and existing shadcn/ui primitives.
- Use Lucide icons for UI controls.
- Keep cards at restrained radii where possible, but preserve current component style unless actively correcting brand drift.
- Verify with `npm run lint` and `npm run build` after each plan where feasible.
- If build fails due to pre-existing symlink/asset state, document the exact blocker in the plan summary.
</specifics>

<deferred>
## Deferred Ideas

- Full external cleanup of `public/tts-feature/` can be deferred if moving/removing it risks unrelated churn.
- Deeper lead capture reliability and Web3Forms response handling can be Phase 4 unless touched directly by chat shell wiring.
- Production deployment, Lighthouse, and domain checks remain Phase 5.
</deferred>

---

*Phase: 02-visual-layer*
*Context gathered: 2026-05-25*
