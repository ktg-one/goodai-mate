import test from "node:test";
import assert from "node:assert/strict";
import { getElevenLabsAgentId } from "./ElevenLabsMascot.js";

test("getElevenLabsAgentId prioritizes explicit prop over env var and default", () => {
  const originalEnv = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  try {
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID = "env_agent_123";
    const result = getElevenLabsAgentId("custom_agent_prop");
    assert.equal(result, "custom_agent_prop");
  } finally {
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID = originalEnv;
  }
});

test("getElevenLabsAgentId uses NEXT_PUBLIC_ELEVENLABS_AGENT_ID env var when no prop is provided", () => {
  const originalEnv = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  try {
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID = "env_agent_456";
    const result = getElevenLabsAgentId();
    assert.equal(result, "env_agent_456");
  } finally {
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID = originalEnv;
  }
});

test("getElevenLabsAgentId falls back to default agent ID when no prop or env var is present", () => {
  const originalEnv = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  try {
    delete process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    const result = getElevenLabsAgentId();
    assert.equal(result, "agent_8501m0h2hvh0edr99jkqzr4rw53n");
  } finally {
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID = originalEnv;
  }
});
