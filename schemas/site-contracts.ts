/**
 * Central schemas & invariants for Good'Ai (goodai.au).
 *
 * Agents MUST NOT weaken these schemas without explicit instruction from Kevin.
 * Enforced automatically by `tests/site-contracts.test.ts` during `bun run check`.
 */

export interface BlogPostContract {
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
  /** Real CMS cover image URL, or null when no image is set in Instatic CMS. Never reuse homepage scroll sketches. */
  coverImage: string | null;
  readMinutes: number;
}

export const FORBIDDEN_BLOG_IMAGE_PATTERNS: readonly RegExp[] = [
  /^\/images\/book\//i,
  /^\/images\/scroll\//i,
  /hostingersite\.com/i,
];

export function isValidBlogCoverImage(url: string | null): boolean {
  if (url === null) return true;
  if (typeof url !== "string" || !url.trim()) return false;
  return !FORBIDDEN_BLOG_IMAGE_PATTERNS.some((pattern) => pattern.test(url));
}

export function validateBlogPostContract(post: BlogPostContract): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!post.id) errors.push("post.id is required");
  if (!post.slug) errors.push("post.slug is required");
  if (!post.title) errors.push("post.title is required");
  if (!isValidBlogCoverImage(post.coverImage)) {
    errors.push(`post.coverImage (${String(post.coverImage)}) violates FORBIDDEN_BLOG_IMAGE_PATTERNS`);
  }
  if (typeof post.readMinutes !== "number" || post.readMinutes < 1) {
    errors.push("post.readMinutes must be a positive integer");
  }
  return { ok: errors.length === 0, errors };
}

export interface ChatSessionRequestContract {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface ChatSessionResponseContract {
  ok: boolean;
  model: string;
  reply: string;
}

/**
 * Guardrails for /admin-engine, navigation, and brand copy so agents do not
 * re-introduce rejected labels or verbose boilerplate.
 */
export const SITE_INVARIANTS = {
  /** Navigation label for /blog must be plain "Blog" (not "Field notes" or "Notes"). */
  blogNavLabel: "Blog",
  forbiddenNavLabels: ["Field notes", "Notes"] as const,
  /** Strings that must never appear in lib/stack.ts or public/machine/goodai-machine.html labels. */
  forbiddenMachineStrings: [
    "Arm 01",
    "Arm 02",
    "Arm 03",
    "Arm 04",
    "GCP Sydney",
    "APIs & webhooks",
    "Your existing tools",
    "Opportunity audit",
  ] as const,
} as const;
