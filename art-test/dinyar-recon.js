"use strict";

window.DinyarRecon=(()=>{
 const wayside='molthune_waystation',nidal='nidal_arrival_court',ridge='dinyar_ridge';
 const nidalArt='nidal-arrival-court-v1.png',ridgeArt='dinyar-ridge-v1.png';
 const lower='dinyar_lower_works',bridge='dinyar_bridge_ward',court='egorian_westcrown_orders';
 const lowerArt='dinyar-lower-works-v1.png',bridgeArt='dinyar-bridge-ward-v1.png',dragonArt='parnoneryx-v1.png';
 const nidalParty=['draymus'],ridgeParty=['freya','jamal','reese','jason'];
 const dragon='parnoneryx',watch=['fastness_paladin','kantaria_guard'];
 const guardPositions=[[280,168],[376,168]];
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
   points:[{id:'nidalConsult',speaker:'violetta',x:328,y:224,label:'Speak with Violetta about the operation'}]
  };
  scenes[ridge]={
   name:'Isger · Citadel Dinyar',image:ridgeArt,spawn:[328,344],blocks:[],
   walk:[{x:128,y:240,w:416,h:64},{x:176,y:304,w:272,h:16},{x:272,y:320,w:96,h:32},{x:304,y:352,w:48,h:48}],lights:[],
   points:[
    {id:'dinyarView',x:456,y:272,label:'Survey the two keeps'},
    {id:'dinyarPostern',x:152,y:248,label:'Search for the hidden entrance'},
    {id:'dinyarPlan',x:216,y:280,label:'Plan the approach through the lower works'},
    {id:'dinyarDescend',x:152,y:248,label:'Open the hidden entrance'}
   ]
  };
  scenes[lower]={
   name:'Citadel Dinyar · Lower Works',image:lowerArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:160,w:416,h:160},{x:288,y:320,w:80,h:80}],lights:[],
   points:[
    {id:'dinyarWatch',x:328,y:248,label:'Clear the Reclamation watch'},
    {id:'dinyarCells',x:184,y:184,label:'Check the Godclaw cells'},
    {id:'dinyarClimb',x:328,y:168,label:'Climb to the bridge ward'}
   ]
  };
  scenes[bridge]={
   name:'Citadel Dinyar · Bridge Ward',image:bridgeArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:208,w:416,h:128},{x:288,y:336,w:80,h:64}],lights:[],
   points:[
    {id:'dinyarDragon',x:328,y:256,label:'Confront Parnoneryx'},
    {id:'dinyarTrophy',x:328,y:232,label:'Recover Parnoneryx’s head'},
    {id:'dinyarReturn',x:328,y:344,label:'Return to Egorian'}
   ]
  };
  scenes[court]={
   ...scenes.egorian_court,name:'Egorian · Westcrown Orders',
   points:[
    {id:'westcrownCommission',speaker:'corrine',x:328,y:264,label:'Receive Freya’s promotion'},
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
  COMBAT_IDLES[dragon]={src:dragonArt,frames:dragonFrames,cycle:[0,2],maxHeight:Math.max(...dragonFrames.map(frame=>frame.h))};
  MAP_LAYERS[nidal]={foreground:nidalArt,contain:true,background:{type:'solid',color:'#1f1929'}};
  MAP_LAYERS[ridge]={foreground:ridgeArt,contain:true,background:{type:'solid',color:'#242b35'}};
  JOURNEYS[nidal]='14 Gozran, 4717. Draymus, Violetta, and Corrine teleport to Nidal. They seek a physician who can remove Draymus’s brain and keep it alive in a jar.';
  JOURNEYS[ridge]='Meanwhile, Freya, J’Mal, Reese, and Jason reach Citadel Dinyar in Isger. Use Corrine’s directions to find the hidden entrance.';
 }
 async function load(loader){
  await Promise.all([[nidal,nidalArt],[ridge,ridgeArt],[lower,lowerArt],[bridge,bridgeArt],[dragonArt,dragonArt]].map(async ([id,source])=>{art[id]=await loader(source);}));
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
  if(scene===bridge)return quest.dinyarCleared?[]:[{id:dragon,x:328,y:214,height:94,pose:quest.dinyarDragonSlain?'prone':null}];
  return null;
 }
 function points(){
  if(scene===wayside&&quest.molthuneComplete)return [point('dinyarSplit')];
  if(scene===nidal)return [point('nidalConsult')];
  if(scene===ridge)return [point(!quest.dinyarSurveyed?'dinyarView':!quest.dinyarEntranceFound?'dinyarPostern':!quest.dinyarReconComplete?'dinyarPlan':'dinyarDescend')];
  if(scene===lower)return [point(!quest.dinyarWatchCleared?'dinyarWatch':!quest.dinyarCellsChecked?'dinyarCells':'dinyarClimb')];
  if(scene===bridge)return [point(quest.dinyarCleared?'dinyarReturn':quest.dinyarDragonSlain?'dinyarTrophy':'dinyarDragon')];
  if(scene===court)return quest.westcrownDeployed?[]:[point(quest.freyaFieldMarshal?'westcrownDeployment':'westcrownCommission')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===court&&quest.westcrownDeployed?'Field Marshal Freya is bound for Westcrown.':null);}
 function beginFight(kind,ids,opening){
  const {x,y,dir}=units[0];
  const enemies=ids.map(id=>({id,name:NAMES[id],hp:STATS[id].hp,max:STATS[id].hp}));
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
  if(target()?.id!==id)return false;
  switch(id){
   case 'dinyarSplit':
    await say('corrine','A young signifier survived the fall of Dinyar. His officers sent him to warn the capital. He told me how to reach a door hidden in the rock below the keep.');
    await say('violetta','I’ll go with Draymus to Nidal. We need someone who understands what he’s asking of them.');
    await say('freya','Then we split here. Jason, J’Mal, Reese, you’re with me. We’ll see if the signifier’s door still opens.');
    quest.nidalOperationSought=true;
    await travel(nidal,328,344);
    break;
   case 'nidalConsult':
    await say('draymus','Find me someone who can keep a brain alive outside its skull. The rest of me can wait.');
    await say('violetta','I’ll ask who can undertake it. I can make inquiries while I report to my superiors.');
    quest.dinyarReached=true;
    await travel(ridge,328,344);
    break;
   case 'dinyarView':
    await say('jason','Two keeps, one bridge. The Glorious Reclamation can see anyone crossing from either side.');
    await say('freya','They’ve held Dinyar nearly a year. We’ll use the lower route. Reese, J’Mal, find the door.');
    quest.dinyarSurveyed=true;
    break;
   case 'dinyarPostern':
    await say('reese','This is the shelf Corrine described. Look at the joint where the dressed stone meets the rock.');
    await say('jamal','There’s our seam. The signifier knew his keep.');
    quest.dinyarEntranceFound=true;
    break;
   case 'dinyarPlan':
    await say('freya','We go in below their defenses. If any Godclaw Hellknights are still in the dungeons, we find them on the way.');
    quest.dinyarReconComplete=true;
    break;
   case 'dinyarDescend':
    quest.dinyarLowerReached=true;
    await travel(lower,328,344);
    break;
   case 'dinyarWatch':
    await say('jamal','Reclamation colors. We’ll have to get through the watch before we can search the cells.');
    beginFight(lowerBattle,watch,'The Reclamation watch bars the way to the cells.');
    return true;
   case 'dinyarCells':
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
   case 'westcrownDeployment':
    await journeyCard('Orders for Westcrown','16 Gozran, 4717. Field Marshal Freya sets out for Westcrown, still held by the Glorious Reclamation.',()=>{quest.westcrownDeployed=true;});
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact,isDinyarBattle,afterBattle,effect};
})();
