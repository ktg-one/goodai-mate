#!/usr/bin/env python3
"""
SessionStart hook for Claude Code.
Prints git context so Claude knows the current branch/state
without being told explicitly.
Fast — no network calls, no heavy ops.
"""
import json
import os
import subprocess
import sys


def run(cmd, cwd=None):
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True,
            timeout=5, cwd=cwd
        )
        return result.stdout.strip(), result.returncode
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return '', 1


def main():
    # Read hook data (SessionStart may pass minimal data)
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        data = {}

    # Try to detect git repo from cwd
    cwd = os.getcwd()

    branch, rc = run(['git', 'branch', '--show-current'], cwd=cwd)
    if rc != 0:
        # Not in a git repo — nothing useful to report
        sys.exit(0)

    status, _ = run(['git', 'status', '--short'], cwd=cwd)
    stash_list, _ = run(['git', 'stash', 'list'], cwd=cwd)
    recent, _ = run(['git', 'log', '--oneline', '-3'], cwd=cwd)

    lines = [f"[git] branch: {branch}"]
    if status:
        lines.append(f"[git] unstaged/staged:\n{status}")
    else:
        lines.append("[git] working tree clean")
    if stash_list:
        count = len(stash_list.splitlines())
        lines.append(f"[git] stash: {count} entr{'y' if count == 1 else 'ies'}")
    if recent:
        lines.append(f"[git] recent commits:\n{recent}")

    print('\n'.join(lines))
    sys.exit(0)


if __name__ == '__main__':
    main()
