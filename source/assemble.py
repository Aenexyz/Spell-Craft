import re
src=open('fusebound.src.v6.html').read()
head=src[:src.index('<div id="app">')]
body_skel=src[src.index('<div id="app">'):src.index('<script>')]
lines=src.split('\n')
def grab(start,end):
  i=src.index(start);j=src.index(end,i);return src[i:j]
sprites=grab('const PLAYER_TOP=[','const ITEM_ATLAS=')
atlas=re.search(r'const ITEM_ATLAS=.*?;\n',src).group(0).replace('"rows": 5','"rows": 6').replace('"purple_potion": 35}}','"purple_potion": 35, "starter_sword": 36, "ember_staff": 37, "frost_wand": 38, "archmage_staff": 39, "phoenix_amulet": 40}}')
hero=re.search(r'const HERO=\{.*?\};\n',src,re.S).group(0)
sprites=sprites.replace(hero,'const HERO='+open('hero2.json').read()+';\n');assert 'fslash' in sprites
stage=grab('const Stage=(()=>{','/* ================= fusion')
def R(old,new,cnt=1):
  global stage
  assert stage.count(old)==cnt,(old[:80],stage.count(old));stage=stage.replace(old,new)
R("player:{act:null,anim:null,dead:false,flash:0,flashColor:'#ff4b4b'},enemy:null,drop:null,","player:{act:null,anim:null,dead:false,flash:0,flashColor:'#ff4b4b'},enemy:null,drop:null,shake:null,flash:null,")
R("      const x0=-hf.f.ax*k,y0=-fh;","      const x0=-hf.f.ax*k,y0=-(hf.f.fy||hf.c.height)*k;")
R("    const pick=(n,i,pose,p)=>({c:heroCanv[n][i],f:HERO[n][i],key:n+i,pose,p});","    const pick=(n,i,pose,p)=>({c:heroCanv[n][i],f:HERO[n][i],key:n+i,pose,p,n});")
R("      const rim=tintC(hf.key,hf.c,'#fff4d6'),o=Math.max(1,H*.0035);","""      const wpn=S&&S.gear&&S.gear.weapon,wmode=((P.holdFrame&&now<P.holdFrame.until)||(P.seq&&now<P.seq.until)||(P.backUntil&&now<P.backUntil)||hf.n==='beam'||hf.n==='laser')?'back':P.act?(P.act.segs?(()=>{const t=now-P.act.t0;let w=P.act.segs[0].weapon;P.act.segs.forEach(o=>{if(t>=o.s-40)w=o.weapon});return w})():(P.act.weapon||'hand')):(hf.n==='shield'?'back':'hand');
      if(wpn&&wmode==='back'&&itemsImg.complete&&itemsImg.naturalWidth&&!P.dead){
        const wi=ITEM_ATLAS.idx[wpn.key],wc=ITEM_ATLAS.cols,L=44*k,sz=L*64/58;
        if(wpn.key==='hunter_bow'){const bsz=58*.8*k*64/58;ctx.save();ctx.imageSmoothingEnabled=true;ctx.translate(x0+(hf.f.ax-7)*k,y0+(hf.f.fy||hf.c.height)*k*.4);ctx.rotate(-.25);ctx.drawImage(itemsImg,(wi%wc)*64,Math.floor(wi/wc)*64,64,64,-bsz/2,-bsz/2,bsz,bsz);ctx.restore()}else{ctx.save();ctx.imageSmoothingEnabled=true;ctx.translate(x0+(hf.f.ax-3)*k,y0+(hf.f.fy||hf.c.height)*k*.17);ctx.rotate(3.95+(wpn.key==='starter_sword'?0:-.4));ctx.drawImage(itemsImg,(wi%wc)*64,Math.floor(wi/wc)*64,64,64,-sz/2,-sz*.8,sz,sz);ctx.restore();}
      }
      const rim=tintC(hf.key,hf.c,'#fff4d6'),o=Math.max(1,H*.0035);""")
R("      ctx.drawImage(hf.c,x0,y0,fw,fh);\n","""      ctx.drawImage(hf.c,x0,y0,fw,fh);
      if(hf.f.hx!=null)P.handPt={x:px+ox+(hf.f.hx-hf.f.ax)*k,y:feet+oy+(hf.f.hy-(hf.f.fy||hf.c.height))*k};
      const shd=S&&S.gear&&S.gear.shield;
      if(hf.n==='shield'&&hf.f.sh&&shd&&itemsImg.complete&&itemsImg.naturalWidth){const si=ITEM_ATLAS.idx[shd.key],sc2=ITEM_ATLAS.cols,ssz=hf.f.sh[2]*1.25*k*64/58;ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(itemsImg,(si%sc2)*64,Math.floor(si/sc2)*64,64,64,x0+hf.f.sh[0]*k-ssz/2,y0+hf.f.sh[1]*k-ssz/2,ssz,ssz);ctx.restore()}
      if(wpn&&wmode==='hand'&&itemsImg.complete&&itemsImg.naturalWidth&&hf.f.hx!=null&&(hf.n==='idle'||hf.n==='walk'||hf.n==='punch')&&!P.dead){
        const wi=ITEM_ATLAS.idx[wpn.key],wc=ITEM_ATLAS.cols,L=44*k,sz=L*64/58;
        if(wpn.key==='hunter_bow'){const bsz=62*.8*k*64/58,aim=P.aimUntil&&now<P.aimUntil;ctx.save();ctx.imageSmoothingEnabled=true;if(aim)ctx.translate(H*.045,-H*.1375);else ctx.translate(x0+hf.f.hx*k+3*k,y0+hf.f.hy*k-2*k);ctx.scale(-1,1);ctx.drawImage(itemsImg,(wi%wc)*64,Math.floor(wi/wc)*64,64,64,-bsz/2,-bsz/2,bsz,bsz);ctx.restore()}
        else{const WC={starter_sword:-.314,steel_sword:-.316,frost_blade:-.35,dagger:-.234,battle_axe:-.194,war_spear:-.237},th=(hf.n==='punch'?Math.PI/2:hf.n==='walk'?2.3:0)+(WC[wpn.key]??-.3);
        ctx.save();ctx.imageSmoothingEnabled=true;ctx.translate(x0+hf.f.hx*k,y0+hf.f.hy*k);ctx.rotate(th);ctx.drawImage(itemsImg,(wi%wc)*64,Math.floor(wi/wc)*64,64,64,-sz/2,-sz*.8,sz,sz);ctx.restore()}
      }
""")
R("    if(P.act){const p=(now-P.act.t0)/P.act.dur;\n      if(p<.3)return pick(","""    if(P.act&&P.act.multi){const t=now-P.act.t0;
      if(t<0)return pick('idle',Math.floor(now/180)%HERO.idle.length);
      if(t<250)return pick('walk',Math.floor(t/55)%HERO.walk.length);
      const sg=P.act.segs.find(o=>t>=o.s&&t<o.e);
      if(sg){const a=HERO[sg.anim]?sg.anim:'punch',n=HERO[a].length;return pick(a,Math.min(n-1,Math.floor((t-sg.s)/(sg.e-sg.s)*n)))}
      return pick('idle',0)}
    if(P.act){const p=(now-P.act.t0)/P.act.dur;\n      if(p<.3)return pick(""")
R("      if(p>=1)P.act=null;else pdx=p<.3?dist*ease(p/.3):p<.72?dist:dist*(1-ease((p-.72)/.28))}","      if(p>=1)P.act=null;else if(P.act.multi){const t=now-P.act.t0,le=P.act.segs[P.act.segs.length-1].e;pdx=t<250?dist*ease(t/250):t<le?dist:dist*(1-ease(Math.min(1,(t-le)/260)))}else pdx=p<.3?dist*ease(p/.3):p<.72?dist:dist*(1-ease((p-.72)/.28))}")
R("      if(p>=1)P.act=null;else if(P.act.multi)","      if(p<0)pdx=0;else if(p>=1)P.act=null;else if(P.act.multi)")
R("    if(P.act){const p=(now-P.act.t0)/P.act.dur;\n      if(p<.3)return pick(","    if(P.act){const p=(now-P.act.t0)/P.act.dur;\n      if(p<0)return pick('idle',Math.floor(now/180)%HERO.idle.length);\n      if(p<.3)return pick(")
R("    const hf=heroFrame(now,walking);\n","""    const guardAura=S&&S.phase==='battle'&&S.guarding&&S.guardEls&&S.guardEls.length;
    const au=P.aura||(guardAura?{els:S.guardEls,persist:true}:null);
    if(au){const t=au.persist?1e9:now-au.t0;
      if(!au.persist&&t>au.dur)P.aura=null;
      else{const cx=px,cy=feet-H*.13,a=au.persist?1:Math.min(1,t/160)*(guardAura?1:(t>au.dur-160?Math.max(0,(au.dur-t)/160):1));
        (au.els||[]).forEach((el,ei)=>{const col=hexOf(el);
          ctx.save();ctx.globalAlpha=.45*a/(au.els.length>1?1.3:1);const gr=ctx.createRadialGradient(cx,cy,H*.02,cx,cy,H*.21);gr.addColorStop(0,col+'cc');gr.addColorStop(1,col+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(cx,cy,H*.21,0,6.283);ctx.fill();ctx.restore();
          ctx.save();ctx.globalAlpha=a;const ph=ei*Math.PI;
          if(el==='lightning'){ctx.strokeStyle='#fff6b0';ctx.shadowColor=col;ctx.shadowBlur=st.ps*3;ctx.lineWidth=Math.max(1.5,st.ps*.45);ctx.lineJoin='round';
            for(let b=0;b<3;b++){let ang=Math.random()*6.283,r0=H*.05,x=cx+Math.cos(ang)*r0,y=cy+Math.sin(ang)*r0*1.7;ctx.beginPath();ctx.moveTo(x,y);for(let s=0;s<4;s++){ang+=(Math.random()-.5)*1.1;r0+=H*.028;x=cx+Math.cos(ang)*r0;y=cy+Math.sin(ang)*r0*1.7;ctx.lineTo(x,y)}ctx.stroke()}
            if(Math.random()<dt/35)spawn(cx+(Math.random()-.5)*H*.16,cy+(Math.random()-.5)*H*.26,{color:Math.random()<.5?'#fff6b0':col,size:st.ps*.5,life:220})}
          else if(el==='water'){for(let i=0;i<12;i++){const ang=now/230+i*.5236+ph,x=cx+Math.cos(ang)*H*.12,y=cy+Math.sin(ang)*H*.06+Math.sin(now/180+i)*H*.025-(i%3)*H*.035;ctx.fillStyle=i%2?'#9fd8ff':col;ctx.beginPath();ctx.arc(x,y,st.ps*(.5+(i%3)*.25),0,6.283);ctx.fill()}
            ctx.strokeStyle='#9fd8ff';ctx.lineWidth=Math.max(1.5,st.ps*.4);ctx.beginPath();ctx.ellipse(cx,feet-st.ps,H*.09,H*.018,0,0,6.283);ctx.stroke();
            if(Math.random()<dt/45)spawn(cx+(Math.random()-.5)*H*.14,feet-Math.random()*H*.1,{vy:-.07*U(),color:'#9fd8ff',size:st.ps*.6,life:600,shape:'circ'})}
          else if(el==='fire'){ctx.globalAlpha=a*(.6+.4*Math.sin(now/60));ctx.fillStyle='#ff7b3a';ctx.beginPath();ctx.ellipse(cx,feet-st.ps,H*.08,H*.02,0,0,6.283);ctx.fill();
            if(Math.random()<dt/14)spawn(cx+(Math.random()-.5)*H*.12,feet-Math.random()*H*.06,{vy:-(.08+Math.random()*.08)*U(),vx:(Math.random()-.5)*.02*U(),color:['#ff7b3a','#ffd84a','#ff4b2b'][Math.floor(Math.random()*3)],size:st.ps*(.8+Math.random()*.8),life:600,shape:'circ'})}
          else if(el==='ice'){ctx.fillStyle='#dff4ff';for(let i=0;i<8;i++){const ang=-now/400+i*.785+ph,x=cx+Math.cos(ang)*H*.13,y=cy+Math.sin(ang)*H*.08;const sz=st.ps*1.1;ctx.save();ctx.translate(x,y);ctx.rotate(ang+now/300);ctx.beginPath();ctx.moveTo(0,-sz*1.4);ctx.lineTo(sz*.6,0);ctx.lineTo(0,sz*1.4);ctx.lineTo(-sz*.6,0);ctx.closePath();ctx.fill();ctx.restore()}
            ctx.globalAlpha=a*.5;ctx.strokeStyle='#dff4ff';ctx.lineWidth=Math.max(1.5,st.ps*.35);ctx.beginPath();ctx.ellipse(cx,feet-st.ps,H*.1,H*.02,0,0,6.283);ctx.stroke();
            if(Math.random()<dt/60)spawn(cx+(Math.random()-.5)*H*.16,cy+(Math.random()-.5)*H*.2,{vy:.02*U(),color:'#ffffff',size:st.ps*.45,life:500})}
          else if(el==='earth'){for(let i=0;i<7;i++){const ang=now/500+i*.898+ph,x=cx+Math.cos(ang)*H*.12,y=feet-H*.03-((now/6+i*40)%(H*.22))*.6;ctx.fillStyle=i%2?'#c09461':'#8a5a2b';const sz=st.ps*(1+(i%3)*.4);ctx.fillRect(x-sz/2,y-sz/2,sz,sz)}
            ctx.strokeStyle='#6b4a2a';ctx.lineWidth=Math.max(1.5,st.ps*.45);ctx.beginPath();for(let k2=0;k2<5;k2++){const x0c=cx-H*.1+k2*H*.05;ctx.moveTo(x0c,feet);ctx.lineTo(x0c+st.ps*(Math.random()-.5)*2,feet-st.ps*1.2)}ctx.stroke()}
          else if(el==='wind'){ctx.strokeStyle='#e8fff4';ctx.lineWidth=Math.max(1.5,st.ps*.5);ctx.lineCap='round';for(let i=0;i<3;i++){const ang=now/140+i*2.094+ph,ry=cy-H*.06+i*H*.06;ctx.beginPath();ctx.ellipse(cx,ry,H*.12-i*H*.015,H*.03,0,ang,ang+2.2);ctx.stroke()}
            if(Math.random()<dt/40)spawn(cx+H*.12,cy+(Math.random()-.5)*H*.2,{vx:-.18*U(),color:'#e8fff4',size:st.ps*.45,life:300})}
          else if(el==='dark'){for(let i=0;i<10;i++){const pp=((now/700+i/10)%1),ang=i*.628+ph+now/900,r=H*.2*(1-pp);ctx.globalAlpha=a*pp;ctx.fillStyle=i%2?'#b18bff':'#5b2a9a';ctx.beginPath();ctx.arc(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r*1.2,st.ps*(.6+pp*.6),0,6.283);ctx.fill()}}
          else if(el==='light'){const w=H*.05*(1+.2*Math.sin(now/120));const lg=ctx.createLinearGradient(cx-w,0,cx+w,0);lg.addColorStop(0,'#fff0b300');lg.addColorStop(.5,'#fff0b399');lg.addColorStop(1,'#fff0b300');ctx.globalAlpha=a*.8;ctx.fillStyle=lg;ctx.fillRect(cx-w,0,w*2,feet);
            if(Math.random()<dt/30)spawn(cx+(Math.random()-.5)*H*.14,cy+(Math.random()-.5)*H*.24,{vy:-.05*U(),color:Math.random()<.5?'#ffffff':'#ffd84a',size:st.ps*.55,life:500,shape:'plus'})}
          ctx.restore();
        });
      }
    }
    const hf=heroFrame(now,walking);
""")
R("P.anim={name:blocked?'block':'hurt',t0:performance.now(),dur:blocked?450:380}","P.anim={name:blocked?'shield':'hurt',t0:performance.now(),dur:blocked?520:380}")
R("    if(S&&S.phase==='win')return pick('idle',Math.floor(now/180)%HERO.idle.length,'celebrate',(now%900)/900);\n","    if(S&&S.phase==='win')return pick('idle',Math.floor(now/180)%HERO.idle.length,'celebrate',(now%900)/900);\n    if(S&&S.guarding&&S.phase==='battle'&&HERO.shield)return pick('shield',0);\n")
R("          if(g&&g.curse)draw(tintC(mf.key,mf.c,'#8a4dff'),.25*alpha);","          if(g&&g.curse)draw(tintC(mf.key,mf.c,'#8a4dff'),.25*alpha);\n          if(g&&g.blind){draw(tintC(mf.key,mf.c,'#d8dde3'),.3*alpha);if(Math.random()<dt/90)spawn(ex+(Math.random()-.5)*m0.w,feet-m0.h*(.5+Math.random()*.5),{vy:-.03*U(),vx:(Math.random()-.5)*.02*U(),color:'#eef2f6',size:st.ps*(1.6+Math.random()),life:900,shape:'puff'})}")
R("          ctx.fillStyle='#e8574d';ctx.fillRect(bx,by,bw*Math.max(0,g.hp)/g.max,bh);","          ctx.fillStyle='#e8574d';ctx.fillRect(bx,by,bw*Math.max(0,g.hp)/g.max,bh);\n          hpText(`${Math.max(0,g.hp)}/${g.max}`,bx+bw+st.ps*1.2,by+bh/2);")
R("      ctx.fillStyle='#62d394';ctx.fillRect(bx,by,bw*S.hp/S.maxHp,bh);","      ctx.fillStyle='#62d394';ctx.fillRect(bx,by,bw*S.hp/S.maxHp,bh);\n      hpText(`${Math.max(0,S.hp)}/${S.maxHp}`,bx+bw+st.ps*1.2,by+bh/2);")
R("  function tintC(key,c,color){","  function hpText(t,x,y){const fs=Math.max(11,st.H*.036);ctx.save();ctx.font=`700 ${fs}px 'Barlow Condensed','Arial Narrow',sans-serif`;const tw=ctx.measureText(t).width;if(x+tw>st.W-st.ps*1.5)x=st.W-st.ps*1.5-tw;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';ctx.lineWidth=fs*.22;ctx.strokeStyle='#0d1618';ctx.strokeText(t,x,y);ctx.fillStyle='#ece6d6';ctx.fillText(t,x,y);ctx.restore()}\n  function tintC(key,c,color){")
R("          const bw=Math.max(W*.11,bw0*1.1),bh=Math.max(5,st.ps*.9),bx=ex-bw/2,by=top-st.ps*3.5;","          const bw=W*.09,bh=Math.max(5,st.ps*.9),by=top-st.ps*3.5,fsz0=Math.max(11,H*.036),bx=Math.min(ex-bw/2,W-bw-fsz0*3.6);")
R("      if(p<0)return pick('idle',Math.floor(now/180)%HERO.idle.length);\n","      if(p<0)return pick('idle',Math.floor(now/180)%HERO.idle.length);\n      if(P.act.kind==='shield'&&HERO.shield){if(p<.3)return pick('shield',Math.floor((now-P.act.t0)/90)%2?2:3);if(p<.72)return pick('shield',p<.42?3:4);return pick('shield',0)}\n")
R("    let a=P.anim;\n","    if(P.seq&&now<P.seq.until&&HERO[P.seq.n]){const el=now-P.seq.t0;let ii=0;P.seq.times.forEach((tt,q)=>{if(el>=tt)ii=q});return pick(P.seq.n,Math.min(HERO[P.seq.n].length-1,P.seq.idx?P.seq.idx[ii]:ii))}\n    if(P.holdFrame&&now<P.holdFrame.until&&HERO[P.holdFrame.n])return pick(P.holdFrame.n,Math.min(HERO[P.holdFrame.n].length-1,P.holdFrame.i));\n    let a=P.anim;\n")
R("          ctx.globalAlpha=1;top=feet-34*mps;","""          ctx.globalAlpha=1;
          {const fa=e.freezeAnim,frz=g&&g.frozen;if((fa||frz)&&iceImg.complete&&iceImg.naturalWidth){let fi=7;if(fa){const tt=now-fa.t0;fi=tt<0?-1:Math.min(7,Math.floor(tt/fa.dur*8));if(tt>fa.dur+250&&!frz)e.freezeAnim=null}
            if(fi>=0){const iw=Math.max(m0.w*2.3,m0.h*1.75*128/123),ih=iw*123/128;ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalAlpha=.86*alpha;ctx.drawImage(iceImg,fi*128,0,128,123,ex-iw/2,feet-ih+ih*.06,iw,ih);ctx.restore();ctx.imageSmoothingEnabled=false}}}
          top=feet-34*mps;""")
R("  function frame(now){\n","  function frame(now){\n    now=performance.now();\n")
R("const W=st.W,H=st.H;ctx.clearRect(0,0,W,H);ctx.imageSmoothingEnabled=false;","const W=st.W,H=st.H;ctx.clearRect(0,0,W,H);ctx.imageSmoothingEnabled=false;\n    ctx.save();if(st.shake){const sp=(now-st.shake.t0)/st.shake.dur;if(sp>=1)st.shake=null;else ctx.translate((Math.random()-.5)*st.shake.mag*(1-sp),(Math.random()-.5)*st.shake.mag*(1-sp))}")
R("if(wk.next.k==='v'){st.campTarget=1;st.prop=PROP_OF[wk.next.id]}","if(wk.next&&!wk.next.fight){st.campTarget=1;st.prop=wk.next.prop||null}")
R("if(next.k==='e')st.enemy={id:next.id,state:'enter',dx:st.W*.6};","if(next&&next.fight)st.enemy={id:next.id,elite:!!next.elite,state:'enter',dx:st.W*.6};")
R("place(kind,id){st.walk=null;st.drop=null;if(kind==='e'){st.enemy={id,state:'idle',dx:0};st.campTarget=0;st.campA=0}else if(kind==='v'){st.enemy=null;st.campTarget=1;st.campA=1;st.prop=PROP_OF[id]}else{st.enemy=null;st.campTarget=0}},",
  "place(n){st.walk=null;st.drop=null;if(n&&n.fight){st.enemy={id:n.id,elite:!!n.elite,state:'idle',dx:0};st.campTarget=0;st.campA=0}else if(n){st.enemy=null;st.campTarget=1;st.campA=1;st.prop=n.prop||null}else{st.enemy=null;st.campTarget=0}},")
R("const mpsOf=id=>Math.max(1,Math.round(st.ps*.5))*(ENEMIES[id].scale||1);","const mpsOf=e=>Math.max(1,Math.round(st.ps*.5))*(ENEMIES[e.id].scale||1)*(e.elite?1.2:1);")
R("mpsOf(e.id)","mpsOf(e)",2)
R("const img=spr(e.id);shadow(ex,feet,img.width*st.ps,alpha);drawSprite(img,ex,feet,1,alpha);top=feet-img.height*st.ps;",
  "if(SPRITES[e.id]){const img=spr(e.id);shadow(ex,feet,img.width*st.ps,alpha);drawSprite(img,ex,feet,1,alpha);top=feet-img.height*st.ps}else top=feet-m0.h;")
R("          draw(mf.c,alpha);\n","          draw(mf.c,alpha);\n          if(e.elite)draw(tintC(mf.key,mf.c,'#ff3a2a'),(.16+.1*Math.sin(now/220))*alpha);\n")
R("          if(g.block){ctx.fillStyle='#59c9c2';ctx.fillRect(bx,by+bh+2,Math.min(bw,bw*g.block/20),Math.max(3,bh*.5))}\n        }",
"""          if(g.block){ctx.fillStyle='#59c9c2';ctx.fillRect(bx,by+bh+2,Math.min(bw,bw*g.block/20),Math.max(3,bh*.5))}
          if(S.phase==='battle'){
            const it=g.stun?{icon:'stun',val:'Stunned',cls:''}:intentText(g);const fsz=Math.max(12,H*.05);
            ctx.font=`700 ${fsz}px "Barlow Condensed","Arial Narrow",sans-serif`;const txt=String(it.val);const tw=ctx.measureText(txt).width;
            const ih=fsz*1.05,pad=fsz*.3,bwid=ih+tw+pad*3,bht=ih+pad*2,bx2=ex-bwid/2,by2=by-bht-fsz*.45;const hv=it.cls==='heavy';
            ctx.fillStyle=hv?'#3a0f0cdd':'#0d1618dd';ctx.strokeStyle=hv?'#e8574d':'#ffffff55';ctx.lineWidth=Math.max(1.5,st.ps*.25);
            ctx.beginPath();if(ctx.roundRect)ctx.roundRect(bx2,by2,bwid,bht,fsz*.3);else ctx.rect(bx2,by2,bwid,bht);ctx.fill();ctx.stroke();
            ctx.save();ctx.translate(bx2+pad,by2+pad);const sc=ih/24;ctx.scale(sc,sc);ctx.strokeStyle=hv?'#ff8a7a':'#ece6d6';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';(INTENT_D[it.icon]||[]).forEach(d=>ctx.stroke(new Path2D(d)));ctx.restore();
            ctx.fillStyle=hv?'#ff8a7a':'#ece6d6';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText(txt,bx2+pad*2+ih,by2+bht/2+1);ctx.textBaseline='alphabetic';
          }
        }""")
R("      let ox=0,oy=0,rot=0,sy=1;const p=hf.p||0;","      let ox=0,oy=0,rot=0,sy=1;const p=hf.p||0;const dg=now-(P.dodgeT||-1e9);if(dg<380)ox-=Math.sin(dg/380*Math.PI)*H*.08;")
R("    if(S&&S.phase==='battle'&&!P.dead){\n      const bw=W*.09,",
"""    if(S&&S.phase==='battle'&&!P.dead){
      const cy=feet-H*.13;
      if(S.barrier>0){const col=S.thorns?hexOf(S.thorns):'#59c9c2';ctx.save();ctx.globalAlpha=.2+.06*Math.sin(now/300);const gr=ctx.createRadialGradient(px,cy,H*.04,px,cy,H*.17);gr.addColorStop(0,col+'00');gr.addColorStop(1,col+'bb');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(px,cy,H*.17,0,6.283);ctx.fill();ctx.globalAlpha=.65;ctx.strokeStyle=col;ctx.lineWidth=Math.max(1.5,st.ps*.45);ctx.stroke();ctx.restore()}
      if(S.dodge>0&&Math.random()<dt/120)spawn(px+(Math.random()-.5)*H*.08,feet-Math.random()*H*.25,{vx:-.04*U(),color:'#e8fff4',size:st.ps*.5,life:400});
      if(S.counter&&Math.random()<dt/100)spawn(px+(Math.random()-.5)*H*.08,feet-st.ps,{vy:-.06*U(),color:'#ff6b5e',size:st.ps*.5,life:500});
      if(S.parry){ctx.save();ctx.globalAlpha=.55+.3*Math.sin(now/150);ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(1.5,st.ps*.4);const hx=px+H*.05,hy=feet-H*.17,q=st.ps*1.8;ctx.beginPath();ctx.moveTo(hx-q,hy-q);ctx.lineTo(hx+q,hy+q);ctx.moveTo(hx+q,hy-q);ctx.lineTo(hx-q,hy+q);ctx.stroke();ctx.restore()}
    }
    if(S&&S.phase==='battle'&&!P.dead){
      const bw=W*.09,""")
R("    st.fx=st.fx.filter(f=>{const p=(now-f.t0)/f.dur;if(p<0)return true;if(p>=1)return false;\n",
  "    st.fx=st.fx.filter(f=>{const p=(now-f.t0)/f.dur;if(p<0)return true;if(p>=1)return false;\n      if(f.draw){ctx.save();f.draw(p,now);ctx.restore();return true}\n")
R("""    st.parts=st.parts.filter(p=>{const a=now-p.t0;if(a>p.life)return false;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      ctx.globalAlpha=1-a/p.life;ctx.fillStyle=p.color;ctx.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size);ctx.globalAlpha=1;return true});""",
"""    st.parts=st.parts.filter(p=>{const a=now-p.t0;if(a<0)return true;if(a>p.life)return false;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      const al=1-a/p.life;ctx.globalAlpha=al;ctx.fillStyle=p.color;
      if(p.shape==='circ'){ctx.beginPath();ctx.arc(p.x,p.y,p.size/2,0,6.283);ctx.fill()}
      else if(p.shape==='tri'){ctx.beginPath();ctx.moveTo(p.x,p.y-p.size);ctx.lineTo(p.x+p.size*.6,p.y+p.size*.5);ctx.lineTo(p.x-p.size*.6,p.y+p.size*.5);ctx.fill()}
      else if(p.shape==='puff'){ctx.globalAlpha=al*.45;ctx.beginPath();ctx.arc(p.x,p.y,p.size*(1+a/p.life),0,6.283);ctx.fill()}
      else if(p.shape==='drop'){ctx.shadowColor=p.color;ctx.shadowBlur=st.ps*2;ctx.fillRect(p.x-p.size*.25,p.y-p.size*1.6,p.size*.5,p.size*2.2);ctx.shadowBlur=0}
      else if(p.shape==='plus'){const s=p.size;ctx.fillRect(p.x-s,p.y-s*.3,s*2,s*.6);ctx.fillRect(p.x-s*.3,p.y-s,s*.6,s*2)}
      else ctx.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size);
      ctx.globalAlpha=1;return true});""")
R("      ctx.restore();return true});\n    requestAnimationFrame(frame);\n",
  "      ctx.restore();return true});\n    ctx.restore();\n    if(st.flash){const fp=(now-st.flash.t0)/160;if(fp>=1)st.flash=null;else{ctx.globalAlpha=st.flash.a*(1-fp);ctx.fillStyle=st.flash.color;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}}\n    requestAnimationFrame(frame);\n")
R("  let last=performance.now();",open('stage_vfx.js').read()+"\n  let last=performance.now();")
R("    enemyAttack(dur){if(st.enemy)st.enemy.act={t0:performance.now(),dur:dur||560}},",
"""    enemyAttack(dur,type){if(!st.enemy)return;st.enemy.act={t0:now_(),dur:dur||560,type};if(type==='heavy'){const m=enemyMetrics();ring(m.x,m.feet-m.h*.5,m.h,'#e8574d',0,500,2.4);flash('#ff3a2a',260,.18);shake(280,st.ps*2.2)}},
    perform(R){const d=this._perform(R);
      if(R.pure&&R.kind!=='support'&&R.name!=='Laser Beam')st.player.backUntil=now_()+Math.max(d,1200)+350;
      return d},
    _perform(R){
      const m=enemyMetrics(),pm=playerMetrics();if(!m)return 300;
      const elems=R.fx.length?R.fx:R.dmg.map(p=>p.t).filter(t=>ELEMS.includes(t));const uniq=[...new Set(elems)];
      const big=R.fx.length===2&&R.fx[0]===R.fx[1];
      if(R.quake){const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+300};setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        R.tickTimes=Array.from({length:5},(_,i)=>ch+320+i*240);
        setTimeout(()=>{st.foes.forEach(f=>{if(!f.gone&&f.state!=='die')f.crackT=now_()})},ch+250);
        R.tickTimes.forEach((t,i)=>setTimeout(()=>{shake(0,st.ps*(1.8+(i%2)*.5));st.foes.forEach(f=>{if(f.gone||f.state==='die')return;const mm=enemyMetricsOf(f);for(let k=0;k<5;k++)spawn(mm.x+(Math.random()-.5)*mm.w*2.2,mm.feet,{vx:(Math.random()-.5)*.06*U(),vy:-(.06+Math.random()*.14)*U(),g:.0016*U(),color:pick_(['#6b4a2a','#8a5a2b','#c09461']),size:st.ps*(.6+Math.random()*.9),life:500});spawn(mm.x+(Math.random()-.5)*mm.w*2,mm.feet,{vy:-.02*U(),vx:(Math.random()-.5)*.03*U(),color:'#c8b08a',size:st.ps*(1.6+Math.random()),life:700,shape:'puff'})})},t));
        return R.tickTimes[R.tickTimes.length-1]+120;}
      if(R.kind==='melee'&&R.segs&&(R.segs.length>1||R.fslash)){const ch=R.charge&&R.charge.length?700:0;
        const XS=k=>['fslash','bslash','aslash','dslash'].includes(k),ES=k=>XS(k)&&HERO[k],AN=k=>XS(k)?(HERO[k]?k:'slash'):k==='slash'?'slash':k==='kick'?'kick':'punch',WP=k=>(k==='punch'||k==='kick')?'back':'hand',GAP={slash:100,stab:500,punch:250,kick:250,fslash:60,bslash:60,aslash:60,dslash:60},DD=k=>ES(k)?630:360,HO=k=>ES(k)?470:160;
        let t=250;const segs=R.segs.map((o,i)=>{if(i>0&&R.segs[i-1].k===o.k)t+=GAP[o.k]??0;const D=DD(o.k),q={anim:AN(o.k),weapon:WP(o.k),s:t,e:t+D,k:o.k};t+=D;return q});
        if(ch)st.player.aura={els:R.charge,t0:now_(),dur:ch+t+100};
        st.player.anim=null;st.player.act={type:'attack',t0:now_()+ch,dur:t+260,multi:true,segs,kind:segs[0].anim,weapon:segs[0].weapon};
        R.hitTimes=segs.map(o=>ch+o.s+HO(o.k));
        R.hitTimes.forEach((tm,i)=>setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;const kk=segs[i].k,col=(R.trail&&kk!=='punch'&&kk!=='kick')?hexOf(R.trail):'#ffffff';if(kk==='fslash'){frostHit(mm)}else if(kk==='bslash'){flameHit(mm)}else if(kk==='aslash'){waveHit(mm)}else if(kk==='dslash'){abyssHit(mm)}else physFx(kk,mm,0,col);if(i===segs.length-1)[...new Set(R.fx)].forEach((el,j)=>elemBurst(el,mm,40+j*120,false))},tm));
        return R.hitTimes[R.hitTimes.length-1]+20;}
      if(R.kind==='melee'){const ch=R.charge&&R.charge.length?700:0;if(ch)st.player.aura={els:R.charge,t0:now_(),dur:ch+360};st.player.anim=null;st.player.act={type:'attack',t0:now_()+ch,dur:860,kind:R.anim,weapon:R.weapon};
        const color=R.trail?hexOf(R.trail):'#ffffff';
        setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;
          R.phys.forEach((k,i)=>physFx(k,mm,i*110,i===0?color:'#ffffff'));
          if(R.trail&&!R.phys.includes('slash')){arc(mm.x,mm.feet-mm.h*.5,mm.h*.78,-2.2,color,40,1.2)}
          if(!comboFx(R,mm,60))uniq.forEach((el,i)=>elemBurst(el,mm,60+i*120,big));
        },310+ch);
        return 330+ch;}
      if(R.kind==='cast'&&R.name==='Freeze'){
        const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+200};
        setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        R.tickTimes=[0,1,2,3,4,5,6,7,8,9].map(i=>ch+300+i*150);
        if(st.enemy)st.enemy.freezeAnim={t0:now_()+ch+150,dur:1500};
        R.tickTimes.forEach(t=>setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;for(let i=0;i<4;i++)spawn(mm.x+(Math.random()-.5)*mm.w,mm.feet-Math.random()*mm.h,{vy:-.03*U(),color:Math.random()<.5?'#dff4ff':'#ffffff',size:st.ps*.6,life:500,shape:'tri'})},t));
        return R.tickTimes[9];}
      if(R.kind==='cast'&&R.name==='Laser Beam'){
        const ch=1000,hb=HERO.beam;st.player.aura={els:R.charge,t0:now_(),dur:ch+150};
        const hl0=HERO.laser;if(hl0){st.player.holdFrame=null;st.player.anim=null;st.player.act=null}else if(hb){st.player.holdFrame=null;st.player.anim={name:'beam',t0:now_(),dur:ch*6/5}}
        const hl=HERO.laser,fire0=hl?350:40;
        R.tickTimes=[0,1,2,3,4,5,6,7].map(i=>ch+fire0+260+i*210);const end=R.tickTimes[7]+180;if(R.phoenix)phoenixFx(250,end+500);
        if(hl)st.player.seq={n:'laser',t0:now_(),times:[0,ch*.5,ch+70,ch+140,ch+210,ch+280,ch+600,ch+880,ch+1160,ch+1440],until:now_()+end};
        else setTimeout(()=>{st.player.holdFrame={n:hb?'beam':'punch',i:hb?5:3,until:now_()+end-ch}},ch);
        addFx(ch+fire0,end-ch-fire0,(p,now)=>{const pm=playerMetrics(),mm=enemyMetrics();if(!mm)return;
          const hp2=hl&&st.player.handPt,bf=hb&&hb[5],kk=st.H*.25/90,sx=hp2?hp2.x+st.ps*.6:bf&&bf.gx!=null?pm.x+(bf.gx-bf.ax)*kk:pm.x+pm.w*.55,sy=hp2?hp2.y:bf&&bf.gy!=null?pm.feet-((bf.fy||bf.h)-bf.gy)*kk:pm.feet-pm.h*.62,ex2=mm.x-mm.w*.15,ey=mm.feet-mm.h*.5;
          const grow=Math.min(1,p*6),ramp=p<.6?1:p<.85?1.5:2.1,fade=p>.94?(1-p)/.06:1,w=st.ps*(1.2+Math.sin(now/30)*.25)*ramp*fade;
          const x2=sx+(ex2-sx)*grow,y2=sy+(ey-sy)*grow;
          ctx.lineCap='round';ctx.shadowColor='#ff7b3a';ctx.shadowBlur=st.ps*6;
          ctx.globalAlpha=.55*fade;ctx.strokeStyle='#ff5a1f';ctx.lineWidth=w*3.2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(x2,y2);ctx.stroke();
          ctx.globalAlpha=.9*fade;ctx.strokeStyle='#ffd84a';ctx.lineWidth=w*1.7;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(x2,y2);ctx.stroke();
          ctx.globalAlpha=fade;ctx.strokeStyle='#fffbe8';ctx.lineWidth=w*.7;ctx.shadowColor='#ffffff';ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(x2,y2);ctx.stroke();
          ctx.shadowBlur=0;ctx.globalAlpha=.8*fade;ctx.fillStyle='#fff6e0';ctx.beginPath();ctx.arc(sx,sy,w*1.3,0,6.283);ctx.fill();
          if(grow>=1){ctx.globalAlpha=.7*fade;const gr=ctx.createRadialGradient(x2,y2,0,x2,y2,w*5);gr.addColorStop(0,'#fff6d0');gr.addColorStop(.4,'#ff9a3acc');gr.addColorStop(1,'#ff5a1f00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x2,y2,w*5,0,6.283);ctx.fill();
            if(Math.random()<.7)spawn(x2,y2,{vx:-(.05+Math.random()*.15)*U(),vy:(Math.random()-.5)*.25*U(),g:.0008*U(),color:Math.random()<.5?'#ffd84a':'#ff7b3a',size:st.ps*(.4+Math.random()*.5),life:380})}});
        R.tickTimes.forEach((t,i)=>setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;if(i>=5)shake(0,st.ps*(i-3)*.6);if(i===7){flash('#ffd84a',0,.18);ring(mm.x,mm.feet-mm.h*.5,mm.h*.8,'#ffd84a',0,400,2)}},t));
        return R.tickTimes[7];}
      if(R.kind==='cast'&&R.name==='Eclipse'){
        const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+200};
        setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        R.tickTimes=[0,1,2,3,4].map(i=>ch+420+i*300);const end=R.tickTimes[4]+260;let cur=-1;
        R.tickTimes.forEach((t,i)=>setTimeout(()=>{cur=i;const mm=enemyMetrics();if(!mm)return;const dk=R.tickTypes[i]==='dark',col=dk?'#b18bff':'#fff0b3';
          for(let k2=0;k2<14;k2++){const a2=Math.random()*6.283,v=(.08+Math.random()*.18)*U();spawn(mm.x,mm.feet-mm.h*.5,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,color:dk?(Math.random()<.5?'#b18bff':'#5b2a9a'):(Math.random()<.5?'#fff0b3':'#ffd84a'),size:st.ps*.7,life:420,shape:'circ'})}
          ring(mm.x,mm.feet-mm.h*.5,mm.h*.6,col,0,360,1.6)},t));
        addFx(ch+150,end-ch-150,(p,now)=>{const mm=enemyMetrics();if(!mm)return;
          const fade=Math.min(1,p*6)*(p>.9?(1-p)/.1:1),ox=mm.x,oy=Math.max(st.H*.11,mm.feet-mm.h*1.95),R0=Math.max(st.ps*3.4,mm.h*.22);
          const dk=cur<0?true:R.tickTypes[cur]==='dark';
          ctx.globalAlpha=.22*fade;const pg=ctx.createLinearGradient(0,oy,0,mm.feet);pg.addColorStop(0,'#fff6d0');pg.addColorStop(1,'#fff6d000');ctx.fillStyle=pg;const pw=R0*1.3;ctx.fillRect(ox-pw,oy,pw*2,mm.feet-oy);
          {const ph2=mm.feet-oy,ew=pw*.75,pul=.75+.25*Math.sin(now/140),seg=10;
            for(const sd of[-1,1]){for(let k3=0;k3<seg;k3++){const y0=oy+ph2*k3/seg,y1=oy+ph2*(k3+1)/seg,wob=Math.sin(now/170+k3*.9+sd)*st.ps*.8,ex3=ox+sd*pw+wob;
              const eg=ctx.createLinearGradient(ex3-ew,0,ex3+ew,0);eg.addColorStop(0,'#4a1a7a00');eg.addColorStop(.5,'#6a2db0');eg.addColorStop(1,'#4a1a7a00');
              ctx.globalAlpha=.8*fade*pul*(1-k3/seg*.3);ctx.fillStyle=eg;ctx.fillRect(ex3-ew,y0,ew*2,y1-y0+1)}}
            if(Math.random()<.5){const sd=Math.random()<.5?-1:1;spawn(ox+sd*pw+(Math.random()-.5)*st.ps*2,oy+Math.random()*ph2,{vy:-.04*U(),color:Math.random()<.5?'#8a4dff':'#5b2a9a',size:st.ps*.55,life:550,shape:'circ'})}}
          ctx.globalAlpha=.55*fade;const hg=ctx.createRadialGradient(ox,oy,R0*.6,ox,oy,R0*2.4);hg.addColorStop(0,dk?'#8a4dffcc':'#fff0b3dd');hg.addColorStop(1,dk?'#8a4dff00':'#fff0b300');ctx.fillStyle=hg;ctx.beginPath();ctx.arc(ox,oy,R0*2.4,0,6.283);ctx.fill();
          ctx.globalAlpha=fade;ctx.shadowBlur=st.ps*(dk?4:7);ctx.shadowColor=dk?'#b18bff':'#fff0b3';ctx.fillStyle=dk?'#16081f':'#fff4c4';ctx.beginPath();ctx.arc(ox,oy,R0,0,6.283);ctx.fill();
          ctx.shadowBlur=0;ctx.lineWidth=Math.max(1.5,st.ps*.5);ctx.strokeStyle=dk?'#fff0b3':'#b18bff';ctx.beginPath();ctx.arc(ox,oy,R0,0,6.283);ctx.stroke();
          if(dk){ctx.fillStyle='#fff0b3';ctx.globalAlpha=fade*.9;ctx.beginPath();ctx.arc(ox+R0*.25,oy-R0*.1,R0*.92,0,6.283);ctx.arc(ox,oy,R0*.98,0,6.283,true);ctx.fill()}
          if(Math.random()<.35)spawn(ox+(Math.random()-.5)*pw*1.6,oy+R0,{vy:.06*U(),color:'#fff6d0',size:st.ps*.45,life:600})});
        return R.tickTimes[4];}
      if(R.kind==='cast'&&R.name==='Thunderstorm'){
        const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+300};
        setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        addFx(ch,1700,p=>{ctx.globalAlpha=.32*Math.sin(Math.min(1,p*1.2)*Math.PI);ctx.fillStyle='#10121e';ctx.fillRect(0,0,st.W,st.H)});
        R.tickTimes=[0,1,2,3,4].map(i=>ch+320+i*270);
        R.tickTimes.forEach(t=>setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;const y=mm.feet-mm.h*.35;
          bolt(mm.x+(Math.random()-.5)*mm.w*.3,y,0);
          for(let i=0;i<14;i++){const a2=Math.random()*6.283,v=(.1+Math.random()*.25)*U();spawn(mm.x,y,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,color:Math.random()<.5?'#f2d24b':'#ffffff',size:st.ps*.6,life:340})}
          ring(mm.x,y,mm.h*.6,'#f2d24b',0,320,1.4)},t-150));
        return R.tickTimes[4];}
      if(R.kind==='cast'&&R.name==='Sandstorm'){
        const ch=700,dur=1800,N=70,cols=['#9a9a9a','#7a7470','#8a5a2b','#a8763e','#d9c49a','#e8d8b0'];
        st.player.aura={els:R.charge,t0:now_(),dur:ch+300};
        setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch+500);
        const sp=Array.from({length:N},(_,i)=>({d:Math.random()*.45,ph:Math.random()*6.283,r:.7+Math.random()*.6,c:cols[i%cols.length],s:.5+Math.random()*.7,yo:Math.random()}));
        addFx(ch,dur,(p,now)=>{const pm=playerMetrics(),mm=enemyMetrics();if(!mm)return;
          const hx=pm.x,hy=pm.feet-pm.h*.5;
          sp.forEach(o=>{const q=(p-o.d)/(1-o.d)*1.15;if(q<0||q>1)return;
            let x,y;const ang=o.ph+q*14;
            if(q<.45){const rr=pm.h*(.35+.25*o.r)*(.5+q);x=hx+Math.cos(ang)*rr;y=hy+Math.sin(ang)*rr*.55-(o.yo-.5)*pm.h*.6}
            else{const t=(q-.45)/.55,e2=t*t*(3-2*t),rr=pm.h*(.35+.25*o.r)*(1-t*.7);const bx=hx+(mm.x-hx)*e2,by=hy+(mm.feet-mm.h*.5-hy)*e2;x=bx+Math.cos(ang)*rr;y=by+Math.sin(ang)*rr*.55-(o.yo-.5)*mm.h*.6*(1-t*.3)}
            ctx.globalAlpha=q>.9?(1-q)*10:Math.min(1,q*8);ctx.fillStyle=o.c;const z=st.ps*o.s;ctx.fillRect(x-z/2,y-z/2,z,z)})});
        R.tickTimes=[0,1,2].map(i=>ch+1150+i*260);
        R.tickTimes.forEach(t=>setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;for(let i=0;i<10;i++){const a2=Math.random()*6.283,v=(.08+Math.random()*.14)*U();spawn(mm.x,mm.feet-mm.h*.5,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,color:cols[i%cols.length],size:st.ps*.7,life:380})}},t));
        return R.tickTimes[2];}
      if(R.kind==='cast'&&R.ticks){
        const ch=700,dur=1500;st.player.aura={els:R.charge,t0:now_(),dur:ch+200};
        setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        let lastS=0;addFx(ch,dur,(p,now)=>{const mm=enemyMetrics();if(!mm)return;
          ctx.globalAlpha=.18*Math.sin(p*Math.PI);ctx.fillStyle='#cfefff';ctx.fillRect(mm.x-mm.w*2,0,mm.w*4,mm.feet);
          if(now-lastS<16||p>.85)return;lastS=now;
          for(let i=0;i<4;i++){const sx=mm.x-st.W*(.05+Math.random()*.3),sy=-st.ps*2-Math.random()*st.H*.1,tx=mm.x+(Math.random()-.5)*mm.w*1.4,ty=mm.feet-Math.random()*mm.h*.9,tt=450+Math.random()*300;
            const shard=Math.random()<.35;spawn(sx,sy,{vx:(tx-sx)/tt,vy:(ty-sy)/tt,color:shard?(Math.random()<.5?'#82d4ff':'#dff4ff'):'#ffffff',size:st.ps*(shard?1.1+Math.random()*.6:.5+Math.random()*.6),life:tt,shape:shard?'tri':'circ'})}});
        R.tickTimes=[0,1,2,3,4].map(i=>ch+350+i*250);
        R.tickTimes.forEach(t=>setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;for(let i=0;i<8;i++){const a=Math.random()*6.283,v=(.1+Math.random()*.15)*U();spawn(mm.x+(Math.random()-.5)*mm.w,mm.feet-mm.h*(.3+Math.random()*.5),{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:'#dff4ff',size:st.ps*.8,life:350,shape:'tri'})}},t));
        return R.tickTimes[4];}
      if(R.kind==='cast'&&R.name==='Electrocute'){
        const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+260};
        setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        projectile(pm.x+pm.w*.35,pm.feet-pm.h*.62,m.x,m.feet-m.h*.5,'#4aa8ff',ch+180,320,'orb');
        setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;elemBurst('water',mm,0,false);
          const hy=mm.feet-mm.h*1.05;bolt(mm.x,hy,170);
          setTimeout(()=>{for(let i=0;i<18;i++){const a=Math.random()*6.283,v=(.1+Math.random()*.25)*U();spawn(mm.x,mm.feet-mm.h*.6,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:Math.random()<.5?'#f2d24b':'#ffffff',size:st.ps*.6,life:380})}ring(mm.x,mm.feet-mm.h*.5,mm.h*.7,'#f2d24b',0,420,1.6)},170);
        },ch+500);
        return ch+700;}
      if(R.mud){const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+300};setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        const sx=pm.x+pm.w*.35,sy=pm.feet-pm.h*.62;
        for(let i=0;i<4;i++)setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;mudBlob(sx,sy-i*st.ps,mm.x+(Math.random()-.4)*mm.w*.6,mm.feet-mm.h*(.25+Math.random()*.4),380)},ch+150+i*90);
        setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;elemBurst('earth',mm,0,false);for(let k=0;k<22;k++){const a2=-Math.PI*(.05+Math.random()*.9),v=(.1+Math.random()*.22)*U();spawn(mm.x,mm.feet-mm.h*.4,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,g:.0016*U(),color:pick_(['#5a3a1c','#6b4a2a','#8a6a3a','#4a2e14']),size:st.ps*(.8+Math.random()*1.1),life:650,shape:'circ'})}if(st.enemy)st.enemy.mudT=now_()},ch+560);
        return ch+600;}
      if(R.stonePunch){const ch=R.charge&&R.charge.length?700:0;if(ch)st.player.aura={els:R.charge,t0:now_(),dur:ch+200};R.hitTimes=[];
        for(let i=0;i<R.stonePunch;i++){const t0=ch+i*300;setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:420};const p2=playerMetrics(),mm=enemyMetrics();if(!mm)return;stoneFist(p2.x+p2.w*.45,p2.feet-p2.h*.6,mm.x-mm.w*.2,mm.feet-mm.h*(.45+(i-1)*.12*(R.stonePunch>1?1:0)),360)},t0+120);R.hitTimes.push(t0+480)}
        return R.hitTimes[R.hitTimes.length-1]+40;}
      if(R.meteor){const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+300};setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        R.hitTimes=[];for(let i=0;i<R.meteor;i++){const st0=ch+120+i*430,fall=560;R.hitTimes.push(st0+fall);meteorFx(st0,fall,i)}
        return R.hitTimes[R.hitTimes.length-1]+60;}
      if(R.ranged==='volley'&&HERO.jump){
        const P=st.player;P.anim=null;P.act=null;P.holdFrame=null;const T0=now_();
        P.seq={n:'jump',t0:T0,times:[0,150,260,370,520,670,900,1100],idx:[0,1,2,3,4,5,1,0],until:T0+1240,lift:t=>{if(t<150||t>1100)return 0;return -Math.sin((t-150)/950*Math.PI)*st.H*.04}};
        const shots=[];[420,580,760].forEach((w,wi)=>{for(let i=0;i<3;i++)shots.push(w+i*45)});
        let last=0;shots.forEach((t,i)=>{setTimeout(()=>{const hp=P.handPt||{x:pm.x+pm.w*.4,y:pm.feet-pm.h*.8},mm=enemyMetrics();if(!mm)return;
          const tx=mm.x+(Math.random()-.5)*mm.w*.7,ty=mm.feet-mm.h*(.2+Math.random()*.6),dur=230+Math.random()*60;volleyArrow(hp.x,hp.y,tx,ty,dur);
          setTimeout(()=>{const m2=enemyMetrics();if(!m2)return;for(let q=0;q<5;q++){const a=Math.PI+(Math.random()-.5)*1.4,v=(.06+Math.random()*.12)*U();spawn(tx,ty,{vx:Math.cos(a)*v,vy:Math.sin(a)*v-.04*U(),color:Math.random()<.6?'#ffffff':'#e6e9f0',size:st.ps*.5,life:260})}shake(0,st.ps*.6)},dur)},t);last=Math.max(last,t+300)});
        setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;ring(mm.x,mm.feet-mm.h*.5,mm.h*.7,'#ffffff',0,380,1.6);flash('#ffffff',0,.14)},last);
        return last+30;}
      if(R.ranged==='charged'){
        const ch=1200;st.player.anim=null;st.player.act=null;st.player.aimUntil=now_()+ch+40;
        const tipAt=()=>{const p2=playerMetrics();return{x:p2.x+p2.w*.62,y:p2.feet-p2.h*.55,L:p2.h*.55}};
        let lastS=0;
        addFx(0,ch,(p,now)=>{const t=tipAt();const g=Math.min(1,p*1.3);
          ctx.save();ctx.shadowColor='#ffffff';ctx.shadowBlur=st.ps*(2+6*g);ctx.globalAlpha=.25+.75*g;ctx.strokeStyle='#ffffff';ctx.lineWidth=st.ps*(.5+.4*g);ctx.lineCap='round';
          ctx.beginPath();ctx.moveTo(t.x-t.L,t.y);ctx.lineTo(t.x,t.y);ctx.stroke();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(t.x+st.ps*2,t.y);ctx.lineTo(t.x-st.ps*.6,t.y-st.ps*1.2);ctx.lineTo(t.x-st.ps*.6,t.y+st.ps*1.2);ctx.fill();ctx.restore();
          ctx.save();ctx.globalAlpha=.35*g;const gr=ctx.createRadialGradient(t.x,t.y,0,t.x,t.y,t.L*.8);gr.addColorStop(0,'#ffffffcc');gr.addColorStop(1,'#ffffff00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(t.x,t.y,t.L*.8,0,6.283);ctx.fill();ctx.restore();
          if(p>.9||now-lastS<16)return;lastS=now;
          for(let i=0;i<3;i++){const a2=Math.random()*6.283,r=t.L*(.9+Math.random()*.7),sx=t.x-t.L*.4+Math.cos(a2)*r,sy=t.y+Math.sin(a2)*r*.8,tt=320+Math.random()*200;
            spawn(sx,sy,{vx:(t.x-t.L*.3-sx)/tt,vy:(t.y-sy)/tt,color:Math.random()<.7?'#ffffff':'#e8f2ff',size:st.ps*(.4+Math.random()*.4),life:tt})}});
        const t0=tipAt();
        projectile(t0.x-t0.L*.3,t0.y,m.x,m.feet-m.h*.5,'#ffffff',ch,220,'arrow');
        setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;const y=mm.feet-mm.h*.5;thrust(mm.x,y,mm.w*1.3,'#ffffff',0);ring(mm.x,y,mm.h*.8,'#ffffff',0,420,2.2);flash('#ffffff',0,.22);shake(0,st.ps*2);
          for(let i=0;i<22;i++){const a2=Math.random()*6.283,v=(.12+Math.random()*.25)*U();spawn(mm.x,y,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,color:'#ffffff',size:st.ps*.6,life:420})}},ch+220);
        return ch+230;}
      if(R.kind==='ranged'||R.kind==='cast'){
        const ch=R.charge&&R.charge.length?700:0;if(ch)st.player.aura={els:R.charge,t0:now_(),dur:ch+260};
        setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520}},ch);
        const sx=pm.x+pm.w*.35,sy=pm.feet-pm.h*.62,tx=m.x,ty=m.feet-m.h*.5;
        const n=['Double Fireball','Volley','Twin Javelins','Twin Discs'].includes(R.name)?2:1;
        const color=R.kind==='ranged'?'#e6e9f0':hexOf(uniq[0]||'light');const shape=R.kind==='ranged'?R.ranged:'orb';
        for(let i=0;i<n;i++)projectile(sx,sy-i*st.ps*3,tx,ty,(i===1&&uniq[1])?hexOf(uniq[1]):color,ch+180+i*150,300,shape);
        if(R.kind==='cast'&&uniq[1]&&n===1)projectile(sx,sy+st.ps*2,tx,ty,hexOf(uniq[1]),ch+230,300,'orb');
        const hit=ch+480+(n-1)*150;
        setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;
          if(R.kind==='ranged')R.phys.forEach((k,i)=>physFx(k,mm,i*120,R.trail?hexOf(R.trail):'#ffffff'));
          if(!comboFx(R,mm,0))uniq.forEach((el,i)=>elemBurst(el,mm,i*120,big));
        },hit-30);
        return hit;}
      if(R.embrace){const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+200};setTimeout(()=>{st.player.embrace={t0:now_(),dur:1400}},ch);R.tickTimes=[0,1,2,3,4].map(i=>ch+300+i*260);return R.tickTimes[4]+80}
      if(R.iceAge){const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+300};setTimeout(()=>{st.player.anim={name:'punch',t0:now_(),dur:520};this.iceFloor(true);const pm2=playerMetrics();ring(pm2.x,pm2.feet,pm2.h*.9,'#dff4ff',0,600,2.2);flash('#bfe9ff',0,.18);for(let i=0;i<26;i++)spawn(pm2.x,pm2.feet-st.ps,{vx:(Math.random()<.5?-1:1)*(.15+Math.random()*.3)*U(),vy:-(.02+Math.random()*.06)*U(),g:.0006*U(),color:Math.random()<.5?'#ffffff':'#9fdcff',size:st.ps*(.6+Math.random()*.6),life:600,shape:'tri'})},ch);return ch+750}
      if(R.holyRain){const ch=700;st.player.aura={els:R.charge,t0:now_(),dur:ch+200};R.tickTimes=this[R.rainFlat?'healRain':'holyRain'](ch);return R.tickTimes[4]+80}
      const ch=R.charge&&R.charge.length?700:0;if(ch)st.player.aura={els:R.charge,t0:now_(),dur:ch+300};
      if(R.barrier||R.block)setTimeout(()=>{st.player.anim={name:'shield',t0:now_(),dur:700}},ch);
      return 280+ch;
    },
    support(R){const pm=playerMetrics();const x=pm.x,y=pm.feet-pm.h*.5;
      if(R.block)ring(x,y,pm.h*.6,'#59c9c2',0,400,1.8);
      if(R.barrier)ring(x,y,pm.h*.75,R.thorns?hexOf(R.thorns):'#59c9c2',0,600,2.2);
      if(R.heal||R.drain||R.lifesteal)for(let i=0;i<10;i++)spawn(x+(Math.random()-.5)*pm.w,y+Math.random()*pm.h*.4,{vy:-.07*U(),color:'#7fe08a',size:st.ps*.9,life:800,delay:i*40,shape:'plus'});
      if(R.dodge)for(let i=0;i<8;i++)spawn(x,y,{vx:-(.1+Math.random()*.1)*U(),vy:(Math.random()-.5)*.03*U(),color:'#e8fff4',size:st.ps*.6,life:400});
      if(R.parry)ring(x+pm.w*.3,y-pm.h*.1,pm.h*.3,'#e6e9f0',0,350,1.4);
      if(R.counter)ring(x,pm.feet,pm.w*.8,'#e8574d',0,450,1.6);
      if(R.lava){ring(x,y,pm.h*.75,'#ff7b3a',0,600,2.2);for(let i=0;i<16;i++)spawn(x+(Math.random()-.5)*pm.w*1.2,pm.feet,{vy:-(.08+Math.random()*.1)*U(),color:['#ff7b3a','#ffd84a','#8a5a2b'][i%3],size:st.ps*(.8+Math.random()*.6),life:700,delay:i*25,shape:'circ'})}
      if(R.kind==='support')(R.fx||[]).forEach(f=>{for(let i=0;i<8;i++)spawn(x+(Math.random()-.5)*pm.w,y,{vy:-.06*U(),color:hexOf(f),size:st.ps*.7,life:600,delay:i*30})});
    },
    drainFx(dur,dark){let last=0;addFx(0,dur||1500,(p,now)=>{const m=enemyMetrics(),pm=playerMetrics();if(!m)return;
        if(now-last<16)return;last=now;
        for(let i=0;i<5;i++){const sx=m.x+(Math.random()-.5)*m.w*.8,sy=m.feet-m.h*(.25+Math.random()*.55),tx=pm.x+(Math.random()-.5)*pm.w*.4,ty=pm.feet-pm.h*(.35+Math.random()*.35),tt=420+Math.random()*220;
          spawn(sx,sy,{vx:(tx-sx)/tt,vy:(ty-sy)/tt-.02*U(),g:.04*U()/tt,color:dark?(Math.random()<.5?(Math.random()<.5?'#b18bff':'#6a3cc8'):(Math.random()<.6?'#7fe08a':'#c4ffb0')):(Math.random()<.6?'#7fe08a':'#c4ffb0'),size:st.ps*(.6+Math.random()*.5),life:tt})}})},
    healRain(delay){const dur=1650,N=26,dp=Math.min(2,window.devicePixelRatio||1),seeds=Array.from({length:N},(_,i)=>({o:Math.random(),x:Math.random()-.5,v:.9+Math.random()*.35,l:.6+Math.random()*.6}));let lastS=0;
      addFx(delay,dur,(p,now)=>{const pm=playerMetrics(),P=st.player,hx=pm.x,top=(P.topY??(pm.feet-pm.h))-20*dp,bot=pm.feet,span=bot-top,W=pm.w*1.7,t=p*dur,fade=Math.min(1,p*6)*(p>.85?(1-p)/.15:1);
        ctx.save();ctx.globalAlpha=.28*fade;ctx.translate(hx,top+span*.45);ctx.scale(1,span/W);const cg=ctx.createRadialGradient(0,0,0,0,0,W*.6);cg.addColorStop(0,'#c8f0ff66');cg.addColorStop(.6,'#9dffb022');cg.addColorStop(1,'#9fd8ff00');ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,0,W*.6,0,6.283);ctx.fill();ctx.restore();
        ctx.lineCap='round';ctx.shadowBlur=st.ps*3.5;
        seeds.forEach((d,i)=>{const c=i%2?'#7fe08a':'#6cc8ff',y=top+((d.o+t*d.v/520)%1)*span,L=st.ps*3.2*d.l,x=hx+d.x*W;
          ctx.globalAlpha=fade*(.55+.45*Math.min(1,(bot-y)/(span*.25)));ctx.strokeStyle=c;ctx.shadowColor=c;ctx.lineWidth=Math.max(2,st.ps*.6);ctx.beginPath();ctx.moveTo(x,Math.max(top,y-L));ctx.lineTo(x,y);ctx.stroke();
          ctx.globalAlpha=fade;ctx.fillStyle='#ffffff';ctx.fillRect(x-st.ps*.18,y-st.ps*.18,st.ps*.36,st.ps*.36)});
        ctx.shadowBlur=0;
        if(p<.85&&now-lastS>70){lastS=now;for(let k=0;k<2;k++){const sx=hx+(Math.random()-.5)*W,g=Math.random()<.5;spawn(sx,bot,{vx:(Math.random()-.5)*.05*U(),vy:-(.04+Math.random()*.05)*U(),g:.0006*U(),color:g?'#9dffb0':'#9fd8ff',size:st.ps*.45,life:260})}}});
      const ts=[0,1,2,3,4].map(i=>delay+280+i*280);
      ts.forEach((t,q)=>setTimeout(()=>{const pm=playerMetrics();for(let i=0;i<6;i++)spawn(pm.x+(Math.random()-.5)*pm.w*.9,pm.feet-pm.h*(.3+Math.random()*.6),{vy:-.06*U(),color:(i+q)%2?'#7fe08a':'#6cc8ff',size:st.ps*.8,life:600,shape:'plus'})},t));
      return ts},
    holyRain(delay){const dur=1500;let lastR=0;
      addFx(delay,dur,(p,now)=>{const pm=playerMetrics(),hx=pm.x,top=pm.feet-pm.h*1.45,head=pm.feet-pm.h*.9,fade=Math.min(1,p*5)*(p>.85?(1-p)/.15:1);
        ctx.globalAlpha=.5*fade;const gr=ctx.createRadialGradient(hx,top,0,hx,top,pm.h*.55);gr.addColorStop(0,'#e8fff0cc');gr.addColorStop(.5,'#7fe08a55');gr.addColorStop(1,'#9fd8ff00');ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(hx,top,pm.h*.55,pm.h*.18,0,0,6.283);ctx.fill();
        ctx.globalAlpha=.16*fade;const cg=ctx.createLinearGradient(0,top,0,pm.feet);cg.addColorStop(0,'#c8ffd8');cg.addColorStop(1,'#9fd8ff00');ctx.fillStyle=cg;ctx.fillRect(hx-pm.h*.4,top,pm.h*.8,pm.feet-top);
        if(p>.82||now-lastR<16)return;lastR=now;
        for(let i=0;i<3;i++){const g=Math.random()<.5,sx=hx+(Math.random()-.5)*pm.h*.75,tt=320+Math.random()*160,ty=head+Math.random()*pm.h*.55;
          spawn(sx,top+(Math.random()-.5)*pm.h*.08,{vy:(ty-top)/tt,color:g?'#9dffb0':'#bfe6ff',size:st.ps*(g?.75:.6),life:tt,shape:'drop'})}});
      const ts=[0,1,2,3,4].map(i=>delay+260+i*260);
      ts.forEach(t=>setTimeout(()=>{const pm=playerMetrics();for(let i=0;i<7;i++)spawn(pm.x+(Math.random()-.5)*pm.w*.9,pm.feet-pm.h*(.3+Math.random()*.6),{vy:-.06*U(),color:i%2?'#7fe08a':'#bfe6ff',size:st.ps*.8,life:600,shape:'plus'})},t));
      return ts},
    shatter(){const e=st.enemy;if(!e)return;e.freezeAnim=null;e.shatterT=now_();const m=enemyMetrics();if(!m)return;for(let i=0;i<26;i++){const a2=-Math.PI*Math.random(),v=(.12+Math.random()*.25)*U();spawn(m.x+(Math.random()-.5)*m.w,m.feet-Math.random()*m.h*1.3,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,g:.0014*U(),color:Math.random()<.5?'#dff4ff':'#9fd8ff',size:st.ps*(.8+Math.random()),life:700,shape:'tri'})}ring(m.x,m.feet-m.h*.5,m.h*.8,'#dff4ff',0,380,2)},
    unembrace(){const P=st.player;if(!P.embrace)return;P.embrace=null;const pm=playerMetrics();for(let i=0;i<30;i++){const a2=-Math.PI*Math.random(),v=(.12+Math.random()*.25)*U();spawn(pm.x+(Math.random()-.5)*pm.w*1.4,pm.feet-Math.random()*pm.h*1.2,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,g:.0014*U(),color:Math.random()<.5?'#dff4ff':'#9fd8ff',size:st.ps*(.8+Math.random()),life:700,shape:'tri'})}ring(pm.x,pm.feet-pm.h*.5,pm.h*.8,'#dff4ff',0,380,2)},
    zap(){const pm=playerMetrics(),m=enemyMetrics();if(!m)return;const sx=pm.x+st.H*.19,sy=pm.feet-st.H*.13,tx=m.x,ty=m.feet-m.h*.5;addFx(0,300,p=>{ctx.globalAlpha=1-p;ctx.strokeStyle='#fff6b0';ctx.shadowColor='#f2d24b';ctx.shadowBlur=st.ps*4;ctx.lineWidth=Math.max(1.5,st.ps*.5);ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(sx,sy);for(let i=1;i<=8;i++){ctx.lineTo(sx+(tx-sx)*i/8,sy+(ty-sy)*i/8+(i<8?(Math.random()-.5)*st.ps*5:0))}ctx.stroke()});ring(tx,ty,m.h*.6,'#f2d24b',60,350,1.6)},
    reflectFx(delay){setTimeout(()=>{const pm=playerMetrics(),m=enemyMetrics();st.player.reflectT=now_();if(!m)return;const sx=pm.x+H0()*.14,sy=pm.feet-pm.h*.55;for(let i=0;i<14;i++){const tt=260+Math.random()*120,tx=m.x+(Math.random()-.5)*m.w*.5,ty=m.feet-m.h*(.3+Math.random()*.4);spawn(sx,sy+(Math.random()-.5)*st.ps*4,{vx:(tx-sx)/tt,vy:(ty-sy)/tt,color:Math.random()<.5?'#ffffff':'#bfe9ff',size:st.ps*.6,life:tt,shape:'tri'})}},delay)},
    dodgeFx(delay){setTimeout(()=>{st.player.dodgeT=now_()},delay||0)},
    parryFx(delay){setTimeout(()=>{const pm=playerMetrics();ring(pm.x+pm.w*.3,pm.feet-pm.h*.6,pm.h*.35,'#ffffff',0,250,2);for(let i=0;i<10;i++){const a=Math.random()*6.283;spawn(pm.x+pm.w*.3,pm.feet-pm.h*.6,{vx:Math.cos(a)*.15*U(),vy:Math.sin(a)*.15*U(),color:'#fff6c0',size:st.ps*.5,life:300})}},delay||0)},""")

R("          ctx.fillStyle='#0d1618cc';ctx.fillRect(bx-2,by-2,bw+4,bh+4);ctx.fillStyle='#3a1a18';","          if(false){ctx.fillStyle='#0d1618cc';ctx.fillRect(bx-2,by-2,bw+4,bh+4);ctx.fillStyle='#3a1a18';")
R("Math.max(3,bh*.5))}\n          if(S.phase==='battle'){","Math.max(3,bh*.5))}}\n          if(S.foes&&S.foes.length>1&&g!==S.tgt&&g.hp>0){")
R("    if(S&&S.phase==='battle'&&!P.dead){\n      const bw=W*.09","    if(false){\n      const bw=W*.09")
R("  const itemsImg=new Image();itemsImg.src=ASSET.items;","  const itemsImg=new Image();itemsImg.src=ASSET.items;const iceImg=new Image();iceImg.src=ASSET.ice;")
R("  const itemsImg=new Image();itemsImg.src=ASSET.items;const iceImg=new Image();iceImg.src=ASSET.ice;","  const itemsImg=new Image();itemsImg.src=ASSET.items;const iceImg=new Image();iceImg.src=ASSET.ice;const embImg=new Image();embImg.src=ASSET.embrace;")
R("      ptop=feet-H*.25;\n","""      ptop=feet-H*.25;
      if(P.embrace&&embImg.complete&&embImg.naturalWidth){const tt=now-P.embrace.t0;if(tt>=0){let fi=Math.min(7,Math.floor(tt/P.embrace.dur*8));if(tt>P.embrace.dur)fi=6+Math.floor(now/450)%2;
        const eh=H*.25*1.55,ew=eh*128/123;ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalAlpha=.9;ctx.drawImage(embImg,fi*128,0,128,123,px-ew/2,feet-eh+eh*.07,ew,eh);ctx.restore();ctx.imageSmoothingEnabled=false;
        if(tt>P.embrace.dur&&Math.random()<dt/120)spawn(px+(Math.random()-.5)*ew*.6,feet-Math.random()*eh*.9,{vy:-.02*U(),color:'#ffffff',size:st.ps*.5,life:600,shape:'tri'})}}
""")
R("  let last=performance.now();","""  const H0=()=>st.H;
  const ICO=(()=>{const t=(1+Math.sqrt(5))/2,v=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(p=>{const l=Math.hypot(...p);return p.map(c=>c/l)});const e=[];for(let a=0;a<12;a++)for(let b=a+1;b<12;b++){const d=Math.hypot(v[a][0]-v[b][0],v[a][1]-v[b][1],v[a][2]-v[b][2]);if(d<1.1)e.push([a,b])}return{v,e}})();
  function drawReflect(cx,cy,r,now,el){const C=el?{g:'#f2d24b',f:'#fff6b0',b:'#c9a530',gl:'#f2d24b'}:{g:'#bfe9ff',f:'#e6f6ff',b:'#8fc8ea',gl:'#bfe9ff'};const ay=now/1400,ax=.45+Math.sin(now/2300)*.25,cy_=Math.cos(ay),sy_=Math.sin(ay),cx_=Math.cos(ax),sx_=Math.sin(ax);
    const P=ICO.v.map(([x,y,z])=>{const x1=x*cy_+z*sy_,z1=-x*sy_+z*cy_,y1=y*cx_-z1*sx_,z2=y*sx_+z1*cx_;return[cx+x1*r,cy+y1*r,z2]});
    const hit=now-(st.player.reflectT||-1e9),fl=hit<250?1-hit/250:0,pul=.75+.25*Math.sin(now/180);
    ctx.save();const gr=ctx.createRadialGradient(cx,cy,r*.2,cx,cy,r*1.15);gr.addColorStop(0,C.g+'00');gr.addColorStop(.75,C.g+'22');gr.addColorStop(1,C.g+'00');ctx.globalAlpha=.9;ctx.fillStyle=gr;ctx.beginPath();ctx.arc(cx,cy,r*1.15,0,6.283);ctx.fill();
    ctx.lineCap='round';ctx.shadowColor=C.gl;ctx.shadowBlur=st.ps*(3+fl*6);
    ICO.e.forEach(([a,b])=>{const z=(P[a][2]+P[b][2])/2;ctx.globalAlpha=(z>0?.85:.3)*pul+fl*.3;ctx.strokeStyle=z>0?C.f:C.b;ctx.lineWidth=Math.max(1,st.ps*(z>0?.38:.22))*(1+fl);ctx.beginPath();ctx.moveTo(P[a][0],P[a][1]);ctx.lineTo(P[b][0],P[b][1]);ctx.stroke()});
    ctx.shadowBlur=st.ps*4;P.forEach((p,i)=>{if(p[2]<0)return;const tw=.5+.5*Math.sin(now/120+i*1.7);ctx.globalAlpha=.6+.4*tw;ctx.fillStyle='#ffffff';const z=st.ps*(.4+.5*tw);ctx.fillRect(p[0]-z/2,p[1]-z/2,z,z)});
    const sa=(now/900)%1;ctx.globalAlpha=.35*Math.sin(sa*Math.PI);ctx.shadowBlur=0;const sg=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);sg.addColorStop(Math.max(0,sa-.12),'#ffffff00');sg.addColorStop(sa,'#ffffff');sg.addColorStop(Math.min(1,sa+.12),'#ffffff00');ctx.fillStyle=sg;ctx.beginPath();ctx.arc(cx,cy,r,0,6.283);ctx.fill();
    if(el){ctx.globalAlpha=1;ctx.shadowColor='#f2d24b';ctx.shadowBlur=st.ps*3;ctx.strokeStyle='#fff6b0';ctx.lineWidth=Math.max(1,st.ps*.3);ctx.lineJoin='round';
      const n=2+Math.floor(Math.random()*3);for(let k=0;k<n;k++){let ang=Math.random()*6.283,rr=r*.95;ctx.beginPath();ctx.moveTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr);for(let s2=0;s2<3;s2++){ang+=(Math.random()-.5)*.5;rr+=r*(.1+Math.random()*.12);ctx.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr)}ctx.stroke()}
      if(Math.random()<.3){const a2=Math.random()*6.283;spawn(cx+Math.cos(a2)*r,cy+Math.sin(a2)*r,{vx:Math.cos(a2)*.12*U(),vy:Math.sin(a2)*.12*U(),color:Math.random()<.5?'#fff6b0':'#f2d24b',size:st.ps*.45,life:260})}}
    ctx.restore()}
  let last=performance.now();""")
R("      if(S.dodge>0&&Math.random()<dt/120)","      if(S.reflect)drawReflect(px,feet-H*.13,H*.19,now);\n      if(S.efield)drawReflect(px,feet-H*.13,S.reflect?H*.23:H*.19,now+700,true);\n      if(S.dodge>0&&Math.random()<dt/120)")
R("const WC={starter_sword:-.314,steel_sword:-.316,frost_blade:-.35,dagger:-.234,battle_axe:-.194,war_spear:-.237},th=","const WC={},th=")
R("ctx.rotate(3.95+(wpn.key==='starter_sword'?0:-.4))","ctx.rotate(3.95)")
R("  let last=performance.now();",open('gear_draw.js').read()+"\n  let last=performance.now();")
R("      const wpn=S&&S.gear&&S.gear.weapon,wmode=","      if(hf.n!=='die')drawGear(true,hf.f,x0,y0,k,now,walking||!!P.act);\n      const wpn=S&&S.gear&&S.gear.weapon,wmode=")
R("      if(hf.f.hx!=null)P.handPt=","      if(hf.n!=='die')drawGear(false,hf.f,x0,y0,k,now,walking||!!P.act);\n      if(hf.f.hx!=null)P.handPt=")
import re as _re
stage='\n'.join(l.replace('ctx.imageSmoothingEnabled=true','ctx.imageSmoothingEnabled=false') if 'itemsImg' in l else l for l in stage.split('\n'))

R("(WC[wpn.key]??-.3)","(WC[wpn.key]??0)")
R("  const imgs={forest:new Image(),camp:new Image()};\n  imgs.forest.src=ASSET.forest;imgs.camp.src=ASSET.camp;","  const imgs={forest:new Image(),camp:new Image(),lava:new Image(),night:new Image()};\n  imgs.forest.src=ASSET.forest;imgs.camp.src=ASSET.camp;imgs.lava.src=ASSET.lava;imgs.night.src=ASSET.night;")
R("  const MUSH={idle:7,run:8,attack:10,hit:5,die:15,stun:18};const mushImg={},mushV={};let mushReady=false,mushLeft=Object.keys(MUSH).length;","""  const FAM={mush:{fw:80,fh:64,foot:64,bw:30,bh:33,k:.5,anims:{idle:7,run:8,attack:10,hit:5,die:15,stun:18},src:ASSET.mush},
    blood:{fw:100,fh:100,foot:60,bw:22,bh:19,k:.95,anims:{idle:6,run:8,attack:8,attack2:8,hit:4,die:4},src:ASSET.blood},
    demon:{fw:100,fh:100,foot:60,bw:22,bh:23,k:.95,anims:{idle:6,run:8,attack:7,attack2:7,hit:4,die:4},src:ASSET.demon},
    orc:{fw:100,fh:100,foot:57,bw:20,bh:16,k:.95,anims:{idle:6,run:8,attack:6,attack2:6,hit:4,die:4},src:ASSET.orc},
    soldier:{fw:100,fh:100,foot:57,bw:17,bh:18,k:.95,anims:{idle:6,run:8,attack:6,attack2:6,hit:4,die:4},src:ASSET.soldier},
    flyer:{noflip:true,fw:64,fh:64,foot:67,bw:30,bh:46,k:.5,anims:{idle:8,run:8,attack:20,attack2:26,hit:4,die:17},src:ASSET.flyer},
    golemo:{fw:90,fh:64,foot:64,bw:32,bh:38,k:.55,anims:{idle:8,run:10,attack:11,attack2:11,hit:4,die:13},src:ASSET.golemo},
    golemb:{fw:90,fh:64,foot:64,bw:32,bh:38,k:.55,anims:{idle:8,run:10,attack:11,attack2:11,hit:4,die:13},src:ASSET.golemb},
    seeker:{fw:152,fh:82,foot:54,bw:14,bh:24,k:1,anims:{idle:24,run:10,attack:8,attack2:8,hit:9,die:20},src:ASSET.seeker}};
  const famImg={},mushV={};let mushReady=false,mushLeft=0;for(const f in FAM)mushLeft+=Object.keys(FAM[f].anims).length;""")
R("  for(const n in MUSH){const im=new Image();im.onload=()=>{if(--mushLeft===0){for(const id in ENEMIES){mushV[id]={};for(const k in MUSH)mushV[id][k]=recolor(mushImg[k],ENEMIES[id])}mushReady=true}};im.src=ASSET.mush[n];mushImg[n]=im}","""  for(const f in FAM){famImg[f]={};for(const n in FAM[f].anims){const im=new Image();im.onload=im.onerror=()=>{if(--mushLeft===0){for(const id in ENEMIES){const fm=ENEMIES[id].fam||'mush';mushV[id]={};for(const k in FAM[fm].anims)if(famImg[fm][k].naturalWidth)mushV[id][k]=recolor(famImg[fm][k],ENEMIES[id])}mushReady=true}};im.src=FAM[f].src[n];famImg[f][n]=im}}""")
R("    const V=mushV[e.id],g=S&&S.enemy;let name,i;","    const V=mushV[e.id],g=S&&S.enemy,F=FAM[ENEMIES[e.id].fam||'mush'],MUSH=F.anims;let name,i;")
R("    else if(e.act){name='attack';i=Math.max(0,Math.min(MUSH.attack-1,Math.floor((now-e.act.t0)/e.act.dur*MUSH.attack)))}","    else if(e.act){name=(e.act.type==='heavy'&&MUSH.attack2)?'attack2':'attack';i=Math.max(0,Math.min(MUSH[name]-1,Math.floor((now-e.act.t0)/e.act.dur*MUSH[name])))}")
R("    else if(g&&g.stun){name='stun';i=Math.floor(now/65)%MUSH.stun}","    else if(g&&g.stun&&MUSH.stun){name='stun';i=Math.floor(now/65)%MUSH.stun}\n    else if(g&&g.stun){name='hit';i=1}")
R("    return{c:V[name],sx:(MUSH[name]-1-i)*80,key:e.id+'-'+name};","    if(!V[name])return null;return{c:V[name],sx:(MUSH[name]-1-i)*F.fw,key:e.id+'-'+name};")
R("  const FEET=0.818, SPLIT=0.808;","  const BGS={forest:{feet:.818,split:.808,sky:'#7fb6dc',gnd:'#4d8a3e'},lava:{feet:.768,split:.752,sky:'#2a0d16',gnd:'#3a1208'},night:{feet:.795,split:.758,sky:'#0a2a3a',gnd:'#14505e'}};")
R("player:{act:null,anim:null,dead:false,flash:0,flashColor:'#ff4b4b'},enemy:null,","bg:'forest',player:{act:null,anim:null,dead:false,flash:0,flashColor:'#ff4b4b'},enemy:null,")
R("  const feetY=()=>{const g=geom(imgs.forest);return g.dy+g.ih*FEET*g.s};","  const feetY=()=>{const g=geom(imgs[st.bg]||imgs.forest);return g.dy+g.ih*(BGS[st.bg]||BGS.forest).feet*g.s};")
R("""    const f=imgs.forest;
    if(f.complete&&f.naturalWidth){
      const ih=f.naturalHeight,sp=Math.round(ih*SPLIT);""","""    const f=imgs[st.bg]||imgs.forest,B=BGS[st.bg]||BGS.forest;
    if(f.complete&&f.naturalWidth){
      const ih=f.naturalHeight,sp=Math.round(ih*B.split);""")
R("    }else{ctx.fillStyle='#7fb6dc';ctx.fillRect(0,0,st.W,st.H);ctx.fillStyle='#4d8a3e';ctx.fillRect(0,feetY(),st.W,st.H)}\n    const c=imgs.camp;\n    if(st.campA>0&&","    }else{ctx.fillStyle=B.sky;ctx.fillRect(0,0,st.W,st.H);ctx.fillStyle=B.gnd;ctx.fillRect(0,feetY(),st.W,st.H)}\n    const c=imgs.camp;\n    if(st.bg==='forest'&&st.campA>0&&")
R("  const mpsOf=e=>Math.max(1,Math.round(st.ps*.5))*(ENEMIES[e.id].scale||1)*(e.elite?1.2:1);","  const famOf=e=>FAM[ENEMIES[e.id].fam||'mush'];\n  const mpsOf=e=>Math.max(1,Math.round(st.ps*famOf(e).k))*(ENEMIES[e.id].scale||1)*(e.elite?1.2:1);")
R("    return{x:homeE()+(e.dx||0),feet:feetY(),w:30*m,h:33*m,scale:ENEMIES[e.id].scale||1};","    const F=famOf(e);return{x:homeE()+(e.dx||0),feet:feetY(),w:F.bw*m,h:F.bh*m,scale:ENEMIES[e.id].scale||1};")
R("          const mps=mpsOf(e),fw=80*mps,fh=64*mps,x0=Math.round(ex-fw/2),y0=Math.round(feet-fh);","          const F=famOf(e),mps=mpsOf(e),fw=F.fw*mps,fh=F.fh*mps,x0=Math.round(ex-fw/2),y0=Math.round(feet-F.foot*mps);")
R("          shadow(ex,feet,30*mps,alpha);","          shadow(ex,feet,F.bw*mps,alpha);")
R("const draw=(c,a)=>{ctx.globalAlpha=a;ctx.drawImage(c,mf.sx,0,80,64,x0,y0,fw,fh)};","const draw=(c,a)=>{ctx.globalAlpha=a;ctx.drawImage(c,mf.sx,0,F.fw,F.fh,x0,y0,fw,fh)};")

R("          top=feet-34*mps;","          top=feet-(F.bh+1)*mps;")
R("    reset(){","    setBg(b){st.bg=b||'forest'},\n    reset(){")
R("      if(hf.f.hx!=null)P.handPt=","      P.topY=feet+oy+((hf.f.hd?hf.f.hd[1]-hf.f.hd[2]:0)-(hf.f.fy||hf.c.height))*k;\n      if(hf.f.hx!=null)P.handPt=")
R("      else if(hf.pose==='block'){sy=.94}","      else if(hf.pose==='block'){sy=.94}\n      if(P.seq&&P.seq.lift&&now<P.seq.until)oy+=P.seq.lift(now-P.seq.t0)+(hf.f.jy||0)*k*.45;")
R("      if(wpn&&wmode==='back'&&itemsImg.complete","      if(wpn&&wmode==='back'&&!(hf.n==='jump'&&wpn.key==='hunter_bow')&&itemsImg.complete")
R("      if(wpn&&wmode==='hand'&&itemsImg.complete","      if(hf.n==='jump'&&hf.f.hx!=null&&itemsImg.complete&&itemsImg.naturalWidth&&ITEM_ATLAS.idx.hunter_bow!=null){const wi=ITEM_ATLAS.idx.hunter_bow,wc=ITEM_ATLAS.cols,bsz=62*.8*k*64/58;ctx.save();ctx.imageSmoothingEnabled=true;ctx.translate(x0+hf.f.hx*k+2*k,y0+hf.f.hy*k);ctx.scale(-1,1);ctx.drawImage(itemsImg,(wi%wc)*64,Math.floor(wi/wc)*64,64,64,-bsz/2,-bsz/2,bsz,bsz);ctx.restore()}\n      if(wpn&&wmode==='hand'&&itemsImg.complete")
R("    const t=def.tint,sm=def.stem;if(!t&&!sm)return c;","    const t=def.tint,sm=def.stem,hu=def.hue;if(!t&&!sm&&!hu)return c;")
R("        if(t&&s>.35&&(h>=325||h<=22)&&l>.1&&l<.88)o=","        if(hu&&h>=hu.a&&h<=hu.b&&s>.2)o=rgb(hu.h,clamp(s*hu.s),clamp(l+hu.l));\n        else if(t&&s>.35&&(h>=325||h<=22)&&l>.1&&l<.88)o=")
R("  function enemyMetrics(){\n    const e=st.enemy;if(!e)return null;const m=mpsOf(e);\n    const F=famOf(e);return{x:homeE()+(e.dx||0),","  function enemyMetrics(){return enemyMetricsOf(st.enemy)}\n  function enemyMetricsOf(e){\n    if(!e)return null;const m=mpsOf(e);\n    const F=famOf(e);return{x:homeE()+(e.ox||0)*st.W+(e.dx||0),")
R("        if(st.enemy&&st.enemy.state==='enter')st.enemy.dx=Math.max(0,rate*(wk.dur-t));\n        if(t>=wk.dur){st.walk=null;walking=false;if(st.enemy&&st.enemy.state==='enter'){st.enemy.state='idle';st.enemy.dx=0}",
  "        st.foes.forEach(f=>{if(f.state==='enter')f.dx=Math.max(0,rate*(wk.dur-t))});\n        if(t>=wk.dur){st.walk=null;walking=false;st.foes.forEach(f=>{if(f.state==='enter'){f.state='idle';f.dx=0}})")
R("    const e=st.enemy;\n    if(e){\n      const def=ENEMIES[e.id];const m0=enemyMetrics();",
  "    st.foes.filter(f=>!f.gone).sort((a,b)=>(b.ox||0)-(a.ox||0)).forEach(e=>{\n    {\n      const def=ENEMIES[e.id];const m0=enemyMetricsOf(e);")
R("      if(e.state==='die'){const t=now-e.t0;if(t>1300)alpha=Math.max(0,1-(t-1300)/350);if(t>1650)st.enemy=null}\n      const ex=homeE()+dx;const g=S&&S.enemy;\n      if(st.enemy){",
  "      if(e.state==='die'){const t=now-e.t0;if(t>1300)alpha=Math.max(0,1-(t-1300)/350);if(t>1650)e.gone=true}\n      const ex=homeE()+(e.ox||0)*W+dx;const g=S&&(S.foes&&S.foes[e.slot]||S.enemy);\n      if(!e.gone){\n        if(S&&S.phase==='battle'&&S.foes&&S.foes.filter(f=>f.hp>0).length>1&&S.tgt===g&&e.state!=='die'){const mt=feet-m0.h*1.25-st.ps*3+Math.sin(now/200)*st.ps*.6,ms=st.ps*1.6;ctx.globalAlpha=1;ctx.fillStyle='#ffd84a';ctx.strokeStyle='#0d1618';ctx.lineWidth=Math.max(1,st.ps*.35);ctx.beginPath();ctx.moveTo(ex-ms,mt-ms);ctx.lineTo(ex+ms,mt-ms);ctx.lineTo(ex,mt+ms*.2);ctx.closePath();ctx.fill();ctx.stroke()}")
R("    // loot drop\n","    });\n    // loot drop\n")
R("    reset(){st.drop=null;st.enemy=null;","    reset(){st.drop=null;st.enemy=null;st.foes=[];")
R("      if(st.enemy&&st.enemy.state!=='die')st.enemy=null;","      st.foes=st.foes.filter(f=>f.state==='die'&&!f.gone);if(st.enemy&&st.enemy.state!=='die')st.enemy=null;")
R("      if(next&&next.fight)st.enemy={id:next.id,elite:!!next.elite,state:'enter',dx:st.W*.6};","      if(next&&next.fight){const nf=mkFoes(next,'enter');st.foes=st.foes.concat(nf);st.enemy=nf[0]}")
R("    place(n){st.walk=null;st.drop=null;if(n&&n.fight){st.enemy={id:n.id,elite:!!n.elite,state:'idle',dx:0};","    place(n){st.walk=null;st.drop=null;if(n&&n.fight){st.foes=mkFoes(n,'idle');st.enemy=st.foes[0];if(S&&S.foes)S.foes.forEach((f,i)=>{if(f.hp<=0&&st.foes[i])st.foes[i].gone=true});if(S&&S.tgt&&st.foes[S.tgt.slot])st.enemy=st.foes[S.tgt.slot];")
R("    setBg(b){st.bg=b||'forest'},","""    setBg(b){st.bg=b||'forest'},
    focus(i){if(st.foes[i])st.enemy=st.foes[i]},
    foeAt(cx,cy){const r=cv.getBoundingClientRect(),x=(cx-r.left)*st.W/r.width,y=(cy-r.top)*st.H/r.height;let best=-1,bd=1e9;st.foes.forEach((f,i)=>{if(f.gone||f.state==='die')return;const m=enemyMetricsOf(f);if(x<m.x-m.w*1.1||x>m.x+m.w*1.1||y<m.feet-m.h*1.6||y>m.feet+st.ps*2)return;const d=Math.abs(x-m.x);if(d<bd){bd=d;best=i}});return best},""")

R("  const famOf=e=>FAM[ENEMIES[e.id].fam||'mush'];","  const famOf=e=>FAM[ENEMIES[e.id].fam||'mush'];\n  st.foes=[];\n  function mkFoes(n,state){const ids=n.ids||[n.id],OX=ids.length>1?[-.075,.095]:[0];return ids.map((id,i)=>({id,elite:!!n.elite,state,dx:state==='enter'?st.W*.6:0,slot:i,ox:OX[i]||0}))}")

R("          const bw=W*.09,bh=Math.max(5,st.ps*.9),by=top-st.ps*3.5,","          const duoB=S.foes&&S.foes.length>1,bw=W*.09,bh=Math.max(5,st.ps*.9),by=duoB?feet+st.ps*2.2:top-st.ps*3.5,")
R("by2=by-bht-fsz*.45","by2=duoB?feet+st.ps*2.2:by-bht-fsz*.45")

R("    playerDie(){st.player.dead=true;st.player.act=null;st.player.anim={name:'die',t0:performance.now(),dur:700,hold:true}},","    playerDie(){st.player.dead=true;st.player.act=null;st.player.seq=null;st.player.anim={name:'die',t0:performance.now(),dur:HERO.die?1900:700,hold:true}},")

R("ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(x0+hf.f.hx*k,y0+hf.f.hy*k);ctx.rotate(th);ctx.drawImage(itemsImg,(wi%wc)*64,Math.floor(wi/wc)*64,64,64,-sz/2,-sz*.8,sz,sz);ctx.restore()}","const stf=['ember_staff','frost_wand','archmage_staff'].includes(wpn.key),dpS=Math.min(2,window.devicePixelRatio||1),up=stf&&hf.n==='idle',sh=stf?sz+20*dpS:sz;ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(x0+hf.f.hx*k+(up?7*dpS:0),y0+hf.f.hy*k);ctx.rotate(th);ctx.drawImage(itemsImg,(wi%wc)*64,Math.floor(wi/wc)*64,64,64,-sz/2,stf?-sh*.5:-sz*.8,sz,sh);ctx.restore()}")

R("    drawBg();\n    const feet=feetY();\n    // prop\n","""    drawBg();
    const feet=feetY();
    if(st.ice){const ic=st.ice,el=now-ic.t0,grow=ic.off?1:Math.min(1,el/700),fadeA=ic.off?Math.max(0,1-(now-ic.off)/600):1;
      if(ic.off&&fadeA<=0)st.ice=null;else{
      const px0=homeP(),L=Math.max(px0,W-px0)*grow,xa=Math.max(0,px0-L),xb=Math.min(W,px0+L),top=feet-st.ps*1.2,bot=feet+H*.075;
      ctx.save();ctx.globalAlpha=fadeA;ctx.beginPath();ctx.rect(xa,top-st.ps*2,xb-xa,bot-top+st.ps*2);ctx.clip();
      const gr=ctx.createLinearGradient(0,top,0,bot);gr.addColorStop(0,'#eaf8ffdd');gr.addColorStop(.25,'#9fdcffaa');gr.addColorStop(1,'#5aa8e033');ctx.fillStyle=gr;ctx.fillRect(xa,top,xb-xa,bot-top);
      ctx.fillStyle='#ffffffcc';ctx.fillRect(xa,top,xb-xa,Math.max(1,st.ps*.35));
      ctx.strokeStyle='#ffffff88';ctx.lineWidth=Math.max(1,st.ps*.22);ctx.beginPath();ic.cracks.forEach(c=>{const x=c[0]*W,y=top+c[1]*(bot-top);ctx.moveTo(x,y);ctx.lineTo(x+c[2]*st.ps*4,y+c[3]*st.ps*2);ctx.lineTo(x+c[4]*st.ps*6,y+c[5]*st.ps*2.5)});ctx.stroke();
      ic.spikes.forEach(c=>{const x=c[0]*W,h=st.ps*(1.2+c[1]*2.2),w=st.ps*(.5+c[1]*.6);ctx.fillStyle='#dff4ffee';ctx.beginPath();ctx.moveTo(x-w,top+st.ps*.4);ctx.lineTo(x,top-h);ctx.lineTo(x+w,top+st.ps*.4);ctx.closePath();ctx.fill();ctx.fillStyle='#82d4ff99';ctx.beginPath();ctx.moveTo(x,top-h);ctx.lineTo(x+w,top+st.ps*.4);ctx.lineTo(x+w*.2,top+st.ps*.4);ctx.closePath();ctx.fill()});
      const sp=(now/900)%1;ctx.fillStyle='#ffffff';ic.spikes.forEach((c,i)=>{const tw=Math.sin(now/260+i*1.7);if(tw>.85){const x=c[0]*W;ctx.globalAlpha=fadeA*(tw-.85)/.15;ctx.fillRect(x-st.ps*.25,top-st.ps*.9,st.ps*.5,st.ps*.5)}});
      ctx.restore();
      if(!ic.off&&Math.random()<dt/120)spawn(xa+Math.random()*(xb-xa),top-Math.random()*st.ps*2,{vy:-.015*U(),vx:(Math.random()-.5)*.01*U(),color:Math.random()<.5?'#ffffff':'#bfe9ff',size:st.ps*.35,life:900,shape:'plus'})}}
    // prop
""")
R("    setBg(b){st.bg=b||'forest'},","""    setBg(b){st.bg=b||'forest'},
    iceFloor(on){if(on){if(!st.ice||st.ice.off){const rr=Math.random;st.ice={t0:now_(),cracks:Array.from({length:14},()=>[rr(),.15+rr()*.7,rr()*2-1,rr()*.6-.3,rr()*2-1,rr()*.8-.2]),spikes:Array.from({length:18},()=>[rr(),rr()])}}}else if(st.ice&&!st.ice.off)st.ice.off=now_()},""")

R("    iceFloor(on){","    stoneFx(){const pm=playerMetrics();ring(pm.x,pm.feet-pm.h*.5,pm.h*.7,'#e0c08a',0,420,2.4);for(let i=0;i<14;i++){const a=Math.random()*6.283,v=(.08+Math.random()*.15)*U();spawn(pm.x+Math.cos(a)*pm.w*.5,pm.feet-pm.h*.5+Math.sin(a)*pm.h*.4,{vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.0012*U(),color:['#8a5a2b','#c09461','#6b4a2a'][i%3],size:st.ps*(.8+Math.random()*.8),life:500})}},\n    iceFloor(on){")

R("      if(now-P.flash<170){ctx.globalAlpha=.8;","      if(S&&S.stoneSkin&&S.phase==='battle'){ctx.globalAlpha=.55;ctx.drawImage(tintC(hf.key,hf.c,'#a8814f'),x0,y0,fw,fh);ctx.globalAlpha=1}\n      if(now-P.flash<170){ctx.globalAlpha=.8;")

R("          shadow(ex,feet,F.bw*mps,alpha);","          if(g&&g.mud>0&&e.state!=='die')drawMud(ex,feet,m0,e.mudT||0,now);\n          shadow(ex,feet,F.bw*mps,alpha);")

R("    stoneFx(){","    reviveFx(){const P=st.player;P.dead=false;P.anim=null;P.act=null;P.seq=null;const pm=playerMetrics();flash('#ffb04a',0,.35);ring(pm.x,pm.feet-pm.h*.5,pm.h*.9,'#ffd84a',0,600,3);ring(pm.x,pm.feet-pm.h*.5,pm.h*.6,'#ff7b3a',150,600,2);phoenixFx(0,1600);for(let i=0;i<30;i++){const a=-Math.PI*Math.random(),v=(.08+Math.random()*.2)*U();spawn(pm.x+(Math.random()-.5)*pm.w,pm.feet-st.ps,{vx:Math.cos(a)*v*.5,vy:Math.sin(a)*v,g:-.0001*U(),color:pick_(['#ffd84a','#ff7b3a','#fff0b0']),size:st.ps*(.5+Math.random()*.7),life:900,shape:'circ'})}},\n    stoneFx(){")

R("    focus(i){if(st.foes[i])st.enemy=st.foes[i]},","    focus(i){if(st.foes[i])st.enemy=st.foes[i]},\n    withFoe(i,fn){const pv=st.enemy;if(st.foes[i])st.enemy=st.foes[i];try{fn()}finally{st.enemy=pv}},")
R("          if(g&&g.mud>0&&e.state!=='die')drawMud(","          if(e.crackT&&now-e.crackT<3600)drawCracks(ex,feet,m0,e.crackT,now,e.slot||0);\n          if(g&&g.mud>0&&e.state!=='die')drawMud(")

R("    // player\n    const P=st.player;let pdx=0;","""    if(st.golem&&golemImg.complete&&golemImg.naturalWidth){const gl=st.golem,el=now-gl.t0,left=gl.until-now;if(left<=0)st.golem=null;else{
      const a=.5*Math.min(1,el/300)*Math.min(1,left/350),FW=golemImg.naturalWidth/3,FH=golemImg.naturalHeight,gh=H*.46,gw=gh*FW/FH,fi=Math.floor(now/140)%3,gx=homeP()-W*.075,gy=feet+H*.015-gh+Math.sin(now/300)*H*.006;
      ctx.save();ctx.globalAlpha=a;ctx.imageSmoothingEnabled=true;ctx.drawImage(golemImg,fi*FW,0,FW,FH,gx-gw/2,gy,gw,gh);ctx.restore();ctx.imageSmoothingEnabled=false}}
    // player
    const P=st.player;let pdx=0;""")
R("    setBg(b){st.bg=b||'forest'},","    setBg(b){st.bg=b||'forest'},\n    golem(dur){st.golem={t0:now_(),until:now_()+dur}},")
R("  const itemsImg=new Image();itemsImg.src=ASSET.items;","  const golemImg=new Image();golemImg.src=ASSET.golemsp;const itemsImg=new Image();itemsImg.src=ASSET.items;")

R("          draw(mf.c,alpha);","          draw(mf.c,alpha);\n          if(st.bg==='night')draw(tintC(mf.key,mf.c,'#081624'),.45*alpha);")

R("  function recolor(img,def){","  function recolor(img,def,noflip){")
R("    x.translate(c.width,0);x.scale(-1,1);x.drawImage(img,0,0);x.setTransform(1,0,0,1,0,0);","    if(noflip)x.drawImage(img,0,0);else{x.translate(c.width,0);x.scale(-1,1);x.drawImage(img,0,0);x.setTransform(1,0,0,1,0,0)}")
R("mushV[id][k]=recolor(famImg[fm][k],ENEMIES[id])","mushV[id][k]=recolor(famImg[fm][k],ENEMIES[id],FAM[fm].noflip)")
R("sx:(MUSH[name]-1-i)*F.fw","sx:(F.noflip?i:MUSH[name]-1-i)*F.fw")
R("  const FAM={mush:{fw:80,","  const FAM={mush:{noflip:true,fw:80,")

R("      const big=R.fx.length===2&&R.fx[0]===R.fx[1];\n","""      const big=R.fx.length===2&&R.fx[0]===R.fx[1];
      if(R.lstrike){const P=st.player,ch=1200,T=now_();P.anim=null;P.act=null;st.player.aura={els:['lightning'],t0:T,dur:ch};lsAura(0,ch+40);
        const bx=()=>{const mm=enemyMetrics();return mm?mm.x+mm.w*.5+st.H*.07:st.W*.8};
        P.tele={t0:T,out:ch,arrive:ch+160,back:ch+760,home:ch+900,x:bx};
        lsBlink(pm.x,pm.feet,pm.h,ch);flash('#bff4ff',ch,.3);
        setTimeout(()=>{const x=bx();lsBlink(x,pm.feet,pm.h,0);P.anim={name:'punch',t0:now_(),dur:420}},ch+160);
        setTimeout(()=>{const mm=enemyMetrics();if(!mm)return;const y=mm.feet-mm.h*.5,hx=mm.x+mm.w*.15;ring(hx,y,mm.h*.8,'#5fd8ff',0,420,2.4);ring(hx,y,mm.h*.5,'#ffffff',60,360,1.6);flash(R.crit?'#ffffff':'#bff4ff',0,R.crit?.45:.25);shake(0,st.ps*(R.crit?3.5:2));bolt(mm.x,mm.feet-mm.h*.2,0);
          for(let i=0;i<26;i++){const a2=Math.PI+(Math.random()-.5)*2.4,v=(.12+Math.random()*.28)*U();spawn(hx,y,{vx:Math.cos(a2)*v,vy:Math.sin(a2)*v,color:i%3?'#5fd8ff':'#fff6b0',size:st.ps*.7,life:420})}},ch+360);
        setTimeout(()=>{lsBlink(bx(),pm.feet,pm.h,0)},ch+760);setTimeout(()=>{const p2=playerMetrics();lsBlink(p2.x,p2.feet,p2.h,0)},ch+900);
        return ch+380;}
""")
R("    P.dx=pdx;const px=homeP()+pdx;let ptop;","    P.teleFlip=false;if(P.tele){const tt=now-P.tele.t0;if(tt>P.tele.home)P.tele=null;else if(tt>=P.tele.out&&tt<P.tele.arrive||tt>=P.tele.back)pdx=-1e5;else if(tt>=P.tele.arrive){pdx=P.tele.x()-homeP();P.teleFlip=true}}\n    P.dx=pdx;const px=homeP()+pdx;let ptop;")
R("else{ctx.translate(px+ox,feet+oy);ctx.rotate(rot);ctx.scale(1,sy)}","else{ctx.translate(px+ox,feet+oy);ctx.rotate(rot);ctx.scale(P.teleFlip?-1:1,sy)}")
R("ctx.font=`700 ${fs*sc}px","ctx.font=`700 ${fs*sc*(f.sub&&f.sub.startsWith('CRIT')?1.5:1)}px")

css_add="""
.item-ic{image-rendering:pixelated}
.card-mana{font-family:var(--f-num);font-weight:700;font-size:14px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#e8f3ff;background:radial-gradient(circle at 35% 30%,#6cb2ff,#2a5fc0 70%);border:1px solid #9fcaff;box-shadow:0 0 6px #4aa8ff88}
.hand-meta{align-items:center;flex-wrap:wrap}
.skip-btn{pointer-events:auto;border-color:#4a78b8;color:#cfe4ff;background:#16243a}.skip-btn:hover{background:#1d3150;border-color:#6cb2ff}.skip-btn .num{color:#6cb2ff;margin-left:4px}
.card-mana.free{background:var(--felt);color:var(--muted);border-color:var(--line);box-shadow:none}
.card-mana.gain{width:auto;min-width:24px;padding:0 4px;border-radius:999px;background:radial-gradient(circle at 35% 30%,#3a4f6e,#1d2a3e 70%);color:#9fcaff;border-color:#4a78b8;box-shadow:none;font-size:13px}
.ev-cards .card-mana,.card.small .card-mana{width:20px;height:20px;font-size:12px}
:root{--water:#4aa8ff;--wind:#bff5d8;--lightning:#f2d24b;--dark:#b18bff;--light:#fff0b3}
.btn-sm{padding:5px 10px;font-size:13px}
.player-head{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.card{height:174px}
.card-lv{display:flex;gap:3px;align-items:center;margin:3px 0 1px}
.pip{width:7px;height:7px;border-radius:50%;background:var(--line)}
.pip.on{background:var(--brass)}
.card-lv i{font-style:normal;font-family:var(--f-num);font-size:12px;font-weight:600;color:var(--rare);margin-left:3px}
.card.granted{border-style:dashed}
.card.small{width:96px;height:146px;padding:6px 7px}
.card.small .card-icon svg{width:30px;height:30px}
.card.small .card-name{font-size:15px}
.card.small .card-desc{display:none}
.intent-ic{display:grid;place-items:center;color:var(--ink)}
.intent-ic svg{width:22px;height:22px}
.intent.heavy .intent-ic{color:var(--danger)}
.intent{flex-wrap:wrap}
.intent-note{font-size:12px;color:var(--muted)}
.chip svg{width:12px;height:12px}
.node-dot svg{width:14px;height:14px}
.node.k-boss .node-dot{width:32px;height:32px;border-color:var(--fire);color:var(--fire)}
.node.k-elite .node-dot{border-color:color-mix(in srgb,var(--epic) 60%,var(--line));color:var(--epic)}
.node.k-camp .node-dot{color:var(--fire)} .node.k-chest .node-dot{color:var(--brass)} .node.k-ev .node-dot{color:var(--rare)}
.node.done .node-dot{color:var(--ink)}
.toast{background:var(--panel-2);border:1px solid var(--brass-dim);border-radius:8px;padding:8px 12px;font-size:14px}
.modal-box.wide{max-width:920px}
.acq-head{display:flex;gap:16px;align-items:center;margin:10px 0 14px;flex-wrap:wrap}
.acq-head .card{cursor:default}
.acq-head .card:hover{transform:none;box-shadow:none}
.char-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:6px}
.char-stats div{background:var(--felt-2);border:1px solid var(--line);border-radius:6px;padding:8px 10px;display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:13px;color:var(--muted)}
.char-stats b{color:var(--ink);font-size:16px}
.sec-h{font-size:20px;margin:18px 0 8px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.equip{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
.eslot.empty{border:1px dashed var(--line);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:2px;color:var(--muted);font-size:13px;min-height:72px;justify-content:center}
.icard{display:flex;gap:10px;align-items:flex-start;background:var(--felt-2);border:1px solid var(--line);border-radius:8px;padding:10px;height:100%}
.icard.rare{border-color:color-mix(in srgb,var(--rare) 55%,transparent)} .icard.epic{border-color:color-mix(in srgb,var(--epic) 60%,transparent)}
.icard-body{min-width:0;display:flex;flex-direction:column;gap:2px}
.icard-body b{font-family:var(--f-display);font-size:17px}
.icard .stats{font-size:12px}
.hand-zone{position:relative;z-index:6;margin-top:-104px;display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none}
.fan{display:flex;justify-content:center;align-items:flex-end;pointer-events:auto;padding:34px 30px 0}
.fan .card{width:108px;height:166px;margin:0 -3px;transform-origin:50% 130%;transform:rotate(var(--rot,0deg)) translateY(var(--ty,0px));box-shadow:0 10px 24px #000b;background:linear-gradient(170deg,color-mix(in srgb,var(--tc) 26%,var(--panel)) 0%,var(--panel) 55%,var(--felt-2) 100%)}
.fan .card:hover{transform:rotate(var(--rot,0deg)) translateY(calc(var(--ty,0px) - 16px));z-index:3}
.fan .card.is-sel{transform:rotate(var(--rot,0deg)) translateY(calc(var(--ty,0px) - 30px));z-index:4;box-shadow:0 0 0 2px var(--brass),0 14px 28px #000c}
.fan.locked .card{pointer-events:none;filter:saturate(.6) brightness(.8)}
.hand-zone .hand-meta{pointer-events:auto;margin-top:2px}
#resultLayer{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:min(390px,calc(100% - 24px));z-index:4;display:flex;justify-content:center;pointer-events:none}
#resultLayer>*{pointer-events:auto}
.rhint{background:#0d1618d0;border:1px solid #ffffff2a;border-radius:999px;padding:6px 14px;font-size:13px;color:var(--ink);font-weight:600}
.rcard{width:auto;max-width:100%;min-width:230px;background:#0d1618eb;border:1px solid var(--brass-dim);border-radius:10px;padding:8px 10px;box-shadow:0 10px 26px #000b;display:flex;flex-direction:column;gap:6px}
.rcard.busy{border-color:var(--brass)}
.rc-top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.rc-dmg{font-size:22px;font-weight:700;color:var(--ink)}
.rc-dmg small{font-size:11px;color:var(--muted);margin-left:2px;letter-spacing:.08em;text-transform:uppercase}
.rc-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
.rcard h3{font-size:21px;color:var(--brass);line-height:1;margin:0;display:flex;align-items:center;gap:6px;min-width:0}
.rcard .new-tag{margin-left:0}
.rc-desc{margin:0;font-size:12.5px;line-height:1.35;color:var(--muted);max-width:360px}
.rc-fx{display:flex;flex-wrap:wrap;gap:4px}
.rfx{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:999px;background:#ffffff0d;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);font-size:12px;line-height:1.3;color:var(--ink)}
.rfx svg{width:12px;height:12px;color:var(--c);flex:0 0 auto}
.rcard ul{list-style:none;margin:6px 0 9px;padding:0;font-size:12.5px;display:flex;flex-direction:column;gap:2px}
.rcard li{display:flex;gap:6px;align-items:center}
.rcard li svg{width:13px;height:13px;flex:0 0 auto}
.rc-actions{display:flex;gap:8px}
.rc-actions .btn{padding:5px 12px;font-size:13px}
.stage-wrap.in-battle .stage-label{display:none}
#hudLayer{position:absolute;inset:0;pointer-events:none;z-index:5}
.hud{position:absolute;top:10px;display:flex;flex-direction:column;gap:3px;--s:2.0;max-width:44%;pointer-events:auto}
.hud-hero{left:10px;align-items:flex-start}
.hud-mon{right:10px;align-items:flex-end;text-align:right}
.hbw{position:relative;width:calc(123px*var(--s));max-width:100%;aspect-ratio:123/34;filter:drop-shadow(0 2px 3px #000a)}
.hb{position:absolute;inset:0}
.hbw.mir .hb{transform:scaleX(-1)}
.hbt{position:absolute;background:#0d1618d0}
.hbl{position:absolute;inset:0;background-size:100% 100%;background-repeat:no-repeat;image-rendering:pixelated;transition:clip-path .45s ease}
.hbf{background-image:var(--hb-frame)} .hbg{background-image:var(--hb-g)} .hbb{background-image:var(--hb-b)} .hbr{background-image:var(--hb-r)}
.hb-emb{position:absolute;left:12.6%;top:48.5%;transform:translate(-50%,-50%);display:grid;place-items:center;width:18%}
.hbw.mir .hb-emb{left:auto;right:12.6%;transform:translate(50%,-50%)}
.hb-emb svg{width:100%;height:auto;max-width:calc(15px*var(--s))}
.hb-hp,.hb-bl{position:absolute;right:4%;font-weight:700;color:#fff;line-height:1;text-shadow:0 1px 0 #000,1px 0 0 #000,-1px 0 0 #000,0 -1px 0 #000}
.hb-hp{top:20.6%;height:20.6%;font-size:calc(7.6px*var(--s));display:flex;align-items:center}
.hb-bl{top:52.9%;height:20.6%;font-size:calc(6.4px*var(--s));display:flex;align-items:center;color:#e6f2ff}
.hbw.mir .hb-hp,.hbw.mir .hb-bl{right:auto;left:4%}
.hud-cap{display:flex;align-items:baseline;gap:8px;background:#0d1618c8;padding:2px 8px;border-radius:6px}
.hud-name{font-family:var(--f-display);font-size:16px;color:var(--ink);white-space:nowrap}
.hud-int{display:inline-flex;align-items:center;gap:3px;font-size:12px;color:var(--ink);padding-left:6px;border-left:1px solid var(--line)}
.hud-int svg{width:13px;height:13px}.hud-int b{font-size:14px}.hud-int.heavy{color:#ff8a7a}
.hud-foe{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:flex-end;gap:2px;--s:1.25;margin-top:4px;opacity:.85}.hud-foe:hover,.hud-foe:focus-visible{opacity:1;outline:1px solid var(--brass);border-radius:6px}.hud-foe .hud-name{font-size:13px}
.hud-mini{display:flex;flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:3px;background:#0d1618c8;padding:3px 6px;border-radius:6px;max-width:100%}
.mc{display:inline-flex;align-items:center;gap:2px;font-family:var(--f-num);font-size:11px;font-weight:600;padding:0 5px;border-radius:999px;border:1px solid var(--line);line-height:16px}
.mc svg{width:10px;height:10px}
.mc.weak{color:var(--ok);border-color:color-mix(in srgb,var(--ok) 55%,transparent)}.mc.res{color:#f0928a;border-color:color-mix(in srgb,var(--danger) 50%,transparent)}.mc.imm{color:var(--muted)}.mc.unk{color:var(--muted);border-style:dashed}
.mc.st{color:var(--c);border-color:color-mix(in srgb,var(--c) 55%,transparent)}
.ml{font-family:var(--f-num);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-left:3px}
.hud .intent{margin:0;padding:4px 9px;background:#0d1618d9}
.hud .intent b{font-size:16px}
.hud .chips{margin:0;justify-content:flex-end}
.hud .chip{background:#0d1618d9}
.hud .aff{margin:0;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:4px 6px;background:#0d1618c8;padding:4px 8px;border-radius:8px;align-items:center}
.hud .aff .chips{flex-wrap:wrap}
@media (max-width:1000px){.hud{--s:1.6}.stage-wrap #resultLayer{top:150px}.stage-wrap.in-battle{aspect-ratio:1.35/1}}

.mon-info{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;padding:10px 14px}
.mon-info .mi-head{display:flex;flex-direction:column;gap:0;min-width:0}
.mon-info .enemy-name{font-size:20px;line-height:1.1}
.mon-info .intent{margin:0;padding:5px 10px}
.mon-info .intent b{font-size:16px}
.mon-info .chips{margin:0}
.mon-info .aff{margin:0;grid-template-columns:auto auto auto auto;gap:4px 8px}
.pstatus{pointer-events:auto;display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:2px}.pstatus .chips{margin:2px 0 0;justify-content:center}
.drop-layer{position:absolute;inset:0;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px;background:radial-gradient(ellipse at center,#0d1618a8 0%,#0d1618e6 100%)}
.drop-title{font-family:var(--f-display);font-size:24px;font-weight:700;color:var(--brass);text-align:center;text-wrap:balance}
.drop-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.drop-row .card{width:112px;height:174px;box-shadow:0 10px 24px #000b}
.drop-sub{font-size:12px;color:var(--muted);text-align:center;max-width:52ch}
.icard-face .card-icon{min-height:0}
.icard-face .card-name{font-size:16px;line-height:1.05}
.icard-face .card-desc{font-size:10px;line-height:1.25;overflow:hidden;color:var(--ok);display:block}
.icard-face .card-desc i{display:block;font-style:normal;color:var(--muted);margin-top:2px}
.icard-face .rar{font-size:9px;padding:0 5px}
.icard-face.rare{box-shadow:0 0 0 1px var(--rare),0 10px 24px #000b}
.icard-face.epic{box-shadow:0 0 0 1px var(--epic),0 0 18px color-mix(in srgb,var(--epic) 35%,transparent),0 10px 24px #000b}
.stage-wrap.in-drop .stage-label{display:none}
.ev-layer{position:absolute;inset:0;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:14px;overflow-y:auto;background:linear-gradient(180deg,#0d1618cc 0%,#0d161899 45%,#0d1618d9 100%)}
.ev-head{display:flex;gap:12px;align-items:center;max-width:620px}
.ev-hic{width:44px;height:44px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;background:#0d1618cc;border:1px solid var(--brass-dim);color:var(--brass)}
.ev-hic svg{width:24px;height:24px}
.ev-head h2{font-size:26px;color:var(--brass);line-height:1.05}
.ev-head p{margin:2px 0 0;font-size:13px;color:var(--ink);opacity:.85;max-width:56ch}
.ev-opts{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.ev-opt{width:150px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;padding:12px 10px;border-radius:12px;border:1px solid color-mix(in srgb,var(--oc) 45%,var(--line));background:#0d1618d9;cursor:pointer;transition:transform .15s,box-shadow .15s,border-color .15s}
.ev-opt:hover{transform:translateY(-4px);box-shadow:0 10px 22px #000a;border-color:var(--oc)}
.ev-ic{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;color:var(--oc);background:color-mix(in srgb,var(--oc) 14%,#0d1618);border:1px solid color-mix(in srgb,var(--oc) 55%,transparent)}
.ev-ic svg{width:28px;height:28px}
.ev-opt b{font-size:15px}
.ev-opt span:not(.ev-ic){font-size:11.5px;line-height:1.3;color:var(--muted)}
.ev-msg{margin:0;font-size:16px;text-align:center;max-width:52ch;background:#0d1618cc;padding:8px 14px;border-radius:8px}
.ev-hint{margin:0;font-size:13px;text-align:center}
.ev-cards{justify-content:center;gap:8px}
.ev-cards .card.small{width:84px;height:124px}
.ev-layer .btn svg{width:14px;height:14px;vertical-align:-2px;margin-left:4px}
.ev-layer .loot{background:#0d1618e0}
.reward-row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start}
.rw{display:flex;flex-direction:column;align-items:center;gap:6px}
.ichoice{width:190px;min-height:174px;text-align:left;display:flex;flex-direction:column;gap:3px;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--felt-2);cursor:pointer;transition:transform .15s,box-shadow .15s}
.ichoice:hover{transform:translateY(-4px);box-shadow:0 8px 18px #0008}
.ichoice.rare{border-color:color-mix(in srgb,var(--rare) 60%,transparent)} .ichoice.epic{border-color:color-mix(in srgb,var(--epic) 65%,transparent)}
.ichoice b{font-family:var(--f-display);font-size:18px}
.ichoice .stats{font-size:12px}
@media (max-width:760px){.card{height:156px}.card.small{width:88px;height:136px}.ichoice{width:160px}
  .stage-wrap.in-battle,.stage-wrap.in-drop{aspect-ratio:.78/1}
  .hud{--s:1.3;max-width:48%;top:6px;gap:3px}.hud-hero{left:6px}.hud-mon{right:6px}.stage-wrap #resultLayer{top:150px}.hud-name{font-size:14px}.hud .intent{padding:2px 6px;font-size:12px}.hud .intent b{font-size:13px}.hud .intent .eyebrow{display:none}.hud .chip{font-size:10px;padding:1px 5px}.hud .aff{padding:2px 5px}.hud .aff .eyebrow{font-size:9px}.hud-cap .eyebrow{font-size:9px}
  .ev-opt{width:calc(50% - 6px);padding:10px 8px}.ev-head h2{font-size:21px}.ev-cards .card.small{width:72px;height:110px}.ev-cards .card-cat{font-size:8px;letter-spacing:.04em}.ev-cards .card-pow{width:20px;height:20px;font-size:12px}
  .drop-row{gap:8px}.drop-row .card{width:96px;height:156px}.drop-title{font-size:18px}
  .hand-zone{margin-top:-70px}.fan{padding:28px 8px 0}.fan .card{width:80px;height:124px;margin:0 -2px;padding:6px}.fan .card .card-desc{display:none}.fan .card .card-icon svg{width:30px;height:30px}.fan .card .card-name{font-size:15px}
  #resultLayer{top:6px}.rcard{padding:8px 10px}.rcard h3{font-size:19px}.rcard ul{font-size:11.5px;margin:4px 0 6px}.rcard h3{font-size:18px}.rc-desc{font-size:11.5px}.rc-actions .btn{padding:5px 10px;font-size:13px}.rc-dmg{font-size:18px}}

.mob-btn.on{background:var(--brass);color:#141a1c;border-color:var(--brass)}
#mobDock:empty{display:none}
body.mob #mobDock{margin-top:12px}
body.mob #mobDock .drop-layer,body.mob #mobDock .ev-layer{position:static;inset:auto;border-radius:12px;border:1px solid var(--line);padding:16px 10px;gap:14px;overflow:visible;background:var(--felt-2,#0d1618)}
body.mob #mobDock .drop-title{font-size:26px}
body.mob #mobDock .drop-sub{font-size:14px}
body.mob #mobDock .drop-row{gap:12px}
body.mob #mobDock .drop-row .card{width:min(204px,calc(50% - 8px));height:auto;aspect-ratio:.64}
body.mob #mobDock .card .card-name{font-size:24px}body.mob #mobDock .card .card-desc{font-size:14.5px}body.mob #mobDock .card .card-cat{font-size:12px}
body.mob #mobDock .icard-face .card-desc{font-size:15.5px}
body.mob #mobDock .ev-head h2{font-size:26px}body.mob #mobDock .ev-head p{font-size:15px}
body.mob #mobDock .ev-opt{width:min(220px,calc(50% - 6px));padding:14px 10px}
body.mob #mobDock .ev-opt b{font-size:18px}body.mob #mobDock .ev-opt span:not(.ev-ic){font-size:14px}
body.mob #mobDock .ev-ic{width:62px;height:62px}body.mob #mobDock .ev-ic svg{width:34px;height:34px}
body.mob #mobDock .ev-msg{font-size:17px}body.mob #mobDock .btn{font-size:16px;padding:10px 18px}
body.mob #mobDock .ev-cards .card.small{width:96px;height:146px}
body.mob .hand-zone{margin-top:12px}
body.mob .fan{flex-wrap:wrap;gap:10px;padding:14px 0 0;width:100%}
body.mob .fan .card{transform:none;margin:0;width:min(180px,calc(40% - 6px));height:auto;aspect-ratio:.62;padding:10px}
body.mob .fan .card:hover{transform:translateY(-6px)}
body.mob .fan .card.is-sel{transform:translateY(-10px)}
body.mob .fan .card .card-desc{display:block;font-size:14.5px}
body.mob .fan .card .card-name{font-size:23px}body.mob .card .card-pow{width:28px;height:28px;font-size:16px}
body.mob .fan .card .card-cat{white-space:nowrap;font-size:12px;letter-spacing:.06em}
body.mob .fan .card .card-icon svg{width:48px;height:48px}
body.mob .hand-meta{font-size:14px}body.mob .skip-btn{font-size:15px;padding:8px 14px}
#mobFuse:empty{display:none}
#mobFuse{display:flex;flex-direction:column;align-items:flex-end;gap:10px;position:fixed;z-index:30;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px))}
#mobFuse .btn{font-size:22px;font-weight:700;padding:16px 30px;border-radius:14px;box-shadow:0 10px 28px #000c,0 0 0 2px #0d1618}
body.mob #app{padding-bottom:160px}
#mobFuse .skip-btn{font-size:17px;padding:10px 18px;background:#0d1618f2}
"""
head2='<meta charset="utf-8">\n'+head.replace('</style>',css_add+'</style>')
body_skel=body_skel.replace('<div class="stage-label" id="stageLabel"></div>','<div class="stage-label" id="stageLabel"></div><div id="hudLayer"></div><div id="resultLayer"></div><div id="dropLayer"></div>')
js='<script>\n/*__ASSETS__*/\n(()=>{\ntry{const rs=document.documentElement.style;rs.setProperty(\'--items-url\',`url("${ASSET.items}")`);[[\'frame\',\'hbFrame\'],[\'g\',\'hbG\'],[\'b\',\'hbB\'],[\'r\',\'hbR\']].forEach(([k,a])=>rs.setProperty(\'--hb-\'+k,`url("${ASSET[a]}")`))}catch(e){}\n'+open('logic_data.js').read()+'\n'+sprites+atlas+'\nlet S;\n'+stage+'\n'+open('logic_game.js').read()+'\n})();\n</script>\n'
open('fusebound.src.html','w').write(head2+body_skel+js)
print('ok')
