## 2024-06-26 - Add ARIA labels to Automation Playground
**Learning:** In brutalist designs (like `gai-input` fields in this app), text inputs frequently omit explicit `<label>` elements and rely solely on `placeholder` attributes. This pattern breaks accessibility as screen readers do not announce placeholders as labels by default.
**Action:** When implementing or modifying inputs and textareas that lack explicit `<label>` tags, always add an `aria-label` attribute matching the placeholder text to ensure screen readers provide necessary context.
