/* ─── TYPEWRITER ANIMATION ───────────────────── */
(function(){
  const el = document.getElementById('typewriter');
  if(!el) return;

  const words = ['Cloud Engineer' , 'Java Developer', 'Problem Solver'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPE_SPEED   = 90;   // ms per character when typing
  const DELETE_SPEED = 50;   // ms per character when deleting
  const PAUSE_AFTER  = 1800; // ms pause after fully typed
  const PAUSE_BEFORE = 300;  // ms pause before typing next word

  function tick() {
    const current = words[wordIndex];

    if (!isDeleting) {
      // Typing forward
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        // Finished deleting — move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start after hero fade-in animation (1.2s delay)
  setTimeout(tick, 1200);
})();
