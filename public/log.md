# UX Updates Log

- [x] Set default background (`--bg` alias `--background`) to Navy `#202B3D`
- [x] Set default foreground (`--fg` alias `--foreground`) to Silver `#D9D9D9`
- [x] Integrate new color palette: Navy `#202B3D`, Coral `#F66F61`, Teal `#1CABB0`, Silver `#D9D9D9`, Slate `#282C2D`
- [x] Ensure `shape-big-*.svg` background rule is applied to every 2nd viewport and bare cards in `.jules/palette.md` specs.
- [x] Fix container aspect ratio overflow on mobile screens in ProductDemo section (`min-h-[500px] md:min-h-0 md:aspect-video lg:aspect-2/1`).

- [x] Integrated Lenis smooth scroll (`lenis`) synced with GSAP ticker and `ScrollTrigger.update` for weighted, calm scroll physics.
- [x] Converted `ScrollStory` (`#features`) into a pinned GSAP ScrollTrigger timeline (`pin: true`, `pinSpacing: true`, `scrub: 1`) across a 3200px scroll track with chapter reading holds.
- [x] Expanded all main sections (`.hero`, `.scroll-story`, `.services-section`, `.demo-section`, `.voice-home`, `.approach`, `.faq`, `.contact-section`) to `min-height: 100vh` and 120px–160px vertical padding, expanding total document scroll height to ~11,000px+ and eliminating section overlap.
