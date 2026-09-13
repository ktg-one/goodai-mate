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
  surface: "#fffef9"
  wash: "#eceee3"
  muted: "#63685d"
  line: "#d5d6ca"
  success: "#42583b"
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
      default: { backgroundColor: "{colors.primary}" }
      hover: { backgroundColor: "{colors.primary-hover}" }
      active: { backgroundColor: "{colors.primary-hover}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { opacity: 0.5, cursor: not-allowed }
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
      disabled: { applicable: false }
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
      disabled: { applicable: false }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  workflow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    rounded: "{rounded.lg}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md}"
    completeBackgroundColor: "{colors.secondary}"
    completeTextColor: "{colors.success}"
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
      disabled: { applicable: false }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  rule-switch:
    backgroundColor: "{colors.line}"
    thumbColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    states:
      default: { backgroundColor: "{colors.line}" }
      hover: { cursor: pointer }
      active: { backgroundColor: "{colors.success}" }
      pressed: { transform: "translateY(1px)" }
      disabled: { applicable: false }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
  disclosure:
    textColor: "{colors.on-neutral}"
    borderColor: "{colors.line}"
    typography: "{typography.label}"
    states:
      default: { expanded: false }
      hover: { textColor: "{colors.primary}" }
      active: { expanded: true }
      pressed: { expanded: toggle }
      disabled: { applicable: false }
      focus: { outlineColor: "{colors.primary}", outlineWidth: "2px", outlineOffset: "5px" }
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
Good’Ai is an approachable, practical operator that gives people time back. This identity combines a clear everyday sans with expressive serif accents, sunlit coastal imagery and calm, earthy colour. Kevin selected this branding on 13 September 2026. The implementation remains a local fork pending the separate public-release checks.

## Colors
Primary provides the rust accent in the photograph, wordmark punctuation and calls to action. Neutral feels like paper, on-neutral like dark olive ink; secondary is the quieter sage close. Surface and wash separate actual interactive examples from editorial content. Muted is readable supporting copy, not decorative low-opacity text. Use line for dividers, never essential text.

Measured contrast ratios: on-neutral/neutral 10.61:1; muted/neutral 5.24:1; primary/neutral 5.63:1; on-neutral/secondary 8.77:1; muted/surface 5.67:1; muted/wash 4.88:1; success/secondary 5.91:1. No colour-only state: completion uses a check and status text; switches expose aria-checked.

## Typography
Manrope carries navigation, services and instructions. Fraunces italic gives the human promise a distinct voice. The original Vibes handwriting adds brief reassuring asides, including “Go on. Knock off early.” All three are locally hosted, with their OFL licenses retained. Keep handwriting out of navigation, prices and essential instructions. Large display typography is reserved for the hero and closing invitation; supporting text remains compact and sentence case. Use tabular numbers for prices. The wordmark is a deliberate optical lettering exception with tighter tracking; do not apply its spacing to body text.

## Layout
Maximum content width 1440px. Outer gutters: 52px desktop, 32px tablet, 20px mobile and 16px narrow mobile. Breakpoints at 1600, 1100, 760 and 390px. Hero and demo use unequal two-column grids; on mobile they stack in reading order. Services become a single index with price under the title. Main navigation becomes an inline disclosure. The photo has an explicit width to prevent aspect-ratio minimum sizing from forcing horizontal scroll.

## Elevation & Depth
Use thin dividers for the page structure. The workflow surface has the only soft elevated shadow. No decorative card grids, backdrop blur or gradient text. Z-index: normal content, sticky navigation 20, skip link 40. The optional third-party voice widget controls its own overlay.

## Shapes
Small radii belong to controls and photography; lg belongs to actual interactive panels. Full rounding belongs to the direction arrows, switch track, and the closing circular CTA. Service rows remain open and divided by rules.

## Components
Seven families are specified in front matter. Shared focus is a visible primary outline with an offset. Every button is at least 44px high; decorative arrow circles are inside whole-row service links. Link states do not invent a disabled navigation destination. Where disabled is inapplicable, the state is explicitly marked rather than presenting an inert link.

Navigation: inline mobile disclosure with aria-expanded and Escape-to-close with focus restored to its trigger. No modal focus trap is needed. Footer keeps contact and legal links accessible.

Workflow: three pressed-state scenario buttons, an immediate local run/reset action, and a polite completion status. It neither sends messages nor reads real client data. Full dashboard tabs use Radix keyboard navigation. Rule switches support Space/Enter through native buttons and announce checked state.

Disclosure: native details/summary for questions. Hover and focus keep the text readable; the plus changes when open. There are no form inputs on this site; the central enquiry action opens the existing Google Form.

Voice: explicitly opt-in. Loading and script failure are described inline; a successful script load exposes the existing provider widget. A live conversation and microphone permission require the visitor’s action. No loading skeleton is needed for static site copy.

The homepage header and hero link to the voice section. Its secondary enquiry uses the centralized form URL. The retained ElevenLabs widget uses paper, olive and rust, Manrope, a 12px shell radius and a 5px button radius. The small G icon replaces the default orb. An idle launcher hides during scrolling and returns after 240ms; focused controls and states without a visible Start a call button remain visible. A scoped open-shadow-root compatibility style handles the existing embed's explicit font and shadow. Recheck this adapter when changing the vendor script version.

Motion: a gentle hero-image arrival and a three-chapter GSAP ScrollTrigger narrative. Original line drawings move the story from a cluttered desk, through connected work, to a deckchair in the sun. Desktop keeps the illustration sticky alongside its chapter; mobile draws each illustration beneath its copy. Native scrolling remains. GSAP matchMedia scopes breakpoint changes and reverts timelines on unmount; font readiness refreshes trigger measurements. Reduced motion presents all three completed drawings inline, disables hero animation and smooth scrolling, and removes rule-thumb movement. All essential copy stays visible independently of animation; decorative SVGs are hidden from assistive technology.

## Do's and Don'ts
- Do use the finalized catalogue for service facts. Don’t invent metrics, testimonials or certifications.
- Do pair expressive type with plain instructions. Don’t turn every line into a slogan.
- Do keep generated imagery clearly documented as conceptual. Don’t imply it shows a real client or premises.
- Do preserve labels, focus and human review in demos. Don’t present sample results as live work.
- Do reconcile company terms before publishing. Don’t replace approved legal language with a design mockup.
