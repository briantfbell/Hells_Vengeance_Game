"use strict";

window.SenaraCitadel=(()=>{
 const villa='senara_fex_villa',citadel='senara_hellknight_citadel',road='whisperwood_road';
 const officer='senara_watch_officer',coachman='bob';
 const cast=[
  {id:officer,name:'Hellknight Watch Officer',image:'senara-hellknight-officer-v1.png',frame:{x:169,y:15,w:566,h:1482},face:{x:368,y:12,w:249,h:249}},
  {id:coachman,name:'Bob',image:'whisperwood-coachman-v1.png',frame:{x:148,y:10,w:653,h:1522},face:{x:406,y:6,w:256,h:256}}
 ];
 const maps={
  [citadel]:{
   name:'Senara · The Hellknight Citadel',image:'senara-hellknight-citadel-v1.png',spawn:[328,264],blocks:[],
   walk:[{x:64,y:144,w:512,h:128},{x:160,y:112,w:320,h:32},{x:512,y:112,w:96,h:48}],lights:[[39,82],[62,95],[261,62],[380,62],[586,55],[197,348],[443,348]],
   points:[
    {id:'citadelRespect',speaker:officer,x:104,y:152,label:'Pay respects to the local chapter'},
    {id:'citadelTrail',speaker:officer,x:104,y:152,label:'Ask about the Whisperwood'},
    {id:'citadelStudy',x:536,y:120,label:'Study the spell with Draymus'},
    {id:'citadelDepart',x:328,y:264,label:'Take the carriage southwest'}
   ]
  },
  [road]:{
   name:'Whisperwood · Southwest Road',image:'whisperwood-carriage-road-v1.png',spawn:[296,344],blocks:[],
   walk:[{x:256,y:64,w:112,h:32},{x:224,y:96,w:176,h:80},{x:192,y:176,w:256,h:64},{x:160,y:240,w:320,h:144}],lights:[[549,284],[623,284]],
   points:[{id:'whisperwoodBob',speaker:coachman,x:456,y:280,label:'Speak to Bob before entering the woods'}]
  }
 };
 function install(){
  scenes[villa].points.push({id:'senaraCitadel',x:328,y:344,label:'Visit the Hellknight citadel'});
  for(const [id,map] of Object.entries(maps)){
   scenes[id]=map;
   MAP_LAYERS[id]={foreground:map.image,contain:true,background:{type:'solid',color:'#11161c'}};
  }
  JOURNEYS[citadel]='With the talisman recovered, Freya visits the nearby Hellknight chapter. The fortress still holds, but the Reclamation has drawn its patrols back from the Whisperwood.';
  JOURNEYS[road]='Freya decides to hunt the unicorns southwest of Senara. Bob takes the reins of the black carriage the company has had since Longacre. Four warhorses now pull it.';
  for(const {id,name,image,frame,face} of cast){
   NAMES[id]=name;
   FUTURE_NPCS[id]={source:image,frame};
   DIALOGUE_FACE_CROPS[id]=face;
  }
 }
 async function load(loader){
  await Promise.all([
   ...Object.entries(maps).map(async ([id,{image}])=>{art[id]=await loader(image);}),
   ...cast.map(async ({image})=>{art[image]=await loader(image);})
  ]);
 }
 function mapImage(){return Object.hasOwn(maps,scene)?art[scene]:null;}
 function npcs(){
  if(scene===citadel)return [{id:officer,x:104,y:152,height:56}];
  if(scene===road)return [{id:coachman,x:456,y:280,height:53}];
  return null;
 }
 function points(){
  if(!quest.senaraTalismanRecovered)return null;
  if(scene===villa)return [point('senaraCitadel')];
  if(scene===citadel){
   if(!quest.senaraChapterGreeted)return [point('citadelRespect')];
   if(!quest.senaraDraymusTrained)return [point('citadelStudy')];
   return [point(quest.senaraForestIntel?'citadelDepart':'citadelTrail')];
  }
  if(scene===road)return quest.senaraWhisperwoodReady?[]:[point('whisperwoodBob')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===road&&quest.senaraWhisperwoodReady?'Ready to enter the Whisperwood.':null);}

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'senaraCitadel':
    quest.senaraCitadelVisited=true;
    await travel(citadel,328,264);
    break;
   case 'citadelRespect':
    await say('freya','Freya Kusanagi. I came to pay my respects and ask what your chapter has seen in the Whisperwood.');
    await say(officer,'You’re welcome here, Kusanagi. Your wizard can use the study while I fetch our patrol reports.');
    quest.senaraChapterGreeted=true;
    break;
   case 'citadelStudy':{
    const choice=await say('draymus','I have the spell’s pattern. Give me a moment to set it down.',[
     '[Transcribe the spell first]','[Rehearse the casting first]'
    ]);
    await say('draymus',choice===0?'Now that I’ve written it out, I can rehearse the casting. Give me room.':'The casting holds. I’ll write it out now, while I still have every part of it in my head.');
    await say('Chronicle','Draymus learns a new spell at the citadel.');
    quest.senaraDraymusTrained=true;
    break;
   }
   case 'citadelTrail':
    await say(officer,'Before the Reclamation came, we drove criminals and dangerous beasts out of these woods. Now we have enough hands to hold the citadel and little more.');
    await say(officer,'Our old patrol reports put the unicorns southwest of Senara. The farther you go, the less you can count on a cleared road.');
    await say('freya','Then we’ll take the unicorns next. Fex asked for four horns. Bob can get us to the woods in the carriage.');
    quest.senaraForestIntel=true;
    break;
   case 'citadelDepart':
    quest.senaraCarriageDeparted=true;
    await travel(road,296,344);
    break;
   case 'whisperwoodBob':
    await say(coachman,'Four warhorses make a fine team, but I can only take them where there’s room for the carriage. Tell me where we’re stopping before it gets dark.');
    await say('freya','Stay with the carriage, Bob. We’ll find a place to make camp before we go looking for the herd.');
    quest.senaraWhisperwoodReady=true;
    break;
  }
  save();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,npcs,points,target,goal,interact};
})();
