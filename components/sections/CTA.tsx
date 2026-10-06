"use client";

import { m, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall } from "lucide-react";
import { SURVEY_URL, PHONE_HREF, PHONE_DISPLAY } from "@/lib/links";

export function CTA() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="min-h-[100dvh] flex flex-col justify-center py-24 px-6 bg-brand-ink text-brand-paper overflow-hidden relative border-y border-brand-paper/20">
            <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
                <m.div
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block px-3.5 py-1 rounded-full border border-brand-paper/20 bg-brand-paper/5 text-xs font-mono uppercase tracking-widest text-brand-coral mb-6"
                >
                    Ready to reclaim your time?
                </m.div>

                <m.h2
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
                >
                    What&apos;s eating <br />
                    <span className="text-brand-coral">your week?</span>
                </m.h2>

                <m.p
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                    <m.div
                        animate={
                            shouldReduceMotion
                                ? {}
                                : {
                                      boxShadow: [
                                          "0 0 20px rgba(255,111,97,0.3)",
                                          "0 0 35px rgba(255,111,97,0.6)",
                                          "0 0 20px rgba(255,111,97,0.3)",
                                      ],
                                  }
                        }
                        transition={
                            shouldReduceMotion
                                ? {}
                                : {
                                      duration: 2.0,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                  }
                        }
                        whileHover={
                            shouldReduceMotion
                                ? {}
                                : {
                                      scale: 1.05,
                                      boxShadow: "0 0 45px rgba(255,111,97,0.8)",
                                      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                                  }
                        }
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        className="rounded-full inline-block"
                    >
                        <Button asChild size="lg" className="rounded-full px-8 h-14 text-sm sm:text-base font-bold bg-brand-coral text-brand-paper hover:bg-brand-paper hover:text-brand-ink transition-colors shadow-[0_0_25px_rgba(255,111,97,0.35)]">
                            <a href={PHONE_HREF} className="flex items-center gap-2.5">
                                <PhoneCall className="w-4 h-4" />
                                Call Voice Agent: {PHONE_DISPLAY}
                            </a>
                        </Button>
                    </m.div>

                    <m.div
                        animate={
                            shouldReduceMotion
                                ? {}
                                : {
                                      boxShadow: [
                                          "0 0 10px rgba(255,240,208,0.1)",
                                          "0 0 20px rgba(255,240,208,0.25)",
                                          "0 0 10px rgba(255,240,208,0.1)",
                                      ],
                                  }
                        }
                        transition={
                            shouldReduceMotion
                                ? {}
                                : {
                                      duration: 2.0,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                  }
                        }
                        whileHover={
                            shouldReduceMotion
                                ? {}
                                : {
                                      scale: 1.05,
                                      boxShadow: "0 0 30px rgba(255,240,208,0.4)",
                                      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                                  }
                        }
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        className="rounded-full inline-block"
                    >
                        <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-sm sm:text-base border-brand-paper/30 text-brand-paper hover:bg-brand-paper/10 transition-colors">
                            <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                Tell us what&apos;s eating your time{" "}
                                <m.span
                                    animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                                    transition={shouldReduceMotion ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="inline-flex items-center"
                                >
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </m.span>
                            </a>
                        </Button>
                    </m.div>
                </m.div>
            </div>
        </section>
    );
}
