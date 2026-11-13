// ===== Element + Element signature spells (18 hand-made combos) =====
const sumP=R=>R.dmg.reduce((a,p)=>a+p.p,0);
function spellHitOthers(R,E,notes,after){(S.foes||[]).filter(F=>F!==E&&F.hp>0).forEach(F=>{let d=0;
  if(R.ticks){for(let q=0;q<R.ticks;q++)d+=tickDmg(F,R,q)}else R.dmg.forEach(p=>{d+=partDmg(F,p).d});
  R.dmg.forEach(p=>{if(!F.known.includes(p.t))F.known.push(p.t)});if(!R.breaker&&F.block>0){const ab=Math.min(F.block,d);F.block-=ab;d-=ab}
  F.hp-=d;const fn=ENEMIES[F.id].name;notes.push(`${R.name} hits ${fn} for ${d}`);
  Stage.withFoe(F.slot,()=>{Stage.float('enemy',d,hexOf(R.dmg[0].t),'',0);Stage.hitEnemy([R.dmg[0].t]);if(F.hp<=0){Stage.enemyDie();notes.push(`<span class="w">${fn} falls</span>`)}});
  if(F.hp>0&&after)after(F)})}
const allAlive=E=>[E,...(S.foes||[]).filter(F=>F!==E&&F.hp>0)].filter(F=>F.hp>0);
const ESPELL={
 'fire+fire':{name:'Solar Flare',build:(r,u)=>{r.dmg=[{t:'fire',p:8*u}]},
  desc:R=>`Summons a blazing sun in a ring of fire runes that crashes down for ${sumP(R)} Fire damage and sets it burning for 3 turns. If it is already burning, the flames erupt for 4 extra damage per burn turn left.`,
  apply:(R,E,n)=>{if(E.hp<=0||modOf(E,'fire')===0)return;if(E.burn>0){const x=E.burn*4;dealToEnemy(x,'fire','IGNITE',380);n.push(`<span class="w">the old flames erupt for ${x}</span>`)}E.burn=Math.max(E.burn,3);n.push('<span class="w">set it burning for 3 turns</span>')}},
 'water+water':{name:'Tidal Wave',build:(r,u)=>{r.dmg=[{t:'water',p:6*u}];r.breaker=true},
  desc:R=>`A towering wave crashes over every enemy for ${sumP(R)} Water damage each, washing away their shields, soaking them for 2 turns and lowering their attack by 2.`,
  apply:(R,E,n)=>{spellHitOthers(R,E,n);allAlive(E).forEach(F=>{F.block=0;if(modOf(F,'water')!==0){F.soak=Math.max(F.soak,2);F.str-=2}});n.push('<span class="w">shields washed away, attack −2</span>')}},
 'wind+wind':{name:'Cyclone',build:(r,u)=>{r.ticks=6;r.dmg=[{t:'wind',p:6*u}];r.dodgeAdd=25},
  desc:R=>`Spins up a cyclone that tears at it 6 times for ${Math.round(sumP(R)/6)} Wind damage each. The winds stay around you: +25% dodge chance.`},
 'dark+dark':{name:'Void Rift',build:(r,u)=>{r.dmg=[{t:'dark',p:7*u}];r.lifesteal=.5},
  desc:R=>`Tears open a rift that swallows ${sumP(R)} Dark damage from it, heals you for half the damage dealt, and curses it for 2 turns.`,
  apply:(R,E,n)=>{if(E.hp>0&&modOf(E,'dark')!==0){E.curse+=2;n.push('<span class="w">cursed it</span>')}}},
 'light+light':{name:'Judgment',build:(r,u)=>{r.dmg=[{t:'light',p:7*u}];r.heal=2*u},
  prep:(R,E)=>{if(E.curse>0){R.judged=true;R.dmg[0].p*=2}},
  desc:R=>`A holy pillar falls from a ring of golden runes for ${sumP(R)} Light damage${R.judged?' (doubled: it is cursed)':' (double against cursed enemies)'} and heals you ${R.heal} HP.`},
 'dark+earth':{name:'Grave Grasp',build:(r,u)=>{r.ticks=3;r.tickTypes=['dark','earth','dark'];r.dmg=[{t:'dark',p:6*u}]},
  desc:R=>`Bone hands burst from a cursed circle and crush it 3 times for ${Math.round(sumP(R)/3)} damage each, alternating Dark and Earth. It is rooted for 2 turns: it can't raise shields or heal.`,
  apply:(R,E,n)=>{if(E.hp>0){E.root=2;n.push('<span class="w">rooted it for 2 turns</span>')}}},
 'dark+fire':{name:'Hellfire',build:(r,u)=>{r.dmg=[{t:'fire',p:4*u},{t:'dark',p:2*u}]},
  desc:R=>`Raises a pillar of black hellfire for ${R.dmg[0].p} Fire and ${R.dmg[1].p} Dark damage. It burns for 3 turns with hellfire, which deals triple burn damage.`,
  apply:(R,E,n)=>{if(E.hp>0&&modOf(E,'fire')!==0){E.burn=Math.max(E.burn,3);E.hell=true;n.push('<span class="w">hellfire burns it for 3 turns</span>')}}},
 'dark+ice':{name:'Black Ice',build:(r,u)=>{r.dmg=[{t:'ice',p:7*u}]},
  desc:R=>`Dark ice spikes erupt beneath it for ${sumP(R)} Ice damage. It is weakened for 2 turns (deals 30% less damage) with a 30% chance to freeze.`,
  apply:(R,E,n)=>{if(E.hp<=0)return;E.weak=2;n.push('<span class="w">weakened it for 2 turns</span>');if(canFreeze(E)&&Math.random()<(S.iceAge>0?.6:.3)){E.frozen=true;n.push('<span class="w">froze it solid</span>')}}},
 'dark+lightning':{name:'Void Bolt',build:(r,u)=>{r.ticks=3;r.dmg=[{t:'lightning',p:8*u}]},
  desc:R=>`Three purple bolts fall from a void circle for ${Math.round(sumP(R)/3)} Lightning damage each. Each bolt steals 4 mana for you and leaves it shocked (+10% damage taken).`,
  apply:(R,E,n)=>{const g=Math.min(12,S.maxMana-S.mana);if(g>0){S.mana+=g;Stage.float('player',`+${g}`,'#6cb2ff','MANA',300)}if(E.hp>0&&modOf(E,'lightning')!==0)E.shocked=true;n.push(`<span class="w">stole ${g} mana</span>`)}},
 'dark+water':{name:'Abyssal Tide',build:(r,u)=>{r.ticks=4;r.dmg=[{t:'water',p:6*u}];r.lifesteal=.3},
  desc:R=>`Tentacles rise from a black pool and lash it 4 times for ${Math.round(sumP(R)/4)} Water damage each. You drink 30% of the damage as health, and it is soaked for 2 turns.`,
  apply:(R,E,n)=>{if(E.hp>0&&modOf(E,'water')!==0){E.soak=Math.max(E.soak,2);n.push('<span class="w">soaked it</span>')}}},
 'dark+wind':{name:'Shadow Gale',build:(r,u)=>{r.ticks=6;r.dmg=[{t:'dark',p:6*u}]},
  desc:R=>`A murder of shadow crows dives at it 6 times for ${Math.round(sumP(R)/6)} Dark damage each, blinding it (40% miss on its next attack) and cursing it for 1 turn.`,
  apply:(R,E,n)=>{if(E.hp<=0)return;E.blind=Math.max(E.blind||0,40);E.curse+=1;n.push('<span class="w">blinded it (40% miss)</span>')}},
 'earth+light':{name:'Sanctum Stone',build:(r,u)=>{r.kind='support';r.dmg=[];r.block=4*u;r.regen=u},
  desc:R=>`Raises a rune-carved monolith that blocks ${R.block} damage this turn and heals you ${R.regen} HP at the start of each of your next 3 turns.`,
  apply:(R,E,n)=>{S.regen={amt:R.regen,t:3};n.push(`<span class="w">regenerate ${R.regen} HP for 3 turns</span>`)}},
 'fire+ice':{name:'Thermal Shock',build:(r,u)=>{r.dmg=[{t:'fire',p:4*u},{t:'ice',p:4*u}]},
  prep:(R,E)=>{if(E.burn>0||E.chill>0||E.frozen){R.shatter=true;R.dmg.forEach(p=>p.p*=2)}},
  desc:R=>R.shatter?`Fire and ice collide on it for ${R.dmg[0].p} Fire and ${R.dmg[1].p} Ice damage. SHATTER: damage doubled because it is burning, chilled or frozen, and those effects are consumed.`:`Fire and ice orbs collide on it for ${R.dmg[0].p} Fire and ${R.dmg[1].p} Ice damage, leaving it chilled and burning. Cast it again on a burning, chilled or frozen enemy to SHATTER for double damage.`,
  apply:(R,E,n)=>{if(E.hp<=0)return;if(R.shatter){E.burn=0;E.chill=0;E.frozen=false;E.hell=false;n.push('<span class="w">SHATTER! double damage</span>')}else{if(modOf(E,'ice')!==0)E.chill=Math.min(2,E.chill+1);if(modOf(E,'fire')!==0)E.burn=Math.max(E.burn,1);n.push('<span class="w">chilled and burning</span>')}}},
 'fire+wind':{name:'Firestorm',build:(r,u)=>{r.ticks=5;r.dmg=[{t:'fire',p:5*u}]},
  desc:R=>`Flaming tornadoes sweep every enemy 5 times for ${Math.round(sumP(R)/5)} Fire damage each and set them all burning for 2 turns.`,
  apply:(R,E,n)=>{const set=F=>{if(modOf(F,'fire')!==0)F.burn=Math.max(F.burn,2)};spellHitOthers(R,E,n,set);if(E.hp>0)set(E);n.push('<span class="w">everything is burning</span>')}},
 'ice+light':{name:'Diamond Dust',build:(r,u)=>{r.dmg=[{t:'ice',p:4*u},{t:'light',p:2*u}];r.block=3*u},
  desc:R=>`Glittering diamond dust shreds it for ${R.dmg[0].p} Ice and ${R.dmg[1].p} Light damage with a 50% chance to freeze, and coats you in crystal armour that blocks ${R.block}.`,
  apply:(R,E,n)=>{if(E.hp>0&&canFreeze(E)&&Math.random()<(S.iceAge>0?.8:.5)){E.frozen=true;n.push('<span class="w">froze it solid</span>')}}},
 'ice+lightning':{name:'Shatter Bolt',build:(r,u)=>{r.dmg=[{t:'ice',p:4*u},{t:'lightning',p:4*u}]},
  prep:(R,E)=>{if(E.chill>0||E.frozen||E.soak>0){R.crit=true;R.boltCrit=true;R.dmg.forEach(p=>p.p*=2)}},
  desc:R=>R.boltCrit?`Hurls a lightning-charged ice lance for ${R.dmg[0].p} Ice and ${R.dmg[1].p} Lightning damage. CRITICAL: doubled and stuns, because it is chilled, frozen or soaked.`:`Hurls a lightning-charged ice lance for ${R.dmg[0].p} Ice and ${R.dmg[1].p} Lightning damage. Against a chilled, frozen or soaked enemy it crits for double and stuns.`,
  apply:(R,E,n)=>{if(R.boltCrit&&E.hp>0&&modOf(E,'lightning')!==0&&!E.frozen){E.stun=true;n.push('<span class="w">stunned it</span>')}}},
 'light+wind':{name:'Aurora',build:(r,u)=>{r.kind='support';r.dmg=[];r.heal=3*u;r.dodgeAdd=15},
  desc:R=>`Paints the sky with an aurora that heals you ${R.heal} HP, restores 10 mana and adds 15% to your dodge chance.`,
  apply:(R,E,n)=>{const g=Math.min(10,S.maxMana-S.mana);if(g>0){S.mana+=g;Stage.float('player',`+${g}`,'#6cb2ff','MANA',420)}}},
 'water+wind':{name:'Typhoon',build:(r,u)=>{r.ticks=4;r.dmg=[{t:'water',p:5*u}];r.breaker=true},
  desc:R=>`A roaring water vortex hits every enemy 4 times for ${Math.round(sumP(R)/4)} Water damage each, ignoring shields and soaking them all for 2 turns.`,
  apply:(R,E,n)=>{const set=F=>{F.block=0;if(modOf(F,'water')!==0)F.soak=Math.max(F.soak,2)};spellHitOthers(R,E,n,set);if(E.hp>0)set(E);n.push('<span class="w">everything is soaked</span>')}},
};
// ===== Arrow Shot + element: bow spells =====
Object.assign(ESPELL,{
 'arrowshot+fire':{name:'Phoenix Arrow',build:(r,u)=>{r.dmg=[{t:'fire',p:7*u}]},
  desc:R=>`Draws a blazing arrow that takes flight as a phoenix and explodes for ${sumP(R)} Fire damage, setting it burning for 3 turns. The blast splashes other enemies for half damage.`,
  apply:(R,E,n)=>{if(E.hp>0&&modOf(E,'fire')!==0)E.burn=Math.max(E.burn,3);const half={...R,name:'The blast',dmg:R.dmg.map(p=>({...p,p:Math.round(p.p/2)}))};spellHitOthers(half,E,n);n.push('<span class="w">set it burning for 3 turns</span>')}},
 'arrowshot+water':{name:'Tide Piercer',build:(r,u)=>{r.ticks=3;r.dmg=[{t:'water',p:6*u}];r.heal=u*2},
  desc:R=>`Floats up and fires a water arrow that splits into 3 tide arrows for ${Math.round(sumP(R)/3)} Water damage each, soaking it for 2 turns. The spray heals you ${R.heal} HP.`,
  apply:(R,E,n)=>{if(E.hp>0&&modOf(E,'water')!==0){E.soak=Math.max(E.soak,2);n.push('<span class="w">soaked it</span>')}}},
 'arrowshot+ice':{name:'Frost Comet',build:(r,u)=>{r.dmg=[{t:'ice',p:8*u}]},
  desc:R=>`Shoots a frost arrow into the sky that returns as a falling ice comet for ${sumP(R)} Ice damage, with a 40% chance to freeze it.`,
  apply:(R,E,n)=>{if(E.hp>0&&canFreeze(E)&&Math.random()<(S.iceAge>0?.7:.4)){E.frozen=true;n.push('<span class="w">froze it solid</span>')}}},
 'arrowshot+earth':{name:'Quake Arrow',build:(r,u)=>{r.dmg=[{t:'earth',p:7*u}];r.breaker=true;r.stunChance=30;r.stunType='earth'},
  desc:R=>`Fires an arrow into the ground that tears a line of stone spikes up to it for ${sumP(R)} Earth damage, smashing through its shield with a 30% chance to stun.`},
 'arrowshot+wind':{name:'Gale Barrage',build:(r,u)=>{r.ticks=5;r.dmg=[{t:'wind',p:6*u}];r.dodgeAdd=30},
  desc:R=>`Rides the wind into the air and fires a fan of 5 gale arrows for ${Math.round(sumP(R)/5)} Wind damage each. The tailwind gives you +30% dodge chance.`},
 'arrowshot+lightning':{name:'Thunder Rain',build:(r,u)=>{r.ticks=6;r.dmg=[{t:'lightning',p:7*u}];r.stunTick=15},
  desc:R=>`Fires a charged arrow skyward that bursts into 6 falling lightning arrows for ${Math.round(sumP(R)/6)} Lightning damage each, each with a 15% chance to stun.`},
 'arrowshot+dark':{name:'Soul Reaper Arrow',build:(r,u)=>{r.dmg=[{t:'dark',p:7*u}];r.breaker=true},
  desc:R=>`Looses a shadow arrow that tears straight through it for ${sumP(R)} Dark damage, ignoring shields. It is cursed for 2 turns and Marked: it takes 25% more damage for 2 turns.`,
  apply:(R,E,n)=>{if(E.hp<=0)return;if(modOf(E,'dark')!==0)E.curse+=2;E.vuln=Math.min(100,(E.vuln||0)+25);E.vulnT=Math.max(E.vulnT||0,2);n.push('<span class="w">marked it: +25% damage taken</span>')}},
 'arrowshot+light':{name:'Seraph Arrow',build:(r,u)=>{r.dmg=[{t:'light',p:7*u}];r.lifesteal=.5},
  desc:R=>`Spreads wings of light, rises and fires a radiant arrow for ${sumP(R)} Light damage. You heal for half the damage dealt.`},
});
// ===== Spear Throw + element: lance spells =====
Object.assign(ESPELL,{
 'spearthrow+fire':{name:'Dragonfire Lance',build:(r,u)=>{r.dmg=[{t:'fire',p:8*u}]},
  desc:R=>`Ignites the spear and hurls it as a roaring fire dragon for ${sumP(R)} Fire damage, setting it burning for 3 turns.`,
  apply:(R,E,n)=>{if(E.hp>0&&modOf(E,'fire')!==0){E.burn=Math.max(E.burn,3);n.push('<span class="w">set it burning for 3 turns</span>')}}},
 'spearthrow+water':{name:'Trident of the Deep',build:(r,u)=>{r.dmg=[{t:'water',p:7*u}];r.breaker=true},
  desc:R=>`Rises on a geyser and throws a trident that erupts a water spout beneath it for ${sumP(R)} Water damage, washing away its shield and soaking it for 2 turns.`,
  apply:(R,E,n)=>{if(E.hp<=0)return;E.block=0;if(modOf(E,'water')!==0)E.soak=Math.max(E.soak,2);n.push('<span class="w">soaked it</span>')}},
 'spearthrow+ice':{name:'Glacial Javelin',build:(r,u)=>{r.ticks=5;r.dmg=[{t:'ice',p:8*u}]},
  desc:R=>`Throws the spear skyward where it splits into 5 ice javelins that rain down for ${Math.round(sumP(R)/5)} Ice damage each, chilling it with a 30% chance to freeze.`,
  apply:(R,E,n)=>{if(E.hp<=0)return;if(modOf(E,'ice')!==0)E.chill=2;if(canFreeze(E)&&Math.random()<(S.iceAge>0?.6:.3)){E.frozen=true;n.push('<span class="w">froze it solid</span>')}else n.push('<span class="w">chilled it</span>')}},
 'spearthrow+earth':{name:'Titan Spear',build:(r,u)=>{r.dmg=[{t:'earth',p:9*u}];r.stunChance=40;r.stunType='earth';r.block=3*u},
  desc:R=>`Fuses orbiting boulders onto the spear and hurls a giant stone lance for ${sumP(R)} Earth damage with a 40% chance to stun. The leftover stone shields you for ${R.block}.`},
 'spearthrow+wind':{name:'Cyclone Javelin',build:(r,u)=>{r.dmg=[{t:'wind',p:6*u}];r.dodgeAdd=20;r.breaker=true},
  desc:R=>`Floats on the wind and launches a spinning drill javelin that pierces every enemy for ${sumP(R)} Wind damage each, ignoring shields. You gain +20% dodge chance.`,
  apply:(R,E,n)=>spellHitOthers(R,E,n)},
 'spearthrow+lightning':{name:'Thunder Spear',build:(r,u)=>{r.dmg=[{t:'lightning',p:9*u}];r.stunChance=40;r.stunType='lightning'},
  desc:R=>`Throws the spear into the storm clouds and it returns as a colossal lightning lance for ${sumP(R)} Lightning damage with a 40% chance to stun.`},
 'spearthrow+dark':{name:'Void Pike',build:(r,u)=>{r.ticks=3;r.dmg=[{t:'dark',p:7*u}];r.lifesteal=.3},
  desc:R=>`Hurls a shadow pike that pierces it 3 times, whipping back around after each pass, for ${Math.round(sumP(R)/3)} Dark damage each. You drain 30% of the damage as health.`},
 'spearthrow+light':{name:"Heaven's Lance",build:(r,u)=>{r.dmg=[{t:'light',p:8*u}];r.heal=2*u;r.blind=30},
  desc:R=>`Rises crowned by a halo and calls a lance of light down from the heavens for ${sumP(R)} Light damage. It heals you ${R.heal} HP and blinds the enemy (30% miss on its next attack).`},
});
// ===== Physical + Physical: martial-arts techniques =====
const PT=k=>CARDS[k].type;
const PHK=(a,b)=>[a,b].sort().join('+');
function physSpell(a,b,name,hits,mult,o){o=o||{};ESPELL[PHK(a,b)]={name,phys:true,
  build:(r,u)=>{const ts=hits.map(PT);r.ticks=hits.length;r.tickTypes=hits.length>1?ts:null;r.dmg=[{t:ts[ts.length-1],p:Math.round(mult*u)}];if(o.w)r.tickW=o.w;r.breaker=!!o.breaker;r.kind='melee';r.phys=[a,b];r.block=o.block?Math.round(o.block*u):0;if(o.dodge)r.dodgeAdd=o.dodge;if(o.stun){r.stunChance=o.stun;r.stunType=ts[ts.length-1]}if(o.ls)r.lifesteal=o.ls;if(o.build)o.build(r,u);if(r.ticks===1){r.ticks=0;r.tickTypes=null}},
  desc:R=>{const n=hits.length,tot=sumP(R);return o.d(R,n>1?`${n} hits for ${tot} total damage`:`${tot} damage`,tot)},
  apply:o.apply}}
const bleed=(E,n,t,p)=>{if(E.hp<=0)return;E.bleed=Math.max(E.bleed||0,t);E.bleedP=Math.max(E.bleedP||0,p);n.push(`<span class="w">it bleeds for ${p} a turn for ${t} turns</span>`)};
const mark=(E,n,v)=>{if(E.hp<=0)return;E.vuln=Math.min(100,(E.vuln||0)+v);E.vulnT=Math.max(E.vulnT||0,2);n.push(`<span class="w">armor broken: +${v}% damage taken</span>`)};
const RP=(k,n)=>Array(n).fill(k);
physSpell('slash','slash','Omnislash',RP('slash',7),7,{w:[1,1,1,1,1,1,3],d:(R,h)=>`Blinks around the enemy in a storm of afterimages, slashing from every angle, then ends with a giant X-cut: ${h}. It bleeds for 2 turns.`,apply:(R,E,n)=>bleed(E,n,2,3),build:(r,u)=>{if(u<3)r.name='Twin Fang'}});
physSpell('stab','stab','Thousand Needles',RP('stab',10),6,{w:[1,1,1,1,1,1,1,1,1,3],d:(R,h)=>`Stabs at blinding speed, leaving a wall of afterimage blades: ${h}. Its armor is punctured: +20% damage taken for 2 turns.`,apply:(R,E,n)=>mark(E,n,20)});
physSpell('kick','kick','Hurricane Kick',RP('kick',7),7,{w:[1,1,1,1,1,1,3],dodge:25,d:(R,h)=>`Leaps into a spinning whirlwind of kicks and finishes with a crashing axe kick: ${h}. You gain +25% dodge chance.`});
physSpell('shieldbash','shieldbash','Bulwark Charge',RP('shieldbash',3),6,{w:[1,1,2],stun:50,block:3,breaker:true,d:(R,h)=>`Charges like a battering ram behind your shield, slamming three times: ${h}, smashing its guard with a 50% chance to stun. You keep ${R.block} block.`});
physSpell('shieldthrow','shieldthrow','Ricochet Storm',RP('shieldthrow',5),6,{breaker:true,d:(R,h)=>`Hurls your shield so it ricochets off the ground, sky and enemy 5 times: ${h}, ignoring shields.`});
physSpell('arrowshot','arrowshot','Arrow Storm',RP('arrowshot',12),7,{d:(R,h)=>`Backflips into the air and looses a rain of 12 arrows: ${h}.`});
physSpell('spearthrow','spearthrow','Skyfall Spears',RP('spearthrow',4),8,{w:[1,1,1,3],breaker:true,d:(R,h)=>`Leaps high, throws two spears down and dives with the last one: ${h}, ignoring shields.`});
physSpell('slash','stab','Iaido Flash',['stab','slash'],9,{w:[1,3],d:(R,h)=>`Stands perfectly still, then blinks through the enemy in a single drawn strike. A heartbeat later the cuts appear: ${h}. It bleeds for 3 turns.`,apply:(R,E,n)=>bleed(E,n,3,4)});
physSpell('kick','slash','Crescent Moon',['kick','slash','kick','slash'],7,{w:[1,1,1,2],d:(R,h)=>`Flip-kicks into a spinning crescent-moon slash: ${h}. It bleeds for 2 turns.`,apply:(R,E,n)=>bleed(E,n,2,2)});
physSpell('punch','slash','Blade Fist',['punch','slash','punch','slash','punch','slash'],7,{w:[1,1,1,1,1,2],d:(R,h)=>`Alternates lightning-fast punches and blade cuts: ${h}.`});
physSpell('kick','stab','Viper Lunge',['kick','stab'],7,{w:[1,2],stun:30,d:(R,h)=>`Sweeps low with a kick, then lunges up like a striking viper: ${h} with a 30% chance to stun.`});
physSpell('punch','stab','Pressure Point',RP('stab',5).concat(['punch']),7,{w:[1,1,1,1,1,3],stun:45,d:(R,h)=>`Strikes 5 glowing pressure points, then detonates them with a palm strike: ${h}, a 45% chance to stun and +20% damage taken for 2 turns.`,apply:(R,E,n)=>mark(E,n,20)});
physSpell('kick','punch','Dragon Rush',['punch','punch','kick','punch','kick'],8,{w:[1,1,1,1,3],d:(R,h)=>`Blinks between a punch-punch-kick combo, an uppercut and a flying dragon kick: ${h}. The rush restores 10 mana.`,apply:(R,E,n)=>{const g=Math.min(10,S.maxMana-S.mana);if(g>0){S.mana+=g;Stage.float('player',`+${g}`,'#6cb2ff','MANA',300)}}});
physSpell('shieldbash','slash','Shield Breaker',['shieldbash','slash'],7,{w:[1,2],breaker:true,d:(R,h)=>`Bashes its guard aside, then follows with a rising slash: ${h}. Its shield shatters and it takes +25% damage for 2 turns.`,apply:(R,E,n)=>{E.block=0;mark(E,n,25)}});
physSpell('shieldbash','stab','Phalanx Thrust',['stab','stab','stab','shieldbash'],6,{w:[1,1,1,2],block:4,d:(R,h)=>`Advances behind your shield, stabbing out from cover: ${h}. You keep ${R.block} block.`});
physSpell('kick','shieldbash','Shield Surf',['shieldbash','kick','kick'],7,{w:[2,1,1],dodge:20,d:(R,h)=>`Rides your shield across the ground into the enemy and kicks off it twice: ${h}. You gain +20% dodge chance.`});
physSpell('punch','shieldbash','Titan Smash',['shieldbash'],9,{stun:30,d:(R,h)=>`Leaps and slams your shield down with both fists, sending a shockwave through every enemy: ${h} each with a 30% chance to stun.`,apply:(R,E,n)=>spellHitOthers(R,E,n)});
physSpell('shieldthrow','slash','Boomerang Edge',['shieldthrow','slash','slash','shieldthrow'],7,{w:[1,1,1,1],d:(R,h)=>`Throws your shield, dashes in with two slashes and catches it on the way back: ${h}.`});
physSpell('shieldthrow','stab','Pin Down',['shieldthrow','stab'],7,{w:[1,2],d:(R,h)=>`Staggers it with a thrown shield and pins it with a stab: ${h}. It is rooted for 2 turns: it can't raise shields or heal.`,apply:(R,E,n)=>{if(E.hp>0){E.root=2;n.push('<span class="w">pinned it in place for 2 turns</span>')}}});
physSpell('kick','shieldthrow','Volley Kick',RP('shieldthrow',4),7,{d:(R,h)=>`Kicks your shield like a ball, bouncing it off the enemy 4 times: ${h}.`});
physSpell('punch','shieldthrow','Comet Disc',['punch','shieldthrow','shieldthrow','shieldthrow'],7,{breaker:true,d:(R,h)=>`Punches your shield into a sparking comet that grinds through it: ${h}, ignoring shields.`});
physSpell('shieldbash','shieldthrow','Aegis Rebound',['shieldthrow','shieldbash'],6,{block:5,d:(R,h)=>`Throws your shield, catches the rebound and slams it home: ${h}. You keep ${R.block} block and counter the next hit.`,build:(r,u)=>{r.counter={p:3*u,t:'blunt'}}});
physSpell('arrowshot','slash','Arrow Dance',['slash','arrowshot','arrowshot','arrowshot'],7,{d:(R,h)=>`Slashes, backflips away and fires three arrows mid-flip: ${h}. You gain +20% dodge chance.`,dodge:20});
physSpell('arrowshot','punch','Point-Blank Burst',['punch','arrowshot'],8,{w:[1,2],stun:30,d:(R,h)=>`Staggers it with a punch and fires an arrow at point-blank range: ${h} with a 30% chance to stun.`});
physSpell('arrowshot','stab','Piercing Volley',['stab','arrowshot','arrowshot','arrowshot'],7,{d:(R,h)=>`Dashes through it with a stab, spins and fires three piercing arrows into its back: ${h}. +15% damage taken for 2 turns.`,apply:(R,E,n)=>mark(E,n,15)});
physSpell('arrowshot','shieldbash','Fortress Archer',RP('arrowshot',6),6,{block:4,d:(R,h)=>`Plants your shield as a wall and fires from behind it: ${h}. You keep ${R.block} block.`});
physSpell('arrowshot','shieldthrow','Ricochet Shot',['shieldthrow','arrowshot','arrowshot','arrowshot','arrowshot'],7,{d:(R,h)=>`Throws your shield into the air and shoots it, splitting the arrow into a spray of ricochets: ${h}.`});
physSpell('arrowshot','spearthrow','Ballista',['spearthrow'],10,{breaker:true,d:(R,h)=>`Braces your spear on your bow and fires it like a ballista bolt: ${h}, ignoring shields.`});
physSpell('slash','spearthrow','Dragoon Dive',['spearthrow','slash'],8,{w:[2,1],dodge:30,d:(R,h)=>`Leaps out of sight and dives down spear-first, then finishes with a slash: ${h}. While airborne you are hard to hit: +30% dodge chance.`});
physSpell('spearthrow','stab','Lance Barrage',RP('stab',6).concat(['spearthrow']),7,{w:[1,1,1,1,1,1,3],d:(R,h)=>`Spins your spear into a barrage of thrusts and throws it to finish: ${h}. +15% damage taken for 2 turns.`,apply:(R,E,n)=>mark(E,n,15)});
physSpell('kick','spearthrow','Pole Vault Strike',['kick','spearthrow'],8,{w:[2,1],stun:30,d:(R,h)=>`Vaults high on your spear and comes down with a flying kick: ${h} with a 30% chance to stun.`});
physSpell('punch','spearthrow','Spear Rush',['punch','spearthrow','spearthrow','spearthrow'],7,{d:(R,h)=>`Drives the spear butt into it with a punch and rushes forward with three thrusts: ${h}.`});
physSpell('shieldbash','spearthrow','Hoplite Charge',['spearthrow','shieldbash','spearthrow'],7,{block:3,d:(R,h)=>`Charges with spear and shield together: ${h}. You keep ${R.block} block.`});
physSpell('shieldthrow','spearthrow','Twin Projectiles',['shieldthrow','spearthrow'],8,{breaker:true,d:(R,h)=>`Throws your shield and spear at once so they cross on the enemy: ${h}, ignoring shields.`});
