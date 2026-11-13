  // ===== Stickman rig: skeletal hero with smooth, interpolated poses (rendered at 3x for clean edges) =====
  const RIG={W:130,H:150,AX:65,FY:138,SS:3,T:30,UA:15,FA:15,TH:19,SH:19,HR:11.5};
  const RD=Math.PI/180,rv=a=>[Math.sin(a*RD),Math.cos(a*RD)];
  const RDEF={t:4,h:0,fa:[18,40],ba:[-14,32],fl:[10,8],bl:[-12,6],px:0,py:0,rot:0,air:0,sw:0,tr:null,trf:0,col:null};
  const RP_=o=>Object.assign({},RDEF,o);
  // ---- keyframes (counts match the game's existing animation indices)
  const TUCK={t:58,h:36,fa:[62,72],ba:[56,72],fl:[138,160],bl:[128,160]};
  const G0={t:8,fa:[42,96],ba:[34,104],fl:[24,20],bl:[-22,8]};
  const KF={
    idle:[RP_({t:4,fa:[20,44],ba:[-12,34],fl:[10,8],bl:[-12,6]}),RP_({t:5,fa:[22,47],ba:[-10,37],fl:[10,9],bl:[-12,7],py:.4}),RP_({t:6,fa:[24,50],ba:[-8,40],fl:[10,10],bl:[-12,8],py:.8}),RP_({t:5,fa:[22,47],ba:[-10,37],fl:[10,9],bl:[-12,7],py:.4}),RP_({t:4,fa:[20,44],ba:[-12,34],fl:[10,8],bl:[-12,6]})],
    walk:Array.from({length:7},(_,i)=>{const ph=i/7*6.283,s=Math.sin(ph),c=Math.cos(ph);return RP_({t:14,fl:[34*s,12+48*Math.max(0,-c)],bl:[-34*s,12+48*Math.max(0,c)],fa:[-38*s+6,70],ba:[38*s-6,70],py:-Math.abs(Math.sin(ph))*2.2})}),
    punch:[RP_(G0),RP_({t:2,fa:[18,128],ba:[44,100],fl:[22,18],bl:[-24,8],px:-2}),RP_({t:14,fa:[76,18],ba:[0,96],fl:[28,20],bl:[-30,6],px:4}),RP_({t:17,fa:[90,0],ba:[-26,84],fl:[30,22],bl:[-32,4],px:7}),RP_({...G0,px:3})],
    kick:[RP_(G0),RP_({t:-4,fa:[50,80],ba:[-30,60],fl:[72,112],bl:[-6,6]}),RP_({t:-14,fa:[40,60],ba:[-40,40],fl:[86,14],bl:[-10,4]}),RP_({t:-20,fa:[34,50],ba:[-46,30],fl:[94,0],bl:[-12,2],px:2}),RP_({t:-2,fa:[48,80],ba:[-20,70],fl:[60,92],bl:[-8,6]})],
    slash:[RP_({t:4,fa:[34,112],ba:[30,100],fl:[22,16],bl:[-22,8]}),RP_({t:-8,fa:[155,22],ba:[40,90],fl:[18,14],bl:[-24,8]}),RP_({t:8,fa:[118,6],ba:[10,90],fl:[26,20],bl:[-28,6],px:2,sw:.5}),RP_({t:20,fa:[66,0],ba:[-20,80],fl:[32,26],bl:[-32,4],px:6,sw:1}),RP_({t:22,fa:[24,0],ba:[-30,70],fl:[32,26],bl:[-32,4],px:6,sw:.5}),RP_({t:8,fa:[32,70],ba:[0,80],fl:[24,18],bl:[-24,8],px:3})],
    shield:[RP_({t:6,fa:[58,74],ba:[34,104],fl:[22,18],bl:[-22,8]}),RP_({t:8,fa:[70,62],ba:[30,100],fl:[24,20],bl:[-24,8]}),RP_({t:12,fa:[80,50],ba:[30,100],fl:[28,24],bl:[-28,8],py:1}),RP_({t:12,fa:[82,46],ba:[28,100],fl:[28,24],bl:[-28,8],py:1}),RP_({t:18,fa:[88,22],ba:[10,96],fl:[32,24],bl:[-34,4],px:6})],
    beam:[RP_({t:4,fa:[20,44],ba:[-12,34],fl:[16,10],bl:[-18,6]}),RP_({t:2,fa:[36,90],ba:[44,86],fl:[20,14],bl:[-22,8]}),RP_({t:4,fa:[54,64],ba:[60,58],fl:[22,16],bl:[-24,8]}),RP_({t:10,fa:[88,4],ba:[84,8],fl:[26,18],bl:[-28,6],px:2}),RP_({t:10,fa:[86,6],ba:[82,10],fl:[26,18],bl:[-28,6],px:2}),RP_({t:10,fa:[88,4],ba:[84,8],fl:[26,18],bl:[-28,6],px:2})],
    laser:Array.from({length:10},(_,i)=>RP_({t:9-(i%2)*2,fa:[88+(i%2)*2,4],ba:[84,9],fl:[28,20],bl:[-30,6],px:2-(i%2)})),
    jump:[RP_({t:24,fa:[-34,20],ba:[-44,20],fl:[52,104],bl:[30,96]}),RP_({t:6,fa:[150,10],ba:[140,12],fl:[10,10],bl:[-16,6],air:1,py:-8}),RP_({t:10,fa:[100,40],ba:[90,40],fl:[84,124],bl:[62,116],air:1,py:-24}),RP_({t:4,fa:[104,8],ba:[70,10],fl:[44,44],bl:[-22,34],air:1,py:-27}),RP_({t:4,fa:[132,20],ba:[120,24],fl:[22,22],bl:[-12,16],air:1,py:-14}),RP_({t:20,fa:[50,40],ba:[30,40],fl:[46,90],bl:[26,84]})],
    die:[RP_({t:-14,h:-10,fa:[60,40],ba:[40,40]}),RP_({t:-26,h:-16,fa:[120,30],ba:[110,40],fl:[16,20],bl:[-14,10]}),RP_({t:6,fa:[40,30],ba:[30,30],fl:[60,120],bl:[40,110]}),RP_({t:16,fa:[20,20],ba:[10,20],fl:[86,140],bl:[70,136]}),RP_({t:-8,h:-20,fa:[30,20],ba:[20,20],fl:[90,150],bl:[80,148]}),
      RP_({t:-6,h:-14,fa:[30,30],ba:[20,30],fl:[70,110],bl:[60,110],rot:-25,air:1,py:10}),RP_({t:0,h:-10,fa:[30,30],ba:[16,30],fl:[40,60],bl:[30,60],rot:-55,air:1,py:20}),RP_({t:0,h:-6,fa:[24,20],ba:[10,20],fl:[16,20],bl:[8,16],rot:-82,air:1,py:28}),RP_({t:0,h:-4,fa:[22,14],ba:[8,14],fl:[10,10],bl:[4,8],rot:-90,air:1,py:31}),RP_({t:0,h:-4,fa:[22,12],ba:[8,12],fl:[10,10],bl:[4,8],rot:-90,air:1,py:31.5})],
    // new moves
    roll:Array.from({length:8},(_,i)=>RP_({...TUCK,rot:i*45,air:1,py:14})),
    flip:[RP_({t:22,fa:[-30,20],ba:[-40,20],fl:[50,100],bl:[30,94]}),RP_({t:-6,fa:[160,10],ba:[150,10],fl:[8,8],bl:[-12,6],air:1,py:-12}),RP_({...TUCK,rot:-90,air:1,py:-24}),RP_({...TUCK,rot:-180,air:1,py:-30}),RP_({...TUCK,rot:-270,air:1,py:-26}),RP_({t:10,fa:[120,30],ba:[110,30],fl:[40,50],bl:[20,40],rot:-340,air:1,py:-12}),RP_({t:6,fa:[100,30],ba:[90,30],fl:[20,24],bl:[-10,14],rot:-360,air:1,py:-3}),RP_({t:20,fa:[60,50],ba:[40,50],fl:[44,86],bl:[24,80],rot:-360})],
    spinkick:[RP_({t:10,fa:[50,80],ba:[40,80],fl:[30,60],bl:[-10,30],air:1,py:-14}),RP_({t:-10,fa:[90,30],ba:[-40,30],fl:[60,40],bl:[-20,20],rot:-20,air:1,py:-18,trf:.4}),RP_({t:-20,fa:[110,20],ba:[-60,20],fl:[100,0],bl:[-20,10],rot:-35,air:1,py:-20,trf:1}),RP_({t:-24,fa:[120,20],ba:[-60,20],fl:[140,0],bl:[-10,10],rot:-45,air:1,py:-20,trf:1}),RP_({t:-10,fa:[90,30],ba:[-30,30],fl:[70,60],bl:[0,30],rot:-15,air:1,py:-14,trf:.4}),RP_({t:12,fa:[50,60],ba:[30,60],fl:[40,80],bl:[20,70]})],
    uppercut:[RP_({t:22,fa:[28,128],ba:[40,110],fl:[44,80],bl:[-10,40]}),RP_({t:6,fa:[110,60],ba:[20,100],fl:[24,30],bl:[-24,14],py:-3,air:1}),RP_({t:-10,h:-10,fa:[172,4],ba:[-20,90],fl:[14,20],bl:[-30,30],py:-12,air:1}),RP_({t:-12,h:-10,fa:[176,2],ba:[-26,86],fl:[10,30],bl:[-30,40],py:-14,air:1}),RP_({t:10,fa:[60,70],ba:[30,90],fl:[30,40],bl:[-20,20]})],
    aim:[RP_({t:4,fa:[58,22],ba:[40,60],fl:[24,14],bl:[-22,6]}),RP_({t:4,fa:[84,2],ba:[76,40],fl:[26,16],bl:[-26,6]}),RP_({t:2,fa:[90,0],ba:[86,140],fl:[28,16],bl:[-28,6],h:-4}),RP_({t:0,fa:[91,0],ba:[90,160],fl:[28,16],bl:[-28,6],h:-6})],
    raise:[RP_({t:4,fa:[40,60],ba:[20,50],fl:[20,12],bl:[-20,6]}),RP_({t:-2,fa:[120,40],ba:[50,60],fl:[24,14],bl:[-24,6]}),RP_({t:-8,fa:[165,-20],ba:[70,40],fl:[26,16],bl:[-28,6],px:-2}),RP_({t:-12,fa:[172,-34],ba:[80,30],fl:[28,18],bl:[-30,6],px:-3})],
    throw:[RP_({t:-12,fa:[172,-34],ba:[80,30],fl:[28,18],bl:[-30,6],px:-3}),RP_({t:2,fa:[150,0],ba:[50,40],fl:[30,20],bl:[-30,6]}),RP_({t:20,fa:[96,0],ba:[-20,40],fl:[34,26],bl:[-34,4],px:5}),RP_({t:26,fa:[50,0],ba:[-40,30],fl:[36,28],bl:[-36,2],px:7}),RP_({t:10,fa:[34,40],ba:[-10,50],fl:[26,18],bl:[-26,6],px:3})],
  };
  // elemental slashes share the slash motion with a wider spin and coloured trail
  const ES={fslash:'#8fd8ff',bslash:'#ff9a3a',aslash:'#4fb8ff',dslash:'#b06cff'};
  for(const k in ES)KF[k]=[RP_({t:4,fa:[30,110],ba:[30,100],fl:[22,16],bl:[-22,8]}),RP_({t:-10,fa:[160,20],ba:[40,90],fl:[20,14],bl:[-26,8],px:-1}),RP_({t:6,fa:[128,6],ba:[10,90],fl:[26,20],bl:[-28,6],px:2,sw:.6,col:ES[k]}),RP_({t:20,fa:[74,0],ba:[-20,80],fl:[34,26],bl:[-34,4],px:7,sw:1,col:ES[k]}),RP_({t:24,fa:[22,0],ba:[-36,70],fl:[34,26],bl:[-34,4],px:8,sw:.9,col:ES[k]}),RP_({t:18,fa:[10,10],ba:[-30,60],fl:[30,22],bl:[-30,6],px:6,sw:.4,col:ES[k]}),RP_({t:6,fa:[30,70],ba:[0,80],fl:[24,18],bl:[-24,8],px:3})];
  const RLOOP={idle:1,walk:1,roll:1,laser:1};
  // ---- solve joints for a pose (sprite units, origin = canvas)
  function rigSolve(p){const L=RIG;let H=[L.AX+p.px,0];
    const tv=[Math.sin(p.t*RD),-Math.cos(p.t*RD)],nk=[0,0],J={};
    const solve=hy=>{H[1]=hy;J.hp=[H[0],H[1]];J.nk=[H[0]+tv[0]*L.T,H[1]+tv[1]*L.T];const ha=(p.t+p.h)*RD;J.hd=[J.nk[0]+Math.sin(ha)*(L.HR+1.5),J.nk[1]-Math.cos(ha)*(L.HR+1.5)];
      J.sh=[H[0]+tv[0]*(L.T-3),H[1]+tv[1]*(L.T-3)];
      const arm=(a)=>{const u=rv(a[0]),f=rv(a[0]+a[1]),e=[J.sh[0]+u[0]*L.UA,J.sh[1]+u[1]*L.UA];return[e,[e[0]+f[0]*L.FA,e[1]+f[1]*L.FA]]};
      const leg=(a)=>{const u=rv(a[0]),f=rv(a[0]-a[1]),k=[H[0]+u[0]*L.TH,H[1]+u[1]*L.TH];return[k,[k[0]+f[0]*L.SH,k[1]+f[1]*L.SH]]};
      [J.fe,J.fh]=arm(p.fa);[J.be,J.bh]=arm(p.ba);[J.fk,J.ff]=leg(p.fl);[J.bk,J.bf]=leg(p.bl)};
    solve(0);const low=Math.max(J.ff[1],J.bf[1]);solve((L.FY-low)*(1-p.air)+(L.FY-38)*p.air+p.py);
    if(p.rot){const c=[(J.hp[0]+J.nk[0])/2,(J.hp[1]+J.nk[1])/2],a=p.rot*RD,ca=Math.cos(a),sa=Math.sin(a);for(const k in J){const[x,y]=J[k];J[k]=[c[0]+(x-c[0])*ca-(y-c[1])*sa,c[1]+(x-c[0])*sa+(y-c[1])*ca]}}
    return J}
  const lerpA=(a,b,t)=>a+(b-a)*t;
  function rigLerp(a,b,t){const o={};for(const k in RDEF){const va=a[k],vb=b[k];if(Array.isArray(va))o[k]=[lerpA(va[0],vb[0],t),lerpA(va[1],vb[1],t)];else if(typeof va==='number')o[k]=lerpA(va,vb,t);else o[k]=t<.5?va:vb}o.col=a.col||b.col;return o}
  const sstep=t=>t*t*(3-2*t);
  function rigPose(n,fi){const K=KF[n]||KF.idle,N=K.length;if(RLOOP[n]){fi=((fi%N)+N)%N;const i=Math.floor(fi),j=(i+1)%N;return rigLerp(K[i],K[j],sstep(fi-i))}
    fi=Math.max(0,Math.min(N-1,fi));const i=Math.floor(fi),j=Math.min(N-1,i+1);return rigLerp(K[i],K[j],sstep(fi-i))}
  // ---- render a pose into a supersampled canvas + gear anchors
  function rigDraw(p,J){const L=RIG,s=L.SS,c=document.createElement('canvas');c.width=Math.ceil(L.W*s);c.height=Math.ceil(L.H*s);const g=c.getContext('2d');g.scale(s,s);g.lineCap='round';g.lineJoin='round';
    const ln=(pts,w,col)=>{g.beginPath();g.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)g.lineTo(...pts[i]);g.lineWidth=w;g.strokeStyle=col;g.stroke()};
    let BK='#2c2b38',FR='#0b0a10';const body=(rim)=>{const e=rim?2.2:0;if(rim){BK=FR='rgba(255,244,214,.55)'}else{BK='#2c2b38';FR='#0b0a10'}
    ln([J.hp,J.bk,J.bf],6.6+e,BK);foot(J.bk,J.bf,BK,6.4+e);ln([J.sh,J.be,J.bh],6+e,BK);g.beginPath();g.arc(...J.bh,3.4+e/2,0,6.283);g.fillStyle=BK;g.fill();
    ln([J.hp,J.nk],9+e,FR);g.beginPath();g.arc(...J.hd,L.HR+e/2,0,6.283);g.fillStyle=FR;g.fill();
    ln([J.hp,J.fk,J.ff],6.8+e,FR);foot(J.fk,J.ff,FR,6.6+e);ln([J.sh,J.fe,J.fh],6.2+e,FR);g.beginPath();g.arc(...J.fh,3.5+e/2,0,6.283);g.fillStyle=FR;g.fill()};
    // slash trail
    if(p.sw>.02){const r=32,cx=J.sh[0],cy=J.sh[1],ang=Math.atan2(J.fh[1]-cy,J.fh[0]-cx),col=p.col||'#ffffff';g.save();g.globalAlpha=Math.min(1,p.sw);for(let i=0;i<10;i++){const a0=ang-(1.9-i*.12),w=(10-i)*.9;g.beginPath();g.arc(cx,cy,r+i*.6,a0,ang);g.strokeStyle=i<3?'#ffffff':col;g.globalAlpha=Math.min(1,p.sw)*(1-i/11)*.85;g.lineWidth=w*.55;g.stroke()}g.restore()}
    if(p.trf>.02){const cx=J.hp[0],cy=J.hp[1],ang=Math.atan2(J.ff[1]-cy,J.ff[0]-cx);g.save();for(let i=0;i<8;i++){g.beginPath();g.arc(cx,cy,36+i*.5,ang+(1.6-i*.15),ang,true);g.strokeStyle=i<2?'#ffffff':'#cfe9ff';g.globalAlpha=p.trf*(1-i/9)*.8;g.lineWidth=(8-i)*.6;g.stroke()}g.restore()}
    const foot=(k,f,col,w)=>{const dx=f[0]-k[0],dy=f[1]-k[1],l=Math.hypot(dx,dy)||1;const fx=-dy/l,fy=dx/l;const dir=fx>0?1:-1;ln([f,[f[0]+fx*dir*5.5,f[1]+fy*dir*5.5]],w*.95,col)};
    g.save();g.globalCompositeOperation='source-over';body(true);g.restore();g.globalCompositeOperation='destination-out';body(false);g.globalCompositeOperation='source-over';body(false);
    // rim light
    g.save();g.globalAlpha=.22;g.strokeStyle='#ffffff';g.lineWidth=1.1;g.beginPath();g.arc(J.hd[0]-1.5,J.hd[1]-1.5,L.HR-2.2,3.6,5.2);g.stroke();g.restore();
    const fa=Math.atan2(J.fh[1]-J.fe[1],J.fh[0]-J.fe[0]);
    const f={rig:1,sr:Math.atan2(J.fh[1]-J.sh[1],J.fh[0]-J.sh[0]),w:L.W,h:L.H,ax:L.AX,fy:L.FY,hx:J.fh[0],hy:J.fh[1],hd:[J.hd[0],J.hd[1],L.HR],nk:J.nk,hp:J.hp,ft:[J.bf,J.ff],sh:[J.fh[0]+3,J.fh[1]-1,32,0],wa:fa,bx:J.bh[0],by:J.bh[1]};
    return{c,f}}
  const rigCache=new Map();let rigSS=0;
  function rigFrame(n,fi,blend){const want=Math.round(Math.min(3,Math.max(1.5,(st.H||600)*.25/90*1.15))*4)/4;if(want!==rigSS){rigSS=want;RIG.SS=want;rigCache.clear()}const key=n+'|'+fi.toFixed(2)+(blend?'|'+blend.k:'');let r=rigCache.get(key);if(r)return r;
    let p=rigPose(n,fi);if(blend)p=rigLerp(blend.p,p,blend.t);
    r=rigDraw(p,rigSolve(p));r.pose=p;if(!blend){if(rigCache.size>160)rigCache.delete(rigCache.keys().next().value);rigCache.set(key,r)}return r}
  // legacy HERO table: same names and frame counts, metadata from the rig
  function rigInstall(){for(const n in KF){HERO[n]=KF[n].map((_,i)=>rigFrame(n,i).f)}}
