## 2024-05-31 - [Vercel AI SDK Re-render Optimization]
**Learning:** In Vercel AI SDK `useChat` interfaces, putting the local state for the chat text `input` in the same component as the message list causes the *entire* message list (and component) to re-render on every keystroke. This causes severe performance issues as the chat transcript grows.
**Action:** Always extract the input field and its local typing state into a separate child component wrapped in `React.memo()`. Pass the `onSubmit` handler down using `useCallback` to isolate typing updates strictly to the input element itself.
