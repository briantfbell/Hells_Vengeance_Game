"use strict";

window.EgorianTrial=(()=>{
 const manor='egorian_manor',court='egorian_court',forge='egorian_forge';
 const witnesses=['freya','jason'],smithVisit=['freya'];
 const layouts={
  [court]:{
   name:'Egorian · Court of High Treason',image:'egorian-court-v1.png',spawn:[328,344],
   walk:[{x:96,y:176,w:448,h:176},{x:288,y:336,w:64,h:64}],
   lights:[[109,108],[209,77],[260,80],[380,80],[431,77],[532,108]],
   points:[{id:'trialMeetZara',x:328,y:272,speaker:'zara',label:'Meet Zara at the court'},
    {id:'trialFreya',x:120,y:184,label:'Give Freya’s testimony'},
    {id:'trialJason',x:120,y:184,label:'Give Jason’s testimony'},
    {id:'trialVerdict',x:328,y:176,label:'Hear the verdict'},
    {id:'trialRide',x:328,y:344,label:'Leave with Zara'}]
  },
  [forge]:{
   name:'Thumbtown · The Smith’s Forge',image:'egorian-thumbtown-forge-v1.png',spawn:[328,344],
   walk:[{x:112,y:192,w:416,h:128},{x:272,y:304,w:96,h:96}],
   lights:[[166,148],[505,104]],
   points:[{id:'trialSmith',x:248,y:224,speaker:'thumbtown_smith',label:'Meet the blacksmith'},
    {id:'trialPlate',x:328,y:200,speaker:'zara_geitta',label:'Try on Zara Geitta'},
    {id:'trialReturn',x:328,y:344,label:'Return to Falco Manor'}]
  }
 };
 const armored={
  src:'freya-zara-geitta-walk-v1.png',maxHeight:513,walkCycle:[1,0,2,0],
  frames:[
   [72,18,232,494,181],[379,18,241,494,488],[688,18,232,494,792],
   [50,543,192,487,186],[332,543,278,484,501],[651,545,272,482,812],
   [71,1058,207,512,175],[351,1058,238,513,484],[662,1058,242,513,792]
  ].map(([x,y,w,h,anchorX])=>({x,y,w,h,anchorX}))
 };

 function install(){
  scenes[manor].points.push({id:'trialSummons',x:328,y:312,label:'Answer the court summons'});
  for(const [id,layout] of Object.entries(layouts)){
   scenes[id]={...layout,blocks:[]};
   MAP_LAYERS[id]={foreground:layout.image,contain:true,background:{type:'solid',color:'#120f17'}};
  }
  JOURNEYS[court]='Freya and Jason have been summoned to testify. Oppian Nevilindor is before the court on a charge of high treason.';
  JOURNEYS[forge]='After the verdict, Zara takes Freya to Thumbtown, Egorian’s craftsman district. The carriage stops outside a large forge. Freya steps down as Zara’s carriage continues toward the Promenade.';
  NAMES.egorian_magistrate='Magistrate';
  FUTURE_NPCS.egorian_magistrate={source:'egorian-magistrate-v1.png',frame:{x:0,y:0,w:1312,h:1199}};
  NAMES.thumbtown_smith='Thumbtown Blacksmith';
  NAMES.zara_geitta='Zara Geitta';
  FUTURE_NPCS.thumbtown_smith={source:'egorian-thumbtown-smith-v1.png',frame:{x:282,y:14,w:617,h:1285}};
  FUTURE_NPCS.zara_geitta={source:'zara-geitta-display-v1.png',frame:{x:161,y:41,w:702,h:1423}};
  DIALOGUE_FACE_CROPS.thumbtown_smith={x:421,y:0,w:328,h:328};
 }
 async function load(loader){
  await Promise.all([
   ...Object.entries(layouts).map(async ([id,{image}])=>{art[id]=await loader(image);}),
   ...['egorian-magistrate-v1.png','egorian-thumbtown-smith-v1.png','zara-geitta-display-v1.png',armored.src].map(async image=>{art[image]=await loader(image);})
  ]);
 }
 function mapImage(){return Object.hasOwn(layouts,scene)?art[scene]:null;}
 function roster(){return scene===court?witnesses:scene===forge?smithVisit:null;}
 function movement(){
  return Inventory.hasFreyaPlate(quest)&&art[armored.src]?{meta:armored,image:art[armored.src]}:null;
 }
 function npcs(){
  if(scene===court)return [
   {id:'zara',x:quest.egorianVerdict?352:328,y:quest.egorianVerdict?328:256},
   ...(!quest.egorianVerdict?[
    {id:'egorian_magistrate',x:320,y:98,height:30},
    {id:'oppian',x:520,y:176},{id:'guard',x:464,y:192}
   ]:[])
  ];
  if(scene===forge)return [
   {id:'thumbtown_smith',x:quest.egorianSmithMet?256:248,y:quest.egorianSmithMet?192:208,height:49},
   ...(!quest.zaraGeitta?[{id:'zara_geitta',x:320,y:159,height:74}]:[])
  ];
  return null;
 }
 function target(){
  if(!quest.egorianNightReturned)return null;
  if(scene===manor&&!quest.egorianTrialStarted)return point('trialSummons');
  if(scene===court){
   if(!quest.egorianZaraMet)return point('trialMeetZara');
   if(!quest.egorianFreyaTestified)return point('trialFreya');
   if(!quest.egorianJasonTestified)return point('trialJason');
   return point(quest.egorianVerdict?'trialRide':'trialVerdict');
  }
  if(scene===forge){
   if(!quest.egorianSmithMet)return point('trialSmith');
   return point(quest.zaraGeitta?'trialReturn':'trialPlate');
  }
  return null;
 }
 function points(){
  const next=target();
  return next?[next]:scene===manor&&quest.egorianPlateReturned?[]:null;
 }
 function goal(){return target()?.label||(scene===manor&&quest.egorianPlateReturned?'Oppian’s public excruciation is tomorrow.':null);}

 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'trialSummons':
    quest.egorianTrialStarted=true;
    await travel(court,328,344);
    break;
   case 'trialMeetZara':
    await say('zara','Freya. Jason. I’m glad you made it. Tell the court what happened in Kantaria and how you brought him here.');
    quest.egorianZaraMet=true;
    break;
   case 'trialFreya':
    await say('egorian_magistrate','Captain Kusanagi, tell the court how Nevilindor came into your custody.');
    await say('freya','At Valor’s Fastness, we faced Nevilindor on the summit. He went over the parapet. We broke his fall, brought him down alive, and kept him in our custody on the road.');
    quest.egorianFreyaTestified=true;
    break;
   case 'trialJason':
    await say('egorian_magistrate','Jason, what happened on the way to Egorian?');
    await say('jason','Reclamation soldiers blocked the South Road. We broke through them and delivered Nevilindor alive to the Dottari in Egorian.');
    quest.egorianJasonTestified=true;
    break;
   case 'trialVerdict':
    await journeyCard('The Verdict','Six hours pass in testimony. The court finds Oppian Nevilindor guilty of high treason and adjourns. The Dottari take him from the courtroom.',()=>{
     quest.egorianVerdict=true;
     save();
    });
    break;
   case 'trialRide':
    await say('zara','The plate is finished, Freya. You’ve earned it. Come with me.');
    await say('zara','I asked for a posting at the front. I’m headed to Westcrown. Good luck, Freya.');
    await travel(forge,328,344);
    break;
   case 'trialSmith':
    await say('thumbtown_smith','Freya Kusanagi? Come in. I cleared out a whole forge for this. You won’t see another suit made quite like it.');
    quest.egorianSmithMet=true;
    break;
   case 'trialPlate':
    await say('Chronicle','The fitted adamantine looks black in the forge’s shadow. Where sunlight touches the plate, it turns a deep crimson.');
    await say('thumbtown_smith','See the cot? Zara worked more than twenty hours a day for five days. We could barely get her to stop for food and water.');
    await say('thumbtown_smith','I call it Zara Geitta. In the old language of my people, that means “Zara watches over you.” Try it on.');
    await say(null,'The last fitting is yours.', ['[Put on Zara Geitta]']);
    await journeyCard('Zara Geitta','Freya fits the last piece of the adamantine plate. It moves easily with her.\n\nZara Geitta equipped. +2 AC and up to 3 less physical damage per hit.',()=>{
     quest.zaraGeitta=true;
     applyProgression();
     save();
    });
    break;
   case 'trialReturn':
    await journeyCard('Falco Manor · The Evening Before','Freya returns wearing her new plate. With Oppian’s public excruciation set for the next day, the company prepares for an early night.',()=>{
     quest.egorianPlateReturned=true;
     setScene(manor,328,312);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,movement,npcs,target,points,goal,interact,armored};
})();
