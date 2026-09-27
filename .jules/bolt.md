## 2024-05-24 - Memoize Mapped Component Lists
**Learning:** Re-creating React elements in inline mappings (like `[...items].map(...)`) during every render forces redundant $O(N)$ operations and unneeded DOM reconciliation overhead, decreasing rendering performance.
**Action:** Wrap array mapping operations in a `useMemo` block that depends on the source data array to prevent redundant element re-creation when the parent component re-renders.
## 2024-05-24 - Memoize Mapped Component Lists and Preserve Referential Equality
**Learning:** Re-creating React elements in inline mappings (like `[...items].map(...)`) during every render forces redundant $O(N)$ operations. However, wrapping it in `useMemo` is useless if the dependency (e.g. `items = ["A"]` default prop) is re-created on every render, as it breaks referential equality.
**Action:** Move static default array props outside the component to preserve referential equality, and wrap array mapping operations in a `useMemo` block that depends on the source data array.
## 2026-09-27 - Fix pure state updates in Preloader
**Learning:** Placing side effects like `setTimeout` or `clearInterval` inside state updater functions (e.g. `setCounter(prev => ...)`) causes bugs in React Strict Mode because updaters run multiple times, leading to duplicate side effects and race conditions.
**Action:** Extract side effects out of state updaters and manage state changes using local closure variables inside the animation loop.
