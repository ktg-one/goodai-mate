
## 2026-08-21 - Fix Spreadsheet Formula Injection and CRLF Email Header Injection
**Vulnerability:** Found Spreadsheet Formula Injection (CWE-1236) where user inputs were appended to Google Sheets via `valueInputOption: 'USER_ENTERED'` without sanitization, allowing formula execution. Also found CRLF Email Header Injection where user inputs were directly interpolated into email headers via string concatenation.
**Learning:** These vulnerabilities existed because inputs weren't sanitized when creating Google Workspace integrations using raw CLI/API requests, trusting user input implicitly.
**Prevention:** Always sanitize data appended to Sheets with `USER_ENTERED` by prepending a single quote to inputs starting with formula triggers (`=`, `+`, `-`, `@`, `\t`, `\r`). Always strip newlines and carriage returns (`\r\n`) from inputs interpolated into email headers.
