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

        // 1. gsap.timeline - paused: true, ease: "power1.out"
        const master = gsap.timeline({
          paused: true,
          defaults: {
            ease: "power1.out",
          },
          scrollTrigger: {
            // 2. Scrolltrigger box, start and end
            trigger: scope,
            start: "top top",
            end: "+=250%",

            // 3. toggleactions play pause resume reset, toggle class active
            toggleActions: "play pause resume reset",
            toggleClass: "active",

            // 4. scrub = true
            scrub: true,

            // 5. pin = true (just before starting your animations)
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 6. animations movement duration
        // Act 1: Plant unfurls on the right
        if (branch) {
          master.fromTo(
            branch,
            { clipPath: "inset(100% 0% 0% 0%)", scale: 0.94, opacity: 0 },
            { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 0.22, duration: 3 },
            0
          );
        }

        // Act 2: Golden spiral draws + study rotates early alongside the plant
        if (spiralLine) {
          master.fromTo(
            spiralLine,
            { strokeDashoffset: spiralLen },
            { strokeDashoffset: 0, duration: 3 },
            0.5
          );
        }
        if (study) {
          master.fromTo(
            study,
            { rotation: 0, scale: 0.96 },
            { rotation: 12, scale: 1.05, duration: 3 },
            0.5
          );
        }

        // Act 3: Words rise and lock in
        if (heading) {
          master.fromTo(heading, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 3 }, 1.5);
        }
        if (desc) {
          master.fromTo(desc, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 3 }, 2.0);
        }
        if (actions.length) {
          master.fromTo(actions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 2.5 }, 2.5);
        }

        // Act 4: Hand-drawn arrow sketches under "Leave it with us."
        if (handnote) {
          master.fromTo(handnote, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 2 }, 3.0);
        }
        if (handnotePath) {
          master.fromTo(
            handnotePath,
            { strokeDashoffset: handnoteLen },
            { strokeDashoffset: 0, duration: 2 },
            3.5
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
