## 2026-07-11 - Add ARIA Roles to Segmented Controls
**Learning:** Custom tab and segmented control buttons that rely on visual styling to indicate their selected state do not communicate this to assistive technologies by default.
**Action:** Always explicitly wrap these groups in containers with `role="group"` or `role="radiogroup"` and an `aria-label`, and add `aria-pressed={condition}` (for grouped buttons/tabs) or `aria-selected={condition}` / `aria-checked={condition}` (for radiogroups) to the interactive elements to ensure screen readers announce their active state.

## 2026-07-13 - Add ARIA live regions to terminal logs and status overlays
**Learning:** Dynamic state changes in Brutalist 'terminal log' text areas and custom floating status indicators are not announced to screen readers by default.
**Action:** Always add `role="log"` and `aria-live="polite"` to terminal output containers, and `role="status"` with `aria-live="polite"` to custom UI status overlays.
