# Good’Ai brand pack

Selected direction: Good work. More life. September 2026.

## What to import into Canva

1. Open **GoodAi-Brand-Guide.pptx** in Canva by importing the file. The eight pages use editable text and colour swatches. Images remain separate image objects.
2. Add the fonts in **fonts/** to your Brand Kit if your Canva plan supports custom fonts. Select Manrope for headings and body, Fraunces Italic for expressive phrases, and Vibes for brief handwritten asides. Keep the included OFL licences with the source files.
3. Upload the files in **assets/**. The logo SVGs contain outlines, so the wordmark does not depend on a font being installed. PNG alternatives have transparent backgrounds.
4. Add the palette below, then check font selection and line breaks after import. Canva's import behaviour and your account's font availability have not been tested. The PDF is a flattened visual reference, not the editable master.

Canva documents presentation imports and eligible custom-font plans in its [upload requirements](https://www.canva.com/en_au/help/upload-formats-requirements-variantb/). Importing a presentation does not automatically populate a Canva Brand Kit.

## Palette

| Name | HEX | RGB | Use |
|---|---|---|---|
| Paper | #ECEEE4 | 236, 238, 228 | Default background (`--paper`) |
| Dark olive | #333B32 | 51, 59, 50 | Headings, body, dark backgrounds (`--ink`) |
| Rust | #A44328 | 164, 67, 40 | Primary CTA, punctuation, emphasis (`--rust`) |
| Rust hover | #8F3D31 | 143, 61, 49 | Primary interactive hover (`--rust-hover`) |
| Sage | #DCE3CC | 220, 227, 204 | Supporting surfaces (`--sage`) |
| Deep sage | #5F7058 | 95, 112, 88 | Accent & secondary ink (`--sage-deep`) |
| Muted olive | #5C665E | 92, 102, 94 | Supporting text (`--muted`) |
| Divider | #D6D6C8 | 214, 214, 200 | Rules and borders (`--line`) |
| Wash | #ECEADF | 236, 234, 223 | Subtle surface wash (`--wash`) |
| Warm white | #FCFAF4 | 252, 250, 244 | Raised interactive surfaces (`--white`) |
| Success | #42583B | 66, 88, 59 | Completion states (`--success`) |

Use paper and olive for most of the composition, with restrained rust accents. Divider colour is unsuitable for essential text. RGB values are for screens; confirm print colour with your printer and paper stock.

## Typography and spacing

- **Manrope Regular**: body copy. **Medium**: headings. **SemiBold**: controls and labels. Bold is included for stronger emphasis and the wordmark source.
- **Fraunces Italic (Soft Wonk — `"SOFT" 100, "WONK" 1`)**: one expressive phrase within a headline, using the variable font in `/fonts/Fraunces/`. Preserve the rest in Manrope.
- **Vibes**: reassuring asides such as “Go on. Knock off early.” Do not use it for prices, legal text or instructions.
- On a 1920 × 1080 design, start with a 96–132 px main heading, 32–40 px supporting copy and 48–64 px handwriting. Adjust for the channel and check at actual viewing size. These are production starting points, not the website's responsive CSS sizes.
- Keep at least 80 px of outer space on a 1920 px canvas. Use one clear headline, one useful point and one primary action. Avoid filling every gap.

## Wordmark

Primary: **goodai-wordmark.svg** (with transparent PNG alternative **goodai-wordmark.png** and icon mark **goodai-icon.svg**). Do not stretch or add shadows. Leave at least half the capital G height around it. Keep it at least 120 px wide digitally or 25 mm in print.

Use **Good’Ai** in designed copy and **Good'Ai** where a plain apostrophe is needed. The terminal dot belongs to the wordmark. The exported mark converts the current Manrope lettering into paths with the site's tight spacing.

## Voice

The promise: useful automation makes room for a life outside the work.

Use concrete tasks: answering an enquiry, chasing a quote, copying a detail. Sound like a capable person who can take something off the owner's mind.

Approved direction:

- Good work. More life.
- Go on. Knock off early.
- Don’t worry about the busywork. We’ll sort it.
- What’s eating your week?
- Let’s take work off your plate.

Keep human review visible where it matters. Do not promise a fixed number of hours saved or invent testimonials. Kevin completed an ISO/IEC 42001 course; this is not a claim that he or the company is certified.

## Photography and illustration

Use natural light, tactile ordinary objects, warm surfaces and quiet space. Future real photography should show Kevin and genuine workflow artifacts with permission. The supplied coastal telephone image is generated conceptual artwork, not a real office, client or verified location. Provenance is included with the asset.

The three existing drawings are supplied as SVG and PNG: busy desk, connected work and knock-off-early. Keep their olive strokes and rust accents. Use them at generous sizes rather than as tiny icons. Canva can place them as static assets; the website's scroll-driven tracing remains a GSAP implementation.

## CTA hierarchy

Primary enquiry: **Let’s take work off your plate** or **Let’s sort it**. Rust background, paper text.

Secondary demonstration: **Try the voice agent**. Give it a visible entry point, with **Want one for your business?** nearby. The website keeps enquiry destinations centralized in `lib/links.ts`. Its voice demo retains the original ElevenLabs agent and asks visitors to start the call themselves.

## Package boundaries

The editable presentation and original assets are the working master. The PDF is a visual reference. This pack does not include website animation as a Canva effect, a public deployment, trademark clearance or new legal terms. Company prices and legal content remain governed by their source documents and release review.
