  function drawGear(back,f,x0,y0,k,now,moving){
    if(!S||!S.gear||!f.hd)return;
    const g=S.gear,LK=s=>g[s]&&ITEM_LOOK[g[s].key];
    const hx=x0+f.hd[0]*k,hy=y0+f.hd[1]*k,r=f.hd[2]*k;
    const nk=f.nk?[x0+f.nk[0]*k,y0+f.nk[1]*k]:[hx,hy+r*1.2];
    const hp=f.hp?[x0+f.hp[0]*k,y0+f.hp[1]*k]:[nk[0],nk[1]+r*2.5];
    let ux=hp[0]-nk[0],uy=hp[1]-nk[1];const ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;let nx=-uy,ny=ux;if(nx<0){nx=-nx;ny=-ny}
    const A=(p,a,b)=>[p[0]+ux*a+nx*b,p[1]+uy*a+ny*b];
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';const lw=Math.max(1,r*.13),OL='#1b1820';
    const poly=(pts,fill)=>{ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw;ctx.stroke()};
    const line=(p,q,col,w)=>{ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke()};
    // glowing specks around rare (light blue) / epic (light purple) gear
    const SPK={rare:['#8fd3ff','#e2f6ff'],epic:['#d9b8ff','#f6ecff']};
    const spk=(slot,p,sw,sh,seed)=>{const it=g[slot];if(!it||!SPK[it.rarity]||P_DEAD())return;const cols=SPK[it.rarity],n=it.rarity==='epic'?8:5,sz=Math.max(2,r*.2);
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor=cols[0];ctx.shadowBlur=sz*3;
      for(let i=0;i<n;i++){const h=Math.sin((seed+1)*12.9898+i*78.233)*43758.5453,fr=h-Math.floor(h),per=1100+fr*700,ph=((now+fr*per*3)/per)%1,cyc=Math.floor((now+fr*per*3)/per),h2=Math.sin(cyc*3.7+i*9.1+seed)*1e4,jx=(h2-Math.floor(h2)-.5)*sw;
        ctx.globalAlpha=Math.min(1,1.6*Math.sin(ph*Math.PI))*(.75+.25*Math.sin(now/90+i));ctx.fillStyle=i%2?cols[1]:cols[0];const q=sz*(i%3===0?1.3:1);ctx.fillRect(p[0]+jx-q/2,p[1]+sh*.5-ph*sh-q/2,q,q)}
      ctx.restore()};
    const P_DEAD=()=>st.player&&st.player.dead;
    if(back){
      const c=LK('cape');
      if(c){const C=(a,b)=>A(nk,(ul+a)*.9,b);const sw=Math.sin(now/260)*r*(moving?.7:.25),sw2=Math.sin(now/260+1.3)*r*(moving?.5:.2);
        const t1=A(nk,-.3*r,-.85*r),t2=A(nk,-.1*r,.3*r),b1=C(1.7*r,-.1*r),b2=C(2.0*r,-2.2*r-sw),mid=C(.4*r,-1.75*r-sw2);
        ctx.beginPath();ctx.moveTo(...t1);ctx.lineTo(...t2);ctx.quadraticCurveTo(...C(.3*r,.15*r),...b1);ctx.lineTo(...b2);ctx.quadraticCurveTo(...mid,...t1);ctx.closePath();
        ctx.fillStyle=c.a;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw;ctx.stroke();
        ctx.save();ctx.clip();line(A(nk,.2*r,-1.05*r),C(2.0*r,-2.5*r-sw),c.b,r*.7);line(A(nk,.3*r,-.1*r),C(1.6*r,-.35*r),c.c,r*.14);ctx.restore();
        ctx.beginPath();ctx.arc(...A(nk,0,0),r*.22,0,6.283);ctx.fillStyle=c.d;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw*.8;ctx.stroke();spk('cape',A(nk,1.1*r,-1.3*r),r*1.6,r*2.4,7)}
      ctx.restore();return;
    }
    const ch=LK('chest');
    if(ch){const dp=Math.min(2,window.devicePixelRatio||1),cut=10*dp,hb=A(hp,.22*r-cut,0),L2=Math.max(r,Math.hypot(hb[0]-nk[0],hb[1]-nk[1]));
      const TL=A(nk,.02*r,-.66*r),TR=A(nk,.02*r,.7*r),BR=A(hb,0,.48*r),BL=A(hb,0,-.48*r),NK=A(nk,.34*r,.08*r);
      ctx.beginPath();ctx.moveTo(...TL);ctx.quadraticCurveTo(...A(nk,.22*r,-.15*r),...NK);ctx.quadraticCurveTo(...A(nk,.22*r,.35*r),...TR);ctx.quadraticCurveTo(...A(nk,L2*.55,.82*r),...BR);ctx.lineTo(...BL);ctx.quadraticCurveTo(...A(nk,L2*.55,-.78*r),...TL);ctx.closePath();
      const cg=ctx.createLinearGradient(...A(nk,L2*.4,-.75*r),...A(nk,L2*.4,.75*r));cg.addColorStop(0,ch.b);cg.addColorStop(.5,ch.a);cg.addColorStop(.85,ch.c);cg.addColorStop(1,ch.a);
      ctx.fillStyle=cg;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw;ctx.stroke();
      ctx.save();ctx.clip();
      [.62,.82].forEach(f=>line(A(nk,L2*f,-.9*r),A(nk,L2*f,.9*r),ch.b,Math.max(1,r*.09)));
      line(A(nk,.42*r,.22*r),A(hb,-.1*r,.18*r),ch.c,Math.max(1,r*.09));
      line(A(nk,.12*r,-.75*r),A(NK,0,-.05*r),OL,Math.max(1,r*.08));line(A(NK,0,.05*r),A(nk,.12*r,.8*r),OL,Math.max(1,r*.08));
      line(A(hb,-.06*r,-.8*r),A(hb,-.06*r,.8*r),ch.d,r*.2);
      ctx.restore();
      ctx.fillStyle=ch.d;[A(nk,.3*r,-.44*r),A(nk,.3*r,.5*r),A(hb,-.06*r,-.32*r),A(hb,-.06*r,.36*r)].forEach(p=>{ctx.fillRect(p[0]-r*.06,p[1]-r*.06,r*.12,r*.12)});
      const e=A(nk,L2*.38,.14*r);ctx.beginPath();ctx.moveTo(e[0],e[1]-r*.2);ctx.lineTo(e[0]+r*.15,e[1]);ctx.lineTo(e[0],e[1]+r*.2);ctx.lineTo(e[0]-r*.15,e[1]);ctx.closePath();ctx.fillStyle=ch.d;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=Math.max(1,lw*.6);ctx.stroke()}
    const bt=LK('belt');
    if(bt){const bp=[hp[0],hp[1]-10*Math.min(2,window.devicePixelRatio||1)];line(A(bp,-.05*r,-.62*r),A(bp,-.05*r,.62*r),OL,r*.5);line(A(bp,-.05*r,-.58*r),A(bp,-.05*r,.58*r),bt.a,r*.32);const bk=A(bp,-.05*r,.18*r);ctx.fillStyle=bt.d;ctx.strokeStyle=OL;ctx.lineWidth=lw*.8;ctx.beginPath();ctx.rect(bk[0]-r*.17,bk[1]-r*.2,r*.34,r*.4);ctx.fill();ctx.stroke()}
    const nkI=LK('neck');
    if(nkI){if(nkI.t==='torc'){ctx.beginPath();ctx.ellipse(...A(nk,.15*r,0),r*.62,r*.24,Math.atan2(ny,nx),0,6.283);ctx.strokeStyle=OL;ctx.lineWidth=r*.34;ctx.stroke();ctx.strokeStyle=nkI.a;ctx.lineWidth=r*.2;ctx.stroke()}
      else{const gp=A(nk,.8*r,.12*r);line(A(nk,-.05*r,-.35*r),gp,nkI.d,Math.max(1,r*.09));line(A(nk,-.05*r,.45*r),gp,nkI.d,Math.max(1,r*.09));ctx.beginPath();ctx.arc(gp[0],gp[1]+r*.12,r*.24,0,6.283);ctx.fillStyle=nkI.a;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw*.8;ctx.stroke();ctx.fillStyle=nkI.c;ctx.fillRect(gp[0]-r*.1,gp[1]+r*.02,r*.09,r*.09)}}
    const pd=LK('shoulders');
    if(pd){const s0=A(nk,.08*r,.05*r),s=[s0[0]-10*Math.min(2,window.devicePixelRatio||1),s0[1]];ctx.beginPath();ctx.ellipse(s[0],s[1],r*.72,r*.45,Math.atan2(ny,nx),0,6.283);ctx.fillStyle=pd.a;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw;ctx.stroke();ctx.save();ctx.clip();line(A(s,.12*r,-.7*r),A(s,.12*r,.7*r),pd.d,r*.18);line(A(s,-.22*r,-.4*r),A(s,-.22*r,.2*r),pd.c,r*.1);ctx.restore()}
    const ch2=LK('charm');
    if(ch2){const p=A(hp,.45*r,-.72*r);
      if(ch2.t==='lantern'){line(A(hp,0,-.6*r),p,'#3a3e45',Math.max(1,r*.08));const gl=ctx.createRadialGradient(p[0],p[1]+r*.35,0,p[0],p[1]+r*.35,r*1.1);gl.addColorStop(0,(ch2.c||'#ffd84a')+'88');gl.addColorStop(1,(ch2.c||'#ffd84a')+'00');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(p[0],p[1]+r*.35,r*1.1,0,6.283);ctx.fill();
        ctx.fillStyle='#3a3e45';ctx.strokeStyle=OL;ctx.lineWidth=lw*.8;ctx.beginPath();ctx.rect(p[0]-r*.22,p[1],r*.44,r*.62);ctx.fill();ctx.stroke();ctx.fillStyle=(Math.sin(now/90)>-.6)?'#ffd84a':'#ffb02a';ctx.fillRect(p[0]-r*.13,p[1]+r*.12,r*.26,r*.38)}
      else{ctx.beginPath();ctx.arc(p[0],p[1]+r*.3,r*.3,0,6.283);ctx.fillStyle=ch2.a;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw*.8;ctx.stroke();ctx.fillStyle=ch2.d;ctx.fillRect(p[0]-r*.15,p[1]+r*.2,r*.1,r*.1);ctx.fillRect(p[0]+r*.05,p[1]+r*.2,r*.1,r*.1)}}
    const ft=LK('feet');
    if(ft&&f.ft)f.ft.forEach(q=>{const fx=x0+q[0]*k,fy=y0+q[1]*k;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(fx-r*.4,fy-r*.78,r*1.0,r*.8,r*.18);else ctx.rect(fx-r*.4,fy-r*.78,r*1.0,r*.8);ctx.fillStyle=ft.a;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw;ctx.stroke();line([fx-r*.36,fy-r*.62],[fx+r*.1,fy-r*.62],ft.d,r*.18)});
    const gv=LK('hands');
    if(gv&&f.hx!=null){const gx=x0+f.hx*k,gy=y0+f.hy*k;ctx.beginPath();ctx.arc(gx-r*.05,gy,r*.4,0,6.283);ctx.fillStyle=gv.a;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw;ctx.stroke();ctx.fillStyle=gv.c;ctx.fillRect(gx-r*.22,gy-r*.24,r*.14,r*.14);
      if(gv.t==='spikeglove'){ctx.fillStyle=gv.f;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(gx+r*.3,gy+i*r*.24-r*.08);ctx.lineTo(gx+r*.62,gy+i*r*.24);ctx.lineTo(gx+r*.3,gy+i*r*.24+r*.08);ctx.fill()}}}
    const hk=g.head&&g.head.key;
    if(hk&&typeof itemsImg!=='undefined'&&itemsImg.complete&&itemsImg.naturalWidth&&ITEM_ATLAS.idx[hk]!=null){
      const TOP={iron_helm:8,mystic_hood:8,gold_helm:18,plumed_helm:20}[hk]??8,ii=ITEM_ATLAS.idx[hk],cs=ITEM_ATLAS.cols,sc=r*2.5/48;
      ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(itemsImg,(ii%cs)*64,Math.floor(ii/cs)*64,64,64,hx-32*sc,hy-r*1.2-TOP*sc,64*sc,64*sc);ctx.restore()}
    spk('head',[hx,hy-r*.6],r*2.2,r*2,1);
    spk('chest',[(nk[0]+hp[0])/2,(nk[1]+hp[1])/2],r*1.6,r*2.4,2);
    spk('belt',hp,r*1.4,r*1.2,3);spk('neck',A(nk,.8*r,.12*r),r*1.1,r*1.4,4);spk('shoulders',nk,r*2,r*1.4,5);
    spk('charm',A(hp,.75*r,-.72*r),r*1.1,r*1.6,6);
    if(f.ft)f.ft.forEach((q,i)=>spk('feet',[x0+q[0]*k,y0+q[1]*k-r*.4],r*1.1,r*1.2,8+i));
    if(f.hx!=null){const hd=[x0+f.hx*k,y0+f.hy*k];spk('hands',hd,r*1.1,r*1.2,10);spk('weapon',[hd[0],hd[1]-r*1.4],r*1.6,r*3.4,11)}
    spk('shield',A(nk,1.3*r,-.7*r),r*1.6,r*2,12);
    ctx.restore();
  }
