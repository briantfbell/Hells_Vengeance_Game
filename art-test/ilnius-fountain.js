"use strict";

window.IlniusFountain=(()=>{
 const orders='egorian_westcrown_orders',forest='ilnius_forest',shrine='ilnius_shrine';
 const forestArt='ilnius-forest-v1.png',shrineArt='ilnius-shrine-v1.png',statueArt='ilnius-statue-v1.png';
 const statue='ilnius_archon_statue',battleKind='ilnius_archons';
 const party=['jamal','jason','reese','draymus'];
 const sentries=[[168,201],[240,185],[328,174],[416,185],[488,201]];
 const frames=[
  {x:106,y:6,w:464,h:679,anchorX:337,anchorY:685},
  {x:740,y:4,w:575,h:681,anchorX:1079,anchorY:685},
  {x:1500,y:26,w:625,h:659,anchorX:1812,anchorY:685}
 ];

 function install(){
  scenes[orders].points.push({id:'ilniusCutaway',x:328,y:344,label:'Follow the expedition to St. Ilnius'});
  scenes[forest]={
   name:'Nidal · St. Ilnius’s Forest',image:forestArt,spawn:[328,344],blocks:[],
   walk:[{x:144,y:192,w:352,h:128},{x:256,y:320,w:112,h:80},{x:288,y:144,w:80,h:48},{x:320,y:128,w:64,h:16}],lights:[],
   points:[
    {id:'ilniusMeetBruce',speaker:'bruce',x:456,y:272,label:'Rendezvous with Bruce'},
    {id:'ilniusCross',x:344,y:136,label:'Follow the creek to the shrine'}
   ]
  };
  scenes[shrine]={
   name:'Nidal · St. Ilnius Fountain',image:shrineArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:208,w:416,h:128},{x:288,y:336,w:80,h:64}],lights:[],
   points:[
    {id:'ilniusWake',x:328,y:240,label:'Approach the fountain’s guardians'},
    {id:'ilniusWard',x:328,y:224,label:'Check the inner entrance'}
   ]
  };
  MAP_LAYERS[forest]={foreground:forestArt,contain:true,background:{type:'solid',color:'#182729'}};
  MAP_LAYERS[shrine]={foreground:shrineArt,contain:true,background:{type:'solid',color:'#242833'}};
  JOURNEYS[forest]='16 Gozran, 4717. In Nidal, the company heads to St. Ilnius Fountain, an Iomedaean holy site. The fountain is part of the Tathlum ritual.';
  JOURNEYS[shrine]='The trail leads to a stone court. Five statues guard the fountain and the way into the temple.';
  NAMES.bruce='Bruce';
  NAMES[statue]='Archon Statue';
  STATS[statue]={hp:21,ac:13,atk:4,dmg:[1,6,1]};
  FUTURE_NPCS[statue]={source:statueArt,frame:frames[0]};
  COMBAT_IDLES[statue]={src:statueArt,frames,cycle:[0,2],attackFrames:true,maxHeight:Math.max(...frames.map(frame=>frame.h))};
 }
 async function load(loader){
  await Promise.all([[forest,forestArt],[shrine,shrineArt],[statueArt,statueArt]].map(async ([id,source])=>{art[id]=await loader(source);}));
 }
 function mapImage(){return scene===forest||scene===shrine?art[scene]:null;}
 function roster(){return scene===forest||scene===shrine?party:null;}
 function npcs(){
  if(scene===forest)return [{id:'bruce',x:456,y:240,dir:'down'}];
  if(scene!==shrine)return null;
  const figures=sentries.map(([x,y])=>({id:statue,x,y,height:53,pose:quest.ilniusStatuesCleared?'prone':null}));
  return figures.concat({id:'bruce',x:456,y:296,dir:'up'});
 }
 function points(){
  if(scene===orders&&quest.westcrownDeployed)return [point('ilniusCutaway')];
  if(scene===forest)return [point(quest.ilniusBruceMet?'ilniusCross':'ilniusMeetBruce')];
  if(scene!==shrine)return null;
  if(quest.ilniusWardChecked)return [];
  return [point(quest.ilniusStatuesCleared?'ilniusWard':'ilniusWake')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===shrine&&quest.ilniusWardChecked?'The statues are down. The inner temple lies ahead.':null);}
 function isBattle(kind){return kind===battleKind;}
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[statue].hp;
  const enemies=sentries.map((_,i)=>({id:statue,name:'Archon Statue '+(i+1),hp:max,max}));
  save();
  startBattle(0,false,{kind:battleKind,enemies,returnPosition:[x,y,dir],opening:'The five archon statues come to life. Read their intentions before committing your attacks.'});
 }
 async function openingStrike(current){
  if(!isBattle(current.kind))return;
  const token=epoch;
  await say('Chronicle','The five statues stir. They strike together before Bruce can clear the court.');
  current.blinkAt=performance.now();
  await delay(reduce.matches?480:1100);
  if(token!==epoch||battle!==current)return;
  delete current.blinkAt;
  await say('Chronicle','Bruce casts Blink. The blow passes through the space where he stood.');
 }
 function drawWater(g,t){
  if(scene!==shrine||reduce.matches)return;
  g.save();
  g.fillStyle='#a4d8f4';
  for(let i=0;i<7;i++){
   const age=(t*.7+i/7)%1;
   g.globalAlpha=Math.sin(age*Math.PI)*.42;
   g.fillRect(290+i*9,Math.round(88+i%3*3+age*6),2+i%3,1);
  }
  g.restore();
 }
 function drawSupport(g){
  if(!isBattle(battle?.kind)||battle.blinkAt===undefined)return;
  const p=reduce.matches ? .52 : Math.min(1,(performance.now()-battle.blinkAt)/1100);
  const x=497,y=battlefieldHeight()-110;
  g.save();
  g.globalAlpha=p<.3 ? 1 : p>.68 ? .68 : .17;
  drawActor(g,{id:'bruce',x:x+(p>.68?38:0),y,dir:'up',step:null,anim:0},65);
  g.globalAlpha=Math.sin(p*Math.PI)*.8;
  for(let i=0;i<18;i++){
   const angle=i*Math.PI/9,radius=9+p*36+i%3*6;
   g.fillStyle=i%3?'#c4d3f5':'#f6dd8a';
   g.fillRect(Math.round(x+Math.cos(angle)*radius),Math.round(y-36+Math.sin(angle)*radius),3,2);
  }
  g.restore();
 }
 async function afterBattle(position){
  quest.ilniusStatuesCleared=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  await say('bruce','I’d rather not find out what that first blow would’ve done.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'ilniusCutaway':
    quest.ilniusForestReached=true;
    await travel(forest,328,344);
    break;
   case 'ilniusMeetBruce':
    await say('bruce','You’re on the right trail. Follow the creek and you’ll reach the fountain.');
    await say('jason','We need the fountain for the rite. Keep the dragon’s head covered until we’re inside.');
    quest.ilniusBruceMet=true;
    break;
   case 'ilniusCross':
    quest.ilniusShrineReached=true;
    await travel(shrine,328,344);
    break;
   case 'ilniusWake':
    await say('reese','Five stone archons. They all face the entrance.');
    beginFight();
    return true;
   case 'ilniusWard':
    await say('jamal','The statues are down. There’s still a way into the temple.');
    quest.ilniusWardChecked=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact,isBattle,openingStrike,drawWater,drawSupport,afterBattle};
})();
