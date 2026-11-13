  // ===== Class ultimates: 4-second pixel-art cinematics =====
  function ultDim(dur,col,title){addFx(0,dur,(p,now)=>{const a=p<.08?p/.08:p>.9?(1-p)/.1:1;ctx.save();ctx.globalAlpha=.32*a;ctx.fillStyle='#05070a';ctx.fillRect(0,0,st.W,st.H);
    const bh=st.H*.07*a;ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,st.W,bh);ctx.fillRect(0,st.H-bh,st.W,bh);
    if(p>.03&&p<.45){const tp=clamp01((p-.03)/.1),fo=p>.35?1-(p-.35)/.1:1;ctx.globalAlpha=fo;const fs=Math.round(st.H*.075);ctx.font=`900 ${fs}px Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';const x=st.W/2+(1-ease(tp))*st.W*.15,y=st.H*.2;ctx.fillStyle='#000';ctx.fillText(title,x+st.ps*.8,y+st.ps*.8);ctx.fillStyle=col;ctx.fillText(title,x,y);ctx.fillStyle='#ffffff';ctx.globalAlpha=fo*.5;ctx.fillRect(x-st.W*.25*ease(tp),y+fs*.62,st.W*.5*ease(tp),Math.max(1,st.ps*.4))}ctx.restore()})}
  const uPx=()=>Math.max(2,Math.round(st.ps*.7));
  Object.assign(SPELLFX,{
  // Aegis Warden: Argent Bastion — transformation into the Argent Knight
  'ult_warden':R=>{st.player.anim=null;st.player.act=null;const T=4000;ultDim(T,'#e8eef6','ARGENT BASTION');knEnsure();
    setTimeout(()=>{st.player.anim={name:'raise',t0:now_(),dur:2300}},0);
    groundUnder(PMx,{r:st.H*.17,c1:'#c8d0dc',c2:'#7fc0ff',delay:100,dur:3400,seed:7,spin:.6,star:6});
    addFx(150,1700,(p,now)=>{const pm=PMx(),a=Math.sin(Math.min(1,p*1.3)*Math.PI),w=pm.w*(.9+.25*Math.sin(now/60))*a,s=uPx();ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55*a;
      const g=ctx.createLinearGradient(pm.x-w,0,pm.x+w,0);g.addColorStop(0,'#7fc0ff00');g.addColorStop(.5,'#e8f4ff');g.addColorStop(1,'#7fc0ff00');ctx.fillStyle=g;ctx.fillRect(Math.round(pm.x-w),0,Math.round(w*2),Math.round(pm.feet));
      ctx.globalAlpha=a;ctx.fillStyle='#ffffff';for(let i=0;i<10;i++){const y=((now*.4+i*67)%pm.feet),x=pm.x+Math.sin(i*2.1+now/200)*w*.7;ctx.fillRect(Math.round(x),Math.round(y),s,s*3)}ctx.restore()});
    addFx(1000,1700,p=>{st.player.knightP=ease(p)});
    [1150,1450,1750,2050,2350].forEach((t,i)=>setTimeout(()=>{const pm=PMx(),pts=[[0,.86],[0,.62],[.25,.72],[-.2,.72],[0,.1]];const[ox,oy]=pts[i];sBurst(pm.x+ox*pm.w,pm.feet-oy*pm.h,['#ffffff','#e8eef6','#7fc0ff'],12,.22,380,.6);ring(pm.x+ox*pm.w,pm.feet-oy*pm.h,pm.h*.18,'#ffffff',0,260,1.4);shake(0,st.ps*.9)},t));
    // two identical shields spiral in from afar
    addFx(2500,700,(p,now)=>{const pm=PMx(),cx=pm.x,cy=pm.feet-pm.h*.55,e=ease(p);for(let i=0;i<2;i++){const a=now/700+i*Math.PI+(1-e)*6,rx=pm.w*1.6+(1-e)*st.W*.35,ry=pm.h*.28+(1-e)*st.H*.2;knShield(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,e,.6+.4*e)}});
    setTimeout(()=>{st.player.knightOrb=true;const pm=PMx();flash('#e8f4ff',0,.4);ring(pm.x,pm.feet-pm.h*.55,pm.h*1.1,'#ffffff',0,600,3);sBurst(pm.x,pm.feet-pm.h*.55,['#ffffff','#c8d0dc','#7fc0ff'],36,.35,700,.7);shake(0,st.ps*2)},3200);
    setTimeout(()=>{st.player.anim={name:'shield',t0:now_(),dur:900}},3250);
    setTimeout(()=>{st.player.knightP=0;st.player.knightOrb=false},4100);
    return 3700},
  // Arcanist: Prismatic Cataclysm
  'ult_arcanist':R=>{const T=4000,els=R.els||['fire','ice','lightning'];ultDim(T,'#d8c4ff','PRISMATIC CATACLYSM');
    const c=chor();c.stay(150,{fr:'raise'});c.go(c.H,-st.H*.08,500,{fr:'raise',e:'out'});c.stay(2600,{fr:['beam',0,1]});c.go(c.H,0,450,{fr:'idle',e:'in'});c.stay(300,{fr:'idle'});
    const apex=()=>{const pm=PMx();return[pm.x+pm.w*.2,pm.feet-pm.h*2.05]};
    els.forEach((el,i)=>{const P=GP[el];magicCircle({at:()=>{const[ax,ay]=apex(),t=now_();return[ax+Math.cos(t/500+i*2.09)*st.H*.11*(1-clamp01((t-T0-1200)/700)),ay+Math.sin(t/500+i*2.09)*st.H*.04]},r:st.H*.075,fl:.4,c1:P[0],c2:P[2],delay:200+i*200,dur:1900-i*200,spin:1.4*(i%2?1:-1),seed:i*5+2,star:i===1?5:6})});
    const T0=now_();
    // the prism forms, spins and fires one beam per element
    addFx(1300,2500,(p,now)=>{const[ax,ay]=apex(),s=uPx(),g=ease(clamp01(p*3)),sh=p>.85?1-(p-.85)/.15:1,r=st.H*.06*g;if(r<1)return;ctx.save();ctx.globalAlpha=sh;
      const sp=now/300;const pts=[[0,-r*1.5],[r,0],[0,r*1.1],[-r,0]].map(([x,y])=>[ax+x*Math.cos(sp)-0*Math.sin(sp),ay+y]);
      ctx.fillStyle='#ffffff';pxTri(pts[0][0],pts[0][1],pts[1][0],pts[1][1],pts[3][0],pts[3][1],s);ctx.fillStyle='#d8c4ff';pxTri(pts[2][0],pts[2][1],pts[1][0],pts[1][1],pts[3][0],pts[3][1],s);
      els.forEach((el,i)=>{ctx.fillStyle=GP[el][0];const a=sp+i*2.09;ctx.fillRect(Math.round(ax+Math.cos(a)*r*1.7),Math.round(ay+Math.sin(a)*r*.6),s*1.5,s*1.5)});
      ctx.globalCompositeOperation='lighter';ctx.globalAlpha=sh*(.4+.3*Math.sin(now/60));ctx.fillStyle='#ffffff';pxDisc(ax,ay,r*.5,s);ctx.restore()});
    const shots=[2150,2650,3150];R.tickTimes=shots;
    els.forEach((el,i)=>addFx(shots[i]-120,520,p=>{const[ax,ay]=apex(),P=GP[el],s=uPx();ctx.save();ctx.globalCompositeOperation='lighter';st.foes.forEach(f=>{if(f.gone||f.state==='die')return;const m=enemyMetricsOf(f),tx=m.x,ty=m.feet-m.h*.5,a=Math.sin(Math.min(1,p*1.4)*Math.PI),w=st.ps*(3.2-p*2);
      const L=Math.hypot(tx-ax,ty-ay),ang=Math.atan2(ty-ay,tx-ax);ctx.save();ctx.translate(ax,ay);ctx.rotate(ang);ctx.globalAlpha=a;ctx.fillStyle=P[0];ctx.fillRect(0,-w,L*Math.min(1,p*4),w*2);ctx.fillStyle=P[2];ctx.fillRect(0,-w*.35,L*Math.min(1,p*4),w*.7);for(let q=0;q<L*Math.min(1,p*4);q+=s*5)ctx.fillRect(q,-w-s*((q/s|0)%3),s,s);ctx.restore()});ctx.restore()}));
    shots.forEach((t,i)=>setTimeout(()=>{st.foes.forEach(f=>{if(f.gone||f.state==='die')return;const m=enemyMetricsOf(f);gSig(els[i],m,i*7);gSpray(els[i],m.x,m.feet-m.h*.5,14,1.2)});flash(GP[els[i]][1],0,.2);shake(0,st.ps*2)},t));
    setTimeout(()=>{const[ax,ay]=apex();sBurst(ax,ay,['#ffffff','#d8c4ff',...els.map(e=>GP[e][0])],40,.4,700,.8);flash('#ffffff',0,.4)},3500);
    runChor(c,R,null);return 3200},
  // Swordsman: Thousand Petal Cut
  'ult_swordsman':R=>{const T=4000;ultDim(T,'#ffd0a0','THOUSAND PETAL CUT');const c=chor(),m=c.m,pm=c.pm,n=R.cuts||12;
    addFx(0,T,(p,now)=>{ctx.save();for(let i=0;i<26;i++){const ph=((now/2600)+i*.137)%1,x=((i*197+now*.12)%(st.W*1.1))-st.W*.05,y=st.H*(.1+ph*.85)+Math.sin(now/300+i)*st.ps*3;ctx.globalAlpha=.75*Math.sin(p*Math.PI);const s=uPx();dfR(x,y,s*1.5,s,i%3?'#ffb7c8':'#ffe0e8');dfR(x+s,y-s*.5,s*.5,s*.5,'#ff8aa8')}ctx.restore()});
    c.stay(250,{fr:['slash',0,0]});c.ev(()=>{const p2=PMx();ring(p2.x,p2.feet-p2.h*.5,p2.h*.4,'#ffe0b0',0,400,1.6)});c.stay(250,{fr:['slash',0,0]});
    const foes=()=>st.foes.filter(f=>!f.gone&&f.state!=='die');
    for(let i=0;i<n;i++){const side=i%2,dx=(side?1:-1)*(m.w*.6+pm.w*.3)*(1+((i*37)%5)*.08),lift=-st.H*(((i*53)%7)/7)*.18;
      c.blink(m.x+dx,lift,{fl:!!side,col:'#ffd0a0'});c.stay(130,{fr:'slash'});
      c.hit(()=>{const fs=foes();if(!fs.length)return;const f=fs[i%fs.length],mm=enemyMetricsOf(f),ang=((i*71)%180)/180*2.6-1.3;cutAcross&&cutAcross(mm,ang,'#ffe0b0',mm.h*1.2,1.4);for(let k=0;k<6;k++)spawn(mm.x,mm.feet-mm.h*.5,{vx:(Math.random()-.5)*.25*U(),vy:(Math.random()-.6)*.25*U(),color:k%2?'#ffb7c8':'#ffffff',size:st.ps*.5,life:420})},60)}
    c.blink(c.H,0,{fl:false,col:'#ffd0a0'});c.stay(450,{fr:['slash',0,0]});c.ev(()=>{const p2=PMx();addFx(0,450,p=>{ctx.save();ctx.globalAlpha=1-p;dfR(p2.x+p2.w*.3,p2.feet-p2.h*.62,st.ps*8*(1-p),uPx(),'#ffffff');ctx.restore()})});
    c.stay(320,{fr:['slash',0,4]});
    c.hit(()=>{foes().forEach(f=>{const mm=enemyMetricsOf(f);cutAcross&&cutAcross(mm,.8,'#ffffff',mm.h*2.2,3);cutAcross&&cutAcross(mm,-.8,'#ffffff',mm.h*2.2,3);for(let k=0;k<22;k++){const a=Math.random()*6.283;spawn(mm.x,mm.feet-mm.h*.5,{vx:Math.cos(a)*.35*U(),vy:Math.sin(a)*.35*U(),color:k%3?'#ffb7c8':'#ffffff',size:st.ps*.6,life:620})}});flash('#ffffff',0,.5);shake(0,st.ps*3.5)},100);
    c.stay(300,{fr:'idle'});R.ticks=n+1;const end=runChor(c,R,'#ffd0a0');R.ticks=0;return end}
  });

  // ---- Argent Knight: armor painted onto the stickman rig, a flowing cape, and two orbiting shields
  const KN={dk:'#2a303c',st:'#7f8aa0',mid:'#b4bdcc',lt:'#e8eef6',wh:'#ffffff',gd:'#e8b840',gl:'#fff0a0',pl:'#4a9cff',pl2:'#9fd0ff',cp:'#2a5cc0',cp2:'#173a80'};
  function knShield(x,y,sc,a){const w=S&&S.gear&&S.gear.weapon,key=w&&ITEMS[w.key]&&ITEMS[w.key].slot==='shield'?w.key:'warden_shield',ii=ITEM_ATLAS.idx[key];if(ii==null||!itemsImg.complete)return;const c=ITEM_ATLAS.cols,sz=st.ps*7*sc;ctx.save();ctx.globalAlpha=a;ctx.imageSmoothingEnabled=false;ctx.shadowColor='#e8f4ff';ctx.shadowBlur=st.ps*3;ctx.drawImage(itemsImg,(ii%c)*64,Math.floor(ii/c)*64,64,64,Math.round(x-sz/2),Math.round(y-sz/2),Math.round(sz),Math.round(sz));ctx.restore()}
  function knEnsure(){if(st._knOv)return;st._knOv=true;DOV.push({on:()=>(S.knightT>0)||st.player.knightOrb,draw:now=>{const pm=PMx(),cx=pm.x,cy=pm.feet-pm.h*.55;for(let i=0;i<2;i++){const a=now/700+i*Math.PI,x=cx+Math.cos(a)*pm.w*1.6,y=cy+Math.sin(a)*pm.h*.28+Math.sin(now/300+i)*st.ps,front=Math.sin(a)>0;
      for(let t=1;t<6;t++){const b=a-t*.12;ctx.globalAlpha=(.35-t*.05);ctx.fillStyle=KN.lt;ctx.fillRect(Math.round(cx+Math.cos(b)*pm.w*1.6),Math.round(cy+Math.sin(b)*pm.h*.28),uPx(),uPx())}
      knShield(x,y,front?1:.85,front?1:.7)}
    if(Math.random()<.3)spawn(cx+(Math.random()-.5)*pm.w*2,cy+(Math.random()-.5)*pm.h,{vy:-.02*U(),color:Math.random()<.5?'#ffffff':'#9fd0ff',size:st.ps*.4,life:500})}});dfEnsure()}
  function knightCape(hf,x0,y0,k,now,kp){const f=hf.f;if(!f.rig||!f.nk||!f.hp)return;const X=v=>x0+v*k,Y=v=>y0+v*k,nk=f.nk,hp=f.hp,r=(f.hd&&f.hd[2])||7;ctx.save();ctx.globalAlpha=kp;
    const g=ctx.createRadialGradient(X(hp[0]),Y((nk[1]+hp[1])/2),0,X(hp[0]),Y((nk[1]+hp[1])/2),r*k*5);g.addColorStop(0,'#bfe0ff55');g.addColorStop(1,'#bfe0ff00');ctx.fillStyle=g;ctx.fillRect(X(hp[0]-r*5),Y(nk[1]-r*5),r*10*k,r*12*k);
    const L=Math.hypot(hp[0]-nk[0],hp[1]-nk[1])*1.9,wv=Math.sin(now/180)*r*.5,pts=[[nk[0]-r*.5,nk[1]],[nk[0]+r*.4,nk[1]],[nk[0]-r*1.4+wv*.4,nk[1]+L*.55],[nk[0]-r*2.6+wv,nk[1]+L],[nk[0]-r*.6+wv*.6,nk[1]+L*.98]];
    ctx.fillStyle=KN.cp2;ctx.beginPath();ctx.moveTo(X(pts[0][0]),Y(pts[0][1]));ctx.lineTo(X(pts[1][0]),Y(pts[1][1]));ctx.lineTo(X(pts[4][0]),Y(pts[4][1]));ctx.lineTo(X(pts[3][0]),Y(pts[3][1]));ctx.lineTo(X(pts[2][0]),Y(pts[2][1]));ctx.closePath();ctx.fill();
    ctx.fillStyle=KN.cp;ctx.beginPath();ctx.moveTo(X(pts[0][0]),Y(pts[0][1]));ctx.lineTo(X(pts[1][0]-r*.3),Y(pts[1][1]));ctx.lineTo(X(pts[4][0]-r*.5),Y(pts[4][1]-r*.6));ctx.lineTo(X(pts[3][0]+r*.6),Y(pts[3][1]-r*.4));ctx.closePath();ctx.fill();
    ctx.fillStyle=KN.gd;for(let t=0;t<=1;t+=.1)ctx.fillRect(Math.round(X(pts[3][0]+(pts[4][0]-pts[3][0])*t)),Math.round(Y(pts[3][1]+(pts[4][1]-pts[3][1])*t)),Math.max(1,k*1.2),Math.max(1,k*1.2));ctx.restore()}
  function knightArmor(hf,x0,y0,k,now,kp){const f=hf.f;if(!f.rig||!f.hd||!f.nk||!f.hp)return;const X=v=>x0+v*k,Y=v=>y0+v*k,q=Math.max(1,Math.round(k*1.1)),r=f.hd[2],off=(1-kp)*r*6;ctx.save();ctx.imageSmoothingEnabled=false;
    const disc=(cx,cy,rr,c)=>{ctx.fillStyle=c;pxDisc(X(cx),Y(cy),rr*k,q)};
    const nk=f.nk,hp=f.hp,tx=hp[0]-nk[0],ty=hp[1]-nk[1],tl=Math.hypot(tx,ty)||1,px=-ty/tl,py=tx/tl;
    // chest plate
    ctx.globalAlpha=kp;{const o=off*.6,w1=r*1.05,w2=r*.75,P=[[nk[0]+px*w1,nk[1]+py*w1+o],[nk[0]-px*w1,nk[1]-py*w1+o],[hp[0]-px*w2,hp[1]-py*w2+o],[hp[0]+px*w2,hp[1]+py*w2+o]];
      const poly=(pts,c)=>{ctx.fillStyle=c;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));ctx.closePath();ctx.fill()};
      poly(P.map(([a,b])=>[a+(a-(nk[0]+hp[0])/2)*.12,b+(b-(nk[1]+hp[1])/2)*.08]),KN.dk);poly(P,KN.mid);poly([P[0],[(P[0][0]+P[1][0])/2,(P[0][1]+P[1][1])/2],[(P[3][0]+P[2][0])/2,(P[3][1]+P[2][1])/2],P[3]],KN.lt);
      ctx.fillStyle=KN.wh;for(let t=.1;t<.9;t+=.08)ctx.fillRect(Math.round(X(nk[0]+tx*t)),Math.round(Y(nk[1]+ty*t+o)),q,q);
      ctx.fillStyle=KN.gd;for(let t=0;t<=1;t+=.12)ctx.fillRect(Math.round(X(P[0][0]+(P[1][0]-P[0][0])*t)),Math.round(Y(P[0][1]+(P[1][1]-P[0][1])*t)),q,q);
      ctx.fillStyle=KN.dk;ctx.fillRect(Math.round(X(hp[0]-r*.85)),Math.round(Y(hp[1]-r*.15+o)),Math.round(r*1.7*k),Math.round(r*.35*k));disc(hp[0],hp[1]+o/k*0,r*.22,KN.gd)}
    // pauldrons
    ctx.globalAlpha=kp;[[1,-off],[-1,off]].forEach(([sd,o])=>{const cx=nk[0]+px*r*.95*sd+o*.3,cy=nk[1]+py*r*.95*sd+r*.15;disc(cx,cy,r*.62,KN.dk);disc(cx,cy-r*.05,r*.52,KN.mid);disc(cx-r*.12,cy-r*.18,r*.28,KN.lt);ctx.fillStyle=KN.gd;ctx.fillRect(Math.round(X(cx-r*.5)),Math.round(Y(cy+r*.3)),Math.round(r*k),q)});
    // gauntlets and greaves
    if(f.hx!=null){disc(f.hx,f.hy,r*.42,KN.dk);disc(f.hx,f.hy,r*.33,KN.mid);disc(f.hx-r*.1,f.hy-r*.1,r*.15,KN.wh)}
    if(f.bx!=null){disc(f.bx,f.by,r*.4,KN.dk);disc(f.bx,f.by,r*.31,KN.st)}
    (f.ft||[]).forEach((ft,i)=>{const o=off*(i?1:-1)*.4;ctx.fillStyle=KN.dk;ctx.fillRect(Math.round(X(ft[0]-r*.45+o)),Math.round(Y(ft[1]-r*1.2)),Math.round(r*.95*k),Math.round(r*1.3*k));ctx.fillStyle=i?KN.mid:KN.st;ctx.fillRect(Math.round(X(ft[0]-r*.35+o)),Math.round(Y(ft[1]-r*1.1)),Math.round(r*.75*k),Math.round(r*1.05*k));ctx.fillStyle=KN.lt;ctx.fillRect(Math.round(X(ft[0]-r*.35+o)),Math.round(Y(ft[1]-r*1.1)),q,Math.round(r*.9*k))});
    // great helm with visor and plume
    {const hx=f.hd[0],hy=f.hd[1]-off*1.2;ctx.globalAlpha=kp;
      for(let i=0;i<7;i++){const t=i/6;disc(hx-r*(.2+t*1.5),hy-r*(1.25-t*.15)+Math.sin(now/160+t*3)*r*.12*t,r*(.38-t*.03),i%2?KN.pl:KN.pl2)}
      disc(hx,hy,r*1.18,KN.dk);disc(hx,hy,r*1.06,KN.mid);disc(hx-r*.25,hy-r*.3,r*.55,KN.lt);disc(hx-r*.35,hy-r*.45,r*.2,KN.wh);
      ctx.fillStyle=KN.dk;ctx.fillRect(Math.round(X(hx-r*.1)),Math.round(Y(hy-r*.1)),Math.round(r*1.15*k),Math.round(r*.28*k));
      ctx.fillStyle=Math.sin(now/220)>-.3?'#9fd0ff':'#ffffff';ctx.fillRect(Math.round(X(hx+r*.55)),Math.round(Y(hy-r*.06)),Math.max(q,Math.round(r*.3*k)),Math.max(1,Math.round(r*.18*k)));
      ctx.fillStyle=KN.gd;ctx.fillRect(Math.round(X(hx-r*.08)),Math.round(Y(hy-r*1.15)),q*2,Math.round(r*.9*k));ctx.fillRect(Math.round(X(hx-r*1.0)),Math.round(Y(hy+r*.55)),Math.round(r*2*k),q)}
    ctx.restore();
    if(kp>=1&&Math.random()<.08){const p=PMx();spawn(p.x+(Math.random()-.5)*p.w,p.feet-Math.random()*p.h,{vy:-.02*U(),color:'#ffffff',size:st.ps*.35,life:300,shape:'plus'})}}
