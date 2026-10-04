import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SURVEY_URL, PHONE_HREF, PHONE_DISPLAY } from "./links.ts";

// SURVEY_URL is the site's central intake destination. It is currently the
// internal /contact route, which posts to Resend, but it may point at an
// external form again. Assert it is a usable destination either way, not a
// specific host.
test("SURVEY_URL is a usable intake destination", () => {
  assert.ok(SURVEY_URL.length > 0, "SURVEY_URL must not be empty");
  if (SURVEY_URL.startsWith("/")) {
    assert.ok(SURVEY_URL.startsWith("//") === false, "use a single leading slash");
  } else {
    assert.doesNotThrow(() => new URL(SURVEY_URL), "external SURVEY_URL must be a valid URL");
  }
});

test("PHONE_HREF is a valid tel: URI", () => {
  assert.ok(PHONE_HREF.startsWith("tel:+"));
});

test("PHONE_DISPLAY is formatted", () => {
  assert.ok(PHONE_DISPLAY.length > 0);
});

// Only components the app actually renders are checked. Parked, unimported
// components (Navbar, Footer, CTA, Pricing, TechSpecs) are not part of the
// shipped surface and are deliberately excluded.
const SHIPPED = [
  "components/studio/Shell.tsx",
  "components/studio/VoiceDemo.tsx",
  "components/sections/Hero.tsx",
  "app/page.tsx",
  "app/services/[slug]/page.tsx",
  "app/layout.tsx",
];

test("shipped components contain no empty anchor href='#'", () => {
  for (const relativePath of SHIPPED) {
    const fullPath = path.join(process.cwd(), relativePath);
    assert.ok(fs.existsSync(fullPath), `Expected file to exist: ${relativePath}`);
    const content = fs.readFileSync(fullPath, "utf-8");
    assert.ok(
      !content.includes('href="#"'),
      `${relativePath} must not use an empty anchor href="#"`
    );
  }
});

test("PHONE_HREF is rendered with a native anchor, not Next.js <Link>", () => {
  for (const relativePath of SHIPPED) {
    const fullPath = path.join(process.cwd(), relativePath);
    assert.ok(fs.existsSync(fullPath), `Expected file to exist: ${relativePath}`);
    const content = fs.readFileSync(fullPath, "utf-8");
    assert.ok(
      !content.includes("<Link href={PHONE_HREF}"),
      `${relativePath} must not use Next.js <Link> for PHONE_HREF`
    );
  }
});

// Internal destinations stay in the same tab; only external ones need
// target/rel. Asserting target on an internal link would push the contact
// page into a new tab, which is the wrong behaviour.
test("external anchors open in a new tab with rel=noopener noreferrer", () => {
  for (const relativePath of SHIPPED) {
    const fullPath = path.join(process.cwd(), relativePath);
    assert.ok(fs.existsSync(fullPath), `Expected file to exist: ${relativePath}`);
    const content = fs.readFileSync(fullPath, "utf-8");

    const externalAnchor = /<a\s[^>]*href="https?:\/\/[^"]*"[^>]*>/g;
    let match;
    while ((match = externalAnchor.exec(content)) !== null) {
      const tag = match[0];
      assert.ok(
        tag.includes('target="_blank"'),
        `External anchor in ${relativePath} missing target="_blank": ${tag}`
      );
      assert.ok(
        tag.includes('rel="noopener noreferrer"'),
        `External anchor in ${relativePath} missing rel="noopener noreferrer": ${tag}`
      );
    }
  }
});