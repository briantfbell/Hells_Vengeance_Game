"use strict";

window.BarleybridgeScout=(()=>{
 const temple='ilnius_inner_temple',approach='barleybridge_approach',image='barleybridge-approach-v1.png';
 const boat='guapo_party_boat',boatArt='guapo-party-boat-v1.png';
 const planNotes=[
  ['Tathlum Plan · Barleybridge','El Guapo has scouted the approach. The plan called for the blood of slain innocents to anoint Parnoneryx’s head. The outcome at Barleybridge remains unknown.'],
  ['Tathlum Plan · Warlock Island','After St. Ilnius, an ancient library is named as the last component. The target is the Archive of Redacted Histories. The company intends to burn it and apply its ashes to the dragon’s head.'],
  ['Tathlum Plan · Egorian','The company intends to bring the prepared head to Queen Abrogail. The plan calls for the completed Tathlum to be used against Westcrown.\n\nOpen Current quest and choose Planning maps. Start at the Barleybridge scout’s approach to trace the crossing.']
 ];

 function install(){
  scenes[temple].points.push({id:'barleybridgeCutaway',x:328,y:344,marker:{x:328,y:377},label:'Follow El Guapo to Barleybridge'});
  scenes[approach]={
   name:'Barleybridge · River Approach',image,spawn:[328,344],blocks:[],
   walk:[{x:112,y:208,w:416,h:128},{x:112,y:192,w:64,h:16},{x:256,y:336,w:112,h:64}],lights:[[110,187],[161,168],[510,172]],
   points:[
    {id:'barleybridgeBridge',x:168,y:216,label:'Scout the river crossing'},
    {id:'barleybridgeGate',x:456,y:224,label:'Observe the town gate'},
    {id:'barleybridgeReport',x:328,y:344,label:'Mark the route for the company'},
    {id:'barleybridgePlan',x:328,y:344,label:'Review the Tathlum plan'},
    {id:'guapoInvite',x:328,y:344,marker:{x:328,y:374},label:'Call it a night with El Guapo'}
   ]
  };
  scenes[boat]={
   name:'Epilogue · El Guapo’s Party Boat',image:boatArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:176,w:416,h:144},{x:288,y:320,w:64,h:80}],
   lights:[[69,82],[56,153],[28,278],[568,82],[578,151],[612,276],[260,42],[380,42]],
   points:[{id:'guapoBanquet',x:328,y:184,marker:{x:320,y:118},label:'Raise a glass at the banquet'}]
  };
  MAP_LAYERS[boat]={
   foreground:boatArt,contain:true,background:{type:'solid',color:'#141622'},
   waterChannels:[[[0,0],[50,0],[25,300],[0,400]],[[590,0],[640,0],[640,400],[615,300]]],
   waterCurrent:{speed:4,palette:['#354262','#53607c']}
  };
  JOURNEYS[boat]='Epilogue. El Guapo has rented a boat for the night. There’s food on the table and, by his count, only one rule about the balloons.';
  MAP_LAYERS[approach]={
   foreground:image,contain:true,background:{type:'solid',color:'#222c37'},
   waterChannels:[
    [[169,174],[217,171],[252,167],[276,165],[289,160],[331,162],[334,170],[319,182],[321,194],[293,197],[269,194],[245,185],[209,186],[169,184]],
    [[329,152],[357,147],[386,146],[420,149],[460,154],[465,171],[438,179],[409,181],[397,171],[375,166],[351,174],[339,176]],
    [[403,184],[426,182],[457,176],[476,173],[475,181],[449,185],[425,185]],
    [[9,208],[47,204],[68,198],[79,204],[70,225],[49,235],[37,248],[20,259],[7,257]],
    [[580,169],[602,165],[629,168],[627,180],[610,182],[596,194],[581,196]]
   ],
   waterCurrent:{speed:5,palette:['#668eaf','#8ba8c2']}
  };
  JOURNEYS[approach]='El Guapo has gone ahead to Barleybridge. The company expects limited paladin presence, and the scout is to find out what the approach looks like.';
 }
 async function load(loader){
  await Promise.all([[approach,image],[boat,boatArt]].map(async ([id,source])=>{art[id]=await loader(source);}));
 }
 function mapImage(){return scene===approach||scene===boat?art[scene]:null;}
 function roster(){
  if(scene===boat)return ['guapo','freya','jamal','jason','draymus','reese'];
  return scene===approach?['guapo']:null;
 }
 function npcs(){return scene===approach||scene===boat?[]:null;}
 function points(){
  if(scene===temple&&quest.ilniusTempleComplete)return [point('barleybridgeCutaway')];
  if(scene===boat)return quest.guapoBanquetComplete?[]:[point('guapoBanquet')];
  if(scene!==approach)return null;
  if(quest.barleybridgePlanReviewed)return [point('guapoInvite')];
  const id=!quest.barleybridgeCrossingSeen?'barleybridgeBridge':!quest.barleybridgeGateSeen?'barleybridgeGate':!quest.barleybridgeScoutComplete?'barleybridgeReport':'barleybridgePlan';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===boat&&quest.guapoBanquetComplete)return 'To be continued… End of the recorded campaign.';
  return target()?.label??null;
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'barleybridgeCutaway':
    quest.barleybridgeReached=true;
    await travel(approach,328,344);
    break;
   case 'barleybridgeBridge':
    await say('guapo','One bridge into town. A splendid place to be seen, which is precisely why I’m staying on this bank.');
    quest.barleybridgeCrossingSeen=true;
    break;
   case 'barleybridgeGate':
    await say('guapo','I can see the gate from here. The company expects a light paladin presence, but I can’t count anyone from this side of the river.');
    quest.barleybridgeGateSeen=true;
    break;
   case 'barleybridgeReport':
    await say('guapo','Bridge, gate, and a place to wait out of sight. That’ll do for a first look.');
    quest.barleybridgeScoutComplete=true;
    break;
   case 'barleybridgePlan':
    for(const [title,summary] of planNotes)await journeyCard(title,summary,()=>{});
    quest.barleybridgePlanReviewed=true;
    break;
   case 'guapoInvite':
    await say('guapo','The plans will keep till morning. I’ve rented us a boat. It has a banquet, balloons, and a deposit I’d like to see again.');
    await travel(boat,328,344);
    break;
   case 'guapoBanquet':
    await say('guapo','To the company. If anyone asks, those balloons were already like that.');
    await journeyCard('To be continued…','You’ve reached the end of the recorded campaign. The rest of the Tathlum plan is still in your journal and planning maps.');
    quest.guapoBanquetComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact,planNotes};
})();
