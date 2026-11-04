import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const description = post.seoDescription || post.excerpt || `${post.title} — Good'Ai field notes from Perth.`;
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
          <Link key={key++} href={href}>
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

const isRuleLine = (s: string) => /^(-{3,}|\*{3,}|_{3,}|={3,}|─{3,})$/.test(s.trim());
const isTableLine = (s: string) => /^\|.*\|$/.test(s.trim());
const isTableSep = (s: string) => /^\|[\s:-]+(\|[\s:-]+)+\|?$/.test(s.trim());

function normalizeMarkdown(markdown: string, title: string): string[] {
  const cutRecirc = markdown.split(/\nCurated by\[/)[0] ?? markdown;
  const rawLines = cutRecirc
    .replace(/\r\n/g, "\n")
    .replace(/^(?:---|\*\*\*|===+)\s*(#+\s+)/gm, "---\n$1")
    .split("\n");

  // Drop a leading H1 if it duplicates the post title already rendered in the article header
  let skippedTitle = false;
  const out: string[] = [];
  for (const line of rawLines) {
    const t = line.trim();
    if (!skippedTitle && t.startsWith("# ")) {
      const h1Text = t.slice(2).trim().toLowerCase();
      if (h1Text === title.trim().toLowerCase() || out.every((l) => l.trim() === "")) {
        skippedTitle = true;
        continue;
      }
    }
    out.push(line);
  }
  return out;
}

function renderMarkdownBlocks(markdown: string, title: string, fallbackSketch: string): ReactNode[] {
  const lines = normalizeMarkdown(markdown, title);
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

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
        <pre key={key++} className="blog-code">
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
      const useFallback = rawSrc.includes("hostingersite.com");
      const src = useFallback ? fallbackSketch : rawSrc;
      blocks.push(
        <figure key={key++} className="blog-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={imgMatch[1] || "Field note illustration"} loading="lazy" />
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
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
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

  const bodyBlocks = post.body ? renderMarkdownBlocks(post.body, post.title, post.sketchImage) : [];

  return (
    <article className="detail-page shell blog-article">
      <Link href="/blog" className="back-link">
        <ArrowLeft size={17} />
        All field notes
      </Link>

      <header className="blog-article-header">
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

        <div className="blog-article-art" aria-hidden="true">
          <span className="blog-sun-crop" />
          <div className="blog-article-arch">
            <Image
              src={post.sketchImage}
              alt=""
              width={320}
              height={320}
              className="blog-arch-sketch"
            />
          </div>
        </div>
      </header>

      <WavyRule />

      <div className="blog-body">{bodyBlocks}</div>

      <WavyRule />

      <aside className="detail-aside blog-cta">
        <div className="blog-pill-row">
          <span className="blog-pill blog-pill-coral">Field notes</span>
          <span className="blog-pill blog-pill-sage">No waffle</span>
        </div>
        <h2>More notes from the workbench?</h2>
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
