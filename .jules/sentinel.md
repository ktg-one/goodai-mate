## 2025-02-14 - Fix SSRF Vulnerability in analyze-website API

**Vulnerability:** The `/api/analyze-website` endpoint took a user-provided URL (`req.json().url`) and passed it directly to `fetch()` to scrape content without validation. This allowed Server-Side Request Forgery (SSRF), where an attacker could probe internal networks (e.g., `http://localhost`, `http://169.254.169.254`, `http://10.0.0.1`) from the server.

**Learning:** Internal tooling often performs automated web scraping for analytics or feature extraction. When accepting external URLs in API routes (especially for AI or scraping features), we cannot assume the client will provide a safe, external internet address.

**Prevention:** Always validate user-provided URLs in API routes before making outbound HTTP requests. Parse the URL, ensure it uses `http:` or `https:`, and perform DNS resolution (`dns.promises.lookup`) to check the resolved IP against a blocklist of private IPv4/IPv6 ranges using `net.isIP`, preventing both direct SSRF and DNS Rebinding/A-record spoofing attacks.
