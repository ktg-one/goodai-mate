"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const storySteps = [
    {
        title: "Stuff keeps piling up",
        description: "Follow-ups. Copy-pasting. Chasing people. The same job done twice.",
        image: "bg-brand-coral",
    },
    {
        title: "We sort the handoffs",
        description: "The right task starts when the right thing happens.",
        image: "bg-brand-eucalyptus",
    },
    {
        title: "Knock off early",
        description: "Routine work gets handled. Your team deals with what actually needs a human.",
        image: "bg-brand-paper",
    },
];

export function VisualStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [activeChapter, setActiveChapter] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pin the right side content while scrolling through the steps
            ScrollTrigger.create({
                trigger: triggerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: ".story-visual",
                scrub: true,
            });

            // Animate text sections opacity
            const sections = gsap.utils.toArray<HTMLElement>(".story-text-section");
            sections.forEach((section) => {
                gsap.fromTo(
                    section,
                    { opacity: 0.2, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top center",
                            end: "bottom center",
                            scrub: true,
                        },
                    }
                );
            });

            // Change visual colors based on scroll position - simplified approach
            storySteps.forEach((step, i) => {
                ScrollTrigger.create({
                    trigger: `.story-text-${i}`,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => setActiveChapter(i),
                    onEnterBack: () => setActiveChapter(i),
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="story" className="relative bg-brand-ink text-brand-paper">
            <div ref={triggerRef} className="flex flex-col md:flex-row">
                {/* Left Side: Scrolling Text */}
                <div className="w-full md:w-1/2 py-24 md:py-0">
                    <div className="flex flex-col">
                        {storySteps.map((step, index) => (
                            <div
                                key={index}
                                className={`story-text-section story-text-${index} h-screen flex flex-col justify-center px-8 md:px-20`}
                            >
                                <span className="text-sm font-mono text-brand-coral mb-4">0{index + 1}</span>
                                <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-wide">{step.title}</h3>
                                <p className="text-xl text-brand-paper/75 leading-relaxed max-w-md">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Sticky Visual */}
                <div className="hidden md:flex story-visual w-1/2 h-screen sticky top-0 bg-brand-paper border-l border-brand-ink items-center justify-center overflow-hidden">
                    {/* Chapter Visuals */}
                    <div className="sticky top-0 h-screen w-full flex items-center justify-center p-8">
                        <div className="relative w-full aspect-square overflow-hidden border border-brand-ink shadow-[8px_8px_0_var(--brand-coral)]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeChapter}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute inset-0"
                                >
                                    <div className={cn("h-full w-full", storySteps[activeChapter].image)} />
                                    {/* Overlay Text for context */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <h3 className="text-9xl font-bold text-brand-ink/15 tracking-wide">
                                            0{activeChapter + 1}
                                        </h3>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
