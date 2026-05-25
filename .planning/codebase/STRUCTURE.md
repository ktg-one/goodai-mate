# Structure

Mapped: 2026-05-25

## Top-Level Layout

- `src/` contains the intended Next.js application.
- `public/` contains brand assets, design-system references, previews, and a stray TTS prototype.
- `.planning/` contains project planning and codebase maps.
- `.agents/`, `.claude/`, `.codex/`, and `.mcp/` contain local agent/tooling configuration.
- `docs/agents/` contains project notes for agent workflows.
- `mcp-webdev/` appears to be local MCP/tooling material.

## Runtime App

- `src/app/layout.tsx` defines global fonts, metadata, dynamic rendering, and the HTML/body shell.
- `src/app/page.tsx` defines home-page metadata and renders `HomeClient`.
- `src/app/not-found.tsx` defines the branded 404 page.
- `src/app/globals.css` defines Tailwind imports, theme tokens, base styles, brand classes, and keyframes.
- `src/app/api/chat/route.ts` defines the chat streaming API route.

## Components

- `src/components/HomeClient.tsx` is a thin wrapper around `HeroSection`.
- `src/components/HeroSection.tsx` contains most of the visible home page.
- `src/components/ChatInterface.tsx` currently exists but is zero bytes.
- `src/components/LeadCaptureCard.tsx` contains the lead-capture form and Web3Forms submit behavior.
- `src/components/NoiseOverlay.tsx` contains a noise/vignette overlay but is not currently referenced by the home page.
- `src/components/ui/` contains reusable shadcn-style primitives.

## UI Primitives

- `src/components/ui/button.tsx` exports `Button` and `buttonVariants`.
- `src/components/ui/badge.tsx` exports badge primitives.
- `src/components/ui/card.tsx` exports card primitives.
- `src/components/ui/dialog.tsx` exports dialog primitives.
- `src/components/ui/form.tsx` exports form helpers.
- `src/components/ui/input.tsx` exports input primitives.
- `src/components/ui/label.tsx` exports label primitives.
- `src/components/ui/skeleton.tsx` exports skeleton primitives.

## Libraries And Types

- `src/lib/utils.ts` exports the `cn()` class merge helper.
- `src/lib/chatPersona.ts` exports the Good'ai chat system prompt.
- `src/types/api.d.ts`, `src/types/env.d.ts`, and `src/types/glsl.d.ts` contain ambient/project type declarations.

## Public Design System

- `public/README.md` documents the Good'ai brand system.
- `public/SKILL.md` exposes the public design system as a skill-like artifact.
- `public/colors_and_type.css` contains brand tokens and type utilities.
- `public/ui_kits/web/` contains a static web UI kit.
- `public/preview/` contains standalone design preview pages.
- `public/assets/` contains brand SVG/PNG assets.
- `public/fonts/` is intended to contain local Fraunces font files.

## Stray Prototype

- `public/tts-feature/` is a separate Vite/React/Express/Gemini Live project.
- Its files include `public/tts-feature/package.json`, `public/tts-feature/server.ts`, `public/tts-feature/vite.config.ts`, and `public/tts-feature/src/App.tsx`.
- Because it lives under `public/`, it is structurally mixed into the static asset tree even though it is not the intended Next site.
- Treat it as cleanup/future-reference unless the product direction changes again.

## Configuration Files

- `package.json` defines root dependencies and scripts.
- `package-lock.json` is a symbolic link to `C:\Users\kevin\projects2026\06-projects-code\nextjs\package-lock.json`.
- `next.config.ts` configures Next and shader loaders.
- `tsconfig.json` defines TypeScript settings and aliases.
- `eslint.config.mjs` defines Next/TypeScript linting.
- `postcss.config.mjs` configures Tailwind CSS v4 PostCSS support.
- `components.json` configures shadcn-style component generation.
- `vercel.json` identifies the project as a Next.js framework deployment.

## Naming Conventions Observed

- Component files in `src/components/` use PascalCase.
- UI primitive files in `src/components/ui/` use lowercase names.
- Utility files in `src/lib/` use camelCase.
- API route files use `route.ts`.
- Ambient type files use `.d.ts`.

## Current Structural Mismatch

- `src/components/HeroSection.tsx` imports `/assets/logo-mark.svg`, but that asset is not present.
- `src/components/HeroSection.tsx` imports `src/components/ChatInterface.tsx`, but that file is empty.
- `src/app/layout.tsx` imports local fonts that currently exist as zero-byte files.
- Several public files are symlinks to paths outside this repo, which makes portability fragile.
