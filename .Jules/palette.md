## 2024-07-07 - Announce state of Hero segmented controls to screen readers
**Learning:** Segmented controls that rely entirely on visual cues for their active state (like the 'stamp-btn' combinations in the Hero section for visual mode and mic sensitivity) are invisible to screen readers, causing accessibility issues.
**Action:** Always add `role="group"` and a descriptive `aria-label` to the container of such controls, and use the `aria-pressed` attribute on the buttons to explicitly communicate their active state to assistive technologies.
