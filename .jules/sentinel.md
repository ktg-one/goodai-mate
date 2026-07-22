
## 2024-05-24 - SSRF in Website Analyzer
**Vulnerability:** The Website Analyzer endpoint (`src/app/api/analyze-website/route.ts`) accepted arbitrary URLs from the user and fetched their content without validation, creating a Server-Side Request Forgery (SSRF) vulnerability. This allowed an attacker to port scan internal infrastructure or access internal services (like `localhost` or private cloud metadata APIs).
**Learning:** Using `new URL()` for protocol checks is insufficient against SSRF because an attacker could use `http://localhost` or a custom domain that resolves to an internal IP (A-record spoofing/DNS rebinding).
**Prevention:** Always parse the URL, deny `localhost`/`.local`, and crucially, resolve the hostname using `dns.promises.lookup` to validate the resulting IP address against private network blocks (e.g. `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`) using the `net` module.

## 2024-07-22 - Prevent SSRF in Webhook Automation
**Vulnerability:** The application allowed users to specify a custom `n8nUrl` for a webhook in the automation demonstration, which was then directly called using `fetch()`. This exposed a Server-Side Request Forgery (SSRF) vulnerability, allowing an attacker to potentially probe internal network resources or interact with local services.
**Learning:** Even internal endpoints or demo features that interact with user-supplied URLs must validate the destination. Simply passing the URL to `fetch()` is unsafe without checking the resolved IP address.
**Prevention:** Implement SSRF protection using a robust check that validates both the URL scheme and the resolved DNS record against a list of known local/private IPv4 and IPv6 address ranges before initiating outbound HTTP requests.
