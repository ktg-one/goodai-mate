# Good'AI — Web UI kit

The marketing site, recreated with the bright palette from the parent design system. Mirrors the structure of `ktg-one/goodai-mate` but pivots from the dark "Perth Disruptor" treatment to warm cream + teal + tomato.

## Run
Open `index.html` in a browser. No build step.

## Files
| File | What |
| --- | --- |
| `index.html` | App shell — landing → chat → lead capture flow. |
| `styles.css` | All component styles (extends `colors_and_type.css`). |
| `primitives.jsx` | `Button`, `Input`, `Eyebrow`, `Wordmark`, `Icon` (Lucide-style). |
| `Hero.jsx` | `Header`, `HeroLanding` (mark, headline, intake input, marquee). |
| `ChatThread.jsx` | The chat surface — fake AI, typing indicator, lead card trigger. |
| `LeadCard.jsx` | Stamped lead-capture form with success state. |
| `Footer.jsx` | Dark ink footer with sunshine accent. |

## Differences from the production codebase
- **No WebGL shader** background. Static blob gradients instead — no perf hit.
- **No `cursor: none`** body styling. Native cursor everywhere.
- **No drop-shadow glow ambient pulse.** Stamp shadow does the lift.
- **Real fake AI replies**, scripted in `ChatThread.jsx`. The production app uses `@ai-sdk/react` with `/api/chat` — that's swapped for a demo flow here.
- **Web3Forms submission** is stubbed — `LeadCard.jsx` simulates success after 800ms.
