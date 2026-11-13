  // ===== Class ultimates: 4-second pixel-art cinematics =====
  function ultDim(dur,col,title){addFx(0,dur,(p,now)=>{const a=p<.08?p/.08:p>.9?(1-p)/.1:1;ctx.save();ctx.globalAlpha=.32*a;ctx.fillStyle='#05070a';ctx.fillRect(0,0,st.W,st.H);
    const bh=st.H*.07*a;ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,st.W,bh);ctx.fillRect(0,st.H-bh,st.W,bh);
    if(p>.03&&p<.45){const tp=clamp01((p-.03)/.1),fo=p>.35?1-(p-.35)/.1:1;ctx.globalAlpha=fo;const fs=Math.round(st.H*.075);ctx.font=`900 ${fs}px Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';const x=st.W/2+(1-ease(tp))*st.W*.15,y=st.H*.2;ctx.fillStyle='#000';ctx.fillText(title,x+st.ps*.8,y+st.ps*.8);ctx.fillStyle=col;ctx.fillText(title,x,y);ctx.fillStyle='#ffffff';ctx.globalAlpha=fo*.5;ctx.fillRect(x-st.W*.25*ease(tp),y+fs*.62,st.W*.5*ease(tp),Math.max(1,st.ps*.4))}ctx.restore()})}
  const uPx=()=>Math.max(2,Math.round(st.ps*.7));
  Object.assign(SPELLFX,{
  // Aegis Warden: Citadel Crash
  'ult_warden':R=>{st.player.anim=null;st.player.act=null;const T=4000;ultDim(T,'#8ff0e6','CITADEL CRASH');
    setTimeout(()=>{st.player.anim={name:'shield',t0:now_(),dur:2400}},0);
    groundUnder(PMx,{r:st.H*.2,c1:'#ffd36b',c2:'#59c9c2',delay:0,dur:2600,seed:4,spin:.5,star:6});
    const walls=[-1.9,-1.05,1.05,1.9];
    // walls rise around the hero, levitate, then fly onto the enemies
    walls.forEach((fx,i)=>addFx(250+i*180,T-250-i*180,(p,now)=>{const pm=PMx(),t=p*(T-250-i*180)+250+i*180,s=uPx(),W=st.ps*7,H=pm.h*(1.05-Math.abs(fx)*.12);
      let x=pm.x+pm.w*fx,y=pm.feet,rise=ease(clamp01((t-250-i*180)/600)),lift=0,rot=0;
      if(t>1900)lift=ease(clamp01((t-1900)/600))*pm.h*.9;
      if(t>2550){const fl=ease(clamp01((t-2550-i*120)/700)),foes=st.foes.filter(f=>!f.gone&&f.state!=='die'),f=foes.length?foes[i%foes.length]:null,m=f?enemyMetricsOf(f):EM();const tx=m.x+(i%2?1:-1)*m.w*.2,ty=m.feet;x=x+(tx-x)*fl;y=(pm.feet-lift)+(ty-(pm.feet-lift))*fl-Math.sin(fl*Math.PI)*st.H*.35;lift=0;rot=(1-fl)*.3*(i%2?1:-1);if(fl>=1)return}
      else y=pm.feet-lift+Math.sin(now/180+i)*st.ps*(t>1900?1:0);
      const h=H*rise;if(h<2)return;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(rot);
      dfR(-W/2-s,-h-s,W+2*s,h+s,'#2a2620');dfR(-W/2,-h,W,h,'#7f7a70');dfR(-W/2,-h,s*1.5,h,'#a8a296');dfR(W/2-s*1.5,-h,s*1.5,h,'#55504a');
      for(let r=0;r<h;r+=s*3)dfR(-W/2,-h+r,W,Math.max(1,s*.4),'#5a554e');for(let k=0;k<3;k++)dfR(-W/2+k*W/3,-h-s*2.5,W/4,s*2.5,'#7f7a70');
      dfR(-s,-h*.75,s*2,h*.4,'#59c9c2');dfR(-W*.25,-h*.6,W*.5,s*1.4,'#59c9c2');ctx.globalCompositeOperation='lighter';ctx.globalAlpha=t>1700&&t<2550?.35+.25*Math.sin(now/70):.12;dfR(-W/2,-h,W,h,'#59c9c2');ctx.restore();
      if(rise<1&&Math.random()<.5)spawn(x+(Math.random()-.5)*W,pm.feet,{vy:-.04*U(),color:'#c0a878',size:st.ps*.6,life:380})}));
    [250,430,610,790].forEach(d=>setTimeout(()=>shake(0,st.ps*1.2),d+200));
    setTimeout(()=>{const pm=PMx();flash('#59c9c2',0,.18);ring(pm.x,pm.feet-pm.h*.5,pm.h*1.3,'#ffd36b',0,600,2.4)},1700);
    const hits=[3150,3270,3390,3510];hits.forEach(d=>setTimeout(()=>{st.foes.forEach(f=>{if(f.gone||f.state==='die')return;const m=enemyMetricsOf(f);sBurst(m.x,m.feet,['#7f7a70','#c0a878','#59c9c2','#ffd36b'],16,.3,560,.9)});shake(0,st.ps*3.2)},d));
    setTimeout(()=>{flash('#ffd36b',0,.32);st.foes.forEach(f=>{if(f.gone||f.state==='die')return;const m=enemyMetricsOf(f);ring(m.x,m.feet-st.ps,m.w*2.4,'#ffd36b',0,600,3)})},3520);
    return 3560},
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
