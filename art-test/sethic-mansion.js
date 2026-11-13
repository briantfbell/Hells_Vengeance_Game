"use strict";

window.SethicMansion=(()=>{
 const barn='egorian_bellflower_barn',hall='egorian_sethic_mansion',cellar='egorian_sethic_cellar';
 const manor='sethic-mansion-v1.png',basement='sethic-cellar-v1.png',sheet='sethic-trickster-v1.png';
 const guard='egorian_bodyguard',sethic='sethic';
 const guardFight='sethic_mansion_guards',bossFight='sethic_mansion_duel';
 const model={src:sheet,frames:[
  {x:119,y:5,w:332,h:710,anchorX:280,anchorY:713},
  {x:715,y:65,w:673,h:650,anchorX:1040,anchorY:713},
  {x:1577,y:5,w:449,h:710,anchorX:1800,anchorY:713}
 ],maxHeight:710,cycle:[0,2],attackFrames:true};

 function install(){
  scenes[barn].points.push({id:'sethicMansionOrders',x:328,y:392,label:'Answer the Crown’s summons'});
  scenes[hall]={
   name:'Egorian · Sethic’s Mansion',image:manor,spawn:[328,344],blocks:[],
   walk:[{x:80,y:128,w:480,h:192},{x:272,y:320,w:96,h:80}],lights:[[107,59],[258,52],[382,52],[533,59],[42,211],[601,211],[255,348],[388,348]],
   points:[
    {id:'sethicMansionGuards',x:328,y:248,label:'Secure the mansion guards'},
    {id:'sethicMansionCellar',x:568,y:192,label:'Descend into the cellar'},
    {id:'sethicMansionDuel',speaker:sethic,x:328,y:179,label:'Confront Paracount Sethic'},
    {id:'sethicMansionBind',x:328,y:179,label:'Stabilize and restrain Sethic'},
    {id:'sethicMansionPack',x:328,y:312,label:'Prepare Sethic for transport'}
   ]
  };
  scenes[cellar]={
   name:'Sethic’s Mansion · Cellar',image:basement,spawn:[328,344],blocks:[],
   walk:[{x:48,y:160,w:544,h:160},{x:128,y:320,w:400,h:32},{x:288,y:352,w:64,h:48}],lights:[[108,51],[320,53],[537,51]],
   points:[
    {id:'sethicMansionFindBob',speaker:'bob',x:552,y:152,label:'Free Bob Applewood'},
    {id:'sethicMansionWait',x:328,y:392,label:'Get Bob to safety and wait for Sethic'}
   ]
  };
  MAP_LAYERS[hall]={foreground:manor,contain:true,background:{type:'solid',color:'#19161d'}};
  MAP_LAYERS[cellar]={foreground:basement,contain:true,background:{type:'solid',color:'#17171a'}};
  JOURNEYS[hall]='24 Pharast, 4717. The company has chosen Paracount Thalgano Sethic for the Crown’s sacrifice. Secure his mansion and take him alive.';
  JOURNEYS[cellar]='With the guards secured, the company searches the cellar.';
  COMBAT_IDLES[sethic]=model;
  STATS[sethic]={hp:48,ac:15,atk:8,dmg:[2,6,2]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[hall]=await loader(manor);})(),
   (async()=>{art[cellar]=await loader(basement);})(),
   (async()=>{art[sheet]=await loader(sheet);})()
  ]);
 }
 function mapImage(){return scene===hall||scene===cellar?art[scene]:null;}
 function roster(){
  if(scene!==hall&&scene!==cellar)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===barn&&quest.bellflowerBarnComplete)return [point('sethicMansionOrders')];
  if(scene===cellar)return [point(quest.sethicMansionBobFreed?'sethicMansionWait':'sethicMansionFindBob')];
  if(scene!==hall)return null;
  if(quest.sethicMansionComplete)return [];
  const id=!quest.sethicMansionGuardsDown?'sethicMansionGuards':!quest.sethicMansionWaited?'sethicMansionCellar':
   !quest.sethicMansionSethicDown?'sethicMansionDuel':!quest.sethicMansionBound?'sethicMansionBind':'sethicMansionPack';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===hall&&quest.sethicMansionComplete?'Sethic is alive and in custody. Bob has been freed.':null);}
 function npcs(){
  if(scene===cellar)return quest.sethicMansionBobFreed?[]:[{id:'bob',x:568,y:152,height:45,pose:'prone'}];
  if(scene!==hall)return null;
  if(!quest.sethicMansionGuardsDown)return [256,400].map(x=>({id:guard,x,y:203,height:58}));
  if(quest.sethicMansionWaited)return [{id:sethic,x:328,y:179,height:59,pose:quest.sethicMansionSethicDown?'prone':null}];
  return [];
 }
 function beginFight(kind){
  const {x,y,dir}=units[0],boss=kind===bossFight,id=boss?sethic:guard,max=STATS[id].hp;
  const names=boss?['Paracount Sethic']:['Manor Guard 1','Manor Guard 2'];
  const enemies=names.map(name=>({id,name,shortName:boss?'Sethic':name,hp:max,max,resolve:boss}));
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir],opening:boss?'Break Sethic’s resolve to subdue him alive.':undefined});
 }
 function isMansionBattle(kind){return kind===guardFight||kind===bossFight;}
 async function afterBattle(kind,position){
  const boss=kind===bossFight;
  if(boss)quest.sethicMansionSethicDown=true;
  else quest.sethicMansionGuardsDown=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle',boss?'Sethic falls, alive but unable to continue.':'The company secures the guards. The door down to the cellar is clear.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'sethicMansionOrders':
    await journeyCard('Egorian · A choice from the Crown','The Queen grants the company the right to choose one of her friends as a sacrifice to Asmodeus. They must follow Abrogail I’s pilgrimage through the fourteen stones of the Barrowood.');
    await say('freya','We choose Sethic. He’s gone to ground at his mansion. We need him alive.');
    quest.sethicMansionReached=true;
    await travel(hall,328,344);
    break;
   case 'sethicMansionGuards':
    beginFight(guardFight);
    return true;
   case 'sethicMansionCellar':
    quest.sethicMansionCellarEntered=true;
    await travel(cellar,328,344);
    break;
   case 'sethicMansionFindBob':
    await say('jamal','That’s Bob. Get these chains off him.');
    await say('jason','He’s alive. Bob? Can you hear me?');
    await say('Chronicle','Bob Applewood does not respond. Sethic abducted him and has been torturing him here for days.');
    quest.sethicMansionBobFreed=true;
    break;
   case 'sethicMansionWait':
    await say('Chronicle','The company carries Bob up the stairs. With Bob clear of the cellar, they wait for Sethic to return.');
    await journeyCard('Sethic’s Mansion · The paracount returns','Sethic enters the hall. Freya and Reese take positions on either side of his route back to the door.',()=>{
     quest.sethicMansionWaited=true;
     setScene(hall,328,296);
    });
    break;
   case 'sethicMansionDuel':
    await say(sethic,'You should have left when you had the chance.');
    beginFight(bossFight);
    return true;
   case 'sethicMansionBind':
    if(hp.jason===0||hp.draymus===0){
     await say('Chronicle','The company pulls its wounded clear and gives Jason and Draymus a moment to recover.');
     hp.jason=Math.max(1,hp.jason);
     hp.draymus=Math.max(1,hp.draymus);
    }
    await say('jason','He’s stable. Keep him still.');
    await say('Chronicle','Draymus casts Feeblemind on Sethic, leaving him unable to use his magic.');
    quest.sethicMansionBound=true;
    break;
   case 'sethicMansionPack':
    await say('jamal','The straps will hold. He can ride in the pack all the way to the Barrowood.');
    await say('freya','We still need to see to Bob.');
    quest.sethicMansionComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,isMansionBattle,afterBattle,interact};
})();
