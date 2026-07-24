
## 2024-05-24 - SSRF in Website Analyzer
**Vulnerability:** The Website Analyzer endpoint (`src/app/api/analyze-website/route.ts`) accepted arbitrary URLs from the user and fetched their content without validation, creating a Server-Side Request Forgery (SSRF) vulnerability. This allowed an attacker to port scan internal infrastructure or access internal services (like `localhost` or private cloud metadata APIs).
**Learning:** Using `new URL()` for protocol checks is insufficient against SSRF because an attacker could use `http://localhost` or a custom domain that resolves to an internal IP (A-record spoofing/DNS rebinding).
**Prevention:** Always parse the URL, deny `localhost`/`.local`, and crucially, resolve the hostname using `dns.promises.lookup` to validate the resulting IP address against private network blocks (e.g. `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`) using the `net` module.

## 2024-05-25 - SSRF in Demo Automation
**Vulnerability:** The Demo Automation webhook pipeline (`src/app/api/demo-automation/route.ts`) accepted arbitrary webhook URLs (n8nUrl) from the user and fired fetch requests to them without validation, creating a Server-Side Request Forgery (SSRF) risk if a user supplied an internal hostname or malicious endpoint.
**Learning:** Even optional inputs like `n8nUrl` must be validated before use in server-side HTTP requests to prevent unauthorized internal network access.
**Prevention:** Apply the shared `isSafeUrl` utility from `@/lib/ssrf` consistently to all user-provided endpoints, falling back to safe default environment variables or simulated endpoints when the input is unsafe.
