## 2025-05-17 - RequestAnimationFrame Performance
**Learning:** In highly active `requestAnimationFrame` loops (like `CursorEffects.tsx` and custom cursor implementations), updating inline `style.left` and `style.top` causes full layout and reflow calculations every frame, destroying performance.
**Action:** Always prefer `style.transform = "translate3d(x, y, 0)"` for cursor trackers and high-frequency DOM manipulation. It triggers hardware acceleration and prevents main-thread layout thrashing.

## 2025-02-23 - [React Performance] Isolating Form State to Prevent Re-renders
**Learning:** In chat interfaces using the Vercel AI SDK, maintaining the text input state (`useState('input')`) at the level of the parent component forces the entire message list (and expensive child components like avatars or lead capture forms) to re-render on every single keystroke.
**Action:** Always extract text inputs and their associated state into a separate, memoized child component (e.g., `ChatInputForm`) that passes the final text up via a callback (`onSubmit`) when the user hits send. This isolates the high-frequency state updates from the rest of the application tree.

## 2024-03-XX - Streaming Chat Re-renders
**Learning:** During AI text streaming, the `useChat` hook updates the `messages` array state on every single token. Unoptimized chat lists will re-render all previous messages and re-compute their inner text on every token, causing O(N*M) DOM reconciliation complexity.
**Action:** Always wrap individual chat message components in `React.memo` so that only the currently streaming message re-renders, while previous messages skip reconciliation.

## 2026-05-18 - Enabled SSG for Landing Page
**Learning:** The marketing page in `src/app/page.tsx` was unnecessarily using `export const dynamic = 'force-dynamic';`, forcing server-side rendering on every request for static content. Furthermore, there were abandoned protoypes inside the `public/` folder (e.g. `public/tts-feature` and `public/ui_kits`) which bloated the static asset bundle.
**Action:** Removed `force-dynamic` to enable Static Site Generation (SSG), massively improving TTFB. Deleted the abandoned public prototypes to reduce deployment bundle size and remove public-facing source code leaks.

## 2024-05-18 - [Memoizing Controlled Form Inputs in React]
**Learning:** Controlled form inputs (`<Input value={input} onChange={...} />`) force a full component re-render on *every keystroke*. If the component also renders complex lists using `O(N)` mapping or filtering (like parsing an entire array of chat messages), those expensive operations happen on *every single typed character*, causing severe input lag.
**Action:** Always memoize derived arrays/lists with `useMemo` when they sit in the same component as a controlled text input, ensuring the array transformations only run when the actual data changes, not when the user types.

## 2025-05-14 - [Optimize Array Reversal in Streaming Context]
**Learning:** In Next.js / React apps using Vercel AI SDK, array spreading and reversing `[...messages].reverse()` on every render or effect during text streaming creates unnecessary object allocations and GC overhead.
**Action:** Use a backwards `for` loop to search the array backwards instead of making a reversed copy.

## 2025-05-18 - [React Performance] Lazy Evaluating Derived State During Streaming
**Learning:** In chat interfaces using the Vercel AI SDK, computing derived state like `messages.map(...).join('\n')` inside a `useMemo` that depends on `messages` causes O(N) string concatenation on every single streaming token, destroying performance and causing input lag.
**Action:** Always lazy-evaluate expensive derived state. If the derived state is only needed when a specific component (like a lead capture form) is visible, add those visibility flags to the `useMemo` dependencies and return early (e.g., return `''` if the form is hidden) to bypass the computation during the heavy streaming phase.

## 2025-05-18 - [React Performance] Memoizing list maps alongside controlled inputs
**Learning:** The React AutomationPlayground component contained a `logs.map(...)` operation inline with multiple controlled inputs (like `name`, `business`, `phone`). Because it wasn't memoized, typing a single character forced the entire logs array mapping and DOM element recreation to run again, causing input lag.
**Action:** Always wrap derived lists or array mappings (e.g., `logs.map()`) in a `useMemo` hook when they reside in the same component as a controlled text input to prevent O(N) recomputations on every keystroke.
