'use client';
import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';


export default function MenuCard({ item }) {
  const cardRef   = useRef(null);
  const innerRef  = useRef(null);
  const glareRef  = useRef(null);
  const imgRef    = useRef(null);
  const bodyRef   = useRef(null);
  const iconRef   = useRef(null);

  const onEnter = () => {
    gsap.to(iconRef.current, { y: -6, scale: 1.25, rotate: 15, duration: 0.4, ease: 'back.out(2.5)' });
    gsap.to(bodyRef.current, { y: -5, duration: 0.4, ease: 'power2.out' });
    gsap.to(cardRef.current, {
      y: -12,
      scale: 1.04,
      boxShadow: '0 30px 60px rgba(212,175,55,0.22), 0 15px 30px rgba(0,0,0,0.6)',
      duration: 0.4,
      ease: 'back.out(1.8)',
    });
  };

  const onMove = (e) => {
    const card  = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;
    const r  = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;

    gsap.to(inner, {
      rotateX: -py * 16,
      rotateY:  px * 16,
      scale: 1.03,
      duration: 0.15,
      ease: 'power1.out',
      overwrite: true,
    });

    if (glareRef.current) {
      const gx = ((e.clientX - r.left) / r.width)  * 100;
      const gy = ((e.clientY - r.top)  / r.height) * 100;
      glareRef.current.style.background =
        `radial-gradient(ellipse 60% 60% at ${gx}% ${gy}%,
          rgba(255,240,150,0.18) 0%,
          rgba(212,175,55,0.08) 30%,
          transparent 70%)`;
    }

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: px * 8, y: py * 8,
        duration: 0.4, ease: 'power1.out',
      });
    }
  };

  const onLeave = () => {
    gsap.to(innerRef.current, {
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 1, ease: 'elastic.out(1, 0.4)',
      overwrite: true,
    });
    if (glareRef.current)
      glareRef.current.style.background =
        'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 70%)';
    if (imgRef.current)
      gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    gsap.to(iconRef.current, { y: 0, scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    gsap.to(bodyRef.current, { y: 0, duration: 0.5, ease: 'power2.out' });
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      duration: 0.8,
      ease: 'elastic.out(1.1, 0.5)',
    });
  };



  const isSawan = item.categories.includes('sawan');
  const tag = isSawan
    ? 'Sawan Special'
    : item.categories[0].charAt(0).toUpperCase() + item.categories[0].slice(1);

  return (
    <div
      className="sweet-card"
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {/* Animated gradient border ring */}
      <div className="card-border-ring" />

      <div
        ref={innerRef}
        className="card-inner"
        style={{ transformStyle: 'preserve-3d' }}
      >


        {/* ── Image or Header Spacer ── */}
        {item.image ? (
          <div className="card-img-wrap">
            <div
              ref={imgRef}
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                style={{ objectFit: 'cover', filter: 'brightness(0.75) saturate(1.3)' }}
              />
            </div>
            <span className="card-cat-tag">{tag}</span>
            <span className="card-3d-icon" ref={iconRef}>
              <i className={`fa-solid ${item.icon}`} />
            </span>
          </div>
        ) : (
          <div className="card-no-img-header" style={{ height: '64px', position: 'relative' }}>
            <span className="card-cat-tag">{tag}</span>
            <span className="card-3d-icon" ref={iconRef}>
              <i className={`fa-solid ${item.icon}`} />
            </span>
          </div>
        )}

        {/* Glossy top highlight */}
        <div className="card-gloss" />

        {/* Shimmer effect */}
        <div className="card-shimmer" />

        {/* ── Card Body ── */}
        <div className="card-body" ref={bodyRef}>
          <h3 className="card-name">{item.name}</h3>
          <p className="card-desc">{item.desc}</p>
        </div>

        {/* Glare overlay */}
        <div
          className="card-glare"
          ref={glareRef}
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 70%)' }}
        />
      </div>
    </div>
  );
}
