# Brain dump — Kevin's raw task stream

Kevin dumps ideas fast and in any order. god (the orchestrator) turns them into bounded work. Agents: read this to see where a card came from; don't act on raw lines.

## Pipeline (god runs it)
1. **Capture**: each dump is appended below verbatim, with its date. Nothing gets dropped.
2. **Dedupe**: god checks the item against `.planning/ROADMAP.md`, `.planning/SITE-MAP.md`, `hive/tasks.json` and MemPalace (`mempalace search`). If it matches existing work, it merges into that.
3. **Shape**: god rewrites each item as one card with a clear goal, the deliverable, and a definition of done. Ideas that are too big get split; vague ones get a question.
4. **Sequence**: blockers come first (the build must pass), then order by dependency and by which files the work touches.
5. **Route**:
   - Webdev goes to Jake.
   - Second-track work goes to Michael.
   - Independent parallel jobs go to temps, with skill triggers named in the brief.
   - Anything that needs Kevin goes on the ASK ME board as a blocked card.
6. **Record**: god updates the card in `hive/tasks.json` and the phase in `.planning/ROADMAP.md`, and marks the dump line below with its card key (e.g. `→ GST-7`).

## Dumps

### 2026-10-02
- 'write design system to klint' -> card for Jake (klint/design-system.lint.json, .oxlintrc.json, instructions/AGENTS.md, bin/ktg-lint.mjs)
- 'svg shapes to be implemented in plugin; contrast to the boring back-to-back; signature as example' -> blocked card (Michael), asked Kevin which plugin + signature file
- 'flip book at top has start pages in public; needs middle pages to continue the story' -> card for Jake, after GST-3 (5 cut plates used as the middle pages)
- 'wording is all phrases, not what we do; scroll-story subtitles should say exactly what we do' -> card for Michael (.planning/COPY.md + app/page.tsx)
- 'services and prices are legacy; 4 simple buy paths: workflows, voice agent, consult, integrations; voice ~$99 bottom tier, not worth it; workflows near off-the-shelf, top 10 sold as scope from a retainer; brainstorm more' -> temp worker-offer-research drafts .planning/OFFER.md; site card for Jake blocked on Kevin agreeing the offer + price question; Michael's copy (GST-7) told to use the 4 paths, no prices
- 'A$99 is nonsense, past that point' -> don't compete on cheap price (GST-9 notes). 'Market research sits in a folder, I'll get it' -> waiting on Kevin. 'Hide the prices' -> card for Michael. 'Flip book has more pages in the assets folder' -> GST-6 updated (public/assets/sketches).
