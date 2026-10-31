import Link from "next/link";
import { ArrowLeft, ArrowUpRight, PhoneCall } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";
import { SussTheFussCard } from "@/components/studio/SussTheFussCard";

export const metadata = {
  title: "Contact Good'Ai",
  description: "Tell us what’s taking up your afternoons and where to send the fix.",
};

export default function ContactPage() {
  return (
    <main className="min-h-[100dvh] bg-brand-paper text-brand-ink py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Good’Ai
        </Link>

        <div className="mt-6">
          <SussTheFussCard />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-link">
            <PhoneCall size={16} />
            Rather talk? Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </main>
  );
}