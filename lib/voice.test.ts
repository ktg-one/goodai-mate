import test from "node:test";
import assert from "node:assert/strict";
import { allowedAgentIds, isAgentAllowed } from "./voice.ts";

test("allowedAgentIds parses primary and extra allowed agent IDs", () => {
  const origPrimary = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID;
  const origExtra = process.env.TRILLET_ALLOWED_AGENT_IDS;

  process.env.NEXT_PUBLIC_TRILLET_AGENT_ID = "primary-agent-123";
  process.env.TRILLET_ALLOWED_AGENT_IDS = "extra-agent-1, extra-agent-2";

  try {
    const set = allowedAgentIds();
    assert.equal(set.has("primary-agent-123"), true);
    assert.equal(set.has("extra-agent-1"), true);
    assert.equal(set.has("extra-agent-2"), true);
    assert.equal(set.has("unknown-agent"), false);
  } finally {
    if (origPrimary !== undefined) process.env.NEXT_PUBLIC_TRILLET_AGENT_ID = origPrimary;
    else delete process.env.NEXT_PUBLIC_TRILLET_AGENT_ID;

    if (origExtra !== undefined) process.env.TRILLET_ALLOWED_AGENT_IDS = origExtra;
    else delete process.env.TRILLET_ALLOWED_AGENT_IDS;
  }
});

test("isAgentAllowed fails closed on empty or missing agent IDs", () => {
  const origPrimary = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID;
  delete process.env.NEXT_PUBLIC_TRILLET_AGENT_ID;
  delete process.env.TRILLET_ALLOWED_AGENT_IDS;

  try {
    assert.equal(isAgentAllowed(""), false);
    assert.equal(isAgentAllowed("some-agent"), false);
  } finally {
    if (origPrimary !== undefined) process.env.NEXT_PUBLIC_TRILLET_AGENT_ID = origPrimary;
  }
});

test("isAgentAllowed validates requested agent ID against environment allowlist", () => {
  const origPrimary = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID;
  process.env.NEXT_PUBLIC_TRILLET_AGENT_ID = "darling-good";

  try {
    assert.equal(isAgentAllowed("darling-good"), true);
    assert.equal(isAgentAllowed("evil-agent"), false);
  } finally {
    if (origPrimary !== undefined) process.env.NEXT_PUBLIC_TRILLET_AGENT_ID = origPrimary;
    else delete process.env.NEXT_PUBLIC_TRILLET_AGENT_ID;
  }
});
