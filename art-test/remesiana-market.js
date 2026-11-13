"use strict";

window.RemesianaMarket=(()=>{
 const harbor='remesiana_return',market='remesiana_rival_market';
 const image='remesiana-rival-market-v1.png',ruins='remesiana-rival-market-ruined-v1.png',portrait='remesiana-florio-v1.png';
 const gathering=[[276,299],[300,312],[372,304],[395,319]];
 let evacuation=null,ignition=null;
 function install(){
  scenes[harbor].points.push(
   {id:'remesianaMeetFlorio',speaker:'florio',x:405,y:162,label:'Speak to Florio Cento'},
   {id:'remesianaMarketRoad',x:104,y:232,label:'Go to the rival market'},
   {id:'remesianaReportMarket',speaker:'florio',x:405,y:162,label:'Report to Florio Cento'}
  );
  scenes[market]={
   name:'Remesiana · The Rival Market',image,spawn:[328,344],
   walk:[{x:32,y:144,w:576,h:208},{x:256,y:352,w:128,h:48}],blocks:[],lights:[[40,40],[603,40]],
   points:[
    {id:'remesianaOpenBays',x:136,y:152,label:'Open the holding bays'},
    {id:'remesianaClearExit',x:328,y:392,label:'See the captives through the exit'},
    {id:'remesianaBreakMarket',x:368,y:168,label:'Put the market out of business'},
    {id:'remesianaWithdrawMarket',x:328,y:392,label:'Leave the ruined market'}
   ]
  };
  MAP_LAYERS[market]={foreground:image,contain:true,background:{type:'solid',color:'#131922'}};
  JOURNEYS[market]='16 Calistril, 4717. Freya’s company reaches the rival market. Clear the holding bays and get everyone out before destroying it.';
  NAMES.florio='Florio Cento';
  FUTURE_NPCS.florio={source:portrait,frame:{x:206,y:0,w:582,h:1536}};
  DIALOGUE_FACE_CROPS.florio={x:379,y:7,w:242,h:242};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[market]=await loader(image);})(),
   ...[portrait,ruins].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===market?(quest.remesianaMarketDestroyed?art[ruins]:art[market]):null;}
 function points(){
  if(!quest.remesianaFlorioLead)return null;
  if(scene===harbor){
   if(quest.remesianaFlorioReported)return [];
   return [point(quest.remesianaMarketWithdrawn?'remesianaReportMarket':quest.remesianaFlorioMet?'remesianaMarketRoad':'remesianaMeetFlorio')];
  }
  if(scene!==market)return null;
  if(!quest.remesianaMarketBaysOpen)return [point('remesianaOpenBays')];
  if(!quest.remesianaMarketEvacuated)return [point('remesianaClearExit')];
  return [point(quest.remesianaMarketDestroyed?'remesianaWithdrawMarket':'remesianaBreakMarket')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===harbor&&quest.remesianaFlorioReported?'Florio’s rival market is destroyed.':null);
 }
 function npcs(){
  if(scene===harbor&&quest.remesianaFlorioLead){
   const harborFolk=EgorianFountain.npcs();
   return quest.remesianaFlorioReported?harborFolk:[...harborFolk,{id:'florio',x:405,y:162,height:54}];
  }
  if(scene!==market)return null;
  if(!quest.remesianaMarketBaysOpen||quest.remesianaMarketEvacuated)return [];
  const leaving=evacuation?.token===epoch;
  const elapsed=leaving?performance.now()-evacuation.at:0;
  return gathering.flatMap(([x,y],i)=>{
   const progress=leaving?Math.max(0,(elapsed-i*110)/900):0;
   if(progress>=1)return [];
   return [{id:'citizen-market-captive-'+i,
    x:x+(296+i*14-x)*Math.min(1,progress*2),y:y+(416-y)*progress,
    dir:'down',variant:i+2,step:progress>0,anim:elapsed/140}];
  });
 }
 function effects(g,t){
  if(scene!==market)return;
  if(quest.remesianaMarketBaysOpen&&!quest.remesianaMarketDestroyed){
   g.save();
   g.beginPath();
   g.rect(44,45,194,82);
   g.clip();
   SceneLayers.foreground(g,art[ruins],{contain:true});
   g.restore();
  }
  if(ignition?.token===epoch){
   const progress=Math.min(1,(performance.now()-ignition.at)/900);
   g.save();
   g.globalAlpha=progress;
   SceneLayers.foreground(g,art[ruins],{contain:true});
   PresentationPolish.worldFire(g,t,[[337,132],[390,138]]);
   g.restore();
  }
  if(!quest.remesianaMarketDestroyed&&ignition?.token!==epoch)return;
  g.save();
  for(let i=0;i<6;i++){
   const x=318+i*15,step=reduce.matches?0:Math.floor(t*(9+i%3))%34;
   g.fillStyle=i%2?'#bc6b35':'#794831';
   g.fillRect(x,132-i%3*3,3+i%2*2,2);
   g.globalAlpha=.26+(i%3)*.06;
   g.fillStyle='#757382';
   g.fillRect(x+Math.floor(step/4),128-step-i*4,8+i*2,5+i%3*3);
   g.globalAlpha=1;
  }
  g.restore();
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'remesianaMeetFlorio':
    await say('reese','The man at the fountain sent us. He said we still owed favors.');
    await say('florio','There’s a market here that sells people. It’s my chief competition. I want it gone.');
    await say('freya','Where is it?');
    await say('florio','Take the street inland from the harbor. You’ll find the holding bays behind the wall.');
    quest.remesianaFlorioMet=true;
    break;
   case 'remesianaMarketRoad':
    quest.remesianaMarketReached=true;
    await travel(market,328,344);
    break;
   case 'remesianaOpenBays':
    await say('Chronicle','The company opens the holding bays. The people inside gather near the yard exit.');
    quest.remesianaMarketBaysOpen=true;
    break;
   case 'remesianaClearExit':{
    await say('freya','This way. Keep moving until you’re clear of the walls.');
    const token=epoch;
    if(!reduce.matches){
     evacuation={token,at:performance.now()};
     await delay(1260);
     if(epoch!==token)throw CANCEL;
    }
    await say('Chronicle','The last captive reaches the street. The yard is empty.');
    quest.remesianaMarketEvacuated=true;
    evacuation=null;
    break;
   }
   case 'remesianaBreakMarket':{
    const token=epoch;
    if(!reduce.matches){
     ignition={token,at:performance.now()};
     await delay(900);
     if(epoch!==token)throw CANCEL;
    }
    quest.remesianaMarketDestroyed=true;
    ignition=null;
    await say('Chronicle','The company tears down the sale platform and sets the empty yard alight.');
    break;
   }
   case 'remesianaWithdrawMarket':
    await journeyCard('Remesiana · Back at the harbor','Florio’s rival market is destroyed. The company leaves the yard behind and returns to the harbor.',()=>{
     quest.remesianaMarketWithdrawn=true;
     setScene(harbor,424,184);
    });
    break;
   case 'remesianaReportMarket':
    await say('freya','The market is finished.');
    await say('florio','Then that favor is paid.');
    quest.remesianaFlorioReported=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,effects,interact};
})();
