#!/usr/bin/env node
// Mirrors every remote Medium blog image into public/images/blog as WebP and
// writes lib/blog-image-map.json. Safe to re-run: existing files are reused.
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public", "images", "blog");
const MAP_PATH = path.join(ROOT, "lib", "blog-image-map.json");
const ENDPOINT =
  process.env.INSTATIC_BLOG_IMAGES_URL ||
  "https://ktg-nas.blowfish-snares.ts.net/admin/api/cms/plugins/goodai.content-api/runtime/posts";
const MAX_WIDTH = 1600;
const MIN_BYTES = 1024;

async function fetchPosts() {
  const res = await fetch(ENDPOINT, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`posts fetch failed: HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.entries) ? data.entries : [];
}

function collectUrls(entry) {
  const urls = new Set();
  const cells = entry.cells ?? {};
  const add = (v) => {
    if (typeof v === "string" && v.trim()) urls.add(v.trim());
    if (v && typeof v === "object") {
      add(v.url);
      add(v.src);
    }
  };
  add(cells.featuredMedia);
  add(cells.coverImage);
  if (typeof cells.body === "string") {
    for (const m of cells.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) urls.add(m[1]);
    for (const m of cells.body.matchAll(/<img[^>]+\s+src=["']([^"']+)["']/gi)) urls.add(m[1]);
  }
  return urls;
}

function isMedium(url) {
  try {
    const host = new URL(url).hostname;
    return host === "medium.com" || host.endsWith(".medium.com");
  } catch {
    return false;
  }
}

function lastSegment(url) {
  const seg = url.split("/").pop() || "";
  return seg;
}

function sha1Hex16(url) {
  return createHash("sha1").update(url).digest("hex").slice(0, 16);
}

async function download(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < MIN_BYTES) throw new Error(`too small (${buf.length} bytes)`);
  if (!ct.startsWith("image/")) throw new Error(`not an image (${ct || "none"})`);
  return buf;
}

async function loadMap() {
  try {
    const raw = await readFile(MAP_PATH, "utf8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : {};
  } catch {
    return {};
  }
}

async function saveMap(map) {
  await mkdir(path.dirname(MAP_PATH), { recursive: true });
  await writeFile(MAP_PATH, JSON.stringify(map, null, 2) + "\n", "utf8");
}

async function main() {
  const entries = await fetchPosts();
  const map = await loadMap();
  let mirrored = 0;
  let reused = 0;
  const failed = [];

  const targets = new Set();
  for (const entry of entries) {
    for (const url of collectUrls(entry)) {
      if (isMedium(url)) targets.add(url);
    }
  }

  for (const url of targets) {
    const key = sha1Hex16(url);
    const file = `${key}.webp`;
    const rel = `/images/blog/${file}`;
    const dest = path.join(PUBLIC_DIR, file);

    if (map[url] === rel && existsSync(dest)) {
      try {
        if ((await stat(dest)).size > MIN_BYTES) {
          reused++;
          continue;
        }
      } catch {
        // fall through and re-mirror
      }
    }

    let buf;
    try {
      buf = await download(url);
    } catch {
      const seg = lastSegment(url);
      if (seg) {
        const fallback = `https://miro.medium.com/v2/resize:fit:1600/${seg}`;
        try {
          buf = await download(fallback);
        } catch {
          failed.push(url);
          continue;
        }
      } else {
        failed.push(url);
        continue;
      }
    }

    await mkdir(PUBLIC_DIR, { recursive: true });
    const webp = await sharp(buf)
      .resize({ width: MAX_WIDTH, withoutAnimation: true })
      .webp()
      .toBuffer();
    await writeFile(dest, webp);
    map[url] = rel;
    mirrored++;
  }

  await saveMap(map);
  console.log(
    `mirror-blog-images: ${mirrored} mirrored, ${reused} reused, ${failed.length} failed (of ${targets.size} targets)`,
  );
  for (const url of failed) console.log(`  FAILED: ${url}`);
  if (failed.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error("mirror-blog-images error:", err);
  process.exit(1);
});