# Integrations

Mapped: 2026-05-25

## Product Assumption

The intended integration surface is the Next.js site.
The Gemini Live integration under `public/voice-feature/` is documented only as a stray prototype/reference, not as the current site direction.

## Vercel Hosting

- `vercel.json` declares the framework as Next.js.
- `src/app/layout.tsx` exports `dynamic = 'force-dynamic'`.
- `src/app/page.tsx` also exports `dynamic = 'force-dynamic'`.
- `src/app/api/chat/route.ts` exports `maxDuration = 60`, which is relevant to Vercel route execution limits.

## Vercel AI Gateway

- `src/app/api/chat/route.ts` creates an OpenAI-compatible client through `createOpenAICompatible`.
- The base URL is `https://ai-gateway.vercel.sh/v1`.
- The API key comes from `process.env.AI_GATEWAY_API_KEY`.
- The selected model is `anthropic/claude-sonnet-4-20250514`.
- The route streams output using `streamText` and returns `toUIMessageStreamResponse()`.
- The system prompt comes from `src/lib/chatPersona.ts`.

## Chat API Contract

- Endpoint: `POST /api/chat` from `src/app/api/chat/route.ts`.
- Expected body shape: `{ messages: UIMessage[] }`.
- Invalid or empty `messages` returns `{ error: 'Messages array required' }` with status 400.
- Valid requests are converted with `convertToModelMessages(messages)`.
- Output token cap is currently `maxOutputTokens: 300`.

## Web3Forms Lead Capture

- `src/components/LeadCaptureCard.tsx` posts to `https://api.web3forms.com/submit`.
- It sends `access_key`, `subject`, `from_name`, contact fields, the first visitor message, and the conversation transcript.
- The access key is read from `process.env.NEXT_PUBLIC_WEB3FORMS_KEY`.
- Provider errors are swallowed intentionally so the visitor is not blocked.
- The current form marks success after the fetch attempt regardless of provider response content.

## Fonts

- `src/app/layout.tsx` uses `next/font/google` for DM Sans and JetBrains Mono.
- `src/app/layout.tsx` uses `next/font/local` for two Fraunces files under `public/fonts/`.
- Current concern: both Fraunces files in `public/fonts/` are zero-byte files, so font loading/build behavior is likely broken.

## Images And Brand Assets

- `src/components/HeroSection.tsx` uses `next/image`.
- It references `/assets/logo-mark.svg`.
- Current concern: `public/assets/logo-mark.svg` is not present in the current file list.
- Current concern: `public/assets/` now only contains `public/assets/goodai/uploads/G.jpg`, so the active hero asset path must be repointed or restored.

## No Current Database

- `DATABASE_URL` exists in `.env.example`.
- No database client, ORM, migrations, or data access layer were found in `src/`.
- No server action or API route currently persists lead data.

## No Current Auth Provider

- `AUTH_SECRET` exists in `.env.example`.
- No auth library or authenticated route group was found.
- No middleware file was found.

## Voice Feature Prototype

- `public/voice-feature/server.ts` uses `@google/genai`, Express, and `ws`.
- It expects `GEMINI_API_KEY`.
- It opens a WebSocket endpoint at `/ws/live`.
- It uses model `gemini-3.1-flash-live-preview`.
- Because the product is meant to be the Next site, this folder should not drive architecture until explicitly adopted.
