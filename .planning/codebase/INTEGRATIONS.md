---
last_mapped_commit: 499a6fa1425d928d77d272e4bc4eb0e029745c14
---
# External Integrations

**Analysis Date:** 2026-08-24

## APIs & External Services

**Payment Processing:**
- Not detected

**Email/SMS:**
- Gmail via Google Workspace CLI (`gws gmail users messages send`) — demo lead notification in `src/app/api/demo-automation/route.ts`
  - SDK/Client: local Node CLI `@googleworkspace/cli` (`GWS_PATH` hardcoded)
  - Auth: CLI login on the developer machine (not env-based in this repo)
- Google Apps Script `MailApp` — `google-apps-script.js` notifies `NOTIFY_EMAIL` (`kevinktg@goodai.au`) when a lead POSTs
- ElevenLabs TTS — streaming speech for Voice Agent hero
  - Integration: `fetch` in `src/app/api/tts/route.ts` to `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}/stream`
  - Auth: `ELEVEN_API_KEY` (header `xi-api-key`); optional `ELEVEN_DEFAULT_VOICE`
  - Model: `eleven_turbo_v2_5`; client voice picker in `src/components/voice-agent/VoiceAgentHero.tsx`

**External APIs:**
- Vercel AI Gateway (OpenAI-compatible) — chat + website analysis
  - SDK: `@ai-sdk/openai-compatible` + `ai` (`streamText` / `generateText`)
  - Auth: `AI_GATEWAY_API_KEY`
  - Base URL: `https://ai-gateway.vercel.sh/v1`
  - Model id: `anthropic/claude-sonnet-4-20250514`
  - Routes: `src/app/api/chat/route.ts` (UI stream + one-shot `{ message }`), `src/app/api/analyze-website/route.ts`
  - Client: `useChat` + `DefaultChatTransport` in `src/components/ChatInterface.tsx`; Voice hero POSTs `/api/chat`
- Target websites (unauthenticated HTML fetch) — analyzer scrapes user-supplied URL in `src/app/api/analyze-website/route.ts` (4s timeout, browser UA)
- n8n — workflow webhooks
  - Outbound call: `N8N_CALL_WEBHOOK_URL` or default `http://localhost:5678/webhook/goodai-call` (`src/app/api/trigger-call/route.ts`)
  - Lead pipeline: request `n8nUrl` or default `http://localhost:5678/webhook/goodai-demo` (`src/app/api/demo-automation/route.ts`)
  - Events: `voice_callback_requested`, `goodai_lead_captured`
- Supertonic (local ASR) — Voice Agent hero transcription
  - Integration: `POST` FormData `file` + `language=en` in `src/lib/voice/supertonic.ts`
  - Default: `http://localhost:8000/transcribe` (`VoiceAgentHero` prop `supertonicUrl`)
  - Auth: none in adapter
- Google Workspace (Sheets, Docs, Calendar, Gmail) via `gws` CLI — `src/app/api/demo-automation/route.ts`, optional GWS side-calls in `analyze-website/route.ts` and `trigger-call/route.ts`
- Nested prototypes only (not Next production): Google GenAI (`GEMINI_API_KEY`) in `public/hero/server.ts` and `public/voice-feature/server.ts`

## Data Storage

**Databases:**
- Not applicable for the marketing app — no Prisma/Supabase/DB client in `src/`
- `DATABASE_URL` appears only in `src/types/env.d.ts` (unused)
- Local agent-memory binaries (`data/state_store.db/`, `in-memoria.db`) are tooling artifacts, not application storage

**File Storage:**
- Local filesystem / `public/` static assets (`public/assets/`, `public/fonts/`, `public/hero/`)
- No S3/Supabase Storage SDK

**Caching:**
- None (Redis not present). Next layout is `force-dynamic` (`src/app/layout.tsx`)

## Authentication & Identity

**Auth Provider:**
- Not detected — no login, sessions, or JWT in `src/`
- `AUTH_SECRET` in `src/types/env.d.ts` only

**OAuth Integrations:**
- Google Workspace CLI OAuth lives on the local machine running `gws` (outside this repo)
- Google Apps Script runs as the spreadsheet owner (`google-apps-script.js`)

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry/Datadog SDK)

**Analytics:**
- None. `NEXT_PUBLIC_ENABLE_ANALYTICS` is typed in `src/types/env.d.ts` but unused

**Logs:**
- `console.error` / `console.log` in API routes (`src/app/api/*/route.ts`)
- Production: Vercel function logs (stdout)
- `src/app/global-error.tsx` — client error UI, not a third-party reporter

## CI/CD & Deployment

**Hosting:**
- Vercel — `vercel.json` `{ "framework": "nextjs" }`
- Deployment: standard Vercel Git integration (no workflow YAML in `.github/workflows/`)
- Env vars: set in Vercel project settings (`AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`, etc.)

**CI Pipeline:**
- None — `.github/` contains `prompts/` only (`mrrug.prompt.md`), no Actions workflows

## Environment Configuration

**Development:**
- Required for full Voice + chat: `AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY` (optional `ELEVEN_DEFAULT_VOICE`)
- Optional: `NEXT_PUBLIC_GWS_SCRIPT_URL` (Apps Script web app URL), `N8N_CALL_WEBHOOK_URL`
- Secrets location: `.env.local` (gitignored) — existence only; never commit values
- Local stubs: n8n on `:5678`, Supertonic on `:8000`, `gws` CLI at `D:\packages\npm-global\node_modules\@googleworkspace\cli\run.js`
- Nested Vite demos: `GEMINI_API_KEY` if running `public/hero` or `public/voice-feature`

**Staging:**
- Not detected (single Vercel project assumed)

**Production:**
- Secrets management: Vercel environment variables
- Do not rely on local `gws` `execFile` or `localhost` n8n/Supertonic on Vercel
- Failover: chat returns 503 if `AI_GATEWAY_API_KEY` missing (`src/app/api/chat/route.ts`); TTS 500 if `ELEVEN_API_KEY` missing (`src/app/api/tts/route.ts`)

## Webhooks & Callbacks

**Incoming:**
- None in the Next app (no `/api/webhooks/*`)
- Google Apps Script `doPost` in `google-apps-script.js` — deployed as a Google web app; client POSTs from `LeadCaptureCard` with `mode: 'no-cors'`

**Outgoing:**
- n8n `POST` JSON — `src/app/api/trigger-call/route.ts` (3.5s abort), `src/app/api/demo-automation/route.ts` (4s abort); timeout treated as simulated success for demos
- ElevenLabs stream proxy — `src/app/api/tts/route.ts`
- AI Gateway HTTPS — chat/analyze routes
- Apps Script URL when `NEXT_PUBLIC_GWS_SCRIPT_URL` is set

---

*Integration audit: 2026-08-24*
*Update when adding/removing external services*
