import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MachineDemo } from "@/components/studio/MachineDemo";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

const description =
  "The Good'Ai machine — a 3D depiction of our process, from incoming call to finished work.";

export const metadata: Metadata = {
  title: "The Good'Ai machine",
  description,
  alternates: { canonical: "/admin-engine" },
  openGraph: { ...ogDefaults, title: "The Good'Ai machine — Good'Ai", description, url: "/admin-engine" },
  twitter: { ...twitterDefaults, title: "The Good'Ai machine — Good'Ai", description },
};

export default function AdminEnginePage() {
  return (
    <>
      <div className="shell demo-page-header">
        <Link href="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Good’Ai
        </Link>
        <h1>The Good’Ai machine.</h1>
        <p>A depiction of our process.</p>
      </div>
      <div className="full-demo">
        <div className="shell">
          <MachineDemo />
        </div>
      </div>
    </>
  );
}
