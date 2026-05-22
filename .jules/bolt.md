## 2024-03-XX - Streaming Chat Re-renders
**Learning:** During AI text streaming, the `useChat` hook updates the `messages` array state on every single token. Unoptimized chat lists will re-render all previous messages and re-compute their inner text on every token, causing O(N*M) DOM reconciliation complexity.
**Action:** Always wrap individual chat message components in `React.memo` so that only the currently streaming message re-renders, while previous messages skip reconciliation.
