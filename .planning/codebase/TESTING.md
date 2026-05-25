# Testing

Mapped: 2026-05-25

## Current Test Posture

There is currently no committed test suite for the intended Next.js site.
The project instructions mention Vitest and Playwright, but the root `package.json` does not include `vitest`, `@playwright/test`, or test scripts.

## Available Checks

- `npm run lint` is the only root quality script listed in `package.json`.
- `npm run build` is available through Next.js.
- TypeScript checking is indirectly covered by Next build and Next lint/type tooling.
- No dedicated `npm test` script exists.

## Test Directories

- No `__tests__/` directory was found.
- No root `tests/` directory was found.
- No `__tests__/unit/`, `__tests__/e2e/`, or `__tests__/integration/` directories were found.
- No Playwright config file was found.
- No Vitest config file was found.

## High-Value Tests To Add

- Unit test `src/lib/chatPersona.ts` only if prompt assembly becomes dynamic.
- API route tests for `src/app/api/chat/route.ts` should verify missing messages return 400.
- API route tests should mock `streamText` before testing successful streaming behavior.
- Component tests for `src/components/LeadCaptureCard.tsx` should cover required fields, submit payload, success state, and dismiss behavior.
- E2E tests should cover first-page render, chat submit, first assistant response, lead form appearance, and lead form submit.

## Manual Verification Needed Now

- The home page should render without module errors.
- The brand mark should load from the path used in `src/components/HeroSection.tsx`.
- Local fonts configured in `src/app/layout.tsx` should load or fail gracefully.
- The chat UI should mount and call `POST /api/chat`.
- The lead capture card should post to Web3Forms only after a useful first chat turn.

## Known Verification Blockers

- `src/components/ChatInterface.tsx` is zero bytes.
- `src/components/HeroSection.tsx` imports `ChatInterface`, so the app likely cannot compile as-is.
- `src/components/HeroSection.tsx` references `/assets/logo-mark.svg`, but the only kept asset is `public/assets/goodai/uploads/G.jpg`.
- `src/app/layout.tsx` references local Fraunces font files that are currently zero bytes.
- Root `package-lock.json` is a symlink to another project path, which may make dependency verification inconsistent across machines.

## Root Versus Prototype Testing

- `public/voice-feature/package.json` has its own `lint` script that runs `tsc --noEmit`.
- That prototype is not part of the intended Next site testing surface.
- Do not use `public/voice-feature/` checks as evidence that the Next site works.

## Suggested Minimal Test Setup

- Add Vitest only when there is logic worth testing outside browser rendering.
- Add Playwright for the chat/lead flow because the main risk is integration behavior.
- Keep the first test pass small: one API validation test and one E2E smoke test.
- Avoid broad snapshot tests for the brand-heavy page until the design stabilizes.

## CI

- No GitHub Actions workflow was found under `.github/workflows/`.
- `.github/prompts/` exists, but it is not CI.
- Before deployment hardening, add CI that runs lint, build, and the chosen test command.
