import Link from "next/link";
import type { Metadata } from "next";
import { LEAD_EMAIL, LEAD_EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Good'Ai handles enquiry and demo information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    ...ogDefaults,
    title: "Privacy — Good'Ai",
    description: "How Good'Ai handles enquiry and demo information.",
    url: "/privacy",
  },
  twitter: {
    ...twitterDefaults,
    title: "Privacy — Good'Ai",
    description: "How Good'Ai handles enquiry and demo information.",
  },
};

export default function Privacy() {
  return (
    <article className="shell policy">
      <Link href="/" className="back-link">
        Back to Good’Ai
      </Link>
      <h1>
        Your information.
        <br />
        <em>Handled with care.</em>
      </h1>
      <p>
        This notice covers the goodai.au marketing site operated by Good’Ai
        (Perth, Australia). It describes what we collect on this site and why.
      </p>
      <p className="text-sm opacity-70">Last updated: 6 October 2026</p>

      <h2>Business enquiries</h2>
      <p>
        The contact form collects a phone or email, optional headache tags, and
        an optional note. We use that only to understand and reply to your
        enquiry. Do not send passwords, payment details, or sensitive client
        records through the form.
      </p>
      <p>
        Submissions are emailed to our team via <strong>Resend</strong> (email
        delivery provider) to <a href={LEAD_EMAIL_HREF}>{LEAD_EMAIL}</a>. Resend
        processes the message content to deliver it. We keep enquiry mail in the
        ordinary course of business email.
      </p>

      <h2>Voice demo</h2>
      <p>
        Optional browser voice demos use <strong>Trillet AI</strong> to run a
        short-lived voice session. Audio (and any transcript the service
        produces) is processed by Trillet and its model providers for the call.
        You choose when to start and end the call. Do not share confidential
        client data in a demo call.
      </p>
      <p>
        You can also ring the business / demo line on{" "}
        <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
      </p>

      <h2>Workflow demos</h2>
      <p>
        On-page workflow examples use illustrative sample data in your browser.
        They are not a live view of any client system.
      </p>

      <h2>Site delivery</h2>
      <p>
        Hosting and delivery services (for example the platform that serves this
        site) may process technical request data such as IP address, user agent,
        and timestamps needed to deliver pages and protect against abuse. We use
        privacy-friendly Vercel Analytics without cookies to understand site
        usage. This site does not add third-party advertising scripts.
      </p>

      <h2>Questions or requests</h2>
      <p>
        Contact <a href={LEAD_EMAIL_HREF}>{LEAD_EMAIL}</a> about your
        information, access or correction, or a privacy concern.
      </p>
    </article>
  );
}
