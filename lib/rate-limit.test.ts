import test from "node:test";
import assert from "node:assert/strict";
import {
  rateLimit,
  clientIp,
  limitRequest,
  MAX_KEYS,
  _bucketCountForTests,
  _resetRateLimitForTests,
  _forceSweepForTests,
} from "./rate-limit.ts";

test("rateLimit allows up to the limit then blocks", () => {
  _resetRateLimitForTests();
  const key = `t-${Date.now()}-${Math.random()}`;
  for (let i = 0; i < 3; i++) {
    const r = rateLimit(key, { limit: 3, windowMs: 60_000 });
    assert.equal(r.ok, true);
  }
  const blocked = rateLimit(key, { limit: 3, windowMs: 60_000 });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfterSec >= 1);
});

test("rateLimit isolates keys", () => {
  _resetRateLimitForTests();
  const a = `a-${Date.now()}-${Math.random()}`;
  const b = `b-${Date.now()}-${Math.random()}`;
  assert.equal(rateLimit(a, { limit: 1, windowMs: 60_000 }).ok, true);
  assert.equal(rateLimit(a, { limit: 1, windowMs: 60_000 }).ok, false);
  assert.equal(rateLimit(b, { limit: 1, windowMs: 60_000 }).ok, true);
});

test("clientIp prefers x-real-ip over x-forwarded-for", () => {
  const req = new Request("http://localhost/api/contact", {
    headers: {
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
      "x-real-ip": "198.51.100.7",
    },
  });
  assert.equal(clientIp(req), "198.51.100.7");
});

test("clientIp uses rightmost x-forwarded-for hop when no x-real-ip", () => {
  const req = new Request("http://localhost/", {
    headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1, 192.0.2.44" },
  });
  assert.equal(clientIp(req), "192.0.2.44");
});

test("clientIp returns null when no proxy headers", () => {
  assert.equal(clientIp(new Request("http://localhost/")), null);
});

test("limitRequest without IP uses global coarse cap not a shared unknown IP key", () => {
  _resetRateLimitForTests();
  const bare = new Request("http://localhost/api/contact");
  for (let i = 0; i < 5; i++) {
    assert.equal(limitRequest(bare, "contact", { limit: 5, globalLimit: 8 }).ok, true);
  }
  // per-IP limit would already block at 5; global still has room
  assert.equal(limitRequest(bare, "contact", { limit: 5, globalLimit: 8 }).ok, true);
  assert.equal(limitRequest(bare, "contact", { limit: 5, globalLimit: 8 }).ok, true);
  assert.equal(limitRequest(bare, "contact", { limit: 5, globalLimit: 8 }).ok, true);
  assert.equal(limitRequest(bare, "contact", { limit: 5, globalLimit: 8 }).ok, false);
});

test("expired buckets are deleted on sweep (no empty Map leak)", () => {
  _resetRateLimitForTests();
  const key = `expire-${Math.random()}`;
  assert.equal(rateLimit(key, { limit: 2, windowMs: 1 }).ok, true);
  const start = Date.now();
  while (Date.now() - start < 5) {
    /* spin */
  }
  _forceSweepForTests(1);
  assert.equal(_bucketCountForTests(), 0);
});

test("bucket map enforces MAX_KEYS cap without evicting active keys", () => {
  _resetRateLimitForTests();
  const totalToInsert = MAX_KEYS + 50;
  for (let i = 0; i < totalToInsert; i++) {
    rateLimit(`cap-${i}`, { limit: 1, windowMs: 60_000 });
  }
  assert.equal(_bucketCountForTests(), MAX_KEYS);
  // Existing key within MAX_KEYS range should still exist and be blocked (limit=1)
  const existingRes = rateLimit("cap-0", { limit: 1, windowMs: 60_000 });
  assert.equal(existingRes.ok, false);
  // Brand new key when map is full should be rejected without adding new entry
  const newKeyRes = rateLimit("brand-new-key", { limit: 1, windowMs: 60_000 });
  assert.equal(newKeyRes.ok, false);
  assert.equal(_bucketCountForTests(), MAX_KEYS);
});
