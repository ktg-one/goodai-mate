---
last_mapped_commit: 499a6fa1425d928d77d272e4bc4eb0e029745c14
---
# Codebase Structure

**Analysis Date:** 2026-08-24

## Directory Layout

```
goodai-mate/
├── src/
│   ├── app/                    # App Router: layout, home, tokens, API
│   │   ├── api/                # Route handlers (POST)
│   │   │   ├── chat/
│   │   │   ├── tts/
│   │   │   ├── analyze-website/
│   │   │   ├── demo-automation/
│   │   │   └── trigger-call/
│   │   ├── tokens/             # CSS design tokens
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── global-error.tsx
│   │   └── not-found.tsx
│   ├── components/             # All React UI
│   │   ├── brand/              # Wordmark + legacy stamp re-export
│   │   ├── hero/               # Visualizer + unused Hero
│   │   ├── marketing/          # Why, Manifest, Solutions, Analyzer, Voice demo
│   │   ├── voice-agent/        # VoiceAgentHero, OutboundCallCard
│   │   ├── ui/                 # shadcn-style primitives
│   │   ├── HomeClient.tsx      # Page composition
│   │   ├── ChatInterface.tsx
│   │   ├── LeadCaptureCard.tsx
│   │   ├── AutomationPlayground.tsx
│   │   ├── StampButton.tsx
│   │   └── StampCard.tsx
│   ├── lib/                    # cn, persona, ASR adapter
│   │   └── voice/supertonic.ts
│   ├── types/                  # api.d.ts, env.d.ts, glsl.d.ts
│   └── capture.spec.js         # Playwright capture
├── public/                     # Fonts, logos, design HTML kits
│   ├── assets/
│   ├── fonts/
│   ├── hero/                   # Isolated Vite hero (excluded from tsc)
│   ├── voice-feature/          # Isolated Vite voice demo
│   ├── preview/                # Static design-system HTML
│   └── ui_kits/
├── docs/agents/                # Domain/issue tracker notes
├── data/                       # Local memory/stream binaries (not app source)
├── .planning/                  # GSD planning docs
├── next.config.ts
├── vercel.json
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── components.json             # shadcn/ui config
└── google-apps-script.js       # GAS lead webhook script (companion)
```

## Directory Purposes

**src/app/**
- Purpose: Next.js App Router root. Only production routes live here.
- Contains: `layout.tsx`, `page.tsx`, CSS, error/404, `api/*/route.ts`
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Subdirectories: `api/` (one folder per endpoint), `tokens/` (colors, type, spacing, effects, fonts)

**src/app/api/**
- Purpose: Server `POST` handlers. One `route.ts` per capability.
- Contains: TypeScript route modules
- Key files: `chat/route.ts`, `tts/route.ts`, `analyze-website/route.ts`, `demo-automation/route.ts`, `trigger-call/route.ts`

**src/components/**
- Purpose: All React UI for the marketing site.
- Contains: `*.tsx` feature files and feature folders
- Key files: `HomeClient.tsx` (compose the page), `StampButton.tsx`, `StampCard.tsx`
- Subdirectories:
  - `marketing/` — scroll sections
  - `voice-agent/` — hero product + outbound call card
  - `hero/` — WebGL visualizer
  - `brand/` — `BrandWordmark.tsx`
  - `ui/` — badge, button, card, dialog, form, input, label, skeleton

**src/lib/**
- Purpose: Shared non-UI helpers.
- Contains: `utils.ts` (`cn`), `chatPersona.ts`, `voice/supertonic.ts`
- Key files: `src/lib/chatPersona.ts` (imported only by chat route)

**src/types/**
- Purpose: Ambient/shared TS types.
- Contains: `api.d.ts`, `env.d.ts`, `glsl.d.ts`

**public/**
- Purpose: Static assets and design-system dumps.
- Contains: SVG/PNG logos, Fraunces/DM Sans fonts, HTML previews, nested Vite sketches
- Key files: `public/assets/`, `public/fonts/`, `public/colors_and_type.css`
- Do not treat `public/hero/` or `public/voice-feature/` as App Router source (`tsconfig.json` excludes them)

**docs/agents/**
- Purpose: Agent domain notes (`domain.md`, `issue-tracker.md`, `triage-labels.md`)

**.planning/**
- Purpose: GSD project/roadmap/codebase maps. Write maps to `.planning/codebase/`

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML, fonts, `force-dynamic`
- `src/app/page.tsx`: Home metadata + `<HomeClient />`
- `src/components/HomeClient.tsx`: Mail-board page body
- `src/app/api/*/route.ts`: POST APIs
- `src/app/global-error.tsx` / `src/app/not-found.tsx`: Fallback UIs

**Configuration:**
- `package.json`: Next 16, React 19, scripts (`dev`/`build`/`start`/`lint`)
- `next.config.ts`: GLSL raw-loader (turbopack + webpack)
- `tsconfig.json`: `@/*` → `./src/*`
- `vercel.json`: `{ "framework": "nextjs" }`
- `eslint.config.mjs`: ESLint 9 + next
- `postcss.config.mjs`: Tailwind 4
- `components.json`: shadcn
- `.env.local` / `.env*`: present for secrets — **do not read or quote**

**Core Logic:**
- `src/lib/chatPersona.ts`: Intake system prompt
- `src/lib/voice/supertonic.ts`: Local ASR
- `src/components/voice-agent/VoiceAgentHero.tsx`: Voice product loop
- `src/components/ChatInterface.tsx`: Text chat + lead reveal
- `src/app/api/chat/route.ts`: LLM gateway
- `src/app/api/tts/route.ts`: ElevenLabs
- `src/app/api/demo-automation/route.ts`: GWS/n8n lead pipeline

**Testing:**
- `src/capture.spec.js`: Playwright screenshot capture
- `test-results/`: Playwright output (generated)

**Documentation:**
- `README.md`, `PRODUCT.md`, `DESIGN-GAPS.md`, `design-fidelity-scope.md`
- `public/README.md`, `public/SKILL.md`

## Naming Conventions

**Files:**
- PascalCase `.tsx` for React components: `VoiceAgentHero.tsx`, `HomeClient.tsx`
- kebab-case folders for features: `voice-agent/`, `analyze-website/`
- `route.ts` for App Router handlers
- `index.ts` barrels exist in `hero/`, `voice-agent/`, `brand/` — prefer **direct file imports** for stamps
- CSS tokens: `src/app/tokens/*.css`

**Directories:**
- kebab-case for API and feature folders
- `ui/` for generic primitives; `marketing/` for page sections

**Special Patterns:**
- `'use client'` on every interactive component
- Default export for page sections (`WhyGoodAI`, `WebsiteAnalyzer`)
- Named export for `VoiceAgentHero`, `Visualizer`, `BrandWordmark`

## Where to Add New Code

**New marketing section:**
- Primary: `src/components/marketing/YourSection.tsx`
- Wire into `src/components/HomeClient.tsx` (import + place in mail-board order)
- Tests: `src/` Playwright spec or co-located `*.spec.ts` if adding tests
- Styles: reuse tokens in `src/app/tokens/` and classes in `src/app/globals.css`; do not invent a parallel palette

**New page/route:**
- Definition: `src/app/<segment>/page.tsx`
- Shared layout already in `src/app/layout.tsx`
- There is currently only `/`. Add a folder under `src/app/` for a second URL.

**New API endpoint:**
- Handler: `src/app/api/<name>/route.ts` exporting `POST`
- Call from client with `fetch('/api/<name>')`
- Keep secrets in env; never `NEXT_PUBLIC_` for gateway/ElevenLabs keys

**New component:**
- Implementation: `src/components/<Feature>.tsx` or `src/components/<feature-folder>/`
- Stamp CTA: compose `src/components/StampButton.tsx` / `StampCard.tsx`
- Generic form bits: `src/components/ui/`
- Types: colocated or `src/types/`

**New voice/TTS behavior:**
- Client: `src/components/voice-agent/`
- ASR adapter: `src/lib/voice/`
- Server TTS: `src/app/api/tts/route.ts`

**Utilities:**
- Shared helpers: `src/lib/`
- Class merge: `cn` from `src/lib/utils.ts`

**New design token:**
- Add to the matching file under `src/app/tokens/` and consume via CSS variables in `globals.css`

**Do not add production app code in:**
- `public/hero/`, `public/voice-feature/`, `public/preview/`, `public/ui_kits/`
- `data/`, `in-memoria*.db`, root `audit-*.png`, `patch_chat*.diff`

## Special Directories

**.next/**
- Purpose: Next build output
- Generated: Yes
- Committed: No

**public/hero/ and public/voice-feature/**
- Purpose: Standalone Vite brand/voice sketches
- Generated: No
- Committed: Yes
- Excluded from TypeScript project in `tsconfig.json`

**data/ and in-memoria*.db/**
- Purpose: Local agent-memory binaries
- Generated: Runtime
- Committed: Treat as non-source

**test-results/**
- Purpose: Playwright artifacts
- Generated: Yes
- Committed: Typically no

**.planning/**
- Purpose: GSD docs
- Generated: No (hand-written maps)
- Committed: Yes

---

*Structure analysis: 2026-08-24*
*Update when directory structure changes*
