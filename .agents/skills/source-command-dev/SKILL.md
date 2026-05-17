---
name: "source-command-dev"
description: "Start dev server and verify environment"
---

# source-command-dev

Use this skill when the user asks to run the migrated source command `dev`.

## Command Template

Pre-flight check before development:

1. Verify `.env.local` exists and has required keys
2. Run `npm run dev`
3. Check for TypeScript errors in terminal output
4. Report any missing environment variables
