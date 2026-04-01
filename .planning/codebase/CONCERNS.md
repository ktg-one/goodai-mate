# Codebase Concerns

**Analysis Date:** 2026-04-01

## Missing Testing Infrastructure

**Unit/E2E Test Framework Not Configured:**
- Issue: CLAUDE.md specifies Vitest (unit) + Playwright (e2e) but neither is installed or configured
- Files: `package.json` (no vitest, playwright deps), `__tests__/` (empty directories)
- Impact: Cannot run tests; no testing capability despite being architectural requirement
- Fix approach: Install vitest + playwright, create vitest.config.ts, add test scripts to package.json, populate test structure

**Empty Test Directories:**
- Issue: `__tests__/unit/`, `__tests__/integration/`, `__tests__/e2e/` exist but contain no files
- Files: `/c/Users/kevin/knowledge2026/Projects-Coding/nextjs/__tests__/`
- Impact: No test coverage despite the Vercel best practices focus in CLAUDE.md
- Fix approach: Create first test file(s) to establish patterns for team

## Unimplemented Environment Variables

**Database & Auth Not Configured:**
- Issue: `src/types/env.d.ts` declares `DATABASE_URL` and `AUTH_SECRET` as required, but no .env.local or database setup exists
- Files: `src/types/env.d.ts`, `.env.example`
- Impact: App will fail if these env vars are accessed without fallbacks; no database connection layer implemented
- Fix approach: Implement database client (Prisma/Drizzle), create auth middleware, or remove unused env vars if not needed yet

**AI Provider Keys Are Optional But Unused:**
- Issue: `src/types/env.d.ts` declares optional `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY` but no code uses them
- Files: `src/types/env.d.ts`
- Impact: Type definition dead code; confuses developers about project capabilities
- Fix approach: Remove env vars if not used in current scope, or implement AI integration layer if planned

## Incomplete Configuration

**Next.js Config Is Empty:**
- Issue: `next.config.ts` contains only skeleton with `/* config options here */` comment
- Files: `next.config.ts`
- Impact: Missing critical performance/security configurations (CSP headers, compression, caching, redirects)
- Fix approach: Add production configurations per Vercel best practices mentioned in CLAUDE.md (57 Rules)

**Vercel Config Outdated:**
- Issue: `vercel.json` has incorrect settings: empty buildCommand, outputDirectory set to "public" instead of ".next"
- Files: `vercel.json` (lines 2-3)
- Impact: Vercel deployment will fail or skip builds; Edge functions not configured
- Fix approach: Update with proper Next.js build output settings and framework detection

**ESLint Config Minimal:**
- Issue: `eslint.config.mjs` only includes core-web-vitals + typescript configs, no project-specific rules
- Files: `eslint.config.mjs`
- Impact: No enforce-custom conventions (CLAUDE.md requires: no barrel imports, naming patterns, etc.)
- Fix approach: Add rules to enforce barrel import ban, naming conventions, no `any` types

## Missing Implementation of Declared Patterns

**Route Groups Not Used:**
- Issue: CLAUDE.md specifies `(marketing)`, `(app)`, `(auth)` route groups with different rendering strategies, but only `(marketing)` and `(app)` directories exist with no content
- Files: `src/app/(marketing)/`, `src/app/(app)/`, `src/app/(auth)/`
- Impact: No actual pages follow the documented rendering strategy (static/ISR/dynamic)
- Fix approach: Implement first page in each group to establish patterns

**Inbox Directory Purpose Unclear:**
- Issue: README.md and CLAUDE.md reference `/inbox` as "items user wants to translate to Next.js site" but purpose/workflow not documented
- Files: `inbox/` (contains scattered HTML, spec docs, assets, hero effect code)
- Impact: Team doesn't know conversion workflow; technical debt accumulates in inbox without clear migration path
- Fix approach: Document inbox workflow, create conversion checklist, establish definition-of-done

## Code Quality & Type Safety

**No Strict Null Checking Edge Cases:**
- Issue: `src/components/ui/form.tsx` line 46-66: `useFormField()` accesses `itemContext.id` without null check despite context being initialized as `{}`
- Files: `src/components/ui/form.tsx` (lines 45-66)
- Impact: Potential runtime error if hook called outside FormItem provider; TypeScript strict mode catches this but relies on runtime validation
- Fix approach: Add provider check or throw more descriptive error

**Incomplete Error Handling Pattern:**
- Issue: Form component's `useFormField()` (line 52-54) throws generic error if fieldContext missing, but no error boundary or fallback UI
- Files: `src/components/ui/form.tsx` (line 52-54)
- Impact: If provider chain breaks, entire form unmounts with cryptic error; no recovery
- Fix approach: Create form error boundary component, add development warnings

## Database & Secrets

**Uncommitted Database File Present:**
- Issue: `in-memoria.db` exists in project root (likely SQLite or test database)
- Files: `in-memoria.db`
- Impact: May contain test/development data; unclear if committed intentionally or oversight
- Fix approach: Verify if needed in .gitignore or move to proper location (database/ directory)

**Secrets Leak Risk in google-apps-script.js:**
- Issue: `google-apps-script.js` line 8 has hardcoded email: `NOTIFY_EMAIL = 'kevinktg@goodai.au'`
- Files: `google-apps-script.js` (line 8)
- Impact: Personal email exposed in source; should be injected via environment or script properties
- Fix approach: Move to Apps Script Properties (not code), access via PropertiesService

## Missing API Layer

**No API Routes Implemented:**
- Issue: `src/types/api.d.ts` defines `ApiResponse<T>` and `PaginatedResponse<T>` interfaces but `src/app/api/` directory is empty
- Files: `src/types/api.d.ts`, `src/app/api/`
- Impact: API contract defined but no implementations; unclear if API will be server-side or external
- Fix approach: Create first API endpoint or clarify backend architecture

**Form Library Without Forms:**
- Issue: Project has `react-hook-form` and `zod` in dependencies, full form component library in `src/components/ui/`, but no actual forms using them
- Files: `package.json`, `src/components/ui/form.tsx`, `src/app/page.tsx`
- Impact: Setup overhead without actual usage; unclear if this is template or intentional
- Fix approach: Create first form component consuming the pattern or remove if not needed

## Performance & Build

**No Dynamic Import Configuration:**
- Issue: CLAUDE.md requires "Use `next/dynamic` for heavy components (charts, editors, maps)" but no examples exist
- Files: No usage in codebase
- Impact: Future developers may add heavy components directly to page, breaking performance
- Fix approach: Add first example of dynamic import in ARCHITECTURE.md or create shared utility

**No Build Output Verification:**
- Issue: No lint/type-check in CI (no build step configured in package.json)
- Files: `package.json` (only dev/build/start/lint scripts; lint has no args)
- Impact: TypeScript/ESLint errors won't fail builds; broken code ships to production
- Fix approach: Add build script that runs: tsc --noEmit && eslint . && next build

## Documentation & Onboarding

**Error Log Section Not Maintained:**
- Issue: CLAUDE.md line 36 has "Error Log" header but no entries (empty comment)
- Files: `CLAUDE.md` (line 36-37)
- Impact: Team won't learn from past mistakes; same errors repeat
- Fix approach: Add first entry from this analysis, establish logging practice

**Incomplete README:**
- Issue: `README.md` references .mcp configuration, .claude agents, and /inbox workflow but doesn't explain them
- Files: `README.md` (lines 5-10)
- Impact: New developers can't get started; setup instructions assume external knowledge
- Fix approach: Expand setup section with .mcp links, outline .claude agent purpose, explain inbox workflow

## Dependency Risk

**Radix UI Major Version Lock:**
- Issue: `package.json` specifies `"radix-ui": "^1.4.2"` but radix-ui doesn't follow semver semantics (it's a workspace of many packages)
- Files: `package.json` (line 16)
- Impact: Unclear which radix packages are actually installed; dependency tree fragile
- Fix approach: Replace with explicit individual radix-ui package imports (e.g., @radix-ui/dialog) and fixed versions

## Scalability Concerns

**Type System Not Leveraging Generics:**
- Issue: `src/types/api.d.ts` defines generic response types but no actual usage pattern established; each API endpoint may implement differently
- Files: `src/types/api.d.ts`, `src/app/api/` (empty)
- Impact: Response contracts will be inconsistent when API endpoints are implemented
- Fix approach: Create first API endpoint using these types, document pattern in CONVENTIONS.md

**No State Management Pattern:**
- Issue: No Redux, Zustand, Context-based state management installed or documented
- Files: Architecture unclear from codebase
- Impact: As app grows, prop drilling or conflicting state patterns will emerge
- Fix approach: Document chosen state pattern in ARCHITECTURE.md, establish before building scaled features

---

*Concerns audit: 2026-04-01*
