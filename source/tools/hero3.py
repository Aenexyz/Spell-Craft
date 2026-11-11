from PIL import Image
import numpy as np, json
from scipy import ndimage
A='/mnt/user-data/attachments/6ad5bde1-56ea-5f18-ab5b-5932ebcde6c3/'
strips=[('idle','012b78e9-image.png',False),('walk','e69d8c8a-image.png',False),('punch','811ecb2e-image.png',False),('kick','0d9f7b59-image.png',False),('slash','7703e666-image.png',True),('shield','7d8b3f02-image.png',True),('beam','fcacd8e2-image.png',True),('laser','ead017c0-image.png',False),('fslash','c098cc2d-image.png',True),('bslash','61bbdd92-image.png',True),('aslash','f84f11b0-image.png',True),('dslash','15b1a1e6-image.png',True),('jump','4adf67e8-image.png',False),('die','aaeb7091-image.png',True)]
frames={};cells=[];JS=117
for n,f,color in strips:
  im=Image.open(A+f).convert('RGBA');bg=Image.new('RGBA',im.size,(255,255,255,255));bg.alpha_composite(im)
  a=np.asarray(bg.convert('RGB')).astype(float).copy()
  dk=a.max(2)<110
  if n=='idle': a[dk.mean(1)>.6]=255;a[:,:3]=255;a[:,-3:]=255
  r,g,b=a[...,0],a[...,1],a[...,2]
  navy=ndimage.binary_dilation((b>80)&(b-r>50)&(r<70)&(g<90),iterations=6)
  if n in('fslash','bslash','aslash','dslash','die'):navy[:]=False
  mn=a.min(2);dark=(a.max(2)<110)&~navy
  if n=='dslash':dark&=(a.max(2)-a.min(2))<30
  fgm=((mn<235) if color else dark)&~navy
  lab,k=ndimage.label(ndimage.binary_dilation(fgm,iterations=2 if color else 3))
  objs=sorted([(i+1,s) for i,s in enumerate(ndimage.find_objects(lab)) if (s[0].stop-s[0].start)>30],key=lambda o:o[1][1].start)
  if n=='bslash':
    L1=lab[200,60];X=np.arange(lab.shape[1])[None,:].repeat(lab.shape[0],0)
    mv=(lab==L1)&(X>=130)&~(((a.max(2)-a.min(2))>40)&(X<150));lab[mv]=lab.max()+1
  if n in('fslash','bslash','aslash','dslash','die'):
    fo=ndimage.find_objects(lab);figs=[i+1 for i,q in enumerate(fo) if (dark[q]&(lab[q]==i+1)).sum()>500];gb=max(fo[f-1][0].stop for f in figs);figs=[f for f in figs if fo[f-1][0].stop>=gb-8] if n!='die' else figs
    for i,q in enumerate(fo):
      if i+1 in figs:continue
      cx=(q[1].start+q[1].stop)/2;cy=(q[0].start+q[0].stop)/2;own=[f for f in figs if fo[f-1][1].start-30<=cx<=fo[f-1][1].stop+15 and (n!='die' or fo[f-1][0].start-45<=cy<=fo[f-1][0].stop+10)]
      if n=='die' and (lab[q]==i+1).sum()<40:own=[]
      lab[lab==i+1]=own[-1] if own else 0
    objs=sorted([(f,ndimage.find_objects(lab)[f-1]) for f in figs],key=lambda o:((o[1][0].stop>lab.shape[0]*.75)*10000 if n=='die' else 0)+o[1][1].start)
  # scale: tallest dark figure -> 90 (idle handled -> 85)
  hs=[]
  for lid,s in objs:
    d=dark[s]&(lab[s]==lid);ys=np.nonzero(d.any(1))[0];hs.append(ys.max()-ys.min()+1)
  scale=(85/np.median(hs)) if n=='idle' else (88/hs[0]) if n in('beam','laser') else (117/hs[0]) if n=='die' else (JS/np.median(hs)) if n=='jump' else (104/hs[0]) if n in('fslash','bslash','aslash','dslash') else 90/max(hs)
  frames[n]=[]
  for lid,s in objs:
    y0,y1=max(0,s[0].start-2),s[0].stop+2;x0,x1=max(0,s[1].start-2),s[1].stop+2
    reg=ndimage.binary_dilation(lab[y0:y1,x0:x1]==lid,iterations=2)&~navy[y0:y1,x0:x1]
    crop=a[y0:y1,x0:x1];m=mn[y0:y1,x0:x1];dkc=dark[y0:y1,x0:x1]
    if color:
      al=np.clip((248-m)/150,0,1);al[dkc]=1;al*=reg
      col=np.where(al[...,None]>0.02,(crop-(1-al[...,None])*255)/np.maximum(al[...,None],.02),0).clip(0,255)
      col[dkc]=[17,16,22]
    else:
      al=np.clip((240-m)/(200),0,1)*reg;col=np.zeros_like(crop);col[...]=[17,16,22]
    rgba=np.dstack([col,al*255]).astype('uint8')
    if n=='die':
      lb2,nn2=ndimage.label(ndimage.binary_dilation(rgba[...,3]>8,iterations=3))
      if nn2>1:
        sz2=ndimage.sum(rgba[...,3]>8,lb2,range(1,nn2+1))
        for q2,v2 in enumerate(sz2):
          if v2<60:rgba[lb2==q2+1,3]=0
    ys,xs=np.nonzero(al>.03);rgba=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]
    img=Image.fromarray(rgba)
    if abs(scale-1)>.02: img=img.resize((max(1,round(img.width*scale)),max(1,round(img.height*scale))),Image.LANCZOS)
    rgba=np.asarray(img).copy();h,w=rgba.shape[:2]
    # head anchor from dark-ish opaque pixels near top
    opq=(rgba[...,3]>200)&(rgba[...,:3].max(2)<80)
    yy=np.nonzero(opq.any(1))[0];top=opq[yy.min():yy.min()+max(3,int(h*.2))]
    ty,tx=np.nonzero(top);ax=float(tx.mean()) if len(tx) else w/2
    # feet = bottom of dark pixels
    fy=int(yy.max())+1
    band=opq[int(h*.32):int(h*.66)]
    by,bx=np.nonzero(band)
    if len(bx):
      xr=bx.max();sel=bx>=xr-2;hx=float(xr);hy=float(by[sel].mean()+int(h*.32))
    else: hx,hy=w*.7,h*.5
    fr={'w':w,'h':h,'ax':round(ax,1),'fy':fy,'hx':round(hx,1),'hy':round(hy,1)}
    if n=='shield':
      shm=(rgba[...,3]>140)&(rgba[...,:3].max(2)>=85)
      lb,nn=ndimage.label(ndimage.binary_dilation(shm,iterations=2))
      if nn:
        sz=ndimage.sum(np.ones_like(lb),lb,range(1,nn+1));big=np.argmax(sz)+1
        sy,sx=np.nonzero(lb==big);fr['sh']=[round(float((sx.min()+sx.max())/2),1),round(float((sy.min()+sy.max())/2),1),int(sy.max()-sy.min()+1),int(sx.max()-sx.min()+1)]
    if n=='jump':
      base=max(o[1][0].stop for o in objs);fr['jy']=round((s[0].stop-base)*scale,1)
    if n in('laser','jump'):
      opq2=(rgba[...,3]>200)&(rgba[...,:3].max(2)<80);y0b=int(h*.2);band2=opq2[y0b:int(h*.45)]
      by2,bx2=np.nonzero(band2)
      if len(bx2):
        xr2=bx2.max();sel2=bx2>=xr2-2;fr['hx']=float(xr2);fr['hy']=round(float(by2[sel2].mean()+y0b),1)
    if n=='beam':
      cc=rgba.astype(int);colm=(cc[...,3]>100)&((cc[...,2]-cc[...,0]>35)|(cc[...,:3].min(2)>200))&(cc[...,:3].max(2)>=120)
      ys2,xs2=np.nonzero(colm)
      if len(xs2)>20:
        x0c=xs2.min();sel=xs2<=x0c+6;fr['gx']=float(x0c);fr['gy']=round(float(ys2[sel].mean()),1);fr['cx']=round(float(xs2.mean()),1);fr['cy']=round(float(ys2.mean()),1)
    dm=(rgba[...,3]>150)&(rgba[...,:3].max(2)<90)
    if dm.sum()>30:
      edt=ndimage.distance_transform_edt(dm);top=edt.copy();top[int(h*.55):]=0
      cy0,cx0=np.unravel_index(np.argmax(top),top.shape);rr=float(top[cy0,cx0])
      fr['hd']=[float(cx0),float(cy0),round(rr,1)]
      track=[];xp=float(cx0)
      for yy in range(int(cy0+rr*0.9),h):
        row=dm[yy];runs=[];x=0
        while x<w:
          if row[x]:
            s0=x
            while x<w and row[x]:x+=1
            runs.append((s0+x-1)/2)
          else:x+=1
        if not runs:break
        c=min(runs,key=lambda v:abs(v-xp))
        if abs(c-xp)>rr*1.1 and track:break
        xp=c;track.append((c,yy))
      if track:
        ny=cy0+rr*1.2;nk=min(track,key=lambda p:abs(p[1]-ny))
        hy=nk[1]+rr*2.5;hp=min(track,key=lambda p:abs(p[1]-hy))
        fr['nk']=[round(nk[0],1),float(nk[1])];fr['hp']=[round(hp[0],1),float(hp[1])]
      ys3,xs3=np.nonzero(dm);bot=ys3.max();sel=ys3>=bot-max(3,int(h*.06));fx=np.sort(np.unique(xs3[sel]))
      groups=[[fx[0]]]
      for v in fx[1:]:
        if v-groups[-1][-1]>2:groups.append([v])
        else:groups[-1].append(v)
      feet=[]
      for gp in groups:
        if len(gp)<2:continue
        m=sel&(xs3>=gp[0])&(xs3<=gp[-1]);feet.append([round(float(xs3[m].mean()),1),float(ys3[m].max())])
      fr['ft']=feet[:2]
      if 'nk' in fr and feet:
        fmx=sum(p[0] for p in feet[:2])/len(feet[:2]);fmy=max(p[1] for p in feet[:2]);nx,ny=fr['nk'];vx,vy=fmx-nx,fmy-ny;L=max(1e-3,(vx*vx+vy*vy)**.5)
        fr['hp']=[round(nx+vx/L*rr*2.5,1),round(ny+vy/L*rr*2.5,1)]
    if n=='die' and len(frames[n])>=4:fr['ax']=round(w*.3,1)
    cells.append(rgba);frames[n].append(fr)
CW=max(c.shape[1] for c in cells)+2;CH=max(c.shape[0] for c in cells)+2;cols=6
rows=(len(cells)+cols-1)//cols;atlas=np.zeros((rows*CH,cols*CW,4),dtype='uint8');k=0
for n in frames:
  for fr in frames[n]:
    c=cells[k];cx,cy=(k%cols)*CW,(k//cols)*CH;atlas[cy:cy+c.shape[0],cx:cx+c.shape[1]]=c;fr['x']=cx;fr['y']=cy;k+=1
Image.fromarray(atlas).save('hero2.png');json.dump(frames,open('hero2.json','w'))
pv=Image.new('RGBA',(atlas.shape[1],atlas.shape[0]),(110,160,100,255));pv.alpha_composite(Image.fromarray(atlas));pv.save('hero2_preview.png')
print({n:[f['h'] for f in v] for n,v in frames.items()})
# (item art is generated by make_items.py)
