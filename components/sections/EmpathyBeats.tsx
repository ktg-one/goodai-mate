"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

const EMPATHY_BEATS = [
  {
    src: "/assets/busy-desk.svg",
    title: "The follow-up that became yours",
    description: "We send the quote chasers and the reminders so it isn’t you at 8pm.",
  },
  {
    src: "/assets/connected-work.svg",
    title: "The details copied twice",
    description: "We connect the tools you already use so a job is typed once.",
  },
  {
    src: "/assets/knock-off-early.svg",
    title: "The day that never ends",
    description: "A voice agent answers the phone while you’re on the tools.",
  },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function EmpathyBeats() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="empathy-beats">
      {EMPATHY_BEATS.map((beat, index) => (
        <m.article
          key={beat.title}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 1.0,
            delay: shouldReduceMotion ? 0 : index * 0.2,
            ease: EASE,
          }}
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  y: -3,
                  transition: { duration: 1.0, ease: EASE },
                }
          }
        >
          <div className="beat-illustration">
            <Image
              src={beat.src}
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
  );
}
