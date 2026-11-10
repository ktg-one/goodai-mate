"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Headphones,
  Workflow,
  MessagesSquare,
  Network,
  ScanSearch,
} from "lucide-react";
import { SURVEY_URL } from "@/lib/links";
import { services } from "@/lib/services";

const serviceIcons = [Headphones, Workflow, MessagesSquare, Network, ScanSearch];

export function ServicesList() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="services-section shell" id="services">
      <m.div
        className="section-heading"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2>
          A little less on
          <br />
          <em>your plate.</em>
        </h2>
        <p>
          Workflows take the admin off your hands. A voice agent answers the
          calls. A consult finds the first thing worth fixing. Integrations make
          the systems talk.
        </p>
      </m.div>

      <div className="service-list">
        {services.map((service, index) => {
          const Icon = serviceIcons[index];
          return (
            <m.div
              key={service.slug}
              initial={
                shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 1.0,
                delay: shouldReduceMotion ? 0 : index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: 8,
                      scale: 1.008,
                      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.995,
                      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                    }
              }
            >
              <Link href={`/services/${service.slug}`} className="service-row">
                <div className="service-symbol" aria-hidden="true">
                  <Icon strokeWidth={1.25} />
                </div>
                <div className="service-name">
                  <h3>{service.name}</h3>
                  <p>{service.line}</p>
                </div>
                <div className="service-price">
                  <strong>Talk to us</strong>
                </div>
                <span className="service-arrow">
                  <ArrowUpRight size={25} />
                </span>
              </Link>
            </m.div>
          );
        })}
      </div>

      <m.p
        className="pricing-note"
        id="pricing"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        Scope is agreed before we build.{" "}
        <Link href={SURVEY_URL}>
          Talk to us <ArrowUpRight size={14} />
        </Link>
      </m.p>
    </section>
  );
}
