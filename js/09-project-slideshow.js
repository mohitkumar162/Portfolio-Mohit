/* ─── PROJECT IMAGE SLIDESHOW ────────────────
   Auto-rotates each project's images every 3s
   ──────────────────────────────────────────── */
(function () {
  function initSlideshows() {
    document.querySelectorAll('.pc-slideshow').forEach(function (wrap) {
      var imgs = wrap.querySelectorAll('.pc-slide');
      var dots = wrap.querySelectorAll('.pc-dot');
      if (imgs.length < 2) return;

      var current = 0;
      imgs[0].classList.add('pc-slide--active');

      setInterval(function () {
        imgs[current].classList.remove('pc-slide--active');
        if (dots[current]) dots[current].classList.remove('pc-dot--active');
        current = (current + 1) % imgs.length;
        imgs[current].classList.add('pc-slide--active');
        if (dots[current]) dots[current].classList.add('pc-dot--active');
      }, 3000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlideshows);
  } else {
    initSlideshows();
  }
})();
