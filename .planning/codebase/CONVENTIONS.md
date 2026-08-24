---
last_mapped_commit: 499a6fa1425d928d77d272e4bc4eb0e029745c14
---
# Coding Conventions

**Analysis Date:** 2026-08-24

## Naming Patterns

**Files:**
- PascalCase `.tsx` for React components (`src/components/ChatInterface.tsx`, `src/components/StampButton.tsx`)
- kebab-case folders for feature groups (`src/components/voice-agent/`, `src/components/marketing/`)
- lowercase `route.ts` for App Router API handlers (`src/app/api/chat/route.ts`)
- camelCase for lib/modules (`src/lib/chatPersona.ts`, `src/lib/voice/supertonic.ts`)
- shadcn primitives stay lowercase in `src/components/ui/` (`button.tsx`, `dialog.tsx`)
- Test files: `*.spec.js` only today (`src/capture.spec.js`); no `*.test.ts` suite

**Functions:**
- camelCase for functions and handlers (`handleMailFiled` in `src/components/HomeClient.tsx`, `getMessageText` in `src/components/ChatInterface.tsx`)
- No `async` prefix on async functions
- Route handlers: export `POST` / `GET` named HTTP methods (`src/app/api/chat/route.ts`)
- Event/state handlers: `handle*` or `on*` props (`onFirstResponse`, `onClick`)

**Variables:**
- camelCase for locals and state (`showTextMode`, `filedMails`)
- UPPER_SNAKE_CASE for module constants (`SYSTEM_PROMPT` in `src/lib/chatPersona.ts`, `GWS_PATH` in `src/app/api/analyze-website/route.ts`)
- CSS custom properties: `--paper`, `--ink`, `--font-display` (see `src/app/tokens/`)
- No underscore-private prefix

**Types:**
- PascalCase interfaces, no `I` prefix (`ChatInterfaceProps`, `StampButtonProps`, `AnalyzePayload`)
- Place props interface immediately above the component (`src/components/ChatInterface.tsx`)
- Export props when reused (`export interface StampButtonProps` in `src/components/StampButton.tsx`)
- Env typing in `src/types/env.d.ts`; shader modules in `src/types/glsl.d.ts`

## Code Style

**Formatting:**
- Prettier / Biome: Not detected (no `.prettierrc`, no `biome.json`)
- Mix of single quotes (app/marketing components) and double quotes (shadcn `src/components/ui/`, `src/app/layout.tsx`)
- Semicolons: required in app TS/TSX (`src/app/page.tsx`); omitted in shadcn `src/lib/utils.ts` and some `ui/` files — match the file you edit
- Indentation: 2 spaces
- `'use client'` at the top of interactive components; quote style matches the file (single in `HomeClient.tsx`, double in `src/components/ui/form.tsx`)

**Linting:**
- ESLint 9 flat config: `eslint.config.mjs`
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores `.next/**`, `out/**`, `build/**`, `next-env.d.ts`, `public/**`
- Run: `npm run lint` (`eslint .`)
- TypeScript: `strict: true` in `tsconfig.json`; path alias `@/*` → `./src/*`

## Import Organization

**Order (match `src/components/HomeClient.tsx`):**
1. `'use client'` directive when needed
2. React / framework (`react`, `next/font`, `next`)
3. External packages (`ai`, `gsap`, `motion/react`, `lucide-react`)
4. Internal `@/` modules — **direct file paths, not barrels**
5. Type-only imports when types-only (`import type { Metadata } from 'next'`)

**Grouping:**
- Blank line between directive, externals, and `@/` internals
- Comments allowed to explain import policy (HomeClient documents AGENTS.md direct-import rule)

**Path Aliases:**
- `@/` maps to `src/` (`tsconfig.json` `paths`)
- shadcn aliases in `components.json`: `@/components`, `@/lib/utils`, `@/components/ui`
- Import UI pieces from the file: `import { Button } from '@/components/ui/button'` — do not `from '@/components/ui'`
- Prefer `import StampButton from '@/components/StampButton'` over `src/components/brand/` (legacy note in `src/components/brand/StampButton.tsx`)

## Error Handling

**Patterns:**
- API routes: wrap handler in `try/catch`; return JSON `{ error }` with HTTP status (`src/app/api/chat/route.ts`)
- Narrow unknown: `error instanceof Error ? error.message : 'Chat error occurred'`
- Missing config: 503 with user-safe copy when `AI_GATEWAY_API_KEY` is absent
- Validation: manual checks (`!url`, `Messages array required`) — Zod is a dependency and skill-prescribed; existing routes often skip Zod
- `global-error.tsx` and `not-found.tsx` must be client-safe; `global-error.tsx` is `'use client'` and logs `console.error(error)`
- Child process / GWS helpers: catch, `console.error`, return `null` so analysis continues (`src/app/api/analyze-website/route.ts`)

**Error Types:**
- Throw only for unexpected failures; expected API failures return `Response` / `NextResponse.json`
- Do not leak stack traces to clients; generic 500 body
- `src/app/layout.tsx` uses `export const dynamic = 'force-dynamic'` to avoid prerender crashes in error boundaries

## Logging

**Framework:**
- `console` only — no pino/winston
- Levels used: `console.error` for failures; Playwright capture script uses `console.log` for screenshot debug

**Patterns:**
- Prefix operational logs: `[API]`, `[SYSTEM]`, `[ANALYZER]`, `GWS execution failed:` (`src/app/api/analyze-website/route.ts`)
- Client catch: `console.error(err)` (`src/components/hero/Hero.tsx`, `src/components/AutomationPlayground.tsx`)
- Do not add `console.log` to production UI components

## Comments

**When to Comment:**
- Explain constraints and design-system rules (stamp physics, GSAP vs motion in `HomeClient.tsx`, `StampButton.tsx`)
- Document why `force-dynamic` exists (`src/app/layout.tsx`)
- Avoid narrating obvious assignments

**JSDoc/TSDoc:**
- Block comment on public primitives (`StampButton`) covering variants, usage, and import path
- Props fields use short `/** */` on interfaces

**TODO Comments:**
- Not detected in `src/`

## Function Design

**Size:**
- Keep page shells thin: `src/app/page.tsx` only sets metadata and renders `HomeClient`
- Interactive pages may be large (`HomeClient.tsx`); extract sections into `src/components/marketing/`
- Helpers colocated in the same file when private (`isTextPart`, `getMessageText` in `ChatInterface.tsx`)

**Parameters:**
- Destructure props in the signature
- Defaults in destructure (`variant = 'red'`, `initialMessage = ''`)
- `forwardRef` for polymorphic stamp primitives

**Return Values:**
- Early return for empty UI (`if (!text) return null` in `ChatMessage`)
- API: `Response.json` / `NextResponse.json` with explicit status

## Module Design

**Exports:**
- **Default export** for page components and feature components (`export default function ChatInterface`)
- Named exports for shadcn UI (`export { Button, buttonVariants }`) and for GSAP/hero pieces (`export { Visualizer } from './Visualizer'`)
- Named export for shared constants (`SYSTEM_PROMPT`)
- `cn()` named export from `src/lib/utils.ts` — use it for class merging

**Barrel Files:**
- Avoid new barrels. Skills (`component-builder`) and `HomeClient` require **direct imports**
- Existing barrels: `src/components/hero/index.ts`, `src/components/brand/index.ts`, `src/components/voice-agent/index.ts` — do not add more; import the concrete file
- One primary component per feature file

**RSC vs client:**
- Server Components by default (`src/app/page.tsx` has no `'use client'`)
- `'use client'` only for state, GSAP, motion, hooks (`HomeClient.tsx`, `ChatInterface.tsx`, shadcn `dialog`/`form`/`label`)
- Push client boundary to the smallest interactive leaf when adding new UI

**Styling:**
- Tailwind v4 + design tokens in `src/app/tokens/` and `src/app/globals.css`
- Brutalist marketing UI: `StampButton` / `StampCard` and CSS vars (`--paper`, `--ink`), not generic shadcn `Button`, unless editing `src/components/ui/`
- Use `cn()` for conditional classes; do not concatenate class strings

---

*Convention analysis: 2026-08-24*
*Update when patterns change*
