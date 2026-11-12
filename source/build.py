import base64,io,json
from PIL import Image
def uri(path,webp=False):
  if webp:
    b=io.BytesIO();Image.open(path).convert('RGB').save(b,'WEBP',quality=92,method=6);data=b.getvalue();mt='image/webp'
  else: data=open(path,'rb').read();mt='image/png'
  return f'data:{mt};base64,'+base64.b64encode(data).decode()
A={'forest':uri('bg-forest.png',True),'camp':uri('bg-camp.png',True),'hero':uri('hero2.png'),'items':uri('items.png'),'hbFrame':uri('hb_frame.png'),'ice':uri('ice.png'),'slash':uri('slashes.png'),'stonep':uri('stonepunch.png'),'golemsp':uri('golemspirit.png'),'stonehit':uri('stonehit.png'),'lstrike':uri('lstrike.png'),'lava':uri('bg-lava.png',True),'night':uri('bg-night.png',True),'blood':{n:uri(f'blood-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'demon':{n:uri(f'demon-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'embrace':uri('embrace.png'),'flyer':{n:uri(f'flyer-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'golemo':{n:uri(f'golemo-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'golemb':{n:uri(f'golemb-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'seeker':{n:uri(f'seeker-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'orc':{n:uri(f'orc-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'soldier':{n:uri(f'soldier-{n}.png') for n in ['idle','run','attack','attack2','hit','die']},'hbG':uri('hb_green.png'),'hbB':uri('hb_blue.png'),'hbR':uri('hb_red.png'),
   'mush':{n:uri(f'mush-{n}.png') for n in ['idle','run','attack','hit','die','stun']}}
s=open('fusebound.src.html').read().replace('/*__ASSETS__*/','const ASSET='+json.dumps(A)+';')
open('fusebound.html','w').write(s);print(len(s)//1024,'KB',{k:len(v)//1024 for k,v in A.items() if k!='mush'})
