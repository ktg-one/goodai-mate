#!/usr/bin/env python3
"""
Post-edit lint hook for Claude Code.
Runs after every Write or Edit tool call.
Lints the changed file based on its extension.
Claude sees stdout output and can self-correct.
"""
import json
import os
import subprocess
import sys


def find_project_root(file_path):
    """Walk up from file_path to find nearest package.json / composer.json."""
    directory = os.path.dirname(os.path.abspath(file_path))
    while True:
        if os.path.exists(os.path.join(directory, 'package.json')):
            return directory
        parent = os.path.dirname(directory)
        if parent == directory:
            return os.path.dirname(os.path.abspath(file_path))
        directory = parent


def run(cmd, cwd=None, timeout=20):
    return subprocess.run(
        cmd, capture_output=True, text=True,
        timeout=timeout, cwd=cwd
    )


def main():
    # Claude Code sends hook data via stdin as JSON
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_input = data.get('tool_input', {})
    file_path = tool_input.get('file_path', '')

    if not file_path or not os.path.exists(file_path):
        sys.exit(0)

    ext = os.path.splitext(file_path)[1].lower()
    errors = []

    # --- TypeScript / JavaScript ---
    if ext in ('.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'):
        project_root = find_project_root(file_path)
        eslint_config = any(
            os.path.exists(os.path.join(project_root, f))
            for f in ('.eslintrc.js', '.eslintrc.json', '.eslintrc.yaml',
                      '.eslintrc.yml', '.eslintrc', 'eslint.config.js',
                      'eslint.config.mjs')
        )
        if eslint_config:
            result = run(
                ['npx', '--no-install', 'eslint', '--max-warnings=0', file_path],
                cwd=project_root
            )
            if result.returncode != 0:
                errors.append(f"ESLint:\n{result.stdout}{result.stderr}".strip())
        else:
            # No ESLint config — skip silently, no false positives
            pass

    # --- PHP ---
    elif ext == '.php':
        result = run(['php', '-l', file_path])
        if result.returncode != 0:
            errors.append(f"PHP syntax:\n{result.stdout}{result.stderr}".strip())

    # --- JSON (n8n workflows, package.json, etc.) ---
    elif ext == '.json':
        # Skip node_modules and lock files
        if 'node_modules' in file_path or file_path.endswith('package-lock.json'):
            sys.exit(0)
        try:
            with open(file_path, encoding='utf-8') as f:
                json.load(f)
        except json.JSONDecodeError as e:
            errors.append(f"Invalid JSON: {e}")

    # --- Report ---
    if errors:
        print(f"\n⚠️  Lint errors in {os.path.basename(file_path)}:")
        for err in errors:
            print(err)
        print("\nFix these before proceeding.")
        sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    main()
