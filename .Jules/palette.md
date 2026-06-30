## 2026-06-30 - [Custom Radiogroups Accessibility]
**Learning:** Custom tab and segmented control buttons that rely on visual styling to indicate their selected state do not communicate this to assistive technologies by default.
**Action:** Always explicitly wrap these groups in containers with `role="radiogroup"` (or `role="group"`) and an appropriate label (`aria-label` or `aria-labelledby`), and add `role="radio"` and `aria-checked={condition}` (or `aria-pressed`/`aria-selected`) to the interactive elements to ensure screen readers announce their active state.
