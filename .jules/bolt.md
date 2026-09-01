
## $(date +%Y-%m-%d) - Added ElevenLabs Widget
**Action:** Implemented the `<elevenlabs-convai>` tag and `<Script>` tag in the root layout to initialize a conversational AI agent globally across the site.
**Learning:** For Next.js/React 19 projects utilizing custom web components, it's essential to define the component in a `.d.ts` declaration file extending `React.JSX.IntrinsicElements` to prevent TS2339 build errors during compilation.

## 2023-10-27 - Optimize InfiniteMarquee re-renders
**Learning:** Inline array literals as default props break referential equality, and array spreading and mapping operations in render are O(N).
**Action:** Extract static default props to a constant and wrap list mapping in `useMemo` when working with lists.
