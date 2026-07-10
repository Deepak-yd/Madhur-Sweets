import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ThreeBackground from './components/ThreeBackground';
import SweetCard from './components/MenuCard';

// ─── Assets ───────────────────────────────────────────────
import heroImg      from './assets/hero_sweets.png';
import chenaImg     from './assets/rasgulla_chena.png';
import kajuImg      from './assets/kaju_katli.png';
import namkeensImg  from './assets/namkeens_snack.png';
import ladduImg     from './assets/laddu_sweets.png';
import khowImg      from './assets/khowa_sweets.png';
import dryImg       from './assets/dry_sweets.png';
import sawanImg     from './assets/sawan_special.png';

// ─── Menu Database ────────────────────────────────────────
const MENU = [
  // ── Dry Sweets
  { id:'d1', name:'Soanpapdi',      desc:'Crispy, flaky threads made with chickpea flour, ghee, and aromatic cardamom. Melts instantly on your tongue.',                     categories:['dry'],           icon:'fa-layer-group',        image: dryImg  },
  { id:'d2', name:'Manpasand',      desc:'Heart-winning traditional sweet featuring aromatic cardamom and richly spiced dry fruit fillings inside soft dough.',               categories:['dry'],           icon:'fa-face-smile',         image: dryImg  },
  { id:'d3', name:'Coconut Cookies',desc:'Crunchy golden baked biscuits packed with rich desiccated coconut flavor and subtle sweetness.',                                    categories:['dry'],           icon:'fa-cookie',             image: dryImg  },
  { id:'d4', name:'Dilkushar',      desc:'Heart-melting gram flour sweet slow-cooked in pure ghee with milk solids and a hint of cardamom.',                                  categories:['dry'],           icon:'fa-heart',              image: dryImg  },
  { id:'d5', name:'Lal Peda',       desc:'Classic caramelized milk fudge, slow-cooked over hours to achieve a deep reddish-brown color and intense flavor.',                  categories:['dry'],           icon:'fa-circle',             image: dryImg  },
  { id:'d6', name:'Bundia',         desc:'Tiny fried chickpea flour pearls sweetened with pure cardamom-infused sugar syrup, a timeless Indian delight.',                    categories:['dry'],           icon:'fa-ellipsis',           image: dryImg  },
  { id:'d7', name:'Besan Gajak',    desc:'Crispy winter treat combining toasted sesame seeds, besan flour, and aromatic jaggery pressed into golden bars.',                   categories:['dry'],           icon:'fa-grip-lines',         image: dryImg  },
  { id:'d8', name:'Sugar Free Roll',desc:'Guilt-free luxury rolls crafted from natural dates, figs, and crushed dry fruits — no added sugar needed.',                         categories:['dry'],           icon:'fa-shield-halved',      image: dryImg  },
  { id:'d9', name:'Ghee Bundiya',   desc:'Traditional bundiya prepared in 100% premium desi ghee, releasing an intoxicating nutty aroma with every bite.',                   categories:['dry'],           icon:'fa-droplet',            image: dryImg  },
  { id:'d10',name:'Tilkut',         desc:'Sesame seeds pounded with jaggery into a crunchy, naturally sweet Bihari winter specialty.',                                        categories:['dry'],           icon:'fa-leaf',               image: dryImg  },
  { id:'d11',name:'Khowa Madhumilan',desc:'Soft khowa dumplings filled with sweet honeyed centers, rolled in coconut flakes for a textured bite.',                           categories:['dry','sawan'],   icon:'fa-circle-nodes',       image: dryImg  },

  // ── Khowa Sweets
  { id:'k1', name:'Doda Barfi',     desc:'Rich, grainy chocolate-colored Punjabi sweet made with reduced milk and laden with crunchy dry fruits.',                            categories:['khowa'],         icon:'fa-square',             image: khowImg },
  { id:'k2', name:'White Khowa Barfi',desc:'Classic smooth milk fudge from fresh condensed khowa, subtly perfumed with cardamom and garnished with silver leaf.',            categories:['khowa'],         icon:'fa-window-minimize',    image: khowImg },
  { id:'k3', name:'Khowa Kaju Badam',desc:'Premium barfi blending rich khowa milk solids with roasted cashews and almonds for a nutty, melt-in-mouth experience.',           categories:['khowa'],         icon:'fa-cube',               image: khowImg },
  { id:'k4', name:'Kesar Pera',     desc:'Traditional milk fudge wheels infused with precious Kashmiri saffron, giving every disc a luminous golden hue.',                   categories:['khowa'],         icon:'fa-sun',                image: khowImg },
  { id:'k5', name:'Gopal Bhog',     desc:'Royal golden chena balls stuffed with spiced khowa and dry fruit centers — a festive temple-style offering.',                       categories:['khowa'],         icon:'fa-crown',              image: khowImg },
  { id:'k6', name:'Ajmeri Kalakand',desc:'Grainy, deeply caramelized milk cake with a roasted aroma and fudgy texture — a Rajasthani classic.',                              categories:['khowa'],         icon:'fa-gem',                image: khowImg },
  { id:'k7', name:'Kalakand',       desc:'Soft, moist, granular milk cake sweet that dissolves into pure bliss the moment it hits your palate.',                              categories:['khowa'],         icon:'fa-snowflake',          image: khowImg },
  { id:'k8', name:'Ghee Fiki Fini', desc:'Traditional shredded wheat dessert cooked low and slow in pure ghee — served unsweetened as a savory-sweet accompaniment.',        categories:['khowa'],         icon:'fa-wind',               image: khowImg },

  // ── Laddu Sweets
  { id:'l1', name:'Ghee Laddu',     desc:'Aromatic gram flour pearls hand-rolled with pure desi ghee, melon seeds, and a secret blend of warming spices.',                   categories:['laddu'],         icon:'fa-circle',             image: ladduImg },
  { id:'l2', name:'Motichoor Laddu',desc:'Thousands of syrup-filled micro-pearls of chickpea flour compressed into the most delicate, fine-grained laddu spheres.',          categories:['laddu'],         icon:'fa-bahai',              image: ladduImg },
  { id:'l3', name:'Afgani Mewa Laddu',desc:'Luxury no-cook energy balls loaded with crushed dates, raisins, almonds, pistachios, and fragrant rose petals.',                 categories:['laddu'],         icon:'fa-globe',              image: ladduImg },
  { id:'l4', name:'Nariyal Laddu',  desc:'Traditional coconut snowballs rolled from freshly grated coconut, condensed milk, and delicate cardamom.',                          categories:['laddu'],         icon:'fa-cloud',              image: ladduImg },
  { id:'l5', name:'Gond Laddu',     desc:'Nutrient-dense winter sweet spheres made with edible gum resin, wheat flour, jaggery, ghee, and mixed nuts.',                      categories:['laddu','sawan'], icon:'fa-shield-heart',       image: ladduImg },
  { id:'l6', name:'Besan Laddu',    desc:'Golden spheres crafted by slow-roasting chickpea flour in generous ghee until deeply fragrant, then rolled with sugar.',           categories:['laddu'],         icon:'fa-circle-dot',         image: ladduImg },

  // ── Chena Sweets
  { id:'c1', name:'Dry Rasgulla',   desc:'Spongy cottage cheese balls cooked in sugar syrup and drained to a semi-dry glaze, condensing the sweetness.',                     categories:['chena'],         icon:'fa-circle',             image: chenaImg },
  { id:'c2', name:'Dry Cham Cham',  desc:'Oblong chena logs stuffed with sweetened mawa flakes and slivers of dry fruits, finished with a sugar glaze.',                     categories:['chena','sawan'], icon:'fa-egg',                image: chenaImg },
  { id:'c3', name:'Raskadam',       desc:'A double treat: a soft rasgulla hiding inside a crunchy, crumbled khowa exterior — two textures in one bite.',                     categories:['chena'],         icon:'fa-bullseye',           image: chenaImg },
  { id:'c4', name:'Kheer Kadam',    desc:'Exquisite saffron rasgulla encased in a crumbling shell of pure khowa — a true Bengali royal confection.',                         categories:['chena'],         icon:'fa-asterisk',           image: chenaImg },
  { id:'c5', name:'Kala Jamun',     desc:'Deep-fried milk solid balls with an intensely dark, crisp shell soaked in rose-cardamom syrup.',                                   categories:['chena'],         icon:'fa-moon',               image: chenaImg },
  { id:'c6', name:'Rasmalai',       desc:'Velvety spongy chena discs flattened and soaked in thickened saffron-cardamom milk — royalty in every spoonful.',                  categories:['chena','sawan'], icon:'fa-fill-drip',          image: chenaImg },
  { id:'c7', name:'Rasila Gulab Jamun',desc:'Classic golden-brown milk dumplings cooked in aromatic warm cardamom syrup, impossibly soft at the center.',                    categories:['chena','sawan'], icon:'fa-circle-radiation',   image: chenaImg },
  { id:'c8', name:'Rasgulla',       desc:'The iconic spongy, juicy white cottage cheese dumpling in light fragrant sugar syrup — Bengal\'s greatest gift to India.',         categories:['chena','sawan'], icon:'fa-circle',             image: chenaImg },
  { id:'c9', name:'Raj Bhog',       desc:'Royal oversized golden rasgullas stuffed with dry fruits and flavored with premium saffron — fit for kings.',                      categories:['chena'],         icon:'fa-ring',               image: chenaImg },
  { id:'c10',name:'Gur Rasgulla',   desc:'Seasonal specialty: rasgullas sweetened with date palm jaggery for a distinctive earthy, caramel-like sweetness.',                 categories:['chena'],         icon:'fa-earth-asia',         image: chenaImg },
  { id:'c11',name:'Cham Cham',      desc:'Vibrant Bengali sweet shaped like colorful cylinders, topped with sweetened cream and coconut flakes.',                             categories:['chena'],         icon:'fa-capsules',           image: chenaImg },
  { id:'c12',name:'Chena Sandwich', desc:'Pillowy chena pockets sliced open and filled with sweet saffron malai and crunchy pistachio slivers.',                             categories:['chena'],         icon:'fa-folder',             image: chenaImg },
  { id:'c13',name:'Malai Chops',    desc:'Spongy chena patties soaked in syrup, halved, and generously layered with whipped sweet cream inside.',                            categories:['chena'],         icon:'fa-chart-pie',          image: chenaImg },
  { id:'c14',name:'Lengcha',        desc:'Elongated dark-fried sweet dumplings from Shaktigarh — made with flour and khowa, bathed in rich syrup.',                          categories:['chena'],         icon:'fa-lines-leaning',      image: chenaImg },

  // ── Kaju Sweets
  { id:'j1', name:'Kaju Barfi',     desc:'Iconic silver leaf-topped diamond of cashew meal and sugar — the definitive premium Indian sweet.',                                  categories:['kaju'],          icon:'fa-diamond',            image: kajuImg },
  { id:'j2', name:'Kaju Pista Roll',desc:'Dual-layered roll with a vivid green pistachio heart encased in a smooth, pale cashew shell.',                                     categories:['kaju'],          icon:'fa-scroll',             image: kajuImg },
  { id:'j3', name:'Kaju Gujiya',    desc:'Crescent-shaped cashew dough pockets stuffed with spiced khowa and dry fruits — a festival staple.',                               categories:['kaju'],          icon:'fa-moon',               image: kajuImg },
  { id:'j4', name:'Kaju Strawberry',desc:'Artistically hand-sculpted strawberry shapes made from cashew meal, tinted with natural colors.',                                   categories:['kaju'],          icon:'fa-heart',              image: kajuImg },
  { id:'j5', name:'Kaju Anjeer Barfi',desc:'Naturally sweet barfi layered with premium cashew meal and plump, honeyed dried figs — no sugar added.',                         categories:['kaju'],          icon:'fa-layer-group',        image: kajuImg },

  // ── Sawan Specials
  { id:'s1', name:'Mini Samosa',    desc:'Bite-sized crispy triangular pastries filled with spiced potato-pea masala — perfect monsoon snacking.',                            categories:['sawan'],         icon:'fa-triangle-exclamation', image: sawanImg },
  { id:'s2', name:'Kachori',        desc:'Flaky deep-fried breads bursting with spiced lentil stuffing — a Rajasthani classic served piping hot.',                           categories:['sawan'],         icon:'fa-hockey-puck',        image: sawanImg },
  { id:'s3', name:'Dhokla',         desc:'Spongy, fermented chickpea steamed cakes with a mustard-curry leaf tempering — light, tangy, and irresistible.',                   categories:['sawan'],         icon:'fa-border-all',         image: sawanImg },
  { id:'s4', name:'Dahi',           desc:'Thick, creamy house-set yogurt — cooling, probiotic, and the perfect partner to all Sawan specials.',                              categories:['sawan'],         icon:'fa-glass-water',        image: sawanImg },
  { id:'s5', name:'Samosa',         desc:'Iconic golden pastry triangles loaded with perfectly spiced potatoes and garden peas — a timeless crowd-pleaser.',                  categories:['sawan'],         icon:'fa-shapes',             image: sawanImg },

  // ── Namkeens
  { id:'n1', name:'Agra Mixture',   desc:'Premium savory blend of crispy sev, whole nuts, fried lentils, and a secret spice blend from the banks of Yamuna.',               categories:['namkeens'],      icon:'fa-cubes',              image: namkeensImg },
  { id:'n2', name:'Lalpari Mixture',desc:'Bold spicy mixture with a signature fiery red seasoning and extra-crunchy flakes — for the daring palate.',                        categories:['namkeens','sawan'],icon:'fa-pepper-hot',        image: namkeensImg },
  { id:'n3', name:'Suhali',         desc:'Crispy, multilayered savory mathris spiced with carom seeds — the quintessential Indian teatime biscuit.',                         categories:['namkeens'],      icon:'fa-compact-disc',       image: namkeensImg },
  { id:'n4', name:'Mota Namkeen',   desc:'Thick-cut crunchy chickpea noodles tossed generously in aromatic spice powders.',                                                  categories:['namkeens','sawan'],icon:'fa-border-all',        image: namkeensImg },
  { id:'n5', name:'Karela Namkeen', desc:'Artistically twisted bitter-gourd-shaped pastries, spiced with black pepper and dried mango powder.',                              categories:['namkeens','sawan'],icon:'fa-dna',               image: namkeensImg },
  { id:'n6', name:'Mini Namkeen',   desc:'Assorted micro-savory bites — perfectly salted and lightly spiced — ideal for between-meal snacking.',                             categories:['namkeens','sawan'],icon:'fa-braille',           image: namkeensImg },
  { id:'n7', name:'Plain Bhujia',   desc:'Ultra-fine, crunchy moth bean and chickpea flour noodles — the purist\'s namkeen, flavored with minimal spice.',                   categories:['namkeens'],      icon:'fa-bars',               image: namkeensImg },
  { id:'n8', name:'Masala Bhujia',  desc:'Spicy, tangy thin noodle snack infused with red chili, dry mango powder, and black salt for a punch of flavor.',                  categories:['namkeens','sawan'],icon:'fa-burst',             image: namkeensImg },
  { id:'n9', name:'Salted Kaju',    desc:'Premium whole cashews, gently roasted and lightly salted in fragrant desi ghee — simple luxury.',                                  categories:['namkeens'],      icon:'fa-circle',             image: namkeensImg },
  { id:'n10',name:'Masala Kaju',    desc:'Crispy fried cashews coated in a fiery blend of dry mango powder, red chili, and chaat masala.',                                   categories:['namkeens'],      icon:'fa-fire-flame-curved',  image: namkeensImg },
  { id:'n11',name:'Chips',          desc:'Ultra-thin, hand-sliced potato chips, flash-fried to a perfect crisp and lightly seasoned.',                                       categories:['namkeens'],      icon:'fa-certificate',        image: namkeensImg },
];

// ─── Category Meta ────────────────────────────────────────
const CATS = [
  { id:'all',      label:'All Items',      icon:'fa-star',               bannerTitle: null },
  { id:'dry',      label:'Dry Sweets',     icon:'fa-cookie',             bannerTitle:'Artisan Dry Sweets',     bannerDesc:'Handcrafted confections made with pure desi ghee, roasted flours, and aromatic spices. Each piece a labor of love.', bannerImg: dryImg   },
  { id:'khowa',    label:'Khowa Sweets',   icon:'fa-cheese',             bannerTitle:'Rich Khowa Collection',  bannerDesc:'Slow-cooked milk solids transformed into velvety barfis, pedas, and gajars — a testament to patience and craft.',      bannerImg: khowImg  },
  { id:'laddu',    label:'Laddu Sweets',   icon:'fa-circle',             bannerTitle:'The Laddu Kingdom',      bannerDesc:'Spheres of joy — from the fine-grained Motichoor to the energy-dense Gond Laddu, every variety tells a story.',       bannerImg: ladduImg },
  { id:'chena',    label:'Chena Sweets',   icon:'fa-cookie-bite',        bannerTitle:'Pure Chena Masterpieces',bannerDesc:'Delicate cottage cheese transformed through ancient Bengali techniques into rasgullas, rasmalais, and royal confections.', bannerImg: chenaImg },
  { id:'kaju',     label:'Kaju Sweets',    icon:'fa-diamond',            bannerTitle:'Royal Kaju Collection',  bannerDesc:'Premium cashew meal shaped into jewels — from classic diamond barfis to intricate sculpted forms adorned with silver.', bannerImg: kajuImg  },
  { id:'sawan',    label:'Sawan Special',  icon:'fa-cloud-showers-heavy',bannerTitle:'Monsoon Sawan Special',  bannerDesc:'Festive flavors for the sacred monsoon season — crispy, spicy, tangy, and comforting all at once.',                   bannerImg: sawanImg },
  { id:'namkeens', label:'Namkeens',       icon:'fa-bowl-food',          bannerTitle:'Crispy Savory Namkeens', bannerDesc:'The finest spiced snack tradition from Agra and beyond — mixtures, bhujias, mathris, and roasted cashews.',           bannerImg: namkeensImg },
];

// ─── App Component ────────────────────────────────────────
export default function App() {
  const [activeCat, setActiveCat] = useState('all');
  const [scrolled, setScrolled]   = useState(false);
  const gridRef = useRef(null);

  // Header shrink on scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // GSAP animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const htl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    htl.from('.hero-badge',   { y: 40, opacity: 0, duration: 0.9, delay: 0.3 })
       .from('.hero-title',   { y: 60, opacity: 0, duration: 1.1 }, '-=0.7')
       .from('.gold-divider', { scaleX: 0, opacity: 0, duration: 0.8 }, '-=0.9')
       .from('.hero-tagline', { y: 30, opacity: 0, duration: 0.8 }, '-=0.7');

    // Section headers
    gsap.utils.toArray('.section-header').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 82%' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out'
      });
    });

    // Category pills
    gsap.from('.pill', {
      scrollTrigger: { trigger: '.cat-pills', start: 'top 85%' },
      y: 30, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'back.out(1.5)'
    });

    // About section
    gsap.from('.about-img-wrap', {
      scrollTrigger: { trigger: '.about-section', start: 'top 75%' },
      x: -80, opacity: 0, duration: 1.1, ease: 'power3.out'
    });
    gsap.from('.about-text-side', {
      scrollTrigger: { trigger: '.about-section', start: 'top 75%' },
      x: 80, opacity: 0, duration: 1.1, ease: 'power3.out'
    });
    gsap.utils.toArray('.stat-box').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 30, opacity: 0, duration: 0.7, delay: i * 0.12, ease: 'back.out(1.5)'
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // Animate cards when category changes or on init
  useEffect(() => {
    const cards = document.querySelectorAll('.sweet-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 45, rotateX: 14 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.055, duration: 0.55, ease: 'power3.out', overwrite: true }
    );
    cards.forEach(c => c.classList.add('is-visible'));
  }, [activeCat]);

  const catMeta = CATS.find(c => c.id === activeCat);
  const items   = activeCat === 'all' ? MENU : MENU.filter(i => i.categories.includes(activeCat));

  return (
    <>
      <ThreeBackground />

      {/* ── HEADER ─────────────────────────────── */}
      <header className={`site-header ${scrolled ? 'shrunk' : ''}`}>
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fa-solid fa-crown brand-crown"></i>
          <div className="brand-circle">M</div>
          <div className="brand-name">
            Madhur
            <small>Sweets</small>
          </div>
        </div>

        <nav className="header-nav">
          <a href="#menu"    className="nav-a">Menu</a>
          <a href="#about"   className="nav-a">About</a>
          <a href="#contact" className="nav-a">Contact</a>
        </nav>

        <a href="tel:+919835568135" className="header-call">
          <i className="fa-solid fa-phone"></i> +91 98355 68135
        </a>
      </header>

      {/* ── HERO ───────────────────────────────── */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-inner">
          <div className="hero-badge">
            <i className="fa-solid fa-crown"></i> Est. 2016 · Dhanbad
          </div>
          <h1 className="hero-title">
            Madhur <br />
            <span className="highlight">Sweets</span>
          </h1>
          <div className="gold-divider">
            <span className="line"></span>
            <span className="gem"><i className="fa-solid fa-gem"></i></span>
            <span className="line"></span>
          </div>
          <p className="hero-tagline">Pure Taste &nbsp;•&nbsp; Fresh Every Day</p>
        </div>

        <div className="scroll-cue">
          <span>Scroll</span>
          <div className="scroll-mouse"></div>
        </div>
      </section>

      {/* ── SHOWCASE ────────────────────────────── */}
      <section className="showcase" id="menu">

        <div className="section-header">
          <div className="section-label">
            <i className="fa-solid fa-crown"></i> The Royal Menu
          </div>
          <h2 className="section-title">Handcrafted Delicacies</h2>
          <p className="section-sub">
            Generations of tradition, premium ingredients, and unmatched craftsmanship in every single piece.
          </p>
        </div>

        {/* Category Pills */}
        <div className="cat-pills">
          {CATS.map(cat => (
            <button
              key={cat.id}
              className={`pill ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              <i className={`fa-solid ${cat.icon}`}></i>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Category Banner */}
        {catMeta && catMeta.bannerTitle && (
          <div className="cat-banner" key={activeCat}>
            <div className="cat-banner-text">
              <div className="cat-banner-tag">
                <i className={`fa-solid ${catMeta.icon}`}></i>
                {catMeta.label}
              </div>
              <h3 className="cat-banner-title">{catMeta.bannerTitle}</h3>
              <p className="cat-banner-desc">{catMeta.bannerDesc}</p>
            </div>
            <div className="cat-banner-img">
              <img src={catMeta.bannerImg} alt={catMeta.bannerTitle} />
            </div>
          </div>
        )}

        {/* Sweet Cards Grid */}
        <div className="sweets-grid" ref={gridRef}>
          {items.map(item => (
            <SweetCard key={item.id} item={item} />
          ))}
        </div>

      </section>

      {/* ── ABOUT ───────────────────────────────── */}
      <section className="about-section" id="about">
        <div className="about-grid">

          <div className="about-visual">
            <div className="about-gold-ring"></div>
            <div className="about-img-wrap">
              <img src={heroImg} alt="Madhur Sweets Heritage" />
            </div>
          </div>

          <div className="about-text-side">
            <div className="about-text-badge">
              <i className="fa-solid fa-scroll"></i> Our Heritage
            </div>
            <h2 className="about-title">Crafting Sweet Memories Since 2016</h2>
            <p className="about-lead">
              At Madhur Sweets, sweet making is not just a business — it is a sacred art form passed through generations.
            </p>
            <p className="about-body">
              Located opposite the Police Line Gate in Hirapur, Dhanbad, we have been serving happiness daily for over a decade.
              Our master chefs use time-honored recipes, 100% pure ingredients, and impeccable hygiene standards to deliver
              absolute freshness in every single bite. From traditional Bengali chena sweets to crispy Rajasthani namkeens —
              every item on our menu is a chapter from India's rich culinary heritage.
            </p>

            <div className="about-stats">
              <div className="stat-box">
                <div className="stat-icon"><i className="fa-solid fa-cow"></i></div>
                <div className="stat-label">100% Pure Milk & Ghee</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="fa-solid fa-hand-holding-heart"></i></div>
                <div className="stat-label">Fresh Every Single Day</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="fa-solid fa-award"></i></div>
                <div className="stat-label">10+ Years of Excellence</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="site-footer" id="contact">
        <div className="footer-top">

          {/* Brand */}
          <div>
            <div className="brand" style={{ marginBottom: 0 }}>
              <i className="fa-solid fa-crown brand-crown"></i>
              <div className="brand-circle">M</div>
              <div className="brand-name">Madhur <small>Sweets</small></div>
            </div>
            <p className="footer-brand-desc">
              Spreading pure taste and traditional sweetness throughout Dhanbad. 
              Taste the heritage of Bengal and North Indian sweet craftsmanship in every bite.
            </p>
            <div className="social-row">
              <a href="#" className="social-btn"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="social-btn"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="social-btn"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Find Us</h4>
            <div className="contact-entry">
              <i className="fa-solid fa-phone"></i>
              <div>
                <a href="tel:+919835568135">+91 98355 68135</a>
                <a href="tel:+919835568129">+91 98355 68129</a>
              </div>
            </div>
            <div className="contact-entry">
              <i className="fa-solid fa-location-dot"></i>
              <p>Opposite Police Line Gate,<br />Hirapur, Po, Sadar,<br />Dhanbad, Jharkhand 826007</p>
            </div>
            <div className="delivery-row">
              <p>Order Online Via</p>
              <div className="delivery-chips">
                <span className="d-chip swiggy"><i className="fa-solid fa-motorcycle"></i> Swiggy</span>
                <span className="d-chip zomato"><i className="fa-solid fa-fire"></i> Zomato</span>
              </div>
            </div>
          </div>

          {/* QR */}
          <div className="footer-col">
            <h4>Love Our Sweets?</h4>
            <div className="qr-feedback">
              <div className="qr-box">
                <div className="qr-g-icon"><i className="fa-brands fa-google"></i></div>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://search.google.com/local/writereview?placeid=ChIJ0er1oZ889TkR5Dq_c1F_4-w"
                  alt="Google Review QR"
                />
              </div>
              <div className="qr-text">
                <strong>Rate &amp; Review Us</strong>
                <p>Scan the QR code to leave a Google review. Your feedback helps us serve you better!</p>
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(212,175,55,0.1)', maxWidth:'1200px', margin:'0 auto' }}>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Madhur Sweets · All Rights Reserved · Crafted with <i className="fa-solid fa-heart" style={{color:'var(--gold)'}}></i></span>
            <a href="#menu">↑ Back to Menu</a>
          </div>
        </div>
      </footer>
    </>
  );
}
