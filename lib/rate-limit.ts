/**
 * Lightweight in-process sliding-window rate limit.
 * Good enough for a single Node process (`next start` / long-lived host).
 * On multi-instance serverless each warm instance has its own Map — prefer
 * platform WAF / Upstash for multi-region hard limits.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();
export const MAX_KEYS = 5_000;
let opsSinceSweep = 0;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

function sweepExpired(now: number, windowMs: number) {
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => t > now - windowMs);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  {
    limit = 8,
    windowMs = 60_000,
  }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  opsSinceSweep += 1;
  if (opsSinceSweep >= 64) {
    opsSinceSweep = 0;
    sweepExpired(now, windowMs);
  }

  const cutoff = now - windowMs;
  let bucket = buckets.get(key);
  if (bucket) {
    bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);
    if (bucket.timestamps.length === 0) {
      buckets.delete(key);
      bucket = undefined;
    }
  }

  if (!bucket) {
    if (buckets.size >= MAX_KEYS) {
      sweepExpired(now, windowMs);
    }
    if (buckets.size >= MAX_KEYS && !buckets.has(key)) {
      return {
        ok: false,
        remaining: 0,
        retryAfterSec: Math.ceil(windowMs / 1000),
      };
    }
    bucket = { timestamps: [] };
  }

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return {
    ok: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterSec: 0,
  };
}

const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/;

/**
 * Trusted client IP for rate keys.
 * Derives client IP only when proxy headers are validated / trusted.
 * In production, requires explicit TRUST_PROXY="true" or edge environment
 * (Vercel / Railway). Never trusts malformed or client-spoofable IP strings.
 */
export function clientIp(request: Request): string | null {
  const isProd = process.env.NODE_ENV === "production";
  const trustProxy = isProd
    ? process.env.TRUST_PROXY === "true" ||
      process.env.VERCEL === "1" ||
      Boolean(process.env.RAILWAY_ENVIRONMENT) ||
      Boolean(process.env.RAILWAY_STATIC_URL)
    : process.env.TRUST_PROXY !== "false";

  if (!trustProxy) {
    return null;
  }

  const real = request.headers.get("x-real-ip")?.trim();
  if (real && IP_REGEX.test(real)) return real;

  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const parts = xf
      .split(",")
      .map((p) => p.trim())
      .filter((p) => IP_REGEX.test(p));
    if (parts.length > 0) return parts[parts.length - 1] ?? null;
  }
  return null;
}

/**
 * Rate-limit key for an API route.
 * With a real IP → per-IP key at `limit`.
 * Without → shared global key at a higher coarse cap (best-effort only).
 */
export function limitRequest(
  request: Request,
  prefix: string,
  {
    limit = 8,
    globalLimit = 60,
    windowMs = 60_000,
  }: { limit?: number; globalLimit?: number; windowMs?: number } = {},
): RateLimitResult {
  const ip = clientIp(request);
  if (!ip) {
    return rateLimit(`${prefix}:global`, { limit: globalLimit, windowMs });
  }
  return rateLimit(`${prefix}:${ip}`, { limit, windowMs });
}

/** Test helpers */
export function _bucketCountForTests(): number {
  return buckets.size;
}

export function _resetRateLimitForTests(): void {
  buckets.clear();
  opsSinceSweep = 0;
}

export function _forceSweepForTests(windowMs = 60_000): void {
  sweepExpired(Date.now(), windowMs);
}
