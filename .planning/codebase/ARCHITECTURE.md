# Architecture

**Analysis Date:** 2026-04-01

## Pattern Overview

**Overall:** Server-first Next.js 16 App Router with layered separation of concerns (UI components, utilities, types, API routes)

**Key Characteristics:**
- Server Components as default rendering strategy with selective client interactivity
- Route groups for semantic separation of pages: `(marketing)`, `(app)`, `(auth)`
- Shadcn/ui component library for reusable, styled, accessible UI primitives
- React Hook Form with Zod validation for form handling
- Utility-first styling with Tailwind CSS v4
- TypeScript strict mode with path aliases for imports

## Layers

**Presentation (UI Components):**
- Purpose: Reusable React components for user interfaces
- Location: `src/components/ui/`
- Contains: Unstyled primitives (Button, Input, Card, Form, Dialog, Badge, Label, Skeleton)
- Depends on: React, Tailwind CSS, CVA for variant management, Radix UI for underlying accessibility
- Used by: Page components, custom application components

**Page/Route Layer:**
- Purpose: Next.js App Router pages and layouts defining URL structure
- Location: `src/app/layout.tsx`, `src/app/page.tsx`
- Contains: Root layout (HTML structure, fonts), page components, route groups for organization
- Depends on: React Server Components, Next.js primitives
- Used by: Browser directly via routing

**Utilities/Libraries:**
- Purpose: Shared helper functions and cross-cutting utilities
- Location: `src/lib/`
- Contains: `cn()` function for Tailwind class merging (uses clsx + tailwind-merge)
- Depends on: External libraries (clsx, tailwind-merge)
- Used by: All layers needing class composition

**Types/Contracts:**
- Purpose: TypeScript interface and type definitions
- Location: `src/types/` (both `.d.ts` for globals and `.ts` for module types)
- Contains: API response shapes (`ApiResponse`, `PaginatedResponse`), environment variable types
- Depends on: TypeScript
- Used by: API routes, components, utilities

**API Routes:**
- Purpose: Server-side endpoints for data operations
- Location: `src/app/api/` (route.ts files only)
- Contains: Request handlers, business logic
- Depends on: Next.js Request/Response API, database, external services
- Used by: Client-side fetch requests, external callers

## Data Flow

**Server Component Rendering:**

1. Browser requests URL → Next.js router matches to page/layout
2. Page/layout (Server Component by default) executes on server
3. Database or API call (if needed) happens server-side
4. HTML renders and ships to browser
5. Hydration attaches interactivity for any `use client` components

**Client Interactivity:**

1. Form submission in `<Form>` → React Hook Form validates with Zod schema
2. useFormField hook provides field state and error messages
3. FormControl wraps input primitives (Button, Input, etc.)
4. FormMessage displays validation errors from form state
5. Optional: Client component calls API route via fetch

**API Request Cycle:**

1. Client component or Server Component calls `fetch()` to `src/app/api/*` route
2. Route handler executes business logic
3. Returns `ApiResponse<T>` shape with data/error/code/details
4. Client consumes response and updates state/UI

**State Management:**

- Form state: React Hook Form (FormProvider context)
- Field state: useFormField context + useFormState hook
- Page-level state: Server Component props passed from layout/parent pages
- Cross-component state: Context API (Form/FormField context)

## Key Abstractions

**ButtonVariants (CVA):**
- Purpose: Type-safe component variants using class-variance-authority
- Examples: `src/components/ui/button.tsx`
- Pattern: Define variants object (color, size) with Tailwind classes, apply dynamically at runtime

**Form System:**
- Purpose: End-to-end form handling with validation and error display
- Examples: `src/components/ui/form.tsx`, `src/components/ui/input.tsx`, `src/components/ui/label.tsx`
- Pattern: React Hook Form as base, context wrapping for field access (FormFieldContext, FormItemContext)

**cn() Utility:**
- Purpose: Merge Tailwind classes with conflict resolution
- Examples: `src/lib/utils.ts`
- Pattern: Compose clsx() for conditional classes, then run through twMerge() to prevent duplicates

**Route Groups:**
- Purpose: Organize pages semantically without affecting URL structure
- Examples: `src/app/(marketing)/`, `src/app/(app)/`, `src/app/(auth)/`
- Pattern: Use parentheses in folder names; can share layout context within group

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page request (sets HTML wrapper, fonts, metadata)
- Responsibilities: HTML document structure, font registration (Geist Sans/Mono), global styles import, body wrapper

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET request to `/`
- Responsibilities: Displays landing page with Next.js template content

**API Routes:**
- Location: `src/app/api/` (empty; ready for implementation)
- Triggers: Fetch requests to `/api/*` paths
- Responsibilities: Server-side data operations, validation, database calls

## Error Handling

**Strategy:** Explicit error response wrapper at API level; client-side form validation with Zod

**Patterns:**
- API: Return `ApiResponse` with `error`, `code`, `details` fields; let client parse
- Forms: Zod schema validation before submission; react-hook-form displays field-level errors via FormMessage
- Server: Server Components can throw errors; Next.js captures and shows error boundary
- Types: TypeScript strict mode catches type mismatches at build time

## Cross-Cutting Concerns

**Logging:** Not detected (ready for integration)

**Validation:** Zod schemas (ready to integrate with forms or API routes)

**Authentication:** Environment variables defined (`AUTH_SECRET`); auth provider not yet implemented

**Dark Mode:** CSS variables (`--background`, `--foreground`) with media query (@prefers-color-scheme: dark); Tailwind dark: modifier available

**Styling:** Global `globals.css` imports Tailwind with @import "tailwindcss"; inline theme variables override defaults

---

*Architecture analysis: 2026-04-01*
