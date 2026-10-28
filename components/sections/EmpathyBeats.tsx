"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

const beatsData = [
  {
    image: "/assets/busy-desk.svg",
    title: "The follow-up that became yours",
    description: "We send the quote chasers and the reminders so it isn’t you at 8pm.",
  },
  {
    image: "/assets/connected-work.svg",
    title: "The details copied twice",
    description: "We connect the tools you already use so a job is typed once.",
  },
  {
    image: "/assets/knock-off-early.svg",
    title: "The day that never ends",
    description: "A voice agent answers the phone while you’re on the tools.",
  },
];

export function EmpathyBeats() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="empathy shell" id="been-tough">
      <m.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/assets/branch.svg"
          alt=""
          width={280}
          height={850}
          className="empathy-branch h-auto"
          unoptimized
          aria-hidden="true"
        />
      </m.div>

      <m.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="section-heading"
      >
        <h2>
          It’s been a lot,
          <br />
          <span className="pen-stroke">
            <em>hasn’t it?</em>
          </span>
        </h2>
        <p>
          The quotes you chase. The details you type twice.
          <br />
          The phone you answer after hours.
        </p>
      </m.div>

      <div className="empathy-beats">
        {beatsData.map((beat, index) => (
          <m.article
            key={beat.title}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 1.0,
              delay: shouldReduceMotion ? 0 : index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -6,
                    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
                  }
            }
          >
            <div className="beat-illustration">
              <Image
                src={beat.image}
                alt=""
                width={140}
                height={110}
                className="h-auto w-auto"
                unoptimized
                aria-hidden="true"
              />
            </div>
            <h3>{beat.title}</h3>
            <p>{beat.description}</p>
          </m.article>
        ))}
      </div>

      <m.p
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.0, delay: shouldReduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="handwritten empathy-note"
      >
        You’ve carried it long enough.
      </m.p>
    </section>
  );
}
