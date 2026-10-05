"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What sort of work can you automate?",
        answer: "Repetitive admin, reminders, hand-offs, reporting, document handling, and the gaps between the tools your team already uses.",
    },
    {
        question: "Do we need to replace our current tools?",
        answer: "Usually, no. We start with what already works and connect or replace only what is causing the problem.",
    },
    {
        question: "Will our team know how it works?",
        answer: "Yes. We document the workflow, test it with the people using it, and hand it over in plain English.",
    },
    {
        question: "What happens after the first sprint?",
        answer: "You can run it yourself, bring us back for another workflow, or keep us around for practical support. No lock-in theatre.",
    },
];

export function FAQ() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section id="faq" className="py-24 px-6 bg-brand-paper text-brand-ink border-t border-brand-ink">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Straight answers.</h2>
                </motion.div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.question}
                            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 1.0,
                                delay: shouldReduceMotion ? 0 : index * 0.15,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <AccordionItem value={faq.question}>
                                <AccordionTrigger className="text-lg text-left transition-colors duration-300 hover:text-brand-coral">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-brand-ink/70 text-base leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
