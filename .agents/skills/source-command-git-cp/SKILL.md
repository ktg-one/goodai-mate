---
name: "source-command-git-cp"
description: "Stage + commit + push to remote"
---

# source-command-git-cp

Use this skill when the user asks to run the migrated source command `git-cp`.

## Command Template

Stage, commit, and push:

1. Run `git status` to see changes
2. Stage relevant files explicitly
3. Commit with conventional format
4. Push to current branch: `git push -u origin HEAD`
