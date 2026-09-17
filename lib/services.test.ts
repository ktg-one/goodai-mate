import test from "node:test";
import assert from "node:assert/strict";
import { services, getServiceBySlug } from "./services";

test("getServiceBySlug returns the matching service for valid slugs", () => {
  const service = getServiceBySlug("voice-agents");
  assert.notEqual(service, undefined);
  assert.equal(service?.name, "AI voice agents");
  assert.equal(service?.slug, "voice-agents");
});

test("getServiceBySlug returns undefined for unknown slugs", () => {
  const service = getServiceBySlug("unknown-slug");
  assert.equal(service, undefined);
});

test("all services have complete and non-empty required fields", () => {
  assert.ok(services.length > 0, "services list should not be empty");
  for (const service of services) {
    assert.ok(service.slug.length > 0, "slug should not be empty");
    assert.ok(service.name.length > 0, "name should not be empty");
    assert.ok(service.line.length > 0, "line should not be empty");
    assert.ok(service.description.length > 0, "description should not be empty");
    assert.ok(service.price.length > 0, "price should not be empty");
    assert.ok(service.priceNote.length > 0, "priceNote should not be empty");
    assert.ok(service.detail.length > 0, "detail should not be empty");
    assert.ok(service.range.length > 0, "range should not be empty");
    assert.ok(Array.isArray(service.items) && service.items.length > 0, "items should be a non-empty array");
  }
});
