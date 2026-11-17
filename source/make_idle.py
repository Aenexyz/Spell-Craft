"""Cut the 4 idle frames out of the 2x2 sheet, restore native pixel size, remove the background, align feet."""
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA');W,H=im.size
bg=(25,27,33)
def isbg(c):return sum(abs(a-b) for a,b in zip(c[:3],bg))<22
cells=[(0,0,202,241),(202,0,404,241),(0,241,202,483),(202,241,404,483)]
frames=[]
for (x0,y0,x1,y1) in cells:
    c=im.crop((x0,y0,x1,y1));p=c.load();w,h=c.size
    # flood fill background from the borders
    st=[(x,0) for x in range(w)]+[(x,h-1) for x in range(w)]+[(0,y) for y in range(h)]+[(w-1,y) for y in range(h)];seen=set()
    while st:
        x,y=st.pop()
        if (x,y) in seen or not(0<=x<w and 0<=y<h):continue
        seen.add((x,y))
        if isbg(p[x,y]):p[x,y]=(0,0,0,0);st+=[(x+1,y),(x-1,y),(x,y+1),(x,y-1)]
    frames.append(c)
# choose the 2x2 phase that keeps edges crisp, then halve
def score(c,ox,oy):
    p=c.load();w,h=c.size;bad=0
    for y in range(oy,h-1,2):
        for x in range(ox,w-1,2):
            q=[p[x,y],p[x+1,y],p[x,y+1],p[x+1,y+1]]
            if any(v!=q[0] for v in q):bad+=1
    return bad
best=min(((score(frames[0],ox,oy),ox,oy) for ox in (0,1) for oy in (0,1)));print('phase',best)
_,ox,oy=best
small=[f.crop((ox,oy,f.size[0]-(1-ox) if (f.size[0]-ox)%2 else f.size[0],f.size[1]-(1-oy) if (f.size[1]-oy)%2 else f.size[1])) for f in frames]
small=[s.resize((s.size[0]//2,s.size[1]//2),Image.NEAREST) for s in small]
# align every frame on its feet (bottom) and its horizontal centre
bbs=[s.getbbox() for s in small];print('bboxes',bbs)
mw=max(b[2]-b[0] for b in bbs);mh=max(b[3]-b[1] for b in bbs);PAD=2;FW=mw+PAD*2+2;FH=mh+PAD
sheet=Image.new('RGBA',(FW*4,FH),(0,0,0,0))
for i,(sm,b) in enumerate(zip(small,bbs)):
    cut=sm.crop(b);cx=(b[0]+b[2])/2
    sheet.paste(cut,(i*FW+round(FW/2-(b[2]-b[0])/2),FH-(b[3]-b[1])))
sheet.save(sys.argv[2]);print('frame',FW,FH)
