# Conventions

Mapped: 2026-05-25

## Product Assumption

Use the Next.js site conventions as the source of truth.
Do not infer product conventions from `public/voice-feature/` unless that prototype is explicitly adopted.

## TypeScript

- Strict TypeScript is enabled in `tsconfig.json`.
- Source files use `.tsx` for React components and `.ts` for routes/utilities.
- Path alias imports use `@/` for files under `src/`.
- Ambient declarations live under `src/types/`.

## Imports

- App code imports directly from concrete files, for example `@/components/HeroSection`.
- There are no observed barrel files in `src/`.
- `src/components/HeroSection.tsx` imports Lucide icons directly from `lucide-react`.
- `src/components/LeadCaptureCard.tsx` imports `Button` directly from `@/components/ui/button`.

## Components

- Feature components use default exports.
- UI primitives may use named exports, such as `Button` from `src/components/ui/button.tsx`.
- Interactive components add `'use client'`, as seen in `src/components/LeadCaptureCard.tsx`.
- Non-interactive page composition currently stays server-side by default.

## Styling

- Tailwind utility classes are used directly in component JSX.
- Brand values are often referenced with CSS variables, such as `var(--ink)` and `var(--orange)`.
- `src/lib/utils.ts` provides `cn()` using `clsx` and `tailwind-merge`.
- `src/components/ui/button.tsx` uses `class-variance-authority` for variants.
- Global tokens, font variables, base styles, and keyframes live in `src/app/globals.css`.

## Brand System

- The wordmark convention is `Good'ai`.
- The brand voice avoids jargon and centers practical business automation.
- `src/lib/chatPersona.ts` encodes voice rules for the chat assistant.
- `public/README.md` documents design rules around ink, orange, paper, WA ocean, stamp shadows, and direct language.
- Current implementation in `src/components/HeroSection.tsx` partially follows the brand system but still uses blurred background blobs, which the public brand guide discourages.

## Forms

- `src/components/LeadCaptureCard.tsx` uses local React state for field values.
- Required fields are enforced through HTML attributes and a simple guard in `handleSubmit`.
- Submission state and success state are managed locally.
- Although `react-hook-form` and `zod` are installed, they are not used in the current lead form.

## Error Handling

- `src/app/api/chat/route.ts` returns a 400 JSON response for missing messages.
- `src/components/LeadCaptureCard.tsx` catches Web3Forms errors but intentionally does not surface them to the visitor.
- There is no centralized error boundary or `error.tsx` route file.

## Metadata

- `src/app/layout.tsx` defines global metadata.
- `src/app/page.tsx` overrides metadata for the home page and adds Open Graph fields.
- Site copy targets Good'ai as a Perth business automations company.

## Rendering Exports

- `dynamic = 'force-dynamic'` is used in both `src/app/layout.tsx` and `src/app/page.tsx`.
- This is consistent with dynamic chat/intake behavior but may be excessive for static marketing content.

## File Hygiene

- Project instructions prefer surgical edits and direct imports.
- Generated/reference material under `public/` should be treated separately from production app code.
- Broken symlinks and zero-byte assets should be fixed before relying on asset paths in components.

## Formatting

- Existing source generally uses two-space indentation.
- Semicolon usage is mixed across files.
- Quote style is mixed between single and double quotes, so match the local file being edited.
