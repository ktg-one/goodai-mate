# pre-bash-planmode.ps1
param([string]$ProposedCommand)

Write-Host "[PLAN MODE] Proposed action: $ProposedCommand"
Write-Host "Review and approve? (y = execute, n = block, e = edit): " -NoNewline
$response = Read-Host

if ($response -eq 'y') {
    Write-Host "[PLAN MODE] Approved by supervisor."
    exit 0
} elseif ($response -eq 'e') {
    $workDir = if ($env:CLAUDE_WORKING_DIR) { $env:CLAUDE_WORKING_DIR } else { '.' }
    code $workDir 2>$null
    exit 1
} else {
    Write-Host "[PLAN MODE] Blocked."
    exit 1
}
