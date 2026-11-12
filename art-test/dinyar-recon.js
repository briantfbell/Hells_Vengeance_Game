"use strict";

window.DinyarRecon=(()=>{
 const wayside='molthune_waystation',nidal='nidal_arrival_court',ridge='dinyar_ridge';
 const nidalArt='nidal-arrival-court-v1.png',ridgeArt='dinyar-ridge-v1.png',posternArt='dinyar-ridge-postern-v1.png';
 const posternOutline=[[172,214],[199,205],[202,242],[195,248],[173,248]];
 const posternDuration=850,departureDuration=1400;
 const posternRange=32,darkvisionRange=384;
 const cellDoors=[48,106,161,217,423,477,533,588];
 const nidalTravelers=['draymus','violetta','corrine'];
 let opening=null,departure=null,cellVision=null;
 const lower='dinyar_lower_works',bridge='dinyar_bridge_ward',court='egorian_westcrown_orders';
 const lowerArt='dinyar-lower-works-v1.png',bridgeArt='dinyar-bridge-ward-v1.png',dragonArt='parnoneryx-v1.png';
 const nidalParty=['draymus'],ridgeParty=['freya','jamal','reese','jason'];
 const dragon='parnoneryx',watch=['fastness_paladin','kantaria_guard'];
 const fallenDragon='parnoneryx_fallen',recoveredDragon='parnoneryx_head_recovered';
 const fallenArt='parnoneryx-fallen-intact-v1.png',recoveredArt='parnoneryx-fallen-after-recovery-v2.png';
 const fallenFrame={x:0,y:0,w:1920,h:819};
 const guardPositions=[[280,168],[376,168]];
 const watchLabels={fastness_paladin:'Paladin',kantaria_guard:'Guard'};
 const lowerBattle='dinyar_watch',dragonBattle='dinyar_parnoneryx';
 const dragonFrames=[
  {x:18,y:90,w:670,h:557,anchorX:350,anchorY:647},
  {x:700,y:130,w:746,h:517,anchorX:1072,anchorY:647},
  {x:1474,y:29,w:688,h:618,anchorX:1818,anchorY:647}
 ];

 function install(){
  scenes[wayside].points.push({id:'dinyarSplit',speaker:'corrine',x:216,y:232,label:'Plan the two missions'});
  scenes[nidal]={
   name:'Nidal · Arrival Court',image:nidalArt,spawn:[328,344],blocks:[],
   walk:[{x:144,y:160,w:352,h:160},{x:240,y:320,w:160,h:80}],lights:[],
   points:[{id:'nidalConsult',speaker:'violetta',x:328,y:224,label:'Ask Violetta to find a physician'}]
  };
  scenes[ridge]={
   name:'Isger · Citadel Dinyar',image:ridgeArt,spawn:[328,344],blocks:[],
   walk:[{x:128,y:240,w:416,h:64},{x:176,y:304,w:272,h:16},{x:272,y:320,w:96,h:32},{x:304,y:352,w:48,h:48}],lights:[],
   points:[
    {id:'dinyarView',x:456,y:272,label:'Survey the two keeps'},
    {id:'dinyarPostern',x:184,y:248,label:'Search for the hidden entrance'},
    {id:'dinyarPlan',x:216,y:280,label:'Plan the approach through the lower works'},
    {id:'dinyarOpenPostern',x:184,y:248,label:'Open the hidden entrance'},
    {id:'dinyarDescend',x:184,y:248,label:'Enter the lower works'}
   ]
  };
  scenes[lower]={
   name:'Citadel Dinyar · Lower Works',image:lowerArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:160,w:416,h:160},{x:288,y:320,w:80,h:80}],lights:[],
   points:[
    {id:'dinyarWatch',x:328,y:248,label:'Clear the Reclamation watch'},
    {id:'dinyarCells',x:184,y:184,label:'Check the Godclaw cells'},
    {id:'dinyarCellsEast',x:456,y:184,label:'Check the Godclaw cells'},
    {id:'dinyarClimb',x:328,y:168,label:'Climb to the bridge ward'}
   ]
  };
  scenes[bridge]={
   name:'Citadel Dinyar · Bridge Ward',image:bridgeArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:208,w:416,h:128},{x:288,y:336,w:80,h:64}],lights:[],
   points:[
    {id:'dinyarDragon',x:328,y:256,label:'Confront Parnoneryx'},
    {id:'dinyarTrophy',x:280,y:256,label:'Recover Parnoneryx’s head'},
    {id:'dinyarReturn',x:328,y:344,label:'Return to Egorian'}
   ]
  };
  scenes[court]={
   ...scenes.egorian_court,name:'Egorian · Westcrown Orders',
   points:[
    {id:'westcrownCommission',speaker:'corrine',x:328,y:264,label:'Receive Freya’s promotion'},
    {id:'dinyarDispatch',x:216,y:264,label:'Read the Dinyar dispatch'},
    {id:'westcrownDeployment',x:328,y:344,label:'Depart for Westcrown'}
   ]
  };
  MAP_LAYERS[court]=MAP_LAYERS.egorian_court;
  JOURNEYS[court]='16 Gozran, 4717. After the victory at Dinyar, Freya is summoned to Egorian. The Glorious Reclamation still holds Westcrown.';
  MAP_LAYERS[lower]={foreground:lowerArt,contain:true,background:{type:'solid',color:'#1b2028'}};
  MAP_LAYERS[bridge]={foreground:bridgeArt,contain:true,background:{type:'solid',color:'#242b35'}};
  JOURNEYS[lower]='15 Gozran, 4717. The company passes through the hidden door and enters the lower works. Search for Godclaw prisoners and find a route above.';
  JOURNEYS[bridge]='The stairs open onto the bridge ward between the two keeps. A gold dragon blocks the crossing.';
  NAMES[dragon]='Parnoneryx';
  STATS[dragon]={hp:86,ac:15,atk:7,dmg:[1,8,3]};
  FUTURE_NPCS[dragon]={source:dragonArt,frame:dragonFrames[0]};
  FUTURE_NPCS[fallenDragon]={source:fallenArt,frame:fallenFrame};
  FUTURE_NPCS[recoveredDragon]={source:recoveredArt,frame:fallenFrame};
  COMBAT_IDLES[dragon]={src:dragonArt,deferred:true,frames:dragonFrames,cycle:[0,2],maxHeight:Math.max(...dragonFrames.map(frame=>frame.h))};
  MAP_LAYERS[nidal]={foreground:nidalArt,contain:true,background:{type:'solid',color:'#1f1929'}};
  MAP_LAYERS[ridge]={foreground:ridgeArt,contain:true,background:{type:'solid',color:'#242b35'}};
  JOURNEYS[nidal]='14 Gozran, 4717. Draymus, Violetta, and Corrine arrive in Nidal. As Draymus, speak with Violetta about finding a physician for his operation.';
  JOURNEYS[ridge]='While Violetta seeks a physician in Nidal, Freya leads J’Mal, Reese, and Jason to Citadel Dinyar in Isger. Take over as Freya’s scouting party and use Corrine’s directions to find the hidden entrance.';
 }
 async function load(loader){
  const assets=[[nidal,nidalArt],[ridge,ridgeArt],[lower,lowerArt],[bridge,bridgeArt],
   [dragonArt,dragonArt],[fallenArt,fallenArt],[recoveredArt,recoveredArt],[posternArt,posternArt]];
  await Promise.all(assets.map(async ([id,source])=>{art[id]=await loader(source);}));
 }
 function mapImage(){return scene===court?art.egorian_court:[nidal,ridge,lower,bridge].includes(scene)?art[scene]:null;}
 function roster(){
  if(scene===nidal)return nidalParty;
  if(scene===court)return ['freya'];
  if([ridge,lower,bridge].includes(scene))return ridgeParty;
  return null;
 }
 function npcs(){
  if(scene===wayside&&quest.molthuneComplete)return [
   {id:'corrine',x:216,y:200,height:53},{id:'violetta',x:456,y:193,height:57}
  ];
  if(scene===nidal)return [
   {id:'violetta',x:328,y:192,height:57},{id:'corrine',x:392,y:208,height:53}
  ];
  if(scene===court)return [{id:'corrine',x:328,y:232,height:58}];
  if(scene===ridge)return [];
  if(scene===lower)return watch.map((id,i)=>({id,x:guardPositions[i][0],y:guardPositions[i][1],height:55,pose:quest.dinyarWatchCleared?'prone':null}));
  if(scene===bridge){
   if(!quest.dinyarDragonSlain)return [{id:dragon,x:328,y:214,height:94}];
   return [{id:quest.dinyarCleared?recoveredDragon:fallenDragon,x:344,y:264,height:72}];
  }
  return null;
 }
 function parallelObjective(){
  if(scene===nidal)return 'Isger · Freya, J’Mal, Reese, and Jason are scouting Citadel Dinyar.';
  if(scene===ridge)return 'Nidal · Violetta and Corrine are helping Draymus find a physician.';
  return null;
 }
 function points(){
  if(scene===wayside&&quest.molthuneComplete)return [point('dinyarSplit')];
  if(scene===nidal)return [point('nidalConsult')];
  if(scene===ridge){
   const id=!quest.dinyarSurveyed?'dinyarView':!quest.dinyarEntranceFound?'dinyarPostern':
    !quest.dinyarReconComplete?'dinyarPlan':quest.dinyarPosternOpen?'dinyarDescend':'dinyarOpenPostern';
   const stop=point(id);
   return [id==='dinyarPostern'&&quest.dinyarBeltHintSeen?{...stop,label:'Check the seam Freya noticed'}:stop];
  }
  if(scene===lower){
   if(!quest.dinyarWatchCleared)return [point('dinyarWatch')];
   if(!quest.dinyarCellsChecked)return [point('dinyarCells'),point('dinyarCellsEast')];
   return [point('dinyarClimb')];
  }
  if(scene===bridge)return [point(quest.dinyarCleared?'dinyarReturn':quest.dinyarDragonSlain?'dinyarTrophy':'dinyarDragon')];
  if(scene===court){
   if(quest.westcrownDeployed)return [];
   if(!quest.freyaFieldMarshal)return [point('westcrownCommission')];
   const orders=[point('westcrownDeployment')];
   if(!quest.dinyarDispatchRead)orders.push(point('dinyarDispatch'));
   return orders;
  }
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===court&&quest.freyaFieldMarshal&&!quest.westcrownDeployed&&!quest.dinyarDispatchRead)return 'Read the Dinyar dispatch or depart for Westcrown.';
  return target()?.label||(scene===court&&quest.westcrownDeployed?'Field Marshal Freya is bound for Westcrown.':null);
 }
 function beginFight(kind,ids,opening){
  const {x,y,dir}=units[0];
  const enemies=ids.map(id=>({id,name:NAMES[id],shortName:watchLabels[id],hp:STATS[id].hp,max:STATS[id].hp}));
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir],opening});
 }
 function isDinyarBattle(kind){return kind===lowerBattle||kind===dragonBattle;}
 async function afterBattle(kind,position){
  if(kind===lowerBattle)quest.dinyarWatchCleared=true;
  if(kind===dragonBattle)quest.dinyarDragonSlain=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  if(kind===dragonBattle)await say('Chronicle','Parnoneryx falls. The company holds the crossing.');
 }
 function departureProgress(){
  if(scene!==wayside||departure?.epoch!==epoch)return null;
  return Math.min(1,(performance.now()-departure.at)/departureDuration);
 }
 function departurePose(unit){
  if(!nidalTravelers.includes(unit.id))return null;
  const progress=departureProgress();
  if(progress===null)return null;
  const fade=Math.max(0,Math.min(1,(progress-.38)/.42));
  return {x:0,y:-Math.round(fade*9),opacity:1-fade};
 }
 function drawDeparture(g){
  const progress=departureProgress();
  if(progress===null)return;
  const travelers=[...units,...npcs()].filter(unit=>nidalTravelers.includes(unit.id));
  const glow=Math.sin(Math.PI*progress);
  g.save();
  g.globalCompositeOperation='lighter';
  for(const [index,{x,y}] of travelers.entries()){
   const radius=14+12*progress;
   const light=g.createRadialGradient(x,y,1,x,y,radius);
   light.addColorStop(0,'#b993eb');
   light.addColorStop(1,'#614c8d00');
   g.globalAlpha=.68*glow;
   g.fillStyle=light;
   g.fillRect(x-radius,y-radius,radius*2,radius*2);
   for(let i=0;i<12;i++){
    const angle=i*1.8+progress*6+index,spread=8+i%4*4;
    const px=x+Math.cos(angle)*spread,py=y+Math.sin(angle)*6-progress*(22+i*3);
    g.fillStyle=i%3?'#cfb5fc':'#f4ddad';
    g.fillRect(Math.round(px),Math.round(py),2,2+i%3);
   }
  }
  g.restore();
 }
 async function departForNidal(){
  const token=epoch;
  GameAudio.effect('spell');
  if(!reduce.matches){
   departure={epoch:token,at:performance.now()};
   await delay(departureDuration);
   if(token!==epoch)return false;
  }
  try{
   quest.nidalOperationSought=true;
   await travel(nidal,328,344);
   return true;
  }finally{
   if(departure?.epoch===token)departure=null;
  }
 }
 function runeBearer(){
  if(!quest.tathlumHuntComplete||quest.tathlumDuels!==3||hp.freya<=0)return null;
  return units.find(unit=>unit.id==='freya')||null;
 }
 function visibleCellDoors(){
  if(scene!==lower)return [];
  const freya=runeBearer();
  return freya?cellDoors.filter(x=>Math.hypot(freya.x-x,freya.y-134)<=darkvisionRange):[];
 }
 function drawCellVision(g){
  const doors=visibleCellDoors();
  if(!doors.length||!art[lower])return;
  if(!cellVision){
   cellVision=document.createElement('canvas');
   cellVision.width=640;cellVision.height=400;
   const view=cellVision.getContext('2d');
   view.filter='grayscale(1) brightness(1.85)';
   SceneLayers.foreground(view,art[lower],{contain:true});
  }
  g.save();
  g.beginPath();
  for(const x of doors){
   g.moveTo(x-15,151);g.lineTo(x-15,121);g.quadraticCurveTo(x,99,x+15,121);
   g.lineTo(x+15,151);g.closePath();
  }
  g.clip();
  g.drawImage(cellVision,0,0);
  g.restore();
 }
 function canSensePostern(){
  if(scene!==ridge||!quest.dinyarSurveyed||quest.dinyarEntranceFound||quest.dinyarBeltHintSeen)return false;
  const freya=runeBearer();
  const entrance=point('dinyarPostern');
  return !!freya&&Math.hypot(freya.x-entrance.x,freya.y-entrance.y)<=posternRange;
 }
 async function sensePostern(){
  if(!canSensePostern())return;
  const token=epoch;
  await storyRoll('Freya · Cave Giant rune',12,5,'Hidden masonry detected');
  if(token!==epoch)return;
  await say('freya','The belt’s rune picked up something in that stonework. J’Mal, Reese, take a look.');
  if(token!==epoch)return;
  quest.dinyarBeltHintSeen=true;
  save();
  updateObjective();
 }
 function drawPostern(g){
  if(scene!==ridge||!art[posternArt])return;
  if(quest.dinyarBeltHintSeen&&!quest.dinyarEntranceFound){
   g.save();
   g.strokeStyle='#e7bd72';
   g.globalAlpha=.5;
   g.beginPath();
   g.moveTo(178,221);g.lineTo(194,216);g.lineTo(195,240);
   g.stroke();
   g.restore();
  }
  const animating=opening?.epoch===epoch;
  const progress=quest.dinyarPosternOpen?1:animating?Math.min(1,(performance.now()-opening.at)/posternDuration):0;
  if(progress<=0)return;
  g.save();
  g.beginPath();
  for(const [index,[x,y]] of posternOutline.entries()){
   if(index===0)g.moveTo(x,y);else g.lineTo(x,y);
  }
  g.closePath();
  g.clip();
  g.beginPath();
  g.rect(172,205,30*progress,43);
  g.clip();
  SceneLayers.foreground(g,art[posternArt],{contain:true});
  g.restore();
 }
 function effect(g,action){
  if(action.type!=='parnoneryx_breath')return false;
  const phase=reduce.matches ? .62 : CombatArt.phase(action);
  const from=battlePosition(action.actor),to=battlePosition(action.target);
  const pose=actionPose(action.actor),startX=from.x+pose.dx-78,startY=from.y+pose.dy-from.height*.24;
  const endY=to.y-to.height*.47+(action.hit?0:22);
  g.save();
  g.globalAlpha=phase<.22?0:Math.max(0,Math.sin(phase*Math.PI))*.86;
  for(let i=0;i<34;i++){
   const travel=(phase-.22)*2.45-i*.023;
   if(travel<0||travel>1)continue;
   const spread=(i%7-3)*travel*4;
   const x=startX+(to.x-startX)*travel;
   const y=startY+(endY-startY)*travel+spread;
   const size=3+i%5;
   g.fillStyle=['#f9e091','#f8a144','#df512f','#a82f26'][i%4];
   g.fillRect(Math.round(x),Math.round(y),size*2,size);
  }
  g.restore();
  return true;
 }
 async function interact(id){
  if(!points()?.some(p=>p?.id===id))return false;
  switch(id){
   case 'dinyarSplit':
    await say('corrine','A young signifier survived the fall of Dinyar. His officers sent him to warn the capital. He told me how to reach a door hidden in the rock below the keep.');
    await say('violetta','I’ll go with Draymus to Nidal. We need someone who understands what he’s asking of them.');
    await say('freya','Then we split here. Jason, J’Mal, Reese, you’re with me. We’ll see if the signifier’s door still opens.');
    if(!await departForNidal())return false;
    break;
   case 'nidalConsult':
    await say('draymus','I want a physician who can remove my brain and keep it alive in a jar. Can you find someone in Nidal who knows how?');
    await say('violetta','I’ll ask when I report to my superiors. Freya’s party can scout Dinyar while we look.');
    quest.dinyarReached=true;
    await travel(ridge,328,344);
    break;
   case 'dinyarView':
    await say('jason','Two keeps, one bridge. The Glorious Reclamation can see anyone crossing from either side.');
    await say('freya','They’ve held Dinyar nearly a year. We’ll use the lower route. Reese, J’Mal, find the door.');
    quest.dinyarSurveyed=true;
    break;
   case 'dinyarPostern':
    await sensePostern();
    await say('reese','This is the shelf Corrine described. Look at the joint where the dressed stone meets the rock.');
    await say('jamal','There’s our seam. The signifier knew his keep.');
    quest.dinyarEntranceFound=true;
    break;
   case 'dinyarPlan':
    await say('freya','We go in below their defenses. If any Godclaw Hellknights are still in the dungeons, we find them on the way.');
    quest.dinyarReconComplete=true;
    break;
   case 'dinyarOpenPostern': {
    const token=epoch;
    if(!reduce.matches){
     opening={epoch:token,at:performance.now()};
     await delay(posternDuration);
     if(token!==epoch)return false;
    }
    quest.dinyarPosternOpen=true;
    opening=null;
    break;
   }
   case 'dinyarDescend':
    quest.dinyarLowerReached=true;
    await travel(lower,328,344);
    break;
   case 'dinyarWatch':
    await say('jamal','Reclamation colors. We’ll have to get through the watch before we can search the cells.');
    beginFight(lowerBattle,watch,'The Reclamation watch bars the way to the cells.');
    return true;
   case 'dinyarCells':
   case 'dinyarCellsEast':
    if(visibleCellDoors().some(x=>Math.abs(x-point(id).x)<72)){
     await say('freya','I can see past the bars into the shadows. No movement in these cells.');
    }
    await say('reese','No one answers from these cells. If anyone survived, they’re farther in.');
    quest.dinyarCellsChecked=true;
    break;
   case 'dinyarClimb':
    quest.dinyarBridgeReached=true;
    await travel(bridge,328,344);
    break;
   case 'dinyarDragon':
    await say('freya','That’s Parnoneryx. Spread out and watch his jaws.');
    beginFight(dragonBattle,[dragon],'Parnoneryx holds the bridge. Watch his next attack and guard whoever he targets.');
    return true;
   case 'dinyarTrophy':
    await say('Chronicle','With Citadel Dinyar cleared, the company takes the gold dragon’s head.');
    quest.dinyarCleared=true;
    break;
   case 'dinyarReturn':
    quest.westcrownOrdersReached=true;
    await travel(court,328,344);
    break;
   case 'westcrownCommission':
    await say('corrine','By order of the Crown, you are promoted to Field Marshal. Your assignment is Westcrown.');
    await say('freya','The Reclamation still has the city?');
    await say('corrine','They’ve held it since the second of Gozran. That’s where the Crown is sending you.');
    quest.freyaFieldMarshal=true;
    break;
   case 'dinyarDispatch':
    await journeyCard('Dinyar dispatch · Hellknight Scipio','Citadel Dinyar has been cleared and Parnoneryx’s head recovered. The company’s notes call for Hellknight Scipio to be brought back to life. His resurrection remains unresolved.',()=>{});
    quest.dinyarDispatchRead=true;
    break;
   case 'westcrownDeployment':
    await journeyCard('Orders for Westcrown','16 Gozran, 4717. Field Marshal Freya sets out for Westcrown, still held by the Glorious Reclamation.',()=>{quest.westcrownDeployed=true;});
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,parallelObjective,points,target,goal,interact,isDinyarBattle,afterBattle,drawDeparture,departurePose,canSensePostern,sensePostern,drawPostern,visibleCellDoors,drawCellVision,effect};
})();
