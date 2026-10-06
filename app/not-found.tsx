import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="shell not-found">
      <h1>
        This one’s
        <br />
        <em>gone walkabout.</em>
      </h1>
      <p>We couldn’t find that page. Let’s get you back to the useful stuff.</p>
      <Link href="/" className="button">
        Back to Good’Ai
      </Link>
    </section>
  );
}
