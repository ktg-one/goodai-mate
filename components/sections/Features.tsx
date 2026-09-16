"use client";

import { motion } from "framer-motion";
import { Zap, Shield, PhoneCall, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "24/7 AI Voice Agents",
        description: "An authentic Australian voice agent answers every call within two rings, qualifies callers, and books confirmed slots directly into your calendar.",
        icon: PhoneCall,
        accent: "bg-brand-coral",
        className: "col-span-1 md:col-span-2 lg:col-span-2",
    },
    {
        title: "Human-in-the-Loop",
        description: "You stay in total control. AI handles routine jobs, and immediately flags edge cases for your 1-tap sign-off.",
        icon: Shield,
        accent: "bg-brand-eucalyptus",
        className: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
        title: "Your Existing Stack",
        description: "Zero tool migrations. We connect directly into Xero, ServiceM8, Google Workspace, Cal.com, and Slack.",
        icon: Zap,
        accent: "bg-brand-eucalyptus",
        className: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
        title: "End-to-End n8n Workflows",
        description: "From website form submission to client SMS, draft invoice, and technician dispatch in 400 milliseconds. Zero manual copy-pasting.",
        icon: Workflow,
        accent: "bg-brand-coral",
        className: "col-span-1 md:col-span-2 lg:col-span-2",
    },
];

export function Features() {
    return (
        <section id="features" className="min-h-[100dvh] flex flex-col justify-center py-24 px-6 bg-brand-paper text-brand-ink">
            <div className="max-w-7xl mx-auto w-full">
                <div className="mb-16 md:flex justify-between items-end">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]"
                    >
                        Voice that answers. <br /> <span className="text-brand-coral">Workflows that finish.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-brand-ink/75 max-w-sm mt-6 md:mt-0 text-base md:text-lg font-light leading-relaxed"
                    >
                        Built for businesses that want fewer missed opportunities, faster turnaround, and their evenings back.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={cn(
                                    "p-8 md:p-10 border border-brand-ink bg-brand-paper relative group overflow-hidden flex flex-col justify-between shadow-[6px_6px_0_var(--brand-ink)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_var(--brand-coral)] transition-all",
                                    feature.className
                                )}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className={cn("p-3 border border-brand-ink", feature.accent)}>
                                        <Icon className="w-6 h-6 text-brand-ink" />
                                    </div>
                                    <span className="text-xs font-mono text-brand-ink/50">0{index + 1}</span>
                                </div>

                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                                    <p className="text-brand-ink/75 leading-relaxed text-sm md:text-base font-light">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
