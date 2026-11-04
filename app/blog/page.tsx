import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/instatic";
import { SURVEY_URL } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export const revalidate = 60;

export const metadata = {
  title: "Blog",
  description: "Practical articles on business automation, voice agents, and systems that save your week — written in Perth by Good'Ai.",
  alternates: { canonical: "/blog" },
  openGraph: {
    ...ogDefaults,
    title: "Blog — Good'Ai",
    description: "Practical articles on business automation, voice agents, and systems that save your week — written in Perth by Good'Ai.",
    url: "/blog",
  },
  twitter: {
    ...twitterDefaults,
    title: "Blog — Good'Ai",
    description: "Practical articles on business automation, voice agents, and systems that save your week — written in Perth by Good'Ai.",
  },
};

function WavyDivider() {
  return (
    <div className="blog-wavy-divider" aria-hidden="true">
      <svg viewBox="0 0 600 28" fill="none" preserveAspectRatio="none">
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

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <article className="detail-page shell blog-page">
      <Link href="/" className="back-link">
        <ArrowLeft size={17} />
        Back to Good’Ai
      </Link>

      <header className="blog-hero">
        <div className="blog-hero-copy">
          <div className="blog-pill-row">
            <span className="blog-pill blog-pill-coral">Blog</span>
            <span className="blog-pill blog-pill-sage">Perth, WA</span>
            <span className="blog-pill">{posts.length} posts</span>
          </div>
          <h1>
            The Good’Ai blog.
            <br />
            <em>We test it first.</em>
          </h1>
          <p className="blog-hero-lead">
            Whenever we build a workflow, test a tool, or find a faster way to sort the boring stuff, we write it down here. Plain English, real numbers, no hype — so you can knock off early.
          </p>
        </div>

        <div className="blog-hero-art" aria-hidden="true">
          <div className="blog-blob blog-blob-1" />
          <div className="blog-blob blog-blob-2" />
          <div className="blog-blob blog-blob-3" />
          <div className="blog-sun-motif" />
          <Image
            src="/images/drawings/arch.svg"
            alt=""
            width={340}
            height={420}
            className="blog-arch-bg"
            unoptimized
          />
          <Image
            src="/images/drawings/branch.svg"
            alt=""
            width={190}
            height={520}
            className="blog-branch-overlay"
            unoptimized
          />
        </div>
      </header>

      <WavyDivider />

      {posts.length === 0 ? (
        <div className="blog-empty">
          <p>We’re writing up our next blog post. Check back shortly.</p>
        </div>
      ) : (
        <>
          {featured && (
            <section className="blog-featured" aria-label="Latest blog post">
              <Link
                href={`/blog/${featured.slug}`}
                className={`blog-featured-card${featured.coverImage ? "" : " blog-featured-card-no-art"}`}
              >
                {featured.coverImage && (
                  <div className="blog-featured-media">
                    <span className="blog-sun-crop" aria-hidden="true" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="blog-card-img"
                      loading="eager"
                    />
                  </div>
                )}
                <div className="blog-featured-body">
                  <div className="blog-pill-row">
                    <span className="blog-pill blog-pill-coral">Latest post</span>
                    <span className="blog-pill blog-pill-sage">{featured.category.toLowerCase()}</span>
                    {featured.publishDate && (
                      <time className="blog-pill" dateTime={featured.publishDate}>
                        {featured.publishDate}
                      </time>
                    )}
                    <span className="blog-pill">{featured.readMinutes} min read</span>
                  </div>
                  <h2>{featured.title}</h2>
                  {featured.excerpt && <p>{featured.excerpt}</p>}
                  <span className="blog-card-link">
                    Read post <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            </section>
          )}

          <div className="blog-grid">
            {rest.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="blog-card">
                <div>
                  {post.coverImage && (
                    <div className="blog-card-art">
                      <span className="blog-card-sun" aria-hidden="true" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="blog-card-img"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="blog-pill-row">
                    <span className="blog-pill blog-pill-sage">{post.category.toLowerCase()}</span>
                    {post.publishDate && (
                      <time className="blog-pill" dateTime={post.publishDate}>
                        {post.publishDate}
                      </time>
                    )}
                    <span className="blog-pill">{post.readMinutes} min</span>
                  </div>
                  <h2>{post.title}</h2>
                  {post.excerpt && <p>{post.excerpt}</p>}
                </div>
                <span className="blog-card-link">
                  Read post <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <WavyDivider />

      <aside className="detail-aside blog-cta">
        <div className="blog-pill-row">
          <span className="blog-pill blog-pill-coral">Stay in the loop</span>
        </div>
        <h2>New posts, straight to your inbox.</h2>
        <p>
          When we find a better way to handle calls, quotes, or Sunday-night paperwork, we send a short email. No waffle, no spam.
        </p>
        <a className="button" href={SURVEY_URL}>
          Subscribe to newsletter
          <ArrowUpRight size={17} />
        </a>
      </aside>
    </article>
  );
}
