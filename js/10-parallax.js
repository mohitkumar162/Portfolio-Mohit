/* ═══════════════════════════════════════════════════════════════
   PARALLAX HERO — mouse-track + scroll depth
   ═══════════════════════════════════════════════════════════════ */
(function () {
  const heroSection = document.getElementById('hero-section');
  const hero = document.getElementById('hero');
  if (!heroSection || !hero) return;

  /* Inject parallax scene markup into the full-width hero-section wrapper */
  const scene = document.createElement('div');
  scene.className = 'parallax-scene';
  scene.innerHTML = `
    <div class="p-dots"></div>
    <div class="p-orb p-orb-1"></div>
    <div class="p-orb p-orb-2"></div>
    <div class="p-orb p-orb-3"></div>
    <div class="p-line p-line-1"></div>
    <div class="p-line p-line-2"></div>
    <div class="p-line p-line-3"></div>
    <div class="p-particle"></div>
    <div class="p-particle"></div>
    <div class="p-particle"></div>
    <div class="p-particle"></div>
    <div class="p-particle"></div>
    <div class="p-particle"></div>
  `;
  heroSection.insertBefore(scene, heroSection.firstChild);

  const dots  = scene.querySelector('.p-dots');
  const orb1  = scene.querySelector('.p-orb-1');
  const orb2  = scene.querySelector('.p-orb-2');
  const orb3  = scene.querySelector('.p-orb-3');
  const line1 = scene.querySelector('.p-line-1');
  const line2 = scene.querySelector('.p-line-2');
  const line3 = scene.querySelector('.p-line-3');
  const particles = scene.querySelectorAll('.p-particle');
  const hName = hero.querySelector('.h-name');

  /* Smooth mouse values */
  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── Mouse move listener ─────────────────────────────────────── */
  document.addEventListener('mousemove', e => {
    /* Normalise to -1…+1 relative to viewport centre */
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Animation loop ──────────────────────────────────────────── */
  function tick() {
    requestAnimationFrame(tick);

    /* Smooth interpolation */
    cx = lerp(cx, mx, 0.06);
    cy = lerp(cy, my, 0.06);

    /* Scroll-based depth offset */
    const scrollY = window.scrollY;
    const scrollFactor = Math.min(scrollY / window.innerHeight, 1);

    /* Each layer moves at a different speed = parallax depth */
    const s = 1 - scrollFactor * 0.6; /* scale down as user scrolls */

    dots.style.transform  = `translate(${cx * 12}px, ${cy * 10 + scrollY * 0.08}px)`;
    orb1.style.transform  = `translate(${cx * -18}px, ${cy * -14 + scrollY * 0.15}px) scale(${s})`;
    orb2.style.transform  = `translate(${cx *  22}px, ${cy *  18 + scrollY * 0.20}px) scale(${s})`;
    orb3.style.transform  = `translate(${cx * -30}px, ${cy * -24 + scrollY * 0.28}px) scale(${s})`;
    line1.style.transform = `translate(${cx * -14}px, ${cy * -10}px) rotate(${cx * 3}deg)`;
    line2.style.transform = `translate(${cx *  10}px, ${cy *  14}px)`;
    line3.style.transform = `translate(${cx *  20}px, ${cy *  8}px)`;

    particles.forEach((p, i) => {
      const depth = (i + 1) * 7;
      const dir   = i % 2 === 0 ? 1 : -1;
      p.style.transform = `translate(${cx * depth * dir}px, ${cy * depth * dir}px)`;
    });

    /* Subtle text shadow tilt on the name */
    if (hName) {
      const sx = (-cx * 6).toFixed(1);
      const sy = (-cy * 4).toFixed(1);
      hName.style.textShadow = `${sx}px ${sy}px 40px rgba(139,158,207,0.25)`;
    }
  }

  tick();

  /* ── Scroll fade: hero content fades & lifts as user scrolls ── */
  const heroContent = heroSection.querySelectorAll(':scope > *:not(.parallax-scene)');
  window.addEventListener('scroll', () => {
    const ratio = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
    heroContent.forEach(el => {
      el.style.opacity   = (1 - ratio * 0.7).toFixed(3);
      el.style.transform = `translateY(${-ratio * 30}px)`;
    });
  }, { passive: true });

})();
