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
  // CSP kept permissive enough for Next + inline styles + sketchbook iframe + ElevenLabs + Trillet.
  // Tighten once a full asset inventory is locked for Phase 7.
  { key: "Content-Security-Policy", value: csp("'none'") },
];

function csp(frameAncestors: string) {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://unpkg.com https://cdn.jsdelivr.net https://elevenlabs.io https://*.elevenlabs.io",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https: wss:",
    "media-src 'self' data: blob: https:",
    "frame-src 'self' blob: https://elevenlabs.io https://*.elevenlabs.io",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
  ].join("; ");
}

// The /demo page embeds the admin engine (public/machine/*.html) in an iframe, so only those files
// may be framed, and only by this site. Listed after the site-wide rule so these values win.
const machineFrameHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: csp("'self'") },
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
          source: "/fonts/:path*",
          headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
        },
        {
          source: "/:path*",
          headers: securityHeaders,
        },
        {
          source: "/machine/:path*",
          headers: machineFrameHeaders,
        },
      ];
    },
    async rewrites() {
      return [
        { source: "/posts", destination: "/blog" },
        { source: "/posts/:slug", destination: "/blog/:slug" },
      ];
    },
  };
}
