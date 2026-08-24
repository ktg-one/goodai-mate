"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextScramble } from "@/components/ui/TextScramble";

export function Hero() {
    return (
        <section className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden bg-brand-ink">
            <div className="container relative z-10 flex flex-col items-center text-center px-4 mt-20">
                {/* Animated Badge - Minimalist */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10"
                >
                    <span className="px-4 py-1.5 rounded-full border border-brand-paper/30 bg-transparent text-[10px] uppercase tracking-[0.2em] text-brand-paper/75 font-medium">
                        WA Grown
                    </span>
                </motion.div>

                {/* Main Heading - Editorial Style */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl lg:text-[10rem] font-medium tracking-wide leading-[1.05] text-brand-paper mb-10"
                >
                    Knock off Early <br className="hidden md:block" />
                    <span className="text-brand-coral">
                        <TextScramble className="font-light">We&apos;ll cop it</TextScramble>
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-xl font-light text-brand-paper/75 max-w-lg mb-14 leading-relaxed"
                >
                    Not sure where to start? Answer our survey about your business and we&apos;ll suss the fuss.
                </motion.p>

                {/* CTA Buttons - Magnetic Feel */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-center gap-6"
                >
                    <MagneticButton className="rounded-full px-10 h-14 text-sm uppercase tracking-widest bg-brand-paper text-brand-ink hover:bg-brand-paper/90 transition-colors">
                        Repetitive Admin?
                    </MagneticButton>
                    <MagneticButton className="flex items-center text-sm uppercase tracking-widest text-brand-paper/75 hover:text-brand-paper transition-colors group px-6 py-4">
                        Let us sort it <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                </motion.div>
            </div>

        </section>
    );
}
