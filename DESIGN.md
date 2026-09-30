---
name: Good'Ai
version: alpha
colors:
  primary: "#A4432B"
  primary-hover: "#873821"
  secondary: "#DCE3CC"
  tertiary: "#A4432B"
  neutral: "#F7F5ED"
  surface: "#FFFEF9"
  wash: "#ECEEE3"
  line: "#D5D6CA"
  muted: "#63685D"
  on-primary: "#F7F5ED"
  on-secondary: "#333B32"
  on-tertiary: "#F7F5ED"
  on-neutral: "#333B32"
  error: "#A4432B"
  success: "#42583B"
  warning: "#A4432B"
typography:
  h1: { fontFamily: "Manrope", fontSize: "clamp(62px, 6.9vw, 104px)", fontWeight: 500, lineHeight: "1.02", letterSpacing: "-0.04em" }
  h2: { fontFamily: "Manrope", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 500, lineHeight: "1.08", letterSpacing: "-0.04em" }
  body-lg: { fontFamily: "Manrope", fontSize: "17px", fontWeight: 400, lineHeight: "1.8", letterSpacing: "normal" }
  body-md: { fontFamily: "Manrope", fontSize: "15px", fontWeight: 400, lineHeight: "1.85", letterSpacing: "normal" }
  body-sm: { fontFamily: "Manrope", fontSize: "13px", fontWeight: 400, lineHeight: "1.7", letterSpacing: "normal" }
  label: { fontFamily: "Manrope", fontSize: "13px", fontWeight: 600, lineHeight: "1.65", letterSpacing: "normal" }
rounded:
  sm: "4px"
  md: "5px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    minHeight: "44px"
    states:
      default: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}" }
      hover: { backgroundColor: "{colors.primary-hover}", textColor: "{colors.on-primary}" }
      active: { backgroundColor: "{colors.primary-hover}", textColor: "{colors.on-primary}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5, cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
    states:
      default: { backgroundColor: "{colors.surface}", borderColor: "{colors.line}" }
      hover: { borderColor: "{colors.primary}" }
      active: { borderColor: "{colors.primary}" }
      pressed: { borderColor: "{colors.primary}" }
      disabled: { opacity: 0.5, cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
      error: { borderColor: "{colors.error}" }
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    accentColor: "{colors.tertiary}"
    accentTextColor: "{colors.on-tertiary}"
    warningColor: "{colors.warning}"
    states:
      default: { backgroundColor: "{colors.surface}", borderColor: "{colors.line}" }
      hover: { backgroundColor: "{colors.wash}" }
      active: { backgroundColor: "{colors.wash}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  navigation:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-neutral}"
    typography: "{typography.label}"
    gap: "{spacing.lg}"
    states:
      default: { textColor: "{colors.on-neutral}" }
      hover: { textColor: "{colors.primary}" }
      active: { textColor: "{colors.primary}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  service-row:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    secondaryTextColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    states:
      default: { backgroundColor: "{colors.neutral}" }
      hover: { backgroundColor: "{colors.wash}", arrowBackgroundColor: "{colors.primary}", arrowTextColor: "{colors.on-primary}" }
      active: { backgroundColor: "{colors.wash}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  workflow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    rounded: "{rounded.lg}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md}"
    completeBackgroundColor: "{colors.secondary}"
    completeTextColor: "{colors.success}"
    states:
      default: { backgroundColor: "{colors.surface}" }
      hover: { backgroundColor: "{colors.wash}" }
      active: { backgroundColor: "{colors.wash}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  scenario-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    activeBackgroundColor: "{colors.secondary}"
    activeTextColor: "{colors.on-secondary}"
    rounded: "{rounded.sm}"
    typography: "{typography.label}"
    states:
      default: { backgroundColor: "{colors.surface}" }
      hover: { backgroundColor: "{colors.secondary}" }
      active: { backgroundColor: "{colors.wash}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  rule-switch:
    backgroundColor: "{colors.line}"
    thumbColor: "{colors.neutral}"
    activeBackgroundColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    states:
      default: { backgroundColor: "{colors.line}" }
      hover: { cursor: "pointer" }
      active: { backgroundColor: "{colors.success}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  disclosure:
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    typography: "{typography.label}"
    states:
      default: { expanded: false }
      hover: { textColor: "{colors.primary}" }
      active: { expanded: true }
      pressed: { expanded: "toggle" }
      disabled: { opacity: 0.5 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
---

## Overview
Good'Ai is an approachable, practical operator designed to streamline workflows and give people time back. The brand voice is plain English, warm, capable, and conversational. The target visual atmosphere balances editorial sans-serif typography, tactile paper-like surfaces, and grounding terracotta accents.

Scope applies to Next.js 16 App Router web interfaces across responsive viewports (mobile, tablet, desktop) using standard web accessibility paradigms (WCAG 2.2 AA).

## Colors
The palette is built upon warm, earthy tones that invoke trust and clarity:
- `primary` ({colors.primary}): Terracotta accent used for interactive primary actions, calls to action, brand punctuation, and focused accents.
- `primary-hover` ({colors.primary-hover}): Deep terracotta used for hover and active feedback states on primary controls.
- `secondary` ({colors.secondary}): Soft sage surface for contact highlights, soft accents, and active switches.
- `tertiary` ({colors.tertiary}): Aligned with terracotta for warning/alert highlights and critical calls to action.
- `neutral` ({colors.neutral}): Warm paper canvas providing high-contrast readability without harsh stark white.
- `surface` ({colors.surface}): Clean warm white surface for elevated cards and interactive panels.
- `wash` ({colors.wash}): Recessed background for alternate sections and hovered interactive components.
- `line` ({colors.line}): Hairline rules and dividers separating content.
- `muted` ({colors.muted}): Secondary copy, captions, and supporting label text in muted olive.
- `on-primary` ({colors.on-primary}): High-contrast paper text on terracotta surfaces.
- `on-secondary` ({colors.on-secondary}): Dark olive ink text on sage backgrounds.
- `on-tertiary` ({colors.on-tertiary}): High-contrast text on tertiary surfaces.
- `on-neutral` ({colors.on-neutral}): Primary body text and headlines on paper and white surfaces.
- `error` ({colors.error}): Terracotta accent for error states and validation alerts.
- `success` ({colors.success}): Dark success olive for completed steps and success indicators.
- `warning` ({colors.warning}): Terracotta tone for warnings and inline notices.

All text and background token pairs strictly satisfy WCAG 2.2 AA contrast requirements (e.g., `{colors.on-neutral}` on `{colors.neutral}` is 10.61:1; `{colors.muted}` on `{colors.neutral}` is 5.24:1; `{colors.primary}` on `{colors.neutral}` is 5.63:1; `{colors.on-secondary}` on `{colors.secondary}` is 8.77:1; `{colors.success}` on `{colors.secondary}` is 5.91:1).

## Typography
Typography uses Manrope as the primary sans-serif workhorse for clear readability, structured navigation, and interface controls.
- Scale logic:
  - `h1`: clamp(62px, 6.9vw, 104px), weight 500, line height 1.02, letter spacing -0.04em.
  - `h2`: clamp(36px, 4vw, 58px), weight 500, line height 1.08, letter spacing -0.04em.
  - `body-lg`: 17px, weight 400, line height 1.8.
  - `body-md`: 15px, weight 400, line height 1.85.
  - `body-sm`: 13px, weight 400, line height 1.7.
  - `label`: 13px, weight 600, line height 1.65.

Sentence case is preferred across all headings and body copy to maintain an approachable, conversational voice.

## Layout
Grid & Spacing System:
- Baseline spacing follows modular tokens: `xs` ({spacing.xs}), `sm` ({spacing.sm}), `md` ({spacing.md}), `lg` ({spacing.lg}), `xl` ({spacing.xl}).
- Maximum content width is capped at 1440px inside centered layout shells.
- Breakpoints:
  - Narrow Mobile: <= 390px
  - Mobile: <= 760px
  - Tablet: <= 1100px
  - Desktop: >= 1600px

Outer gutters adjust dynamically from 52px on desktop to 20px/16px on mobile.

## Elevation & Depth
Elevation is maintained using subtle structural borders (`{colors.line}`) and high-contrast surface transitions (`{colors.surface}`, `{colors.wash}`, `{colors.neutral}`) rather than heavy drop shadows or decorative gradients.
- Structural cards use a single subtle soft shadow for workflow focus (`0 18px 40px -28px #333b3240`).
- Stacking order (Z-index):
  - Normal content: 0
  - Sticky header/navigation: 20
  - Accessibility skip link: 40

## Shapes
Corner radii follow a functional hierarchy:
- `sm` ({rounded.sm}): Small controls, form input fields, and scenario toggles.
- `md` ({rounded.md}): Buttons and primary action triggers.
- `lg` ({rounded.lg}): Interactive workflow panels, cards, and detail containers.
- `full` ({rounded.full}): Pill badges, switch tracks, and circular action icons.

## Components
Interactive component families define complete state matrices (default, hover, active, pressed, disabled, focus, error) using semantic token references:

- `button-primary`: Primary CTA button with min-height of 44px, using `{colors.primary}` background and `{colors.on-primary}` text.
- `input-field`: Standard form text input using `{colors.surface}` background, `{colors.line}` border, and `{colors.primary}` focus ring.
- `card`: Surface container using `{colors.surface}` and `{rounded.lg}` radius with optional `{colors.tertiary}` accent badges.
- `navigation`: Header navigation links with primary hover feedback and explicit focus outlines using `{spacing.lg}` gap.
- `service-row`: Full-width row item with `{colors.wash}` hover background transition, `{colors.muted}` secondary text, and arrow trigger.
- `workflow`: Interactive scenario runner card with `{colors.secondary}` background and `{colors.success}` text for completed steps.
- `scenario-control`: Segmented button control for previewing workflow presets with `{colors.secondary}` hover/active states.
- `rule-switch`: Accessible toggle switch using native button controls with Space/Enter support, `{colors.success}` active track, and `aria-checked`.
- `disclosure`: Native details/summary accordion for FAQs with `{colors.primary}` color hover states and keyboard focus rings.

All interactive elements feature a standard visible focus ring: `2px solid {colors.primary}` with a `5px` offset (`focus-visible`).

## Do's and Don'ts
- Do: Use semantic tokens like `{colors.neutral}` and `{colors.on-neutral}` for body copy and card backgrounds.
- Don't: Embed raw hex codes directly into component definitions or inline styles.
- Do: Ensure interactive targets meet minimum 44px height for touch and keyboard accessibility.
- Don't: Rely solely on color changes to convey state transitions (always pair with icons, aria attributes, or text labels).
- Do: Provide explicit focus rings (`focus-visible`) on all interactive controls.
- Don't: Remove or obscure focus outlines on keyboard-navigable elements.
