/* ─── 12. MATRIX RAIN in footer ─────────────────────────── */
  setTimeout(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    footer.style.position = 'relative';
    footer.style.overflow = 'hidden';
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    footer.prepend(canvas);

    const ctx = canvas.getContext('2d');
    function resizeMatrix() {
      canvas.width  = footer.offsetWidth;
      canvas.height = footer.offsetHeight;
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOP0123456789';
    const fontSize = 10;
    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(7,7,8,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00d9c0';
      ctx.font = fontSize + 'px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }
    setInterval(drawMatrix, 80);
  }, 500);