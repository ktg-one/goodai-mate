import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InteractiveWorkflowCanvas } from "@/components/ui/InteractiveWorkflowCanvas";
import { VoiceDemo } from "@/components/studio/VoiceDemo";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Voice + automation demo",
  description: "Call the voice agent and watch the automation that follows.",
  alternates: { canonical: "/demo" },
  openGraph: {
    ...ogDefaults,
    title: "Voice + automation demo — Good'Ai",
    description: "Call the voice agent and watch the automation that follows.",
    url: "/demo",
  },
  twitter: {
    ...twitterDefaults,
    title: "Voice + automation demo — Good'Ai",
    description: "Call the voice agent and watch the automation that follows.",
  },
};

export default function DemoPage() {
  return (
    <>
      <div className="shell demo-page-header">
        <Link href="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Good’Ai
        </Link>
        <h1>
          Call the voice agent.<br />
          <em>Watch the automation finish the job.</em>
        </h1>
        <p>
          Start with a live voice conversation, then watch the connected workflow move from trigger to booking, follow-up, and handoff.
        </p>
      </div>

      <div className="full-demo">
        <div className="shell">
          <VoiceDemo />
          <div className="mb-16 mt-16">
            <InteractiveWorkflowCanvas />
          </div>
        </div>
      </div>
    </>
  );
}
