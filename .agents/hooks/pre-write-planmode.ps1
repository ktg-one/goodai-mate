# pre-write-planmode.ps1 — PLAN MODE until skill is read
# Agent cannot write code until it has read a relevant skill

$gate = if ($env:TEMP) { "$env:TEMP\cc-skill-gate" } else { "$env:TMP\cc-skill-gate" }

if (-not (Test-Path $gate)) {
    New-Item -ItemType File -Path $gate -Force | Out-Null

    Write-Output '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny"},"updatedPermissions":[{"type":"setMode","mode":"plan","destination":"session"}]}'

    Write-Error "BLOCKED. You are now in PLAN MODE. You cannot write or execute.
You tried to write code without reading a skill first.
1. Read the relevant skill from skills/ for what you are about to build.
2. Search mem0 for context from previous sessions on this task.
3. Check Context7 for library docs if using any framework.
After you have done all three, retry your write."

    exit 2
}
