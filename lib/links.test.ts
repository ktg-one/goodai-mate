import test from "node:test";
import assert from "node:assert/strict";
import { SURVEY_URL, PHONE_DISPLAY, PHONE_HREF } from "./links";

test("SURVEY_URL is a valid Google Form HTTP URL", () => {
  assert.ok(SURVEY_URL.startsWith("https://docs.google.com/forms/"));
});

test("PHONE_DISPLAY matches expected Australian format", () => {
  assert.equal(PHONE_DISPLAY, "(08) 7741 4191");
});

test("PHONE_HREF is formatted as an international tel: URI", () => {
  assert.equal(PHONE_HREF, "tel:+61877414191");
});
