---
name: goodai-design
description: Use this skill to generate well-branded interfaces and assets for Good'AI, either for production or throwaway prototypes/mocks. Contains the canonical brand book (palette, type, shapes, voice), assets, and UI primitives. Good'AI is a Perth-based SME automation business with a 1995-direct-mail brand book vibe — ink black, brand orange, cool off-white paper, with WA Ocean blue as a third brand surface. Voice is "switched-on Aussie mate."
user-invocable: true
---

The canonical source of truth for this brand is `good-ai-design-final.html` (Brand Book v1.0). Read that first — every preview card, token and UI primitive in this folder is derived from it.

Then read `README.md` for the index and `colors_and_type.css` for the drop-in tokens.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets in and use the tokens as-is.

If the user invokes this skill without other guidance, ask what they want to build, ask one or two questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Key things to remember

- **Palette is three colours, no negotiation:** **Ink** (`#0B0B0B`), **Brand Orange** (`#F25C2B`), and **Paper** (`#F8F8F6` — cool off-white, *not* warm cream, *not* Anthropic beige). **WA Ocean** (`#006B8F`) is the third brand colour — used for brand surfaces and links, never as a CTA.
- **One orange per surface, max.** Two oranges in close range cancel each other out.
- **Supporting accents** (sparingly): Sticker Yellow `#FFD400` (alerts / "SALE!"), Trust Blue `#1A3FA8` (hyperlinks), OK Green `#2E6E3E` (success), Warn Red `#B53A1F` (errors).
- **Voice = switched-on Aussie mate.** Short sentences, "we" not "I", no jargon. Never use "AI", "machine learning", "leverage", "synergy", "streamline", "optimize".
- **Casing:** wordmark is `Good'ai` (lowercase `ai`, orange apostrophe). Headlines and buttons are sentence case. Eyebrows / mono labels are UPPERCASE with `0.16em` tracking — the only place all-caps is allowed.
- **No emoji in UI.** No animated WebGL backgrounds. No drop-shadow blurs. Performance is non-negotiable.
- **Fonts:** Fraunces soft wonk (display, opsz 144), DM Sans (body/UI), JetBrains Mono (eyebrows/code).
- **Stamp shadow is the visual signature:** flat `3px 3px 0 var(--ink)` (or `4px 4px 0` on hero surfaces). Ink behind paper. Orange behind ink. Never both at once. **No blurred shadows ever.**
- **Sharp corners by default.** Buttons & cards: `0–8px`. Pill (`999px`) is for chips & dots only, never buttons.
- **Shapes come from the logo:** circles, half-circles, triangles, bars. Pair one ink shape with one orange shape per composition. Never recreate the swan from pieces.
- **Backgrounds:** plain paper with a 1px horizontal grain (`repeating-linear-gradient(0deg, rgba(11,11,11,0.025) 0 1px, transparent 1px 4px)`) is the default. Ink block for hero/footer. Ocean block for the "third brand surface" treatment.
- **Imagery vibe:** Perth tradies, shopfronts, hands on tools — warm, sunlit, real. No glass towers, no purple-gradient AI art.
