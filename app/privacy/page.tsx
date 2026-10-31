import Link from "next/link";
import type { Metadata } from "next";
import { PRIVACY_EMAIL, PRIVACY_EMAIL_HREF } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";
import { PolicyMeta } from "@/components/studio/PolicyMeta";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy Policy for Good AI under Privacy Act 1988 (Cth) and Australian Privacy Principles.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    ...ogDefaults,
    title: "Privacy — Good'Ai",
    description: "Privacy Policy for Good AI under Privacy Act 1988 (Cth) and Australian Privacy Principles.",
    url: "/privacy",
  },
  twitter: {
    ...twitterDefaults,
    title: "Privacy — Good'Ai",
    description: "Privacy Policy for Good AI under Privacy Act 1988 (Cth) and Australian Privacy Principles.",
  },
};

export default function Privacy() {
  return (
    <article className="shell policy">
      <Link href="/" className="back-link">
        Back to Good’Ai
      </Link>
      <h1>
        Privacy Policy
        <br />
        <em>Handled with care.</em>
      </h1>

      <PolicyMeta
        identifier="PRIV-GAU-2026-V6 (Commercial & APP 8 Edition)"
        effectiveDate="16 October 2026"
        contactLabel="Privacy Desk:"
        email={PRIVACY_EMAIL}
        emailHref={PRIVACY_EMAIL_HREF}
      />

      <hr className="my-6 border-brand-paper/20" />

      <h2>1. Overview</h2>
      <p>
        Good AI respects individual privacy and handles information transparently and responsibly. This Privacy Policy outlines our data collection and handling practices across <code>goodai.au</code>.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We strictly limit data collection on the Site to what is necessary to evaluate business enquiries and demonstrate technology:
      </p>
      <ol className="list-decimal pl-5 space-y-2 my-4">
        <li>
          <strong>Contact Form Inquiries:</strong> When you submit a request through our contact CTA, we collect your:
          <ul className="list-disc pl-5 my-1">
            <li>Full name;</li>
            <li>Business email address;</li>
            <li>Phone number (if supplied);</li>
            <li>Any operational notes entered into the message field.</li>
          </ul>
        </li>
        <li>
          <strong>Interactive Voice Demo Audio:</strong> When you speak with our browser-based voice widget:
          <ul className="list-disc pl-5 my-1">
            <li>Microphone audio is streamed ephemerally to our inference pipelines and our speech synthesis partner, <strong>ElevenLabs, Inc.</strong>;</li>
            <li>Audio streams are converted to transient digital tokens solely to transcribe inputs, generate conversational responses, and stream synthetic speech back to your browser;</li>
            <li><strong>We do not retain voice recordings for biometric profiling, voice cloning, or speaker identification.</strong></li>
          </ul>
        </li>
        <li>
          <strong>Automated Site Telemetry:</strong> Standard server logs, IP addresses, browser types, and interaction timestamps captured via CDN edge nodes.
        </li>
      </ol>

      <h2>3. Purpose of Processing</h2>
      <p>We collect and process information exclusively to:</p>
      <ul className="list-disc pl-5 space-y-1 my-3">
        <li>Evaluate, respond to, and fulfill commercial inquiries submitted via our CTA;</li>
        <li>Stream real-time synthesized voice responses during browser-based demonstrations;</li>
        <li>Maintain platform cybersecurity, block automated bots, and prevent prompt injection or abuse;</li>
        <li>Satisfy statutory obligations under Western Australian and Commonwealth law.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell, rent, broker, or trade contact records or audio inputs to third-party data brokers or marketing lists.
      </p>

      <h2>4. Third-Party Sub-Processors &amp; International Data Transfers (APP 8)</h2>
      <p>
        To host the website, manage inbound emails, and stream voice previews, we utilize commercial cloud sub-processors. Because our operational tools operate on global infrastructure, personal information submitted through the website may transit or be stored on servers located outside Australia (including the United States and global edge locations):
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm border-collapse border border-brand-paper/20">
          <thead>
            <tr className="bg-brand-paper/10 border-b border-brand-paper/20">
              <th className="p-2 border-r border-brand-paper/20">Sub-Processor</th>
              <th className="p-2 border-r border-brand-paper/20">Function</th>
              <th className="p-2 border-r border-brand-paper/20">Data Handled</th>
              <th className="p-2">Hosting &amp; Transit Regions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-brand-paper/20">
              <td className="p-2 border-r border-brand-paper/20 font-medium">ElevenLabs, Inc.</td>
              <td className="p-2 border-r border-brand-paper/20">Real-time speech synthesis &amp; voice agent previews</td>
              <td className="p-2 border-r border-brand-paper/20">Ephemeral voice stream audio, prompt text</td>
              <td className="p-2">United States / Global runtime inference</td>
            </tr>
            <tr className="border-b border-brand-paper/20">
              <td className="p-2 border-r border-brand-paper/20 font-medium">Cloud Hosting &amp; CDN (e.g., Vercel, Cloudflare)</td>
              <td className="p-2 border-r border-brand-paper/20">DNS routing, asset delivery, DDoS mitigation</td>
              <td className="p-2 border-r border-brand-paper/20">Server telemetry, IP address, encrypted payloads</td>
              <td className="p-2">Globally distributed edge networks</td>
            </tr>
            <tr>
              <td className="p-2 border-r border-brand-paper/20 font-medium">Email &amp; Workspace (e.g., Google Workspace, Resend)</td>
              <td className="p-2 border-r border-brand-paper/20">Inbound contact form routing and business email</td>
              <td className="p-2 border-r border-brand-paper/20">Contact form submissions (name, email, notes)</td>
              <td className="p-2">Global commercial cloud infrastructure</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <strong>Cross-Border Disclosure Notice (APP 8.1):</strong> By submitting contact details through our forms or using the interactive voice widget, you acknowledge and consent to your data transiting international cloud infrastructure in accordance with Australian Privacy Principle 8.1.
      </p>

      <h2>5. Data Retention &amp; Security Controls</h2>
      <ul className="list-disc pl-5 space-y-2 my-3">
        <li>
          <strong>Enquiry Records:</strong> Contact form submissions are retained in our operational inbox only for as long as needed to evaluate and conduct commercial discussions, after which they are archived or deleted.
        </li>
        <li>
          <strong>Voice Streams:</strong> Voice demo audio packets are processed in runtime memory and are not stored in permanent databases on our servers.
        </li>
        <li>
          <strong>Security Controls:</strong> We enforce TLS 1.3 encryption across all public routes to protect data in transit.
        </li>
      </ul>

      <h2>6. Your Rights &amp; Access (APPs 12 &amp; 13)</h2>
      <p>
        Under the Australian Privacy Principles, you have the right to request access to the personal records we hold regarding your identity, or request correction or deletion of your contact records. To exercise these rights, submit a written request to our Privacy Desk at <a href={PRIVACY_EMAIL_HREF}>{PRIVACY_EMAIL}</a>. We will acknowledge and respond within 30 business days.
      </p>

      <h2>7. Privacy Contact &amp; Complaints</h2>
      <p>
        For privacy queries or complaints regarding personal data handling, contact:
      </p>
      <p>
        <strong>Good AI Privacy Desk</strong><br />
        <strong>Attention:</strong> Privacy Officer<br />
        <strong>Email:</strong> <a href={PRIVACY_EMAIL_HREF}>{PRIVACY_EMAIL}</a><br />
        <strong>Location:</strong> Perth, Western Australia, Australia
      </p>
      <p className="mt-3">
        If you are unsatisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">oaic.gov.au</a>.
      </p>
    </article>
  );
}
