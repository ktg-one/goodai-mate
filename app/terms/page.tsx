import Link from "next/link";
import type { Metadata } from "next";
import { LEAD_EMAIL, LEAD_EMAIL_HREF } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms",
  description: "How Good'Ai talks about services on this site.",
  alternates: { canonical: "/terms" },
  openGraph: {
    ...ogDefaults,
    title: "Terms — Good'Ai",
    description: "How Good'Ai talks about services on this site.",
    url: "/terms",
  },
  twitter: {
    ...twitterDefaults,
    title: "Terms — Good'Ai",
    description: "How Good'Ai talks about services on this site.",
  },
};

export default function Terms() {
  return (
    <article className="shell policy">
      <Link href="/" className="back-link">
        Back to Good’Ai
      </Link>
      <h1>
        Clear from
        <br />
        <em>the start.</em>
      </h1>
      <p>
        This site is the Good’Ai marketing site. It does not take payments or
        form a service agreement by itself. A written quote and acceptance come
        before any paid work.
      </p>
      <p className="text-sm opacity-70">Last updated: 6 October 2026</p>

      <h2>Services</h2>
      <p>
        Service pages describe the kinds of work we do: voice agents, automation,
        assistants, integrations, and opportunity reviews. Scope, inclusions,
        third-party costs and ongoing charges are agreed in writing before a
        project begins. We do not publish a public price list on this site.
      </p>

      <h2>Demonstrations</h2>
      <p>
        Workflow and voice demonstrations use illustrative or demo behaviour.
        They are not a live view of client operations and are not a promise of
        specific savings, uptime, or outcomes. AI outputs can be wrong; review
        and human hand-off need to be agreed for each implementation.
      </p>

      <h2>Before engaging</h2>
      <p>
        The service agreement for a project will set out payment,
        responsibilities, support, intellectual property and cancellation terms.
        Until that is signed, nothing on this site creates those obligations.
      </p>

      <h2>Get in touch</h2>
      <p>
        For service questions, contact{" "}
        <a href={LEAD_EMAIL_HREF}>{LEAD_EMAIL}</a>. Read the{" "}
        <Link href="/privacy">privacy notice</Link> for how enquiry and demo
        data is handled.
      </p>
    </article>
  );
}
