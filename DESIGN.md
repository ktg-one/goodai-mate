---
name: Good'Ai — Good work. More life.
version: alpha
colors:
  primary: "#a4432b"
  primary-hover: "#873821"
  on-primary: "#f7f5ed"
  neutral: "#f7f5ed"
  on-neutral: "#333b32"
  secondary: "#dce3cc"
  on-secondary: "#333b32"
  tertiary: "#873821"
  on-tertiary: "#f7f5ed"
  surface: "#fffef9"
  wash: "#eceee3"
  muted: "#63685d"
  line: "#d5d6ca"
  error: "#c82a17"
  on-error: "#f7f5ed"
  success: "#42583b"
  warning: "#f3a62a"
  on-warning: "#333b32"
typography:
  h1: { fontFamily: Manrope, fontSize: "clamp(62px, 6.9vw, 104px)", fontWeight: 500, lineHeight: "1.02", letterSpacing: "-0.04em" }
  h2: { fontFamily: Manrope, fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 500, lineHeight: "1.08", letterSpacing: "-0.04em" }
  expressive: { fontFamily: Fraunces, fontStyle: italic, fontWeight: 400, letterSpacing: "-0.035em" }
  handwritten: { fontFamily: Vibes, fontSize: "29px", fontWeight: 400, lineHeight: "1.3", letterSpacing: "0" }
  body-lg: { fontFamily: Manrope, fontSize: "17px", fontWeight: 400, lineHeight: "1.8" }
  body-md: { fontFamily: Manrope, fontSize: "15px", fontWeight: 400, lineHeight: "1.85" }
  body-sm: { fontFamily: Manrope, fontSize: "13px", fontWeight: 400, lineHeight: "1.7" }
  label: { fontFamily: Manrope, fontSize: "13px", fontWeight: 600, lineHeight: "1.65" }
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
      disabled: { opacity: 0.5, cursor: "not-allowed", backgroundColor: "{colors.muted}" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
      error: { backgroundColor: "{colors.error}", textColor: "{colors.on-error}" }
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
      disabled: { backgroundColor: "{colors.wash}", textColor: "{colors.muted}", cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "2px" }
      error: { borderColor: "{colors.error}", textColor: "{colors.on-neutral}", outlineColor: "{colors.error}" }
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    states:
      default: { backgroundColor: "{colors.surface}" }
      hover: { backgroundColor: "{colors.wash}" }
      active: { backgroundColor: "{colors.wash}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.6 }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "2px" }
      error: { borderColor: "{colors.error}" }
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
      disabled: { textColor: "{colors.muted}", cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
      error: { textColor: "{colors.error}" }
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
      disabled: { opacity: 0.5, cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
      error: { borderColor: "{colors.error}" }
  workflow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    rounded: "{rounded.lg}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md}"
    completeBackgroundColor: "{colors.secondary}"
    completeTextColor: "{colors.success}"
    warningBackgroundColor: "{colors.warning}"
    warningTextColor: "{colors.on-warning}"
    tertiaryColor: "{colors.tertiary}"
    tertiaryTextColor: "{colors.on-tertiary}"
  scenario-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    rounded: "{rounded.sm}"
    typography: "{typography.label}"
    states:
      default: { backgroundColor: "{colors.surface}" }
      hover: { backgroundColor: "{colors.secondary}" }
      active: { backgroundColor: "{colors.wash}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5, cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
      error: { backgroundColor: "{colors.error}", textColor: "{colors.on-error}" }
  rule-switch:
    backgroundColor: "{colors.line}"
    thumbColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    states:
      default: { backgroundColor: "{colors.line}" }
      hover: { cursor: "pointer" }
      active: { backgroundColor: "{colors.success}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5, cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
      error: { backgroundColor: "{colors.error}" }
  disclosure:
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    typography: "{typography.label}"
    states:
      default: { expanded: false }
      hover: { textColor: "{colors.primary}" }
      active: { expanded: true }
      pressed: { expanded: "toggle" }
      disabled: { opacity: 0.5, cursor: "not-allowed" }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
      error: { textColor: "{colors.error}" }
global:
  backgroundColor: "{colors.neutral}"
  textColor: "{colors.on-neutral}"
  displayTypography: "{typography.h1}"
  sectionTypography: "{typography.h2}"
  emphasisTypography: "{typography.expressive}"
  handwrittenTypography: "{typography.handwritten}"
  leadTypography: "{typography.body-lg}"
  bodyTypography: "{typography.body-md}"
  sectionSpace: "{spacing.xl}"
  contactBackgroundColor: "{colors.secondary}"
  contactTextColor: "{colors.on-secondary}"
---

## Overview
Good'Ai is an approachable, practical AI operator that gives people time back. This identity combines a clear everyday sans with expressive serif accents, sunlit coastal imagery, and calm, earthy color. Target platform scope covers Web, iOS, Android, and Desktop web, with strict performance constraints (locally hosted variable fonts, static asset preloading, zero layout shift) and compliance bounds (WCAG 2.2 AA by construction).

## Colors
The palette is built around warm paper canvas tones and dark olive ink, anchored by terracotta accents that drive action and visual emphasis.

- `{colors.primary}` (`#a4432b`): Warm terracotta rust accent used for primary interactive calls to action, focus rings, wordmark punctuation, and primary visual anchors.
- `{colors.primary-hover}` (`#873821`): Deep terracotta for hover and active states of primary controls.
- `{colors.on-primary}` (`#f7f5ed`): Light paper text color placed on primary terracotta backgrounds, achieving 6.23:1 contrast.
- `{colors.neutral}` (`#f7f5ed`): Soft warm paper canvas tone forming the overall background surface.
- `{colors.on-neutral}` (`#333b32`): Dark olive ink used for primary body text and headlines, achieving 10.57:1 contrast on `{colors.neutral}`.
- `{colors.secondary}` (`#dce3cc`): Calming sage green used for supporting surfaces, contact callouts, and completed states.
- `{colors.on-secondary}` (`#333b32`): Dark olive ink placed on secondary sage surfaces, achieving 8.56:1 contrast.
- `{colors.tertiary}` (`#873821`): Reserved for strong secondary emphasis and high-impact calls to action.
- `{colors.on-tertiary}` (`#f7f5ed`): High-contrast light text on tertiary surfaces, achieving 7.35:1 contrast.
- `{colors.surface}` (`#fffef9`): Pure warm white surface for elevated cards and interactive panels.
- `{colors.wash}` (`#eceee3`): Light recessed surface tint for section differentiation and active/hover row highlights.
- `{colors.muted}` (`#63685d`): Muted olive grey for secondary body labels and supporting descriptions, achieving 5.23:1 contrast.
- `{colors.line}` (`#d5d6ca`): Subtle border and rule color for structural dividers.
- `{colors.error}` (`#c82a17`): Deep coral red reserved strictly for validation error states and destructive actions, achieving 5.06:1 contrast on `{colors.on-error}`.
- `{colors.on-error}` (`#f7f5ed`): Light text on error backgrounds.
- `{colors.success}` (`#42583b`): Deep olive green for success badges and completed switch tracks, achieving 5.91:1 contrast on `{colors.secondary}`.
- `{colors.warning}` (`#f3a62a`): Gold warning accent for alert states, achieving 5.68:1 contrast with `{colors.on-warning}`.
- `{colors.on-warning}` (`#333b32`): Dark olive ink placed on warning backgrounds.

Usage rules: `{colors.primary}` is reserved for main CTAs and active states. `{colors.error}` is reserved exclusively for validation failures and destructive actions. All text-on-background pairs strictly satisfy WCAG 2.2 AA (minimum 4.5:1 ratio).

## Typography
Typography pairs clear everyday readability with human editorial expression through locally hosted fonts.

- **Manrope**: Main structural typeface across navigation, services, body text, and control labels (`{typography.h1}`, `{typography.h2}`, `{typography.body-lg}`, `{typography.body-md}`, `{typography.body-sm}`, `{typography.label}`). Chosen for exceptional legibility at both large display sizes and small UI scales.
- **Fraunces (Italic)**: Expressive serif (`{typography.expressive}`) used selectively for headline emphasis and human brand promises.
- **Vibes**: Handwritten script (`{typography.handwritten}`) used sparingly for brief, reassuring secondary notes. Never used for essential navigation, prices, or instructions.

Scale logic uses a responsive fluid typography curve, anchoring display copy to viewport width while preserving tight leading (`lineHeight: 1.02` for `{typography.h1}`) and relaxed body line height (`lineHeight: 1.85` for `{typography.body-md}`). Tabular figures are enforced for numerical data.

## Layout
Layout utilizes a flexible 12-column responsive grid anchored to a 4px baseline grid.

- **Max content width**: 1440px centered container.
- **Outer gutters**: 52px (desktop >= 1600px), 32px (tablet <= 1100px), 20px (mobile <= 760px), 16px (narrow mobile <= 390px).
- **Breakpoints**: 1600px (desktop xl), 1100px (desktop/tablet), 760px (mobile), 390px (narrow mobile).
- **Grid behavior**: Hero and interactive demo sections use unequal two-column grids on desktop and collapse into single-column reading order on mobile. Navigation transitions from horizontal link items to inline collapsible disclosures.

## Elevation & Depth
Elevation is expressed through clean hairline borders (`{colors.line}`) and flat paper stacking rather than heavy shadows or blurred backdrops.

- **Flat card elevation**: Hairline 1px border using `{colors.line}` over `{colors.surface}`.
- **Workflow panel depth**: Single soft elevated shadow (`0 10px 30px -10px rgba(51,59,50,0.08)`).
- **Z-index hierarchy**:
  - Base content: `z-index: 0`
  - Sticky navigation bar: `z-index: 20`
  - Skip to content link / overlay disclosures: `z-index: 40`
  - Modal / third-party integrations: `z-index: 50`

Reduced-motion rules disable ambient depth movements and floating scroll triggers, rendering static flat panels instead.

## Shapes
Radius philosophy balances geometric structure with organic softness across four standardized dimensions:

- `{rounded.sm}` (`4px`): Input controls, scenario buttons, and sharp interactive fields.
- `{rounded.md}` (`5px`): Primary action buttons and medium controls.
- `{rounded.lg}` (`12px`): Elevated cards, workflow demo containers, and structural content panels.
- `{rounded.full}` (`9999px`): Switch tracks, direction buttons, and pill badges.

## Components

### button-primary
- **Purpose**: Primary call-to-action button for initiating key user flows.
- **State Matrix**:
  - `default`: `{colors.primary}` background with `{colors.on-primary}` text.
  - `hover`: `{colors.primary-hover}` background with `{colors.on-primary}` text.
  - `active`: `{colors.primary-hover}` background.
  - `pressed`: `translateY(1px)` transform.
  - `disabled`: `{colors.muted}` background with `0.5` opacity and `not-allowed` cursor.
  - `focus`: `{colors.primary}` 2px outline with 5px offset.
  - `error`: `{colors.error}` background with `{colors.on-error}` text.
- **Interaction Rules**: Minimum touch height of 44px; padding is `{spacing.sm}` vertically and `{spacing.md}` horizontally.
- **Accessibility Notes**: Native `<button>` element with explicit focus indicator. Supports Space and Enter keys.

### input-field
- **Purpose**: Text input control for interactive forms and inquiry fields.
- **State Matrix**:
  - `default`: `{colors.surface}` background with `{colors.line}` border and `{colors.on-neutral}` text.
  - `hover`: `{colors.primary}` border.
  - `active`: `{colors.primary}` border.
  - `pressed`: `{colors.primary}` border.
  - `disabled`: `{colors.wash}` background with `{colors.muted}` text and `not-allowed` cursor.
  - `focus`: `{colors.primary}` 2px outline with 2px offset.
  - `error`: `{colors.error}` border and `{colors.error}` outline.
- **Interaction Rules**: Text size maps to `{typography.body-md}`; padding is `{spacing.xs}` vertically and `{spacing.sm}` horizontally.
- **Accessibility Notes**: Programmatically linked `<label>` via `htmlFor`. Exposes `aria-invalid="true"` during error states.

### card
- **Purpose**: Elevated surface container for grouping related content and service details.
- **State Matrix**:
  - `default`: `{colors.surface}` background with `{colors.line}` border.
  - `hover`: `{colors.wash}` background.
  - `active`: `{colors.wash}` background.
  - `pressed`: `translateY(1px)` transform.
  - `disabled`: `0.6` opacity.
  - `focus`: `{colors.primary}` 2px outline with 2px offset.
  - `error`: `{colors.error}` border.
- **Interaction Rules**: Uses `{rounded.lg}` radius and `{spacing.md}` padding.
- **Accessibility Notes**: Semantic `<section>` or `<article>` structure with heading labels.

### navigation
- **Purpose**: Main header navigation bar providing access to key pages and sections.
- **State Matrix**:
  - `default`: `{colors.neutral}` background with `{colors.on-neutral}` text.
  - `hover`: `{colors.primary}` text.
  - `active`: `{colors.primary}` text.
  - `pressed`: `translateY(1px)` transform.
  - `disabled`: `{colors.muted}` text with `not-allowed` cursor.
  - `focus`: `{colors.primary}` 2px outline with 5px offset.
  - `error`: `{colors.error}` text.
- **Interaction Rules**: Horizontal item gap uses `{spacing.lg}`.
- **Accessibility Notes**: Wrapped in semantic `<nav aria-label="Main navigation">`. Collapses into an expandable disclosure on mobile viewports.

### service-row
- **Purpose**: Interactive list row for cataloguing service features and capabilities.
- **State Matrix**:
  - `default`: `{colors.neutral}` background with `{colors.on-neutral}` text and `{colors.line}` border.
  - `hover`: `{colors.wash}` background with `{colors.primary}` arrow circle background and `{colors.on-primary}` arrow text.
  - `active`: `{colors.wash}` background.
  - `pressed`: `translateY(1px)` transform.
  - `disabled`: `0.5` opacity with `not-allowed` cursor.
  - `focus`: `{colors.primary}` 2px outline with 5px offset.
  - `error`: `{colors.error}` border.
- **Interaction Rules**: Uses `{typography.body-sm}` for title and `{colors.muted}` for secondary metadata.
- **Accessibility Notes**: Whole row is wrapped in a keyboard-navigable link or button with clear target description.

### workflow
- **Purpose**: Interactive simulation container demonstrating automation workflows and status transitions.
- **State Matrix**:
  - `default`: `{colors.surface}` background with `{colors.on-neutral}` text and `{rounded.lg}` corner radius.
  - `complete`: `{colors.secondary}` background with `{colors.success}` text.
  - `warning`: `{colors.warning}` background with `{colors.on-warning}` text.
  - `tertiary`: `{colors.tertiary}` background with `{colors.on-tertiary}` text.
- **Interaction Rules**: Uses `{spacing.md}` padding. Status changes trigger polite live updates.
- **Accessibility Notes**: Updates announced via `aria-live="polite"`. Does not rely solely on color changes for status indication.

### scenario-control
- **Purpose**: Tabular button control for switching workflow simulation scenarios.
- **State Matrix**:
  - `default`: `{colors.surface}` background with `{colors.on-neutral}` text.
  - `hover`: `{colors.secondary}` background.
  - `active`: `{colors.wash}` background.
  - `pressed`: `translateY(1px)` transform.
  - `disabled`: `0.5` opacity with `not-allowed` cursor.
  - `focus`: `{colors.primary}` 2px outline with 5px offset.
  - `error`: `{colors.error}` background with `{colors.on-error}` text.
- **Interaction Rules**: Uses `{rounded.sm}` corner radius and `{typography.label}` font style.
- **Accessibility Notes**: Uses `role="tab"` or native button with `aria-selected` / `aria-pressed`.

### rule-switch
- **Purpose**: Toggle switch for enabling or disabling automation rules.
- **State Matrix**:
  - `default`: `{colors.line}` track background with `{colors.neutral}` thumb.
  - `hover`: `pointer` cursor.
  - `active`: `{colors.success}` track background when toggled on.
  - `pressed`: `translateY(1px)` transform.
  - `disabled`: `0.5` opacity with `not-allowed` cursor.
  - `focus`: `{colors.primary}` 2px outline with 5px offset.
  - `error`: `{colors.error}` track background.
- **Interaction Rules**: Uses `{rounded.full}` radius and `{spacing.xs}` padding.
- **Accessibility Notes**: Radix Switch primitive emitting `role="switch"` and `aria-checked`. Responds to Space and Enter.

### disclosure
- **Purpose**: Collapsible accordion item for frequently asked questions and detailed notes.
- **State Matrix**:
  - `default`: Expanded state `false` with `{colors.on-neutral}` text and `{colors.line}` border.
  - `hover`: `{colors.primary}` text.
  - `active`: Expanded state `true`.
  - `pressed`: Toggles expansion.
  - `disabled`: `0.5` opacity with `not-allowed` cursor.
  - `focus`: `{colors.primary}` 2px outline with 5px offset.
  - `error`: `{colors.error}` text.
- **Interaction Rules**: Header trigger toggles content panel visibility.
- **Accessibility Notes**: Built on native `<details>`/`<summary>` or Radix Accordion with `aria-expanded` and `aria-controls`.

## Do's and Don'ts
- **Do**: Use `{colors.neutral}` background with `{colors.on-neutral}` text for primary content surfaces.
  **Don't**: Place `{colors.muted}` text on `{colors.wash}` background for essential body copy where contrast drops below 4.5:1.
- **Do**: Apply `{rounded.md}` to primary action buttons and `{rounded.lg}` to elevated cards for visual hierarchy.
  **Don't**: Mix arbitrary custom corner radii on controls within the same component family.
- **Do**: Ensure all interactive controls present a visible `{colors.primary}` focus ring with explicit offset when navigated by keyboard.
  **Don't**: Suppress browser focus outlines without providing a high-contrast custom replacement.
- **Do**: Respect `prefers-reduced-motion` settings by rendering static completed states instead of autoplaying GSAP animations.
  **Don't**: Rely exclusively on color transitions to indicate completion or error state.
