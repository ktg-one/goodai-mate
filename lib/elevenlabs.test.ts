import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("ElevenLabsMascot uses the exact agent_8501m0h2hvh0edr99jkqzr4rw53n agent ID", () => {
  const filePath = path.join(process.cwd(), "components/studio/ElevenLabsMascot.tsx");
  assert.ok(fs.existsSync(filePath), "components/studio/ElevenLabsMascot.tsx must exist");
  const content = fs.readFileSync(filePath, "utf-8");

  assert.ok(
    content.includes('const ELEVENLABS_AGENT_ID = "agent_8501m0h2hvh0edr99jkqzr4rw53n";'),
    "ELEVENLABS_AGENT_ID constant must be set to agent_8501m0h2hvh0edr99jkqzr4rw53n"
  );
  assert.ok(
    content.includes('<elevenlabs-convai agent-id={ELEVENLABS_AGENT_ID} />'),
    "elevenlabs-convai element must pass ELEVENLABS_AGENT_ID"
  );
});
