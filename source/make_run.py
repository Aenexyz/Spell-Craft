"""Cut the 8 running frames, remove the background, rescale to the idle sprite's size and align on the head."""
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA');p=im.load();W,H=im.size
bg=p[5,5][:3]
def isbg(c):return sum(abs(a-b) for a,b in zip(c[:3],bg))<34
st=[(x,y) for x in range(W) for y in (0,H-1)]+[(x,y) for y in range(H) for x in (0,W-1)];seen=set()
while st:
    x,y=st.pop()
    if (x,y) in seen or not(0<=x<W and 0<=y<H):continue
    seen.add((x,y))
    if isbg(p[x,y]):p[x,y]=(0,0,0,0);st+=[(x+1,y),(x-1,y),(x,y+1),(x,y-1)]
spans=[(19, 110), (154, 240), (270, 373), (408, 496), (530, 623), (647, 746), (759, 874), (895, 1005)];T,B=7,260
TARGET=98;k=TARGET/(B-T)
frames=[]
for a,b in spans:
    c=im.crop((a-2,T,b+3,B));w,h=c.size
    s=c.resize((max(1,round(w*k)),TARGET),Image.BOX);sp=s.load()
    for y in range(s.size[1]):
        for x in range(s.size[0]):
            r,g,bb,al=sp[x,y];sp[x,y]=(r,g,bb,255) if al>110 else (0,0,0,0)
    frames.append(s)
pal=Image.new('RGB',(1,1));allpx=Image.new('RGBA',(sum(f.size[0] for f in frames),TARGET));xx=0
for f in frames:allpx.paste(f,(xx,0));xx+=f.size[0]
q=allpx.convert('RGB').quantize(colors=24,method=Image.MEDIANCUT,dither=Image.NONE)
qf=[]
for f in frames:
    g=f.convert('RGB').quantize(palette=q,dither=Image.NONE).convert('RGBA');gp=g.load();fp=f.load()
    for y in range(g.size[1]):
        for x in range(g.size[0]):
            if fp[x,y][3]==0:gp[x,y]=(0,0,0,0)
    qf.append(g)
def headcx(f):
    bb=f.getbbox();px=f.load();xs=[x for y in range(bb[1],bb[1]+int(TARGET*.3)) for x in range(f.size[0]) if px[x,y][3]]
    return sum(xs)/len(xs)
FW=56;FH=TARGET+2
sheet=Image.new('RGBA',(FW*len(qf),FH),(0,0,0,0))
for i,f in enumerate(qf):
    bb=f.getbbox();cx=headcx(f);sheet.paste(f,(i*FW+round(FW/2-cx),FH-bb[3]))
sheet.save(sys.argv[2]);print('frame',FW,FH)
