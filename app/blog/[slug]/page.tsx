import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/instatic";
import { SURVEY_URL } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const description = post.seoDescription || post.excerpt || `${post.title} — Good'Ai blog from Perth.`;
  return {
    title: post.seoTitle || post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      ...ogDefaults,
      title: `${post.seoTitle || post.title} — Good'Ai`,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
    },
    twitter: {
      ...twitterDefaults,
      title: `${post.seoTitle || post.title} — Good'Ai`,
      description,
    },
  };
}

function WavyRule() {
  return (
    <div className="blog-wavy-divider blog-hr" role="separator">
      <svg viewBox="0 0 600 28" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 8 C 75 2, 150 15, 225 8 C 300 1, 375 15, 450 8 C 525 1, 565 13, 600 7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M0 16 C 80 22, 160 9, 240 16 C 320 23, 400 10, 480 16 C 540 21, 575 12, 600 15"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="wave-accent"
        />
        <path
          d="M40 23 C 130 18, 210 26, 300 22 C 390 18, 470 25, 560 21"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}

function renderInline(text: string): ReactNode[] {
  const cleaned = text.replace(/\\\*/g, "*");
  const nodes: ReactNode[] = [];
  const tokenRe = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRe.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(cleaned.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      nodes.push(<strong key={key++}>{match[2].trim()}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(<em key={key++}>{match[3].trim()}</em>);
    } else if (match[4] !== undefined) {
      nodes.push(<code key={key++}>{match[4]}</code>);
    } else if (match[5] !== undefined && match[6] !== undefined) {
      const href = match[6];
      if (href.startsWith("http://") || href.startsWith("https://")) {
        nodes.push(
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer">
            {match[5]}
          </a>,
        );
      } else {
        nodes.push(
          <Link key={key++} href={href || "/contact"}>
            {match[5]}
          </Link>,
        );
      }
    }
    lastIndex = tokenRe.lastIndex;
  }

  if (lastIndex < cleaned.length) {
    nodes.push(cleaned.slice(lastIndex));
  }
  return nodes;
}

function normalizeRawMarkdown(raw: string, postTitle: string): string {
  let text = raw.replace(/\r\n/g, "\n");
  text = text.replace(/\n*={3,}\s*Curated by[\s\S]*$/i, "");
  text = text.replace(/([-=*]{3,})(#{1,4}\s+)/g, "$1\n\n$2");
  const lines = text.split("\n");
  if (lines.length > 0 && lines[0].trim().replace(/^#+\s*/, "").toLowerCase() === postTitle.trim().toLowerCase()) {
    lines.shift();
  }
  return lines.join("\n").trim();
}

function isRuleLine(trimmed: string): boolean {
  return /^(?:[-*_]\s*){3,}$/.test(trimmed) || /^={3,}$/.test(trimmed);
}

function isTableLine(trimmed: string): boolean {
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length >= 3;
}

function isTableSep(trimmed: string): boolean {
  return /^\|[\s:|-]+\|$/.test(trimmed);
}

function renderMarkdownBlocks(markdown: string, postTitle: string): ReactNode[] {
  const normalized = normalizeRawMarkdown(markdown, postTitle);
  const lines = normalized.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push(
        <pre key={key++}>
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (isRuleLine(trimmed)) {
      blocks.push(<WavyRule key={key++} />);
      i++;
      continue;
    }

    if (isTableLine(trimmed)) {
      const tableRows: string[][] = [];
      while (i < lines.length && isTableLine(lines[i].trim())) {
        const rowLine = lines[i].trim();
        if (!isTableSep(rowLine)) {
          const cells = rowLine
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim());
          tableRows.push(cells);
        }
        i++;
      }
      if (tableRows.length > 0) {
        const [head, ...body] = tableRows;
        blocks.push(
          <div key={key++} className="blog-table-wrap">
            <table className="blog-table">
              {head && (
                <thead>
                  <tr>
                    {head.map((cell) => (
                      <th key={`th-${cell}`}>{renderInline(cell)}</th>
                    ))}
                  </tr>
                </thead>
              )}
              {body.length > 0 && (
                <tbody>
                  {body.map((row) => (
                    <tr key={`tr-${row.join("|")}`}>
                      {row.map((cell) => (
                        <td key={`td-${row[0]}-${cell}`}>{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>,
        );
      }
      continue;
    }

    const imgMatch = /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)$/.exec(trimmed);
    if (imgMatch) {
      const rawSrc = imgMatch[2];
      if (rawSrc.includes("hostingersite.com")) {
        i++;
        continue;
      }
      blocks.push(
        <figure key={key++} className="blog-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rawSrc} alt={imgMatch[1] || "Blog illustration"} loading="lazy" />
          {imgMatch[1] && <figcaption>{imgMatch[1]}</figcaption>}
        </figure>,
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      blocks.push(<h4 key={key++}>{renderInline(trimmed.slice(5))}</h4>);
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push(<h3 key={key++}>{renderInline(trimmed.slice(4))}</h3>);
      i++;
      continue;
    }
    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      const text = trimmed.startsWith("## ") ? trimmed.slice(3) : trimmed.slice(2);
      blocks.push(<h2 key={key++}>{renderInline(text)}</h2>);
      i++;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(<blockquote key={key++}>{renderInline(quoteLines.join(" "))}</blockquote>);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((item) => (
            <li key={`ul-${item}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((item) => (
            <li key={`ol-${item}`}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(">") &&
      !isTableLine(lines[i].trim()) &&
      !isRuleLine(lines[i].trim()) &&
      !/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)$/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(trimmed) &&
      !/^\d+\.\s+/.test(trimmed)
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push(<p key={key++}>{renderInline(paraLines.join(" "))}</p>);
    } else {
      i++;
    }
  }

  return blocks;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const bodyBlocks = post.body ? renderMarkdownBlocks(post.body, post.title) : [];

  return (
    <article className="detail-page shell blog-article">
      <Link href="/blog" className="back-link">
        <ArrowLeft size={17} />
        All blog posts
      </Link>

      <header className={`blog-article-header${post.coverImage ? "" : " blog-article-header-no-art"}`}>
        <div>
          <div className="blog-pill-row">
            <span className="blog-pill blog-pill-coral">{post.category.toLowerCase()}</span>
            {post.publishDate && (
              <time className="blog-pill" dateTime={post.publishDate}>
                {post.publishDate}
              </time>
            )}
            <span className="blog-pill blog-pill-sage">{post.readMinutes} min read</span>
          </div>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="detail-lead blog-lead">{post.excerpt}</p>}
        </div>

        {post.coverImage && (
          <div className="blog-article-art">
            <span className="blog-sun-crop" aria-hidden="true" />
            <div className="blog-article-arch">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="blog-arch-sketch"
              />
            </div>
          </div>
        )}
      </header>

      <WavyRule />

      <div className="blog-body">{bodyBlocks}</div>

      <WavyRule />

      <aside className="detail-aside blog-cta">
        <div className="blog-pill-row">
          <span className="blog-pill blog-pill-coral">Blog</span>
          <span className="blog-pill blog-pill-sage">No waffle</span>
        </div>
        <h2>More posts from the workbench?</h2>
        <p>
          Whenever we find a simpler way to sort the boring stuff and knock off early, we write it up. Straight to your inbox, never any spam.
        </p>
        <a className="button" href={SURVEY_URL}>
          Subscribe to newsletter
          <ArrowUpRight size={17} />
        </a>
      </aside>
    </article>
  );
}
