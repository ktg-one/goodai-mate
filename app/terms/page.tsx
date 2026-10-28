import Link from "next/link";
import type { Metadata } from "next";
import { POLICY_EMAIL, POLICY_EMAIL_HREF } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";
import { PolicyMeta } from "@/components/studio/PolicyMeta";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of Use for Good AI under Western Australian and Commonwealth law.",
  alternates: { canonical: "/terms" },
  openGraph: {
    ...ogDefaults,
    title: "Terms — Good'Ai",
    description: "Terms of Use for Good AI under Western Australian and Commonwealth law.",
    url: "/terms",
  },
  twitter: {
    ...twitterDefaults,
    title: "Terms — Good'Ai",
    description: "Terms of Use for Good AI under Western Australian and Commonwealth law.",
  },
};

export default function Terms() {
  return (
    <article className="shell policy">
      <Link href="/" className="back-link">
        Back to Good’Ai
      </Link>
      <h1>
        Terms of Use
        <br />
        <em>Clear from the start.</em>
      </h1>

      <PolicyMeta
        identifier="TOU-GAU-2026-V6 (Commercial AI Edition)"
        effectiveDate="16 October 2026"
        contactLabel="Legal Enquiries & Notices:"
        email={POLICY_EMAIL}
        emailHref={POLICY_EMAIL_HREF}
      />

      <hr className="my-6 border-brand-paper/20" />

      <h2>1. Acceptance of Terms</h2>
      <p>
        1.1 By accessing or interacting with this Site—including viewing visual animations, engaging with interactive voice agents, or submitting contact forms—you (&quot;User&quot; or &quot;you&quot;) agree to be bound by these Terms of Use and our <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <p>
        1.2 If you do not agree to these terms, you must cease using this Site immediately.
      </p>
      <p>
        1.3 If you access the Site on behalf of an organisation or business entity, you warrant that you hold actual legal authority to bind that entity to these Terms.
      </p>

      <h2>2. Nature of the Site &amp; Informational Disclaimer</h2>
      <p>
        2.1 This Site is published solely for general marketing, informational, and technical demonstration purposes regarding artificial intelligence, speech synthesis, and applied software automation.
      </p>
      <p>
        2.2 <strong>No Professional or Engineering Advice:</strong> Material, interactive audio responses, technical descriptions, and demonstrations displayed on the Site do not constitute formal technical, commercial, engineering, financial, or legal advice.
      </p>
      <p>
        2.3 <strong>No Client Relationship:</strong> Interacting with this Site or transmitting data via forms or voice interfaces does not create an advisory, agency, employment, or fiduciary relationship with Good AI. Commercial engagements require an executed Master Services Agreement (MSA) or Statement of Work (SOW).
      </p>

      <h2>3. Voice Agents &amp; Interactive Demonstrations</h2>
      <p>
        3.1 <strong>Stochastic &amp; Probabilistic Character:</strong> The Site features automated voice interfaces, conversational agents, and generative demonstrations powered by speech synthesis technologies. You acknowledge that AI systems produce non-deterministic, probabilistic responses that may contain factual inaccuracies, hallucinations, latency delays, or audio synthesis artifacts.
      </p>
      <p>
        3.2 <strong>Zero Production Warranties:</strong> Demonstrations are provided strictly for illustrative evaluation. We make no warranty that voice or agent configurations demonstrated on the Site are ready for production deployment without independent verification and human oversight.
      </p>
      <p>
        3.3 <strong>Prohibited Audio Content:</strong> You agree not to upload, speak, transmit, or inject into any voice widget or form:
      </p>
      <ul>
        <li>Unencrypted personal identifying information (PII), health records, or financial account details;</li>
        <li>Defamatory, abusive, obscene, harassing, or unlawfully recorded audio;</li>
        <li>Automated voice spoofing, synthetic scraping payloads, or prompt-injection attempts.</li>
      </ul>

      <h2>4. Intellectual Property &amp; Site Integrity</h2>
      <p>
        4.1 <strong>Proprietary Assets:</strong> All software code, GSAP scripts, UI layout, animations, trade dress, vector graphics, prompt architectures, audio prompts, software connectors, logos, and written content (&quot;Materials&quot;) are the exclusive intellectual property of Good AI or its licensors, protected under the <em>Copyright Act 1968</em> (Cth) and international treaties.
      </p>
      <p>
        4.2 <strong>Limited License:</strong> We grant you a revocable, non-exclusive, non-transferable licence to view and listen to Site Materials for personal or internal business evaluation.
      </p>
      <p>
        4.3 <strong>Restrictions:</strong> You must not, without prior written approval from Good AI:
      </p>
      <ul>
        <li>Decompile, extract, capture, reverse-engineer, or sniff underlying API endpoints, voice models, or GSAP codebases;</li>
        <li>Deploy web scrapers, bots, automated scripts, or audio collectors to siphon training data, prompt flows, or media assets;</li>
        <li>Frame, mirror, republish, or white-label any portion of <code>goodai.au</code> on an external domain.</li>
      </ul>

      <h2>5. Australian Consumer Law (ACL) &amp; Statutory Guarantees</h2>
      <p>
        5.1 Nothing in these Terms excludes, limits, or modifies any consumer guarantee, statutory right, or remedy provided under Schedule 2 of the <em>Competition and Consumer Act 2010</em> (Cth) (the Australian Consumer Law) that cannot lawfully be excluded.
      </p>
      <p>
        5.2 To the maximum extent permitted by law, our liability for failure to comply with an applicable statutory guarantee is limited, at our election, to:
      </p>
      <ul>
        <li>The resupply of the digital services or information; or</li>
        <li>The payment of the reasonable cost of having those services resupplied.</li>
      </ul>

      <h2>6. Limitation of Liability</h2>
      <p>
        6.1 To the extent permitted by Western Australian and Commonwealth law, Good AI, its founders, directors, employees, and contractors shall not be liable for any direct, indirect, incidental, special, or consequential damages (including loss of revenue, business interruption, system outages, data corruption, or reliance losses) resulting from:
      </p>
      <ul>
        <li>Your interaction with, or inability to access, the Site or its interactive audio widgets;</li>
        <li>Erroneous, incomplete, or defamatory statements generated in real time by automated voice models;</li>
        <li>Third-party cyber events, server interruptions, or network failures.</li>
      </ul>

      <h2>7. Third-Party Infrastructure &amp; Voice Endpoints</h2>
      <p>
        The Site relies on third-party cloud hosting, content delivery networks (CDNs), web animation libraries, and external inference endpoints (including <strong>ElevenLabs, Inc.</strong> for speech synthesis and voice streaming). We do not warrant the continuous uptime, latency benchmarks, or uninterrupted availability of third-party APIs, and disclaim legal liability for disruptions, model shifts, or service terminations originating beyond our direct control.
      </p>

      <h2>8. Governing Law &amp; Jurisdiction</h2>
      <p>
        8.1 These Terms are governed exclusively by the laws in force in the <strong>State of Western Australia</strong>.
      </p>
      <p>
        8.2 The parties submit to the non-exclusive jurisdiction of the Supreme Court of Western Australia and the Federal Court of Australia (sitting in Perth) for any dispute arising out of these Terms or Site use.
      </p>

      <h2>9. Legal Notices &amp; Communications</h2>
      <p>
        All formal notices, copyright infringement claims, licensing inquiries, or legal communications regarding these Terms must be delivered in writing to:
      </p>
      <p>
        <strong>Entity:</strong> Good AI<br />
        <strong>Attention:</strong> Legal &amp; Policy Operations<br />
        <strong>Email:</strong> <a href={POLICY_EMAIL_HREF}>{POLICY_EMAIL}</a><br />
        <strong>Location:</strong> Perth, Western Australia
      </p>
    </article>
  );
}
