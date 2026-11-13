/* ================= icons ================= */
const ICONS={
  slash:'<path d="M4 18C10 16 16 10 18 4"/><path d="M8 21C14 19 19 13 21 7" opacity=".55"/>',
  stab:'<path d="M3 21L19 5"/><path d="M13 4h7v7"/>',
  kick:'<path d="M8 3v9l-4 4v4h14l2-3-7-3-2-3V3z"/>',
  punch:'<path d="M6 11V8a2 2 0 014 0v2M10 10V6.5a2 2 0 014 0V10M14 10V8a2 2 0 014 0v5a7 7 0 01-7 7h-1a4 4 0 01-4-4v-5z"/>',
  shieldbash:'<path d="M13 4l7 2.5v5c0 4-3 6.5-7 7.5-4-1-7-3.5-7-7.5v-5z"/><path d="M2 9h3M2 13h3M3 17h3"/>',
  shieldthrow:'<circle cx="14" cy="12" r="6"/><circle cx="14" cy="12" r="2"/><path d="M2 9h5M2 15h5M3 12h4"/>',
  arrowshot:'<path d="M4 20L20 4"/><path d="M14 4h6v6"/><path d="M4 20l1.5-4.5M4 20l4.5-1.5"/>',
  spearthrow:'<path d="M3 21L16 8"/><path d="M14 4l6 6-4.5 1L13 8.5z"/>',
  fire:'<path d="M12 3c1 4 6 6 6 11a6 6 0 01-12 0c0-3 2-4 2-7 2 1 3 3 3 5 1-2 1-6 1-9z"/>',
  water:'<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 01-13 0C5.5 10 12 3 12 3z"/><path d="M9 15a3 3 0 003 3" opacity=".6"/>',
  ice:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/>',
  earth:'<path d="M2 20L9 8l4 6 3-4 6 10z"/>',
  wind:'<path d="M3 8h11a3 3 0 10-3-3"/><path d="M3 12h15a3 3 0 11-3 3"/><path d="M3 16h7"/>',
  lightning:'<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
  dark:'<path d="M15 3a9 9 0 100 18 7 7 0 010-18z"/>',
  light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  block:'<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 12h18M9 5v7M15 12v7"/>',
  shield:'<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>',
  parry:'<path d="M4 4l12 12M20 4L8 16"/><path d="M14 18l4 4M10 18l-4 4M16 16l2-2M8 16l-2-2"/>',
  dodge:'<circle cx="15" cy="4.5" r="2"/><path d="M14 8l-3 4 3 2-1 7M14 8l4 3 2-1M2 10h5M1 14h6M3 18h5"/>',
  counter:'<path d="M5 9h10a4 4 0 010 8H9"/><path d="M9 5L5 9l4 4"/>',
  heal:'<path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z"/><path d="M12 9v6M9 12h6"/>',
  atk:'<path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6M16 16l4 4M19 21l2-2"/>',
  ult:'<path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z"/>',
  multi:'<path d="M5 19L13 5M9 21L17 7M13 22L21 9"/>',
  drain:'<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/><path d="M9 13l3 3 3-3"/>',
  buff:'<path d="M12 20V4M5 11l7-7 7 7"/>',
  crown:'<path d="M3 19h18M4 19l-1.5-11 5.5 4 4-7 4 7 5.5-4L20 19"/>',
  chest:'<rect x="3" y="9" width="18" height="11" rx="1"/><path d="M3 9a9 5 0 0118 0M3 13h18M12 12v3"/>',
  camp:'<path d="M12 3c1 3 5 5 5 9a5 5 0 01-10 0c0-2 1.5-3 1.5-5 1.5 1 2.5 2 2.5 4 .5-2 1-5 1-8z"/><path d="M4 21l16-3M4 18l16 3"/>',
  anvil:'<path d="M3 7h13a5 5 0 005 5h-5l-1 3h2l1 4H7l1-4h2l-1-3c-3 0-6-2-6-5z"/>',
  leave:'<path d="M5 12h13M13 6l6 6-6 6"/><path d="M4 5v14" opacity=".5"/>',
  potion:'<path d="M9 3h6M10 3v5L5.5 16A3.5 3.5 0 008.6 21h6.8a3.5 3.5 0 003.1-5L14 8V3"/><path d="M7.5 14h9"/>',
  trade:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  pray:'<path d="M12 3v6M9 6h6"/><path d="M6 21v-6l6-4 6 4v6"/><path d="M10 21v-4h4v4"/>',
  event:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 114.5 1.5c-.8 1-2 1.5-2 3M12 17h.01"/>'
};
const icon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]||''}</svg>`;
const INTENT_D={atk:['M14.5 17.5L3 6V3h3l11.5 11.5','M13 19l6-6M16 16l4 4M19 21l2-2'],stab:['M3 21L19 5','M13 4h7v7'],ult:['M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z'],
  multi:['M5 19L13 5M9 21L17 7M13 22L21 9'],drain:['M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z'],shield:['M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z'],buff:['M12 20V4M5 11l7-7 7 7'],
  heal:['M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z'],stun:['M12 2l2 5 5 .5-4 3.5 1.5 5L12 13l-4.5 3 1.5-5-4-3.5 5-.5z']};

/* ================= cards ================= */
const ELEMS=['fire','water','ice','earth','wind','lightning','dark','light'];
const COLOR={slash:'phys',stab:'phys',kick:'phys',punch:'phys',shieldbash:'phys',shieldthrow:'phys',arrowshot:'phys',spearthrow:'phys',pierce:'phys',blunt:'phys',
  fire:'fire',water:'water',ice:'ice',earth:'earth',wind:'wind',lightning:'lightning',dark:'dark',light:'light',
  block:'guard',shield:'guard',parry:'guard',dodge:'guard',counter:'guard',heal:'mend'};
const HEX={phys:'#e6e9f0',fire:'#ff7b3a',water:'#4aa8ff',ice:'#82d4ff',earth:'#c09461',wind:'#bff5d8',lightning:'#f2d24b',dark:'#b18bff',light:'#fff0b3',guard:'#59c9c2',mend:'#7fe08a'};
const hexOf=t=>HEX[COLOR[t]]||'#ffffff';
const typeColor=t=>`var(--${COLOR[t]||'phys'})`;
const CARDS={
  slash:{name:'Slash',cat:'phys',type:'slash',pow:5,desc:'One sword slash per level.'},
  stab:{name:'Stab',cat:'phys',type:'pierce',pow:5,desc:'A piercing thrust.'},
  kick:{name:'Kick',cat:'phys',type:'blunt',pow:6,desc:'A heavy, crushing kick.'},
  punch:{name:'Punch',cat:'phys',type:'blunt',pow:5,desc:'A quick, blunt strike.'},
  shieldbash:{name:'Shield Bash',cat:'phys',type:'blunt',pow:6,block:4,desc:'Strike and gain 4 block.',item:true},
  shieldthrow:{name:'Shield Throw',cat:'phys',type:'blunt',pow:8,breaker:true,ranged:'disc',desc:'Ranged hit that ignores block.',item:true},
  arrowshot:{name:'Arrow Shot',cat:'phys',type:'pierce',pow:7,ranged:'arrow',desc:'A ranged piercing shot.',item:true},
  spearthrow:{name:'Spear Throw',cat:'phys',type:'pierce',pow:9,ranged:'spear',desc:'A heavy ranged throw.',item:true},
  fire:{name:'Fire',cat:'elem',pow:4,desc:'Burns for 2 turns.'},
  water:{name:'Water',cat:'elem',pow:4,desc:'Soaks: Lightning and Ice hit harder.'},
  ice:{name:'Ice',cat:'elem',pow:4,desc:'Chills its next attack.'},
  earth:{name:'Earth',cat:'elem',pow:4,desc:'Grants you 4 block.'},
  wind:{name:'Wind',cat:'elem',pow:4,desc:'Gust: 30% dodge next attack.'},
  lightning:{name:'Lightning',cat:'elem',pow:4,desc:'35% chance to stun.'},
  dark:{name:'Dark',cat:'elem',pow:4,desc:'Curses: takes 30% more.'},
  light:{name:'Light',cat:'elem',pow:4,desc:'Heals you 3.'},
  block:{name:'Block',cat:'def',pow:6,desc:'Absorbs damage this turn.'},
  shield:{name:'Shield',cat:'def',pow:5,desc:'Barrier that lasts 3 turns.'},
  parry:{name:'Parry',cat:'def',pow:4,desc:'Halve the next hit, strike back.'},
  dodge:{name:'Dodge',cat:'def',pow:50,desc:'Chance to evade the next attack.'},
  counter:{name:'Counter',cat:'def',pow:6,desc:'Hit back when struck.'},
  heal:{name:'Heal',cat:'sup',pow:6,desc:'Restore HP.'}
};
const ALL_KEYS=Object.keys(CARDS),ACQ_KEYS=ALL_KEYS.filter(k=>!CARDS[k].item);
const CATLABEL={phys:'Physical',elem:'Element',def:'Defense',sup:'Support'};
const CO={phys:0,elem:1,def:2,sup:3};
const TYPENAME={slash:'Slash',pierce:'Pierce',blunt:'Blunt',fire:'Fire',water:'Water',ice:'Ice',earth:'Earth',wind:'Wind',lightning:'Lightning',dark:'Dark',light:'Light'};
const ADJ={fire:'Fire',water:'Aqua',ice:'Frost',earth:'Stone',wind:'Gale',lightning:'Thunder',dark:'Shadow',light:'Holy'};
const NOUN={slash:'Slash',stab:'Stab',kick:'Kick',punch:'Punch',shieldbash:'Bash',shieldthrow:'Disc',arrowshot:'Arrow',spearthrow:'Javelin'};
const SAMEN={slash:'Double Slash',stab:'Double Stab',kick:'Double Kick',punch:'Flurry Punch',shieldbash:'Shield Crush',shieldthrow:'Twin Discs',arrowshot:'Volley',spearthrow:'Twin Javelins',
  fire:'Double Fireball',water:'Water Burst',ice:'Blizzard',earth:'Landslide',wind:'Tornado',lightning:'Thunderstorm',dark:'Abyss',light:'Radiance',
  block:'Iron Wall',shield:'Fortress',parry:'Flawless Guard',dodge:'Afterimage',counter:'Vengeance',heal:'Rejuvenate'};
const SHIELDN={slash:'Shield Slash',stab:'Phalanx Thrust',kick:'Shield Kick',punch:'Shield Punch'};
const HEALN={fire:'Cauterize',water:'Healing Rain',ice:'Frost Balm',earth:'Regrowth',wind:'Breath of Wind',lightning:'Jolt',dark:'Life Drain',light:'Holy Light'};
const PAIRN={
  'fire+water':'Steam','earth+fire':'Lava Shield','fire+ice':'Thermal Shock','fire+wind':'Firestorm','fire+lightning':'Laser Beam','dark+fire':'Hellfire','fire+light':'Laser Beam',
  'ice+water':'Freeze','earth+water':'Mudslide','water+wind':'Typhoon','lightning+water':'Electrocute','dark+water':'Abyssal Tide','light+water':'Holy Rain',
  'earth+ice':'Permafrost','ice+wind':'Blizzard','ice+lightning':'Shatter Bolt','dark+ice':'Black Ice','ice+light':'Diamond Dust',
  'earth+wind':'Sandstorm','earth+lightning':'Fulgurite','dark+earth':'Grave Quake','earth+light':'Sanctum Stone',
  'lightning+wind':'Thunderstorm','dark+wind':'Shadow Gale','light+wind':'Aurora','dark+lightning':'Void Bolt','light+lightning':'Laser Beam','dark+light':'Eclipse',
  'slash+stab':'Cross Strike','kick+slash':'Blade Spin','punch+slash':'Pommel Rush','kick+stab':'Lunge Kick','punch+stab':'Piercing Jab','kick+punch':'Combo Rush',
  'arrowshot+stab':'Pinning Shot','shieldbash+slash':'Shield Rush','kick+shieldbash':'Crushing Bash','spearthrow+stab':'Impaler','arrowshot+spearthrow':'Rain of Steel',
  'block+counter':'Spiked Guard','block+dodge':'Evasive Guard','block+parry':'Deflect','block+shield':'Bulwark','counter+dodge':'Shadow Counter','counter+parry':'Perfect Counter',
  'counter+shield':'Thorn Shield','dodge+parry':'Feint','dodge+shield':'Phantom Guard','parry+shield':'Mirror Shield',
  'block+heal':'Second Wind','counter+heal':'Patient Strike','dodge+heal':'Evasive Recovery','parry+heal':'Calm Mind','shield+heal':'Sanctuary'};
const TOTAL_RECIPES=ALL_KEYS.length*(ALL_KEYS.length+1)/2;
const FXTEXT={fire:'Burn: 3 damage at the start of its turn, 2 turns',water:'Soak: takes 50% more Lightning and Ice damage, 2 turns',ice:'Chill: its next attack deals 40% less',
  earth:'You gain 4 block',wind:'Gust: 30% chance to dodge its next attack',lightning:'35% chance to stun (it skips a turn)',dark:'Curse: takes 30% more from your next 2 attacks',light:'You heal 3'};
const DEFTEXT={block:'Block absorbs damage until your next turn.',shield:'Barrier absorbs damage for 3 turns.',parry:'Parry halves the next hit and strikes back.',
  dodge:'Dodge gives a chance to avoid the next attack.',counter:'Counter strikes back when you are attacked.',heal:'Heal restores HP.'};

/* ================= enemies & levels ================= */
const ENEMIES={
  thornling:{name:'Toadstool',hp:22,tint:null,lore:'A red-capped wanderer. Its dry stem snaps easily.',mods:{fire:2,slash:2,earth:.5,blunt:.5},pattern:[['atk',4],['atk',5],['def',4]]},
  slime:{name:'Bog Cap',hp:26,tint:{h:105,s:.85,l:-.03},lore:'Soaked through and slick. Blades slide right off.',mods:{lightning:2,fire:1.5,slash:.5,pierce:.5,water:.5},pattern:[['atk',5],['drain',4],['stab',6]]},
  wolf:{name:'Ember Cap',hp:30,tint:{h:28,s:1,l:.04},lore:'Grew in the ashes of a burned grove. Still warm.',mods:{ice:2,water:2,fire:.5,dark:.5},pattern:[['atk',5],['multi',3,2],['heavy',9]]},
  knight:{name:'Rust Cap',hp:40,tint:{h:18,s:.5,l:-.13},lore:'Its cap has hardened like old iron. The stem is corroded.',mods:{lightning:2,blunt:2,water:1.5,slash:.5,pierce:.5},pattern:[['def',8],['stab',7],['heavy',12],['atk',6]]},
  wraith:{name:'Frost Cap',hp:38,tint:{h:195,s:.75,l:.1},stem:{h:200,s:.35,l:.02},lore:'Cold to the touch. Steel glances off its frozen skin.',mods:{fire:2,light:2,ice:0,slash:.5,pierce:.5,blunt:.5},pattern:[['atk',6],['drain',5],['buff',2],['heavy',11]]},
  golem:{name:'Stone Cap',hp:56,scale:1.3,tint:{h:30,s:.1,l:-.02},stem:{h:35,s:.25,l:-.12},lore:'Old, heavy, and half fossilized. Groundwater still runs through it.',mods:{ice:2,water:2,pierce:1.5,fire:.5,slash:.5,lightning:0},pattern:[['def',10],['heavy',14],['atk',7],['stab',7]]},
  harpy:{name:'Storm Cap',hp:46,tint:{h:52,s:1,l:.05},lore:'Its spores crackle with static. Hates solid ground.',mods:{earth:2,pierce:2,lightning:0,wind:.5,ice:.5},pattern:[['multi',3,3],['stab',8],['buff',2],['multi',4,3]]},
  priest:{name:'Grave Cap',hp:52,tint:{h:275,s:.7,l:-.1},stem:{h:270,s:.25,l:-.12},lore:'Sprouts only where something has died. Feeds on darkness.',mods:{light:2,fire:1.5,dark:0,ice:.5},pattern:[['drain',7],['def',8],['heal',10],['heavy',15]]},
  orc:{name:'Orc Grunt',fam:'orc',hp:28,scale:1.1,lore:'A green-skinned raider with a chipped axe. Thick hide shrugs off blunt blows.',mods:{fire:1.5,pierce:2,blunt:.5,earth:.5},pattern:[['atk',5],['heavy',9],['atk',6]]},
  deserter:{name:'Deserter',fam:'soldier',hp:32,scale:1.1,lore:'A soldier who fled the war and now robs travellers. His armor turns blades.',mods:{lightning:2,blunt:1.5,dark:1.5,slash:.5,pierce:.5},pattern:[['stab',6],['def',5],['multi',2,4],['atk',6]]},
  orcbrute:{name:'Orc Brute',fam:'orc',hp:44,scale:1.2,hue:{a:55,b:150,h:8,s:.9,l:-.04},lore:'A blood-red orc twice the size of its kin. Cold slows it down.',mods:{ice:2,pierce:1.5,fire:.5,blunt:.5},pattern:[['def',6],['heavy',12],['atk',7],['buff',2]]},
  floatcap:{name:'Floatcap',fam:'flyer',hp:26,lore:'A spore pod that learned to fly. It drops on prey from above. Hard to hit with blunt blows mid-air.',mods:{wind:2,pierce:1.5,fire:1.5,blunt:.5,earth:0},pattern:[['atk',5],['multi',2,3],['heavy',9]]},
  gloomcap:{name:'Gloomcap',fam:'flyer',hp:48,hue:{a:0,b:40,h:268,s:.75,l:-.06},lore:'A floater from the deep hollow, its cap gone violet with rot. Light sears it.',mods:{light:2,wind:1.5,dark:0,earth:0,blunt:.5},pattern:[['drain',7],['multi',3,3],['heavy',14]]},
  seeker:{name:'Void Seeker',fam:'seeker',hp:34,scale:1.1,lore:'A hooded hunter that steps out of the dark between embers. Fast blade, thin cloak.',mods:{light:2,blunt:1.5,dark:0,pierce:.5},pattern:[['multi',3,2],['stab',8],['atk',7]]},
  nightseeker:{name:'Night Seeker',fam:'seeker',hp:50,scale:1.2,hue:{a:240,b:320,h:150,s:1,l:0},lore:'A seeker whose cloak glows a poisonous green. It strikes before you see it.',mods:{light:2,fire:1.5,dark:0,slash:.5},pattern:[['multi',3,3],['buff',2],['stab',11],['multi',4,3]]},
  magmagolem:{name:'Magma Golem',fam:'golemo',hp:52,scale:1.15,lore:'Basalt bound together by flowing magma. Water cracks its crust.',mods:{water:2,ice:1.5,blunt:1.5,fire:0,slash:.5,pierce:.5},pattern:[['def',10],['heavy',13],['atk',7]]},
  runegolem:{name:'Rune Golem',fam:'golemb',hp:68,scale:1.2,lore:'Cold stone carved with blue wards. Lightning shorts out its runes.',mods:{lightning:2,blunt:1.5,earth:2,ice:0,water:.5,slash:.5,pierce:.5},pattern:[['def',12],['heavy',16],['atk',9],['buff',2]]},
  bloodfiend:{name:'Blood Fiend',fam:'blood',hp:30,lore:'A clot of boiling blood that crawled out of a lava vent.',mods:{water:2,ice:1.5,fire:0,dark:.5},pattern:[['atk',6],['drain',5],['atk',7]]},
  magmafiend:{name:'Magma Fiend',fam:'blood',hp:34,tint:{h:24,s:1.15,l:.07},lore:'Molten and restless. It cools only when soaked.',mods:{water:2,ice:2,fire:0,earth:.5},pattern:[['atk',6],['multi',3,3],['heavy',12]]},
  ashdemon:{name:'Ash Demon',fam:'demon',hp:40,tint:{h:8,s:.25,l:-.04},lore:'A demon wrapped in cinders and old soot. Light burns it.',mods:{light:2,water:1.5,dark:0,fire:.5},pattern:[['stab',8],['def',8],['atk',7],['heavy',13]]},
  emberdemon:{name:'Ember Demon',fam:'demon',hp:44,tint:{h:30,s:1.2,l:.06},lore:'Its blade glows like a forge. Frost makes it falter.',mods:{ice:2,water:1.5,fire:0,slash:.5},pattern:[['multi',3,3],['buff',2],['stab',9],['heavy',14]]},
  infernolord:{abil:['ward'],name:'Inferno Lord',fam:'demon',hp:120,boss:true,scale:1.5,tint:{h:352,s:1.25,l:-.06},lore:'Master of the burning rift. Enrages below half health.',mods:{water:2,ice:1.5,fire:0,dark:.5,earth:.5},pattern:[['atk',10],['multi',4,3],['def',12],['heavy',18]]},
  elder:{abil:['regen'],name:'Elder Toadstool',hp:72,boss:true,scale:1.7,tint:{h:350,s:1,l:-.06},lore:'The first mushroom of the woods, grown huge and mean. Enrages below half health.',mods:{fire:2,slash:1.5,earth:.5,blunt:.5},pattern:[['atk',7],['def',8],['multi',3,3],['heavy',14]]},
  stormking:{name:'Storm Sovereign',hp:110,boss:true,scale:1.75,tint:{h:48,s:1.1,l:.02},stem:{h:220,s:.3,l:-.1},lore:'Lightning gathers in its gills. Enrages below half health.',mods:{earth:2,pierce:2,lightning:0,wind:.5,ice:.5},pattern:[['multi',4,3],['stab',11],['buff',3],['heavy',17]]},
  toxicap:{name:'Toxicap',hp:44,tint:{h:92,s:1.2,l:-.04},stem:{h:285,s:.45,l:-.1},lore:'Its gills drip a sticky green venom. Burns well.',mods:{fire:2,slash:1.5,dark:.5,water:.5},pattern:[['poison',6,3],['atk',9],['def',9]]},
  poisonslime:{name:'Venom Slime',fam:'slime',hp:95,scale:.82,split:'minislime',lore:'A quivering mass of marsh venom. Cut it apart and the pieces keep fighting.',mods:{fire:2,lightning:1.5,slash:.5,pierce:.5,blunt:1.5,water:0},pattern:[['poison',9,4],['atk',14],['poison',6,3],['heavy',22]]},
  minislime:{name:'Slimelet',fam:'slime',hp:34,scale:.55,spawned:true,lore:'A small blob split from a Venom Slime. Still angry, still toxic.',mods:{fire:2,lightning:1.5,slash:.5,pierce:.5,water:0},pattern:[['poison',4,2],['atk',8],['stab',7]]},
  bee:{name:'Bee',fam:'bee',hp:7,swarm:true,swarmName:'Bee Swarm',lore:'An angry swarm of forest bees. Each one stings on its own.',mods:{fire:2,wind:2,earth:.5,blunt:.5},pattern:[['stab',2],['atk',1],['stab',2],['multi',1,2]]},
  bloodbat:{name:'Blood Bat',fam:'bat',hp:15,swarm:true,swarmName:'Bat Swarm',lore:'A screeching colony of marsh bats. Their bites leave wounds that keep bleeding.',mods:{light:2,fire:1.5,lightning:1.5,dark:0,pierce:.5},pattern:[['bleed',2,1],['atk',2],['bleed',2,2],['stab',2]]},
  sporeling:{name:'Sporeling',hp:36,scale:.9,tint:{h:280,s:.9,l:-.02},stem:{h:95,s:.5,l:-.08},lore:'A young cap that spits clouds of rot. Fragile against light.',mods:{light:2,wind:2,dark:0},pattern:[['poison',5,4],['multi',4,2],['heal',8]]},
  bogfloater:{name:'Bog Floater',fam:'flyer',hp:42,hue:{a:0,b:40,h:100,s:.95,l:-.05},lore:'A bloated pod that drifts over the marsh dropping venom.',mods:{pierce:2,wind:2,earth:0,blunt:.5},pattern:[['poison',7,3],['stab',12],['atk',10]]},
  plaguebrute:{name:'Plague Brute',fam:'orc',hp:64,scale:1.25,hue:{a:55,b:150,h:285,s:.85,l:-.08},lore:'A rot-swollen orc. Its axe weeps poison.',mods:{fire:1.5,light:1.5,blunt:.5,dark:.5},pattern:[['atk',13],['poison',8,3],['heavy',20],['def',12]]},
  marshstalker:{name:'Marsh Stalker',fam:'seeker',hp:50,scale:1.1,lore:'A hooded hunter who coats its blade in bog venom.',mods:{light:2,blunt:1.5,dark:0},pattern:[['stab',14],['poison',7,3],['multi',5,3]]},
  mireheart:{name:'Mireheart Golem',fam:'golemo',hp:84,scale:1.25,lore:'Moss and rot packed around a poisoned core.',mods:{fire:2,lightning:1.5,water:0,earth:.5,slash:.5},pattern:[['def',14],['poison',9,3],['heavy',22]]},
  plaguemother:{name:'Plague Mother',hp:210,boss:true,scale:1.95,tint:{h:96,s:1.15,l:-.1},stem:{h:285,s:.6,l:-.16},abil:['physHalf','regen'],lore:'The rotting heart of the marsh. Physical blows sink into its spongy flesh, and it knits itself back together.',mods:{fire:2,light:1.5,dark:0,water:.5},pattern:[['poison',9,3],['multi',5,3],['def',16],['poison',12,4],['heavy',24]]},
  wyrm:{abil:['ward','elemHalf'],name:'Ember Monarch',hp:150,boss:true,scale:1.8,tint:{h:356,s:1.1,l:-.16},stem:{h:28,s:.7,l:-.12},lore:'The oldest cap in the forest, burning from within. Enrages below half health. Wrapped in a spell ward and an elemental guard.',mods:{ice:2,water:2,pierce:1.5,fire:0,slash:.5,earth:.5},pattern:[['atk',11],['multi',5,3],['def',14],['heavy',21]]}
};
const LEVELS=[
  {name:'Mushroom Woods',pool:['thornling','orc','slime','floatcap','wolf','deserter','knight','orcbrute'],boss:'elder',hp:1,dmg:0},
  {name:'Volcanic Rift',pool:['bloodfiend','seeker','magmafiend','ashdemon','magmagolem','emberdemon'],boss:'infernolord',hp:1.25,dmg:2,bg:'lava',aura:'fire'},
  {name:'Ember Hollow',pool:['golem','harpy','nightseeker','priest','gloomcap','wraith','runegolem'],boss:'wyrm',hp:1.85,dmg:4,bg:'night',aura:'shadow',revive:true},
  {name:'Venom Marsh',pool:['toxicap','bogfloater','plaguebrute','marshstalker','sporeling','mireheart'],boss:'plaguemother',hp:2.5,dmg:6,bg:'swamp',aura:'poison'}];
const BOSS_ABIL={ward:{name:'Spell Ward',text:'The first hit is completely absorbed. The ward re-forms every 3 turns.'},elemHalf:{name:'Elemental Guard',text:'Takes 50% less damage from all elemental attacks.'},physHalf:{name:'Spongy Flesh',text:'Takes 50% less damage from all physical attacks.'},regen:{name:'Regeneration',text:'Heals 5% of its max HP at the end of each of its turns.'},revive:{name:'Undying',text:'Rises again once with 40% HP when slain.'}};
const LAYOUT=['m','m','ev','m','chest','m','camp','m','ev','elite','m','chest','ev','camp','boss'];
const EVENTS={
  shrine:{name:'Wayside Shrine',prop:'altar',text:'A moss-covered altar hums faintly beside a campfire. Old offerings sit in its bowl.'},
  smith:{name:'Wandering Smith',prop:'anvil',text:'A smith has set up an anvil by the fire. "One card, tempered for free. Pick wisely."'},
  merchant:{name:'Wandering Merchant',prop:'merchant',text:'A cloaked trader unrolls a carpet of cards and gleaming gear. "Coin talks, friend. What catches your eye?"'},
  mimic:{name:'Strange Chest',prop:'chest',text:'An iron-bound chest sits alone by a dying fire. The lock is already broken, and it seems to breathe.'}
};
const EVENT_KEYS=Object.keys(EVENTS);
const INTENTS={bleed:{label:'Bite',icon:'stab',cls:'bleed',note:'makes you bleed'},poison:{label:'Venom',icon:'stab',cls:'poison',note:'poisons you'},atk:{label:'Attack',icon:'atk'},stab:{label:'Stab',icon:'stab',note:'ignores block'},heavy:{label:'Ultimate',icon:'ult',cls:'heavy'},multi:{label:'Flurry',icon:'multi'},
  drain:{label:'Drain',icon:'drain'},def:{label:'Shield',icon:'shield'},buff:{label:'Empower',icon:'buff'},heal:{label:'Heal',icon:'heal'}};

/* ================= items ================= */
const SLOTSHORT={head:'Head',shoulders:'Pads',cape:'Cape',chest:'Body',hands:'Hand',feet:'Feet',weapon:'Wpn',shield:'Shld',neck:'Neck',charm:'Charm',belt:'Belt'};
const SLOTNAME={head:'Head',shoulders:'Shoulders',cape:'Cape',chest:'Chest',hands:'Hands',feet:'Feet',weapon:'Weapon',shield:'Shield',neck:'Neck',charm:'Charm',belt:'Belt'};
const ITEMS={
  starter_sword:{name:"Traveler's Sword",slot:'weapon',stats:{},grant:'slash',starter:true},
  iron_helm:{name:'Iron Helm',slot:'head',stats:{hp:8}},
  mystic_hood:{name:'Mystic Hood',slot:'head',stats:{hp:4,mcost:2}},
  gold_helm:{name:'Horned Crown',slot:'head',stats:{hp:10,atk:1}},
  plumed_helm:{name:'Plumed Helm',slot:'head',stats:{hp:6,def:1}},
  steel_pauldrons:{name:'Steel Pauldrons',slot:'shoulders',stats:{def:2}},
  gilded_pauldrons:{name:'Gilded Pauldrons',slot:'shoulders',stats:{def:2,hp:6}},
  crimson_cape:{name:'Crimson Cape',slot:'cape',stats:{lv:{fire:1}}},
  azure_cape:{name:'Azure Cape',slot:'cape',stats:{lv:{water:1}}},
  shadow_cape:{name:'Shadow Cape',slot:'cape',stats:{lv:{dark:1}}},
  white_cape:{name:"Pilgrim's Mantle",slot:'cape',stats:{lv:{light:1},mcost:1}},
  steel_cuirass:{name:'Steel Cuirass',slot:'chest',stats:{hp:12,def:1}},
  leather_vest:{name:'Leather Vest',slot:'chest',stats:{hp:10}},
  royal_armor:{name:'Royal Armor',slot:'chest',stats:{hp:16,atk:1}},
  iron_gauntlets:{name:'Iron Gauntlets',slot:'hands',stats:{atk:2}},
  spiked_gauntlets:{name:'Spiked Gauntlets',slot:'hands',stats:{blunt:3,lv:{punch:1}}},
  leather_boots:{name:'Trail Boots',slot:'feet',stats:{regen:4,lv:{kick:1}}},
  golden_greaves:{name:'Golden Greaves',slot:'feet',stats:{regen:3,hp:6}},
  steel_sword:{name:'Steel Sword',slot:'weapon',stats:{slash:3}},
  frost_blade:{name:'Frost Blade',slot:'weapon',stats:{slash:2,lv:{ice:1}}},
  battle_axe:{name:'Battle Axe',slot:'weapon',stats:{blunt:4}},
  war_spear:{name:'Javelin',slot:'weapon',stats:{pierce:2},grant:'spearthrow'},
  hunter_bow:{name:"Hunter's Bow",slot:'weapon',stats:{pierce:1},grant:'arrowshot'},
  dagger:{name:"Rogue's Dagger",slot:'weapon',stats:{atk:1,lv:{stab:1}}},
  ember_staff:{name:'Ember Staff',slot:'weapon',stats:{fire:3,lv:{fire:1}}},
  frost_wand:{name:'Frost Wand',slot:'weapon',stats:{mcost:3,ice:2}},
  archmage_staff:{name:"Archmage's Staff",slot:'weapon',stats:{elv:1,mcost:1}},
  storm_rod:{name:'Storm Rod',slot:'weapon',stats:{addl:3}},
  kite_shield:{name:'Kite Shield',slot:'shield',stats:{def:2},grant:'shieldbash'},
  spiked_shield:{name:'Spiked Buckler',slot:'shield',stats:{def:1},grant:'shieldthrow'},
  ruby_pendant:{name:'Ruby Pendant',slot:'neck',stats:{fire:3}},
  phoenix_amulet:{name:'Phoenix Amulet',slot:'neck',stats:{revive:1},fixed:'rare'},
  amber_pendant:{name:'Amber Pendant',slot:'neck',stats:{lv:{lightning:1}}},
  sapphire_pendant:{name:'Sapphire Pendant',slot:'neck',stats:{lv:{ice:1},mcost:1}},
  gold_torc:{name:'Golden Torc',slot:'neck',stats:{lv:{earth:1}}},
  lantern:{name:'Pilgrim Lantern',slot:'charm',stats:{light:2,mcost:1}},
  grim_totem:{name:'Grim Totem',slot:'charm',stats:{dark:2,mcost:1}},
  soul_lantern:{name:'Soul Lantern',slot:'charm',stats:{soul:1,souls:0}},
  leather_belt:{name:'Leather Belt',slot:'belt',stats:{hp:5,def:1}},
  knight_helm:{name:"Knight's Greathelm",slot:'head',set:'knight',stats:{hp:10,def:1}},
  knight_plate:{name:"Knight's Plate",slot:'chest',set:'knight',stats:{hp:16,def:2}},
  knight_gauntlets:{name:"Knight's Gauntlets",slot:'hands',set:'knight',stats:{slash:2,blunt:2}},
  knight_sabatons:{name:"Knight's Sabatons",slot:'feet',set:'knight',stats:{hp:6,regen:3}},
  knight_shield:{name:'Oathkeeper Shield',slot:'shield',set:'knight',stats:{def:3},grant:'shieldbash'},
  reaper_cowl:{name:"Reaper's Cowl",slot:'head',set:'reaper',stats:{hp:6,dark:2}},
  reaper_shroud:{name:'Shroud of the Reaper',slot:'cape',set:'reaper',stats:{lv:{dark:1}}},
  bone_bracers:{name:'Bone Bracers',slot:'hands',set:'reaper',stats:{pierce:2,ls:5}},
  soul_chain:{name:'Soul Chain',slot:'neck',set:'reaper',stats:{soul:1,souls:0}},
  reaper_scythe:{name:"Reaper's Scythe",slot:'weapon',set:'reaper',stats:{slash:4,ls:5},grant:'slash'},
  dragon_helm:{name:'Dragonbone Helm',slot:'head',set:'dragon',stats:{hp:10,fire:2}},
  dragon_mail:{name:'Dragonscale Mail',slot:'chest',set:'dragon',stats:{hp:18}},
  wyrm_boots:{name:'Wyrmhide Boots',slot:'feet',set:'dragon',stats:{regen:3,lv:{kick:1}}},
  dragon_heart:{name:'Heart of the Wyrm',slot:'neck',set:'dragon',stats:{hp:8,fire:3}},
  dragonfang:{name:'Dragonfang Greatsword',slot:'weapon',set:'dragon',stats:{slash:5,fire:2},grant:'slash'},
  astral_kabuto:{name:'Astral Kabuto',slot:'head',set:'astral',stats:{hp:8,dodge:5}},
  starweave_haori:{name:'Starweave Haori',slot:'chest',set:'astral',stats:{hp:12,mregen:2}},
  comet_sandals:{name:'Comet Greaves',slot:'feet',set:'astral',stats:{dodge:10}},
  nebula_obi:{name:'Nebula Obi',slot:'belt',set:'astral',stats:{crit:10}},
  starfall_katana:{name:'Starfall Katana',slot:'weapon',set:'astral',stats:{slash:4,crit:10},grant:'slash'},
  berserker_band:{name:"Berserker's Band",slot:'charm',stats:{atk:2,berserk:30}},
  iron_knuckles:{name:'Iron Knuckles',slot:'hands',stats:{blunt:3,lv:{punch:1},stunBlunt:15}},
  serrated_pendant:{name:'Serrated Fang',slot:'neck',stats:{slash:2,bleedHit:2}},
  assassin_sash:{name:"Assassin's Sash",slot:'belt',stats:{pierce:3,firstStrike:50}},
  lucky_purse:{name:'Lucky Coin Purse',slot:'charm',stats:{gold:50,atk:1}},
  emberbrand:{name:'Emberbrand',slot:'weapon',stats:{slash:3,fire:2,lv:{fire:1},igniteHit:1,burnDmg:2},grant:'slash'},
  tidecaller:{name:'Tidecaller Blade',slot:'weapon',stats:{slash:2,water:3,lv:{water:1},soakHit:1,tideHeal:3},grant:'slash'},
  butcher_cleaver:{name:'Butcher Cleaver',slot:'weapon',stats:{slash:3,blunt:2,cleave:50},grant:'slash'},
  explosion_orb:{name:'Orb of Explosion',slot:'shield',stats:{fire:2,boomCh:30,boom:30}},
  stormfang:{name:'Stormfang Saber',slot:'weapon',stats:{slash:3,lightning:2,lv:{lightning:1},zap:30},grant:'slash'},
  red_potion:{name:'Healing Draught',stats:{heal:20}},
  blue_potion:{name:'Ironskin Tonic',stats:{pdef:1}},
  green_potion:{name:'Vigor Tonic',stats:{php:6}},
  purple_potion:{name:'Fury Tonic',stats:{patk:1}}
};
const SETS={
  knight:{name:'Knight of the Oath',color:'#6f9cf0',bonus:{2:{def:2,phys:2},3:{barrierStart:15},5:{physPct:25,stunBlunt:20}},title:{5:'Oath of the Knight'}},
  reaper:{name:"Reaper's Harvest",color:'#b58bff',bonus:{2:{ls:10},3:{bleedHit:3},5:{execute:30}},title:{5:"Death's Door"}},
  dragon:{name:'Dragon Slayer',color:'#ff6a5a',bonus:{2:{fire:3,phys:3},3:{eliteDmg:25},5:{dragonbane:1}},title:{5:'Dragonsbane'}},
  astral:{name:'Astral Ronin',color:'#4fd8ff',bonus:{2:{dodge:15},3:{mregen:5},5:{supernova:1}},title:{5:'Supernova'}},
};
const SET_PIECES={};
for(const k in ITEMS)if(ITEMS[k].set)(SET_PIECES[ITEMS[k].set]=SET_PIECES[ITEMS[k].set]||[]).push(k);
const GEAR_KEYS=Object.keys(ITEMS).filter(k=>ITEMS[k].slot&&!ITEMS[k].starter),POTION_KEYS=Object.keys(ITEMS).filter(k=>!ITEMS[k].slot);

const RARITY_GLOW={common:'#ffffff',rare:'#8fd3ff',epic:'#d9b8ff'};
const RANK={common:0,rare:1,epic:2};
const PROP_OF={};

const ITEM_LOOK={"butcher_cleaver": {"t": "weapon", "a": "#e6eaf0", "b": "#5a5f6a", "c": "#c0303a", "d": "#ffffff", "f": "#ffffff"}, "explosion_orb": {"t": "shield", "a": "#ff7a1a", "b": "#7a1a0a", "c": "#ffc23a", "d": "#e8b840", "f": "#fff6c8"}, "emberbrand": {"t": "weapon", "a": "#ffd0a0", "b": "#c8402f", "c": "#ff6a1a", "d": "#ffe08a", "f": "#ffffff"}, "tidecaller": {"t": "weapon", "a": "#d8f4ff", "b": "#1f62b0", "c": "#3aa0ff", "d": "#bfe9ff", "f": "#ffffff"}, "stormfang": {"t": "weapon", "a": "#e8eef6", "b": "#5a6070", "c": "#f2d24b", "d": "#ffe866", "f": "#ffffff"}, "knight_helm": {"t": "helm", "a": "#c9d1db", "b": "#5a6474", "c": "#ffffff", "d": "#e8b840", "f": "#ffffff"}, "knight_plate": {"t": "chest", "a": "#c9d1db", "b": "#5a6474", "c": "#6f9cf0", "d": "#e8b840", "f": "#ffffff"}, "knight_gauntlets": {"t": "glove", "a": "#c9d1db", "b": "#5a6474", "c": "#ffffff", "d": "#2f5fc0", "f": "#ffffff"}, "knight_sabatons": {"t": "boot", "a": "#c9d1db", "b": "#5a6474", "c": "#ffffff", "d": "#e8b840", "f": "#ffffff"}, "knight_shield": {"t": "shield", "a": "#2f5fc0", "b": "#1c3a80", "c": "#6f9cf0", "d": "#e8b840", "f": "#ffffff"}, "reaper_cowl": {"t": "hood", "a": "#3a3150", "b": "#211b2c", "c": "#9a4dff", "d": "#e8dcc0", "f": "#ffffff"}, "reaper_shroud": {"t": "cape", "a": "#3a3150", "b": "#211b2c", "c": "#9a4dff", "d": "#e8dcc0", "f": "#ffffff"}, "bone_bracers": {"t": "glove", "a": "#e8dcc0", "b": "#211b2c", "c": "#9a4dff", "d": "#b8a888", "f": "#ffffff"}, "soul_chain": {"t": "pendant", "a": "#9a4dff", "b": "#5a1fa0", "c": "#d6b8ff", "d": "#b8a8d8", "f": "#ffffff"}, "reaper_scythe": {"t": "weapon", "a": "#d8dde6", "b": "#3a2a3a", "c": "#9a4dff", "d": "#e8dcc0", "f": "#ffffff"}, "dragon_helm": {"t": "helm", "a": "#c0283a", "b": "#7a1020", "c": "#ff6a5a", "d": "#e8b840", "f": "#ffffff"}, "dragon_mail": {"t": "chest", "a": "#c0283a", "b": "#7a1020", "c": "#ff6a5a", "d": "#e8b840", "f": "#ffffff"}, "wyrm_boots": {"t": "boot", "a": "#c0283a", "b": "#7a1020", "c": "#ff6a5a", "d": "#e8b840", "f": "#ffffff"}, "dragon_heart": {"t": "pendant", "a": "#c0283a", "b": "#7a1020", "c": "#ff9a3a", "d": "#e8b840", "f": "#ffffff"}, "dragonfang": {"t": "weapon", "a": "#e6e9f0", "b": "#7a1020", "c": "#ff9a3a", "d": "#e8b840", "f": "#ffffff"}, "astral_kabuto": {"t": "helm", "a": "#1a2150", "b": "#121838", "c": "#4fd8ff", "d": "#ffd36b", "f": "#ffffff"}, "starweave_haori": {"t": "chest", "a": "#1a2150", "b": "#121838", "c": "#4fd8ff", "d": "#ffd36b", "f": "#ffffff"}, "comet_sandals": {"t": "boot", "a": "#1a2150", "b": "#121838", "c": "#4fd8ff", "d": "#ffd36b", "f": "#ffffff"}, "nebula_obi": {"t": "belt", "a": "#8a4ad0", "b": "#2a3578", "c": "#ff6fd8", "d": "#ffd36b", "f": "#ffffff"}, "starfall_katana": {"t": "weapon", "a": "#e8f4ff", "b": "#1a2150", "c": "#4fd8ff", "d": "#ffd36b", "f": "#ffffff"}, "berserker_band": {"t": "totem", "a": "#a02a2a", "b": "#5a1a1a", "c": "#ffb347", "d": "#c0c8d0", "f": "#ffffff"}, "iron_knuckles": {"t": "glove", "a": "#9aa2ac", "b": "#6a7280", "c": "#e6e9f0", "d": "#e8b840", "f": "#ffffff"}, "serrated_pendant": {"t": "pendant", "a": "#e6e9f0", "b": "#9aa2ae", "c": "#c0303a", "d": "#8a5a2b", "f": "#ffffff"}, "assassin_sash": {"t": "belt", "a": "#262030", "b": "#16121e", "c": "#c0303a", "d": "#3a3248", "f": "#ffffff"}, "lucky_purse": {"t": "lantern", "a": "#8a5a2b", "b": "#6a4220", "c": "#ffd84a", "d": "#e8b840", "f": "#ffffff"}, "storm_rod": {"t": "weapon", "a": "#f2d24b", "b": "#a8700f", "c": "#fff6b0", "d": "#c0c8d0", "f": "#fff"}, "soul_lantern": {"t": "lantern", "a": "#5a5f68", "b": "#6a3a8e", "c": "#b18bff", "d": "#3a3e45", "f": "#e8d8ff"}, "iron_helm": {"t": "helm", "a": "#949ca5", "b": "#59606a", "c": "#d5dbe1", "d": "#d0a43a", "f": "#f1ead6"}, "mystic_hood": {"t": "hood", "a": "#3f4f8a", "b": "#27325c", "c": "#6d7fc4", "d": "#d0a43a", "f": "#9fe8ff"}, "gold_helm": {"t": "crown", "a": "#d8a93a", "b": "#9b7424", "c": "#ffe28a", "d": "#fff0b0", "f": "#f1ead6"}, "plumed_helm": {"t": "plume", "a": "#a7b0ba", "b": "#626b76", "c": "#e6ebf0", "d": "#c8402f", "f": "#f1ead6"}, "steel_pauldrons": {"t": "pads", "a": "#a7b0ba", "b": "#626b76", "c": "#e6ebf0", "d": "#626b76", "f": "#f1ead6"}, "gilded_pauldrons": {"t": "pads", "a": "#d8a93a", "b": "#9b7424", "c": "#ffe28a", "d": "#fff0b0", "f": "#f1ead6"}, "crimson_cape": {"t": "cape", "a": "#b02c34", "b": "#6e1a22", "c": "#e05a5f", "d": "#d0a43a", "f": "#f1ead6"}, "azure_cape": {"t": "cape", "a": "#2d6fc0", "b": "#1b4580", "c": "#6aa6ea", "d": "#d0a43a", "f": "#f1ead6"}, "shadow_cape": {"t": "cape", "a": "#3d2d58", "b": "#22172f", "c": "#6a5590", "d": "#d0a43a", "f": "#f1ead6"}, "white_cape": {"t": "cape", "a": "#e9e6dc", "b": "#b0aa98", "c": "#ffffff", "d": "#d0a43a", "f": "#f1ead6"}, "steel_cuirass": {"t": "chest", "a": "#a7b0ba", "b": "#626b76", "c": "#e6ebf0", "d": "#d0a43a", "f": "#f1ead6"}, "leather_vest": {"t": "chest", "a": "#8a5a2b", "b": "#5e3a1a", "c": "#b07a43", "d": "#d0a43a", "f": "#fff"}, "royal_armor": {"t": "chest", "a": "#3a5bb0", "b": "#233b78", "c": "#6d8fe0", "d": "#e0b84a", "f": "#f1ead6"}, "iron_gauntlets": {"t": "glove", "a": "#a7b0ba", "b": "#626b76", "c": "#e6ebf0", "d": "#626b76", "f": "#f1ead6"}, "spiked_gauntlets": {"t": "spikeglove", "a": "#5f646d", "b": "#3a3e45", "c": "#8a919b", "d": "#8a5a2b", "f": "#e6ebf0"}, "leather_boots": {"t": "boot", "a": "#7a4e26", "b": "#52331a", "c": "#a87444", "d": "#d0a43a", "f": "#fff"}, "golden_greaves": {"t": "boot", "a": "#d8a93a", "b": "#9b7424", "c": "#ffe28a", "d": "#fff0b0", "f": "#f1ead6"}, "steel_sword": {"t": "weapon", "a": "#b9c3cd", "b": "#626b76", "c": "#f2f6fa", "d": "#d8a93a", "f": "#f1ead6"}, "frost_blade": {"t": "weapon", "a": "#6cc4f2", "b": "#626b76", "c": "#e8fbff", "d": "#5aa0d8", "f": "#f1ead6"}, "battle_axe": {"t": "weapon", "a": "#a7b0ba", "b": "#626b76", "c": "#e6ebf0", "d": "#d0a43a", "f": "#f1ead6"}, "war_spear": {"t": "weapon", "a": "#a7b0ba", "b": "#626b76", "c": "#e6ebf0", "d": "#d0a43a", "f": "#f1ead6"}, "hunter_bow": {"t": "weapon", "a": "#8a5a2b", "b": "#333", "c": "#fff", "d": "#d0a43a", "f": "#f1ead6"}, "dagger": {"t": "weapon", "a": "#9aa3ad", "b": "#626b76", "c": "#e6ebf0", "d": "#6a3a8e", "f": "#f1ead6"}, "kite_shield": {"t": "shield", "a": "#2d5fae", "b": "#1b3d75", "c": "#5f8fd8", "d": "#d8a93a", "f": "#fff"}, "spiked_shield": {"t": "shield", "a": "#7a7f88", "b": "#666b74", "c": "#d8a93a", "d": "#4a4f58", "f": "#e6ebf0"}, "ruby_pendant": {"t": "pendant", "a": "#d0263a", "b": "#7a1020", "c": "#ff8a96", "d": "#d8a93a", "f": "#f1ead6"}, "amber_pendant": {"t": "pendant", "a": "#f2b232", "b": "#a8700f", "c": "#ffe08a", "d": "#d8a93a", "f": "#f1ead6"}, "sapphire_pendant": {"t": "pendant", "a": "#2f6ad8", "b": "#163a80", "c": "#8ab4ff", "d": "#d8a93a", "f": "#f1ead6"}, "gold_torc": {"t": "torc", "a": "#d8a93a", "b": "#9b7424", "c": "#ffe28a", "d": "#fff0b0", "f": "#f1ead6"}, "lantern": {"t": "lantern", "a": "#5a5f68", "b": "#c9902a", "c": "#ffd84a", "d": "#3a3e45", "f": "#fff6c0"}, "grim_totem": {"t": "totem", "a": "#cfc6ad", "b": "#8f8670", "c": "#fff", "d": "#c8402f", "f": "#fff"}, "leather_belt": {"t": "belt", "a": "#7a4e26", "b": "#5e3a1a", "c": "#b07a43", "d": "#d0a43a", "f": "#fff"}, "starter_sword": {"t": "weapon", "a": "#aab3bd", "b": "#626b76", "c": "#e6eaef", "d": "#8a6a3a", "f": "#f1ead6"}, "phoenix_amulet": {"t": "pendant", "a": "#ff6a2a", "b": "#a8301a", "c": "#ffe08a", "d": "#d8a93a", "f": "#fff"}};
