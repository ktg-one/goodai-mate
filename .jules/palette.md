## 2024-06-26 - Add ARIA labels to Automation Playground
**Learning:** In brutalist designs (like `gai-input` fields in this app), text inputs frequently omit explicit `<label>` elements and rely solely on `placeholder` attributes. This pattern breaks accessibility as screen readers do not announce placeholders as labels by default.
**Action:** When implementing or modifying inputs and textareas that lack explicit `<label>` tags, always add an `aria-label` attribute matching the placeholder text to ensure screen readers provide necessary context.

## 2024-08-01 - Focus Rings on Wrapper Elements
**Learning:** Custom UI patterns like brutalist checklist inputs and segmented buttons often wrap native hidden/unstyled inputs in styled containers (e.g., using Tailwind). By default, the native focus indicator appears on the unstyled inner element, which looks broken, while the stylized container provides no visual keyboard focus feedback.
**Action:** When implementing custom interactive wrappers around native inputs, apply `outline-none focus-visible:outline-none` to the native input to hide the broken focus ring, and use CSS (like `has-[:focus-visible]:ring-[var(--brand)]` or passing `aria-pressed` states up) to trigger focus styles on the parent container. Additionally, ensure button groups or tabs use `role="group"` and `aria-pressed` to correctly announce their active state to screen readers.

## 2024-11-20 - Accessible Terminal Logs
**Learning:** Terminal-style log containers used for live execution feedback in brutalist designs (like the `AutomationPlayground`) are not announced to screen readers by default when new log lines are appended dynamically.
**Action:** Always add `role="log"` and `aria-live="polite"` to containers that act as live terminal output or dynamic status indicators to ensure screen readers announce new items as they appear without interrupting the user unnecessarily.
