# Phase 2: Visual Layer - Research

**Researched:** 2026-05-25
**Mode:** Inline, local codebase research

## Research Complete

This phase should be planned as a Next.js visual recovery phase, not as the original shader/cursor build.

## Current Reality

- The active app path is `src/app/page.tsx` -> `src/components/HomeClient.tsx` -> `src/components/HeroSection.tsx`.
- `src/components/HeroSection.tsx` imports `src/components/ChatInterface.tsx`.
- `src/components/ChatInterface.tsx` is currently zero bytes, so the app likely cannot compile.
- `src/components/HeroSection.tsx` references `/assets/logo-mark.svg`.
- `public/assets/logo-mark.svg` is not present in the current file list.
- `src/app/layout.tsx` loads two local Fraunces files from `public/fonts/`.
- Both Fraunces files are currently zero bytes.
- `src/app/api/chat/route.ts` already exists and streams through Vercel AI Gateway.
- `src/components/LeadCaptureCard.tsx` already exists and posts to Web3Forms.

## Brand Research

The current brand source in `public/README.md` explicitly pivots away from the original dark shader site:

- Use ink, orange, cool paper, and WA ocean.
- Avoid WebGL shaders.
- Avoid hidden cursors.
- Avoid full-page mouse tracking loops.
- Avoid drop-glow ambience.
- Keep language casual, practical, and automation-focused.

This means the old Phase 2 requirements for shader and cursor should be treated as superseded by the pivot, not as implementation targets.

## Planning Implications

- Plan 1 should reconcile stale docs and asset references before deeper feature work.
- Plan 2 should implement/repair the visible hero and chat mount so the page compiles.
- Plan 3 should polish responsive visual behavior and verification, then leave the repo ready for Phase 3 chat/Phase 4 lead hardening.

## Risks

- Some files are symlinks to external paths. Execution must not blindly replace unrelated user assets.
- Zero-byte assets may be typechanged symlinks. The executor should inspect before deciding whether to restore, replace, or repoint references.
- Installing or removing dependencies may cause lockfile churn because root `package-lock.json` is a symlink.
- Existing dirty files include `src/components/ChatInterface.tsx`, asset files, fonts, and favicon. Executors must inspect and preserve user intent.

## Validation Architecture

Validation should be command-based and visual:

- `npm run lint` catches TypeScript/ESLint and import errors.
- `npm run build` catches Next/font, missing modules, and production rendering issues.
- Manual browser verification checks first viewport, mobile layout, asset rendering, and chat shell behavior.
- A later Playwright smoke test should cover home page render and initial intake interaction once the page compiles.

## Recommended Execution Order

1. Reconcile planning docs and asset/font blockers.
2. Implement a real `ChatInterface` client boundary and wire the existing API/lead components only as far as needed for a buildable visual flow.
3. Polish responsive layout and remove/contain stale visual artifacts that contradict the pivot.

---

## RESEARCH COMPLETE
