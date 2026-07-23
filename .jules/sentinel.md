
## 2024-05-24 - SSRF in Website Analyzer
**Vulnerability:** The Website Analyzer endpoint (`src/app/api/analyze-website/route.ts`) accepted arbitrary URLs from the user and fetched their content without validation, creating a Server-Side Request Forgery (SSRF) vulnerability. This allowed an attacker to port scan internal infrastructure or access internal services (like `localhost` or private cloud metadata APIs).
**Learning:** Using `new URL()` for protocol checks is insufficient against SSRF because an attacker could use `http://localhost` or a custom domain that resolves to an internal IP (A-record spoofing/DNS rebinding).
**Prevention:** Always parse the URL, deny `localhost`/`.local`, and crucially, resolve the hostname using `dns.promises.lookup` to validate the resulting IP address against private network blocks (e.g. `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`) using the `net` module.

## 2025-02-27 - SSRF via User-Provided Webhook URL in Demo Automation
**Vulnerability:** The Demo Automation API (`src/app/api/demo-automation/route.ts`) allowed a user to provide a custom `n8nUrl` for a webhook. The API would then send a POST request to this provided URL without validating it, creating a Server-Side Request Forgery (SSRF) risk where an attacker could force the server to make requests to internal network services.
**Learning:** Any endpoint that accepts a URL from user input and makes an outbound request (even if it's just a POST webhook payload) is vulnerable to SSRF. This is a common pattern in integrations like custom webhooks.
**Prevention:** Always reuse the central SSRF validation utility (`isSafeUrl`) to validate user-provided URLs before making any outbound HTTP requests.
