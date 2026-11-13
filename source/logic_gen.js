
/* ===== The remaining 140 combinations: each gets its own name, effect and animation =====
   Spec tokens (u = sum of both card levels):
   dN total damage N*u · hN hits · mixN element share % · pierce · aoe (hits every enemy) · splashN (% to others)
   burnN soakN chillN frzN(% freeze) stunN(%) curseN blindN(%) weakN rootN bleedN(turns) vulnN(%) shock sapN purge
   bvs:cond:N (+N% vs burning/soaked/chilled/cursed/stunned/bleeding/hurt) execN (+N% under 30% HP)
   lsN (% lifesteal) healN (N*u) regenN (N*u for 3 turns) manaN blockN barN parN ctrN (N*u) dodgeN(%) cleanse thorns rideN */
const GEN_SPEC={
 // ---- Physical + Element
 'slash+earth':['Fault Line','Splits the ground open in one heavy downward cut','d6 pierce root2'],
 'slash+wind':['Gale Rend','Whips up five razor gusts in a single flurry','d4 h5 dodge20'],
 'slash+light':['Dawnbreaker','Cuts a sunrise across it in two radiant arcs','d5 h2 heal1 bvs:curse:50'],
 'stab+fire':['Magma Lance','Drives a white-hot lance straight through it','d6 burn2 vuln20'],
 'stab+water':['Tidal Pierce','Thrusts twice on the crest of a water jet','d5 h2 soak2 pierce mana8'],
 'stab+ice':['Icicle Needle','Skewers it with a needle of solid ice','d6 frz40 chill1'],
 'stab+earth':['Stalagmite Thrust','Spears it as a stone spike bursts from the ground','d6 pierce weak2'],
 'stab+wind':['Zephyr Pierce','Fires three wind-driven thrusts that pass right through','d5 h3 splash40'],
 'stab+dark':['Soul Skewer','Pins its soul on a blade of night','d6 ls40 exec50'],
 'stab+light':['Radiant Spear','Thrusts a spear of pure light into it','d6 blind40 regen1'],
 'kick+fire':['Phoenix Kick','Leaps with a flaming kick that bursts on impact','d6 burn2 splash40'],
 'kick+water':['Breaker Wave Kick','Rides a crashing wave into two heavy kicks','d5 h2 soak2 sap2'],
 'kick+ice':['Avalanche Kick','Drops from above in a frozen axe kick','d6 frz25 weak1'],
 'kick+earth':['Landslide Stomp','Stomps so hard the ground heaves under every enemy','d6 aoe stun20'],
 'kick+wind':['Tornado Kick','Spins into four cyclone kicks','d4 h4 dodge25'],
 'kick+dark':['Eclipse Kick','Darkens the sky with a moon-shaped kick','d6 curse2 blind30'],
 'kick+light':['Comet Kick','Falls like a shooting star, kick first','d7 stun20 bvs:stun:50'],
 'punch+fire':['Inferno Fist','Unloads three exploding fire punches','d6 h3 burn2'],
 'punch+water':['Torrent Jab','Jabs four times behind a jet of water','d5 h4 soak1 mana6'],
 'punch+ice':['Frost Knuckle','Lands a freezing haymaker','d6 chill2 frz20'],
 'punch+wind':['Vacuum Fist','Punches the air so hard a wind blast hits it','d6 pierce dodge15'],
 'punch+dark':['Abyss Hammer','Brings down a fist wrapped in the abyss','d7 curse1 vuln15'],
 'punch+light':['Holy Smite','Strikes with a glowing fist that burns away ailments','d6 heal1 cleanse'],
 'shieldbash+fire':['Blazing Rampart','Charges behind a shield of flame','d5 burn2 block2'],
 'shieldbash+water':['Tsunami Charge','Charges on a wave that strips its guard','d5 soak2 purge block1'],
 'shieldbash+ice':['Frostwall Ram','Rams it with a shield coated in ice','d5 frz35 block2'],
 'shieldbash+earth':['Tectonic Bash','Slams down a quake-shaking shield blow','d6 stun35 block2'],
 'shieldbash+wind':['Cyclone Ram','Spins into it inside a wall of wind','d5 dodge30 block1'],
 'shieldbash+lightning':['Thunder Charge','Charges in a crackling storm of sparks','d6 stun40 shock'],
 'shieldbash+dark':['Gloom Bulwark','Crushes it with a shield of living shadow','d5 curse2 bar2'],
 'shieldbash+light':['Aegis Smite','Smites it with a halo-crowned shield','d5 bar2 heal1'],
 'shieldthrow+fire':['Ember Disc','Hurls a burning shield that bounces on','d5 h2 burn2 splash60'],
 'shieldthrow+water':['Ricochet Tide','Skips a shield across a wave three times','d4 h3 soak2 splash40'],
 'shieldthrow+ice':['Frost Boomerang','Throws a frozen shield that curves back twice','d5 h2 chill1 frz20'],
 'shieldthrow+earth':['Boulder Disc','Launches a shield wrapped in rock','d7 pierce stun25'],
 'shieldthrow+wind':['Whirlwind Disc','Sends a shield spinning on a whirlwind','d4 h4 splash50 dodge10'],
 'shieldthrow+lightning':['Storm Disc','Throws a shield that chains lightning','d5 h2 shock stun25 splash50'],
 'shieldthrow+dark':['Void Discus','Hurls a shield that drinks its life','d5 h2 curse2 ls25'],
 'shieldthrow+light':['Halo Disc','Throws a shield ringed with holy light','d5 h2 blind30 heal1'],
 // ---- Physical + Defense
 'slash+block':['Guard Break Slash','Shatters its guard with a slash, then braces','d3 block3 purge'],
 'slash+shield':['Warding Arc','Cuts an arc that hangs in the air as a ward','d3 bar3 bleed2'],
 'slash+parry':['Return Edge','Slashes, then readies the blade to turn the next hit','d3 par4'],
 'slash+dodge':['Wind Step Cut','Cuts twice while stepping out of reach','d3 h2 dodge40'],
 'slash+counter':['Retribution Cut','Marks it with a cut and waits to answer','d3 ctr4 bleed2'],
 'stab+block':['Phalanx','Thrusts from behind a locked shield','d3 block3 pierce'],
 'stab+shield':['Shield Wall Thrust','Finds the gap in its armor from behind a barrier','d3 bar3 vuln15'],
 'stab+parry':["Fencer's Riposte",'Feints, then waits to riposte','d3 par3 exec40'],
 'stab+dodge':['Feint Thrust','Feints one way and thrusts the other','d4 dodge35 vuln20'],
 'stab+counter':['Spiked Guard','Thrusts, then plants the blade point-out','d3 ctr4 weak1'],
 'kick+block':['Iron Stance Kick','Kicks from a rooted, armored stance','d3 block4 stun15'],
 'kick+shield':['Barrier Kick','Kicks a barrier up around yourself','d3 bar3 sap1'],
 'kick+parry':['Deflecting Sweep','Sweeps its legs and stays low to deflect','d3 par3 weak1'],
 'kick+dodge':['Backflip Kick','Kicks off it into a backflip','d3 dodge50'],
 'kick+counter':['Coiled Spring','Kicks, then coils to spring back','d3 ctr5'],
 'punch+block':['Guarded Jab','Two quick jabs behind a high guard','d3 h2 block3'],
 'punch+shield':['Bastion Punch','Punches out a barrier of force','d3 bar3 mana5'],
 'punch+parry':['Counter Hook','Slips inside and hooks, ready for more','d3 par4 stun15'],
 'punch+dodge':['Bob and Weave','Weaves through three punches','d3 h3 dodge35'],
 'punch+counter':['Cross Counter','Punches and waits to cross-counter','d3 ctr5 vuln10'],
 'shieldbash+block':['Turtle Charge','Charges in fully shelled','d3 block5'],
 'shieldbash+shield':['Fortress Ram','Rams it behind a shimmering barrier','d3 bar4 stun15'],
 'shieldbash+parry':['Repel','Shoves it back and turns the next hit aside','d3 par3 sap2'],
 'shieldbash+dodge':['Shoulder Roll','Bashes and rolls clear','d3 dodge40 block2'],
 'shieldbash+counter':['Spiked Shield','Bashes with a shield that bristles with spikes','d3 ctr4 block2'],
 'shieldthrow+block':['Boomerang Guard','Throws the shield and catches it back in guard','d3 block3 splash40'],
 'shieldthrow+shield':['Orbiting Aegis','Sends the shield orbiting around you','d3 bar3 splash30'],
 'shieldthrow+parry':['Rebound Deflect','Bounces the shield twice off it, then deflects','d3 h2 par3'],
 'shieldthrow+dodge':['Distraction Throw','Throws to distract it, then slips away','d3 dodge40 blind25'],
 'shieldthrow+counter':['Returning Rebuke','The shield hits twice and returns ready to punish','d3 h2 ctr4'],
 'arrowshot+block':['Covering Fire','Fires from cover','d3 block3 weak1'],
 'arrowshot+shield':['Warded Volley','Looses three arrows inside a ward','d3 h3 bar2'],
 'arrowshot+parry':['Pinning Shot','Pins its feet, then readies a parry','d3 par3 root2'],
 'arrowshot+dodge':['Retreating Shot','Shoots while leaping backward','d4 dodge40'],
 'arrowshot+counter':['Overwatch','Shoots, then keeps an arrow nocked to answer','d3 ctr5 vuln10'],
 'spearthrow+block':['Pike Wall','Throws, then plants a wall of pikes','d3 block4 pierce'],
 'spearthrow+shield':['Javelin Ward','Hurls a spear that leaves a ward in its wake','d3 bar3 bleed2'],
 'spearthrow+parry':['Vaulting Deflect','Vaults over its guard, ready to deflect','d3 par3 dodge15'],
 'spearthrow+dodge':['Pole Vault Strike','Vaults high and strikes from above','d4 dodge45'],
 'spearthrow+counter':['Impaling Guard','Throws, then waits to impale whatever comes','d3 ctr5 bleed2'],
 // ---- Element + Defense
 'fire+block':['Flame Wall','Raises a wall of fire','block4 ride2'],
 'fire+shield':['Ember Mantle','Wraps you in a cloak of embers','bar3 thorns ride1'],
 'fire+parry':['Searing Riposte','Readies a red-hot parry','par4 ride2'],
 'fire+dodge':['Flicker Flame','Flickers away in a puff of flame','dodge40 d2 burn2'],
 'fire+counter':['Backdraft','Holds back a fire that explodes when struck','ctr5 ride1'],
 'water+block':['Tidewall','Raises a wall of water that feeds your mana','block4 mana8'],
 'water+shield':['Bubble Shield','Wraps you in a cleansing bubble','bar5 cleanse'],
 'water+parry':['Undertow','Turns the next hit aside on a current','par3 ride2 sap2'],
 'water+dodge':['Flowing Water','Flows out of reach like water','dodge45 regen1'],
 'water+counter':['Riptide Rebuke','Pulls attackers into a riptide','ctr4 ride2'],
 'ice+shield':['Glacier Shell','Encases you in a shell of glacier ice','bar4 ride1'],
 'ice+parry':['Frozen Riposte','Readies a parry that freezes','par3 ride2'],
 'ice+dodge':['Frost Glide','Glides away on a sheet of ice','dodge40 d2 chill1'],
 'ice+counter':['Icicle Retort','Grows icicles that answer any blow','ctr5 ride1'],
 'earth+shield':['Stone Wall','Raises a wall of solid stone','bar6'],
 'earth+parry':['Granite Deflect','Deflects with forearms turned to granite','par4 block2'],
 'earth+dodge':['Burrow','Sinks into the ground out of reach','dodge50 block2'],
 'earth+counter':['Rockspike Retort','Rock spikes punish anything that comes close','ctr5 ride2'],
 'wind+block':['Gale Barrier','Raises a howling wall of wind','block3 dodge20'],
 'wind+shield':['Wind Wall','Surrounds you with a spinning wall of air','bar3 dodge25'],
 'wind+parry':['Gust Deflect','Deflects on a gust that refreshes you','par3 mana6'],
 'wind+dodge':['Blink','Vanishes on the wind','dodge100 mana5'],
 'wind+counter':['Tempest Retort','A tempest answers anything that strikes you','ctr3 ride2'],
 'lightning+shield':['Static Shell','Charges a crackling static barrier','bar3 ride25'],
 'lightning+parry':['Thunder Riposte','Readies a parry that cracks like thunder','par4 ride20'],
 'lightning+dodge':['Flash Step','Flashes away in a bolt, zapping it','dodge45 d3 stun20'],
 'lightning+counter':['Lightning Rod','Draws lightning onto anything that hits you','ctr6 ride15'],
 'dark+block':['Shadow Ward','Raises a ward of hungry shadow','block4 ride2'],
 'dark+shield':['Umbral Veil','Hides you behind a veil of night','bar3 dodge15'],
 'dark+parry':['Soul Siphon','Parries and siphons its strength','par3 heal1'],
 'dark+dodge':['Phantom Step','Steps through it like a phantom','dodge40 curse2'],
 'dark+counter':['Grudge','Bears a grudge against anything that hits you','ctr5 ride2'],
 'light+block':['Sacred Ward','Raises a ward of holy light','block4 heal1'],
 'light+shield':['Halo Barrier','Crowns you with a healing halo','bar3 regen1'],
 'light+parry':['Blessed Riposte','Readies a parry that heals you','par3 ride2'],
 'light+dodge':['Radiant Step','Steps away in a blinding flash','dodge40 blind40'],
 'light+counter':['Divine Retribution','Purifies you and waits to strike back','ctr5 cleanse'],
 // ---- Physical + Heal
 'slash+heal':['Blood Harvest','Two draining cuts that feed you','d5 h2 ls50'],
 'stab+heal':['Leech Thrust','A thrust that drinks and keeps healing','d5 ls40 regen1'],
 'kick+heal':['Rejuvenating Kick','A kick that kicks your heart back into rhythm','d5 heal1 stun10'],
 'punch+heal':['Second Breath Punch','Two punches that restore your breath','d5 h2 mana8 ls30'],
 'shieldbash+heal':['Sanctified Bash','A blessed bash that heals and guards','d4 block2 heal1'],
 'shieldthrow+heal':['Mending Disc','A disc that bounces back carrying life','d4 h2 ls40 splash30'],
 'arrowshot+heal':['Lifeline Arrow','An arrow that trails healing light back to you','d5 regen1 ls30'],
 'spearthrow+heal':['Blood Lance','A lance that drains the dying dry','d6 ls50 exec30'],
 // ---- Element + Heal, Defense + Heal, Heal + Heal
 'fire+heal':['Phoenix Ember','Rises from a healing ember that sears it','heal2 d2 burn2'],
 'earth+heal':['Regrowth','Grows a garden of healing roots','regen2 block2'],
 'wind+heal':['Breath of Wind','A fresh breeze that lifts you','heal1 dodge30 mana6'],
 'lightning+heal':['Jolt','Shocks your heart and mana awake','heal1 mana15 d2 stun20'],
 'light+heal':['Holy Light','Bathes you in holy light','heal5 cleanse'],
 'block+heal':['Second Wind','Guards up and catches your breath','block3 heal1'],
 'shield+heal':['Sanctuary','Builds a sanctuary that keeps healing','bar3 regen1'],
 'parry+heal':['Calm Mind','Calms your mind behind a ready blade','par3 mana10 heal1'],
 'dodge+heal':['Evasive Recovery','Recovers while staying light on your feet','dodge35 regen1'],
 'counter+heal':['Patient Strike','Breathes deep, then waits to strike','ctr4 heal1'],
 'heal+heal':['Rejuvenate','A full-body surge of renewal','heal6 regen1 cleanse'],
 // ---- the last Element + Element
 'lightning+water':['Electrocute','Drenches it, then sends lightning through the water','d6 h4 soak2 stun30 shock splash40']
};
function parseGen(str){const o={};str.split(' ').forEach(t=>{if(!t)return;if(t.startsWith('bvs:')){const[,c,v]=t.split(':');o.bvs=[c,+v];return}const m=t.match(/^([a-z]+)(\d*)$/);if(m)o[m[1]]=m[2]===''?true:+m[2]});return o}
const RIDE_TXT={fire:n=>`sets attackers burning for ${n} turns`,water:n=>`soaks attackers for ${n} turns`,ice:n=>`chills attackers (${n*15}% to freeze)`,earth:n=>`gives you ${n} block and may stun attackers`,wind:n=>`makes your dodge +${n*10}% on the next attack`,lightning:n=>`has a ${n}% chance to stun attackers`,dark:n=>`curses attackers for ${n} turns`,light:n=>`heals you ${n} each time you're struck`};
const BVS_TXT={burn:'burning',soak:'soaked',chill:'chilled',curse:'cursed',stun:'stunned',bleed:'bleeding',hurt:'hurt'};
function genParts(key){const[a,b]=key.split('+'),A=CARDS[a],B=CARDS[b];return{a,b,A,B,ph:A.cat==='phys'?A.type:null,el:A.cat==='elem'?a:(B.cat==='elem'?b:null),gd:[a,b].find(k=>CARDS[k].cat==='def')||null,heal:a==='heal'||b==='heal'}}
function genBuild(key,o){return(r,u)=>{const P=genParts(key),el=P.el,ph=P.ph,elG=el==='lightning'&&key==='lightning+water'?'lightning':el;
  r.kind='support';r.dmg=[];r.fx=[];r.trail=null;r.ranged=null;r.charged=null;r.segs=null;r.combo=false;r.double=false;r.ticks=0;r.tickTypes=null;r.tickW=null;r.breaker=!!o.pierce;r.gen=o;r.gu=u;
  if(o.d){const tot=Math.max(1,Math.round(o.d*u)),h=o.h||1,ty=[ph,elG].filter(Boolean);if(key==='lightning+water'){ty.splice(0,ty.length,'water','lightning')}
    if(h>1){r.ticks=h;r.tickTypes=Array.from({length:h},(_,i)=>ty[i%ty.length]);r.dmg=[{t:ty[0],p:tot}]}
    else if(ty.length>1){const es=(o.mix||50)/100,pe=Math.round(tot*es);r.dmg=[{t:ty[0],p:tot-pe},{t:ty[1],p:pe}]}else r.dmg=[{t:ty[0],p:tot}];
    const RG=['shieldthrow','arrowshot','spearthrow'];r.kind=ph?(RG.includes(P.a)?'ranged':'melee'):'cast';if(ph&&RG.includes(P.a))r.ranged='gen';r.phys=ph?[P.a]:[]}
  if(o.block)r.block=Math.round(o.block*u);if(o.bar)r.barrier=Math.round(o.bar*u);if(o.thorns&&el)r.thorns=el;
  if(o.par)r.parry={p:Math.round(o.par*u),t:el||ph||'blunt'};if(o.ctr)r.counter={p:Math.round(o.ctr*u),t:el||ph||'blunt'};
  if(o.dodge)r.dodge=Math.min(100,o.dodge);if(o.heal)r.heal=Math.round(o.heal*u*1.25);if(o.ls)r.lifesteal=o.ls/100}}
function genDesc(key,sp,o){return R=>{const P=genParts(key),u=R.gu||2,el=P.el,bits=[];const tot=R.dmg.reduce((s,p)=>s+p.p,0);
  const types=[...new Set((R.tickTypes||R.dmg.map(p=>p.t)))].map(t=>TYPENAME[t]).join(' + ');
  if(tot>0)bits.push(R.ticks>1?`${R.ticks} hits for ${tot} ${types} damage in total`:`${tot} ${types} damage`);
  if(o.aoe)bits.push('to every enemy');if(o.splash)bits.push(`splashing ${o.splash}% onto the others`);if(o.pierce)bits.push('ignoring shields');if(o.purge)bits.push('washing away its shield');
  const st=[];if(o.burn)st.push(`sets it burning for ${o.burn} turns`);if(o.soak)st.push(`soaks it for ${o.soak} turns`);if(o.chill)st.push('chills it');if(o.frz)st.push(`has a ${o.frz}% chance to freeze it`);if(o.stun)st.push(`has a ${o.stun}% chance to stun`);if(o.curse)st.push(`curses it for ${o.curse} turns`);if(o.blind)st.push(`blinds it (${o.blind}% miss)`);if(o.weak)st.push(`weakens it for ${o.weak} turn${o.weak>1?'s':''}`);if(o.root)st.push(`roots it for ${o.root} turns`);if(o.bleed)st.push(`makes it bleed for ${o.bleed} turns`);if(o.vuln)st.push(`breaks its armor (+${o.vuln}% damage taken for 2 turns)`);if(o.shock)st.push('shocks it (+10% damage taken)');if(o.sap)st.push(`lowers its attack by ${o.sap}`);
  if(st.length)bits.push(st.join(', '));
  if(o.bvs)bits.push(`+${o.bvs[1]}% damage if it is ${BVS_TXT[o.bvs[0]]}`);if(o.exec)bits.push(`+${o.exec}% damage below 30% HP`);
  const me=[];if(R.block)me.push(`block ${R.block}`);if(R.barrier)me.push(`raise a ${R.barrier}-point barrier for 3 turns${R.thorns?` that burns back with ${TYPENAME[R.thorns]}`:''}`);if(R.parry)me.push(`halve the next hit and riposte for ${R.parry.p}`);if(R.counter)me.push(`counter for ${R.counter.p} when hit`);if(R.dodge)me.push(R.dodge>=100?'dodge the next attack for sure':`gain ${R.dodge}% dodge`);if(R.heal)me.push(`heal ${R.heal}`);if(o.regen)me.push(`heal ${Math.round(o.regen*u)} a turn for 3 turns`);if(R.lifesteal)me.push(`drink ${Math.round(R.lifesteal*100)}% of the damage as HP`);if(o.mana)me.push(`restore ${o.mana} mana`);if(o.cleanse)me.push('cure poison and bleeding');
  if(me.length)bits.push('you '+me.join(', '));
  if(o.ride&&el)bits.push(`this turn, getting hit ${RIDE_TXT[el](o.ride)}`);
  return `${sp[1]}: ${bits.join('; ')}.`}}
function genPrep(key,o){return(R,E)=>{if(!E)return;let m=1;if(o.bvs){const c=o.bvs[0],has=c==='burn'?E.burn>0:c==='soak'?E.soak>0:c==='chill'?E.chill>0:c==='curse'?E.curse>0:c==='stun'?E.stun:c==='bleed'?E.bleed>0:c==='hurt'?E.hp<E.max*.5:false;if(has){m*=1+o.bvs[1]/100;R.gbon=1}}
  if(o.exec&&E.hp<=E.max*.3){m*=1+o.exec/100;R.gbon=1}if(o.purge&&E.block>0){R.breaker=true}if(m!==1)R.dmg.forEach(p=>p.p=Math.round(p.p*m))}}
function genApply(key,o){return(R,E,n)=>{const P=genParts(key),el=P.el,u=R.gu||2,ok=t=>t&&modOf(E,t)!==0,eAlive=E&&E.hp>0;
  if(o.purge&&E){E.block=0}
  if(o.aoe||o.splash){const others=(S.foes||[]).filter(F=>F!==E&&F.hp>0);if(others.length){const tot=R.dmg.reduce((s,p)=>s+p.p,0),d=Math.max(1,Math.round(tot*(o.aoe?1:o.splash/100)));others.forEach((F,i)=>sideHit(F,d,hexOf(el||R.dmg[0].t),o.aoe?'':'SPLASH',200+i*80,n));n.push(o.aoe?`hits every enemy for ${d}`:`splashes ${d} onto ${others.length} other${others.length>1?'s':''}`)}}
  if(eAlive){const t=el||'fire';
    if(o.burn&&ok('fire')){E.burn=Math.max(E.burn,o.burn);n.push(`<span class="w">set it burning</span>`)}
    if(o.soak&&ok('water')){E.soak=Math.max(E.soak,o.soak);n.push(`<span class="w">soaked it</span>`)}
    if(o.chill&&ok('ice')){E.chill=Math.min(2,(E.chill||0)+o.chill);n.push(`<span class="w">chilled it</span>`)}
    if(o.frz&&Math.random()*100<o.frz){if(canFreeze(E)){E.frozen=true;n.push('<span class="w">froze it solid</span>');Stage.float('enemy','FROZEN','#82d4ff','',420)}}
    if(o.stun&&!E.stun&&Math.random()*100<o.stun){E.stun=true;n.push('<span class="w">stunned it</span>');Stage.float('enemy','STUN','#f2d24b','',380)}
    if(o.curse&&ok('dark')){E.curse+=o.curse;n.push('<span class="w">cursed it</span>')}
    if(o.blind){E.blind=Math.max(E.blind||0,o.blind);n.push(`<span class="w">blinded it (${o.blind}% miss)</span>`)}
    if(o.weak){E.weak=Math.max(E.weak||0,o.weak);n.push('<span class="w">weakened it</span>')}
    if(o.root){E.root=Math.max(E.root||0,o.root);n.push('<span class="w">rooted it</span>')}
    if(o.bleed)bleed(E,n,o.bleed,1+Math.ceil(u/2));
    if(o.vuln)mark(E,n,o.vuln);
    if(o.shock){E.shocked=true;n.push('<span class="w">shocked it</span>')}
    if(o.sap){E.str-=o.sap;n.push(`<span class="w">attack −${o.sap}</span>`)}}
  if(o.regen){S.regen={amt:Math.round(o.regen*u),t:3};n.push(`<span class="w">regenerating ${S.regen.amt} a turn</span>`)}
  if(o.mana){const m=Math.min(o.mana,S.maxMana-S.mana);if(m>0){S.mana+=m;Stage.float('player',`+${m}`,'#6cb2ff','MANA',300)}}
  if(o.cleanse&&(S.poison||S.pbleed)){S.poison=null;S.pbleed=null;n.push('<span class="w">cured your ailments</span>')}
  if(o.ride&&el){S.rider={el,n:o.ride,u};n.push('<span class="w">your guard bites back</span>')}
  if(R.gbon)n.push('<span class="w">bonus damage!</span>')}}
function applyRider(E,delay){const r=S.rider;if(!r||!E||E.hp<=0)return;const m=t=>modOf(E,t)!==0;let tag='';
  if(r.el==='fire'&&m('fire')){E.burn=Math.max(E.burn,r.n);tag='BURN'}
  else if(r.el==='water'&&m('water')){E.soak=Math.max(E.soak,r.n);tag='SOAKED'}
  else if(r.el==='ice'&&m('ice')){E.chill=Math.min(2,(E.chill||0)+1);tag='CHILLED';if(Math.random()*100<r.n*15&&canFreeze(E)){E.frozen=true;tag='FROZEN'}}
  else if(r.el==='earth'){S.block+=r.n;Stage.float('player',`+${r.n}`,'#59c9c2','BLOCK',(delay||0)+200);if(!E.stun&&Math.random()<.15){E.stun=true;tag='STUN'}}
  else if(r.el==='wind'){S.dodge=Math.min(95,(S.dodge||0)+r.n*10);tag=''}
  else if(r.el==='lightning'&&m('lightning')&&!E.stun&&Math.random()*100<r.n){E.stun=true;tag='STUN'}
  else if(r.el==='dark'&&m('dark')){E.curse+=r.n;tag='CURSED'}
  else if(r.el==='light'){const h=Math.min(r.n,S.maxHp-S.hp);if(h>0){S.hp+=h;Stage.float('player',`+${h}`,'#ffd36b','HOLY',(delay||0)+200)}}
  if(tag)Stage.float('enemy',tag,hexOf(r.el),'',(delay||0)+260);Stage.defFx&&Stage.defFx('rider:'+r.el,delay)}
Object.entries(GEN_SPEC).forEach(([key,sp])=>{const o=parseGen(sp[2]);ESPELL[key]={gen:true,name:sp[0],flavor:sp[1],spec:o,build:genBuild(key,o),desc:genDesc(key,sp,o),prep:genPrep(key,o),apply:genApply(key,o)}});
