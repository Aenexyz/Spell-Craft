  // ===== Physical techniques: choreography engine (dash, blink, afterimages, spins) =====
  EC.phys=['#5a5f68','#c0c8d0','#ffffff'];
  const EZ={lin:t=>t,out:t=>1-(1-t)*(1-t),in:t=>t*t,io:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};
  function chor(){const pm=PMx(),m=EM();const c={segs:[],evs:[],hits:[],t:0,x:pm.x,y:0,fl:false,
    H:pm.x,FR:m.x-m.w*.5-pm.w*.32,BK:m.x+m.w*.5+pm.w*.32,MX:m.x,m,pm,
    go(x,y,d,o){o=o||{};const fl=o.fl!=null?o.fl:this.fl;this.segs.push({t0:this.t,t1:this.t+d,x0:this.x,x1:x,y0:this.y,y1:y,e:EZ[o.e||'io'],arc:o.arc||0,fr:o.fr||'idle',fl,hide:!!o.hide,spin:o.spin||0,hold:o.hold});this.t+=d;this.x=x;this.y=y;this.fl=fl;return this},
    stay(d,o){return this.go(this.x,this.y,d,o)},
    blink(x,y,o){o=o||{};const ox=this.x,oy=this.y,col=o.col||'#ffffff';this.ev(()=>blinkFx(ox,oy,col));this.go(this.x,this.y,90,{hide:true,fl:o.fl});this.x=x;this.y=y;if(o.fl!=null)this.fl=o.fl;this.ev(()=>blinkFx(x,y,col));return this},
    ev(fn,off){this.evs.push([this.t+(off||0),fn]);return this},
    hit(fn,off){const t=this.t+(off||0);this.hits.push(t);this.evs.push([t,fn]);return this}};return c}
  function frameOf(fr,lt,d){if(fr&&fr.n)return[fr.n,fr.a+(fr.b-fr.a)*clamp01(lt/Math.max(1,d))];if(Array.isArray(fr)){const n=KF[fr[0]]?KF[fr[0]].length:1;return fr.length>2?[fr[0],fr[2]]:[fr[0],lt/(fr[1]||60)]}const n=KF[fr]?KF[fr].length:1;return[fr,Math.min(n-1,lt/Math.max(1,d)*(n-1))]}
  function runChor(c,R,ghost){const P=st.player,T0=now_(),segs=c.segs,last=segs[segs.length-1];P.anim=null;P.act=null;P.seq=null;P.holdFrame=null;
    const seg=t=>{for(const s of segs)if(t<s.t1)return s;return last};
    P.mv={t0:T0,dur:c.t,ghost:ghost||null,
      x:t=>{const s=seg(t),p=clamp01((t-s.t0)/Math.max(1,s.t1-s.t0));return s.x0+(s.x1-s.x0)*s.e(p)},
      y:t=>{const s=seg(t),p=clamp01((t-s.t0)/Math.max(1,s.t1-s.t0));return s.y0+(s.y1-s.y0)*s.e(p)-Math.sin(p*Math.PI)*s.arc},
      rot:t=>{const s=seg(t);if(!s.spin)return 0;const p=clamp01((t-s.t0)/Math.max(1,s.t1-s.t0));return s.spin*6.283*EZ.io(p)},
      flip:t=>seg(t).fl,hide:t=>seg(t).hide,
      frame:t=>{const s=seg(t);return frameOf(s.fr,t-s.t0,s.t1-s.t0)}};
    c.evs.forEach(([t,fn])=>setTimeout(()=>{if(S&&S.phase==='battle')fn()},t));
    const hits=c.hits.slice().sort((a,b)=>a-b);
    if(R.ticks){while(hits.length<R.ticks)hits.push(hits[hits.length-1]+60);R.tickTimes=hits.slice(0,R.ticks);return R.tickTimes[R.ticks-1]}
    return hits[hits.length-1]}
  // ---- shared hit and motion effects
  function blinkFx(x,lift,col){const pm=PMx(),y=pm.feet-pm.h*.5+lift;addFx(0,220,p=>{ctx.save();ctx.globalAlpha=1-p;ctx.fillStyle=col;const w=st.ps*(3-2*p),h=pm.h*(1.1-p*.5);ctx.fillRect(Math.round(x-w/2),Math.round(y-h/2),Math.round(w),Math.round(h));ctx.fillRect(Math.round(x-pm.w*.5*(1-p)),Math.round(y-st.ps*.5),Math.round(pm.w*(1-p)),Math.max(1,st.ps));ctx.restore()});for(let i=0;i<8;i++){const a=Math.random()*6.283,v=(.08+Math.random()*.12)*U();spawn(x,y,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:i%2?col:'#ffffff',size:st.ps*.45,life:220})}}
  function slashLine(x1,y1,x2,y2,col,w,dur){addFx(0,dur||320,p=>{const e=Math.min(1,p*3),ww=st.ps*(w||1.2)*(1-p);ctx.save();ctx.shadowColor=col;ctx.shadowBlur=st.ps*4;ctx.strokeStyle='#ffffff';ctx.lineCap='square';ctx.lineWidth=Math.max(1,ww);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+(x2-x1)*e,y1+(y2-y1)*e);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=Math.max(1,ww*2.2);ctx.globalAlpha=.35*(1-p);ctx.stroke();ctx.restore()})}
  function cutAcross(m,ang,col,len,w){const c=[m.x,m.feet-m.h*.5],L=(len||m.h*1.1);slashLine(c[0]-Math.cos(ang)*L,c[1]-Math.sin(ang)*L,c[0]+Math.cos(ang)*L,c[1]+Math.sin(ang)*L,col||'#bfe9ff',w)}
  function pImpact(m,kind,big,col){const x=m.x+(Math.random()-.5)*m.w*.3,y=m.feet-m.h*(.35+Math.random()*.3);physFx(kind==='stab'||kind==='slash'||kind==='kick'||kind==='punch'?kind:'punch',{...m,x,feet:m.feet},0,col||'#ffffff');
    sBurst(x,y,big?['#ffffff','#fff3c0','#c0c8d0']:['#ffffff','#e6e9f0'],big?26:9,big?.32:.2,big?460:300,big?.7:.5);shake(0,st.ps*(big?3:1));if(big){ring(m.x,m.feet-m.h*.5,m.h*.85,'#ffffff',0,420,2.4);flash('#ffffff',0,.28)}}
  function speedLines(dur,col){addFx(0,dur,(p,now)=>{ctx.save();ctx.globalAlpha=.35*Math.sin(p*Math.PI);ctx.fillStyle=col||'#ffffff';for(let i=0;i<14;i++){const y=st.H*(.2+((i*53)%60)/100),x=((now*2.2+i*211)%(st.W*1.4))-st.W*.2;ctx.fillRect(Math.round(x),Math.round(y),st.ps*(8+(i%3)*5),Math.max(1,st.ps*.35))}ctx.restore()})}
  function shockwave(x,feet,col,big){addFx(0,520,p=>{ctx.save();ctx.globalAlpha=1-p;ctx.fillStyle=col||'#d9c49a';dotRing(x,feet,st.H*(.05+.3*p)*(big?1.4:1),st.ps*(1+2*p),PX(),0,0);ctx.restore()});for(let i=0;i<(big?24:12);i++)spawn(x+(Math.random()-.5)*st.H*.1,feet,{vx:(Math.random()-.5)*.3*U(),vy:-(.05+Math.random()*.15)*U(),g:.0012*U(),color:pick_(['#8a6a3a','#c09461','#e0d0b0']),size:st.ps*(.5+Math.random()*.6),life:520})}
  function drawShieldPx(x,y,r,rot,a){const s=PX();ctx.save();ctx.globalAlpha=a==null?1:a;ctx.translate(x,y);ctx.rotate(rot||0);const sq=Math.max(.25,Math.abs(Math.cos(rot*1.7||0)));ctx.scale(sq,1);ctx.fillStyle='#1c120a';pxDisc(0,0,r+s,s);ctx.fillStyle='#6a7078';pxDisc(0,0,r,s);ctx.fillStyle='#9aa2ac';pxDisc(0,-s,r*.82,s);ctx.fillStyle='#7a4a28';pxDisc(0,0,r*.62,s);ctx.fillStyle='#e0b040';pxDisc(0,0,r*.25,s);ctx.fillStyle='#fff3c0';ctx.fillRect(-s,-s*2,s,s);ctx.restore()}
  function shieldFly(path,delay,dur,o){o=o||{};addFx(delay,dur,(p,now)=>{const[x,y]=path(p),r=st.ps*(o.r||3.6);drawShieldPx(x,y,r,now/(o.spd||45),1);if(o.spark&&Math.random()<.9)spawn(x,y,{vx:(Math.random()-.5)*.1*U(),vy:(Math.random()-.5)*.1*U(),color:Math.random()<.5?'#fff3c0':'#ffb347',size:st.ps*.5,life:260});ctx.save();ctx.globalAlpha=.4;ctx.fillStyle='#c0c8d0';const[bx,by]=path(Math.max(0,p-.08));ctx.fillRect(Math.round(Math.min(x,bx)),Math.round(y-st.ps*.3),Math.round(Math.abs(x-bx)),Math.max(1,st.ps*.6));ctx.restore()})}
  function heldProp(c,from,to,kind,o){o=o||{};const P=st.player;addFx(from,to-from,(p,now)=>{const pm=PMx(),hp=P.handPt||{x:pm.x+pm.w*.4,y:pm.feet-pm.h*.55},fl=P.teleFlip?-1:1;
      if(kind==='shield')drawShieldPx(hp.x+fl*st.ps*1.5,hp.y,st.ps*3.6,o.rot||0);
      else if(kind==='spear')drawSpear(hp.x,hp.y+(o.dy||0),o.ang!=null?(fl<0?Math.PI-o.ang:o.ang):(fl<0?Math.PI:0),pm.h*1.1,EC.phys,o.glow||0,1);
      else if(kind==='bow')drawBow(hp.x+fl*st.ps,hp.y,fl<0?Math.PI+(o.ang||0):(o.ang||0),o.draw?o.draw(p):.6,EC.phys,true,1,now,pm.h)})}
  const PH=c=>c.pm.feet-c.pm.h*.55;
  const atM=(c,fy)=>[c.m.x,c.m.feet-c.m.h*(fy==null?.5:fy)];

  Object.assign(SPELLFX,{
  // ---- same-card techniques
  'slash+slash':R=>{const c=chor(),m=c.m,U2=st.H;speedLines(3200);c.go(c.FR,0,320,{fr:['walk',45]});
    const pts=[[c.BK,-U2*.04,true],[c.FR,-U2*.16,false],[c.BK,-U2*.2,true],[c.FR,0,false],[c.BK,-U2*.1,true],[c.FR,-U2*.06,false]];
    pts.forEach(([x,y,fl],i)=>{c.blink(x,y,{fl,col:'#bfe9ff'});c.stay(240,{fr:'slash'});c.hit(()=>{cutAcross(EM(),(i*1.1)%3.14-1.2,'#bfe9ff');pImpact(EM(),'slash')},110)});
    c.blink(m.x-m.w*.2,-U2*.28,{fl:false});c.stay(520,{fr:'slash'});c.hit(()=>{const m2=EM();cutAcross(m2,.8,'#ffffff',m2.h*1.5,2.4);cutAcross(m2,-.8,'#ffffff',m2.h*1.5,2.4);pImpact(m2,'slash',true,'#bfe9ff');flash('#ffffff',0,.45)},260);
    c.blink(c.H,0,{fl:false});c.stay(260,{fr:'idle'});return runChor(c,R,'#7fd8ff')},
  'stab+stab':R=>{const c=chor();c.go(c.FR,0,380,{fr:['walk',45]});c.stay(260,{fr:['beam',0,0]});
    for(let i=0;i<9;i++){c.stay(170,{fr:'punch'});c.hit(()=>{const m=EM(),y=m.feet-m.h*(.3+Math.random()*.4);thrust(m.x-m.w*.3,y,m.w*.9,'#ffffff',0);pImpact(EM(),'stab')},80)}
    c.go(c.FR+st.ps*6,0,420,{fr:'punch'});c.hit(()=>{const m=EM();thrust(m.x-m.w*.6,m.feet-m.h*.5,m.w*2.2,'#fff3c0',0);pImpact(m,'stab',true,'#fff3c0')},200);
    c.go(c.H,0,420,{fr:['walk',-55]});
    addFx(640,1530,(p,now)=>{const pm=PMx(),hp=st.player.handPt;if(!hp)return;ctx.save();ctx.globalAlpha=.5;ctx.fillStyle='#e6e9f0';for(let i=0;i<6;i++){const y=hp.y+(((i*37+now/8)%60)/60-.5)*pm.h*.7;ctx.fillRect(Math.round(hp.x),Math.round(y),Math.round(pm.w*1.1),Math.max(1,st.ps*.5))}ctx.restore()});
    return runChor(c,R,'#ffffff')},
  'kick+kick':R=>{const c=chor(),U2=st.H;c.go(c.FR,0,350,{fr:['walk',45]});c.go(c.FR,-U2*.22,320,{fr:{n:'jump',a:0,b:3},e:'out'});
    for(let i=0;i<6;i++){c.stay(230,{fr:'spinkick'});c.hit(()=>{const m=EM();pImpact(m,'kick');addFx(0,240,p=>{ctx.save();ctx.globalAlpha=(1-p)*.7;ctx.fillStyle='#e6fff2';dotRing(PMx().x+PMx().w*.4,m.feet-m.h*.6,st.ps*(4+8*p),st.ps*(2+4*p),PX(),p*8,3);ctx.restore()})},120)}
    c.go(c.FR,-U2*.32,260,{fr:{n:'jump',a:0,b:3},e:'out'});c.go(c.FR+st.ps*3,0,240,{fr:'kick',e:'in'});c.hit(()=>{const m=EM();pImpact(m,'kick',true);shockwave(m.x,m.feet,'#d9c49a',true)},230);
    c.go(c.H,0,420,{fr:['walk',-55]});
    addFx(670,1700,(p,now)=>{const pm=PMx(),hp=st.player.handPt;if(!hp)return;ctx.save();ctx.globalAlpha=.6*Math.sin(p*Math.PI);ctx.fillStyle='#bff5d8';dotRing(hp.x,hp.y,pm.h*.45,pm.h*.2,PX(),now/60,3);ctx.restore()});
    return runChor(c,R,'#9fffd0')},
  'shieldbash+shieldbash':R=>{const c=chor(),U2=st.H;c.stay(500,{fr:['shield',0,1]});c.ev(()=>{shockwave(c.H,c.pm.feet,'#c0c8d0')});
    speedLines(1400,'#c0c8d0');c.go(c.FR,0,520,{fr:['walk',35],e:'in'});c.hit(()=>pImpact(EM(),'punch',false),0);
    c.go(c.FR-st.ps*10,0,260,{fr:['shield',0,1]});c.go(c.FR,0,200,{fr:['shield',0,3],e:'in'});c.hit(()=>pImpact(EM(),'punch'),0);
    c.go(c.FR-st.ps*14,-U2*.08,330,{fr:{n:'jump',a:0,b:3},e:'out'});c.go(c.FR+st.ps*2,0,260,{fr:['shield',0,4],e:'in'});c.hit(()=>{const m=EM();pImpact(m,'punch',true,'#c0c8d0');shockwave(m.x,m.feet,'#c0c8d0',true)},0);
    c.stay(300,{fr:['shield',0,4]});c.go(c.H,0,450,{fr:['walk',-55]});
    heldProp(c,500,2400,'shield');return runChor(c,R,'#c0c8d0')},
  'shieldthrow+shieldthrow':R=>{const c=chor(),m=c.m,U2=st.H,pm=c.pm;c.stay(450,{fr:['beam',0,0]});c.stay(300,{fr:'punch'});
    const pts=[[pm.x+pm.w*.5,pm.feet-pm.h*.6],[m.x,m.feet-m.h*.55],[m.x-m.w*1.6,m.feet-st.ps*2],[m.x,m.feet-m.h*.4],[m.x+m.w*.4,U2*.12],[m.x,m.feet-m.h*.6],[m.x-m.w*1.8,m.feet-m.h*1.6],[m.x,m.feet-m.h*.45],[m.x+m.w*1.5,m.feet-m.h*.9],[m.x,m.feet-m.h*.35],[pm.x+pm.w*.5,pm.feet-pm.h*.6]];
    let t=750;pts.slice(1).forEach((q,i)=>{const a=pts[i],f=230;shieldFly(p=>[a[0]+(q[0]-a[0])*p,a[1]+(q[1]-a[1])*p],t,f,{spark:true});if(q[0]===m.x)c.hits.push(t+f),c.evs.push([t+f,()=>pImpact(EM(),'punch',c.hits.length>=5)]);else c.evs.push([t+f,()=>sBurst(q[0],q[1],['#fff3c0','#c0c8d0'],8,.2,260)]);t+=f});
    c.stay(t-750+100,{fr:['beam',0,0]});c.stay(300,{fr:'punch'});c.stay(200,{fr:'idle'});heldProp(c,0,750,'shield');return runChor(c,R)},
  'arrowshot+arrowshot':R=>{const c=chor(),U2=st.H,pm=c.pm;c.stay(300,{fr:['beam',0,0]});c.go(c.H-st.W*.04,-U2*.24,450,{fr:'flip',e:'out'});c.stay(1500,{fr:['aim',0,3]});c.go(c.H,0,420,{fr:{n:'jump',a:3,b:5},e:'in'});c.stay(300,{fr:'idle'});
    magicCircle({at:()=>{const m=EM();return[m.x,st.H*.1]},r:st.H*.12,fl:.3,c1:'#c0c8d0',c2:'#ffffff',delay:700,dur:1800,spin:1.5,seed:3});
    for(let i=0;i<12;i++){const t0=780+i*110,f=260;c.evs.push([t0,()=>{const hp=st.player.handPt||PMx();arrowFly(hp.x,hp.y,EM().x+(Math.random()-.5)*st.ps*6,st.H*.06,0,180,{el:'phys'})}]);
      const tx=c.m.x+((i*37)%9/9-.5)*c.m.w*1.3,ty=c.m.feet-c.m.h*(.15+((i*53)%6)/10);arrowFly(tx-st.ps*3,st.H*.08,tx,ty,t0+200,f,{el:'phys',lin:true});c.hits.push(t0+200+f);c.evs.push([t0+200+f,()=>pImpact(EM(),'stab',i===11)])}
    heldProp(c,700,2250,'bow',{ang:-.9,draw:p=>.4+.6*Math.abs(Math.sin(p*30))});return runChor(c,R,'#c0c8d0')},
  'spearthrow+spearthrow':R=>{const c=chor(),U2=st.H,m=c.m;c.stay(300,{fr:['beam',0,0]});c.go(c.H+st.W*.08,-U2*.38,550,{fr:{n:'jump',a:0,b:3},e:'out'});
    [0,1].forEach(i=>{c.stay(380,{fr:'punch'});const t0=c.t-200;c.evs.push([t0,()=>{const hp=st.player.handPt||PMx(),mm=EM();spearFly(hp.x,hp.y,mm.x+(i?.3:-.3)*mm.w,mm.feet-mm.h*.3,0,240,{el:'phys'})}]);c.hits.push(t0+240);c.evs.push([t0+240,()=>pImpact(EM(),'stab')])});
    c.stay(250,{fr:['jump',0,3]});c.go(m.x-m.w*.4,-U2*.4,350,{fr:['jump',0,4],e:'out'});c.go(m.x-m.w*.2,0,260,{fr:['punch',0,3],e:'in'});c.hit(()=>{const mm=EM();pImpact(mm,'stab',true);shockwave(mm.x,mm.feet,'#d9c49a',true);thrust(mm.x,mm.feet-mm.h*.9,mm.h*.9,'#ffffff',0)},0);
    c.stay(300,{fr:['punch',0,3]});c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,c.t-1050,c.t-750,'spear',{ang:Math.PI/2});
    return runChor(c,R,'#e0d0b0')},
  // ---- mixed blades and fists
  'slash+stab':R=>{const c=chor(),m=c.m;c.stay(700,{fr:['beam',0,0]});c.ev(()=>{const pm=PMx();for(let i=0;i<18;i++)spawn(pm.x+(Math.random()-.5)*pm.w*2,pm.feet-Math.random()*pm.h,{vx:(Math.random()-.5)*.02*U(),vy:-(.01+Math.random()*.02)*U(),color:'#ffd0e0',size:st.ps*.5,life:900})},100);
    c.stay(500,{fr:['slash',0,0]});c.ev(()=>flash('#000000',0,.35));c.blink(c.BK+st.ps*4,0,{fl:true,col:'#ffffff'});c.ev(()=>slashLine(c.H,PH(c),c.BK+st.ps*4,PH(c),'#ffffff',1.6,600));c.stay(900,{fr:['slash',0,3]});
    c.hit(()=>{const mm=EM();cutAcross(mm,-.25,'#ffd0e0',mm.h*1.2,1.4);pImpact(mm,'stab')},450);c.hit(()=>{const mm=EM();cutAcross(mm,.6,'#ffffff',mm.h*1.6,2.6);cutAcross(mm,-.9,'#ffd0e0',mm.h*1.3,1.6);pImpact(mm,'slash',true,'#ffd0e0')},800);
    c.stay(250,{fr:'idle',fl:true});c.blink(c.H,0,{fl:false});c.stay(250,{fr:'idle'});return runChor(c,R,'#ffd0e0')},
  'kick+slash':R=>{const c=chor(),U2=st.H;c.go(c.FR,0,380,{fr:['walk',45]});c.stay(300,{fr:'kick'});c.hit(()=>pImpact(EM(),'kick'),150);
    c.go(c.FR-st.ps*8,-U2*.2,420,{fr:'flip',e:'out'});c.go(c.FR,-U2*.08,300,{fr:'slash',e:'in'});c.hit(()=>{const m=EM();cutAcross(m,1.1,'#fff3c0');pImpact(m,'slash')},150);
    c.go(c.FR,-st.H*.06,300,{fr:'spinkick'});c.hit(()=>pImpact(EM(),'kick'),150);
    c.go(c.FR,-U2*.24,300,{fr:{n:'jump',a:0,b:3},e:'out'});c.go(c.FR+st.ps*2,0,520,{fr:'slash',e:'in'});c.hit(()=>{const m=EM(),cx=m.x,cy=m.feet-m.h*.55;addFx(0,450,p=>{ctx.save();ctx.globalAlpha=1-p;ctx.strokeStyle='#fff3c0';ctx.shadowColor='#ffd36b';ctx.shadowBlur=st.ps*6;ctx.lineWidth=st.ps*(2.6-p*2);ctx.beginPath();ctx.arc(cx,cy,m.h*.75,-2.4+p*.6,.6+p*.6);ctx.stroke();ctx.restore()});pImpact(m,'slash',true,'#fff3c0')},400);
    c.go(c.H,0,450,{fr:['walk',-55]});return runChor(c,R,'#fff3c0')},
  'punch+slash':R=>{const c=chor();c.go(c.FR,0,380,{fr:['walk',45]});
    for(let i=0;i<5;i++){const k=i%2?'slash':'punch';c.stay(280,{fr:k});c.hit(()=>{const m=EM();if(k==='slash')cutAcross(m,(i%4?-1:1)*.7,'#ffffff');pImpact(m,k)},140)}
    c.go(c.FR-st.ps*8,0,260,{fr:['beam',0,0]});c.go(c.FR+st.ps*2,0,480,{fr:'slash',e:'in'});c.hit(()=>{const m=EM();cutAcross(m,.9,'#ffffff',m.h*1.4,2.2);cutAcross(m,-.9,'#ffffff',m.h*1.4,2.2);pImpact(m,'slash',true)},300);
    c.go(c.H,0,450,{fr:['walk',-55]});speedLines(2200);return runChor(c,R,'#e6e9f0')},
  'kick+stab':R=>{const c=chor(),U2=st.H;c.go(c.FR-st.ps*8,0,480,{fr:['roll',60]});c.stay(400,{fr:['beam',0,0],e:'lin'});c.ev(()=>{const pm=PMx();for(let i=0;i<10;i++)spawn(pm.x+(Math.random()-.5)*pm.w,pm.feet,{vy:-.03*U(),color:'#7fe08a',size:st.ps*.5,life:500})});
    c.go(c.FR,st.ps*3,360,{fr:'kick',e:'in'});c.hit(()=>{const m=EM();pImpact({...m},'kick');shockwave(m.x-m.w*.3,m.feet,'#d9c49a')},200);
    c.stay(300,{fr:['beam',0,0]});c.go(c.FR+st.ps*4,-U2*.18,500,{fr:'punch',e:'out'});c.hit(()=>{const m=EM();thrust(m.x-m.w*.4,m.feet-m.h*.75,m.w*1.6,'#7fe08a',0);pImpact(m,'stab',true,'#7fe08a')},260);
    c.go(c.FR,0,350,{fr:{n:'jump',a:3,b:5},e:'in'});c.go(c.H,0,450,{fr:['walk',-55]});
    addFx(1180,900,(p,now)=>{const m=EM();ctx.save();ctx.globalAlpha=.6*(1-p);ctx.strokeStyle='#7fe08a';ctx.lineWidth=st.ps;ctx.beginPath();for(let i=0;i<=20;i++){const x=c.FR-m.w*.2+i/20*m.w*1.2,y=m.feet-m.h*(.1+.65*i/20)+Math.sin(i*.9+now/60)*st.ps*2;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.restore()});return runChor(c,R,'#7fe08a')},
  'punch+stab':R=>{const c=chor(),m=c.m;c.go(c.FR,0,440,{fr:['roll',55]});const spots=[[.1,.75],[-.2,.55],[.25,.45],[-.1,.3],[.15,.6]];
    spots.forEach(([dx,dy],i)=>{c.stay(240,{fr:'punch'});c.hit(()=>{const mm=EM(),x=mm.x+dx*mm.w,y=mm.feet-mm.h*dy;pImpact(mm,'stab');addFx(0,1800-i*240,(p,now)=>{ctx.save();ctx.globalAlpha=.9;ctx.fillStyle=Math.sin(now/80)>0?'#ffe866':'#ff6b5e';ctx.shadowColor='#ffe866';ctx.shadowBlur=st.ps*4;pxDisc(x,y,st.ps*1.1,PX());ctx.restore()})},120)});
    c.stay(400,{fr:['beam',0,0]});c.go(c.FR+st.ps*3,0,450,{fr:'punch',e:'in'});c.hit(()=>{const mm=EM();spots.forEach(([dx,dy],i)=>sBurst(mm.x+dx*mm.w,mm.feet-mm.h*dy,['#ffe866','#ff6b5e','#ffffff'],10,.22,380));pImpact(mm,'punch',true,'#ffe866');flash('#ffe866',0,.3)},250);
    c.stay(250,{fr:'idle'});c.go(c.H,0,450,{fr:['walk',-55]});return runChor(c,R,'#ffe866')},
  'kick+punch':R=>{const c=chor(),U2=st.H;speedLines(3000,'#ffb347');c.go(c.FR,0,400,{fr:['roll',50]});
    c.stay(220,{fr:'punch'});c.hit(()=>pImpact(EM(),'punch'),110);c.stay(220,{fr:'punch'});c.hit(()=>pImpact(EM(),'punch'),110);c.stay(260,{fr:'kick'});c.hit(()=>pImpact(EM(),'kick'),130);
    c.blink(c.BK,0,{fl:true,col:'#ffb347'});c.go(c.BK,-U2*.12,360,{fr:'uppercut',e:'out'});c.hit(()=>pImpact(EM(),'punch'),160);
    c.blink(c.FR-st.W*.06,-U2*.3,{fl:false,col:'#ffb347'});c.stay(300,{fr:['jump',0,3]});c.go(c.FR+st.ps*3,0,320,{fr:'kick',e:'in'});c.hit(()=>{const m=EM();pImpact(m,'kick',true,'#ffb347');shockwave(m.x,m.feet,'#ffb347',true);
      addFx(0,700,(p,now)=>{const x0=c.FR-st.W*.06,y0=PMx().feet-PMx().h*.5;ctx.save();ctx.globalAlpha=.8*(1-p);for(let i=0;i<18;i++){const f=i/18,x=x0+(m.x+m.w-x0)*f*(.4+p),y=y0+Math.sin(f*9+now/60)*st.ps*4*(1-f);ctx.fillStyle=i%3?'#ffb347':'#fff3b0';pxDisc(x,y,st.ps*(2.2-f*1.4),PX())}ctx.restore()})},300);
    c.stay(250,{fr:'idle'});c.go(c.H,0,450,{fr:['walk',-55]});return runChor(c,R,'#ffb347')},
  // ---- shield techniques
  'shieldbash+slash':R=>{const c=chor();c.go(c.FR,0,420,{fr:['walk',45]});c.stay(350,{fr:['shield',0,1]});c.go(c.FR+st.ps*3,0,250,{fr:['shield',0,4],e:'in'});c.hit(()=>{const m=EM();pImpact(m,'punch');for(let i=0;i<14;i++)spawn(m.x-m.w*.4,m.feet-m.h*.5,{vx:(Math.random()*.2)*U(),vy:(Math.random()-.5)*.25*U(),g:.001*U(),color:pick_(['#59c9c2','#c0c8d0','#ffffff']),size:st.ps*.6,life:500})},120);
    c.stay(400,{fr:['beam',0,0]});c.go(c.FR,-st.H*.2,520,{fr:'slash',e:'out'});c.hit(()=>{const m=EM();cutAcross(m,-1.25,'#ffffff',m.h*1.5,2.4);pImpact(m,'slash',true)},260);
    c.go(c.FR,0,300,{fr:{n:'jump',a:3,b:5},e:'in'});c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,420,1450,'shield');return runChor(c,R,'#c0c8d0')},
  'shieldbash+stab':R=>{const c=chor();c.stay(350,{fr:['shield',0,1]});c.go(c.FR-st.ps*5,0,600,{fr:['walk',70],e:'lin'});
    for(let i=0;i<3;i++){c.stay(330,{fr:'punch'});c.hit(()=>{const m=EM();thrust(m.x-m.w*.5,m.feet-m.h*(.35+i*.12),m.w*1.2,'#ffffff',0);pImpact(m,'stab')},160)}
    c.go(c.FR+st.ps*2,0,320,{fr:['shield',0,4],e:'in'});c.hit(()=>pImpact(EM(),'punch',true,'#c0c8d0'),150);c.stay(250,{fr:['shield',0,4]});c.go(c.H,0,450,{fr:['walk',-55]});
    heldProp(c,0,c.t-450,'shield');return runChor(c,R,'#c0c8d0')},
  'kick+shieldbash':R=>{const c=chor();c.stay(350,{fr:['jump',0,1]});c.go(c.H,-st.H*.05,200,{fr:['jump',0,3]});
    c.go(c.FR-st.ps*4,-st.H*.04,750,{fr:['shield',0,4],e:'in'});c.ev(()=>{addFx(0,750,(p,now)=>{const pm=PMx();drawShieldPx(pm.x,pm.feet-st.ps*1.5,st.ps*4.5,Math.PI/2.05,1);for(let i=0;i<2;i++)spawn(pm.x-pm.w*.3,pm.feet,{vx:-(.1+Math.random()*.1)*U(),vy:-(.02+Math.random()*.06)*U(),color:Math.random()<.5?'#fff3c0':'#ffb347',size:st.ps*.5,life:300})})});speedLines(800);
    c.hit(()=>{const m=EM();pImpact(m,'punch',true,'#ffb347');shockwave(m.x,m.feet,'#ffb347')},0);
    c.go(c.FR-st.ps*6,-st.H*.22,360,{fr:'flip',e:'out'});c.stay(260,{fr:'kick'});c.hit(()=>pImpact(EM(),'kick'),130);c.stay(260,{fr:'kick'});c.hit(()=>pImpact(EM(),'kick'),130);
    c.go(c.FR-st.ps*10,0,330,{fr:{n:'jump',a:3,b:5},e:'in'});c.go(c.H,0,450,{fr:['walk',-55]});return runChor(c,R,'#ffb347')},
  'punch+shieldbash':R=>{const c=chor(),U2=st.H;c.go(c.FR-st.ps*6,0,400,{fr:['walk',45]});c.stay(400,{fr:['shield',0,1]});c.go(c.FR-st.ps*4,-U2*.34,600,{fr:{n:'jump',a:0,b:3},e:'out'});c.stay(350,{fr:['jump',0,3]});
    c.go(c.FR,0,240,{fr:['shield',0,4],e:'in'});c.hit(()=>{const m=EM();pImpact(m,'punch',true,'#d9c49a');shockwave(m.x-m.w*.4,m.feet,'#d9c49a',true);foesM().forEach(f=>{sBurst(f.x,f.feet,['#8a6a3a','#d9c49a'],14,.25,500);ring(f.x,f.feet-st.ps,f.w,'#d9c49a',0,500,2)});flash('#d9c49a',0,.3);shake(0,st.ps*5);
      gfx(0,1300,p=>{const m2=EM();ctx.save();ctx.globalAlpha=.7*(1-p);ctx.strokeStyle='#2a1a10';ctx.lineWidth=st.ps*.6;for(let i=0;i<6;i++){const a=i/6*Math.PI;ctx.beginPath();ctx.moveTo(m2.x-m2.w*.4,m2.feet);ctx.lineTo(m2.x-m2.w*.4+Math.cos(a)*m2.w*1.5,m2.feet+Math.sin(a)*st.ps*2);ctx.stroke()}ctx.restore()})},0);
    c.stay(500,{fr:['shield',0,4]});c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,400,c.t-450,'shield');return runChor(c,R,'#d9c49a')},
  'shieldthrow+slash':R=>{const c=chor(),m=c.m,pm=c.pm;c.stay(400,{fr:['beam',0,0]});c.stay(260,{fr:'punch'});
    const A=[pm.x+pm.w*.5,pm.feet-pm.h*.6],B=[m.x,m.feet-m.h*.55],Cc=[m.x+m.w*1.6,m.feet-m.h*1.1];shieldFly(p=>[A[0]+(B[0]-A[0])*p,A[1]+(B[1]-A[1])*p],660,280);c.hits.push(940);c.evs.push([940,()=>pImpact(EM(),'punch')]);shieldFly(p=>[B[0]+(Cc[0]-B[0])*p,B[1]+(Cc[1]-B[1])*p-Math.sin(p*Math.PI)*st.H*.08],940,500);
    c.go(c.FR,0,380,{fr:['walk',40]});c.stay(260,{fr:'slash'});c.hit(()=>{cutAcross(EM(),.8,'#ffffff');pImpact(EM(),'slash')},130);c.stay(260,{fr:'slash'});c.hit(()=>{cutAcross(EM(),-.8,'#ffffff');pImpact(EM(),'slash')},130);
    shieldFly(p=>[Cc[0]+(c.FR-Cc[0])*p,Cc[1]+(PH(c)-Cc[1])*p],1960,360);c.stay(400,{fr:['beam',0,0]});c.hits.push(2160);c.evs.push([2160,()=>pImpact(EM(),'punch',true)]);
    c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,c.t-450,c.t,'shield');return runChor(c,R,'#c0c8d0')},
  'shieldthrow+stab':R=>{const c=chor(),m=c.m,pm=c.pm;c.stay(450,{fr:['beam',0,0]});c.stay(260,{fr:'punch'});
    const A=[pm.x+pm.w*.5,pm.feet-pm.h*.6],B=[m.x,m.feet-m.h*.55];shieldFly(p=>[A[0]+(B[0]-A[0])*p,A[1]+(B[1]-A[1])*p],710,300);c.hits.push(1010);c.evs.push([1010,()=>{pImpact(EM(),'punch');shake(0,st.ps*2)}]);
    addFx(1010,2000,(p,now)=>{const mm=EM();drawShieldPx(mm.x+mm.w*.6,mm.feet-st.ps*3,st.ps*3.6,1.4,p>.8?(1-p)/.2:1)});
    c.stay(400,{fr:['beam',0,0]});c.go(c.FR,0,360,{fr:['walk',35],e:'in'});c.stay(500,{fr:'punch'});c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.5,mm.feet-mm.h*.5,mm.w*1.8,'#b18bff',0);pImpact(mm,'stab',true,'#b18bff');
      gfx(0,1400,(p,now)=>{const m2=EM();ctx.save();ctx.globalAlpha=1-p;ctx.fillStyle='#b18bff';groundGlyphs(m2);ctx.restore()})},250);
    c.stay(350,{fr:'idle'});c.go(c.H,0,450,{fr:['walk',-55]});return runChor(c,R,'#b18bff')},
  'kick+shieldthrow':R=>{const c=chor(),m=c.m,pm=c.pm;c.stay(350,{fr:['jump',0,1]});const bx=pm.x+pm.w*.7;
    addFx(0,600,p=>{const y=pm.feet-st.ps*3-Math.sin(p*Math.PI)*pm.h*.6;drawShieldPx(bx,y,st.ps*3.4,p*6,1)});
    c.stay(250,{fr:['jump',0,3]});c.stay(250,{fr:'kick'});let t=600;
    for(let i=0;i<4;i++){const f=280,A=i?[m.x+m.w*1.3,m.feet-m.h*(.2+.4*(i%2))]:[bx,pm.feet-pm.h*.4],B=[m.x,m.feet-m.h*(.3+.15*i)];shieldFly(p=>[A[0]+(B[0]-A[0])*p,A[1]+(B[1]-A[1])*p-Math.sin(p*Math.PI)*st.H*.05],t,f,{spark:true});c.hits.push(t+f);c.evs.push([t+f,()=>pImpact(EM(),'kick',i===3)]);
      if(i<3)shieldFly(p=>[B[0]+(m.x+m.w*1.3-B[0])*p,B[1]-Math.sin(p*Math.PI)*st.H*.12],t+f,260);t+=f+260}
    c.stay(t-850,{fr:['beam',0,0]});c.stay(300,{fr:'idle'});return runChor(c,R)},
  'punch+shieldthrow':R=>{const c=chor(),m=c.m,pm=c.pm;c.stay(500,{fr:['beam',0,0]});c.ev(()=>{addFx(0,500,(p,now)=>{const p2=PMx();drawShieldPx(p2.x+p2.w*.7,p2.feet-p2.h*.55,st.ps*3.6,now/40,1)})});
    c.stay(320,{fr:'punch'});c.hit(()=>{sBurst(pm.x+pm.w*.8,pm.feet-pm.h*.55,['#fff3c0','#ffb347'],16,.25,320);shake(0,st.ps*1.5)},120);
    const A=[pm.x+pm.w*.8,pm.feet-pm.h*.55],B=[m.x,m.feet-m.h*.5];shieldFly(p=>[A[0]+(B[0]-A[0])*p,A[1]+(B[1]-A[1])*p],640,300,{spark:true,spd:20,r:4.2});
    addFx(940,900,(p,now)=>{const mm=EM();drawShieldPx(mm.x-mm.w*.3,mm.feet-mm.h*.5,st.ps*4.2,now/18,1);for(let i=0;i<3;i++)spawn(mm.x-mm.w*.3,mm.feet-mm.h*.5,{vx:-(.1+Math.random()*.2)*U(),vy:(Math.random()-.5)*.3*U(),g:.001*U(),color:Math.random()<.5?'#fff3c0':'#ffb347',size:st.ps*.5,life:300})});
    [1000,1400,1800].forEach((t,i)=>{c.hits.push(t);c.evs.push([t,()=>pImpact(EM(),'punch',i===2,'#ffb347')])});
    shieldFly(p=>[B[0]+(A[0]-B[0])*p,B[1]+(A[1]-B[1])*p-Math.sin(p*Math.PI)*st.H*.1],1840,420);c.stay(1200,{fr:['beam',0,0]});c.stay(400,{fr:'idle'});return runChor(c,R,'#ffb347')},
  'shieldbash+shieldthrow':R=>{const c=chor(),m=c.m,pm=c.pm;c.stay(400,{fr:['beam',0,0]});c.stay(250,{fr:'punch'});
    const A=[pm.x+pm.w*.5,pm.feet-pm.h*.6],B=[m.x,m.feet-m.h*.5];shieldFly(p=>[A[0]+(B[0]-A[0])*p,A[1]+(B[1]-A[1])*p],650,280);c.hits.push(930);c.evs.push([930,()=>pImpact(EM(),'punch')]);
    shieldFly(p=>[B[0]+(c.FR-B[0])*p,B[1]-Math.sin(p*Math.PI)*st.H*.15],930,520);c.go(c.FR,0,520,{fr:['walk',40]});c.stay(200,{fr:['jump',0,2]});
    c.go(c.FR-st.ps*6,-st.H*.1,300,{fr:['shield',0,1],e:'out'});c.go(c.FR+st.ps*2,0,240,{fr:['shield',0,4],e:'in'});c.hit(()=>{const mm=EM();pImpact(mm,'punch',true,'#59c9c2');ring(PMx().x,PMx().feet-PMx().h*.5,PMx().h*.7,'#59c9c2',200,500,2)},0);
    c.stay(400,{fr:['shield',0,4]});c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,1450,c.t,'shield');return runChor(c,R,'#59c9c2')},
  // ---- bow techniques
  'arrowshot+slash':R=>{const c=chor();c.go(c.FR,0,380,{fr:['walk',45]});c.stay(320,{fr:'slash'});c.hit(()=>{cutAcross(EM(),.9,'#ffffff');pImpact(EM(),'slash')},150);
    c.go(c.FR-st.W*.18,-st.H*.22,600,{fr:'flip',e:'out'});
    for(let i=0;i<3;i++){c.stay(260,{fr:['aim',0,3]});const t0=c.t-200;c.evs.push([t0,()=>{const hp=st.player.handPt||PMx(),mm=EM();arrowFly(hp.x,hp.y,mm.x,mm.feet-mm.h*(.3+i*.15),0,200,{el:'phys'})}]);c.hits.push(t0+200);c.evs.push([t0+200,()=>pImpact(EM(),'stab',i===2)])}
    c.go(c.H,0,500,{fr:{n:'jump',a:3,b:5},e:'in'});c.stay(300,{fr:'idle'});heldProp(c,980,2350,'bow',{ang:.25});return runChor(c,R,'#e6e9f0')},
  'arrowshot+punch':R=>{const c=chor();c.go(c.FR,0,380,{fr:['walk',45]});c.stay(400,{fr:'punch'});c.hit(()=>{pImpact(EM(),'punch');shake(0,st.ps*2)},180);
    c.stay(250,{fr:['beam',0,0]});c.stay(900,{fr:['aim',0,3]});c.ev(()=>{const hp=st.player.handPt;addFx(0,700,p=>{if(!hp)return;const g=ctx.createRadialGradient(hp.x+st.ps*4,hp.y,0,hp.x+st.ps*4,hp.y,st.ps*(3+8*p));g.addColorStop(0,'#ffffffcc');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.fillRect(hp.x-st.ps*8,hp.y-st.ps*12,st.ps*24,st.ps*24)})},100);
    c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.6,mm.feet-mm.h*.55,mm.w*2.4,'#ffffff',0);pImpact(mm,'stab',true);flash('#ffffff',0,.4)},820);c.go(c.FR-st.ps*14,0,300,{fr:['aim',0,3],e:'out'});
    c.stay(250,{fr:'idle'});c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,1030,2230,'bow',{draw:p=>Math.min(1,p*1.4)});return runChor(c,R,'#ffffff')},
  'arrowshot+stab':R=>{const c=chor();speedLines(900);c.go(c.FR,0,400,{fr:['roll',50]});c.go(c.BK+st.ps*8,0,350,{fr:'punch',e:'in'});c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.6,mm.feet-mm.h*.5,mm.w*2,'#ffffff',0);pImpact(mm,'stab')},150);
    c.stay(300,{fr:'flip',fl:true});
    for(let i=0;i<3;i++){c.stay(330,{fr:['aim',0,3],fl:true});const t0=c.t-250;c.evs.push([t0,()=>{const hp=st.player.handPt||PMx(),mm=EM();arrowFly(hp.x,hp.y,mm.x,mm.feet-mm.h*(.35+i*.12),0,140,{el:'phys'})}]);c.hits.push(t0+140);c.evs.push([t0+140,()=>pImpact(EM(),'stab',i===2)])}
    c.stay(250,{fr:'idle',fl:true});c.blink(c.H,0,{fl:false});c.stay(300,{fr:'idle'});heldProp(c,950,2240,'bow');return runChor(c,R,'#ffffff')},
  'arrowshot+shieldbash':R=>{const c=chor();c.go(c.H+st.W*.06,0,350,{fr:['walk',45]});c.stay(300,{fr:['shield',0,4]});c.ev(()=>{const pm=PMx(),sx=pm.x+pm.w*.9;shockwave(sx,pm.feet,'#c0c8d0');addFx(0,2500,p=>{const p2=PMx();drawShieldPx(c.H+st.W*.06+p2.w*.9,p2.feet-st.ps*4.5,st.ps*4.6,0,p>.85?(1-p)/.15:Math.min(1,p*10))})},150);
    for(let i=0;i<6;i++){c.stay(300,{fr:['aim',0,3]});const t0=c.t-220;c.evs.push([t0,()=>{const hp=st.player.handPt||PMx(),mm=EM();arrowFly(hp.x,hp.y-st.ps*2,mm.x+(Math.random()-.5)*mm.w*.3,mm.feet-mm.h*(.3+Math.random()*.4),0,220,{el:'phys',arc:st.H*.05})}]);c.hits.push(t0+220);c.evs.push([t0+220,()=>pImpact(EM(),'stab',i===5)])}
    c.stay(300,{fr:'idle'});c.go(c.H,0,400,{fr:['walk',-55]});heldProp(c,650,c.t-700,'bow',{ang:-.12});return runChor(c,R,'#c0c8d0')},
  'arrowshot+shieldthrow':R=>{const c=chor(),pm=c.pm,m=c.m;c.stay(350,{fr:['beam',0,0]});c.stay(250,{fr:'punch'});const S0=[pm.x+pm.w*.6,pm.feet-pm.h*.6],SP=[(pm.x+m.x)/2,st.H*.25];
    shieldFly(p=>[S0[0]+(SP[0]-S0[0])*EZ.out(p),S0[1]+(SP[1]-S0[1])*EZ.out(p)],600,500);c.hits.push(1100);c.evs.push([1100,()=>{}]);
    addFx(1100,700,(p,now)=>drawShieldPx(SP[0],SP[1]+Math.sin(now/120)*st.ps,st.ps*3.6,now/80,1));
    c.stay(300,{fr:['aim',0,3]});c.ev(()=>{const hp=st.player.handPt||PMx();arrowFly(hp.x,hp.y,SP[0],SP[1],0,200,{el:'phys'})});c.stay(500,{fr:['aim',0,3]});
    c.ev(()=>{sBurst(SP[0],SP[1],['#ffffff','#fff3c0'],20,.3,320);flash('#ffffff',0,.2)},-300);
    for(let i=0;i<4;i++){const t0=c.t-300,f=260;const tx=m.x+(i-1.5)*m.w*.2,ty=m.feet-m.h*(.25+i*.13);arrowFly(SP[0],SP[1],tx,ty,t0,f,{el:'phys'});c.hits.push(t0+f);c.evs.push([t0+f,()=>pImpact(EM(),'stab',i===3)])}
    c.hits.splice(0,1);c.hits.unshift(c.t-300+20);c.evs.push([c.t-300+20,()=>{}]);
    shieldFly(p=>[SP[0]+(S0[0]-SP[0])*p,SP[1]+(S0[1]-SP[1])*p],c.t,450);c.stay(700,{fr:['beam',0,0]});heldProp(c,600,c.t-700,'bow',{ang:-.6});return runChor(c,R)},
  'arrowshot+spearthrow':R=>{const c=chor(),pm=c.pm;c.stay(500,{fr:['beam',0,0]});c.go(c.H-st.ps*6,0,300,{fr:['shield',0,4]});c.stay(1300,{fr:['aim',0,3]});
    c.ev(()=>{const hp=st.player.handPt||{x:pm.x,y:PH(c)};addFx(0,1300,(p,now)=>{const pm2=PMx(),h2=st.player.handPt||hp,d=EZ.out(clamp01(p*1.3));drawBow(h2.x,h2.y,0,d,EC.phys,false,1,now,pm2.h*1.5);drawSpear(h2.x-pm2.h*(.1+.25*d),h2.y,0,pm2.h*1.3,EC.phys,d,1)})},0);
    c.ev(()=>{const hp=st.player.handPt||PMx(),mm=EM();shake(0,st.ps*2);spearFly(hp.x,hp.y,mm.x,mm.feet-mm.h*.5,0,200,{el:'phys',scale:1.2});speedLines(400)},1300);
    c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.5,mm.feet-mm.h*.5,mm.w*2.6,'#ffffff',0);pImpact(mm,'stab',true);shockwave(mm.x,mm.feet,'#c0c8d0',true);flash('#ffffff',0,.45)},1500);
    c.go(c.H-st.ps*16,0,350,{fr:['aim',0,3],e:'out'});c.stay(300,{fr:'idle'});c.go(c.H,0,400,{fr:['walk',-55]});return runChor(c,R)},
  // ---- spear techniques
  'slash+spearthrow':R=>{const c=chor(),m=c.m,U2=st.H;c.stay(400,{fr:['beam',0,0]});c.go(c.H,-U2*.6,450,{fr:{n:'jump',a:3,b:5},e:'in'});c.stay(700,{fr:['jump',0,3],hide:true});c.ev(()=>{const mm=EM();addFx(0,700,(p,now)=>{ctx.save();ctx.globalAlpha=.6*Math.sin(p*Math.PI);ctx.fillStyle='#1c120a';ctx.beginPath();ctx.ellipse(mm.x,mm.feet,mm.w*(1.4-p*.8),st.ps*1.4,0,0,6.283);ctx.fill();ctx.restore()})});
    c.x=m.x-m.w*.15;c.y=-U2*.6;c.go(m.x-m.w*.15,0,260,{fr:['punch',0,3],e:'in'});c.hit(()=>{const mm=EM();pImpact(mm,'stab',true);shockwave(mm.x,mm.feet,'#d9c49a',true);thrust(mm.x,mm.feet-mm.h*1.1,mm.h*1.1,'#ffffff',0)},0);
    c.go(c.FR,-U2*.08,300,{fr:{n:'jump',a:0,b:3},e:'out'});c.stay(320,{fr:'slash'});c.hit(()=>{cutAcross(EM(),-1,'#ffffff',EM().h*1.3,2);pImpact(EM(),'slash')},150);
    c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,1550,1810,'spear',{ang:Math.PI/2});return runChor(c,R,'#e0d0b0')},
  'spearthrow+stab':R=>{const c=chor();c.go(c.FR-st.ps*10,0,380,{fr:['walk',45]});c.ev(()=>{addFx(0,500,(p,now)=>{const hp=st.player.handPt;if(hp)drawSpear(hp.x,hp.y,now/40,PMx().h*1.1,EC.phys,.3,1)})});c.stay(500,{fr:['beam',0,0]});
    for(let i=0;i<6;i++){c.stay(210,{fr:'punch'});c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.7,mm.feet-mm.h*(.3+((i*37)%5)/10),mm.w*1.4,'#ffffff',0);pImpact(mm,'stab')},100)}
    c.go(c.FR-st.ps*16,0,300,{fr:['beam',0,0]});c.stay(320,{fr:'punch'});c.ev(()=>{const hp=st.player.handPt||PMx(),mm=EM();spearFly(hp.x,hp.y,mm.x,mm.feet-mm.h*.5,0,200,{el:'phys'})},100);c.hit(()=>pImpact(EM(),'stab',true),300);
    c.stay(250,{fr:'idle'});c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,880,2140,'spear',{ang:0});return runChor(c,R,'#e6e9f0')},
  'kick+spearthrow':R=>{const c=chor(),U2=st.H;c.go(c.FR-st.W*.1,0,400,{fr:['walk',40]});c.ev(()=>{const x=c.FR-st.W*.1+PMx().w*.3;addFx(0,700,p=>{const pm=PMx();drawSpear(x,pm.feet-pm.h*.6,-Math.PI/2+.5*EZ.io(p),pm.h*1.3,EC.phys,0,1)})});
    c.go(c.FR-st.W*.05,-U2*.42,700,{fr:'flip',e:'out'});c.stay(300,{fr:['jump',0,3]});c.go(c.FR+st.ps*2,-U2*.05,320,{fr:'kick',e:'in'});c.hit(()=>{const mm=EM();pImpact(mm,'kick',true,'#ffd36b');shockwave(mm.x,mm.feet,'#ffd36b',true)},300);
    c.go(c.FR-st.ps*10,0,300,{fr:{n:'jump',a:3,b:5},e:'in'});c.stay(300,{fr:'punch'});c.ev(()=>{const hp=st.player.handPt||PMx(),mm=EM();spearFly(hp.x,hp.y,mm.x,mm.feet-mm.h*.45,0,180,{el:'phys'})},100);c.hit(()=>pImpact(EM(),'stab'),280);
    c.go(c.H,0,450,{fr:['walk',-55]});return runChor(c,R,'#ffd36b')},
  'punch+spearthrow':R=>{const c=chor();c.go(c.FR-st.ps*12,0,380,{fr:['walk',45]});c.stay(400,{fr:['beam',0,0]});c.stay(300,{fr:'punch'});c.hit(()=>{const mm=EM();pImpact(mm,'punch');shake(0,st.ps*2)},150);
    speedLines(1300);for(let i=0;i<3;i++){c.go(c.x+st.ps*3,0,330,{fr:'punch',e:'in'});c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.7,mm.feet-mm.h*(.4+i*.1),mm.w*1.7,'#ffffff',0);pImpact(mm,'stab',i===2)},180)}
    c.stay(350,{fr:'idle'});c.go(c.H,0,500,{fr:['walk',-55]});heldProp(c,380,2330,'spear',{ang:0,dy:0});return runChor(c,R,'#e6e9f0')},
  'shieldbash+spearthrow':R=>{const c=chor();c.stay(450,{fr:['shield',0,1]});c.ev(()=>shockwave(c.H,c.pm.feet,'#c0c8d0'),200);speedLines(1100,'#c0c8d0');c.go(c.FR-st.ps*6,0,600,{fr:['walk',30],e:'in'});c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.6,mm.feet-mm.h*.55,mm.w*1.8,'#ffffff',0);pImpact(mm,'stab')},0);
    c.go(c.FR,0,300,{fr:['shield',0,4],e:'in'});c.hit(()=>pImpact(EM(),'punch'),150);c.stay(400,{fr:['beam',0,0]});c.go(c.FR+st.ps*3,0,320,{fr:'punch',e:'in'});c.hit(()=>{const mm=EM();thrust(mm.x-mm.w*.6,mm.feet-mm.h*.5,mm.w*2.4,'#fff3c0',0);pImpact(mm,'stab',true,'#fff3c0')},200);
    c.stay(300,{fr:'idle'});c.go(c.H,0,450,{fr:['walk',-55]});heldProp(c,0,c.t-450,'shield');heldProp(c,0,c.t-450,'spear',{ang:-.15,dy:-st.ps*3});return runChor(c,R,'#c0c8d0')},
  'shieldthrow+spearthrow':R=>{const c=chor(),pm=c.pm,m=c.m;c.stay(500,{fr:['beam',0,0]});c.go(c.H-st.ps*6,-st.H*.06,400,{fr:{n:'jump',a:0,b:3},e:'out'});c.stay(350,{fr:'punch'});
    const A=[pm.x+pm.w*.5,pm.feet-pm.h*.9],B=[m.x,m.feet-m.h*.5];shieldFly(p=>[A[0]+(B[0]-A[0])*p,A[1]+(B[1]-A[1])*p+Math.sin(p*Math.PI)*st.H*.1],1050,520,{spark:true});c.hits.push(1570);c.evs.push([1570,()=>pImpact(EM(),'punch')]);
    c.stay(350,{fr:'punch'});c.ev(()=>{const hp=st.player.handPt||PMx(),mm=EM();spearFly(hp.x,hp.y,mm.x,mm.feet-mm.h*.5,0,420,{el:'phys',arc:st.H*.12})},-200);c.hit(()=>{const mm=EM();cutAcross(mm,.7,'#ffffff',mm.h*1.4,2.2);cutAcross(mm,-.7,'#ffffff',mm.h*1.4,2.2);pImpact(mm,'stab',true);flash('#ffffff',0,.35)},220);
    c.go(c.H,0,400,{fr:{n:'jump',a:3,b:5},e:'in'});c.stay(400,{fr:'idle'});return runChor(c,R)},
  });
  function groundGlyphs(m){const s=PX();for(let i=0;i<5;i++)glyph(m.x+(i-2)*st.ps*5,m.feet+st.ps*2,i+3,s*.8)}
