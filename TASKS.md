# Good'Ai Studio Fork — Launch Checklist & GSD Tasks

Updated: 2026-09-21T03:32Z

---

## Completed in Current Session

- [x] **Zero "Half-Sights" Viewport Pacing**:
  - Extended `.hero` to `min-height: calc(100dvh - 100px)` (desktop) / `calc(100dvh - 79px)` (mobile).
  - Extended `.scroll-chapter` to `min-height: 150vh` with a dedicated 40% dwell/linger zone ($0.45 \to 0.85$ of scroll).
  - Padded `.services-section`, `.demo-section`, `.voice-home`, and `.contact-section` to `100dvh` with flex centering.
- [x] **Native "We'll Suss the Fuss" Component**:
  - Replaced external Google Form with `components/studio/SussTheFussCard.tsx`.
  - 3-step visual intake: Headache Chips $\to$ Plain-English Scratchpad $\to$ Direct Hand-off.
  - Authentic Aussie mate-ship copy (*"Knock off early. We'll sort it." / "Admin? Give us the work. Go see the kids."*).
- [x] **Lenis Inertial Smooth Scrolling**:
  - Implemented `components/studio/SmoothScroll.tsx`.
  - Synchronized with GSAP ScrollTrigger ticker.
  - Calibrated for sensitive/high-DPI mice (exponential damping, no runaway fling).
  - Added official Lenis CSS in `app/globals.css`.
- [x] **Eliminated Relative Velocity Motion Collision**:
  - Updated `components/studio/StudioMotion.tsx` with `distance = 0` during scroll ("leave one down there, we're coming to it").
- [x] **ThreeUI `<ElementsCollection />` Generative Tree**:
  - Integrated exact registered source bundle (`src/shaders/elements/GenerativeTree.tsx`, `src/shaders/elements/sources/generative-tree.html`, `src/shaders/threeui.css`, `src/shaders/Scene.tsx`).
  - Verified SHA-256 integrity and live verified on `/lab` (`http://localhost:3000/lab`).
- [x] **Agentic Linter Architecture**:
  - Inspected and analyzed `@shadcn/lint` AST engine.
  - Prepared `design-system.lint.json` contracts locking Studio tokens and component rules.
- [x] **Build & Lint Verification**:
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: 0 errors, 16 static routes successfully generated.

---

## Next Session Priority Tasks

1. **Visual Keyframe Capture & Inspection**:
   - Run the 3-Agent Kinetic Loop geometry inspector against `http://localhost:3000` to capture keyframe screenshots at 0%, 25%, 50%, 75%, 100% scroll.
2. **Generative Tree Placement Strategy**:
   - Determine whether to promote the ThreeUI Generative Tree from `/lab` to the Hero $\to$ Scroll transition or retain it as an interaction lab experiment.
3. **Automated Design System Gate**:
   - Register `@shadcn/lint` into `eslint.config.mjs` for permanent design system contract enforcement.
4. **Voice Agent Runtime Test**:
   - Run a live call test on `(08) 7741 4191` to verify audio and backend conversation hand-off.
