"use strict";

window.FastnessArc = (() => {
 const gate = 'fastness_gate';
 const undeadFormation = [
  {x:280,y:232,endX:248,endY:205},
  {x:328,y:248,endX:296,endY:192},
  {x:376,y:232,endX:360,endY:192}
 ];
 const chargeDuration = 820;
 let chargeStarted = null;
 const hall = 'fastness_hall';
 const chapel = 'fastness_chapel';
 const study = 'fastness_study';
 const landing = 'fastness_landing';
 const gallery = 'fastness_gallery';
 const summit = 'fastness_summit';
 const towerBase = 'fastness_tower_base';
 const images = {
  [gate]:'valor-fastness-gate-v1.png',
  [hall]:'valor-fastness-hall-v1.png',
  [chapel]:'valor-fastness-chapel-v1.png',
  [study]:'valor-fastness-study-v1.png',
  [landing]:'valor-fastness-landing-v1.png',
  [gallery]:'valor-fastness-gallery-v1.png',
  [summit]:'valor-fastness-summit-v1.png',
  [towerBase]:'valor-fastness-tower-base-v1.png'
 };
 const combatStats = {
  fastness_paladin:{hp:26,ac:14,atk:5,dmg:[1,8,1]},
  fastness_cleric:{hp:25,ac:13,atk:4,dmg:[1,6,2]},
  fastness_mage:{hp:36,ac:13,atk:5,dmg:[1,8,1]},
  fastness_warpriest:{hp:44,ac:15,atk:6,dmg:[1,10,1]},
  oppian:{hp:66,ac:14,atk:6,dmg:[1,8,2]},
  fastness_archon:{hp:37,ac:14,atk:5,dmg:[1,8,1]}
 };
 const encounters = {
  [gate]:{cleared:'fastnessGateCleared',defenders:[
   ['kantaria_guard','Gate Guard 1',248,200,6], ['kantaria_guard','Gate Guard 2',296,184,6],
   ['kantaria_guard','Gate Guard 3',360,184,6], ['kantaria_guard','Gate Guard 4',408,200]
  ]},
  [hall]:{cleared:'fastnessHallCleared',defenders:[
   ['kantaria_guard','Hall Guard 1',248,216], ['fastness_paladin','Hall Paladin',328,192],
   ['kantaria_guard','Hall Guard 2',408,216]
  ]},
  [chapel]:{cleared:'fastnessChapelCleared',defenders:[
   ['fastness_paladin','Chapel Paladin 1',264,208], ['fastness_cleric','Chapel Cleric',328,192],
   ['fastness_paladin','Chapel Paladin 2',392,208]
  ]},
  [study]:{cleared:'fastnessMageCleared',defenders:[
   ['kantaria_guard','Study Guard 1',248,216], ['fastness_mage','Tower Mage',328,192],
   ['kantaria_guard','Study Guard 2',408,216]
  ]},
  [landing]:{cleared:'fastnessWarpriestCleared',defenders:[
   ['fastness_warpriest','Tower Warpriest',304,192], ['fastness_paladin','Landing Paladin',392,208]
  ]},
  [gallery]:{cleared:'fastnessLenciaSlain',defenders:[
   ['lencia','Lencia',328,192]
  ]},
  [summit]:{cleared:'fastnessSummitWon',defenders:[
   ['oppian','Oppian',312,192,8], ['fastness_archon','Archon',408,200]
  ]}
 };
 const towerFloors = {
  [study]:{
   title:'The Mage’s Study',fight:['fastnessMageFight','Defeat the tower mage'],
   exit:['fastnessLandingRoad','Climb to the upper landing'],
   lights:[[194,74],[296,101],[345,101],[447,74]],
   arrival:'Beyond the stairs, a mage and two Reclamation guards have taken up positions among the bookshelves.'
  },
  [landing]:{
   title:'Upper Landing',fight:['fastnessWarpriestFight','Defeat the warpriest'],
   exit:['fastnessGalleryRoad','Continue to the open gallery'],
   lights:[[226,144],[414,144],[55,232],[585,232]],
   arrival:'A warpriest holds the next landing. A paladin guards the upper stair at his side.'
  },
  [gallery]:{
   title:'Open Gallery',fight:['fastnessLenciaFight','Face the Angel Knight'],
   exit:['fastnessAscentEnd','Secure the way to the summit'],
   lights:[[97,144],[291,99],[349,99],[543,144]],
   arrival:'The narrow stair opens onto a gallery high above Kantaria. The Angel Knight who escaped the Court of Spears stands between the company and the summit.'
  }
 };

 function installCast() {
  Object.assign(STATS,combatStats);
  Object.assign(NAMES,{fastness_paladin:'Reclamation Paladin',fastness_cleric:'Reclamation Cleric',
   fastness_mage:'Tower Mage',fastness_warpriest:'Tower Warpriest',
   oppian:'Oppian Nevilindor',fastness_archon:'Archon'});
  const atlas = 'valor-fastness-defenders-v1.png';
  const poses = {
   fastness_paladin:[[55,35,338,436,264],[570,29,338,442,776],[1079,39,341,432,1288]],
   fastness_cleric:[[113,542,273,442,264],[625,539,275,445,776],[1138,549,276,435,1288]]
  };
  for (const [id,rects] of Object.entries(poses)) {
   const frames = rects.map(([x,y,w,h,anchorX])=>({x,y,w,h,anchorX,anchorY:y+h}));
   COMBAT_IDLES[id] = {src:atlas,frames,maxHeight:Math.max(...frames.map(frame=>frame.h)),cycle:[0,1,2,1]};
   FUTURE_NPCS[id] = {source:atlas,frame:frames[0]};
  }
  const towerAtlas = 'valor-fastness-ascent-cast-v1.png';
  const towerPoses = {
   fastness_mage:[[129,20,276,470,272],[641,20,269,470,784],[1153,19,274,471,1296]],
   fastness_warpriest:[[53,528,393,477,267],[568,539,385,466,779],[1081,530,391,475,1291]]
  };
  const summitAtlas = 'valor-fastness-summit-cast-v1.png';
  const summitPoses = {
   oppian:[[134,17,277,452,268],[635,19,272,449,780],[1134,13,276,456,1292]],
   fastness_archon:[[157,516,225,485,268],[648,523,227,480,780],[1143,513,234,488,1292]]
  };
  for (const [sheet,models] of [[towerAtlas,towerPoses],[summitAtlas,summitPoses]]) {
   for (const [id,rects] of Object.entries(models)) {
    const frames = rects.map(([x,y,w,h,anchorX])=>({x,y,w,h,anchorX,anchorY:y+h}));
    COMBAT_IDLES[id] = {src:sheet,frames,maxHeight:Math.max(...frames.map(frame=>frame.h)),cycle:[0,1,2,1]};
    FUTURE_NPCS[id] = {source:sheet,frame:frames[0]};
   }
  }
  LORE_CAST.oppian = {...FUTURE_NPCS.oppian,src:summitAtlas};
  DIALOGUE_FACE_CROPS.oppian = {x:214,y:13,w:104,h:104};
 }

 function install() {
  installCast();
  scenes.supply_report.points.push({id:'fastnessRoad',x:328,y:344,label:'Continue to Valor’s Fastness'});
  scenes[gate] = {
   name:'Valor’s Fastness · Outer Gate', image:images[gate], spawn:[328,344], blocks:[],
   walk:[{x:144,y:176,w:352,h:80},{x:288,y:240,w:64,h:144},{x:304,y:144,w:48,h:48}],
   lights:[[228,137],[414,137],[251,339],[391,339]],
   points:[
    {id:'fastnessMuster',x:328,y:264,label:'Muster the reanimated soldiers'},
    {id:'fastnessCharge',x:328,y:216,label:'Send the undead through the gate'},
    {id:'fastnessThreshold',x:328,y:152,label:'Secure the breach'},
    {id:'fastnessHallRoad',x:328,y:152,label:'Enter the mustering hall'}
   ]
  };
  scenes[hall] = {
   name:'Valor’s Fastness · Mustering Hall',image:images[hall],spawn:[328,344],blocks:[],
   walk:[{x:144,y:176,w:352,h:80},{x:288,y:256,w:64,h:128},{x:304,y:144,w:48,h:32}],
   lights:[[190,139],[227,139],[414,139],[450,139]],
   points:[
    {id:'fastnessHallFight',x:328,y:224,label:'Break the hall’s defense'},
    {id:'fastnessChapelRoad',x:328,y:152,label:'Enter the inner chapel'}
   ]
  };
  scenes[chapel] = {
   name:'Valor’s Fastness · Inner Chapel',image:images[chapel],spawn:[328,344],blocks:[],
   walk:[{x:160,y:176,w:320,h:80},{x:288,y:256,w:64,h:128},{x:432,y:144,w:32,h:32}],
   lights:[[150,145],[227,113],[348,116],[411,115],[535,157]],
   points:[
    {id:'fastnessChapelFight',x:328,y:224,label:'Break the chapel’s defense'},
    {id:'fastnessStairs',x:440,y:168,label:'Secure the tower stairs'},
    {id:'fastnessStudyRoad',x:440,y:168,label:'Climb the tower stairs'}
   ]
  };
  for (const [id,floor] of Object.entries(towerFloors)) {
   scenes[id] = {
    name:'Valor’s Fastness · '+floor.title,image:images[id],spawn:[328,344],blocks:[],
    walk:[{x:160,y:176,w:320,h:80},{x:288,y:256,w:64,h:128},{x:304,y:144,w:48,h:32}],
    lights:floor.lights,
    points:[
     {id:floor.fight[0],x:328,y:224,label:floor.fight[1]},
     {id:floor.exit[0],x:328,y:152,label:floor.exit[1]}
    ]
   };
   JOURNEYS[id] = floor.arrival;
  }
  scenes[gallery].points.push({id:'fastnessSummitRoad',x:328,y:152,label:'Climb to the summit'});
  scenes[summit] = {
   name:'Valor’s Fastness · Summit',image:images[summit],spawn:[328,344],blocks:[],
   walk:[{x:144,y:160,w:368,h:128},{x:288,y:288,w:64,h:96},{x:448,y:144,w:48,h:16}],
   lights:[[121,119],[518,119],[78,293],[559,293]],
   points:[
    {id:'fastnessOppianFight',x:328,y:224,label:'Face Oppian and the Archon'},
    {id:'fastnessOppianRescue',x:472,y:152,label:'Go after Oppian'}
   ]
  };
  scenes[towerBase] = {
   name:'Valor’s Fastness · Tower Base',image:images[towerBase],spawn:[328,344],blocks:[],
   walk:[{x:144,y:160,w:368,h:128},{x:288,y:288,w:64,h:96}],
   lights:[[258,96],[379,96],[253,324],[386,324]],
   points:[
    {id:'fastnessOppianCapture',x:328,y:208,label:'Take Oppian into custody'},
    {id:'fastnessCampaignReport',x:328,y:344,label:'Prepare for the capital'}
   ]
  };
  for (const [id,foreground] of Object.entries(images)) {
   MAP_LAYERS[id] = {foreground,background:{type:'solid',color:'#151820'}};
  }
  MAP_LAYERS[gallery].background = {type:'sky'};
  MAP_LAYERS[summit].background = {type:'sky'};
  JOURNEYS[gate] = 'Valor’s Fastness is both a temple of Iomedae and the Reclamation’s main barracks. Its tower rises over Kantaria. The company gathers below its gates.';
  JOURNEYS[hall] = 'The company storms the fortress. The defenders form a line among the weapon racks, holding the passage to the chapel.';
  JOURNEYS[chapel] = 'The fight moves to the inner chapel. A cleric and two paladins stand between the company and the tower stairs.';
  JOURNEYS[summit] = 'The stair opens onto the summit. Oppian Nevilindor, Kantaria’s mayor and the Reclamation’s Fourth Sword Knight, stands at the parapet with his Archon bodyguard.';
  JOURNEYS[towerBase] = 'The company follows Oppian over the edge and breaks his fall. He is injured and alive when they reach the stones below the tower.';
 }

 async function load(loader) {
  await Promise.all(Object.entries(images).map(async ([id,image])=>{art[id]=await loader(image);}));
 }
 function mapImage() { return Object.hasOwn(images,scene) ? art[scene] : null; }

 function points() {
  if (!quest.chapter14Complete) return null;
  if (scene === 'supply_report' && !quest.chapter15) return [point('fastnessRoad')];
  if (scene === gate) {
   if (!quest.fastnessMustered) return [point('fastnessMuster')];
   if (!quest.fastnessGateCleared) return [point('fastnessCharge')];
   return [point(quest.fastnessGateComplete ? 'fastnessHallRoad' : 'fastnessThreshold')];
  }
  if (scene === hall) return [point(quest.fastnessHallCleared ? 'fastnessChapelRoad' : 'fastnessHallFight')];
  if (scene === chapel) {
   if (quest.fastnessInteriorComplete) return [point('fastnessStudyRoad')];
   return [point(quest.fastnessChapelCleared ? 'fastnessStairs' : 'fastnessChapelFight')];
  }
  const floor = towerFloors[scene];
  if (scene === gallery && quest.fastnessAscentComplete) return [point('fastnessSummitRoad')];
  if (floor) {
   return [point((quest[encounters[scene].cleared] ? floor.exit : floor.fight)[0])];
  }
  if (scene === summit) return [point(quest.fastnessSummitWon ? 'fastnessOppianRescue' : 'fastnessOppianFight')];
  if (scene === towerBase && !quest.chapter15Complete) {
   return [point(quest.fastnessOppianCaptured ? 'fastnessCampaignReport' : 'fastnessOppianCapture')];
  }
  return [];
 }

 function target() { return points()?.[0] || null; }
 function goal() {
  if (!quest.chapter14Complete) return null;
  if (quest.chapter15Complete) return 'Kantaria is secured. Oppian awaits transport to Egorian.';
  return target()?.label || null;
 }

 function npcs() {
  if (scene === towerBase) return [{id:'oppian',x:328,y:192}];
  if (scene === summit && quest.fastnessSummitWon) return [];
  const fight = encounters[scene];
  if (!fight) return null;
  const guards = fight.defenders.map(([id,,x,y]) => ({id,x,y,...(quest[fight.cleared] && {hp:0})}));
  if (scene !== gate || !quest.fastnessMustered || quest.fastnessGateCleared) return guards;
  const elapsed = chargeStarted===null ? 0 : performance.now()-chargeStarted;
  const progress = Math.min(1,elapsed/chargeDuration);
  const stride = progress>0 ? Math.round(Math.sin(elapsed/43)*2) : 0;
  return guards.concat(undeadFormation.map(({x,y,endX,endY})=>({
   id:'fastness_undead',
   x:Math.round(x+(endX-x)*progress),
   y:Math.round(y+(endY-y)*progress)+stride
  })));
 }

 function drawNPC(unit) {
  if (unit.id !== 'fastness_undead') return false;
  const model = FUTURE_NPCS.kantaria_guard;
  const frame = model.frame;
  const height = 54;
  const width = frame.w * height / frame.h;
  ctx.save();
  ctx.filter = 'grayscale(85%) sepia(45%) hue-rotate(78deg) brightness(82%)';
  ctx.drawImage(art[model.source],frame.x,frame.y,frame.w,frame.h,unit.x-width/2,unit.y-height,width,height);
  ctx.restore();
  return true;
 }

 function encounter(kind = gate) {
  return {kind,enemies:encounters[kind].defenders.map(([id,name,,,injury=0])=>{
   const max = STATS[id].hp;
   return {id,name,max,hp:max-injury,...(id==='oppian' && {resolve:true})};
  })};
 }

 async function enemySupport(enemy) {
  if (enemy.intent?.battlePrayer && !enemy.prayerSpent && enemy.hp * 2 <= enemy.max) {
   enemy.prayerSpent = true;
   await mend(enemy,enemy,8);
   return true;
  }
  if (!enemy.intent?.canMend) return false;
  const ally = battle.enemies.filter(unit=>unit!==enemy && unit.hp>0 && unit.hp<unit.max)
   .sort((a,b)=>(b.max-b.hp)-(a.max-a.hp))[0];
  if (!ally) return false;
  await mend(enemy,ally,6);
  return true;
 }

 async function mend(enemy,ally,amount) {
  const restored = Math.min(amount,ally.max-ally.hp);
  await animateAction(enemy,ally,'mend',true,()=>{
   ally.hp+=restored;
   flash(ally,'+'+restored,'#ead58d');
  });
  const action = enemy===ally ? ' invokes a battle prayer' : ' mends '+ally.name;
  log(enemy.name+action+' · '+restored+' HP restored.');
 }

 async function afterBattle(kind,returnPosition) {
  const fight = encounters[kind];
  if (!fight) return;
  quest[fight.cleared] = true;
  seedParty(...returnPosition);
  save();
  const aftermath = {
   [gate]:'The last exterior defenders fall. The company has a clear path into the fortress.',
   [hall]:'The hall falls quiet. Beyond the far doorway, chapel bells still ring.',
   [chapel]:'The last chapel defenders fall. The stair beside the altar leads into the tower.',
   [study]:'The mage and the study guards fall. The company clears the stair beyond the shelves.',
   [landing]:'The warpriest falls. Beyond the landing, the stair turns toward the open gallery.',
   [gallery]:'Lencia Visserene falls on the gallery. The Angel Knight who escaped at the Court of Spears is dead.',
   [summit]:'The Archon is driven back. With his defense broken, Oppian staggers toward the edge of the tower.'
  };
  await say('Chronicle',aftermath[kind]);
  paintParty();
  updateObjective();
 }

 function beginEncounter(kind) {
  const {x,y,dir}=units[0];
  save();
  startBattle(0,false,{...encounter(kind),returnPosition:[x,y,dir]});
 }

 async function interact(id) {
  if (target()?.id !== id) return false;
  switch (id) {
   case 'fastnessRoad':
    await journeyCard('The Royal Pursuit','Before the assault, the company defrauds a distant cousin of the royal family. During the pursuit that follows, a member of the royal family and several royal guards are killed.');
    quest.chapter15 = true;
    await travel(gate,328,344);
    break;
   case 'fastnessMuster':
    await say('Chronicle','The company reanimates fallen soldiers of the Glorious Reclamation to lead the attack on the gates.');
    await say('freya','Send them in first. We follow while the guards are occupied.');
    quest.fastnessMustered = true;
    break;
   case 'fastnessCharge':
    if (!reduce.matches) {
     const token = epoch;
     chargeStarted = performance.now();
     try {
      await delay(chargeDuration);
      if (token!==epoch) throw CANCEL;
     } finally {
      chargeStarted = null;
     }
    }
    beginEncounter(gate);
    return true;
   case 'fastnessThreshold':
    await journeyCard('The Outer Gate Falls','The exterior guards have fallen. The breach is secure. Beyond the arch, the defenders still hold the fortress.');
    quest.fastnessGateComplete = true;
    break;
   case 'fastnessHallRoad':
    await travel(hall,328,344);
    break;
   case 'fastnessChapelRoad':
    await travel(chapel,328,344);
    break;
   case 'fastnessStudyRoad':
    await travel(study,328,344);
    break;
   case 'fastnessLandingRoad':
    await travel(landing,328,344);
    break;
   case 'fastnessGalleryRoad':
    await travel(gallery,328,344);
    break;
   case 'fastnessSummitRoad':
    await travel(summit,328,344);
    break;
   case 'fastnessHallFight':
   case 'fastnessChapelFight':
   case 'fastnessMageFight':
   case 'fastnessWarpriestFight':
    beginEncounter(scene);
    return true;
   case 'fastnessLenciaFight':
    await say('freya','You made it out of the Court alive.');
    await say('lencia','Then you know I won’t abandon this stair.');
    beginEncounter(gallery);
    return true;
   case 'fastnessStairs':
    await journeyCard('The Tower Stairs','The company has cleared the lower fortress. Above them, footsteps sound on the stone stairs.');
    quest.fastnessInteriorComplete = true;
    break;
   case 'fastnessAscentEnd':
    await journeyCard('The Last Stair','The mage, warpriest and Angel Knight have fallen. One last stair leads to the summit of Valor’s Fastness.');
    quest.fastnessAscentComplete = true;
    break;
   case 'fastnessOppianFight':
    await say('oppian','This is my home. If Thrune wants it back, he can come for it himself.');
    await say('freya','He sent us. You’re coming down alive, Oppian.');
    await say('Chronicle','A blow from the stolen hammer of Oppian’s closest friend drives him back. The Archon moves in front of him. Break their defense and take the knight alive.');
    beginEncounter(summit);
    return true;
   case 'fastnessOppianRescue':
    await say('Chronicle','At the last, someone Oppian loves betrays him. Rather than be taken, he steps from the broken parapet.');
    await say('freya','Over the edge. Catch him!');
    await storyRoll('Catch Oppian',17,0,'The company catches him in the fall');
    quest.fastnessOppianRescued = true;
    await travel(towerBase,328,344);
    break;
   case 'fastnessOppianCapture':
    await say('oppian','You could have let me fall.');
    await say('freya','You’re answering for Kantaria. Bind his hands and keep him alive.');
    quest.fastnessOppianCaptured = true;
    break;
   case 'fastnessCampaignReport':
    await journeyCard('Kantaria Secured','With Oppian in custody, the Kantaria rebellion is broken. The company prepares to deliver him to Egorian for judgment.');
    quest.chapter15Complete = true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }

 return {install,load,mapImage,points,target,goal,npcs,drawNPC,combatStats,encounter,enemySupport,afterBattle,interact};
})();
