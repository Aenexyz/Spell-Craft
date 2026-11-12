# Builds lstrike.png (5-frame lightning aura strip) from the two pasted aura images
import sys
from PIL import Image
import numpy as np
A='/mnt/user-data/attachments/6ad5bde1-56ea-5f18-ab5b-5932ebcde6c3/'
def clean(im):
    a=np.array(im.convert('RGBA')).astype(int)
    rgb=a[...,:3];mn=rgb.min(-1)
    # whiteness -> transparency; un-premultiply against white
    alpha=np.clip((255-mn)*255/60,0,255)  # near-white -> 0
    a[...,3]=np.minimum(a[...,3],alpha)
    return Image.fromarray(a.astype('uint8'))
def bbox(im):
    return im.getchannel('A').point(lambda v:255 if v>40 else 0).getbbox()
im=clean(Image.open(A+'0773bc8d-image.png'))
al=np.array(im.getchannel('A'))>40;cols=al.any(0)
runs=[];x=0;W=len(cols)
while x<W:
    if cols[x]:
        s=x
        while x<W and cols[x]:x+=1
        runs.append((s,x))
    else:x+=1
# merge runs separated by small gaps
mr=[]
for r in runs:
    if mr and r[0]-mr[-1][1]<12:mr[-1]=(mr[-1][0],r[1])
    else:mr.append(r)
mr=[r for r in mr if r[1]-r[0]>8]
print('frames',mr)
fr=[]
for s,e in mr:
    c=im.crop((s,0,e,im.height));b=bbox(c);fr.append(c.crop((b[0],b[1],b[2],b[3])))
c2=clean(Image.open(A+'4222e5e5-image.png'));b=bbox(c2);fr.append(c2.crop(b))
FW=max(f.width for f in fr)+4;FH=max(f.height for f in fr)+2
out=Image.new('RGBA',(FW*len(fr),FH),(0,0,0,0))
for i,f in enumerate(fr):out.paste(f,(i*FW+(FW-f.width)//2,FH-f.height),f)
out.save('lstrike.png');print(out.size,[f.size for f in fr])
