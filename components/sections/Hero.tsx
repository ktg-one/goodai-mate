"use client";

import { motion } from "framer-motion";
import { ArrowDown, PhoneCall } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AutomationDock } from "@/components/ui/AutomationDock";
import { TextScramble } from "@/components/ui/TextScramble";
import { PHONE_HREF, PHONE_DISPLAY } from "@/lib/links";

export function Hero() {
    const scrollToDemo = () => {
        const el = document.getElementById("demo");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-brand-ink py-20">
            <div className="container relative z-10 flex flex-col items-center text-center px-4 mt-12">
                {/* Minimalist WA Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8"
                >
                    <span className="px-4 py-1.5 rounded-full border border-brand-paper/30 bg-brand-paper/5 text-[10px] uppercase tracking-[0.25em] text-brand-paper/85 font-mono">
                        Perth, Western Australia • AI Automation
                    </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-medium tracking-tight leading-[1.04] text-brand-paper mb-6"
                >
                    Knock off early. <br className="hidden sm:block" />
                    <span className="text-brand-coral">
                        <TextScramble className="font-light">We&apos;ll cop it.</TextScramble>
                    </span>
                </motion.h1>

                {/* Clear Product Positioning Subhead */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base sm:text-lg md:text-xl font-light text-brand-paper/80 max-w-2xl mb-10 leading-relaxed"
                >
                    Custom AI voice agents that answer your phone 24/7, and automated n8n workflows that run your operations without manual double-handling.
                </motion.p>

                {/* Direct High-Value CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                >
                    <MagneticButton
                        onClick={() => window.location.assign(PHONE_HREF)}
                        className="rounded-full px-8 h-14 text-xs sm:text-sm uppercase tracking-widest bg-brand-coral text-brand-navy font-bold hover:bg-brand-paper transition-all shadow-[0_0_25px_rgba(255,111,97,0.35)] flex items-center gap-2.5"
                    >
                        <PhoneCall className="w-4 h-4" />
                        Test Voice Agent: {PHONE_DISPLAY}
                    </MagneticButton>

                    <MagneticButton
                        onClick={scrollToDemo}
                        className="flex items-center text-xs sm:text-sm uppercase tracking-widest text-brand-paper/85 hover:text-brand-paper transition-colors group px-6 py-4"
                    >
                        See Live Workflows <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform text-brand-teal" />
                    </MagneticButton>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex justify-center"
                >
                    <AutomationDock />
                </motion.div>
            </div>
        </section>
    );
}
