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
        const study = scope.querySelector<HTMLElement>(".hero-study");
        const spiralLine = scope.querySelector<SVGPathElement>(".hero-study-line");
        const handnotePath = scope.querySelector<SVGPathElement>(".hero-handnote svg path");
        const branch = branchRef.current;

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

        // Master Timeline: 3 full viewports (300% = 3 wheel scrolls) of deliberate reading & choreography
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "+=260%",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // BEAT 1 (0.00 -> 0.35): Arrival & Golden Spiral Draw
        if (spiralLine) {
          master.to(spiralLine, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 0);
        }
        if (study) {
          master.to(study, { rotation: 10, scale: 1.04, duration: 1.0, ease: "none" }, 0);
        }

        // BEAT 2 (0.25 -> 0.70): Reading Dwell + Eucalyptus Branch Grows Upward
        if (handnotePath) {
          master.to(handnotePath, { strokeDashoffset: 0, duration: 0.25, ease: "power1.out" }, 0.25);
        }
        if (branch) {
          master.to(branch, {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 0.14,
            duration: 0.45,
            ease: "power1.out",
          }, 0.28);
        }

        // BEAT 3 (0.75 -> 1.00): Graceful handoff to the next section
        if (copy) {
          master.to(copy, {
            opacity: 0.2,
            y: -30,
            duration: 0.25,
            ease: "power1.in",
          }, 0.75);
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
