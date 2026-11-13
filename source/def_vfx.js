  // ===== Defense + Defense techniques: 15 pixel-art guard animations, lingering overlays and hit reactions =====
  const dfR=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  const dfS=()=>Math.max(2,Math.round(st.ps*.7));
  const dfOn=()=>S&&S.phase==='battle'&&!st.player.dead;
  // --- lingering overlay manager (one fx entry that draws every active guard)
  const DOV=[];
  function dfEnsure(){if(now_()-(st._dovT||0)>250){st._dovT=now_();addFx(0,1e9,(p,now)=>{st._dovT=now_();if(!dfOn())return;DOV.forEach(o=>{try{if(o.on()){ctx.save();o.draw(now);ctx.restore()}}catch(e){}})})}}
  // --- sprite-ish painters
  function dfTower(x,feet,h,w,a,glow){const s=dfS();ctx.save();ctx.globalAlpha=a;const y=feet-h;
    dfR(x-w/2-s,y-s,w+2*s,h+s,'#1c2028');dfR(x-w/2,y,w,h,'#6f7a8c');dfR(x-w/2,y,s*1.5,h,'#aab4c4');dfR(x+w/2-s*1.5,y,s*1.5,h,'#4a5262');
    dfR(x-w/2,y,w,s*1.5,'#c8d0dc');dfR(x-w/2,y+h*.32,w,s,'#4a5262');dfR(x-w/2,y+h*.68,w,s,'#4a5262');
    [[.18,.08],[.82,.08],[.18,.92],[.82,.92],[.18,.5],[.82,.5]].forEach(([fx,fy])=>dfR(x-w/2+w*fx-s/2,y+h*fy-s/2,s,s,'#e8eef6'));
    dfR(x-s,y+h*.2,s*2,h*.42,'#e8b840');dfR(x-w*.22,y+h*.33,w*.44,s*2,'#e8b840');dfR(x-s*.5,y+h*.22,s,h*.38,'#fff0a0');
    if(glow){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*glow;dfR(x-w/2,y,w,h,'#59c9c2')}ctx.restore()}
  function dfHex(cx,cy,r,fill,line,a){ctx.globalAlpha=a;ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*6.283+.5236,px=Math.round(cx+Math.cos(an)*r),py=Math.round(cy+Math.sin(an)*r);i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(line){ctx.strokeStyle=line;ctx.lineWidth=Math.max(1,st.ps*.35);ctx.stroke()}}
  function dfDomeCells(pm){const hs=st.ps*2.6,rx=pm.h*.72,ry=pm.h*1.02,cx=pm.x,cy=pm.feet,out=[];for(let row=0;row*hs*1.5<ry+hs;row++){const y=cy-row*hs*1.5;for(let q=-20;q<=20;q++){const x=cx+q*hs*1.732+(row%2?hs*.866:0),d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<=1.02&&d>=.55)out.push([x,y,Math.atan2(cy-y,x-cx)])}}return out}
  function dfSword(x,y,ang,len,c1,c2,a){const s=dfS();ctx.save();ctx.globalAlpha=a;ctx.translate(Math.round(x),Math.round(y));ctx.rotate(ang);
    dfR(-len*.5,-s,len*.78,s*2,c1);dfR(-len*.5,-s,len*.78,s*.8,c2);dfR(len*.28,-s*.6,s*2,s*1.2,c1);dfR(len*.28-s*.4,-s*3,s*1.2,s*6,'#e8b840');dfR(len*.32,-s*.7,len*.16,s*1.4,'#6a4a2a');dfR(len*.48,-s,s*1.4,s*2,'#e8b840');ctx.restore()}
  function dfFlame(x,feet,h,w,now,cols,a,seed){const s=dfS();ctx.save();ctx.globalAlpha=a;for(let i=0;i<w/s;i++){const n=Math.max(1,w/s),ed=Math.abs(i-n/2)/(n/2),fx=x-w/2+i*s,hh=h*(1-ed*ed)*(.35+.65*Math.abs(Math.sin(now/120+i*1.7+(seed||0))));for(let k=0;k<hh;k+=s){const c=cols[Math.min(cols.length-1,Math.floor(k/hh*cols.length))];if(Math.random()<.92)dfR(fx,feet-k-s,s,s,c)}}ctx.restore()}
  function dfMirrorPane(x,feet,h,w,a,crack,now){const s=dfS(),y=feet-h;ctx.save();ctx.globalAlpha=a;
    dfR(x-w/2-s*2,y-s*2,w+s*4,h+s*2,'#8a8f9c');dfR(x-w/2-s,y-s,w+s*2,h+s,'#d8dde6');dfR(x-w/2,y,w,h,'#7fb8d8');
    const g=ctx.createLinearGradient(x-w/2,y,x+w/2,y+h);g.addColorStop(0,'#cfeaff');g.addColorStop(.5,'#8fc6e6');g.addColorStop(1,'#5a94b8');ctx.fillStyle=g;ctx.fillRect(Math.round(x-w/2),Math.round(y),Math.round(w),Math.round(h));
    const sh=((now/700)%1.6)-.3;ctx.globalAlpha=a*.8;for(let k=0;k<3;k++){const yy=y+h*(sh+k*.12);for(let i=0;i<w;i+=s){const yi=yy-i*.6;if(yi>y&&yi<y+h)dfR(x-w/2+i,yi,s,s*(k===1?2:1),'#ffffff')}}
    ctx.globalAlpha=a;dfR(x-s,y-s*4,s*2,s*3,'#e8b840');dfR(x-s*3,y-s*3,s*6,s,'#e8b840');
    if(crack){ctx.strokeStyle='#ffffff';ctx.lineWidth=s*.6;ctx.beginPath();const cx=x,cy=y+h*.45;for(let i=0;i<6;i++){const an=i/6*6.283+.4;ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(an)*w*.6*crack,cy+Math.sin(an)*h*.4*crack)}ctx.stroke()}ctx.restore()}
  function dfSigil(x,y,r,now,c1,c2,a){const s=dfS();ctx.save();ctx.globalAlpha=a;ctx.shadowColor=c1;ctx.shadowBlur=st.ps*3;ctx.fillStyle=c1;dotRing(x,y,r,r,s,now/900,0);dotRing(x,y,r*.82,r*.82,s,-now/700,4);ctx.fillStyle=c2;for(let i=0;i<8;i++){const an=now/900+i/8*6.283;glyph(x+Math.cos(an)*r*.66,y+Math.sin(an)*r*.66,i+3,s*.55)}
    pxDisc(x,y,r*.34,s);ctx.fillStyle=c1;dfR(x-s*.5,y-r*.25,s,r*.5);dfR(x-r*.25,y-s*.5,r*.5,s);ctx.restore()}
  function dfClone(dx,a,col,now){const H=st.player.lastHF;if(!H||!H.c)return;const tc=tintC('dfclone'+col+H.key,H.c,col);ctx.save();ctx.globalAlpha=a;ctx.translate(H.x+dx,H.y+Math.sin(now/240+dx)*st.ps*.6);ctx.scale(H.fl?-1:1,1);ctx.drawImage(tc,-H.ax*H.k,-H.fy*H.k,H.w*H.k,H.h*H.k);ctx.globalAlpha=a*.6;ctx.globalCompositeOperation='lighter';ctx.drawImage(tc,-H.ax*H.k,-H.fy*H.k-st.ps*.5,H.w*H.k,H.h*H.k);ctx.restore()}
  function dfSpikes(x0,feet,n,gap,h,grow,a,now){const s=dfS();ctx.save();ctx.globalAlpha=a;for(let i=0;i<n;i++){const g=clamp01(grow*1.6-i*.12),hh=h*(.7+.3*((i*37)%7)/6)*ease(g);if(hh<=0)continue;const x=x0+i*gap;
      for(let k=0;k<hh;k+=s){const w=Math.max(s,(1-k/hh)*s*3.2);dfR(x-w/2,feet-k-s,w,s,k>hh*.75?'#e8eef6':'#8a92a2');dfR(x-w/2,feet-k-s,s*.6,s,'#c8d0dc')}dfR(x-s*2,feet-s,s*4,s,'#3a3e48')}ctx.restore()}
  const PM=()=>PMx();
  // ---- lingering overlays
  DOV.push(
   {on:()=>S.bulwark&&S.block>0,draw:now=>{const pm=PM();dfTower(pm.x+pm.w*1.15,pm.feet,pm.h*.95,st.ps*7,.92,0);dfTower(pm.x+pm.w*1.75,pm.feet,pm.h*.82,st.ps*6,.85,0)}},
   {on:()=>S.aegis&&S.barrier>0,draw:now=>{const pm=PM();dfDomeCells(pm).forEach(([x,y,an],i)=>{const sh=.5+.5*Math.sin(now/260-an*3+i*.1);dfHex(x,y,st.ps*2.4,'#9fe2ff',(sh>.85?'#ffffff':'#7fd0ff'),.1+.22*sh)})}},
   {on:()=>S.mirage>0,draw:now=>{const offs=[-1.25,1.25,-2.3];for(let i=0;i<S.mirage;i++){const f=.35+.15*Math.sin(now/90+i*2);dfClone(offs[i]*PM().w,f,'#7fe0ff',now)}}},
   {on:()=>!!S.venge,draw:now=>{const pm=PM();dfFlame(pm.x-pm.w*.55,pm.feet,pm.h*.45,st.ps*3,now,['#ff3a2a','#c0101a','#4a0610'],.55,1);dfFlame(pm.x+pm.w*.55,pm.feet,pm.h*.45,st.ps*3,now,['#ff3a2a','#c0101a','#4a0610'],.55,2);dfR(pm.x+pm.w*.08,pm.feet-pm.h*.86,st.ps*.8,st.ps*.8,'#ff2a2a')}},
   {on:()=>S.manaGuard>0&&(S.block>0||S.barrier>0),draw:now=>{const pm=PM();[[-.9,.7],[1.0,.9]].forEach(([fx,fy],i)=>{const x=pm.x+pm.w*fx,y=pm.feet-pm.h*fy+Math.sin(now/300+i*2)*st.ps*1.5,s=dfS();ctx.globalAlpha=.85;pxTri(x,y-s*4,x-s*2.2,y,x+s*2.2,y,s);ctx.fillStyle='#3a8cff';pxTri(x,y-s*4,x-s*2.2,y,x+s*2.2,y,s);ctx.fillStyle='#bfe6ff';pxTri(x,y-s*4,x-s*2.2,y,x,y+s*3.5,s);ctx.fillStyle='#2a5ec0';pxTri(x,y+s*3.5,x-s*2.2,y,x+s*2.2,y,s)})}},
   {on:()=>S.parry&&S.parry.iron,draw:now=>{const pm=PM(),x=pm.x+pm.w*.95,y=pm.feet-pm.h*.55,s=dfS();dfSword(x,y,-.8,st.ps*9,'#c8d0dc','#ffffff',.9);ctx.globalAlpha=.95;pxDisc(x,y,st.ps*2.6,s);ctx.fillStyle='#6f7a8c';pxDisc(x,y,st.ps*2.6,s);ctx.fillStyle='#aab4c4';pxDisc(x-s*.6,y-s*.6,st.ps*1.6,s);dfR(x-s*.5,y-s*.5,s,s,'#e8b840')}},
   {on:()=>!!S.tumble,draw:now=>{const pm=PM(),s=dfS();ctx.fillStyle='#bff5d8';ctx.globalAlpha=.55;dotRing(pm.x,pm.feet-s,pm.w*.9,st.ps*1.2,s,now/200,3);ctx.fillStyle='#59c98a';dotRing(pm.x,pm.feet-s*2,pm.w*.7,st.ps,s,-now/160,4)}},
   {on:()=>S.spikes&&S.block>0,draw:now=>{const pm=PM();dfSpikes(pm.x+pm.w*.9,pm.feet,5,st.ps*3,pm.h*.38,1,.95,now)}},
   {on:()=>S.veilT>0,draw:now=>{const pm=PM(),s=dfS();ctx.globalAlpha=.4+.2*Math.sin(now/110);ctx.fillStyle='#b18bff';for(let i=0;i<6;i++){const y=pm.feet-pm.h*(.1+i*.16),off=Math.sin(now/90+i*1.9)*st.ps*2;dfR(pm.x-pm.w*.7+off,y,pm.w*1.4,Math.max(1,s*.5),i%2?'#d8c4ff':'#8a5ae0')}ctx.globalAlpha=.6;for(let i=0;i<5;i++){const an=now/700+i*1.26;dfR(pm.x+Math.cos(an)*pm.w,pm.feet-pm.h*.5+Math.sin(an*1.3)*pm.h*.45,s,s,'#e4d4ff')}}},
   {on:()=>S.retri&&S.barrier>0,draw:now=>{const pm=PM();dfSigil(pm.x+pm.w*1.05,pm.feet-pm.h*.55,pm.h*.3,now,'#ffd36b','#fff6c8',.55+.15*Math.sin(now/200))}},
   {on:()=>!!S.mirror,draw:now=>{const pm=PM();dfMirrorPane(pm.x+pm.w*1.3,pm.feet,pm.h*1.05,st.ps*9,.9,0,now)}},
   {on:()=>!!S.shadowStep,draw:now=>{const pm=PM(),s=dfS();ctx.globalAlpha=.75;for(let i=0;i<14;i++){const an=i/14*6.283,r=pm.w*(.9+.15*Math.sin(now/180+i));dfR(pm.x+Math.cos(an)*r,pm.feet-s+Math.sin(an)*st.ps*1.2,s*1.4,s,'#1a0f2a')}for(let i=0;i<4;i++){const ph=((now/900)+i/4)%1;ctx.globalAlpha=.6*(1-ph);dfR(pm.x+(i-1.5)*pm.w*.4,pm.feet-ph*pm.h*.6,s,s*2,'#6a4aa0')}ctx.globalAlpha=.9;dfR(pm.x-st.ps*1.5,pm.feet-st.ps*1.8,s,s,'#c06cff');dfR(pm.x+st.ps*.8,pm.feet-st.ps*1.8,s,s,'#c06cff')}},
   {on:()=>S.parry&&S.parry.storm,draw:now=>{const pm=PM();for(let i=0;i<3;i++){const an=now/500+i/3*6.283;dfSword(pm.x+Math.cos(an)*pm.w*1.2,pm.feet-pm.h*.55+Math.sin(an)*pm.h*.32,an+1.57,st.ps*8,'#bfe9ff','#ffffff',.85)}}},
   {on:()=>!!S.windDance,draw:now=>{const pm=PM(),s=dfS();for(let i=0;i<10;i++){const an=now/380+i/10*6.283,r=pm.w*(1+.2*Math.sin(i)),x=pm.x+Math.cos(an)*r,y=pm.feet-pm.h*(.15+((i*.37)%1)*.7)+Math.sin(an)*st.ps*2;ctx.globalAlpha=.8;dfR(x,y,s*1.6,s,i%3?'#7fe0a0':'#d8ffb0');dfR(x+s,y-s*.6,s,s*.6,'#3a9a5a')}}},
   {on:()=>S.deflect>0,draw:now=>{const pm=PM(),s=dfS();for(let i=0;i<S.deflect;i++){const an=now/420+i*3.14,x=pm.x+Math.cos(an)*pm.w*1.1,y=pm.feet-pm.h*.6+Math.sin(an)*pm.h*.2;ctx.globalAlpha=.95;pxTri(x,y-s*3,x-s*2,y,x+s*2,y,s);ctx.fillStyle='#fff6c0';pxTri(x,y-s*3,x-s*2,y,x+s*2,y,s);ctx.fillStyle='#e8b840';pxTri(x,y+s*3,x-s*2,y,x+s*2,y,s)}}}
  );
  // ---- cast animations
  const dfCast=(name,dur,delay)=>setTimeout(()=>{if(!st.player.mv)st.player.anim={name,t0:now_(),dur}},delay||0);
  Object.assign(SPELLFX,{
  // 1 Bulwark: two tower shields drop from the sky and slam into the ground
  'block+block':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('shield',1500,t0);
    [[1.15,.95,7,0],[1.75,.82,6,180]].forEach(([fx,fh,fw,dl])=>{addFx(t0+dl,900,(p,now)=>{const pm=PM(),x=pm.x+pm.w*fx,h=pm.h*fh,fall=p<.45?(1-ease(p/.45)):0,y=pm.feet-fall*st.H*.7;ctx.save();dfTower(x,y,h,st.ps*fw,1,p>.45?.5*(1-(p-.45)/.55):0);ctx.restore();if(p>.45&&p<.5){}});
      setTimeout(()=>{const pm=PM(),x=pm.x+pm.w*fx;shake(0,st.ps*2.4);sBurst(x,pm.feet,['#8a7a5a','#c0a878','#5a4a3a'],18,.22,520,.8);ring(x,pm.feet-st.ps,pm.h*.5,'#c8d0dc',0,420,1.6)},t0+dl+405)});
    return t0+1050},
  // 2 Aegis Dome: hex tiles assemble into a dome around the hero
  'shield+shield':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('raise',1700,t0);groundUnder(PM,{r:st.H*.13,c1:'#7fd0ff',c2:'#e8f8ff',delay:t0,dur:1700,seed:6,spin:.6});
    addFx(t0+150,1500,(p,now)=>{const pm=PM(),cells=dfDomeCells(pm);ctx.save();cells.forEach(([x,y,an],i)=>{const k=clamp01(p*1.6-(1-an/3.14)*.25-i/cells.length*.35);if(k<=0)return;const pop=k<.3?ease(k/.3):1;dfHex(x,y,st.ps*2.4*pop,'#9fe2ff',k<.6?'#ffffff':'#7fd0ff',(k<.6?.6:.3)*(p>.85?1-(p-.85)/.15*.4:1))});ctx.restore()});
    setTimeout(()=>{const pm=PM();flash('#9fe2ff',0,.18);ring(pm.x,pm.feet-pm.h*.5,pm.h*.9,'#e8f8ff',0,500,2)},t0+1250);return t0+1350},
  // 3 Perfect Deflect: blade flourish, two deflect sigils spin out
  'parry+parry':R=>{dfEnsure();const c=chor();c.stay(120,{fr:'idle'});c.stay(420,{fr:'slash',spin:1});c.ev(()=>{const pm=PM();ring(pm.x+pm.w*.4,pm.feet-pm.h*.6,pm.h*.45,'#fff6c0',0,300,1.8)});c.stay(420,{fr:'slash',spin:-1});
    c.ev(()=>{const pm=PM();for(let k=0;k<2;k++)addFx(k*120,700,(p,now)=>{const x=pm.x+pm.w*(.4+p*.7*(k?-1:1)),y=pm.feet-pm.h*(.6+p*.1),r=st.ps*4*(1-p*.3);ctx.save();ctx.globalAlpha=1-p*.3;ctx.fillStyle='#fff6c0';const s=dfS();pxTri(x,y-r,x-r*.7,y,x+r*.7,y,s);ctx.fillStyle='#e8b840';pxTri(x,y+r,x-r*.7,y,x+r*.7,y,s);ctx.restore()});
      const sx=pm.x+pm.w*.7,sy=pm.feet-pm.h*.85;addFx(0,500,p=>{ctx.save();ctx.globalAlpha=1-p;const s=dfS(),L=st.ps*7*(1-p*.5);dfR(sx-L,sy-s/2,L*2,s,'#ffffff');dfR(sx-s/2,sy-L,s,L*2,'#ffffff');dfR(sx-s*1.5,sy-s*1.5,s*3,s*3,'#fff6c0');ctx.restore()});flash('#fff6c0',0,.12)});
    c.stay(320,{fr:['shield',0,3]});c.hit(()=>{},0);return runChor(c,R,'#fff6c0')},
  // 4 Mirage: afterimages peel away from the hero
  'dodge+dodge':R=>{dfEnsure();const c=chor();c.stay(120,{fr:'idle'});c.stay(460,{fr:'flip',arc:st.H*.05});c.ev(()=>{const pm=PM();const n=R.mirage||2;
      for(let i=0;i<n;i++)addFx(0,900,(p,now)=>{const off=[-1.25,1.25,-2.3][i]*pm.w*ease(clamp01(p*1.4));dfClone(off,(.6-.25*p)*(Math.random()<.85?1:.3),'#7fe0ff',now);if(Math.random()<.3)spawn(pm.x+off,pm.feet-Math.random()*pm.h,{vy:-.02*U(),color:'#bfefff',size:st.ps*.4,life:300})});
      for(let k=0;k<8;k++)addFx(k*40,260,p=>{ctx.save();ctx.globalAlpha=(1-p)*.5;dfR(pm.x-pm.w*2.5,pm.feet-pm.h*Math.random(),pm.w*5,Math.max(1,st.ps*.4),'#bfefff');ctx.restore()})});
    c.stay(700,{fr:'idle'});c.hit(()=>{},0);return runChor(c,R,'#7fe0ff')},
  // 5 Vengeance: crimson rune circle, rising fury flames and a demon sigil
  'counter+counter':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('raise',1700,t0);groundUnder(PM,{r:st.H*.14,c1:'#ff2a2a',c2:'#ff9a8a',delay:t0,dur:1800,seed:9,spin:-.9,star:5});
    addFx(t0+100,1500,(p,now)=>{const pm=PM(),a=Math.sin(p*Math.PI);dfFlame(pm.x,pm.feet,pm.h*1.1*a,pm.w*1.8,now,['#ffd0a0','#ff3a2a','#c0101a','#4a0610'],.55*a,3);
      ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#ff2a2a';ctx.shadowColor='#ff2a2a';ctx.shadowBlur=st.ps*4;const ey=pm.feet-pm.h*.86;dfR(pm.x+pm.w*.05,ey,st.ps*1.1,st.ps*.8,'#ff4a3a');
      const sy=pm.feet-pm.h*1.45;glyph(pm.x,sy,13,dfS()*1.4);ctx.restore()});
    setTimeout(()=>{const pm=PM();shake(0,st.ps*1.6);flash('#ff2a2a',0,.2);sBurst(pm.x,pm.feet-pm.h*.5,['#ff3a2a','#ffb0a0','#4a0610'],24,.28,520,.8)},t0+900);return t0+1200},
  // 6 Mana Bastion: three crystal ramparts rise and pour mana into the hero
  'block+shield':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('shield',1500,t0);
    [[-.9,.6,0],[1.1,.95,140],[1.7,.75,260]].forEach(([fx,fh,dl])=>addFx(t0+dl,1400,(p,now)=>{const pm=PM(),x=pm.x+pm.w*fx,h=pm.h*fh*ease(clamp01(p*2.4)),s=dfS(),w=st.ps*4;if(h<=0)return;const y=pm.feet;ctx.save();ctx.globalAlpha=p>.8?1-(p-.8)/.2*.6:1;
      ctx.fillStyle='#1a3a70';pxTri(x,y-h-w*1.2,x-w,y-h,x+w,y-h,s);dfR(x-w,y-h,w*2,h,'#2a5ec0');dfR(x-w,y-h,w*.7,h,'#7fc0ff');dfR(x+w*.4,y-h,w*.6,h,'#1a3a80');ctx.fillStyle='#bfe6ff';pxTri(x-w*.2,y-h-w,x-w,y-h,x,y-h,s);
      ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.3*Math.sin(now/90+fx);dfR(x-s/2,y-h,s,h,'#e8f8ff');ctx.restore();
      if(p>.4&&p<.8&&Math.random()<.5){const sx=x,sy=y-h*Math.random();spawn(sx,sy,{vx:(pm.x-sx)/360,vy:(pm.feet-pm.h*.5-sy)/360,color:Math.random()<.5?'#6cb2ff':'#e8f8ff',size:st.ps*.55,life:360})}}));
    setTimeout(()=>{const pm=PM();ring(pm.x,pm.feet-pm.h*.5,pm.h*.7,'#6cb2ff',0,500,2)},t0+1000);return t0+1150},
  // 7 Iron Riposte: crossed sword and iron shield clang together in a spray of sparks
  'block+parry':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('shield',1400,t0);
    addFx(t0,1200,(p,now)=>{const pm=PM(),cx=pm.x+pm.w*1.0,cy=pm.feet-pm.h*.55,k=ease(clamp01(p*2.2)),s=dfS();ctx.save();
      dfSword(cx-st.ps*10*(1-k),cy-st.ps*6*(1-k),-.8,st.ps*12,'#c8d0dc','#ffffff',1);dfSword(cx+st.ps*10*(1-k),cy-st.ps*6*(1-k),-2.35,st.ps*12,'#c8d0dc','#ffffff',1);
      ctx.globalAlpha=k;ctx.fillStyle='#3a3e48';pxDisc(cx,cy+st.ps*1.5,st.ps*4.6,s);ctx.fillStyle='#6f7a8c';pxDisc(cx,cy+st.ps*1.5,st.ps*4,s);ctx.fillStyle='#aab4c4';pxDisc(cx-s,cy+st.ps*.5,st.ps*2.4,s);ctx.fillStyle='#e8b840';pxDisc(cx,cy+st.ps*1.5,st.ps*1.2,s);ctx.restore()});
    setTimeout(()=>{const pm=PM(),cx=pm.x+pm.w*1.0,cy=pm.feet-pm.h*.55;shake(0,st.ps*1.8);flash('#ffffff',0,.18);for(let i=0;i<26;i++){const a=Math.random()*6.283,v=(.1+Math.random()*.25)*U();spawn(cx,cy,{vx:Math.cos(a)*v,vy:Math.sin(a)*v-.05*U(),g:.0008*U(),color:Math.random()<.5?'#fff2b0':'#ffb347',size:st.ps*.45,life:420})}ring(cx,cy,pm.h*.4,'#ffffff',0,300,2)},t0+560);return t0+900},
  // 8 Tumble Guard: backward and forward rolls in a cloud of dust
  'block+dodge':R=>{dfEnsure();const c=chor(),pm=c.pm,dust=()=>{const p2=PMx();sBurst(p2.x,p2.feet,['#c0a878','#8a7a5a','#e8dcc0'],10,.12,420,.7)};c.stay(80,{fr:'idle'});
    c.go(c.H-pm.w*1.6,0,380,{fr:'roll',fl:true});c.ev(dust,180);c.stay(120,{fr:['shield',0,3],fl:false});c.go(c.H,0,380,{fr:'roll',fl:false});c.ev(dust,180);
    c.ev(()=>{const p2=PMx();addFx(0,700,(p,now)=>{ctx.save();ctx.globalAlpha=(1-p)*.8;const s=dfS();ctx.fillStyle='#7fe0a0';pxDisc(p2.x+p2.w*.6,p2.feet-p2.h*.5,st.ps*4*(1+p*.3),s);ctx.fillStyle='#d8ffe0';pxDisc(p2.x+p2.w*.5,p2.feet-p2.h*.55,st.ps*2,s);ctx.restore()});ring(p2.x,p2.feet-p2.h*.4,p2.h*.6,'#bff5d8',0,420,1.6)});
    c.stay(420,{fr:['shield',0,3]});c.hit(()=>{},0);return runChor(c,R,'#bff5d8')},
  // 9 Spike Wall: rows of iron spikes erupt from the ground
  'block+counter':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('kick',700,t0);
    addFx(t0+260,1100,(p,now)=>{const pm=PM();dfSpikes(pm.x+pm.w*.9,pm.feet,5,st.ps*3,pm.h*.38,p*1.4,p>.85?1-(p-.85)/.15*.3:1,now);dfSpikes(pm.x+pm.w*1.05,pm.feet,4,st.ps*3,pm.h*.26,p*1.4-.15,.8,now)});
    [0,90,180,270,360].forEach((d,i)=>setTimeout(()=>{const pm=PM(),x=pm.x+pm.w*.9+i*st.ps*3;sBurst(x,pm.feet,['#5a4a3a','#8a7a5a','#c8d0dc'],8,.18,380,.7);if(i%2===0)shake(0,st.ps*1.2)},t0+260+d));return t0+900},
  // 10 Phase Veil: violet glitch slices and expanding phase rings
  'dodge+shield':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('raise',1500,t0);
    for(let k=0;k<3;k++)setTimeout(()=>{const pm=PM();ring(pm.x,pm.feet-pm.h*.5,pm.h*(.6+k*.15),k%2?'#d8c4ff':'#8a5ae0',0,520,1.8)},t0+200+k*220);
    addFx(t0+100,1300,(p,now)=>{const pm=PM(),s=dfS();ctx.save();for(let i=0;i<9;i++){const y=pm.feet-pm.h*(.05+i*.12),off=(Math.random()-.5)*st.ps*5*Math.sin(p*Math.PI);ctx.globalAlpha=.55*Math.sin(p*Math.PI);dfR(pm.x-pm.w*.8+off,y,pm.w*1.6,Math.max(1,s*.7),i%2?'#d8c4ff':'#6a3ac0')}ctx.restore()});
    setTimeout(()=>{const pm=PM();flash('#8a5ae0',0,.16);sBurst(pm.x,pm.feet-pm.h*.5,['#b18bff','#e4d4ff','#4a2a80'],20,.22,520,.6)},t0+800);return t0+1100},
  // 11 Retribution Aegis: golden motes converge into a rune shield
  'counter+shield':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('raise',1600,t0);
    addFx(t0,1500,(p,now)=>{const pm=PM(),cx=pm.x+pm.w*1.05,cy=pm.feet-pm.h*.55,k=ease(clamp01((p-.25)/.5));ctx.save();
      if(p<.6)for(let i=0;i<18;i++){const an=i/18*6.283+now/500,r=pm.h*(.9-p*1.3);if(r>0)dfR(cx+Math.cos(an)*r,cy+Math.sin(an)*r*.7,st.ps*.8,st.ps*.8,i%2?'#ffd36b':'#fff6c8')}
      if(k>0)dfSigil(cx,cy,pm.h*.3*k,now,'#ffd36b','#fff6c8',k*(p>.85?1-(p-.85)/.15*.4:1));ctx.restore()});
    setTimeout(()=>{const pm=PM();flash('#ffd36b',0,.16);ring(pm.x+pm.w*1.05,pm.feet-pm.h*.55,pm.h*.4,'#fff6c8',0,500,2)},t0+900);return t0+1150},
  // 12 Mirror Guard: a silver mirror pane rises and catches the light
  'parry+shield':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('shield',1500,t0);
    addFx(t0+150,1250,(p,now)=>{const pm=PM(),k=ease(clamp01(p*1.8)),h=pm.h*1.05*k;if(h<=2)return;dfMirrorPane(pm.x+pm.w*1.3,pm.feet,h,st.ps*9,1,0,now);if(p<.55&&Math.random()<.5)spawn(pm.x+pm.w*1.3+(Math.random()-.5)*st.ps*9,pm.feet,{vy:-.05*U(),color:'#e8f6ff',size:st.ps*.4,life:300})});
    setTimeout(()=>{const pm=PM(),x=pm.x+pm.w*1.3,y=pm.feet-pm.h*.7;addFx(0,450,p=>{ctx.save();ctx.globalAlpha=1-p;const L=st.ps*9*(1-p*.4),s=dfS();dfR(x-L,y-s/2,L*2,s,'#ffffff');dfR(x-s/2,y-L,s,L*2,'#ffffff');ctx.restore()});flash('#e8f6ff',0,.15)},t0+900);return t0+1100},
  // 13 Shadow Step: the hero sinks into a pool of shadow and rises again
  'dodge+parry':R=>{dfEnsure();const c=chor(),pm=c.pm;c.stay(120,{fr:'idle'});c.ev(()=>{addFx(0,1500,(p,now)=>{const p2=PMx(),s=dfS(),w=p2.w*1.4*Math.sin(Math.min(1,p*1.6)*Math.PI*.5)*(p>.8?1-(p-.8)/.2*.5:1);ctx.save();ctx.globalAlpha=.85;ctx.fillStyle='#1a0f2a';ctx.beginPath();ctx.ellipse(p2.x,p2.feet,w,st.ps*1.6,0,0,6.283);ctx.fill();ctx.fillStyle='#4a2a80';dotRing(p2.x,p2.feet,w,st.ps*1.6,s,now/300,3);ctx.restore();if(Math.random()<.6)spawn(p2.x+(Math.random()-.5)*w*2,p2.feet,{vy:-.04*U(),color:Math.random()<.5?'#6a4aa0':'#1a0f2a',size:st.ps*.7,life:500})})});
    c.go(c.H,st.H*.1,380,{fr:['shield',0,3],e:'in'});c.stay(380,{hide:true});c.ev(()=>{const p2=PMx();sBurst(p2.x,p2.feet-p2.h*.4,['#1a0f2a','#6a4aa0','#c06cff'],22,.24,520,.8)});c.go(c.H,0,420,{fr:'idle',e:'out'});c.stay(240,{fr:'idle'});c.hit(()=>{},0);return runChor(c,R,'#6a4aa0')},
  // 14 Riposte Storm: three spectral swords materialise and begin to orbit
  'counter+parry':(R,ch)=>{dfEnsure();const t0=ch-450;dfCast('raise',1500,t0);
    addFx(t0+100,1350,(p,now)=>{const pm=PM();for(let i=0;i<3;i++){const k=clamp01(p*2.2-i*.25);if(k<=0)continue;const an=now/500+i/3*6.283,r=pm.w*(1.2+(1-ease(k))*2),x=pm.x+Math.cos(an)*r,y=pm.feet-pm.h*.55+Math.sin(an)*pm.h*.32-(1-ease(k))*pm.h*.6;dfSword(x,y,an+1.57,st.ps*8,'#bfe9ff','#ffffff',k);if(k<1&&Math.random()<.4)spawn(x,y,{color:'#bfe9ff',size:st.ps*.4,life:260})}});
    [0,1,2].forEach(i=>setTimeout(()=>{const pm=PM();ring(pm.x,pm.feet-pm.h*.55,pm.h*.35,'#bfe9ff',0,300,1.4)},t0+400+i*230));return t0+1150},
  // 15 Wind Dancer: a spinning dance wrapped in ribbons of wind and leaves
  'counter+dodge':R=>{dfEnsure();const c=chor();c.stay(100,{fr:'idle'});c.ev(()=>{addFx(0,1500,(p,now)=>{const p2=PMx(),s=dfS(),a=Math.sin(p*Math.PI);ctx.save();for(let k=0;k<3;k++){ctx.globalAlpha=.7*a;ctx.fillStyle=k===1?'#d8ffb0':'#7fe0a0';for(let i=0;i<26;i++){const an=now/160+i*.24+k*2.1,r=p2.w*(.7+k*.25),y=p2.feet-p2.h*(.05+i/26*.95)+Math.sin(an)*st.ps;dfR(p2.x+Math.cos(an)*r,y,s,s,ctx.fillStyle)}}ctx.restore();if(Math.random()<.5)spawn(p2.x+(Math.random()-.5)*p2.w*2,p2.feet-Math.random()*p2.h,{vx:(Math.random()-.5)*.08*U(),vy:-.06*U(),color:Math.random()<.5?'#59c98a':'#d8ffb0',size:st.ps*.6,life:520})})});
    c.stay(520,{fr:'spinkick',spin:1,arc:st.H*.06});c.stay(520,{fr:'spinkick',spin:1});c.stay(240,{fr:'idle'});c.hit(()=>{},0);return runChor(c,R,'#7fe0a0')}
  });
  // ---- hit reactions while a guard is active
  function defFx(kind,delay){setTimeout(()=>{if(!dfOn())return;const pm=PM(),m=EM();dfEnsure();
    if(kind==='mirageHit'){const off=(Math.random()<.5?-1.25:1.25)*pm.w;sBurst(pm.x+off,pm.feet-pm.h*.5,['#7fe0ff','#ffffff','#2a8ab0'],22,.26,420,.7);for(let k=0;k<6;k++)addFx(k*30,200,p=>{ctx.save();ctx.globalAlpha=1-p;dfR(pm.x+off-pm.w,pm.feet-pm.h*Math.random(),pm.w*2,Math.max(1,st.ps*.5),'#bfefff');ctx.restore()})}
    else if(kind==='mirrorHit'){addFx(0,600,(p,now)=>dfMirrorPane(pm.x+pm.w*1.3,pm.feet,pm.h*1.05,st.ps*9,1-p,Math.min(1,p*3),now));if(m){const sx=pm.x+pm.w*1.3,sy=pm.feet-pm.h*.6;addFx(120,380,p=>{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-p;const ex=sx+(m.x-sx)*Math.min(1,p*2.2);dfR(sx,sy-st.ps,ex-sx,st.ps*2,'#e8f6ff');dfR(sx,sy-st.ps*.4,ex-sx,st.ps*.8,'#ffffff');ctx.restore()})}flash('#e8f6ff',0,.2)}
    else if(kind==='deflectHit'){const x=pm.x+pm.w*.6,y=pm.feet-pm.h*.6;for(let i=0;i<16;i++){const a=Math.random()*6.283;spawn(x,y,{vx:Math.cos(a)*.22*U(),vy:Math.sin(a)*.22*U(),color:i%2?'#fff6c0':'#ffffff',size:st.ps*.45,life:300})}addFx(0,300,p=>{ctx.save();ctx.globalAlpha=1-p;const L=st.ps*8*(1-p*.3),s=dfS();dfR(x-L,y-s/2,L*2,s,'#ffffff');dfR(x-s/2,y-L,s,L*2,'#ffffff');ctx.restore()})}
    else if(kind==='shadowHit'&&m){blinkFx&&blinkFx(pm.x,0,'#6a4aa0');sBurst(m.x+m.w*.6,m.feet-m.h*.5,['#1a0f2a','#6a4aa0','#c06cff'],18,.24,420,.8);addFx(220,280,p=>{ctx.save();ctx.globalAlpha=1-p;ctx.strokeStyle='#c06cff';ctx.lineWidth=st.ps*1.2;ctx.beginPath();ctx.moveTo(m.x+m.w,m.feet-m.h*.9);ctx.lineTo(m.x-m.w*.6,m.feet-m.h*.15);ctx.stroke();ctx.restore()})}
    else if(kind==='danceHit'&&m){st.player.anim={name:'spinkick',t0:now_(),dur:420};const sx=pm.x+pm.w*.6,sy=pm.feet-pm.h*.55;addFx(160,360,p=>{ctx.save();const x=sx+(m.x-sx)*p,s=dfS();ctx.globalAlpha=1-p*.5;for(let i=-4;i<=4;i++)dfR(x+Math.abs(i)*s*.6,sy+i*s*1.2,s*1.4,s,i%2?'#d8ffb0':'#7fe0a0');ctx.restore()})}
    else if(kind==='stormHit'&&m){for(let k=0;k<3;k++){const an=k/3*6.283,sx=pm.x+Math.cos(an)*pm.w*1.2,sy=pm.feet-pm.h*.55+Math.sin(an)*pm.h*.3;addFx(k*170,260,p=>{const x=sx+(m.x-sx)*ease(p),y=sy+(m.feet-m.h*.5-sy)*ease(p);dfSword(x,y,Math.atan2(m.feet-m.h*.5-sy,m.x-sx),st.ps*8,'#bfe9ff','#ffffff',1)})}}
    else if(kind==='spikeHit'&&m){const x=pm.x+pm.w*1.1;for(let i=0;i<10;i++)spawn(x,pm.feet-pm.h*.3,{vx:(.05+Math.random()*.15)*U(),vy:-(Math.random()*.1)*U(),g:.0006*U(),color:'#c8d0dc',size:st.ps*.45,life:320})}
    else if(kind==='ironHit'){const cx=pm.x+pm.w*1.0,cy=pm.feet-pm.h*.55;for(let i=0;i<18;i++){const a=Math.random()*6.283;spawn(cx,cy,{vx:Math.cos(a)*.22*U(),vy:Math.sin(a)*.22*U(),color:Math.random()<.5?'#fff2b0':'#ffb347',size:st.ps*.45,life:340})}ring(cx,cy,pm.h*.35,'#ffffff',0,280,2);shake(0,st.ps*1.4)}
    else if(kind==='vengeHit'&&m){const sx=pm.x+pm.w*.5,sy=pm.feet-pm.h*.55;addFx(100,300,p=>{ctx.save();ctx.globalAlpha=1-p;ctx.strokeStyle='#ff2a2a';ctx.lineWidth=st.ps*1.4;ctx.beginPath();const x=sx+(m.x-sx)*Math.min(1,p*1.6);ctx.moveTo(sx,sy);ctx.lineTo(x,m.feet-m.h*.5);ctx.stroke();ctx.restore()});sBurst(m.x,m.feet-m.h*.5,['#ff2a2a','#4a0610','#ffb0a0'],14,.24,380,.7)}
    else if(kind==='argentHit'&&m){const sx=pm.x+pm.w*.6,sy=pm.feet-pm.h*.55;ring(sx,sy,pm.h*.5,'#e8eef6',0,320,2.2);addFx(120,320,p=>{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-p;const ex=sx+(m.x-sx)*Math.min(1,p*2);ctx.fillStyle='#e8f4ff';ctx.fillRect(Math.round(sx),Math.round(sy-st.ps),Math.round(ex-sx),st.ps*2);ctx.restore()});sBurst(m.x,m.feet-m.h*.5,['#ffffff','#c8d0dc','#9fd0ff'],14,.25,380,.6)}
    else if(kind==='retriBlast'){const cx=pm.x+pm.w*1.05,cy=pm.feet-pm.h*.55;flash('#ffd36b',0,.35);shake(0,st.ps*3);ring(cx,cy,pm.h*.6,'#fff6c8',0,500,3);
      addFx(0,700,p=>{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-p;const r=st.W*p*.9,s=dfS();ctx.fillStyle='#ffd36b';dotRing(cx,cy,r,r*.35,s*1.4,0,0);ctx.fillStyle='#fff6c8';dotRing(cx,cy,r*.9,r*.3,s,0,2);ctx.restore()});
      st.foes.forEach(f=>{if(f.gone||f.state==='die')return;const mm=enemyMetricsOf(f);addFx(220,600,p=>{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.sin(p*Math.PI);const w=mm.w*.6*(1-p*.5);dfR(mm.x-w/2,0,w,mm.feet,'#ffd36b');dfR(mm.x-w/5,0,w*.4,mm.feet,'#fff6c8');ctx.restore()});sBurst(mm.x,mm.feet-mm.h*.5,['#ffd36b','#fff6c8'],16,.26,420,.7)})}
  },delay||0)}
  window.__defFx=defFx;
