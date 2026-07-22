## 2026-07-11 - Add ARIA Roles to Segmented Controls
**Learning:** Custom tab and segmented control buttons that rely on visual styling to indicate their selected state do not communicate this to assistive technologies by default.
**Action:** Always explicitly wrap these groups in containers with `role="group"` or `role="radiogroup"` and an `aria-label`, and add `aria-pressed={condition}` (for grouped buttons/tabs) or `aria-selected={condition}` / `aria-checked={condition}` (for radiogroups) to the interactive elements to ensure screen readers announce their active state.

## 2026-07-13 - Add ARIA live regions to terminal logs and status overlays
**Learning:** Dynamic state changes in Brutalist 'terminal log' text areas and custom floating status indicators are not announced to screen readers by default.
**Action:** Always add `role="log"` and `aria-live="polite"` to terminal output containers, and `role="status"` with `aria-live="polite"` to custom UI status overlays.

## 2026-07-14 - Enhanced OutboundCallCard accessibility
**Learning:** Custom segmented controls (like the agent selector) using `role="group"` and `aria-pressed` do not correctly convey radio button semantics to screen readers. Furthermore, dynamic elements like terminal logs and custom success/error overlays must explicitly declare `role="log"` or `role="status"/`role="alert"` with `aria-live` attributes to ensure updates are announced dynamically.
**Action:** Always use `role="radiogroup"`, `role="radio"`, and `aria-checked` for grouped mutually-exclusive buttons. Always add `role="log" aria-live="polite"` to terminal-style text output containers and `role="status"` or `role="alert"` for dynamically appearing custom feedback overlays.

## 2026-07-22 - Explicit Input Types and AutoComplete for Custom Form Inputs
**Learning:** For custom form inputs (e.g., using the `gai-input` class), omitting explicit `type` and `autoComplete` attributes results in poor UX on mobile devices, as it fails to trigger the appropriate virtual keyboards (e.g., numeric for phone, email for email) and prevents native browser autofill, increasing user friction.
**Action:** Always explicitly declare the correct `type` attribute (`tel`, `email`, `url`, `text`) and include relevant `autoComplete` attributes (`name`, `organization`, `tel`, `email`, `url`) on form inputs to ensure proper keyboard selection and enable autofill.
