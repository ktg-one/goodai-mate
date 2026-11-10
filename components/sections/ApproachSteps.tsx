"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

interface ApproachStep {
  n: string;
  title: string;
  text: string;
}

const APPROACH_STEPS: readonly ApproachStep[] = [
  {
    n: "01",
    title: "Find the friction.",
    text: "We start with your day, your tools and the work that keeps getting in the way. Then we pick a useful place to start.",
  },
  {
    n: "02",
    title: "Make it work.",
    text: "We agree the scope, build the workflow and test the awkward bits with the people who will actually use it.",
  },
  {
    n: "03",
    title: "Make it yours.",
    text: "Clear documentation. A team walkthrough. Human hand-off when it matters. Ongoing support if you need it.",
  },
];

export function ApproachSteps() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="approach shell" id="approach">
      <Image
        src="/images/drawings/mandala-green.svg"
        alt=""
        width={440}
        height={440}
        className="approach-mandala h-auto"
        unoptimized
        aria-hidden="true"
      />

      <m.div
        className="section-heading"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2>
          Good people.
          <br />
          <em>Useful technology.</em>
        </h2>
        <p>
          Workflows, a voice agent, a consult, or an integration.
          <br />
          You get a system that makes sense.
        </p>
      </m.div>

      <div className="approach-steps" id="story">
        {APPROACH_STEPS.map((step, index) => (
          <m.article
            key={step.n}
            initial={
              shouldReduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 32 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 1.0,
              delay: shouldReduceMotion ? 0 : index * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -4,
                    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                  }
            }
          >
            <span className="step-number">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </m.article>
        ))}
      </div>

      <m.div
        className="principle-note"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 1.0,
          delay: shouldReduceMotion ? 0 : 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Check size={20} />
        <p>Your tools where possible. Your people in control. No mystery box.</p>
      </m.div>
    </section>
  );
}
