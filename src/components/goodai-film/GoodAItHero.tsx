'use client';

/**
 * GoodAItHero — the scroll-scrubbed "one call, handled" film, ported from the
 * GoodAIt standalone build into the goodai-mate site.
 *
 * Merge rules (design/DESIGN.md + CINEMA-QA.md on the source build):
 *  - Uses the site's canonical tokens only (--navy/silver/coral/teal) and
 *    the site's font scope (Playfair/Lato/JetBrains). No new fonts, no new hues.
 *  - Lenis is intentionally dropped — the site has none; ScrollTrigger's native
 *    scrub + a rAF lerp carry the smoothing.
 *  - All CSS is scoped under .goodait-film so nothing leaks into the site.
 *  - One WebGL context, one owner of progress. Captions/status/clock write only
 *    on change. aria-hidden toggles so screen readers hear one caption at a time.
 *  - Reduced motion / no-WebGL fall back to the static booked poster + full copy.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './goodai-film.css';

gsap.registerPlugin(ScrollTrigger);

const FRAMES = [
  '/assets/goodai-film/hero-ringing.webp',
  '/assets/goodai-film/hero-agent.webp',
  '/assets/goodai-film/hero-booked.webp',
];
const STATUS = ['ringing', 'agent', 'booked'];

export default function GoodAItHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const canvas = root.querySelector<HTMLCanvasElement>('#goodait-canvas');
    const headline = root.querySelector<HTMLHeadingElement>('h1');
    const captions = [...root.querySelectorAll<HTMLElement>('.goodait-cap')];
    const tcClock = root.querySelector<HTMLElement>('#goodait-clock');
    const tcStatus = root.querySelector<HTMLElement>('#goodait-status');
    const ctaHear = root.querySelector<HTMLButtonElement>('#goodait-cta');
    if (!canvas || !headline || !tcClock || !tcStatus || !ctaHear) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      root.classList.add('goodait-rm');
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      root.classList.add('goodait-noengine');
      return;
    }
    root.classList.add('goodait-engine-on');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* ---- headline char split: each char flies in, scrubbed ----
       Idempotent: StrictMode double-invokes effects — if the split already
       happened, reuse the existing chars instead of re-walking a split DOM. */
    let charTL: gsap.core.Timeline | null = null;
    {
      let chars = headline.querySelectorAll('.goodait-char');
      if (!chars.length) {
        const frag = document.createDocumentFragment();
        [...headline.childNodes].forEach((node) => {
          if (node.nodeType === 3) {
            for (const ch of node.textContent ?? '') {
              const s = document.createElement('span');
              s.className = 'goodait-char';
              s.textContent = ch;
              frag.appendChild(s);
            }
          } else if (node.nodeName === 'BR') {
            frag.appendChild(document.createElement('br'));
          } else if ((node as HTMLElement).classList?.contains('goodait-period')) {
            const s = document.createElement('span');
            s.className = 'goodait-char goodait-period';
            s.textContent = node.textContent;
            frag.appendChild(s);
          }
        });
        headline.textContent = '';
        headline.appendChild(frag);
        chars = headline.querySelectorAll('.goodait-char');
      }
      if (chars.length) {
        chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }));
        charTL = gsap.timeline({ paused: true });
        charTL.fromTo(
          chars,
          {
            willChange: 'opacity, transform',
            opacity: 0,
            rotateX: () => gsap.utils.random(-120, 120),
            z: () => gsap.utils.random(-200, 200),
          },
          { ease: 'none', opacity: 1, rotateX: 0, z: 0, stagger: 0.02 }
        );
        charTL.progress(0);
      }
    }

    /* ---- the WebGL scene: one context, noise-wipe morph ---- */
    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const load = new THREE.TextureLoader();
    const tex = FRAMES.map((f) => {
      const t = load.load(f);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
    const noise = load.load('/assets/goodai-film/noise.webp');

    const u = {
      uFrom: { value: tex[0] },
      uTo: { value: tex[1] },
      uMix: { value: 0 },
      uEnergy: { value: 0 }, // audio-reactive leg — silent by design (owner dropped audio)
      uNoise: { value: noise },
      uScale: { value: new THREE.Vector2(1, 1) },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: u,
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position, 1.); }`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uFrom, uTo, uNoise;
        uniform float uMix, uEnergy;
        uniform vec2 uScale;
        void main(){
          vec2 uv = (vUv - 0.5) * uScale + 0.5;            // object-fit: cover
          float n = texture2D(uNoise, uv).r;
          float amt = smoothstep(n - 0.15, n + 0.15, uMix); // noise wipe between frames
          vec2 disp = (uMix * (1.0 - uMix) + uEnergy) * 0.06 * vec2(n - 0.5);
          vec3 a = texture2D(uFrom, uv + disp).rgb;
          vec3 b = texture2D(uTo, uv - disp).rgb;
          gl_FragColor = vec4(mix(a, b, amt), 1.);
        }`,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    const aspect = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      const texA = tex[0].image;
      if (texA && texA.width && texA.height) {
        const ia = texA.width / texA.height;
        const ca = w / h;
        u.uScale.value.set(ca > ia ? 1 : ca / ia, ca > ia ? ia / ca : 1);
      }
    };
    aspect();
    const onResize = () => aspect();
    window.addEventListener('resize', onResize, { passive: true });

    /* one owner of progress: ScrollTrigger scrubs, rAF smooths and writes */
    let target = 0;
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => { target = self.progress },
    });

    const seg = 1 / (FRAMES.length - 1);
    let cur = 0;
    let lastIdx = -1;
    let lastClock = -1;
    let rafId = 0;
    const frame = () => {
      cur += (target - cur) * 0.08;
      const p = Math.min(1, Math.max(0, cur));
      const s = p / seg;
      const i = Math.min(FRAMES.length - 2, Math.floor(s));
      const ci = Math.min(FRAMES.length - 1, Math.round(s));
      u.uFrom.value = tex[i];
      u.uTo.value = tex[i + 1];
      u.uMix.value = s - i;
      renderer.render(scene, cam);

      if (ci !== lastIdx) {
        lastIdx = ci;
        captions.forEach((c) => {
          const on = Number(c.dataset.cap) === ci;
          c.classList.toggle('goodait-on', on);
          c.setAttribute('aria-hidden', String(!on));
        });
        tcStatus.textContent = STATUS[ci];
        root.classList.toggle('goodait-booked', ci >= FRAMES.length - 1);
      }
      const clock = Math.round(p * 7);
      if (clock !== lastClock) {
        lastClock = clock;
        tcClock.textContent = '0:0' + clock;
      }
      if (charTL) {
        charTL.progress(gsap.utils.clamp(0, 1, (p - 0.7) / 0.3));
      }
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    /* CTA — 'hear it answer' scrubs the film to the moment the call is picked up */
    const onCta = () => {
      const mid = st.start + (st.end - st.start) * 0.45;
      window.scrollTo({ top: mid, behavior: 'smooth' });
    };
    ctaHear.addEventListener('click', onCta);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ctaHear.removeEventListener('click', onCta);
      st.kill();
      ScrollTrigger.refresh();
      renderer.dispose();
      root.classList.remove('goodait-engine-on', 'goodait-booked');
    };
  }, []);

  return (
    <section id="goodait" className="goodait-film" ref={rootRef}>
      <canvas id="goodait-canvas" aria-hidden="true" />

      {/* no-JS / no-WebGL / reduced-motion fallback: the booked end-state, static */}
      <div className="goodait-poster" aria-hidden="true">
        <img
          src="/assets/goodai-film/hero-booked.webp"
          alt="A sunlit workshop at morning, a phone on the bench with a glowing booking confirmation floating above it"
        />
      </div>

      <div className="goodait-scrim" aria-hidden="true" />

      <div className="goodait-copy">
        <p className="goodait-kicker">good&apos;Ai · your phone, answered</p>
        <h1>
          knock off<br />early<span className="goodait-period">.</span>
        </h1>
        <p className="goodait-sub">
          good&apos;Ai answers your phone in about three seconds, books the job, and texts
          you the short version. you stay on the tools.
        </p>
        <div className="goodait-cta-row">
          <button className="goodait-cta" id="goodait-cta" type="button">hear it answer</button>
          <span className="goodait-note">scroll to watch a call get handled</span>
        </div>
      </div>

      <div className="goodait-strip" aria-live="polite">
        <div className="goodait-meta">
          <span>tue 14:58</span>
          <span id="goodait-clock">0:00</span>
        </div>
        <div className="goodait-captions">
          <p className="goodait-cap goodait-on" data-cap="0">incoming call · ringing</p>
          <p className="goodait-cap" data-cap="1" aria-hidden="true">
            <span className="goodait-chip">answered in 2.4s</span>
            <span className="goodait-me">good&apos;Ai: good afternoon, dean&apos;s plumbing.</span>
            <span className="goodait-them">caller: hot water&apos;s gone at 14 acacia.</span>
            <span className="goodait-me">good&apos;Ai: tuesday, 8:30. you&apos;re booked. a text is on its way.</span>
          </p>
          <p className="goodait-cap" data-cap="2" aria-hidden="true">
            <span className="goodait-booked">booked · tue 8:30</span>
          </p>
        </div>
        <div className="goodait-meta">
          <span id="goodait-status">ringing</span>
          <span className="goodait-sent">text sent</span>
        </div>
      </div>
    </section>
  );
}
