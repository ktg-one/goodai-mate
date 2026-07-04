## 2026-07-04 - Added ARIA log roles to terminal components
**Learning:** The Brutalist UI aesthetic heavily relies on custom components like terminal outputs and status overlays which screen readers won't automatically read correctly as dynamic content.
**Action:** Always add `role="log"` and `aria-live="polite"` to components that emulate live streaming terminals or status indicators.
