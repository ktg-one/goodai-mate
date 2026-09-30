import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
export default function config(phase: string): NextConfig {
  return {
    outputFileTracingRoot: __dirname,
    devIndicators: false,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    // The sketchbook runs in a sandboxed srcdoc iframe (origin "null"), so its fonts need CORS.
    async headers() {
      return [{ source: "/sketchbook/:file*.woff2", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] }];
    },
  };
}
