"use strict";

window.AregoExit=(()=>{
 const gate='arego_inferno_gate',hotel='egorian_hotel_barato',contessa='contessa';
 const sealedArt='arego-inferno-gate-sealed-v1.png',hotelArt='egorian-hotel-barato-v1.png',contessaArt='arego-contessa-v1.png';
 const hotelSpawn=[328,328];
 let sealStart=null,escapeStart=null;
 function install(){
  scenes[gate].points.push(
   {id:'aregoIntervention',x:328,y:304,label:'Meet Corrine and the Queen’s envoy'},
   {id:'aregoNegotiateExit',speaker:contessa,x:288,y:304,label:'Hear the terms for closing the gate'},
   {id:'aregoSealPortal',x:328,y:288,label:'Watch the Inferno Gate close'},
   {id:'aregoEscape',speaker:'corrine',x:232,y:320,label:'Gather for the teleport to Egorian'}
  );
  scenes[hotel]={
   name:'Egorian · Hotel Barato',image:hotelArt,spawn:hotelSpawn,blocks:[],
   walk:[{x:64,y:176,w:448,h:160},{x:192,y:128,w:288,h:48}],lights:[[82,103],[224,42],[422,42],[567,179]],
   points:[{id:'aregoHotelReports',x:328,y:280,label:'See Jason and Freya off to report'}]
  };
  MAP_LAYERS[hotel]={foreground:hotelArt,contain:true,background:{type:'solid',color:'#19151a'}};
  NAMES[contessa]='Contessa';
  FUTURE_NPCS[contessa]={source:contessaArt,frame:{x:140,y:7,w:740,h:1515}};
  DIALOGUE_FACE_CROPS[contessa]={x:337,y:6,w:273,h:273};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[hotel]=await loader(hotelArt);})(),
   ...[sealedArt,contessaArt].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){
  if(scene===hotel)return art[hotel];
  return scene===gate&&quest.aregoGateSealed?art[sealedArt]:null;
 }
 function roster(){
  if(scene!==hotel||!quest.aregoReportsSent)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='jason'&&id!=='freya');
 }
 function points(){
  if(!quest.aregoFexAftermath)return null;
  if(scene===hotel)return quest.aregoReportsSent?[]:[point('aregoHotelReports')];
  if(scene!==gate)return null;
  const id=!quest.aregoCorrineArrived?'aregoIntervention':!quest.aregoExitTerms?'aregoNegotiateExit':!quest.aregoGateSealed?'aregoSealPortal':'aregoEscape';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===hotel&&quest.aregoReportsSent?'Wait at Hotel Barato for news from Jason and Freya.':null);
 }
 function npcs(t=0){
  if(scene===hotel)return [];
  if(scene!==gate||!quest.aregoCorrineArrived)return null;
  return [...(AregoReturn.npcs(t)||[]),
   {id:'corrine',x:232,y:304,height:57},
   {id:contessa,x:288,y:288,height:68}
  ];
 }
 async function seal(){
  const token=epoch;
  sealStart={token,at:performance.now()};
  GameAudio.effect('spell');
  await delay(reduce.matches?80:1050);
  if(epoch!==token)throw CANCEL;
  quest.aregoGateSealed=true;
  sealStart=null;
 }
 async function teleport(){
  const token=epoch;
  escapeStart={token,at:performance.now()};
  GameAudio.effect('spell');
  await delay(reduce.matches?80:570);
  if(epoch!==token)throw CANCEL;
  escapeStart=null;
  await journeyCard(scenes[hotel].name,'As the paladins storm the level above, Corrine and Contessa teleport the company to Egorian. The party takes rooms at Hotel Barato.',()=>{
   quest.aregoEgorianEscaped=true;
   setScene(hotel,...hotelSpawn);
  });
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'aregoIntervention':
    quest.aregoCorrineArrived=true;
    await say('Chronicle','Corrine steps out of a sudden fold in the air. Beside her is an erinyes in the Queen’s service.');
    await say('corrine','This ends now. A whole battalion of the Reclamation has reached Fort Arego. The first ranks are already on the top level.');
    await say(contessa,'Contessa, in service to the Queen. Visperthul, I speak for Thrune. We need terms before those paladins reach this chamber.');
    break;
   case 'aregoNegotiateExit':
    await say('visperthul','An entire battalion, with angels among them? Then there’s little point in trying to hold this gate.');
    await say(contessa,'The gate closes. The company stays in Cheliax on this plane. Can you accept that?');
    await say('visperthul','They may remain here. They will serve my interests here. The contract stands.');
    await say('corrine','Then close it. I’ll take the company out as soon as the passage is sealed.');
    quest.aregoExitTerms=true;
    break;
   case 'aregoSealPortal':
    await seal();
    await say('Chronicle','The tear closes and the ash stops falling. Above, the first of the paladins are storming the next level down.');
    break;
   case 'aregoEscape':
    await say(contessa,'Stand close to Corrine and me. We can take you all at once.');
    await teleport();
    break;
   case 'aregoHotelReports':{
    await say('jason','I have to report to the Temple of Asmodeus. Wait here until I get back.');
    await say('freya','And I answer to Army Command. Keep a room for us. I’ll come back when they let me go.');
    await say('Chronicle','Jason and Freya leave to report separately. The others wait at Hotel Barato.');
    quest.aregoReportsSent=true;
    const {x,y,dir}=units[0];
    setScene(hotel,x,y,dir);
    break;
   }
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function effects(g){
  if(scene!==gate||reduce.matches)return;
  if(sealStart?.token===epoch){
   const p=Math.min(1,(performance.now()-sealStart.at)/1050);
   g.save();
   g.globalAlpha=p*p;
   SceneLayers.foreground(g,art[sealedArt],{contain:true});
   g.restore();
  }
  if(escapeStart?.token===epoch){
   const p=Math.min(1,(performance.now()-escapeStart.at)/570);
   g.save();
   for(let i=0;i<32;i++){
    const angle=i*Math.PI/16+p*2,r=17+p*(41+i%5*5);
    g.globalAlpha=(1-p)*.6;g.fillStyle=i%3?'#decde9':'#f4e6b0';
    g.fillRect(Math.round(268+Math.cos(angle)*r),Math.round(309+Math.sin(angle)*r*.55),3,2);
   }
   g.restore();
  }
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact,effects};
})();
