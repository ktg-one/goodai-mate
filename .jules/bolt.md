
## $(date +%Y-%m-%d) - Added ElevenLabs Widget
**Action:** Implemented the `<elevenlabs-convai>` tag and `<Script>` tag in the root layout to initialize a conversational AI agent globally across the site.
**Learning:** For Next.js/React 19 projects utilizing custom web components, it's essential to define the component in a `.d.ts` declaration file extending `React.JSX.IntrinsicElements` to prevent TS2339 build errors during compilation.

## $(date +%Y-%m-%d) - Optimize Marquee Mapping Re-renders
**Learning:** Inline array defaults (e.g. \`items = ["A"]\`) break referential equality, causing \`useMemo\` blocks to needlessly re-execute.
**Action:** Extracted static array default props to constants outside the component and wrapped the component list mapping in \`useMemo\` to prevent redundant O(N) array regenerations on re-renders.
