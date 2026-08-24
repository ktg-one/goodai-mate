---
last_mapped_commit: 499a6fa1425d928d77d272e4bc4eb0e029745c14
---
<!-- refreshed: 2026-08-24 -->
# Architecture

**Analysis Date:** 2026-08-24

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Next.js 16 App Router (goodai.au marketing site)                        │
│  `src/app/layout.tsx`  ·  `src/app/page.tsx`  ·  force-dynamic           │
├─────────────────────┬──────────────────────┬─────────────────────────────┤
│  Voice Agent Hero   │  Mail-board page     │  Marketing sections         │
│  `VoiceAgentHero`   │  `HomeClient.tsx`    │  `src/components/marketing/`│
│  + `Visualizer`     │  GSAP ScrollTrigger  │  Why / Manifest / Solutions │
└──────────┬──────────┴──────────┬───────────┴──────────────┬──────────────┘
           │                     │                          │
           ▼                     ▼                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Client interaction layer                                                │
│  Chat (`ChatInterface`) · Lead (`LeadCaptureCard`) · Analyzer · Playground│
│  Motion (`motion/react`) + GSAP (`useGSAP`) — do not fight each other    │
└──────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  App Router route handlers `src/app/api/*/route.ts`                      │
│  chat · tts · analyze-website · demo-automation · trigger-call           │
└──────────┬──────────────────────┬─────────────────────┬──────────────────┘
           ▼                      ▼                     ▼
┌────────────────────┐  ┌────────────────────┐  ┌─────────────────────────┐
│ Vercel AI Gateway  │  │ ElevenLabs TTS     │  │ GWS CLI + n8n webhooks  │
│ + chatPersona      │  │ `ELEVEN_API_KEY`   │  │ local execFile (dev)    │
└────────────────────┘  └────────────────────┘  └─────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Design tokens + public assets                                           │
│  `src/app/tokens/` · `src/app/globals.css` · `public/assets/` · fonts    │
└──────────────────────────────────────────────────────────────────────────┘
```

There is **no** `proxy.ts` / `middleware.ts`. Routing is a single `/` page plus `/api/*` handlers. `not-found` and `global-error` are token-only fallbacks.

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | Fonts, metadata, `dynamic = 'force-dynamic'`, html/body shell | `src/app/layout.tsx` |
| Home page | SEO metadata + render `HomeClient` | `src/app/page.tsx` |
| HomeClient | Mail-board composition, GSAP ribbons/dockets, section order, filed-mail state | `src/components/HomeClient.tsx` |
| VoiceAgentHero | Mic → Supertonic ASR → `/api/chat` → `/api/tts`; stamp-box hero; `onMailFiled` | `src/components/voice-agent/VoiceAgentHero.tsx` |
| Visualizer | Three.js / GLSL paper-audio visual in hero | `src/components/hero/Visualizer.tsx` |
| ChatInterface | Text chat via `@ai-sdk/react` `useChat` → `/api/chat`; reveals lead card | `src/components/ChatInterface.tsx` |
| LeadCaptureCard | GAS webhook + `/api/demo-automation` lead submit | `src/components/LeadCaptureCard.tsx` |
| WebsiteAnalyzer | Crawl demo UI → `/api/analyze-website` | `src/components/marketing/WebsiteAnalyzer.tsx` |
| AutomationPlayground | Interactive GWS/n8n demo → `/api/demo-automation` | `src/components/AutomationPlayground.tsx` |
| OutboundCallCard | Phone callback → `/api/trigger-call` | `src/components/voice-agent/OutboundCallCard.tsx` |
| StampButton / StampCard | Brutalist stamp primitives | `src/components/StampButton.tsx`, `src/components/StampCard.tsx` |
| Marketing sections | Static narrative + ScrollReveal | `src/components/marketing/*.tsx` |
| chatPersona | System prompt for intake assistant | `src/lib/chatPersona.ts` |
| supertonic | Local ASR adapter | `src/lib/voice/supertonic.ts` |
| API chat | Stream/generate via Vercel AI Gateway | `src/app/api/chat/route.ts` |
| API tts | ElevenLabs streaming MP3 | `src/app/api/tts/route.ts` |

## Pattern Overview

**Overall:** Next.js 16 App Router **single-page marketing site** with a client-heavy “mail board” UI and thin BFF route handlers.

**Key Characteristics:**
- One public page (`src/app/page.tsx`) composed entirely by `HomeClient` (`'use client'`).
- Design system is CSS tokens + stamp primitives, not a multi-route app.
- Interactive demos (voice, chat, analyzer, playground) call same-origin `/api/*`.
- Motion split: **Motion** for hero stamp-box / whileInView; **GSAP ScrollTrigger** for page-level ribbons, pinned notices, footer clack.
- `export const dynamic = 'force-dynamic'` on layout to avoid prerender crashes from client/motion trees.

## Layers

**App Router shell:**
- Purpose: HTML document, fonts, global CSS, metadata, error/404.
- Location: `src/app/`
- Contains: `layout.tsx`, `page.tsx`, `globals.css`, `tokens/*.css`, `global-error.tsx`, `not-found.tsx`
- Depends on: `next/font`, public fonts under `public/fonts/`
- Used by: Next.js runtime

**Page composition (mail board):**
- Purpose: Section order, GSAP orchestration, lift voice transcripts into in-tray dockets.
- Location: `src/components/HomeClient.tsx`
- Contains: refs, ScrollTrigger timelines, `filedMails` state
- Depends on: marketing components, `VoiceAgentHero`, `ChatInterface`, `motion/react`, `gsap`
- Used by: `src/app/page.tsx`

**Feature UI:**
- Purpose: Voice, chat, leads, analyzer, playground.
- Location: `src/components/` (`voice-agent/`, `hero/`, `marketing/`, root feature files)
- Contains: `'use client'` React components
- Depends on: `/api/*`, `src/lib/*`, stamp primitives
- Used by: `HomeClient`

**Primitives / brand:**
- Purpose: Stamp buttons/cards, wordmark, shadcn-style `ui/` kit.
- Location: `src/components/StampButton.tsx`, `src/components/StampCard.tsx`, `src/components/brand/`, `src/components/ui/`
- Depends on: `cn()` in `src/lib/utils.ts`, CVA, Radix
- Used by: feature UI

**BFF / route handlers:**
- Purpose: Keep secrets server-side; proxy AI, TTS, GWS, n8n.
- Location: `src/app/api/*/route.ts`
- Contains: `POST` handlers, `execFile` GWS helpers
- Depends on: env vars, `@ai-sdk/openai-compatible`, `ai`
- Used by: client `fetch` from components

**Lib:**
- Purpose: Persona prompt, ASR adapter, `cn()`.
- Location: `src/lib/`
- Depends on: fetch / clsx
- Used by: API routes and client voice/chat

**Design / static:**
- Purpose: Tokens, logos, fonts, standalone design HTML (not App Router).
- Location: `src/app/tokens/`, `public/`
- Used by: CSS and `<img>` / next/font

## Data Flow

### Primary Request Path (marketing page)

1. Request hits App Router (`src/app/layout.tsx`) — fonts + `force-dynamic`.
2. `src/app/page.tsx` exports metadata and renders `HomeClient`.
3. `HomeClient` mounts after a zero-timeout `mounted` gate (`src/components/HomeClient.tsx`), then GSAP `useGSAP` registers ScrollTriggers on `.mail-board`.
4. Sections render in order: `VoiceAgentHero` → Why / Manifest / AISolutions / VoiceAgentDemo / playground / analyzer / chat / docket / footer.

### Voice agent loop

1. User records in `VoiceAgentHero` (`src/components/voice-agent/VoiceAgentHero.tsx`).
2. Blob posted to local Supertonic via `transcribeWithSupertonic` (`src/lib/voice/supertonic.ts`).
3. Transcript `POST /api/chat` with `{ message }` → `generateText` (`src/app/api/chat/route.ts`).
4. Reply `POST /api/tts` → ElevenLabs stream (`src/app/api/tts/route.ts`).
5. `onMailFiled(transcript, response)` updates `filedMails` in `HomeClient` and snaps ribbon CSS vars.

### Text chat + lead

1. `ChatInterface` `useChat` + `DefaultChatTransport({ api: '/api/chat' })` (`src/components/ChatInterface.tsx`).
2. Stream path uses `messages` array + `streamText` + `toUIMessageStreamResponse()` (`src/app/api/chat/route.ts`).
3. On first finish, `LeadCaptureCard` appears.
4. Submit: optional `NEXT_PUBLIC_GWS_SCRIPT_URL` then `POST /api/demo-automation` (`src/components/LeadCaptureCard.tsx`).

### Website analyzer

1. `WebsiteAnalyzer` `POST /api/analyze-website` (`src/components/marketing/WebsiteAnalyzer.tsx`).
2. Handler fetches HTML, regex emails, optional GWS, `generateText` for proposal (`src/app/api/analyze-website/route.ts`).

### Outbound call

1. `OutboundCallCard` `POST /api/trigger-call` (`src/components/voice-agent/OutboundCallCard.tsx`).
2. n8n webhook + optional GWS (`src/app/api/trigger-call/route.ts`).

**State Management:**
- No global store (no Redux/Zustand). React `useState`/`useRef` in `HomeClient` and feature components.
- CSS custom properties (`--hero-filing-progress`, `--tape-shear`, `--board-depth`) as shared motion bus between Motion hero and GSAP board.
- Server routes are stateless per request. GWS/n8n are side effects.
- Local ASR default `http://localhost:8000/transcribe`.

## Key Abstractions

**Mail board:**
- Purpose: Entire page as a physical docket/ribbon stack.
- Examples: `src/components/HomeClient.tsx`
- Pattern: GSAP context scoped to `mailBoardRef`; reduced-motion static imprints.

**Stamp primitives:**
- Purpose: One red accent, 2px ink border, hard shadow “clack”.
- Examples: `src/components/StampButton.tsx`, `src/components/StampCard.tsx`
- Pattern: Direct default imports (avoid `src/components/brand/StampButton.tsx` re-export).

**Voice pipeline:**
- Purpose: ASR → persona LLM → TTS.
- Examples: `src/lib/voice/supertonic.ts`, `src/app/api/chat/route.ts`, `src/app/api/tts/route.ts`
- Pattern: Sequential fetch; status enum `idle | listening | thinking | speaking | error`.

**BFF GWS helper:**
- Purpose: `execFile` Google Workspace CLI at hardcoded `GWS_PATH`.
- Examples: duplicated in `src/app/api/demo-automation/route.ts`, `analyze-website/route.ts`, `trigger-call/route.ts`
- Pattern: Copy-paste `runGwsCommand`, not a shared module.

**Persona:**
- Purpose: Perth SME intake voice; no “AI” jargon.
- Examples: `src/lib/chatPersona.ts` `SYSTEM_PROMPT`
- Pattern: String constant imported only by chat route.

**`cn()`:**
- Purpose: Tailwind class merge.
- Examples: `src/lib/utils.ts`
- Pattern: `clsx` + `tailwind-merge`.

## Entry Points

**HTTP document:**
- Location: `src/app/layout.tsx` + `src/app/page.tsx`
- Triggers: Browser GET `/`
- Responsibilities: Fonts, metadata, render home client

**API:**
- Location: `src/app/api/chat/route.ts`, `tts/route.ts`, `analyze-website/route.ts`, `demo-automation/route.ts`, `trigger-call/route.ts`
- Triggers: Client `fetch` POST
- Responsibilities: Validate JSON, env-gate secrets, proxy vendors, JSON or stream response

**Error surfaces:**
- Location: `src/app/global-error.tsx`, `src/app/not-found.tsx`
- Triggers: Uncaught root error / unknown path
- Responsibilities: Token-only UI; no GSAP/Motion (prerender-safe)

**Design playgrounds (not production App Router):**
- Location: `public/hero/`, `public/voice-feature/`, `public/preview/`
- Triggers: Static files / separate Vite apps
- Responsibilities: Brand experiments; excluded from `tsconfig.json`

## Architectural Constraints

- **Threading:** Node/Next event loop. GWS via `child_process.execFile`. Audio via Web Audio + MediaRecorder on client. Three.js on main thread in `Visualizer`.
- **Global state:** GSAP plugin register at module scope in `HomeClient`. `--hero-filing-progress` written on `document.documentElement` from `VoiceAgentHero`.
- **Circular imports:** Not detected as a cycle; `brand/StampButton` re-exports root `StampButton`.
- **No middleware/proxy:** Do not add auth gates unless a new product surface needs them.
- **Hardcoded GWS path:** `D:\\packages\\npm-global\\node_modules\\@googleworkspace\\cli\\run.js` — Vercel deploys cannot run this CLI.
- **Direct imports:** Feature code should import `@/components/StampButton` not barrels (`HomeClient` comments).
- **GLSL:** `next.config.ts` raw-loader for `*.glsl|vert|frag`.

## Anti-Patterns

### Fight GSAP with Motion on the same transform

**What happens:** Applying Motion `whileInView` transforms on elements also driven by ScrollTrigger ribbons.
**Why it's wrong:** Two animation systems own the same node; scrub and clack desync.
**Do this instead:** Motion on hero stamp-box (`VoiceAgentHero`); GSAP on `.mail-board` ribbons/dockets (`HomeClient`). Comments in `HomeClient` already encode this.

### Import stamp via brand barrel

**What happens:** `import { StampButton } from '@/components/brand'`
**Why it's wrong:** Duplicate `src/components/brand/StampButton.tsx` is a legacy shim.
**Do this instead:** `import StampButton from '@/components/StampButton'`

### Call AI Gateway from the browser

**What happens:** Putting `AI_GATEWAY_API_KEY` in client code.
**Why it's wrong:** Key leaks; persona lives on server.
**Do this instead:** `POST /api/chat` only (`src/app/api/chat/route.ts`).

### Add Motion/GSAP to `global-error`

**What happens:** Client context in isolated prerender of `/_global-error`.
**Why it's wrong:** Build crashes (`layout.tsx` comments).
**Do this instead:** Keep `src/app/global-error.tsx` token-only.

### Duplicate `runGwsCommand` in a fourth route

**What happens:** Another copy of `GWS_PATH` + `execFile`.
**Why it's wrong:** Three copies already diverge (analyze swallows errors; others throw).
**Do this instead:** Extract `src/lib/gws.ts` if adding GWS again.

## Error Handling

**Strategy:** Per-route try/catch returning HTTP status JSON; client local `error` state. Root `global-error` logs `console.error` and offers reset.

**Patterns:**
- Chat: 503 if no `AI_GATEWAY_API_KEY`; 400 empty messages; 500 catch (`src/app/api/chat/route.ts`).
- TTS: 400 missing text; 500 missing key; 502 ElevenLabs (`src/app/api/tts/route.ts`).
- Analyzer: GWS failure returns `null` and continues scrape (`src/app/api/analyze-website/route.ts`).
- Voice hero: status `'error'` + user-facing string; ASR/TTS failures do not crash the page.
- Chat UI: `error?.message` fallback “Something went sideways…” (`src/components/ChatInterface.tsx`).

## Cross-Cutting Concerns

**Logging:** `console.error` in API GWS helpers and `global-error`. Demo UIs append fake `[SYSTEM]` log lines for the “terminal” aesthetic.

**Validation:** Manual JSON field checks (`phone`, `url`, `text`, `messages`). `zod` is a dependency; route handlers do not currently use Zod schemas. `src/types/api.d.ts` defines unused generic `ApiResponse` wrappers.

**Authentication:** None on public site or API routes. Secrets via env (`AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`, `N8N_CALL_WEBHOOK_URL`, `NEXT_PUBLIC_GWS_SCRIPT_URL`). Do not read `.env*` contents.

**A11y motion:** `useReducedMotion` + `prefers-reduced-motion` matchMedia kill ScrollTriggers in `HomeClient`.

**Styling:** CSS variables from `src/app/tokens/` imported in `src/app/globals.css`; Tailwind v4 `@theme` maps font families.

---

*Architecture analysis: 2026-08-24*
*Update when major patterns change*
