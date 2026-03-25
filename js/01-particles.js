/* ─── 3D FLOATING PARTICLES ─────────────────── */
(function(){
  const canvas=document.getElementById('bg');
  const ctx=canvas.getContext('2d');
  let W,H;
  const mouse={x:-9999,y:-9999};
  const COUNT=120,DEPTH=900,FOV=380,LINK_DIST=155,MOUSE_R=190,SPEED=0.25,DOT_R=2.4;
  function rand(a,b){return a+Math.random()*(b-a);}
  class P{
    constructor(i){this.reset(true);}
    reset(i){
      this.x=rand(-W*.5,W*1.5);this.y=rand(-H*.4,H*1.4);
      this.z=i?rand(1,DEPTH):DEPTH;
      this.vx=rand(-SPEED,SPEED);this.vy=rand(-SPEED,SPEED);this.vz=rand(-.5,.5);
      this.wx=rand(0,Math.PI*2);this.wy=rand(0,Math.PI*2);this.ws=rand(.003,.009);
    }
    step(t){
      this.x+=this.vx+Math.sin(t*this.ws+this.wx)*.16;
      this.y+=this.vy+Math.cos(t*this.ws+this.wy)*.16;
      this.z+=this.vz;
      const{sx,sy}=this.proj();
      const dx=sx-mouse.x,dy=sy-mouse.y,d2=dx*dx+dy*dy;
      if(d2<MOUSE_R*MOUSE_R&&d2>0){const d=Math.sqrt(d2),f=(MOUSE_R-d)/MOUSE_R*1.3;this.x+=(dx/d)*f;this.y+=(dy/d)*f;}
      if(this.z<1)this.z=DEPTH;if(this.z>DEPTH)this.z=1;
      if(this.x<-W*.8)this.x=W*1.8;if(this.x>W*1.8)this.x=-W*.8;
      if(this.y<-H*.8)this.y=H*1.8;if(this.y>H*1.8)this.y=-H*.8;
    }
    proj(){const sc=FOV/(FOV+this.z);return{sx:(this.x-W/2)*sc+W/2,sy:(this.y-H/2)*sc+H/2,sc};}
  }
  let pts=[];
  function init(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;pts=Array.from({length:COUNT},()=>new P(true));}
  let tick=0;
  function frame(){
    tick++;ctx.clearRect(0,0,W,H);
    const vg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.72);
    vg.addColorStop(0,'rgba(7,7,8,0)');vg.addColorStop(.55,'rgba(7,7,8,.12)');vg.addColorStop(1,'rgba(3,3,4,.9)');
    ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    const proj=pts.map(p=>{p.step(tick);return{p,...p.proj()};});
    proj.sort((a,b)=>b.p.z-a.p.z);
    for(let i=0;i<proj.length;i++)for(let j=i+1;j<proj.length;j++){
      const A=proj[i],B=proj[j],dx=A.sx-B.sx,dy=A.sy-B.sy,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<LINK_DIST){const df=(A.sc+B.sc)*.5,al=(1-dist/LINK_DIST)*df*.52;
        ctx.beginPath();ctx.moveTo(A.sx,A.sy);ctx.lineTo(B.sx,B.sy);ctx.strokeStyle=`rgba(195,195,215,${al.toFixed(3)})`;ctx.lineWidth=df*.75;ctx.stroke();}
    }
    for(const{sx,sy,sc}of proj){
      const al=.2+sc*.8,r=Math.max(.35,sc*DOT_R);
      const g=ctx.createRadialGradient(sx,sy,0,sx,sy,r*5);
      g.addColorStop(0,`rgba(215,215,235,${(al*.2).toFixed(3)})`);g.addColorStop(1,'rgba(215,215,235,0)');
      ctx.beginPath();ctx.arc(sx,sy,r*5,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.fillStyle=`rgba(230,230,245,${al.toFixed(3)})`;ctx.fill();
    }
    if(mouse.x>0){
      for(const{sx,sy,sc}of proj){const dx=sx-mouse.x,dy=sy-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<MOUSE_R*1.4){const a=(1-d/(MOUSE_R*1.4))*sc*.45;ctx.beginPath();ctx.moveTo(mouse.x,mouse.y);ctx.lineTo(sx,sy);ctx.strokeStyle=`rgba(255,255,255,${a.toFixed(3)})`;ctx.lineWidth=.5;ctx.stroke();}}
      ctx.beginPath();ctx.arc(mouse.x,mouse.y,2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize',init);
  document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
  document.addEventListener('mouseleave',()=>{mouse.x=-9999;mouse.y=-9999;});
  init();frame();
})();
