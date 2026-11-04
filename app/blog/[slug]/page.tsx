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

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokenRe = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      nodes.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(<em key={key++}>{match[3]}</em>);
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

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

function renderMarkdownBlocks(markdown: string): ReactNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
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

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push(<hr key={key++} className="blog-hr" />);
      i++;
      continue;
    }

    const imgMatch = /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)$/.exec(trimmed);
    if (imgMatch) {
      blocks.push(
        <figure key={key++} className="blog-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgMatch[2]} alt={imgMatch[1] || "Article illustration"} loading="lazy" />
          {imgMatch[1] && <figcaption>{imgMatch[1]}</figcaption>}
        </figure>,
      );
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
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
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
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
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
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
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

  const bodyBlocks = post.body ? renderMarkdownBlocks(post.body) : [];

  return (
    <article className="detail-page shell blog-article">
      <Link href="/blog" className="back-link">
        <ArrowLeft size={17} />
        All field notes
      </Link>

      <header className="blog-article-header">
        <div className="blog-card-meta">
          <span className="step-number">{post.category || "Field note"}</span>
          {post.publishDate && <time dateTime={post.publishDate}>{post.publishDate}</time>}
        </div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="detail-lead blog-lead">{post.excerpt}</p>}
      </header>

      <div className="blog-body">{bodyBlocks}</div>

      <aside className="detail-aside blog-cta">
        <p className="step-number">More field notes like this?</p>
        <h2>Practical notes from the workbench.</h2>
        <p>Get straight-talking field reports on what actually works in business AI — no spam, no hype.</p>
        <a className="button" href={SURVEY_URL}>
          Subscribe to newsletter
          <ArrowUpRight size={17} />
        </a>
      </aside>
    </article>
  );
}
