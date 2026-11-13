"use strict";

window.SenaraCover=(()=>{
 const villa='senara_fex_villa',party='senara_party',outside='senara_orphan_yard',inside='senara_orphanage';
 const revel='senara-revel-cast-v1.png',children='senara-orphan-witnesses-v1.png';
 const maps={
  [outside]:{
   name:'Senara · Orphanage Yard',image:'senara-orphan-yard-v1.png',spawn:[328,344],blocks:[],
   walk:[{x:96,y:208,w:496,h:128},{x:272,y:320,w:80,h:80},{x:288,y:160,w:48,h:64},{x:544,y:160,w:48,h:64}],
   lights:[[273,109]],
   points:[{id:'orphanFront',x:312,y:168,label:'Slip through the main door'},
    {id:'orphanSide',x:568,y:168,label:'Try the side entrance'}]
  },
  [inside]:{
   name:'Senara · The Orphanage',image:'senara-orphanage-v1.png',spawn:[328,344],blocks:[],
   walk:[{x:112,y:176,w:480,h:144},{x:208,y:144,w:240,h:48},{x:464,y:144,w:96,h:48},{x:272,y:304,w:64,h:96}],
   lights:[[127,89],[254,53],[427,53],[486,94]],
   points:[{id:'orphanSearch',x:512,y:152,label:'Search the records on the desk'},
    {id:'orphanWitnesses',x:184,y:208,label:'See who is by the beds'},
    {id:'orphanWithdraw',x:328,y:344,label:'Leave with the sewer lead'}]
  }
 };

 function install(){
  scenes[villa].points.push({id:'senaraHost',x:328,y:248,label:'Join El Guapo’s reception'});
  scenes[party]={...scenes[villa],name:'Senara · El Guapo’s Reception',points:[
   {id:'senaraToast',x:328,y:216,label:'Welcome the garrison guests'},
   {id:'senaraSlipOut',x:328,y:344,label:'Follow Draymus and Jason'}
  ]};
  MAP_LAYERS[party]=MAP_LAYERS[villa];
  for(const [id,map] of Object.entries(maps)){
   scenes[id]=map;
   MAP_LAYERS[id]={foreground:map.image,contain:true,background:{type:'solid',color:'#10141e'}};
  }
  JOURNEYS[party]='El Guapo invites members of the Reclamation garrison to Fex’s house. Whether he meant to gather intelligence or simply wanted a party will depend on whom you ask.';
  JOURNEYS[outside]='While the guests stay with El Guapo, Draymus and Jason slip away to an orphanage once used by the local thieves’ guild. There’s a lantern over the front steps and a dark side entrance.';
  JOURNEYS[inside]='The house is quiet. Somewhere in these rooms there may still be traces of the guild’s old operation.';
  NAMES.senara_guest='Garrison Soldier';
  NAMES.senara_officer='Garrison Officer';
  FUTURE_NPCS.senara_guest={source:revel,frame:{x:230,y:14,w:280,h:700}};
  FUTURE_NPCS.senara_officer={source:revel,frame:{x:950,y:12,w:273,h:702}};
  FUTURE_NPCS.senara_tray={source:revel,frame:{x:1604,y:213,w:409,h:382}};
  DIALOGUE_FACE_CROPS.senara_guest={x:301,y:10,w:154,h:154};
  DIALOGUE_FACE_CROPS.senara_officer={x:1007,y:8,w:156,h:156};
  [[144,57,273,933],[611,36,285,954],[1100,41,276,949]].forEach(([x,y,w,h],i)=>{
   FUTURE_NPCS['senara_witness_'+i]={source:children,frame:{x,y,w,h}};
  });
 }

 async function load(loader){
  art[party]=art[villa];
  await Promise.all([
   ...Object.entries(maps).map(async ([id,{image}])=>{art[id]=await loader(image);}),
   ...[revel,children].map(async image=>{art[image]=await loader(image);})
  ]);
 }
 function mapImage(){return scene===party||Object.hasOwn(maps,scene)?art[scene]:null;}
 function roster(){return scene===party?['guapo']:Object.hasOwn(maps,scene)?['draymus','jason']:null;}
 function npcs(){
  if(scene===party)return [
   {id:'senara_guest',x:240,y:184},{id:'senara_officer',x:416,y:184},
   {id:'senara_tray',x:296,y:200,height:28},{id:'senara_tray',x:432,y:224,height:26},
   {id:'citizen-senara-guest-1',x:224,y:240,dir:'right',variant:6},
   {id:'citizen-senara-guest-2',x:392,y:240,dir:'left',variant:2},
   {id:'citizen-senara-guest-3',x:480,y:240,dir:'left',variant:5}
  ];
  if(scene===inside)return quest.senaraOrphanClue?
   [152,184,216].map((x,i)=>({id:'senara_witness_'+i,x,y:184,height:37})): [];
  return scene===outside?[]:null;
 }
 function points(){
  if(!quest.senaraTalismanMissing)return null;
  if(scene===villa)return quest.senaraOrphanageComplete?[]:[point('senaraHost')];
  if(scene===party)return [point(quest.senaraPartyPlayed?'senaraSlipOut':'senaraToast')];
  if(scene===outside)return [point('orphanFront'),point('orphanSide')];
  if(scene===inside)return [point(!quest.senaraOrphanClue?'orphanSearch':!quest.senaraWitnessesSeen?'orphanWitnesses':'orphanWithdraw')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===outside&&quest.senaraTalismanMissing)return 'Choose a way into the orphanage.';
  return target()?.label||(scene===villa&&quest.senaraOrphanageComplete?'Follow the sewer lead to the Black Daggers.':null);
 }

 async function enterOrphanage(side){
  await say('jason',side?'There’s no light at this entrance. Stay close.':'Keep clear of the lantern. We can cross between the steps and the wall.');
  await storyRoll('Draymus and Jason · Move quietly',side?16:14,0,'Enter unnoticed');
  quest.senaraOrphanEntered=true;
  await travel(inside,side?568:328,side?216:344,side?'left':'up');
 }

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'senaraHost':
    quest.senaraPartyStarted=true;
    await travel(party,328,344);
    break;
   case 'senaraToast':{
    await say('senara_guest','You invited us into a finer house than any of the officers have put us in.');
    const toast=await say('guapo','What shall I drink to?', ['[Offer a toast to the guests]','[Ask how they find Senara]']);
    if(toast===0)await say('guapo','To guests who arrive thirsty and leave before they ask whose house this is.');
    else await say('guapo','You have the river, the town and all those banners. Does anyone here ever get a night off?');
    await say('senara_officer','We have tonight. I’ll take a drink while it’s still mine.');
    quest.senaraPartyPlayed=true;
    save();
    updateObjective();
    await say('Chronicle','El Guapo keeps the drinks coming. While the garrison is occupied, Draymus and Jason can slip out.');
    break;
   }
   case 'senaraSlipOut':
    quest.senaraOrphanApproach=true;
    await travel(outside,328,344);
    break;
   case 'orphanFront':
   case 'orphanSide':
    await enterOrphanage(id==='orphanSide');
    break;
   case 'orphanSearch':
    await say('draymus','Look at the guild marks beside the water lines. The sewer leads to caves beneath the city.');
    await say(null,'The old records mark a route under Senara.', ['[Copy the sewer route]']);
    quest.senaraOrphanClue=true;
    save();
    updateObjective();
    await say('jason','That’ll get us to the Black Daggers. Wait. Did you hear footsteps by the beds?');
    break;
   case 'orphanWitnesses':
    await say('Chronicle','Three children have stopped near the beds. They see Draymus and Jason in the room.');
    await say('jason','We have what we came for. It’s time to go.');
    quest.senaraWitnessesSeen=true;
    break;
   case 'orphanWithdraw':
    await journeyCard('Below Senara','Draymus and Jason bring the sewer lead back to the company. The three children who saw them are never seen again.',()=>{
     quest.senaraOrphanageComplete=true;
     setScene(villa,328,312);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }

 return {install,load,mapImage,roster,npcs,points,target,goal,interact};
})();
