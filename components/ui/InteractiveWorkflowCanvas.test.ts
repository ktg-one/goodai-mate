import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SCENARIOS, SCENARIOS_MAP } from "./InteractiveWorkflowCanvas";

test("InteractiveWorkflowCanvas exports SCENARIOS_MAP for O(1) lookup", () => {
  assert.ok(SCENARIOS_MAP instanceof Map, "SCENARIOS_MAP should be a Map instance");
  assert.equal(SCENARIOS_MAP.size, SCENARIOS.length, "Map size should match SCENARIOS length");

  for (const s of SCENARIOS) {
    assert.equal(SCENARIOS_MAP.get(s.id), s, `Map lookup for '${s.id}' should return scenario object`);
  }
});

test("InteractiveWorkflowCanvas source code includes O(1) lookup and list memoization", () => {
  const filePath = path.join(process.cwd(), "components/ui/InteractiveWorkflowCanvas.tsx");
  assert.ok(fs.existsSync(filePath), "InteractiveWorkflowCanvas.tsx exists");

  const content = fs.readFileSync(filePath, "utf-8");

  // O(1) Map lookup instead of O(N) Array.find
  assert.ok(
    content.includes("SCENARIOS_MAP.get(activeScenarioId)"),
    "Must use SCENARIOS_MAP.get for O(1) scenario resolution"
  );

  // Static CHIME_FREQUENCIES module-level array constant
  assert.ok(
    content.includes("CHIME_FREQUENCIES"),
    "Must use module-level CHIME_FREQUENCIES constant to avoid array allocations during audio synthesis"
  );

  // List memoization with useMemo
  assert.ok(
    content.includes("useMemo"),
    "Must import and use useMemo for rendering scenario tabs and extracted data tags"
  );
});
