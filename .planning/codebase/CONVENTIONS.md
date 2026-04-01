# Coding Conventions

**Analysis Date:** 2026-04-01

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Button.tsx`, `FormField.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Types: lowercase with `.d.ts` extension for global types (e.g., `api.d.ts`, `env.d.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useFormField.ts`)

**Functions:**
- Component functions: PascalCase (e.g., `Button`, `FormContent`, `DialogHeader`)
- Utility functions: camelCase (e.g., `cn`)
- Hook functions: camelCase with `use` prefix (e.g., `useFormField`)

**Variables:**
- Constants: camelCase (e.g., `buttonVariants`, `geistSans`)
- Props objects: camelCase (e.g., `className`, `showCloseButton`)
- Component props spread with destructuring: camelCase

**Types:**
- Interfaces: PascalCase with `I` prefix or direct (e.g., `ApiResponse`, `PaginationMeta`)
- Type aliases: PascalCase (e.g., `ClassValue`)
- Generic type parameters: Single capital letters or PascalCase (e.g., `T`, `TFieldValues`)
- Context types: PascalCase with `Context` suffix (e.g., `FormFieldContextValue`)

## Code Style

**Formatting:**
- Tool: ESLint (Next.js core-web-vitals + TypeScript config)
- Configuration: `eslint.config.mjs`
- No prettier config detected; ESLint handles linting only
- Line length: No hard limit enforced, but components use long className strings intelligently split

**Linting:**
- Tool: ESLint v9 with `eslint-config-next` (core-web-vitals + typescript)
- Key rules enforced:
  - Next.js specific rules via `eslint-config-next/core-web-vitals`
  - TypeScript rules via `eslint-config-next/typescript`
- Run command: `npm run lint` (eslint without fixed args)

**TypeScript:**
- Mode: Strict (`"strict": true`)
- Target: ES2017
- Module resolution: `bundler`
- Path alias: `@/*` → `./src/*`
- JSX mode: `react-jsx` (automatic runtime)

## Import Organization

**Order:**
1. React imports (`import * as React from "react"`)
2. Next.js imports (`import { type Metadata } from "next"`)
3. Third-party component library imports (`import { ... } from "radix-ui"`, `import { ... } from "lucide-react"`)
4. Internal utility/library imports (`import { cn } from "@/lib/utils"`)
5. Internal component imports (`import { Button } from "@/components/ui/button"`)
6. Type-only imports when appropriate (`import type { ... }`)

**Path Aliases:**
- Always use `@/` alias for absolute imports within `src/`
- Never use relative paths (`../`) for cross-module imports
- Example: `import { Button } from "@/components/ui/button"` not `import { Button } from "../button"`

**Critical Rule: No Barrel Imports**
- Do NOT export from `index.ts` files for re-exports
- Always import directly from module files
- Example: `import { Button } from "@/components/ui/button"` not `import { Button } from "@/components/ui"`
- This maintains tree-shaking and performance in Next.js

## Component Patterns

**React Components:**
- Functional components only
- Use `React.ComponentProps<"element">` for typing DOM elements
- Spread remaining props with `...props`
- Default export for single-component files

**Data Attributes for Styling:**
- Use `data-slot="component-name"` on all root elements
- Use `data-variant={variant}` for variant props
- Use `data-size={size}` for size props
- Use `data-state=open|closed` for state-based styling
- Use `data-error={boolean}` for error states
- Examples:
  - `<div data-slot="card" className={cn(...)} {...props} />`
  - `<Comp data-slot="button" data-variant={variant} data-size={size} className={cn(...)} {...props} />`

**Component Composition:**
- Break complex components into smaller focused sub-components
- Each sub-component (e.g., `DialogHeader`, `DialogFooter`) exported from main module
- Use composition pattern: Dialog > DialogContent > DialogHeader
- Export all sub-components from a single file for related components

**UI Component Structure:**
- Use `className-variance-authority` (CVA) for variant management
- Pattern: Define CVA at module top, use in component
- Always merge Tailwind classes with `cn()` helper (combines clsx + tailwind-merge)
- Example from `button.tsx`:
  ```typescript
  const buttonVariants = cva("base-classes", {
    variants: { variant: {...}, size: {...} },
    defaultVariants: { variant: "default", size: "default" }
  })
  ```

## Client vs Server Components

**Rendering Strategy:**
- Server Components by default (no directive needed)
- Add `'use client'` directive ONLY when component requires:
  - React hooks (useState, useEffect, useContext)
  - Event listeners (onClick, onChange)
  - Browser APIs
- Examples of client components in this codebase:
  - `src/components/ui/form.tsx` — uses React context and useFormContext
  - `src/components/ui/dialog.tsx` — uses radix-ui client primitives
  - `src/components/ui/label.tsx` — uses radix-ui client primitives

**Server Components:**
- `src/app/layout.tsx` — metadata, fonts
- `src/app/page.tsx` — static home page

## Error Handling

**Patterns:**
- Form validation: Use `react-hook-form` with Zod schemas
- Type safety: Errors validated at compile time via TypeScript strict mode
- Runtime validation: Zod for schema validation (`zod` v4.3.6)
- Error state in forms: Displayed via `FormMessage` component
- Error styling: `aria-invalid` attribute with corresponding Tailwind classes

## Environment Variables

**Declaration Pattern:**
- Declare all environment variables in `src/types/env.d.ts`
- Use namespace `NodeJS.ProcessEnv` to extend `process.env`
- Document public vs server-only variables with comments
- Pattern from `env.d.ts`:
  ```typescript
  declare namespace NodeJS {
    interface ProcessEnv {
      // Public (client-safe)
      NEXT_PUBLIC_APP_URL: string
      NEXT_PUBLIC_APP_NAME: string
      
      // Server-only
      DATABASE_URL: string
      AUTH_SECRET: string
      
      // Optional keys
      ANTHROPIC_API_KEY?: string
    }
  }
  ```

## Comments

**When to Comment:**
- Document type definitions with JSDoc for interfaces
- Document complex business logic
- Explain WHY, not WHAT (code is self-documenting via clear naming)
- Example: `/** Standard API response wrapper */` above `ApiResponse` interface

**JSDoc/TSDoc:**
- Use block comments `/** ... */` for exported functions and types
- Keep comments concise (1-2 lines)
- Not required for simple variable declarations or obvious helper functions

## Function Design

**Size:** Keep functions focused; complex components split into sub-components

**Parameters:**
- Destructure props immediately: `function Button({ className, variant, ...props })`
- Use React.ComponentProps for type safety on DOM elements
- Spread `...props` to allow composition

**Return Values:**
- React components return JSX.Element
- Utilities return their type directly (no wrapper needed)
- Form validation returns controlled state via react-hook-form

## Module Design

**Exports:**
- Named exports for utilities (`export function cn(...)`)
- Default export for single-component files (`export default function Home()`)
- Named exports for component sub-components (`export { Dialog, DialogContent, DialogHeader }`)

**File Organization:**
- One component per file (with related sub-components in same file)
- Related UI components grouped in `src/components/ui/` directory
- Utilities in `src/lib/` directory
- Types in `src/types/` directory

## Form Handling Pattern

**react-hook-form + Zod Integration:**
- Use `FormProvider` to wrap form
- Use `FormField` component with `Controller` for each field
- Define schemas with Zod before form
- Validate at submit time, not on change
- Example structure from `form.tsx`:
  - `Form` (FormProvider wrapper)
  - `FormField` (Controller wrapper with context)
  - `FormItem` (field container with ID context)
  - `FormLabel`, `FormControl`, `FormMessage` (sub-components)
  - `useFormField` hook for accessing field state

## Icon Usage

**Lucide React:**
- Import icons from `lucide-react` package
- Pattern: `import { IconName } from "lucide-react"`
- Size default: size-4 via CSS utility
- Always include alt text or aria-label for accessibility

## CSS & Styling

**Tailwind CSS v4:**
- Use utility classes only, no custom CSS components
- Use `data-slot` attributes for state-based styling with data selectors
- Dark mode: Use `dark:` prefix for dark mode variants
- Responsive: Use breakpoints `sm:`, `md:`, `lg:`, etc.
- ClassNames merged via `cn()` helper to avoid conflicts
- Container queries: `@container` syntax for responsive sub-components

---

*Convention analysis: 2026-04-01*
