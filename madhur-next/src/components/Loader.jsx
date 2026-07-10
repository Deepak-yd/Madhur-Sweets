'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import Logo from '@/components/Logo';

gsap.registerPlugin(TextPlugin);

export default function Loader({ onComplete }) {
  const loaderRef  = useRef(null);
  const counterRef = useRef(null);
  const barRef     = useRef(null);
  const taglineRef = useRef(null);
  const brandRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          if (loaderRef.current) {
            gsap.to(loaderRef.current, {
              clipPath: 'inset(0 0 100% 0)',
              duration: 1.1,
              ease: 'power4.inOut',
              onComplete,
            });
          } else {
            onComplete?.();
          }
        },
      });

      // Bouncy Logo entrance
      if (brandRef.current) {
        tl.from(brandRef.current, {
          scale: 0.65,
          opacity: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.55)',
        }, 0.1);
      }

      // Tagline
      if (taglineRef.current) {
        tl.from(taglineRef.current, {
          y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
        }, 0.7);
      }

      // Counter
      if (counterRef.current) {
        const obj = { val: 0 };
        tl.to(obj, {
          val: 100,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate() {
            if (counterRef.current) counterRef.current.textContent = `${Math.round(obj.val)}%`;
          },
        }, 0.4);
      }

      // Progress bar
      if (barRef.current) {
        tl.to(barRef.current, {
          scaleX: 1,
          duration: 1.8,
          ease: 'power1.inOut',
          transformOrigin: 'left center',
        }, 0.4);
      }
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#04040a',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        clipPath: 'inset(0 0 0% 0)',
      }}
    >
      {/* Brand logo container */}
      <div ref={brandRef} style={{ marginBottom: 28 }}>
        <Logo layout="vertical" />
      </div>

      {/* Tagline */}
      <div ref={taglineRef} style={{
        fontFamily: 'var(--font-body, "Montserrat", sans-serif)',
        fontSize: '0.68rem',
        letterSpacing: 5,
        color: '#9a9080',
        textTransform: 'uppercase',
        marginBottom: 52,
      }}>
        Pure Taste · Fresh Every Day
      </div>

      {/* Progress track */}
      <div style={{
        width: 'min(300px, 75vw)', height: 1.5,
        background: 'rgba(212,175,55,0.18)',
        borderRadius: 2, marginBottom: 16, overflow: 'hidden',
      }}>
        <div ref={barRef} style={{
          height: '100%', width: '100%',
          background: 'linear-gradient(90deg,#aa771c,#d4af37,#f9e8a2)',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }} />
      </div>

      {/* Counter */}
      <div ref={counterRef} style={{
        fontFamily: 'var(--font-body, "Montserrat", sans-serif)',
        fontSize: '0.75rem', color: '#d4af37',
        letterSpacing: 2,
      }}>
        0%
      </div>
    </div>
  );
}
