# Technology Stack

**Analysis Date:** 2026-04-01

## Languages

**Primary:**
- TypeScript 5.x - Full codebase with strict mode enabled
- JSX/TSX - React component syntax throughout

**Secondary:**
- CSS - Tailwind CSS v4 for styling
- JavaScript - Build/config files (ESM format)

## Runtime

**Environment:**
- Node.js (version specified in package.json via type: "module" ESM convention)

**Package Manager:**
- npm (npm workspace compatible)
- Lockfile: `package-lock.json` present (237KB)

## Frameworks

**Core:**
- Next.js 16.2.1 - App Router, React 19 support, Turbopack, Edge Runtime compatible
- React 19.2.4 - UI library with new compiler and hooks
- React DOM 19.2.4 - DOM rendering

**UI Component Library:**
- Radix UI 1.4.2 - Headless, accessible component primitives
- shadcn/ui - Pre-built accessible UI components (via `components.json`)
  - Components in `src/components/ui/` include: button, card, dialog, form, input, label, badge, skeleton
  - Configured for New York style, RSC enabled, Tailwind CSS variables

**Form Handling:**
- react-hook-form 7.54.2 - Efficient form state and validation
- Zod 4.3.6 - Schema validation library

**Styling:**
- Tailwind CSS 4 - Utility-first CSS framework
- @tailwindcss/postcss 4 - PostCSS plugin for Tailwind
- class-variance-authority 0.7.1 - Variant management for styled components
- tailwind-merge 3.5.0 - Merging Tailwind class names intelligently

**Icons:**
- lucide-react 0.468.0 - Lightweight icon library

## Key Dependencies

**Critical:**
- clsx 2.1.1 - Conditional class name concatenation

**Utilities:**
- zod 4.3.6 - TypeScript-first schema validation for API contracts

## Configuration

**TypeScript:**
- Target: ES2017
- Strict mode: Enabled
- Module resolution: bundler
- Path aliases: `@/*` maps to `./src/*`
- JSX: react-jsx
- Incremental compilation enabled
- Config file: `tsconfig.json`

**Build:**
- Next.js default turbo build system
- PostCSS configured in `postcss.config.mjs`
- ESLint config in `eslint.config.mjs` (flat config format)
  - Uses `eslint-config-next/core-web-vitals`
  - Uses `eslint-config-next/typescript`
  - Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

**Tailwind CSS:**
- Config via `components.json` (shadcn/ui convention)
- CSS variables enabled for theming
- Base color: slate
- Paths: `src/app/globals.css` (global styles)

**Environment:**
- Next.js telemetry disabled via `NEXT_TELEMETRY_DISABLED=1`

## Platform Requirements

**Development:**
- Node.js (npm workspaces compatible)
- TypeScript compiler
- Modern browser with ES2017 support

**Production:**
- Vercel Edge Runtime (indicated by `vercel.json`)
- Node.js 18+ recommended (Next.js 16 best practices)

## Build & Development Scripts

```bash
npm run dev          # Start development server (next dev)
npm run build        # Build for production (next build)
npm start            # Start production server (next start)
npm run lint         # Run ESLint
```

## Next.js Configuration

- Config file: `next.config.ts`
- Currently minimal (placeholder config)
- Entry point: `src/app/layout.tsx` (root layout)
- Fonts: Google Fonts (Geist Sans and Geist Mono via `next/font/google`)

## Test Framework

**Testing:** Configured structure in `__tests__/` directory
- Unit tests: `__tests__/unit/`
- Integration tests: `__tests__/integration/`
- E2E tests: `__tests__/e2e/`
- Framework: Not yet configured in package.json (Vitest + Playwright per CLAUDE.md)

---

*Stack analysis: 2026-04-01*
