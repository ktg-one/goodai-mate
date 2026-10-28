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
  featuredMedia?: string | null;
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
}

const DEFAULT_INSTATIC_URL = "https://ktg-nas.blowfish-snares.ts.net";

export function getInstaticBaseUrl(): string {
  const raw =
    process.env.INSTATIC_URL ||
    process.env.NEXT_PUBLIC_INSTATIC_URL ||
    DEFAULT_INSTATIC_URL;
  return raw.replace(/\/+$/, "");
}

function normalizePost(entry: InstaticEntry<InstaticPostCells>): BlogPost {
  const cells = entry.cells ?? {};
  const title = String(cells.title || entry.slug || "Untitled");
  const body = String(cells.body || "");
  const excerpt = String(
    cells.excerpt ||
      cells.seoDescription ||
      body.replace(/^#+\s+.*$/gm, "").replace(/[*_`>#\[\]]/g, "").trim().slice(0, 180)
  );
  return {
    id: entry.id,
    slug: String(entry.slug || cells.slug || ""),
    title,
    body,
    excerpt,
    seoTitle: String(cells.seoTitle || title),
    seoDescription: String(cells.seoDescription || excerpt),
    author: String(cells.author || "Good’Ai"),
    category: String(cells.category || "Field Notes"),
    publishDate: String(
      cells.publishDate ||
        (entry.publishedAt ? entry.publishedAt.slice(0, 10) : "")
    ),
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
      .map(normalizePost);
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
