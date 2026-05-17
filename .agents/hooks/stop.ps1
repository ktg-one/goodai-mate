# stop-enforce-handoff.ps1
# Simple hard handoff: forces the 4-step ritual before allowing stop

# Log that we hit the stop gate
"Stop gate triggered at $(Get-Date)" | Out-File -Append "C:\Users\kevin\.claude\team-logs\sessions.log"

# Force continuation with the ritual

Write-Error "=== HARD STOP BLOCKED — COMPLETE THE HANDOFF RITUAL ===
You cannot finish yet.

Do ALL 4 steps in your next response, then try to stop again:

1. Search mem0 — log everything done today tagged [MMDDYYYY|modelid|task|nextStep]
2. Plan your git commit — what changed, why, exact commit message
3. Plan your progress.md update — completed, next, blockers
4. Verify the codebase is clean & runnable

After doing the 4 steps, say 'ready to stop' or try stopping again." -ErrorAction Continue

# Block the stop (Claude Code will continue the conversation)
exit 2