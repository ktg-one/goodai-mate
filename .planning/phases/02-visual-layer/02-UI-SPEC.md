# Phase 2: Visual Layer - UI Spec

**Created:** 2026-05-25
**Status:** Ready for planning

## UI Goal

Make the Good'ai home page feel like a practical Perth automation intake surface: clear, fast, warm, and buildable.
The first screen should show the product and allow the visitor to start describing their problem.

## Visual Direction

- Canvas: cool paper (`#F8F8F6`) with subtle grain.
- Structure: ink (`#0B0B0B`) borders and text.
- Accent: orange (`#F25C2B`) used sparingly for emphasis and primary actions.
- Third surface: WA ocean (`#006B8F`) for trust badges, brand mark surfaces, and supporting UI.
- Typography: DM Sans for UI/body, Fraunces for display if valid files exist, JetBrains Mono for small labels.

## Layout

- Header with Good'ai wordmark and Perth/WA signal.
- Main hero centered enough to feel direct, but not like a detached marketing card.
- Chat/intake surface visible in the first viewport.
- Feature/service chips may sit below the primary intake, but must not crowd mobile.
- Footer can remain below the fold.

## Interaction

- Native cursor remains visible.
- No full-page cursor tracking.
- No WebGL shader background.
- Chat input should be keyboard accessible.
- Loading/typing state should be obvious and not shift layout excessively.
- Lead card should appear only when the chat flow calls for it.

## Responsive Requirements

- Below 640px, controls stack and text remains inside containers.
- The first viewport must not require horizontal scrolling.
- Buttons and inputs need stable dimensions.
- Long labels must wrap cleanly or be shortened.

## Brand Guardrails

- Wordmark spelling is `Good'ai`.
- Avoid visible copy that says "AI" as a selling point.
- Avoid corporate terms such as "leverage", "synergy", "optimize", and "utilize".
- Do not use purple/blue-purple gradients.
- Do not use decorative orb/blob backgrounds as the main visual language.

## Acceptance

- Home page renders without missing asset icons.
- Hero and chat mount are visible on desktop and mobile.
- Text does not overlap or overflow.
- `npm run build` and `npm run lint` are the primary automated gates.
