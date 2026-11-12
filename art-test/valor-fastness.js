"use strict";

window.FastnessArc = (() => {
 const gate = 'fastness_gate';
 const image = 'valor-fastness-gate-v1.png';
 const defenders = [
  {x:248,y:200}, {x:296,y:184}, {x:360,y:184}, {x:408,y:200}
 ];

 function install() {
  scenes.supply_report.points.push({id:'fastnessRoad',x:328,y:344,label:'Continue to Valor’s Fastness'});
  scenes[gate] = {
   name:'Valor’s Fastness · Outer Gate', image, spawn:[328,344], blocks:[],
   walk:[{x:160,y:176,w:320,h:64},{x:288,y:240,w:64,h:144},{x:304,y:144,w:48,h:32}],
   lights:[[228,137],[414,137],[251,339],[391,339]],
   points:[
    {id:'fastnessMuster',x:328,y:264,label:'Muster the reanimated soldiers'},
    {id:'fastnessCharge',x:328,y:216,label:'Send the undead through the gate'},
    {id:'fastnessThreshold',x:328,y:152,label:'Secure the breach'}
   ]
  };
  MAP_LAYERS[gate] = {foreground:image,background:{type:'solid',color:'#151820'}};
  JOURNEYS[gate] = 'Valor’s Fastness is both a temple of Iomedae and the Reclamation’s main barracks. Its tower rises over Kantaria. The company gathers below its gates.';
 }

 async function load(loader) { art[gate] = await loader(image); }
 function mapImage() { return scene === gate ? art[gate] : null; }

 function points() {
  if (!quest.chapter14Complete) return null;
  if (scene === 'supply_report' && !quest.chapter15) return [point('fastnessRoad')];
  if (scene !== gate || quest.fastnessGateComplete) return [];
  if (!quest.fastnessMustered) return [point('fastnessMuster')];
  if (!quest.fastnessGateCleared) return [point('fastnessCharge')];
  return [point('fastnessThreshold')];
 }

 function target() { return points()?.[0] || null; }
 function goal() {
  if (!quest.chapter14Complete) return null;
  if (quest.fastnessGateComplete) return 'The outer gate is secured. The fortress interior lies ahead.';
  return target()?.label || null;
 }

 function npcs() {
  if (scene !== gate) return null;
  const guards = defenders.map(p => ({...p,id:'kantaria_guard',...(quest.fastnessGateCleared && {hp:0})}));
  if (!quest.fastnessMustered || quest.fastnessGateCleared) return guards;
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

 function encounter() {
  const max = STATS.kantaria_guard.hp;
  return {kind:'fastness_gate',enemies:defenders.map((_,i) => ({
   id:'kantaria_guard',name:'Gate Guard '+(i+1),hp:i<3?max-6:max,max
  }))};
 }

 async function afterBattle(kind) {
  if (kind !== 'fastness_gate') return;
  quest.fastnessGateCleared = true;
  save();
  await say('Chronicle','The last exterior defenders fall. The company has a clear path into the fortress.');
  paintParty();
  updateObjective();
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
    save();
    startBattle(0,false,encounter());
    return true;
   case 'fastnessThreshold':
    await journeyCard('The Outer Gate Falls','The exterior guards have fallen. The company crosses the threshold into Valor’s Fastness. Beyond the gate, the defenders still hold the fortress.');
    quest.fastnessGateComplete = true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }

 return {install,load,mapImage,points,target,goal,npcs,drawNPC,encounter,afterBattle,interact};
})();
