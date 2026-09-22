import test from "node:test";
import assert from "node:assert/strict";
import { services, getServiceBySlug } from "./services";

test("services array contains valid non-empty service items", () => {
  assert.ok(Array.isArray(services));
  assert.strictEqual(services.length, 5);

  for (const service of services) {
    assert.ok(typeof service.slug === "string" && service.slug.length > 0);
    assert.ok(typeof service.name === "string" && service.name.length > 0);
    assert.ok(typeof service.line === "string" && service.line.length > 0);
    assert.ok(typeof service.description === "string" && service.description.length > 0);
    assert.ok(typeof service.price === "string" && service.price.length > 0);
    assert.ok(typeof service.priceNote === "string" && service.priceNote.length > 0);
    assert.ok(Array.isArray(service.items) && service.items.length > 0);
    assert.ok(typeof service.detail === "string" && service.detail.length > 0);
    assert.ok(typeof service.range === "string" && service.range.length > 0);
  }
});

test("getServiceBySlug returns the correct service for valid slugs", () => {
  for (const service of services) {
    const found = getServiceBySlug(service.slug);
    assert.ok(found !== undefined, `Expected service to be found for slug: ${service.slug}`);
    assert.strictEqual(found?.slug, service.slug);
    assert.strictEqual(found?.name, service.name);
  }
});

test("getServiceBySlug returns undefined for invalid or empty slugs", () => {
  assert.strictEqual(getServiceBySlug("invalid-slug"), undefined);
  assert.strictEqual(getServiceBySlug(""), undefined);
  assert.strictEqual(getServiceBySlug("VOICE-AGENTS"), undefined);
  assert.strictEqual(getServiceBySlug("   "), undefined);
});
