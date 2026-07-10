'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

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

export default function ThreeBackground() {
  const canvasRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    let scene, camera, renderer;
    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
      camera.position.z = 22;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dl = new THREE.DirectionalLight(0xffffff, 2.5);
    dl.position.set(0, 0, 10);
    scene.add(dl);

    const pl1 = new THREE.PointLight(0xd4af37, 8, 60);   pl1.position.set(12,  10,  8); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xf9e8a2, 5, 50);  pl2.position.set(-12, -8,  6); scene.add(pl2);
    const pl3 = new THREE.PointLight(0xaa771c, 4, 40);  pl3.position.set(0,  -15,  4); scene.add(pl3);

    const createProceduralTexture = (type) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      if (type === 'kaju') {
        const grd = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(0.6, '#fffaf0');
        grd.addColorStop(1, '#f6ebd4');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = 'rgba(196, 154, 108, 0.15)';
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 60 + 20, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'kismis') {
        ctx.fillStyle = '#261208';
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = '#140803';
        for (let i = 0; i < 80; i++) {
          ctx.lineWidth = Math.random() * 4 + 1;
          ctx.beginPath();
          const y = Math.random() * 512;
          ctx.moveTo(0, y);
          ctx.bezierCurveTo(170, y + (Math.random() - 0.5) * 60, 340, y + (Math.random() - 0.5) * 60, 512, y);
          ctx.stroke();
        }
      } else if (type === 'pista_shell') {
        ctx.fillStyle = '#e6d0a7';
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = 'rgba(163, 125, 87, 0.4)';
        for (let i = 0; i < 50; i++) {
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.beginPath();
          const x = Math.random() * 512;
          ctx.moveTo(x, 0);
          ctx.lineTo(x + (Math.random() - 0.5) * 30, 512);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 40 + 10, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'pista_kernel') {
        ctx.fillStyle = '#7a9642';
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = 'rgba(92, 38, 65, 0.65)';
        for (let i = 0; i < 18; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 90 + 30, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(186, 209, 102, 0.35)';
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 60 + 20, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'elaichi') {
        ctx.fillStyle = '#8fad75';
        ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 90; i++) {
          ctx.strokeStyle = i % 2 === 0 ? '#6d8a54' : '#adc795';
          ctx.lineWidth = Math.random() * 3 + 1;
          ctx.beginPath();
          const x = Math.random() * 512;
          ctx.moveTo(x, 0);
          ctx.lineTo(x + (Math.random() - 0.5) * 20, 512);
          ctx.stroke();
        }
      } else if (type === 'badam') {
        ctx.fillStyle = '#783c18';
        ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 120; i++) {
          ctx.strokeStyle = i % 3 === 0 ? '#4a2008' : (i % 3 === 1 ? '#94532c' : '#5c2d12');
          ctx.lineWidth = Math.random() * 2 + 0.8;
          ctx.beginPath();
          const x = Math.random() * 512;
          ctx.moveTo(x, 0);
          ctx.lineTo(x + (Math.random() - 0.5) * 15, 512);
          ctx.stroke();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    const kajuTex = createProceduralTexture('kaju');
    const kismisTex = createProceduralTexture('kismis');
    const pistaShellTex = createProceduralTexture('pista_shell');
    const pistaKernelTex = createProceduralTexture('pista_kernel');
    const elaichiTex = createProceduralTexture('elaichi');
    const badamTex = createProceduralTexture('badam');

    const kajuMat = new THREE.MeshStandardMaterial({
      map: kajuTex,
      bumpMap: kajuTex,
      bumpScale: 0.02,
      roughness: 0.75,
      metalness: 0.02,
    });
    const kismisMat = new THREE.MeshStandardMaterial({
      map: kismisTex,
      bumpMap: kismisTex,
      bumpScale: 0.08,
      roughness: 0.95,
      metalness: 0.01,
    });
    const pistaShellMat = new THREE.MeshStandardMaterial({
      map: pistaShellTex,
      bumpMap: pistaShellTex,
      bumpScale: 0.04,
      roughness: 0.85,
      metalness: 0.02,
    });
    const pistaKernelMat = new THREE.MeshStandardMaterial({
      map: pistaKernelTex,
      bumpMap: pistaKernelTex,
      bumpScale: 0.025,
      roughness: 0.65,
      metalness: 0.02,
    });
    const elaichiMat = new THREE.MeshStandardMaterial({
      map: elaichiTex,
      bumpMap: elaichiTex,
      bumpScale: 0.05,
      roughness: 0.8,
      metalness: 0.02,
    });
    const badamMat = new THREE.MeshStandardMaterial({
      map: badamTex,
      bumpMap: badamTex,
      bumpScale: 0.045,
      roughness: 0.82,
      metalness: 0.01,
    });
    const kesarMat = new THREE.MeshStandardMaterial({ color: 0xff1a00, roughness: 0.45, metalness: 0.05, emissive: 0x991100, emissiveIntensity: 0.45 });

    const objects = [];
    const place = (mesh) => {
      mesh.position.set(
        (Math.random() - 0.5) * 34,
        (Math.random() - 0.5) * 24,
        Math.random() * -15 - 3
      );
      mesh.userData = {
        rx:       (Math.random() - 0.5) * 0.006, // Slower rotation
        ry:       (Math.random() - 0.5) * 0.006,
        floatAmp: Math.random() * 2.0 + 0.8,     // More gentle, larger floating
        floatSpd: Math.random() * 0.3 + 0.15,    // Slower float speed
        floatOff: Math.random() * Math.PI * 2,
        baseY:    mesh.position.y,
      };
      
      const s = Math.random() * 0.7 + 0.6; // Size variety
      mesh.scale.set(s, s, s);
      
      scene.add(mesh);
      objects.push(mesh);

      // GSAP entrance: scale up from zero to natural size
      gsap.from(mesh.scale, {
        x: 0, y: 0, z: 0,
        duration: 2.0,
        ease: 'elastic.out(1, 0.5)',
        delay: Math.random() * 2 + 0.5,
      });
    };

    // Kaju (Cashew) Geometry builder
    const createKajuGeometry = () => {
      const points = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const angle = -Math.PI * 0.45 + t * Math.PI * 0.95;
        const r = 1.0 + Math.sin(angle * 1.4) * 0.22;
        const x = Math.cos(angle) * r * 1.15;
        const y = Math.sin(angle) * r * 0.75 + (t - 0.5) * (t - 0.5) * 0.6;
        points.push(new THREE.Vector3(x, y, 0));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 20, 0.55, 10, false); // Wider base
      
      // Flatten cashew slightly in Z but keep it somewhat thick
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.z *= 0.85; // Less flattened, rounder
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Kismis (Raisin) Geometry builder
    const createKismisGeometry = () => {
      const geo = new THREE.SphereGeometry(0.75, 20, 20);
      geo.scale(0.9, 1.5, 0.9); // Make them slightly longer
      
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        // Add more intense raisin-like wrinkles/grooves
        const wave = Math.sin(v.y * 14) * Math.cos(v.x * 14) * Math.sin(v.z * 14) * 0.18;
        const wave2 = Math.sin(v.y * 8) * 0.1;
        const norm = v.clone().normalize();
        v.addScaledVector(norm, wave + wave2);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Pista (Pistachio) Group builder
    const createPistachioGroup = (shellMat, kernelMat) => {
      const group = new THREE.Group();
      
      // Left shell half
      const leftShellGeo = new THREE.SphereGeometry(0.85, 12, 12, 0, Math.PI * 0.9, 0, Math.PI);
      leftShellGeo.scale(0.8, 1.25, 0.45);
      const leftShell = new THREE.Mesh(leftShellGeo, shellMat);
      leftShell.position.x = -0.12;
      leftShell.rotation.y = -0.1;
      group.add(leftShell);
      
      // Right shell half
      const rightShellGeo = new THREE.SphereGeometry(0.85, 12, 12, 0, Math.PI * 0.9, 0, Math.PI);
      rightShellGeo.scale(0.8, 1.25, 0.45);
      const rightShell = new THREE.Mesh(rightShellGeo, shellMat);
      rightShell.position.x = 0.12;
      rightShell.rotation.y = Math.PI + 0.1;
      group.add(rightShell);
      
      // Green kernel
      const kernelGeo = new THREE.SphereGeometry(0.65, 12, 12);
      kernelGeo.scale(0.7, 1.0, 0.6);
      const kernel = new THREE.Mesh(kernelGeo, kernelMat);
      group.add(kernel);
      
      return group;
    };

    // Elaichi (Cardamom) Geometry builder
    const createElaichiGeometry = () => {
      const geo = new THREE.SphereGeometry(0.5, 16, 16);
      geo.scale(0.6, 1.4, 0.6); // elongated pod
      
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        // Add vertical ridges
        const angle = Math.atan2(v.x, v.z); 
        const wave = Math.sin(angle * 12) * 0.08; 
        
        // Taper the ends to make it pointy
        const taper = 1.0 - Math.pow(Math.abs(v.y / 1.4), 2.5) * 0.4;
        v.x *= taper;
        v.z *= taper;
        
        const norm = v.clone().normalize();
        v.addScaledVector(new THREE.Vector3(norm.x, 0, norm.z), wave);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Kesar (Saffron) Geometry builder
    const createKesarGeometry = () => {
      const points = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = Math.sin(t * Math.PI) * 0.3;
        const y = t * 2.0 - 1.0;
        const z = Math.cos(t * Math.PI) * 0.15;
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 10, 0.04, 5, false);
      
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const yNorm = (v.y + 1.0) / 2.0;
        if (yNorm > 0.6) {
          const thickness = 1.0 + (yNorm - 0.6) * 1.5;
          v.x *= thickness;
          v.z *= thickness;
        }
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Badam (Almond) Geometry builder
    const createAlmondGeometry = () => {
      const geo = new THREE.SphereGeometry(0.8, 20, 20);
      geo.scale(0.8, 1.4, 0.5);
      
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const yNorm = (v.y + 1.12) / 2.24;
        const taper = 1.0 - Math.pow(yNorm, 2.5) * 0.45;
        v.x *= taper;
        v.z *= taper;
        const wave = Math.sin(v.y * 12) * Math.cos(v.x * 12) * 0.04;
        const norm = v.clone().normalize();
        v.addScaledVector(norm, wave);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Populate the scene with realistic dry fruits and spices
    for (let i = 0; i < 5; i++) {
      place(new THREE.Mesh(createKajuGeometry(), kajuMat));
    }
    for (let i = 0; i < 5; i++) {
      place(new THREE.Mesh(createKismisGeometry(), kismisMat));
    }
    for (let i = 0; i < 5; i++) {
      place(createPistachioGroup(pistaShellMat, pistaKernelMat));
    }
    for (let i = 0; i < 6; i++) {
      place(new THREE.Mesh(createElaichiGeometry(), elaichiMat));
    }
    for (let i = 0; i < 5; i++) {
      place(new THREE.Mesh(createAlmondGeometry(), badamMat));
    }
    for (let i = 0; i < 12; i++) {
      place(new THREE.Mesh(createKesarGeometry(), kesarMat));
    }

    // Particles
    const pCount = 220;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i]   = (Math.random() - 0.5) * 60;
      pPos[i+1] = (Math.random() - 0.5) * 60;
      pPos[i+2] = (Math.random() - 0.5) * 30;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grd  = pCtx.createRadialGradient(16,16,0,16,16,16);
    grd.addColorStop(0,    'rgba(255,232,150,1)');
    grd.addColorStop(0.45, 'rgba(212,175,55,0.55)');
    grd.addColorStop(1,    'rgba(0,0,0,0)');
    pCtx.fillStyle = grd; pCtx.fillRect(0, 0, 32, 32);

    const pMat = new THREE.PointsMaterial({
      size: 0.28, map: new THREE.CanvasTexture(pCanvas),
      transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, color: 0xd4af37,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let mx = 0, my = 0, scrollPct = 0;
    const onMouse  = e => { mx = (e.clientX / window.innerWidth) - 0.5; my = (e.clientY / window.innerHeight) - 0.5; };
    const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; scrollPct = max > 0 ? window.scrollY / max : 0; };
    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll',    onScroll);
    window.addEventListener('resize',    onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      camera.position.x += (mx * 8 - camera.position.x) * 0.04;
      camera.position.y += (-my * 8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      particles.rotation.y = t * 0.018;
      particles.position.y = scrollPct * 12;
      objects.forEach((obj, i) => {
        obj.rotation.x += obj.userData.rx;
        obj.rotation.y += obj.userData.ry;
        obj.position.y = obj.userData.baseY + Math.sin(t * obj.userData.floatSpd + obj.userData.floatOff) * obj.userData.floatAmp;
        obj.rotation.z = scrollPct * 4 + i * 0.28;
      });
      pl1.intensity = 8.0 + Math.sin(t * 0.9) * 2.0;
      pl2.intensity = 5.0 + Math.sin(t * 1.2 + 1) * 1.5;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('resize',    onResize);
      cancelAnimationFrame(raf);
      renderer.dispose();
      kajuMat.dispose();
      kismisMat.dispose();
      pistaShellMat.dispose();
      pistaKernelMat.dispose();
      elaichiMat.dispose();
      badamMat.dispose();
      kesarMat.dispose();
      pMat.dispose();
      pGeo.dispose();
      kajuTex.dispose();
      kismisTex.dispose();
      pistaShellTex.dispose();
      pistaKernelTex.dispose();
      elaichiTex.dispose();
      badamTex.dispose();
    };
  }, []);

  if (!webglSupported) return null;

  return <canvas id="webgl-bg" ref={canvasRef} />;
}
