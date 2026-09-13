# ThreeUI fit for Good’Ai

Reviewed 13 September 2026. Source inspection of the public repository, README, catalogue, Sketchbook wrapper and isolated effects implementation. No package installed, no code copied, no performance benchmark or full visual library audit.

## Decision

Use selected visual treatments as references, with **Sliding Text CTA** the first candidate. Keep Good’Ai's paper, olive, rust, typography and native accessible links. Preserve the existing GSAP illustration story. A large shader scene belongs in a bounded demo if it communicates an actual capability.

| Candidate | Useful fit | Integration judgement |
|---|---|---|
| SlidingTextCta | A restrained response when someone hovers or focuses an enquiry link | Reimplement the text movement in a native anchor using our palette, real href, focus and reduced-motion states. Its current exported props expose visual settings, not a normal link destination. |
| Sketchbook | Drawing and paper references for the scroll story | Existing wrapper embeds an interactive Singapore sketchbook in an eager iframe with its own assets. Borrow the visual idea; do not substitute its location-specific content for our story. |
| TactileButton | A more physical press response around the voice demo | Inspect the inner source before adoption. It wraps an HTML scene with a background canvas. A native button is preferable for the actual ElevenLabs load action. |

## Source facts

The repository lists 50 Community parent components and 111 Community routes, with free variants. It publishes a React package and supports component subpath imports. Some components require runtime assets copied into public paths or an asset URL override. The README states that Community code and ThreeUI-authored Community imagery use MIT; fonts and third-party runtime notices have separate accompanying terms. Pro code is outside the Community source and requires entitled access. Counts describe the reviewed README, not a guarantee about future versions.

Many effects are HTML source imports rendered as isolated documents. `NeuformIsolatedEffectProps` declares mode, hue, saturation, brightness, className and style. That is different from a drop-in production anchor with an href or a button with a business action. Check the actual implementation before treating a demo control as a working site CTA.

## Current site actions

The website now exposes the retained ElevenLabs agent from the homepage header and hero. A visible voice section contains the opt-in load button, processing disclosure and centralized enquiry link. No ThreeUI dependency was needed for those functional CTAs.

## Sources

- [Repository and installation/licensing overview](https://github.com/MengTo/threeui)
- [Community catalogue](https://github.com/MengTo/threeui/blob/main/src/data/shaders.tsx)
- [Sketchbook wrapper](https://github.com/MengTo/threeui/blob/main/src/shaders/sketchbook/Sketchbook.tsx)
- [Isolated effects, props and CTA exports](https://github.com/MengTo/threeui/blob/main/src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx)
