"use strict";

window.Rachikan=(()=>{
 const deck='ballerina_deck',ruins='rachikan_ruins',pirate='rachikan_pirate',kind='rachikan_raid';
 const map='rachikan-ruins-v1.png',sheet='rachikan-pirates-v1.png';
 const model={src:sheet,frames:[
  {x:0,y:22,w:630,h:701,anchorX:379,anchorY:723},
  {x:670,y:63,w:760,h:660,anchorX:1078,anchorY:723},
  {x:1480,y:12,w:670,h:711,anchorX:1841,anchorY:723}
 ],maxHeight:711,cycle:[0,2],attackFrames:true};
 const piratePositions=[[220,184],[286,168],[380,168],[446,184]];

 function install(){
  scenes[deck].points.push({id:'rachikanLand',x:456,y:232,label:'Follow the pirate trail to Rachikan'});
  scenes[ruins]={
   name:'Rachikan · Coastal Ruins',image:map,spawn:[328,344],
   walk:[{x:160,y:144,w:320,h:160},{x:256,y:304,w:128,h:32},{x:288,y:336,w:64,h:64}],blocks:[],
   lights:[[122,143],[250,74],[468,83],[526,166],[272,317],[360,318]],
   points:[
    {id:'rachikanSurvey',x:328,y:272,label:'Scout the pirate storehouse'},
    {id:'rachikanRaid',x:328,y:216,label:'Break the pirate operation'},
    {id:'rachikanCount',x:328,y:248,label:'Speak to Draymus about the dead'}
   ]
  };
  MAP_LAYERS[ruins]={foreground:map,contain:true,background:{
   type:'ocean',speed:3,palette:['#142730','#203640','#3b5056','#566a70']
  }};
  JOURNEYS[ruins]='15 Pharast, 4717. The pirate trail leads the company to the Rachikan Ruins. Land and find the operation’s shore base.';
  NAMES[pirate]='Rachikan Pirate';
  FUTURE_NPCS[pirate]={source:sheet,frame:model.frames[0]};
  COMBAT_IDLES[pirate]=model;
  STATS[pirate]={hp:21,ac:14,atk:5,dmg:[1,6,2]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[ruins]=await loader(map);})(),
   (async()=>{art[sheet]=await loader(sheet);})()
  ]);
 }
 function mapImage(){return scene===ruins?art[scene]:null;}
 function roster(){
  if(scene!==ruins)return null;
  if(quest.rachikanComplete)return ['draymus'];
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===deck&&quest.ballerinaWatchTaken)return [point('rachikanLand')];
  if(scene!==ruins)return null;
  if(quest.rachikanComplete)return [];
  if(!quest.rachikanSurveyed)return [point('rachikanSurvey')];
  return [point(quest.rachikanRaidWon?'rachikanCount':'rachikanRaid')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===ruins&&quest.rachikanComplete?'The pirate operation is broken. Draymus remains at the ruins.':null);}
 function npcs(){
  if(scene!==ruins)return null;
  return piratePositions.map(([x,y],i)=>({
   id:pirate,x,y:quest.rachikanRaidWon?y+i%2*16:y,height:54,
   pose:quest.rachikanRaidWon?'prone':null
  }));
 }
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[pirate].hp;
  const enemies=piratePositions.map((_,i)=>({id:pirate,name:'Rachikan Pirate '+(i+1),shortName:'Pirate '+(i+1),hp:max,max}));
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
 }
 async function afterBattle(position){
  quest.rachikanRaidWon=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle','The last defenders fall. The pirates’ operation at Rachikan is broken.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'rachikanLand':
    await say('ballerina_quartermaster','There’s the landing. If those ruins are where the pirates run their supplies, that’s where you’ll find their watch.');
    quest.rachikanReached=true;
    await travel(ruins,328,344);
    break;
   case 'rachikanSurvey':
    await say('jamal','Crates up against the old wall. The pirates have posted a watch between them and the landing.');
    await say('freya','Take the courtyard. Once we hold it, they can’t use this landing to supply their ships.');
    quest.rachikanSurveyed=true;
    break;
   case 'rachikanRaid':
    beginFight();
    return true;
   case 'rachikanCount':
    await say('Chronicle','The fighting across the ruins leaves forty bodies.');
    await say('draymus','Go on without me. I’ll stay with the dead.');
    await journeyCard('Rachikan · Forty corpses','The company heads back to the ship. Draymus stays behind at the ruins with the forty dead.',()=>{
     quest.rachikanComplete=true;
     seedParty(328,248,'up');
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,afterBattle,interact};
})();
