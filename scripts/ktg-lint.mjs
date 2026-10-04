#!/usr/bin/env node

// Motion/layout contract checks. GSAP/ScrollTrigger rules (HomeScroll,
// toggleActions, pin without end) were removed while no GSAP is in use;
// re-add them when ScrollTrigger comes back.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pageFile = path.join(root, "app", "page.tsx");
const stylesFile = path.join(root, "app", "globals.css");
const failures = [];

const pageSource = fs.readFileSync(pageFile, "utf8");
const stylesSource = fs.readFileSync(stylesFile, "utf8");

if (!pageSource.includes('className="home-page"')) {
  failures.push("MISSING_HOME_TRACK: the homepage needs its dedicated scroll-height container.");
}

if (!/\.home-page\s*\{[^}]*min-height:\s*(?:1\d{4,}|[2-9]\d{4,})px/s.test(stylesSource)) {
  failures.push("SHORT_HOME_TRACK: homepage scroll height must be at least 10000px.");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".next-dev", ".git", "klint"].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!/\.(?:js|jsx|ts|tsx)$/.test(entry.name)) continue;

    const source = fs.readFileSync(fullPath, "utf8");
    const relative = path.relative(root, fullPath);

    if ((/new THREE\./.test(source) || /@react-three\/fiber/.test(source)) &&
        /addEventListener/.test(source) && !/removeEventListener/.test(source)) {
      failures.push(`THREE_LISTENER_LEAK: ${relative} adds an event listener without teardown.`);
    }
  }
}

walk(path.join(root, "app"));
walk(path.join(root, "components"));
walk(path.join(root, "src"));

if (failures.length) {
  console.error("[KTG-LINT] Motion contract failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[KTG-LINT] Passed: 10000px homepage floor and THREE listener teardown.");
