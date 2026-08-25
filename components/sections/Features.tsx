"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "BUSINESS WORKFLOWS",
        description: "One clear end-to-end process, striking that task off your todo list forever.",
        icon: Globe,
        accent: "bg-brand-coral",
        className: "col-span-1 md:col-span-2 lg:col-span-2",
    },
    {
        title: "It's Your Call",
        description: "You pick where your data lives, how much work gets done, and who has access.",
        icon: Shield,
        accent: "bg-brand-eucalyptus",
        className: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
        title: "Systems that talk",
        description: "We connect the tools you already use so information stops falling through the gaps.",
        icon: Cpu,
        accent: "bg-brand-eucalyptus",
        className: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
        title: "Less chasing",
        description: "You'll no longer dread updates, reminders or alarms  as they now signal a job getting done.",
        icon: Zap,
        accent: "bg-brand-coral",
        className: "col-span-1 md:col-span-2 lg:col-span-2",
    },
];

export function Features() {
    return (
        <section id="features" className="py-40 px-6 bg-brand-paper text-brand-ink">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24 md:flex justify-between items-end">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-large tracking-wide leading-[1.15]"
                    >
                        Less admin. <br /> <span className="text-brand-coral">More time.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-brand-ink/70 max-w-sm mt-8 md:mt-0 text-lg font-light"
                    >
                        Invest in yourself, Chuck us all the hassle, we&apos;ll sort it for ya... better quality of life and stuff.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} className={feature.className}>
                            <div className="relative z-10 flex flex-col h-full justify-between p-8">
                                <div className={cn("w-12 h-12 rounded-full border border-brand-ink flex items-center justify-center mb-6 text-brand-ink", feature.accent)}>
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-medium mb-3 tracking-wide">{feature.title}</h3>
                                    <p className="text-brand-ink/70 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "relative border border-brand-ink bg-brand-paper overflow-hidden shadow-[4px_4px_0_var(--brand-ink)]",
                className
            )}
        >
            {children}
        </div>
    );
}
