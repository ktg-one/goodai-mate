import test from "node:test";
import assert from "node:assert/strict";
import {
  STACK_ARCHITECTURE,
  STACK_ARMS,
  STACK_COPY,
  STACK_ETHICS,
  STACK_FOOTNOTE,
  STACK_HOSTING,
  STACK_LAYERS,
  STACK_MODELS,
  STACK_RUNTIME,
  STACK_SERVICES,
  STACK_VOICES,
} from "./stack.ts";

const vendors = [...STACK_MODELS, ...STACK_VOICES, ...STACK_RUNTIME];
// Trillet's note carries its own certifications; everything else must stay claim-free.
const ownText = vendors.map((v) => (v.name === "Trillet" ? { ...v, note: "" } : v));
const allText = JSON.stringify({
  STACK_COPY,
  STACK_SERVICES,
  STACK_ARMS,
  STACK_ETHICS,
  STACK_ARCHITECTURE,
  ownText,
  STACK_FOOTNOTE,
});

test("every layer has copy and a button label", () => {
  for (const l of STACK_LAYERS) {
    assert.ok(STACK_COPY[l].title && STACK_COPY[l].body && STACK_COPY[l].button, l);
  }
});

test("the four arms and cam shaft map to all five Good'Ai services", () => {
  assert.equal(STACK_ARMS.length, 5);
  for (const arm of STACK_ARMS) {
    assert.match(arm.href, /^\/services\//, arm.name);
    assert.ok(STACK_SERVICES.includes(arm.name as (typeof STACK_SERVICES)[number]), arm.name);
  }
});

test("ethics and architecture layers have clear principles", () => {
  assert.ok(STACK_ETHICS.length >= 4);
  assert.ok(STACK_ARCHITECTURE.length >= 3);
  for (const p of [...STACK_ETHICS, ...STACK_ARCHITECTURE]) {
    assert.ok(p.title && p.detail, p.title);
  }
});

test("every vendor links out over https", () => {
  for (const v of vendors) assert.match(v.href, /^https:\/\//, v.name);
});

test("no prices or compliance claims outside the certifying vendor's note", () => {
  assert.doesNotMatch(allText, /\$\s?\d|PRIS|ISO\s?\d|SOC\s?2|HIPAA|GDPR|certified|compliant|guarantee/i);
});

test("the Sydney claim covers hosting and models, not the voice vendors", () => {
  assert.equal(STACK_HOSTING.note, "Sydney");
  for (const v of STACK_VOICES) assert.doesNotMatch(v.note ?? "", /sydney|australia/i, v.name);
});

test("footnote disclaims affiliation", () => {
  assert.match(STACK_FOOTNOTE, /not affiliated with or endorsed by/);
});
