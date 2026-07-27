
## 2024-05-24 - SSRF in Website Analyzer
**Vulnerability:** The Website Analyzer endpoint (`src/app/api/analyze-website/route.ts`) accepted arbitrary URLs from the user and fetched their content without validation, creating a Server-Side Request Forgery (SSRF) vulnerability. This allowed an attacker to port scan internal infrastructure or access internal services (like `localhost` or private cloud metadata APIs).
**Learning:** Using `new URL()` for protocol checks is insufficient against SSRF because an attacker could use `http://localhost` or a custom domain that resolves to an internal IP (A-record spoofing/DNS rebinding).
**Prevention:** Always parse the URL, deny `localhost`/`.local`, and crucially, resolve the hostname using `dns.promises.lookup` to validate the resulting IP address against private network blocks (e.g. `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`) using the `net` module.

## 2024-05-30 - SSRF Prevention in Demo Automation Webhook
**Vulnerability:** The `src/app/api/demo-automation/route.ts` API route accepted a user-provided `n8nUrl` for a custom webhook payload. The endpoint used this URL in a direct `fetch` request without performing SSRF validation, allowing a potential attacker to scan internal network endpoints or trigger internal services.
**Learning:** Even in non-production or demo endpoints, allowing users to specify target URLs for backend fetch requests introduces SSRF risks. Validation is necessary to protect the internal server environment and ensure requests are strictly bound to public networks.
**Prevention:** Always reuse the `isSafeUrl` function from `@/lib/ssrf` to validate any dynamically provided URL originating from a client request, prior to invoking `fetch` or other outbound network libraries. This prevents custom domains pointing to `127.0.0.1` and explicit internal hostnames from being accessed by the server.
