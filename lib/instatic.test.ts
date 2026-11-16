import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  getInstaticBaseUrl,
  normalizePost,
  type InstaticEntry,
  type InstaticPostCells,
} from "./instatic.ts";

describe("lib/instatic.ts", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.INSTATIC_URL;
    delete process.env.NEXT_PUBLIC_INSTATIC_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("getInstaticBaseUrl returns default URL when env is unset and trims trailing slashes", () => {
    assert.equal(
      getInstaticBaseUrl(),
      "https://ktg-nas.blowfish-snares.ts.net"
    );

    process.env.INSTATIC_URL = "https://example.com/cms///";
    assert.equal(getInstaticBaseUrl(), "https://example.com/cms");

    delete process.env.INSTATIC_URL;
    process.env.NEXT_PUBLIC_INSTATIC_URL = "https://public.example.com/";
    assert.equal(getInstaticBaseUrl(), "https://public.example.com");
  });

  it("normalizePost maps full entry cells correctly", () => {
    const entry: InstaticEntry<InstaticPostCells> = {
      id: "post-1",
      tableSlug: "posts",
      slug: "launching-goodai",
      status: "published",
      publishedAt: "2026-10-15T08:00:00Z",
      cells: {
        title: "Launching Good'Ai",
        slug: "launching-goodai",
        body: "Here is a quick overview of how Good'Ai automates admin.",
        excerpt: "A quick summary of Good'Ai.",
        seoTitle: "SEO Title",
        seoDescription: "SEO Description",
        author: "Kevin",
        category: "Announcements",
        publishDate: "2026-10-15",
        featuredMedia: "https://cdn.example.com/cover.webp",
      },
    };

    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");
    assert.equal(post.id, "post-1");
    assert.equal(post.slug, "launching-goodai");
    assert.equal(post.title, "Launching Good'Ai");
    assert.equal(post.excerpt, "A quick summary of Good'Ai.");
    assert.equal(post.seoTitle, "SEO Title");
    assert.equal(post.seoDescription, "SEO Description");
    assert.equal(post.author, "Kevin");
    assert.equal(post.category, "Announcements");
    assert.equal(post.publishDate, "2026-10-15");
    assert.equal(post.coverImage, "https://cdn.example.com/cover.webp");
    assert.equal(post.readMinutes, 2);
  });

  it("normalizePost handles fallbacks for missing fields and strips markdown in excerpt", () => {
    const entry: InstaticEntry<InstaticPostCells> = {
      id: "fallback-id",
      tableSlug: "posts",
      slug: "fallback-slug",
      status: "published",
      publishedAt: "2026-11-01T12:00:00Z",
      cells: {
        body: "# Big Heading\n\n[Link text](https://example.com) and **bold** and *italic* details.",
      },
    };

    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");
    assert.equal(post.id, "fallback-id");
    assert.equal(post.slug, "fallback-slug");
    assert.equal(post.title, "fallback-slug");
    assert.equal(post.excerpt, "Link text and bold and italic details.");
    assert.equal(post.author, "Good'Ai");
    assert.equal(post.category, "Blog");
    assert.equal(post.publishDate, "2026-11-01");
    assert.equal(post.coverImage, null);
  });

  it("normalizePost truncates long excerpts to <= 170 chars with ellipsis on word boundary", () => {
    const longText = "A".repeat(200);
    const entry: InstaticEntry<InstaticPostCells> = {
      id: "long-id",
      tableSlug: "posts",
      slug: "long-post",
      status: "published",
      cells: {
        excerpt: longText,
      },
    };

    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");
    assert.ok(post.excerpt.length <= 170);
    assert.ok(post.excerpt.endsWith("…"));
    // No spaces = word boundary at end, so 169 + ellipsis = 170
    assert.equal(post.excerpt.length, 170);
  });

  it("normalizePost resolves relative CMS images and excludes hostingersite.com", () => {
    const baseUrl = "https://ktg-nas.blowfish-snares.ts.net";

    const relativeEntry: InstaticEntry<InstaticPostCells> = {
      id: "rel-1",
      tableSlug: "posts",
      slug: "relative-img",
      status: "published",
      cells: {
        coverImage: "/uploads/my-photo.jpg",
      },
    };
    const relPost = normalizePost(relativeEntry, baseUrl);
    assert.equal(relPost.coverImage, `${baseUrl}/uploads/my-photo.jpg`);

    const objectEntry: InstaticEntry<InstaticPostCells> = {
      id: "obj-1",
      tableSlug: "posts",
      slug: "obj-img",
      status: "published",
      cells: {
        featuredMedia: { url: "/admin/assets/header.webp" },
      },
    };
    const objPost = normalizePost(objectEntry, baseUrl);
    assert.equal(objPost.coverImage, `${baseUrl}/admin/assets/header.webp`);

    const hostingerEntry: InstaticEntry<InstaticPostCells> = {
      id: "hostinger-1",
      tableSlug: "posts",
      slug: "hostinger-img",
      status: "published",
      cells: {
        featuredMedia: "https://evil.hostingersite.com/img.jpg",
        body: "![image](https://evil.hostingersite.com/other.jpg)",
      },
    };
    const hostingerPost = normalizePost(hostingerEntry, baseUrl);
    assert.equal(hostingerPost.coverImage, null);

const markdownBodyEntry: InstaticEntry<InstaticPostCells> = {
      id: "body-img-1",
      tableSlug: "posts",
      slug: "body-img",
      status: "published",
      cells: {
        body: "Some text and ![photo](/uploads/body-art.png) inline.",
      },
    };
    const bodyImgPost = normalizePost(markdownBodyEntry, baseUrl);
    assert.equal(bodyImgPost.coverImage, `${baseUrl}/uploads/body-art.png`);
  });

  describe("cleanExcerptText handles six problematic real examples", () => {
    const baseUrl = "https://ktg-nas.blowfish-snares.ts.net";

    const realBody = `# Real Post Title

This is the first real paragraph of the post. It contains enough words to pass the eight word minimum threshold for excerpt selection.

Second paragraph with more content here.`;

    it("example 1: bare image URL first triggers rebuild from body", () => {
      const dirtyExcerpt =
        'https://cdnimages1.medium.com/max/1024/101k3rcbycZkgEkMQwNaiGQ.png 5 minute "autonomous co...';
      const entry: InstaticEntry<InstaticPostCells> = {
        id: "ex1",
        tableSlug: "posts",
        slug: "ex1",
        status: "published",
        cells: {
          title: "Real Post Title",
          excerpt: dirtyExcerpt,
          body: realBody,
        },
      };
      const post = normalizePost(entry, baseUrl);
      assert.ok(post.excerpt.startsWith("This is the first real paragraph"), `excerpt: ${post.excerpt.slice(0, 80)}`);
      assert.ok(post.excerpt.split(/\s+/).filter(Boolean).length >= 8);
    });

    it("example 2: Sitemap chrome and broken image syntax triggers rebuild from body", () => {
      const dirtyExcerpt =
        "Sitemap(https://medium.com/sitemap/sitemap.xml) !(https://miro.medium.com/v2/resize:fit:64...";
      const entry: InstaticEntry<InstaticPostCells> = {
        id: "ex2",
        tableSlug: "posts",
        slug: "ex2",
        status: "published",
        cells: {
          title: "Real Post Title",
          excerpt: dirtyExcerpt,
          body: realBody,
        },
      };
      const post = normalizePost(entry, baseUrl);
      assert.ok(post.excerpt.startsWith("This is the first real paragraph"), `excerpt: ${post.excerpt.slice(0, 80)}`);
      assert.ok(post.excerpt.split(/\s+/).filter(Boolean).length >= 8);
    });

    it("example 3: leading ! from image syntax triggers rebuild from body", () => {
      const dirtyExcerpt = "!PROMPT CHALLENGE: TO THE TOP…";
      const entry: InstaticEntry<InstaticPostCells> = {
        id: "ex3",
        tableSlug: "posts",
        slug: "ex3",
        status: "published",
        cells: {
          title: "Real Post Title",
          excerpt: dirtyExcerpt,
          body: realBody,
        },
      };
      const post = normalizePost(entry, baseUrl);
      assert.ok(post.excerpt.startsWith("This is the first real paragraph"), `excerpt: ${post.excerpt.slice(0, 80)}`);
      assert.ok(post.excerpt.split(/\s+/).filter(Boolean).length >= 8);
    });

    it("example 4: byline bullet •.ktg plus title triggers rebuild from body", () => {
      const dirtyExcerpt = "•.ktg !FastMCP 3.0 — Cuz we are efficiency…";
      const entry: InstaticEntry<InstaticPostCells> = {
        id: "ex4",
        tableSlug: "posts",
        slug: "ex4",
        status: "published",
        cells: {
          title: "Real Post Title",
          excerpt: dirtyExcerpt,
          body: realBody,
        },
      };
      const post = normalizePost(entry, baseUrl);
      assert.ok(post.excerpt.startsWith("This is the first real paragraph"), `excerpt: ${post.excerpt.slice(0, 80)}`);
      assert.ok(post.excerpt.split(/\s+/).filter(Boolean).length >= 8);
    });

    it("example 5: byline bullet •.ktg plus title (variant) triggers rebuild from body", () => {
      const dirtyExcerpt = "•.ktg !ALL YOUR AGENT SKILLS ARE…";
      const entry: InstaticEntry<InstaticPostCells> = {
        id: "ex5",
        tableSlug: "posts",
        slug: "ex5",
        status: "published",
        cells: {
          title: "Real Post Title",
          excerpt: dirtyExcerpt,
          body: realBody,
        },
      };
      const post = normalizePost(entry, baseUrl);
      assert.ok(post.excerpt.startsWith("This is the first real paragraph"), `excerpt: ${post.excerpt.slice(0, 80)}`);
      assert.ok(post.excerpt.split(/\s+/).filter(Boolean).length >= 8);
    });

    it("example 6: leading ! with title-like text triggers rebuild from body", () => {
      const dirtyExcerpt = "!Agent Skill Quicksave: The AI Memory…";
      const entry: InstaticEntry<InstaticPostCells> = {
        id: "ex6",
        tableSlug: "posts",
        slug: "ex6",
        status: "published",
        cells: {
          title: "Real Post Title",
          excerpt: dirtyExcerpt,
          body: realBody,
        },
      };
      const post = normalizePost(entry, baseUrl);
      assert.ok(post.excerpt.startsWith("This is the first real paragraph"), `excerpt: ${post.excerpt.slice(0, 80)}`);
      assert.ok(post.excerpt.split(/\s+/).filter(Boolean).length >= 8);
});
});

  it("normalizePost strips fenced python code block and leading language word", () => {
    const entry: InstaticEntry<InstaticPostCells> = {
      id: "fence-1",
      tableSlug: "posts",
      slug: "fenced-code",
      status: "published",
      cells: {
        body: "```python3\nEFFICIENCY MANDATE -> TRANSPARENCY\nAn accounting argument\n```\n\nActual prose content here.",
      },
    };
    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");
    assert.ok(!post.excerpt.includes("```"));
    assert.ok(!post.excerpt.includes("python3"));
    assert.ok(!post.excerpt.includes("EFFICIENCY"));
    assert.ok(post.excerpt.includes("Actual prose content here"));
  });

  it("normalizePost removes rule line (=====)", () => {
    const entry: InstaticEntry<InstaticPostCells> = {
      id: "rule-1",
      tableSlug: "posts",
      slug: "rule-line",
      status: "published",
      cells: {
        body: "Title\n=====\n\nBody text after the rule.",
      },
    };
    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");
    assert.ok(!post.excerpt.includes("====="));
    assert.ok(post.excerpt.includes("Body text after the rule"));
  });

  it("normalizePost caps excerpt at 170 and seoDescription at 155 on word boundary", () => {
    const longBody = "A".repeat(400);
    const entry: InstaticEntry<InstaticPostCells> = {
      id: "cap-1",
      tableSlug: "posts",
      slug: "cap-test",
      status: "published",
      cells: {
        body: longBody,
      },
    };
    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");
    assert.ok(post.excerpt.length <= 170, `excerpt length ${post.excerpt.length} > 170`);
    assert.ok(post.seoDescription.length <= 155, `seoDescription length ${post.seoDescription.length} > 155`);
    assert.ok(post.excerpt.endsWith("…"));
    assert.ok(post.seoDescription.endsWith("…"));
  });

  it("normalizePost keeps link text from markdown link", () => {
    const entry: InstaticEntry<InstaticPostCells> = {
      id: "link-1",
      tableSlug: "posts",
      slug: "markdown-link",
      status: "published",
      cells: {
        body: "Check out [Good'Ai website](https://goodai.au) for more.",
      },
    };
    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");
    assert.ok(post.excerpt.includes("Good'Ai website"));
    assert.ok(!post.excerpt.includes("https://goodai.au"));
    assert.ok(!post.excerpt.includes("["));
    assert.ok(!post.excerpt.includes("]"));
  });

  it("normalizePost cleans flattened CMS excerpt with inline fences, rule runs, and language token", () => {
    const dirtyExcerpt =
      'Use their efficiency logic against them. --- python3 """ ================================================================================ EFFICIENCY MANDATE \u2192 TRANSPARENCY An accounting argument, n...';
    const bodyStart =
      '# How We Do This\n\nUse their efficiency logic against them. \n\n--- \n\n```python3\n"""\n\n====...====\n\nEFFICIENCY MANDATE \u2192 TRANSPARENCY\n\nAn accounting argument, not an ethical one.\n\n====...';

    const entry: InstaticEntry<InstaticPostCells> = {
      id: "how-we-do-this",
      tableSlug: "posts",
      slug: "how-we-do-this",
      status: "published",
      cells: {
        excerpt: dirtyExcerpt,
        seoDescription: dirtyExcerpt,
        body: bodyStart,
      },
    };

    const post = normalizePost(entry, "https://ktg-nas.blowfish-snares.ts.net");

    // Excerpt and seoDescription should start with the prose sentence
    assert.ok(
      post.excerpt.startsWith("Use their efficiency logic against them."),
      `excerpt starts with: ${post.excerpt.slice(0, 50)}`
    );
    assert.ok(
      post.seoDescription.startsWith("Use their efficiency logic against them."),
      `seoDescription starts with: ${post.seoDescription.slice(0, 50)}`
    );

    // Forbidden substrings must be absent from both
    const forbidden = ["python3", "===", '"""', "---"];
    for (const bad of forbidden) {
      assert.ok(
        !post.excerpt.includes(bad),
        `excerpt contains forbidden: ${bad}`
      );
      assert.ok(
        !post.seoDescription.includes(bad),
        `seoDescription contains forbidden: ${bad}`
      );
    }

    // Length caps
    assert.ok(post.excerpt.length <= 170, `excerpt too long: ${post.excerpt.length}`);
    assert.ok(post.seoDescription.length <= 155, `seoDescription too long: ${post.seoDescription.length}`);
  });
});