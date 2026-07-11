## 2026-07-11 - Add ARIA Roles to Segmented Controls
**Learning:** Custom tab and segmented control buttons that rely on visual styling to indicate their selected state do not communicate this to assistive technologies by default.
**Action:** Always explicitly wrap these groups in containers with `role="group"` or `role="radiogroup"` and an `aria-label`, and add `aria-pressed={condition}` (for grouped buttons/tabs) or `aria-selected={condition}` / `aria-checked={condition}` (for radiogroups) to the interactive elements to ensure screen readers announce their active state.
