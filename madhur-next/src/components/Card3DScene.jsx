'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

/* ── Category → shape factory ───────────────────────────────── */
const SHAPE_MAP = {
  dry:      makeCube,
  khowa:    makeCylinder,
  laddu:    makeSphere,
  chena:    makeTorus,
  kaju:     makeDiamond,
  sawan:    makePyramid,
  namkeens: makeKnot,
  all:      makeIcosahedron,
};

function makeSphere(s, m)       { const g = new THREE.SphereGeometry(1, 32, 32);                    const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }
function makeCube(s, m)         { const g = new THREE.BoxGeometry(1.4, 1.4, 1.4);                   const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }
function makeCylinder(s, m)     { const g = new THREE.CylinderGeometry(1.1, 1.1, 0.5, 32);          const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }
function makeTorus(s, m)        { const g = new THREE.TorusGeometry(0.9, 0.35, 20, 60);             const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }
function makeDiamond(s, m)      { const g = new THREE.OctahedronGeometry(1.2, 0);                   const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }
function makePyramid(s, m)      { const g = new THREE.ConeGeometry(1, 1.8, 4, 1);                   const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }
function makeIcosahedron(s, m)  { const g = new THREE.IcosahedronGeometry(1.1, 0);                  const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }
function makeKnot(s, m)         { const g = new THREE.TorusKnotGeometry(0.7, 0.25, 80, 12, 2, 3);  const mesh = new THREE.Mesh(g, m); s.add(mesh); return [mesh]; }

/* ── WebGL support check ────────────────────────────────────── */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/* ── CSS fallback icon (when WebGL unavailable) ─────────────── */
function CSSFallback() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)',
    }}>
      <i className="fa-solid fa-crown" style={{
        fontSize: '2.5rem',
        color: 'var(--gold)',
        filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.6))',
      }} />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function Card3DScene({ category = 'all' }) {
  const mountRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── WebGL availability check
    if (!isWebGLAvailable()) {
      setWebglFailed(true);
      return;
    }

    const W = el.clientWidth  || 320;
    const H = el.clientHeight || 180;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 50);
    camera.position.z = 5;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: el,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    // Listen for context loss
    el.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      setWebglFailed(true);
    });

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    // ── Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const key  = new THREE.PointLight(0xd4af37, 6, 20);   key.position.set(3, 3, 4);   scene.add(key);
    const fill = new THREE.PointLight(0xa855f7, 2.5, 15); fill.position.set(-3, -1, 3); scene.add(fill);
    const rim  = new THREE.PointLight(0xf9e8a2, 3, 12);   rim.position.set(0, -4, -2); scene.add(rim);

    // ── Glossy material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.96,
      roughness: 0.07,
    });

    // ── Shape
    const cat   = SHAPE_MAP[category] ? category : 'all';
    const meshes = SHAPE_MAP[cat](scene, goldMat);

    // ── Particles
    const pCount = 50;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i]   = (Math.random() - 0.5) * 10;
      pPos[i+1] = (Math.random() - 0.5) * 8;
      pPos[i+2] = (Math.random() - 0.5) * 6 - 1;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grd  = pCtx.createRadialGradient(16,16,0,16,16,16);
    grd.addColorStop(0,   'rgba(255,232,140,1)');
    grd.addColorStop(0.4, 'rgba(212,175,55,0.6)');
    grd.addColorStop(1,   'rgba(0,0,0,0)');
    pCtx.fillStyle = grd; pCtx.fillRect(0,0,32,32);

    const pMat = new THREE.PointsMaterial({
      size: 0.12, map: new THREE.CanvasTexture(pCanvas),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    // ── GSAP entrance
    meshes.forEach(m => {
      gsap.set(m.scale, { x: 0, y: 0, z: 0 });
      gsap.to(m.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'elastic.out(1,0.5)', delay: 0.1 });
    });

    // ── Continuous Y rotation via GSAP
    const tl = gsap.timeline({ repeat: -1 });
    meshes.forEach(m => {
      tl.to(m.rotation, { y: Math.PI * 2, duration: 8 + Math.random() * 4, ease: 'none' }, 0);
    });

    // ── Mouse parallax on parent card
    let mx = 0, my = 0;
    const parentEl = el.closest('.sweet-card');
    const onMove  = (e) => { if (!parentEl) return; const r = parentEl.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    const onLeave = () => { mx = 0; my = 0; };
    if (parentEl) { parentEl.addEventListener('mousemove', onMove); parentEl.addEventListener('mouseleave', onLeave); }

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.06;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.06;
      camera.lookAt(0, 0, 0);
      meshes.forEach(m => { m.rotation.x = -my * 0.25 + Math.sin(t * 0.4) * 0.1; });
      pts.rotation.y = t * 0.06;
      pts.rotation.x = t * 0.03;
      key.intensity  = 5.5 + Math.sin(t * 1.1) * 1;
      fill.intensity = 2   + Math.sin(t * 0.7 + 1) * 0.5;
      rim.intensity  = 2.5 + Math.sin(t * 1.5 + 2) * 0.7;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      tl.kill();
      if (parentEl) { parentEl.removeEventListener('mousemove', onMove); parentEl.removeEventListener('mouseleave', onLeave); }
      renderer.dispose();
      goldMat.dispose();
      pMat.dispose();
      pGeo.dispose();
    };
  }, [category]);

  if (webglFailed) {
    return <CSSFallback />;
  }

  return <canvas ref={mountRef} className="card-3d-canvas" />;
}
