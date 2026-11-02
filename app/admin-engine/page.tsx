import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MachineDemo } from "@/components/studio/MachineDemo";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

const description =
  "The Good'Ai machine: an interactive 3D analogy for how we run your admin. A job moves from first phone call on the left to finished work in the till on the right, with openable layers showing our services, stack (OpenAI, Gemini, xAI, ElevenLabs, n8n, Google Cloud Sydney), and human-first policy.";

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
          The Good’Ai machine:<br />
          <em>an analogy for how we run your admin.</em>
        </h1>
        <p>
          No, we don’t build conveyor belts — we just wanted to put a really cool 3D render on the site to show that we can, and this is our excuse. Think of the machine as a diagram of what Good’Ai sets up behind the scenes: the belt is a single job moving from the first phone call on the left to finished work in the till on the right, and each arm above it is one of our services. Hit <strong>Labels</strong> for what we do, <strong>Cut away</strong> for the stack we build with, <strong>Explode</strong> for our human-first policy, or <strong>Pull the plug</strong> to see what happens when every job lands back on you.
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
