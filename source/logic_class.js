
/* ===== Classes: Aegis Warden, Arcanist, Swordsman — passives and 3-card ultimates ===== */
const CLASSES={
 warden:{name:'Aegis Warden',cat:'def',item:'warden_shield',col:'#59c9c2',tag:'Defender',
   lines:['Fights with a shield as a weapon: starts with a Round Shield (Shield Bash), no sword','Shield attacks deal ×1.25 damage','Each turn: +1 block per card level in your deck','Shield Bash and Shield Throw count as Defense cards for the ultimate'],
   ult:'Citadel Crash',ultCat:'Defense',ultText:'Combine 3 Defense or shield cards: raise a fortress around you, then bring its walls crashing down on every enemy.'},
 arcanist:{name:'Arcanist',cat:'elem',item:'apprentice_wand',col:'#b18bff',tag:'Spellcaster',
   lines:['Starts with an Apprentice Wand (elements cost 1 less mana)','Affinity with your first element: its damage ×1.25','Starts with a random element card'],
   ult:'Prismatic Cataclysm',ultCat:'Element',ultText:'Combine 3 Element cards: fuse their circles into a prism that rains each element on every enemy.'},
 swordsman:{name:'Swordsman',cat:'phys',item:'starter_sword',col:'#ffb347',tag:'Duelist',
   lines:['Starts with a sword (Slash card)','Physical combos heal 1 HP per hit','Slash and Stab combos also cut up to 2 more enemies for 30%'],
   ult:'Thousand Petal Cut',ultCat:'Physical',ultText:'Combine 3 Physical cards: blink through every enemy in a storm of cuts, ending in a giant X.'}};
const ULT_COST=30;
function pickClass(k){const C=CLASSES[k];if(!C)return;S.cls=k;
  if(k==='warden'){S.gear.weapon={key:'warden_shield',rarity:'common',stats:{def:1},cardLvl:1};delete S.gear.shield}
  if(k==='arcanist'){S.gear.weapon={key:'apprentice_wand',rarity:'common',stats:{mcost:1}};const e=S.deck.find(c=>CARDS[c.key].cat==='elem');S.affinity=e?e.key:rnd(ELEMS)}
  recalc&&recalc();S.toast=`You set out as ${/^[AEIOU]/.test(C.name)?'an':'a'} ${C.name}.${k==='arcanist'?` Your affinity is ${TYPENAME[S.affinity]}.`:''}`;choosePath()}
function classHTML(){return `<div class="path-layer class-layer"><div class="path-head"><div class="eyebrow">A new journey</div><h2>Choose your class</h2></div>
  <div class="path-cards">${Object.entries(CLASSES).map(([k,C],i)=>`<button type="button" class="pcard ccard" data-act="class" data-k="${k}" style="--oc:${C.col};--fd:${i*.6}s">
    <span class="cc-art"><span class="cc-glow"></span>${itemIcon(C.item,84)}</span>
    <span class="pc-tag">${C.tag}</span>
    <span class="pc-body"><b class="pc-title">${C.name}</b><ul class="cc-list">${C.lines.map(l=>`<li>${l}</li>`).join('')}</ul><span class="pc-meta">Ultimate: ${C.ult}</span><span class="cc-ult">${C.ultText}</span></span></button>`).join('')}</div>
  <p class="path-foot">Your class decides your starting gear, a passive bonus and a 3-card ultimate.</p></div>`}
const deckLv=()=>S.deck.reduce((a,c)=>a+(c.lvl||1),0);
function clsBlock(){return S&&S.cls==='warden'?deckLv():0}
function clsMods(R,c1,c2){if(!S.cls||!R.dmg.length)return;const ks=[c1.key,c2.key];R.gtags=R.gtags||[];
  if(S.cls==='warden'&&ks.some(k=>k==='shieldbash'||k==='shieldthrow')){R.dmg.forEach(p=>p.p=Math.round(p.p*1.25));R.gtags.push('Warden shield ×1.25')}
  if(S.cls==='arcanist'&&S.affinity){const a=S.affinity;let hit=false;if(R.tickTypes){const f=R.tickTypes.filter(t=>t===a).length/R.tickTypes.length;if(f>0){R.dmg[0].p=Math.round(R.dmg[0].p*(1+.25*f));hit=true}}else R.dmg.forEach(p=>{if(p.t===a){p.p=Math.round(p.p*1.25);hit=true}});if(hit)R.gtags.push(`${TYPENAME[a]} affinity ×1.25`)}
  if(S.cls==='swordsman'&&ks.some(k=>CARDS[k].cat==='phys')){R.swordHeal=true;R.gtags.push('Heal 1 per hit')}
  if(S.cls==='swordsman'&&ks.some(k=>k==='slash'||k==='stab')){R.swordCleave=true;R.gtags.push('Also cuts 2 more for 30%')}}
function clsAfterHit(E,R,total,notes){if(!S.cls||!R.dmg.length||R.warded)return;
  if(R.swordHeal){const n=R.ticks||(R.segs?R.segs.length:0)||(R.double?2:1),h=Math.min(n,S.maxHp-S.hp);if(h>0){S.hp+=h;Stage.float('player',`+${h}`,'#7fe08a','BLADE HEAL',360);notes.push(`<span class="w">healed ${h}</span>`)}}
  if(R.swordCleave&&total>0){const others=(S.foes||[]).filter(F=>F!==E&&F.hp>0).slice(0,2);if(others.length){const d=Math.max(1,Math.round(total*.3));others.forEach((F,i)=>sideHit(F,d,'#ffe0b0','CLEAVE',220+i*90,notes));notes.push(`<span class="w">the blade cuts ${others.length} more for ${d}</span>`)}}}
function clsCat(k){return S.cls==='warden'&&(k==='shieldbash'||k==='shieldthrow')?'def':CARDS[k].cat}
function canThird(id){if(!S.cls||S.sel.length!==2)return false;const cat=CLASSES[S.cls].cat,c=card(id);return!!c&&clsCat(c.key)===cat&&S.sel.every(x=>{const cc=card(x);return cc&&clsCat(cc.key)===cat})}
function ultBuild(cs){const u=cs.reduce((a,c)=>a+effLv(c),0),k=S.cls,R={ult:true,spell:'ult_'+k,name:CLASSES[k].ult,dmg:[],fx:[],phys:[],kind:'cast',charge:[],u,key:'ult_'+k,block:0,barrier:0};
  if(k==='warden'){R.barrier=3*u;R.block=2*u;R.crash=3*u}
  if(k==='arcanist'){R.els=cs.map(c=>c.key);R.per=4*u}
  if(k==='swordsman'){R.cuts=12;R.total=8*u;R.bleedP=1+Math.ceil(u/3)}
  return R}
function ultDesc(R){const k=S.cls;if(k==='warden')return `Raises a fortress of tower shields: a ${R.barrier}-point barrier for 3 turns and ${R.block} block. Then the walls crash down on every enemy for ${R.crash} + half your block and barrier as Blunt damage, with a 50% chance to stun each.`;
  if(k==='arcanist')return `Stacks your three element circles into a prism that fires ${R.els.map(e=>TYPENAME[e]).join(', ')} beams at every enemy for ${R.per} each${S.affinity&&R.els.includes(S.affinity)?` (${TYPENAME[S.affinity]} ×1.25)`:''}, applying every element's effect.`;
  return `Blinks through every enemy in ${R.cuts} cuts for ${R.total} Slash damage to your target (60% to the others), then splits them with a giant X. They bleed ${R.bleedP} a turn for 3 turns, and you heal 1 per cut.`}
function ultHTML(){const cs=S.sel.map(card);if(cs.some(c=>!c))return'';const R=ultBuild(cs),low=ULT_COST>S.mana,C=CLASSES[S.cls];
  return `<div class="rcard ult-card" style="--oc:${C.col}"><div class="rc-head"><h3>${R.name}<span class="new-tag">ULTIMATE</span></h3></div><p class="rc-desc">${ultDesc(R)}</p>
    <div class="rc-fx"><span class="rfx" style="--c:#4aa8ff">${icon('water')}Mana −${ULT_COST}</span><span class="rfx" style="--c:${C.col}">${icon('ult')}${cs.map(c=>CARDS[c.key].name).join(' + ')}</span></div>
    <div class="rc-actions"><button type="button" class="btn btn-primary" data-act="fuse" ${low?'disabled':''}>${low?'Not enough mana':'Unleash'}</button><button type="button" class="btn" data-act="clear">Clear</button></div></div>`}
function doUltimate(){if(S.busy||S.sel.length!==3)return;if(ULT_COST>S.mana){S.toast=`Not enough mana. The ultimate needs ${ULT_COST}.`;render();return}
  const cs=S.sel.map(card);if(cs.some(c=>!c))return;S.busy=true;S.mana-=ULT_COST;const R=ultBuild(cs);render();
  const delay=Stage.perform(R);
  if(R.tickTimes&&S.cls==='swordsman'){const per=Math.max(1,Math.round(R.total/(R.cuts+1)));R.tickTimes.slice(0,-1).forEach(t=>setTimeout(()=>{if(S.phase!=='battle')return;const E=S.enemy;if(!E)return;const d=partDmg(E,{t:'slash',p:per}).d;Stage.float('enemy',d,'#ffe0b0','',0);Stage.hitEnemy(['slash']);if(S.cls==='swordsman'){const h=Math.min(1,S.maxHp-S.hp);if(h>0)S.hp+=h}render()},t))}
  setTimeout(()=>applyUltimate(cs,R),delay)}
function applyUltimate(cs,R){const E=S.enemy,def=ENEMIES[E.id],notes=[];let total=0;const k=S.cls,others=()=>(S.foes||[]).filter(F=>F!==E&&F.hp>0);
  if(k==='warden'){S.barrier=Math.max(S.barrier,R.barrier);S.barrierT=3;S.block+=R.block;Stage.float('player',`+${R.barrier}`,'#59c9c2','BARRIER',0);
    const dmg=R.crash+Math.round((S.block+S.barrier)/2);const d=partDmg(E,{t:'blunt',p:dmg}).d;E.hp-=d;total=d;Stage.float('enemy',d,'#e0c08a','CITADEL CRASH',0);Stage.hitEnemy(['blunt']);
    if(E.hp>0&&!E.stun&&Math.random()<.5){E.stun=true;notes.push('<span class="w">stunned it</span>')}
    others().forEach((F,i)=>{const dd=partDmg(F,{t:'blunt',p:dmg}).d;sideHit(F,dd,'#e0c08a','CRASH',120+i*90,notes);if(F.hp>0&&Math.random()<.5)F.stun=true})}
  if(k==='arcanist'){R.els.forEach((el,i)=>{const p=Math.round(R.per*(S.affinity===el?1.25:1));const d=partDmg(E,{t:el,p}).d;if(!E.known.includes(el))E.known.push(el);E.hp-=d;total+=d;if(E.hp>0)applyElem(el,E,def);others().forEach((F,j)=>{const dd=partDmg(F,{t:el,p}).d;sideHit(F,dd,hexOf(el),TYPENAME[el].toUpperCase(),i*120+j*60,notes);if(F.hp>0)applyElem(el,F,ENEMIES[F.id])})});Stage.float('enemy',total,'#ffffff','PRISMATIC',0);Stage.hitEnemy(R.els)}
  if(k==='swordsman'){const per=Math.max(1,Math.round(R.total/(R.cuts+1)));const fin=Math.max(1,R.total-per*R.cuts);let d=0;for(let i=0;i<R.cuts;i++)d+=partDmg(E,{t:'slash',p:per}).d;const df=partDmg(E,{t:'slash',p:fin*3}).d;E.hp-=d+df;total=d+df;Stage.float('enemy',df,'#ffffff','FINAL CUT',0);Stage.hitEnemy(['slash']);if(!E.known.includes('slash'))E.known.push('slash');
    if(E.hp>0)bleed(E,notes,3,R.bleedP);others().forEach((F,i)=>{const dd=Math.round(partDmg(F,{t:'slash',p:R.total}).d*.6);sideHit(F,dd,'#ffe0b0','CUT',100+i*90,notes);if(F.hp>0){F.bleed=Math.max(F.bleed||0,3);F.bleedP=Math.max(F.bleedP||0,R.bleedP)}})}
  if(E.hp<=0)foeRevive(E,notes);
  log(`<b>${R.name}</b>! ${cs.map(c=>CARDS[c.key].name).join(' + ')}${total?` for ${total}`:''}${notes.length?'. '+notes.join(', '):''}.`);
  S.hand=S.hand.filter(id=>!S.sel.includes(id));S.disc.push(...S.sel);S.sel=[];
  if(def.boss&&!E.enraged&&E.hp>0&&E.hp<=E.max/2){E.enraged=true;E.str+=3;log(`<span class="r">${def.name} enrages! Its attacks grow stronger.</span>`)}
  render();
  if(E.hp<=0){Stage.enemyDie();const nx=aliveFoes();if(nx.length)setTimeout(()=>{setTarget(nx[0]);render();setTimeout(enemyTurn,350)},900);else setTimeout(winBattle,1100)}else setTimeout(enemyTurn,750)}
