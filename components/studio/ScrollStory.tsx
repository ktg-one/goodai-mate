"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const chapters = [
  { title: "Still doing the one last thing?", copy: "Reply to that enquiry. Chase that quote. Copy the details over. Small jobs have a way of taking the whole afternoon.", note: "Sound familiar?", caption: "The work that follows you home." },
  { title: "Leave the running around to us.", copy: "We connect the moving parts: the enquiry, the calendar, the follow-up. Routine work keeps moving, with a person in the loop where it matters.", note: "Yep, we’ll sort that too.", caption: "A place for everything. A next step for every job." },
  { title: "Go on. Knock off early.", copy: "Take a proper lunch. Pick up the kids. Get down to the beach. The point of a better system is having more of your day to yourself.", note: "You’ve got better things to do.", caption: "Less of the busywork. More of the good stuff." },
];

export function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let disposed = false;
    const scope = root.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
        const scenes = scope.querySelectorAll<HTMLElement>(".story-canvas [data-scene]");
        const steps = scope.querySelectorAll<HTMLElement>(".scroll-chapter");
        scenes.forEach((scene, index) => {
          const paths = scene.querySelectorAll<SVGPathElement>("[data-ink]");
          paths.forEach(path => { const length = path.getTotalLength(); gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }); });
          gsap.set(scene, { opacity: index === 0 ? 1 : 0 });
          const timeline = gsap.timeline({ scrollTrigger: { trigger: steps[index], start: "top 70%", end: "bottom 30%", scrub: 0.8, invalidateOnRefresh: true } });
          // 0.0 -> 0.15: Smooth entrance
          timeline.to(scene, { opacity: 1, duration: 0.15, ease: "power1.out" }, 0)
            // 0.10 -> 0.45: Ink lines draw to completion
            .to(paths, { strokeDashoffset: 0, duration: 0.35, stagger: 0.015, ease: "power1.inOut" }, 0.10);
          // 0.45 -> 0.85: DWELL / LINGER ZONE (Artwork holds completely stable for human reading)
          // 0.85 -> 1.00: Smooth transition out
          if (index < scenes.length - 1) {
            timeline.to(scene, { opacity: 0, duration: 0.15, ease: "power1.in" }, 0.85);
          }
        });
      });
      media.add("(max-width: 760px) and (prefers-reduced-motion: no-preference)", () => {
        scope.querySelectorAll<HTMLElement>(".story-mobile-art").forEach(art => {
          const paths = art.querySelectorAll<SVGPathElement>("[data-ink]");
          paths.forEach(path => { const length = path.getTotalLength(); gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }); });
          gsap.to(paths, { strokeDashoffset: 0, duration: 0.7, stagger: 0.025, ease: "none", scrollTrigger: { trigger: art, start: "top 88%", end: "center 55%", scrub: 0.6, invalidateOnRefresh: true } });
        });
      });
    }, scope);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); ctx.revert(); };
  }, []);
  return <section className="scroll-story shell" ref={root} id="features" aria-labelledby="scroll-story-title">
    <div className="story-intro"><h2 id="scroll-story-title">You’ve done enough<br /><em>for one day.</em></h2><p>Let’s get the work out of the way.</p></div>
    <div className="story-layout"><div className="story-chapters">{chapters.map((chapter, index) => <article className="scroll-chapter" key={chapter.title}>
      <div className="chapter-copy"><h3>{chapter.title}</h3><p>{chapter.copy}</p><span className="handwritten chapter-note">{chapter.note}</span></div>
      <div className="story-mobile-art" aria-hidden="true"><StoryDrawing scene={index}/><span className="drawing-caption">{chapter.caption}</span></div>
    </article>)}</div><div className="story-canvas" aria-hidden="true">{chapters.map((chapter, index) => <div data-scene={index} key={chapter.title}><StoryDrawing scene={index}/><span className="drawing-caption">{chapter.caption}</span></div>)}</div></div>
    <a href="#suss-the-fuss" className="text-link story-next">We’ll suss the fuss <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6"/></svg></a>
  </section>;
}

function StoryDrawing({scene}:{scene:number}) {
  return <svg className="story-drawing" viewBox="0 0 560 440" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {scene === 0 && <>
      <path data-ink d="M72 338c115-6 272-5 423 0M109 342l-8 53m350-54 7 53"/>
      <path data-ink d="m115 277 128-10 7 49-130 9-5-48Zm4-12 125-10m-124-4 118-10m-107-4 101-8"/>
      <path data-ink d="m277 185 161 4-7 115-151-1-3-118Zm14 13 133 4-6 86-126-1-1-89Zm-20 109-18 20c64 6 141 7 193 1l-15-18"/>
      <path data-ink d="m309 226 27 1m-27 13 74 2m-73 13 57 1m-56 12 89 2"/>
      <path data-ink d="M79 193c-12-29 9-57 39-51 31 5 36 34 19 56l-29 28 4-22c-17 0-26-3-33-11Z"/>
      <path data-ink d="m99 170 21 1m-17 12 13 1M176 157l2-47 83 6-4 45-81-4Zm3-45 38 32 44-28"/>
      <path data-ink d="M372 128c-10-27 1-55 31-59 35-5 57 27 44 56-12 30-60 35-75 3Zm35-41-2 27 20 10"/>
      <path data-ink className="ink-accent" d="M161 193c-20-26 20-42 35-22 23 30-29 49-41 31-15-24 31-38 66-12 31 23 15 45-3 36m236-67 11-13m-1 32 20-4M86 113l-8-14"/>
      <path data-ink d="M168 294c20-3 34-4 57-5m-98 57 43-2m199 10 76-1"/>
    </>}
    {scene === 1 && <>
      <path data-ink d="M56 199c-1-16 14-29 33-26l70 4-5 69-98-4-1-43Zm4-20 47 39 49-34"/>
      <path data-ink className="ink-accent" d="M162 213c35-2 49-2 67 0m-10-9 13 9-14 10"/>
      <path data-ink d="M239 162c32-10 69-10 89 13 27 34 14 79-18 94-35 17-70-1-81-31-11-29-2-57 10-76Z"/>
      <path data-ink className="ink-accent" d="m249 214 21 23 47-49"/>
      <path data-ink d="M345 214c28 0 42-18 49-42m-45 44c22 8 31 37 40 59"/>
      <path data-ink d="m389 89 101 3-3 82-102-4 4-81Zm0 22 98 3m-76-37-1 26m51-25-1 26m-55 26 12 1m15 0 12 1m15 0 12 1m-55 16 12 1m15 0 12 1"/>
      <path data-ink d="m387 281 102 4-3 79-102-4 3-79Zm19 23 49 2m-50 13 64 2m-63 14 44 2"/>
      <path data-ink className="ink-accent" d="m450 347 10 9 19-24M114 301c-6 17-2 34 7 35 13 2 26 1 27-33l-34-2Zm34 3c23-2 23 20-4 19m-35 18c16 4 33 4 45-1M125 289c-7-12 8-14 1-27m13 29c-7-12 8-14 1-25"/>
      <path data-ink d="M88 362c90 5 197 4 267 1"/>
    </>}
    {scene === 2 && <>
      <path data-ink d="M53 345c56-9 102-7 147-2 47 4 98 3 139-4 69-13 112-7 164-1M78 365c41 3 68 2 97-1m167 7c46-6 92-7 126-3"/>
      <path data-ink d="m170 328 126-203 16 8-119 199-23-4Zm27-27 158 20-1 16-168-15m-1-1 128 78m-54-81-43 77m138-60 42 57"/>
      <path data-ink className="ink-accent" d="m291 157-80 136 128 15m-67-117-16 28 42 74m-62-40 26 44"/>
      <path data-ink d="M338 157c36-15 86-8 117 13-14-48-56-78-105-59-24 9-45 24-54 48 17-6 29-7 42-2Zm37-44-26 176m26-176c-22 16-34 28-37 44m37-44c29 15 32 37 30 48"/>
      <path data-ink className="ink-accent" d="M108 99c-6-18 8-35 27-33 20 2 29 20 22 36-9 20-40 20-49-3ZM128 43l-1-17m37 26 12-15m-81 19L82 45m-2 45-19-1m111 2 20-1m-96 33-14 15m76-13 9 13"/>
      <path data-ink d="M417 309v38m-29 4c19-5 41-4 56 1m-42-45 29 1-4 24-21-1-3-24Zm9-1 8-22 13-3M65 259c18-10 32-8 46 0 15-11 29-11 42-5"/>
      <path data-ink className="ink-accent" d="M420 222c14 1 24 8 29 20m-14-32c14 1 24 8 29 20"/>
    </>}
  </svg>;
}
