from PIL import Image
fl='mz/cbfb7d14-1794429534672_FlyingForestEnemies_FREE/FlyingForestEnemies_FREE/Enemy3/Enemy3-Movement-In-Animation/Enemy3-'
gb='mz/ee88607f-1794429539592_Golems_Free_Version/Golems_Free_Version/Golem_1/%s/No_Swoosh_VFX/Golem_1_'
sk='mz/ea11cd20-1794429111141_Seeker_Lite/Seeker_Lite/Spritesheets/Seeker_Void_'
def frames(path,fw):
  im=Image.open(path).convert('RGBA');return [im.crop((i*fw,0,i*fw+fw,im.height)) for i in range(im.width//fw)]
def strip(fr,name):
  w,h=fr[0].size;out=Image.new('RGBA',(w*len(fr),h))
  for i,f in enumerate(fr):out.paste(f,(i*w,0))
  out.save(name,optimize=True);return len(fr)
cnt={}
# flyer
F=lambda n:frames(fl+n+'.png',64)
st,lp,en=F('AttackSmashStart'),F('AttackSmashLoop'),F('SmashEnd')
cnt['flyer']={'idle':strip(F('Idle'),'flyer-idle.png'),'run':strip(F('Fly'),'flyer-run.png'),'attack':strip(st+en,'flyer-attack.png'),'attack2':strip(st+lp+lp+en,'flyer-attack2.png'),'hit':strip(F('Hit-NoVFX'),'flyer-hit.png'),'die':strip(F('Die'),'flyer-die.png')}
# golems
for col,key in [('Orange','golemo'),('Blue','golemb')]:
  G=lambda n:frames(gb%col+n+'.png',90)
  cnt[key]={'idle':strip(G('idle'),f'{key}-idle.png'),'run':strip(G('walk'),f'{key}-run.png'),'attack':strip(G('attack'),f'{key}-attack.png'),'attack2':strip(G('attack'),f'{key}-attack2.png'),'hit':strip(G('hurt'),f'{key}-hit.png'),'die':strip(G('die'),f'{key}-die.png')}
# seeker: normalize to 152x82, feet at (76,54)
CW,CH,FX,FY=152,82,76,54
def norm(path,fw,fh,feet):
  out=[]
  for f in frames(path,fw):
    c=Image.new('RGBA',(CW,CH));c.paste(f,(FX-feet[0],FY-feet[1]));out.append(c)
  return out
S={'idle':('Idle_30x30_24f',30,30,(15,28)),'run':('Run_30x30_10f',30,30,(17,28)),'attack':('Attack1_90x50_8f',90,50,(16,38)),'hit':('Hurt_55x80_9f',55,80,(26,52)),'die':('Death_40x50_20f',40,50,(20,48))}
cnt['seeker']={}
for k,(n,fw,fh,ft) in S.items():cnt['seeker'][k]=strip(norm(sk+n+'.png',fw,fh,ft),f'seeker-{k}.png')
cnt['seeker']['attack2']=strip(norm(sk+'Attack1_90x50_8f.png',90,50,(16,38)),'seeker-attack2.png')
print(cnt)
