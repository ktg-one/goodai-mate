"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Headphones, MoveDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SURVEY_URL } from "@/lib/links";
import { HeroStudy } from "@/components/studio/HeroStudy";
import { Magnetic } from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = heroRef.current;
    if (!scope) return;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
        const heading = scope.querySelector<HTMLElement>(".hero-copy h1");
        const desc = scope.querySelector<HTMLElement>(".hero-description");
        const actions = scope.querySelectorAll<HTMLElement>(".hero-button, .hero-voice-link");
        const handnote = scope.querySelector<HTMLElement>(".hero-handnote");
        const study = scope.querySelector<HTMLElement>(".hero-study");
        const spiralLine = scope.querySelector<SVGPathElement>(".hero-study-line");
        const handnotePath = scope.querySelector<SVGPathElement>(".hero-handnote svg path");
        const branch = branchRef.current;

        const spiralLen = spiralLine ? spiralLine.getTotalLength() : 0;
        const handnoteLen = handnotePath ? handnotePath.getTotalLength() : 0;

        if (spiralLine) {
          gsap.set(spiralLine, { strokeDasharray: spiralLen, strokeDashoffset: spiralLen });
        }
        if (handnotePath) {
          gsap.set(handnotePath, { strokeDasharray: handnoteLen, strokeDashoffset: handnoteLen });
        }

        // Timeline tied directly to ScrollTrigger with play pause resume reset
        // Triggers as soon as the hero enters 80% of the viewport, plays to 100% completion, and stays visible.
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top 80%",
            end: "bottom 15%",
            toggleActions: "play pause resume reset",
            invalidateOnRefresh: true,
          },
          defaults: {
            ease: "power2.out",
          },
        });

        // 1. Heading and text rise and fade in
        if (heading) {
          master.fromTo(heading, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.1 }, 0);
        }
        if (desc) {
          master.fromTo(desc, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.1 }, 0.15);
        }
        if (actions.length) {
          master.fromTo(actions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 1.0 }, 0.3);
        }
        if (handnote) {
          master.fromTo(handnote, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.0 }, 0.45);
        }

        // 2. The plant unfurls upward at the same time
        if (branch) {
          master.fromTo(
            branch,
            { clipPath: "inset(100% 0% 0% 0%)", scale: 0.94, opacity: 0 },
            { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 0.22, duration: 1.6 },
            0.05
          );
        }

        // 3. Golden spiral draws in alongside
        if (spiralLine) {
          master.fromTo(
            spiralLine,
            { strokeDashoffset: spiralLen },
            { strokeDashoffset: 0, duration: 1.5, ease: "none" },
            0.1
          );
        }
        if (study) {
          master.fromTo(
            study,
            { rotation: 0, scale: 0.96 },
            { rotation: 12, scale: 1.05, duration: 2.2, ease: "none" },
            0
          );
        }

        // 4. Handwritten arrow finishes
        if (handnotePath) {
          master.fromTo(
            handnotePath,
            { strokeDashoffset: handnoteLen },
            { strokeDashoffset: 0, duration: 1.1, ease: "power1.out" },
            0.55
          );
        }
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero shell" ref={heroRef}>
      <div className="hero-copy">
        <h1>
          Good work.
          <br />
          <em>More life.</em>
        </h1>
        <p className="hero-description">
          Knock off early. We take the admin off your hands: phone answering, quoting, follow-ups.
          <br className="desktop-break" /> Go see the kids.
        </p>
        <Magnetic strength={0.35}>
          <Link href={SURVEY_URL} className="button hero-button">
            Let’s suss the fuss <ArrowUpRight size={20} />
          </Link>
        </Magnetic>
        <Magnetic strength={0.25}>
          <Link href="/demo" className="text-link hero-voice-link">
            See the voice + automation demo <Headphones size={17} />
          </Link>
        </Magnetic>
        <p className="handwritten hero-handnote">
          Leave it with us.
          <svg viewBox="0 0 140 45" fill="none" aria-hidden="true">
            <path d="M4 16c31 21 83 19 123-5m-16-4 20 2-9 17" />
          </svg>
        </p>
        <div className="hero-bottom">
          <span className="location-dot" /> Perth, Australia. Working everywhere.
          <Magnetic strength={0.4}>
            <a href="#services" aria-label="Explore our services">
              <MoveDown size={19} />
            </a>
          </Magnetic>
        </div>
      </div>
      <HeroStudy />
      <div ref={branchRef} className="hero-growing-branch" aria-hidden="true">
        <Image
          src="/assets/branch.svg"
          alt=""
          width={260}
          height={800}
          className="h-auto w-auto"
          unoptimized
        />
      </div>
    </section>
  );
}
