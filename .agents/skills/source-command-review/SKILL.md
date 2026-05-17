---
name: "source-command-review"
description: "Run quality gate: lint, type-check, test, build"
---

# source-command-review

Use this skill when the user asks to run the migrated source command `review`.

## Command Template

Execute the full quality gate pipeline:

1. `npm run lint` — ESLint check
2. `npx tsc --noEmit` — TypeScript type check
3. `npm run test` — Unit tests (if configured)
4. `npm run build` — Production build verification

Report results as a structured checklist. If any step fails, stop and report the failure with the exact error.
