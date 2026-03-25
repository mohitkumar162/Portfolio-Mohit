/* ═══════════════════════════════════════════════════════════════
   DECRYPT LOADER  —  drop-in replacement for js/00-loader.js
   ═══════════════════════════════════════════════════════════════ */
(function () {

  /* ── Config ──────────────────────────────────────────────────
     Change NAME to match whatever is in your hero h1.
     DURATION controls how long the full progress bar takes (ms).
  ─────────────────────────────────────────────────────────────── */
  const NAME     = 'WELCOME';   // ← your name here (uppercase)
  const DURATION = 2000;       // total loader time in ms

  /* ── Elements ─────────────────────────────────────────────── */
  const loader  = document.getElementById('galaxy-loader');
  const canvas  = document.getElementById('loader-canvas');
  const bar     = document.getElementById('loader-bar');
  const nameWrap = document.getElementById('loader-name-wrap');
  const postEl  = document.getElementById('loader-post');

  /* ── Particle canvas ─────────────────────────────────────── */
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const STAR_COUNT = 120;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x:  Math.random(),
    y:  Math.random(),
    r:  Math.random() * 0.8 + 0.15,
    s:  Math.random() * 0.003 + 0.001,
    o:  Math.random() * Math.PI * 2,
  }));

  let particleRaf;
  let frame = 0;

  function drawParticles() {
    particleRaf = requestAnimationFrame(drawParticles);
    frame++;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      const alpha = 0.08 + ((Math.sin(frame * s.s + s.o) + 1) / 2) * 0.18;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,158,207,${alpha})`;
      ctx.fill();
    });
  }
  drawParticles();

  /* ── Build letter spans ──────────────────────────────────── */
  const NOISE_CHARS = '!@#$%^&*<>{}[]|\\/-+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const spans = NAME.split('').map(letter => {
    const span = document.createElement('span');
    span.className = 'ld-char scrambling';
    span.textContent = NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
    nameWrap.appendChild(span);
    return { el: span, letter };
  });

  /* ── Scramble interval: keep un-locked chars noisy ──────── */
  let lockedCount = 0;

  const scrambleInterval = setInterval(() => {
    spans.forEach((s, i) => {
      if (i >= lockedCount) {
        s.el.textContent = NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
      }
    });
  }, 55);

  /* ── Lock letters one by one ─────────────────────────────── */
  // Each letter locks after a staggered delay that accelerates
  // slightly toward the end — feels satisfying and snappy.
  function lockLetter(index) {
    if (index >= spans.length) {
      clearInterval(scrambleInterval);
      // Show "access granted" then start dismiss countdown
      setTimeout(() => postEl.classList.add('show'), 120);
      setTimeout(dismiss, 480);
      return;
    }

    const span = spans[index];
    span.el.classList.remove('scrambling');
    span.el.classList.add('locked');
    span.el.textContent = span.letter;
    lockedCount = index + 1;

    // Delay between each letter lock: starts at 160ms, shrinks to 90ms
    const delay = Math.max(90, 160 - index * 8);
    setTimeout(() => lockLetter(index + 1), delay);
  }

  // Short pause before reveal begins
  setTimeout(() => lockLetter(0), 420);

  /* ── Progress bar ─────────────────────────────────────────── */
  // The bar runs in parallel — finishes slightly before decrypt ends
  // so the two animations feel synchronised without being locked.
  const barStart = performance.now();

  function updateBar(now) {
    const p = Math.min((now - barStart) / DURATION, 1);
    bar.style.width = (p * 100) + '%';
    if (p < 1) requestAnimationFrame(updateBar);
  }
  requestAnimationFrame(updateBar);

  /* ── Dismiss ──────────────────────────────────────────────── */
  function dismiss() {
    loader.classList.add('fade-out');
    cancelAnimationFrame(particleRaf);
    setTimeout(() => {
      loader.style.display = 'none';
      document.body.classList.remove('loading');
    }, 750);
  }

  // Hard fallback — always dismiss after 5 s
  setTimeout(dismiss, 5000);

})();