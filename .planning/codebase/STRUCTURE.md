# Codebase Structure

**Analysis Date:** 2026-04-01

## Directory Layout

```
nextjs/
├── src/                      # Application source code
│   ├── app/                  # Next.js App Router pages and layouts
│   │   ├── (app)/            # Route group: authenticated/app pages
│   │   ├── (auth)/           # Route group: authentication pages
│   │   ├── (marketing)/      # Route group: public marketing pages
│   │   ├── api/              # API route handlers
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css       # Global styles
│   │   └── favicon.ico       # Favicon
│   ├── components/           # React components
│   │   └── ui/               # Shadcn UI primitives
│   ├── lib/                  # Utilities and helper functions
│   ├── hooks/                # Custom React hooks (empty, ready for expansion)
│   ├── styles/               # Additional styles (empty, ready for expansion)
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets (images, fonts, etc.)
├── __tests__/                # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
├── .claude/                  # Claude agent configuration
├── .mcp/                     # MCP server configuration
├── .planning/                # Planning documents (this file)
├── .vscode/                  # VS Code workspace settings
├── inbox/                    # User files to analyze/convert
├── .env.example              # Environment variable template
├── tsconfig.json             # TypeScript configuration
├── next.config.ts            # Next.js configuration
├── eslint.config.mjs         # ESLint configuration
├── postcss.config.mjs        # PostCSS configuration (Tailwind)
├── components.json           # Shadcn UI configuration
├── package.json              # Dependencies and scripts
├── vercel.json               # Vercel deployment configuration
└── CLAUDE.md                 # Project conventions and rules
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router routes, layouts, and API endpoints
- Contains: Page components (`.tsx`), layout files, route groups, CSS
- Route group folders (`(marketing)`, `(app)`, `(auth)`) organize pages without affecting URLs
- Key files: `layout.tsx` (root HTML), `page.tsx` (home page), `globals.css` (Tailwind imports)

**`src/components/`:**
- Purpose: Reusable React components
- Contains: Shadcn/ui primitives under `ui/` subfolder
- Key files: `ui/button.tsx`, `ui/form.tsx`, `ui/input.tsx`, `ui/card.tsx`, `ui/dialog.tsx`, `ui/label.tsx`, `ui/badge.tsx`, `ui/skeleton.tsx`

**`src/lib/`:**
- Purpose: Utilities and shared helper functions
- Contains: `utils.ts` with `cn()` function for Tailwind class merging
- Used throughout components and pages

**`src/types/`:**
- Purpose: TypeScript type definitions
- Contains: Global types (`.d.ts` files) and module-specific types (`.ts` files)
- Key files: `api.d.ts` (API response types), `env.d.ts` (environment variables)

**`src/hooks/`:**
- Purpose: Custom React hooks
- Status: Directory exists but empty; ready for new hooks following `use*` naming

**`src/styles/`:**
- Purpose: Additional styling or CSS utilities
- Status: Directory exists but empty; global styles currently in `src/app/globals.css`

**`__tests__/`:**
- Purpose: Test files (unit, integration, e2e)
- Contains: Separate directories for test types
- Structure: Mirror `src/` directory structure for co-located test clarity

**`public/`:**
- Purpose: Static assets served directly by Next.js
- Contains: Images, icons, fonts (not committed or currently unused)

**`.claude/`:**
- Purpose: Claude agent configuration and skill definitions
- Committed: Yes (team-shared settings)

**`.planning/`:**
- Purpose: Analysis and planning documents
- Committed: Yes

**`inbox/`:**
- Purpose: User files awaiting analysis or conversion
- Contains: Misc. files and hero page effect examples
- Not part of main application

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML document, font registration, global metadata
- `src/app/page.tsx`: Home page component (/)
- `src/app/api/`: API route handlers (empty, ready for implementation)

**Configuration:**
- `tsconfig.json`: TypeScript compiler options (strict mode, path aliases `@/*` → `src/*`)
- `next.config.ts`: Next.js configuration
- `eslint.config.mjs`: ESLint core-web-vitals + TypeScript rules
- `postcss.config.mjs`: PostCSS (Tailwind CSS)
- `components.json`: Shadcn UI configuration (style, RSC mode, Tailwind paths, aliases)
- `.env.example`: Template for environment variables

**Core Logic:**
- `src/lib/utils.ts`: `cn()` function for class merging
- `src/components/ui/form.tsx`: Form system (FormProvider, FormField, useFormField context)
- `src/components/ui/button.tsx`: Button with CVA variants
- `src/types/api.d.ts`: API response contract types

**Styling:**
- `src/app/globals.css`: Global Tailwind import and CSS variables
- Component files: Inline Tailwind classes (no separate CSS files)

**Testing:**
- `__tests__/unit/`: Unit test mirror of `src/`
- `__tests__/integration/`: Cross-module integration tests
- `__tests__/e2e/`: End-to-end browser tests

## Naming Conventions

**Files:**
- Page/Layout: `[route-name]/page.tsx`, `[route-name]/layout.tsx`
- Components: `PascalCase.tsx` (e.g., `Button.tsx`, `Form.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)
- Hooks: `useName.ts` (e.g., `useFormField.ts`)
- Types: `lowercase.d.ts` (globals) or `Name.ts` (module-specific)
- API routes: `route.ts` in `src/app/api/[endpoint]/route.ts`

**Directories:**
- Components: `PascalCase` (e.g., `ui/`, not `ui-components/`)
- Utilities: `lowercase` (e.g., `lib/`)
- Types: `types/`
- Hooks: `hooks/`
- Routes: Route name or `[route-param]` for dynamic segments
- Route groups: `(group-name)` with parentheses

**Functions:**
- React components: PascalCase (e.g., `Button`, `FormField`)
- Utilities: camelCase (e.g., `cn`, `getFieldState`)
- Hooks: camelCase with `use` prefix (e.g., `useFormField`)

**Variables:**
- Exported components: PascalCase (e.g., `export { Button }`)
- Exported utilities: camelCase (e.g., `export function cn()`)
- CVA variants: camelCase (e.g., `buttonVariants`)
- React Context: PascalCase (e.g., `FormFieldContext`)

**Types:**
- Interfaces: PascalCase with context suffix (e.g., `FormFieldContextValue`)
- Type definitions in `.d.ts`: Declare as namespace or interface

## Where to Add New Code

**New Feature (page + form):**
- Page: `src/app/(app)/feature-name/page.tsx`
- Form component: `src/app/(app)/feature-name/components/FeatureForm.tsx` (co-located)
- Validation: Define Zod schema inline or in `src/types/feature-name.ts`
- Tests: `__tests__/integration/feature-name.test.ts`

**New UI Component:**
- Implementation: `src/components/ui/ComponentName.tsx`
- Export: Default export from file
- Tests: `__tests__/unit/components/ComponentName.test.tsx`

**New Custom Hook:**
- Implementation: `src/hooks/useHookName.ts`
- Export: Named export `export function useHookName()`
- Tests: `__tests__/unit/hooks/useHookName.test.ts`

**New Utility Function:**
- Implementation: `src/lib/utilityName.ts` or add to `src/lib/utils.ts`
- Export: Named export
- Tests: `__tests__/unit/lib/utilityName.test.ts`

**New API Route:**
- Implementation: `src/app/api/endpoint-name/route.ts`
- Pattern: Export `GET`, `POST`, `PUT`, `DELETE` functions
- Return type: `Response` with JSON body (use `ApiResponse` shape)
- Tests: `__tests__/integration/api/endpoint-name.test.ts`

**New Type Definition:**
- Global type: `src/types/global.d.ts` (namespace declaration)
- Module type: `src/types/feature-name.ts` (export interfaces)

**New Styled Component (if needed beyond UI kit):**
- Location: Create `src/components/Feature/ComponentName.tsx` (feature folder)
- Styling: Use Tailwind classes with `cn()` utility
- Do NOT create separate CSS files; use className prop

## Special Directories

**`(marketing)` Route Group:**
- Purpose: Public-facing marketing and informational pages
- Rendering: Static (force-static) or ISR (revalidate: 3600)
- Auth required: No
- Examples: Homepage, pricing, blog, about

**`(app)` Route Group:**
- Purpose: Authenticated user application pages
- Rendering: Dynamic (force-dynamic) for real-time data
- Auth required: Yes
- Examples: Dashboard, user profile, settings, projects

**`(auth)` Route Group:**
- Purpose: Authentication flows
- Rendering: Dynamic (force-dynamic)
- Examples: Login, signup, password reset

**`.claude/` Directory:**
- Generated: No (manually configured)
- Committed: Yes
- Purpose: Claude agent settings, skill definitions, team conventions

**`.planning/codebase/` Directory:**
- Generated: Yes (by GSD agents)
- Committed: Yes
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md

**`public/` Directory:**
- Generated: No
- Committed: No (empty but ready for static assets)
- Served: Yes (directly accessible at `/file-name`)

---

*Structure analysis: 2026-04-01*
