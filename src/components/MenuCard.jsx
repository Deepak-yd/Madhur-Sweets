import React, { useRef } from 'react';

export default function SweetCard({ item }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);

  const onMove = (e) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    inner.style.transform = `rotateX(${-py * 18}deg) rotateY(${px * 18}deg) scale3d(1.04,1.04,1.04)`;
    inner.style.transition = 'transform 0.08s ease-out';
    if (glareRef.current) {
      const gx = ((e.clientX - r.left) / r.width)  * 100;
      const gy = ((e.clientY - r.top)  / r.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(212,175,55,0.18) 0%, transparent 65%)`;
    }
  };

  const onLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = 'rotateX(0) rotateY(0) scale3d(1,1,1)';
    inner.style.transition = 'transform 0.6s ease-out';
    if (glareRef.current)
      glareRef.current.style.background = 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 65%)';
  };

  const isSawan = item.categories.includes('sawan');
  const tag = isSawan ? 'Sawan Special' : item.categories[0].charAt(0).toUpperCase() + item.categories[0].slice(1);

  return (
    <div
      className="sweet-card"
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
    >
      {/* Inner tilt container */}
      <div ref={innerRef} style={{ width:'100%', height:'100%', transformStyle:'preserve-3d', borderRadius:'20px', overflow:'hidden' }}>

        {/* Photo */}
        <div className="card-img-wrap">
          <img src={item.image} alt={item.name} className="card-img" loading="lazy" />
          <span className="card-cat-tag">{tag}</span>
          <span className="card-3d-icon"><i className={`fa-solid ${item.icon}`}></i></span>
        </div>

        {/* Text */}
        <div className="card-body">
          <h3 className="card-name">{item.name}</h3>
          <p className="card-desc">{item.desc}</p>
        </div>

        {/* Glare overlay */}
        <div className="card-glare" ref={glareRef}></div>
      </div>
    </div>
  );
}
