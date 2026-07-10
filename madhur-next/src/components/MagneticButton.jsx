'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Wraps any child element and applies magnetic follow + elastic snap-back.
 * Usage:
 *   <MagneticButton as="a" href="tel:..." className="header-call">Call</MagneticButton>
 */
export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  style,
  as: Tag = 'button',
  strength = 0.38,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * strength;
      const dy = (e.clientY - (r.top  + r.height / 2)) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: true });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1.2, 0.4)', overwrite: true });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  const props = {
    ref,
    className,
    style,
    ...(Tag === 'a' ? { href } : { onClick }),
    ...rest,
  };

  return <Tag {...props}>{children}</Tag>;
}
