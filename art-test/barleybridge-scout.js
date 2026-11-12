"use strict";

window.BarleybridgeScout=(()=>{
 const temple='ilnius_inner_temple',approach='barleybridge_approach',image='barleybridge-approach-v1.png';

 function install(){
  scenes[temple].points.push({id:'barleybridgeCutaway',x:328,y:344,label:'Follow El Guapo to Barleybridge'});
  scenes[approach]={
   name:'Barleybridge · River Approach',image,spawn:[328,344],blocks:[],
   walk:[{x:112,y:208,w:416,h:128},{x:112,y:192,w:64,h:16},{x:256,y:336,w:112,h:64}],lights:[[110,187],[161,168],[510,172]],
   points:[
    {id:'barleybridgeBridge',x:168,y:216,label:'Scout the river crossing'},
    {id:'barleybridgeGate',x:456,y:224,label:'Observe the town gate'},
    {id:'barleybridgeReport',x:328,y:344,label:'Mark the route for the company'},
    {id:'barleybridgePlan',x:328,y:344,label:'Review the Tathlum plan'}
   ]
  };
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
 async function load(loader){art[approach]=await loader(image);}
 function mapImage(){return scene===approach?art[approach]:null;}
 function roster(){return scene===approach?['guapo']:null;}
 function npcs(){return scene===approach?[]:null;}
 function points(){
  if(scene===temple&&quest.ilniusTempleComplete)return [point('barleybridgeCutaway')];
  if(scene!==approach)return null;
  if(quest.barleybridgePlanReviewed)return [];
  const id=!quest.barleybridgeCrossingSeen?'barleybridgeBridge':!quest.barleybridgeGateSeen?'barleybridgeGate':!quest.barleybridgeScoutComplete?'barleybridgeReport':'barleybridgePlan';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===approach&&quest.barleybridgePlanReviewed?'El Guapo waits outside Barleybridge. The company’s next move is pending.':null);}
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
    await journeyCard('Tathlum Plan · Barleybridge','El Guapo has scouted the approach. The plan called for the blood of slain innocents to anoint Parnoneryx’s head. The outcome at Barleybridge remains unknown.',()=>{});
    await journeyCard('Tathlum Plan · Warlock Island','After St. Ilnius, an ancient library is named as the last component. The target is the Archive of Redacted Histories. The company intends to burn it and apply its ashes to the dragon’s head.',()=>{});
    await journeyCard('Tathlum Plan · Egorian','The company intends to bring the prepared head to Queen Abrogail. The plan calls for the completed Tathlum to be used against Westcrown.\n\nOpen Current quest and choose Planning maps. Start at the Barleybridge scout’s approach to trace the crossing.',()=>{});
    quest.barleybridgePlanReviewed=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact};
})();
