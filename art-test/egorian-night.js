"use strict";

window.EgorianNight=(()=>{
 const manor='egorian_manor',lantern='egorian_lantern_lane',guardLane='egorian_guard_lane';
 const pair=['jamal','guapo'];
 const layouts={
  [lantern]:{
   name:'Egorian · Lantern Lane',image:'egorian-lantern-lane-v1.png',spawn:[328,344],
   walk:[{x:112,y:208,w:416,h:96},{x:272,y:304,w:112,h:80},
    {x:144,y:176,w:64,h:32},{x:448,y:128,w:80,h:80}],
   lights:[[176,111],[52,294],[588,293]],
   points:[{id:'nightSvetlana',speaker:'svetlana',x:184,y:216,label:'Speak to Svetlana'},
    {id:'nightFollowLead',speaker:'svetlana',x:488,y:152,label:'Follow the guard’s trail'}]
  },
  [guardLane]:{
   name:'Egorian · The Guard’s Lane',image:'egorian-guard-lane-v1.png',spawn:[328,344],
   walk:[{x:272,y:80,w:112,h:304},{x:80,y:144,w:192,h:16},{x:304,y:64,w:64,h:16}],
   lights:[[91,93],[152,93],[293,37],[397,37],[504,138]],
   points:[{id:'nightInspect',x:120,y:152,label:'Check the neighbor’s house'},
    {id:'nightContract',speaker:'jaquen',x:344,y:88,label:'Meet Jaquen'},
    {id:'nightReturn',x:328,y:344,label:'Return to Falco Manor'}]
  }
 };

 function install(){
  scenes[manor].points.push({id:'nightLeave',x:328,y:312,label:'Slip out with El Guapo'});
  for(const [id,layout] of Object.entries(layouts)){
   scenes[id]={...layout,blocks:[]};
   MAP_LAYERS[id]={foreground:layout.image,background:{type:'solid',color:'#10141e'}};
  }
  JOURNEYS[lantern]='While the others settle in, J’Mal and El Guapo slip into Egorian. They follow the lanterns in search of a drink and a good time.';
  JOURNEYS[guardLane]='Svetlana takes the pair away from the tavern lights. The trail leads to the street where the crooked guard was last heard from.';
  NAMES.svetlana='Svetlana';
  NAMES.jaquen='Jaquen';
  FUTURE_NPCS.svetlana={source:'egorian-svetlana-v1.png',frame:{x:124,y:6,w:646,h:1524}};
  FUTURE_NPCS.jaquen={source:'egorian-jaquen-v1.png',frame:{x:173,y:26,w:665,h:1495}};
  DIALOGUE_FACE_CROPS.svetlana={x:309,y:0,w:299,h:299};
  DIALOGUE_FACE_CROPS.jaquen={x:365,y:20,w:300,h:300};
 }
 async function load(loader){
  await Promise.all(Object.entries(layouts).map(async ([id,{image}])=>{art[id]=await loader(image);}));
  await Promise.all(['egorian-svetlana-v1.png','egorian-jaquen-v1.png'].map(async image=>{art[image]=await loader(image);}));
 }
 function mapImage(){return art[scene]&&Object.hasOwn(layouts,scene)?art[scene]:null;}
 function roster(){return Object.hasOwn(layouts,scene)?pair:null;}
 function npcs(){
  if(scene===lantern)return [{id:'svetlana',...(quest.egorianSvetlanaMet?{x:488,y:136}:{x:176,y:200})}];
  if(scene===guardLane){
   if(!quest.egorianGuardLeadChecked)return [{id:'svetlana',x:104,y:152}];
   return quest.egorianContractAccepted?[]:[{id:'jaquen',x:344,y:72}];
  }
  return null;
 }
 function target(){
  if(!quest.egorianArrivalComplete)return null;
  if(scene===manor&&!quest.egorianNightStarted)return point('nightLeave');
  if(scene===lantern)return point(quest.egorianSvetlanaMet?'nightFollowLead':'nightSvetlana');
  if(scene===guardLane){
   if(!quest.egorianGuardLeadChecked)return point('nightInspect');
   return point(quest.egorianContractAccepted?'nightReturn':'nightContract');
  }
  return null;
 }
 function points(){
  const next=target();
  return next?[next]:scene===manor&&quest.egorianNightReturned?[]:null;
 }
 function goal(){return target()?.label||(scene===manor&&quest.egorianNightReturned?'Back at Falco Manor before dawn.':null);}

 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'nightLeave':
    quest.egorianNightStarted=true;
    await travel(lantern,328,344);
    break;
   case 'nightSvetlana':
    await say('guapo','I promised a drink and a little company. So far I see neither. Shall we try somewhere louder?');
    await say('jamal','I remember this street. Last time we came through, a city guard marked us for thieves. They came for us in our hotel. We killed them. He walked away.');
    await say('svetlana','J’Mal. I was hoping you’d come back without another pile of bodies to get rid of.');
    await say('jamal','Just one loose end. Have you heard anything about the guard who sold us out?');
    await say('svetlana','I know where to start. Come with me.');
    quest.egorianSvetlanaMet=true;
    break;
   case 'nightFollowLead':
    await travel(guardLane,328,344);
    break;
   case 'nightInspect':
    await say('svetlana','His neighbor was murdered. The guard disappeared, and this is where the trail stops.');
    await say('guapo','A dead neighbor and a missing guard. Someone had a busier night than we did.');
    await say('jamal','Could have been one of the Red Mantis. I’ll get word to my mentor. If anyone knows where the guard is, it’s Jaquen.');
    quest.egorianGuardLeadChecked=true;
    break;
   case 'nightContract':
    await say('jaquen','I took your guard. He’s alive. Two days to finish a job for me and you get him and five thousand gold.');
    await say('jamal','Who’s the job?');
    await say('jaquen','A lesser noble who thinks he’s a bard. You’ll likely find him at Oppian’s public excruciation. He’ll have capable bodyguards.');
    await say('jaquen','Kill him in public and I’ll add another five thousand.', ['[Take Jaquen’s contract]']);
    await say('jamal','Keep the guard alive. We have unfinished business.');
    quest.egorianContractAccepted=true;
    break;
   case 'nightReturn':
    await journeyCard('Falco Manor · Before Dawn','J’Mal and El Guapo return just before dawn. Jaquen still holds the guard, and J’Mal has two days to fulfill the contract.',()=>{
     quest.egorianNightReturned=true;
     setScene(manor,328,312);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,npcs,target,points,goal,interact};
})();
