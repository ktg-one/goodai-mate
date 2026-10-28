import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/instatic";
import { SURVEY_URL } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  const path = post ? `/blog/${post.slug}` : "/blog";
  const title = post?.seoTitle ?? "Post not found";
  const description = post?.seoDescription;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: path,
    },
    twitter: {
      ...twitterDefaults,
      title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  // Key each paragraph by its text; a repeated paragraph gets its occurrence count.
  const seen = new Map<string, number>();
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((text) => {
      const count = (seen.get(text) ?? 0) + 1;
      seen.set(text, count);
      return { text, key: count > 1 ? `${text}#${count}` : text };
    });

  return (
    <article className="detail-page shell">
      <Link href="/blog" className="back-link">
        <ArrowLeft size={17} />
        All field notes
      </Link>
      <div className="detail-grid">
        <div>
          <h1>
            {post.title}
            <span className="brand-period">.</span>
          </h1>
          <p className="detail-lead">
            {[post.category, post.publishDate, post.author].filter(Boolean).join(" · ")}
          </p>
          {paragraphs.map(({ text, key }) => (
            <p key={key} className="detail-body">
              {text.replace(/^#+\s+/, "")}
            </p>
          ))}
        </div>
        <aside className="detail-aside">
          <h2>Need help with a system?</h2>
          <p>We scope voice agents, workflows and reliability audits around your business.</p>
          <Link href={SURVEY_URL} className="button">
            Tell us what you need <ArrowUpRight size={20} />
          </Link>
        </aside>
      </div>
    </article>
  );
}
