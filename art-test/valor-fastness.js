"use strict";

window.FastnessArc = (() => {
 const gate = 'fastness_gate';
 const hall = 'fastness_hall';
 const chapel = 'fastness_chapel';
 const images = {
  [gate]:'valor-fastness-gate-v1.png',
  [hall]:'valor-fastness-hall-v1.png',
  [chapel]:'valor-fastness-chapel-v1.png'
 };
 const combatStats = {
  fastness_paladin:{hp:26,ac:14,atk:5,dmg:[1,8,1]},
  fastness_cleric:{hp:25,ac:13,atk:4,dmg:[1,6,2]}
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
  ]}
 };

 function installCast() {
  Object.assign(STATS,combatStats);
  Object.assign(NAMES,{fastness_paladin:'Reclamation Paladin',fastness_cleric:'Reclamation Cleric'});
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
 }

 function install() {
  installCast();
  scenes.supply_report.points.push({id:'fastnessRoad',x:328,y:344,label:'Continue to Valor’s Fastness'});
  scenes[gate] = {
   name:'Valor’s Fastness · Outer Gate', image:images[gate], spawn:[328,344], blocks:[],
   walk:[{x:160,y:176,w:320,h:64},{x:288,y:240,w:64,h:144},{x:304,y:144,w:48,h:32}],
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
    {id:'fastnessStairs',x:440,y:168,label:'Secure the tower stairs'}
   ]
  };
  for (const [id,foreground] of Object.entries(images)) {
   MAP_LAYERS[id] = {foreground,background:{type:'solid',color:'#151820'}};
  }
  JOURNEYS[gate] = 'Valor’s Fastness is both a temple of Iomedae and the Reclamation’s main barracks. Its tower rises over Kantaria. The company gathers below its gates.';
  JOURNEYS[hall] = 'The company storms the fortress. The defenders form a line among the weapon racks, holding the passage to the chapel.';
  JOURNEYS[chapel] = 'The fight moves to the inner chapel. A cleric and two paladins stand between the company and the tower stairs.';
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
  if (scene === chapel && !quest.fastnessInteriorComplete) {
   return [point(quest.fastnessChapelCleared ? 'fastnessStairs' : 'fastnessChapelFight')];
  }
  return [];
 }

 function target() { return points()?.[0] || null; }
 function goal() {
  if (!quest.chapter14Complete) return null;
  if (quest.fastnessInteriorComplete) return 'The tower stairs are secured. The ascent lies ahead.';
  return target()?.label || null;
 }

 function npcs() {
  const fight = encounters[scene];
  if (!fight) return null;
  const guards = fight.defenders.map(([id,,x,y]) => ({id,x,y,...(quest[fight.cleared] && {hp:0})}));
  if (scene !== gate || !quest.fastnessMustered || quest.fastnessGateCleared) return guards;
  return guards.concat([
   {id:'fastness_undead',x:296,y:232}, {id:'fastness_undead',x:360,y:232},
   {id:'fastness_undead',x:312,y:264}
  ]);
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
   return {id,name,max,hp:max-injury};
  })};
 }

 async function enemySupport(enemy) {
  if (enemy.id !== 'fastness_cleric' || !enemy.intent?.canMend) return false;
  const ally = battle.enemies.filter(unit=>unit!==enemy && unit.hp>0 && unit.hp<unit.max)
   .sort((a,b)=>(b.max-b.hp)-(a.max-a.hp))[0];
  if (!ally) return false;
  const restored = Math.min(6,ally.max-ally.hp);
  await animateAction(enemy,ally,'mend',true,()=>{
   ally.hp+=restored;
   flash(ally,'+'+restored,'#ead58d');
  });
  log(enemy.name+' mends '+ally.name+' · '+restored+' HP restored.');
  return true;
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
   [chapel]:'The last chapel defenders fall. The stair beside the altar leads into the tower.'
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
    await journeyCard('The First Wave','The dead surge through the gate. They wound the front rank before the company closes with the defenders.');
    beginEncounter(gate);
    return true;
   case 'fastnessThreshold':
    await journeyCard('The Outer Gate Falls','The exterior guards have fallen. The company crosses the threshold into Valor’s Fastness. Beyond the gate, the defenders still hold the fortress.');
    quest.fastnessGateComplete = true;
    break;
   case 'fastnessHallRoad':
    await travel(hall,328,344);
    break;
   case 'fastnessChapelRoad':
    await travel(chapel,328,344);
    break;
   case 'fastnessHallFight':
   case 'fastnessChapelFight':
    beginEncounter(scene);
    return true;
   case 'fastnessStairs':
    await journeyCard('The Tower Stairs','The company has cleared the lower fortress. Above them, footsteps sound on the stone stairs.');
    quest.fastnessInteriorComplete = true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }

 return {install,load,mapImage,points,target,goal,npcs,drawNPC,combatStats,encounter,enemySupport,afterBattle,interact};
})();
