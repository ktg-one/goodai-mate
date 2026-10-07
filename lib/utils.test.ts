import test from "node:test";
import assert from "node:assert/strict";
import { cn } from "./utils.ts";

test("cn combines multiple class names", () => {
  assert.equal(cn("flex", "relative"), "flex relative");
});

test("cn merges tailwind conflicting classes correctly", () => {
  assert.equal(cn("px-2 py-1", "p-4"), "p-4");
  assert.equal(cn("text-brand-coral", "text-brand-teal"), "text-brand-teal");
});

test("cn handles conditional and falsy values", () => {
  assert.equal(cn("block", false && "hidden", null, undefined, 0, "relative"), "block relative");
});

test("cn handles array and object inputs", () => {
  assert.equal(cn(["flex", "relative"], { "items-center": true, hidden: false }), "flex relative items-center");
});
