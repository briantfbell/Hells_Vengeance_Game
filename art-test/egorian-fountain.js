"use strict";

window.EgorianFountain=(()=>{
 const hotel='egorian_hotel_barato',fountain='egorian_fountain',street='egorian_tailor_street',harbor='remesiana_return';
 const aftermath='egorian-tailor-aftermath-v1.png';
 const stranger='fountain_stranger',portrait='egorian-fountain-stranger-v1.png';
 const layouts={
  [fountain]:{
   name:'Egorian · The Fountain',image:'egorian-fountain-v1.png',spawn:[328,344],
   walk:[{x:64,y:208,w:496,h:192},{x:64,y:80,w:176,h:128},{x:384,y:80,w:176,h:128},{x:240,y:80,w:144,h:16}],
   points:[
    {id:'egorianFountainMeeting',speaker:stranger,x:376,y:192,label:'Meet the stranger by the fountain'},
    {id:'egorianScoutTailor',x:520,y:368,label:'Follow the tailor’s routine'}
   ]
  },
  [street]:{
   name:'Egorian · The Tailor’s Quarter',image:'egorian-tailor-street-v1.png',spawn:[328,344],
   walk:[{x:32,y:272,w:576,h:128},{x:496,y:240,w:96,h:32},{x:512,y:192,w:64,h:48}],
   points:[
    {id:'egorianObserveShop',x:136,y:296,label:'Watch the tailor shop'},
    {id:'egorianObserveHome',x:376,y:296,label:'Find the family’s home'},
    {id:'egorianObserveSchools',x:536,y:216,label:'Follow the route to the schools'},
    {id:'egorianTailorReport',x:328,y:344,label:'Bring the route back to Hotel Barato'},
    {id:'egorianSeeTailorAftermath',x:152,y:328,label:'See what happened on Dapper Street'},
    {id:'egorianDepartForRemesiana',x:472,y:344,label:'Leave for Remesiana'}
   ]
  }
 };
 function install(){
  scenes[hotel].points.push(
   {id:'egorianFountainVision',speaker:'reese',x:328,y:216,label:'Hear Reese’s vision'},
   {id:'egorianCarryOutOrders',x:328,y:328,label:'Carry out the stranger’s assignment'}
  );
  scenes[harbor]={...scenes.remesiana,name:'Remesiana · Return to the Harbor',points:[
   {id:'remesianaFindContact',x:424,y:184,label:'Make for the city to find Florio Cento'}
  ]};
  MAP_LAYERS[harbor]=MAP_LAYERS.remesiana;
  JOURNEYS[harbor]='The company leaves Egorian behind. In Remesiana, their orders are to find Florio Cento.';
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
   ...[portrait,aftermath].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){
  if(scene===harbor)return art.remesiana;
  if(scene===street&&quest.egorianTailorOrdersCarriedOut)return art[aftermath];
  return Object.hasOwn(layouts,scene)?art[scene]:null;
 }
 function roster(){
  if(scene===fountain)return ['reese','jamal'];
  if(scene===street&&!quest.egorianTailorOrdersCarriedOut)return ['jamal','guapo'];
  return null;
 }
 function points(){
  if(!quest.egorianDischargeComplete)return null;
  if(scene===hotel)return [point(quest.egorianTailorScouted?'egorianCarryOutOrders':'egorianFountainVision')];
  if(scene===harbor)return quest.remesianaFlorioLead?[]:[point('remesianaFindContact')];
  if(scene===fountain)return [point(quest.egorianFountainOrders?'egorianScoutTailor':'egorianFountainMeeting')];
  if(scene!==street)return null;
  if(quest.egorianTailorOrdersCarriedOut)return [point(quest.egorianTailorAftermathSeen?'egorianDepartForRemesiana':'egorianSeeTailorAftermath')];
  if(!quest.egorianTailorShopSeen)return [point('egorianObserveShop')];
  if(!quest.egorianTailorHomeSeen)return [point('egorianObserveHome')];
  if(!quest.egorianTailorSchoolsSeen)return [point('egorianObserveSchools')];
  return [point('egorianTailorReport')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===harbor&&quest.remesianaFlorioLead?'Find Florio Cento in Remesiana.':null);
 }
 function npcs(){
  if(scene===fountain)return quest.egorianFountainOrders?[]:[{id:stranger,x:376,y:192,height:54}];
  if(scene===harbor)return [
   {id:'citizen-remesiana-return-1',x:440,y:208,dir:'left',variant:1},
   {id:'citizen-remesiana-return-2',x:344,y:200,dir:'right',variant:5}
  ];
  if(scene===street&&quest.egorianTailorOrdersCarriedOut)return [
   {x:76,y:296},{x:104,y:298},{x:133,y:300},{x:160,y:298},{x:187,y:297},
   {x:87,y:320},{x:114,y:326},{x:179,y:327},{x:210,y:317}
  ].map((pos,i)=>({...pos,id:'citizen-dapper-street-'+i,dir:'up',variant:i%8}));
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
   case 'egorianCarryOutOrders':
    await say('jamal','We know where each of them goes in the morning. We have enough to carry out the order.');
    await journeyCard('Egorian · Dapper Street','15 Calistril, 4717. The company carries out the stranger’s order.\nBy ten, people have stopped outside Wilfordshire Tailors to look at the window.',()=>{
     quest.egorianTailorOrdersCarriedOut=true;
     setScene(street,328,344);
    });
    break;
   case 'egorianSeeTailorAftermath':
    await say('Chronicle','The tailor returns from brunch. The crowd parts for her. Up close, she recognizes her husband and their three children in the display. All four are dead.');
    await say('Chronicle','Egorian comes to call it the Dapper Street Murders. No suspect is named.');
    quest.egorianTailorAftermathSeen=true;
    break;
   case 'egorianDepartForRemesiana':
    quest.remesianaReturned=true;
    await travel(harbor,520,280);
    break;
   case 'remesianaFindContact':
    await say('reese','Florio Cento. That’s who the man at the fountain told us to find.');
    quest.remesianaFlorioLead=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function drawWater(g,t){
  if(scene!==fountain||reduce.matches)return;
  g.save();
  g.fillStyle='#b9d2d9';
  for(let i=0;i<8;i++){
   const age=(t*.75+i/8)%1;
   const side=i%2?1:-1;
   g.globalAlpha=Math.sin(age*Math.PI)*.38;
   g.fillRect(Math.round(320+side*(7+age*19)),Math.round(145+age*14+i%3*3),2+i%2,1);
  }
  g.restore();
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact,drawWater};
})();
