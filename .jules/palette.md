## 2024-06-26 - Add ARIA labels to Automation Playground
**Learning:** In brutalist designs (like `gai-input` fields in this app), text inputs frequently omit explicit `<label>` elements and rely solely on `placeholder` attributes. This pattern breaks accessibility as screen readers do not announce placeholders as labels by default.
**Action:** When implementing or modifying inputs and textareas that lack explicit `<label>` tags, always add an `aria-label` attribute matching the placeholder text to ensure screen readers provide necessary context.

## 2024-08-01 - Focus Rings on Wrapper Elements
**Learning:** Custom UI patterns like brutalist checklist inputs and segmented buttons often wrap native hidden/unstyled inputs in styled containers (e.g., using Tailwind). By default, the native focus indicator appears on the unstyled inner element, which looks broken, while the stylized container provides no visual keyboard focus feedback.
**Action:** When implementing custom interactive wrappers around native inputs, apply `outline-none focus-visible:outline-none` to the native input to hide the broken focus ring, and use CSS (like `has-[:focus-visible]:ring-[var(--brand)]` or passing `aria-pressed` states up) to trigger focus styles on the parent container. Additionally, ensure button groups or tabs use `role="group"` and `aria-pressed` to correctly announce their active state to screen readers.
## 2024-09-12 - Screen reader announcements for chat threads
**Learning:** For chat interfaces (e.g., using Vercel AI SDK) where incoming streaming messages are appended dynamically, standard HTML tags don't automatically announce new content to screen readers.
**Action:** Always wrap the chat thread container with `role="log"` and `aria-live="polite"`. Additionally, apply `role="status"` to typing indicators and `role="alert" aria-live="assertive"` to error messages to ensure screen readers announce these critical conversational updates immediately.
