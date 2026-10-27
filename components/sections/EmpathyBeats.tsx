"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

const beats = [
  {
    image: "/assets/busy-desk.svg",
    title: "The follow-up that became yours",
    text: "We send the quote chasers and the reminders so it isn’t you at 8pm.",
  },
  {
    image: "/assets/connected-work.svg",
    title: "The details copied twice",
    text: "We connect the tools you already use so a job is typed once.",
  },
  {
    image: "/assets/knock-off-early.svg",
    title: "The day that never ends",
    text: "A voice agent answers the phone while you’re on the tools.",
  },
];

export function EmpathyBeats() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="empathy shell" id="been-tough">
      <Image
        src="/assets/branch.svg"
        alt=""
        width={280}
        height={850}
        className="empathy-branch h-auto"
        unoptimized
        aria-hidden="true"
      />

      <m.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
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
        {beats.map((beat, index) => (
          <m.article
            key={beat.title}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { y: -4, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }
            }
            transition={{
              duration: 1.0,
              delay: shouldReduceMotion ? 0 : index * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
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
            <p>{beat.text}</p>
          </m.article>
        ))}
      </div>

      <m.p
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 1.2,
          delay: shouldReduceMotion ? 0 : 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="handwritten empathy-note"
      >
        You’ve carried it long enough.
      </m.p>
    </section>
  );
}
