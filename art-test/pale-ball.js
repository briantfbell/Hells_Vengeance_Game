"use strict";

window.PaleBall=(()=>{
 const salon='egorian_feud_salon',yard='egorian_pale_graveyard',kind='pale_vokadus_duel';
 const map='pale-graveyard-v1.png',royals='pale-royals-v1.png',armor='pale-vokadus-v1.png',cabin='pale-cabin-v1.png';
 const queen='abrogail',attendant='pale_white_attendant',vokadus='vokadus';
 const model={
  src:armor,frames:[
   {x:2,y:37,w:573,h:684,anchorX:318,anchorY:721},
   {x:708,y:1,w:736,h:720,anchorX:1156,anchorY:721},
   {x:1574,y:36,w:585,h:685,anchorX:1914,anchorY:721}
  ],maxHeight:720,cycle:[0,2],attackFrames:true
 };
 let illusionEpoch=-1,armorFlash=null;

 function install(){
  scenes[salon].points.push({id:'paleLeaveSalon',x:328,y:344,label:'Attend the Night of the Pale'});
  scenes[yard]={
   name:'Egorian · Night of the Pale',image:map,spawn:[328,344],blocks:[],
   walk:[{x:144,y:144,w:352,h:176},{x:288,y:320,w:64,h:80}],lights:[[144,165],[237,118],[405,118],[499,165],[247,333],[393,333]],
   points:[
    {id:'paleMeetGuests',x:232,y:256,label:'Join the invited guests'},
    {id:'paleMysterio',speaker:'draymus',x:328,y:184,label:'Watch the Great Mysterio'},
    {id:'paleMeetQueen',speaker:queen,x:440,y:208,label:'Meet Queen Abrogail II'},
    {id:'paleChallenge',speaker:vokadus,x:328,y:304,label:'Hear Vokadus Fex’s challenge'},
    {id:'paleSummonArmor',x:328,y:272,label:'Summon Freya’s Hellknight plate'},
    {id:'paleDuel',speaker:vokadus,x:328,y:272,label:'Duel Vokadus Fex'},
    {id:'paleAftermath',speaker:'jamal',x:328,y:272,label:'See what J’Mal is doing'},
    {id:'paleClose',x:328,y:344,label:'Leave the Night of the Pale'}
   ]
  };
  MAP_LAYERS[yard]={foreground:map,contain:true,background:{type:'solid',color:'#121522'}};
  JOURNEYS[yard]='8 Pharast, 4717. Egorian’s nobles gather in a graveyard for the Night of the Pale. Freya and Jason have invitations, and Draymus is on the bill.';
  NAMES[queen]='Queen Abrogail II';
  NAMES[attendant]='Man in White';
  NAMES[vokadus]='Hellknight Vokadus Fex';
  FUTURE_NPCS[queen]={source:royals,frame:{x:170,y:15,w:504,h:995}};
  DIALOGUE_FACE_CROPS[queen]={x:363,y:36,w:178,h:178};
  FUTURE_NPCS[attendant]={source:royals,frame:{x:946,y:21,w:303,h:994}};
  FUTURE_NPCS[vokadus]={source:armor,frame:model.frames[0]};
  DIALOGUE_FACE_CROPS[vokadus]={x:237,y:36,w:185,h:185};
  COMBAT_IDLES[vokadus]=model;
  STATS[vokadus]={hp:25,ac:15,atk:6,dmg:[1,8,2]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[yard]=await loader(map);})(),
   ...[royals,armor,cabin].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===yard?art[scene]:null;}
 function roster(){return scene===yard?['freya']:null;}
 function points(){
  if(!quest.nicoloRescueComplete)return null;
  if(scene===salon)return quest.paleBallComplete?[]:[point('paleLeaveSalon')];
  if(scene!==yard)return null;
  if(!quest.paleGuestsMet)return [point('paleMeetGuests')];
  if(!quest.paleShowSeen)return [point('paleMysterio')];
  if(!quest.paleQueenMet)return [point('paleMeetQueen')];
  if(!quest.paleChallenged)return [point('paleChallenge')];
  if(!quest.paleArmorSummoned)return [point('paleSummonArmor')];
  if(!quest.paleDuelWon)return [point('paleDuel')];
  return [point(quest.paleLootSeen?'paleClose':'paleAftermath')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===salon&&quest.paleBallComplete?'The Night of the Pale has ended.':null);
 }
 function npcs(){
  if(scene!==yard)return null;
  const actors=[
   {id:'jason',x:198,y:234,dir:'right'},{id:'bruce',x:161,y:251,dir:'right'},
   {id:'draymus',x:329,y:140,dir:'down'},
   {id:'jamal',x:quest.paleDuelWon?359:210,y:quest.paleDuelWon?270:262,dir:quest.paleDuelWon?'left':'right'}
  ];
  if(quest.paleShowSeen)actors.push({id:queen,x:440,y:184,height:58},{id:attendant,x:475,y:185,height:62});
  if(quest.paleQueenMet)actors.push({id:vokadus,x:328,y:quest.paleChallenged?248:323,height:67,pose:quest.paleDuelWon?'prone':null});
  for(let i=0;i<12;i++){
   const left=i<6;
   actors.push({id:'citizen-pale-'+i,x:left?155+(i%3)*28:429+(i%3)*28,
    y:i%6<3?200:286,dir:quest.paleDuelWon?(left?'right':'left'):'up',variant:i%8});
  }
  return actors;
 }
 function effects(g,t){
  if(scene!==yard)return;
  if(illusionEpoch===epoch&&art[cabin]){
   const im=art[cabin],width=138,height=Math.round(width*im.height/im.width);
   g.save();
   g.imageSmoothingEnabled=false;
   g.globalAlpha=reduce.matches ? .88 : .82+.11*Math.sin(t*4);
   g.drawImage(im,328-width/2,124-height,width,height);
   g.restore();
  }
  if(!reduce.matches&&armorFlash?.token===epoch){
   const progress=(performance.now()-armorFlash.start)/520;
   if(progress<1){
    g.save();
    g.globalAlpha=(1-progress)*.8;
    g.fillStyle='#f8d29a';
    for(let i=0;i<12;i++){
     const angle=i*Math.PI/6,radius=37*(1-progress);
     g.fillRect(armorFlash.x+Math.cos(angle)*radius,armorFlash.y-26+Math.sin(angle)*radius,3,3);
    }
    g.restore();
   }
  }
 }
 function armFreya(){
  inventory=Inventory.equip(inventory,quest,'freya','freya');
  applyProgression();
 }
 function beginFight(){
  armFreya();
  const {x,y,dir}=units[0],max=STATS[vokadus].hp;
  save();
  startBattle(0,false,{kind,enemies:[{id:vokadus,name:NAMES[vokadus],shortName:'Vokadus',hp:max,max}],returnPosition:[x,y,dir]});
 }
 async function afterBattle(position){
  quest.paleDuelWon=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle','Freya brings Vokadus down. He lies dying as the guests gather around the table.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'paleLeaveSalon':
    quest.paleBallReached=true;
    SouthRoad.recover(1);
    mendUses=0;
    await travel(yard,328,344);
    break;
   case 'paleMeetGuests':
    await say('Chronicle','Freya and Jason show their invitations. Bruce and J’Mal come as their guests. Draymus has a place on the program as the Great Mysterio.');
    await say('jamal','A graveyard, good wine, and somebody else paying. I approve.');
    quest.paleGuestsMet=true;
    break;
   case 'paleMysterio':
    await say('draymus','Ladies and gentlemen, the Great Mysterio presents the Illusory Cabin of Personal Doom!');
    illusionEpoch=epoch;
    GameAudio.effect('spell');
    try{
     await say('Chronicle','A crooked cabin shimmers into being on the stage. The guests crowd closer, and the illusion draws a round of applause.');
    }finally{illusionEpoch=-1;}
    quest.paleShowSeen=true;
    break;
   case 'paleMeetQueen':
    await say('Chronicle','Queen Abrogail II arrives with a severe-looking man dressed in white. The company is presented to her.');
    await say(queen,'Enjoy the evening.');
    quest.paleQueenMet=true;
    break;
   case 'paleChallenge':
    await say('Chronicle','A carriage stops outside the gates. A heavily armored Hellknight comes straight to Freya’s table.');
    await say(vokadus,'Vokadus Fex. Darellus was my cousin and your liege lord. I’m here to answer his death.');
    await say('Chronicle','Vokadus turns to the Queen. She nods, and he draws his heavy mace.');
    quest.paleChallenged=true;
    break;
   case 'paleSummonArmor':
    await say('freya','Very well.', ['[Draw her sword and summon the plate]']);
    quest.paleArmorSummoned=true;
    armFreya();
    armorFlash={token:epoch,start:performance.now(),x:units[0].x,y:units[0].y};
    GameAudio.effect('spell');
    await say('Chronicle','Freya’s Hellknight plate appears around her, summoned from across the city.');
    break;
   case 'paleDuel':
    beginFight();
    return true;
   case 'paleAftermath':
    await say('Chronicle','J’Mal has had too much wine. He pounces on the fallen Hellknight and starts rifling his pockets. A gasp runs through the guests.');
    await say(queen,'Goblins Be Lootin!');
    await say('Chronicle','The guests laugh. Vokadus does not rise again.');
    quest.paleLootSeen=true;
    break;
   case 'paleClose':
    await journeyCard('The Night of the Pale ends','The party winds down and the guests leave the graveyard. Vokadus Fex is dead.',()=>{
     quest.paleBallComplete=true;
     setScene(salon,328,344);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,afterBattle,interact};
})();
