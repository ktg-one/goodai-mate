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
    assert.equal(post.author, "Good’Ai");
    assert.equal(post.category, "Blog");
    assert.equal(post.publishDate, "2026-11-01");
    assert.equal(post.coverImage, null);
  });

  it("normalizePost truncates long excerpts to <= 170 chars with ellipsis", () => {
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
    assert.equal(post.excerpt.length, 168);
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
});
