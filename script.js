/* ============================================================
   HAVANTURES CARIBE — script.js v2
   GSAP + ScrollTrigger + Swiper · Vanilla JS
   ============================================================ */

'use strict';

/* ── 1. LOADER ───────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const minTime = 1800;
  const start = Date.now();
  function hideLoader() {
    const delay = Math.max(0, minTime - (Date.now() - start));
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, delay);
  }
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });
})();


/* ── 2. SCROLL PROGRESS ──────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? (scrolled / max * 100) + '%' : '0%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ── 3. NAVBAR ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links  = navbar?.querySelector('.nav-links');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navAs    = navbar.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAs.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));
})();


/* ── 4. GSAP SCROLL ANIMATIONS ───────────────────────────── */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.body.classList.add('gsap-failed');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('gsap-failed');
    return;
  }

  // Hero entrance
  document.querySelectorAll('#hero [data-gsap]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0) + 0.25;
    gsap.to(el, { opacity: 1, y: 0, x: 0, duration: 1.2, delay, ease: 'expo.out' });
  });

  // Generic fade-up
  document.querySelectorAll('[data-gsap="fade-up"]:not(#hero *)').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 1.0,
      delay: parseFloat(el.dataset.delay || 0),
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Generic fade-right
  document.querySelectorAll('[data-gsap="fade-right"]').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0,
      duration: 0.95,
      delay: parseFloat(el.dataset.delay || 0),
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Hero gradient parallax
  const heroGradient = document.querySelector('.hero-gradient-canvas');
  if (heroGradient) {
    gsap.to(heroGradient, {
      yPercent: 22, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // Service cards stagger
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length) {
    gsap.fromTo(serviceCards,
      { opacity: 0, y: 48 },
      {
        opacity: 1, y: 0,
        duration: 0.85, stagger: 0.13, ease: 'expo.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true },
      }
    );
  }

  // Destination cards stagger
  const destCards = document.querySelectorAll('.dest-card');
  if (destCards.length) {
    gsap.fromTo(destCards,
      { opacity: 0, y: 36, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, stagger: 0.09, ease: 'expo.out',
        scrollTrigger: { trigger: '.destinations-grid', start: 'top 82%', once: true },
      }
    );
  }

  // Stats band pop
  const statsBand = document.querySelector('.stats-band');
  if (statsBand) {
    gsap.fromTo(statsBand.querySelectorAll('.stats-item'),
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.7, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: statsBand, start: 'top 88%', once: true },
      }
    );
  }

  // Process steps stagger
  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    gsap.fromTo(processSteps,
      { opacity: 0, x: -28 },
      {
        opacity: 1, x: 0,
        duration: 0.85, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.process-timeline', start: 'top 82%', once: true },
      }
    );
  }
})();


/* ── 5. COUNTER ANIMATION ────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReduced) { el.textContent = target; return; }
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
})();


/* ── 6. TESTIMONIALS SWIPER ──────────────────────────────── */
(function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' },
    breakpoints: {
      640:  { slidesPerView: 1.2 },
      900:  { slidesPerView: 2, spaceBetween: 28 },
      1200: { slidesPerView: 2.4 },
    },
    a11y: {
      prevSlideMessage: 'Témoignage précédent',
      nextSlideMessage: 'Témoignage suivant',
    },
  });
})();


/* ── 7. FAQ ACCORDION ────────────────────────────────────── */
(function initFAQ() {
  const details = document.querySelectorAll('.faq-item');
  details.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        details.forEach(other => { if (other !== detail && other.open) other.open = false; });
      }
    });
  });
})();


/* ── 8. SMOOTH SCROLL ────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 9. LAZY IMAGE LOAD ──────────────────────────────────── */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;
  const imgs = document.querySelectorAll('img[data-src]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        io.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => io.observe(img));
})();


/* ── 10. DESTINATION CARDS TOUCH ─────────────────────────── */
(function initDestCards() {
  const cards = document.querySelectorAll('.dest-card');
  cards.forEach(card => {
    card.addEventListener('touchstart', () => {
      cards.forEach(c => c.classList.remove('touch-active'));
      card.classList.add('touch-active');
    }, { passive: true });
  });
  document.addEventListener('touchstart', e => {
    if (!e.target.closest('.dest-card'))
      cards.forEach(c => c.classList.remove('touch-active'));
  }, { passive: true });
})();


/* ── 11. HERO PARTICLES (subtle) ─────────────────────────── */
(function initHeroParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const hero = document.querySelector('.hero-media');
  if (!hero) return;
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0.3;z-index:1;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 40;

  function resize() { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; }

  function createParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.35 + 0.08,
      opacity: Math.random() * 0.55 + 0.1,
      dx: (Math.random() - 0.5) * 0.25,
    };
  }

  function init() { resize(); particles = Array.from({ length: COUNT }, createParticle); }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.y -= p.speed; p.x += p.dx;
      if (p.y < -10) Object.assign(p, createParticle(), { y: H + 10 });
      if (p.x < -10 || p.x > W + 10) p.dx *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,107,${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  tick();
})();
