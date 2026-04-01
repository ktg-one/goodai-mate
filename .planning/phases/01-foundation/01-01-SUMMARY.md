---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [next.js, turbopack, webpack, glsl, raw-loader, three.js, tailwind-v4, design-tokens, fonts]

# Dependency graph
requires: []
provides:
  - Dual GLSL loader pipeline (Turbopack dev + webpack prod)
  - TypeScript declarations for .glsl/.frag/.vert imports
  - Perth Disruptor palette as CSS vars and Tailwind v4 theme tokens
  - DM Sans + JetBrains Mono font loading via next/font/google
  - three.js, ai SDK, and @ai-sdk/openai-compatible installed
affects: [02-visual-layer, 03-chat-core, 04-lead-capture, 05-polish]

# Tech tracking
tech-stack:
  added: [three@0.183.2, "@types/three@0.183.1", raw-loader@4.0.2, "ai@6.0.142", "@ai-sdk/openai-compatible@2.0.37", cross-env@10.1.0]
  patterns: [turbopack.rules for dev GLSL, webpack raw-loader for prod GLSL, "@theme inline for Tailwind v4 token mapping"]

key-files:
  created: [src/types/glsl.d.ts, src/shaders/test.frag, src/app/not-found.tsx]
  modified: [next.config.ts, src/app/globals.css, src/app/layout.tsx, package.json]

key-decisions:
  - "Added cross-env for Windows-compatible NODE_ENV=production in build script"
  - "Set turbopack.root to process.cwd() to resolve lockfile inference warning"
  - "Dark-only palette: no prefers-color-scheme media query"

patterns-established:
  - "GLSL import pattern: import shader from '../shaders/file.frag' returns string"
  - "Design token pattern: CSS var in :root, mapped via @theme inline to Tailwind classes"
  - "Font pattern: next/font/google with CSS variable, mapped to Tailwind via @theme inline"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03, FOUND-04]

# Metrics
duration: 10min
completed: 2026-04-01
---

# Phase 1 Plan 1: Foundation Config Summary

**Dual GLSL loader pipeline (Turbopack + webpack), Perth Disruptor dark palette as Tailwind v4 tokens, DM Sans / JetBrains Mono fonts via next/font**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-01T15:39:22Z
- **Completed:** 2026-04-01T15:50:14Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Dual GLSL import pipeline: turbopack.rules for dev, webpack raw-loader for prod -- .glsl/.frag/.vert files import as strings
- Perth Disruptor palette (8 tokens) wired as CSS custom properties and Tailwind v4 theme classes
- DM Sans (300-700) and JetBrains Mono (300-400) loaded via next/font/google with zero CLS
- All Phase 2+ dependencies installed: three.js, ai SDK, openai-compatible adapter

## Task Commits

Each task was committed atomically:

1. **Task 1: GLSL pipeline** - `e2305f2` (feat)
2. **Task 2: Design tokens and brand fonts** - `79d8f23` (feat)

## Files Created/Modified
- `next.config.ts` - Turbopack rules + webpack raw-loader for GLSL, turbopack.root
- `src/types/glsl.d.ts` - TypeScript module declarations for .glsl, .frag, .vert
- `src/shaders/test.frag` - Minimal fragment shader for pipeline verification
- `src/app/globals.css` - Perth Disruptor palette, Tailwind v4 @theme inline tokens
- `src/app/layout.tsx` - DM Sans + JetBrains Mono fonts, Good'ai metadata
- `src/app/not-found.tsx` - Custom 404 page
- `package.json` - Added three, ai, @ai-sdk/openai-compatible, raw-loader, @types/three, cross-env

## Decisions Made
- Added `cross-env` dev dependency to fix `NODE_ENV=production` on Windows -- `next build` was failing with `useContext` null error when NODE_ENV was set to `development` (the shell default)
- Set `turbopack.root: process.cwd()` to silence the "inferred workspace root" warning caused by a parent-directory lockfile
- Dark-only palette -- no `prefers-color-scheme` media query per plan spec

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed NODE_ENV=development causing build failure**
- **Found during:** Task 1 (build verification)
- **Issue:** `npm run build` failed with `TypeError: Cannot read properties of null (reading 'useContext')` on `/_global-error` prerender. Root cause: shell had `NODE_ENV=development` which caused Next.js 16 internal SSR to fail during prerendering.
- **Fix:** Added `cross-env` and updated build script to `cross-env NODE_ENV=production next build`
- **Files modified:** package.json
- **Verification:** `npm run build` succeeds with 0 errors
- **Committed in:** e2305f2 (Task 1 commit)

**2. [Rule 3 - Blocking] Silenced turbopack workspace root warning**
- **Found during:** Task 1 (build verification)
- **Issue:** Next.js detected a parent-directory `pnpm-lock.yaml` and inferred wrong workspace root
- **Fix:** Added `turbopack.root: process.cwd()` to next.config.ts
- **Files modified:** next.config.ts
- **Verification:** Warning no longer appears in build output
- **Committed in:** e2305f2 (Task 1 commit)

**3. [Rule 2 - Missing Critical] Added not-found.tsx page**
- **Found during:** Task 1 (build verification)
- **Issue:** Default `/_not-found` page was failing to prerender (same NODE_ENV issue, but custom page prevents future issues)
- **Fix:** Created `src/app/not-found.tsx` with basic 404 UI using design tokens
- **Files modified:** src/app/not-found.tsx
- **Verification:** Build prerenders `/_not-found` successfully
- **Committed in:** e2305f2 (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (2 blocking, 1 missing critical)
**Impact on plan:** All fixes necessary for build to succeed. No scope creep.

## Issues Encountered
- Pre-existing build failure: Next.js 16.2.1 + React 19.2.4 fails to prerender internal pages when NODE_ENV is not `production`. Resolved by explicit `cross-env NODE_ENV=production` in build script.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- GLSL pipeline ready for Phase 2 shader development (import .frag/.vert as strings)
- Design tokens ready for all UI components (bg-surface, text-accent, etc.)
- Fonts ready for typography (font-sans = DM Sans, font-mono = JetBrains Mono)
- three.js installed for Phase 2 shader scene

## Self-Check: PASSED

All 7 files verified present. Both task commits (e2305f2, 79d8f23) verified in git log. `npm run build` passes cleanly.

---
*Phase: 01-foundation*
*Completed: 2026-04-01*
