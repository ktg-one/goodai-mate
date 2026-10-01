import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SURVEY_URL, PHONE_HREF, PHONE_DISPLAY, isValidTelUri, isValidExternalUrl } from "./links";

test("SURVEY_URL is a valid HTTPS Google Form URL", () => {
  assert.ok(SURVEY_URL.startsWith("https://docs.google.com/forms/"));
  assert.doesNotThrow(() => new URL(SURVEY_URL));
  assert.strictEqual(isValidExternalUrl(SURVEY_URL), true);
});

test("PHONE_HREF is a valid tel: URI", () => {
  assert.ok(PHONE_HREF.startsWith("tel:+"));
  assert.strictEqual(isValidTelUri(PHONE_HREF), true);
});

test("isValidTelUri correctly validates E.164 tel: URIs", () => {
  // Happy paths
  assert.strictEqual(isValidTelUri(PHONE_HREF), true);
  assert.strictEqual(isValidTelUri("tel:+61877414191"), true);
  assert.strictEqual(isValidTelUri("tel:+12125550199"), true);

  // Failure cases / Boundary conditions
  assert.strictEqual(isValidTelUri("tel:0877414191"), false, "Missing leading + sign");
  assert.strictEqual(isValidTelUri("tel:+012345"), false, "Country code cannot start with 0");
  assert.strictEqual(isValidTelUri("tel:+1234567890123456"), false, "Exceeds 15 digits");
  assert.strictEqual(isValidTelUri("javascript:alert(1)"), false, "Non-tel protocol");
  assert.strictEqual(isValidTelUri(""), false, "Empty string");
  assert.strictEqual(isValidTelUri("   "), false, "Whitespace string");
});

test("isValidExternalUrl correctly validates HTTP/HTTPS URLs", () => {
  // Happy paths
  assert.strictEqual(isValidExternalUrl(SURVEY_URL), true);
  assert.strictEqual(isValidExternalUrl("https://example.com"), true);
  assert.strictEqual(isValidExternalUrl("http://localhost:3000"), true);

  // Failure cases / Boundary conditions
  assert.strictEqual(isValidExternalUrl("ftp://example.com"), false, "Non-HTTP/HTTPS protocol");
  assert.strictEqual(isValidExternalUrl("javascript:alert(1)"), false, "Script injection attempt");
  assert.strictEqual(isValidExternalUrl("/relative/path"), false, "Relative URL path");
  assert.strictEqual(isValidExternalUrl("not-a-url"), false, "Plain string");
  assert.strictEqual(isValidExternalUrl(""), false, "Empty string");
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

test("PHONE_HREF links are rendered using native anchor <a> tags and not Next.js <Link>", () => {
  const filesWithPhone = [
    "components/studio/Shell.tsx",
    "components/studio/VoiceDemo.tsx",
    "components/layout/Navbar.tsx",
    "components/sections/CTA.tsx",
    "components/sections/Hero.tsx",
    "app/page.tsx",
  ];

  for (const relativePath of filesWithPhone) {
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, "utf-8");

    assert.strictEqual(
      content.includes("<Link href={PHONE_HREF}"),
      false,
      `File ${relativePath} should not use Next.js <Link> for PHONE_HREF`
    );
  }
});

test("external SURVEY_URL links use target='_blank' and rel='noopener noreferrer'", () => {
  const filesToCheck = [
    "components/studio/Shell.tsx",
    "components/studio/VoiceDemo.tsx",
    "components/layout/Navbar.tsx",
    "components/layout/Footer.tsx",
    "components/sections/CTA.tsx",
    "components/sections/Pricing.tsx",
    "components/sections/TechSpecs.tsx",
    "app/page.tsx",
    "app/services/[slug]/page.tsx",
  ];

  for (const relativePath of filesToCheck) {
    const fullPath = path.join(process.cwd(), relativePath);
    assert.ok(fs.existsSync(fullPath), `Expected file to exist: ${relativePath}`);
    const content = fs.readFileSync(fullPath, "utf-8");

    // Match any <a ... href={SURVEY_URL} ... > or <a ... href="https://..." ... >
    const anchorRegex = /<a\s+[^>]*href=\{(?:SURVEY_URL|"https:\/\/[^"]+")\}[^>]*>|<a\s+[^>]*href="https:\/\/[^"]+"[^>]*>/g;
    let match;
    while ((match = anchorRegex.exec(content)) !== null) {
      const tag = match[0];
      assert.ok(
        tag.includes('target="_blank"'),
        `Anchor tag in ${relativePath} missing target="_blank": ${tag}`
      );
      assert.ok(
        tag.includes('rel="noopener noreferrer"'),
        `Anchor tag in ${relativePath} missing rel="noopener noreferrer": ${tag}`
      );
    }
  }
});
