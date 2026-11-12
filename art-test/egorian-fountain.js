"use strict";

window.EgorianFountain=(()=>{
 const hotel='egorian_hotel_barato',fountain='egorian_fountain',street='egorian_tailor_street';
 const stranger='fountain_stranger',portrait='egorian-fountain-stranger-v1.png';
 const layouts={
  [fountain]:{
   name:'Egorian · The Fountain',image:'egorian-fountain-v1.png',spawn:[328,344],
   walk:[{x:112,y:192,w:416,h:176}],
   points:[
    {id:'egorianFountainMeeting',x:360,y:216,label:'Meet the stranger by the fountain'},
    {id:'egorianScoutTailor',x:472,y:328,label:'Follow the tailor’s routine'}
   ]
  },
  [street]:{
   name:'Egorian · The Tailor’s Quarter',image:'egorian-tailor-street-v1.png',spawn:[328,344],
   walk:[{x:64,y:272,w:512,h:112},{x:512,y:224,w:64,h:48}],
   points:[
    {id:'egorianObserveShop',x:136,y:296,label:'Watch the tailor shop'},
    {id:'egorianObserveHome',x:376,y:296,label:'Find the family’s home'},
    {id:'egorianObserveSchools',x:536,y:248,label:'Follow the route to the schools'},
    {id:'egorianTailorReport',x:328,y:344,label:'Bring the route back to Hotel Barato'}
   ]
  }
 };
 function install(){
  scenes[hotel].points.push({id:'egorianFountainVision',speaker:'reese',x:328,y:216,label:'Hear Reese’s vision'});
  for(const [id,layout] of Object.entries(layouts)){
   scenes[id]={...layout,blocks:[],lights:[]};
   MAP_LAYERS[id]={foreground:layout.image,contain:true,background:{type:'solid',color:'#1b2028'}};
  }
  JOURNEYS[fountain]='Monday morning. Reese recognizes a fountain from his visions. J’Mal goes with him to see who is waiting.';
  JOURNEYS[street]='J’Mal and El Guapo spend the day learning the family’s routine. Find the shop, the house, and the schools.';
  NAMES[stranger]='Stranger';
  FUTURE_NPCS[stranger]={source:portrait,frame:{x:180,y:0,w:620,h:1536}};
  DIALOGUE_FACE_CROPS[stranger]={x:389,y:8,w:250,h:250};
 }
 async function load(loader){
  await Promise.all([
   ...Object.entries(layouts).map(async([id,{image}])=>{art[id]=await loader(image);}),
   (async()=>{art[portrait]=await loader(portrait);})()
  ]);
 }
 function mapImage(){return Object.hasOwn(layouts,scene)?art[scene]:null;}
 function roster(){
  if(scene===fountain)return ['reese','jamal'];
  if(scene===street)return ['jamal','guapo'];
  return null;
 }
 function points(){
  if(!quest.egorianDischargeComplete)return null;
  if(scene===hotel)return quest.egorianTailorScouted?[]:[point('egorianFountainVision')];
  if(scene===fountain)return [point(quest.egorianFountainOrders?'egorianScoutTailor':'egorianFountainMeeting')];
  if(scene!==street)return null;
  if(!quest.egorianTailorShopSeen)return [point('egorianObserveShop')];
  if(!quest.egorianTailorHomeSeen)return [point('egorianObserveHome')];
  if(!quest.egorianTailorSchoolsSeen)return [point('egorianObserveSchools')];
  return [point('egorianTailorReport')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===hotel&&quest.egorianTailorScouted?'The company has the tailor’s routine. The stranger’s deadline is Thursday.':null);
 }
 function npcs(){
  if(scene===fountain)return quest.egorianFountainOrders?[]:[{id:stranger,x:376,y:192,height:54}];
  if(scene===street)return [
   {id:'citizen-tailor-street-1',x:106,y:285,dir:'right',variant:6},
   {id:'citizen-tailor-street-2',x:258,y:321,dir:'left',variant:2},
   {id:'citizen-tailor-street-3',x:560,y:293,dir:'left',variant:4}
  ];
  return null;
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'egorianFountainVision':
    await say('reese','The same fountain keeps coming to me in flashes. There’s a man waiting beside it. I think I know the street.');
    await say('jamal','Then I’m coming with you.');
    quest.egorianVisionSeen=true;
    await travel(fountain,328,344);
    break;
   case 'egorianFountainMeeting':
    await say(stranger,'There’s a famous tailor here in Egorian. Every morning she leaves for brunch with friends. Her husband opens their shop. Their three children go to school.');
    await say(stranger,'In my story, she reaches the shop at ten. There’s a crowd around the window, admiring how lifelike the mannequins look.');
    await say(stranger,'Then she gets close enough to recognize them. Her husband and all three children are dead, dressed in garments from her shop.');
    await say('reese','Why tell us this?');
    await say(stranger,'Reese and his allies will make that story come true by Thursday. Today is Monday. Afterward, report to Florio Cento in Remesiana. There are more favors to repay.');
    await say('jamal','Fine. I’ll find out where they go.');
    quest.egorianFountainOrders=true;
    break;
   case 'egorianScoutTailor':
    quest.egorianTailorStreetReached=true;
    await travel(street,328,344);
    break;
   case 'egorianObserveShop':
    await say('Chronicle','The tailor’s husband opens the shop. Its display window faces the street. She arrives at ten, after brunch.');
    await say('guapo','Anybody on this street can see what’s in that window. That’s what he’s counting on.');
    quest.egorianTailorShopSeen=true;
    break;
   case 'egorianObserveHome':
    await say('Chronicle','J’Mal and El Guapo find the family’s home and trace the separate morning routes from its door.');
    quest.egorianTailorHomeSeen=true;
    break;
   case 'egorianObserveSchools':
    await say('Chronicle','They follow the three children’s routes far enough to locate their schools.');
    await say('jamal','Shop, house, schools. We’ve got what we came for.');
    quest.egorianTailorSchoolsSeen=true;
    break;
   case 'egorianTailorReport':
    await journeyCard('Hotel Barato · After the watch','J’Mal and El Guapo bring the family’s routine back to Hotel Barato. The company puts together a plan before Thursday.',()=>{
     quest.egorianTailorScouted=true;
     setScene(hotel,328,328);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact};
})();
