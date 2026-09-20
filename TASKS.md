# Good'Ai Studio Fork — Launch Checklist & GSD Tasks

Updated: 2026-09-21T03:37Z

---

## Completed

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
- [x] **Trillet AI Voice Agent Architecture & Plan**:
  - Parsed Trillet AI documentation (`https://docs.trillet.ai/documentation/web-integration/voice-agent`).
  - Extracted dashboard agents: **Darling Good** (`+61877414191`, `68f6b3cb..`) and **Good'ai** (`6a44e2d7..`).
  - Documented `@trillet-ai/web-sdk` integration lifecycle, event hooks, and widget design in `implementation_plan.md`.
- [x] **Build & Lint Verification**:
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: 0 errors, 16 static routes successfully generated.

---

## Ready to Execute (Next Session)

1. **Integrate Trillet AI Voice Agent Widget**:
   - Create `components/studio/TrilletVoiceWidget.tsx` using `@trillet-ai/web-sdk`.
   - Wire with Agent ID `68f6b3cb..` ("Darling Good", Grok Realtime) / `6a44e2d7..` ("Good'ai", Gemini 3.1 Flash Lite).
   - Hook into `components/studio/VoiceDemo.tsx` and test microphone audio flow.
2. **Visual Keyframe Capture & Inspection**:
   - Run the 3-Agent Kinetic Loop geometry inspector against `http://localhost:3000` to capture keyframe screenshots at 0%, 25%, 50%, 75%, 100% scroll.
3. **Automated Design System Gate**:
   - Register `@shadcn/lint` into `eslint.config.mjs` for permanent design system contract enforcement.
