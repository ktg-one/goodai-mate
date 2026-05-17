# session-start.ps1
# Forces the two mandatory checks at the absolute start of every session

"Session started at $(Get-Date -Format 'MMDDYYYY HH:mm') — forcing MCP + memory check" | Out-File -Append "C:\Users\kevin\.claude\team-logs\sessions.log"

Write-Output @"
=== MANDATORY SESSION START CHECKS ===

1. MCP SERVERS CHECK:
   Confirm Local MCP is up. If not launch it. 

2. LAST MEMORY CONTEXT CHECK:
   Implenting [MMDDYYYY|ModelID|Task|R/10|NextStep] for naming memories. So retrieve the last memory. 
   echo "...context restored"
   
   CC=ClaudeCode
   GG=Gemini-CLI 
   GPT=Codex
   KM=Kimi-cli
   QQ=Qwencode

Do both checks clearly in this first response before we do anything else.

(If MCP is down, we fix that first — because without it you can't reach mem0.)
"@