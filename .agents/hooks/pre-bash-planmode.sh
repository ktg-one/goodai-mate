#!/bin/bash
# pre-bash-planmode.sh

proposed_command="$1"

printf "[PLAN MODE] Proposed action: %s\n" "$proposed_command"
printf "Review and approve? (y = execute, n = block, e = edit): "
read -r response

if [ "$response" = "y" ]; then
    echo "[PLAN MODE] Approved by supervisor."
    exit 0
elif [ "$response" = "e" ]; then
    if command -v code >/dev/null 2>&1; then
        code "${CLAUDE_WORKING_DIR:-.}" >/dev/null 2>&1
    fi
    exit 1
else
    echo "[PLAN MODE] Blocked."
    exit 1
fi