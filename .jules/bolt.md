
## $(date +%Y-%m-%d) - Added ElevenLabs Widget
**Action:** Implemented the `<elevenlabs-convai>` tag and `<Script>` tag in the root layout to initialize a conversational AI agent globally across the site.
**Learning:** For Next.js/React 19 projects utilizing custom web components, it's essential to define the component in a `.d.ts` declaration file extending `React.JSX.IntrinsicElements` to prevent TS2339 build errors during compilation.
## 2024-10-24 - Memoize mapped component lists to preserve referential equality
**Learning:** Inline array literals (e.g., `items = ["A"]`) create a new reference on every render, breaking referential equality and causing `useMemo` or child components to re-render unnecessarily.
**Action:** Extract static default props to a constant outside the component (e.g., `const DEFAULT_ITEMS = [...]`) and wrap mapped component lists in `useMemo` with the data array as the dependency to prevent O(N) array recreation and element mapping on every re-render.
