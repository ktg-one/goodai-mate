import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SITE_INVARIANTS,
  isValidBlogCoverImage,
  validateBlogPostContract,
} from "../schemas/site-contracts.ts";
import { normalizePost } from "../lib/instatic.ts";
import { LAYER_COPY, MACHINE_LABELS } from "../lib/stack.ts";

test("Blog schema: rejects homepage scroll/book sketches and dead hostinger URLs as cover images", () => {
  assert.equal(isValidBlogCoverImage(null), true);
  assert.equal(isValidBlogCoverImage("https://ktg-nas.blowfish-snares.ts.net/uploads/cover.webp"), true);
  assert.equal(isValidBlogCoverImage("/images/book/1-sketch.webp"), false);
  assert.equal(isValidBlogCoverImage("/images/scroll/3-sketch.webp"), false);
  assert.equal(isValidBlogCoverImage("https://lawngreen-mallard-558077.hostingersite.com/img.png"), false);
});

test("Blog schema: normalizePost leaves coverImage null when CMS has no image instead of injecting homepage art", () => {
  const postWithoutMedia = normalizePost(
    {
      id: "post-1",
      tableSlug: "posts",
      slug: "test-post",
      status: "published",
      cells: {
        title: "Test Post",
        body: "Plain markdown body with no image.",
      },
    },
    "https://ktg-nas.blowfish-snares.ts.net",
  );
  assert.equal(postWithoutMedia.coverImage, null);
  assert.equal(postWithoutMedia.category, "Blog");
  const validation = validateBlogPostContract(postWithoutMedia);
  assert.equal(validation.ok, true, validation.errors.join(", "));
});

test("Navigation contract: Shell.tsx uses 'Blog' and never 'Field notes' or 'Notes'", () => {
  const shellSource = readFileSync(new URL("../components/studio/Shell.tsx", import.meta.url), "utf8");
  assert.match(shellSource, /<Link href="\/blog">Blog<\/Link>/);
  for (const forbidden of SITE_INVARIANTS.forbiddenNavLabels) {
    assert.ok(
      !shellSource.includes(`>${forbidden}`),
      `Shell.tsx must not label /blog as "${forbidden}"`,
    );
  }
});

test("Admin Engine contract: no Arm 01..04, GCP Sydney, APIs & webhooks, Your existing tools, or Opportunity audit", () => {
  const stackSerialized = JSON.stringify({ LAYER_COPY, MACHINE_LABELS });
  const machineHtml = readFileSync(new URL("../public/machine/goodai-machine.html", import.meta.url), "utf8");

  for (const forbidden of SITE_INVARIANTS.forbiddenMachineStrings) {
    assert.ok(
      !stackSerialized.includes(forbidden),
      `lib/stack.ts must not contain "${forbidden}"`,
    );
    assert.ok(
      !machineHtml.includes(forbidden),
      `public/machine/goodai-machine.html must not contain "${forbidden}"`,
    );
  }

  for (const stackItem of MACHINE_LABELS.stack) {
    assert.equal(
      stackItem.detail,
      "",
      `Stack item "${stackItem.title}" should use brand logos only, not a text description`,
    );
    assert.ok(
      Array.isArray(stackItem.logos) && stackItem.logos.length > 0,
      `Stack item "${stackItem.title}" must declare at least one brand logo`,
    );
  }
});

test("Chatbot contract: /api/chat/session has >=20s wakeup timeout and zero-503 Goodie fallback", () => {
  const routeSource = readFileSync(new URL("../app/api/chat/session/route.ts", import.meta.url), "utf8");
  assert.match(routeSource, /buildSmartFallbackReply/, "route.ts must include buildSmartFallbackReply fallback");
  assert.ok(
    !routeSource.includes("status: 503"),
    "route.ts must never return a raw 503 error to the visitor when the NAS is waking up",
  );
  assert.match(routeSource, /25_000/, "route.ts must allow a 25s timeout for NAS cold wakeups");
});
