import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("ElevenLabsMascot uses the exact agent_8501m0h2hvh0edr99jkqzr4rw53n agent ID", () => {
  const mascotFilePath = path.join(process.cwd(), "components/studio/ElevenLabsMascot.tsx");
  assert.ok(fs.existsSync(mascotFilePath), "components/studio/ElevenLabsMascot.tsx must exist");
  const mascotContent = fs.readFileSync(mascotFilePath, "utf-8");

  const configFilePath = path.join(process.cwd(), "lib/elevenlabs.ts");
  assert.ok(fs.existsSync(configFilePath), "lib/elevenlabs.ts must exist");
  const configContent = fs.readFileSync(configFilePath, "utf-8");

  assert.ok(
    configContent.includes('export const ELEVENLABS_AGENT_ID = "agent_8501m0h2hvh0edr99jkqzr4rw53n";'),
    "ELEVENLABS_AGENT_ID constant must be set to agent_8501m0h2hvh0edr99jkqzr4rw53n"
  );
  assert.ok(
    mascotContent.includes('import { ELEVENLABS_AGENT_ID, ELEVENLABS_EMBED_SRC } from "@/lib/elevenlabs";'),
    "ElevenLabsMascot must import the shared config values from lib/elevenlabs"
  );
  assert.ok(
    mascotContent.includes('<elevenlabs-convai agent-id={ELEVENLABS_AGENT_ID} />'),
    "elevenlabs-convai element must pass ELEVENLABS_AGENT_ID"
  );
});
