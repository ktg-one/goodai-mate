import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InteractiveWorkflowCanvas } from "@/components/ui/InteractiveWorkflowCanvas";
import { VoiceDemo } from "@/components/studio/VoiceDemo";

export const metadata = {
  title: "See it in action",
  description: "Interactive demonstrations of real-world AI automations and voice agents.",
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
          Less busywork.<br />
          <em>See how it feels.</em>
        </h1>
        <p>
          Choose a scenario below and watch how an automated workflow moves from customer trigger to resolution. Includes audio feedback and realistic timing.
        </p>
      </div>

      <div className="full-demo">
        <div className="shell">
          <div className="mb-16">
            <InteractiveWorkflowCanvas />
          </div>
          <VoiceDemo />
        </div>
      </div>
    </>
  );
}


