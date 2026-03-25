/* ─── 3D CARD TILT ───────────────────────────── */
(function () {
  var MAX_TILT   = 14;
  var SCALE_UP   = 1.04;
  var SHADOW_MAX = 36;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function initTilt() {
    document.querySelectorAll('.pc-tilt-wrap').forEach(function(wrap) {
      var card = wrap.querySelector('.pc');
      if (!card) return;

      var rafId = null;
      var targetRX = 0, targetRY = 0;
      var currentRX = 0, currentRY = 0;
      var currentScale = 1, targetScale = 1;
      var isHovered = false;

      function applyTransform() {
        var sx = (-currentRY / MAX_TILT) * SHADOW_MAX;
        var sy = ( currentRX / MAX_TILT) * SHADOW_MAX;
        var alpha  = isHovered ? 0.7 : 0.45;
        var blur   = isHovered ? 48  : 24;

        card.style.transform = 'rotateX(' + currentRX + 'deg) rotateY(' + currentRY + 'deg) scale(' + currentScale + ')';
        card.style.boxShadow =
          sx + 'px ' + (sy + 8) + 'px ' + blur + 'px rgba(0,0,0,' + alpha + '),' +
          (sx * 0.4) + 'px ' + (sy * 0.4 + 4) + 'px ' + (blur * 0.4) + 'px rgba(0,0,0,' + (alpha * 0.5) + ')';
      }

      function tick() {
        var speed = isHovered ? 0.18 : 0.1;
        currentRX = lerp(currentRX, targetRX, speed);
        currentRY = lerp(currentRY, targetRY, speed);
        currentScale = lerp(currentScale, targetScale, speed);

        applyTransform();

        var settled = !isHovered
          && Math.abs(currentRX) < 0.02
          && Math.abs(currentRY) < 0.02
          && Math.abs(currentScale - 1) < 0.001;

        if (settled) {
          currentRX = 0; currentRY = 0; currentScale = 1;
          applyTransform();
          rafId = null;
        } else {
          rafId = requestAnimationFrame(tick);
        }
      }

      function startLoop() {
        if (!rafId) rafId = requestAnimationFrame(tick);
      }

      wrap.addEventListener('mouseenter', function() {
        isHovered = true;
        targetScale = SCALE_UP;
        card.classList.remove('tilt-reset');
        startLoop();
      });

      wrap.addEventListener('mousemove', function(e) {
        var rect = wrap.getBoundingClientRect();
        var nx = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
        var ny = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
        targetRY =  nx * MAX_TILT;
        targetRX = -ny * MAX_TILT;

        var mx = ((e.clientX - rect.left) / rect.width)  * 100;
        var my = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
      });

      wrap.addEventListener('mouseleave', function() {
        isHovered = false;
        targetRX = 0;
        targetRY = 0;
        targetScale = 1;
        card.classList.add('tilt-reset');
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
        startLoop();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
})();
