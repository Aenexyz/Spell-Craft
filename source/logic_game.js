/* ================= state helpers ================= */
const HAND=4,MAX_CARDS=8;
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pickN=(arr,n)=>shuffle(arr).slice(0,n);
function newGame(){
  S={v:2,phase:'title',mana:100,maxMana:100,hp:50,maxHp:50,baseMax:50,gear:{},perm:{atk:0,def:0},deck:[],uid:0,level:0,node:0,route:[],enemy:null,hand:[],draw:[],disc:[],sel:[],
    block:0,barrier:0,barrierT:0,thorns:null,dodge:0,parry:null,counter:null,log:[],codex:[],turns:0,kills:0,ev:null,reward:null,busy:false,codexOpen:false,charOpen:false,acq:null,toast:null};
  ['stab','punch','block'].forEach(k=>addCard(k));addCard(rnd(ELEMS));
  S.gear.weapon={key:'starter_sword',rarity:'common',stats:{},cardLvl:1};
  S.route=buildLevel(0);
}
function addCard(key,lvl=1){S.deck.push({id:'c'+(++S.uid),key,lvl})}
function buildLevel(li){
  const L=LEVELS[li],evs=shuffle(EVENT_KEYS);let mi=0,ei=0;
  return LAYOUT.map(t=>{
    if(t==='m'){const P=L.pool.length,idx=Math.min(P-1,Math.floor(mi*P/6+Math.random()*P*.2));mi++;return{k:'m',id:L.pool[idx]}}
    if(t==='elite'){const top=shuffle(L.pool.slice(Math.floor(L.pool.length/2))),ids=[top[0],top[1]||top[0]];return{k:'elite',id:ids[0],ids}}
    if(t==='boss')return{k:'boss',id:L.boss};
    if(t==='ev')return{k:'ev',id:evs[ei++%evs.length]};
    return{k:t};
  });
}
const curNode=()=>S.route[S.node];
const isFight=n=>n&&(n.k==='m'||n.k==='elite'||n.k==='boss');
function stageNode(n){
  if(!n)return null;
  if(isFight(n))return{fight:true,id:n.id,ids:n.ids,elite:n.k==='elite'};
  return{fight:false,prop:n.k==='ev'?EVENTS[n.id].prop:n.k==='chest'?'chest':null};
}
function nodeName(n){
  if(!n)return'';
  if(n.k==='m')return ENEMIES[n.id].name;if(n.k==='elite')return'Elite '+(n.ids||[n.id]).map(i=>ENEMIES[i].name).join(' & ');if(n.k==='boss')return ENEMIES[n.id].name;
  if(n.k==='ev')return EVENTS[n.id].name;if(n.k==='camp')return'Camp';if(n.k==='chest')return'Treasure Chest';return'';
}
function stats(){
  const t={atk:S.perm.atk||0,def:S.perm.def||0,lv:{}};
  Object.values(S.gear).forEach(g=>{for(const k in g.stats){if(k==='lv'){for(const e in g.stats.lv)t.lv[e]=(t.lv[e]||0)+g.stats.lv[e]}else t[k]=(t[k]||0)+g.stats[k]}});
  return t;
}
function recalc(){const old=S.maxHp;S.maxHp=S.baseMax+(stats().hp||0);if(S.maxHp>old)S.hp+=S.maxHp-old;S.hp=Math.min(S.hp,S.maxHp)}
function grantedCards(){return Object.entries(S.gear).filter(([,g])=>ITEMS[g.key].grant).map(([slot,g])=>({id:'g-'+slot,key:ITEMS[g.key].grant,lvl:g.cardLvl||1,granted:true,slot}))}
function battleDeck(){return S.deck.concat(grantedCards())}
const card=id=>battleDeck().find(c=>c.id===id);
function effLv(c){const s=stats();return Math.min(5,c.lvl||1)+((s.lv||{})[c.key]||0)+(CARDS[c.key]&&CARDS[c.key].cat==='elem'?(s.elv||0):0)}
function pw(c){const d=CARDS[c.key],L=effLv(c);if(c.key==='slash')return Math.round(d.pow*.9*L);if(c.key==='dodge')return Math.min(95,d.pow+(L-1)*8);return d.pow+(L-1)*2}
const powLabel=c=>c.key==='dodge'?pw(c)+'%':pw(c);

/* ================= fusion ================= */
function sortPair(c1,c2){return[c1,c2].sort((x,y)=>CO[CARDS[x.key].cat]-CO[CARDS[y.key].cat]||x.key.localeCompare(y.key))}
function fuse(c1,c2){
  const[a,b]=sortPair(c1,c2),A=CARDS[a.key],B=CARDS[b.key],pa=pw(a),pb=pw(b);
  const r={dmg:[],block:0,barrier:0,heal:0,parry:null,dodge:0,counter:null,fx:[],breaker:false,thorns:null,lifesteal:0,drain:false,stun:false,phys:[],kind:'melee',anim:'punch',ranged:null,trail:null};
  r.key=a.key+'+'+b.key;const same=a.key===b.key,cat=A.cat+'+'+B.cat;
  const animOf=k=>k==='shieldbash'?'shield':k==='kick'?'kick':k==='slash'?'slash':'punch';
  const addPhys=(c,p)=>{const d=CARDS[c.key];r.dmg.push({t:d.type,p,k:c.key});r.phys.push(c.key);if(d.block)r.block+=d.block;if(d.breaker)r.breaker=true;if(d.ranged){r.kind='ranged';r.ranged=d.ranged}};
  if(cat==='phys+phys'){
    r.breaker=true;
    if(same){r.name=SAMEN[a.key];r.dmg=[{t:A.type,p:Math.round((pa+pb)*1.15),k:a.key}];r.phys=[a.key,a.key];if(['slash','stab','punch','kick'].includes(a.key)){r.double=true;r.gap=a.key==='slash'?100:(a.key==='punch'||a.key==='kick')?250:500}if(A.block)r.block=A.block*2;if(A.ranged){r.kind='ranged';r.ranged=A.ranged}}
    else if(r.key==='arrowshot+kick'){r.name='Air Volley';r.charged={sum:effLv(a)+effLv(b),lo:.8,hi:10,float:true};r.dmg=[{t:'pierce',p:Math.round(r.charged.sum*5.4),k:'arrowshot'}];r.phys=['arrowshot'];r.kind='ranged';r.ranged='volley';r.block=0;r.breaker=false;r.dodgeAdd=40}
    else if(['arrowshot+punch','arrowshot+stab','arrowshot+shieldthrow','arrowshot+shieldbash'].includes(r.key)){r.name='Charged Shot';r.charged={sum:effLv(a)+effLv(b)};r.dmg=[{t:'pierce',p:r.charged.sum*5,k:'arrowshot'}];r.phys=['arrowshot'];r.kind='ranged';r.ranged='charged';r.block=0;r.breaker=false}
    else{addPhys(a,pa);addPhys(b,pb);r.name=PAIRN[r.key]||`${NOUN[a.key]}-${NOUN[b.key]} Combo`;const BASIC=['slash','stab','punch','kick'];if(BASIC.includes(a.key)&&BASIC.includes(b.key)){r.combo=true;r.gap=0}}
    r.anim=(a.key==='shieldbash'||b.key==='shieldbash')?'shield':(a.key==='slash'||b.key==='slash')?'slash':(a.key==='kick'||b.key==='kick')?'kick':'punch';
  }else if(cat==='phys+elem'){
    addPhys(a,pa);r.dmg.push({t:b.key,p:pb+2});r.fx=[b.key];r.name=`${ADJ[b.key]} ${NOUN[a.key]}`;r.anim=animOf(a.key);r.trail=b.key;
    if(['punch','stab','kick','slash'].includes(a.key)&&b.key==='lightning'){const u=effLv(a)+effLv(b);r.name='Lightning Strike';r.lstrike=a.key;r.fx=[];r.trail=null;r.kind='melee';r.anim=a.key==='stab'?'punch':a.key;r.charged={sum:u,ilo:3,ihi:6,crit:5,add:5+u};r.dmg=[{t:'lightning',p:5+u+u*4,k:a.key}];r.phys=[a.key];r.block=0;r.stunChance=Math.min(100,10*u);r.stunType='lightning'}
    if(a.key==='punch'&&b.key==='earth'){const lp=effLv(a),le=effLv(b),n=lp>=5?3:1;r.name='Stone Punch';r.stonePunch=n;r.fx=[];r.trail=null;r.kind='ranged';r.dmg=[{t:'blunt',p:5*(lp+le)*n,k:'spunch'}];r.segs=Array.from({length:n},()=>({k:'spunch'}));r.freeEarth=lp>le}
  }else if(cat==='elem+elem'){
    r.kind='cast';r.pure=true;
    if(same){r.name=SAMEN[a.key];r.dmg=[{t:a.key,p:Math.round((pa+pb)*1.3)}];r.fx=[a.key,a.key];
      if(a.key==='lightning'){r.ticks=5;r.verb='Summons a thunderstorm';r.dmg=[{t:'lightning',p:(effLv(a)+effLv(b))*5}];r.fx=[];r.stunTick=25}
      if(a.key==='earth'){r.name='Earthquake';r.ticks=5;r.verb='Shakes the ground';r.dmg=[{t:'earth',p:2*(effLv(a)+effLv(b))*5}];r.fx=[];r.quake=true;r.stunChance=50}
      if(a.key==='ice'){r.ticks=5;r.verb='Calls down a blizzard';r.dmg=[{t:'ice',p:Math.min(10,effLv(a)+effLv(b))*5}]}}
    else{r.name=PAIRN[r.key];r.dmg=[{t:a.key,p:pa+1},{t:b.key,p:pb+1}];r.fx=[a.key,b.key];
      if(r.key==='fire+water'){r.fx=[];r.blind=25+5*Math.min(10,(effLv(a)-1)+(effLv(b)-1))}
      if(r.key==='earth+fire'){const le=effLv(a),lf=effLv(b),u=le+lf,n=u>=10?3:u>=6?2:1;r.name=n>1?'Meteor Shower':'Meteor';r.meteor=n;r.fx=[];r.kind='cast';r.dmg=[{t:'earth',p:5*le*n,k:'meteor'},{t:'fire',p:2*lf*n,k:'meteor'}];r.segs=Array.from({length:n},()=>({k:'meteor'}));r.burnSet=3}
      if(r.key==='lightning+water')r.stun=true;
      if(r.key==='earth+water'){r.name='Mudslide';r.fx=[];r.dmg=[{t:'earth',p:3*(effLv(a)+effLv(b))}];r.mud=1}
      if(r.key==='earth+ice'){r.name='Ice Age';r.dmg=[];r.fx=[];r.kind='support';r.iceAge=3}
      if(['fire+light','fire+lightning','light+lightning'].includes(r.key)){const u=effLv(a)+effLv(b);r.ticks=8;r.tickW=[1,1,1,1,1,2,2,3];r.tickCap=20;r.verb='Fires a searing laser beam';r.dmg=[{t:r.key==='light+lightning'?'lightning':'fire',p:u*12}];r.fx=[];r.stun=false;r.breaker=false;if(u>=6){r.phoenix=.5;r.verb='A phoenix rises as you fire a searing laser beam'}}
      if(r.key==='ice+water'){r.ticks=10;r.tickFlat=true;r.verb='Encases it in ice';r.dmg=[{t:'ice',p:10}];r.fx=[];r.freeze=true}
      if(r.key==='light+water'){r.kind='support';r.dmg=[];r.fx=[];r.holyRain=effLv(a)+effLv(b)}
      if(r.key==='dark+light'){const u=effLv(a)+effLv(b);r.ticks=5;r.tickTypes=['dark','light','dark','light','dark'];r.verb='Opens an eclipse above it';r.dmg=[{t:'dark',p:u*5}];r.fx=[]}
      if(r.key==='ice+wind'){r.ticks=5;r.verb='Calls down a blizzard';r.dmg=[{t:'ice',p:Math.min(10,effLv(a)+effLv(b))*5}];r.fx=['ice','ice']}
      if(r.key==='lightning+wind'){r.ticks=5;r.verb='Summons a thunderstorm';r.dmg=[{t:'lightning',p:(effLv(a)+effLv(b))*5}];r.fx=[];r.stunTick=25}
      if(r.key==='earth+wind'){const la=effLv(a),lb=effLv(b);r.ticks=3;r.verb='Whips up a sandstorm';r.dmg=[{t:'earth',p:(la+lb)*3}];r.fx=[];r.dodge=Math.min(50,5*(la+lb))}}
  }else if(cat==='phys+def'||cat==='phys+sup'){
    addPhys(a,Math.round(pa*.75));r.anim=animOf(a.key);const N=NOUN[a.key];
    if(b.key==='block'){r.block+=pb;r.name=`${A.name} and Block`}
    else if(b.key==='shield'){r.barrier=pb;r.name=SHIELDN[a.key]||`Shield ${N}`}
    else if(b.key==='parry'){r.parry={p:pb,t:A.type};r.name=`${N} Riposte`}
    else if(b.key==='dodge'){r.dodge=pb;r.name=`Sidestep ${N}`}
    else if(b.key==='counter'){r.counter={p:pb,t:A.type};r.name=`Counter ${N}`}
    else if(b.key==='heal'){r.lifesteal=.6;r.dmg[0].p=pa;r.name=`Vampiric ${N}`}
  }else if(cat==='elem+def'||cat==='elem+sup'){
    const e=a.key,AD=ADJ[e];r.kind='support';
    if(b.key==='shield'){r.barrier=pb+2;r.thorns=e;r.name=`${AD} Barrier`;
      if(e==='water'){r.name='Bubble Shield';r.barrier=Math.round(r.barrier*1.5)}
      if(e==='earth'){r.name='Stone Wall';r.barrier=Math.round(r.barrier*1.6);r.thorns=null}
      if(e==='wind'){r.name='Wind Wall';r.dodge=25}}
    else if(b.key==='block'){r.block=pb;r.fx=[e];r.name=`${AD} Guard`;if(e==='ice'){r.name='Reflect';r.fx=[];r.block=5+effLv(a)+effLv(b);r.reflect=true}
      if(e==='earth'){const u=effLv(a)+effLv(b);r.fx=[];r.block=5*u;r.immuneChance=Math.min(100,10*u)}
      if(e==='lightning'){r.name='Electric Field';r.fx=[];r.block=6+effLv(a)+effLv(b);r.efield=true}}
    else if(b.key==='parry'){r.parry={p:pb+2,t:e};r.name=`${AD} Riposte`}
    else if(b.key==='dodge'){r.dodge=pb;r.fx=[e];r.name=`${AD} Step`;if(e==='wind'){r.name='Blink';r.dodge=100;r.fx=[]}}
    else if(b.key==='counter'){r.counter={p:pb+pa,t:e};r.name=`${AD} Retaliation`}
    else if(b.key==='heal'){r.heal=pb;r.fx=[e];r.name=HEALN[e];
      if(e==='water'){r.heal=0;r.fx=[];r.kind='support';r.holyRain=effLv(a)+effLv(b);r.rainFlat=true}
      if(e==='light'){r.heal=Math.round(pb*1.6);r.fx=[]}
      if(e==='dark'){r.heal=0;r.drain=true;r.dmg=[{t:'dark',p:pa+pb}];r.kind='cast'}
      if(e==='lightning'){r.dmg=[{t:'lightning',p:pa}];r.kind='cast'}
      if(e==='ice'){r.name='Cold Embrace';r.heal=0;r.fx=[];r.dmg=[];r.kind='support';r.embrace=effLv(a)+effLv(b)}}
  }else{
    r.kind='support';
    const comp=(c,p,m=1)=>{const k=c.key,v=Math.round(p*m);if(k==='block')r.block+=v;if(k==='shield')r.barrier+=v;if(k==='parry')r.parry={p:v,t:'blunt'};if(k==='dodge')r.dodge=Math.max(r.dodge,v);if(k==='counter')r.counter={p:v,t:'blunt'};if(k==='heal')r.heal+=v};
    if(same){comp(a,pa+pb,1.3);r.name=SAMEN[a.key];if(a.key==='parry')r.parry.full=true;if(a.key==='dodge')r.dodge=Math.min(95,Math.round(Math.max(pa,pb)*1.6))}
    else{comp(a,pa);comp(b,pb);r.name=PAIRN[r.key]||`${A.name} & ${B.name}`;
      if(r.key==='counter+parry')r.counter.p*=2;
      if(r.key==='counter+dodge')r.counter.p=Math.round(r.counter.p*1.5);
      if(r.key==='parry+shield')r.parry.p=Math.round(r.parry.p*1.5);
      if(r.key==='block+shield'){r.block=10;r.barrier=(effLv(a)+effLv(b))*2;if(effLv(a)+effLv(b)>=6)r.manaGuard=.5}}
  }
  r.charge=[...new Set([a,b].filter(c=>CARDS[c.key].cat==='elem').map(c=>c.key))];
  r.weapon=r.anim==='shield'?'none':(r.anim==='kick'||(r.anim==='punch'&&r.phys.includes('punch')&&!r.phys.includes('stab')))?'back':'hand';
  if(r.dmg.length===0&&r.kind!=='support')r.kind='support';
  if(r.dmg.length&&r.kind==='support')r.kind='cast';
  return r;
}
function gearFuse(c1,c2){
  const R=fuse(c1,c2),g=stats();
  R.base=R.dmg.reduce((a,p)=>a+p.p,0);
  R.dmg=R.dmg.map(p=>({t:p.t,p:p.p+(g[p.t]||0),k:p.k}));
  if(R.combo)R.seq=[c1.key,c2.key];
  const BASIC=['slash','stab','punch','kick'],pc=[c1,c2].filter(c=>CARDS[c.key].cat==='phys');
  if(R.kind==='melee'&&!R.lstrike&&pc.length&&pc.every(c=>BASIC.includes(c.key))){const sg=[];pc.forEach(c=>{const n=c.key==='slash'?effLv(c):1;for(let i=0;i<n;i++)sg.push({k:c.key})});if(sg.length>1){R.segs=sg;R.double=false;R.combo=false}}
  if(c1.key==='slash'&&c2.key==='slash'&&effLv(c1)+effLv(c2)>=3)R.name='Omnislash';
  const sc=[c1,c2].find(c=>c.key==='slash'),ic=[c1,c2].find(c=>ESLASH[c.key]);
  if(sc&&ic&&c1.key!==c2.key){const n=effLv(sc),el=ic.key,sk=ESLASH[el];R.name={ice:'Freezing Slash',fire:'Burning Slash',water:'Aqua Slash',dark:'Abyssal Slash'}[el];R.fslash=true;R.eslash=el;R.segs=Array.from({length:n},()=>({k:sk}));R.double=false;R.combo=false;R.fx=[];R.trail=el;if(el==='ice')R.freezeChance=10+(S.iceAge>0?30:0)+(S.enemy&&S.enemy.mud>0?50:0);if(el==='fire')R.burnHit=2;if(el==='water')R.healHit=3;if(el==='dark')R.vulnHit=10;
    R.dmg=R.dmg.map(p=>p.t===el?{t:el,p:effLv(ic)*n+(g[el]||0),k:sk}:{...p,k:sk});R.base=R.dmg.reduce((a,p)=>a+p.p,0)-(g[el]||0)-(g.slash||0)}
  if(R.dmg.length&&g.atk)R.dmg[0].p+=g.atk;
  R.bonus=R.dmg.reduce((a,p)=>a+p.p,0)-R.base;
  return R;
}

/* ================= loot ================= */
function rollLoot(boost,minR){
  if(!minR&&Math.random()<.22){const k=rnd(POTION_KEYS);return{key:k,rarity:'common',stats:{...ITEMS[k].stats}}}
  const k=rnd(GEAR_KEYS),r=Math.random(),n=S.level*5+S.node*.35+(boost||0);
  let rarity=r<.04+n*.012?'epic':r<.2+n*.025?'rare':'common';
  if(ITEMS[k].grant&&RANK[rarity]<1)rarity='rare';
  if(ITEMS[k].fixed)rarity=ITEMS[k].fixed;
  if(minR&&RANK[rarity]<RANK[minR])rarity=minR;
  const mult={common:1,rare:1.5,epic:2}[rarity],st={};
  for(const s in ITEMS[k].stats){if(s==='revive'){st.revive=1}else if(s==='elv'){st.elv=rarity==='epic'?2:1}else if(s==='lv'){st.lv={};for(const e in ITEMS[k].stats.lv)st.lv[e]=rarity==='epic'?2:1}else st[s]=Math.max(1,Math.round(ITEMS[k].stats[s]*mult))}
  return{key:k,rarity,stats:st};
}
const STAT_TEXT={addl:v=>`+${v} Lightning damage added to every attack`,soul:v=>`Each kill adds +${v} Dark damage to every attack`,souls:v=>v?`Souls gathered: +${v} Dark damage now`:null,revive:()=>'If you fall, revive once with 50% HP and 30% mana (the amulet then shatters)',elv:v=>`+${v} level to all Element cards`,mcost:v=>`Element cards cost ${v} less mana`,atk:v=>`+${v} damage on every attack`,def:v=>`+${v} block at the start of each turn`,hp:v=>`+${v} max HP`,regen:v=>`Heal ${v} more after each fight`,
  heal:v=>`Restores ${v} HP now`,pdef:v=>`+${v} block each turn, permanently`,php:v=>`+${v} max HP, permanently`,patk:v=>`+${v} damage on every attack, permanently`};
function statLines(st,key){
  const out=[];
  for(const[k,v]of Object.entries(st)){
    if(k==='lv'){for(const e in v)out.push(`+${v[e]} level to ${CARDS[e].name} cards`)}
    else{const t=STAT_TEXT[k]?STAT_TEXT[k](v):`+${v} ${TYPENAME[k]} damage`;if(t)out.push(t)}
  }
  if(key&&ITEMS[key].grant)out.push(`Unlocks the ${CARDS[ITEMS[key].grant].name} card`);
  return out;
}
function itemIcon(key,size){
  const i=ITEM_ATLAS.idx[key],c=ITEM_ATLAS.cols,r=ITEM_ATLAS.rows;
  return `<span class="item-ic" role="img" aria-label="${ITEMS[key].name}" style="width:${size}px;height:${size}px;background-size:${c*size}px ${r*size}px;background-position:-${(i%c)*size}px -${Math.floor(i/c)*size}px"></span>`;
}
function curLoot(){return (S.phase==='event'||S.phase==='chest')?S.ev&&S.ev.loot:null}
function useLoot(given){
  const L=given||curLoot();if(!L||L.done)return;const it=ITEMS[L.key];
  if(it.slot){const old=S.gear[it.slot];S.gear[it.slot]={key:L.key,rarity:L.rarity,stats:L.stats,cardLvl:1};recalc();
    L.msg=`You equip the ${it.name}${old?` and stow the ${ITEMS[old.key].name}`:''}.${it.grant?` The ${CARDS[it.grant].name} card joins your deck.`:''}`;Stage.playerBurst(RARITY_GLOW[L.rarity])}
  else{const st=L.stats;
    if(st.heal){const h=Math.min(st.heal,S.maxHp-S.hp);S.hp+=h;L.msg=`You drink the ${it.name} and recover ${h} HP.`;Stage.float('player',`+${h}`,'#7fe08a','HEAL')}
    if(st.pdef){S.perm.def+=st.pdef;L.msg=`Your skin hardens. +${st.pdef} block each turn.`}
    if(st.php){S.baseMax+=st.php;S.maxHp+=st.php;S.hp+=st.php;L.msg=`You feel sturdier. +${st.php} max HP.`}
    if(st.patk){S.perm.atk+=st.patk;L.msg=`Your blood runs hot. +${st.patk} damage on every attack.`}
    Stage.playerBurst('#7fe08a')}
  L.done=true;Stage.clearDrop();if(!given)render();
}
function leaveLoot(){const L=curLoot();if(!L||L.done)return;L.done=true;L.msg=`You leave the ${ITEMS[L.key].name} behind.`;Stage.clearDrop();render()}

/* ================= card acquisition ================= */
function offerCard(key,then){S.acq={key,then:then||'none',step:'choose'};render()}
function acqFinish(msg){
  const t=S.acq&&S.acq.then;S.acq=null;if(msg)S.toast=msg;
  if(t==='advance')advance();else if(t==='nextlevel')nextLevel();else render();
}
function acqAction(act,id){
  const A=S.acq;if(!A)return;const name=CARDS[A.key].name;
  if(act==='acqadd'){addCard(A.key);acqFinish(`${name} added to your deck.`)}
  else if(act==='acqcopy'){addCard(A.key);acqFinish(`You keep a second ${name}. Pair them for ${SAMEN[A.key]}.`)}
  else if(act==='acqup'){const c=S.deck.filter(x=>x.key===A.key&&x.lvl<5).sort((x,y)=>y.lvl-x.lvl)[0];if(c){c.lvl++;acqFinish(`${name} upgraded to level ${c.lvl}.`)}}
  else if(act==='acqreplace'){A.step='replace';render()}
  else if(act==='acqback'){A.step='choose';render()}
  else if(act==='acqpick'){const old=S.deck.find(x=>x.id===id);if(!old)return;S.deck=S.deck.filter(x=>x.id!==id);addCard(A.key);acqFinish(`${CARDS[old.key].name} replaced with ${name}.`)}
  else if(act==='acqdiscard'){acqFinish(`You leave the ${name} card.`)}
}

/* ================= flow ================= */
function travel(){
  S.drop=null;Stage.setBg(LEVELS[S.level].bg||'forest');S.phase='travel';S.busy=true;S.sel=[];render();
  Stage.walkTo(stageNode(curNode()),()=>startNode());
}
function startNode(){
  const n=curNode();
  if(isFight(n))startBattle(n);
  else if(n.k==='camp'){S.ev={id:'camp',step:'main'};S.phase='camp';S.busy=false;render()}
  else if(n.k==='chest'){S.ev={id:'chest',step:'main'};S.phase='chest';S.busy=false;render()}
  else startEvent(n.id);
}
const aliveFoes=()=>(S.foes||[S.enemy]).filter(f=>f&&f.hp>0);
function setTarget(F){S.enemy=F;S.tgt=F;Stage.focus(F.slot||0)}
function startBattle(n){
  const d=ENEMIES[n.id],L=LEVELS[S.level],elite=n.k==='elite',boss=n.k==='boss';
  const ids=n.ids||[n.id],duo=ids.length>1;
  S.foes=ids.map((id,slot)=>{const dd=ENEMIES[id],hp=Math.round(dd.hp*(boss?1:L.hp)*(elite?(duo?1.15:1.5):1));return{id,slot,elite,boss,hp,max:hp,block:0,str:0,bonus:boss?0:L.dmg+(elite?(duo?1:2):0),burn:0,chill:0,curse:0,soak:0,stun:false,step:slot,known:[],enraged:false}});
  S.enemy=S.foes[0];S.tgt=S.enemy;
  S.draw=shuffle(battleDeck().map(c=>c.id));S.hand=[];S.disc=[];S.sel=[];
  S.block=stats().def;S.barrier=0;S.barrierT=0;S.manaGuard=0;S.manaGuardT=0;S.iceAge=0;S.stoneSkin=false;Stage.iceFloor(false);S.thorns=null;S.dodge=0;S.parry=null;S.counter=null;S.guarding=false;S.rainNext=0;S.embrace=false;S.reflect=false;S.efield=false;S.busy=false;
  S.log=[duo?`An elite pair blocks the road: ${ids.map(i=>ENEMIES[i].name).join(' and ')}. Tap a monster to target it.`:`${elite?'An elite ':''}${d.name} blocks the road.`];
  drawHand();S.phase='battle';render();
}
function drawHand(){
  const valid=new Set(battleDeck().map(c=>c.id));
  S.hand=S.hand.filter(id=>valid.has(id));S.draw=S.draw.filter(id=>valid.has(id));S.disc=S.disc.filter(id=>valid.has(id));
  while(S.hand.length<HAND&&(S.draw.length||S.disc.length)){
    if(!S.draw.length){S.draw=shuffle(S.disc);S.disc=[]}
    S.hand.push(S.draw.pop());
  }
}
function log(s){S.log.unshift(s);if(S.log.length>40)S.log.pop()}
function intentOf(E){const p=ENEMIES[E.id].pattern;return p[E.step%p.length]}
const iceAgeHits=E=>S.iceAge>0&&E&&modOf(E,'ice')>=1;
function intentText(E){
  const[t,v,n]=intentOf(E);const s=E.str+E.bonus;const ch=x=>{x=E.chill?Math.round(x*.6):x;return iceAgeHits(E)?Math.round(x*.5):x};const I=INTENTS[t];
  let val;
  if(t==='multi')val=`${ch(v+s)} × ${n}`;
  else if(t==='def')val=`+${v}`;else if(t==='buff')val=`+${v}`;else if(t==='heal')val=`+${v}`;
  else val=ch(v+s);
  return{label:I.label,val,icon:I.icon,cls:I.cls||'',note:I.note||'',type:t};
}
const modOf=(E,t)=>ENEMIES[E.id].mods[t]??1;
function dealToEnemy(p,t,label,delay){
  const E=S.enemy;const m=modOf(E,t);if(!E.known.includes(t))E.known.push(t);
  let d=p*m;if(E.curse>0)d*=1.3;if(E.shocked)d*=1.1;if(E.vuln)d*=1+E.vuln/100;if(E.mud>0&&t==='lightning')d*=2;d=Math.round(d);E.hp-=d;
  Stage.float('enemy',d,hexOf(t),label,delay);setTimeout(()=>Stage.hitEnemy([t]),delay||0);
  return d;
}
function applyElem(f,E,def){
  if(def.mods[f]===0)return '';
  if(f==='fire'){E.burn+=2}
  if(f==='water'){E.soak=Math.max(E.soak,2)}
  if(f==='ice'){E.chill=Math.min(2,E.chill+1)}
  if(f==='earth'){S.block+=4}
  if(f==='wind'){S.dodge=Math.max(S.dodge,30)}
  if(f==='lightning'&&Math.random()<.35){E.stun=true;return 'stunned it'}
  if(f==='dark'){E.curse+=2}
  if(f==='light'){S.hp=Math.min(S.maxHp,S.hp+3)}
  return '';
}

function manaCost(c){if(!c||!CARDS[c.key])return 0;const cat=CARDS[c.key].cat;if(cat==='elem')return Math.max(0,10-(stats().mcost||0));if(cat==='phys')return -(5+Math.max(0,effLv(c)-1));return 0}
const ESLASH={ice:'fslash',fire:'bslash',water:'aslash',dark:'dslash'};
function chgLo(R){return R.charged.float?Math.round(R.charged.sum*R.charged.lo):R.charged.sum*(R.charged.ilo||3)+(R.charged.add||0)}
function chgHi(R){return R.charged.float?Math.round(R.charged.sum*R.charged.hi):R.charged.sum*(R.charged.ihi||7)+(R.charged.add||0)}
function fuseCost(c1,c2){if(!c1||!c2)return 0;const ks=[c1.key,c2.key],e=ks.find(k=>ESLASH[k]);if(ks.includes('punch')&&ks.includes('earth')){const pc=c1.key==='punch'?c1:c2,ec=c1.key==='earth'?c1:c2;if(effLv(pc)>effLv(ec))return manaCost(pc)}if(ks.includes('slash')&&e)return manaCost(c1.key===e?c1:c2);return manaCost(c1)+manaCost(c2)}
function fslashFreeze(R,E){if(!R.fslash||!E)return;if(R.healHit){const h=Math.min(R.healHit,S.maxHp-S.hp);if(h>0)S.hp+=h;R._healed=(R._healed||0)+h;Stage.float('player',`+${h}`,'#7fe08a','HEAL',280);render();return}if(E.hp<=0)return;if(R.vulnHit){R._vuln=(R._vuln||0)+R.vulnHit;Stage.float('enemy',`+${R._vuln}%`,'#b18bff','DMG TAKEN',220);return}if(R.burnHit){if(modOf(E,'fire')===0){R._resist=true;return}E.burn+=R.burnHit;R._burned=(R._burned||0)+R.burnHit;return}if(E.frozen)return;if(!canFreeze(E)){R._resist=true;return}if(Math.random()*100<R.freezeChance){E.frozen=true;R._froze=true;Stage.float('enemy','FROZEN','#82d4ff','',150)}}
function fslashMana(){const g=Math.min(3,S.maxMana-S.mana);S.mana+=g;Stage.float('player','+3','#6cb2ff','MANA',0)}
function skipTurn(){
  if(S.busy||S.phase!=='battle')return;
  S.busy=true;S.sel=[];if(S.enemy&&S.enemy.vulnT>0&&--S.enemy.vulnT===0)S.enemy.vuln=0;if(S.enemy&&S.enemy.mud>0)S.enemy.mud--;const g=Math.min(20,S.maxMana-S.mana);S.mana+=g;
  Stage.playerBurst('#6cb2ff');Stage.float('player',`+${g}`,'#6cb2ff','MANA',0);log(`You catch your breath and recover ${g} mana.`);
  render();setTimeout(enemyTurn,700);
}
function doFuse(){
  if(S.busy||S.sel.length<2)return;
  const cost=fuseCost(...S.sel.map(card));if(cost>S.mana){S.toast=`Not enough mana. This needs ${cost}, you have ${S.mana}.`;render();return}
  S.busy=true;S.mana=Math.min(S.maxMana,S.mana-cost);if(cost<0)setTimeout(()=>Stage.float('player',`+${-cost}`,'#6cb2ff','MANA',0),250);
  const[c1,c2]=S.sel.map(card);const R=gearFuse(c1,c2);
  if(R.charged){if(R.charged.float){R.mult=R.charged.lo+Math.random()*(R.charged.hi-R.charged.lo);R.dmg[0].p=Math.round(R.charged.sum*R.mult)+R.bonus}else{const lo=R.charged.ilo||3,hi=R.charged.ihi||7;R.mult=lo+Math.floor(Math.random()*(hi-lo+1));R.dmg[0].p=R.charged.sum*R.mult+(R.charged.add||0)+R.bonus;if(R.charged.crit&&R.mult>=R.charged.crit)R.crit=true}}
  render();
  const delay=Stage.perform(R);
  if([c1,c2].some(c=>c.key==='earth'&&effLv(c)>=5))Stage.golem(delay+450);
  if(R.embrace&&R.tickTimes)R.tickTimes.forEach((t,i)=>setTimeout(()=>{if(S.phase!=='battle')return;const h=Math.min(R.embrace,S.maxHp-S.hp);if(h>0)S.hp+=h;Stage.float('player',`+${h}`,'#7fe08a',i===4?'COLD EMBRACE':'',0);render()},t));
  if(R.holyRain&&R.tickTimes)R.tickTimes.forEach((t,i)=>setTimeout(()=>{if(S.phase==='battle')healTick(R.holyRain,i,R.rainFlat)},t));
  if(R.segs&&R.hitTimes)R.hitTimes.slice(0,-1).forEach((t,i)=>setTimeout(()=>preHit(R,i),t));
  if(R.fslash&&R.hitTimes)R.hitTimes.forEach(t=>setTimeout(()=>{if(S.phase==='battle'){fslashMana();render()}},t));
  if(R.ticks&&R.tickTimes)R.tickTimes.slice(0,-1).forEach((t,i)=>setTimeout(()=>{const E=S.enemy;if(!E)return;const td=tickDmg(E,R,i);Stage.float('enemy',td,hexOf(tickType(R,i)),'',0);Stage.hitEnemy([tickType(R,i)]);tickStun(R,E);if(R.phoenix)phoenixHeal(R,td);if(R.quake)aliveFoes().filter(F=>F!==E).forEach(F=>Stage.withFoe(F.slot,()=>{Stage.float('enemy',tickDmg(F,R,i),hexOf('earth'),'',0);Stage.hitEnemy(['earth'])}))},t));
  setTimeout(()=>applyFuse(c1,c2,R),delay);
}
function phoenixHeal(R,d,last){const h=Math.min(Math.round(d*R.phoenix),S.maxHp-S.hp);if(h>0){S.hp+=h;Stage.float('player',`+${h}`,'#ffb04a',last?'PHOENIX':'',0);render()}}
function partDmg(E,p){const m=modOf(E,p.t);let d=p.p*m;if(E.soak&&(p.t==='lightning'||p.t==='ice'))d*=1.5;if(E.curse>0)d*=1.3;if(E.shocked)d*=1.1;if(E.vuln)d*=1+E.vuln/100;if(E.mud>0&&p.t==='lightning')d*=2;return{d:Math.round(d),m}}
function hitTag(m){return m===0?'IMMUNE':m>=2?'WEAK!':m>1?'WEAK':m<1?'RESIST':''}
function fieldShock(E){if(!S.efield)return;Stage.zap();if(modOf(E,'lightning')===0){Stage.float('enemy','IMMUNE','#f2d24b','SHOCK',120);return}E.shocked=true;let t='SHOCKED';if(!E.stun&&Math.random()<.5){E.stun=true;t='STUN'}Stage.float('enemy',t,'#f2d24b',t==='STUN'?'+10% DMG TAKEN':'+10% DMG TAKEN',150);log(`The electric field ${t==='STUN'?'stuns':'shocks'} ${ENEMIES[E.id].name}.`)}
function canFreeze(E){return modOf(E,'ice')>=1&&modOf(E,'water')>=1}
function tickStun(R,E){if(R.stunTick&&!E.stun&&modOf(E,'lightning')!==0&&Math.random()*100<R.stunTick){E.stun=true;R._stunned=true;Stage.float('enemy','STUN','#f2d24b','',120)}}
function tickType(R,i){return R.tickTypes?R.tickTypes[i]:R.dmg[0].t}
function tickBase(R,i){const p=R.dmg[0],w=R.tickW?R.tickW[i]/R.tickW.reduce((a,b)=>a+b,0):1/R.ticks;const b=p.p*w;return R.tickCap?Math.min(R.tickCap,b):b}
function tickDmg(E,R,i,known){i=i??0;if(R.tickFlat)return modOf(E,R.dmg[0].t)===0?0:1;const t=tickType(R,i),m=known?(E.known.includes(t)?modOf(E,t):1):modOf(E,t);return Math.round(tickBase(R,i)*m*(E.soak&&(t==='ice'||t==='lightning')?1.5:1)*(E.curse>0?1.3:1)*(E.shocked?1.1:1)*(E.vuln?1+E.vuln/100:1)*(E.mud>0&&t==='lightning'?2:1))}
const RAIN=[1,2,2,3];
function rainAmt(lv,i){return i<4?RAIN[i]:lv}
function healTick(lv,i,flat){const h=Math.min(flat?lv:rainAmt(lv,i),S.maxHp-S.hp);if(h>0)S.hp+=h;Stage.float('player',`+${h}`,flat&&i%2?'#6cc8ff':'#7fe08a',i===4?(flat?'HEALING RAIN':'HOLY RAIN'):'',0);render()}
function segAmounts(E,R){const n=R.segs.length,out=Array.from({length:n},()=>({a:0,t:null,m:1}));
  R.dmg.forEach(p=>{const{d,m}=partDmg(E,p);let idx=R.segs.map((o,i)=>o.k===p.k?i:-1).filter(i=>i>=0);if(!idx.length)idx=[n-1];const b=Math.floor(d/idx.length);idx.forEach((si,j)=>{out[si].a+=j===idx.length-1?d-b*(idx.length-1):b;if(!out[si].t||!p.k){out[si].t=p.t;out[si].m=m}})});return out}
function preHit(R,i){const E=S.enemy;if(!E)return;const o=segAmounts(E,R)[i];if(!o)return;Stage.float('enemy',o.a,hexOf(R.meteor?'fire':R.fslash?R.eslash:(o.t||'slash')),hitTag(o.m),0);Stage.hitEnemy(R.meteor?['earth','fire']:R.fslash?['slash',R.eslash]:[o.t||'slash']);fslashFreeze(R,E)}
function applyFuse(c1,c2,R){
  const E=S.enemy,def=ENEMIES[E.id];
  if(!S.codex.some(x=>x.key===R.key))S.codex.push({key:R.key,name:R.name,a:CARDS[c1.key].name,b:CARDS[c2.key].name});
  let total=0;const notes=[];
  R.dmg.forEach((part,i)=>{
    const m=modOf(E,part.t);if(!E.known.includes(part.t))E.known.push(part.t);if(R.tickTypes)R.tickTypes.forEach(t=>{if(!E.known.includes(t))E.known.push(t)});
    let d;if(R.ticks){R._td=tickDmg(E,R,R.ticks-1);d=0;for(let q=0;q<R.ticks;q++)d+=tickDmg(E,R,q)}else{d=part.p*m;if(E.soak&&(part.t==='lightning'||part.t==='ice'))d*=1.5;if(E.curse>0)d*=1.3;if(E.shocked)d*=1.1;if(E.vuln)d*=1+E.vuln/100;if(E.mud>0&&part.t==='lightning')d*=2;d=Math.round(d)}total+=d;
    const tag=m===0?'IMMUNE':m>=2?'WEAK!':m>1?'WEAK':m<1?'RESIST':'';
    if(tag==='IMMUNE')notes.push(`<span class="r">${TYPENAME[part.t]} had no effect</span>`);
    else if(m>1)notes.push(`<span class="w">${TYPENAME[part.t]} hit a weakness</span>`);
    else if(m<1)notes.push(`<span class="r">${TYPENAME[part.t]} was resisted</span>`);
    if(!R.segs)Stage.float('enemy',R.ticks?R._td:R.double?d-Math.ceil(d/2):d,hexOf(R.ticks?tickType(R,R.ticks-1):part.t),R.crit&&tag!=='IMMUNE'?'CRITICAL!'+(tag?' '+tag:''):tag,R.combo?0:i*140);
  });
  if(R.segs){const sa=segAmounts(E,R),o=sa[sa.length-1];Stage.float('enemy',o.a,hexOf(R.meteor?'fire':R.fslash?R.eslash:(o.t||'slash')),hitTag(o.m),0)}
  if(R.dmg.length){Stage.hitEnemy(R.dmg.map(p=>p.t));if(E.curse>0)E.curse--}
  if(R.dmg.length&&!R.breaker&&E.block>0){const ab=Math.min(E.block,total);E.block-=ab;total-=ab;if(ab)notes.push(`${ab} absorbed by its shield`)}
  else if(R.breaker&&E.block>0&&R.dmg.length)notes.push('broke through its shield');
  E.hp-=total;if(E.vulnT>0&&--E.vulnT===0)E.vuln=0;
  if(R.dmg.length&&E.hp>0)itemProcs(E,notes);
  if(R.crit)notes.push('<span class="w">critical hit!</span>');
  if(R.stunChance&&E.hp>0&&modOf(E,R.stunType||'earth')!==0&&!E.stun&&Math.random()*100<R.stunChance){E.stun=true;notes.push('<span class="w">stunned it</span>');Stage.float('enemy','STUN','#f2d24b','',300)}
  if(R.quake)(S.foes||[]).filter(F=>F!==E&&F.hp>0).forEach(F=>{let d=0;for(let q=0;q<R.ticks;q++)d+=tickDmg(F,R,q);if(!F.known.includes('earth'))F.known.push('earth');F.hp-=d;const fn=ENEMIES[F.id].name;notes.push(`the quake hits ${fn} for ${d}`);
    Stage.withFoe(F.slot,()=>{Stage.float('enemy',tickDmg(F,R,R.ticks-1),hexOf('earth'),'',0);Stage.hitEnemy(['earth']);if(F.hp<=0){Stage.enemyDie();notes.push(`<span class="w">${fn} falls</span>`)}else if(modOf(F,'earth')!==0&&!F.stun&&Math.random()*100<R.stunChance){F.stun=true;Stage.float('enemy','STUN','#f2d24b','',300);notes.push(`<span class="w">stunned ${fn}</span>`)}})});if(E.mud>0)E.mud--;if(R.mud&&E.hp>0){E.mud=R.mud;notes.push('<span class="w">the ground under it turns to mud</span>')}
  const healP=h=>{h=Math.min(h,S.maxHp-S.hp);if(h>0){S.hp+=h;Stage.float('player',`+${h}`,'#7fe08a','HEAL',200)}};
  if(R.drain&&total>0)Stage.drainFx(1000,true);else if(R.lifesteal&&total>0)Stage.drainFx(1500,false);
  if(R.lifesteal&&total>0)healP(Math.round(total*R.lifesteal));
  if(R.drain&&total>0)healP(total);
  if(R.phoenix&&R._td)phoenixHeal(R,R._td,true);
  if(R.block){S.block+=R.block;Stage.float('player',`+${R.block}`,'#59c9c2','BLOCK')}
  if(R.manaGuard){S.manaGuard=R.manaGuard;S.manaGuardT=3}
  if(R.burnSet&&E.hp>0&&modOf(E,'fire')!==0){E.burn=Math.max(E.burn,R.burnSet);notes.push(`<span class="w">set it burning for ${R.burnSet} turns</span>`)}
  if(R.immuneChance){if(Math.random()*100<R.immuneChance){S.stoneSkin=true;Stage.float('player','IMMUNE','#e0c08a','STONE SKIN',350);notes.push('<span class="w">your skin turns to stone: immune to damage this turn</span>')}else notes.push('<span class="r">the stone skin did not take hold</span>')}
  if(R.iceAge){S.iceAge=R.iceAge;Stage.iceFloor(true);const res=aliveFoes().filter(f=>modOf(f,'ice')<1);notes.push(res.length?`<span class="r">${res.map(f=>ENEMIES[f.id].name).join(' and ')} ${res.length>1?'resist':'resists'} the cold</span>`:'<span class="w">the ground freezes over</span>')}
  if(R.barrier){S.barrier=Math.max(S.barrier,R.barrier);S.barrierT=3;S.thorns=R.thorns;Stage.float('player',`+${R.barrier}`,'#59c9c2','BARRIER',120)}
  S.guarding=R.key.split('+').includes('block')||!!R.guard;if(R.lava)S.lava=R.lava;if(R.blind){E.blind=R.blind;notes.push(`<span class="w">blinded it (${R.blind}% miss)</span>`)}S.guardEls=S.guarding?(R.charge||[]):[];
  if(R.holyRain){S.rainNext=R.holyRain;S.rainFlat=!!R.rainFlat}
  if(R.embrace)S.embrace=true;
  if(R.reflect)S.reflect=true;
  if(R.efield)S.efield=true;
  if(R.freeze&&E.hp>0){if(canFreeze(E)){E.frozen=true;notes.push('<span class="w">froze it solid</span>')}else{notes.push('<span class="r">it resisted the freeze</span>');Stage.float('enemy','RESISTED','#82d4ff','FREEZE',200);setTimeout(()=>Stage.shatter(),500)}}
  if(R.fslash&&(E.hp>0||R.healHit)){fslashFreeze(R,E);if(R._vuln&&E.hp>0){E.vuln=Math.min(100,(E.vuln||0)+R._vuln);E.vulnT=3;notes.push(`<span class="w">it takes ${E.vuln}% more damage for 3 turns</span>`)}if(R._froze)notes.push('<span class="w">froze it solid</span>');else if(R._healed)notes.push(`<span class="w">healed you ${R._healed}</span>`);else if(R._burned)notes.push(`<span class="w">set it burning (+${R._burned} turns)</span>`);else if(R._resist)notes.push(`<span class="r">it resists ${R.burnHit?'burning':'freezing'}</span>`)}
  if(R.parry)S.parry=R.parry;
  if(R.dodge)S.dodge=Math.max(S.dodge,R.dodge);
  if(R.dodgeAdd){S.dodge=Math.min(100,(S.dodge||0)+R.dodgeAdd);Stage.float('player',`+${R.dodgeAdd}%`,'#59c9c2','DODGE',200)}
  if(R.counter)S.counter=R.counter;
  if(R.heal)healP(R.heal);
  Stage.support(R);
  R.fx.forEach(f=>{const n=applyElem(f,E,def);if(n){notes.push(`<span class="w">${n}</span>`);Stage.float('enemy','STUN','#f2d24b','',300)}});
  if(R.stunTick)tickStun(R,E);if(R._stunned)notes.push('<span class="w">stunned it</span>');
  if(R.stun&&modOf(E,'lightning')!==0&&!E.stun){E.stun=true;notes.push('<span class="w">stunned it</span>')}
  log(`${CARDS[c1.key].name} + ${CARDS[c2.key].name} → <b>${R.name}</b>${R.dmg.length?` for ${total}`:''}${notes.length?'. '+notes.join(', '):''}.`);
  S.hand=S.hand.filter(id=>!S.sel.includes(id));S.disc.push(...S.sel);S.sel=[];
  if(def.boss&&!E.enraged&&E.hp>0&&E.hp<=E.max/2){E.enraged=true;E.str+=3;log(`<span class="r">${def.name} enrages! Its attacks grow stronger.</span>`);Stage.enemyBurst('#ff5040',30)}
  render();
  if(E.hp<=0){Stage.enemyDie();const nx=aliveFoes();if(nx.length)setTimeout(()=>{setTarget(nx[0]);render();setTimeout(enemyTurn,350)},900);else setTimeout(winBattle,1100)}else setTimeout(enemyTurn,750);
}
function hurtPlayer(raw,delay,pierce){
  const E=S.enemy;
  if(S.embrace){Stage.float('player','IMMUNE','#9fe2ff','FROZEN',delay);return 0}
  if(S.stoneSkin){Stage.float('player','IMMUNE','#e0c08a','STONE SKIN',delay);setTimeout(()=>Stage.stoneFx&&Stage.stoneFx(),delay||0);return 0}let x=raw;if(E.chill)x=Math.round(x*.6);if(iceAgeHits(E))x=Math.round(x*.5);
  if(E.blind&&Math.random()*100<E.blind){Stage.float('player','MISS','#cfd6dd','BLINDED',delay);return 0}
  if(S.lava)dealToEnemy(S.lava,'fire','LAVA',(delay||0)+200);
  if(S.reflect&&x>0&&E.hp>0){E.hp-=x;Stage.float('enemy',x,'#bfe9ff','REFLECT',(delay||0)+180);Stage.reflectFx(delay||0)}
  if(S.dodge>0&&Math.random()*100<S.dodge){Stage.float('player','DODGE','#bff5d8','',delay);Stage.dodgeFx(delay);counterStrike(delay);return 0}
  if(S.parry){const pr=S.parry;S.parry=null;x-=pr.full?x:Math.ceil(x/2);dealToEnemy(pr.p,pr.t,'PARRY',(delay||0)+120);Stage.parryFx(delay)}
  let ab=0;
  if(S.barrier>0&&x>0){const b=Math.min(S.barrier,x);S.barrier-=b;x-=b;ab+=b;
    if(S.thorns&&b>0){const t=S.thorns;dealToEnemy(4,t,'THORNS',(delay||0)+160);applyElem(t,E,ENEMIES[E.id])}
    if(S.barrier<=0){S.barrier=0;S.thorns=null}}
  if(S.block>0&&x>0&&!pierce){const b=Math.min(S.block,x);S.block-=b;x-=b;ab+=b}
  if(S.manaGuard&&ab>0){const mg=Math.min(Math.max(1,Math.round(ab*S.manaGuard)),S.maxMana-S.mana);if(mg>0){S.mana+=mg;Stage.float('player',`+${mg}`,'#6cb2ff','MANA',(delay||0)+200)}}
  S.hp-=x;
  setTimeout(()=>Stage.hitPlayer(!x),delay||0);
  Stage.float('player',x?`-${x}`:'0',x?'#ff6b5e':'#59c9c2',ab?`${ab} BLOCKED`:'',delay);
  counterStrike(delay);
  return x;
}
function counterStrike(delay){if(S.counter){const c=S.counter;S.counter=null;dealToEnemy(c.p,c.t,'COUNTER',(delay||0)+220)}}
function enemyTurn(){S.turnQ=aliveFoes();S.firstFoe=true;nextFoe()}
function nextFoe(){
  if(!aliveFoes().length){winBattle();return}
  const E=S.turnQ.shift();
  if(!E){finishEnemyTurn();return}
  if(E.hp<=0){nextFoe();return}
  const gap=S.firstFoe?0:250;S.firstFoe=false;
  setTimeout(()=>{
  S.enemy=E;Stage.focus(E.slot||0);
  const def=ENEMIES[E.id];
  E.block=0;E.shocked=false;let wait=0;
  if(E.burn>0){const d=Math.round(3*modOf(E,'fire'));E.hp-=d;E.burn--;log(`Burn deals ${d} to ${def.name}.`);Stage.float('enemy',d,'#ff7b3a','BURN');Stage.enemyBurst('#ff7b3a',14);
    render();if(E.hp<=0){Stage.enemyDie();setTimeout(nextFoe,1100);return}wait=550}
  render();setTimeout(enemyAct,wait);
  },gap);
}
function tryRevive(){const n=S.gear.neck;if(S.hp>0||!n||!(n.stats&&n.stats.revive))return false;delete S.gear.neck;recalc();S.hp=Math.max(1,Math.ceil(S.maxHp*.5));S.mana=Math.round(S.maxMana*.3);log(`<span class="w">The ${ITEMS[n.key].name} shatters in a burst of flame and you rise again with ${S.hp} HP and ${S.mana} mana!</span>`);Stage.reviveFx();Stage.float('player','REVIVED','#ffb04a',`+${S.hp} HP`,300);render();return true}
function foeEnd(){const E=S.enemy;E.chill=Math.max(0,E.chill-1);E.soak=Math.max(0,E.soak-1);E.blind=0;if(S.hp<=0&&tryRevive()){setTimeout(nextFoe,1800);return}if(S.hp<=0){finishEnemyTurn();return}nextFoe()}
function enemyAct(){
  const E=S.enemy,def=ENEMIES[E.id];
  if(E.frozen){E.frozen=false;log(`${def.name} is frozen solid and loses its turn.`);E.step++;Stage.float('enemy','FROZEN','#82d4ff','');Stage.shatter();render();setTimeout(foeEnd,800);return}
  if(E.stun){E.stun=false;log(`${def.name} is stunned and loses its turn.`);E.step++;Stage.float('enemy','STUNNED','#f2d24b','');render();setTimeout(foeEnd,700);return}
  const[t,v,n]=intentOf(E);E.step++;const s=E.str+E.bonus;
  if(['atk','heavy','drain','multi','stab'].includes(t)){
    Stage.enemyAttack(t==='heavy'?720:t==='multi'?520+n*90:560,t);
    setTimeout(()=>{
      fieldShock(E);
      if(t==='multi'){let sum=0;for(let i=0;i<n;i++)sum+=hurtPlayer(v+s,i*110);log(`${def.name} strikes ${n} times for ${sum}.`)}
      else{const d=hurtPlayer(v+s,0,t==='stab');
        if(t==='drain'){E.hp=Math.min(E.max,E.hp+d);log(`${def.name} drains ${d} HP from you.`);if(d){Stage.float('enemy',`+${d}`,'#7fe08a','',250);Stage.enemyBurst('#b18bff')}}
        else log(`${def.name} uses ${INTENTS[t].label.toLowerCase()} for ${d}.`)}
      render();
      if(E.hp<=0){Stage.enemyDie();setTimeout(nextFoe,1300);return}
      setTimeout(foeEnd,t==='multi'?n*110+400:500);
    },t==='heavy'?300:240);
    return;
  }
  if(t==='def'){E.block+=v;log(`${def.name} raises a shield of ${v}.`);Stage.enemyRing('#59c9c2');Stage.float('enemy',`+${v}`,'#59c9c2','SHIELD')}
  else if(t==='buff'){E.str+=v;log(`${def.name} grows stronger (+${v} attack).`);Stage.enemyBurst('#e8574d',16);Stage.float('enemy',`+${v}`,'#e8574d','ATTACK UP')}
  else if(t==='heal'){const h=Math.min(v,E.max-E.hp);E.hp+=h;log(`${def.name} heals ${h} HP.`);Stage.enemyBurst('#7fe08a',16);Stage.float('enemy',`+${h}`,'#7fe08a','HEAL')}
  render();setTimeout(foeEnd,500);
}
function finishEnemyTurn(){
  const tg=S.tgt&&S.tgt.hp>0?S.tgt:aliveFoes()[0];if(tg)setTarget(tg);
  S.lava=null;
  S.dodge=0;S.parry=null;S.counter=null;S.guarding=false;S.guardEls=[];if(S.embrace){S.embrace=false;Stage.unembrace()}S.reflect=false;S.efield=false;
  if(S.manaGuardT>0&&--S.manaGuardT===0)S.manaGuard=0;if(S.iceAge>0&&--S.iceAge===0)Stage.iceFloor(false);S.stoneSkin=false;if(S.barrier>0){S.barrierT--;if(S.barrierT<=0){S.barrier=0;S.thorns=null}}
  if(S.hp<=0&&tryRevive()){}
  if(S.hp<=0){S.hp=0;Stage.playerDie();render();setTimeout(()=>{S.phase='over';render()},1100);return}
  S.block=stats().def;S.turns++;drawHand();S.busy=false;
  render();
  if(S.rainNext){const lv=S.rainNext,flat=S.rainFlat;S.rainNext=0;S.busy=true;render();const ts=flat?Stage.healRain(150):Stage.holyRain(150);ts.forEach((t,i)=>setTimeout(()=>{if(S.phase!=='battle')return;healTick(lv,i,flat);if(i===4){S.busy=false;render()}},t))}
}
function itemProcs(E,notes){const g=stats();[['lightning',g.addl],['dark',g.souls]].forEach(([t,v],i)=>{if(!v||E.hp<=0)return;const{d,m}=partDmg(E,{t,p:v});if(!E.known.includes(t))E.known.push(t);E.hp-=d;Stage.float('enemy',d,hexOf(t),t==='dark'?'SOULS':'STORM',260+i*160);if(t==='lightning')Stage.zap();notes.push(m===0?`<span class="r">${TYPENAME[t]} had no effect</span>`:`+${d} ${TYPENAME[t]} from your gear`)})}
function winBattle(){
  const n=curNode(),def=ENEMIES[S.enemy.id],fs=S.foes||[S.enemy];S.kills+=fs.length;{const sl=Object.values(S.gear).find(g=>g&&g.key==='soul_lantern');if(sl){const add=sl.stats.soul*fs.length;sl.stats.souls=(sl.stats.souls||0)+add;S.toast=`Soul Lantern gathers ${add} soul${add>1?'s':''}: +${sl.stats.souls} Dark damage on every attack.`}}const fname=fs.map(f=>ENEMIES[f.id].name).join(' & ');
  const h=Math.min(5+(stats().regen||0),S.maxHp-S.hp);S.hp+=h;
  const boss=n.k==='boss',elite=n.k==='elite';
  const offers=rollOffers(3,{minItem:boss||elite?1:0,minR:boss?'epic':elite?'rare':null,boost:boss?6:elite?3:0});
  S.reward={healed:h,name:(elite?'Elite ':'')+fname,boss};
  S.drop={offers,then:boss?'nextlevel':'advance',title:`${(elite?'Elite ':'')+fname} dropped 3 cards. Take one.`,skip:boss?(S.level>=LEVELS.length-1?'Skip and finish':'Skip and go to the next level'):'Skip'};
  S.iceAge=0;S.stoneSkin=false;Stage.iceFloor(false);S.phase='reward';Stage.pose('celebrate',1100);
  render();
}
function rollOffers(n,o={}){
  const skills=shuffle(ACQ_KEYS),offers=[],used=new Set();
  for(let i=0;i<n;i++){
    const item=o.noItems?false:(i<(o.minItem||0)?true:Math.random()<.45);
    if(item){let L,t=0;do{L=(i===0&&o.minR)?rollLoot(o.boost||0,o.minR):rollLoot(o.boost||0);t++}while(used.has(L.key)&&t<10);used.add(L.key);offers.push({type:'item',loot:L})}
    else offers.push({type:'skill',key:skills.pop()});
  }
  return shuffle(offers);
}
function finishDrop(){const t=S.drop&&S.drop.then;if(S.drop)S.drop.taken=true;if(t==='advance')advance();else if(t==='nextlevel')nextLevel();else render()}
function dropPick(i){
  const D=S.drop;if(!D||D.taken)return;const o=D.offers[i];D.taken=true;
  if(o.type==='skill')offerCard(o.key,D.then==='stay'?'none':D.then);
  else{useLoot(o.loot);S.toast=o.loot.msg;finishDrop()}
}
function advance(){
  S.node++;
  if(S.node>=S.route.length){nextLevel();return}
  travel();
}
function nextLevel(){
  if(S.level>=LEVELS.length-1){S.phase='win';render();return}
  S.level++;S.route=buildLevel(S.level);S.node=0;
  const h=Math.round(S.maxHp*.4);S.hp=Math.min(S.maxHp,S.hp+h);
  S.toast=`Level ${S.level+1}: ${LEVELS[S.level].name}. You rest and recover ${h} HP.`;
  travel();
}

/* ================= events ================= */
function startEvent(id){S.ev={id,step:'main',msg:null,offers:id==='merchant'?pickN(ACQ_KEYS,3):null,offer:null,loot:null};S.phase='event';S.busy=false;render()}
function upgradeCard(c){if(c.lvl>=5)return false;c.lvl++;return true}
function evOption(i){
  const ev=S.ev;
  if(ev.id==='camp'){
    if(i===0){const h=Math.min(Math.round(S.maxHp*.35),S.maxHp-S.hp);S.hp+=h;ev.msg=`You rest by the fire and recover ${h} HP.`;ev.step='done';Stage.playerBurst('#7fe08a')}
    else ev.step='train';
  }else if(ev.id==='chest'){
    ev.msg='The lid creaks open. Take one of the cards inside.';ev.step='done';S.drop={offers:rollOffers(3,{minItem:1,boost:4}),then:'stay',title:'Treasure! Take one.',skip:'Take nothing'};
  }else if(ev.id==='shrine'){
    if(i===0){const h=Math.min(20,S.maxHp-S.hp);S.hp+=h;ev.msg=`Warm light settles over you. You heal ${h} HP.`;ev.step='done';Stage.playerBurst('#fff0b3')}
    else if(i===1){const k=rnd(ELEMS);ev.msg=`The altar answers with a ${CARDS[k].name} card.`;ev.step='done';offerCard(k,'none');return}
    else{const ups=S.deck.filter(c=>c.lvl<5);if(ups.length){const c=rnd(ups);c.lvl++;ev.msg=`A moment of clarity. ${CARDS[c.key].name} is now level ${c.lvl}.`}else{const h=Math.min(15,S.maxHp-S.hp);S.hp+=h;ev.msg=`Your cards are already mastered. You heal ${h} HP instead.`}ev.step='done';Stage.playerBurst('#dba64b')}
  }else if(ev.id==='smith'){
    if(i===0)ev.step='train';else{advance();return}
  }else if(ev.id==='merchant'){
    if(i===0){S.baseMax+=8;S.maxHp+=8;S.hp=Math.max(1,S.hp-6);ev.msg='The tonic burns going down. Max HP +8, but you lose 6 HP.';ev.step='done';Stage.playerBurst('#7fe08a')}
    else{advance();return}
  }else if(ev.id==='mimic'){
    if(i===0){
      if(Math.random()<.6){ev.msg='Inside, wrapped in old cloth, are three cards.';S.drop={offers:rollOffers(3,{minItem:1,boost:2}),then:'stay',title:'The chest holds 3 cards. Take one.',skip:'Take nothing'}}
      else{S.hp=Math.max(1,S.hp-8);ev.msg='It was a mimic! It bites for 8 before you pry two cards from its teeth.';Stage.hitPlayer(false);Stage.float('player','-8','#ff6b5e','');S.drop={offers:rollOffers(2,{noItems:true}),then:'stay',title:'Pried from the mimic. Take one.',skip:'Take nothing'}}
      ev.step='done';
    }else{advance();return}
  }
  render();
}
function evCard(id){
  const ev=S.ev;
  if(ev.step==='train'&&id.startsWith('g-')){const g=S.gear[id.slice(2)];if(!g)return;if((g.cardLvl||1)>=5){S.toast='That card is already at the maximum level.'}else{g.cardLvl=(g.cardLvl||1)+1;ev.msg=`${CARDS[ITEMS[g.key].grant].name} is now level ${g.cardLvl}.`;ev.step='done';Stage.playerBurst('#dba64b')}render();return}
  const c=S.deck.find(x=>x.id===id);if(!c)return;
  if(ev.step==='train'){if(upgradeCard(c)){ev.msg=`${CARDS[c.key].name} is now level ${c.lvl}.`;ev.step='done';Stage.playerBurst('#dba64b')}else{S.toast=`${CARDS[c.key].name} is already at the maximum level.`}}
  else if(ev.step==='give'){S.deck=S.deck.filter(x=>x.id!==id);addCard(ev.offer);ev.msg=`You trade away ${CARDS[c.key].name} and receive ${CARDS[ev.offer].name}.`;ev.step='done'}
  render();
}

/* ================= render ================= */
function pips(l){let s='';for(let i=1;i<=5;i++)s+=`<span class="pip ${i<=l?'on':''}"></span>`;return s}
function cardHTML(c,o={}){
  const d=CARDS[c.key],base=Math.min(5,c.lvl||1),boost=effLv(c)-base;
  return `<button type="button" class="card ${o.sel?'is-sel':''} ${c.granted?'granted':''} ${o.small?'small':''}" ${o.act?`data-act="${o.act}"`:''} data-id="${c.id??''}" data-key="${c.key}" style="--tc:${typeColor(c.key)}" aria-label="${d.name}, level ${base}, power ${powLabel(c)}">
    <span class="card-top"><span class="card-cat">${c.granted?'Item skill':CATLABEL[d.cat]}</span>${(()=>{const m=manaCost(c);return `<span class="card-mana num ${m<0?'gain':m?'':'free'}" title="${m<0?'Restores '+(-m)+' mana':'Mana cost'}">${m<0?'+'+(-m):m}</span>`})()}</span>
    <span class="card-icon">${icon(c.key)}</span>
    <span class="card-name">${d.name}</span>
    <span class="card-lv" title="Level ${base}${boost?` +${boost} from gear`:''}">${pips(base)}${boost?`<i>+${boost}</i>`:''}</span>
    <span class="card-desc">${d.desc}</span></button>`;
}
const NODE_ICON={m:'atk',elite:'ult',boss:'crown',ev:'event',camp:'camp',chest:'chest'};
const NODE_LABEL={m:'Monster',elite:'Elite',boss:'Boss',ev:'Event',camp:'Camp',chest:'Chest'};
function routeHTML(){
  return `<nav class="route" aria-label="Level route">${S.route.map((n,i)=>{
    const done=i<S.node||S.phase==='win',cur=i===S.node&&S.phase!=='title'&&S.phase!=='win';
    return `${i?`<span class="link ${done||cur?'done':''}"></span>`:''}<div class="node k-${n.k} ${done?'done':''} ${cur?'cur':''}" title="${nodeName(n)}"><span class="node-dot">${icon(NODE_ICON[n.k])}</span><span class="node-label">${cur||done?nodeName(n):NODE_LABEL[n.k]}</span></div>`;
  }).join('')}</nav>`;
}
function affHTML(E){
  const mods=ENEMIES[E.id].mods;const weak=[],res=[];
  Object.entries(mods).forEach(([t,m])=>{
    const chip=E.known.includes(t)?`<span class="chip ${m===0?'imm':m>1?'weak':'res'}"><span style="color:${typeColor(t)}">${icon(t==='pierce'?'stab':t==='blunt'?'punch':t)}</span>${TYPENAME[t]} ×${m}</span>`:`<span class="chip unk">?</span>`;
    (m>1?weak:res).push(chip);
  });
  return `<div class="aff"><span class="eyebrow">Weak</span><div class="chips">${weak.join('')||'<span class="chip unk">none</span>'}</div><span class="eyebrow">Resists</span><div class="chips">${res.join('')||'<span class="chip unk">none</span>'}</div></div>`;
}
function statusHTML(E){
  const s=[];
  if(E.block)s.push(`<span class="chip st" style="--tc:var(--guard)">Shield ${E.block}</span>`);
  if(E.burn)s.push(`<span class="chip st" style="--tc:var(--fire)">Burn ${E.burn}</span>`);
  if(E.soak)s.push(`<span class="chip st" style="--tc:var(--water)">Soaked</span>`);
  if(E.chill)s.push(`<span class="chip st" style="--tc:var(--ice)">Chill</span>`);
  if(E.stun)s.push(`<span class="chip st" style="--tc:var(--lightning)">Stunned</span>`);
  if(E.mud>0)s.push(`<span class="chip st" style="--tc:var(--earth)">Mud: Lightning ×2</span>`);
  if(E.vuln)s.push(`<span class="chip st" style="--tc:var(--dark)">Abyss +${E.vuln}% (${E.vulnT})</span>`);
  if(E.curse)s.push(`<span class="chip st" style="--tc:var(--dark)">Curse ${E.curse}</span>`);
  if(E.frozen)s.push(`<span class="chip st" style="--tc:var(--ice)">Frozen</span>`);
  if(E.blind)s.push(`<span class="chip st" style="--tc:var(--phys)">Blind ${E.blind}%</span>`);
  if(E.str)s.push(`<span class="chip st" style="--tc:var(--danger)">Attack +${E.str}</span>`);
  return s.length?`<div class="chips">${s.join('')}</div>`:'';
}
function playerStatusHTML(){
  const s=[`<span class="chip st" style="--tc:var(--guard)">${icon('block')}Block ${S.block}</span>`];
  if(S.barrier)s.push(`<span class="chip st" style="--tc:${S.thorns?typeColor(S.thorns):'var(--guard)'}">${icon('shield')}Barrier ${S.barrier} · ${S.barrierT}t</span>`);
  if(S.dodge)s.push(`<span class="chip st" style="--tc:var(--wind)">${icon('dodge')}Dodge ${S.dodge}%</span>`);
  if(S.stoneSkin)s.push(`<span class="chip st" style="--tc:var(--earth)">${icon('earth')}Stone skin: immune</span>`);
  if(S.iceAge>0)s.push(`<span class="chip st" style="--tc:var(--ice)" title="Monsters that don't resist Ice deal 50% less damage. Freeze chance +30%.">${icon('ice')}Ice Age · ${S.iceAge}t</span>`);
  if(S.manaGuard)s.push(`<span class="chip st" style="--tc:var(--water)">${icon('water')}Block → mana · ${S.manaGuardT}t</span>`);
  if(S.parry)s.push(`<span class="chip st" style="--tc:var(--phys)">${icon('parry')}Parry ${S.parry.full?'full':'½'} · ${S.parry.p}</span>`);
  if(S.efield)s.push(`<span class="chip st" style="--tc:var(--lightning)">${icon('lightning')}Electric field</span>`);
  if(S.reflect)s.push(`<span class="chip st" style="--tc:var(--ice)">${icon('shield')}Reflect</span>`);
  if(S.embrace)s.push(`<span class="chip st" style="--tc:var(--ice)">${icon('ice')}Frozen · immune</span>`);
  if(S.rainNext)s.push(`<span class="chip st" style="--tc:var(--mend)">${icon('heal')}${S.rainFlat?'Healing':'Holy'} Rain next turn</span>`);
  if(S.lava)s.push(`<span class="chip st" style="--tc:var(--fire)">${icon('fire')}Lava ${S.lava}</span>`);
  if(S.counter)s.push(`<span class="chip st" style="--tc:var(--danger)">${icon('counter')}Counter ${S.counter.p}</span>`);
  return `<div class="chips">${s.join('')}</div>`;
}
function joinList(a){return a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' and '+a[a.length-1]}
function describe(R){
  const V={spunch:'Launches a stone fist',meteor:'Calls down a meteor',fslash:'Slashes with a freezing blade',bslash:'Slashes with a burning blade',aslash:'Slashes with a surging water blade',dslash:'Slashes with an abyssal blade',slash:'Slashes',stab:'Stabs',kick:'Kicks',punch:'Punches',shieldbash:'Bashes with your shield',shieldthrow:'Hurls your shield',arrowshot:'Shoots an arrow',spearthrow:'Throws a spear'};
  const low=s=>s.charAt(0).toLowerCase()+s.slice(1);
  const FX={fire:'sets it burning',water:'soaks it',ice:'chills its next attack',earth:'gives you 4 block',wind:'helps you dodge its next attack',lightning:'may stun it',dark:'curses it',light:'heals you 3'};
  const FXY={fire:'set it burning',water:'soak it',ice:'chill its next attack',earth:'gain 4 block',wind:'get a 30% dodge chance',lightning:'may stun it',dark:'curse it',light:'heal 3'};
  const fx=[...new Set(R.fx)];let s='';
  if(R.dmg.length){
    const tl=joinList([...new Set(R.dmg.map(p=>TYPENAME[p.t]))]);
    let f=R.charged?(R.lstrike?`Teleports behind it and ${{stab:'stabs',punch:'punches',kick:'kicks',slash:'slashes'}[R.lstrike]} for ${chgLo(R)+R.bonus}–${chgHi(R)+R.bonus} Lightning damage`:R.ranged==='volley'?`Leaps into the air and fires a volley of arrows for ${chgLo(R)+R.bonus}–${chgHi(R)+R.bonus} Pierce damage (card levels × a random 0.8 to 10)`:`Charges a glowing arrow for ${R.charged.sum*3+R.bonus}–${R.charged.sum*7+R.bonus} Pierce damage (card levels × a random 3 to 7)`):R.ticks?`${R.verb} that hits ${R.ticks} times`:R.segs?(()=>{const gs=[];R.segs.forEach(o=>{const l=gs[gs.length-1];if(l&&l.k===o.k)l.n++;else gs.push({k:o.k,n:1})});return gs.map((q,i)=>(i?low(V[q.k]):V[q.k])+(q.n>1?(q.n===2?' twice':` ${q.n} times`):'')).join(', then ')})():R.double?`${V[R.phys[0]]} twice`:R.combo?`${V[R.seq[0]]}, then ${low(V[R.seq[1]])}`:R.kind==='cast'?'Casts a spell':R.phys.length?V[R.phys[0]]:'Hits';
    if(R.tickW){const bs=R.tickW.map((_,q)=>Math.round(tickBase(R,q)));f+=` for ${Math.min(...bs)}–${Math.max(...bs)} ${tl} damage per hit, growing stronger at the end${R.tickCap&&bs.includes(R.tickCap)?` (max ${R.tickCap} per hit)`:''}`}
    else if(R.tickTypes)f+=` for ${Math.round(tickBase(R,0))} damage each, alternating Dark and Light`
    else if(!R.charged)f+=R.ticks?` for ${Math.round(R.dmg[0].p/R.ticks)} ${tl} damage each`:` for ${tl} damage`;if(R.breaker)f+=', ignoring its shield';
    const ex=fx.filter(e=>!(R.stun&&e==='lightning')).map(e=>FX[e]);if(R.freeze)ex.push(`freezes it so it skips its next turn${S.enemy&&!canFreeze(S.enemy)&&S.enemy.known.some(t=>t==='ice'||t==='water')?' (it resists this)':' (monsters that resist Ice or Water are immune)'}`);if(R.burnSet)ex.push(`sets it burning for ${R.burnSet} turns`);if(R.stunChance)ex.push(`has a ${R.stunChance}% chance to stun it`);if(R.quake)ex.push('hits every monster on the field');if(R.freeEarth)ex.push('the Earth card costs no mana because your Punch is the higher level');if(R.mud)ex.push('turns the ground under it to mud until your next attack: Lightning deals double damage and freeze chance is +50%');if(R.fslash){if(R.vulnHit)ex.push(`each slash makes it take ${R.vulnHit}% more damage for your next 3 turns (+${R.vulnHit*R.segs.length}% after this attack)`);else if(R.healHit)ex.push(`each slash heals you ${R.healHit} HP`);else if(R.burnHit)ex.push(`each slash sets it burning for ${R.burnHit} more turns (3 Fire damage per turn)`);else ex.push(`each slash has a ${R.freezeChance}% chance to freeze it for a turn${S.enemy&&!canFreeze(S.enemy)&&S.enemy.known.some(t=>t==='ice'||t==='water')?' (it resists this)':''}`);ex.push('restores 3 mana per slash')}if(R.stunTick)ex.push(`each strike has a ${R.stunTick}% chance to stun it`);if(R.blind)ex.push(`blinds it, giving it a ${R.blind}% chance to miss its next attack`);if(R.stun)ex.push('always stuns it');if(R.lifesteal)ex.push('heals you for part of the damage');if(R.phoenix)ex.push(`heals you for ${Math.round(R.phoenix*100)}% of the damage dealt`);if(R.drain)ex.push('heals you for all of it');
    s=f+(ex.length?', and '+joinList(ex):'')+'.';
  }
  const d=[];
  if(R.block)d.push(`block ${R.block} damage this turn`);
  if(R.barrier)d.push(`raise a ${R.barrier}-point barrier for 3 turns${R.thorns?` that hits attackers with ${TYPENAME[R.thorns]}`:''}`);
  if(R.manaGuard)d.push(`turn ${Math.round(R.manaGuard*100)}% of the damage you block into mana for 3 turns`);
  if(R.parry)d.push(R.parry.full?'fully parry the next hit and strike back':'halve the next hit and strike back');
  if(R.dodgeAdd)d.push(`add ${R.dodgeAdd}% to your dodge chance`);
  if(R.dodge)d.push(R.dodge>=100?'dodge the next attack for sure':`get a ${R.dodge}% chance to dodge`);
  if(R.counter)d.push(`counter for ${R.counter.p} when hit`);
  if(R.immuneChance)d.push(`have a ${R.immuneChance}% chance to become immune to all damage this turn`);
  if(R.iceAge)d.push(`freeze the battlefield for ${R.iceAge} turns: monsters deal 50% less damage and freeze effects get +30% chance (monsters that resist Ice are not affected)`);
  if(R.lava)d.push(`burn it for ${R.lava} Fire damage each time it attacks you this turn`);
  if(R.heal)d.push(`heal ${R.heal} HP`);
  if(R.efield)d.push('surround yourself with an electric field. When it attacks you, it is shocked and takes 10% more damage from your next turn, with a 50% chance to be stunned');
  if(R.reflect)d.push('reflect every hit back at it for its full damage until your next turn');
  if(R.embrace)d.push(`freeze yourself in ice, taking no damage until your next turn, and heal ${R.embrace} HP five times (${R.embrace*5} total)`);
  if(R.holyRain&&R.rainFlat)d.push(`heal ${R.holyRain} HP per tick for 10 ticks: 5 now and 5 at the start of your next turn (${R.holyRain*10} total)`);
  else if(R.holyRain)d.push(`heal 1, 2, 2, 3 and ${R.holyRain} HP over 5 pulses now, and the same again at the start of your next turn`);
  if(!R.dmg.length)fx.forEach(e=>d.push(FXY[e]));
  if(d.length)s+=(s?' You also ':'You ')+joinList(d)+'.';
  return s;
}
function resultHTML(){
  if(S.phase!=='battle'||S.busy)return '';
  if(S.sel.length<2)return `<div class="rhint">${S.sel.length?'Pick one more card':'Pick 2 cards to combine'}</div>`;
  const E=S.enemy;const[c1,c2]=S.sel.map(card);if(!c1||!c2)return '';const R=gearFuse(c1,c2);
  const cost=fuseCost(c1,c2),low=cost>S.mana;
  const isNew=!S.codex.some(x=>x.key===R.key);
  let est=0,unk=false;const lines=[];
  const L=(ic,col,txt)=>lines.push(`<span class="rfx" style="--c:${col}">${icon(ic)}${txt}</span>`);
  R.dmg.forEach(p=>{
    const known=E.known.includes(p.t);const m=known?modOf(E,p.t):1;if(!known)unk=true;
    let d;if(R.ticks){d=0;for(let q=0;q<R.ticks;q++)d+=tickDmg(E,R,q,true);if(R.tickTypes&&R.tickTypes.some(t=>!E.known.includes(t)))unk=true}else{d=p.p*m;if(E.soak&&(p.t==='lightning'||p.t==='ice'))d*=1.5;if(E.curse>0)d*=1.3;if(E.shocked)d*=1.1;if(E.vuln)d*=1+E.vuln/100;if(E.mud>0&&p.t==='lightning')d*=2;d=Math.round(d)}est+=d;
    const tag=known?(m===0?' · immune':m>1?` · weak ×${m}`:m<1?` · resists ×${m}`:''):' · ?';
    L(p.t==='pierce'?'stab':p.t==='blunt'?'punch':p.t,typeColor(p.t),`${R.tickTypes?'Dark + Light':TYPENAME[p.t]} ${R.charged?`${chgLo(R)+R.bonus}–${chgHi(R)+R.bonus}`:R.ticks?Math.round(Array.from({length:R.ticks},(_,q)=>tickBase(R,q)).reduce((x,y)=>x+y,0)):p.p}${R.tickTypes?'':tag.replace(' · ',' ')}`);
  });
  L('water','#4aa8ff',(cost>0?`Mana −${cost}`:cost<0?`Mana +${-cost}`:'No mana')+(R.fslash?`, +${3*R.segs.length} back`:''));
  if(R.charged&&!R.lstrike)L('arrowshot','var(--phys)',R.charged.float?'Power ×0.8–10':`Power ×${R.charged.ilo||3}–${R.charged.ihi||7}`);
  if(R.charged&&R.charged.crit)L('lightning','var(--lightning)','Crit chance 50%');
  {const g=stats();if(R.dmg.length&&g.addl)L('lightning','var(--lightning)',`+${g.addl} Lightning (item)`);if(R.dmg.length&&g.souls)L('dark','var(--dark)',`+${g.souls} Dark (souls)`)}
  if(R.dodgeAdd)L('dodge','var(--guard)',`Dodge +${R.dodgeAdd}%`);
  if(R.segs)L('multi','var(--phys)',`Hits ×${R.segs.length}`);
  if(R.double)L('multi','var(--phys)','Hits twice');
  if(R.ticks)L('multi',typeColor(R.dmg[0].t),`Hits ×${R.ticks}`);
  if(R.stunTick)L('lightning','var(--lightning)',`Stun ${R.stunTick}%/hit`);
  if(R.freeze)L('ice','var(--ice)','Freeze 1 turn');
  if(R.fslash)R.vulnHit?L('dark','var(--dark)',`Dmg taken +${R.vulnHit*R.segs.length}% · 3 turns`):R.healHit?L('heal','var(--mend)',`Heal ${R.healHit}×${R.segs.length}`):R.burnHit?L('fire','var(--fire)',`Burn +${R.burnHit*R.segs.length} turns`):L('ice','var(--ice)',`Freeze ${R.freezeChance}%/slash`);
  if(R.bonus>0)L('buff','var(--brass)',`Gear +${R.bonus}`);
  if(R.breaker&&R.dmg.length)L('multi','var(--phys)','Pierces shield');
  if(R.lifesteal)L('heal','var(--mend)',`Lifesteal ${Math.round(R.lifesteal*100)}%`);
  if(R.manaGuard)L('water','#4aa8ff',`Blocked → mana ${Math.round(R.manaGuard*100)}% · 3t`);
  if(R.phoenix)L('heal','var(--fire)',`Phoenix: heal ${Math.round(R.phoenix*100)}% of damage`);
  if(R.drain)L('heal','var(--mend)','Drain all');
  if(R.block)L('block','var(--guard)',`Block ${R.block}`);
  if(R.barrier)L('shield',R.thorns?typeColor(R.thorns):'var(--guard)',`Barrier ${R.barrier} · 3t${R.thorns?` · ${TYPENAME[R.thorns]} thorns`:''}`);
  if(R.parry)L('parry','var(--phys)',`Parry ${R.parry.full?'full':'½'} · ${R.parry.p}`);
  if(R.dodge)L('dodge','var(--wind)',`Dodge ${R.dodge}%`);
  if(R.counter)L('counter','var(--danger)',`Counter ${R.counter.p}`);
  if(R.heal)L('heal','var(--mend)',`Heal ${R.heal}`);
  if(R.reflect)L('shield','var(--ice)','Reflect hits');
  if(R.efield){L('lightning','var(--lightning)','Stun 50% on hit');L('buff','var(--lightning)','+10% dmg taken')}
  if(R.embrace){L('ice','var(--ice)','Immune 1 turn');L('heal','var(--mend)',`Heal ${R.embrace} ×5`)}
  if(R.holyRain&&R.rainFlat)L('heal','var(--mend)',`Heal ${R.holyRain}×5 now + ${R.holyRain}×5 next turn`);
  else if(R.holyRain)L('heal','var(--mend)',`Heal ${8+R.holyRain} now + ${8+R.holyRain} next turn`);
  if(R.stun)L('lightning','var(--lightning)','Sure stun');
  if(R.blind)L('dark','var(--phys)',`Blind ${R.blind}%`);
  if(R.mud)L('lightning','var(--lightning)','Mud: Lightning ×2, Freeze +50%');
  if(R.stunChance)L('lightning','var(--lightning)',`Stun ${R.stunChance}%`);
  if(R.quake)L('earth','var(--earth)','Hits all monsters');
  if(R.burnSet)L('fire','var(--fire)',`Burn ${R.burnSet} turns`);
  if(R.immuneChance)L('earth','var(--earth)',`Immune ${R.immuneChance}%`);
  if(R.iceAge)L('ice','var(--ice)',`Enemy dmg −50% · ${R.iceAge}t`);
  if(R.lava)L('fire','var(--fire)',`Burn attackers ${R.lava}`);
  const SHORT={fire:'Burn',water:'Soak',ice:'Chill',earth:'+4 block',wind:'30% dodge',lightning:'35% stun',dark:'Curse',light:'Heal 3'};
  [...new Set(R.fx)].filter(f=>!(R.stun&&f==='lightning')).forEach(f=>L(f,typeColor(f),SHORT[f]+(R.fx.filter(x=>x===f).length>1?' ×2':'')));
  return `<div class="rcard ${S.busy?'busy':''}" title="${CARDS[c1.key].name} + ${CARDS[c2.key].name}">
    <div class="rc-head"><h3>${R.name}${isNew?'<span class="new-tag">NEW</span>':''}</h3>${R.dmg.length?`<span class="rc-dmg num">${R.charged?(()=>{const ct=R.dmg[0].t,kn=E.known.includes(ct),m=kn?modOf(E,ct):1;return [chgLo(R),chgHi(R)].map(x=>Math.round((x+R.bonus)*m*(E.curse>0?1.3:1)*(E.shocked?1.1:1)*(E.vuln?1+E.vuln/100:1))).join('–')})():(unk?'≈':'')+est}<small>dmg</small></span>`:''}</div>
    <p class="rc-desc">${describe(R)}</p>
    <div class="rc-fx">${lines.join('')}</div>
    ${S.busy?'':`<div class="rc-actions"><button type="button" class="btn btn-primary" data-act="fuse" ${low?'disabled':''}>${low?'Not enough mana':'Combine'}</button><button type="button" class="btn" data-act="clear">Clear</button></div>`}
  </div>`;
}
function fanHTML(){
  const ids=S.hand.filter(id=>card(id));const n=ids.length,mid=(n-1)/2;
  return ids.map((id,i)=>{const off=i-mid;return cardHTML(card(id),{act:'sel',sel:S.sel.includes(id)}).replace('style="--tc:',`style="--rot:${off*7}deg;--ty:${Math.abs(off)*Math.abs(off)*7}px;--tc:`)}).join('');
}
const HB={"w": 123, "h": 34, "g": [24, 122, 7, 14], "b": [26, 122, 18, 25]};
function hbClip(f,k){const r=HB[k],x=r[0]+(r[1]-r[0])*Math.max(0,Math.min(1,f));return `clip-path:inset(0 ${(100-x/HB.w*100).toFixed(2)}% 0 0)`}
function hbBar(o){
  const pc=(v,t)=>(v/t*100).toFixed(2)+'%',g=HB.g,b=HB.b;
  return `<div class="hbw ${o.mirror?'mir':''}"><div class="hb">
    <i class="hbt" style="left:${pc(g[0],HB.w)};top:${pc(g[2],HB.h)};width:${pc(g[1]-g[0],HB.w)};height:${pc(g[3]-g[2],HB.h)}"></i>
    <i class="hbt" style="left:${pc(b[0],HB.w)};top:${pc(b[2],HB.h)};width:${pc(b[1]-b[0],HB.w)};height:${pc(b[3]-b[2],HB.h)}"></i>
    <i class="hbl ${o.red?'hbr':'hbg'}" style="${hbClip(o.hp/o.max,'g')}"></i><i class="hbl hbb" style="${hbClip(o.mp!=null?o.mp/o.mpMax:o.bl/20,'b')}"></i><i class="hbl hbf"></i></div>
    <span class="hb-emb" style="color:${o.embCol||'var(--ink)'}">${icon(o.emb)}</span>
    <span class="hb-hp num">${Math.max(0,o.hp)}/${o.max}</span>${o.mp!=null?`<span class="hb-bl num">${o.mp}/${o.mpMax}</span>`:o.bl?`<span class="hb-bl num">${o.bl}</span>`:''}</div>`;
}
function hudMini(E){
  const mods=ENEMIES[E.id].mods,w=[],r=[];
  Object.entries(mods).forEach(([t,m])=>{const k=E.known.includes(t);const c=k?`<span class="mc ${m===0?'imm':m>1?'weak':'res'}" title="${TYPENAME[t]} ×${m}">${icon(t==='pierce'?'stab':t==='blunt'?'punch':t)}${m===0?'0':'×'+m}</span>`:'<span class="mc unk">?</span>';(m>1?w:r).push(c)});
  const st=[];if(E.block)st.push(`<span class="mc st" style="--c:var(--guard)">${icon('shield')}${E.block}</span>`);if(E.burn)st.push(`<span class="mc st" style="--c:var(--fire)">${icon('fire')}${E.burn}</span>`);if(E.soak)st.push(`<span class="mc st" style="--c:var(--water)">${icon('water')}</span>`);if(E.chill)st.push(`<span class="mc st" style="--c:var(--ice)">${icon('ice')}</span>`);if(E.curse)st.push(`<span class="mc st" style="--c:var(--dark)">${icon('dark')}${E.curse}</span>`);if(E.blind)st.push(`<span class="mc st" style="--c:var(--phys)">${icon('dark')}${E.blind}%</span>`);if(E.str)st.push(`<span class="mc st" style="--c:var(--danger)">${icon('buff')}${E.str}</span>`);if(E.mud>0)st.push(`<span class="mc st" style="--c:var(--earth)" title="Standing in mud: Lightning deals double damage, freeze chance +50%">${icon('earth')}mud</span>`);if(E.vuln)st.push(`<span class="mc st" style="--c:var(--dark)" title="Takes ${E.vuln}% more damage for ${E.vulnT} more turns">${icon('dark')}+${E.vuln}%</span>`);if(E.shocked)st.push(`<span class="mc st" style="--c:var(--lightning)" title="Shocked: takes 10% more damage">${icon('lightning')}+10%</span>`);if(E.frozen)st.push(`<span class="mc st" style="--c:var(--ice)">${icon('ice')}Frozen</span>`);if(E.stun)st.push(`<span class="mc st" style="--c:var(--lightning)">${icon('lightning')}Stun</span>`);
  return `<div class="hud-mini">${st.join('')}<span class="ml">Weak</span>${w.join('')||'<span class="mc unk">–</span>'}<span class="ml">Res</span>${r.join('')||'<span class="mc unk">–</span>'}</div>`;
}
function hudHTML(){
  if(S.phase!=='battle'||!S.enemy)return '';
  const E=S.tgt&&S.tgt.hp>0?S.tgt:S.enemy,d=ENEMIES[E.id],it=E.frozen?{icon:'ice',label:'Frozen',val:'',cls:'',note:''}:E.stun?{icon:'lightning',label:'Stunned',val:'',cls:'',note:''}:intentText(E);
  return `<div class="hud hud-hero">${hbBar({hp:S.hp,max:S.maxHp,mp:S.mana,mpMax:S.maxMana,emb:'heal',embCol:'var(--ok)'})}<div class="hud-cap"><span class="eyebrow">You</span></div></div>
  <div class="hud hud-mon">${hbBar({hp:E.hp,max:E.max,bl:E.block,emb:it.icon,embCol:it.cls==='heavy'?'var(--danger)':'var(--ink)',red:true,mirror:true})}
    <div class="hud-cap">${E.boss||E.elite?`<span class="eyebrow">${E.boss?'Boss':'Elite'}</span>`:''}<b class="hud-name">${d.name}</b><span class="hud-int ${it.cls}" title="Next move${it.note?': '+it.note:''}">${icon(it.icon)}${it.label}${it.val!==''?` <b class="num">${it.val}</b>`:''}</span></div>
    ${hudMini(E)}</div>`;
}
function battleHTML(){
  const E=S.enemy,d=ENEMIES[E.id],it=intentText(E);
  return `<section class="hand-zone" aria-label="Your hand"><div class="fan ${S.busy?'locked':''}">${fanHTML()}</div>
  <div class="hand-meta"><span>Draw pile <b class="num">${S.draw.length}</b></span><span>Discard <b class="num">${S.disc.length}</b></span><span>Turn <b class="num">${S.turns+1}</b></span></div>
  <div class="pstatus">${playerStatusHTML()}<button type="button" class="btn btn-sm skip-btn" data-act="skipturn" ${S.busy?'disabled':''} title="End your turn without combining and recover 20 mana">Skip turn <span class="num">+20 mana</span></button></div></section>
  `;
}
function titleHTML(){
  const ex=k=>cardHTML({key:k,lvl:1});
  return `<section class="screen">
    <div class="eyebrow">A combination card adventure</div>
    <h2>Two cards. One move.</h2>
    <p>Fight through three levels of 15 stops each: monsters, events, camps and treasure. Every turn, combine two cards from your hand into one action. You start with a Traveler's Sword (which gives you Slash), plus Stab, Punch, Block and one random element. You can hold up to 8 skill cards.</p>
    <div class="example">${ex('slash')}<span class="eq">+</span>${ex('fire')}<span class="eq">=</span><div><div class="eyebrow">Combination</div><h3 style="font-size:26px;color:var(--brass)">Fire Slash</h3><span style="color:var(--muted);font-size:13px">Slash damage, fire damage, and a burn.</span></div></div>
    <div class="rules">
      <div class="rule"><b>Attack + Element</b>Both damage types hit, plus the element's effect. Slash + Ice is Frost Slash.</div>
      <div class="rule"><b>Element + Element</b>A spell. Fire + Water is Steam, Earth + Fire is Magma.</div>
      <div class="rule"><b>Defense combos</b>Water + Shield makes Bubble Shield. Parry + Counter makes Perfect Counter.</div>
      <div class="rule"><b>8-card deck</b>Keep, replace, upgrade (up to level 5) or keep a second copy for same-card combos.</div>
      <div class="rule"><b>Item cards</b>Gear goes in its own slots. Rare items unlock new skills, like Shield Bash or Arrow Shot.</div>
      <div class="rule"><b>Read the intent</b>Every monster shows its next move. Shield up before an Ultimate.</div>
    </div>
    <div><button type="button" class="btn btn-primary" data-act="start">Begin the adventure</button></div>
  </section>`;
}
function travelHTML(){return `<section class="screen"><div class="travel"><span class="eyebrow">On the road</span><span>Heading to <b>${NODE_LABEL[curNode().k].toLowerCase()}</b>, node ${S.node+1} of ${S.route.length}…</span></div><p class="lore" style="margin:0">Your deck and equipment are under the Character button.</p></section>`}
function cardOffersHTML(keys,act){return `<div class="card-row">${keys.map(k=>cardHTML({key:k,lvl:1},{act})).join('')}</div>`}
function rewardHTML(){
  const r=S.reward;
  return `<section class="screen"><div class="eyebrow">${r.boss?`Level ${S.level+1} cleared`:'Victory'}</div><h2>${r.name} defeated</h2>
    <p>${r.healed?`You catch your breath and heal ${r.healed} HP. `:''}Pick one of the dropped cards in the scene above. Skill cards use your ${MAX_CARDS} slots (${S.deck.length} used); item cards go to your equipment.</p>
    </section>`;
}
function deckHTML(act,withGranted){
  const list=act&&!withGranted?S.deck:battleDeck();
  return `<div><div class="eyebrow" style="margin-bottom:8px">${act?'Choose a card':'Your skill cards'} · ${S.deck.length}/${MAX_CARDS}${grantedCards().length?` · +${grantedCards().length} from items`:''} · HP ${S.hp}/${S.maxHp}</div><div class="card-row">${list.map(c=>cardHTML(c,act?{act,small:true}:{small:true})).join('')}</div></div>`;
}
function itemCardHTML(e,opts={}){
  const it=ITEMS[e.key],rar=it.slot?e.rarity:'potion';
  return `<div class="icard ${rar}">${itemIcon(e.key,opts.size||64)}<div class="icard-body"><div class="eyebrow">${it.slot?SLOTNAME[it.slot]:'Potion'}${it.slot?` · <span class="rar ${e.rarity}">${e.rarity}</span>`:''}</div><b>${it.name}</b><ul class="stats">${statLines(e.stats,e.key).map(x=>`<li>${x}</li>`).join('')}</ul></div></div>`;
}
function rewardItemHTML(L,i){
  const it=ITEMS[L.key],cur=it.slot?S.gear[it.slot]:null;
  return `<div class="rw"><button type="button" class="ichoice ${it.slot?L.rarity:'potion'}" data-act="rewarditem" data-i="${i}">${itemIcon(L.key,56)}<span class="eyebrow">${it.slot?SLOTNAME[it.slot]:'Potion'}${it.slot?` · <span class="rar ${L.rarity}">${L.rarity}</span>`:''}</span><b>${it.name}</b><ul class="stats">${statLines(L.stats,L.key).map(x=>`<li>${x}</li>`).join('')}</ul>${it.slot?`<span class="compare">${cur?`Replaces ${ITEMS[cur.key].name}`:'Empty slot'}</span>`:''}</button><span class="eyebrow">Item card</span></div>`;
}
const RAR_COL={common:'var(--phys)',rare:'var(--rare)',epic:'var(--epic)'};
function itemFaceHTML(L,i){
  const it=ITEMS[L.key],cur=it.slot?S.gear[it.slot]:null,lines=statLines(L.stats,L.key);
  return `<button type="button" class="card icard-face ${it.slot?L.rarity:'potion'}" data-act="droppick" data-i="${i}" style="--tc:${it.slot?RAR_COL[L.rarity]:'var(--mend)'}" aria-label="${it.name}, item card">
    <span class="card-top"><span class="card-cat">${it.slot?SLOTNAME[it.slot]:'Potion'}</span>${it.slot&&L.rarity!=='common'?`<span class="rar ${L.rarity}">${L.rarity}</span>`:''}</span>
    <span class="card-icon">${itemIcon(L.key,50)}</span>
    <span class="card-name">${it.name}</span>
    <span class="card-desc">${lines.join(' · ')}${cur?`<i>Replaces ${ITEMS[cur.key].name}</i>`:''}</span></button>`;
}
function dropHTML(){
  const D=S.drop;if(!D||D.taken)return '';
  return `<div class="drop-layer"><div class="drop-title">${D.title}</div>
    <div class="drop-row">${D.offers.map((o,i)=>o.type==='skill'?cardHTML({key:o.key,lvl:1},{act:'droppick'}).replace('data-act="droppick"',`data-act="droppick" data-i="${i}"`):itemFaceHTML(o.loot,i)).join('')}</div>
    <div class="drop-sub">Skill cards use your ${MAX_CARDS} slots (${S.deck.length} used). Item cards go to your equipment.</div>
    <button type="button" class="btn btn-sm" data-act="dropskip">${D.skip||'Skip'}</button></div>`;
}
function lootHTML(L){
  if(!L)return '';
  const it=ITEMS[L.key];
  if(L.done)return `<div class="loot ${L.rarity}">${itemIcon(L.key,48)}<div class="loot-body"><p>${L.msg}</p></div></div>`;
  const cur=it.slot?S.gear[it.slot]:null;
  return `<div class="loot ${it.slot?L.rarity:'common'}">${itemIcon(L.key,80)}<div class="loot-body">
    <div class="eyebrow">Item card · ${it.slot?SLOTNAME[it.slot]:'Potion'}</div>
    <h3>${it.name}${it.slot?`<span class="rar ${L.rarity}">${L.rarity}</span>`:''}</h3>
    <ul class="stats">${statLines(L.stats,L.key).map(x=>`<li>${x}</li>`).join('')}</ul>
    ${it.slot?`<p class="compare">${cur?`Replaces your ${ITEMS[cur.key].name}: ${statLines(cur.stats,cur.key).join(', ')}.`:'Nothing equipped in this slot yet.'}</p>`:''}
    <div class="result-actions" style="margin-top:6px"><button type="button" class="btn btn-primary" data-act="lootuse">${it.slot?'Equip':'Drink it'}</button><button type="button" class="btn" data-act="lootleave">Leave it</button></div>
  </div></div>`;
}
const EV_OPTS={
  camp:[['Rest','Recover 35% of your max HP.','heal','var(--mend)'],['Train','Raise one skill card by 1 level.','buff','var(--brass)']],
  chest:[['Open it','Take one of the cards inside.','chest','var(--brass)']],
  shrine:[['Pray','Heal up to 20 HP.','pray','var(--light)'],['Offering','Receive a random element card.','light','var(--rare)'],['Meditate','Raise a random card by 1 level.','buff','var(--brass)']],
  smith:[['Temper','Choose any card. It gains 1 level.','anvil','var(--brass)'],['Move on','Leave the smith behind.','leave','var(--muted)']],
  merchant:[['Tonic','Max HP +8, but lose 6 HP now.','potion','var(--mend)'],['Move on','Leave without trading.','leave','var(--muted)']],
  mimic:[['Open it','Probably treasure. Possibly teeth.','chest','var(--brass)'],['Leave it','Some chests are better left shut.','leave','var(--muted)']]};
function eventInfo(ev){return ev.id==='camp'?{name:'Camp',text:'A quiet clearing with a crackling fire. A good place to rest or train.',icon:'camp'}:ev.id==='chest'?{name:'Treasure Chest',text:'A sturdy chest half-buried in the moss. It is not breathing.',icon:'chest'}:{...EVENTS[ev.id],icon:'event'}}
function eventLayerHTML(){
  if(!['event','camp','chest'].includes(S.phase)||!S.ev)return '';
  if(S.drop&&!S.drop.taken)return '';
  const ev=S.ev,E=eventInfo(ev);let body='';
  if(ev.step==='done'){
    body=`<p class="ev-msg">${ev.msg||''}</p>${lootHTML(ev.loot)}<button type="button" class="btn btn-primary" data-act="continue">Continue ${icon('leave')}</button>`;
  }else if(ev.step==='train'){
    body=`<p class="ev-hint">Tap a card to raise its level by 1 (max 5).</p><div class="card-row ev-cards">${battleDeck().map(c=>cardHTML(c,{act:'evcard',small:true})).join('')}</div><button type="button" class="btn btn-sm" data-act="evback">Back</button>`;
  }else if(ev.step==='give'){
    body=`<p class="ev-hint">You chose <b>${CARDS[ev.offer].name}</b>. Tap the card you'll give in exchange.</p><div class="card-row ev-cards">${S.deck.map(c=>cardHTML(c,{act:'evcard',small:true})).join('')}</div><button type="button" class="btn btn-sm" data-act="evback">Back</button>`;
  }else{
    const opts=EV_OPTS[ev.id];
    const trade=ev.id==='merchant'?ev.offers.map(k=>`<button type="button" class="ev-opt" data-act="evoffer" data-key="${k}" style="--oc:${typeColor(k)}"><span class="ev-ic">${icon(k)}</span><b>${CARDS[k].name}</b><span>Trade one of your cards for this ${CATLABEL[CARDS[k].cat].toLowerCase()} card.</span></button>`).join(''):'';
    body=`<div class="ev-opts">${trade}${opts.map((o,i)=>`<button type="button" class="ev-opt" data-act="evopt" data-i="${i}" style="--oc:${o[3]}"><span class="ev-ic">${icon(o[2])}</span><b>${o[0]}</b><span>${o[1]}</span></button>`).join('')}</div>`;
  }
  return `<div class="ev-layer"><div class="ev-head"><span class="ev-hic">${icon(E.icon)}</span><div><h2>${E.name}</h2><p>${E.text}</p></div></div>${body}</div>`;
}

function endHTML(win){
  const n=curNode();
  return `<section class="screen"><div class="eyebrow">${win?'Adventure complete':'Fallen'}</div>
    <h2>${win?'The Ember Monarch falls':`Defeated by ${nodeName(n)}`}</h2>
    <p>${win?'All three levels are cleared. The forest is quiet again.':`You reached level ${S.level+1}, node ${S.node+1} of ${S.route.length}.`}</p>
    <div class="stat-line" style="font-size:15px"><span>Monsters defeated <b>${S.kills}</b></span><span>Turns <b>${S.turns}</b></span><span>Combinations found <b>${S.codex.length} / ${TOTAL_RECIPES}</b></span></div>
    <div><button type="button" class="btn btn-primary" data-act="restart">${win?'Play again':'Try again'}</button></div></section>`;
}
function acqHTML(){
  const A=S.acq;if(!A)return '';const d=CARDS[A.key],name=d.name;
  const dups=S.deck.filter(c=>c.key===A.key),full=S.deck.length>=MAX_CARDS;
  const up=dups.filter(c=>c.lvl<5).sort((x,y)=>y.lvl-x.lvl)[0];
  let body;
  if(A.step==='replace'){
    body=`<p>Tap the card to remove. ${name} takes its place.</p><div class="card-row">${S.deck.map(c=>cardHTML(c,{act:'acqpick',small:true})).join('')}</div><div><button type="button" class="btn" data-act="acqback">Back</button></div>`;
  }else{
    const o=[];
    if(up)o.push(['acqup',`Upgrade ${name} to level ${up.lvl+1}`,'Your existing copy gets stronger.']);
    if(dups.length&&!full)o.push(['acqcopy','Keep a second copy',`Two ${name} cards can combine into ${SAMEN[A.key]}.`]);
    if(!dups.length&&!full)o.push(['acqadd','Add to your deck',`${S.deck.length+1} of ${MAX_CARDS} slots will be used.`]);
    o.push(['acqreplace','Replace a card',full?'Your deck is full. Swap one out.':'Swap out a card you use less.']);
    o.push(['acqdiscard','Discard it','Leave it behind.']);
    body=`<div class="options">${o.map(([a,t,s])=>`<button type="button" class="opt" data-act="${a}"><b>${t}</b><span>${s}</span></button>`).join('')}</div>`;
  }
  return `<div class="modal"><div class="modal-box acq" role="dialog" aria-label="New card">
    <div class="eyebrow">New skill card · ${S.deck.length}/${MAX_CARDS} slots</div>
    <div class="acq-head">${cardHTML({key:A.key,lvl:1})}<div><h2 style="font-size:28px;color:var(--brass)">${name}</h2><p class="lore" style="margin:4px 0 0">${CATLABEL[d.cat]} card. ${d.desc}</p></div></div>
    ${body}</div></div>`;
}
function charHTML(){
  if(!S.charOpen)return '';
  const g=stats();const sum=[];
  sum.push(['Max HP',`${S.maxHp}`]);sum.push(['Mana',`${S.mana}/${S.maxMana}`]);sum.push(['Element card cost',`${Math.max(0,10-(g.mcost||0))} mana`]);sum.push(['Attack bonus',`+${g.atk||0}`]);sum.push(['Block each turn',`+${g.def||0}`]);sum.push(['Heal after fights',`${5+(g.regen||0)}`]);
  Object.keys(TYPENAME).forEach(t=>{if(g[t])sum.push([`${TYPENAME[t]} damage`,`+${g[t]}`])});
  Object.entries(g.lv).forEach(([k,v])=>sum.push([`${CARDS[k].name} level`,`+${v}`]));
  return `<div class="modal" data-act="closechar"><div class="modal-box wide" role="dialog" aria-label="Character" data-stop="1">
    <div class="modal-head"><h2 style="font-size:28px;color:var(--brass)">Character</h2><button type="button" class="btn" data-act="closechar">Close</button></div>
    <div class="char-stats">${sum.map(([k,v])=>`<div><span>${k}</span><b class="num">${v}</b></div>`).join('')}</div>
    <h3 class="sec-h">Equipment <span class="eyebrow">item cards · separate from your 8 skill cards</span></h3>
    <div class="equip">${Object.keys(SLOTNAME).map(sl=>{const e=S.gear[sl];return e?`<div class="eslot">${itemCardHTML(e,{size:48})}</div>`:`<div class="eslot empty"><span class="eyebrow">${SLOTNAME[sl]}</span><span>Empty</span></div>`}).join('')}</div>
    <h3 class="sec-h">Skill cards <span class="eyebrow">${S.deck.length}/${MAX_CARDS}</span></h3>
    <div class="card-row">${S.deck.map(c=>cardHTML(c,{small:true})).join('')}</div>
    ${grantedCards().length?`<h3 class="sec-h">Item skills <span class="eyebrow">from equipped items</span></h3><div class="card-row">${grantedCards().map(c=>cardHTML(c,{small:true})).join('')}</div>`:''}
  </div></div>`;
}
function codexHTML(){
  if(!S.codexOpen)return '';
  return `<div class="modal" data-act="closecodex"><div class="modal-box wide" role="dialog" aria-label="Combination codex" data-stop="1">
    <div class="modal-head"><h2 style="font-size:28px;color:var(--brass)">Combination codex</h2><button type="button" class="btn" data-act="closecodex">Close</button></div>
    <p class="eyebrow">${S.codex.length} of ${TOTAL_RECIPES} combinations discovered</p>
    <div class="codex" style="margin:10px 0 18px">${S.codex.map(r=>`<div><b>${r.name}</b><span>${r.a} + ${r.b}</span></div>`).join('')||'<div><span>No combinations yet. Combine any two cards to record one.</span></div>'}</div>
    <h3 style="font-size:20px">Element effects</h3>
    <table class="guide"><tbody>${Object.entries(FXTEXT).map(([k,v])=>`<tr><td style="color:${typeColor(k)}">${CARDS[k].name}</td><td>${v}</td></tr>`).join('')}</tbody></table>
    <h3 style="font-size:20px;margin-top:16px">Defense and support</h3>
    <table class="guide"><tbody>${Object.entries(DEFTEXT).map(([k,v])=>`<tr><td style="color:${typeColor(k)}">${CARDS[k].name}</td><td>${v}</td></tr>`).join('')}</tbody></table>
  </div></div>`;
}
let MOB=false;try{MOB=localStorage.getItem('fb_mobile')==='1'}catch(e){}
const $dock=document.createElement('div');$dock.id='mobDock';document.querySelector('.stage-wrap').after($dock);
const $fdock=document.createElement('div');$fdock.id='mobFuse';document.getElementById('app').appendChild($fdock);
const $drop=document.getElementById('dropLayer'),$top=document.getElementById('top'),$main=document.getElementById('main'),$modal=document.getElementById('modal'),$label=document.getElementById('stageLabel'),$result=document.getElementById('resultLayer'),$hud=document.getElementById('hudLayer');
function render(){
  let main='';const ph=S.phase;
  if(ph==='title')main=titleHTML();
  else if(ph==='travel')main=travelHTML();
  else if(ph==='battle')main=battleHTML();
  else if(ph==='reward')main=rewardHTML();
  else if(ph==='event'||ph==='camp'||ph==='chest')main='';
  else if(ph==='over')main=endHTML(false);
  else if(ph==='win')main=endHTML(true);
  const toast=S.toast?`<div class="toast" role="status">${S.toast}</div>`:'';
  $top.innerHTML=`<header class="top"><div class="brand"><h1>Fusebound</h1><span class="eyebrow">Level ${S.level+1} · ${LEVELS[S.level].name}</span></div>
    <div class="top-actions">${ph!=='title'?'<button type="button" class="btn" data-act="char">Character</button>':''}<button type="button" class="btn mob-btn ${MOB?'on':''}" data-act="mobile" aria-pressed="${MOB}" title="Show card options and your hand larger, below the battle">Mobile</button><button type="button" class="btn" data-act="codex">Codex <span class="num">${S.codex.length}</span></button>${ph!=='title'?'<button type="button" class="btn" data-act="restart">Restart</button>':''}</div></header>${routeHTML()}${toast}`;
  $main.innerHTML=main;
  $result.innerHTML=resultHTML();
  $fdock.innerHTML='';if(MOB){const sk=$main.querySelector('.skip-btn'),fb=$result.querySelector('[data-act=fuse]');if(sk)$fdock.appendChild(sk);if(fb)$fdock.appendChild(fb)}
  $hud.innerHTML=hudHTML();
  const dh=dropHTML()||eventLayerHTML();document.body.classList.toggle('mob',MOB);if(MOB){$drop.innerHTML='';$dock.innerHTML=dh}else{$dock.innerHTML='';$drop.innerHTML=dh}
  document.querySelector('.stage-wrap').classList.toggle('in-battle',ph==='battle');
  document.querySelector('.stage-wrap').classList.toggle('in-drop',!!dh&&!MOB);
  $modal.innerHTML=acqHTML()||charHTML()||codexHTML();
  const n=curNode();
  $label.textContent=ph==='title'?'':ph==='win'?'Adventure complete':ph==='travel'?`Level ${S.level+1} · ${LEVELS[S.level].name}`:nodeName(n);
  const cur=$top.querySelector('.node.cur');if(cur)cur.scrollIntoView({block:'nearest',inline:'center'});
  if(S.toast){clearTimeout(render.tt);render.tt=setTimeout(()=>{S.toast=null;const t=$top.querySelector('.toast');if(t)t.remove()},3200)}
}

document.getElementById('app').addEventListener('click',e=>{
  if(e.target.id==='stage'&&S&&S.phase==='battle'&&!S.busy&&S.foes&&S.foes.length>1){const i=Stage.foeAt(e.clientX,e.clientY);const F=S.foes[i];if(F&&F.hp>0&&F!==S.tgt){setTarget(F);render()}return}
  const b=e.target.closest('[data-act]');if(!b)return;
  const act=b.dataset.act,id=b.dataset.id;
  if((act==='closecodex'||act==='closechar')&&e.target.closest('[data-stop]')&&!e.target.closest('button'))return;
  if(act.startsWith('acq')){acqAction(act,id);return}
  if(act==='mobile'){MOB=!MOB;try{localStorage.setItem('fb_mobile',MOB?'1':'0')}catch(e){}render();if(MOB&&$dock.innerHTML)$dock.scrollIntoView({block:'nearest',behavior:'smooth'});return}
  if(act==='target'){if(S.phase==='battle'&&!S.busy&&S.foes){const F=S.foes[+id];if(F&&F.hp>0){setTarget(F);S.sel=S.sel;render()}}return}
  switch(act){
    case 'start':S.node=0;travel();break;
    case 'sel':
      if(S.busy)return;
      if(S.sel.includes(id))S.sel=S.sel.filter(x=>x!==id);
      else if(S.sel.length<2)S.sel.push(id);
      else S.sel=[S.sel[0],id];
      render();break;
    case 'unsel':if(S.busy)return;S.sel=S.sel.filter(x=>x!==id);render();break;
    case 'clear':S.sel=[];render();break;
    case 'fuse':doFuse();break;
    case 'skipturn':skipTurn();break;
    case 'reward':offerCard(b.dataset.key,S.reward.boss?'nextlevel':'advance');break;
    case 'rewarditem':{const o=S.reward.offers[+b.dataset.i];useLoot(o.loot);S.toast=o.loot.msg;if(S.reward.boss)nextLevel();else advance();break}
    case 'skip':if(S.reward.boss)nextLevel();else advance();break;
    case 'evopt':evOption(+b.dataset.i);break;
    case 'evoffer':S.ev.offer=b.dataset.key;S.ev.step='give';render();break;
    case 'evback':S.ev.step='main';render();break;
    case 'evcard':evCard(id);break;
    case 'evtake':S.ev.cardTaken=true;offerCard(b.dataset.key,'none');break;
    case 'continue':advance();break;
    case 'droppick':dropPick(+b.dataset.i);break;
    case 'dropskip':finishDrop();break;
    case 'lootuse':useLoot();break;
    case 'lootleave':leaveLoot();break;
    case 'char':S.charOpen=true;render();break;
    case 'closechar':S.charOpen=false;render();break;
    case 'codex':S.codexOpen=true;render();break;
    case 'closecodex':S.codexOpen=false;render();break;
    case 'restart':newGame();Stage.reset();Stage.setBg('forest');render();break;
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(S.codexOpen||S.charOpen)){S.codexOpen=false;S.charOpen=false;render()}});

function start(data){
  if(data&&data.S&&data.S.v===2){
    S=data.S;S.busy=false;if(S.foes&&S.foes.length){S.enemy=S.foes.find(f=>S.enemy&&f.slot===S.enemy.slot)||S.foes[0];S.tgt=S.enemy}else if(S.enemy){S.enemy.slot=0;S.foes=[S.enemy];S.tgt=S.enemy}Stage.setBg(LEVELS[S.level].bg||'forest');if(S.maxMana==null){S.maxMana=100;S.mana=100}
    if(S.phase==='travel'){travel();return}
    const n=curNode();
    if(S.phase==='battle'){Stage.place(stageNode(n));if(S.iceAge>0)Stage.iceFloor(true)}
    else if(['event','camp','chest'].includes(S.phase))Stage.place(stageNode(n));
    else Stage.place(null);
    if(S.phase==='over')Stage.playerDie();
  }else newGame();
  render();
}
window.claude?.hot?.snapshot?.(()=>({S}));
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
