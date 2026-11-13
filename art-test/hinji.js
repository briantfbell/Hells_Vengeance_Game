"use strict";

window.Hinji=(()=>{
 const harbor='remesiana_return',shipyard='hinji_shipyard';
 const image='hinji-shipyard-v1.png',officers='hinji-officers-v1.png';
 function install(){
  scenes[harbor].points.push({id:'hinjiDepart',x:104,y:232,label:'Leave for Hinji'});
  scenes[shipyard]={
   name:'Hinji · Naval Shipyard',image,spawn:[328,312],
   walk:[{x:48,y:128,w:544,h:160},{x:304,y:288,w:40,h:96}],blocks:[],lights:[[146,84],[266,76],[374,74],[504,72]],
   points:[
    {id:'hinjiSpeakToBarksdale',speaker:'barksdale',x:120,y:156,label:'Speak to Nathin Barksdale'},
    {id:'hinjiFileRefusal',x:416,y:128,label:'Send Barksdale’s refusal from the dispatch board'},
    {id:'hinjiHearAppointment',speaker:'lebeau',x:552,y:156,label:'Hear the result from LeBeau'}
   ]
  };
  MAP_LAYERS[shipyard]={foreground:image,contain:true,background:{
   type:'ocean',speed:3,waterline:288,landColor:'#222932',palette:['#132631','#1c343f','#2e4856','#415763']
  }};
  JOURNEYS[shipyard]='18 Calistril, 4717. The company travels from Remesiana to Hinji. The shipyard is about to decide who takes the admiralty.';
  NAMES.barksdale='Nathin Barksdale';
  NAMES.lebeau='Rear Admiral LeBeau';
  FUTURE_NPCS.barksdale={source:officers,frame:{x:132,y:16,w:426,h:998}};
  DIALOGUE_FACE_CROPS.barksdale={x:272,y:19,w:153,h:153};
  FUTURE_NPCS.lebeau={source:officers,frame:{x:1014,y:10,w:349,h:1008}};
  DIALOGUE_FACE_CROPS.lebeau={x:1108,y:9,w:163,h:163};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[shipyard]=await loader(image);})(),
   (async()=>{art[officers]=await loader(officers);})()
  ]);
 }
 function mapImage(){return scene===shipyard?art[scene]:null;}
 function points(){
  if(!quest.remesianaFlorioReported)return null;
  if(scene===harbor)return [point('hinjiDepart')];
  if(scene!==shipyard||quest.hinjiComplete)return null;
  if(!quest.hinjiDeclined)return [point('hinjiSpeakToBarksdale')];
  return [point(quest.hinjiPapersSent?'hinjiHearAppointment':'hinjiFileRefusal')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||null;}
 function npcs(){
  if(scene!==shipyard)return null;
  return [
   {id:'barksdale',x:120,y:156,height:55},{id:'lebeau',x:552,y:156,height:56},
   {id:'citizen-hinji-dock-1',x:249,y:261,dir:'right',variant:5},
   {id:'citizen-hinji-dock-2',x:426,y:257,dir:'left',variant:3}
  ];
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'hinjiDepart':
    quest.hinjiReached=true;
    await travel(shipyard,328,312);
    break;
   case 'hinjiSpeakToBarksdale':
    await say('barksdale','They offered me the admiralty. I told them to put my refusal in writing. I meant it.');
    await say('freya','And has anyone sent it on?');
    await say('barksdale','My answer’s on file. Outgoing papers go through the dispatch board beside the warehouse.');
    quest.hinjiDeclined=true;
    break;
   case 'hinjiFileRefusal':
    await say('Chronicle','Barksdale’s refusal is waiting in the shipyard file. The company moves it into the outgoing docket, ahead of the other promotion papers.');
    await say('freya','That puts his refusal on the next dispatch. They’ll have to name someone else.');
    quest.hinjiPapersSent=true;
    break;
   case 'hinjiHearAppointment':
    await say('lebeau','Barksdale has declined. The appointment has fallen to me.');
    await say('Chronicle','With the new admiral named, the company prepares to leave Hinji for Westcrown.');
    quest.hinjiComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact};
})();
