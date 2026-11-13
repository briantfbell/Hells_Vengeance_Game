"use strict";

window.Westcrown=(()=>{
 const harbor='hinji_shipyard',quay='westcrown_quay';
 const image='westcrown-quay-v1.png',portrait='westcrown-brado-v1.png';
 const favors=[
  ['westcrownCheckManifest','westcrownManifestChecked'],
  ['westcrownDeliverNote','westcrownNoteDelivered'],
  ['westcrownCheckBerth','westcrownBerthChecked']
 ];
 const unfinished=()=>favors.filter(([,flag])=>!quest[flag]);

 function install(){
  scenes[harbor].points.push({id:'westcrownDepart',x:328,y:376,label:'Leave for Westcrown'});
  scenes[quay]={
   name:'Westcrown · Canal Quay',image,spawn:[328,264],
   walk:[{x:48,y:160,w:560,h:128},{x:544,y:288,w:64,h:96}],blocks:[],lights:[[111,121],[394,91]],
   points:[
    {id:'westcrownMeetBrado',speaker:'brado',x:280,y:208,label:'Meet Brado Pachia'},
    {id:'westcrownCheckManifest',x:72,y:168,label:'Check the freight ledger'},
    {id:'westcrownDeliverNote',x:368,y:152,label:'Deliver the sealed note'},
    {id:'westcrownCheckBerth',x:576,y:376,label:'Check the canal berth'},
    {id:'westcrownReport',speaker:'brado',x:280,y:208,label:'Report to Brado Pachia'}
   ]
  };
  MAP_LAYERS[quay]={foreground:image,contain:true,background:{
   type:'ocean',speed:3,waterline:288,landColor:'#24292b',palette:['#162931','#1e343d','#2b4850','#3c5660']
  }};
  JOURNEYS[quay]='20 Calistril, 4717. Freya’s company reaches Westcrown. Brado Pachia hires them for a handful of small favors.';
  NAMES.brado='Brado Pachia';
  FUTURE_NPCS.brado={source:portrait,frame:{x:205,y:0,w:579,h:1536}};
  DIALOGUE_FACE_CROPS.brado={x:349,y:19,w:279,h:279};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[quay]=await loader(image);})(),
   (async()=>{art[portrait]=await loader(portrait);})()
  ]);
 }
 function mapImage(){return scene===quay?art[quay]:null;}
 function points(){
  if(!quest.remesianaFlorioReported)return null;
  if(scene===harbor)return quest.hinjiComplete?[point('westcrownDepart')]:null;
  if(scene!==quay)return null;
  if(quest.westcrownComplete)return [];
  if(!quest.westcrownHired)return [point('westcrownMeetBrado')];
  const remaining=unfinished();
  return remaining.length?remaining.map(([id])=>point(id)):[point('westcrownReport')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===quay&&quest.westcrownHired&&!quest.westcrownComplete){
   const count=favors.length-unfinished().length;
   if(count<favors.length)return 'Complete Brado’s favors ['+count+'/'+favors.length+']';
  }
  return target()?.label||(scene===quay&&quest.westcrownComplete?'Brado’s favors are complete.':null);
 }
 function npcs(){
  if(scene!==quay)return null;
  return [
   {id:'brado',x:280,y:208,height:54},
   {id:'citizen-westcrown-quay-1',x:182,y:259,dir:'left',variant:7},
   {id:'citizen-westcrown-quay-2',x:484,y:251,dir:'right',variant:4}
  ];
 }

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'westcrownDepart':
    quest.westcrownReached=true;
    await travel(quay,328,264);
    break;
   case 'westcrownMeetBrado':
    await say('brado','I’m Brado Pachia. I have three small jobs on this quay, if you want the work.');
    await say('freya','Tell us what you need.');
    await say('brado','The freight booth’s by the west stairs. Check its ledger for today’s delivery.');
    await say('brado','Leave this sealed note at the small door beside the warehouse. Then check whether the pier at the east end is clear.');
    quest.westcrownHired=true;
    break;
   case 'westcrownCheckManifest':
    await say('Chronicle','The tally by the freight office includes today’s delivery. Freya makes a note of it for Brado.');
    quest.westcrownManifestChecked=true;
    break;
   case 'westcrownDeliverNote':
    await say('Chronicle','The company leaves Brado’s note at the side door with the seal intact.');
    quest.westcrownNoteDelivered=true;
    break;
   case 'westcrownCheckBerth':
    await say('Chronicle','The berth is empty. Its mooring posts are clear.');
    quest.westcrownBerthChecked=true;
    break;
   case 'westcrownReport':
    await say('freya','The freight was entered, the note was delivered, and the berth is clear.');
    await say('brado','Good. That’s all I needed.');
    quest.westcrownComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact};
})();
