"use strict";

window.IlniusFountain=(()=>{
 const orders='egorian_westcrown_orders',forest='ilnius_forest',shrine='ilnius_shrine';
 const forestArt='ilnius-forest-v1.png',shrineArt='ilnius-shrine-v1.png',statueArt='ilnius-statue-v1.png';
 const temple='ilnius_inner_temple',templeArt='ilnius-inner-temple-v1.png';
 const paladinArt='ilnius-sylvestra-v1.png',headArt='parnoneryx-head-v1.png';
 const statue='ilnius_archon_statue',battleKind='ilnius_archons',paladin='ilnius_sylvestra',templeBattle='ilnius_paladin';
 const paladinFrames=[
  {x:144,y:10,w:430,h:704,anchorX:330,anchorY:714},
  {x:790,y:0,w:564,h:714,anchorX:1030,anchorY:714},
  {x:1518,y:44,w:586,h:670,anchorX:1810,anchorY:714}
 ];
 let rite=null;
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
    {id:'ilniusWard',x:328,y:224,label:'Check the inner entrance'},
    {id:'ilniusEnterTemple',x:328,y:224,label:'Enter the inner temple'}
   ]
  };
  scenes[temple]={
   name:'St. Ilnius · Inner Temple',image:templeArt,spawn:[328,344],blocks:[],
   walk:[{x:144,y:176,w:352,h:160},{x:272,y:336,w:112,h:64}],lights:[],
   points:[
    {id:'ilniusPaladin',speaker:paladin,x:328,y:248,label:'Confront Sylvestra Hanel'},
    {id:'ilniusRite',x:328,y:200,label:'Have Jason defile the basin'},
    {id:'ilniusLibrary',speaker:'draymus',x:424,y:272,label:'Review the last Tathlum component'}
   ]
  };
  MAP_LAYERS[temple]={foreground:templeArt,contain:true,background:{type:'solid',color:'#20202b'}};
  JOURNEYS[temple]='20 Gozran, 4717. The company enters the inner temple with Parnoneryx’s head. An Iomedaean paladin guards the sanctuary.';
  NAMES[paladin]='Sylvestra Hanel';
  STATS[paladin]={hp:70,ac:16,atk:7,dmg:[1,8,4]};
  FUTURE_NPCS[paladin]={source:paladinArt,frame:paladinFrames[0]};
  DIALOGUE_FACE_CROPS[paladin]={x:226,y:6,w:225,h:225};
  COMBAT_IDLES[paladin]={src:paladinArt,frames:paladinFrames,cycle:[0,2],flipX:true,attackFrames:true,maxHeight:Math.max(...paladinFrames.map(frame=>frame.h))};
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
  await Promise.all([[forest,forestArt],[shrine,shrineArt],[statueArt,statueArt],[temple,templeArt],[paladinArt,paladinArt],[headArt,headArt]].map(async ([id,source])=>{art[id]=await loader(source);}));
 }
 function mapImage(){return [forest,shrine,temple].includes(scene)?art[scene]:null;}
 function roster(){return [forest,shrine,temple].includes(scene)?party:null;}
 function npcs(){
  if(scene===forest)return [{id:'bruce',x:456,y:240,dir:'down'}];
  if(scene===temple)return [{id:paladin,x:328,y:216,height:60,pose:quest.ilniusPaladinSlain?'prone':null}];
  if(scene!==shrine)return null;
  const figures=sentries.map(([x,y])=>({id:statue,x,y,height:53,pose:quest.ilniusStatuesCleared?'prone':null}));
  return figures.concat({id:'bruce',x:456,y:296,dir:'up'});
 }
 function points(){
  if(scene===orders&&quest.westcrownDeployed)return [point('ilniusCutaway')];
  if(scene===forest)return [point(quest.ilniusBruceMet?'ilniusCross':'ilniusMeetBruce')];
  if(scene===shrine)return [point(quest.ilniusWardChecked?'ilniusEnterTemple':quest.ilniusStatuesCleared?'ilniusWard':'ilniusWake')];
  if(scene===temple)return quest.ilniusTempleComplete?[]:[point(!quest.ilniusPaladinSlain?'ilniusPaladin':!quest.ilniusDefiled?'ilniusRite':'ilniusLibrary')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===temple&&quest.ilniusTempleComplete?'The temple is defiled. An ancient library is the last component.':null);}
 function isBattle(kind){return kind===battleKind||kind===templeBattle;}
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[statue].hp;
  const enemies=sentries.map((_,i)=>({id:statue,name:'Archon Statue '+(i+1),hp:max,max}));
  save();
  startBattle(0,false,{kind:battleKind,enemies,returnPosition:[x,y,dir],opening:'The five archon statues come to life. Read their intentions before committing your attacks.'});
 }
 async function openingStrike(current){
  if(current.kind!==battleKind)return;
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
 function drawRite(g,t){
  if(scene!==temple)return;
  const progress=quest.ilniusDefiled?1:rite?.epoch===epoch?Math.min(1,(performance.now()-rite.at)/1400):0;
  if(progress<=0)return;
  const im=art[headArt],x=320,y=109;
  g.save();
  g.globalAlpha=progress*.83;
  g.fillStyle='#431927';
  g.beginPath();
  g.ellipse(x,y,56*progress,13*progress,0,0,2*Math.PI);
  g.fill();
  if(im){
   const w=45,h=w*im.height/im.width;
   g.globalAlpha=1-progress*.44;
   g.drawImage(im,x-w/2,y-h+Math.round(progress*12),w,h);
  }
  if(!reduce.matches){
   g.globalAlpha=.38;
   g.fillStyle='#a14b51';
   for(let i=0;i<8;i++){
    const age=(t*.8+i/8)%1;
    g.fillRect(x-28+i*8,y-Math.round(age*13),2,1);
   }
  }
  g.restore();
 }
 function drawSupport(g){
  if(battle?.kind!==battleKind||battle.blinkAt===undefined)return;
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
 async function afterBattle(kind,position){
  if(kind===templeBattle){
   if(hp.jamal===0){
    await say('Chronicle','The company helps J’Mal to his feet as Sylvestra’s defense falters.');
    hp.jamal=1;
   }
   quest.ilniusPaladinSlain=true;
  }else quest.ilniusStatuesCleared=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  if(kind===templeBattle)await say('Chronicle','Sylvestra’s defense breaks. J’Mal closes the distance and delivers the killing blow.');
  else await say('bruce','I’d rather not find out what that first blow would’ve done.');
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
   case 'ilniusEnterTemple':
    SouthRoad.recover(1);
    quest.ilniusTempleReached=true;
    await travel(temple,328,344);
    break;
   case 'ilniusPaladin': {
    await say(paladin,'Lay down what you brought here. The Inheritor’s sanctuary is closed to you.');
    const {x,y,dir}=units[0],max=STATS[paladin].hp;
    save();
    startBattle(0,false,{kind:templeBattle,enemies:[{id:paladin,name:NAMES[paladin],hp:max,max,resolve:true}],
     returnPosition:[x,y,dir],opening:'Break Sylvestra’s resolve. Her bow targets one party member at a time.'});
    return true;
   }
   case 'ilniusRite': {
    if(hp.jason===0){
     hp.jason=1;
     await say('Chronicle','Jason steadies himself and takes the burden to the basin.');
    }
    await say('jason','Bring me Parnoneryx’s head. I’ll finish what we came here to do.');
    const token=epoch;
    rite={at:performance.now(),epoch:token};
    GameAudio.effect('spell');
    await delay(reduce.matches?400:1400);
    if(token!==epoch)return false;
    quest.ilniusDefiled=true;
    await say('Chronicle','Jason lowers the dragon’s head into the basin. The water darkens and the consecration breaks.');
    break;
   }
   case 'ilniusLibrary':
    await say('draymus','The rite is still missing one component. We need an ancient library.');
    quest.ilniusTempleComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact,isBattle,openingStrike,drawWater,drawRite,drawSupport,afterBattle};
})();
