# Concerns

Mapped: 2026-05-25

## Product Direction

The intended product is the Next.js site.
`public/voice-feature/` is a separate Vite/Express/Gemini Live prototype and should not be treated as the app unless explicitly adopted.
Keeping that folder under `public/` risks confusing future agents and may expose prototype source as static public files.

## Build Blockers

- `src/components/ChatInterface.tsx` is zero bytes.
- `src/components/HeroSection.tsx` imports `ChatInterface`, so the home page likely fails to compile.
- `src/components/HeroSection.tsx` uses `brandMarkSrc = '/assets/logo-mark.svg'`, but the only kept asset is `public/assets/goodai/uploads/G.jpg`.
- `src/app/layout.tsx` loads local Fraunces files from `public/fonts/`, but both files are zero bytes.
- `public/assets/` now only contains `public/assets/goodai/uploads/G.jpg`, so current code references to old logo SVG/PNG assets are stale.

## Symlink Fragility

- `package-lock.json` is a symlink to `C:\Users\kevin\projects2026\06-projects-code\nextjs\package-lock.json`.
- `feature_list.json` is a symlink to `C:\Users\kevin\knowledge2026\04-assets\Lee Monarc\DARK\goodai-mate\feature_list.json`.
- `public/good-ai-design-final.html` is a symlink.
- Git status reports several public assets/fonts as typechanged, consistent with symlink or asset replacement churn.
- These links make the repo less portable and may break for other contributors, CI, or Vercel.

## Missing Environment Documentation

- `src/components/LeadCaptureCard.tsx` reads `NEXT_PUBLIC_WEB3FORMS_KEY`.
- `.env.example` does not document `NEXT_PUBLIC_WEB3FORMS_KEY`.
- `src/app/api/chat/route.ts` uses non-null assertion on `AI_GATEWAY_API_KEY`, so a missing key will fail at runtime rather than returning a clear setup error.

## Chat Flow Incomplete

- The system prompt in `src/lib/chatPersona.ts` assumes a working chat UI and automatic lead form after the first assistant response.
- `ChatInterface` is empty, so that behavior is not implemented in the current code.
- `LeadCaptureCard` expects `firstMessage` and `conversationTranscript`, but no current component wires those props.

## Lead Capture Reliability

- `LeadCaptureCard` catches submission errors and still shows success.
- It does not inspect the Web3Forms response body.
- This is visitor-friendly but may silently drop leads.
- There is no server-side lead capture route, spam protection, or persistence.

## Rendering Strategy Risk

- `dynamic = 'force-dynamic'` is set in `src/app/layout.tsx` and `src/app/page.tsx`.
- If the page is primarily marketing content plus a client-side chat widget, forcing dynamic rendering may reduce caching benefits.
- The project instructions expected static marketing pages where possible.

## Design-System Drift

- `public/README.md` says the pivot avoids gradients, drop-blurs, hidden cursors, and shader-style lag.
- `src/components/HeroSection.tsx` currently uses blurred circular background blobs.
- The current app has several design-system references, but the active implementation is only partially aligned.

## Unused Or Questionable Dependencies

- `three` and shader loader setup remain in the root stack, but the current product direction says no WebGL shader.
- `react-hook-form` and `zod` are installed but not used by the active lead form.
- `@ai-sdk/react` is installed, but the chat component that would likely use it is empty.
- These may be intentional near-term dependencies, but they are worth trimming if the pivot is final.

## Public Folder Hygiene

- `public/voice-feature/` contains source code, package files, and server code inside the public asset tree.
- `public/voice-feature.zip` is also present under `public/`.
- `public/ui_kits/web/` is useful reference material but is not production code.
- `public/preview/` and design artifacts are useful locally, but decide whether they should ship publicly.

## Documentation Drift

- `README.md` is still mostly the default create-next-app README.
- `.planning/STATE.md` still describes a previous phase plan and old progress state.
- Existing planning docs before this refresh were stale relative to the pivot.

## Immediate Recovery Order

1. Decide whether to delete, move, or ignore `public/voice-feature/`.
2. Restore or replace missing/zero-byte brand and font assets.
3. Implement `src/components/ChatInterface.tsx`.
4. Document `NEXT_PUBLIC_WEB3FORMS_KEY` in `.env.example`.
5. Run `npm run build` and `npm run lint`.
6. Add a small Playwright smoke test once the page compiles.
