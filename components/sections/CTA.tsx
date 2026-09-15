"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall } from "lucide-react";
import { SURVEY_URL, PHONE_HREF, PHONE_DISPLAY } from "@/lib/links";

export function CTA() {
    return (
        <section className="min-h-[100dvh] flex flex-col justify-center py-24 px-6 bg-brand-ink text-brand-paper overflow-hidden relative border-y border-brand-paper/20">
            <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-block px-3.5 py-1 rounded-full border border-brand-paper/20 bg-brand-paper/5 text-xs font-mono uppercase tracking-widest text-brand-coral mb-6"
                >
                    Ready to reclaim your time?
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
                >
                    What&apos;s eating <br />
                    <span className="text-brand-coral">your week?</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-lg md:text-2xl text-brand-paper/75 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Tell us what gets copied, chased, or done twice. We&apos;ll build the voice agent and n8n workflow that sorts it forever.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <Button asChild size="lg" className="rounded-full px-8 h-14 text-sm sm:text-base font-bold bg-brand-coral text-brand-navy hover:bg-brand-paper transition-all shadow-[0_0_25px_rgba(255,111,97,0.35)]">
                        <a href={PHONE_HREF} className="flex items-center gap-2.5">
                            <PhoneCall className="w-4 h-4" />
                            Call Voice Agent: {PHONE_DISPLAY}
                        </a>
                    </Button>

                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-sm sm:text-base border-brand-paper/30 text-brand-paper hover:bg-brand-paper/10 transition-colors">
                        <a href={SURVEY_URL} className="flex items-center gap-2">
                            Tell us what&apos;s eating your time <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
