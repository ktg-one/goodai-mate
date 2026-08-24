"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Pricing() {
    return (
        <section id="pricing" className="py-40 px-6 bg-brand-paper text-brand-ink">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-medium tracking-wide mb-6"
                    >
                        Ways to work together.
                    </motion.h2>
                    <p className="text-brand-ink/70 text-lg font-light">Start small. Fix the right thing. Build from there.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Standard Member */}
                    <div className="p-10 bg-brand-paper border border-brand-ink shadow-[4px_4px_0_var(--brand-ink)] flex flex-col justify-between h-full">
                        <div>
                            <h3 className="text-lg font-medium tracking-widest uppercase mb-4 text-brand-coral">First chat</h3>
                            <div className="text-5xl font-light mb-8 text-brand-ink">No charge</div>
                            <ul className="space-y-4 text-sm text-brand-ink/70 mb-10">
                                {["One messy workflow", "A plain assessment", "A sensible next step"].map(item => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-coral" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button variant="outline" className="w-full rounded-full py-6 border-brand-ink bg-brand-paper text-brand-ink hover:bg-brand-eucalyptus transition-colors">
                            Tell us your problem
                        </Button>
                    </div>

                    {/* Executive Member - Metallic/Premium */}
                    <div className="relative p-10 bg-brand-ink text-brand-paper shadow-[8px_8px_0_var(--brand-coral)] flex flex-col justify-between h-full md:scale-105 border border-brand-ink overflow-hidden">

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium tracking-widest uppercase text-brand-coral">Operations sprint</h3>
                                <Badge variant="outline" className="border-brand-paper/30 text-brand-paper/70 font-light">Best place to start</Badge>
                            </div>
                            <div className="text-5xl font-light mb-2 text-brand-paper">Fixed scope</div>
                            <p className="text-brand-paper/60 text-sm mb-8">Agreed before we build</p>

                            <ul className="space-y-4 text-sm text-brand-paper/75 mb-10">
                                {["Workflow mapped", "Automation built", "Edge cases tested", "Team handover"].map(item => (
                                    <li key={item} className="flex items-center gap-3">
                                        <Check className="w-4 h-4 text-brand-coral" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button className="w-full rounded-full py-6 bg-brand-coral text-brand-ink hover:bg-brand-paper transition-colors font-medium">
                            Talk through a sprint
                        </Button>
                    </div>

                    {/* V.I.P. */}
                    <div className="p-10 bg-brand-paper border border-brand-ink shadow-[4px_4px_0_var(--brand-ink)] flex flex-col justify-between h-full">
                        <div>
                            <h3 className="text-lg font-medium tracking-widest uppercase mb-4 text-brand-eucalyptus">Ongoing support</h3>
                            <div className="text-5xl font-light mb-8 text-brand-ink">As needed</div>
                            <ul className="space-y-4 text-sm text-brand-ink/70 mb-10">
                                {["New workflows", "System upkeep", "Team questions", "Practical improvements"].map(item => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-eucalyptus" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button variant="outline" className="w-full rounded-full py-6 border-brand-ink bg-brand-paper text-brand-ink hover:bg-brand-eucalyptus transition-colors">
                            Talk to us
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
}
