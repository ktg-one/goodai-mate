# Stack

Mapped: 2026-05-25

## Product Assumption

The intended product is a Next.js site for Good'ai, not the embedded Vite/Gemini TTS prototype in `public/tts-feature/`.
That prototype is treated as a stray artifact or future reference only.

## Runtime

- Node.js project managed by npm.
- Main app framework: Next.js App Router from `next`.
- React runtime: React 19 from `react` and `react-dom`.
- TypeScript strict mode is enabled through `tsconfig.json`.
- Styling uses Tailwind CSS v4 through `@tailwindcss/postcss` in `postcss.config.mjs`.
- Deployment target is Vercel, with `vercel.json` declaring `"framework": "nextjs"`.

## Main Dependencies

- `next` powers routing, rendering, metadata, and image/font helpers.
- `react` and `react-dom` provide the UI runtime.
- `ai`, `@ai-sdk/react`, and `@ai-sdk/openai-compatible` are present for chat and streaming AI workflows.
- `lucide-react` is the icon library.
- `radix-ui`, `class-variance-authority`, `clsx`, and `tailwind-merge` support shadcn-style UI primitives.
- `react-hook-form` and `zod` are installed, though the current lead form in `src/components/LeadCaptureCard.tsx` uses local state instead.
- `three`, `@types/three`, and `raw-loader` are installed for possible shader/WebGL work, but the current mapped product direction does not use a shader surface.

## Scripts

- `npm run dev` runs `next dev`.
- `npm run build` runs `next build`.
- `npm run start` runs `next start`.
- `npm run lint` runs `eslint .`.

## Configuration

- `next.config.ts` sets `turbopack.root` to `process.cwd()`.
- `next.config.ts` configures `.glsl`, `.vert`, and `.frag` imports through `raw-loader` for both Turbopack and webpack.
- `tsconfig.json` uses `moduleResolution: "bundler"` and path alias `@/* -> ./src/*`.
- `components.json` configures shadcn-style components with aliases for `@/components`, `@/components/ui`, `@/lib`, and `@/hooks`.
- `eslint.config.mjs` uses Next core-web-vitals and TypeScript presets.

## Styling Stack

- Global CSS lives in `src/app/globals.css`.
- Brand tokens are CSS custom properties under `:root`.
- Tailwind v4 theme tokens are exposed with `@theme inline`.
- The current visual system is paper/ink/orange/ocean, based on `public/README.md` and `public/colors_and_type.css`.
- `next/font/google` loads DM Sans and JetBrains Mono in `src/app/layout.tsx`.
- `next/font/local` attempts to load Fraunces files from `public/fonts/`.

## Public Assets

- Brand and design-system assets live under `public/`.
- `public/README.md` describes the brand system and references `public/good-ai-design-final.html` as the design source of truth.
- `public/ui_kits/web/` is a static UI kit/reference implementation.
- `public/preview/` contains design-system preview pages.
- `public/assets/` contains SVG and PNG brand assets, though several referenced or tracked assets are currently broken or zero bytes.

## Environment Variables

- `.env.example` documents `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, `DATABASE_URL`, `AUTH_SECRET`, `AI_GATEWAY_API_KEY`, and telemetry settings.
- `src/app/api/chat/route.ts` requires `AI_GATEWAY_API_KEY` at runtime.
- `src/components/LeadCaptureCard.tsx` expects `NEXT_PUBLIC_WEB3FORMS_KEY`, but this variable is not documented in `.env.example`.

## Out-Of-Scope Prototype

- `public/tts-feature/` is a separate Vite + Express + WebSocket + Gemini Live prototype.
- It has its own `package.json`, `server.ts`, `vite.config.ts`, `src/App.tsx`, and lockfile.
- Based on the current clarification, do not treat `public/tts-feature/` as the architecture for the Next site.
