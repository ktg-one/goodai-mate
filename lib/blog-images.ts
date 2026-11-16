import { readFileSync } from "node:fs";
import { join } from "node:path";

function loadMap(): Record<string, string> {
  try {
    const raw = readFileSync(join(process.cwd(), "lib", "blog-image-map.json"), "utf8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : {};
  } catch {
    return {};
  }
}

const imageMap = loadMap();

function normalize(url: string): string {
  return url.replace(/&amp;/g, "&");
}

export function localBlogImage(url: string): string {
  if (!url) return url;
  const cleaned = normalize(url).trim();
  if (!cleaned) return url;
  return cleaned in imageMap ? imageMap[cleaned] : url;
}