- [x] Added aria-label to Custom Voice ID inputs in VoiceAgentHero and gem-voice components for accessibility.
- [x] Integrated design token imports to globals.css.
# Palette Micro-UX Refactoring Log

This log tracks the progress of the 5 sequential micro-UX refactoring runs required to update the design to the new brand system.

## Planned Runs

- [x] **Run 1: Colors (Completed)**
  - Copy design tokens into the project.
  - Update `globals.css` with new color variables.
  - Replace old color references (`--ink`, `--paper`, `--coral`, etc.) with new semantic tokens (`--good-ink`, `--good-cloud`, `--good-coral`, `--good-teal`).
- [ ] **Run 2: Typography**
  - Integrate new font files (Iosevka, Lato, Playfair Display).
  - Update typography CSS variables and Tailwind configuration.
  - Adjust class names and styles for headings, body text, and labels.
- [ ] **Run 3: Shadows/Effects**
  - Update shadow variables (e.g., `--shadow-card`, `--shadow-button`).
  - Standardize border treatments and transition effects.
- [ ] **Run 4: Spacing**
  - Implement the new spacing scale (`--space-4`, `--space-8`, etc.).
  - Replace hardcoded pixel margins/padding with token-based utilities.
- [ ] **Run 5: Component Polish**
  - Final visual QA and refinement of specific components.
  - Ensure accessibility standards (contrast, focus states) are met across the board.

## Changelog

**2026-07-30 - Run 1: Colors Started**
- Initialized log.
**2026-07-30 - Run 1: Colors Completed**
- Copied token variables to globals.css and mapped Tailwind config.
- Replaced var(--ink), var(--paper) and other variables with new semantic names across the project.
