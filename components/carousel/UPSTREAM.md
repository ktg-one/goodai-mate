# Viscose carousel import

Upstream: `https://github.com/Yousuf-developer/Viscose-carousel.git`

Imported commit: `4b9ac8c` (`fixing the project images extensions`)

The source was pulled with `git pull --ff-only` on 2026-08-24, then vendored
as ordinary files so the GoodAI repository does not depend on a nested Git
checkout. The upstream MIT licence is retained in `LICENSE`.

GoodAI integration changes:

- Replaced the sample project data with GoodAI services.
- Excluded the upstream unlicensed imagery and PP Neue Montreal font.
- Added GoodAI-owned SVG artwork exported from Figma.
- Applied the GoodAI colours and local fonts.
- Contained the WebGL experience within its page section.
- Preserved page scrolling while the carousel reacts to wheel input.
- Added arrow-key navigation and a reduced-motion fallback.
- Removed the development-only GUI dependency.

The upstream `README.md` and `AGENTS.md` are retained for implementation context.
