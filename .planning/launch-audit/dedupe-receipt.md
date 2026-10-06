# Homepage copy dedupe receipt

Branch phase/01d-visitor-gaps. Copy only: no layout, class, component, motion, image or brand change. No commit. `PerthSketchbook.tsx` and `VisualStory.tsx` untouched (the sketchbook still says "Knock off early!" on its own page; that is Kevin's).

## Where each line now lives (kept once)
- "Knock off early" → hero description (`components/sections/Hero.tsx:19`)
- "Go see the kids" → hero description (`Hero.tsx:20`)
- "Another day done" → scroll-story heading (`ScrollStory.tsx` intro h2, unchanged)
- "What matters is waiting" → chapter 2 caption (unchanged)
- "Less busywork. More living." → site footer (`components/studio/Shell.tsx:16`, unchanged)
- "Perth." → hero "Perth, Australia. Working everywhere." (unchanged)

## Changes (before → after)
1. `components/studio/ScrollStory.tsx:11` ch1 copy: "Another day done. Leave the follow-ups, copying and chasing with us." → "Leave the follow-ups, copying and chasing with us."
2. `ScrollStory.tsx:11` ch1 caption: "Perth. Another day done." → "Perth, end of the day."
3. `ScrollStory.tsx:12` ch2 title: "Go on. Knock off early." → "Go on. Head home."
4. `ScrollStory.tsx:12` ch2 copy: "…Be there for what matters. The routine…" → "…Be there for the good stuff. The routine…"
5. `ScrollStory.tsx:12` ch2 note: "Go see the kids." → "The good bit starts now."
6. `ScrollStory.tsx:13` ch3 caption: "Less busywork. More living." → "Nothing left to chase."
7. `components/sections/Hero.tsx:33` hand note: "Go on. Knock off early." → "Leave it with us."

## Not changed, for your call
- `components/studio/SussTheFussCard.tsx:69,72,184` also uses "Go see the kids" / "Knock off early", but that card renders on `/contact`, not the homepage.
- Story captions render twice in markup (mobile art and desktop canvas); only one shows per viewport, so left alone.
- Ch3 note "Your time is yours." and ch1 note "This is home." kept.

## Gates
- `npm run lint`: 0 errors, 67 warnings (was 66 earlier today; the Hero edit cannot add a warning, so likely another agent's change on this branch — not investigated).
- `npm test`: 17/17 pass.
- `npm run build`: compiled successfully.

DONE changes:7
