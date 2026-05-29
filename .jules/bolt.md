## 2024-05-18 - Extract Input State from Vercel AI SDK Chat UI
**Learning:** In chat interfaces using the Vercel AI SDK, having the text input state coupled to the main chat component causes the entire list of messages to re-render on every keystroke. This is a significant bottleneck, especially as the message list grows.
**Action:** Always extract text input and its state into a separate, memoized child component to prevent the entire message list from re-rendering on every keystroke.
