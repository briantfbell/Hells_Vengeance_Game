"use strict";

window.Ballerina=(()=>{
 const tavern='hinji_tavern',quay='corentyn_quay',deck='ballerina_deck',quarter='ballerina_quartermaster';
 const quayImage='corentyn-quay-v1.png',deckImage='ballerina-deck-v1.png',quarterImage='ballerina-quartermaster-v1.png';

 function install(){
  scenes[tavern].points.push({id:'ballerinaLeaveHinji',x:328,y:376,label:'Travel to Corentyn'});
  scenes[quay]={
   name:'Corentyn · Cargo Quay',image:quayImage,spawn:[328,344],
   walk:[{x:80,y:144,w:448,h:192},{x:280,y:336,w:96,h:64}],blocks:[],
   lights:[[82,86],[82,224],[445,94]],
   points:[{id:'ballerinaSignOn',speaker:quarter,x:488,y:216,label:'Sign on as guards aboard the Ballerina'}]
  };
  scenes[deck]={
   name:'The Ballerina · Cargo Deck',image:deckImage,spawn:[328,232],
   walk:[{x:128,y:144,w:368,h:128}],blocks:[{x:208,y:144,w:48,h:48},{x:384,y:144,w:48,h:48}],lights:[],
   points:[
    {id:'ballerinaInspectCargo',x:184,y:168,label:'Inspect the cargo lashings'},
    {id:'ballerinaTakeWatch',speaker:quarter,x:456,y:200,label:'Take the coastal watch'}
   ]
  };
  MAP_LAYERS[quay]={foreground:quayImage,contain:true,background:{type:'solid',color:'#21333c'}};
  MAP_LAYERS[deck]={foreground:deckImage,contain:true,background:{
   type:'ocean',speed:4,palette:['#142934','#1f3b47','#365760','#587b82']
  }};
  JOURNEYS[quay]='13 Pharast, 4717. The company reaches Corentyn. The Ballerina, a cargo ship bound for Pezzack, is taking on guards.';
  JOURNEYS[deck]='The Ballerina casts off from Corentyn. Check the deck before taking the watch up the coast.';
  NAMES[quarter]='Quartermaster';
  FUTURE_NPCS[quarter]={source:quarterImage,frame:{x:169,y:5,w:641,h:1521}};
  DIALOGUE_FACE_CROPS[quarter]={x:375,y:15,w:244,h:244};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[quay]=await loader(quayImage);})(),
   (async()=>{art[deck]=await loader(deckImage);})(),
   (async()=>{art[quarterImage]=await loader(quarterImage);})()
  ]);
 }
 function mapImage(){return scene===quay||scene===deck?art[scene]:null;}
 function roster(){
  if(scene!==quay&&scene!==deck)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===tavern&&quest.hinjiTavernArrested)return [point('ballerinaLeaveHinji')];
  if(scene===quay)return [point('ballerinaSignOn')];
  if(scene!==deck)return null;
  if(quest.ballerinaWatchTaken)return [];
  return [point(quest.ballerinaCargoChecked?'ballerinaTakeWatch':'ballerinaInspectCargo')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===deck&&quest.ballerinaWatchTaken?'The watch is set. The Ballerina sails up the coast.':null);}
 function npcs(){
  if(scene===quay)return [
   {id:quarter,x:488,y:184,height:57},
   {id:'citizen-corentyn-1',x:181,y:190,dir:'down',variant:5},
   {id:'citizen-corentyn-2',x:431,y:303,dir:'left',variant:2}
  ];
  if(scene===deck)return [{id:quarter,x:456,y:167,height:57}];
  return null;
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'ballerinaLeaveHinji':
    quest.corentynReached=true;
    await travel(quay,328,344);
    break;
   case 'ballerinaSignOn':
    await say('freya','We’re bound for Pezzack. Put us down as ship guards.');
    await say(quarter,'The Ballerina sails with the tide. Keep the walk clear and report to me once you’ve checked the lashings.');
    quest.ballerinaBoarded=true;
    await travel(deck,328,232);
    break;
   case 'ballerinaInspectCargo':
    await say('Chronicle','The company tightens a loose line and clears a coil of rope from the deck. There’s room to move along the rail now.');
    quest.ballerinaCargoChecked=true;
    break;
   case 'ballerinaTakeWatch':
    await say(quarter,'We’ve had word of pirates along this coast. Call out if you see a sail keeping pace with us.');
    await say('freya','Two on watch. One ahead, one astern. Wake the rest if anything closes.');
    quest.ballerinaWatchTaken=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact};
})();
