  function heroFrame(now,walking){
    if(!heroReady)return null;
    const P=st.player;now=Math.floor(now/40)*40;
    const pick=(n,i,pose,p)=>{if(!KF[n])n='idle';const r=rigFrame(n,i);return{c:r.c,f:r.f,key:n+'|'+(+i).toFixed(2),pose,p,n,fi:i,rp:r.pose}};
    const res=heroFrame0(now,walking,P,pick);if(!res)return res;
    const pr=P.rigLast;if(pr&&pr.n!==res.n&&!P.dead&&res.n!=='die')P.rigBlend={from:pr.rp,t0:now,dur:(pr.n==='idle'||res.n==='idle')?110:70};
    const B=P.rigBlend;if(B){const t=(now-B.t0)/B.dur;if(t>=1||t<0)P.rigBlend=null;else{const r=rigFrame(res.n,res.fi,{p:B.from,t:sstep(t),k:B.t0+':'+t.toFixed(2)});res.c=r.c;res.f=r.f;res.rp=r.pose;res.key+='b'+t.toFixed(2)}}
    P.rigLast=res;return res}
  function heroFrame0(now,walking,P,pick){
    if(P.mv&&now-P.mv.t0<=P.mv.dur&&!P.dead){const fr=P.mv.frame(now-P.mv.t0);if(fr&&KF[fr[0]])return pick(fr[0],Math.max(0,Math.min(KF[fr[0]].length-1,fr[1])))}
    if(P.act&&P.act.multi){const t=now-P.act.t0;
      if(t<0)return pick('idle',now/180);
      if(t<250)return pick('walk',t/55);
      const sg=P.act.segs.find(o=>t>=o.s&&t<o.e);
      if(sg){const a=KF[sg.anim]?sg.anim:'punch',n=KF[a].length;return pick(a,Math.min(n-1,(t-sg.s)/(sg.e-sg.s)*(n-1)))}
      return pick('idle',0)}
    if(P.act){const p=(now-P.act.t0)/P.act.dur;
      if(p<0)return pick('idle',now/180);
      if(P.act.kind==='shield'){if(p<.3)return pick('walk',(now-P.act.t0)/55);if(p<.72)return pick('shield',Math.min(4,1+(p-.3)/.42*3.2));return pick('shield',Math.max(0,4-(p-.72)/.28*4))}
      if(p<.3)return pick('walk',(now-P.act.t0)/55);
      if(p<.72){const k=KF[P.act.kind]?P.act.kind:'punch';const n=KF[k].length;return pick(k,Math.min(n-1,(p-.3)/.42*(n-1)))}
      return pick('idle',0)}
    if(P.seq&&now<P.seq.until&&KF[P.seq.n]){const el=now-P.seq.t0,T=P.seq.times;let ii=0;T.forEach((tt,q)=>{if(el>=tt)ii=q});const n=KF[P.seq.n].length,ix=q=>Math.min(n-1,P.seq.idx?P.seq.idx[q]:q);
      if(ii<T.length-1){const f=Math.min(1,(el-T[ii])/Math.max(1,T[ii+1]-T[ii])),a=ix(ii),b=ix(ii+1);if(Math.abs(b-a)===1)return pick(P.seq.n,a+(b-a)*f)}return pick(P.seq.n,ix(ii))}
    if(P.holdFrame&&now<P.holdFrame.until&&KF[P.holdFrame.n])return pick(P.holdFrame.n,Math.min(KF[P.holdFrame.n].length-1,P.holdFrame.i));
    let a=P.anim;
    if(a&&now-a.t0>=a.dur&&!a.hold){P.anim=a=null}
    if(a){const p=Math.min(1,(now-a.t0)/a.dur);
      if(KF[a.name]){const n=KF[a.name].length;return pick(a.name,p*(n-1))}
      return pick('idle',now/180,a.name,p)}
    if(P.dead)return pick('die',KF.die.length-1);
    if(walking)return pick('walk',now/95);
    if(S&&S.phase==='win')return pick('idle',now/180,'celebrate',(now%900)/900);
    if(S&&S.guarding&&S.phase==='battle')return pick('shield',2);
    return pick('idle',now/180);
  }
