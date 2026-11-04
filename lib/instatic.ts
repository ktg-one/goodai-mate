export interface InstaticPostCells {
  title?: string;
  slug?: string;
  body?: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  category?: string;
  publishDate?: string;
  featuredMedia?: string | { url?: string; src?: string } | null;
  coverImage?: string | { url?: string; src?: string } | null;
}

export interface InstaticEntry<TCells = Record<string, unknown>> {
  id: string;
  tableSlug: string;
  slug: string;
  status: string;
  cells: TCells;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  body: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  author: string;
  category: string;
  publishDate: string;
  coverImage: string | null;
  readMinutes: number;
}

const DEFAULT_INSTATIC_URL = "https://ktg-nas.blowfish-snares.ts.net";

export function getInstaticBaseUrl(): string {
  const raw =
    process.env.INSTATIC_URL ||
    process.env.NEXT_PUBLIC_INSTATIC_URL ||
    DEFAULT_INSTATIC_URL;
  return raw.replace(/\/+$/, "");
}

function cleanExcerptText(raw: string): string {
  return raw
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+.*$/gm, "")
    .replace(/^\|.*\|$/gm, "")
    .replace(/={3,}|-{3,}|\*{3,}/g, " ")
    .replace(/[*_`>#\[\]|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCmsImageUrl(
  media: string | { url?: string; src?: string } | null | undefined,
  body: string,
  baseUrl: string,
): string | null {
  let candidate = "";
  if (typeof media === "string" && media.trim()) {
    candidate = media.trim();
  } else if (media && typeof media === "object") {
    candidate = String(media.url || media.src || "").trim();
  }
  if (!candidate) {
    const match = /!\[[^\]]*\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/.exec(body);
    if (match?.[1] && !match[1].includes("hostingersite.com")) {
      candidate = match[1];
    }
  }
  if (!candidate || candidate.includes("hostingersite.com")) return null;
  if (candidate.startsWith("/admin/") || candidate.startsWith("/uploads/")) {
    return `${baseUrl}${candidate}`;
  }
  return candidate;
}

export function normalizePost(entry: InstaticEntry<InstaticPostCells>, baseUrl: string): BlogPost {
  const cells = entry.cells ?? {};
  const title = String(cells.title || entry.slug || "Untitled");
  const body = String(cells.body || "");
  const rawExcerpt = String(cells.excerpt || cells.seoDescription || body);
  const cleaned = cleanExcerptText(rawExcerpt);
  const excerpt = cleaned.length > 170 ? `${cleaned.slice(0, 167).trimEnd()}…` : cleaned;
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(2, Math.round(wordCount / 220));
  const coverImage = resolveCmsImageUrl(cells.featuredMedia ?? cells.coverImage, body, baseUrl);

  return {
    id: entry.id,
    slug: String(entry.slug || cells.slug || ""),
    title,
    body,
    excerpt,
    seoTitle: String(cells.seoTitle || title),
    seoDescription: String(cells.seoDescription || excerpt),
    author: String(cells.author || "Good’Ai"),
    category: String(cells.category || "Blog"),
    publishDate: String(
      cells.publishDate ||
        (entry.publishedAt ? entry.publishedAt.slice(0, 10) : "")
    ),
    coverImage,
    readMinutes,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const baseUrl = getInstaticBaseUrl();
  const endpoint = `${baseUrl}/admin/api/cms/plugins/goodai.content-api/runtime/posts`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["instatic-posts"] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      entries?: Array<InstaticEntry<InstaticPostCells>>;
    };
    if (!Array.isArray(data.entries)) return [];
    return data.entries
      .filter((entry) => Boolean(entry.slug || entry.cells?.slug))
      .map((entry) => normalizePost(entry, baseUrl));
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug);
}
