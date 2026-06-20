## 2024-05-18 - [Add aria-labels to AutomationPlayground]
**Learning:** Inputs without explicit labels require `aria-label` matching their placeholder text for accessibility.
**Action:** Always add `aria-label` to brutalist/minimal pattern inputs that lack an explicit `<label>`.
## 2024-06-20 - [Add aria-pressed to custom selection buttons]
**Learning:** Custom tab and segmented control buttons that rely on visual styling (like `bg-[var(--ink)]` or icons) to indicate their selected state do not communicate this to assistive technologies by default.
**Action:** Always add `aria-pressed={condition}` or appropriate `aria-selected` attributes to interactive elements acting as tabs or toggle groups to ensure screen readers announce their active state.
