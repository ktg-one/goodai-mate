"use client";

import { m, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SURVEY_URL } from "@/lib/links";

const specs = [
    { label: "Best fit", value: "Busy service businesses" },
    { label: "What we fix", value: "Admin and hand-offs" },
    { label: "Tools", value: "Workspace · n8n · Notion" },
    { label: "Delivery", value: "Fixed-scope sprint" },
    { label: "Handover", value: "Docs and a team walkthrough" },
    { label: "Support", value: "Ongoing, when it helps" },
];

export function TechSpecs() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section id="specs" className="py-24 px-6 bg-brand-ink text-brand-paper">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <m.h2
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-6xl font-bold"
                    >
                        What you get.
                    </m.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {specs.map((spec, index) => (
                        <m.div
                            key={spec.label}
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 1.0, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative flex flex-col justify-between"
                        >
                            <div>
                                <h4 className="text-sm font-medium text-brand-coral uppercase tracking-widest mb-2">
                                    {spec.label}
                                </h4>
                                <p className="text-3xl md:text-4xl font-light">{spec.value}</p>
                            </div>

                            {/* Animated Underline / Separator Path */}
                            <div className="mt-6 relative w-full h-[2px] overflow-hidden">
                                <div className="absolute inset-0 bg-brand-paper/20" />
                                <m.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1.2, delay: 0.2 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ transformOrigin: "left center" }}
                                    className="absolute inset-0 bg-brand-coral"
                                />
                            </div>
                        </m.div>
                    ))}
                </div>

                <m.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-24 p-8 border border-brand-paper/30 bg-transparent shadow-[6px_6px_0_var(--brand-coral)] transition-shadow duration-1000 hover:shadow-[10px_10px_0_var(--brand-coral)]"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Bring us one stuck workflow.</h3>
                            <p className="text-brand-paper/70">We&apos;ll tell you what is worth fixing and what is better left alone.</p>
                        </div>
                        <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer" className="button">
                            Tell us your problem <ArrowUpRight size={17} />
                        </a>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
