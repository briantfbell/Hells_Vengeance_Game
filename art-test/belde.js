"use strict";

window.Belde=(()=>{
 const salon='egorian_feud_salon',square='belde_square',kind='belde_watch';
 const image='belde-square-v1.png',liberated='belde-square-liberated-v1.png',portrait='belde-yunero-v1.png',mage='yunero',guard='kantaria_guard';
 const rounds={
  beldeQuestionOne:{
   question:'Which empire did Cheliax once belong to as its westernmost province?',
   choices:['Nidal','Taldor','Galt'],answer:1,flag:'beldeTriviaFirst',
   correction:'Think of the empire whose armies explored southern Avistan.'
  },
  beldeQuestionTwo:{
   question:'Which house did Thrune defeat in the Battle of a Hundred Kings?',
   choices:['House Davian','House Narikopolus','House Sethic'],answer:0,flag:'beldeTriviaSecond',
   correction:'The records of the civil war name another house.'
  },
  beldeQuestionThree:{
   question:'Where did Thrune move the capital after the Chelish Civil War?',
   choices:['Westcrown','Remesiana','Egorian'],answer:2,flag:'beldeTriviaWon',
   correction:'Think of where the Queen holds court today.'
  }
 };

 function install(){
  scenes[salon].points.push({id:'beldeLeaveEgorian',x:328,y:392,label:'Travel down the coast to Belde'});
  scenes[square]={
   name:'Belde · The Town Square',image,spawn:[328,344],blocks:[],
   walk:[{x:96,y:176,w:480,h:144},{x:240,y:144,w:176,h:32},{x:288,y:320,w:64,h:80}],
   lights:[[291,83],[368,83],[489,128],[580,130]],
   points:[
    {id:'beldeSurveyWatch',x:328,y:264,label:'Survey the Reclamation watch'},
    {id:'beldeFightWatch',x:328,y:216,label:'Drive the Reclamation out of Belde'},
    {id:'beldeMeetYunero',speaker:mage,x:520,y:181,label:'Meet Yunero'},
    {id:'beldeQuestionOne',speaker:mage,x:520,y:181,label:'Answer the first trivia question'},
    {id:'beldeQuestionTwo',speaker:mage,x:520,y:181,label:'Answer the second trivia question'},
    {id:'beldeQuestionThree',speaker:mage,x:520,y:181,label:'Answer the final trivia question'},
    {id:'beldeHearResult',speaker:mage,x:520,y:181,label:'Hear Yunero’s concession'}
   ]
  };
  MAP_LAYERS[square]={foreground:image,contain:true,background:{type:'solid',color:'#1a2229'}};
  JOURNEYS[square]='11 Pharast, 4717. The company takes a break from Egorian and stops in Belde, where the Glorious Reclamation still holds the town.';
  NAMES[mage]='Yunero';
  FUTURE_NPCS[mage]={source:portrait,frame:{x:147,y:0,w:711,h:1536}};
  DIALOGUE_FACE_CROPS[mage]={x:342,y:2,w:270,h:270};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[square]=await loader(image);})(),
   (async()=>{art[liberated]=await loader(liberated);})(),
   (async()=>{art[portrait]=await loader(portrait);})()
  ]);
 }
 function mapImage(){return scene===square?art[quest.beldeLiberated?liberated:square]:null;}
 function points(){
  if(!quest.paleBallComplete)return null;
  if(scene===salon)return [point('beldeLeaveEgorian')];
  if(scene!==square)return null;
  if(quest.beldeComplete)return [];
  if(!quest.beldeWatchSeen)return [point('beldeSurveyWatch')];
  if(!quest.beldeLiberated)return [point('beldeFightWatch')];
  if(!quest.beldeTriviaStarted)return [point('beldeMeetYunero')];
  const next=Object.entries(rounds).find(([,round])=>!quest[round.flag]);
  return [point(next?.[0]||'beldeHearResult')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===square&&quest.beldeTriviaStarted&&!quest.beldeTriviaWon){
   const correct=Object.values(rounds).filter(round=>quest[round.flag]).length;
   return 'Chelaxian Noble Trivia ['+correct+'/3]';
  }
  return target()?.label||(scene===square&&quest.beldeComplete?'Belde is free of the Reclamation. Freya won the contest.':null);
 }
 function npcs(){
  if(scene!==square)return null;
  if(!quest.beldeLiberated)return [240,328,416].map(x=>({id:guard,x,y:186,height:54}));
  return [
   {id:mage,x:520,y:181,height:69},
   {id:'citizen-belde-1',x:137,y:247,dir:'right',variant:4},
   {id:'citizen-belde-2',x:249,y:195,dir:'down',variant:7},
   {id:'citizen-belde-3',x:533,y:272,dir:'left',variant:2}
  ];
 }
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[guard].hp;
  const enemies=[1,2,3].map(i=>({id:guard,name:'Reclamation Guard '+i,shortName:'Guard '+i,hp:max,max}));
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
 }
 async function afterBattle(position){
  quest.beldeLiberated=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle','The Reclamation loses its hold on Belde. As the fighting ends, an ogre mage comes out to meet the company.');
 }
 async function ask(round){
  const choice=await say(mage,round.question,round.choices);
  if(choice===round.answer){
   await say(mage,'Correct.');
   quest[round.flag]=true;
  }else await say(mage,round.correction+' Try again.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  if(Object.hasOwn(rounds,id))await ask(rounds[id]);
  else switch(id){
   case 'beldeLeaveEgorian':
    quest.beldeReached=true;
    await travel(square,328,344);
    break;
   case 'beldeSurveyWatch':
    await say('Chronicle','Reclamation guards hold the approach through Belde’s square.');
    await say('freya','Clear the watch. The people here have had enough of their occupation.');
    quest.beldeWatchSeen=true;
    break;
   case 'beldeFightWatch':
    beginFight();
    return true;
   case 'beldeMeetYunero':
    await say(mage,'Yunero. I’ve seen what you can do with a blade. How are you at Chelaxian Noble Trivia?');
    await say('freya','Ask your first question.');
    quest.beldeTriviaStarted=true;
    break;
   case 'beldeHearResult':
    await say(mage,'Three correct. You win, Freya.');
    await say('freya','A better way to spend an afternoon.');
    quest.beldeComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,afterBattle,interact};
})();
