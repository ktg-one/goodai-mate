# knowledge-guard.ps1
param($toolType, $path, $command)

$vaultPath = "C:\Users\kevin\knowledge2026"   # adjust if your path differs

if ($path -like "*$vaultPath*") {
    if ($command -match "rm|mv|find.*-delete|reorganize") {
        Write-Host "[GUARD] Attempted structural change in knowledge2026 vault: $command" -ForegroundColor Red
        Write-Host "[GUARD] Pausing for supervisor review. Approve? (y/n)" 
        $response = Read-Host
        if ($response -ne "y") {
            Write-Host "[GUARD] Blocked." -ForegroundColor Yellow
            exit 1
        }
    }
}
Write-Host "[GUARD] Allowed: $toolType on $path"