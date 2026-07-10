'use client';
import { useEffect, useRef } from 'react';

export default function CursorParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    let mouse = { x: -100, y: -100, active: false };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Small premium gold particles
        this.size = Math.random() * 2.5 + 0.8;
        // Small horizontal drift, upward float
        this.speedX = (Math.random() - 0.5) * 1.6;
        this.speedY = -Math.random() * 1.2 - 0.3; 
        // Golden color theme with varied opacity
        const goldHue = Math.random() > 0.3 ? 38 : 45; // 38 is saffron gold, 45 is yellow gold
        this.color = `hsla(${goldHue}, 75%, 62%, ${Math.random() * 0.6 + 0.4})`;
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.012; // slow fade
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
      }

      draw() {
        ctx.fillStyle = this.color;
        
        // Premium golden glow shadow
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(223, 177, 91, 0.7)';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for performance
      }
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn particles as cursor moves
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render interactive mouse glow under cursor
      if (mouse.active) {
        const glowGrd = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          180
        );
        glowGrd.addColorStop(0, 'rgba(223, 177, 91, 0.09)');
        glowGrd.addColorStop(0.5, 'rgba(223, 177, 91, 0.02)');
        glowGrd.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = glowGrd;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw();
        }
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999, // Layer on top of content but mouse interaction passes through
      }}
    />
  );
}
