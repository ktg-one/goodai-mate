## 2024-05-18 - [Add aria-labels to AutomationPlayground]
**Learning:** Inputs without explicit labels require `aria-label` matching their placeholder text for accessibility.
**Action:** Always add `aria-label` to brutalist/minimal pattern inputs that lack an explicit `<label>`.

## 2024-05-18 - [Communicate active states on segmented controls]
**Learning:** Custom tab and segmented control buttons that rely on visual styling to indicate their selected state do not communicate this to assistive technologies by default.
**Action:** Always add `aria-pressed={condition}` or `aria-selected={condition}` to these interactive elements to ensure screen readers announce their active state.
