"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const storySteps = [
    {
        title: "Stuff keeps piling up",
        description: "Follow-ups. Copy-pasting. Chasing people. The same job done twice.",
        image: "bg-brand-coral",
    },
    {
        title: "Palm it off",
        description: "Admin, bookings, phone calls, socials, anything digital.",
        image: "bg-brand-eucalyptus",
    },
    {
        title: "Knock off early",
        description: "Give us the shitty jobs",
        image: "bg-brand-paper",
    },
];

export function VisualStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);
    const [activeChapter, setActiveChapter] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    const renderedStorySteps = useMemo(() => {
        return storySteps.map((step, index) => (
            <div
                key={step.title}
                className={`story-text-section story-text-${index} min-h-[100dvh] flex flex-col justify-center px-8 md:px-20`}
            >
                <span className="text-sm font-mono text-brand-coral mb-4">0{index + 1}</span>
                <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-wide">{step.title}</h3>
                <p className="text-xl text-brand-paper/75 leading-relaxed max-w-md">
                    {step.description}
                </p>
            </div>
        ));
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                // If user prefers reduced motion, set text sections full opacity and omit pinning
                const sections = gsap.utils.toArray<HTMLElement>(".story-text-section", containerRef.current);
                sections.forEach((section) => {
                    gsap.set(section, { opacity: 1, y: 0 });
                });
                return;
            }

            // Pin the right side content while scrolling through the steps
            ScrollTrigger.create({
                trigger: triggerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: visualRef.current,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            });

            // Animate text sections opacity
            const sections = gsap.utils.toArray<HTMLElement>(".story-text-section", containerRef.current);
            sections.forEach((section) => {
                gsap.fromTo(
                    section,
                    { opacity: 0.2, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 82%",
                            end: "top 34%",
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            });

            // Change visual colors based on scroll position - simplified approach
            sections.forEach((section, i) => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 70%",
                    end: "bottom 35%",
                    onEnter: () => setActiveChapter(i),
                    onEnterBack: () => setActiveChapter(i),
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return (
        <section ref={containerRef} id="story" className="relative bg-brand-ink text-brand-paper">
            <div ref={triggerRef} className="flex flex-col md:flex-row">
                {/* Left Side: Scrolling Text */}
                <div className="w-full md:w-1/2 py-24 md:py-0">
                    <div className="flex flex-col">
                        {renderedStorySteps}
                    </div>
                </div>

                {/* Right Side: Sticky Visual */}
                <div ref={visualRef} className="hidden md:flex story-visual w-1/2 h-[100dvh] min-h-[100dvh] sticky top-0 bg-brand-paper border-l border-brand-ink items-center justify-center overflow-hidden">
                    {/* Chapter Visuals */}
                    <div className="sticky top-0 h-[100dvh] min-h-[100dvh] w-full flex items-center justify-center p-8">
                        <m.div
                            whileHover={prefersReducedMotion ? undefined : { scale: 1.02, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }}
                            whileTap={prefersReducedMotion ? undefined : { scale: 0.98, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }}
                            className="relative w-full aspect-square overflow-hidden border border-brand-ink shadow-[8px_8px_0_var(--brand-coral)] cursor-pointer"
                        >
                            <AnimatePresence mode="wait">
                                <m.div
                                    key={activeChapter}
                                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute inset-0"
                                >
                                    <div className={cn("h-full w-full", storySteps[activeChapter].image)} />
                                    {/* Overlay Text for context */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                                        <h3 className="text-9xl font-bold text-brand-ink/15 tracking-wide">
                                            0{activeChapter + 1}
                                        </h3>
                                    </div>
                                </m.div>
                            </AnimatePresence>
                        </m.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
