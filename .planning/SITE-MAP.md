# Good'Ai Site Map & Codebase Dependency Map

> **Generated:** 2026-10-02  
> **Purpose:** Single-source codebase map of routes, component dependencies, data sources, interactive pieces, and current build status for all agents working on Good'Ai.

---

## 1. Build & Lint Status

| Check | Command | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Lint Check** | `npm run check` | **PASS (0 errors)** | 0 errors, 6 pre-existing warnings (arbitrary values in lab/contact, default export in src). |
| **Motion Lint** | `npm run lint:motion` | **PASS** | Validates `.home-page` height ≥ 10000px and Three.js listener cleanup. |
| **Production Build** | `npm run build` | **FAIL (Exit Code 1)** | Missing `@/components/*` imports due to deleted working tree files. |

### First Build Error
```text
./app/layout.tsx:8:1
Error: Module not found: Can't resolve '@/components/providers/LazyMotionProvider'
  6 | import { SmoothScroll } from "@/components/studio/SmoothScroll";
  7 | import { Preloader } from "@/components/ui/Preloader";
> 8 | import { LazyMotionProvider } from "@/components/providers/LazyMotionProvider";
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### Root Cause
All 59 component files previously in `components/` are deleted in the git working tree (unstaged deletions in `git status`). The files are preserved/parked untracked in `docs/components/`. Any route importing from `@/components/*` fails at build time until imports are repointed or files restored.

---

## 2. Routes Directory (`app/**`)

| Route URL | App File | Type | Health | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Root Layout** | `app/layout.tsx` | Server (Shell) | **BROKEN** | HTML wrapper, metadata, header, footer, smooth scroll, preloader. |
| `/` | `app/page.tsx` | Server (Dense) | **BROKEN** | Homepage: sketchbook intro, hero, empathy, scroll story, services, workflow demo, FAQ, contact CTA. |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | Server (Static) | **HEALTHY** | Dynamic service detail pages (5 static slugs generated from `lib/services.ts`). No component imports. |
| `/contact` | `app/contact/page.tsx` | Server | **BROKEN** | Contact page with direct phone call link and intake card. |
| `/demo` | `app/demo/page.tsx` | Server | **BROKEN** | Interactive voice caller demo and visual workflow canvas. |
| `/lab` | `app/lab/page.tsx` | Server | **BROKEN** | Studio experiment staging (GenerativeTree, TopDock, 3D Carousel). |
| `/privacy` | `app/privacy/page.tsx` | Server | **HEALTHY** | Privacy policy notice. Pure HTML/Link, zero component imports. |
| `/terms` | `app/terms/page.tsx` | Server | **HEALTHY** | Service preview terms. Pure HTML/Link, zero component imports. |
| `404` | `app/not-found.tsx` | Server | **HEALTHY** | Custom 404 page ("This one's gone walkabout"). Zero component imports. |
| `POST /api/contact` | `app/api/contact/route.ts` | Edge/Dynamic API | **HEALTHY** | Enquiry submission to Resend API (`mate@goodai.au` -> `hello@goodai.au`). |
| `POST /api/voice/call`| `app/api/voice/call/route.ts` | Edge/Dynamic API | **HEALTHY** | Mints short-lived LiveKit room tokens via Trillet SDK (`@trillet-ai/web-sdk/server`). |
| `/sitemap.xml` | `app/sitemap.ts` | Metadata Route | **HEALTHY** | Dynamically lists root, demo, lab, privacy, terms, and 5 service detail slugs. |
| `/robots.txt` | `app/robots.ts` | Metadata Route | **HEALTHY** | Allows all crawlers, points to sitemap. |

---

## 3. Per-Route Dependency & Component Mapping

### Root Layout — `app/layout.tsx`
- **Imports:**
  - `app/globals.css` (Tailwind v4 `@theme` tokens, layout floor height)
  - `app/studio-controls.css`
  - `@/components/studio/Shell` (`StudioHeader`, `StudioFooter`) -> **BROKEN** (in `docs/components/studio/Shell.tsx`)
  - `@/components/studio/SmoothScroll` (`SmoothScroll`) -> **BROKEN** (in `docs/components/studio/SmoothScroll.tsx`)
  - `@/components/ui/Preloader` (`Preloader`) -> **BROKEN** (in `docs/components/ui/Preloader.tsx`)
  - `@/components/providers/LazyMotionProvider` -> **BROKEN** (in `docs/components/providers/LazyMotionProvider.tsx`)

### Homepage — `app/page.tsx` (`/`)
- **Components:**
  - `@/components/studio/PerthSketchbook` -> **BROKEN** (in `docs/components/studio/PerthSketchbook.tsx`)
  - `@/components/studio/HeroStudy` -> **BROKEN** (in `docs/components/studio/HeroStudy.tsx`)
  - `@/components/studio/ScrollStory` -> **BROKEN** (in `docs/components/studio/ScrollStory.tsx`)
  - `@/components/studio/WorkflowPreview` -> **BROKEN** (in `docs/components/studio/WorkflowPreview.tsx`)
- **Lib / Data Sources:**
  - `lib/services.ts` (`services` array drives services row list and icon pairing)
  - `lib/links.ts` (`SURVEY_URL`, `PHONE_DISPLAY`, `PHONE_HREF`)
- **External Dependencies:** `lucide-react`, `next/link`

### Service Detail — `app/services/[slug]/page.tsx` (`/services/[slug]`)
- **Components:** None (pure semantic HTML: `article`, `div.detail-grid`, `aside`)
- **Lib / Data Sources:**
  - `lib/services.ts` (`services` defines static params, metadata, name, pricing, inclusions, ranges)
  - `lib/links.ts` (`SURVEY_URL`)
- **External Dependencies:** `lucide-react`, `next/navigation` (`notFound`), `next/link`

### Contact — `app/contact/page.tsx` (`/contact`)
- **Components:**
  - `@/components/studio/SussTheFussCard` -> **BROKEN** (in `docs/components/studio/SussTheFussCard.tsx`)
- **Lib / Data Sources:**
  - `lib/links.ts` (`PHONE_DISPLAY`, `PHONE_HREF`)
- **External Dependencies:** `lucide-react`, `next/link`

### Demo — `app/demo/page.tsx` (`/demo`)
- **Components:**
  - `@/components/studio/VoiceDemo` -> **BROKEN** (in `docs/components/studio/VoiceDemo.tsx`)
  - `@/components/ui/InteractiveWorkflowCanvas` -> **BROKEN** (in `docs/components/ui/InteractiveWorkflowCanvas.tsx`)
- **External Dependencies:** `lucide-react`, `next/link`

### Studio Lab — `app/lab/page.tsx` (`/lab`)
- **Components:**
  - `@/components/sections/ServicesCarousel` -> **BROKEN** (in `docs/components/sections/ServicesCarousel.tsx`)
  - `@/components/ui/TopDock` -> **BROKEN** (in `docs/components/ui/TopDock.tsx`)
  - `@/src/shaders/elements/GenerativeTree` -> **EXISTS ON DISK** (`src/shaders/elements/GenerativeTree.tsx`)
- **External Dependencies:** `lucide-react`, `next/link`

### Contact API — `app/api/contact/route.ts`
- **Dependencies:** `next/server` (`NextResponse`), Resend HTTP API (`https://api.resend.com/emails`)
- **Env Vars Required:** `RESEND_API_KEY`, optional `CONTACT_TO_EMAIL` (default: `hello@goodai.au`)

### Voice API — `app/api/voice/call/route.ts`
- **Dependencies:** `next/server`, `@trillet-ai/web-sdk/server` (`createCall`, `TrilletRoomDetails`)
- **Env Vars Required:** `TRILLET_API_KEY`, `NEXT_PUBLIC_TRILLET_AGENT_ID`, `NEXT_PUBLIC_TRILLET_WORKSPACE_ID`

---

## 4. Central Data Sources

### `lib/services.ts`
- **Exports:** `interface Service`, `services: Service[]` (5 items: `voice-agents`, `workflow-automation`, `custom-assistants`, `ai-integration`, `opportunity-audit`).
- **Consumers:**
  - `app/page.tsx` (homepage service rows, index-paired with `serviceIcons`)
  - `app/services/[slug]/page.tsx` (`generateStaticParams`, metadata, detail page content)
  - `app/sitemap.ts` (dynamic service URLs)

### `lib/links.ts`
- **Exports:**
  - `SURVEY_URL = "/contact"` (central intake link; verified by `bash scripts/verify-ctas.sh`)
  - `PHONE_DISPLAY = "(08) 7741 4191"`
  - `PHONE_HREF = "tel:+61877414191"`
- **Consumers:** `app/page.tsx`, `app/contact/page.tsx`, `app/services/[slug]/page.tsx`, `docs/components/studio/VoiceDemo.tsx`

### `lib/utils.ts`
- **Exports:** `cn(...inputs: ClassValue[])` combining `clsx` and `tailwind-merge`.
- **Consumers:** `components/ui/*`, `docs/components/ui/*`

---

## 5. Interactive, Client, Three.js & Voice Architecture

### Three.js / WebGL Visuals
1. **Perth Sketchbook (`src/shaders/sketchbook/`):**
   - Main Component: `src/shaders/sketchbook/Sketchbook.tsx` (active on disk)
   - Glue Script: `src/shaders/sketchbook/sketchbookDocument.js` (patches iframe click bugs and flip timing)
   - Wrapped by: `docs/components/studio/PerthSketchbook.tsx`
   - Active Plates: `public/sketchbook/plates/the-inbox.webp`, `public/sketchbook/plates/fremantle.webp`
2. **Generative Tree (`src/shaders/elements/GenerativeTree.tsx`):**
   - Active on disk; embeds procedural canvas from `generative-tree.html`
   - Consumed on `/lab`
3. **WebGL 3D Carousel (`docs/components/carousel/`):**
   - Parked in `docs/components/carousel/` (`createCarousel.js`, `atlas.js`, `planeShaders.js`, `textShaders.js`)
   - Consumed on `/lab` via `ServicesCarousel.tsx`

### Voice System
1. **Trillet AI Integration (Primary):**
   - Component: `docs/components/studio/TrilletVoiceWidget.tsx` (uses `@trillet-ai/web-sdk`)
   - Backend Route: `app/api/voice/call/route.ts` (mints tokens via `@trillet-ai/web-sdk/server`)
   - Trigger: `docs/components/studio/VoiceDemo.tsx` on `/demo`
2. **ElevenLabs Integration (Parked/Alternative):**
   - Components: `docs/components/ui/ElevenLabsWidget.tsx`, `docs/components/ui/BrandedElevenLabsWidget.tsx`
   - Uses web component `<elevenlabs-convai>` and Lenis scroll suppression

### Motion & Client Interactions
1. **Pinned Scroll Story:** `docs/components/studio/ScrollStory.tsx` (GSAP `matchMedia` + `context` animating inline SVG ink paths)
2. **Smooth Scroll:** `docs/components/studio/SmoothScroll.tsx` (Lenis React wrapper)
3. **Preloader:** `docs/components/ui/Preloader.tsx` (Wordmark animation with local session tracking)
4. **Interactive Workflow Preview:** `docs/components/studio/WorkflowPreview.tsx` (interactive scenario stepper on `/`)
5. **Interactive Workflow Canvas:** `docs/components/ui/InteractiveWorkflowCanvas.tsx` (drag/preview canvas on `/demo`)
6. **Suss The Fuss Form Card:** `docs/components/studio/SussTheFussCard.tsx` (interactive issue selector + contact submit on `/contact`)

---

## 6. Known Broken Imports ("The Break List")

The following table lists every broken import path in `app/` and where the source file currently lives:

| Caller File | Broken Import Statement | Missing Target | Parked Location |
| :--- | :--- | :--- | :--- |
| `app/layout.tsx` | `import { StudioHeader, StudioFooter } from "@/components/studio/Shell"` | `components/studio/Shell.tsx` | `docs/components/studio/Shell.tsx` |
| `app/layout.tsx` | `import { SmoothScroll } from "@/components/studio/SmoothScroll"` | `components/studio/SmoothScroll.tsx` | `docs/components/studio/SmoothScroll.tsx` |
| `app/layout.tsx` | `import { Preloader } from "@/components/ui/Preloader"` | `components/ui/Preloader.tsx` | `docs/components/ui/Preloader.tsx` |
| `app/layout.tsx` | `import { LazyMotionProvider } from "@/components/providers/LazyMotionProvider"` | `components/providers/LazyMotionProvider.tsx` | `docs/components/providers/LazyMotionProvider.tsx` |
| `app/page.tsx` | `import { WorkflowPreview } from "@/components/studio/WorkflowPreview"` | `components/studio/WorkflowPreview.tsx` | `docs/components/studio/WorkflowPreview.tsx` |
| `app/page.tsx` | `import { ScrollStory } from "@/components/studio/ScrollStory"` | `components/studio/ScrollStory.tsx` | `docs/components/studio/ScrollStory.tsx` |
| `app/page.tsx` | `import { PerthSketchbook } from "@/components/studio/PerthSketchbook"` | `components/studio/PerthSketchbook.tsx` | `docs/components/studio/PerthSketchbook.tsx` |
| `app/page.tsx` | `import { HeroStudy } from "@/components/studio/HeroStudy"` | `components/studio/HeroStudy.tsx` | `docs/components/studio/HeroStudy.tsx` |
| `app/contact/page.tsx` | `import { SussTheFussCard } from "@/components/studio/SussTheFussCard"` | `components/studio/SussTheFussCard.tsx` | `docs/components/studio/SussTheFussCard.tsx` |
| `app/demo/page.tsx` | `import { VoiceDemo } from "@/components/studio/VoiceDemo"` | `components/studio/VoiceDemo.tsx` | `docs/components/studio/VoiceDemo.tsx` |
| `app/demo/page.tsx` | `import { InteractiveWorkflowCanvas } from "@/components/ui/InteractiveWorkflowCanvas"` | `components/ui/InteractiveWorkflowCanvas.tsx` | `docs/components/ui/InteractiveWorkflowCanvas.tsx` |
| `app/lab/page.tsx` | `import ServicesCarousel from "@/components/sections/ServicesCarousel"` | `components/sections/ServicesCarousel.tsx` | `docs/components/sections/ServicesCarousel.tsx` |
| `app/lab/page.tsx` | `import { TopDock } from "@/components/ui/TopDock"` | `components/ui/TopDock.tsx` | `docs/components/ui/TopDock.tsx` |

---

## 7. Dead, Parked, or Orphan Files

1. **`app/tokens/*.css` (`colors.css`, `effects.css`, `fonts.css`, `spacing.css`, `typography.css`):**
   - Unimported legacy tokens from older template. Palette in `app/globals.css` `@theme` is the sole source of truth.
2. **`components/layout/HomeScroll.tsx` & `components/studio/SketchbookFlip.tsx`:**
   - Staged in git index as `new file` but unstaged marked as `deleted`. Dead code.
3. **`docs/components/**`:**
   - Untracked archive directory holding all removed Zenith template and studio components (carousel, layout, sections, studio, ui).
4. **`public/sketchbook/plates/` (unused plates):**
   - `the-office.webp`, `city-freeway.webp`, `kings-park.webp`, `swan-river.webp`, `cottesloe.webp` exist in public assets but are currently omitted from `PerthSketchbook.tsx` active rotation.
5. **`klint/`:**
   - Untracked submodule/directory containing standalone oxlint/design-system lint setup.
