"use strict";

window.EgorianSting=(()=>{
 const street='egorian_efisio_street',court='egorian_court',hall='egorian_sting_hall';
 const corrine={id:'corrine',x:280,y:248,height:58};
 function install(){
  scenes[street].points.push({id:'stingGoToCorrine',x:328,y:392,label:'Go to Corrine’s debrief'});
  scenes[hall]={
   ...scenes[court],name:'Egorian · The Crown’s Debrief',
   points:[
    {id:'stingBriefing',speaker:corrine.id,x:corrine.x,y:corrine.y,label:'Hear Corrine’s plan'},
    {id:'stingReports',x:328,y:176,label:'Review the reports from the cities'},
    {id:'stingStanding',speaker:corrine.id,x:corrine.x,y:corrine.y,label:'Receive the Crown’s decision'},
    {id:'stingNewOrders',speaker:corrine.id,x:corrine.x,y:corrine.y,label:'Hear the Queen’s next assignment'}
   ]
  };
  MAP_LAYERS[hall]=MAP_LAYERS[court];
  JOURNEYS[hall]='24 Calistril, 4717. Corrine coordinates a sting across Cheliax. After Efisio’s defeat, the company reports to her in Egorian.';
 }
 function load(){art[hall]=art[court];}
 function mapImage(){return scene===hall?art[hall]:null;}
 function points(){
  if(!quest.efisioDefeated)return null;
  if(scene===street)return [point('stingGoToCorrine')];
  if(scene!==hall)return null;
  if(quest.egorianStingDebriefed)return [];
  if(!quest.egorianStingBriefed)return [point('stingBriefing')];
  if(!quest.egorianStingComplete)return [point('stingReports')];
  return [point(quest.egorianStandingRestored?'stingNewOrders':'stingStanding')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===hall&&quest.egorianStingDebriefed?'The Queen has charged the company with settling a noble feud.':null);
 }
 function npcs(){
  if(scene!==hall)return null;
  return [corrine,{id:'guard',x:474,y:200,height:54}];
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'stingGoToCorrine':
    quest.egorianStingReached=true;
    await travel(hall,328,344);
    break;
   case 'stingBriefing':
    await say('corrine','Efisio was one part of it. I’ve arranged for the rest of the operation to move today, across several cities at once.');
    await say('corrine','The reports will come in from each city. Check them at the front of the hall, then come back to me.');
    quest.egorianStingBriefed=true;
    break;
   case 'stingReports':
    await journeyCard('Reports across Cheliax','The reports confirm the raids took place on the same day.\nVisperthul’s four leading agents in Cheliax were captured or killed. His criminal network in Cheliax collapsed.',()=>{
     quest.egorianStingComplete=true;
    });
    break;
   case 'stingStanding':
    await say('corrine','Freya, your military rank is restored, and you’re being promoted. Your standing as a Hellknight has also been restored.');
    await say('corrine','Jason, the Church of Asmodeus has formally recognized what you did here.');
    await say('jason','I’ll hear what the church has to say.');
    quest.egorianStandingRestored=true;
    break;
   case 'stingNewOrders':
    await say('corrine','You’ll receive invitations into circles that were closed to you before. The Queen wants you to use that access to settle an old feud between two nobles.');
    await say('freya','We’ll hear both sides.');
    quest.egorianStingDebriefed=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact};
})();
