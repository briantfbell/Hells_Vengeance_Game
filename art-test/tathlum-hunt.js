"use strict";

window.TathlumHunt=(()=>{
 const pass='menador_pass',orders='tathlum_orders',village='nidal_hunt_village',cave='nidal_giant_lair';
 const townArt='tathlum-nidal-village-v1.png',caveArt='tathlum-cave-lair-v1.png',sheet='tathlum-cave-giant-v1.png';
 const giant='tathlum_cave_giant',kind='tathlum_giant_duel';
 const model={src:sheet,frames:[
  {x:4,y:17,w:617,h:670,anchorX:371,anchorY:680},
  {x:633,y:47,w:811,h:640,anchorX:1130,anchorY:680},
  {x:1480,y:24,w:660,h:663,anchorX:1865,anchorY:680}
 ],maxHeight:670,cycle:[0,2],attackFrames:true};
 const duels=()=>quest.tathlumDuels??0;

 function install(){
  scenes[pass].points.push({id:'tathlumReturn',x:328,y:344,label:'Return to Egorian for new orders'});
  scenes[orders]={
   ...scenes.egorian_court,name:'Egorian · The Tathlum Orders',points:[
    {id:'tathlumReceiveOrders',speaker:'corrine',x:328,y:272,label:'Receive the Tathlum assignment'},
    {id:'tathlumDepartNidal',x:328,y:344,label:'Set out for Nidal'}
   ]
  };
  scenes[village]={
   name:'Nidal · Village on the Giant Trail',image:townArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:160,w:416,h:112},{x:192,y:272,w:240,h:48},{x:272,y:320,w:80,h:80},{x:288,y:128,w:64,h:32}],lights:[[177,122],[247,122],[393,116],[559,188]],
   points:[
    {id:'tathlumThrall',x:216,y:200,label:'Investigate the cave-giant attacks'},
    {id:'tathlumTrack',x:328,y:152,label:'Follow Reese and the thrall'}
   ]
  };
  scenes[cave]={
   name:'Nidal · Cave-Giant Lair',image:caveArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:144,w:416,h:160},{x:208,y:304,w:224,h:32},{x:288,y:336,w:64,h:64}],lights:[[212,80],[239,96],[422,93],[453,73]],
   points:[
    {id:'tathlumBait',x:328,y:248,label:'Send the thrall in as bait'},
    {id:'tathlumDuel',x:328,y:216,label:'Challenge a cave giant'},
    {id:'tathlumRunes',x:328,y:216,label:'Inspect the belt’s new runes'}
   ]
  };
  MAP_LAYERS[orders]=MAP_LAYERS.egorian_court;
  MAP_LAYERS[village]={foreground:townArt,contain:true,background:{type:'solid',color:'#18232d'}};
  MAP_LAYERS[cave]={foreground:caveArt,contain:true,background:{type:'solid',color:'#161c23'}};
  JOURNEYS[orders]='4 Gozran, 4717. Freya returns to Egorian for the Queen’s next assignment.';
  JOURNEYS[village]='8 Gozran, 4717. The company passes within sight of Citadel Gheistano and avoids Nidalese patrols. It stops at a village near the reported cave-giant attacks.';
  JOURNEYS[cave]='With Reese scouting ahead, the company follows the trail to the giants’ lair.';
  NAMES[giant]='Cave Giant';
  FUTURE_NPCS[giant]={source:sheet,frame:model.frames[0]};
  COMBAT_IDLES[giant]=model;
  STATS[giant]={hp:13,ac:12,atk:5,dmg:[1,8,2]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[village]=await loader(townArt);})(),
   (async()=>{art[cave]=await loader(caveArt);})(),
   (async()=>{art[sheet]=await loader(sheet);})()
  ]);
 }
 function mapImage(){
  if(scene===orders)return art.egorian_court;
  return scene===village||scene===cave?art[scene]:null;
 }
 function roster(){
  if(scene===cave&&quest.tathlumBaitSet&&duels()<3)return ['freya'];
  if(![orders,village,cave].includes(scene))return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===pass&&quest.menadorComplete)return [point('tathlumReturn')];
  if(scene===orders)return [point(quest.tathlumBriefed?'tathlumDepartNidal':'tathlumReceiveOrders')];
  if(scene===village)return [point(quest.tathlumThrallMade?'tathlumTrack':'tathlumThrall')];
  if(scene!==cave)return null;
  if(quest.tathlumHuntComplete)return [];
  if(!quest.tathlumBaitSet)return [point('tathlumBait')];
  return [point(duels()<3?'tathlumDuel':'tathlumRunes')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===cave&&quest.tathlumHuntComplete)return 'The cave-giant hunt is complete. The company prepares to turn south.';
  return target()?.id==='tathlumDuel'?'Freya’s cave-giant duels ['+duels()+'/3]':target()?.label||null;
 }
 function npcs(){
  if(scene===orders)return [{id:'corrine',x:328,y:240,height:58}];
  if(scene===village)return [
   {id:'citizen-nidal-thrall',x:quest.tathlumThrallMade?321:218,y:quest.tathlumThrallMade?130:173,dir:'down',variant:6},
   {id:'citizen-nidal-villager',x:489,y:235,dir:'left',variant:1}
  ];
  if(scene!==cave)return null;
  if(!quest.tathlumBaitSet)return [{id:'citizen-nidal-thrall',x:328,y:224,dir:'up',variant:6}];
  return [[270,168],[328,151],[385,173]].map(([x,y],i)=>({
   id:giant,x,y,height:75,pose:i<duels()?'prone':null
  }));
 }
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[giant].hp;
  save();
  startBattle(0,false,{kind,enemies:[{id:giant,name:'Cave Giant '+(duels()+1),shortName:'Cave Giant',hp:max,max}],
   returnPosition:[x,y,dir],opening:'Freya takes the giant in single combat.'});
 }
 function isHuntBattle(value){return value===kind;}
 async function afterBattle(position){
  quest.tathlumDuels=duels()+1;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  if(duels()===3)await say('Chronicle','The last giant falls. New runes come to life on Freya’s dwarven champion’s belt.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'tathlumReturn':
    quest.tathlumOrdersReached=true;
    await travel(orders,328,344);
    break;
   case 'tathlumReceiveOrders':
    await say('corrine','The Queen has raised you to Lieutenant Colonel. She orders you to assemble the ingredients for a Tathlum.');
    await say('freya','The old Kellid rite. How much power is she asking for?');
    await say('corrine','Her list calls for stronger ingredients than the old accounts. We don’t know what that will do. Start in Nidal. Hunt cave giants, cyclopes and trolls, and scout the sacred fountain.');
    quest.tathlumBriefed=true;
    break;
   case 'tathlumDepartNidal':
    SouthRoad.recover(1);
    quest.tathlumNidalReached=true;
    await travel(village,328,344);
    break;
   case 'tathlumThrall':
    await say('Chronicle','Looking for the giants’ latest attack, Draymus murders a man and animates the body. He orders his new thrall to show them where the giants struck.');
    await say('reese','Let it show us the spot. I’ll take the trail from there.');
    quest.tathlumThrallMade=true;
    break;
   case 'tathlumTrack':
    await say('reese','Fresh tracks go up into the hills. Stay low and keep behind me.');
    quest.tathlumLairReached=true;
    await travel(cave,328,344);
    break;
   case 'tathlumBait': {
    await say('draymus','Go in. Make enough noise that they all look your way.');
    await say('Chronicle','The thrall draws the cave giants out. Freya takes the opening and challenges them one at a time.');
    const {x,y,dir}=units[0];
    quest.tathlumBaitSet=true;
    seedParty(x,y,dir);
    break;
   }
   case 'tathlumDuel':
    beginFight();
    return true;
   case 'tathlumRunes':
    await say('freya','The cave-giant rune has awakened. We’ve done what we came to do at this lair.');
    quest.tathlumHuntComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,isHuntBattle,afterBattle,interact};
})();
