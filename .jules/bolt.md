## 2025-01-20 - [Architectural pattern: Vercel AI SDK chat interface memoization]
**Learning:** In chat interfaces using the Vercel AI SDK, having the input state in the main chat component causes the entire message list to re-render on every keystroke.
**Action:** Always extract text input and its state into a separate, memoized child component to prevent unnecessary re-renders.