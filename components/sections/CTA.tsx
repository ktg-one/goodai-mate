"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
    return (
        <section className="py-32 px-6 bg-brand-ink text-brand-paper overflow-hidden relative border-y border-brand-paper/20">
            {/* Background Glow */}

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold tracking-wide mb-8"
                >
                    What&apos;s eating your week?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-xl text-brand-paper/70 mb-10 max-w-2xl mx-auto"
                >
                    Tell us what gets copied, chased, or done twice. We&apos;ll tell you whether it is worth fixing.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-brand-coral text-brand-ink hover:bg-brand-paper focus-visible:outline-brand-coral transition-colors shadow-[4px_4px_0_var(--brand-paper)]">
                        Tell us your problem <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
