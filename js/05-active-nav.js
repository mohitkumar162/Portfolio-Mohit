/* ─── ACTIVE NAV ────────────────────────────── */
const navAs=document.querySelectorAll('.nav-links a');
document.querySelectorAll('section[id]').forEach(sec=>{
  new IntersectionObserver(([e])=>{
    if(e.isIntersecting)navAs.forEach(a=>{a.style.color=a.getAttribute('href')==='#'+sec.id?'var(--accent)':'';});
  },{rootMargin:'-40% 0px -50% 0px'}).observe(sec);
});
