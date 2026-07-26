
## 2024-05-24 - SSRF in Website Analyzer
**Vulnerability:** The Website Analyzer endpoint (`src/app/api/analyze-website/route.ts`) accepted arbitrary URLs from the user and fetched their content without validation, creating a Server-Side Request Forgery (SSRF) vulnerability. This allowed an attacker to port scan internal infrastructure or access internal services (like `localhost` or private cloud metadata APIs).
**Learning:** Using `new URL()` for protocol checks is insufficient against SSRF because an attacker could use `http://localhost` or a custom domain that resolves to an internal IP (A-record spoofing/DNS rebinding).
**Prevention:** Always parse the URL, deny `localhost`/`.local`, and crucially, resolve the hostname using `dns.promises.lookup` to validate the resulting IP address against private network blocks (e.g. `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`) using the `net` module.
## 2026-07-26 - SSRF Vulnerability in Webhook Integration
**Vulnerability:** User-provided webhook URLs (`n8nUrl`) were passed directly to a `fetch` call in the demo automation endpoint without validation, creating a Server-Side Request Forgery (SSRF) risk.
**Learning:** Even internal or demo APIs that accept URLs must validate them against private IP ranges and local hostnames before issuing outbound HTTP requests.
**Prevention:** Always use the central `isSafeUrl` utility from `@/lib/ssrf` to validate user-provided URLs before making requests.
