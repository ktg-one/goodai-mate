
## 2026-07-15 - Prevent Server-Side Request Forgery (SSRF)
**Vulnerability:** The `/api/analyze-website` route performed a `fetch` directly on a user-provided URL (`targetUrl`) without checking if the URL pointed to an internal IP or private hostname, allowing potential SSRF.
**Learning:** Always validate user-provided URLs before making outbound HTTP requests. Even if a protocol check is intended, the hostname itself must be verified.
**Prevention:** Parse the URL using `new URL()` and check the hostname against known private IP ranges (e.g., `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`, `localhost`, `.local`) before executing the `fetch` request.
