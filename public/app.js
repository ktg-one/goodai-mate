/* good'Ai — film hero, stripped to the phone.
   Foundation: Lenis + GSAP ScrollTrigger (scroll-cinema.md, verbatim order).
   Peak: Tier-1 state-machine engine — one WebGL context, 3-frame user chain
   (ringing → agent → booked) morphed by a noise wipe, scrubbed by scroll.
   The headline chars fly in (random rotateX/z, staggered) over the last
   segment of the scrub — the moment the booked calendar frame arrives.
   One function owns progress; everything else reads it. */
(function () {
  document.documentElement.classList.add('js')
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  const SITE = window.SITE
  if (!SITE || !SITE.THREE || !SITE.gsap || !SITE.ScrollTrigger) return
  const { THREE, gsap, ScrollTrigger, Lenis } = SITE
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const stage = document.getElementById('peak')
  const canvas = document.getElementById('peak-canvas')
  const captions = [...document.querySelectorAll('.cap')]
  const tcClock = document.getElementById('tc-clock')
  const tcStatus = document.getElementById('tc-status')
  const ctaHear = document.getElementById('cta-hear')
  const STATUS = ['ringing', 'agent', 'booked']

  /* ---- foundation: Lenis + ScrollTrigger ---- */
  if (!reduceMotion) {
    const lenis = new Lenis()
    window.__lenis = lenis // exposed for verification only
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  /* ---- Tier-1 engine ---- */
  const FRAMES = [
    'assets/gen/hero-ringing.jpg',
    'assets/gen/hero-agent.jpg',
    'assets/gen/hero-booked.jpg',
  ]
  const LINEAR = 1006 /* three.js LinearFilter — NPOT 1408 frames must not mipmap */

  function initEngine() {
    if (reduceMotion) return
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    } catch (e) {
      document.body.classList.add('no-engine')
      return
    }
    document.body.classList.add('engine-on')
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    /* ---- headline char split: each char flies in, scrubbed ---- */
    const headline = document.querySelector('h1')
    let charTL = null
    if (headline) {
      // wrap every text char in a .split-char span; keep the <br> and the period
      const frag = document.createDocumentFragment()
      ;[...headline.childNodes].forEach((node) => {
        if (node.nodeType === 3) {
          for (const ch of node.textContent) {
            const s = document.createElement('span')
            s.className = 'split-char'
            s.textContent = ch
            frag.appendChild(s)
          }
        } else if (node.nodeName === 'BR') {
          frag.appendChild(document.createElement('br'))
        } else if (node.classList && node.classList.contains('period')) {
          const s = document.createElement('span')
          s.className = 'split-char period'
          s.textContent = node.textContent
          frag.appendChild(s)
        }
      })
      headline.textContent = ''
      headline.appendChild(frag)

      const chars = headline.querySelectorAll('.split-char')
      if (chars.length) {
        chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }))
        charTL = gsap.timeline({ paused: true })
        charTL.fromTo(
          chars,
          {
            willChange: 'opacity, transform',
            opacity: 0,
            rotateX: () => gsap.utils.random(-120, 120),
            z: () => gsap.utils.random(-200, 200),
          },
          {
            ease: 'none',
            opacity: 1,
            rotateX: 0,
            z: 0,
            stagger: 0.02,
          }
        )
        charTL.progress(0) // pin the hidden state before the first frame
      }
    }

    /* ---- the WebGL scene ---- */
    const scene = new THREE.Scene()
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const load = new THREE.TextureLoader()
    const tex = FRAMES.map((f) => {
      const t = load.load(f)
      t.colorSpace = THREE.SRGBColorSpace
      t.generateMipmaps = false
      t.minFilter = LINEAR
      t.magFilter = LINEAR
      return t
    })
    const noise = load.load('assets/gen/noise.webp')

    const u = {
      uFrom: { value: tex[0] },
      uTo: { value: tex[1] },
      uMix: { value: 0 },
      uEnergy: { value: 0 }, // audio-reactive leg; MiniMax key unset — scroll stands alone
      uNoise: { value: noise },
      uScale: { value: new THREE.Vector2(1, 1) },
    }

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
    })
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat))

    const aspect = () => {
      const w = canvas.clientWidth || 1
      const h = canvas.clientHeight || 1
      renderer.setSize(w, h, false)
      const texA = tex[0].image
      if (texA && texA.width && texA.height) {
        const ia = texA.width / texA.height
        const ca = w / h
        u.uScale.value.set(ca > ia ? 1 : ca / ia, ca > ia ? ia / ca : 1)
      }
    }
    aspect()
    addEventListener('resize', aspect, { passive: true })

    /* one owner of progress: ScrollTrigger scrubs, rAF smooths and writes */
    let target = 0
    ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: '+=400%',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => { target = self.progress },
    })
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      ScrollTrigger.refresh()
    })

    let cur = 0
    let lastIdx = -1
    let lastClock = -1
    let fitted = false
    function frame(time) {
      if (!fitted && tex[0].image && tex[0].image.width) {
        aspect()
        fitted = true
      }
      cur += (target - cur) * 0.12
      const p = Math.min(1, Math.max(0, cur))
      /* hold each beat, then cut — no slow morph between ringing / agent / booked */
      const ci = p < 0.38 ? 0 : p < 0.70 ? 1 : 2
      u.uFrom.value = tex[ci]
      u.uTo.value = tex[ci]
      u.uMix.value = 0
      renderer.render(scene, cam)

      if (ci !== lastIdx) {
        lastIdx = ci
        captions.forEach((c) => {
          const on = Number(c.dataset.cap) === ci
          c.classList.toggle('is-on', on)
          c.setAttribute('aria-hidden', String(!on))
        })
        tcStatus.textContent = STATUS[ci]
        document.body.classList.toggle('booked-active', ci >= FRAMES.length - 1)
        if (ci > 0) {
          gsap.fromTo(
            canvas,
            { scale: 0.9 },
            { scale: 1, duration: 0.34, ease: 'back.out(2.6)', overwrite: true }
          )
        }
      }
      const clock = Math.round(p * 7)
      if (clock !== lastClock) {
        lastClock = clock
        tcClock.textContent = '0:0' + clock
      }    /* headline chars: fly in over the last ~30% of the scrub,
       exactly as the booked calendar frame arrives */
      if (charTL) {
        charTL.progress(gsap.utils.clamp(0, 1, (p - 0.7) / 0.3))
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  /* CTA — 'hear it answer' scrubs the film to the moment the call is
     picked up (the agent state), the real thing the button promises. */
  if (ctaHear) {
    ctaHear.addEventListener('click', () => {
      const lenis = window.__lenis
      if (lenis) {
        const st = ScrollTrigger.getAll().find((t) => t.trigger === stage)
        const mid = st ? st.start + (st.end - st.start) * 0.45 : 0
        lenis.scrollTo(mid)
      }
    })
  }

  initEngine()
})()
