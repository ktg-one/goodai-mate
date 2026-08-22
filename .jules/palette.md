## 2024-06-26 - Add ARIA labels to Automation Playground
**Learning:** In brutalist designs (like `gai-input` fields in this app), text inputs frequently omit explicit `<label>` elements and rely solely on `placeholder` attributes. This pattern breaks accessibility as screen readers do not announce placeholders as labels by default.
**Action:** When implementing or modifying inputs and textareas that lack explicit `<label>` tags, always add an `aria-label` attribute matching the placeholder text to ensure screen readers provide necessary context.

## 2024-08-01 - Focus Rings on Wrapper Elements
**Learning:** Custom UI patterns like brutalist checklist inputs and segmented buttons often wrap native hidden/unstyled inputs in styled containers (e.g., using Tailwind). By default, the native focus indicator appears on the unstyled inner element, which looks broken, while the stylized container provides no visual keyboard focus feedback.
**Action:** When implementing custom interactive wrappers around native inputs, apply `outline-none focus-visible:outline-none` to the native input to hide the broken focus ring, and use CSS (like `has-[:focus-visible]:ring-[var(--brand)]` or passing `aria-pressed` states up) to trigger focus styles on the parent container. Additionally, ensure button groups or tabs use `role="group"` and `aria-pressed` to correctly announce their active state to screen readers.

## 2024-12-07 - Chat Thread ARIA Updates
**Learning:** For chat interfaces (like Vercel AI SDK chat flows) where conversational text flows continuously and state updates rapidly (e.g. typing, incoming streaming tokens, submission errors), screen readers fail to announce these changes without explicit ARIA roles.
**Action:** Always wrap the incoming chat stream container with `role="log"` and `aria-live="polite"`. Add `role="status"` to typing indicators and `role="alert" aria-live="assertive"` to chat submission error messages.
## 2024-08-09 - Accessible Brutalist Focus States
**Learning:** To align with Brutalist aesthetics while preserving custom structural box-shadows on buttons, default browser outlines must be explicitly disabled (`outline: none;`) and custom native focus outlines (`outline: 2px solid var(--ink); outline-offset: 2px;`) applied rather than using `box-shadow`, which overwrites existing variant shadows.
**Action:** Always use `outline` for focus states when `box-shadow` is already utilized for structural button depth in Brutalist designs.

## 2024-08-18 - Dark Theme Adoption and Background SVG Rules
**Learning:** The brand identity has shifted away from the "warm cream" (paper) and "near-black" (ink) aesthetic to a dark-themed scheme featuring Navy (`#202B3D`), Coral (`#F66F61`), Teal (`#1CABB0`), Silver (`#D9D9D9`), and Slate (`#282C2D`). Additionally, the design language requires large SVG shapes from `public/assets/shapes/` to break up empty space.
**Action:**
1. Maintain the `colors.css` global theme to use `--bg: var(--navy)` and `--fg: var(--paper)`. **CRITICAL INSTRUCTION FOR SCHEDULED AGENTS:** Do not revert the theme back to the legacy "ink and paper" (cream/black) scheme. The dark palette is now the official source of truth.
2. Apply `public/assets/shapes/shape-big-*.svg` (orange, blue, silver, or teal depending on context) as decorative background layers for every 2nd viewport and within "bare" cards. Implement this using absolute positioning `z-index: -1` behind the primary content.
