
## 2024-05-24 - SSRF in Website Analyzer
**Vulnerability:** The Website Analyzer endpoint (`src/app/api/analyze-website/route.ts`) accepted arbitrary URLs from the user and fetched their content without validation, creating a Server-Side Request Forgery (SSRF) vulnerability. This allowed an attacker to port scan internal infrastructure or access internal services (like `localhost` or private cloud metadata APIs).
**Learning:** Using `new URL()` for protocol checks is insufficient against SSRF because an attacker could use `http://localhost` or a custom domain that resolves to an internal IP (A-record spoofing/DNS rebinding).
**Prevention:** Always parse the URL, deny `localhost`/`.local`, and crucially, resolve the hostname using `dns.promises.lookup` to validate the resulting IP address against private network blocks (e.g. `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`) using the `net` module.

## 2024-05-30 - Fix Server-Side Request Forgery (SSRF) in demo-automation webhook
**Vulnerability:** The API endpoint `src/app/api/demo-automation/route.ts` permitted arbitrary user-controlled URLs (`n8nUrl`) to be directly consumed by an outgoing `fetch` call without any validation. This exposed the application to Server-Side Request Forgery (SSRF), allowing malicious actors to probe internal network services, cloud metadata endpoints, or potentially bypass firewall configurations.
**Learning:** External webhook payloads must always validate endpoints explicitly prior to dispatch. Although dynamic routing features often provide legitimate use cases for user-supplied target URLs, failing to restrict them to external, publicly addressable domains can have critical consequences for server security.
**Prevention:** Always reuse the project's central SSRF mitigation utility (`isSafeUrl` exported from `@/lib/ssrf`) to validate user-supplied domains against explicit deny-lists (like `localhost` and private IP ranges) prior to executing outbound HTTP requests.
