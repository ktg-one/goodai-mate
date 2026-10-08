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
        const copy = scope.querySelector<HTMLElement>(".hero-copy");
        const heading = scope.querySelector<HTMLElement>(".hero-copy h1");
        const desc = scope.querySelector<HTMLElement>(".hero-description");
        const actions = scope.querySelectorAll<HTMLElement>(".hero-button, .hero-voice-link");
        const handnote = scope.querySelector<HTMLElement>(".hero-handnote");
        const handnotePath = scope.querySelector<SVGPathElement>(".hero-handnote svg path");
        const bottom = scope.querySelector<HTMLElement>(".hero-bottom");
        const study = scope.querySelector<HTMLElement>(".hero-study");
        const spiralLine = scope.querySelector<SVGPathElement>(".hero-study-line");
        const branch = branchRef.current;

        // Initial entrance state for the words: start below with zero opacity
        const textElements = [heading, desc, ...Array.from(actions), handnote, bottom].filter(Boolean);
        gsap.set(textElements, { opacity: 0, y: 32 });

        if (spiralLine) {
          const len = spiralLine.getTotalLength();
          gsap.set(spiralLine, { strokeDasharray: len, strokeDashoffset: len });
        }
        if (handnotePath) {
          const hLen = handnotePath.getTotalLength();
          gsap.set(handnotePath, { strokeDasharray: hLen, strokeDashoffset: hLen });
        }
        if (branch) {
          gsap.set(branch, {
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 0.94,
            opacity: 0,
            transformOrigin: "bottom right",
          });
        }

        // Master Timeline: Doubled timing (5 full viewport heights = 500vh) for deep, luxurious scroll pacing
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: () => `+=${window.innerHeight * 5}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // BEAT 1 (0.00 -> 0.38): Spiral Draws, Plant Unfurls, and Words Fade In Together
        if (spiralLine) {
          master.to(spiralLine, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 0);
        }
        if (study) {
          master.to(study, { rotation: 12, scale: 1.05, duration: 1.0, ease: "none" }, 0);
        }

        // The plant climbs upward alongside the words
        if (branch) {
          master.to(branch, {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 0.15,
            duration: 0.35,
            ease: "power1.out",
          }, 0.04);
        }

        // Words arrive in harmonious sequence alongside the rising branch
        if (heading) {
          master.to(heading, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.04);
        }
        if (desc) {
          master.to(desc, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.10);
        }
        if (actions.length) {
          master.to(actions, { opacity: 1, y: 0, stagger: 0.04, duration: 0.16, ease: "power2.out" }, 0.16);
        }
        if (handnote) {
          master.to(handnote, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.20);
        }
        if (handnotePath) {
          master.to(handnotePath, { strokeDashoffset: 0, duration: 0.14, ease: "power1.out" }, 0.24);
        }
        if (bottom) {
          master.to(bottom, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.22);
        }

        // BEAT 2 (0.38 -> 0.84): Extended Reading Dwell (Complete Stillness for Reading)
        // Everything is fully settled and readable across ~2.5 viewports of scroll.

        // BEAT 3 (0.84 -> 1.00): Graceful handoff to the next section
        if (copy) {
          master.to(copy, {
            opacity: 0.2,
            y: -35,
            duration: 0.16,
            ease: "power1.in",
          }, 0.84);
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
