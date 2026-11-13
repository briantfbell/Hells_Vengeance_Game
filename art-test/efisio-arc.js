"use strict";

window.EfisioArc=(()=>{
 const quay='westcrown_quay',room='egorian_efisio_apartment',street='egorian_efisio_street';
 const efisio='efisio',guard='egorian_bodyguard',portrait='egorian-efisio-v1.png';
 const model={
  src:portrait,frames:[
   {x:50,y:40,w:494,h:656,anchorX:344,anchorY:696},
   {x:620,y:67,w:750,h:629,anchorX:1095,anchorY:696},
   {x:1551,y:40,w:484,h:656,anchorX:1819,anchorY:696}
  ],maxHeight:656,cycle:[0,2],attackFrames:true
 };
 const layouts={
  [room]:{
   name:'Egorian · Efisio’s Apartment',image:'egorian-efisio-apartment-v1.png',spawn:[328,328],
   walk:[{x:80,y:128,w:480,h:224},{x:272,y:352,w:112,h:48}],lights:[[113,90],[208,91],[416,90],[530,94]],
   points:[
    {id:'efisioArrest',x:328,y:176,speaker:efisio,label:'Attempt to arrest Efisio Pera'},
    {id:'efisioRestrainReese',x:407,y:248,label:'Stop Reese without harming him'},
    {id:'efisioFightGuards',x:328,y:200,label:'Defeat Efisio’s guards'},
    {id:'efisioFollowWindow',x:328,y:112,label:'Follow Efisio through the window'}
   ]
  },
  [street]:{
   name:'Egorian · Below the Apartment',image:'egorian-efisio-street-v1.png',spawn:[328,200],
   walk:[{x:96,y:192,w:448,h:144},{x:272,y:336,w:96,h:64}],lights:[[43,179],[278,132],[363,132],[598,179]],
   points:[{id:'efisioStreetFight',x:328,y:248,speaker:efisio,label:'Confront Efisio in the street'}]
  }
 };
 function install(){
  scenes[quay].points.push({id:'efisioLeaveWestcrown',x:576,y:376,label:'Return to Egorian'});
  for(const [id,layout] of Object.entries(layouts)){
   scenes[id]={...layout,blocks:[]};
   MAP_LAYERS[id]={foreground:layout.image,contain:true,background:{type:'solid',color:'#121622'}};
  }
  JOURNEYS[room]='23 Calistril, 4717. Back in Egorian, the company is told to assassinate targets within House Thrune. Instead they go to arrest Efisio Pera, Visperthul’s chief spy.';
  NAMES[efisio]='Efisio Pera';
  STATS[efisio]={hp:23,ac:13,atk:4,dmg:[1,4,2]};
  FUTURE_NPCS[efisio]={source:portrait,frame:model.frames[0]};
  DIALOGUE_FACE_CROPS[efisio]={x:240,y:37,w:167,h:167};
  COMBAT_IDLES[efisio]=model;
 }
 async function load(loader){
  await Promise.all([
   ...Object.entries(layouts).map(async([id,{image}])=>{art[id]=await loader(image);}),
   (async()=>{art[portrait]=await loader(portrait);})()
  ]);
 }
 function mapImage(){return Object.hasOwn(layouts,scene)?art[scene]:null;}
 function roster(){
  if(scene===room&&quest.efisioContractInvoked)
   return (quest.activeRoster||CORE).filter(id=>id!=='reese');
  if(scene===street&&!quest.efisioDefeated)return ['freya'];
  return null;
 }
 function points(){
  if(!quest.westcrownComplete)return null;
  if(scene===quay)return [point('efisioLeaveWestcrown')];
  if(scene===street)return quest.efisioDefeated?[]:[point('efisioStreetFight')];
  if(scene!==room)return null;
  if(!quest.efisioContractInvoked)return [point('efisioArrest')];
  if(!quest.efisioReeseRestrained)return [point('efisioRestrainReese')];
  return [point(quest.efisioGuardsDefeated?'efisioFollowWindow':'efisioFightGuards')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===street&&quest.efisioDefeated?'Freya defeated Efisio Pera in the street.':null);
 }
 function npcs(){
  if(scene===room){
   const actors=quest.efisioGuardsDefeated?[]:[
    {id:efisio,x:328,y:176,height:54},{id:guard,x:250,y:181,height:53},{id:guard,x:406,y:181,height:53}
   ];
   if(quest.efisioContractInvoked)actors.push({id:'reese',x:407,y:248,dir:'left',pose:quest.efisioReeseRestrained?'prone':null});
   return actors;
  }
  if(scene!==street)return null;
  const actors=[{id:efisio,x:328,y:248,height:54,pose:quest.efisioDefeated?'prone':null}];
  for(let row=0;row<3;row++)for(let i=0;i<8;i++){
   const left=i<4;
   actors.push({id:'citizen-efisio-'+row+'-'+i,x:left?110+i*26:449+(i-4)*26,
    y:225+row*37+(i%2)*5,dir:left?'right':'left',variant:(i+row*3)%8});
  }
  return actors;
 }
 function beginFight(kind){
  const {x,y,dir}=units[0];
  const ids=kind==='efisio_guards'?[guard,guard]:[efisio];
  const enemies=ids.map((id,i)=>({id,name:id===guard?'Efisio’s Guard '+(i+1):NAMES[id],
   shortName:id===guard?'Guard '+(i+1):'Efisio',hp:STATS[id].hp,max:STATS[id].hp}));
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
 }
 async function afterBattle(kind,position){
  if(kind==='efisio_guards'){
   quest.efisioGuardsDefeated=true;
   seedParty(...position);
   await say('Chronicle','The guards fall while Reese is held back. Efisio breaks away and dives through the fifth-story window.');
  }else{
   quest.efisioDefeated=true;
   seedParty(...position);
   await say('Chronicle','Freya defeats Efisio in the street. Onlookers crowd the windows and line the cobbles. The rest of the company catches up.');
  }
  NextChapter.syncRoster();
  save();
  updateObjective();
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'efisioLeaveWestcrown':
    quest.efisioApartmentReached=true;
    await travel(room,328,328);
    break;
   case 'efisioArrest':{
    await say('freya','Efisio Pera. You’re coming with us. We won’t touch House Thrune.');
    await say(efisio,'You think your company can just walk away?');
    await say('Chronicle','Visperthul reaches through the bargain made at Fort Arego. Reese turns his bow on the company.');
    quest.efisioContractInvoked=true;
    const {x,y,dir}=units[0];
    seedParty(x,y,dir);
    NextChapter.syncRoster();
    break;
   }
   case 'efisioRestrainReese':
    await say('freya','Alive. Get the bow away from him and hold him until the others are clear.');
    await say('Chronicle','The company manages to restrain Reese. Efisio’s guards move in while he struggles.');
    quest.efisioReeseRestrained=true;
    break;
   case 'efisioFightGuards':
    beginFight('efisio_guards');
    return true;
   case 'efisioFollowWindow':
    if(hp.freya<18){
     await say('Chronicle','Freya binds her wounds at the sill, then goes after Efisio.');
     hp.freya=18;
    }
    await journeyCard('Through the fifth-story window','Efisio drops into the street. Freya follows. She survives the fall and gets back to her feet as people stop to stare.',()=>{
     quest.efisioWindowFollowed=true;
     setScene(street,328,200,'down');
    });
    break;
   case 'efisioStreetFight':
    beginFight('efisio_duel');
    return true;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact,afterBattle};
})();
