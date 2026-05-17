---
name: "source-command-git-cm"
description: "Stage + commit with conventional commit format"
---

# source-command-git-cm

Use this skill when the user asks to run the migrated source command `git-cm`.

## Command Template

Stage and commit changes:

1. Run `git status` to see changes
2. Stage relevant files (never `git add .` — be explicit)
3. Commit with conventional format: `type(scope): message`
   - feat: new feature
   - fix: bug fix
   - refactor: code restructure
   - docs: documentation
   - test: test additions
   - chore: tooling/config
4. Do NOT push
