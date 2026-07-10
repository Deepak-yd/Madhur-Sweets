import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const pl1 = new THREE.PointLight(0xd4af37, 3, 60); pl1.position.set(12, 10, 8); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xf9e8a2, 1.8, 50); pl2.position.set(-12, -8, 6); scene.add(pl2);
    const pl3 = new THREE.PointLight(0xaa771c, 1.2, 40); pl3.position.set(0, -15, 4); scene.add(pl3);

    // Gold material with environment-like sheen
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, metalness: 0.92, roughness: 0.12, flatShading: false
    });
    const darkGoldMat = new THREE.MeshStandardMaterial({
      color: 0xaa771c, metalness: 0.88, roughness: 0.18
    });

    const objects = [];
    const place = (mesh) => {
      mesh.position.set(
        (Math.random() - 0.5) * 34,
        (Math.random() - 0.5) * 24,
        Math.random() * -15 - 3
      );
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.012,
        ry: (Math.random() - 0.5) * 0.012,
        floatAmp: Math.random() * 1.6 + 0.5,
        floatSpd: Math.random() * 0.6 + 0.3,
        floatOff: Math.random() * Math.PI * 2,
        baseY: mesh.position.y
      };
      scene.add(mesh);
      objects.push(mesh);
    };

    // Spheres — Ladoos
    const sphereGeo = new THREE.SphereGeometry(0.9, 16, 16);
    for (let i = 0; i < 6; i++) place(new THREE.Mesh(sphereGeo, goldMat));

    // Cylinders — Barfi coins
    const cylGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.28, 10);
    for (let i = 0; i < 5; i++) place(new THREE.Mesh(cylGeo, darkGoldMat));

    // Icosahedrons — decorative gems
    const icoGeo = new THREE.IcosahedronGeometry(0.7, 0);
    for (let i = 0; i < 4; i++) place(new THREE.Mesh(icoGeo, goldMat));

    // Torus — bangles / garlands
    const torGeo = new THREE.TorusGeometry(0.7, 0.18, 10, 28);
    for (let i = 0; i < 3; i++) place(new THREE.Mesh(torGeo, darkGoldMat));

    // Particles
    const pCount = 180;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i]   = (Math.random() - 0.5) * 60;
      pPos[i+1] = (Math.random() - 0.5) * 60;
      pPos[i+2] = (Math.random() - 0.5) * 30;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    // Glowing particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grd = pCtx.createRadialGradient(16,16,0,16,16,16);
    grd.addColorStop(0, 'rgba(255,232,150,1)');
    grd.addColorStop(0.45, 'rgba(212,175,55,0.55)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    pCtx.fillStyle = grd; pCtx.fillRect(0,0,32,32);

    const pMat = new THREE.PointsMaterial({
      size: 0.28, map: new THREE.CanvasTexture(pCanvas),
      transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, color: 0xd4af37
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Input tracking
    let mx = 0, my = 0, scrollPct = 0;
    const onMouse = e => { mx = (e.clientX/window.innerWidth)-0.5; my = (e.clientY/window.innerHeight)-0.5; };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollPct = max > 0 ? window.scrollY / max : 0;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Smooth camera
      camera.position.x += (mx * 8 - camera.position.x) * 0.04;
      camera.position.y += (-my * 8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Particles drift
      particles.rotation.y = t * 0.018;
      particles.position.y = scrollPct * 12;

      // Floating objects
      objects.forEach((obj, i) => {
        obj.rotation.x += obj.userData.rx;
        obj.rotation.y += obj.userData.ry;
        obj.position.y = obj.userData.baseY + Math.sin(t * obj.userData.floatSpd + obj.userData.floatOff) * obj.userData.floatAmp;
        obj.rotation.z = scrollPct * 4 + i * 0.28;
      });

      // Pulse lights
      pl1.intensity = 2.5 + Math.sin(t * 0.9) * 0.8;
      pl2.intensity = 1.5 + Math.sin(t * 1.2 + 1) * 0.5;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      renderer.dispose();
    };
  }, []);

  return <canvas id="webgl-bg" ref={canvasRef} />;
}
