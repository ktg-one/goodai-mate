
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
## 2025-02-14 - SSRF Bypass via IPv4-mapped IPv6 Addresses
**Vulnerability:** The `isSafeUrl` function failed to properly extract and validate the embedded IPv4 address within an IPv4-mapped IPv6 address (e.g., `::ffff:127.0.0.1` or `::ffff:7f00:1`). This allowed attackers to bypass the blocklist and resolve a domain to an internal loopback interface, establishing an SSRF vulnerability.
**Learning:** `net.isIPv6` returns true for IPv4-mapped addresses, but `net.isIPv4` returns false. Any custom SSRF check that validates IPv4 blocks must also parse and apply the same rules to the underlying IPv4 address inside mapped IPv6 formats.
**Prevention:** Always parse and explicitly extract the IPv4 portion of an IPv4-mapped IPv6 address before running loopback/private network validations to prevent bypasses.

## 2025-02-14 - SSRF Bypass via IPv4-mapped IPv6 Zero Compressions and Uncompressed Formats
**Vulnerability:** The `parseIPv4MappedIPv6` function inside `src/lib/ssrf.ts` was naively checking for `::ffff:` string prefix, allowing attackers to bypass SSRF validation by using uncompressed representations (e.g. `0:0:0:0:0:ffff:127.0.0.1`) or hex-encoded IPv4 (e.g. `::ffff:7f00:1`).
**Learning:** Checking string prefixes on network IP formats is inherently insecure due to zero-compression, alternate representations, and Node URL normalization translating dotted-decimal mapped addresses into pure hex (e.g., `::ffff:7f00:1`).
**Prevention:** IP validators must properly parse IPv6 segments, resolving zero compressions (`::`) and explicitly checking the binary bit patterns (80 bits of 0 followed by 16 bits of FFFF) rather than relying on string `.startsWith` matching.
