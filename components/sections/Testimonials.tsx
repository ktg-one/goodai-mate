"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StaggeredText } from "@/components/ui/StaggeredText";

const testimonials = [
    {
        quote: "Invoices, reminders, and follow-ups should not need someone watching them all day.",
        author: "Admin workflows",
        role: "Less chasing and fewer missed jobs",
        initials: "01"
    },
    {
        quote: "Information should move between your tools without being copied and pasted three times.",
        author: "Connected systems",
        role: "One job, one source of truth",
        initials: "02"
    },
    {
        quote: "Your team should know what the system did, what needs attention, and how to take over.",
        author: "Clean handover",
        role: "Useful docs and no mystery box",
        initials: "03"
    }
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 px-6 bg-brand-paper text-brand-ink border-t border-brand-ink">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        <StaggeredText stagger={0.03}>The work we take off your plate.</StaggeredText>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group"
                        >
                            <Card className="h-full border-brand-ink bg-brand-paper shadow-[4px_4px_0_var(--brand-ink)]">
                                <CardContent className="p-8 flex flex-col justify-between h-full">
                                    <div className="mb-6">
                                        <div className="text-4xl text-brand-coral font-serif leading-none mb-4">“</div>
                                        <p className="text-lg leading-relaxed">{t.quote}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-eucalyptus border border-brand-ink flex items-center justify-center font-bold text-sm">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{t.author}</div>
                                            <div className="text-sm text-muted-foreground">{t.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
