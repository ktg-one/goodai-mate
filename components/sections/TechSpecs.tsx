"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
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
    return (
        <section id="specs" className="py-24 px-6 bg-brand-ink text-brand-paper">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter"
                    >
                        What you get.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {specs.map((spec, index) => (
                        <motion.div
                            key={spec.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <h4 className="text-sm font-medium text-brand-coral uppercase tracking-widest mb-2">
                                {spec.label}
                            </h4>
                            <p className="text-3xl md:text-4xl font-light tracking-tight">{spec.value}</p>
                            <Separator className="mt-6 bg-brand-paper/20" />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-8 border border-brand-paper/30 bg-transparent shadow-[6px_6px_0_var(--brand-coral)]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Bring us one stuck workflow.</h3>
                            <p className="text-brand-paper/70">We&apos;ll tell you what is worth fixing and what is better left alone.</p>
                        </div>
                        <a href={SURVEY_URL} className="px-8 py-4 rounded-full bg-brand-coral text-brand-ink font-medium hover:bg-brand-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-coral transition-colors">
                            Tell us your problem
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
