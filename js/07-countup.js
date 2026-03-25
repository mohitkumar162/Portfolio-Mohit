/* ══ COUNT-UP ANIMATION ══════════════════════════════════
   Targets elements with [data-count] attribute.
   Counts from 0 to the target number when scrolled into view.
   Supports suffix characters like +, ★, %
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = parseInt(el.dataset.duration, 10) || 1600;
    const decimals = (el.dataset.count.includes('.')) ? 1 : 0;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = target * eased;

      el.textContent = (decimals ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (decimals ? target.toFixed(1) : target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function initCountUp() {
    // Exclude any [data-count] that lives inside the skills section or proficiency tooltips
    const all = document.querySelectorAll('[data-count]');
    const els = Array.from(all).filter(function (el) {
      return !el.closest('#skills') && !el.classList.contains('sk-prof-pct');
    });
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    els.forEach((el) => {
      // Store original suffix from current text if no data-suffix set
      if (!el.dataset.suffix) {
        const text = el.textContent.trim();
        const numMatch = text.match(/^[\d.]+/);
        if (numMatch) {
          el.dataset.count = numMatch[0];
          el.dataset.suffix = text.slice(numMatch[0].length);
        }
      }
      // Show 0 initially
      el.textContent = '0' + (el.dataset.suffix || '');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountUp);
  } else {
    initCountUp();
  }
})();
