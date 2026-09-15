import Link from "next/link";
import ServicesCarousel from "@/components/sections/ServicesCarousel";
import { AutomationDock } from "@/components/ui/AutomationDock";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Lab & Experiments | Good'Ai",
  description: "Experimental UI components, 3D WebGL carousel, and interactive automation dock.",
};

export default function LabPage() {
  return (
    <div className="min-h-screen bg-brand-navy text-brand-paper">
      {/* Header bar */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between border-b border-brand-paper/15">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-brand-paper/75 hover:text-brand-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Good&apos;Ai
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-brand-coral/40 bg-brand-coral/10 text-brand-coral">
          Lab / Playground
        </span>
      </div>

      {/* Section 1: The Automation Dock */}
      <section className="py-16 px-6 border-b border-brand-paper/15 text-center">
        <div className="max-w-2xl mx-auto mb-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Automation Dock
          </h1>
          <p className="text-sm md:text-base text-brand-paper/70 font-light">
            Interactive dock with fluid magnification physics.
          </p>
        </div>
        <AutomationDock />
      </section>

      {/* Section 2: The 3D Carousel */}
      <section className="relative">
        <div className="text-center pt-12 pb-4">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
            3D Services Carousel
          </h2>
          <p className="text-xs md:text-sm text-brand-paper/60 font-mono">
            WebGL interactive rotating card ring
          </p>
        </div>
        <ServicesCarousel />
      </section>
    </div>
  );
}

