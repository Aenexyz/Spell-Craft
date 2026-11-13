// path-card pixel art: a small scene per path type, drawn at low res and scaled up crisp
const CARD_ART=new Map();
function cardArt(kind,id,lvl){
  const key=kind+'|'+(id||'')+'|'+lvl;if(CARD_ART.has(key))return CARD_ART.get(key);
  const W=72,H=100,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  let seed=0;for(const ch of key)seed=(seed*31+ch.charCodeAt(0))>>>0;
  const rn=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
  const px=(X,Y,col,w=1,h=1)=>{x.fillStyle=col;x.fillRect(Math.round(X),Math.round(Y),w,h)};
  const bg=(LEVELS[lvl]||{}).bg||'forest';
  const PAL={forest:{sky:['#16303a','#1f4550','#2c5d5e','#3f7a63'],far:'#1a3a34',mid:'#13302a',gnd:['#2c4a22','#3b6a2a','#1d3316'],spark:'#d8ff9a'},
    lava:{sky:['#14060c','#2a0a12','#4a1414','#7a2a12'],far:'#2a0c10',mid:'#1c070a',gnd:['#3a1208','#5a1e0c','#220a06'],spark:'#ffb347'},
    night:{sky:['#050d1a','#0a1d30','#0f2e44','#164a5a'],far:'#0b2333',mid:'#081a26',gnd:['#14505e','#1d6a74','#0b3640'],spark:'#bfe9ff'},
    swamp:{sky:['#0f1a12','#18291c','#223c26','#33532f'],far:'#162a18',mid:'#0f1f10',gnd:['#26401c','#365a24','#18290f'],spark:'#c6ff6a'}}[bg]||null;
  const P=PAL||{sky:['#16303a','#1f4550','#2c5d5e','#3f7a63'],far:'#1a3a34',mid:'#13302a',gnd:['#2c4a22','#3b6a2a','#1d3316'],spark:'#d8ff9a'};
  const GY=76;
  // sky: banded with ordered dither between bands
  const bands=P.sky,bh=GY/bands.length;
  for(let y=0;y<GY;y++){const b=Math.min(bands.length-1,Math.floor(y/bh)),f=(y%bh)/bh;for(let X=0;X<W;X++){const d=((X+y*2)%4)/4;px(X,y,(f>.7&&d<(f-.7)*3.3&&b<bands.length-1)?bands[b+1]:bands[b])}}
  // stars / motes
  for(let i=0;i<14;i++)px(rn()*W,rn()*GY*.6,i%3?P.spark+'88':P.spark);
  // moon / glow orb
  if(bg==='night'||bg==='swamp'){const mx=10+rn()*50,my=8+rn()*10;for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++)if(a*a+b*b<=16)px(mx+a,my+b,(a*a+b*b>9)?'#ffffff55':bg==='swamp'?'#d9f5a8':'#e9f6ff')}
  if(bg==='lava')for(let i=0;i<5;i++){const vx=rn()*W;for(let y=0;y<GY;y++)if(rn()<.08)px(vx+(rn()-.5)*2,y,'#ff6a2a55')}
  // far silhouettes
  for(let X=0;X<W;X+=1){const h=bg==='lava'?8+Math.abs(Math.sin(X*.21+rn()*.2))*16:12+Math.abs(Math.sin(X*.37)+Math.sin(X*.11))*7;px(X,GY-h-6,P.far,1,h+6)}
  if(bg==='forest'||bg==='night'||bg==='swamp')for(let i=0;i<6;i++){const tx=Math.round(rn()*W),th=18+rn()*16;for(let y=0;y<th;y++){const w=Math.max(1,Math.round((y/th)*7));px(tx-w/2,GY-th+y-4,P.mid,w,1)}px(tx,GY-4,P.mid,1,4)}
  // ground with texture and grass tufts
  for(let y=GY;y<H;y++)for(let X=0;X<W;X++){const r=rn();px(X,y,y===GY?P.gnd[1]:r<.12?P.gnd[1]:r<.3?P.gnd[2]:P.gnd[0])}
  for(let X=0;X<W;X+=2+Math.floor(rn()*3))px(X,GY-1-Math.floor(rn()*2),P.gnd[1],1,2);
  if(bg==='swamp')for(let i=0;i<4;i++){const wx=rn()*W,wy=GY+4+rn()*14;px(wx,wy,'#3d6a3a',8+rn()*8,1);px(wx+2,wy+1,'#2c4f2a',6,1)}
  // soft radial glow behind subject
  const glow=(cx,cy,r,col)=>{for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const d=Math.sqrt(a*a+b*b)/r;if(d<=1&&((a+b)&1||d<.55))px(cx+a,cy+b,col)}};
  const shadowAt=(cx,w)=>{for(let i=-w;i<=w;i++)px(cx+i,GY+1,'#0006',1,Math.abs(i)<w*.6?2:1)};
  // sprite helpers
  const crop=(src,sx,sy,sw,sh)=>{const t=document.createElement('canvas');t.width=sw;t.height=sh;const tx=t.getContext('2d');tx.drawImage(src,sx,sy,sw,sh,0,0,sw,sh);const d=tx.getImageData(0,0,sw,sh).data;let a=sw,b=sh,cx=-1,cy=-1;for(let yy=0;yy<sh;yy++)for(let xx=0;xx<sw;xx++)if(d[(yy*sw+xx)*4+3]>20){if(xx<a)a=xx;if(xx>cx)cx=xx;if(yy<b)b=yy;if(yy>cy)cy=yy}if(cx<0)return null;const o=document.createElement('canvas');o.width=cx-a+1;o.height=cy-b+1;o.getContext('2d').drawImage(t,a,b,o.width,o.height,0,0,o.width,o.height);return o};
  let ok=true;
  const foeImg=fid=>{try{const e={id:fid,state:'idle',t0:0,slot:0};const mf=mushFrame(e,0);if(mf){const F=famOf(e);return crop(mf.c,mf.sx,0,F.fw,F.fh)}if(typeof SPRITES!=='undefined'&&SPRITES[fid])return spr(fid);if(!mushReady)ok=false}catch(err){ok=false}return null};
  const silhouette=(img,col)=>{const t=document.createElement('canvas');t.width=img.width;t.height=img.height;const tx=t.getContext('2d');tx.drawImage(img,0,0);tx.globalCompositeOperation='source-in';tx.fillStyle=col;tx.fillRect(0,0,t.width,t.height);return t};
  const putFoe=(fid,maxH,maxW,cx,auraCol)=>{const im=foeImg(fid);if(!im)return null;const f=Math.min(maxH/im.height,maxW/im.width),k=f>=1?Math.min(3,Math.floor(f)):1/Math.ceil(1/f);const w=Math.max(1,Math.round(im.width*k)),h=Math.max(1,Math.round(im.height*k)),X=Math.round(cx-w/2),Y=GY+1-h;shadowAt(cx,Math.round(w*.4));
    if(auraCol){const sl=silhouette(im,auraCol);[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1]].forEach(o=>x.drawImage(sl,X+o[0],Y+o[1],w,h))}
    x.drawImage(im,X,Y,w,h);return{X,Y,w,h}};
  const T=kind;
  if(T==='m'){glow(36,58,16,'#ffffff10');putFoe(id,40,52,36);}
  else if(T==='elite'){glow(36,56,20,'#b18bff22');const ids=(id||'').split(',');if(ids[1]&&ids[1]!==ids[0])putFoe(ids[1],30,34,52,'#6a3aa8');const r=putFoe(ids[0],44,50,32,'#b18bff');if(r){for(let i=0;i<5;i++)px(r.X+rn()*r.w,r.Y-2-rn()*6,'#e4d4ff')}
    // elite star
    const sx=60,sy=10;[[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[-3,0],[-2,0],[-1,0],[1,0],[2,0],[3,0],[-1,-1],[1,-1],[-1,1],[1,1]].forEach(o=>px(sx+o[0],sy+o[1],'#d6b8ff'))}
  else if(T==='boss'){glow(36,52,26,'#ff3a3a18');glow(36,52,15,'#ff6a3a22');const r=putFoe(id,44,60,36,'#ff4a2a');
    const cy=r?Math.max(4,r.Y-10):8;const CR=['..g...g...g..','..gg.ggg.gg..','.gggggggggg..','.gyggrggyggg.','.gggggggggg..'];CR.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch!=='.')px(30+i-6+3,cy+j,ch==='g'?'#ffd36b':ch==='y'?'#fff2b0':'#ff3a3a')}))}
  else if(T==='camp'){glow(36,64,18,'#ffb34722');
    // tent
    for(let y=0;y<22;y++){const w=Math.round(y*1.1);px(14-w/2+8,GY-22+y,y%5===0?'#8a5a2a':'#a8743a',w,1);px(14+8,GY-22+y,'#5a3a1a',1,1)}px(20,GY-8,'#2a1a0a',4,8);
    // logs + fire
    px(36,GY-2,'#5a3418',14,2);px(38,GY-3,'#7a4a22',10,1);
    const F=['....y....','...yoy...','..yoroy..','..orrro..','.yorwroy.','.orrwrro.','..orrro..'];F.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch!=='.')px(39+i,GY-10+j,{y:'#ffd84a',o:'#ff8a2a',r:'#ff4a1a',w:'#fff6c8'}[ch])}));
    for(let i=0;i<7;i++)px(40+rn()*8,GY-14-rn()*20,i%2?'#ffb347':'#ff6a2a');px(56,GY-3,'#3a3a3a',5,3);px(57,GY-4,'#5a5a5a',3,1)}
  else if(T==='chest'||T==='vault'||(T==='ev'&&id)){
    if(T==='vault'){const locked=!(S&&S.keys>0);glow(36,50,24,locked?'#8a8a8a14':'#ffd36b22');
      // stone arch
      for(let y=30;y<GY;y++)for(let X=14;X<58;X++){const ax=X-36,ay=y-48;const inArch=(y>=48&&Math.abs(ax)<=17)||(y<48&&ax*ax+ay*ay*1.6<=17*17);const inDoor=(y>=48&&Math.abs(ax)<=11)||(y<48&&ax*ax+ay*ay*1.8<=11*11);if(inArch&&!inDoor){const brick=((Math.floor((y+(Math.floor(X/6)%2)*3)/4)+Math.floor(X/6))%2);px(X,y,brick?'#5a5866':'#6e6c7c');if(y%4===0)px(X,y,'#3e3c48')}else if(inDoor){px(X,y,(X%5===0)?'#3a2410':'#5a3818')}}
      for(const yy of [44,58,68])px(25,yy,'#2a2a30',23,2);
      // lock
      const L=['.gggg.','g....g','g....g','gggggg','gglggg','ggglgg','gggggg'];L.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch!=='.')px(33+i,52+j,ch==='l'?'#2a1a08':locked?'#a89a70':'#ffd36b')}));
      if(!locked)for(let i=0;i<8;i++)px(26+rn()*20,40+rn()*28,'#fff2b0')}
    else{const prop=T==='chest'?'chest':(EVENTS[id]&&EVENTS[id].prop)||'altar';glow(36,58,20,T==='chest'?'#ffd36b22':id==='merchant'?'#7fd0ff1c':'#ffffff14');
      let im=null;try{im=spr(prop)}catch(err){}
      if(im){const f=Math.min(40/im.height,50/im.width),k=f>=1?Math.min(2,Math.floor(f)):1/Math.ceil(1/f),w=Math.round(im.width*k),h=Math.round(im.height*k);shadowAt(36,Math.round(w*.4));x.drawImage(im,Math.round(36-w/2),GY+1-h,w,h)}
      if(T==='chest'){for(let i=0;i<6;i++)px(20+rn()*32,GY-2-rn()*3,'#ffd36b');for(let i=0;i<6;i++)px(22+rn()*28,GY-30-rn()*16,'#fff2b0aa')}
      else if(id==='shrine')for(let i=0;i<8;i++)px(28+rn()*16,GY-24-rn()*24,'#bfe9ff');
      else if(id==='smith')for(let i=0;i<8;i++)px(30+rn()*14,GY-22-rn()*14,i%2?'#ffb347':'#fff2b0');
      else if(id==='mimic'){px(31,GY-12,'#ff3a3a');px(40,GY-12,'#ff3a3a')}
      else if(id==='merchant')for(let i=0;i<5;i++)px(18+rn()*36,GY-1,'#ffd36b')}}
  // vignette
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){const d=Math.max(Math.abs(X-W/2)/(W/2),Math.abs(y-H/2)/(H/2));if(d>.86&&((X+y)&1))px(X,y,'#0007')}
  const url=c.toDataURL();if(ok)CARD_ART.set(key,url);return url;
}
window.__cardArt=cardArt;
