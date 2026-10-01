import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("AutomationDock buttons have explicit focus-visible styles and aria-labels", () => {
  const filePath = path.join(process.cwd(), "components/ui/AutomationDock.tsx");
  assert.ok(fs.existsSync(filePath), "AutomationDock.tsx exists");

  const content = fs.readFileSync(filePath, "utf-8");

  // Verify buttons have aria-label attribute
  assert.ok(
    content.includes("aria-label={label}"),
    "AutomationDock buttons must have aria-label={label}"
  );

  // Verify buttons have focus-visible styling for keyboard accessibility
  assert.ok(
    content.includes("focus-visible:outline-2") || content.includes("focus-visible:ring"),
    "AutomationDock buttons must include explicit focus-visible focus ring styles"
  );
});
