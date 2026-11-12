"use strict";

window.HinjiTavern=(()=>{
 const square='belde_square',tavern='hinji_tavern',vel='titus_vel',watch='guard';
 const image='hinji-tavern-v1.png',disguise='hinji-titus-vel-v1.png';

 function install(){
  scenes[square].points.push({id:'hinjiTavernDepart',x:328,y:344,label:'Leave for Hinji'});
  scenes[tavern]={
   name:'Hinji · Harbor Tavern',image,spawn:[328,328],
   walk:[{x:128,y:128,w:384,h:224},{x:256,y:352,w:128,h:48}],blocks:[],
   lights:[[85,132],[249,68],[399,68],[582,113],[559,181],[75,289]],
   points:[
    {id:'hinjiTavernToast',speaker:vel,x:328,y:184,label:'Join El Guapo at the bar'},
    {id:'hinjiTavernArrest',speaker:watch,x:328,y:248,label:'Speak to the watch'}
   ]
  };
  MAP_LAYERS[tavern]={foreground:image,contain:true,background:{type:'solid',color:'#201713'}};
  JOURNEYS[tavern]='12 Pharast, 4717. The company stops for a drink on the way to Corentyn. El Guapo has brought a change of clothes.';
  NAMES[vel]='Titus Vel';
  FUTURE_NPCS[vel]={source:disguise,frame:{x:101,y:12,w:816,h:1508}};
  DIALOGUE_FACE_CROPS[vel]={x:309,y:110,w:327,h:327};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[tavern]=await loader(image);})(),
   (async()=>{art[disguise]=await loader(disguise);})()
  ]);
 }
 function mapImage(){return scene===tavern?art[scene]:null;}
 function roster(){
  if(scene!==tavern)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===square&&quest.beldeComplete)return [point('hinjiTavernDepart')];
  if(scene!==tavern)return null;
  if(quest.hinjiTavernArrested)return [];
  return [point(quest.hinjiTavernToast?'hinjiTavernArrest':'hinjiTavernToast')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===tavern&&quest.hinjiTavernArrested?'The watch has taken El Guapo. The company is bound for Corentyn.':null);}
 function npcs(){
  if(scene!==tavern)return null;
  const patrons=[
   {id:'citizen-hinji-tavern-1',x:121,y:224,dir:'right',variant:2},
   {id:'citizen-hinji-tavern-2',x:510,y:219,dir:'left',variant:6}
  ];
  if(quest.hinjiTavernArrested)return patrons;
  patrons.push({id:vel,x:328,y:154,height:62});
  if(quest.hinjiTavernToast)patrons.push({id:watch,x:328,y:280,height:56});
  return patrons;
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'hinjiTavernDepart':
    quest.hinjiTavernReached=true;
    await travel(tavern,328,328);
    break;
   case 'hinjiTavernToast': {
    await say(vel,'Titus Vel, at your service. You may recognize the hat from several reputable establishments.');
    const choice=await say('Chronicle','El Guapo looks up over the rim of his tankard. His feather dips into it.',[
     '[Play along.]','[Tell him to keep his voice down.]'
    ]);
    if(choice===0)await say('freya','A pleasure, Master Vel. How many of those establishments let you back in?');
    else await say('freya','Keep your voice down, Titus. The entire room can hear you.');
    await say(vel,'Excellent. I was worried the people in the back might miss the toast.');
    await say('Chronicle','The door opens. A member of the watch steps in from the street.');
    quest.hinjiTavernToast=true;
    break;
   }
   case 'hinjiTavernArrest':
    await say(watch,'Name?');
    await say(vel,'Titus Vel. I can spell it, if you bring me another drink.');
    await say(watch,'Public drunkenness, Master Vel. On your feet.');
    await say(vel,'I was hoping you wouldn’t ask me to demonstrate.');
    await say('Chronicle','The watch leads El Guapo out under the name Titus Vel. The company’s next stop is Corentyn.');
    quest.hinjiTavernArrested=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact};
})();
