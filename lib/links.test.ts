import test from "node:test";
import assert from "node:assert/strict";
import { SURVEY_URL, PHONE_DISPLAY, PHONE_HREF } from "./links";

test("SURVEY_URL is a valid Google Form HTTP URL", () => {
  assert.equal(SURVEY_URL, "https://docs.google.com/forms/d/e/1FAIpQLSfLgSG9wBHdZUWtpc-JUsJGAQJ3cisJ4rJxg8MtAXH--tY8pg/viewform?usp=publish-editor");
});

test("PHONE_DISPLAY matches expected Australian format", () => {
  assert.equal(PHONE_DISPLAY, "(08) 7741 4191");
});

test("PHONE_HREF is formatted as an international tel: URI", () => {
  assert.equal(PHONE_HREF, "tel:+61877414191");
});
