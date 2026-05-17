# teammate-alert.ps1
param($teammateName, $task, $idleMinutes)

Write-Host "[TEAM ALERT] Teammate '$teammateName' has been idle for $idleMinutes minutes on task: $task" -ForegroundColor Cyan
Write-Host "Live supervision panes open? Use tmux or check Agent Teams dashboard." 
# Optional: add a toast notification or log to file
"$(Get-Date) - $teammateName idle on $task" | Out-File -Append "C:\Users\kevin\.claude\team-logs\alerts.log"