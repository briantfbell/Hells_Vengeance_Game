"use strict";

window.EgorianFeud=(()=>{
 const debrief='egorian_sting_hall',salon='egorian_feud_salon';
 const image='egorian-feud-salon-v1.png',cast='egorian-feud-nobles-v1.png';
 const invitations=[
  ['feudHearSethic','egorianSethicHeard'],
  ['feudHearVasvion','egorianVasvionHeard']
 ];
 function install(){
  scenes[debrief].points.push({id:'feudAttendReception',x:328,y:392,label:'Attend the first reception'});
  scenes[salon]={
   name:'Egorian · Noble Reception',image,spawn:[328,344],blocks:[],
   walk:[{x:64,y:160,w:512,h:192},{x:288,y:352,w:64,h:32}],lights:[[69,92],[157,72],[274,100],[364,100],[484,72],[571,92]],
   points:[
    {id:'feudHearSethic',x:120,y:224,speaker:'sethic',label:'Hear Sethic’s offer'},
    {id:'feudHearVasvion',x:520,y:224,speaker:'vasvion',label:'Hear Vasvion’s offer'},
    {id:'feudHearPressure',x:328,y:272,speaker:'corrine',label:'Hear the message from the Crown'},
    {id:'feudChooseVasvion',x:520,y:224,speaker:'vasvion',label:'Commit to Vasvion'}
   ]
  };
  MAP_LAYERS[salon]={foreground:image,contain:true,background:{type:'solid',color:'#16131c'}};
  JOURNEYS[salon]='28 Calistril, 4717. The company receives an invitation to the Night of the Pale. At a reception in Egorian, they hear out the nobles vying for the Queen’s favor.';
  NAMES.sethic='Paracount Thalgano Sethic';
  NAMES.vasvion='Levisvia Vasvion';
  FUTURE_NPCS.sethic={source:cast,frame:{x:222,y:6,w:385,h:1010}};
  DIALOGUE_FACE_CROPS.sethic={x:336,y:3,w:164,h:164};
  FUTURE_NPCS.vasvion={source:cast,frame:{x:865,y:15,w:417,h:1002}};
  DIALOGUE_FACE_CROPS.vasvion={x:981,y:18,w:171,h:171};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[salon]=await loader(image);})(),
   (async()=>{art[cast]=await loader(cast);})()
  ]);
 }
 function mapImage(){return scene===salon?art[scene]:null;}
 function points(){
  if(!quest.egorianStingDebriefed)return null;
  if(scene===debrief)return [point('feudAttendReception')];
  if(scene!==salon)return null;
  if(quest.egorianVasvionChosen)return [];
  const remaining=invitations.filter(([,flag])=>!quest[flag]);
  if(remaining.length)return remaining.map(([id])=>point(id));
  return [point(quest.egorianFeudPressure?'feudChooseVasvion':'feudHearPressure')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===salon&&(!quest.egorianSethicHeard||!quest.egorianVasvionHeard))
   return 'Hear both offers ['+(Number(!!quest.egorianSethicHeard)+Number(!!quest.egorianVasvionHeard))+'/2]';
  return target()?.label||(scene===salon&&quest.egorianVasvionChosen?'The company backs Levisvia Vasvion.':null);
 }
 function npcs(){
  if(scene!==salon)return null;
  return [
   {id:'sethic',x:120,y:200,height:57},{id:'vasvion',x:520,y:200,height:58},
   ...((quest.egorianSethicHeard&&quest.egorianVasvionHeard)?[{id:'corrine',x:328,y:248,height:58}]:[]),
   {id:'citizen-feud-1',x:110,y:237,dir:'right',variant:2},
   {id:'citizen-feud-2',x:536,y:267,dir:'left',variant:6},
   {id:'citizen-feud-3',x:229,y:196,dir:'right',variant:1},
   {id:'citizen-feud-4',x:415,y:196,dir:'left',variant:3}
  ];
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'feudAttendReception':
    quest.egorianFeudReached=true;
    await travel(salon,328,344);
    break;
   case 'feudHearSethic':
    await say('sethic','Some of Egorian’s finest houses of hospitality used to belong to me. Vasvion owns them now. I could use help protecting what remains.');
    await say('sethic','Take this. Consider it a sign that I value your time.');
    await say('Chronicle','The company accepts Sethic’s bribe without promising him their allegiance.');
    quest.egorianSethicHeard=true;
    break;
   case 'feudHearVasvion':
    await say('vasvion','Sethic still speaks of my businesses as if the keys were his. I’ve heard the Crown asked you to look into our quarrel.');
    await say('vasvion','I’d be grateful if you took my side. Here’s something for the trouble you’ve already gone to.');
    await say('Chronicle','The company accepts Vasvion’s bribe without making a commitment.');
    quest.egorianVasvionHeard=true;
    break;
   case 'feudHearPressure':
    await journeyCard('Egorian · The rounds of society','At more receptions, the company shares meals and does favors for both sides. They earn some money and little trust.');
    await say('corrine','The Glorious Reclamation is marching on Westcrown. The Queen has no patience left for this quarrel.');
    quest.egorianFeudPressure=true;
    break;
   case 'feudChooseVasvion':
    await say('freya','We’ve heard both sides. You have our support.', ['[Back Vasvion]']);
    await say('vasvion','Then start with what keeps Sethic wealthy.');
    quest.egorianVasvionChosen=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact};
})();
