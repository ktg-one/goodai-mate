# post-write.ps1
param($filePath)

if (Test-Path $filePath) {
    # Example: run prettier if it's a JS/TS/MD file (adjust for your stack)
    if ($filePath -match "\.(js|ts|jsx|tsx|md)$") {
        npx prettier --write $filePath 2>$null
        Write-Host "[POST-WRITE] Formatted: $filePath"
    }
    "Edited: $filePath at $(Get-Date)" | Out-File -Append "C:\Users\kevin\.claude\team-logs\edits.log"
}