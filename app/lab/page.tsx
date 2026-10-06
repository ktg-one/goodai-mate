import ServicesCarousel from "@/components/sections/ServicesCarousel";
import { TopDock } from "@/components/ui/TopDock";
import { GenerativeTree } from "@/src/shaders/elements/GenerativeTree";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Lab",
  description: "Experimental 3D Services Carousel, ThreeUI Animated Top Dock, and ThreeUI Generative Tree.",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <main className="min-h-[100dvh] py-16 px-4 bg-brand-paper text-brand-ink">
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
            Dedicated staging area for the 3D WebGL Carousel, Animated Top Dock, and ThreeUI Generative Tree.
          </p>
        </div>

        {/* Section 1: ThreeUI Generative Tree */}
        <section className="mb-20 p-8 rounded-2xl border border-brand-line bg-brand-surface shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-1">ThreeUI Generative Tree</h2>
            <p className="text-sm text-brand-ink/60">
              Painterly branching tree growing from warm sienna to golden tips with ambient motes and pointer wind.
            </p>
          </div>
          <div className="w-full h-[550px] rounded-xl overflow-hidden border border-brand-line">
            <GenerativeTree />
          </div>
        </section>

        {/* Section 2: The Animated Top Dock */}
        <section className="mb-20 p-8 rounded-2xl border border-brand-line bg-brand-surface shadow-sm">
          <h2 className="text-xl font-medium mb-2">Animated Top Dock</h2>
          <p className="text-sm text-brand-ink/60 mb-6">
            ThreeUI spring-dock navbar. Move across it with the pointer; focus with Tab.
          </p>
          <div className="w-full h-[220px] rounded-xl overflow-hidden border border-brand-line bg-[#0b0b0c]">
            <TopDock />
          </div>
        </section>

        {/* Section 3: The 3D Carousel */}
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

