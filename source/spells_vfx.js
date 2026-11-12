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
  // ===== Bow spells: floating pose, procedural pixel bow, charged arrow, elemental arrows =====
  const EC={fire:['#ff5a1a','#ffb347','#fff3b0'],water:['#1f62b0','#3aa0ff','#bfe9ff'],ice:['#2f8fd0','#8fd3ff','#ffffff'],earth:['#6b4a2a','#a8763e','#e0c08a'],wind:['#2f9a6a','#7fe8b0','#e6fff2'],lightning:['#c9a020','#ffe866','#ffffff'],dark:['#2a0a3a','#9a4dff','#e0c8ff'],light:['#c9a040','#ffe9a8','#ffffff']};
  function bowPose(dur,o){const P=st.player,T0=now_();P.anim=null;P.act=null;P.holdFrame=null;
    P.seq={n:'beam',t0:T0,times:[0,90,180,270],idx:[0,1,2,3],until:T0+dur,lift:t=>o.lift?o.lift(t):0};
    const C=EC[o.el];
    addFx(0,dur,(p,now)=>{const t=p*dur,pm=PMx(),hp=P.handPt||{x:pm.x+pm.w*.45,y:pm.feet-pm.h*.55},ang=o.ang?o.ang(t):0,dr=o.draw?o.draw(t):0,shown=o.shown?o.shown(t):(t<dur-120),fo=Math.min(1,t/120,(dur-t)/120);
      if(fo<=0)return;drawBow(hp.x+st.ps*.5,hp.y,ang,dr,C,shown,fo,now,pm.h)})}
  function drawBow(x,y,ang,dr,C,arrow,a,now,H){const R=H*.3,s=PX(),d=[Math.cos(ang),Math.sin(ang)],n=[-Math.sin(ang),Math.cos(ang)];
    ctx.save();ctx.globalAlpha=a;
    const pt=k=>[x+n[0]*R*k+d[0]*R*.32*(1-k*k)*(1-dr*.25),y+n[1]*R*k+d[1]*R*.32*(1-k*k)*(1-dr*.25)];
    // glow
    if(dr>0){const hx=x+d[0]*R*(1.05-dr*.5),hy=y+d[1]*R*(1.05-dr*.5),g=ctx.createRadialGradient(hx,hy,0,hx,hy,R*(.4+.8*dr));g.addColorStop(0,C[2]+'cc');g.addColorStop(.4,C[1]+'66');g.addColorStop(1,C[1]+'00');ctx.fillStyle=g;ctx.fillRect(hx-R*1.3,hy-R*1.3,R*2.6,R*2.6)}
    // limbs
    ctx.shadowColor=C[1];ctx.shadowBlur=st.ps*(1+3*dr);
    for(let k=-1;k<=1.001;k+=.06){const[px,py]=pt(k);ctx.fillStyle='#24160c';ctx.fillRect(Math.round(px-s),Math.round(py-s),s*2,s*2);}
    for(let k=-1;k<=1.001;k+=.06){const[px,py]=pt(k);ctx.fillStyle=Math.abs(k)>.85?C[1]:Math.abs(k)<.15?'#d8b070':'#8a5a2b';ctx.fillRect(Math.round(px-s/2),Math.round(py-s/2),s,s)}
    ctx.shadowBlur=0;
    // string
    const t1=pt(-1),t2=pt(1),nk=[x-d[0]*R*(.05+dr*.55),y-d[1]*R*(.05+dr*.55)];ctx.strokeStyle='#f4f0e6';ctx.lineWidth=Math.max(1,s*.5);ctx.beginPath();ctx.moveTo(...t1);ctx.lineTo(...nk);ctx.lineTo(...t2);ctx.stroke();
    if(arrow){const L=R*1.25,hx=nk[0]+d[0]*L,hy=nk[1]+d[1]*L;
      for(let q=0;q<L;q+=s){ctx.fillStyle=q<s*3?C[0]:'#c8b89a';ctx.fillRect(Math.round(nk[0]+d[0]*q-s/2),Math.round(nk[1]+d[1]*q-s/2),s,s)}
      ctx.fillStyle=C[1];ctx.fillRect(Math.round(nk[0]+n[0]*s*1.4-s/2),Math.round(nk[1]+n[1]*s*1.4-s/2),s,s);ctx.fillRect(Math.round(nk[0]-n[0]*s*1.4-s/2),Math.round(nk[1]-n[1]*s*1.4-s/2),s,s);
      ctx.shadowColor=C[1];ctx.shadowBlur=st.ps*(2+5*dr);ctx.fillStyle=C[2];pxTri(hx+d[0]*s*3,hy+d[1]*s*3,hx+n[0]*s*1.6,hy+n[1]*s*1.6,hx-n[0]*s*1.6,hy-n[1]*s*1.6,s);
      if(dr>.2&&Math.random()<dr){const a2=Math.random()*6.283,r2=R*(.8+Math.random()*.6);spawn(hx+Math.cos(a2)*r2,hy+Math.sin(a2)*r2,{vx:-Math.cos(a2)*r2/300,vy:-Math.sin(a2)*r2/300,color:C[Math.floor(Math.random()*3)],size:st.ps*.5,life:300})}}
    ctx.restore()}
  // flying arrow along a (possibly arcing) path
  function arrowFly(x0,y0,x1,y1,delay,dur,o){const C=EC[o.el],arc=o.arc||0,sz=o.size||1;
    const at=p=>{const e=o.lin?p:p;return[x0+(x1-x0)*e,y0+(y1-y0)*e-Math.sin(e*Math.PI)*arc]};
    addFx(delay,dur,(p,now)=>{const[x,y]=at(p),[xa,ya]=at(Math.max(0,p-.04)),ang=Math.atan2(y-ya,x-xa)||Math.atan2(y1-y0,x1-x0),s=PX(),L=st.ps*7*sz;
      ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.shadowColor=C[1];ctx.shadowBlur=st.ps*4*sz;
      ctx.globalAlpha=.45;ctx.fillStyle=C[1];ctx.fillRect(-L*2.4,-s*sz*.5,L*1.4,Math.max(1,s*sz));ctx.globalAlpha=1;
      ctx.fillStyle='#c8b89a';ctx.fillRect(-L,-s/2,L,s);ctx.fillStyle=C[0];ctx.fillRect(-L,-s*1.5,s*2,s);ctx.fillRect(-L,s*.5,s*2,s);
      ctx.fillStyle=C[2];pxTri(s*3.5*sz,0,-s*.5,-s*1.8*sz,-s*.5,s*1.8*sz,s);ctx.restore();
      if(Math.random()<.9)spawn(x,y,{vx:(Math.random()-.5)*.03*U(),vy:(Math.random()-.5)*.03*U(),color:C[Math.floor(Math.random()*3)],size:st.ps*.5*sz,life:280})})}
  function chargeCircle(el,delay,dur){const C=EC[el];magicCircle({at:()=>{const hp=st.player.handPt||{x:PMx().x,y:PMx().feet-PMx().h*.5};return[hp.x+PMx().h*.45,hp.y]},r:st.H*.1,ax:.35,fl:1,c1:C[1],c2:C[2],delay,dur,spin:2.4,seed:el.length})}
  const liftCurve=(up,hold,down,h)=>t=>t<up?-h*ease(t/up):t<hold?-h+Math.sin((t-up)/260)*st.ps*.6:t<down?-h*(1-ease((t-hold)/(down-hold))):0;

  Object.assign(SPELLFX,{
  // Phoenix Arrow
  'arrowshot+fire':(R)=>{const D=1500,rel=1000;bowPose(D,{el:'fire',draw:t=>t<rel?ease(clamp01(t/850)):0,shown:t=>t<rel,ang:()=>-.05});chargeCircle('fire',150,rel);groundUnder(PMx,{r:st.H*.12,c1:'#ff6a1a',c2:'#ffd36b',delay:0,dur:rel+300,star:5,seed:2});
    const fly=420,T=rel+fly;addFx(rel,fly,(p,now)=>{const pm=PMx(),m=EM(),x=pm.x+pm.w*1.6+(m.x-pm.x-pm.w*1.6)*ease(p),y=pm.feet-pm.h*.6+(m.feet-m.h*.5-(pm.feet-pm.h*.6))*p-Math.sin(p*Math.PI)*st.H*.04,s=PX(),fl=Math.sin(now/40),W=st.ps*7;
      ctx.save();ctx.shadowColor='#ff8a2a';ctx.shadowBlur=st.ps*6;ctx.fillStyle='#ff5a1a';pxTri(x-W,y-W*.2,x+W*.2,y,x-W*.5,y-W*(.9+fl*.6),s);pxTri(x-W,y+W*.1,x+W*.2,y,x-W*.5,y+W*(.6-fl*.4),s);ctx.fillStyle='#ffb347';pxTri(x-W*1.6,y,x+W*.6,y-s,x+W*.6,y+s*2,s);ctx.fillStyle='#fff3b0';pxDisc(x+W*.5,y,st.ps*1.2,s);ctx.fillStyle='#ff5a1a';pxTri(x-W*1.5,y,x-W*2.6,y-W*.5,x-W*2.4,y+W*.4,s);ctx.restore();
      for(let i=0;i<3;i++)spawn(x-W,y+(Math.random()-.5)*W,{vx:-(.05+Math.random()*.08)*U(),vy:(Math.random()-.5)*.05*U(),color:pick_(EC.fire),size:st.ps*.7,life:380})});
    setTimeout(()=>{const m=EM(),y=m.feet-m.h*.5;burst(m.x,y,['#fff3b0','#ffb347','#ff6a1a','#c43a10'],50,.34,560,.8);ring(m.x,y,m.h*.9,'#ffb347',0,420,2.4);ring(m.x,y,m.h*.6,'#fff3b0',60,380,1.6);flash('#ffb347',0,.32);shake(0,st.ps*3);foesM().forEach(f=>{if(Math.abs(f.x-m.x)>2)burst(f.x,f.feet-f.h*.5,EC.fire,16,.2,420)})},T);return T+20},
  // Tide Piercer
  'arrowshot+water':(R)=>{const D=1650,rel=850,lift=liftCurve(350,1300,1650,st.H*.13);bowPose(D,{el:'water',lift,draw:t=>t<rel?ease(clamp01((t-150)/650)):0,shown:t=>t<rel,ang:()=>-.12});chargeCircle('water',200,rel-100);
    gfx(0,D,(p,now)=>{const pm=PMx();ctx.save();ctx.globalAlpha=.6*Math.sin(p*Math.PI);ctx.fillStyle='#8fd3ff';dotRing(pm.x,pm.feet,pm.w*.8,st.ps*1.2,PX(),now/200,3);ctx.restore();if(Math.random()<.5)spawn(pm.x+(Math.random()-.5)*pm.w,pm.feet,{vy:(.02+Math.random()*.03)*U(),color:'#8fd3ff',size:st.ps*.5,life:400})});
    const pm0=PMx(),split=[pm0.x+st.W*.22,pm0.feet-pm0.h*.75-st.H*.13];addFx(rel,180,p=>{});
    arrowFly(pm0.x+pm0.w*1.5,pm0.feet-pm0.h*.75-st.H*.13,split[0],split[1],rel,180,{el:'water',size:1.3});
    R.tickTimes=[];[-1,0,1].forEach((k,i)=>{const m=EM(),tx=m.x+k*m.w*.25,ty=m.feet-m.h*(.45+k*.12),d=rel+180+i*70,f=300;arrowFly(split[0],split[1],tx,ty,d,f,{el:'water',arc:st.H*(.03+.04*Math.abs(k))*(k<0?-1:1)});R.tickTimes.push(d+f);
      setTimeout(()=>{burst(tx,ty,EC.water,16,.22,420);shake(0,st.ps*1.2)},d+f)});
    setTimeout(()=>burst(split[0],split[1],EC.water,14,.15,300),rel+180);
    setTimeout(()=>{const pm=PMx();for(let i=0;i<14;i++)spawn(pm.x+(Math.random()-.5)*pm.w*1.3,pm.feet-Math.random()*pm.h,{vy:-(.02+Math.random()*.04)*U(),color:Math.random()<.5?'#7fe08a':'#8fd3ff',size:st.ps*.5,life:600})},R.tickTimes[2]);
    return R.tickTimes[2]},
  // Frost Comet
  'arrowshot+ice':(R)=>{const D=1300,rel=950;bowPose(D,{el:'ice',draw:t=>t<rel?ease(clamp01((t-100)/800)):0,shown:t=>t<rel,ang:t=>-.3-1.0*ease(clamp01(t/500))});chargeCircle('ice',150,rel-50);
    const pm0=PMx();arrowFly(pm0.x+pm0.w*.6,pm0.feet-pm0.h*1.1,pm0.x+st.W*.12,-st.H*.1,rel,300,{el:'ice',size:1.3});
    groundUnder(EM,{r:st.H*.13,c1:'#8fd3ff',c2:'#ffffff',delay:rel+200,dur:900,seed:5});
    const fs=rel+420,fall=480,T=fs+fall;addFx(fs,fall,(p,now)=>{const m=EM(),e=p*p,x0=m.x-st.W*.18,y0=-st.H*.1,x=x0+(m.x-x0)*e,y=y0+(m.feet-m.h*.4-y0)*e,s=PX(),r=st.ps*5;
      ctx.save();ctx.shadowColor='#8fd3ff';ctx.shadowBlur=st.ps*8;ctx.globalAlpha=.5;ctx.fillStyle='#bfe9ff';const ang=Math.atan2(m.feet-m.h*.4-y0,m.x-x0);for(let q=1;q<10;q++)pxDisc(x-Math.cos(ang)*q*r*.9,y-Math.sin(ang)*q*r*.9,r*(1-q/11),s);ctx.globalAlpha=1;
      ctx.fillStyle='#2f8fd0';pxDisc(x,y,r,s);ctx.fillStyle='#8fd3ff';pxDisc(x-s,y-s,r*.75,s);ctx.fillStyle='#ffffff';pxDisc(x-r*.3,y-r*.3,r*.3,s);ctx.restore();
      spawn(x,y,{vx:(Math.random()-.5)*.05*U(),vy:-(.02+Math.random()*.04)*U(),color:pick_(EC.ice),size:st.ps*.6,life:420})});
    setTimeout(()=>{const m=EM(),y=m.feet-m.h*.4;burst(m.x,y,['#ffffff','#bfe9ff','#8fd3ff','#2f8fd0'],56,.36,560,.8);ring(m.x,y,m.h*.9,'#bfe9ff',0,450,2.6);flash('#e6f7ff',0,.42);shake(0,st.ps*3.4);
      addFx(0,900,p=>{const m2=EM();ctx.save();ctx.globalAlpha=1-p;const s=PX();for(let i=0;i<7;i++){const x=m2.x+(i/6-.5)*m2.w*1.6,h=m2.h*(.25+((i*37)%5)/10);ctx.fillStyle='#8fd3ff';pxTri(x-st.ps*1.6,m2.feet,x+st.ps*1.6,m2.feet,x,m2.feet-h,s);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(x-s/2),Math.round(m2.feet-h),s,s*2)}ctx.restore()})},T);return T+20},
  // Quake Arrow
  'arrowshot+earth':(R)=>{const D=1200,rel=850;bowPose(D,{el:'earth',draw:t=>t<rel?ease(clamp01((t-100)/700)):0,shown:t=>t<rel,ang:t=>.08+.14*ease(clamp01(t/600))});chargeCircle('earth',150,rel-50);groundUnder(PMx,{r:st.H*.12,c1:'#c9a46b',c2:'#ffe9b0',delay:0,dur:rel+300,star:5,seed:7});
    const pm0=PMx(),m0=EM(),gx=pm0.x+(m0.x-pm0.x)*.32;arrowFly(pm0.x+pm0.w*1.5,pm0.feet-pm0.h*.6,gx,pm0.feet-st.ps,rel,200,{el:'earth',size:1.2});
    const hit0=rel+200,N=7,step=110;setTimeout(()=>{burst(gx,pm0.feet,EC.earth,14,.2,400);shake(0,st.ps*1.5)},hit0);
    for(let i=0;i<N;i++){const t0=hit0+i*step*.6;addFx(t0,900-i*40,(p,now)=>{const m=EM(),pm=PMx(),f=(i+1)/N,x=gx+(m.x-gx)*f,last=i===N-1,h=(last?m.h*1.05:m.h*(.25+.35*f))*ease(clamp01(p*4))*(p>.75?(1-p)/.25:1),w=st.ps*(last?4.5:2.4),s=PX(),y=pm.feet;
      ctx.save();ctx.fillStyle='#2a1a10';pxTri(x-w-s,y,x+w+s,y,x,y-h-s,s);ctx.fillStyle='#8a6a3a';pxTri(x-w,y,x+w,y,x,y-h,s);ctx.fillStyle='#c9a46b';pxTri(x-w*.2,y,x+w*.6,y,x,y-h*.95,s);ctx.fillStyle='#ffe9b0';ctx.fillRect(Math.round(x-s/2),Math.round(y-h),s,s*2);ctx.restore()});
      setTimeout(()=>{const m=EM(),x=gx+(m.x-gx)*(i+1)/N;burst(x,PMx().feet,EC.earth,8,.18,380);shake(0,st.ps*(i===N-1?3:.8))},t0)}
    const T=hit0+(N-1)*step*.6;setTimeout(()=>{const m=EM();ring(m.x,m.feet-m.h*.5,m.h*.8,'#e0c08a',0,420,2.2);flash('#c9a46b',0,.25)},T);return T+30},
  // Gale Barrage
  'arrowshot+wind':(R)=>{const D=1500,lift=liftCurve(300,1150,1500,st.H*.14);bowPose(D,{el:'wind',lift,draw:t=>t<550?ease(clamp01((t-100)/450)):t<1150?.55+.45*Math.abs(Math.sin((t-550)/130*Math.PI/2)):0,ang:t=>-.08});
    gfx(0,D,(p,now)=>{const pm=PMx();ctx.save();ctx.globalAlpha=.85*Math.sin(p*Math.PI);ctx.fillStyle='#bff5d8';for(let i=0;i<3;i++)dotRing(pm.x,pm.feet-st.ps*(1+i*2.2),pm.w*(.7-i*.12),st.ps*(1.2-i*.2),PX(),now/(110+i*30)*(i%2?1:-1),4);ctx.restore()});
    for(let i=0;i<10;i++)setTimeout(()=>{const pm=PMx();spawn(pm.x+(Math.random()-.5)*pm.w*1.4,pm.feet,{vy:-(.08+Math.random()*.08)*U(),vx:(Math.random()-.5)*.06*U(),color:pick_(EC.wind),size:st.ps*.5,life:420})},i*120);
    R.tickTimes=[];for(let i=0;i<5;i++){const t0=600+i*130,f=300,a=(i-2)*.07;setTimeout(()=>{},t0);
      const pm=PMx(),m=EM(),sx=pm.x+pm.w*1.5,sy=pm.feet-pm.h*.6-st.H*.14,tx=m.x+(i-2)*m.w*.12,ty=m.feet-m.h*(.3+.12*i);arrowFly(sx,sy,tx,ty,t0,f,{el:'wind',arc:st.H*Math.abs(a)*2+st.H*.02});R.tickTimes.push(t0+f);
      addFx(t0,f,p=>{const x=sx+(tx-sx)*p,y=sy+(ty-sy)*p-Math.sin(p*Math.PI)*(st.H*Math.abs(a)*2+st.H*.02);ctx.save();ctx.globalAlpha=.6*(1-p);ctx.fillStyle='#e6fff2';dotRing(x-st.ps*3,y,st.ps*2.4,st.ps*2.4,PX(),p*20,2);ctx.restore()});
      setTimeout(()=>{burst(tx,ty,EC.wind,10,.2,340);shake(0,st.ps*.8)},t0+f)}
    return R.tickTimes[4]},
  // Thunder Rain
  'arrowshot+lightning':(R)=>{const D=1350,rel=950;bowPose(D,{el:'lightning',draw:t=>t<rel?ease(clamp01((t-100)/800)):0,shown:t=>t<rel,ang:t=>-.2-1.15*ease(clamp01(t/500))});chargeCircle('lightning',150,rel-50);
    addFx(200,rel-200,(p,now)=>{if(Math.random()<.5){const hp=st.player.handPt;if(hp)pebbleBolt(hp.x+(Math.random()-.5)*st.ps*8,hp.y-st.ps*6-Math.random()*st.ps*8,hp.x,hp.y-st.ps*3,st.ps*.35,.9)}});
    const pm0=PMx();arrowFly(pm0.x+pm0.w*.4,pm0.feet-pm0.h*1.15,pm0.x+st.W*.1,-st.H*.1,rel,260,{el:'lightning',size:1.3});
    magicCircle({at:()=>{const m=EM();return[m.x,st.H*.12]},r:st.H*.13,fl:.32,c1:'#ffe866',c2:'#ffffff',delay:rel+250,dur:1300,spin:2,seed:4});
    R.tickTimes=[];for(let i=0;i<6;i++){const t0=rel+450+i*120,f=170;const m=EM(),tx=m.x+((i*37)%7/7-.5)*m.w*1.1,ty=m.feet-m.h*(.2+((i*53)%5)/10);arrowFly(tx-st.W*.03,st.H*.12,tx,ty,t0,f,{el:'lightning',lin:true});R.tickTimes.push(t0+f);
      setTimeout(()=>{bolt(tx,ty,0);burst(tx,ty,EC.lightning,12,.22,320);shake(0,st.ps*1.1);flash('#fff3a0',0,.12)},t0+f)}
    return R.tickTimes[5]},
  // Soul Reaper Arrow
  'arrowshot+dark':(R)=>{const D=1300,rel=1050;bowPose(D,{el:'dark',draw:t=>t<rel?ease(clamp01((t-100)/850)):0,shown:t=>t<rel,ang:()=>-.03});chargeCircle('dark',150,rel);groundUnder(PMx,{r:st.H*.12,c1:'#9a4dff',c2:'#e0c8ff',delay:0,dur:rel+200,star:5,seed:9});
    addFx(100,rel-100,()=>{if(Math.random()<.6){const pm=PMx(),a=Math.random()*6.283,r=pm.h*(.8+Math.random()*.5),hp=st.player.handPt||pm;spawn(hp.x+Math.cos(a)*r,hp.y+Math.sin(a)*r,{vx:-Math.cos(a)*r/420,vy:-Math.sin(a)*r/420,color:Math.random()<.5?'#2a0a3a':'#9a4dff',size:st.ps*.8,life:420})}});
    const pm0=PMx(),m0=EM(),sx=pm0.x+pm0.w*1.5,sy=pm0.feet-pm0.h*.6,ex=st.W*1.1,ey=m0.feet-m0.h*.5,dur=420,hitT=rel+dur*clamp01((m0.x-sx)/(ex-sx));
    for(let k=0;k<3;k++)addFx(rel+k*30,dur,(p,now)=>{const x=sx+(ex-sx)*p,y=sy+(ey-sy)*p,s=PX(),L=st.ps*10;ctx.save();ctx.globalAlpha=k?.35/k:1;ctx.shadowColor='#9a4dff';ctx.shadowBlur=st.ps*6;ctx.fillStyle='#120418';ctx.fillRect(Math.round(x-L),Math.round(y-s),L,s*2);ctx.fillStyle='#9a4dff';ctx.fillRect(Math.round(x-L*2.2),Math.round(y-s/2),L*1.2,s);ctx.fillStyle='#e0c8ff';pxTri(x+s*5,y,x,y-s*2.4,x,y+s*2.4,s);ctx.restore();if(!k&&Math.random()<.9)spawn(x-L,y+(Math.random()-.5)*s*4,{vx:-.03*U(),color:pick_(EC.dark),size:st.ps*.7,life:420})});
    setTimeout(()=>{const m=EM(),y=m.feet-m.h*.5;burst(m.x,y,['#e0c8ff','#9a4dff','#2a0a3a'],34,.3,500,.7);flash('#4a1a7a',0,.3);shake(0,st.ps*2.4);
      addFx(0,1600,(p,now)=>{const m2=EM(),cx=m2.x,cy=m2.feet-m2.h*1.2,r=st.ps*4*(p<.15?ease(p/.15):1);ctx.save();ctx.globalAlpha=p>.8?(1-p)/.2:1;ctx.fillStyle='#c06cff';ctx.shadowColor='#9a4dff';ctx.shadowBlur=st.ps*3;dotRing(cx,cy,r,r,PX(),now/300,0);glyph(cx,cy,7,PX()*.9);ctx.restore()})},hitT);return hitT+20},
  // Seraph Arrow
  'arrowshot+light':(R)=>{const D=1650,rel=1050,lift=liftCurve(400,1350,1650,st.H*.13);bowPose(D,{el:'light',lift,draw:t=>t<rel?ease(clamp01((t-150)/850)):0,shown:t=>t<rel,ang:()=>-.06});chargeCircle('light',250,rel-100);
    addFx(0,D,(p,now)=>{const pm=PMx(),t=p*D,open=ease(clamp01(t/450))*(t>D-300?(D-t)/300:1),cx=pm.x-pm.w*.1,cy=pm.feet-pm.h*.62+lift(t),s=PX();if(open<=0)return;ctx.save();ctx.shadowColor='#ffe9a8';ctx.shadowBlur=st.ps*4;
      [-1,1].forEach(side=>{for(let f=0;f<5;f++){const a=(-.5-f*.28)*open+(side<0?Math.PI:0)*0,L=pm.h*(.55-f*.06)*open,flap=Math.sin(now/160)*.08;const ang=-Math.PI/2-side*(.35+f*.32)*open-flap*side;for(let q=0;q<L;q+=s*1.2){const x=cx+Math.cos(ang)*q-side*st.ps*1.2*0,y=cy+Math.sin(ang)*q;ctx.globalAlpha=.85*(1-q/L*.5);ctx.fillStyle=q>L*.7?'#ffffff':f%2?'#ffe9a8':'#fff6d8';ctx.fillRect(Math.round(x-s),Math.round(y-s/2),s*2,s)}}});ctx.restore()});
    const pm0=PMx(),sx=pm0.x+pm0.w*1.5,sy=pm0.feet-pm0.h*.6-st.H*.13,fly=300,T=rel+fly;
    addFx(rel,fly+200,(p,now)=>{const m=EM(),tx=m.x,ty=m.feet-m.h*.5,e=Math.min(1,p*(fly+200)/fly),x=sx+(tx-sx)*e,y=sy+(ty-sy)*e,s=PX();ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=p>.6?(1-p)/.4:1;const g=ctx.createLinearGradient(sx,sy,x,y);g.addColorStop(0,'#ffe9a800');g.addColorStop(1,'#fffbe8');ctx.strokeStyle=g;ctx.lineWidth=st.ps*3;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
      if(e<1){ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(ty-sy,tx-sx));ctx.shadowColor='#ffe9a8';ctx.shadowBlur=st.ps*8;ctx.fillStyle='#ffffff';pxTri(s*8,0,-s,-s*4,-s,s*4,s);ctx.fillStyle='#ffe9a8';ctx.fillRect(-st.ps*9,-s,st.ps*9,s*2);ctx.restore()}});
    setTimeout(()=>{const m=EM(),y=m.feet-m.h*.5;burst(m.x,y,['#ffffff','#fffbe8','#ffe9a8'],44,.32,560,.7);ring(m.x,y,m.h*.85,'#ffe9a8',0,450,2.4);ring(m.x,y,m.h*.55,'#ffffff',80,400,1.8);flash('#fff6d8',0,.45);shake(0,st.ps*2.6)},T);return T+20},
  });
