# stop-enforce-handoff.ps1
# Forces handoff ritual before any stop is allowed

# Read the input JSON that Claude Code sends
$inputJson = Get-Content -Raw | ConvertFrom-Json

# Second pass: ritual already completed → allow stop
if ($inputJson.stop_hook_active -eq $true) {
    "Stop completed cleanly at $(Get-Date) after handoff ritual" | Out-File -Append "C:\Users\kevin\.claude\team-logs\sessions.log"
    exit 0
}

# First pass: BLOCK stop + force PLAN MODE
$blockJson = @{
    hookSpecificOutput = @{
        hookEventName = "Stop"
        decision = @{
            behavior = "block"
        }
        updatedPermissions = @(
            @{
                type = "setMode"
                mode = "plan"
                destination = "session"
            }
        )
    }
} | ConvertTo-Json -Depth 10 -Compress

# Output the control JSON (this tells Claude Code to block + switch mode)
$blockJson

# Show the required ritual to the agent
Write-Error "=== HARD STOP ENFORCED — PLAN MODE ACTIVATED ===`n`nYou cannot finish or run tools yet.`n`nComplete ALL 4 steps in your next response:`n1. Search mem0 — log everything done today tagged [$(Get-Date -Format 'yyyy-MM-dd')]`n2. Plan git commit — exact changes + why + commit message`n3. Plan progress.md update — completed, next, blockers`n4. Verify codebase is clean & runnable`n`nAfter doing all four, try to stop again." -ErrorAction Continue

exit 2