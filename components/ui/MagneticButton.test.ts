import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("MagneticButton supports polymorphic href rendering and focus-visible styling", () => {
  const filePath = path.join(process.cwd(), "components/ui/MagneticButton.tsx");
  assert.ok(fs.existsSync(filePath), "MagneticButton.tsx exists");

  const content = fs.readFileSync(filePath, "utf-8");

  // Verify focus-visible style
  assert.ok(
    content.includes("focus-visible:outline-2") || content.includes("focus-visible:ring"),
    "MagneticButton must include explicit focus-visible focus ring styles"
  );

  // Verify polymorphic href support
  assert.ok(
    content.includes("href?: string") || content.includes("href,"),
    "MagneticButton must support optional href prop"
  );
  assert.ok(
    content.includes("<motion.a"),
    "MagneticButton must render motion.a when href is provided"
  );
});

test("Hero section uses MagneticButton with href={PHONE_HREF} and no window.location.assign", () => {
  const heroPath = path.join(process.cwd(), "components/sections/Hero.tsx");
  assert.ok(fs.existsSync(heroPath), "Hero.tsx exists");

  const content = fs.readFileSync(heroPath, "utf-8");

  assert.ok(
    content.includes("href={PHONE_HREF}"),
    "Hero.tsx primary button must pass href={PHONE_HREF} to MagneticButton"
  );
  assert.strictEqual(
    content.includes("window.location.assign"),
    false,
    "Hero.tsx should not use window.location.assign for phone links"
  );
});
