"use strict";

window.SethicFarm=(()=>{
 const salon='egorian_feud_salon',farm='sethic_devil_hog_farm',hog='devil_hog',fight='sethic_hogs';
 const map='sethic-farm-v1.png',ruins='sethic-farm-ruins-v1.png',sprite='sethic-devil-hog-v1.png';
 const model={
  src:sprite,frames:[
   {x:39,y:120,w:643,h:477,anchorX:365,anchorY:597},
   {x:732,y:108,w:706,h:480,anchorX:1090,anchorY:588},
   {x:1504,y:96,w:654,h:489,anchorX:1830,anchorY:585}
  ],maxHeight:489,cycle:[0,2],attackFrames:true
 };
 function install(){
  scenes[salon].points.push({id:'farmLeaveSalon',x:328,y:344,label:'Go to Sethic’s devil-hog farm'});
  scenes[farm]={
   name:'Sethic’s Devil-Hog Farm',image:map,spawn:[328,344],blocks:[],
   walk:[{x:96,y:160,w:448,h:192},{x:288,y:352,w:80,h:48}],lights:[[105,68],[279,102],[374,102],[536,69]],
   points:[
    {id:'farmSurveyPens',x:328,y:264,label:'Survey the pens'},
    {id:'farmHogsFight',x:328,y:224,label:'Drive back the devil-hogs'},
    {id:'farmDestroy',x:328,y:168,label:'Destroy the feed barn and pens'},
    {id:'farmLeaveRuins',x:328,y:344,label:'Leave Sethic’s ruined farm'}
   ]
  };
  MAP_LAYERS[farm]={foreground:map,contain:true,background:{type:'solid',color:'#1b211e'}};
  JOURNEYS[farm]='Vasvion’s allies move against Sethic’s businesses. The company heads to his devil-hog farm outside Egorian.';
  STATS[hog]={hp:15,ac:13,atk:5,dmg:[1,6,1]};
  NAMES[hog]='Devil-Hog';
  FUTURE_NPCS[hog]={source:sprite,frame:model.frames[0]};
  COMBAT_IDLES[hog]=model;
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[farm]=await loader(map);})(),
   ...[ruins,sprite].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===farm?(quest.sethicFarmDestroyed?art[ruins]:art[farm]):null;}
 function points(){
  if(!quest.egorianVasvionChosen)return null;
  if(scene===salon)return quest.sethicFarmComplete?[]:[point('farmLeaveSalon')];
  if(scene!==farm)return null;
  if(!quest.sethicFarmSurveyed)return [point('farmSurveyPens')];
  if(!quest.sethicHogsDriven)return [point('farmHogsFight')];
  return [point(quest.sethicFarmDestroyed?'farmLeaveRuins':'farmDestroy')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===salon&&quest.sethicFarmComplete?'Sethic’s devil-hog farm is out of operation.':null);
 }
 function npcs(){
  if(scene!==farm)return null;
  if(!quest.sethicFarmSurveyed||quest.sethicHogsDriven)return [];
  return [[240,206],[328,190],[416,206]].map(([x,y])=>({id:hog,x,y,height:36}));
 }
 function effects(g,t){
  if(scene!==farm||!quest.sethicFarmDestroyed||reduce.matches)return;
  g.save();
  for(let i=0;i<12;i++){
   const drift=Math.floor(t*(8+i%3)+i*19)%60,x=265+i*11+Math.floor(drift/6),y=133-drift;
   g.globalAlpha=.31*(1-drift/60);
   g.fillStyle=i%3?'#81808c':'#e48945';
   g.fillRect(x,y,3+i%4,2+i%3);
  }
  g.restore();
 }
 function beginFight(){
  const {x,y,dir}=units[0];
  const max=STATS[hog].hp;
  const enemies=[1,2,3].map(i=>({id:hog,name:'Devil-Hog '+i,shortName:'Hog '+i,hp:max,max}));
  save();
  startBattle(0,false,{kind:fight,enemies,returnPosition:[x,y,dir]});
 }
 async function afterBattle(position){
  quest.sethicHogsDriven=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle','The devil-hogs scatter away from the yard. The barn and pens are clear.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'farmLeaveSalon':
    quest.sethicFarmReached=true;
    await travel(farm,328,344);
    break;
   case 'farmSurveyPens':
    await say('Chronicle','Sethic keeps his devil-hogs beside the main feed barn. The company approaches the pens, and the herd surges against the rails.');
    await say('freya','Clear the yard first. Then we take out the barn and the pens.');
    quest.sethicFarmSurveyed=true;
    break;
   case 'farmHogsFight':
    beginFight();
    return true;
   case 'farmDestroy':
    await say('Chronicle','The company brings down the rails and sets the feed barn alight. Sethic’s devil-hog farm is finished.');
    quest.sethicFarmDestroyed=true;
    GameAudio.effect('fire');
    break;
   case 'farmLeaveRuins':
    await journeyCard('Back in Egorian','The ruined farm is one less source of income for Sethic. The company returns to Egorian.',()=>{
     quest.sethicFarmComplete=true;
     setScene(salon,328,344);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,effects,interact,afterBattle};
})();
