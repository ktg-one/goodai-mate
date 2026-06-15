## Palette Journal

## 2024-05-24 - Add ARIA Labels to inputs with only placeholders
**Learning:** Brutalist or minimal design patterns in this app often omit explicit `<label>` elements and rely solely on `<input placeholder="...">`. This is an accessibility issue for screen readers.
**Action:** When creating or modifying inputs or textareas that use placeholders as visual labels in the `gai-input` class or similar patterns, ensure that an explicit `aria-label` attribute matching the placeholder text is also provided.
