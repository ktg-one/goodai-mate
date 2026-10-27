/**
 * Lightweight in-process sliding-window rate limit.
 * Good enough for a single Node process (`next start` / long-lived host).
 * On multi-instance serverless each warm instance has its own Map — prefer
 * platform WAF / Upstash for multi-region hard limits.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5_000;
let opsSinceSweep = 0;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

function sweepExpired(now: number, windowMs: number) {
  const cutoff = now - windowMs;
  for (const [key, bucket] of buckets) {
    // ⚡ Bolt: Prune expired timestamps in-place to avoid O(N) array allocations per bucket
    while (bucket.timestamps.length > 0 && bucket.timestamps[0] <= cutoff) {
      bucket.timestamps.shift();
    }
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

function enforceCap() {
  while (buckets.size > MAX_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
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
    // ⚡ Bolt: Since timestamps are pushed in strictly ascending chronological order,
    // expired timestamps are guaranteed to be at the head of the array.
    // Shift expired entries in-place to achieve O(1) time complexity when unexpired
    // and zero array allocation overhead per check.
    while (bucket.timestamps.length > 0 && bucket.timestamps[0] <= cutoff) {
      bucket.timestamps.shift();
    }
    if (bucket.timestamps.length === 0) {
      buckets.delete(key);
      bucket = undefined;
    }
  }
  if (!bucket) bucket = { timestamps: [] };

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, bucket);
    enforceCap();
    return { ok: false, remaining: 0, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  enforceCap();
  return {
    ok: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterSec: 0,
  };
}

/**
 * Trusted client IP for rate keys.
 * Prefer platform `x-real-ip`, then the rightmost X-Forwarded-For hop
 * (closest to our edge). Never trust the leftmost XFF (client-spoofable).
 * Returns null when nothing usable is present.
 */
/**
 * Normalizes IP strings by removing port numbers and surrounding brackets.
 * Examples:
 *   "198.51.100.7:44332" -> "198.51.100.7"
 *   "[2001:db8::1]:8080" -> "2001:db8::1"
 *   "2001:db8::1"        -> "2001:db8::1"
 */
function cleanIp(raw: string): string {
  const ip = raw.trim();
  // Handle bracketed IPv6 like [2001:db8::1]:8080 or [2001:db8::1]
  if (ip.startsWith("[")) {
    const bracketEnd = ip.indexOf("]");
    if (bracketEnd !== -1) {
      return ip.slice(1, bracketEnd);
    }
  }
  // Handle IPv4 with port like 198.51.100.7:44332 (exactly one colon)
  const colonIndex = ip.indexOf(":");
  if (colonIndex !== -1 && colonIndex === ip.lastIndexOf(":")) {
    return ip.slice(0, colonIndex);
  }
  return ip;
}

export function clientIp(request: Request): string | null {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return cleanIp(real);

  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    // ⚡ Bolt: Iterate backwards to find the rightmost non-empty IP hop without
    // allocating intermediate array projections via .map() and .filter().
    const parts = xf.split(",");
    for (let i = parts.length - 1; i >= 0; i--) {
      const hop = parts[i]?.trim();
      if (hop) return cleanIp(hop);
    }
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
  enforceCap();
}
