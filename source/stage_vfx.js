  const SL={"w": 200, "h": 132, "rows": ["phys:W", "phys:T", "fire:W", "fire:T", "water:W", "water:T", "light:W", "light:T", "dark:W", "dark:T", "ice:W", "ice:T", "earth:W", "earth:T", "wind:W", "wind:T", "lightning:W", "lightning:T"]},slashImg=new Image();slashImg.src=ASSET.slash;let slashN=0;
  function slashFx(m,el,delay){const row=SL.rows.indexOf((SL.rows.some(r=>r.startsWith(el+':'))?el:'phys')+':'+(slashN++%2?'T':'W'));
    if(!slashImg.complete||!slashImg.naturalWidth||row<0){arc(m.x,m.feet-m.h*.5,m.h*.6,-2.5,el==='phys'?'#ffffff':hexOf(el),delay);return}
    const x=m.x,y=m.feet-m.h*.5,w=Math.max(m.h*2.1,st.H*.3),h=w*SL.h/SL.w,rot=(Math.random()-.5)*.5;
    addFx(delay,330,p=>{const f=Math.min(5,Math.floor(p*6));ctx.globalAlpha=1;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.imageSmoothingEnabled=true;ctx.drawImage(slashImg,f*SL.w,row*SL.h,SL.w,SL.h,-w/2,-h/2,w,h);ctx.restore()})}
  const now_=()=>performance.now();
  const U=()=>st.H/400;
  const pick_=a=>a[Math.floor(Math.random()*a.length)];
  function spawn(x,y,o){st.parts.push({x,y,vx:o.vx||0,vy:o.vy||0,g:o.g||0,life:o.life||600,t0:now_()+(o.delay||0),color:o.color,size:o.size||st.ps,shape:o.shape||'sq'})}
  function addFx(delay,dur,draw){st.fx.push({t0:now_()+(delay||0),dur,draw})}
  function ring(x,y,r,color,delay,dur,w){addFx(delay,dur||450,p=>{ctx.globalAlpha=1-p;ctx.strokeStyle=color;ctx.lineWidth=st.ps*(w||1.4)*(1-p*.6);ctx.beginPath();ctx.arc(x,y,r*(.4+p*.8),0,6.283);ctx.stroke()})}
  function arc(x,y,r,a0,color,delay,w){addFx(delay,280,p=>{ctx.globalAlpha=1-p;ctx.strokeStyle=color;ctx.lineWidth=st.ps*(w||1.8)*(1-p*.5);ctx.lineCap='round';ctx.shadowColor=color;ctx.shadowBlur=st.ps*2;ctx.beginPath();ctx.arc(x,y,r,a0+p*.7,a0+2+p*.7);ctx.stroke()})}
  function thrust(x,y,len,color,delay){addFx(delay,240,p=>{ctx.globalAlpha=1-p;ctx.strokeStyle=color;ctx.lineWidth=st.ps*1.2*(1-p*.7);ctx.lineCap='round';ctx.shadowColor=color;ctx.shadowBlur=st.ps*2;ctx.beginPath();ctx.moveTo(x-len*(1-p*.4),y);ctx.lineTo(x+len*.35,y);ctx.stroke()})}
  function shake(delay,mag){setTimeout(()=>{st.shake={t0:now_(),dur:240,mag}},delay||0)}
  function flash(color,delay,a){setTimeout(()=>{st.flash={t0:now_(),color,a:a||.25}},delay||0)}
  function impact(x,y,color,delay,size){addFx(delay,260,p=>{ctx.globalAlpha=1-p;ctx.strokeStyle=color;ctx.lineWidth=st.ps*(1.4-p);const r1=size*(.3+p*.5),r2=size*(.6+p*.7);ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4+.3;ctx.moveTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);ctx.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2)}ctx.stroke()});shake(delay,st.ps*1.2)}
  function bolt(x,y,delay){addFx(delay,320,p=>{ctx.globalAlpha=p<.5?1:1-(p-.5)*2;ctx.strokeStyle='#fff6b0';ctx.shadowColor='#f2d24b';ctx.shadowBlur=st.ps*4;ctx.lineWidth=st.ps*1.1;ctx.beginPath();let cx=x+(Math.random()-.5)*st.ps*6;ctx.moveTo(cx,0);const seg=8;for(let i=1;i<=seg;i++){cx=x+(i<seg?(Math.random()-.5)*st.ps*8:0);ctx.lineTo(cx,y*i/seg)}ctx.stroke()});flash('#fff3a0',delay,.3);shake(delay,st.ps*1.5)}
  function beam(x,y,color,delay){addFx(delay,520,p=>{const w=st.ps*8*(1-p*.5);const gr=ctx.createLinearGradient(x-w,0,x+w,0);gr.addColorStop(0,color+'00');gr.addColorStop(.5,color+'cc');gr.addColorStop(1,color+'00');ctx.globalAlpha=1-p;ctx.fillStyle=gr;ctx.fillRect(x-w,0,w*2,y+st.ps*4)})}
  function swirl(x,y,r,color,delay){addFx(delay,600,p=>{ctx.globalAlpha=1-p;ctx.strokeStyle=color;ctx.lineWidth=st.ps*.9;ctx.lineCap='round';for(let i=0;i<3;i++){const a=p*Math.PI*4+i*2.094;ctx.beginPath();ctx.arc(x,y-r*.2*i,r*(.5+i*.25)*(1-p*.3),a,a+1.6);ctx.stroke()}})}
  function projectile(x0,y0,x1,y1,color,delay,dur,shape){addFx(delay,dur,p=>{const x=x0+(x1-x0)*p,y=y0+(y1-y0)*p-Math.sin(p*Math.PI)*st.H*(shape==='orb'?.04:.02);
      ctx.shadowColor=color;ctx.shadowBlur=st.ps*3;ctx.fillStyle=color;
      if(shape==='arrow'||shape==='spear'){const L=st.ps*(shape==='spear'?10:6);ctx.lineWidth=st.ps*(shape==='spear'?.9:.6);ctx.strokeStyle='#e6e9f0';ctx.beginPath();ctx.moveTo(x-L,y);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#e6e9f0';ctx.beginPath();ctx.moveTo(x+st.ps*1.6,y);ctx.lineTo(x-st.ps*.4,y-st.ps);ctx.lineTo(x-st.ps*.4,y+st.ps);ctx.fill()}
      else if(shape==='disc'){ctx.save();ctx.translate(x,y);ctx.rotate(p*22);ctx.fillStyle='#9aaac0';ctx.beginPath();ctx.ellipse(0,0,st.ps*2.6,st.ps*1.5,0,0,6.283);ctx.fill();ctx.restore()}
      else{ctx.beginPath();ctx.arc(x,y,st.ps*1.8,0,6.283);ctx.fill();ctx.globalAlpha=.5;ctx.beginPath();ctx.arc(x-(x1-x0)*.04,y,st.ps*1.2,0,6.283);ctx.fill()}
      if(Math.random()<.6)spawn(x,y,{color,size:st.ps*.7,life:300,vx:(Math.random()-.5)*.05*U(),vy:(Math.random()-.5)*.05*U()})})}
  function elemBurst(el,m,delay,big){
    const x=m.x,y=m.feet-m.h*.5,s=big?1.6:1,c=hexOf(el);
    ring(x,y,m.h*.7*s,c,delay,450);
    const n=Math.round(16*s);
    if(el==='fire'){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.08+Math.random()*.18)*U()*s;spawn(x,y,{vx:Math.cos(a)*v,vy:Math.sin(a)*v-.08*U(),g:-.0002*U(),color:pick_(['#ff7b3a','#ffd84a','#ff4b2b']),size:st.ps*(1+Math.random()),life:600,delay,shape:'circ'})}if(big){flash('#ff7b3a',delay,.2);shake(delay,st.ps*2)}}
    else if(el==='water'){for(let i=0;i<n;i++){const a=-Math.PI*Math.random(),v=(.12+Math.random()*.15)*U()*s;spawn(x,y,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.0012*U(),color:pick_(['#4aa8ff','#9fd8ff','#ffffff']),size:st.ps*(.7+Math.random()*.7),life:700,delay,shape:'circ'})}}
    else if(el==='ice'){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.15+Math.random()*.2)*U()*s;spawn(x,y,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:pick_(['#dff4ff','#82d4ff','#ffffff']),size:st.ps*(1+Math.random()),life:500,delay,shape:'tri'})}ring(x,y,m.h*.5,'#dff4ff',delay+80,500)}
    else if(el==='earth'){for(let i=0;i<n;i++){spawn(x+(Math.random()-.5)*m.w*1.4,m.feet,{vx:(Math.random()-.5)*.06*U(),vy:-(.2+Math.random()*.25)*U()*s,g:.0016*U(),color:pick_(['#8a5a2b','#c09461','#6b4a2a']),size:st.ps*(1.2+Math.random()*1.4),life:800,delay})}shake(delay,st.ps*1.6)}
    else if(el==='wind'){swirl(x,y,m.h*.6*s,'#e8fff4',delay);for(let i=0;i<n;i++){const a=Math.random()*6.283;spawn(x+Math.cos(a)*m.w*.6,y+Math.sin(a)*m.h*.4,{vx:-Math.sin(a)*.18*U(),vy:Math.cos(a)*.1*U()-.05*U(),color:'#e8fff4',size:st.ps*.6,life:500,delay})}}
    else if(el==='lightning'){bolt(x,y,delay);for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.1+Math.random()*.25)*U();spawn(x,y,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:pick_(['#f2d24b','#ffffff']),size:st.ps*.6,life:350,delay})}}
    else if(el==='dark'){for(let i=0;i<n;i++){const a=Math.random()*6.283,r=m.h*.9;spawn(x+Math.cos(a)*r,y+Math.sin(a)*r,{vx:-Math.cos(a)*r/450,vy:-Math.sin(a)*r/450,color:pick_(['#b18bff','#5b2a9a','#2a1240']),size:st.ps*(1+Math.random()),life:450,delay,shape:'circ'})}ring(x,y,m.h*.8,'#7a3dff',delay+400,400,2)}
    else if(el==='light'){beam(x,m.feet,'#fff0b3',delay);for(let i=0;i<n;i++){spawn(x+(Math.random()-.5)*m.w,y+(Math.random()-.5)*m.h,{vy:-.08*U(),color:pick_(['#fff0b3','#ffffff','#ffd84a']),size:st.ps*.7,life:700,delay})}}
  }
  function comboFx(R,m,delay){
    const x=m.x,y=m.feet-m.h*.5;
    if(R.name==='Steam'){for(let i=0;i<16;i++)spawn(x+(Math.random()-.5)*m.w*1.2,y+(Math.random()-.2)*m.h*.5,{vy:-(.03+Math.random()*.05)*U(),vx:(Math.random()-.5)*.03*U(),color:'#eef6ff',size:st.ps*(2+Math.random()*2),life:1100,delay:delay+i*20,shape:'puff'});ring(x,y,m.h*.7,'#eef6ff',delay,500);return true}
    if(R.name==='Magma'){elemBurst('earth',m,delay,false);for(let i=0;i<14;i++)spawn(x+(Math.random()-.5)*m.w,m.feet,{vx:(Math.random()-.5)*.08*U(),vy:-(.25+Math.random()*.2)*U(),g:.0016*U(),color:pick_(['#ff7b3a','#ff4b2b','#ffd84a']),size:st.ps*(1+Math.random()),life:800,delay,shape:'circ'});flash('#ff5a2a',delay,.18);return true}
    return false;
  }
  function physFx(k,m,delay,color){const x=m.x,y=m.feet-m.h*.5;
    if(k==='slash')slashFx(m,ELEMS.find(e=>hexOf(e)===color)||'phys',delay);
    else if(k==='stab'||k==='spearthrow'||k==='arrowshot')thrust(x,y,m.w*1.1,color,delay);
    else impact(x-m.w*.2,y,color,delay,m.h*.5);
    for(let i=0;i<8;i++){const a=Math.random()*6.283,v=(.1+Math.random()*.15)*U();spawn(x,y,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color,size:st.ps*.7,life:350,delay})}
  }
  function frostHit(m){const x=m.x,y=m.feet-m.h*.5;
    slashFx(m,'ice',0);
    for(let i=0;i<14;i++){const a=-1.2+Math.random()*2.2,v=(.12+Math.random()*.2)*U();spawn(x,y+(Math.random()-.5)*m.h*.5,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.0004*U(),color:pick_(['#dff4ff','#82d4ff','#ffffff','#4aa8ff']),size:st.ps*(.8+Math.random()),life:520,shape:'tri'})}
    ring(x,y,m.h*.45,'#dff4ff',30,360,1);shake(0,st.ps*1.2)}
  function flameHit(m){const x=m.x,y=m.feet-m.h*.5;
    slashFx(m,'fire',0);
    for(let i=0;i<16;i++){const a=-1.4+Math.random()*2.4,v=(.08+Math.random()*.18)*U();spawn(x,y+(Math.random()-.5)*m.h*.5,{vx:Math.cos(a)*v,vy:Math.sin(a)*v-.05*U(),g:-.0002*U(),color:pick_(['#ff7b3a','#ffd84a','#ff4b2b']),size:st.ps*(.9+Math.random()),life:560,shape:'circ'})}
    ring(x,y,m.h*.45,'#ffb04a',30,360,1);flash('#ff7b3a',0,.12);shake(0,st.ps*1.2)}
  function waveHit(m){const x=m.x,y=m.feet-m.h*.5;
    slashFx(m,'water',0);
    for(let i=0;i<16;i++){const a=-Math.PI*(.15+Math.random()*.7),v=(.12+Math.random()*.16)*U();spawn(x+(Math.random()-.5)*m.w*.4,y,{vx:Math.cos(a)*v*.7,vy:Math.sin(a)*v,g:.0012*U(),color:pick_(['#4aa8ff','#9fd8ff','#ffffff']),size:st.ps*(.7+Math.random()*.7),life:620,shape:'circ'})}
    ring(x,y,m.h*.45,'#9fd8ff',30,360,1);shake(0,st.ps*1.1)}
  function abyssHit(m){const x=m.x,y=m.feet-m.h*.5;
    slashFx(m,'dark',0);
    addFx(60,520,p=>{ctx.globalAlpha=(1-p)*.8;ctx.strokeStyle='#5b2a9a';ctx.lineWidth=st.ps*.9;for(let i=0;i<3;i++){const a=p*Math.PI*5+i*2.094;ctx.beginPath();ctx.arc(x,y,m.h*(.18+i*.1)*(1-p*.6),a,a+2.2);ctx.stroke()}});
    for(let i=0;i<14;i++){const a=Math.random()*6.283,r=m.h*.75;spawn(x+Math.cos(a)*r,y+Math.sin(a)*r,{vx:-Math.cos(a)*r/420,vy:-Math.sin(a)*r/420,color:pick_(['#b18bff','#5b2a9a','#2a1240']),size:st.ps*(.8+Math.random()),life:420,shape:'circ'})}
    shake(0,st.ps*1.2)}
  function volleyArrow(x0,y0,x1,y1,dur){const ang=Math.atan2(y1-y0,x1-x0);addFx(0,dur,p=>{const x=x0+(x1-x0)*p,y=y0+(y1-y0)*p,L=st.ps*6;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalAlpha=.35;ctx.strokeStyle='#ffffff';ctx.lineWidth=st.ps*.4;ctx.beginPath();ctx.moveTo(-L*2.2,0);ctx.lineTo(-L,0);ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle='#e6e9f0';ctx.lineWidth=st.ps*.6;ctx.beginPath();ctx.moveTo(-L,0);ctx.lineTo(0,0);ctx.stroke();ctx.fillStyle='#e6e9f0';ctx.beginPath();ctx.moveTo(st.ps*1.6,0);ctx.lineTo(-st.ps*.4,-st.ps);ctx.lineTo(-st.ps*.4,st.ps);ctx.fill();ctx.fillStyle='#c84b3a';ctx.fillRect(-L,-st.ps*.6,st.ps*1.2,st.ps*1.2);ctx.restore()})}
  function phoenixFx(delay,dur){let lastE=0;
    addFx(delay,dur,(p,now)=>{const pm=playerMetrics(),S0=pm.h*.42,fade=Math.min(1,p*dur/350)*(p>.88?(1-p)/.12:1),t=now/1000;
      const x=pm.x-pm.w*.95+Math.sin(t*1.7)*S0*.12,y=pm.feet-pm.h*1.08+Math.sin(t*3.1)*S0*.1,fl=Math.sin(t*14);
      ctx.save();ctx.globalAlpha=fade;ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';
      const halo=ctx.createRadialGradient(0,0,0,0,0,S0*1.3);halo.addColorStop(0,'#ffb04a55');halo.addColorStop(1,'#ff5a1f00');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,S0*1.3,0,6.283);ctx.fill();
      ctx.shadowColor='#ff7b3a';ctx.shadowBlur=S0*.5;
      for(let k=0;k<3;k++){const sw=Math.sin(t*5+k)*S0*.12,len=S0*(1.15+k*.18),yy=S0*(.06+k*.1);const tg=ctx.createLinearGradient(0,0,-len,0);tg.addColorStop(0,'#ffd84a');tg.addColorStop(.5,'#ff7b3a');tg.addColorStop(1,'#c8402f00');ctx.fillStyle=tg;
        ctx.beginPath();ctx.moveTo(-S0*.25,yy-S0*.05);ctx.quadraticCurveTo(-len*.6,yy+sw-S0*.15,-len,yy+sw);ctx.quadraticCurveTo(-len*.55,yy+sw+S0*.1,-S0*.25,yy+S0*.08);ctx.closePath();ctx.fill()}
      const wing=(sd,col,sc)=>{const up=fl*S0*.75*sd;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-S0*.05,-S0*.05);ctx.quadraticCurveTo(-S0*.35*sc,-S0*.2+up*.4-S0*.3*sc,-S0*.75*sc,-S0*.25+up);ctx.quadraticCurveTo(-S0*.5*sc,-S0*.05+up*.5,-S0*.4*sc,S0*.05+up*.3);ctx.quadraticCurveTo(-S0*.2,S0*.1,-S0*.05,-S0*.05);ctx.fill()};
      wing(-1,'#c8402f',.85);
      const bg=ctx.createLinearGradient(0,-S0*.2,0,S0*.2);bg.addColorStop(0,'#ffd84a');bg.addColorStop(1,'#ff5a1f');ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,S0*.34,S0*.17,-.15,0,6.283);ctx.fill();
      ctx.beginPath();ctx.arc(S0*.33,-S0*.14,S0*.13,0,6.283);ctx.fill();
      ctx.fillStyle='#ffe9a8';ctx.beginPath();ctx.moveTo(S0*.42,-S0*.17);ctx.lineTo(S0*.6,-S0*.1);ctx.lineTo(S0*.42,-S0*.08);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ff9a3a';[[.3,-.27,-.5],[.24,-.25,-.9],[.18,-.2,-1.2]].forEach(([a,b,r2])=>{ctx.save();ctx.translate(S0*a,S0*b);ctx.rotate(r2);ctx.beginPath();ctx.ellipse(0,-S0*.08,S0*.035,S0*.1,0,0,6.283);ctx.fill();ctx.restore()});
      ctx.shadowBlur=0;ctx.fillStyle='#2a1208';ctx.beginPath();ctx.arc(S0*.37,-S0*.16,S0*.028,0,6.283);ctx.fill();
      wing(1,'#ff9a3a',1);
      ctx.restore();
      if(p<.9&&now-lastE>35){lastE=now;spawn(x-S0*(.6+Math.random()*.7),y+S0*(Math.random()-.3)*.4,{vx:-(.02+Math.random()*.04)*U(),vy:-(.01+Math.random()*.03)*U(),g:-.0001*U(),color:pick_(['#ffd84a','#ff7b3a','#ff4b2b']),size:st.ps*(.4+Math.random()*.5),life:500,shape:'circ'})}});
    ring(playerMetrics().x-playerMetrics().w*.95,playerMetrics().feet-playerMetrics().h*1.08,playerMetrics().h*.4,'#ffb04a',delay,450,1.6)}
  function meteorFx(delay,dur,i){const m0=enemyMetrics();if(!m0)return;const off=(i%2?1:-1)*m0.w*.25*(i?1:0);
    let tx=m0.x+off,ty=m0.feet-m0.h*.45;const sx=tx-st.W*.32+off,sy=-st.H*.12,R0=Math.max(st.ps*2.6,m0.h*.22),ang=Math.atan2(ty-sy,tx-sx);let lastE=0;
    addFx(delay,dur,(p,now)=>{const e=p*p,x=sx+(tx-sx)*e,y=sy+(ty-sy)*e;
      ctx.save();ctx.translate(x,y);ctx.rotate(ang);
      const tl=R0*5.5,tg=ctx.createLinearGradient(0,0,-tl,0);tg.addColorStop(0,'#fff0b0');tg.addColorStop(.25,'#ff9a3acc');tg.addColorStop(.6,'#ff4b2b66');tg.addColorStop(1,'#ff4b2b00');
      ctx.fillStyle=tg;ctx.beginPath();ctx.moveTo(0,-R0*1.05);ctx.quadraticCurveTo(-tl*.5,-R0*.9,-tl,0);ctx.quadraticCurveTo(-tl*.5,R0*.9,0,R0*1.05);ctx.closePath();ctx.fill();
      ctx.shadowColor='#ff7b3a';ctx.shadowBlur=R0*1.4;ctx.fillStyle='#4a2e1c';ctx.beginPath();ctx.arc(0,0,R0,0,6.283);ctx.fill();ctx.shadowBlur=0;
      ctx.fillStyle='#6b4423';ctx.beginPath();ctx.arc(-R0*.25,-R0*.2,R0*.55,0,6.283);ctx.fill();
      ctx.strokeStyle='#ffb04a';ctx.lineWidth=Math.max(1,R0*.14);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(R0*.5,-R0*.4);ctx.lineTo(R0*.05,-R0*.05);ctx.lineTo(R0*.35,R0*.35);ctx.moveTo(-R0*.2,R0*.55);ctx.lineTo(-R0*.45,R0*.15);ctx.stroke();
      ctx.fillStyle='#fff0b0';ctx.beginPath();ctx.arc(R0*.55,0,R0*.32,0,6.283);ctx.fill();
      ctx.restore();
      if(now-lastE>25){lastE=now;for(let k=0;k<2;k++)spawn(x-Math.cos(ang)*R0*(1+Math.random()*2),y-Math.sin(ang)*R0*(1+Math.random()*2)+(Math.random()-.5)*R0,{vx:-Math.cos(ang)*.03*U(),vy:-.02*U(),g:-.0001*U(),color:pick_(['#ffd84a','#ff7b3a','#ff4b2b','#8a5a2b']),size:st.ps*(.5+Math.random()*.7),life:420,shape:'circ'})}});
    setTimeout(()=>{const m=enemyMetrics();if(!m)return;const mm={x:m.x+off,feet:m.feet,w:m.w,h:m.h};
      flash('#ff9a3a',0,.28);shake(0,st.ps*3);ring(mm.x,mm.feet-mm.h*.3,mm.h*1.1,'#ffb04a',0,500,3);ring(mm.x,mm.feet,mm.w*1.6,'#8a5a2b',60,500,2);
      elemBurst('fire',mm,0,true);elemBurst('earth',mm,40,true);
      for(let k=0;k<18;k++){const a2=-Math.PI*(.1+Math.random()*.8),v=(.15+Math.random()*.3)*U();spawn(mm.x,mm.feet-st.ps,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,g:.0016*U(),color:pick_(['#4a2e1c','#6b4423','#ff7b3a','#ffd84a']),size:st.ps*(.8+Math.random()*1.2),life:700})}},delay+dur)}
  function mudBlob(x0,y0,x1,y1,dur){addFx(0,dur,p=>{const x=x0+(x1-x0)*p,y=y0+(y1-y0)*p-Math.sin(p*Math.PI)*st.H*.06,r=st.ps*(1.6+Math.sin(p*20)*.2);
      ctx.fillStyle='#5a3a1c';ctx.beginPath();ctx.ellipse(x,y,r*1.2,r,p*3,0,6.283);ctx.fill();ctx.fillStyle='#8a6a3a';ctx.beginPath();ctx.arc(x-r*.35,y-r*.35,r*.4,0,6.283);ctx.fill();
      if(Math.random()<.5)spawn(x,y,{vx:-.02*U(),vy:.01*U(),g:.001*U(),color:'#4a2e14',size:st.ps*.5,life:300,shape:'circ'})})}
  function drawMud(x,feet,m,t0,now){const grow=Math.min(1,(now-t0)/450),w=Math.max(m.w*2.4,st.ps*14)*grow,h=st.ps*2.4*grow;if(w<=0)return;
    ctx.save();ctx.globalAlpha=1;const gr=ctx.createRadialGradient(x,feet,0,x,feet,w*.55);gr.addColorStop(0,'#4a2e14');gr.addColorStop(.75,'#5a3a1c');gr.addColorStop(1,'#5a3a1c00');
    ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(x,feet+st.ps*.4,w*.55,h,0,0,6.283);ctx.fill();
    ctx.fillStyle='#7a5a32';ctx.beginPath();ctx.ellipse(x-w*.18,feet-st.ps*.1,w*.16,h*.32,0,0,6.283);ctx.fill();
    ctx.fillStyle='#c8a878aa';ctx.beginPath();ctx.ellipse(x-w*.22,feet-st.ps*.25,w*.07,h*.13,0,0,6.283);ctx.fill();
    for(let i=0;i<3;i++){const ph=(now/700+i*.37)%1,bx=x+(i-1)*w*.28,br=st.ps*(.3+ph*.5);ctx.globalAlpha=1-ph;ctx.strokeStyle='#8a6a3a';ctx.lineWidth=Math.max(1,st.ps*.2);ctx.beginPath();ctx.arc(bx,feet-st.ps*.2-ph*st.ps,br,Math.PI,0);ctx.stroke()}
    ctx.restore()}
  const spImg=new Image();spImg.src=ASSET.stonep;const shImg=new Image();shImg.src=ASSET.stonehit;
  function stoneFist(x0,y0,x1,y1,dur){const ok=spImg.complete&&spImg.naturalWidth,FW=ok?spImg.naturalWidth/4:1,FH=ok?spImg.naturalHeight:1,w=st.H*.3,h=w*FH/FW;
    addFx(0,dur,p=>{const e=p<.35?p*.6:.21+(p-.35)/.65*.79,x=x0+(x1-x0)*e,y=y0+(y1-y0)*e,f=p<.18?0:p<.35?1:p<.65?2:3;
      if(ok){ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalAlpha=Math.min(1,p*6);const sc=.55+.45*Math.min(1,p*2.2);ctx.drawImage(spImg,f*FW,0,FW,FH,x-w*sc*.85,y-h*sc/2,w*sc,h*sc);ctx.restore()}
      else{ctx.fillStyle='#6b4a2a';ctx.beginPath();ctx.arc(x,y,st.ps*2.5,0,6.283);ctx.fill()}
      if(Math.random()<.5)spawn(x-w*.5,y+(Math.random()-.5)*h*.5,{vx:-.04*U(),vy:(Math.random()-.5)*.02*U(),g:.0006*U(),color:pick_(['#c09461','#8a5a2b','#d8c4a0']),size:st.ps*(.4+Math.random()*.5),life:350})});
    setTimeout(()=>{const m=enemyMetrics();if(!m)return;shake(0,st.ps*2.2);flash('#c09461',0,.12);
      if(shImg.complete&&shImg.naturalWidth){const hw=Math.max(m.h*1.6,st.H*.22),hh=hw*shImg.naturalHeight/shImg.naturalWidth;addFx(0,460,p=>{ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalAlpha=1-p*p;const sc=.7+p*.5;ctx.drawImage(shImg,x1-hw*sc*.35,y1-hh*sc/2,hw*sc,hh*sc);ctx.restore()})}
      for(let k=0;k<12;k++){const a=(Math.random()-.5)*1.6,v=(.12+Math.random()*.2)*U();spawn(x1,y1,{vx:Math.cos(a)*v,vy:Math.sin(a)*v-.05*U(),g:.0016*U(),color:pick_(['#4a2e1c','#6b4423','#8a6a3a']),size:st.ps*(.7+Math.random()*1),life:600})}},dur)}
  function drawCracks(x,feet,m,t0,now,seed){const el=now-t0,grow=Math.min(1,el/450),fade=el>2800?Math.max(0,1-(el-2800)/800):1;if(fade<=0)return;
    let r=seed*97+13;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};const W2=Math.max(m.w*2.4,st.ps*16);
    ctx.save();ctx.globalAlpha=fade;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.fillStyle='#1a0f08aa';ctx.beginPath();ctx.ellipse(x,feet+st.ps*.8,W2*.42*grow,st.ps*1.3*grow,0,0,6.283);ctx.fill();
    const crack=(px,py,ang,len,w,depth)=>{const pts=[[px,py]];for(let s2=0;s2<5;s2++){ang+=(rnd()-.5)*.7;const rt=Math.cos(ang)>=0;ang=rt?Math.min(.7,Math.max(.04,ang)):Math.max(Math.PI-.7,Math.min(Math.PI-.04,ang));px+=Math.cos(ang)*len/5;py+=Math.sin(ang)*len/5;pts.push([px,py])}
      ctx.strokeStyle='#120a05';ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(...pts[0]);pts.forEach(p=>ctx.lineTo(...p));ctx.stroke();
      ctx.strokeStyle='#ffb04a66';ctx.lineWidth=Math.max(1,w*.3);ctx.stroke();
      if(depth<1){const q=pts[2+Math.floor(rnd()*2)];crack(q[0],q[1],ang+(rnd()<.5?.8:-.8),len*.5,w*.6,depth+1)}};
    for(let k=0;k<6;k++){const side=k%2?1:-1,base=side>0?.25:Math.PI-.25;crack(x+(rnd()-.5)*st.ps*3,feet+st.ps*.3,base+side*(rnd()*.5),W2*(.28+rnd()*.25)*grow,Math.max(2,st.ps*(.75-k*.06)),0)}
    ctx.restore()}
  // Lightning Strike: hand-drawn crackling lightning aura that builds up around the hero
  function lsAura(delay,dur){let arcs=[],lastA=0;
    const jag=(x1,y1,x2,y2,n,amp)=>{const pts=[[x1,y1]];for(let i=1;i<n;i++){const t=i/n;pts.push([x1+(x2-x1)*t+(Math.random()-.5)*amp,y1+(y2-y1)*t+(Math.random()-.5)*amp])}pts.push([x2,y2]);return pts};
    addFx(delay,dur,(p,now)=>{const t=p*dur,pm=playerMetrics(),cx=pm.x,cy=pm.feet-pm.h*.5,g=Math.min(1,t/(dur*.75)),fade=p>.94?(1-p)/.06:1;
      ctx.save();ctx.globalCompositeOperation='lighter';
      // glow column
      ctx.globalAlpha=(.18+.32*g)*fade*(.85+.15*Math.sin(now/40));const rg=ctx.createRadialGradient(cx,cy,0,cx,cy,pm.h*(.55+.35*g));rg.addColorStop(0,'#fff6b0');rg.addColorStop(.45,'#f2d24b88');rg.addColorStop(1,'#f2d24b00');ctx.fillStyle=rg;ctx.beginPath();ctx.ellipse(cx,cy,pm.h*(.4+.25*g),pm.h*(.6+.35*g),0,0,6.283);ctx.fill();
      // ground ring
      ctx.globalAlpha=(.4+.5*g)*fade;ctx.strokeStyle='#fff6b0';ctx.lineWidth=st.ps*(.4+.4*g);ctx.beginPath();ctx.ellipse(cx,pm.feet-st.ps*.3,pm.w*(.6+.5*g),pm.h*.05,0,0,6.283);ctx.stroke();
      // regenerate arcs every ~55ms (flicker), more and taller as it charges
      if(now-lastA>55){lastA=now;arcs=[];const n=2+Math.round(5*g),H=pm.h*(.55+.6*g);
        for(let i=0;i<n;i++){const side=i%2?1:-1,x0=cx+side*pm.w*(.25+Math.random()*.45),y0=pm.feet,x1=cx+side*pm.w*(Math.random()*.3)+(Math.random()-.5)*pm.w*.3,y1=pm.feet-H*(.6+Math.random()*.4);arcs.push({pts:jag(x0,y0,x1,y1,7,st.ps*3.5),w:st.ps*(.35+Math.random()*.45),c:Math.random()<.35?'#ffffff':'#ffe866'})}
        for(let i=0;i<Math.round(1+3*g);i++){const a0=Math.random()*6.283,r=pm.h*(.35+.25*g),a1=a0+(Math.random()-.5)*1.6;arcs.push({pts:jag(cx+Math.cos(a0)*r*.6,cy+Math.sin(a0)*r,cx+Math.cos(a1)*r*.6,cy+Math.sin(a1)*r,5,st.ps*2.5),w:st.ps*.35,c:'#ffffff'})}}
      ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor='#f2d24b';ctx.shadowBlur=st.ps*4;
      arcs.forEach(a=>{ctx.globalAlpha=(.55+.45*g)*fade;ctx.strokeStyle=a.c;ctx.lineWidth=a.w*(1+g*.6);ctx.beginPath();ctx.moveTo(...a.pts[0]);a.pts.forEach(q=>ctx.lineTo(...q));ctx.stroke()});
      ctx.restore();
      if(Math.random()<.35+.5*g)spawn(cx+(Math.random()-.5)*pm.w*1.4,pm.feet-Math.random()*pm.h*(.4+.7*g),{vy:-(.04+Math.random()*.1)*U(),vx:(Math.random()-.5)*.05*U(),color:Math.random()<.5?'#ffffff':'#ffe866',size:st.ps*(.35+Math.random()*.4),life:380});
    })}
  // white flash burst on the hero just before the blink
  function lsWhite(delay,dur){addFx(delay,dur,p=>{const pm=playerMetrics(),cx=pm.x,cy=pm.feet-pm.h*.5,a=p<.6?p/.6:1-(p-.6)/.4;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;const r=pm.h*(.4+.9*p);const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'#ffffff');g.addColorStop(.5,'#ffffffcc');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,6.283);ctx.fill();ctx.restore()});
    flash('#ffffff',delay+dur*.5,.55)}
  function lsBlink(x,feet,h,delay){
    addFx(delay,260,p=>{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-p;const w=st.ps*(5-4*p);const g=ctx.createLinearGradient(x-w*3,0,x+w*3,0);g.addColorStop(0,'#f2d24b00');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#f2d24b00');ctx.fillStyle=g;ctx.fillRect(x-w*3,feet-h*1.3,w*6,h*1.3);
      ctx.strokeStyle='#fff6b0';ctx.shadowColor='#f2d24b';ctx.shadowBlur=st.ps*4;ctx.lineWidth=st.ps*.8;ctx.beginPath();let cx=x;ctx.moveTo(cx,feet-h*1.3);for(let i=1;i<=7;i++){cx=x+(Math.random()-.5)*st.ps*7;ctx.lineTo(cx,feet-h*1.3+h*1.3*i/7)}ctx.stroke();ctx.restore()});
    setTimeout(()=>{for(let i=0;i<16;i++){const a=Math.random()*6.283,v=(.08+Math.random()*.2)*U();spawn(x,feet-h*.5+(Math.random()-.5)*h*.6,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:i%3?'#ffe866':'#ffffff',size:st.ps*.6,life:360})}},delay)}
