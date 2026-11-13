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
 const basin={x:320,y:108,outline:[[251,109],[256,95],[285,86],[355,86],[383,95],[389,109],[355,126],[285,126]]};
 const paladinPosition={x:328,y:216};
 let staging=null;
 const party=['jamal','jason','reese','draymus'];
 const blink={x:466,safeX:532,impact:.62,duration:1650};
 const sentries=[[168,201],[240,185],[328,174],[416,185],[488,201]];
 const frames=[
  {x:106,y:6,w:464,h:679,anchorX:337,anchorY:685},
  {x:740,y:4,w:575,h:681,anchorX:1079,anchorY:685},
  {x:1500,y:26,w:625,h:659,anchorX:1812,anchorY:685}
 ];

 function install(){
  scenes[orders].points.push({id:'ilniusCutaway',x:328,y:344,marker:{x:328,y:374},label:'Follow the expedition to St. Ilnius'});
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
  COMBAT_IDLES[paladin]={src:paladinArt,deferred:true,frames:paladinFrames,cycle:[0,2],flipX:true,attackFrames:true,maxHeight:Math.max(...paladinFrames.map(frame=>frame.h))};
  MAP_LAYERS[forest]={foreground:forestArt,contain:true,background:{type:'solid',color:'#182729'}};
  MAP_LAYERS[shrine]={foreground:shrineArt,contain:true,background:{type:'solid',color:'#242833'}};
  JOURNEYS[forest]='16 Gozran, 4717. In Nidal, the company heads to St. Ilnius Fountain, an Iomedaean holy site. The fountain is part of the Tathlum ritual.';
  JOURNEYS[shrine]='The trail leads to a stone court. Five statues guard the fountain and the way into the temple.';
  NAMES.bruce='Bruce';
  NAMES[statue]='Archon Statue';
  STATS[statue]={hp:21,ac:13,atk:4,dmg:[1,6,1]};
  FUTURE_NPCS[statue]={source:statueArt,frame:frames[0]};
  COMBAT_IDLES[statue]={src:statueArt,deferred:true,frames,cycle:[0,2],attackFrames:true,maxHeight:Math.max(...frames.map(frame=>frame.h))};
 }
 async function load(loader){
  await Promise.all([[forest,forestArt],[shrine,shrineArt],[statueArt,statueArt],[temple,templeArt],[paladinArt,paladinArt],[headArt,headArt]].map(async ([id,source])=>{art[id]=await loader(source);}));
 }
 function mapImage(){return [forest,shrine,temple].includes(scene)?art[scene]:null;}
 function roster(){return [forest,shrine,temple].includes(scene)?party:null;}
 function npcs(){
  if(scene===forest)return [{id:'bruce',x:456,y:240,dir:'down'}];
  if(scene===temple){
   const fallen=quest.ilniusPaladinSlain||(stageProgress('strike')??0)>=.52;
   return [{id:paladin,...paladinPosition,height:60,pose:fallen?'prone':null}];
  }
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
  const enemies=sentries.map((_,i)=>({id:statue,name:'Archon Statue '+(i+1),shortName:'Statue '+(i+1),hp:max,max}));
  save();
  startBattle(0,false,{kind:battleKind,enemies,returnPosition:[x,y,dir],opening:'The five archon statues come to life. Read their intentions before committing your attacks.'});
 }
 async function openingStrike(current){
  if(current.kind!==battleKind)return;
  const token=epoch;
  const duration=reduce.matches?620:blink.duration;
  const impact=Math.round(duration*blink.impact);
  current.blink={at:null,duration,attacker:current.enemies[3]};
  try{
   await say('Chronicle','The five statues stir. An archon raises its hammer as Bruce crosses the court.');
   if(token!==epoch||battle!==current)return;
   current.blink.at=performance.now();
   await delay(impact);
   if(token!==epoch||battle!==current)return;
   GameAudio.effect('hit');
   await delay(duration-impact);
   if(token!==epoch||battle!==current)return;
   current.blink.escaped=true;
   await say('Chronicle','Bruce casts Blink. The hammer crashes into the stone where he stood.');
  }finally{
   delete current.blink;
  }
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
 const clamp=value=>Math.max(0,Math.min(1,value));
 function stageProgress(kind){
  if(scene!==temple||staging?.kind!==kind||staging.epoch!==epoch)return null;
  return clamp((performance.now()-staging.at)/staging.duration);
 }
 async function stageAction(kind,actor,x,y,duration){
  const token=epoch;
  const length=reduce.matches?450:duration;
  staging={kind,actor,x,y,epoch:token,at:performance.now(),duration:length};
  const impact=Math.round(length*.52);
  await delay(impact);
  if(token!==epoch)return false;
  GameAudio.effect(kind==='strike'?'hit':'spell');
  await delay(length-impact);
  return token===epoch;
 }
 function stagePose(unit){
  if(!staging||unit.id!==staging.actor)return unit;
  const p=stageProgress(staging.kind);
  if(p===null)return unit;
  const outward=clamp(p/.42),back=clamp((p-.76)/.24);
  const distance=reduce.matches?1:outward*(1-back);
  const x=unit.x+(staging.x-unit.x)*distance,y=unit.y+(staging.y-unit.y)*distance;
  const walking=!reduce.matches&&(p<.42||p>.76);
  const dx=staging.x-unit.x,dy=staging.y-unit.y;
  const dir=walking?(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'))
   :staging.kind==='strike'?'right':'up';
  const opposite={up:'down',down:'up',left:'right',right:'left'};
  return {...unit,x,y,dir:back?opposite[dir]:dir,step:walking,anim:p*2,
   lunge:!reduce.matches&&staging.kind==='strike'&&p>=.42&&p<.60?.22*(p-.42)/.18:0};
 }
 function drawStrike(g){
  const p=stageProgress('strike');
  if(reduce.matches||p===null||p<.48||p>.68)return;
  g.save();
  g.globalAlpha=1-(p-.48)/.20;
  g.strokeStyle='#ffdeb1';
  g.lineWidth=3;
  g.beginPath();
  g.moveTo(301,176);
  g.quadraticCurveTo(321,176,345,195);
  g.stroke();
  g.restore();
 }
 function drawRite(g,t){
  if(scene!==temple)return;
  const p=stageProgress('rite');
  const progress=quest.ilniusDefiled?1:p===null?0:clamp((p-.48)/.26);
  if(!progress&&(p===null||p<.32))return;
  const {x,y,outline}=basin;
  if(progress){
   g.save();
   g.beginPath();
   for(const [index,[px,py]] of outline.entries()){
    if(index===0)g.moveTo(px,py);else g.lineTo(px,py);
   }
   g.closePath();
   g.clip();
   g.fillStyle='#49192c';
   g.globalAlpha=.88;
   g.beginPath();
   g.ellipse(x,y,77*progress,25*progress,0,0,2*Math.PI);
   g.fill();
   if(!reduce.matches){
    for(let i=0;i<12;i++){
     const age=(t*.55+i/12)%1;
     g.globalAlpha=progress*(1-age)*.5;
     g.fillStyle='#b66b73';
     g.fillRect(x-55+i*10,y-12+i%4*7+Math.round(age*4),3+i%3,1);
    }
   }
   g.restore();
  }
  const im=art[headArt];
  if(!im||p===null||p>=.78)return;
  const lift=clamp((p-.32)/.2),sink=clamp((p-.52)/.26);
  const w=45,h=w*im.height/im.width;
  g.save();
  g.globalAlpha=1-sink;
  g.drawImage(im,x+43*(1-lift)-w/2,y+58*(1-lift)-h+sink*14,w,h);
  g.restore();
 }
 function blinkPhase(){
  const opening=battle?.blink;
  if(!opening||opening.at===null)return 0;
  if(opening.escaped)return 1;
  return reduce.matches?blink.impact:clamp((performance.now()-opening.at)/opening.duration);
 }
 function openingPose(unit){
  if(unit!==battle?.blink?.attacker)return null;
  const phase=blinkPhase();
  if(phase<.22||phase>.88)return null;
  const swing=clamp((phase-.22)/.40)*(1-clamp((phase-blink.impact)/.26));
  return {frame:1,dx:reduce.matches?0:-24*swing,dy:reduce.matches?0:46*swing,tilt:0};
 }
 function drawSupport(g){
  if(!battle?.blink)return;
  const phase=blinkPhase(),y=battlefieldHeight()-101;
  const moving=phase>=.39&&phase<.55;
  const escaped=phase>=.55;
  const x=escaped?blink.safeX:blink.x;
  g.save();
  g.globalAlpha=moving?.35:1;
  drawActor(g,{id:'bruce',x,y,dir:'up',step:null,anim:0},65);
  g.restore();
  if(phase<.32||phase>.89)return;
  g.save();
  const shimmer=clamp((phase-.32)/.15)*(1-clamp((phase-.58)/.25));
  g.globalAlpha=shimmer*.8;
  for(let i=0;i<12;i++){
   const angle=i*Math.PI/6,radius=14+shimmer*16+i%2*6;
   g.fillStyle=i%3?'#b9d8ff':'#eee8cd';
   g.fillRect(Math.round(blink.x+Math.cos(angle)*radius),Math.round(y-31+Math.sin(angle)*radius),3,2);
  }
  if(phase>=blink.impact){
   const strike=clamp((phase-blink.impact)/.27);
   g.globalAlpha=(1-strike)*.9;
   g.strokeStyle='#e6bd82';
   g.lineWidth=2;
   if(!reduce.matches&&strike<.55){
    g.beginPath();
    g.moveTo(blink.x+23,y-65);
    g.quadraticCurveTo(blink.x-25,y-39,blink.x,y-4);
    g.stroke();
   }
   g.beginPath();
   g.ellipse(blink.x,y-2,7+22*strike,3+8*strike,0,0,2*Math.PI);
   g.stroke();
   g.fillStyle='#d8c7a1';
   for(let i=0;i<8;i++){
    const angle=i*Math.PI/4;
    g.fillRect(Math.round(blink.x+Math.cos(angle)*(8+19*strike)),
     Math.round(y-5+Math.sin(angle)*(4+9*strike)),3,2);
   }
  }
  g.restore();
 }
 async function afterBattle(kind,position){
  seedParty(...position);
  if(kind===templeBattle){
   if(hp.jamal===0){
    await say('Chronicle','The company helps J’Mal to his feet as Sylvestra’s defense falters.');
    hp.jamal=1;
   }
   if(!await stageAction('strike','jamal',304,232,1250))return;
   quest.ilniusPaladinSlain=true;
   staging=null;
  }else quest.ilniusStatuesCleared=true;
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
    startBattle(0,false,{kind:templeBattle,enemies:[{id:paladin,name:NAMES[paladin],shortName:'Sylvestra',hp:max,max,resolve:true}],
     returnPosition:[x,y,dir],opening:'Break Sylvestra’s resolve. Her bow targets one party member at a time.'});
    return true;
   }
   case 'ilniusRite': {
    if(hp.jason===0){
     hp.jason=1;
     await say('Chronicle','Jason steadies himself and takes the burden to the basin.');
    }
    await say('jason','Bring me Parnoneryx’s head. I’ll finish what we came here to do.');
    if(!await stageAction('rite','jason',368,181,1900))return false;
    quest.ilniusDefiled=true;
    staging=null;
    save();
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
 return {install,load,mapImage,roster,npcs,points,target,goal,interact,isBattle,openingStrike,drawWater,drawRite,drawStrike,stagePose,openingPose,drawSupport,afterBattle};
})();
