import ServicesCarousel from "@/components/sections/ServicesCarousel";
import { AutomationDock } from "@/components/ui/AutomationDock";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Studio Lab | Good'Ai Experiments",
  description: "Experimental 3D Services Carousel and Automation Dock.",
};

export default function LabPage() {
  return (
    <main className="min-h-screen py-16 px-4 bg-brand-paper text-brand-ink">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-ink/70 hover:text-brand-coral transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-medium mt-4 tracking-tight">Studio Lab Experiments</h1>
          <p className="text-brand-ink/70 mt-1">
            Dedicated staging area for the 3D WebGL Carousel and the animated Automation Dock.
          </p>
        </div>

        {/* Section 1: The Automation Dock */}
        <section className="mb-20 p-8 rounded-2xl border border-brand-line bg-brand-surface shadow-sm">
          <h2 className="text-xl font-medium mb-2">Automation Dock</h2>
          <p className="text-sm text-brand-ink/60 mb-6">
            Spring magnification interaction.
          </p>
          <div className="flex justify-center py-4">
            <AutomationDock />
          </div>
        </section>

        {/* Section 2: The 3D Carousel */}
        <section className="p-8 rounded-2xl border border-brand-line bg-brand-surface shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-1">3D Services Carousel</h2>
            <p className="text-sm text-brand-ink/60">
              Interactive WebGL rotating cylinder showcase. Drag to rotate or use arrow keys.
            </p>
          </div>
          <div className="w-full flex justify-center overflow-hidden">
            <ServicesCarousel />
          </div>
        </section>
      </div>
    </main>
  );
}

