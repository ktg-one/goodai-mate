
## 2024-05-24 - SSRF in Website Analyzer
**Vulnerability:** The Website Analyzer endpoint (`src/app/api/analyze-website/route.ts`) accepted arbitrary URLs from the user and fetched their content without validation, creating a Server-Side Request Forgery (SSRF) vulnerability. This allowed an attacker to port scan internal infrastructure or access internal services (like `localhost` or private cloud metadata APIs).
**Learning:** Using `new URL()` for protocol checks is insufficient against SSRF because an attacker could use `http://localhost` or a custom domain that resolves to an internal IP (A-record spoofing/DNS rebinding).
**Prevention:** Always parse the URL, deny `localhost`/`.local`, and crucially, resolve the hostname using `dns.promises.lookup` to validate the resulting IP address against private network blocks (e.g. `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`) using the `net` module.

## 2024-05-30 - SSRF Prevention in Demo Automation Webhook
**Vulnerability:** The `src/app/api/demo-automation/route.ts` API route accepted a user-provided `n8nUrl` for a custom webhook payload. The endpoint used this URL in a direct `fetch` request without performing SSRF validation, allowing a potential attacker to scan internal network endpoints or trigger internal services.
**Learning:** Even in non-production or demo endpoints, allowing users to specify target URLs for backend fetch requests introduces SSRF risks. Validation is necessary to protect the internal server environment and ensure requests are strictly bound to public networks.
**Prevention:** Always reuse the `isSafeUrl` function from `@/lib/ssrf` to validate any dynamically provided URL originating from a client request, prior to invoking `fetch` or other outbound network libraries. This prevents custom domains pointing to `127.0.0.1` and explicit internal hostnames from being accessed by the server.
## 2025-02-13 - Prevent Email Header Injection (CRLF) in Raw Email Construction
**Vulnerability:** User-controlled inputs (`name`, `email`) and AI-generated text (`businessType`) were interpolated directly into raw email headers (`To`, `Subject`) before base64Url encoding for the Gmail API. An attacker could inject CRLF (`\r\n`) sequences to append arbitrary headers (like `Bcc:` or `Cc:`) or manipulate the email body.
**Learning:** Constructing raw RFC 2822 emails manually via string concatenation is dangerous if any of the interpolated values contain newlines, as it allows header injection.
**Prevention:** Always sanitize variables that are inserted into email headers by stripping carriage returns and newlines (e.g., `.replace(/[\r\n]/g, '')`), or use a dedicated email building library rather than raw string concatenation.

## 2025-02-14 - Path Traversal & API Abuse in TTS Endpoint
**Vulnerability:** The TTS route (`src/app/api/tts/route.ts`) constructed the external ElevenLabs API URL by interpolating a user-provided `voiceId` without validation. A malicious user could supply a crafted string (e.g., `../../some-other-endpoint`) leading to Path Traversal against the ElevenLabs API, or abuse the server's configured API key for unintended requests.
**Learning:** Never interpolate unvalidated user inputs directly into external API request URLs, especially when server-side credentials are used. This can result in unauthorized API usage or exploiting unexpected downstream endpoints.
**Prevention:** Always strictly validate user inputs meant to be part of an API path (like `voiceId`) against a strict regex whitelist (e.g., `/^[a-zA-Z0-9_-]+$/`) before making the outbound request.

## 2025-02-15 - Redirect SSRF Bypass in User-Provided Fetch URLs
**Vulnerability:** Even though endpoints (`analyze-website`, `demo-automation`) validate user-provided URLs using `isSafeUrl` before making requests, the standard `fetch` API follows HTTP redirects (e.g. 301, 302) by default. An attacker could supply a URL that passes the initial SSRF check (e.g. resolving to a safe IP), but responds with a redirect to an internal IP (like `127.0.0.1`). `fetch` would automatically follow this redirect, bypassing the validation and creating a Server-Side Request Forgery vulnerability.
**Learning:** Initial URL validation is insufficient if the underlying HTTP client automatically follows redirects to new, unvalidated destinations. This is a common form of SSRF bypass.
**Prevention:** Always configure `fetch` (or equivalent HTTP clients) with `redirect: 'error'` or `redirect: 'manual'` when making requests to user-provided URLs, ensuring the client does not silently traverse to restricted internal networks.
