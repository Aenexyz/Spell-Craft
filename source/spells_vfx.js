  // ===== Element spell VFX: pixel runes, magic circles and 18 signature animations =====
  function gfx(delay,dur,draw){(st.gfx=st.gfx||[]).push({t0:now_()+(delay||0),dur,draw})}
  const RUNES=['0111010001101011000101110','1000111011001000100011111','0010001110101010010000100','1111100100011100010011111','1010110101011101010110101','0100011111001000101001010','1110110001111001000111011','0010001010100010101000100','1101101010011100101011011','0111110001011100010001110','1000101010001000101010001','1110010100111000010100111'];
  const PX=()=>Math.max(2,Math.round(st.ps*.6));const PXc=()=>Math.max(2,Math.round(st.ps*.75));
  const clamp01=v=>v<0?0:v>1?1:v;
  const EM=()=>enemyMetrics()||{x:st.W*.75,feet:st.H*.8,w:st.H*.1,h:st.H*.2};
  const PMx=()=>playerMetrics();
  const foesM=()=>st.foes.filter(f=>!f.gone&&f.state!=='die').map(f=>enemyMetricsOf(f));
  function glyph(x,y,i,s){const b=RUNES[((i%RUNES.length)+RUNES.length)%RUNES.length];for(let k=0;k<25;k++)if(b[k]==='1')ctx.fillRect(Math.round(x+(k%5-2.5)*s),Math.round(y+(Math.floor(k/5)-2.5)*s),Math.ceil(s),Math.ceil(s))}
  function dotRing(cx,cy,rx,ry,s,a0,gap){const n=Math.max(12,Math.floor(6.283*Math.max(rx,ry)/(s*1.5)));for(let i=0;i<n;i++){if(gap&&i%gap<1)continue;const a=a0+i/n*6.283;ctx.fillRect(Math.round(cx+Math.cos(a)*rx-s/2),Math.round(cy+Math.sin(a)*ry-s/2),s,s)}}
  function pxDisc(cx,cy,r,s){for(let y=-r;y<=r;y+=s){const w=Math.sqrt(Math.max(0,r*r-y*y));ctx.fillRect(Math.round(cx-w),Math.round(cy+y),Math.round(w*2),s)}}
  function pxTri(x1,y1,x2,y2,x3,y3,s){const ys=Math.min(y1,y2,y3),ye=Math.max(y1,y2,y3);const E2=[[x1,y1,x2,y2],[x2,y2,x3,y3],[x3,y3,x1,y1]];for(let y=ys;y<=ye;y+=s){const xs=[];E2.forEach(([a,b,c,d])=>{if((y>=b&&y<d)||(y>=d&&y<b)){xs.push(a+(y-b)*(c-a)/(d-b))}});if(xs.length>=2){const l=Math.min(...xs),r=Math.max(...xs);ctx.fillRect(Math.round(l),Math.round(y),Math.max(s,Math.round(r-l)),s)}}}
  // magic circle: o={at:()=>[x,y],r,ax,fl,c1,c2,delay,dur,spin,star,runes,seed,ground,front}
  function magicCircle(o){const D=o.dur||1500,draw=(p,now)=>{const[cx,cy]=o.at();const t=p*D,ap=clamp01(t/280),fo=t>D-300?clamp01((D-t)/300):1,sc=ease(ap),ax=(o.ax||1)*o.r*sc,ay=(o.fl||1)*o.r*sc,s=PXc(),rot=now/1000*(o.spin||.7);
      ctx.save();ctx.globalAlpha=fo*(o.a||1);ctx.shadowColor=o.c1;ctx.shadowBlur=st.ps*2.5;
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(ax,ay));g.addColorStop(0,o.c1+'66');g.addColorStop(.7,o.c1+'22');g.addColorStop(1,o.c1+'00');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cy,ax,ay,0,0,6.283);ctx.fill();
      ctx.fillStyle=o.c1;dotRing(cx,cy,ax,ay,s,rot,0);dotRing(cx,cy,ax*.93,ay*.93,s,-rot,0);dotRing(cx,cy,ax*.72,ay*.72,s,-rot*1.4,6);dotRing(cx,cy,ax*.3,ay*.3,s,rot*2,0);
      ctx.fillStyle=o.c2;const nr=o.runes||10;for(let i=0;i<nr;i++){const a=rot+i/nr*6.283;glyph(cx+Math.cos(a)*ax*.83,cy+Math.sin(a)*ay*.83,i+(o.seed||0),s*.85)}
      ctx.strokeStyle=o.c2;ctx.lineWidth=Math.max(2,s*.8);ctx.beginPath();const r2=-rot*.8;
      if(o.star===5){for(let i=0;i<=5;i++){const a=r2+(i*2%5)/5*6.283;const x=cx+Math.cos(a)*ax*.72,y=cy+Math.sin(a)*ay*.72;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}}
      else{for(let k=0;k<2;k++)for(let i=0;i<=3;i++){const a=r2+k*Math.PI/3+i/3*6.283;const x=cx+Math.cos(a)*ax*.72,y=cy+Math.sin(a)*ay*.72;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}}
      ctx.stroke();
      ctx.globalAlpha=fo*(.5+.5*Math.sin(now/90));ctx.fillStyle='#ffffff';pxDisc(cx,cy,Math.max(s,ax*.08),s);
      ctx.restore()};
    if(o.ground)gfx(o.delay||0,D,draw);else addFx(o.delay||0,D,draw)}
  const groundUnder=(get,o)=>magicCircle({ground:true,fl:.3,at:()=>{const m=get();return[m.x,m.feet-st.ps*.5]},...o});
  function castPose(delay,dur){setTimeout(()=>{st.player.anim={name:'beam',t0:now_(),dur:dur||900}},delay)}
  function burst(x,y,cols,n,spd,life,sz){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(spd*.4+Math.random()*spd)*U();spawn(x,y,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:cols[i%cols.length],size:st.ps*(sz||.6)*(.6+Math.random()*.8),life:life||420})}}
  function drawTornado(x,feet,h,w,now,cols,alpha,seed){const s=PX(),N=14;ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor=cols[0];ctx.shadowBlur=st.ps*2;
    for(let i=0;i<N;i++){const k=i/(N-1),y=feet-k*h,rx=w*(.12+.88*Math.pow(k,1.3)),ox=Math.sin(now/170+i*.55+(seed||0))*w*.18*k;ctx.fillStyle=cols[i%cols.length];dotRing(x+ox,y,rx,rx*.22,s,now/120*(i%2?1:-1)+i,3)}ctx.restore()}
  function lerpP(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}

  const SPELLFX={
  // 1 Solar Flare
  'fire+fire':(R,ch)=>{castPose(ch-100,1100);const top=()=>{const m=EM();return[m.x,m.feet-m.h*1.85]};
    magicCircle({at:top,r:st.H*.14,fl:.34,c1:'#ff7a1a',c2:'#ffd36b',delay:ch,dur:1300,spin:1.2,star:5,seed:3});
    groundUnder(EM,{r:st.H*0.139,c1:'#ff5a1a',c2:'#ffb347',delay:ch+200,dur:1400,star:5,seed:1});
    addFx(ch+150,1050,(p,now)=>{const[cx,cy0]=top(),m=EM(),t=p*1050,grow=ease(clamp01(t/650)),fall=t>850?ease((t-850)/200):0,cy=cy0+(m.feet-m.h*.45-cy0)*fall,r=st.H*.045*grow*(1-fall*.3),s=PX();
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor='#ff8a2a';ctx.shadowBlur=st.ps*6;
      for(let i=0;i<12;i++){const a=now/600+i/12*6.283,l=r*(1.5+.4*Math.sin(now/70+i*2));ctx.fillStyle=i%2?'#ffb347':'#ff6a1a';for(let q=r*1.05;q<l;q+=s*1.3)ctx.fillRect(Math.round(cx+Math.cos(a)*q),Math.round(cy+Math.sin(a)*q),s,s)}
      ctx.fillStyle='#ff5a1a';pxDisc(cx,cy,r,s);ctx.fillStyle='#ffa030';pxDisc(cx,cy,r*.78,s);ctx.fillStyle='#ffe27a';pxDisc(cx,cy,r*.5,s);ctx.fillStyle='#fffbe0';pxDisc(cx-r*.15,cy-r*.15,r*.22,s);ctx.restore();
      if(Math.random()<.6)spawn(cx+(Math.random()-.5)*r*2,cy+(Math.random()-.5)*r*2,{vy:(.02+Math.random()*.05)*U(),color:Math.random()<.5?'#ffb347':'#ff6a1a',size:st.ps*.5,life:400});
      if(fall>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55*fall;ctx.fillStyle='#ffd36b';ctx.fillRect(cx-r*.6,cy0,r*1.2,cy-cy0);ctx.restore()}});
    const T=ch+1200;setTimeout(()=>{const m=EM(),y=m.feet-m.h*.45;burst(m.x,y,['#fff3b0','#ffb347','#ff6a1a','#c43a10'],46,.32,560,.8);ring(m.x,y,m.h*.9,'#ffb347',0,420,2.4);ring(m.x,y,m.h*.6,'#fff3b0',80,380,1.6);flash('#ffb347',0,.35);shake(0,st.ps*3)},T);
    gfx(T,1500,p=>{const m=EM();ctx.globalAlpha=.55*(1-p);ctx.fillStyle='#2a1208';ctx.beginPath();ctx.ellipse(m.x,m.feet,m.w*1.1,st.ps*1.6,0,0,6.283);ctx.fill()});
    return T+20},
  // 2 Tidal Wave
  'water+water':(R,ch)=>{castPose(ch-100,900);groundUnder(PMx,{r:st.H*0.132,c1:'#3aa0ff',c2:'#bfe9ff',delay:0,dur:ch+700,seed:2});
    const D=1500,pm0=PMx(),x0=pm0.x-st.W*.1,x1=st.W*1.35,m0=EM(),hitT=ch+180+D*clamp01((m0.x-x0)/(x1-x0));
    addFx(ch+180,D,(p,now)=>{const pm=PMx(),s=PX()*2,front=x0+(x1-x0)*ease(p),L=st.W*.38,H=st.H*.36,feet=pm.feet+st.ps,fo=p>.85?(1-p)/.15:1;
      ctx.save();ctx.globalAlpha=.92*fo;
      for(let x=front-L;x<front;x+=s){const k=(front-x)/L,sh=k<.12?Math.sin(k/.12*Math.PI/2):1-.65*Math.pow((k-.12)/.88,.8),hh=H*sh*(1+.06*Math.sin(x*.05+now/90)),top=feet-hh;
        ctx.fillStyle='#123c74';ctx.fillRect(Math.round(x),Math.round(top+hh*.45),s,Math.ceil(hh*.55));ctx.fillStyle='#1f62b0';ctx.fillRect(Math.round(x),Math.round(top+hh*.15),s,Math.ceil(hh*.32));ctx.fillStyle='#4aa6f0';ctx.fillRect(Math.round(x),Math.round(top+s),s,Math.ceil(hh*.16));ctx.fillStyle='#e8f8ff';ctx.fillRect(Math.round(x),Math.round(top),s,s*(k<.15?2:1))}
      ctx.restore();if(Math.random()<.8)spawn(front-Math.random()*st.ps*6,feet-H*(.8+Math.random()*.3),{vx:(.05+Math.random()*.15)*U(),vy:-(.05+Math.random()*.1)*U(),g:.0014*U(),color:Math.random()<.5?'#ffffff':'#8fd3ff',size:st.ps*.6,life:500})});
    setTimeout(()=>{foesM().forEach(m=>{burst(m.x,m.feet-m.h*.5,['#ffffff','#8fd3ff','#3aa0ff'],22,.25,480)});shake(0,st.ps*2.5)},hitT);
    return hitT+20},
  // 3 Cyclone
  'wind+wind':(R,ch)=>{castPose(ch-100,800);groundUnder(PMx,{r:st.H*0.124,c1:'#7fe8b0',c2:'#e6fff2',delay:0,dur:ch+500,seed:5});
    const D=2000;addFx(ch,D,(p,now)=>{const pm=PMx(),m=EM(),t=p*D,mv=ease(clamp01(t/480)),x=pm.x+pm.w+(m.x-pm.x-pm.w)*mv,fo=t>D-250?(D-t)/250:clamp01(t/150);drawTornado(x,m.feet,m.h*1.35,m.w*.7,now,['#bff5d8','#7fe8b0','#e6fff2','#4fc994'],.85*fo,1);
      if(Math.random()<.7){const a=Math.random()*6.283;spawn(x+Math.cos(a)*m.w*.8,m.feet-Math.random()*m.h*1.4,{vx:-Math.sin(a)*.18*U(),vy:-(.03+Math.random()*.06)*U(),color:Math.random()<.4?'#6bbf4a':'#e6fff2',size:st.ps*.55,life:380})}});
    R.tickTimes=Array.from({length:6},(_,i)=>ch+620+i*230);R.tickTimes.forEach(t=>setTimeout(()=>shake(0,st.ps*.9),t));
    return R.tickTimes[5]},
  // 4 Void Rift
  'dark+dark':(R,ch)=>{castPose(ch-100,1000);const hc=()=>{const m=EM();return[m.x,m.feet-m.h*.8]};
    groundUnder(EM,{r:st.H*0.155,c1:'#9a4dff',c2:'#e0c8ff',delay:ch,dur:1500,star:5,seed:7});
    magicCircle({at:hc,r:st.H*.12,c1:'#b06cff',c2:'#ffffff',delay:ch+100,dur:1250,spin:-1.4,seed:4,a:.55});
    addFx(ch+150,1150,(p,now)=>{const[cx,cy]=hc(),t=p*1150,g=ease(clamp01(t/500)),col=t>1000?1-(t-1000)/150:1,r=st.H*.05*g*col,s=PX();
      ctx.save();const gl=ctx.createRadialGradient(cx,cy,r*.5,cx,cy,r*2.6);gl.addColorStop(0,'#7a2cff88');gl.addColorStop(1,'#7a2cff00');ctx.fillStyle=gl;ctx.fillRect(cx-r*3,cy-r*3,r*6,r*6);
      ctx.fillStyle='#07020c';pxDisc(cx,cy,r,s);ctx.fillStyle='#d6b0ff';dotRing(cx,cy,r*1.08,r*1.08,s,now/150,0);ctx.fillStyle='#8a3cff';dotRing(cx,cy,r*1.3,r*.45,s,-now/200,4);ctx.restore();
      for(let i=0;i<2;i++){const a=Math.random()*6.283,d=r*3+Math.random()*r*2,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;spawn(x,y,{vx:-Math.cos(a)*d/380,vy:-Math.sin(a)*d/380,color:Math.random()<.5?'#b06cff':'#2a0a3a',size:st.ps*.55,life:360})}});
    const T=ch+1260;setTimeout(()=>{const[cx,cy]=hc();burst(cx,cy,['#e0c8ff','#9a4dff','#2a0a3a'],40,.3,520,.7);ring(cx,cy,st.H*.12,'#b06cff',0,420,2.4);flash('#6a2cc0',0,.35);shake(0,st.ps*2.6)},T);return T+20},
  // 5 Judgment
  'light+light':(R,ch)=>{castPose(ch-100,1000);groundUnder(EM,{r:st.H*0.171,c1:'#ffd36b',c2:'#ffffff',delay:ch,dur:1700,spin:.5,seed:0});
    magicCircle({at:()=>{const m=EM();return[m.x,st.H*.1]},r:st.H*.13,fl:.32,c1:'#ffe9a8',c2:'#ffd36b',delay:ch+250,dur:1300,spin:-.9,seed:6});
    addFx(ch+800,650,(p,now)=>{const m=EM(),w=m.w*.85*Math.sin(p*Math.PI),s=PX();ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.sin(p*Math.PI);
      const g=ctx.createLinearGradient(m.x-w,0,m.x+w,0);g.addColorStop(0,'#ffd36b00');g.addColorStop(.3,'#ffd36bcc');g.addColorStop(.5,'#ffffff');g.addColorStop(.7,'#ffd36bcc');g.addColorStop(1,'#ffd36b00');ctx.fillStyle=g;ctx.fillRect(m.x-w,st.H*.1,w*2,m.feet-st.H*.1);
      ctx.fillStyle='#ffffff';for(let i=0;i<6;i++){const y=(now/2+i*97)%(m.feet-st.H*.1)+st.H*.1;ctx.fillRect(Math.round(m.x+(Math.sin(i*7)*w*.6)),Math.round(y),s,s*3)}ctx.restore()});
    const T=ch+870;setTimeout(()=>{const m=EM();burst(m.x,m.feet-m.h*.5,['#ffffff','#ffe9a8','#ffd36b'],36,.28,520);ring(m.x,m.feet-m.h*.5,m.h*.8,'#ffe9a8',0,420,2.2);flash('#fff3c0',0,.4);shake(0,st.ps*2.2)},T);
    setTimeout(()=>{const pm=PMx();ring(pm.x,pm.feet-pm.h*.5,pm.h*.6,'#ffe9a8',0,500,1.6);for(let i=0;i<14;i++)spawn(pm.x+(Math.random()-.5)*pm.w*1.4,pm.feet-Math.random()*pm.h,{vy:-(.03+Math.random()*.05)*U(),color:'#ffe9a8',size:st.ps*.5,life:600})},T+120);return T+20},
  // 6 Grave Grasp
  'dark+earth':(R,ch)=>{castPose(ch-100,800);groundUnder(EM,{r:st.H*0.155,c1:'#8a4dcf',c2:'#c9a46b',delay:ch-100,dur:1900,star:5,seed:9});
    const offs=[-.45,.45,0],rise=[ch+120,ch+420,ch+720];R.tickTimes=rise.map(t=>t+300);
    offs.forEach((o,i)=>{const t0=rise[i];setTimeout(()=>{const m=EM();burst(m.x+o*m.w,m.feet,['#5a3e22','#8a6a3a','#2a1a10'],12,.18,420)},t0);
      addFx(t0,ch+1750-t0,(p,now)=>{const m=EM(),t=p*(ch+1750-t0),up=ease(clamp01(t/260)),down=t>(ch+1450-t0)?clamp01((t-(ch+1450-t0))/300):0,grip=clamp01((t-260)/120),s=PX()*1.4,x=m.x+o*m.w*(1-grip*.35),hh=m.h*(.55+(i===2?.15:0))*up*(1-down),base=m.feet;
        if(hh<=0)return;ctx.save();ctx.beginPath();ctx.rect(x-m.w,0,m.w*2,base);ctx.clip();const bone='#e8dcc0',sh='#9a8a6a',ol='#2a1e14';
        const lean=o<0?1:o>0?-1:0;for(let y=0;y<hh;y+=s){const xx=x+lean*y*.25;ctx.fillStyle=ol;ctx.fillRect(Math.round(xx-s*1.5),Math.round(base-y),s*3,s);ctx.fillStyle=y%(s*4)<s?sh:bone;ctx.fillRect(Math.round(xx-s),Math.round(base-y),s*2,s)}
        const hx=x+lean*hh*.25,hy=base-hh;ctx.fillStyle=ol;ctx.fillRect(Math.round(hx-s*2.5),Math.round(hy-s*2),s*5,s*3);ctx.fillStyle=bone;ctx.fillRect(Math.round(hx-s*2),Math.round(hy-s*1.5),s*4,s*2);
        for(let f=0;f<4;f++){const fx=hx-s*1.8+f*s*1.2,cl=grip*(f%2?1:.8);for(let q=0;q<3;q++){const yy=hy-s*2-q*s+cl*q*s*.8,xx=fx+lean*cl*q*s*.9;ctx.fillStyle=ol;ctx.fillRect(Math.round(xx-s*.2),Math.round(yy-s*.2),Math.ceil(s*1.1),Math.ceil(s*1.2));ctx.fillStyle=q===2?'#fff6e0':bone;ctx.fillRect(Math.round(xx),Math.round(yy),Math.ceil(s*.8),Math.ceil(s*.8))}}
        ctx.restore()})});
    R.tickTimes.forEach(t=>setTimeout(()=>{const m=EM();shake(0,st.ps*1.6);burst(m.x,m.feet-m.h*.4,['#b18bff','#e8dcc0'],10,.2,360)},t));
    return R.tickTimes[2]},
  // 7 Hellfire
  'dark+fire':(R,ch)=>{castPose(ch-100,1000);groundUnder(EM,{r:st.H*0.155,c1:'#c43aff',c2:'#ff6a3a',delay:ch,dur:1700,star:5,seed:11,spin:1.5});
    const cols=['#1a0620','#4b0f63','#8c1fb8','#e04cff','#ff6a3a'];
    addFx(ch+300,1200,(p,now)=>{const m=EM(),s=PX()*1.6,fo=p<.15?p/.15:p>.8?(1-p)/.2:1,W2=m.w*.75;ctx.save();ctx.globalAlpha=.95*fo;
      for(let x=-W2;x<=W2;x+=s){const k=1-Math.abs(x)/W2,hh=m.h*1.45*Math.pow(k,.7)*(.55+.25*Math.sin(now/90+x*.17)+.2*Math.sin(now/53+x*.41))*fo;const bands=[[1,'#1a0620'],[.8,'#4b0f63'],[.6,'#8c1fb8'],[.38,'#e04cff'],[.18,'#ffd0ff']];
        bands.forEach(([f,c])=>{ctx.fillStyle=c;const h2=hh*f*(f<1?.95+.05*Math.sin(now/40+x):1);ctx.fillRect(Math.round(m.x+x),Math.round(m.feet-h2),s,Math.ceil(h2*(f<1?.6:1)))})}
      ctx.restore();for(let i=0;i<3;i++)spawn(m.x+(Math.random()-.5)*W2*2,m.feet-Math.random()*m.h,{vy:-(.1+Math.random()*.15)*U(),vx:(Math.random()-.5)*.03*U(),color:cols[1+Math.floor(Math.random()*4)],size:st.ps*.7,life:520})});
    const T=ch+700;setTimeout(()=>{const m=EM();burst(m.x,m.feet-m.h*.4,cols,30,.25,520,.8);flash('#7a1fa0',0,.3);shake(0,st.ps*2.4)},T);return T+20},
  // 8 Black Ice
  'dark+ice':(R,ch)=>{castPose(ch-100,800);groundUnder(EM,{r:st.H*0.155,c1:'#5b6cff',c2:'#c9d4ff',delay:ch,dur:1600,seed:2});
    const N=7,sp=Array.from({length:N},(_,i)=>({o:(i/(N-1)-.5)*1.7,h:.55+Math.random()*.55,w:.16+Math.random()*.1,d:Math.abs(i-(N-1)/2)*45}));
    addFx(ch+250,1150,(p,now)=>{const m=EM(),t=p*1150,s=PX();sp.forEach(q=>{const g=ease(clamp01((t-q.d)/150)),sh=t>950?1-(t-950)/200:1;if(g<=0||sh<=0)return;const x=m.x+q.o*m.w,h=m.h*q.h*g,w=m.w*q.w;
      ctx.globalAlpha=sh;ctx.fillStyle='#120f2e';pxTri(x-w,m.feet,x+w,m.feet,x,m.feet-h,s);ctx.fillStyle='#2e2c78';pxTri(x-w*.7,m.feet,x+w*.4,m.feet,x-w*.1,m.feet-h*.92,s);ctx.fillStyle='#8fa4ff';pxTri(x-w*.15,m.feet-h*.3,x+w*.15,m.feet-h*.3,x,m.feet-h,s);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(x-s/2),Math.round(m.feet-h),s,s*2)});ctx.globalAlpha=1});
    const T=ch+420;setTimeout(()=>{const m=EM();burst(m.x,m.feet-m.h*.3,['#c9d4ff','#5b6cff','#120f2e'],24,.22,480);shake(0,st.ps*2.2);flash('#3a3a9a',0,.25)},T);
    setTimeout(()=>{const m=EM();burst(m.x,m.feet-m.h*.4,['#ffffff','#8fa4ff','#2e2c78'],30,.3,500,.7)},ch+1200);return T+20},
  // 9 Void Bolt
  'dark+lightning':(R,ch)=>{castPose(ch-100,1200);const top=()=>{const m=EM();return[m.x,m.feet-m.h*2]};
    magicCircle({at:top,r:st.H*.13,fl:.34,c1:'#a04dff',c2:'#ffe866',delay:ch,dur:1500,spin:2,star:5,seed:8});
    R.tickTimes=[ch+500,ch+780,ch+1060];
    R.tickTimes.forEach((t,i)=>{addFx(t-120,320,p=>{const[cx,cy]=top(),m=EM(),tx=m.x+(i-1)*m.w*.25,ty=m.feet-m.h*.4;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=p<.4?1:1-(p-.4)/.6;ctx.strokeStyle='#e0b0ff';ctx.shadowColor='#a04dff';ctx.shadowBlur=st.ps*5;ctx.lineWidth=st.ps*1.1;ctx.beginPath();ctx.moveTo(cx,cy);for(let k=1;k<8;k++){const f=k/8;ctx.lineTo(cx+(tx-cx)*f+(Math.random()-.5)*st.ps*6,cy+(ty-cy)*f)}ctx.lineTo(tx,ty);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=st.ps*.4;ctx.stroke();ctx.restore()});
      setTimeout(()=>{const m=EM(),x=m.x+(i-1)*m.w*.25,y=m.feet-m.h*.4;burst(x,y,['#ffffff','#e0b0ff','#a04dff','#ffe866'],16,.25,380);shake(0,st.ps*1.6);flash('#7a2cc0',0,.2);
        addFx(0,520,p=>{const pm=PMx(),a=[x,y],b=[pm.x,pm.feet-pm.h*.6],e=ease(p),q=lerpP(a,b,e);ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='#6cb2ff';ctx.shadowColor='#6cb2ff';ctx.shadowBlur=st.ps*4;pxDisc(q[0],q[1]-Math.sin(e*Math.PI)*st.H*.05,st.ps*.9,PX());ctx.restore()})},t)});
    return R.tickTimes[2]},
  // 10 Abyssal Tide
  'dark+water':(R,ch)=>{castPose(ch-100,1000);groundUnder(PMx,{r:st.H*0.116,c1:'#2a8a9a',c2:'#b18bff',delay:0,dur:ch+600,seed:4});
    gfx(ch,1900,(p,now)=>{const m=EM(),g=ease(clamp01(p*1900/300)),fo=p>.85?(1-p)/.15:1,s=PX();ctx.save();ctx.globalAlpha=fo;ctx.fillStyle='#050a12';ctx.beginPath();ctx.ellipse(m.x,m.feet,m.w*1.3*g,st.ps*2.6*g,0,0,6.283);ctx.fill();ctx.fillStyle='#1f6f7a';dotRing(m.x,m.feet,m.w*1.3*g*(.5+.5*((now/600)%1)),st.ps*2.6*g*(.5+.5*((now/600)%1)),s,0,3);ctx.restore()});
    const T=[ch+520,ch+800,ch+1080,ch+1360];R.tickTimes=T;const offs=[-.7,.7,-.35,.35];
    offs.forEach((o,i)=>addFx(ch+150+i*60,1600,(p,now)=>{const m=EM(),t=p*1600,up=ease(clamp01(t/300)),down=t>1350?clamp01((t-1350)/250):0,N=16,len=m.h*1.05*up*(1-down),s=PX()*1.3,lash=T[i]-(ch+150+i*60),lp=Math.exp(-Math.pow((t-lash)/120,2));
      let x=m.x+o*m.w*1.05,y=m.feet,ang=-Math.PI/2;const dir=o<0?1:-1;for(let k=0;k<N;k++){const f=k/N;ang+=dir*(.04+lp*.16)*(1+f)+Math.sin(now/180+k*.4+i)*.05;x+=Math.cos(ang)*len/N;y+=Math.sin(ang)*len/N;const sz=s*(2.2-1.7*f);ctx.fillStyle='#14061e';ctx.fillRect(Math.round(x-sz/2-s*.3),Math.round(y-sz/2-s*.3),Math.ceil(sz+s*.6),Math.ceil(sz+s*.6));ctx.fillStyle=k%3===1?'#7a4a9a':'#3b1656';ctx.fillRect(Math.round(x-sz/2),Math.round(y-sz/2),Math.ceil(sz),Math.ceil(sz))}}));
    T.forEach(t=>setTimeout(()=>{const m=EM();burst(m.x,m.feet-m.h*.5,['#1f6f7a','#b18bff','#050a12'],12,.22,380);shake(0,st.ps*1.3)},t));return T[3]},
  // 11 Shadow Gale
  'dark+wind':(R,ch)=>{castPose(ch-100,1300);groundUnder(PMx,{r:st.H*0.116,c1:'#6a4aa0',c2:'#cfc2ff',delay:0,dur:ch+1200,seed:10});
    const N=6;R.tickTimes=Array.from({length:N},(_,i)=>ch+150+i*170+430);
    for(let i=0;i<N;i++){const t0=ch+150+i*170,yo=(Math.random()-.5)*.5,arc=(Math.random()<.5?-1:1)*(.08+Math.random()*.08);
      addFx(t0,430,(p,now)=>{const pm=PMx(),m=EM(),a=[pm.x+pm.w*.5,pm.feet-pm.h*(.7+yo*.3)],b=[m.x,m.feet-m.h*(.55+yo*.4)],e=p,q=lerpP(a,b,e),y=q[1]+Math.sin(e*Math.PI)*st.H*arc,s=PX()*1.7,fl=Math.sin(now/45+i)>0;
        ctx.save();ctx.translate(Math.round(q[0]),Math.round(y));ctx.fillStyle='#0b0812';ctx.fillRect(-s*2,-s,s*4,s*2);ctx.fillRect(s*2,-s*1.5,s*2,s*2);ctx.fillStyle='#e8a83a';ctx.fillRect(s*4,-s*.8,s,s*.8);ctx.fillStyle='#c06cff';ctx.fillRect(s*2.8,-s*1.2,s*.8,s*.8);
        ctx.fillStyle='#0b0812';if(fl){ctx.fillRect(-s,-s*4,s*2,s*3);ctx.fillRect(-s*2.5,-s*5,s*2,s*1.5)}else{ctx.fillRect(-s,s,s*2,s*3);ctx.fillRect(-s*2.5,s*3.5,s*2,s*1.5)}ctx.fillRect(-s*4,-s*.5,s*2,s);ctx.restore();
        if(Math.random()<.6)spawn(q[0],y,{vx:-.04*U(),vy:(Math.random()-.5)*.03*U(),color:Math.random()<.5?'#2a1a3a':'#6a4aa0',size:st.ps*.7,life:300})})}
    addFx(ch,N*170+600,(p,now)=>{ctx.save();ctx.globalAlpha=.25*Math.sin(p*Math.PI);ctx.fillStyle='#6a4aa0';for(let i=0;i<10;i++){const y=st.H*(.3+((i*37)%50)/100),x=((now*.9+i*173)%(st.W*1.2))-st.W*.1;ctx.fillRect(Math.round(x),Math.round(y),st.ps*10,Math.max(1,st.ps*.4))}ctx.restore()});
    R.tickTimes.forEach(t=>setTimeout(()=>{const m=EM();burst(m.x,m.feet-m.h*.55,['#0b0812','#6a4aa0','#c06cff'],10,.2,340)},t));return R.tickTimes[N-1]},
  // 12 Sanctum Stone
  'earth+light':(R,ch)=>{castPose(ch-100,900);groundUnder(PMx,{r:st.H*0.147,c1:'#ffd36b',c2:'#fff3c0',delay:ch-200,dur:1900,seed:3,spin:.4});
    addFx(ch+150,1650,(p,now)=>{const pm=PMx(),t=p*1650,up=ease(clamp01(t/380)),fo=t>1350?clamp01((1650-t)/300):1,s=PX(),W2=st.ps*4,H=pm.h*1.05*up,x=pm.x+pm.w*1.15,y=pm.feet;if(H<=0)return;
      ctx.save();ctx.globalAlpha=fo;ctx.fillStyle='#2a2620';ctx.fillRect(Math.round(x-W2-s),Math.round(y-H-s),Math.round(W2*2+s*2),Math.round(H+s));ctx.fillStyle='#6e6a62';ctx.fillRect(Math.round(x-W2),Math.round(y-H),Math.round(W2*2),Math.round(H));ctx.fillStyle='#9a958a';ctx.fillRect(Math.round(x-W2),Math.round(y-H),s*2,Math.round(H));ctx.fillStyle='#45413b';ctx.fillRect(Math.round(x+W2-s*2),Math.round(y-H),s*2,Math.round(H));
      ctx.fillStyle='#7f7a70';pxTri(x-W2,y-H,x+W2,y-H,x,y-H-st.ps*3*up,s);
      ctx.globalCompositeOperation='lighter';ctx.shadowColor='#ffd36b';ctx.shadowBlur=st.ps*3;ctx.fillStyle='#ffd36b';ctx.globalAlpha=fo*(.65+.35*Math.sin(now/120));for(let i=0;i<4;i++){const gy=y-H+st.ps*3+i*st.ps*3.6;if(gy<y-st.ps)glyph(x,gy,i*3+1,s*.8)}
      ctx.globalAlpha=fo*.9;ctx.fillStyle='#fff3c0';for(let i=0;i<5;i++){const a=now/500+i/5*6.283;glyph(x+Math.cos(a)*st.ps*9,y-H*.55+Math.sin(a)*st.ps*3,i+5,s*.6)}ctx.restore();
      if(Math.random()<.4)spawn(x+(Math.random()-.5)*W2*3,y-Math.random()*H,{vy:-(.02+Math.random()*.04)*U(),color:'#ffe9a8',size:st.ps*.45,life:500})});
    setTimeout(()=>{const pm=PMx();burst(pm.x+pm.w*1.15,pm.feet,['#6e6a62','#9a958a','#ffd36b'],18,.2,420);shake(0,st.ps*1.6)},ch+180);return ch+620},
  // 13 Thermal Shock
  'fire+ice':(R,ch)=>{castPose(ch-100,900);groundUnder(PMx,{r:st.H*0.124,c1:'#ff8a3a',c2:'#8fd3ff',delay:0,dur:ch+600,star:5,seed:6});
    const D=820;addFx(ch+150,D,(p,now)=>{const pm=PMx(),m=EM(),e=ease(p),c=lerpP([pm.x+pm.w*.8,pm.feet-pm.h*.6],[m.x,m.feet-m.h*.5],e),rr=st.H*.05*(1-e*.85),a=now/90,s=PX();
      [[0,'fire'],[Math.PI,'ice']].forEach(([o,k])=>{const x=c[0]+Math.cos(a+o)*rr,y=c[1]+Math.sin(a+o)*rr*.6;ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowBlur=st.ps*4;
        if(k==='fire'){ctx.shadowColor='#ff6a1a';ctx.fillStyle='#ff5a1a';pxDisc(x,y,st.ps*3.2,s);ctx.fillStyle='#ffb347';pxDisc(x,y,st.ps*2.2,s);ctx.fillStyle='#fff3b0';pxDisc(x,y,st.ps*1.1,s)}else{ctx.shadowColor='#6fd0ff';ctx.fillStyle='#6fd0ff';pxTri(x-st.ps*3,y,x+st.ps*3,y,x,y-st.ps*4,s);pxTri(x-st.ps*3,y,x+st.ps*3,y,x,y+st.ps*4,s);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(x-s),Math.round(y-s*2),s,s*2)}ctx.restore();
        spawn(x,y,{vx:(Math.random()-.5)*.02*U(),vy:(Math.random()-.5)*.02*U(),color:k==='fire'?(Math.random()<.5?'#ff6a1a':'#ffb347'):(Math.random()<.5?'#bfe9ff':'#6fd0ff'),size:st.ps*.5,life:260})})});
    const T=ch+150+D;setTimeout(()=>{const m=EM(),y=m.feet-m.h*.5;burst(m.x,y,['#ff6a1a','#ffb347','#6fd0ff','#ffffff'],R.shatter?60:36,R.shatter?.38:.28,520,.7);ring(m.x,y,m.h*.7,'#ff8a3a',0,420,2);ring(m.x,y,m.h*.5,'#8fd3ff',60,420,2);
      for(let i=0;i<10;i++)spawn(m.x+(Math.random()-.5)*m.w,y+(Math.random()-.5)*m.h*.4,{vy:-(.02+Math.random()*.04)*U(),color:'#e8eef2',size:st.ps*1.4,life:700});
      if(R.shatter){flash('#ffffff',0,.5);shake(0,st.ps*3.5);addFx(0,500,p=>{ctx.save();ctx.globalAlpha=1-p;ctx.strokeStyle='#ffffff';ctx.lineWidth=st.ps*.5;for(let i=0;i<7;i++){const a=i/7*6.283;ctx.beginPath();ctx.moveTo(m.x,y);ctx.lineTo(m.x+Math.cos(a)*m.h*.6*(.5+p*.5),y+Math.sin(a)*m.h*.6*(.5+p*.5));ctx.stroke()}ctx.restore()})}else{flash('#e8eef2',0,.25);shake(0,st.ps*2.2)}},T);return T+20},
  // 14 Firestorm
  'fire+wind':(R,ch)=>{castPose(ch-100,800);groundUnder(PMx,{r:st.H*0.124,c1:'#ff6a1a',c2:'#ffe27a',delay:0,dur:ch+500,seed:12});
    const D=1900,fs=st.foes.filter(f=>!f.gone&&f.state!=='die');fs.forEach((f,j)=>addFx(ch+j*80,D,(p,now)=>{const pm=PMx(),m=enemyMetricsOf(f),t=p*D,mv=ease(clamp01(t/450)),x=pm.x+pm.w+(m.x-pm.x-pm.w)*mv,fo=t>D-250?(D-t)/250:clamp01(t/150);
      drawTornado(x,m.feet,m.h*1.4,m.w*.75,now,['#ff6a1a','#ffb347','#ffe27a','#c43a10'],.9*fo,j*3);if(Math.random()<.8)spawn(x+(Math.random()-.5)*m.w*1.6,m.feet-Math.random()*m.h*1.5,{vy:-(.06+Math.random()*.1)*U(),vx:(Math.random()-.5)*.08*U(),color:Math.random()<.5?'#ffb347':'#ff5a1a',size:st.ps*.55,life:420})}));
    R.tickTimes=Array.from({length:5},(_,i)=>ch+600+i*240);R.tickTimes.forEach(t=>setTimeout(()=>shake(0,st.ps*1.1),t));return R.tickTimes[4]},
  // 15 Diamond Dust
  'ice+light':(R,ch)=>{castPose(ch-100,900);groundUnder(PMx,{r:st.H*0.139,c1:'#9fe2ff',c2:'#ffffff',delay:0,dur:ch+1300,seed:1});
    addFx(ch+150,1500,(p,now)=>{const pm=PMx(),cx=pm.x,cy=pm.feet-pm.h*.5,r=pm.h*.68*ease(clamp01(p*5)),s=PX(),fo=p>.75?(1-p)/.25:1;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=fo*(.6+.3*Math.sin(now/100));ctx.fillStyle='#bfe9ff';
      for(let k=0;k<6;k++){const a1=k/6*6.283+Math.PI/6,a2=(k+1)/6*6.283+Math.PI/6,x1=cx+Math.cos(a1)*r*.75,y1=cy+Math.sin(a1)*r,x2=cx+Math.cos(a2)*r*.75,y2=cy+Math.sin(a2)*r,n=12;for(let q=0;q<n;q++){if((q+Math.floor(now/80))%5===0)continue;ctx.fillRect(Math.round(x1+(x2-x1)*q/n),Math.round(y1+(y2-y1)*q/n),s,s)}}ctx.restore()});
    const D=900,N=34,pts=Array.from({length:N},()=>({a:Math.random()*6.283,d:.8+Math.random()*1.2,y:Math.random(),sp:(Math.random()<.5?-1:1)*(2+Math.random()*2)}));
    addFx(ch+200,D,(p,now)=>{const m=EM(),s=PX(),e=Math.pow(p,1.6);ctx.save();ctx.globalCompositeOperation='lighter';pts.forEach((q,i)=>{const a=q.a+p*q.sp,d=m.w*1.6*q.d*(1-e),x=m.x+Math.cos(a)*d,y=m.feet-m.h*(.2+q.y*.8)*(1-e)-m.h*.5*e+Math.sin(a)*d*.25;ctx.globalAlpha=.6+.4*Math.sin(now/60+i);ctx.fillStyle=i%3?'#bfe9ff':'#ffffff';ctx.fillRect(Math.round(x-s/2),Math.round(y-s*1.5),s,s*3);ctx.fillRect(Math.round(x-s*1.5),Math.round(y-s/2),s*3,s)});ctx.restore()});
    const T=ch+200+D;setTimeout(()=>{const m=EM(),y=m.feet-m.h*.5;burst(m.x,y,['#ffffff','#bfe9ff','#9fe2ff','#ffe9a8'],34,.3,520,.6);ring(m.x,y,m.h*.75,'#bfe9ff',0,420,2);flash('#e6f7ff',0,.35);shake(0,st.ps*2)},T);return T+20},
  // 16 Shatter Bolt
  'ice+lightning':(R,ch)=>{castPose(ch-100,800);const front=()=>{const pm=PMx();return[pm.x+pm.w*1.3,pm.feet-pm.h*.6]};
    magicCircle({at:front,r:st.H*.12,ax:.32,fl:1,c1:'#6fd0ff',c2:'#ffe866',delay:ch,dur:900,spin:2.2,seed:2});
    const D=300,t0=ch+430;addFx(t0,D,(p,now)=>{const[a0,a1]=front(),m=EM(),q=lerpP([a0,a1],[m.x-m.w*.2,m.feet-m.h*.5],p),L=st.H*.11,s=PX(),x=q[0],y=q[1];ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor='#6fd0ff';ctx.shadowBlur=st.ps*5;
      ctx.fillStyle='#2f8fd0';pxTri(x-L,y,x,y-st.ps*1.6,x,y+st.ps*1.6,s);pxTri(x,y-st.ps*1.6,x,y+st.ps*1.6,x+L*.35,y,s);ctx.fillStyle='#bfe9ff';pxTri(x-L*.8,y,x,y-st.ps*.7,x,y+st.ps*.5,s);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(x+L*.2),Math.round(y-s/2),s*2,s);
      ctx.strokeStyle='#ffe866';ctx.lineWidth=st.ps*.4;for(let k=0;k<2;k++){ctx.beginPath();ctx.moveTo(x-L,y);for(let j=1;j<=6;j++)ctx.lineTo(x-L+L*1.3*j/6,y+(Math.random()-.5)*st.ps*5);ctx.stroke()}ctx.restore();
      spawn(x-L,y,{vx:-.03*U(),color:Math.random()<.5?'#bfe9ff':'#ffe866',size:st.ps*.5,life:260})});
    const T=t0+D;setTimeout(()=>{const m=EM(),y=m.feet-m.h*.5;bolt(m.x,m.feet-m.h*.3,0);burst(m.x,y,['#ffffff','#bfe9ff','#6fd0ff','#ffe866'],R.boltCrit?56:32,R.boltCrit?.4:.28,500,.7);ring(m.x,y,m.h*.7,'#6fd0ff',0,420,2.2);if(R.boltCrit){ring(m.x,y,m.h*1.1,'#ffe866',60,480,2.6);flash('#ffffff',0,.5);shake(0,st.ps*4)}else{flash('#bfe9ff',0,.3);shake(0,st.ps*2.4)}},T);return T+20},
  // 17 Aurora
  'light+wind':(R,ch)=>{castPose(ch-100,1000);groundUnder(PMx,{r:st.H*0.147,c1:'#7fffc0',c2:'#ffffff',delay:0,dur:ch+1600,seed:8,spin:.5});
    const D=2400;addFx(ch-200,D,(p,now)=>{const s=PX()*2,fo=Math.sin(Math.PI*p),cols=['#59ffb0','#6fe3ff','#ff8fe0'];ctx.save();ctx.globalCompositeOperation='lighter';
      cols.forEach((c,i)=>{ctx.fillStyle=c;for(let x=0;x<st.W;x+=s){const y=st.H*(.1+.06*i)+Math.sin(x/st.W*7+now/650+i*1.7)*st.H*.045,h=st.H*(.1+.04*Math.sin(x/st.W*11+now/400+i));ctx.globalAlpha=fo*.28*(.6+.4*Math.sin(x*.02+now/300+i));ctx.fillRect(Math.round(x),Math.round(y),s,Math.round(h));ctx.globalAlpha=fo*.5;ctx.fillRect(Math.round(x),Math.round(y),s,s)}});ctx.restore();
      if(Math.random()<.7){const pm=PMx();spawn(pm.x+(Math.random()-.5)*pm.w*3,st.H*.2+Math.random()*st.H*.2,{vy:(.06+Math.random()*.06)*U(),color:pick_(['#59ffb0','#6fe3ff','#ffffff','#ff8fe0']),size:st.ps*.5,life:900})}});
    const T=ch+900;setTimeout(()=>{const pm=PMx();ring(pm.x,pm.feet-pm.h*.5,pm.h*.7,'#7fffc0',0,520,1.8);ring(pm.x,pm.feet-pm.h*.5,pm.h*.45,'#ff8fe0',100,520,1.4);burst(pm.x,pm.feet-pm.h*.5,['#59ffb0','#6fe3ff','#ffffff'],18,.15,600,.5)},T);return T+20},
  // 18 Typhoon
  'water+wind':(R,ch)=>{castPose(ch-100,800);groundUnder(PMx,{r:st.H*0.124,c1:'#3aa0ff',c2:'#bff5d8',delay:0,dur:ch+500,seed:9});
    const D=1800,fs=st.foes.filter(f=>!f.gone&&f.state!=='die');fs.forEach((f,j)=>addFx(ch+j*80,D,(p,now)=>{const pm=PMx(),m=enemyMetricsOf(f),t=p*D,mv=ease(clamp01(t/450)),x=pm.x+pm.w+(m.x-pm.x-pm.w)*mv,fo=t>D-250?(D-t)/250:clamp01(t/150);
      drawTornado(x,m.feet,m.h*1.4,m.w*.8,now,['#1f62b0','#3aa0ff','#8fd3ff','#ffffff'],.9*fo,j*2+1);if(Math.random()<.9){const a=Math.random()*6.283;spawn(x+Math.cos(a)*m.w,m.feet-Math.random()*m.h*1.5,{vx:-Math.sin(a)*.15*U(),vy:-(.02+Math.random()*.05)*U(),g:.0008*U(),color:Math.random()<.5?'#8fd3ff':'#ffffff',size:st.ps*.55,life:420})}}));
    R.tickTimes=Array.from({length:4},(_,i)=>ch+620+i*270);R.tickTimes.forEach(t=>setTimeout(()=>{shake(0,st.ps*1.2);foesM().forEach(m=>burst(m.x,m.feet-m.h*.5,['#ffffff','#8fd3ff'],6,.2,320))},t));return R.tickTimes[3]},
  };
