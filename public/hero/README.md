# Good'ai Hero — Reference / Legacy

This folder contains historical/reference material for the Good'ai hero.

**The active, maintained implementation is now in:**

`src/components/hero/`

- `Hero.tsx` — Main component (voice interaction, state, layout)
- `Visualizer.tsx` — The advanced paper-ribbon audio visualizer

## Why this change?

The hero is now a normal, first-class part of the Next.js codebase under `src/components/hero/`, following standard project structure.

The files here (including the previous Vite prototype) are kept for reference only.

You can safely ignore this folder for day-to-day development of the hero. The Next.js version is the one running on the site.