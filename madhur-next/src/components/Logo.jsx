'use client';

export default function Logo({ layout = 'horizontal', className = '' }) {
  const isVert = layout === 'vertical';

  return (
    <div className={`logo-container-outer ${className}`}>
      <div
        className={`logo-container ${layout}`}
        style={{
          display: 'flex',
          flexDirection: isVert ? 'column' : 'row',
          alignItems: 'center',
          gap: isVert ? '12px' : '14px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: isVert ? '8px 14px' : '4px 10px',
          borderRadius: '12px',
        }}
      >
        <div className="glossy-shimmer" />
      {/* ── Lotus SVG Symbol ── */}
      <svg
        viewBox="0 0 100 80"
        style={{
          width: isVert ? '95px' : '48px',
          height: isVert ? '76px' : '38px',
          filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.3))',
          flexShrink: 0,
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9e8a2">
              <animate attributeName="offset" values="0;0.15;0" dur="5s" repeatCount="indefinite" />
            </stop>
            <stop offset="45%" stopColor="#d4af37">
              <animate attributeName="offset" values="0.3;0.6;0.3" dur="5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#aa771c">
              <animate attributeName="offset" values="0.85;1;0.85" dur="5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Center Petal (Ghee Droplet shape) */}
        <path
          d="M50 12 C 41 29 39 36 39 45 A 11 11 0 0 0 61 45 C 61 36 59 29 50 12 Z"
          fill="url(#logo-gold-grad)"
        />
        {/* Shadow Overlay inside central droplet */}
        <path
          d="M50 20 C 45 30 43 35 43 43 A 7 7 0 0 0 57 43 C 57 35 55 30 50 20 Z"
          fill="#060606"
          opacity="0.3"
        />
        {/* Core highlight inside droplet */}
        <path
          d="M50 26 C 47 33 46 37 46 41 A 4 4 0 0 0 54 41 C 54 37 53 33 50 26 Z"
          fill="url(#logo-gold-grad)"
        />

        {/* Left Lotus Petal */}
        <path
          d="M41 29 C 32 30 22 35 19 49 C 23 55 30 57 35 56 C 30 50 32 40 41 29 Z"
          fill="url(#logo-gold-grad)"
        />

        {/* Right Lotus Petal */}
        <path
          d="M59 29 C 68 30 78 35 81 49 C 77 55 70 57 65 56 C 70 50 68 40 59 29 Z"
          fill="url(#logo-gold-grad)"
        />

        {/* Bottom Swash Base */}
        <path
          d="M22 54 C 36 60 64 60 78 54 C 70 57 30 57 22 54 Z"
          fill="url(#logo-gold-grad)"
        />
      </svg>

      {/* ── Brand Typography ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isVert ? 'center' : 'flex-start',
          lineHeight: 1,
        }}
      >
        <span
          className="brand-script gold-gradient-text"
          style={{
            fontFamily: 'var(--font-script, "Great Vibes", cursive)',
            fontSize: isVert ? '4.8rem' : '2.1rem',
            fontWeight: 400,
            lineHeight: isVert ? '1.1' : '1.15', // Adjusted to prevent vertical clipping
            padding: isVert ? '8px 20px' : '4px 10px', // Added padding to prevent horizontal/vertical clipping
            display: 'inline-block',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
            letterSpacing: '0.5px',
          }}
        >
          Madhur
        </span>
        <span
          className="brand-sub"
          style={{
            fontFamily: 'var(--font-body, "Montserrat", sans-serif)',
            fontSize: isVert ? '1.12rem' : '0.62rem',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: isVert ? '7px' : '3.8px',
            textTransform: 'uppercase',
            opacity: 0.85,
            paddingLeft: isVert ? '7px' : '2px',
          }}
        >
          Sweets
        </span>
      </div>
    </div>
  </div>
  );
}
