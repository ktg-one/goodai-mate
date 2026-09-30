import Link from "next/link";
import { ArrowLeft, ArrowUpRight, PhoneCall } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";
import { SussTheFussCard } from "@/components/studio/SussTheFussCard";

export const metadata = {
  title: "Contact Good'Ai",
  description: "Start with the messy bit so we can find the bottleneck.",
};

export default function ContactPage() {
  return (
    <main className="min-h-[100dvh] bg-brand-paper text-brand-ink py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Good’Ai
        </Link>

        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Start with the messy bit.
            <br />
            <em>We’ll find the bottleneck.</em>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-brand-ink/70 leading-relaxed">
            Tell us what gets copied, chased, or done twice. If the problem is fuzzy,
            that’s fine. The form is for sorting the shape of it before we talk tools.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-link">
              <PhoneCall size={16} />
              Call {PHONE_DISPLAY}
            </a>
            <Link href="/demo" className="inline-flex items-center gap-2 text-link">
              See the voice + automation demo <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <SussTheFussCard />
        </div>
      </div>
    </main>
  );
}