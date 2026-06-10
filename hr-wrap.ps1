function hr-wrap {
    param(
        [Parameter(Mandatory=$true, Position=0)]
        [string]$CmdName,
        
        [Parameter(ValueFromRemainingArguments=$true)]
        [string[]]$CmdArgs
    )
    
    # 1. Check if headroom proxy is already running on port 8787
    $portActive = Get-NetTCPConnection -LocalPort 8787 -ErrorAction SilentlyContinue
    if (-not $portActive) {
        Write-Host "Starting headroom proxy in the background on port 8787..." -ForegroundColor Cyan
        Start-Process -FilePath "headroom" -ArgumentList "proxy --port 8787" -NoNewWindow
        Start-Sleep -Seconds 2
    }
    
    # 2. Backup current env vars
    $oldOpenAI = $env:OPENAI_BASE_URL
    $oldAnthropic = $env:ANTHROPIC_BASE_URL
    
    # 3. Direct client traffic to the Headroom proxy
    $env:OPENAI_BASE_URL = "http://localhost:8787/v1"
    $env:ANTHROPIC_BASE_URL = "http://localhost:8787/v1"
    
    # 4. Execute the command
    Write-Host "Routing '$CmdName $CmdArgs' through Headroom proxy..." -ForegroundColor Green
    if ($CmdArgs) {
        & $CmdName @CmdArgs
    } else {
        & $CmdName
    }
    
    # 5. Restore original env vars
    $env:OPENAI_BASE_URL = $oldOpenAI
    $env:ANTHROPIC_BASE_URL = $oldAnthropic
}

# Export the function so it can be called directly if dot-sourced
hr-wrap $args[0] $args[1..$args.Length]
