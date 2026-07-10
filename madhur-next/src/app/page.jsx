'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Loader          from '@/components/Loader';
import MagneticButton  from '@/components/MagneticButton';
import Logo            from '@/components/Logo';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });
const MenuCard        = dynamic(() => import('@/components/MenuCard'),        { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ─── Image Map ─────────────────────────────────────────── */
const IMG = {
  dry:      '/dry_sweets.png',
  khowa:    '/khowa_sweets.png',
  laddu:    '/img_laddu.png',
  chena:    '/img_chena.png',
  kaju:     '/img_kaju.png',
  sawan:    '/sawan_special.png',
  namkeens: '/namkeens_snack.png',
  hero:     '/img_hero.png',
  about:    '/hero_sweets.png',
};

/* ─── Menu Database ─────────────────────────────────────── */
const MENU = [
  // Dry
  { id:'d1',  name:'Soanpapdi',        desc:'Crispy, flaky threads of chickpea flour and ghee — melts instantly on your tongue.',                              categories:['dry'],            icon:'fa-layer-group',          image: `/sweets/d1.png`      },
  { id:'d2',  name:'Manpasand',        desc:'Heart-winning sweet with aromatic cardamom and richly spiced dry fruit fillings.',                                categories:['dry'],            icon:'fa-face-smile',           image: `/sweets/d2.png`      },
  { id:'d3',  name:'Coconut Cookies',  desc:'Crunchy golden biscuits packed with rich desiccated coconut and subtle sweetness.',                               categories:['dry'],            icon:'fa-cookie',               image: `/sweets/d3.png`      },
  { id:'d4',  name:'Dilkushar',        desc:'Heart-melting gram flour sweet slow-cooked in pure ghee with a hint of cardamom.',                                categories:['dry'],            icon:'fa-heart',                image: `/sweets/d4.png`      },
  { id:'d5',  name:'Lal Peda',         desc:'Classic caramelized milk fudge, slow-cooked for hours to achieve deep reddish-brown intensity.',                  categories:['dry'],            icon:'fa-circle',               image: `/sweets/d5.png`      },
  { id:'d6',  name:'Bundia',           desc:'Tiny fried chickpea pearls in cardamom-infused sugar syrup — a timeless Indian delight.',                         categories:['dry'],            icon:'fa-ellipsis',             image: `/sweets/d6.png`      },
  { id:'d7',  name:'Besan Gajak',      desc:'Crispy toasted sesame and besan bars pressed with aromatic jaggery.',                                             categories:['dry'],            icon:'fa-grip-lines',           image: `/sweets/d7.png`      },
  { id:'d8',  name:'Sugar Free Roll',  desc:'Guilt-free luxury rolls from dates, figs, and crushed dry fruits — no added sugar.',                             categories:['dry'],            icon:'fa-shield-halved',        image: `/sweets/d8.png`      },
  { id:'d9',  name:'Ghee Bundiya',     desc:'Traditional bundiya in 100% premium desi ghee — intoxicating nutty aroma in every bite.',                        categories:['dry'],            icon:'fa-droplet',              image: `/sweets/d9.png`      },
  { id:'d10', name:'Tilkut',           desc:'Sesame seeds pounded with jaggery into a crunchy Bihari winter specialty.',                                       categories:['dry'],            icon:'fa-leaf',                 image: `/sweets/d10.png`      },
  { id:'d11', name:'Khowa Madhumilan', desc:'Soft khowa dumplings with sweet honeyed centers, rolled in coconut flakes.',                                      categories:['dry','sawan'],    icon:'fa-circle-nodes',         image: `/sweets/d11.png`      },
  // Khowa
  { id:'k1',  name:'Doda Barfi',       desc:'Rich, grainy chocolate-colored Punjabi sweet with reduced milk and crunchy dry fruits.',                           categories:['khowa'],          icon:'fa-square',               image: `/sweets/k1.png`    },
  { id:'k2',  name:'White Khowa Barfi',desc:'Classic smooth milk fudge, subtly perfumed with cardamom and garnished with silver leaf.',                        categories:['khowa'],          icon:'fa-window-minimize',      image: `/sweets/k2.png`    },
  { id:'k3',  name:'Khowa Kaju Badam', desc:'Premium barfi blending rich khowa with roasted cashews and almonds — melt-in-mouth.',                             categories:['khowa'],          icon:'fa-cube',                 image: `/sweets/k3.png`    },
  { id:'k4',  name:'Kesar Pera',       desc:'Milk fudge wheels infused with precious Kashmiri saffron, giving a luminous golden hue.',                         categories:['khowa'],          icon:'fa-sun',                  image: `/sweets/k4.png`    },
  { id:'k5',  name:'Gopal Bhog',       desc:'Royal chena balls stuffed with spiced khowa and dry fruits — a festive temple-style offering.',                   categories:['khowa'],          icon:'fa-crown',                image: null    },
  { id:'k6',  name:'Ajmeri Kalakand',  desc:'Grainy, deeply caramelized milk cake with a roasted aroma — a Rajasthani classic.',                              categories:['khowa'],          icon:'fa-gem',                  image: `/sweets/k6.png`    },
  { id:'k7',  name:'Kalakand',         desc:'Soft, moist, granular milk cake that dissolves into pure bliss on your palate.',                                  categories:['khowa'],          icon:'fa-snowflake',            image: `/sweets/k7.png`    },
  { id:'k8',  name:'Ghee Fiki Fini',   desc:'Shredded wheat dessert in pure ghee — savory-sweet accompaniment to every meal.',                                categories:['khowa'],          icon:'fa-wind',                 image: `/sweets/k8.png`    },
  // Laddu
  { id:'l1',  name:'Ghee Laddu',       desc:'Aromatic gram flour pearls with pure desi ghee, melon seeds, and warming spices.',                               categories:['laddu'],          icon:'fa-circle',               image: `/sweets/l1.png`    },
  { id:'l2',  name:'Motichoor Laddu',  desc:'Thousands of syrup-filled micro-pearls of chickpea flour — the most delicate laddu.',                            categories:['laddu'],          icon:'fa-bahai',                image: `/sweets/l2.png`    },
  { id:'l3',  name:'Afgani Mewa Laddu',desc:'Luxury energy balls with dates, raisins, almonds, pistachios, and rose petals.',                                 categories:['laddu'],          icon:'fa-globe',                image: `/sweets/l3.png`    },
  { id:'l4',  name:'Nariyal Laddu',    desc:'Coconut snowballs from freshly grated coconut, condensed milk, and cardamom.',                                   categories:['laddu'],          icon:'fa-cloud',                image: null    },
  { id:'l5',  name:'Gond Laddu',       desc:'Nutrient-dense spheres of edible gum, wheat flour, jaggery, ghee, and mixed nuts.',                             categories:['laddu','sawan'],  icon:'fa-shield-heart',         image: `/sweets/l5.png`    },
  { id:'l6',  name:'Besan Laddu',      desc:'Golden spheres of slow-roasted chickpea flour in generous ghee, rolled with sugar.',                             categories:['laddu'],          icon:'fa-circle-dot',           image: `/sweets/l6.png`    },
  // Chena
  { id:'c1',  name:'Dry Rasgulla',     desc:'Spongy chena balls drained to a semi-dry glaze, condensing all the sweetness.',                                  categories:['chena'],          icon:'fa-circle',               image: `/sweets/c1.png`    },
  { id:'c2',  name:'Dry Cham Cham',    desc:'Chena logs stuffed with mawa flakes and dry fruits, finished with a sugar glaze.',                               categories:['chena','sawan'],  icon:'fa-egg',                  image: `/sweets/c2.png`    },
  { id:'c3',  name:'Raskadam',         desc:'A rasgulla hiding inside crunchy crumbled khowa — two textures in one bite.',                                    categories:['chena'],          icon:'fa-bullseye',             image: `/sweets/c3.png`    },
  { id:'c4',  name:'Kheer Kadam',      desc:'Saffron rasgulla encased in a crumbling khowa shell — a true Bengali royal confection.',                         categories:['chena'],          icon:'fa-asterisk',             image: `/sweets/c4.png`    },
  { id:'c5',  name:'Kala Jamun',       desc:'Deep-fried milk balls with a dark, crisp shell soaked in rose-cardamom syrup.',                                  categories:['chena'],          icon:'fa-moon',                 image: `/sweets/c5.png`    },
  { id:'c6',  name:'Rasmalai',         desc:'Spongy chena discs in saffron-cardamom milk — royalty in every spoonful.',                                       categories:['chena','sawan'],  icon:'fa-fill-drip',            image: `/sweets/c6.png`    },
  { id:'c7',  name:'Rasila Gulab Jamun',desc:'Classic golden dumplings in aromatic cardamom syrup — impossibly soft at the center.',                          categories:['chena','sawan'],  icon:'fa-circle-radiation',     image: `/sweets/c7.png`    },
  { id:'c8',  name:'Rasgulla',         desc:"The iconic spongy, juicy cottage cheese dumpling in light sugar syrup — Bengal's greatest gift.",                categories:['chena','sawan'],  icon:'fa-circle',               image: `/sweets/c8.png`    },
  { id:'c9',  name:'Raj Bhog',         desc:'Oversized golden rasgullas stuffed with dry fruits and saffron — fit for kings.',                                categories:['chena'],          icon:'fa-ring',                 image: `/sweets/c9.png`    },
  { id:'c10', name:'Gur Rasgulla',     desc:'Seasonal rasgullas sweetened with date palm jaggery for an earthy caramel sweetness.',                           categories:['chena'],          icon:'fa-earth-asia',           image: `/sweets/c10.png`    },
  { id:'c11', name:'Cham Cham',        desc:'Vibrant Bengali cylinders topped with sweetened cream and coconut flakes.',                                       categories:['chena'],          icon:'fa-capsules',             image: `/sweets/c11.png`    },
  { id:'c12', name:'Chena Sandwich',   desc:'Pillowy chena pockets filled with saffron malai and crunchy pistachio slivers.',                                 categories:['chena'],          icon:'fa-folder',               image: `/sweets/c12.png`    },
  { id:'c13', name:'Malai Chops',      desc:'Chena patties halved and generously layered with whipped sweet cream inside.',                                   categories:['chena'],          icon:'fa-chart-pie',            image: `/sweets/c13.png`    },
  { id:'c14', name:'Lengcha',          desc:'Elongated dark-fried dumplings from Shaktigarh — bathed in rich syrup.',                                         categories:['chena'],          icon:'fa-lines-leaning',        image: `/sweets/c14.png`    },
  // Kaju
  { id:'j1',  name:'Kaju Barfi',       desc:'Iconic silver leaf-topped diamond of cashew meal and sugar — the definitive premium Indian sweet.',               categories:['kaju'],           icon:'fa-diamond',              image: `/sweets/j1.png`     },
  { id:'j2',  name:'Kaju Pista Roll',  desc:'Dual-layered roll with vivid green pistachio heart encased in smooth cashew shell.',                             categories:['kaju'],           icon:'fa-scroll',               image: `/sweets/j2.png`     },
  { id:'j3',  name:'Kaju Gujiya',      desc:'Crescent cashew dough pockets stuffed with spiced khowa and dry fruits.',                                        categories:['kaju'],           icon:'fa-moon',                 image: `/sweets/j3.png`     },
  { id:'j4',  name:'Kaju Strawberry',  desc:'Artistically hand-sculpted strawberry shapes made from cashew meal with natural colors.',                        categories:['kaju'],           icon:'fa-heart',                image: `/sweets/j4.png`     },
  { id:'j5',  name:'Kaju Anjeer Barfi',desc:'Naturally sweet barfi layered with cashew meal and plump honeyed dried figs — no sugar added.',                  categories:['kaju'],           icon:'fa-layer-group',          image: `/sweets/j5.png`     },
  // Sawan
  { id:'s1',  name:'Mini Samosa',      desc:'Bite-sized crispy pastries with spiced potato-pea masala — perfect monsoon snacking.',                           categories:['sawan'],          icon:'fa-triangle-exclamation', image: `/sweets/s1.png`    },
  { id:'s2',  name:'Kachori',          desc:'Flaky deep-fried breads with spiced lentil stuffing — a Rajasthani classic served piping hot.',                  categories:['sawan'],          icon:'fa-hockey-puck',          image: `/sweets/s2.png`    },
  { id:'s3',  name:'Dhokla',           desc:'Fermented chickpea steamed cakes with mustard-curry leaf tempering — light and tangy.',                          categories:['sawan'],          icon:'fa-border-all',           image: `/sweets/s3.png`    },
  { id:'s4',  name:'Dahi',             desc:'Thick, creamy house-set yogurt — the perfect cooling companion to all Sawan specials.',                          categories:['sawan'],          icon:'fa-glass-water',          image: null    },
  { id:'s5',  name:'Samosa',           desc:'Iconic golden pastry triangles with spiced potatoes and garden peas — a timeless crowd-pleaser.',                categories:['sawan'],          icon:'fa-shapes',               image: `/sweets/s5.png`    },
  // Namkeens
  { id:'n1',  name:'Agra Mixture',     desc:'Premium blend of crispy sev, whole nuts, lentils, and a secret spice blend from Yamuna banks.',                  categories:['namkeens'],       icon:'fa-cubes',                image: `/sweets/n1.png` },
  { id:'n2',  name:'Lalpari Mixture',  desc:'Bold fiery red mixture with extra-crunchy flakes — for the daring palate.',                                      categories:['namkeens','sawan'],icon:'fa-pepper-hot',          image: `/sweets/n2.png` },
  { id:'n3',  name:'Suhali',           desc:'Crispy multilayered savory mathris with carom seeds — quintessential Indian teatime biscuit.',                   categories:['namkeens'],       icon:'fa-compact-disc',         image: `/sweets/n3.png` },
  { id:'n4',  name:'Mota Namkeen',     desc:'Thick-cut crunchy chickpea noodles in aromatic spice powders.',                                                  categories:['namkeens','sawan'],icon:'fa-border-all',          image: null },
  { id:'n5',  name:'Karela Namkeen',   desc:'Bitter-gourd-shaped pastries spiced with black pepper and dried mango powder.',                                  categories:['namkeens','sawan'],icon:'fa-dna',                 image: `/sweets/n5.png` },
  { id:'n6',  name:'Mini Namkeen',     desc:'Micro-savory bites perfectly salted and lightly spiced — ideal between-meal snacking.',                          categories:['namkeens','sawan'],icon:'fa-braille',             image: null },
  { id:'n7',  name:'Plain Bhujia',     desc:"Ultra-fine moth bean noodles — the purist's namkeen with minimal spice.",                                        categories:['namkeens'],       icon:'fa-bars',                 image: `/sweets/n7.png` },
  { id:'n8',  name:'Masala Bhujia',    desc:'Spicy tangy noodles with red chili, dry mango powder, and black salt.',                                          categories:['namkeens','sawan'],icon:'fa-burst',               image: `/sweets/n8.png` },
  { id:'n9',  name:'Salted Kaju',      desc:'Premium whole cashews roasted in fragrant desi ghee — simple luxury.',                                           categories:['namkeens'],       icon:'fa-circle',               image: `/sweets/n9.png` },
  { id:'n10', name:'Masala Kaju',      desc:'Crispy cashews coated in dry mango powder, red chili, and chaat masala.',                                        categories:['namkeens'],       icon:'fa-fire-flame-curved',    image: `/sweets/n10.png` },
  { id:'n11', name:'Chips',            desc:'Ultra-thin hand-sliced potato chips, flash-fried and lightly seasoned.',                                         categories:['namkeens'],       icon:'fa-certificate',          image: `/sweets/n11.png` },
];

const CATS = [
  { id:'all',      label:'All Items',     icon:'fa-star',                bannerTitle: null },
  { id:'dry',      label:'Dry Sweets',    icon:'fa-cookie',              bannerTitle:'Artisan Dry Sweets',      bannerDesc:'Handcrafted confections made with pure desi ghee, roasted flours, and aromatic spices.',   bannerImg: IMG.dry      },
  { id:'khowa',    label:'Khowa Sweets',  icon:'fa-cheese',              bannerTitle:'Rich Khowa Collection',   bannerDesc:'Slow-cooked milk solids transformed into velvety barfis, pedas — a testament to craft.',   bannerImg: IMG.khowa    },
  { id:'laddu',    label:'Laddu Sweets',  icon:'fa-circle',              bannerTitle:'The Laddu Kingdom',       bannerDesc:'Spheres of joy — from the fine Motichoor to the energy-dense Gond Laddu.',               bannerImg: IMG.laddu    },
  { id:'chena',    label:'Chena Sweets',  icon:'fa-cookie-bite',         bannerTitle:'Pure Chena Masterpieces', bannerDesc:'Delicate cottage cheese through ancient Bengali techniques — rasgullas, rasmalais, royal confections.', bannerImg: IMG.chena    },
  { id:'kaju',     label:'Kaju Sweets',   icon:'fa-diamond',             bannerTitle:'Royal Kaju Collection',   bannerDesc:'Premium cashew meal shaped into jewels — diamond barfis to intricate sculpted forms.',   bannerImg: IMG.kaju     },
  { id:'sawan',    label:'Sawan Special', icon:'fa-cloud-showers-heavy', bannerTitle:'Monsoon Sawan Special',   bannerDesc:'Festive flavors for the sacred monsoon — crispy, spicy, tangy, and comforting.',         bannerImg: IMG.sawan    },
  { id:'namkeens', label:'Namkeens',      icon:'fa-bowl-food',           bannerTitle:'Crispy Savory Namkeens',  bannerDesc:'The finest spiced snack tradition — mixtures, bhujias, mathris, and roasted cashews.',   bannerImg: IMG.namkeens },
];

/* ─── App ─────────────────────────────────────────────────── */
export default function Home() {
  const [loaded,    setLoaded]    = useState(false);
  const [activeCat, setActiveCat] = useState('all');
  const [scrolled,  setScrolled]  = useState(false);

  const cursorRef  = useRef(null);
  const counterRef = useRef(null);
  const heroRef    = useRef(null);

  /* ── Cursor follower */
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    const move = (e) => {
      gsap.to(el, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  /* ── Header shrink */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── Main GSAP — fires after loader done */
  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {

      /* Hero badge */
      gsap.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
      gsap.from('.hero-badge', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.1 });

      /* Hero script word animation (Madhur) */
      gsap.from('.hero-title-script', {
        y: '50%',
        opacity: 0,
        rotateX: -45,
        duration: 0.95,
        ease: 'power3.out',
        delay: 0.15,
      });

      /* Hero letter split (Sweets) */
      const heroWords = heroRef.current?.querySelectorAll('.split-word');
      if (heroWords) {
        heroWords.forEach((wordEl, wi) => {
          const chars = wordEl.querySelectorAll('.split-char');
          gsap.from(chars, {
            y: '130%',
            opacity: 0,
            rotateX: -90,
            stagger: 0.04,
            duration: 0.75,
            ease: 'power3.out',
            delay: wi * 0.28 + 0.45,
          });
        });
      }

      /* Divider line draw */
      gsap.to('.gold-divider', { opacity: 1, scaleX: 1, duration: 0.9, ease: 'power3.out', delay: 0.7 });
      gsap.from('.gold-divider', { scaleX: 0, duration: 0.9, ease: 'power3.out', delay: 0.7 });

      /* Tagline + cue */
      gsap.to('.hero-tagline', { opacity: 0.6, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.1 });
      gsap.from('.hero-tagline', { y: 20, duration: 0.7, ease: 'power3.out', delay: 1.1 });
      gsap.to('.scroll-cue', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.4 });
      gsap.from('.scroll-cue', { y: 20, duration: 0.7, ease: 'power3.out', delay: 1.4 });

      /* Section headers */
      gsap.utils.toArray('.section-header').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 82%' },
          y: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
        });
      });

      /* Pills stagger */
      const pills = document.querySelectorAll('.pill');
      gsap.to(pills, {
        scrollTrigger: { trigger: '.cat-pills', start: 'top 88%' },
        y: 0, opacity: 1, stagger: 0.07, duration: 0.8, ease: 'back.out(1.7)',
      });

      /* About parallax */
      gsap.from('.about-img-wrap', {
        scrollTrigger: { trigger: '.about-section', start: 'top 78%' },
        x: -100, opacity: 0, duration: 1.3, ease: 'power3.out',
      });
      gsap.to('.about-img-wrap', {
        scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1.8 },
        yPercent: -10,
      });
      gsap.from('.about-text-side', {
        scrollTrigger: { trigger: '.about-section', start: 'top 78%' },
        x: 100, opacity: 0, duration: 1.3, ease: 'power3.out',
      });

      /* Stat boxes */
      gsap.utils.toArray('.stat-box').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 92%' },
          y: 40, opacity: 0, duration: 0.8, delay: i * 0.13, ease: 'back.out(1.5)',
        });
      });

      /* Scrub counter */
      if (counterRef.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 10,
          scrollTrigger: { trigger: counterRef.current, start: 'top 88%', end: 'top 40%', scrub: 1.2 },
          onUpdate() {
            if (counterRef.current) counterRef.current.textContent = `${Math.round(obj.val)}+`;
          },
        });
      }

      /* Hero glow scrub */
      gsap.to('.hero-glow', {
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        scale: 1.8, opacity: 0,
      });

      /* Footer clip reveal */
      gsap.from('.site-footer', {
        scrollTrigger: { trigger: '.site-footer', start: 'top 96%' },
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.2, ease: 'power3.out',
      });

    });

    return () => ctx.revert();
  }, [loaded]);

  /* ── Card pop on category change */
  useEffect(() => {
    if (!loaded) return;
    const cards = document.querySelectorAll('.sweet-card');
    if (!cards.length) return;

    const tl = gsap.timeline({ overwrite: true });
    tl.to(cards, {
      scale: 0.8,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      stagger: 0.01,
    })
    .to(cards, {
      scale: 1,
      opacity: 1,
      duration: 0.75,
      ease: 'back.out(1.6)',
      stagger: 0.035,
    });
  }, [activeCat, loaded]);

  const handleLoaderDone = useCallback(() => setLoaded(true), []);

  const catMeta = CATS.find(c => c.id === activeCat);
  const items   = activeCat === 'all' ? MENU : MENU.filter(i => i.categories.includes(activeCat));

  return (
    <>
      {!loaded && <Loader onComplete={handleLoaderDone} />}

      {/* Cursor glow */}
      <div className="cursor-glow" ref={cursorRef} />

      <ThreeBackground />

      {/* ── HEADER ──────────────────────────────────── */}
      <header className={`site-header ${scrolled ? 'shrunk' : ''}`}>
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo layout="horizontal" />
        </div>

        <nav className="header-nav">
          <a href="#menu"    className="nav-a">Menu</a>
          <a href="#about"   className="nav-a">About</a>
          <a href="#contact" className="nav-a">Contact</a>
        </nav>

        <MagneticButton as="a" href="tel:+919835568135" className="header-call" strength={0.28}>
          <i className="fa-solid fa-phone" /> +91 98355 68135
        </MagneticButton>
      </header>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow-2" />

        <div className="hero-inner" ref={heroRef}>
          <div className="hero-badge" style={{ opacity: 0, transform: 'translateY(40px)' }}>
            <i className="fa-solid fa-crown" style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.8))' }} />
            Est. 2016 · Dhanbad · Jharkhand
          </div>

          {/* Split heading */}
          <h1 className="hero-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
            {/* "Madhur" - Rendered as a single coherent script string to maintain cursive letter-joining */}
            <span className="hero-title-script gold-gradient-text" style={{
              fontFamily: 'var(--font-script, "Great Vibes", cursive)',
              fontSize: 'clamp(8rem, 18vw, 13.5rem)', // Resized to be larger and more prominent
              fontWeight: 400,
              textTransform: 'none',
              lineHeight: 1.1, // Increased line-height to prevent vertical clipping
              padding: '15px 45px', // Added padding to prevent horizontal/vertical clipping of script sweeps
              display: 'inline-block',
              filter: 'drop-shadow(0 0 25px rgba(212,175,55,0.4)) drop-shadow(0 8px 30px rgba(212,175,55,0.2))',
            }}>
              Madhur
            </span>
            {/* "Sweets" */}
            <span className="split-word" style={{
              fontFamily: 'var(--font-body, "Montserrat", sans-serif)',
              fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '14px',
              textTransform: 'uppercase',
              color: 'var(--text)',
              opacity: 0.9,
              paddingLeft: '14px',
            }}>
              {'Sweets'.split('').map((ch, i) => (
                <span key={i} className="split-char"
                  style={{
                    display: 'inline-block',
                  }}
                >{ch}</span>
              ))}
            </span>
          </h1>

          <div className="gold-divider" style={{ opacity: 0 }}>
            <span className="line" />
            <span className="gem"><i className="fa-solid fa-gem" /></span>
            <span className="line" />
          </div>

          <p className="hero-tagline" style={{ opacity: 0 }}>
            Pure Taste &nbsp;•&nbsp; Fresh Every Day &nbsp;•&nbsp; Est. 2016
          </p>
        </div>

        <div className="scroll-cue" style={{ opacity: 0 }}>
          <span>Scroll</span>
          <div className="scroll-mouse" />
        </div>
      </section>

      {/* ── SHOWCASE ────────────────────────────────── */}
      <section className="showcase" id="menu">
        <div className="section-header">
          <div className="section-label">
            <i className="fa-solid fa-crown" />
            The Royal Menu
          </div>
          <h2 className="section-title">Handcrafted Delicacies</h2>
          <p className="section-sub">
            Generations of tradition, premium ingredients, and unmatched craftsmanship
            — with a 3D look at every creation.
          </p>
        </div>

        {/* Category Pills */}
        <div className="cat-pills">
          {CATS.map(cat => (
            <MagneticButton
              key={cat.id}
              as="button"
              className={`pill ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
              strength={0.22}
            >
              <i className={`fa-solid ${cat.icon}`} />
              {cat.label}
            </MagneticButton>
          ))}
        </div>

        {/* Category Banner */}
        {catMeta?.bannerTitle && (
          <div className="cat-banner" key={activeCat}>
            <div className="cat-banner-text">
              <div className="cat-banner-tag">
                <i className={`fa-solid ${catMeta.icon}`} />
                {catMeta.label}
              </div>
              <h3 className="cat-banner-title">{catMeta.bannerTitle}</h3>
              <p className="cat-banner-desc">{catMeta.bannerDesc}</p>
            </div>
            <div className="cat-banner-img">
              <Image src={catMeta.bannerImg} alt={catMeta.bannerTitle} fill sizes="50vw"
                style={{ objectFit: 'cover', filter: 'brightness(0.8) saturate(1.3)' }} />
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="sweets-grid">
          {items.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────── */}
      <section className="about-section" id="about">
        <div className="about-grid">

          <div className="about-visual">
            <div className="about-gold-ring" />
            <div className="about-gold-ring-2" />
            <div className="about-img-wrap">
              <Image src={IMG.hero} alt="Madhur Sweets Heritage" fill
                sizes="40vw"
                style={{ objectFit: 'cover', filter: 'brightness(0.8) saturate(1.2)' }}
                priority />
            </div>
          </div>

          <div className="about-text-side">
            <div className="about-text-badge">
              <i className="fa-solid fa-scroll" /> Our Heritage
            </div>
            <h2 className="about-title">Crafting Sweet Memories Since 2016</h2>
            <p className="about-lead">
              At Madhur Sweets, sweet making is not just a business —<br />
              it is a sacred art form passed through generations.
            </p>
            <p className="about-body">
              Located opposite the Police Line Gate in Hirapur, Dhanbad, we have been
              serving happiness daily for over a decade. Our master chefs use
              time-honored recipes, 100% pure ingredients, and impeccable hygiene standards
              to deliver absolute freshness in every single bite.
            </p>

            <div className="about-stats">
              <div className="stat-box">
                <div className="stat-icon"><i className="fa-solid fa-cow" /></div>
                <div className="stat-label">100% Pure Milk &amp; Ghee</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="fa-solid fa-hand-holding-heart" /></div>
                <div className="stat-label">Fresh Every Single Day</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="fa-solid fa-award" /></div>
                <span className="stat-number" ref={counterRef}>0+</span>
                <div className="stat-label">Years of Excellence</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="site-footer" id="contact">
        <div className="footer-top">

          <div>
            <div className="brand" style={{ marginBottom: 20 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo layout="horizontal" />
            </div>
            <p className="footer-brand-desc">
              Spreading pure taste and traditional sweetness throughout Dhanbad.
              Taste the heritage of Bengal and North Indian sweet craftsmanship in every bite.
            </p>
            <div className="social-row">
              <a href="#" className="social-btn"><i className="fa-brands fa-facebook-f" /></a>
              <a href="#" className="social-btn"><i className="fa-brands fa-instagram" /></a>
              <a href="#" className="social-btn"><i className="fa-brands fa-whatsapp" /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Find Us</h4>
            <div className="contact-entry">
              <i className="fa-solid fa-phone" />
              <div>
                <a href="tel:+919835568135">+91 98355 68135</a>
                <a href="tel:+919835568129">+91 98355 68129</a>
              </div>
            </div>
            <div className="contact-entry">
              <i className="fa-solid fa-location-dot" />
              <p>Opposite Police Line Gate,<br />Hirapur, Po, Sadar,<br />Dhanbad, Jharkhand 826007</p>
            </div>
            <div className="delivery-row">
              <p>Order Online Via</p>
              <div className="delivery-chips">
                <span className="d-chip swiggy"><i className="fa-solid fa-motorcycle" /> Swiggy</span>
                <span className="d-chip zomato"><i className="fa-solid fa-fire" /> Zomato</span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Love Our Sweets?</h4>
            <div className="qr-feedback">
              <div className="qr-box">
                <div className="qr-g-icon"><i className="fa-brands fa-google" /></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://search.google.com/local/writereview?placeid=ChIJ0er1oZ889TkR5Dq_c1F_4-w"
                  alt="Google Review QR"
                  width={78} height={78}
                />
              </div>
              <div className="qr-text">
                <strong>Rate &amp; Review Us</strong>
                <p>Scan to leave a Google review. Your feedback helps us serve you better!</p>
              </div>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Madhur Sweets · All Rights Reserved · Crafted with{' '}
              <i className="fa-solid fa-heart" style={{ color: 'var(--gold)' }} />
            </span>
            <a href="#menu">↑ Back to Menu</a>
          </div>
        </div>
      </footer>
    </>
  );
}
