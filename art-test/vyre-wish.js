"use strict";

window.VyreWish=(()=>{
 const mansion='egorian_sethic_mansion',room='vyre_wish_room',manticce='manticce';
 const image='vyre-wish-room-v1.png',portrait='vyre-manticce-v1.png';
 const cot=[562,170],bobStanding=[542,200];
 const castDuration=1380;
 let cast=null;

 function install(){
  scenes[mansion].points.push({id:'vyreWishDepart',x:328,y:392,label:'Follow El Guapo’s lead to Vyre'});
  scenes[room]={
   name:'Vyre · Manticce’s Meeting Room',image,spawn:[328,344],blocks:[],
   walk:[{x:128,y:160,w:352,h:192},{x:480,y:192,w:96,h:96},{x:480,y:288,w:64,h:64},{x:288,y:352,w:64,h:48}],lights:[[115,86],[525,84],[56,172],[31,208],[609,208]],
   points:[
    {id:'vyreWishRequest',speaker:manticce,x:264,y:169,label:'Ask Manticce for a Wish'},
    {id:'vyreWishUse',x:cot[0],y:cot[1],label:'Use the Wish to heal Bob'},
    {id:'vyreWishHearBob',speaker:'bob',x:bobStanding[0],y:bobStanding[1],label:'Speak to Bob Applewood'}
   ]
  };
  MAP_LAYERS[room]={foreground:image,contain:true,background:{type:'solid',color:'#181c24'}};
  JOURNEYS[room]='26 Pharast, 4717. Bob is still unresponsive. In Vyre, El Guapo turns to Manticce for help.';
  NAMES[manticce]='Manticce';
  FUTURE_NPCS[manticce]={source:portrait,frame:{x:190,y:4,w:549,h:1532}};
  DIALOGUE_FACE_CROPS[manticce]={x:376,y:8,w:243,h:243};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[room]=await loader(image);})(),
   (async()=>{art[portrait]=await loader(portrait);})()
  ]);
 }
 function mapImage(){return scene===room?art[room]:null;}
 function roster(){return scene===room?['guapo']:null;}
 function points(){
  if(scene===mansion&&quest.sethicMansionComplete)return [point('vyreWishDepart')];
  if(scene!==room)return null;
  if(quest.vyreWishComplete)return [];
  return [point(!quest.vyreWishGranted?'vyreWishRequest':!quest.vyreBobHealed?'vyreWishUse':'vyreWishHearBob')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===room&&quest.vyreWishComplete?'Bob Applewood has recovered.':null);}
 function npcs(){
  if(scene!==room)return null;
  const rising=cast?.epoch===epoch&&!reduce.matches?Math.max(0,Math.min(1,((performance.now()-cast.at)/castDuration-.55)/.45)):0;
  const progress=quest.vyreBobHealed?1:rising;
  return [
   {id:manticce,x:264,y:169,height:59},
   {id:'bob',x:cot[0]+(bobStanding[0]-cot[0])*progress,y:cot[1]+(bobStanding[1]-cot[1])*progress,
    height:progress?Math.round(30+16*progress):46,pose:progress?null:'prone'}
  ];
 }
 function effects(g){
  if(scene!==room||cast?.epoch!==epoch)return;
  const t=(performance.now()-cast.at)/1000;
  if(t>=1.4)return;
  const reduced=reduce.matches,progress=reduced?.45:t/1.4;
  g.save();
  g.globalAlpha=.75*(1-progress);
  for(let i=0;i<24;i++){
   const angle=i*2.39996+progress*2.4,radius=8+i%7*3+progress*8;
   const x=cot[0]-12+Math.cos(angle)*radius,y=cot[1]-9+Math.sin(angle)*radius*.55-progress*(i%5)*6;
   g.fillStyle=i%3?'#e5cd8a':'#fff1c5';
   g.fillRect(Math.round(x),Math.round(y),i%4===0?3:2,i%3===0?3:2);
  }
  g.restore();
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'vyreWishDepart':
    await say('jamal','El Guapo sent word from Vyre. He knows someone who might help Bob.');
    await say('freya','Then get Bob there. We’ll keep Sethic under guard.');
    quest.vyreWishReached=true;
    await travel(room,328,344);
    break;
   case 'vyreWishRequest':
    await say('guapo','If anyone asks where I’ve been, it ends with a customs officer taking orders from a goose in a wig.');
    await say(manticce,'I’ll spare you the trouble of telling it. You came here for Bob.');
    await say('guapo','He’s alive, but he hasn’t answered anyone since we found him. I need a Wish.');
    await say(manticce,'You have it. Use it for him.');
    quest.vyreWishGranted=true;
    break;
   case 'vyreWishUse': {
    await say('guapo','I wish for Bob Applewood to be whole again.');
    const token=epoch;
    cast={epoch:token,at:performance.now()};
    await delay(reduce.matches?650:castDuration);
    if(token!==epoch)return false;
    cast=null;
    quest.vyreBobHealed=true;
    save();
    await say('Chronicle','Bob draws a steady breath, opens his eyes, and slowly gets to his feet.');
    break;
   }
   case 'vyreWishHearBob':
    await say('bob','Guapo? Where are we?');
    await say('guapo','Vyre. Take your time, Bob.');
    quest.vyreWishComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,interact};
})();
