
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

## 2024-05-24 - Fix SSRF bypass via HTTP Redirects
**Vulnerability:** The outbound `fetch` requests in the API routes (`analyze-website` and `demo-automation`) did not disable following redirects, potentially allowing attackers to bypass the initial SSRF validation (`isSafeUrl`) by providing a URL that redirects to a restricted local/private IP address.
**Learning:** Node.js `fetch` automatically follows HTTP redirects (e.g., 301, 302) by default, creating a TOCTOU (Time-of-Check to Time-of-Use) condition where the initial URL passes validation but the final destination is restricted.
**Prevention:** Always use `redirect: 'error'` or `redirect: 'manual'` in the `fetch` options when making outbound requests to user-provided URLs.

## 2024-05-24 - SSRF HTTP Redirect Safe Handling
**Vulnerability:** Setting `redirect: 'error'` in `fetch` to prevent SSRF bypasses via HTTP redirects broke core functionality for endpoints that legitimately need to follow redirects (e.g., website scrapers encountering `http` to `https` redirects).
**Learning:** You cannot simply disable redirects for features that depend on them. You must manually follow the redirect chain.
**Prevention:** Implement a manual redirect loop (`redirect: 'manual'`) that intercepts `3xx` responses, extracts the `Location` header, validates the new URL against the SSRF rules (`isSafeUrl`), and only proceeds with the next `fetch` if safe.

## 2025-05-14 - SSRF IPv4-mapped IPv6 Bypass
**Vulnerability:** The `isSafeUrl` function failed to block IPv4-mapped IPv6 addresses accurately. When a domain resolves to an address like `::ffff:7f00:1` or `::ffff:127.0.0.1`, `net.isIPv6` returns true, but the previous checks only looked for `::1`, `fc`, `fd`, and `fe80` prefixes. Attackers could map an internal IP address inside an IPv6 prefix `::ffff:` bypassing validation, but Node.js `fetch` would successfully connect to the internal IP address.
**Learning:** `net.isIPv6` does not automatically filter out or parse IPv4-mapped IPv6 addresses for security purposes. An explicit check is required to verify if the string starts with `::ffff:` and, if so, whether the rest of the string is an internal IPv4 address or an obfuscated hex string.
**Prevention:** Implement strict prefix checks (`lowerAddr.startsWith('::ffff:')`) inside the IPv6 validation block, extract the trailing portion, and reject it if it represents a local IPv4 address or is a non-standard mapped representation (like hex obfuscation) that might sneak past.
