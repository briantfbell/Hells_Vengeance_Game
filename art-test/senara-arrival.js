"use strict";

window.SenaraArrival=(()=>{
 const square='egorian_excruciation',court='egorian_inquiry',waterfront='senara_waterfront',villa='senara_fex_villa';
 const visitors=['freya','jason','draymus','guapo','reese'];
 const layouts={
  [waterfront]:{
   name:'Senara · River Road',image:'senara-waterfront-v1.png',spawn:[360,344],
   walk:[{x:336,y:176,w:64,h:208},{x:272,y:112,w:320,h:64},{x:544,y:96,w:48,h:16}],
   lights:[],
   points:[{id:'senaraPatrols',x:360,y:168,label:'Observe the Reclamation garrison'},
    {id:'senaraVilla',x:568,y:136,label:'Enter Fex’s residence'}]
  },
  [villa]:{
   name:'Senara · Fex’s Residence',image:'senara-fex-villa-v1.png',spawn:[328,344],
   walk:[{x:112,y:208,w:448,h:96},{x:176,y:128,w:272,h:80},{x:272,y:304,w:96,h:80}],
   lights:[[127,53],[515,53]],
   points:[{id:'senaraCoffer',x:536,y:200,label:'Search for Fex’s talisman'}]
  }
 };

 function install(){
  scenes[square].points.push({id:'senaraInquiry',x:328,y:344,label:'Hear the outcome of the inquiry'});
  const courtroom=scenes.egorian_court;
  scenes[court]={...courtroom,name:'Egorian · The Duke Fellatio Inquiry',points:[
   {id:'senaraRuling',x:328,y:184,label:'Hear the judges’ ruling'},
   {id:'senaraBriefing',x:424,y:248,speaker:'razelago_revealed',label:'Speak to Razelago'},
   {id:'senaraRoad',x:328,y:344,label:'Depart for Senara'}
  ]};
  MAP_LAYERS[court]=MAP_LAYERS.egorian_court;
  for(const [id,layout] of Object.entries(layouts)){
   scenes[id]={...layout,blocks:[]};
   MAP_LAYERS[id]={foreground:layout.image,contain:true,background:id===waterfront?
    {type:'ocean',palette:['#293c43','#3c555b','#4c676b','#587077'],speed:3}:
    {type:'solid',color:'#141015'}};
  }
  JOURNEYS[court]='After the ceremony, investigators pursue J’Mal’s part in Duke Fellatio’s death. The prosecutor brings a motion before a panel of Asmodean judges.';
  JOURNEYS[waterfront]='At Razelago’s direction, Freya’s company leaves Egorian for the river town of Senara. Fex’s assignment takes them back toward the Whisperwood.';
  JOURNEYS[villa]='Fex’s riverside residence will serve as the company’s base. The Infernal Talisman was supposed to be waiting inside.';
 }

 async function load(loader){
  await Promise.all(Object.entries(layouts).map(async ([id,{image}])=>{art[id]=await loader(image);}));
  art[court]=art.egorian_court;
 }
 function mapImage(){return scene===court||Object.hasOwn(layouts,scene)?art[scene]:null;}
 function roster(){return scene===court?['freya']:Object.hasOwn(layouts,scene)?visitors:null;}
 function npcs(){
  if(scene===court){
   if(!quest.egorianChargesDropped)return [{id:'egorian_magistrate',x:320,y:98,height:30}];
   return [{id:'razelago_revealed',x:424,y:232}];
  }
  if(scene===waterfront)return [{id:'kantaria_guard',x:328,y:136},{id:'kantaria_guard',x:424,y:144}];
  return scene===villa?[]:null;
 }
 function target(){
  if(!quest.egorianExcruciated)return null;
  if(scene===square&&!quest.egorianInquiryVisited)return point('senaraInquiry');
  if(scene===court)return point(!quest.egorianChargesDropped?'senaraRuling':!quest.senaraOrders?'senaraBriefing':'senaraRoad');
  if(scene===waterfront)return point(quest.senaraGarrisonSeen?'senaraVilla':'senaraPatrols');
  if(scene===villa&&!quest.senaraTalismanMissing)return point('senaraCoffer');
  return null;
 }
 function points(){const next=target();return next?[next]:scene===villa?[]:null;}
 function goal(){return target()?.label||(scene===villa&&quest.senaraTalismanMissing?'Find Senara’s thieves and recover the talisman.':null);}

 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'senaraInquiry':
    quest.egorianInquiryVisited=true;
    await travel(court,328,344);
    break;
   case 'senaraRuling':
    await say('Chronicle','In one night, the witnesses for the prosecution disappear or die in a fire.');
    await say('egorian_magistrate','The panel denies the prosecutor’s motion for a mistrial.');
    await say('Chronicle','The case comes to an end. J’Mal is still out of sight.');
    quest.egorianChargesDropped=true;
    break;
   case 'senaraBriefing':
    await say('razelago_revealed','Fex is sending you to Senara. The Glorious Reclamation has held the town for over a month. Their garrison is strong, so keep your purpose to yourselves.');
    await say('razelago_revealed','There’s a passage to Hell in the Whisperwood. Devils can cross without anyone’s leave. Fex needs ritual components to close it.');
    await say('razelago_revealed','His Infernal Talisman should be at his residence in Senara. Start there, then follow the list.');
    await say('freya','We have the list. I would have liked a little more of the plan.');
    quest.senaraOrders=true;
    break;
   case 'senaraRoad':
    await travel(waterfront,360,344);
    break;
   case 'senaraPatrols':
    await say('reese','Reclamation banners on the river road. The garrison is right where Razelago said it would be.');
    await say('freya','Let them see travelers going to a house. Keep the list out of sight.');
    quest.senaraGarrisonSeen=true;
    break;
   case 'senaraVilla':
    await travel(villa,328,344);
    break;
   case 'senaraCoffer':
    await say('Chronicle','Fex’s residence was burgled about a week ago. The coffer stands open. The Infernal Talisman is gone.');
    await say('draymus','Someone in town knows where stolen goods go. Let’s find out who.');
    quest.senaraTalismanMissing=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }

 return {install,load,mapImage,roster,npcs,target,points,goal,interact};
})();
