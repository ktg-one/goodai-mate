
## $(date +%Y-%m-%d) - Added ElevenLabs Widget
**Action:** Implemented the `<elevenlabs-convai>` tag and `<Script>` tag in the root layout to initialize a conversational AI agent globally across the site.
**Learning:** For Next.js/React 19 projects utilizing custom web components, it's essential to define the component in a `.d.ts` declaration file extending `React.JSX.IntrinsicElements` to prevent TS2339 build errors during compilation.

## 2024-05-18 - Memoize redundant array mapping in render
**Learning:** Creating new array objects inline (like `[...items, ...items, ...items, ...items].map()`) forces O(N) reallocation and React reconciliation on every single re-render of the component, which wastes memory and CPU.
**Action:** Use `useMemo` with appropriate dependencies to calculate and store the generated element arrays once, returning the cached version on subsequent re-renders unless the dependencies change.

## 2024-05-18 - Replace setInterval with requestAnimationFrame
**Learning:** `setInterval` executes its callback strictly at fixed intervals regardless of browser repaint cycles or tab visibility, which leads to dropped frames (jank) and wasted CPU cycles when the page is backgrounded.
**Action:** Replace `setInterval` in visual animation loops with `requestAnimationFrame`. Use timestamp deltas inside the `requestAnimationFrame` callback to throttle execution to a specific frame rate while allowing the browser to optimize or pause execution for offscreen tabs.
