"use strict";

window.DinyarRecon=(()=>{
 const wayside='molthune_waystation',nidal='nidal_arrival_court',ridge='dinyar_ridge';
 const nidalArt='nidal-arrival-court-v1.png',ridgeArt='dinyar-ridge-v1.png';
 const nidalParty=['draymus'],ridgeParty=['freya','jamal','reese','jason'];

 function install(){
  scenes[wayside].points.push({id:'dinyarSplit',speaker:'corrine',x:216,y:232,label:'Plan the two missions'});
  scenes[nidal]={
   name:'Nidal · Arrival Court',image:nidalArt,spawn:[328,344],blocks:[],
   walk:[{x:144,y:160,w:352,h:160},{x:240,y:320,w:160,h:80}],lights:[],
   points:[{id:'nidalConsult',speaker:'violetta',x:328,y:224,label:'Speak with Violetta about the operation'}]
  };
  scenes[ridge]={
   name:'Isger · Citadel Dinyar',image:ridgeArt,spawn:[328,344],blocks:[],
   walk:[{x:128,y:240,w:416,h:64},{x:176,y:304,w:272,h:16},{x:272,y:320,w:96,h:32},{x:304,y:352,w:48,h:48}],lights:[],
   points:[
    {id:'dinyarView',x:456,y:272,label:'Survey the two keeps'},
    {id:'dinyarPostern',x:152,y:248,label:'Search for the hidden entrance'},
    {id:'dinyarPlan',x:216,y:280,label:'Plan the approach through the lower works'}
   ]
  };
  MAP_LAYERS[nidal]={foreground:nidalArt,contain:true,background:{type:'solid',color:'#1f1929'}};
  MAP_LAYERS[ridge]={foreground:ridgeArt,contain:true,background:{type:'solid',color:'#242b35'}};
  JOURNEYS[nidal]='14 Gozran, 4717. Draymus, Violetta, and Corrine teleport to Nidal. They seek a physician who can remove Draymus’s brain and keep it alive in a jar.';
  JOURNEYS[ridge]='Meanwhile, Freya, J’Mal, Reese, and Jason reach Citadel Dinyar in Isger. Use Corrine’s directions to find the hidden entrance.';
 }
 async function load(loader){
  await Promise.all([[nidal,nidalArt],[ridge,ridgeArt]].map(async ([id,source])=>{art[id]=await loader(source);}));
 }
 function mapImage(){return scene===nidal||scene===ridge?art[scene]:null;}
 function roster(){
  if(scene===nidal)return nidalParty;
  if(scene===ridge)return ridgeParty;
  return null;
 }
 function npcs(){
  if(scene===wayside&&quest.molthuneComplete)return [
   {id:'corrine',x:216,y:200,height:53},{id:'violetta',x:456,y:193,height:57}
  ];
  if(scene===nidal)return [
   {id:'violetta',x:328,y:192,height:57},{id:'corrine',x:392,y:208,height:53}
  ];
  if(scene===ridge)return [];
  return null;
 }
 function points(){
  if(scene===wayside&&quest.molthuneComplete)return [point('dinyarSplit')];
  if(scene===nidal)return [point('nidalConsult')];
  if(scene!==ridge)return null;
  if(quest.dinyarReconComplete)return [];
  return [point(!quest.dinyarSurveyed?'dinyarView':!quest.dinyarEntranceFound?'dinyarPostern':'dinyarPlan')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===ridge&&quest.dinyarReconComplete?'Hidden entrance located. The company is ready to go below.':null);}
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'dinyarSplit':
    await say('corrine','A young signifier survived the fall of Dinyar. His officers sent him to warn the capital. He told me how to reach a door hidden in the rock below the keep.');
    await say('violetta','I’ll go with Draymus to Nidal. We need someone who understands what he’s asking of them.');
    await say('freya','Then we split here. Jason, J’Mal, Reese, you’re with me. We’ll see if the signifier’s door still opens.');
    quest.nidalOperationSought=true;
    await travel(nidal,328,344);
    break;
   case 'nidalConsult':
    await say('draymus','Find me someone who can keep a brain alive outside its skull. The rest of me can wait.');
    await say('violetta','I’ll ask who can undertake it. I can make inquiries while I report to my superiors.');
    quest.dinyarReached=true;
    await travel(ridge,328,344);
    break;
   case 'dinyarView':
    await say('jason','Two keeps, one bridge. The Glorious Reclamation can see anyone crossing from either side.');
    await say('freya','They’ve held Dinyar nearly a year. We’ll use the lower route. Reese, J’Mal, find the door.');
    quest.dinyarSurveyed=true;
    break;
   case 'dinyarPostern':
    await say('reese','This is the shelf Corrine described. Look at the joint where the dressed stone meets the rock.');
    await say('jamal','There’s our seam. The signifier knew his keep.');
    quest.dinyarEntranceFound=true;
    break;
   case 'dinyarPlan':
    await say('freya','We go in below their defenses. If any Godclaw Hellknights are still in the dungeons, we find them on the way.');
    quest.dinyarReconComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact};
})();
