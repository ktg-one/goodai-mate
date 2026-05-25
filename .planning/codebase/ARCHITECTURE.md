# Architecture

Mapped: 2026-05-25

## Product Assumption

This map describes the intended Next.js site.
The embedded `public/tts-feature/` app is treated as accidental or exploratory material, not as the site architecture.

## Application Shape

- The app uses Next.js App Router under `src/app/`.
- The public home page is `src/app/page.tsx`.
- The root shell is `src/app/layout.tsx`.
- The only API route currently present is `src/app/api/chat/route.ts`.
- There are no route groups such as `(marketing)` or `(app)` in the current tree.

## Rendering Strategy

- `src/app/layout.tsx` exports `dynamic = 'force-dynamic'`.
- `src/app/page.tsx` exports `dynamic = 'force-dynamic'`.
- This means the current site is dynamic even though it looks like a public marketing/intake page.
- If the final site remains mostly static, this dynamic setting may need to be revisited.

## UI Composition

- `src/app/page.tsx` renders `HomeClient`.
- `src/components/HomeClient.tsx` renders `HeroSection`.
- `src/components/HeroSection.tsx` renders the page structure, hero copy, feature chips, chat mount, marquee, and footer.
- `src/components/HeroSection.tsx` imports `ChatInterface` from `src/components/ChatInterface.tsx`.
- `src/components/LeadCaptureCard.tsx` is the lead form that should appear after chat interaction.
- `src/components/ui/` contains shadcn-style primitives used by feature components.

## Server And Client Boundaries

- Server Components are the default in the app.
- `src/components/LeadCaptureCard.tsx` is a Client Component because it uses `useState` and form submission state.
- `src/components/HomeClient.tsx` is named like a Client Component but does not currently include `'use client'`.
- `src/components/HeroSection.tsx` does not include `'use client'`.
- `src/components/ChatInterface.tsx` is currently zero bytes, so its intended server/client boundary is unknown.
- If chat uses `@ai-sdk/react`, `ChatInterface` will need to be a Client Component.

## Chat Flow

- Browser UI should send `UIMessage[]` to `POST /api/chat`.
- `src/app/api/chat/route.ts` validates that messages exist.
- The route calls Vercel AI Gateway with the Good'ai persona from `src/lib/chatPersona.ts`.
- The response streams back in UI message stream format.
- The persona says a contact form appears automatically after the first reply, implying `ChatInterface` should coordinate the first message, transcript, and `LeadCaptureCard`.

## Lead Flow

- `src/components/LeadCaptureCard.tsx` receives `firstMessage` and `conversationTranscript`.
- On submit, it posts lead details to Web3Forms.
- The component does not currently validate with `zod` or `react-hook-form`.
- It does not inspect the Web3Forms response before showing success.

## Brand And Design System

- The active app consumes tokens from `src/app/globals.css`.
- The design reference material is under `public/`.
- `public/README.md` describes the brand as ink, orange, paper, and WA ocean.
- `public/ui_kits/web/` provides a static HTML/JSX reference for the marketing/chat/lead flow.
- `public/colors_and_type.css` provides token and type references parallel to the app's `globals.css`.

## Asset Flow

- `src/app/layout.tsx` loads fonts globally.
- `src/components/HeroSection.tsx` loads a brand mark with `next/image`.
- Public assets are served directly from `public/`.
- Several public asset references are currently stale or broken, so the asset layer needs cleanup before visual verification.

## Automation/Agent Support

- Project-local agent and skill material exists under `.agents/`.
- Planning documents live under `.planning/`.
- These support development workflow but are not part of the runtime app.

## Entry Points

- Main page: `src/app/page.tsx`.
- Root layout and metadata: `src/app/layout.tsx`.
- Global styles: `src/app/globals.css`.
- Chat API: `src/app/api/chat/route.ts`.
- Chat persona: `src/lib/chatPersona.ts`.
- Hero surface: `src/components/HeroSection.tsx`.
- Lead form: `src/components/LeadCaptureCard.tsx`.
