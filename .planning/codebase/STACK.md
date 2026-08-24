---
last_mapped_commit: 499a6fa1425d928d77d272e4bc4eb0e029745c14
---
# Technology Stack

**Analysis Date:** 2026-08-24

## Languages

**Primary:**
- TypeScript 5.x (`typescript` in `package.json`, `strict: true` in `tsconfig.json`) — all application code under `src/` (`*.ts`, `*.tsx`)

**Secondary:**
- CSS (Tailwind v4 + custom tokens) — `src/app/globals.css`, `src/app/tokens/*.css`
- JavaScript — `google-apps-script.js` (Google Apps Script lead webhook), `src/capture.spec.js` (Playwright screenshot helper)
- GLSL loaders configured in `next.config.ts` (`.glsl` / `.vert` / `.frag` via `raw-loader`); no shader source files in `src/` at map time
- HTML static brand/preview kits under `public/` (not compiled by the Next app)

## Runtime

**Environment:**
- Node.js `>=20.9.0 <21` (`package.json` `engines`; `.nvmrc` is `20`)
- Browser: React 19 client components for GSAP, Motion, Web Audio, MediaRecorder (`src/components/`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js `^16.2.3` — App Router marketing site (`src/app/`); `next dev` / `next build` / `next start`; Turbopack default (`next.config.ts` `turbopack` + webpack fallback for GLSL)
- React `19.2.4` / `react-dom` `19.2.4` — UI; mix of Server Components (default) and `'use client'` for interactivity
- Tailwind CSS v4 (`tailwindcss` `^4` + `@tailwindcss/postcss`) — `@import "tailwindcss"` and `@theme` in `src/app/globals.css`; no `tailwind.config.js`

**Testing:**
- Playwright `^1.60.0` (`@playwright/test`) — `src/capture.spec.js` screenshot/style capture against `http://localhost:3000`; no `playwright.config.*` and no `npm test` script
- ESLint 9 + `eslint-config-next` `16.2.1` — `eslint.config.mjs`; `npm run lint`

**Build/Dev:**
- Next.js / Turbopack — primary bundler
- TypeScript compiler (`noEmit: true`) — typecheck via Next
- PostCSS — `postcss.config.mjs` with `@tailwindcss/postcss` only
- `raw-loader` — shader-as-string for webpack and Turbopack rules in `next.config.ts`
- Nested Vite + Express prototypes (not the production app): `public/hero/package.json`, `public/voice-feature/package.json` (Vite 6, `@google/genai`, Express, `tsx`)

## Key Dependencies

**Critical:**
- `next` `^16.2.3` — App Router, Route Handlers, `next/font`
- `react` / `react-dom` `19.2.4` — UI
- `ai` `^6.0.142` + `@ai-sdk/openai-compatible` + `@ai-sdk/react` — Vercel AI SDK chat/stream (`src/app/api/chat/route.ts`, `src/app/api/analyze-website/route.ts`, `src/components/ChatInterface.tsx`)
- `gsap` `^3.15.0` + `@gsap/react` — ScrollTrigger mail-board motion (`src/components/HomeClient.tsx`, `src/components/ScrollReveal.tsx`)
- `motion` `^12.40.0` — Voice hero stamp/scroll physics (`src/components/voice-agent/VoiceAgentHero.tsx`)
- `zod` `^4.3.6` — schema/validation (dependency present; use for new API bodies per `.agents/skills/nextjs-dev/SKILL.md`)
- `lucide-react` — icons
- `class-variance-authority` + `clsx` + `tailwind-merge` — shadcn `cn()` in `src/lib/utils.ts`

**Infrastructure:**
- `radix-ui` `^1.4.2` — primitives behind `src/components/ui/*` (shadcn new-york, `components.json`)
- `react-hook-form` — form primitives (`src/components/ui/form.tsx`)
- `@tailwindcss/typography` — prose
- `three` `^0.183.2` — listed in `package.json`; no `src/` imports at map time (Visualizer is canvas/2D in `src/components/hero/Visualizer.tsx`)
- `headroom-ai` `^0.22.4` — listed; no `src/` imports (dev/MCP context, not runtime UI)
- `present` / `scripts` — listed; treat as unused unless a new feature imports them

## Configuration

**Environment:**
- Server/client env via `process.env` (never commit values). Typed stubs in `src/types/env.d.ts` lag real usage — implement against **used** names in `src/`:
  - `AI_GATEWAY_API_KEY` — `src/app/api/chat/route.ts`, `src/app/api/analyze-website/route.ts`
  - `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE` — `src/app/api/tts/route.ts`
  - `N8N_CALL_WEBHOOK_URL` — `src/app/api/trigger-call/route.ts`
  - `NEXT_PUBLIC_GWS_SCRIPT_URL` — `src/components/LeadCaptureCard.tsx`
- `src/types/env.d.ts` also declares unused-in-src names: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, `DATABASE_URL`, `AUTH_SECRET`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `NEXT_PUBLIC_ENABLE_ANALYTICS` — do not assume a database or auth stack exists
- Nested prototypes: `GEMINI_API_KEY` in `public/hero/server.ts` and `public/voice-feature/server.ts` (Vite/Express only)
- `.env` / `.env.local` may exist locally — gitignored; do not read or quote

**Build:**
- `next.config.ts` — Turbopack root `process.cwd()`, GLSL loaders
- `tsconfig.json` — `paths`: `@/*` → `./src/*`; exclude `public/hero`, `public/voice-feature`, `public/ui_kits`, `public/preview`
- `eslint.config.mjs` — `eslint-config-next` core-web-vitals + typescript; ignores `.next/**`, `out/**`, `build/**`, `public/**`
- `components.json` — shadcn: new-york, RSC, CSS variables, `src/app/globals.css`
- `vercel.json` — `{ "framework": "nextjs" }`
- `postcss.config.mjs`

## Platform Requirements

**Development:**
- Windows-native Node 20.x (`.nvmrc` `20`); `npm install` then `npm run dev` → `http://localhost:3000` (`README.md`)
- Optional local services for hero/demo: Supertonic ASR `http://localhost:8000/transcribe` (`src/lib/voice/supertonic.ts`), n8n `http://localhost:5678` webhooks, Google Workspace CLI at hardcoded `D:\\packages\\npm-global\\node_modules\\@googleworkspace\\cli\\run.js` (`src/app/api/demo-automation/route.ts`, `analyze-website/route.ts`, `trigger-call/route.ts`)
- Do not treat `public/hero` or `public/voice-feature` as the Next app; they are standalone Vite demos

**Production:**
- Vercel Next.js hosting (`vercel.json`); root layout `export const dynamic = 'force-dynamic'` in `src/app/layout.tsx` (no static prerender)
- Domain/product: goodai.au marketing site (`README.md`)
- Node 20 on Vercel; keep `engines` in range
- Google Workspace CLI `execFile` paths will not work on Vercel — GWS demo routes are local-dev automations unless replaced with HTTP APIs

---

*Stack analysis: 2026-08-24*
*Update after major dependency changes*
