import os,json,numpy as np
from PIL import Image
B='slashzip/Sword Slashes/'
def seq(d):return [Image.open(f'{B}{d}/File{i}.png').convert('RGBA') for i in range(1,7)]
def tint(fr,dk,md):
  a=np.asarray(fr).astype(float);lum=(a[...,:3].mean(2)/255)[...,None];dk=np.array(dk,float);md=np.array(md,float);wh=np.array([255.,255,255])
  t1=np.clip(lum/.82,0,1);t2=np.clip((lum-.82)/.18,0,1)
  out=a.copy();out[...,:3]=np.where(lum<.82,dk*(1-t1)+md*t1,md*(1-t2)+wh*t2);return Image.fromarray(out.clip(0,255).astype('uint8'))
H=lambda h:tuple(int(h[i:i+2],16) for i in (1,3,5))
src={'phys':'White','fire':'Red','water':'Blue','light':'Pure White','dark':'Purple'}
tints={'ice':('#1b6fa8','#7fe0ff'),'earth':('#4a2e14','#c0803a'),'wind':('#137a4a','#3ddc84'),'lightning':('#9a7400','#ffd400')}
rows=[]
for el in list(src)+list(tints):
  for v in ('Wide','Thin'):
    fr=seq(f'{src[el]} Slash {v}') if el in src else [tint(f,H(tints[el][0]),H(tints[el][1])) for f in seq(f'White Slash {v}')]
    rows.append((el,v,fr))
bb=None
for _,_,fr in rows:
  for f in fr:
    b=f.getbbox()
    if b:bb=b if bb is None else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
W=200;sc=W/(bb[2]-bb[0]);Hh=round((bb[3]-bb[1])*sc)
atlas=Image.new('RGBA',(W*6,Hh*len(rows)))
for r,(el,v,fr) in enumerate(rows):
  for c,f in enumerate(fr):atlas.paste(f.crop(bb).resize((W,Hh),Image.LANCZOS),(c*W,r*Hh))
atlas.save('slashes.png',optimize=True)
json.dump({'w':W,'h':Hh,'rows':[f'{el}:{v[0]}' for el,v,_ in rows]},open('slashes.json','w'))
print(bb,W,Hh,os.path.getsize('slashes.png'))
