"use strict";

window.SouthRoad = (() => {
 const road='south_road',camp='south_road_camp';
 const escort=['freya','jason','draymus','reese'];
 const images={[road]:'south-road-ambush-v1.png',[camp]:'south-road-camp-v1.png'};
 const atlas='south-road-cavalry-v1.png';
 const combatStats={south_road_knight:{hp:26,ac:14,atk:5,dmg:[1,8,1]}};
 const lanceProfile={name:'Lance',move:'Lance charge',die:8,chargeBonus:2};
 const mountedFrames={
  freya:[[104,10,493,336,270],[809,18,595,333,994],[1574,8,520,345,1718]],
  south_road_knight:[[97,366,464,350,400],[744,373,561,313,1124],[1545,366,480,349,1848]]
 };

 function install() {
  scenes.kantaria_council.points.push({id:'southRoadDeparture',x:328,y:344,label:'Take the South Road'});
  scenes[road]={
   name:'The South Road · Reclamation Roadblock',image:images[road],spawn:[328,344],blocks:[],
   walk:[{x:144,y:160,w:304,h:128},{x:288,y:288,w:64,h:96},{x:272,y:112,w:112,h:48}],
   lights:[[233,62],[409,62],[269,319],[368,319]],
   points:[
    {id:'southRoadScout',x:328,y:232,label:'Hear Reese’s warning'},
    {id:'southRoadInfantry',x:328,y:192,label:'Break the infantry line'},
    {id:'southRoadCavalry',x:328,y:160,label:'Meet the Sword Knights’ charge'},
    {id:'southRoadClerics',x:328,y:128,label:'Cover Reese’s shots'},
    {id:'southRoadHeal',x:424,y:232,label:'Treat Draymus’s wounds'},
    {id:'southRoadCamp',x:328,y:344,label:'Pull off the road for the night'}
   ]
  };
  scenes[camp]={
   name:'The South Road · Night Camp',image:images[camp],spawn:[328,344],blocks:[],
   walk:[{x:192,y:160,w:192,h:128},{x:288,y:288,w:64,h:96}],
   lights:[[181,180],[245,102],[350,101],[433,179]],
   points:[
    {id:'southRoadRest',x:232,y:200,label:'Take the night’s rest'},
    {id:'southRoadDawn',x:328,y:344,label:'Set out for Egorian'}
   ]
  };
  for(const [id,foreground] of Object.entries(images)){
   MAP_LAYERS[id]={foreground,background:{type:'solid',color:id===road?'#1d1a18':'#0f131d'}};
  }
  JOURNEYS[road]='Freya rides Sleipnir ahead of the carriage. Bob and El Guapo drive. Jason, J’Mal, Draymus and Corrine ride with Oppian in the middle seat. Reese keeps watch from above.';
  JOURNEYS[camp]='With the roadblock behind them, the company stops for a short rest. Oppian stays under guard in the carriage.';
  Object.assign(STATS,combatStats);
  NAMES.south_road_knight='Sword Knight';
  for(const [id,rects] of Object.entries(mountedFrames)){
   const frames=rects.map(([x,y,w,h,anchorX])=>({x,y,w,h,anchorX,anchorY:y+h}));
   const model={src:atlas,frames,maxHeight:Math.max(...frames.map(frame=>frame.h)),cycle:[0,2]};
   if(id==='freya')COMBAT_IDLES.south_road_freya=model;
   else{
    COMBAT_IDLES[id]=model;
    FUTURE_NPCS[id]={source:atlas,frame:frames[0]};
   }
  }
 }

 async function load(loader) {
  await Promise.all(Object.entries(images).map(async ([id,image])=>{art[id]=await loader(image);}));
 }
 function mapImage(){return Object.hasOwn(images,scene)?art[scene]:null;}
 function roster(){return scene===road?escort:null;}
 function lance(id,kind){return id==='freya'&&kind==='south_road_knights'?lanceProfile:null;}
 function damageDice(id,kind,spec){
  const profile=lance(id,kind);
  return profile?[spec[0],profile.die,spec[2]+profile.chargeBonus]:spec;
 }
 function points(){
  if(!quest.kantariaDepartureReady)return null;
  if(scene==='kantaria_council')return [point('southRoadDeparture')];
  if(scene===road){
   if(!quest.roadScouted)return [point('southRoadScout')];
   if(!quest.roadInfantryCleared)return [point('southRoadInfantry')];
   if(!quest.roadKnightsCleared)return [point('southRoadCavalry')];
   if(!quest.roadClericsCleared)return [point('southRoadClerics')];
   return [point(quest.roadDraymusTreated?'southRoadCamp':'southRoadHeal')];
  }
  if(scene===camp&&!quest.southRoadComplete)return [point(quest.roadRested?'southRoadDawn':'southRoadRest')];
  return [];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(!quest.kantariaDepartureReady)return null;
  return quest.southRoadComplete?'The West Bridge of Egorian lies ahead.':target()?.label||null;
 }
 function npcs(){
  if(scene!==road)return null;
  if(!quest.roadInfantryCleared){
   const front=[[200,168],[248,184],[408,168],[440,184]];
   const rear=[[216,144],[264,144],[392,144],[424,144]];
   return [...front,...rear].map(([x,y])=>({id:'kantaria_guard',x,y}));
  }
  if(!quest.roadKnightsCleared){
   return [[200,168],[248,152],[392,152],[440,168]].map(([x,y])=>({id:'south_road_knight',x,y}));
  }
  if(!quest.roadClericsCleared)return [{id:'fastness_cleric',x:280,y:128},{id:'fastness_cleric',x:376,y:128}];
  return [];
 }
 function encounter(kind,marked=false){
  const mounted=kind==='south_road_knights';
  const id=mounted?'south_road_knight':'kantaria_guard';
  const max=STATS[id].hp;
  const injury=mounted?10:12;
  return {kind,enemies:Array.from({length:4},(_,i)=>({
   id,name:(mounted?'Sword Knight':'Road Guard')+' '+(i+1),max,hp:max-injury,
   shaken:!mounted&&marked&&i<2?1:0
  }))};
 }
 function begin(kind){
  const {x,y,dir}=units[0];
  save();
  startBattle(0,false,{...encounter(kind,quest.roadSentryMarked),returnPosition:[x,y,dir]});
 }
 async function afterBattle(kind,position){
  const mounted=kind==='south_road_knights';
  quest[mounted?'roadKnightsCleared':'roadInfantryCleared']=true;
  seedParty(...position);
  save();
  await say('Chronicle',mounted?
   'Freya rides down the last of the Sword Knights. The clerics still have the road in sight, and Reese is circling above them.' :
   'The last infantry fall. Four Sword Knights lower their lances and spur their horses forward.');
  paintParty();
  updateObjective();
 }
 function drawCombat(g,actor,position,t){
  const mounted=actor.id==='south_road_knight'||lance(actor.id,battle?.kind);
  if(!mounted)return false;
  const key=actor.id==='freya'?'south_road_freya':actor.id;
  const model=COMBAT_IDLES[key],image=art[model.src];
  if(!image)return false;
  const animation=battle.animation,charging=animation?.actor===actor&&['attack','special'].includes(animation.type);
  const phase=charging?(reduce.matches?1:Math.min(2,Math.floor((performance.now()-animation.start)/animation.duration*3))):
   reduce.matches?0:model.cycle[Math.floor((t+(actor.idleOffset||0))/.72)%model.cycle.length];
  const frame=model.frames[phase],scale=(actor.id==='freya'?100:79)/model.maxHeight;
  const pose=actionPose(actor);
  g.save();
  g.imageSmoothingEnabled=false;
  g.drawImage(image,frame.x,frame.y,frame.w,frame.h,
   Math.round(position.x+pose.dx+(frame.x-frame.anchorX)*scale),
   Math.round(position.y+pose.dy-frame.h*scale),Math.round(frame.w*scale),Math.round(frame.h*scale));
  g.restore();
  return true;
 }
 function recover(fraction){
  for(const id of CORE){
   hp[id]=Math.min(STATS[id].hp,hp[id]+Math.ceil(STATS[id].hp*fraction));
   uses[id]=0;
  }
  mendUses=2;
  quest.mosswaterSpent=0;
  quest.dragonHelmSpent=0;
 }

 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'southRoadDeparture':
    await journeyCard('Ready to Ride','While the carriage is secured, the company dresses its wounds and prepares its spells. Health, spells and gear uses recover. The party keeps its remaining potions.');
    recover(1);
    await travel(road,328,344);
    break;
   case 'southRoadScout':{
    await say('reese','Roadblock ahead. Eight on foot, four mounted Sword Knights and two clerics behind them.');
    await say('freya','Bob, El Guapo, keep the carriage back. J’Mal and Corrine stay with Oppian. Jason, Draymus, with me.');
    if(escort.every(id=>hp[id]===0)){
     hp.freya=1;
     await say('Chronicle','The carriage guard helps Captain Freya back to her feet before the first charge.');
    }
    if(Inventory.weapon(inventory,'reese').name==='Silent Sentry'){
     const choice=await say('reese','Silent Sentry can mark their approach. I’ll get a warning as soon as the front rank moves.',
      ['[Mark the roadblock]','[Keep watch from above]']);
     if(choice===0)quest.roadSentryMarked=true;
    }
    quest.roadScouted=true;
    break;
   }
   case 'southRoadInfantry':
    await journeyCard('Fire on the Road','Jason and Draymus step out of the carriage. Fireballs rain down. Four soldiers fall in the opening blast, and the rest of the infantry scramble to hold their line.');
    begin('south_road_infantry');
    return true;
   case 'southRoadCavalry':
    await journeyCard('The Sword Knights Charge','Jason raises a wall of fire in their path. The four riders force their horses through it. Freya lowers her lance and meets them on Sleipnir.');
    begin('south_road_knights');
    return true;
   case 'southRoadClerics':
    await say('Chronicle','Reese circles above the roadblock and looses arrow after arrow at the two Iomedaean clerics.');
    await storyRoll('Reese · First cleric',17,0,'Reese drops the first cleric');
    await storyRoll('Reese · Second cleric',18,0,'Reese drops the second cleric');
    quest.roadClericsCleared=true;
    break;
   case 'southRoadHeal':{
    await say('draymus','Next time someone calls for a joust, I’d appreciate a little more warning.');
    const healed=await damage([2,8,3],'Treat Draymus');
    hp.draymus=Math.min(STATS.draymus.hp,hp.draymus+healed);
    quest.roadDraymusTreated=true;
    break;
   }
   case 'southRoadCamp':
    await travel(camp,328,344);
    break;
   case 'southRoadRest':
    await journeyCard('A Short Rest','They rest for part of the night, then pack at first light. Recover half of maximum health and refresh spell and gear uses. The potion supply stays as it is.');
    recover(.5);
    quest.roadRested=true;
    break;
   case 'southRoadDawn':
    await journeyCard('Egorian Ahead','By mid-morning the carriage approaches Egorian. Across the West Bridge, the capital stands on the shore of Lake Sorrow.');
    quest.southRoadComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,lance,damageDice,points,target,goal,npcs,encounter,afterBattle,drawCombat,interact,recover,combatStats};
})();
