"use client";

import { m, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall } from "lucide-react";
import { SURVEY_URL, PHONE_HREF, PHONE_DISPLAY } from "@/lib/links";

function getFadeUpProps(shouldReduceMotion: boolean | null, yOffset: number, delay = 0) {
    return {
        initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.0, delay: shouldReduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
    };
}

function PrimaryCallButton({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
    return (
        <m.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="inline-block"
        >
            <Button asChild size="lg">
                <a href={PHONE_HREF}>
                    <span>Call Voice Agent: {PHONE_DISPLAY}</span>
                    <PhoneCall size={16} />
                </a>
            </Button>
        </m.div>
    );
}

function SecondarySurveyButton({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
    return (
        <m.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="inline-block"
        >
            <Button asChild size="lg" variant="secondary">
                <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer">
                    <span>Tell us what&apos;s eating your time</span>
                    <ArrowRight size={16} />
                </a>
            </Button>
        </m.div>
    );
}

export function CTA() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="min-h-[100dvh] flex flex-col justify-center py-24 px-6 bg-brand-ink text-brand-paper overflow-hidden relative border-y border-brand-paper/20">
            <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
                <m.div
                    {...getFadeUpProps(shouldReduceMotion, 15)}
                    className="inline-block px-3.5 py-1 rounded-full border border-brand-paper/20 bg-brand-paper/5 text-xs font-mono uppercase tracking-widest text-brand-coral mb-6"
                >
                    Ready to reclaim your time?
                </m.div>

                <m.h2
                    {...getFadeUpProps(shouldReduceMotion, 30)}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
                >
                    What&apos;s eating <br />
                    <span className="text-brand-coral">your week?</span>
                </m.h2>

                <m.p
                    {...getFadeUpProps(shouldReduceMotion, 30, 0.1)}
                    className="text-lg md:text-2xl text-brand-paper/75 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Tell us what gets copied, chased, or done twice. We&apos;ll build the voice agent and n8n workflow that sorts it forever.
                </m.p>

                <m.div
                    initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <PrimaryCallButton shouldReduceMotion={shouldReduceMotion} />
                    <SecondarySurveyButton shouldReduceMotion={shouldReduceMotion} />
                </m.div>
            </div>
        </section>
    );
}
