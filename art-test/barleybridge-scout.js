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
    {id:'barleybridgeReport',x:328,y:344,label:'Mark the route for the company'}
   ]
  };
  MAP_LAYERS[approach]={foreground:image,contain:true,background:{type:'solid',color:'#222c37'}};
  JOURNEYS[approach]='El Guapo has gone ahead to Barleybridge. The company expects limited paladin presence, and the scout is to find out what the approach looks like.';
 }
 async function load(loader){art[approach]=await loader(image);}
 function mapImage(){return scene===approach?art[approach]:null;}
 function roster(){return scene===approach?['guapo']:null;}
 function npcs(){return scene===approach?[]:null;}
 function points(){
  if(scene===temple&&quest.ilniusTempleComplete)return [point('barleybridgeCutaway')];
  if(scene!==approach)return null;
  if(quest.barleybridgeScoutComplete)return [];
  return [point(!quest.barleybridgeCrossingSeen?'barleybridgeBridge':!quest.barleybridgeGateSeen?'barleybridgeGate':'barleybridgeReport')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===approach&&quest.barleybridgeScoutComplete?'The approach is marked. El Guapo waits outside Barleybridge.':null);}
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
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact};
})();
