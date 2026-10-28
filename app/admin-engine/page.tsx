import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MachineDemo } from "@/components/studio/MachineDemo";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

const description = "An illustrative machine: an enquiry goes in one end, a paid job comes out the other. Every station is one admin job Good'Ai automates.";

export const metadata: Metadata = {
  title: "The admin engine",
  description,
  alternates: { canonical: "/admin-engine" },
  openGraph: { ...ogDefaults, title: "The admin engine — Good'Ai", description, url: "/admin-engine" },
  twitter: { ...twitterDefaults, title: "The admin engine — Good'Ai", description },
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
          Your back office,<br />
          <em>on a bench.</em>
        </h1>
        <p>
          Every station on this machine is one admin job we automate: catching the enquiry, booking the job, texting the customer, sending the invoice, chasing the payment and asking for the review. Turn it up, cut it open, then pull the plug and see where it all lands.
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
