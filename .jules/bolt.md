## 2025-02-18 - [Vercel AI SDK Chat Interface Keystroke Lag]
**Learning:** In chat interfaces using the Vercel AI SDK `useChat` (or similar large state models), keeping the text input state in the parent component causes the entire message list (which can grow very long) to re-render on every single keystroke. This O(N) re-render latency is a significant performance bottleneck.
**Action:** Always extract the text input and its state into a separate, memoized child component (`React.memo`) to prevent the parent and the entire message list from re-rendering on every keystroke.
