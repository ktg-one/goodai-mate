## 2026-06-16 - Brutalist Inputs Accessibility
**Learning:** Brutalist minimalist designs often omit explicit `<label>` elements, relying only on placeholders. This creates an accessibility gap for screen readers.
**Action:** When implementing inputs without labels (like those using `gai-input`), always ensure an `aria-label` attribute is added to match the placeholder text to maintain accessibility.
