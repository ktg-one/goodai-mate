import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(self), payment=()",
  },
  // CSP kept permissive enough for Next + inline styles + sketchbook iframe + Trillet.
  // Tighten once a full asset inventory is locked for Phase 7.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https: wss:",
      "media-src 'self' blob: https:",
      "frame-src 'self' blob:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

export default function config(phase: string): NextConfig {
  return {
    outputFileTracingRoot: __dirname,
    devIndicators: false,
    poweredByHeader: false,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    // The sketchbook runs in a sandboxed srcdoc iframe (origin "null"), so its fonts need CORS.
    async headers() {
      return [
        {
          source: "/sketchbook/:file*.woff2",
          headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
        },
        {
          source: "/:path*",
          headers: securityHeaders,
        },
      ];
    },
  };
}
