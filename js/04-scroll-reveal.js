/* ─── SCROLL REVEAL ─────────────────────────── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
},{threshold:.07});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
