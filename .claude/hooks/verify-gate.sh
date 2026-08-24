#!/usr/bin/env bash
# verify-gate — Stop hook: no ending a turn with unverified in-flight code changes.
#
# Why this exists: this repo shipped a 3-week production outage built entirely of
# confident, unverified "yep, it works" claims (see .planning/STATE.md, Build
# Health Incident). The demand for verification must come from the harness,
# mechanically, every time — not from the owner remembering to ask.
#
# Behavior: if the working tree has uncommitted changes OR the branch has
# unpushed commits when Claude tries to end its turn, block the stop ONCE and
# feed back a demand for concrete verification evidence. The retry is always
# allowed through (stop_hook_active), so this cannot loop.

input="$(cat)"

# Never loop: if we already blocked once this turn, allow the stop.
if printf '%s' "$input" | grep -Eq '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

dirty="$(git status --porcelain 2>/dev/null | head -n 1)"
ahead=0
upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)"
if [ -n "$upstream" ]; then
  ahead="$(git rev-list --count "${upstream}..HEAD" 2>/dev/null || echo 0)"
fi

if [ -z "$dirty" ] && [ "$ahead" -eq 0 ]; then
  exit 0
fi

cat >&2 <<'MSG'
VERIFY GATE: in-flight code changes detected (uncommitted work or unpushed commits).
Before ending this turn, do ONE of the following in your final message:
1) State concrete verification evidence for the changes: the exact command(s)
   you ran and their observed results (build exit code, HTTP status, test
   output, screenshot) — not "it works" or "should work".
2) State explicitly that the changes are NOT yet verified, and exactly what
   still needs to run to verify them.
Unverified claims of success are prohibited. If verification is impossible in
this environment, say so plainly instead of implying success.
MSG
exit 2
