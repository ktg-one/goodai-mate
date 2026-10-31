import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MachineDemo } from "@/components/studio/MachineDemo";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

const description =
  "What's under Good'Ai's hood: an illustrative machine where the four arms represent our four build services, driven by an opportunity audit cam shaft, and each button opens up our ethics, underlying architecture, voices, and hosting.";

export const metadata: Metadata = {
  title: "Under the hood",
  description,
  alternates: { canonical: "/admin-engine" },
  openGraph: { ...ogDefaults, title: "Under the hood — Good'Ai", description, url: "/admin-engine" },
  twitter: { ...twitterDefaults, title: "Under the hood — Good'Ai", description },
};

export default function AdminEnginePage() {
  return (
    <>
      <div className="shell demo-page-header">
        <Link href="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Good’Ai
        </Link>
        <h1>
          What’s under<br />
          <em>our hood.</em>
        </h1>
        <p>
          This machine is Good’Ai. The four arms are our four build services — voice agents, business automation, custom assistants, and tool integrations — driven by the cam shaft underneath (our opportunity audit) and checked at the end by a human on your team. Press any button on the machine to open our services, ethics, underlying architecture, voices, and where it runs.
        </p>
      </div>
      <div className="full-demo">
        <div className="shell">
          <MachineDemo />
        </div>
      </div>
    </>
  );
}
