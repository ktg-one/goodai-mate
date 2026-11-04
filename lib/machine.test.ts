import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("MachineDemo iframe defines an explicit sandbox attribute with minimal permissions", () => {
  const content = fs.readFileSync("components/studio/MachineDemo.tsx", "utf-8");
  assert.match(
    content,
    /sandbox="allow-scripts allow-same-origin allow-popups"/,
    "MachineDemo iframe must specify an explicit sandbox attribute to prevent unrestricted iframe privileges",
  );
});
