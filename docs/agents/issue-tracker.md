# Issue tracker: GitHub

Issues, PRDs, and gsd phase work for this repo live as GitHub issues in `ktg-one/goodai-mate`. Use the `gh` CLI for issue operations.

When using gsd-* skills (gsd-inbox, gsd-plan-phase, gsd-ship etc.) they publish here.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`
- **Read an issue**: `gh issue view <number> --comments`
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments`
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Run `gh` from the repo root so it infers `ktg-one/goodai-mate` from `git remote -v`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
