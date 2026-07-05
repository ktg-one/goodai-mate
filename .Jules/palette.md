
## 2024-07-05 - Brutalist Terminal Log Accessibility
**Learning:** In applications using custom "terminal-style" log outputs for real-time progress (like the Automation Playground), screen readers won't automatically announce new log entries as they are appended to the DOM.
**Action:** Always add `role="log"` and `aria-live="polite"` to the container of the terminal output to ensure screen readers announce new lines naturally as they appear, keeping visually impaired users informed of live pipeline progress.
