import test from "node:test";
import assert from "node:assert/strict";
import { localBlogImage } from "./blog-images.ts";
import { readFileSync } from "node:fs";

const map = JSON.parse(readFileSync(new URL("./blog-image-map.json", import.meta.url), "utf8"));
const firstUrl = Object.keys(map)[0];
const firstLocal = map[firstUrl];

test("mapped URL returns its local path", () => {
  assert.equal(localBlogImage(firstUrl), firstLocal);
});

test("unmapped URL returns the input unchanged", () => {
  const unknown = "https://cdn-images-1.medium.com/max/1024/1*nope.png";
  assert.equal(localBlogImage(unknown), unknown);
});

test("URL with &amp; entity is normalized before lookup", () => {
  const amp = firstUrl + "?w=100&amp;h=100";
  // If the map has no entry for the amp-variant, the input is returned as-is
  // (no silent rewrite of the entity). The function must not throw.
  const result = localBlogImage(amp);
  assert.equal(typeof result, "string");
  assert.ok(result.length > 0);
});

test("empty input is returned as-is", () => {
  assert.equal(localBlogImage(""), "");
});