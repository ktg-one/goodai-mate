"use client";

import { motion } from "framer-motion";
import { InteractiveWorkflowCanvas } from "@/components/ui/InteractiveWorkflowCanvas";

export function ProductDemo() {
    return (
        <section id="demo" className="min-h-[100dvh] flex flex-col justify-center py-24 px-4 md:px-6 bg-brand-paper text-brand-ink overflow-hidden">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-3.5 py-1 rounded-full border border-brand-ink/20 bg-brand-ink/5 text-xs font-mono uppercase tracking-widest text-brand-ink/80 mb-4"
                    >
                        Interactive Automation Engine
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-brand-ink"
                    >
                        Watch the work happen.
                    </motion.h2>
                    <p className="text-brand-ink/75 text-base md:text-lg max-w-2xl mx-auto">
                        Click the trigger below to simulate what happens when a customer calls or submits a form. No human copy-pasting required.
                    </p>
                </div>

                <InteractiveWorkflowCanvas />
            </div>
        </section>
    );
}
