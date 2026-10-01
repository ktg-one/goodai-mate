#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const motionFile = path.join(root, "components", "layout", "HomeScroll.tsx");
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

if (!fs.existsSync(motionFile)) {
  failures.push("MISSING_HOME_SCROLL: components/layout/HomeScroll.tsx is required.");
} else {
  const source = fs.readFileSync(motionFile, "utf8");

  if (/once:\s*true/.test(source)) {
    failures.push("ONE_SHOT_SCROLL: homepage flow must not collapse into one-time reveal triggers.");
  }

  if (/REVEAL_GROUPS|chapter-copy|section-heading|service-row|faq details/.test(source)) {
    failures.push("ANIMATED_COPY: homepage text must remain static until an approved text treatment exists.");
  }
}

function walk(dir) {
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

    if (/ScrollTrigger/.test(source) && /toggleActions/.test(source) && /(Story|Stage|Narrative)/i.test(relative)) {
      failures.push(`TRIPWIRE_STORY: ${relative} uses toggleActions for narrative motion.`);
    }

    if (/pin:\s*true/.test(source) && !/\bend\s*:/.test(source)) {
      failures.push(`UNBOUNDED_PIN: ${relative} pins content without an explicit end.`);
    }

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

console.log("[KTG-LINT] Passed: 10000px homepage floor, static copy, and bounded motion contracts.");
