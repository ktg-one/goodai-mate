## 2024-06-26 - Add ARIA labels to Automation Playground
**Learning:** In brutalist designs (like `gai-input` fields in this app), text inputs frequently omit explicit `<label>` elements and rely solely on `placeholder` attributes. This pattern breaks accessibility as screen readers do not announce placeholders as labels by default.
**Action:** When implementing or modifying inputs and textareas that lack explicit `<label>` tags, always add an `aria-label` attribute matching the placeholder text to ensure screen readers provide necessary context.

## 2024-06-27 - Add ARIA attributes to custom segmented controls
**Learning:** Custom tab and segmented control buttons that rely on visual styling (like `stamp-btn`) to indicate their selected state do not communicate this to assistive technologies by default.
**Action:** When implementing custom segmented controls, always explicitly wrap these groups in containers with `role="group"` and an `aria-label`, and add `aria-pressed={condition}` to the interactive elements to ensure screen readers announce their active state.
