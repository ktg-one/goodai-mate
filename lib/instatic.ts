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

const LANGUAGE_TOKENS = [
  "python3",
  "python",
  "bash",
  "sh",
  "zsh",
  "fish",
  "json",
  "yaml",
  "yml",
  "toml",
  "xml",
  "html",
  "css",
  "js",
  "ts",
  "jsx",
  "tsx",
  "go",
  "rs",
  "rb",
  "py",
  "java",
  "kt",
  "swift",
  "php",
  "sql",
  "dockerfile",
  "makefile",
  "nginx",
  "apache",
  "conf",
  "ini",
  "env",
  "txt",
  "md",
  "markdown",
];

const LANGUAGE_PATTERN = new RegExp(`^(?:${LANGUAGE_TOKENS.join("|")})\\s+`, "i");
// Match language token after whitespace (left by removed rule run/fence) or at start
const LANGUAGE_PATTERN_INLINE = new RegExp(`(?:^|\\s)(?:${LANGUAGE_TOKENS.join("|")})\\s+`, "gi");

function cleanExcerptText(raw: string): string {
  let text = raw;

  // Remove fenced code blocks (```...``` or ~~~...~~~) - whole blocks
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/~~~[\s\S]*?~~~/g, "");

  // Remove inline code (`...`)
  text = text.replace(/`[^`]*`/g, "");

  // Remove triple quotes
  text = text.replace(/"""|'''/g, "");

  // Remove rule character runs (3+ of =, -, *, _, ~) anywhere in text
  text = text.replace(/={3,}|-{3,}|\*{3,}|_{3,}|~{3,}/g, "");

  // Remove bare language token when it directly follows a removed rule run,
  // a removed fence, or the start of the text
  // First pass: at start of text
  text = text.replace(LANGUAGE_PATTERN, "");
  // Second pass: inline after whitespace (left by removed rule run/fence)
  text = text.replace(LANGUAGE_PATTERN_INLINE, " ");

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Remove Markdown image syntax whole (including broken forms: ![alt](url), !(url))
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
  text = text.replace(/!\([^)]+\)/g, "");

  // Remove Name(url) link leftovers (e.g., Sitemap(...), Open in app(...))
  text = text.replace(/[A-Za-z][A-Za-z0-9\s]*\(https?:\/\/[^)]+\)/g, "");

  // Remove bare URLs
  text = text.replace(/https?:\/\/[^\s]+/g, "");

  // Remove link markdown (keep link text)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove headings
  text = text.replace(/^#+\s+.*$/gm, "");

  // Remove tables
  text = text.replace(/^\|.*\|$/gm, "");

  // Remove remaining markdown chars
  text = text.replace(/[*_`>#\[\]|]/g, "");

  // Drop a leading ! (from broken image syntax)
  text = text.replace(/^!\s*/, "");

  // Drop a leading byline token •.ktg or .ktg
  text = text.replace(/^•?\.ktg\s*/i, "");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

function buildExcerptFromBody(body: string, title?: string): string {
  let text = body;

  // Strip fenced code blocks whole
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/~~~[\s\S]*?~~~/g, "");

  // Strip headings
  text = text.replace(/^#+\s+.*$/gm, "");

  // Strip rule lines (standalone lines of =, -, *, _, ~)
  text = text.replace(/^={3,}|-{3,}|\*{3,}|_{3,}|~{3,}$/gm, "");

  // Remove triple quotes
  text = text.replace(/"""|'''/g, "");

  // Remove inline code
  text = text.replace(/`[^`]*`/g, "");

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Remove image markdown
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
  text = text.replace(/!\([^)]+\)/g, "");

  // Remove link markdown (keep link text)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove tables
  text = text.replace(/^\|.*\|$/gm, "");

  // Remove remaining markdown chars
  text = text.replace(/[*_`>#\[\]|]/g, "");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Split into lines and filter out unwanted lines
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  const mediumChromePatterns = [
    /^Sitemap/i,
    /^Open in app/i,
    /^Sign up/i,
    /^Sign in/i,
    /^Write$/i,
    /^Listen$/i,
    /^Share$/i,
  ];

  const isImageLine = (line: string) => /^!?\[.*\]\(/.test(line) || /^https?:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)/i.test(line);
  const isBylineLine = (line: string) => /^•?\.ktg\b/i.test(line) || /^by\s+/i.test(line);
  const isTitleLine = (line: string) => title && line.toLowerCase().replace(/[^\w\s]/g, "") === title.toLowerCase().replace(/[^\w\s]/g, "");
  const isMediumChrome = (line: string) => mediumChromePatterns.some((p) => p.test(line));

  const filteredLines = lines.filter(
    (line) => !isImageLine(line) && !isBylineLine(line) && !isTitleLine(line) && !isMediumChrome(line)
  );

  // Rejoin and find first paragraph with at least 8 words
  const rejoined = filteredLines.join("\n");
  const paragraphs = rejoined.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  for (const para of paragraphs) {
    const wordCount = para.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 8) {
      return para;
    }
  }

  // Fallback: return first non-empty paragraph or the whole text
  return paragraphs[0] || rejoined;
}

function shouldRebuildFromBody(original: string, cleaned: string, title?: string): boolean {
  if (original.length === 0) return false;
  const lossRatio = (original.length - cleaned.length) / original.length;
  if (lossRatio > 0.2) return true;
  // Check if ends with ... or … mid-word (not at word boundary)
  if (/\.\.\.$|…$/.test(cleaned)) {
    // Check if the character before the ellipsis is a letter/digit (mid-word)
    const beforeEllipsis = cleaned.slice(0, -1).trimEnd();
    if (beforeEllipsis.length > 0 && /[a-zA-Z0-9]$/.test(beforeEllipsis)) {
      return true;
    }
  }
  // Rebuild if cleaned excerpt is shorter than 60 characters AND something was actually cleaned
  // (avoids rebuilding valid but short CMS excerpts)
  if (lossRatio > 0 && cleaned.length < 60) return true;
  // Rebuild if cleaned excerpt repeats the post title (case-insensitive, ignoring punctuation)
  if (title) {
    const normalizedTitle = title.toLowerCase().replace(/[^\w\s]/g, "");
    const normalizedCleaned = cleaned.toLowerCase().replace(/[^\w\s]/g, "");
    if (normalizedCleaned.includes(normalizedTitle) && normalizedTitle.length > 3) return true;
  }
  // Rebuild if cleaned excerpt starts with a URL, !, or •
  if (/^https?:\/\//.test(cleaned)) return true;
  if (/^!/.test(cleaned)) return true;
  if (/^•/.test(cleaned)) return true;
  return false;
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

function capAtWords(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen - 1).trimEnd();
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    return `${truncated.slice(0, lastSpace)}…`;
  }
  return `${truncated}…`;
}

export function normalizePost(entry: InstaticEntry<InstaticPostCells>, baseUrl: string): BlogPost {
  const cells = entry.cells ?? {};
  const title = String(cells.title || entry.slug || "Untitled");
  const body = String(cells.body || "");
  const rawExcerpt = String(cells.excerpt || cells.seoDescription || body);
  let cleaned = cleanExcerptText(rawExcerpt);

  // Rebuild from body if cleaning lost too much or ends mid-word
  if (shouldRebuildFromBody(rawExcerpt, cleaned, title) && body) {
    const bodyExcerpt = buildExcerptFromBody(body, title);
    cleaned = cleanExcerptText(bodyExcerpt);
  }

  const excerpt = capAtWords(cleaned, 170);
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(2, Math.round(wordCount / 220));
  const coverImage = resolveCmsImageUrl(cells.featuredMedia ?? cells.coverImage, body, baseUrl);

  const seoSource = cells.seoDescription ? String(cells.seoDescription) : excerpt;
  let seoCleaned = cleanExcerptText(seoSource);

  // Rebuild seoDescription from body if needed
  if (shouldRebuildFromBody(seoSource, seoCleaned, title) && body) {
    const bodyExcerpt = buildExcerptFromBody(body, title);
    seoCleaned = cleanExcerptText(bodyExcerpt);
  }

  const seoDescription = capAtWords(seoCleaned, 155);

  return {
    id: entry.id,
    slug: String(entry.slug || cells.slug || ""),
    title,
    body,
    excerpt,
    seoTitle: String(cells.seoTitle || title),
    seoDescription,
    author: String(cells.author || "Good'Ai"),
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
