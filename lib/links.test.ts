import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SURVEY_URL, PHONE_HREF, PHONE_DISPLAY } from "./links";

test("SURVEY_URL is a valid HTTPS Google Form URL", () => {
  assert.ok(SURVEY_URL.startsWith("https://docs.google.com/forms/"));
  assert.doesNotThrow(() => new URL(SURVEY_URL));
});

test("PHONE_HREF is a valid tel: URI", () => {
  assert.ok(PHONE_HREF.startsWith("tel:+"));
});

test("PHONE_DISPLAY is formatted", () => {
  assert.ok(PHONE_DISPLAY.length > 0);
});

test("layout components do not use Next.js <Link> for external URLs or empty anchors", () => {
  const footerContent = fs.readFileSync(
    path.join(process.cwd(), "components/layout/Footer.tsx"),
    "utf-8"
  );
  const navbarContent = fs.readFileSync(
    path.join(process.cwd(), "components/layout/Navbar.tsx"),
    "utf-8"
  );

  assert.strictEqual(
    footerContent.includes('<Link href="https://'),
    false,
    "Footer should not use Next.js Link for https:// URLs"
  );
  assert.strictEqual(
    footerContent.includes("<Link href={SURVEY_URL}"),
    false,
    "Footer should not use Next.js Link for SURVEY_URL"
  );
  assert.strictEqual(
    footerContent.includes('href="#"'),
    false,
    "Footer should not use empty anchor href='#'"
  );

  assert.strictEqual(
    navbarContent.includes("<Link href={SURVEY_URL}"),
    false,
    "Navbar should not use Next.js Link for SURVEY_URL"
  );
});
