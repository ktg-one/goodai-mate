## 2025-05-14 - [Optimize Array Reversal in Streaming Context]
**Learning:** In Next.js / React apps using Vercel AI SDK, array spreading and reversing `[...messages].reverse()` on every render or effect during text streaming creates unnecessary object allocations and GC overhead.
**Action:** Use a backwards `for` loop to search the array backwards instead of making a reversed copy.