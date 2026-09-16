# Good'Ai — studio fork brand reference

Source audit: 15 September 2026. This documents the assistant-created studio
fork, not Kevin's main version. The proposed new logo is a concept for review;
it has not replaced the current site identity.

## Name and message

- Brand spelling in copy: **Good'Ai** (capital G and A, lowercase i).
- Current rendered wordmark: **Good’Ai.** with a curly apostrophe and final dot.
- Main tagline: **Good work. More life.**
- Supporting line: **Less chasing. Less copying. More getting on with it.**
- Positioning: practical AI and automation that gives people more of their day back.
- Voice: plain English, warm, capable, conversational Australian phrasing. Lead with the work taken off someone's plate; explain the technology where useful.

## Exact active palette

| Colour | HEX | Use |
|---|---|---|
| Paper | `#F7F5ED` | Main background; reversed text |
| Olive ink | `#333B32` | Main text, wordmark, dark surfaces |
| Terracotta | `#A4432B` | CTAs, italic accents, punctuation, icon |
| Deep terracotta | `#873821` | CTA hover/gradient |
| Sage | `#DCE3CC` | Contact section, soft accents |
| Wash | `#ECEEE3` | Alternate sections and recessed controls |
| Warm white | `#FFFEF9` | Card surfaces |
| Muted olive | `#63685D` | Secondary text |
| Line | `#D5D6CA` | Dividers and borders |
| Success olive | `#42583B` | Completed workflow state |

Source of truth: `app/globals.css`. Its compatibility tokens map
`brand-ink` to olive ink, `brand-paper` to paper, `brand-coral` to terracotta,
and `brand-eucalyptus` to sage.

**Do not copy the palette from `app/tokens/colors.css` for this fork.** That file
contains a different navy/coral/teal palette and is not imported by the current
layout or globals stylesheet.

## Typography

| Role | Font | Treatment |
|---|---|---|
| Main headings, body, controls | Manrope | Regular body; medium headings; semibold controls |
| Emphasised headline phrases | Fraunces Italic | Weight 400, often terracotta |
| Handwritten asides | Vibes Regular | Sparse short notes, terracotta; never essential small text |
| Current wordmark | Manrope | CSS weight 650, tracking -0.07em, line height 1 |

Local font declarations: `app/studio-fonts.css` and the Vibes declaration in
`app/globals.css`. Manrope has declared weights 400/500/600/700; 650 is the
wordmark's CSS request, not a separately supplied font file. In media tools,
use Manrope Semibold as the starting approximation and check against the site.

Font files and licenses: `public/brand/Manrope-OFL.txt`,
`public/brand/Fraunces-OFL.txt`, `public/fonts/Vibes/OFL.txt`.

## Current logo and imagery

- Wordmark is live text in `components/studio/Shell.tsx`; olive letters with terracotta apostrophe and final dot.
- Favicon: `app/icon.svg`, a paper G and dot on a rounded terracotta square. It is served at `/icon.svg` by Next.js.
- Hero: `public/brand/coastal-phone.webp`; original PNG and generation provenance are in the same folder.
- Hero image is AI-generated conceptual artwork, not a photograph of actual premises.
- Visual direction: sunlit coast, limestone, tactile objects, warm natural light, generous space, restrained handwritten notes.
- UI: rounded raised terracotta buttons with paper arrow discs, layered paper cards, subtle shadows and olive/sage workflow controls.

## Media application — recommended, not yet a deployed rebrand

1. Set the four core swatches in your media tool: paper, olive ink, terracotta, sage.
2. Use Manrope for readable information, Fraunces Italic for one short emphasis, Vibes only as an optional aside.
3. Use paper backgrounds and olive text as the default. Reserve terracotta for the focal point and CTA.
4. Use a square icon with generous margins for avatars; check the circle crop. Keep the tagline out of tiny avatars.
5. Keep banners and post templates consistent with the tagline and approved logo. Avoid putting critical text near platform crop edges.
6. Review the new concept before replacing avatars, banners, post templates, slide covers, email signatures and website icons together.

Suggested logo clear space: at least one quarter of the mark's width on all sides.
Validate an icon at 16/32px before treating it as a finished favicon. Generated
bitmap colours and lettering are visual proposals; production vector artwork
must use the exact colours and spelling above.

## New logo exploration

Chosen direction: a simple rounded **g + apostrophe** monogram, paired with the
existing clean wordmark. It should feel human and recognisable at small sizes.
Use flat one-colour and reversed versions as the master marks; dimensional
effects belong to UI styling, not the master logo geometry.

Generation: built-in image tool, model version not exposed. The requested
transparent icon is raster artwork, not a layered SVG. The exact prompt is in
`docs/logo-generation-prompt.md`. No claim of trademark clearance or
production-ready vector geometry is made.
