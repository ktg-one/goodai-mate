import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/instatic";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export const revalidate = 60;

export const metadata = {
  title: "Field notes",
  description: "Essays, research notes and practical field reports from Good'Ai.",
  alternates: { canonical: "/blog" },
  openGraph: {
    ...ogDefaults,
    title: "Field notes",
    description: "Essays, research notes and practical field reports from Good'Ai.",
    url: "/blog",
  },
  twitter: {
    ...twitterDefaults,
    title: "Field notes",
    description: "Essays, research notes and practical field reports from Good'Ai.",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <article className="detail-page shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={17} />
        Back to home
      </Link>
      <div>
        <h1>
          Field notes
          <span className="brand-period">.</span>
        </h1>
        <p className="detail-lead">
          Practical research, reliability audits and field notes from building real systems.
        </p>
      </div>
      <div className="detail-inclusions">
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="back-link">
                <span>
                  <strong>{post.title}</strong> — {post.excerpt}
                </span>
                <ArrowUpRight size={18} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
