"use strict";

window.SenaraWagon=(()=>{
 const camp='whisperwood_night_camp',road='senara_prison_road',quay='senara_patrolled_quay';
 const archon='senara_hound_archon',orn='orn',paladin='fastness_paladin',kind='senara_wagon_escort';
 const roadArt='senara-prison-road-v1.png',archonArt='senara-hound-archon-v1.png',ornArt='senara-orn-v1.png';
 const openRoad='senara-prison-road-open-v1.png';
 const wagonPoint={x:544,y:144};
 const wagonStep={x:544,y:176};
 const command={label:'CAST',name:'Dismissal',description:'Jason attempts to send the hound archon back to its plane.',title:'The prison escort'};
 function install(){
  scenes[camp].points.push({id:'senaraWagonRoad',x:328,y:152,label:'Return to Senara'});
  scenes[road]={
   name:'Senara · The Main Road',image:roadArt,spawn:[328,344],blocks:[],lights:[],
   walk:[{x:240,y:144,w:176,h:176},{x:400,y:144,w:176,h:64},{x:208,y:304,w:224,h:96}],
   points:[
    {id:'senaraWagonStop',x:328,y:216,label:'Answer the prison escort'},
    {id:'senaraWagonFight',x:328,y:208,label:'Defend the company’s carriage'},
    {id:'senaraWagonFree',...wagonPoint,label:'Open the prison wagon'},
    {id:'senaraOrnRecruit',speaker:orn,...wagonStep,label:'Speak to the freed prisoner'},
    {id:'senaraWagonQuay',x:328,y:152,label:'Continue to Senara'}
   ]
  };
  scenes[quay]={...scenes.senara_waterfront,name:'Senara · The Patrolled Quay',points:[
   {id:'senaraMorePatrols',x:360,y:168,label:'Watch the Reclamation patrols'}
  ]};
  MAP_LAYERS[road]={foreground:roadArt,contain:true,background:{type:'solid',color:'#161e1d'}};
  MAP_LAYERS[quay]=MAP_LAYERS.senara_waterfront;
  JOURNEYS[road]='The company heads back to Senara with four unicorn horns. A Glorious Reclamation prison wagon blocks the main road and its escort demands to inspect their carriage.';
  JOURNEYS[quay]='The company brings Orn back to Senara. There are more Reclamation guards out than when the company left. Watch where they go before approaching the Black Daggers.';
  NAMES[archon]='Hound Archon';
  NAMES[orn]='Orn';
  STATS[archon]={hp:39,ac:17,atk:6,dmg:[1,10,2]};
  FUTURE_NPCS[archon]={source:archonArt,frame:{x:73,y:0,w:994,h:1370}};
  FUTURE_NPCS[orn]={source:ornArt,frame:{x:203,y:10,w:663,h:1521}};
  DIALOGUE_FACE_CROPS[archon]={x:364,y:76,w:324,h:324};
  DIALOGUE_FACE_CROPS[orn]={x:354,y:10,w:261,h:261};
 }
 async function load(loader){
  art[quay]=art.senara_waterfront;
  await Promise.all([
   (async()=>{art[road]=await loader(roadArt);})(),
   ...[archonArt,ornArt,openRoad].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){return scene===road||scene===quay?art[scene]:null;}
 function points(){
  if(!quest.whisperwoodGladeComplete)return null;
  if(scene===camp)return [point('senaraWagonRoad')];
  if(scene===road){
   if(!quest.senaraWagonChallenged)return [point('senaraWagonStop')];
   if(!quest.senaraEscortDefeated)return [point('senaraWagonFight')];
   if(!quest.senaraPrisonerFreed)return [point('senaraWagonFree')];
   if(!quest.senaraOrnRecruited)return [point('senaraOrnRecruit')];
   return [point('senaraWagonQuay')];
  }
  if(scene===quay)return quest.senaraReturnPatrolsSeen?[]:[point('senaraMorePatrols')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===quay&&quest.senaraReturnPatrolsSeen?'Find the Black Daggers beneath Senara.':null);}
 function npcs(){
  if(scene===road){
   if(quest.senaraPrisonerFreed)return [{id:orn,...wagonStep,height:52}];
   if(quest.senaraEscortDefeated)return [];
   return [
    {id:archon,x:328,y:176,height:65},
    {id:paladin,x:248,y:168,height:53},{id:paladin,x:392,y:192,height:53},{id:paladin,x:408,y:144,height:53}
   ];
  }
  if(scene===quay)return [
   {id:paladin,x:304,y:136},{id:paladin,x:432,y:136},{id:paladin,x:528,y:152},
   {id:paladin,x:568,y:128},{id:orn,x:392,y:248,height:52}
  ];
  return null;
 }

 function enemy(id,name,shortName){
  const max=STATS[id].hp;
  return {id,name,shortName,hp:max,max};
 }
 function startEscort(){
  const {x,y,dir}=units[0];
  save();
  startBattle(0,false,{
   kind,scripted:true,scriptActor:'jason',returnPosition:[x,y,dir],
   script:{command:()=>command,act:dismiss,opening:'The hound archon stands between the company and the prison wagon.'},
   enemies:[enemy(archon,NAMES[archon]),...Array.from({length:3},(_,i)=>enemy(paladin,'Escort Paladin '+(i+1),'Paladin '+(i+1)))]
  });
 }
 async function dismiss(action,actor){
  if(action!=='special')return;
  const current=battle,target=current.enemies[0];
  current.busy=true;
  paintBattle();
  await animateAction(actor,target,'dismissal');
  await storyRoll('Dismissal · Destination',5,0,'Spell misfires · Abaddon');
  if(battle!==current)return;
  $('dice-panel').hidden=true;
  current.enemies.shift();
  current.target=0;
  current.scripted=false;
  current.script=null;
  current.scriptActor=null;
  current.control=null;
  log('Jason casts Dismissal\nThe hound archon vanishes into Abaddon.');
  planEnemyRound();
  current.pendingInit=true;
  beginInitiative();
 }
 async function afterBattle(position){
  quest.senaraEscortDefeated=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  await say('Chronicle','The escort’s paladins fall. The road is clear, but someone is still inside the barred wagon.');
 }

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'senaraWagonRoad':
    quest.senaraWagonReached=true;
    await travel(road,328,344);
    break;
   case 'senaraWagonStop':
    await say(paladin,'Reclamation business. Halt your carriage. We’re checking for contraband.');
    await say('freya','I see what you do with people who give you trouble. Is that one of them in the wagon?');
    await say(paladin,'Step down and open your doors. Now.');
    await say('jason','That’s a hound archon with them. Give me room to cast.');
    quest.senaraWagonChallenged=true;
    break;
   case 'senaraWagonFight':
    startEscort();
    return true;
   case 'senaraWagonFree':
    await say('guapo','Paladins or no, they have to keep their keys somewhere. Here we go.');
    await say(null,'The barred door is locked.', ['[Unlock the wagon]']);
    quest.senaraPrisonerFreed=true;
    save();
    updateObjective();
    await say('Chronicle','The door swings open. A prisoner steps down into the road.');
    break;
   case 'senaraOrnRecruit':
    await say(orn,'Orn. I’m a magus, from Nidal. You have my thanks for opening that door.');
    await say('freya','We’re going to Senara. We could use a magus who already knows what the Reclamation does with its prisoners.');
    quest.senaraOrnRecruited=true;
    save();
    updateObjective();
    await say(orn,'I’ll come with you. Lead on.');
    break;
   case 'senaraWagonQuay':
    quest.senaraWagonReturned=true;
    await travel(quay,360,344);
    break;
   case 'senaraMorePatrols':
    await say('reese','There’s another patrol coming down to the river. There weren’t this many when we left.');
    await say('freya','Then stay off the main streets. The Black Daggers owe us a report. We’ll go to them below ground.');
    quest.senaraReturnPatrolsSeen=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }

 function effects(g){
  if(scene!==road||!quest.senaraPrisonerFreed)return;
  g.save();
  g.beginPath();
  g.rect(512,56,82,96);
  g.clip();
  SceneLayers.foreground(g,art[openRoad],{contain:true});
  g.restore();
 }
 function effect(g,a){
  if(a.type!=='dismissal')return false;
  const p=CombatArt.phase(a),{x,y,height}=battlePosition(a.target);
  g.save();
  g.globalAlpha=Math.sin(p*Math.PI)*.9;
  for(let i=0;i<20;i++){
   const angle=i*Math.PI/10+p*5,r=(22+i%4*6)*(1-p*.45);
   g.fillStyle=i%3?'#a18bd6':'#e6d9ff';
   g.fillRect(Math.round(x+Math.cos(angle)*r),Math.round(y-height*.55+Math.sin(angle)*r*1.6),3,3);
  }
  g.restore();
  return true;
 }

 return {install,load,mapImage,points,target,goal,npcs,interact,afterBattle,effects,effect};
})();
