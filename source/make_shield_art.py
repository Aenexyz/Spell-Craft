from PIL import Image, ImageFilter
from collections import deque
s=1024/1040
KEYS=['warden_shield','kite_shield','tower_shield','thorn_buckler','mirror_aegis','ember_heater','spiked_shield','knight_shield','explosion_orb']
def cut(im,i):
  c,r=i%4,i//4;x=(c*260+66)*s;y=(50+r*275+14)*s;m=8
  a=im.crop((round(x-m),round(y-m),round(x+128*s+m),round(y+128*s+2))).convert('RGBA')
  W,H=a.size;px=a.load()
  bg=[px[2,2][:3],px[W-3,2][:3]]
  def isbg(p):return min(sum((p[k]-b[k])**2 for k in range(3)) for b in bg)<26**2
  seen=set();q=deque([(x,y) for x in range(W) for y in (0,H-1)]+[(x,y) for y in range(H) for x in (0,W-1)])
  while q:
    x,y=q.popleft()
    if (x,y) in seen or not(0<=x<W and 0<=y<H):continue
    seen.add((x,y))
    if not isbg(px[x,y]):continue
    px[x,y]=(0,0,0,0);q.extend([(x+1,y),(x-1,y),(x,y+1),(x,y-1)])
  # soften: pixels near bg-coloured fringe
  bb=a.getbbox();a=a.crop(bb);sq=max(a.size);o=Image.new('RGBA',(sq,sq));o.paste(a,((sq-a.width)//2,(sq-a.height)//2));return o
F=Image.open('/mnt/user-data/uploads/9839ec4f-image.png').convert('RGB');B=Image.open('/mnt/user-data/uploads/658a1ba3-image.png').convert('RGB')
def to64(o):
  r=o.resize((60,60),Image.LANCZOS);al=r.split()[3].point(lambda v:255 if v>110 else 0);r.putalpha(al);c=Image.new('RGBA',(64,64));c.paste(r,(2,2),r);return c
fr=[to64(cut(F,i)) for i in range(9)];bk=[to64(cut(B,i)) for i in range(9)]
# back strip + hi-res previews
strip=Image.new('RGBA',(64*9,64))
for i,b in enumerate(bk):strip.paste(b,(i*64,0))
strip.save('shield-back.png')
fs=Image.new('RGBA',(64*9,64))
for i,b in enumerate(fr):fs.paste(b,(i*64,0))
fs.save('shield-front.png')
atlas=Image.open('items_backup_v134.png').convert('RGBA')
IDX={'warden_shield':77,'kite_shield':23,'tower_shield':73,'thorn_buckler':74,'mirror_aegis':75,'ember_heater':76,'spiked_shield':24,'knight_shield':47,'explosion_orb':72}
for k,f in zip(KEYS,fr):
  i=IDX[k];x,y=(i%8)*64,(i//8)*64;atlas.paste(Image.new('RGBA',(64,64)),(x,y));atlas.paste(f,(x,y))
atlas.save('items.png')
pv=Image.new('RGBA',(64*9,128),(30,43,42,255))
pv.alpha_composite(fs,(0,0));pv.alpha_composite(strip,(0,64));pv.resize((64*9*3,128*3),Image.NEAREST).save('shn/pv.png')
