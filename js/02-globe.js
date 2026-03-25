/* ─── 3D ROTATING GLOBE ─────────────────────── */
(function(){
  const canvas=document.getElementById('globe-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let SIZE=440;
  function resize(){
    const panel=canvas.parentElement;
    SIZE=Math.min(panel.clientWidth,panel.clientHeight,500)*0.82;
    canvas.width=SIZE;canvas.height=SIZE;
  }

  // Build globe point cloud
  const PTS=[];
  const R=1; // unit sphere

  // Latitude/longitude grid
  for(let lat=-80;lat<=80;lat+=18){
    const rlat=lat*Math.PI/180;
    const steps=Math.max(8,Math.round(36*Math.cos(rlat)));
    for(let i=0;i<steps;i++){
      const lon=(i/steps)*360*Math.PI/180;
      PTS.push({
        x:R*Math.cos(rlat)*Math.cos(lon),
        y:R*Math.sin(rlat),
        z:R*Math.cos(rlat)*Math.sin(lon),
        type:'grid'
      });
    }
  }
  // Random scattered stars on surface
  for(let i=0;i<220;i++){
    const u=Math.random()*2-1,v=Math.random()*2*Math.PI;
    const s=Math.sqrt(1-u*u);
    PTS.push({x:s*Math.cos(v),y:u,z:s*Math.sin(v),type:'star'});
  }
  // Orbital rings (tilted)
  const RINGS=[];
  [[0.3,0.6],[0.55,0.3],[0.75,-0.4]].forEach(([tilt,phase])=>{
    const ring=[];
    for(let i=0;i<120;i++){
      const a=(i/120)*Math.PI*2+phase;
      ring.push({
        x:1.28*Math.cos(a),
        y:1.28*Math.sin(a)*Math.sin(tilt),
        z:1.28*Math.sin(a)*Math.cos(tilt)
      });
    }
    RINGS.push(ring);
  });

  let rotY=0,rotX=0.22;

  function rotateY(p,a){
    return{x:p.x*Math.cos(a)+p.z*Math.sin(a),y:p.y,z:-p.x*Math.sin(a)+p.z*Math.cos(a)};
  }
  function rotateX(p,a){
    return{x:p.x,y:p.y*Math.cos(a)-p.z*Math.sin(a),z:p.y*Math.sin(a)+p.z*Math.cos(a)};
  }
  function project(p){
    const fov=2.4;
    const scale=(SIZE/2)*fov/(fov+p.z+1.5);
    return{sx:SIZE/2+p.x*scale,sy:SIZE/2-p.y*scale,sc:scale,z:p.z};
  }

  function draw(){
    rotY+=0.005;
    ctx.clearRect(0,0,SIZE,SIZE);

    // Subtle glow behind globe
    const glow=ctx.createRadialGradient(SIZE/2,SIZE/2,0,SIZE/2,SIZE/2,SIZE*.42);
    glow.addColorStop(0,'rgba(140,140,180,0.07)');
    glow.addColorStop(1,'rgba(140,140,180,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,SIZE,SIZE);

    // Orbital rings
    RINGS.forEach(ring=>{
      const rpts=ring.map(p=>{let q=rotateX(p,rotX);q=rotateY(q,rotY);return project(q);});
      ctx.beginPath();
      rpts.forEach((p,i)=>{i===0?ctx.moveTo(p.sx,p.sy):ctx.lineTo(p.sx,p.sy);});
      ctx.closePath();
      ctx.strokeStyle='rgba(180,180,210,0.22)';
      ctx.lineWidth=1.2;ctx.stroke();
    });

    // Globe points
    const tpts=PTS.map(p=>{let q=rotateX(p,rotX);q=rotateY(q,rotY);return{...project(q),type:p.type};});
    tpts.sort((a,b)=>a.z-b.z);

    tpts.forEach(({sx,sy,sc,z,type})=>{
      const visible=(z+1.5)>0;
      const alpha=visible?(0.15+(z+1)*0.35)*0.9:0.04;
      const r=type==='star'?Math.max(.5,sc*.9):Math.max(.4,sc*.55);
      ctx.beginPath();
      ctx.arc(sx,sy,r,0,Math.PI*2);
      ctx.fillStyle=type==='star'
        ?`rgba(230,230,255,${Math.min(1,alpha*1.4)})`
        :`rgba(190,190,215,${Math.min(1,alpha)})`;
      ctx.fill();
    });

    // Globe wireframe outline (subtle circle)
    const sc=(SIZE/2)*2.4/(2.4+1.5);
    ctx.beginPath();
    ctx.arc(SIZE/2,SIZE/2,sc,0,Math.PI*2);
    ctx.strokeStyle='rgba(200,200,220,0.06)';
    ctx.lineWidth=1;ctx.stroke();

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize',()=>{resize();});
  resize();draw();
})();
