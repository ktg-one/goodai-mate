'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import fragmentShader from '@/shaders/sdf-lensblur.frag';

const vertexShader = /* glsl */ `
  varying vec2 v_texcoord;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
  }
`;

function isWebGLAvailable(): boolean {
  try {
    if (typeof WebGLRenderingContext === 'undefined') return false;
    const canvas = document.createElement('canvas');
    const ctx =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!ctx;
  } catch {
    return false;
  }
}

export default function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [noWebGL, setNoWebGL] = useState(false);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setNoWebGL(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Three.js objects
    let rafId: number;
    let lastTime = 0;

    const scene = new THREE.Scene();
    const vMouse = new THREE.Vector2();
    const vMouseDamp = new THREE.Vector2();
    const vResolution = new THREE.Vector2();

    const camera = new THREE.OrthographicCamera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    container.appendChild(renderer.domElement);

    const geo = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: 2 },
      },
      defines: { VAR: 0 },
    });

    const quad = new THREE.Mesh(geo, mat);
    scene.add(quad);

    // Resize handler
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.innerWidth < 640
        ? Math.min(window.devicePixelRatio, 1)
        : Math.min(window.devicePixelRatio, 2);

      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);

      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      quad.scale.set(w, h, 1);
      vResolution.set(w, h).multiplyScalar(dpr);
      mat.uniforms.u_pixelRatio.value = dpr;
    };
    resize();

    // Mouse / touch listeners
    const onPointerMove = (e: PointerEvent) => {
      vMouse.set(e.pageX, e.pageY);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        vMouse.set(e.touches[0].pageX, e.touches[0].pageY);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    document.body.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('resize', resize);

    // Animation loop
    const update = () => {
      const time = performance.now() * 0.001;
      const dt = time - lastTime;
      lastTime = time;

      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      document.body.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', resize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (noWebGL) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #0C0C0C 0%, #1a1410 50%, #0C0C0C 100%)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
