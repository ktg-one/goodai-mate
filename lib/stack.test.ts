import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LAYER_COPY, MACHINE_LABELS, STACK_FOOTNOTE, shownLayer, type LabelLayer } from "./stack.ts";

const html = readFileSync(new URL("../public/machine/goodai-machine.html", import.meta.url), "utf8");

// lab.label(obj, 'Title', { layer: 'services', tag: 'Incoming call', … value: 'Detail' })
const machineLabels = [...html.matchAll(/lab\.label\(\w+, '([^']+)', \{ layer: '(\w+)', tag: '([^']+)'.*?value: '([^']*)' \}\)/g)].map(
  ([, title, layer, tag, detail]) => ({ layer, tag, title, detail }),
);

test("page labels match the machine's labels word for word", () => {
  assert.ok(machineLabels.length > 0, "no lab.label() calls parsed from the machine");
  const page = (Object.entries(MACHINE_LABELS) as [LabelLayer, typeof MACHINE_LABELS.services][]).flatMap(([layer, labels]) =>
    labels.map(({ tag, title, detail }) => ({ layer, tag, title, detail })),
  );
  assert.deepEqual(page, machineLabels);
});

test("panel headings are the machine's film beats", () => {
  for (const [layer, beat] of [["services", "02"], ["stack", "04"], ["ethics", "05"]] as const) {
    const { title, body } = LAYER_COPY[layer];
    assert.ok(html.includes(`'${beat}': ['${title}', '${body}']`), `beat ${beat} ≠ ${layer} heading`);
  }
});

test("panel shows the same layer the machine does", () => {
  const off = { labels: false, explode: false, cut: false, xray: false, slow: false };
  assert.equal(shownLayer(off), null);
  assert.equal(shownLayer({ ...off, labels: true }), "services");
  assert.equal(shownLayer({ ...off, labels: true, xray: true }), "stack");
  assert.equal(shownLayer({ ...off, cut: true, explode: true }), "ethics");
});

test("service labels link to a service page", () => {
  for (const l of MACHINE_LABELS.services) if (l.href) assert.match(l.href, /^\/services\/[a-z-]+$/, l.title);
});

test("no prices or compliance claims about Good'Ai", () => {
  const text = JSON.stringify({ MACHINE_LABELS, LAYER_COPY, STACK_FOOTNOTE });
  assert.doesNotMatch(text, /\$\s?\d|ISO\s?\d|SOC\s?2|HIPAA|GDPR|certified|compliant|guarantee/i);
});

test("footnote disclaims affiliation", () => {
  assert.match(STACK_FOOTNOTE, /not affiliated with or endorsed by/);
});
